const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'dist', 'index.html'), 'utf8');
const publicDir = path.join(root, 'public');
fs.mkdirSync(publicDir, { recursive: true });

const style = source.match(/<style>([\s\S]*?)<\/style>/i);
const body = source.match(/<body>([\s\S]*?)<script>([\s\S]*?)<\/script>\s*<\/body>/i);
if (!style || !body) throw new Error('Could not extract the legacy website shell');

const basePatch = `
  const BASE_PATH = window.__EUROWINDOW_BASE_PATH__ || '';
  const stripBase = (value) => {
    if (!BASE_PATH) return value;
    return value === BASE_PATH ? '/' : (value.startsWith(BASE_PATH + '/') ? value.slice(BASE_PATH.length) : value);
  };
  function prefixLinks(){
    if (!BASE_PATH) return;
    document.querySelectorAll('a[href^="/"]').forEach((a) => {
      const href = a.getAttribute('href');
      if (href !== BASE_PATH && !href.startsWith(BASE_PATH + '/')) a.setAttribute('href', BASE_PATH + href);
    });
  }
`;

let script = body[2];
script = script.replace('  const img=', `${basePatch}\n  const img=`);
script = script.replace("  function render(){let p=location.pathname.replace(/\\/$/,'')||'/';", "  function render(){let p=stripBase(location.pathname.replace(/\\/$/,'')||'/');");
script = script.replace("document.querySelector('#main').innerHTML=html;const titles=", "document.querySelector('#main').innerHTML=html;prefixLinks();const titles=");
script = script.replace("a.getAttribute('href')===p|| (p.startsWith(a.getAttribute('href')+'/')", "stripBase(a.getAttribute('href'))===p|| (p.startsWith(stripBase(a.getAttribute('href'))+'/')");
script = script.replace("u.pathname===(location.pathname||'/')", "stripBase(u.pathname)===stripBase(location.pathname||'/')");
script = script.replace('navigate(u.pathname+u.search)', 'navigate(stripBase(u.pathname)+u.search)');
script = script.replace("function navigate(url){history.pushState({},'',url);render()}", "function navigate(url){history.pushState({},'',BASE_PATH+url);render()}");
script = script.replace("  document.querySelector('#menuBtn').addEventListener", "  prefixLinks();\n  document.querySelector('#menuBtn').addEventListener");

fs.writeFileSync(path.join(publicDir, 'site.css'), style[1]);
fs.writeFileSync(path.join(publicDir, 'site-shell.html'), body[1]);
fs.writeFileSync(path.join(publicDir, 'site-script.js'), script);
