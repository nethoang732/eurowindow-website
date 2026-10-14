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

const motion = `
/* Motion layer: gentle, staggered transitions for the landing page. */
.hero-content{animation:heroContentIn 1.1s cubic-bezier(.22,1,.36,1) both}
.hero-content .eyebrow{animation:heroItemIn .8s .12s cubic-bezier(.22,1,.36,1) both}
.hero-content h1{animation:heroItemIn .95s .2s cubic-bezier(.22,1,.36,1) both}
.hero-copy{animation:heroItemIn .85s .34s cubic-bezier(.22,1,.36,1) both}
.hero-actions{animation:heroItemIn .8s .48s cubic-bezier(.22,1,.36,1) both}
.scroll-note,.hero-meta{animation:fadeIn 1s .8s ease both}
.hero-image img{animation:slowZoom 14s cubic-bezier(.2,.7,.2,1) forwards}
.reveal{opacity:0;transform:translate3d(0,28px,0);transition:opacity .95s cubic-bezier(.22,1,.36,1) var(--reveal-delay,0ms),transform .95s cubic-bezier(.22,1,.36,1) var(--reveal-delay,0ms);will-change:opacity,transform}
.reveal.visible{opacity:1;transform:translate3d(0,0,0)}
.category-grid .reveal:nth-child(1),.product-grid .reveal:nth-child(1),.project-grid .reveal:nth-child(1),.article-grid .reveal:nth-child(1){--reveal-delay:40ms}
.category-grid .reveal:nth-child(2),.product-grid .reveal:nth-child(2),.project-grid .reveal:nth-child(2),.article-grid .reveal:nth-child(2){--reveal-delay:120ms}
.category-grid .reveal:nth-child(3),.product-grid .reveal:nth-child(3),.project-grid .reveal:nth-child(3),.article-grid .reveal:nth-child(3){--reveal-delay:200ms}
.category-grid .reveal:nth-child(4),.product-grid .reveal:nth-child(4),.project-grid .reveal:nth-child(4),.article-grid .reveal:nth-child(4){--reveal-delay:280ms}
.category-card,.project-card,.product-card,.article-card,.system-card{transition:transform .65s cubic-bezier(.22,1,.36,1),box-shadow .65s cubic-bezier(.22,1,.36,1)}
.category-card:hover,.project-card:hover,.product-card:hover,.article-card:hover{transform:translateY(-6px);box-shadow:0 18px 42px #0c2b5018}
.category-card img,.project-image img,.product-photo img,.article-image img{transition:transform 1.1s cubic-bezier(.22,1,.36,1),filter .8s ease}
.category-card:hover img,.project-card:hover img,.product-card:hover img,.article-card:hover img{transform:scale(1.055)}
@keyframes heroContentIn{from{opacity:0;transform:translate3d(0,24px,0)}to{opacity:1;transform:none}}
@keyframes heroItemIn{from{opacity:0;transform:translate3d(0,18px,0)}to{opacity:1;transform:none}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@media(prefers-reduced-motion:reduce){.hero-content,.hero-content .eyebrow,.hero-content h1,.hero-copy,.hero-actions,.scroll-note,.hero-meta{animation:none}.reveal{opacity:1;transform:none;transition:none}.category-card:hover,.project-card:hover,.product-card:hover,.article-card:hover{transform:none;box-shadow:none}}
`;

fs.writeFileSync(path.join(publicDir, 'site.css'), style[1] + motion);
fs.writeFileSync(path.join(publicDir, 'site-shell.html'), body[1]);
fs.writeFileSync(path.join(publicDir, 'site-script.js'), script);
