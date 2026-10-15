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
    document.querySelectorAll('a[href^="/"],img[src^="/"]').forEach((el) => {
      const attribute = el.tagName === 'IMG' ? 'src' : 'href';
      const value = el.getAttribute(attribute);
      if (value !== BASE_PATH && !value.startsWith(BASE_PATH + '/')) el.setAttribute(attribute, BASE_PATH + value);
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
script = script.replace("document.querySelector('#main').innerHTML=html;prefixLinks();const titles=", "document.querySelector('#main').innerHTML=html;prefixLinks();const main=document.querySelector('#main');main.classList.toggle('home-page',p==='/');if(homeMotionCleanup){homeMotionCleanup();homeMotionCleanup=null;}if(p==='/')homeMotionCleanup=setupHomeMotion();const titles=");
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
    const lenis=window.__EUROWINDOW_LENIS__;
    if(lenis)lenis.on('scroll',onScroll);else window.addEventListener('scroll',onScroll,{passive:true});
    update();
    return ()=>{revealObserver.disconnect();visibilityObserver.disconnect();if(lenis)lenis.off('scroll',onScroll);else window.removeEventListener('scroll',onScroll);if(frame)cancelAnimationFrame(frame);parallax.forEach(el=>el.style.removeProperty('--home-parallax'));};
  }
  function observe(){`);
script = script.replace("  document.querySelector('#menuBtn').addEventListener", "  prefixLinks();\n  document.querySelector('#menuBtn').addEventListener");

const motion = `
/* Motion is isolated to the homepage and starts once items enter the viewport. */
.home-page .home-section-motion{opacity:0;transform:translate3d(0,10px,0);transition:opacity .8s cubic-bezier(.22,1,.36,1),transform .8s cubic-bezier(.22,1,.36,1)}
.home-page .home-section-motion.home-motion-visible{opacity:1;transform:none}
.home-page .home-motion-item{opacity:0;transform:translate3d(0,22px,0);transition:opacity .85s cubic-bezier(.22,1,.36,1) var(--home-stagger,0ms),transform .85s cubic-bezier(.22,1,.36,1) var(--home-stagger,0ms)}
.home-page .home-motion-item.home-motion-visible{opacity:1;transform:translate3d(0,0,0)}
.home-page .home-parallax{translate:0 var(--home-parallax,0px);will-change:translate}
.home-page .hero-image img{animation:slowZoom 16s cubic-bezier(.2,.7,.2,1) both}
.home-page .reveal{opacity:0;transform:translate3d(0,28px,0);transition:opacity .95s cubic-bezier(.22,1,.36,1) var(--reveal-delay,0ms),transform .95s cubic-bezier(.22,1,.36,1) var(--reveal-delay,0ms);will-change:opacity,transform}
.home-page .reveal.visible{opacity:1;transform:translate3d(0,0,0)}
.home-page .category-grid .reveal:nth-child(1),.home-page .project-grid .reveal:nth-child(1){--reveal-delay:40ms}
.home-page .category-grid .reveal:nth-child(2),.home-page .project-grid .reveal:nth-child(2){--reveal-delay:120ms}
.home-page .category-grid .reveal:nth-child(3),.home-page .project-grid .reveal:nth-child(3){--reveal-delay:200ms}
.home-page .category-grid .reveal:nth-child(4),.home-page .project-grid .reveal:nth-child(4){--reveal-delay:280ms}
.home-page .category-card,.home-page .project-card,.home-page .system-card{transition:transform .65s cubic-bezier(.22,1,.36,1),box-shadow .65s cubic-bezier(.22,1,.36,1)}
.home-page .category-card:hover,.home-page .project-card:hover{transform:translateY(-6px);box-shadow:0 18px 42px #0c2b5018}
.home-page .category-card img,.home-page .project-image img{transition:transform 1.1s cubic-bezier(.22,1,.36,1),filter .8s ease}
.home-page .category-card:hover img,.home-page .project-card:hover img{transform:scale(1.055)}
@media(prefers-reduced-motion:reduce){.home-page .home-section-motion,.home-page .home-motion-item,.home-page .reveal{opacity:1;transform:none;transition:none;will-change:auto}.home-page .home-parallax{translate:none;will-change:auto}.home-page .hero-image img{animation:none}.home-page .category-card:hover,.home-page .project-card:hover{transform:none;box-shadow:none}}
`;

const blueTheme = `
/* Cool sapphire palette shared by every route. */
:root{--navy:#102b4c;--blue:#1d4d7c;--blue2:#3975a7;--gold:#79a9d6;--gold2:#d4e7f8;--cream:#f3f7fb;--white:#fff;--ink:#17283b;--muted:#64778b;--line:#dce6f0}
body{background:var(--cream);color:var(--ink)}
::selection{background:var(--gold2);color:var(--navy)}
.button:hover{background:#a9c9e8;border-color:#a9c9e8}
.site-header.scrolled{background:#fff;color:var(--navy);border-color:var(--line);box-shadow:0 8px 30px #0c2b5010}
.site-header:not(.scrolled) .brand-image img{filter:brightness(0) invert(1)}
.site-header.scrolled .head-cta{color:var(--navy)}
.brand-image{width:clamp(190px,20vw,258px);height:58px;display:flex;align-items:center;flex:none}
.brand-image img{width:100%;height:100%;object-fit:contain}
.footer .brand-image{width:220px;height:54px;filter:brightness(0) invert(1)}
@media(max-width:700px){.brand-image{width:min(62vw,220px);height:48px}.footer .brand-image{width:210px;height:50px}.nav{color:#fff}.site-header.scrolled .nav{color:var(--navy)}}
/* Slightly larger type across the site for more comfortable reading. */
body{font-size:16px}
.eyebrow{font-size:11px}
.button{font-size:12px}
.nav,.head-cta{font-size:11px}
.hero-copy{font-size:16px}
.section-head h2{font-size:clamp(36px,5.2vw,68px)}
.section-head p,.intro-copy p{font-size:16px}
.intro-copy h2{font-size:clamp(44px,5.8vw,78px)}
.intro-caption{font-size:12px}
.stat span{font-size:11px}
.category-info small,.project-meta,.value-no,.story-kicker,.crumb{font-size:10px}
.category-info p,.system-card p,.project-card p,.value-item p,.product-body p,.article-body p,.process-step p,.spec-row{font-size:13px}
.system-card a{font-size:11px}
.project-card h3{font-size:26px}
.craft-copy h2{font-size:clamp(40px,5.2vw,68px)}
.story-copy h2{font-size:clamp(44px,5.5vw,75px)}
.quote-grid h2{font-size:clamp(40px,5.2vw,68px)}
.footer-copy,.footer-links{font-size:13px}
.footer h4{font-size:11px}
.footer-bottom,.form-note{font-size:11px}
.filter{font-size:11px}
.product-body small,.detail-label,.article-body small,.contact-card small{font-size:10px}
.page-hero h1{font-size:clamp(44px,7.2vw,86px)}
.button:not(.ghost):not(.link){background:linear-gradient(120deg,#174f84 0%,#246da8 58%,#3b82ba 100%);border-color:#286da7;color:#fff;box-shadow:0 7px 20px #174f8428;transition:background .3s ease,border-color .3s ease,box-shadow .3s ease,transform .3s cubic-bezier(.22,1,.36,1)}
.button:not(.ghost):not(.link):hover{background:linear-gradient(120deg,#123f6d 0%,#1e5d96 58%,#3174aa 100%);border-color:#1c5c96;box-shadow:0 11px 26px #174f8438;transform:translateY(-2px)}
.button.dark{background:linear-gradient(120deg,#123b65,#1d5b91)!important;border-color:#1c5689!important;color:#fff}
.button.link{color:#174f84}
.button.link:hover{color:#347db8}
.button.ghost{transition:background .3s ease,border-color .3s ease,transform .3s ease}
.filter{border-radius:999px;background:#fff;color:#36536f;border-color:#c9d8e6;transition:background .25s ease,color .25s ease,border-color .25s ease,box-shadow .25s ease,transform .25s ease}
.filter:hover{border-color:#5b8fbd;color:#174f84;transform:translateY(-1px)}
.filter.active{background:linear-gradient(120deg,#174f84,#2e75ae);border-color:#246da8;color:#fff;box-shadow:0 5px 15px #174f8426}
.filter.active:hover{background:linear-gradient(120deg,#123f6d,#24679f);color:#fff}
.button:focus-visible,.filter:focus-visible,.head-cta:focus-visible{outline:3px solid #a7c9e5;outline-offset:3px}
.head-cta{transition:color .25s ease,border-color .25s ease}
.site-header:not(.scrolled) .head-cta:hover{color:#fff;border-color:#fff}
.site-header.scrolled .head-cta:hover{color:#5b8fbd;border-color:#5b8fbd}
@media(max-width:700px){
body{font-size:15px}
.nav{font-size:10px}
.hero h1{font-size:clamp(46px,13.5vw,72px)}
.hero-copy{font-size:14px}
.section-head h2{font-size:44px}
.intro-copy h2{font-size:50px}
.stat span{font-size:9px}
.category-info h3{font-size:28px}
.category-info p,.system-card p,.project-card p,.value-item p,.product-body p,.article-body p,.process-step p{font-size:12px}
.story-copy h2,.quote-grid h2{font-size:47px}
.page-hero h1{font-size:48px}
.product-body h3,.article-body h3{font-size:18px}
.process-step h3{font-size:17px}
}
.projects-section{background:#e9f0f7}
.project-image{background:#d6e1ec}
.detail-image{background:#e3ebf3}
.detail-label{background:#e1edf8;color:#244d75}
.sample-note{background:#edf4fa;color:#526b84}
.category-section{background:#fff}
.project-grid>.project-card:nth-child(2),.project-grid>.project-card:nth-child(3){margin-top:0!important;align-self:start}
#main [style*="#d8d2c4"]{background:linear-gradient(135deg,#dce8f3,#f1f6fb)!important}
`;

fs.writeFileSync(path.join(publicDir, 'site.css'), style[1] + blueTheme + motion);
fs.writeFileSync(path.join(publicDir, 'site-shell.html'), body[1]);
fs.writeFileSync(path.join(publicDir, 'site-script.js'), script);
