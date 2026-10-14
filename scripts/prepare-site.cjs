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
  let homeMotionCleanup = null;
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
script = script.replace("document.querySelector(u.hash)?.scrollIntoView({behavior:'smooth'})", "window.__EUROWINDOW_LENIS__?window.__EUROWINDOW_LENIS__.scrollTo(document.querySelector(u.hash)):document.querySelector(u.hash)?.scrollIntoView({behavior:'smooth'})");
script = script.replace("window.scrollTo(0,0);observe();wirePage();", "window.__EUROWINDOW_LENIS__?window.__EUROWINDOW_LENIS__.scrollTo(0,{immediate:true}):window.scrollTo(0,0);observe();wirePage();");
script = script.replace("document.querySelector('#main').innerHTML=html;prefixLinks();const titles=", "document.querySelector('#main').innerHTML=html;prefixLinks();if(homeMotionCleanup){homeMotionCleanup();homeMotionCleanup=null;}if(p==='/')homeMotionCleanup=setupHomeMotion();const titles=");
script = script.replace('  function observe(){', `  function setupHomeMotion(){
    const root=document.querySelector('#main');
    if(!root||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return ()=>{};
    const sections=[...root.querySelectorAll(':scope > section')];
    const itemSelector='.hero-content > *, .hero-meta, .scroll-note, .intro-art, .intro-copy > *, .section-head h2, .section-head .eyebrow, .section-head p, .section-head .button, .category-card img, .category-info > *, .system-card img, .system-card h3, .system-card p, .system-card a, .project-image, .project-meta, .project-card h3, .project-card p, .craft-image, .craft-copy > *, .story-photo, .story-copy > *, .quote-grid > div > *, .quote-form > *, .article-image, .article-body > *';
    const items=new Set();
    sections.forEach(section=>{
      section.classList.add('home-section-motion');
      section.querySelectorAll(itemSelector).forEach((el,index)=>{
        el.classList.add('home-motion-item');
        el.style.setProperty('--home-stagger',Math.min(index,6)*75+'ms');
        items.add(el);
      });
    });
    const animated=[...sections,...items];
    if(!('IntersectionObserver'in window)){animated.forEach(el=>el.classList.add('home-motion-visible'));return ()=>{};}
    const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('home-motion-visible');revealObserver.unobserve(entry.target);}
    }),{threshold:.12,rootMargin:'0px 0px -5% 0px'});
    animated.forEach(el=>revealObserver.observe(el));
    const parallax=[...root.querySelectorAll('.hero-image img,.intro-art img,.craft-image img,.story-photo img')];
    let active=new Set(),frame=0;
    const visibilityObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting)active.add(entry.target);else active.delete(entry.target);
    }),{rootMargin:'120px 0px'});
    parallax.forEach(el=>{el.classList.add('home-parallax');visibilityObserver.observe(el);});
    const update=()=>{
      frame=0;
      active.forEach(el=>{
        const rect=el.getBoundingClientRect();
        const offset=Math.max(-12,Math.min(12,(rect.top+rect.height/2-window.innerHeight/2)*-.025));
        el.style.setProperty('--home-parallax',offset.toFixed(2)+'px');
      });
    };
    const onScroll=()=>{if(!frame)frame=requestAnimationFrame(update);};
    window.addEventListener('scroll',onScroll,{passive:true});
    update();
    return ()=>{revealObserver.disconnect();visibilityObserver.disconnect();window.removeEventListener('scroll',onScroll);if(frame)cancelAnimationFrame(frame);parallax.forEach(el=>el.style.removeProperty('--home-parallax'));};
  }
  function observe(){`);
script = script.replace("  document.querySelector('#menuBtn').addEventListener", "  prefixLinks();\n  document.querySelector('#menuBtn').addEventListener");

const motion = `
/* Homepage motion activates once each element enters the viewport. */
.home-section-motion{opacity:0;transform:translate3d(0,10px,0);transition:opacity .8s cubic-bezier(.22,1,.36,1),transform .8s cubic-bezier(.22,1,.36,1)}
.home-section-motion.home-motion-visible{opacity:1;transform:none}
.home-motion-item{opacity:0;transform:translate3d(0,22px,0);transition:opacity .85s cubic-bezier(.22,1,.36,1) var(--home-stagger,0ms),transform .85s cubic-bezier(.22,1,.36,1) var(--home-stagger,0ms)}
.home-motion-item.home-motion-visible{opacity:1;transform:translate3d(0,0,0)}
.home-parallax{translate:0 var(--home-parallax,0px);will-change:translate}
.hero-image img{animation:slowZoom 16s cubic-bezier(.2,.7,.2,1) both}
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
@media(prefers-reduced-motion:reduce){.home-section-motion,.home-motion-item{opacity:1;transform:none;transition:none}.home-parallax{translate:none;will-change:auto}.hero-image img{animation:none}.reveal{opacity:1;transform:none;transition:none}.category-card:hover,.project-card:hover,.product-card:hover,.article-card:hover{transform:none;box-shadow:none}}
`;

fs.writeFileSync(path.join(publicDir, 'site.css'), style[1] + motion);
fs.writeFileSync(path.join(publicDir, 'site-shell.html'), body[1]);
fs.writeFileSync(path.join(publicDir, 'site-script.js'), script);
