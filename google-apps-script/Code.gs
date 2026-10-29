const CONFIG = Object.freeze({
  recipient: 'hoangnm3@eurowindow.biz',
  sheetName: 'Website Leads',
  rateLimit: 5,
  rateWindowSeconds: 600,
});

const HEADERS = [
  'Mã khách hàng',
  'Thời gian tiếp nhận',
  'Họ và tên',
  'Số điện thoại',
  'Email',
  'Địa chỉ công trình',
  'Sản phẩm quan tâm',
  'Sản phẩm cụ thể',
  'Loại công trình',
  'Vị trí lắp đặt',
  'Nội dung yêu cầu',
  'Trang gửi biểu mẫu',
  'Trạng thái xử lý',
  'Mã yêu cầu',
];

function doPost(event) {
  try {
    const data = JSON.parse(event && event.postData && event.postData.contents || '{}');
    const properties = PropertiesService.getScriptProperties();
    const expectedSecret = properties.getProperty('SHARED_SECRET');
    if (!expectedSecret || !data.secret || data.secret !== expectedSecret) {
      return json_({ success: false, error: 'unauthorized' });
    }

    const payload = validate_(data);
    if (!payload) return json_({ success: false, error: 'invalid_payload' });

    const lock = LockService.getScriptLock();
    if (!lock.tryLock(10000)) return json_({ success: false, error: 'busy' });

    try {
      const cache = CacheService.getScriptCache();
      const rateKey = 'rate:' + payload.ipHash + ':' + Math.floor(Date.now() / (CONFIG.rateWindowSeconds * 1000));
      const count = Number(cache.get(rateKey) || 0);
      if (count >= CONFIG.rateLimit) return json_({ success: false, error: 'rate_limited' });
      cache.put(rateKey, String(count + 1), CONFIG.rateWindowSeconds);

      const spreadsheet = openSpreadsheet_();
      const sheet = getSheet_(spreadsheet);
      const duplicate = findRequest_(sheet, payload.requestId);
      if (duplicate && duplicate.status === 'Mới') return json_({ success: true, duplicate: true, customerId: duplicate.customerId });

      if (duplicate) {
        try {
          sendNotification_(payload, duplicate.customerId, new Date(duplicate.receivedAt));
          sheet.getRange(duplicate.rowNumber, 13).setValue('Mới');
          return json_({ success: true, retried: true, customerId: duplicate.customerId });
        } catch (emailError) {
          console.error(emailError && emailError.stack || emailError);
          return json_({ success: false, error: 'email_failed' });
        }
      }

      const receivedAt = new Date();
      const customerId = createCustomerId_(sheet, receivedAt);

      sheet.appendRow([
        customerId,
        receivedAt,
        safeCell_(payload.name),
        safeCell_(payload.phone),
        safeCell_(payload.email),
        safeCell_(payload.projectAddress),
        safeCell_(payload.interest),
        safeCell_(payload.product),
        safeCell_(payload.project),
        safeCell_(payload.installationLocation),
        safeCell_(payload.message),
        safeCell_(payload.pageUrl),
        'Đang gửi email',
        payload.requestId,
      ]);
      const rowNumber = sheet.getLastRow();
      try {
        sendNotification_(payload, customerId, receivedAt);
        sheet.getRange(rowNumber, 13).setValue('Mới');
      } catch (emailError) {
        sheet.getRange(rowNumber, 13).setValue('Lỗi gửi email');
        console.error(emailError && emailError.stack || emailError);
        return json_({ success: false, error: 'email_failed' });
      }
      cache.put('accepted:' + payload.requestId, customerId, 21600);
      return json_({ success: true, customerId: customerId });
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    console.error(error && error.stack || error);
    return json_({ success: false, error: 'processing_failed' });
  }
}

function authorizeServices() {
  const spreadsheet = openSpreadsheet_();
  getSheet_(spreadsheet);
  MailApp.getRemainingDailyQuota();
}

function validate_(data) {
  const payload = {
    requestId: string_(data.requestId, 64),
    ipHash: string_(data.ipHash, 64),
    submittedAt: string_(data.submittedAt, 40),
    name: string_(data.name, 120),
    phone: string_(data.phone, 32),
    email: string_(data.email, 254),
    projectAddress: string_(data.projectAddress, 300),
    interest: string_(data.interest, 200),
    product: string_(data.product, 200),
    project: string_(data.project, 200),
    installationLocation: string_(data.installationLocation, 200),
    message: string_(data.message, 4000),
    pageUrl: string_(data.pageUrl, 2048),
  };
  const digits = payload.phone.replace(/\D/g, '');
  if (!payload.requestId || !/^[a-f0-9]{64}$/.test(payload.requestId)) return null;
  if (!payload.ipHash || !/^[a-f0-9]{64}$/.test(payload.ipHash)) return null;
  if (payload.name.length < 2 || digits.length < 9 || digits.length > 15) return null;
  if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) return null;
  return payload;
}

function openSpreadsheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) throw new Error('Missing SPREADSHEET_ID script property');
  return SpreadsheetApp.openById(id);
}

function getSheet_(spreadsheet) {
  let sheet = spreadsheet.getSheetByName(CONFIG.sheetName);
  if (!sheet) sheet = spreadsheet.insertSheet(CONFIG.sheetName);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  } else {
    const existing = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
    if (existing[0] !== HEADERS[0] || existing[13] !== HEADERS[13]) {
      throw new Error('The Website Leads sheet has unexpected headers');
    }
  }
  return sheet;
}

function findRequest_(sheet, requestId) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;
  const startRow = Math.max(2, lastRow - 999);
  const values = sheet.getRange(startRow, 1, lastRow - startRow + 1, 14).getValues();
  for (let index = values.length - 1; index >= 0; index -= 1) {
    const row = values[index];
    if (String(row[13]) === requestId) {
      return { rowNumber: startRow + index, customerId: String(row[0]), receivedAt: row[1], status: String(row[12]) };
    }
  }
  return null;
}

function createCustomerId_(sheet, date) {
  const day = Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyyMMdd');
  const id = Utilities.getUuid().replace(/-/g, '').substring(0, 8).toUpperCase();
  return 'EW-' + day + '-' + id;
}

function sendNotification_(data, customerId, date) {
  const zone = Session.getScriptTimeZone();
  const time = Utilities.formatDate(date, zone, 'dd/MM/yyyy HH:mm:ss');
  const rows = [
    ['Mã khách hàng', customerId],
    ['Thời gian tiếp nhận', time],
    ['Họ và tên', data.name],
    ['Số điện thoại', data.phone],
    ['Email', data.email || 'Chưa cung cấp trong biểu mẫu'],
    ['Địa chỉ công trình', data.projectAddress],
    ['Sản phẩm quan tâm', data.interest],
    ['Sản phẩm cụ thể', data.product],
    ['Loại công trình', data.project],
    ['Vị trí lắp đặt', data.installationLocation],
    ['Nội dung yêu cầu', data.message],
    ['Trang gửi biểu mẫu', data.pageUrl],
  ];
  const htmlRows = rows.map(function (row) {
    return '<tr><th style="padding:10px 12px;text-align:left;vertical-align:top;color:#0b2c4d;background:#f4f6f8;border-bottom:1px solid #e2e7ec;width:190px">'
      + escapeHtml_(row[0]) + '</th><td style="padding:10px 12px;color:#34465a;border-bottom:1px solid #e2e7ec;white-space:pre-wrap">'
      + escapeHtml_(row[1] || '—') + '</td></tr>';
  }).join('');
  const plainText = rows.map(function (row) { return row[0] + ': ' + (row[1] || '—'); }).join('\n');
  const subject = 'Yêu cầu tư vấn mới ' + customerId + ' | Eurowindow';
  const htmlBody = '<div style="margin:0;padding:28px 12px;background:#f3f5f7;font-family:Arial,sans-serif;color:#24374a">'
    + '<div style="max-width:720px;margin:0 auto;background:#fff;border:1px solid #dbe2e9">'
    + '<div style="padding:22px 28px;background:#0b2c4d;border-bottom:4px solid #c5a45b;color:#fff">'
    + '<div style="font-size:12px;letter-spacing:2px;color:#e1c57f;text-transform:uppercase">Eurowindow · Website</div>'
    + '<h1 style="margin:10px 0 0;font-size:23px;font-weight:600">Yêu cầu tư vấn mới</h1></div>'
    + '<div style="padding:24px 28px"><p style="margin:0 0 16px;color:#65758a">Thông tin khách hàng gửi từ website Eurowindow.</p>'
    + '<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:14px">'
    + htmlRows + '</table><p style="margin:20px 0 0;padding-top:14px;border-top:1px solid #e2e7ec;font-size:12px;color:#758398">Trạng thái tiếp nhận: <strong style="color:#0b2c4d">Mới</strong></p>'
    + '</div></div></div>';
  MailApp.sendEmail({ to: CONFIG.recipient, subject: subject, body: plainText, htmlBody: htmlBody, name: 'Eurowindow Website' });
}

function safeCell_(value) {
  const text = String(value || '');
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function string_(value, max) {
  return String(value || '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().substring(0, max);
}

function escapeHtml_(value) {
  return String(value || '').replace(/[&<>"']/g, function (char) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
  });
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
