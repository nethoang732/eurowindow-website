import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 16 * 1024;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const recentRequests = new Map();
const staticAllowedOrigins = new Set(['https://nethoang732.github.io']);

function allowedOrigins() {
  return new Set([
    ...staticAllowedOrigins,
    ...(process.env.CONTACT_ALLOWED_ORIGINS || '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  ]);
}

function corsHeaders(origin) {
  const headers = new Headers({ Vary: 'Origin' });
  if (origin) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');
    headers.set('Access-Control-Max-Age', '600');
  }
  return headers;
}

function jsonResponse(body, status, headers) {
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('Cache-Control', 'no-store');
  return new NextResponse(JSON.stringify(body), { status, headers });
}

function error(status, code, message, headers) {
  return jsonResponse({ success: false, code, message }, status, headers);
}

function clean(value, maxLength = 2000) {
  if (value === undefined || value === null) return '';
  return String(value).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, maxLength);
}

function getField(input, ...names) {
  for (const name of names) {
    if (input[name] !== undefined && input[name] !== null) return input[name];
  }
  return '';
}

function normalizePayload(input, trustedPageOrigins) {
  const rawPage = clean(getField(input, 'pageUrl', 'page_url', 'Trang gửi biểu mẫu'), 2048);
  let pageUrl = '';
  try {
    const parsed = new URL(rawPage);
    if ((parsed.protocol === 'http:' || parsed.protocol === 'https:') && trustedPageOrigins.has(parsed.origin)) {
      pageUrl = `${parsed.origin}${parsed.pathname}`;
    }
  } catch {
    // Older forms may not provide a page URL.
  }

  return {
    name: clean(getField(input, 'name', 'Họ và tên', 'Tên người liên hệ'), 120),
    phone: clean(getField(input, 'phone', 'Số điện thoại'), 32),
    email: clean(getField(input, 'email', 'Email'), 254).toLowerCase(),
    projectAddress: clean(getField(input, 'projectAddress', 'project_address', 'address', 'Địa chỉ công trình'), 300),
    interest: clean(getField(input, 'interest', 'Nhu cầu', 'Bạn đang quan tâm đến', 'Bạn quan tâm sản phẩm nào?'), 200),
    product: clean(getField(input, 'product', 'Sản phẩm'), 200),
    project: clean(getField(input, 'project', 'Loại công trình'), 200),
    installationLocation: clean(getField(input, 'installationLocation', 'Vị trí lắp đặt'), 200),
    message: clean(getField(input, 'message', 'Nội dung yêu cầu', 'Kích thước ô chờ hoặc ghi chú'), 4000),
    website: clean(getField(input, 'website'), 300),
    pageUrl,
  };
}

function fingerprint(payload, now) {
  const stableFields = { ...payload };
  delete stableFields.website;
  stableFields.window = Math.floor(now / RATE_WINDOW_MS);
  return createHash('sha256').update(JSON.stringify(stableFields)).digest('hex');
}

function isValid(payload) {
  const phoneDigits = payload.phone.replace(/\D/g, '');
  const emailValid = !payload.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email);
  return payload.name.length >= 2
    && phoneDigits.length >= 9
    && phoneDigits.length <= 15
    && /^[0-9+() .-]+$/.test(payload.phone)
    && emailValid;
}

function getClientIp(request) {
  // Vercel supplies x-real-ip at the edge; use it before the client-influenced forwarded list.
  const ip = request.headers.get('x-real-ip')
    || request.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim()
    || 'unknown';
  return createHash('sha256').update(ip).digest('hex');
}

function withinLocalRateLimit(ipHash, now) {
  for (const [key, entry] of recentRequests) {
    if (now - entry.startedAt >= RATE_WINDOW_MS) recentRequests.delete(key);
  }
  const entry = recentRequests.get(ipHash);
  if (!entry || now - entry.startedAt >= RATE_WINDOW_MS) {
    recentRequests.set(ipHash, { startedAt: now, count: 1 });
    return true;
  }
  if (entry.count >= MAX_REQUESTS_PER_WINDOW) return false;
  entry.count += 1;
  return true;
}

function supabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  try {
    const parsed = new URL(url);
    const localDevelopment = process.env.NODE_ENV !== 'production'
      && ['localhost', '127.0.0.1'].includes(parsed.hostname);
    if (parsed.protocol !== 'https:' && !localDevelopment) return null;
    if (!parsed.hostname) return null;
    return { url: parsed.origin, serviceRoleKey };
  } catch {
    return null;
  }
}

async function supabaseFetch(config, path, options = {}) {
  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: config.serviceRoleKey,
      // New sb_secret_* API keys are accepted via apikey and are not JWTs.
      // Legacy service_role keys are JWTs and still require Authorization.
      ...(!config.serviceRoleKey.startsWith('sb_secret_')
        ? { Authorization: `Bearer ${config.serviceRoleKey}` }
        : {}),
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
    cache: 'no-store',
    signal: options.signal || AbortSignal.timeout(12000),
  });
  return response;
}

function appsScriptEndpoint() {
  const endpoint = process.env.GOOGLE_APPS_SCRIPT_URL;
  const secret = process.env.GOOGLE_APPS_SCRIPT_SECRET;
  if (!endpoint || !secret) return null;
  try {
    const parsed = new URL(endpoint);
    const localDevelopment = process.env.NODE_ENV !== 'production'
      && ['localhost', '127.0.0.1'].includes(parsed.hostname);
    if ((!localDevelopment && parsed.hostname !== 'script.google.com')
      || (parsed.protocol !== 'https:' && !localDevelopment)
      || !/^\/macros\/s\/[^/]+\/(?:exec|dev)$/.test(parsed.pathname)) return null;
    return { endpoint, secret };
  } catch {
    return null;
  }
}

async function updateNotificationStatus(config, leadId, status, errorCode = null) {
  const query = new URLSearchParams({ id: `eq.${leadId}` });
  const response = await supabaseFetch(config, `customer_leads?${query}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({
      notification_status: status,
      notification_attempted_at: new Date().toISOString(),
      notification_error_code: errorCode,
    }),
  });
  if (!response.ok) throw new Error(`Supabase notification status update failed (${response.status})`);
}

async function sendEmailNotification(config, payload, lead, requestId, ipHash, submittedAt) {
  const appsScript = appsScriptEndpoint();
  if (!appsScript) {
    await updateNotificationStatus(config, lead.id, 'unconfigured', 'apps_script_not_configured');
    return 'unconfigured';
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(appsScript.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        secret: appsScript.secret,
        requestId,
        ipHash,
        submittedAt,
        ...payload,
      }),
      cache: 'no-store',
      signal: controller.signal,
      redirect: 'follow',
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || result?.success !== true) {
      await updateNotificationStatus(config, lead.id, 'failed', result?.error || `email_http_${response.status}`);
      console.error('Customer lead saved; Outlook notification was not confirmed.', result?.error || response.status);
      return 'failed';
    }
    await updateNotificationStatus(config, lead.id, 'sent');
    return 'sent';
  } catch (cause) {
    const errorCode = cause?.name === 'AbortError' ? 'email_timeout' : 'email_delivery_failed';
    try {
      await updateNotificationStatus(config, lead.id, 'failed', errorCode);
    } catch (statusError) {
      console.error('Customer lead saved; unable to update notification status.', statusError);
    }
    console.error('Customer lead saved; Outlook notification failed.', cause);
    return 'failed';
  } finally {
    clearTimeout(timeout);
  }
}

export async function OPTIONS(request) {
  const origin = request.headers.get('origin');
  const requestOrigin = new URL(request.url).origin;
  if (origin && origin !== requestOrigin && !allowedOrigins().has(origin)) {
    return error(403, 'ORIGIN_NOT_ALLOWED', 'Nguồn gửi biểu mẫu không được phép.', corsHeaders(''));
  }
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin || requestOrigin) });
}

export async function POST(request) {
  const origin = request.headers.get('origin');
  const requestOrigin = new URL(request.url).origin;
  const headers = corsHeaders(origin && (origin === requestOrigin || allowedOrigins().has(origin)) ? origin : '');
  if (origin && origin !== requestOrigin && !allowedOrigins().has(origin)) {
    return error(403, 'ORIGIN_NOT_ALLOWED', 'Không thể gửi biểu mẫu từ trang này.', headers);
  }

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return error(413, 'PAYLOAD_TOO_LARGE', 'Thông tin gửi lên vượt quá giới hạn.', headers);
  }

  let input;
  try {
    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody, 'utf8') > MAX_BODY_BYTES) {
      return error(413, 'PAYLOAD_TOO_LARGE', 'Thông tin gửi lên vượt quá giới hạn.', headers);
    }
    input = JSON.parse(rawBody);
  } catch {
    return error(400, 'INVALID_JSON', 'Dữ liệu biểu mẫu không hợp lệ.', headers);
  }
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return error(400, 'INVALID_PAYLOAD', 'Dữ liệu biểu mẫu không hợp lệ.', headers);
  }

  const trustedPageOrigins = allowedOrigins();
  trustedPageOrigins.add(requestOrigin);
  const payload = normalizePayload(input, trustedPageOrigins);
  if (payload.website) return error(400, 'SPAM_DETECTED', 'Không thể gửi yêu cầu. Vui lòng thử lại.', headers);
  if (!isValid(payload)) {
    return error(400, 'VALIDATION_FAILED', 'Vui lòng kiểm tra họ tên, số điện thoại và email.', headers);
  }

  const config = supabaseConfig();
  if (!config) {
    return error(503, 'CONTACT_SERVICE_NOT_CONFIGURED', 'Biểu mẫu chưa được kết nối. Vui lòng gọi hotline 0967 111 082.', headers);
  }

  const now = Date.now();
  const ipHash = getClientIp(request);
  if (!withinLocalRateLimit(ipHash, now)) {
    return error(429, 'RATE_LIMITED', 'Bạn đã gửi nhiều yêu cầu trong thời gian ngắn. Vui lòng thử lại sau.', headers);
  }

  const submittedAt = new Date(now).toISOString();
  const requestId = fingerprint(payload, now);
  const rpcController = new AbortController();
  const rpcTimeout = setTimeout(() => rpcController.abort(), 15000);
  let lead;
  try {
    const response = await supabaseFetch(config, 'rpc/create_customer_lead', {
      method: 'POST',
      body: JSON.stringify({
        p_payload: {
          name: payload.name,
          phone: payload.phone,
          email: payload.email || null,
          projectAddress: payload.projectAddress || null,
          productInterest: payload.product || payload.interest || null,
          interest: payload.interest || null,
          project: payload.project || null,
          installationLocation: payload.installationLocation || null,
          message: payload.message || null,
          pageUrl: payload.pageUrl || `${requestOrigin}/`,
        },
        p_ip_hash: ipHash,
        p_idempotency_key: requestId,
        p_rate_window_seconds: RATE_WINDOW_MS / 1000,
        p_max_requests: MAX_REQUESTS_PER_WINDOW,
      }),
      signal: rpcController.signal,
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || !result || typeof result !== 'object') {
      console.error('Supabase did not confirm customer lead persistence.', response.status, result?.code || result?.message);
      return error(503, 'LEAD_SAVE_FAILED', 'Chưa lưu được yêu cầu. Vui lòng thử lại hoặc gọi hotline 0967 111 082.', headers);
    }
    if (result.code === 'RATE_LIMITED') {
      return error(429, 'RATE_LIMITED', 'Bạn đã gửi nhiều yêu cầu trong thời gian ngắn. Vui lòng thử lại sau.', headers);
    }
    if (result.success !== true || !result.id || !result.customer_code) {
      console.error('Supabase RPC returned an unexpected result.', result);
      return error(503, 'LEAD_SAVE_FAILED', 'Chưa lưu được yêu cầu. Vui lòng thử lại hoặc gọi hotline 0967 111 082.', headers);
    }
    lead = result;
  } catch (cause) {
    console.error('Supabase lead persistence request failed.', cause);
    return error(503, 'LEAD_SAVE_FAILED', 'Chưa lưu được yêu cầu. Vui lòng thử lại hoặc gọi hotline 0967 111 082.', headers);
  } finally {
    clearTimeout(rpcTimeout);
  }

  let notificationStatus = lead.notification_status || 'pending';
  if (!lead.duplicate || notificationStatus !== 'sent') {
    try {
      notificationStatus = await sendEmailNotification(config, payload, lead, requestId, ipHash, submittedAt);
    } catch (cause) {
      // Persistence already succeeded. Notification bookkeeping must not turn a saved lead into a failed form submission.
      notificationStatus = 'failed';
      console.error('Customer lead persisted; notification processing needs attention.', cause);
    }
  }

  return jsonResponse({
    success: true,
    message: 'Yêu cầu đã được tiếp nhận. Eurowindow sẽ sớm liên hệ với bạn.',
    customerCode: lead.customer_code,
    notificationStatus,
  }, 200, headers);
}
