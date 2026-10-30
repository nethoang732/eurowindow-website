const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { createServer } = require('node:http');
const { once } = require('node:events');
const { setTimeout: delay } = require('node:timers/promises');
const { randomUUID } = require('node:crypto');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const leads = new Map();
const rateCounts = new Map();
let emailFails = false;
let databaseFails = false;
let emailCount = 0;
let apiCalls = 0;
const mockSupabaseKey = process.env.SUPABASE_TEST_KEY_MODE === 'legacy'
  ? 'eyJ.mock.legacy-service-role'
  : 'sb_secret_mock-key';

async function readBody(request) {
  let raw = '';
  for await (const chunk of request) raw += chunk;
  return raw ? JSON.parse(raw) : {};
}

function send(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(body));
}

const mockServer = createServer(async (request, response) => {
  try {
    if (request.url.startsWith('/__test/toggle-email')) {
      emailFails = new URL(request.url, 'http://127.0.0.1').searchParams.get('fail') === '1';
      return send(response, 200, { emailFails });
    }
    if (request.url.startsWith('/__test/toggle-database')) {
      databaseFails = new URL(request.url, 'http://127.0.0.1').searchParams.get('fail') === '1';
      return send(response, 200, { databaseFails });
    }
    if (request.url === '/rest/v1/rpc/create_customer_lead' && request.method === 'POST') {
      apiCalls += 1;
      assert.equal(request.headers.apikey, mockSupabaseKey);
      if (mockSupabaseKey.startsWith('sb_secret_')) {
        assert.equal(request.headers.authorization, undefined, 'new secret keys must not be sent as bearer JWTs');
      } else {
        assert.equal(request.headers.authorization, `Bearer ${mockSupabaseKey}`, 'legacy service_role JWTs must be sent as bearer tokens');
      }
      if (databaseFails) return send(response, 500, { message: 'mock database failure' });
      const body = await readBody(request);
      const requestCount = (rateCounts.get(body.p_ip_hash) || 0) + 1;
      rateCounts.set(body.p_ip_hash, requestCount);
      if (requestCount > body.p_max_requests) return send(response, 200, { success: false, code: 'RATE_LIMITED' });
      if (leads.has(body.p_idempotency_key)) {
        const existing = leads.get(body.p_idempotency_key);
        return send(response, 200, { success: true, duplicate: true, ...existing });
      }
      const lead = {
        id: randomUUID(),
        customer_code: `EW-TEST-${leads.size + 1}`,
        notification_status: 'pending',
      };
      leads.set(body.p_idempotency_key, lead);
      return send(response, 200, { success: true, duplicate: false, ...lead });
    }
    if (request.url.startsWith('/rest/v1/customer_leads?') && request.method === 'PATCH') {
      assert.equal(request.headers.apikey, mockSupabaseKey);
      const values = await readBody(request);
      const id = new URL(request.url, 'http://127.0.0.1').searchParams.get('id')?.slice(3);
      for (const lead of leads.values()) if (lead.id === id) Object.assign(lead, values);
      response.writeHead(204);
      return response.end();
    }
    if (request.url.startsWith('/macros/s/test/exec') && request.method === 'POST') {
      const body = await readBody(request);
      assert.equal(body.secret, 'mock-email-secret');
      emailCount += 1;
      return send(response, 200, emailFails ? { success: false, error: 'mock_email_failure' } : { success: true });
    }
    send(response, 404, { error: 'not found' });
  } catch (error) {
    console.error('Mock server assertion failed:', error);
    send(response, 500, { error: 'mock failure' });
  }
});

function reservePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close((error) => error ? reject(error) : resolve(port));
    });
  });
}

async function waitForNext(url, child) {
  for (let attempt = 0; attempt < 90; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`Next.js exited early with code ${child.exitCode}`);
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(1000) });
      if (response.status === 405 || response.status === 400) return;
    } catch {
      // The development server is still compiling or starting.
    }
    await delay(1000);
  }
  throw new Error('Timed out waiting for Next.js development server.');
}

async function postLead(url, payload) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(20000),
  });
  return { status: response.status, body: await response.json() };
}

async function main() {
  await new Promise((resolve, reject) => mockServer.listen(0, '127.0.0.1', (error) => error ? reject(error) : resolve()));
  const mockPort = mockServer.address().port;
  const appPort = await reservePort();
  const appOrigin = `http://127.0.0.1:${appPort}`;
  const mockOrigin = `http://127.0.0.1:${mockPort}`;
  const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', '-p', String(appPort)], {
    cwd: root,
    env: {
      ...process.env,
      NODE_ENV: 'development',
      NEXT_TELEMETRY_DISABLED: '1',
      SUPABASE_URL: mockOrigin,
      SUPABASE_SERVICE_ROLE_KEY: mockSupabaseKey,
      GOOGLE_APPS_SCRIPT_URL: `${mockOrigin}/macros/s/test/exec`,
      GOOGLE_APPS_SCRIPT_SECRET: 'mock-email-secret',
    },
    stdio: 'inherit',
  });

  try {
    await waitForNext(`${appOrigin}/api/contact`, child);
    const endpoint = `${appOrigin}/api/contact`;
    const invalid = await postLead(endpoint, { name: 'A', phone: '123', email: '' });
    assert.equal(invalid.status, 400, 'input validation should reject invalid details');
    assert.equal(apiCalls, 0, 'invalid details must not reach Supabase');

    const payload = {
      name: 'Test Customer',
      phone: '0967111082',
      email: 'test@example.com',
      product: 'Cửa nhôm',
      message: 'Smoke test lead',
      pageUrl: `${appOrigin}/san-pham/cua-nhom/`,
    };
    const saved = await postLead(endpoint, payload);
    assert.equal(saved.status, 200);
    assert.equal(saved.body.success, true);
    assert.equal(saved.body.notificationStatus, 'sent');
    assert.equal(leads.size, 1, 'lead should be persisted once');
    assert.equal(emailCount, 1, 'email should be attempted after persistence');

    const duplicate = await postLead(endpoint, payload);
    assert.equal(duplicate.status, 200);
    assert.equal(duplicate.body.success, true);
    assert.equal(leads.size, 1, 'retry should not create a duplicate');
    assert.equal(emailCount, 1, 'already sent notification should not be repeated');

    await fetch(`${mockOrigin}/__test/toggle-email?fail=1`);
    const emailFailure = await postLead(endpoint, { ...payload, phone: '0967111083', message: 'Email failure test' });
    assert.equal(emailFailure.status, 200, 'email failure must not undo persisted lead');
    assert.equal(emailFailure.body.success, true);
    assert.equal(emailFailure.body.notificationStatus, 'failed');
    assert.equal(leads.size, 2);

    await fetch(`${mockOrigin}/__test/toggle-database?fail=1`);
    const databaseFailure = await postLead(endpoint, { ...payload, phone: '0967111084', message: 'Database failure test' });
    assert.equal(databaseFailure.status, 503, 'API must not claim success when persistence fails');
    assert.equal(databaseFailure.body.success, false);
    assert.equal(leads.size, 2);

    console.log('Contact API smoke test passed: validation, secure service-role call, persistence, duplicate retry, email failure isolation, and database failure response.');
  } finally {
    child.kill();
    mockServer.close();
    await once(mockServer, 'close').catch(() => {});
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
