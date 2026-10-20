const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, 'out');
const publicRoot = path.join(__dirname, 'public');
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

function findFile(base, pathname) {
  const target = path.resolve(base, `.${pathname}`);
  const insideBase = target === base || target.startsWith(`${base}${path.sep}`);
  if (!insideBase || !fs.existsSync(target)) return null;
  if (fs.statSync(target).isFile()) return target;
  const index = path.join(target, 'index.html');
  return fs.existsSync(index) && fs.statSync(index).isFile() ? index : null;
}

http.createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    res.writeHead(400);
    res.end('Bad request');
    return;
  }
  if (pathname === '/catalogue-preview') pathname = '/data/catalogue-eurowindow-2024.pdf';
  const matchedTarget = findFile(root, pathname) || findFile(publicRoot, pathname);
  const target = matchedTarget || path.join(root, '404.html');
  const stat = fs.statSync(target);
  const contentType = mime[path.extname(target)] || 'application/octet-stream';
  const range = req.headers.range;
  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!match || (!match[1] && !match[2])) {
      res.writeHead(416, { 'Content-Range': `bytes */${stat.size}`, 'Cache-Control': 'no-store' });
      res.end();
      return;
    }
    const start = match[1] ? Number(match[1]) : Math.max(0, stat.size - Number(match[2]));
    const end = match[2] ? Number(match[2]) : stat.size - 1;
    if (start >= stat.size || end < start) {
      res.writeHead(416, { 'Content-Range': `bytes */${stat.size}`, 'Cache-Control': 'no-store' });
      res.end();
      return;
    }
    const last = Math.min(end, stat.size - 1);
    res.writeHead(206, {
      'Content-Type': contentType,
      'Content-Length': last - start + 1,
      'Content-Range': `bytes ${start}-${last}/${stat.size}`,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-store'
    });
    fs.createReadStream(target, { start, end: last }).pipe(res);
    return;
  }
  res.writeHead(matchedTarget ? 200 : 404, {
    'Content-Type': contentType,
    'Content-Length': stat.size,
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'no-store'
  });
  fs.createReadStream(target).pipe(res);
}).listen(4173, '127.0.0.1', () => console.log('Eurowindow preview: http://localhost:4173'));
