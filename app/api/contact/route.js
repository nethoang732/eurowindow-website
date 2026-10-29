import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 16 * 1024;
const WINDOW_MS = 10 * 60 * 1000;
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
    // The API URL is used as a safe fallback for older forms without page context.
  }

  return {
    name: clean(getField(input, 'name', 'Họ và tên', 'Tên người liên hệ'), 120),
    phone: clean(getField(input, 'phone', 'Số điện thoại'), 32),
    email: clean(getField(input, 'email', 'Email'), 254).toLowerCase(),
    projectAddress: clean(getField(input, 'project_address', 'address', 'Địa chỉ công trình'), 300),
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
  stableFields.window = Math.floor(now / WINDOW_MS);
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
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
  return createHash('sha256').update(ip).digest('hex');
}

function withinRateLimit(ipHash, now) {
  for (const [key, entry] of recentRequests) {
    if (now - entry.startedAt >= WINDOW_MS) recentRequests.delete(key);
  }

  const entry = recentRequests.get(ipHash);
  if (!entry || now - entry.startedAt >= WINDOW_MS) {
    recentRequests.set(ipHash, { startedAt: now, count: 1 });
    return true;
  }
  if (entry.count >= MAX_REQUESTS_PER_WINDOW) return false;
  entry.count += 1;
  return true;
}

function error(status, code, message, headers) {
  return jsonResponse({ success: false, code, message }, status, headers);
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
  if (payload.website) {
    return jsonResponse({ success: true, message: 'Yêu cầu đã được tiếp nhận.' }, 200, headers);
  }
  if (!isValid(payload)) {
    return error(400, 'VALIDATION_FAILED', 'Vui lòng kiểm tra họ tên, số điện thoại và email.', headers);
  }

  const endpoint = process.env.GOOGLE_APPS_SCRIPT_URL;
  const sharedSecret = process.env.GOOGLE_APPS_SCRIPT_SECRET;
  if (!endpoint || !sharedSecret) {
    return error(503, 'CONTACT_SERVICE_NOT_CONFIGURED', 'Biểu mẫu chưa được kết nối. Vui lòng gọi hotline 0967 111 082.', headers);
  }

  let endpointUrl;
  try {
    endpointUrl = new URL(endpoint);
  } catch {
    return error(503, 'CONTACT_SERVICE_NOT_CONFIGURED', 'Biểu mẫu chưa được kết nối. Vui lòng gọi hotline 0967 111 082.', headers);
  }
  if (endpointUrl.protocol !== 'https:'
    || endpointUrl.hostname !== 'script.google.com'
    || !/^\/macros\/s\/[^/]+\/(?:exec|dev)$/.test(endpointUrl.pathname)) {
    return error(503, 'CONTACT_SERVICE_NOT_CONFIGURED', 'Biểu mẫu chưa được kết nối. Vui lòng gọi hotline 0967 111 082.', headers);
  }

  const now = Date.now();
  const ipHash = getClientIp(request);
  if (!withinRateLimit(ipHash, now)) {
    return error(429, 'RATE_LIMITED', 'Bạn đã gửi nhiều yêu cầu trong thời gian ngắn. Vui lòng thử lại sau.', headers);
  }

  const requestId = fingerprint(payload, now);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        secret: sharedSecret,
        requestId,
        ipHash,
        submittedAt: new Date(now).toISOString(),
        ...payload,
      }),
      cache: 'no-store',
      signal: controller.signal,
      redirect: 'follow',
    });
    const result = await upstream.json().catch(() => null);
    if (!upstream.ok || result?.success !== true) {
      return error(502, 'CONTACT_DELIVERY_FAILED', 'Chưa gửi được yêu cầu. Vui lòng thử lại hoặc gọi hotline 0967 111 082.', headers);
    }

    return jsonResponse({ success: true, message: 'Yêu cầu đã được gửi. Eurowindow sẽ sớm liên hệ với bạn.' }, 200, headers);
  } catch {
    return error(502, 'CONTACT_DELIVERY_FAILED', 'Chưa gửi được yêu cầu. Vui lòng thử lại hoặc gọi hotline 0967 111 082.', headers);
  } finally {
    clearTimeout(timeout);
  }
}
