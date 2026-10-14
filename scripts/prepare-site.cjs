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
    root.classList.add('home-experience');
    const itemSelector='.hero-image, .hero-content > *, .hero-meta, .scroll-note, .intro-art, .intro-copy > *, .section-head h2, .section-head .eyebrow, .section-head p, .section-head .button, .category-card img, .category-info > *, .system-card img, .system-card h3, .system-card p, .system-card a, .project-image, .project-meta, .project-card h3, .project-card p, .craft-image, .craft-copy > *, .story-photo, .story-copy > *, .quote-grid > div > *, .quote-form > *, .article-image, .article-body > *';
    const items=new Set();
    sections.forEach(section=>{
      section.classList.add('home-section-motion');
      section.querySelectorAll(itemSelector).forEach((el,index)=>{
        el.classList.add('home-motion-item');
        if(el.matches('.hero-image,.intro-art,.craft-image,.story-photo,.project-image,.article-image')||el.matches('img'))el.classList.add('home-motion-image');
        if(el.matches('h1,h2,h3,.eyebrow,.story-kicker'))el.classList.add('home-motion-heading');
        if(el.matches('p,.category-info small,.project-meta,.article-body small'))el.classList.add('home-motion-copy');
        if(el.matches('a.button,button,input[type="submit"]'))el.classList.add('home-motion-cta');
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
    const progress=document.createElement('aside');
    progress.className='home-scroll-progress';
    progress.setAttribute('aria-hidden','true');
    progress.innerHTML='<span class="home-scroll-progress__label">EUROWINDOW</span><span class="home-scroll-progress__track"><i></i></span><span class="home-scroll-progress__end">08</span>';
    root.appendChild(progress);
    const progressFill=progress.querySelector('i');
    const parallax=[...root.querySelectorAll('.hero-image img,.intro-art img,.craft-image img,.story-photo img')];
    let active=new Set(),frame=0;
    const visibilityObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting)active.add(entry.target);else active.delete(entry.target);
    }),{rootMargin:'120px 0px'});
    parallax.forEach(el=>{el.classList.add('home-parallax');visibilityObserver.observe(el);});
    const update=()=>{
      frame=0;
      const maxScroll=document.documentElement.scrollHeight-window.innerHeight;
      progressFill.style.transform='scaleY('+(maxScroll>0?Math.min(1,Math.max(0,window.scrollY/maxScroll)):0)+')';
      active.forEach(el=>{
        const rect=el.getBoundingClientRect();
        const offset=Math.max(-12,Math.min(12,(rect.top+rect.height/2-window.innerHeight/2)*-.025));
        el.style.setProperty('--home-parallax',offset.toFixed(2)+'px');
      });
    };
    const onScroll=()=>{if(!frame)frame=requestAnimationFrame(update);};
    window.addEventListener('scroll',onScroll,{passive:true});
    update();
    return ()=>{revealObserver.disconnect();visibilityObserver.disconnect();window.removeEventListener('scroll',onScroll);if(frame)cancelAnimationFrame(frame);parallax.forEach(el=>el.style.removeProperty('--home-parallax'));root.classList.remove('home-experience');};
  }
  function observe(){`);
script = script.replace("  document.querySelector('#menuBtn').addEventListener", "  prefixLinks();\n  document.querySelector('#menuBtn').addEventListener");

const motion = `
/* Homepage motion activates once each element enters the viewport. */
.home-experience{--motion-ease:cubic-bezier(.19,1,.22,1)}
.home-experience>section{position:relative;isolation:isolate}
.home-section-motion{opacity:0;transform:translate3d(0,10px,0);transition:opacity .8s cubic-bezier(.22,1,.36,1),transform .8s cubic-bezier(.22,1,.36,1)}
.home-section-motion.home-motion-visible{opacity:1;transform:none}
.home-motion-item{opacity:0;transform:translate3d(0,30px,0);transition:opacity 1s var(--motion-ease) var(--home-stagger,0ms),transform 1s var(--motion-ease) var(--home-stagger,0ms)}
.home-motion-item.home-motion-visible{opacity:1;transform:translate3d(0,0,0)}
.home-motion-heading{transform:translate3d(0,42px,0);clip-path:inset(0 0 100% 0);transition:opacity 1.05s var(--motion-ease) var(--home-stagger,0ms),transform 1.05s var(--motion-ease) var(--home-stagger,0ms),clip-path 1.05s var(--motion-ease) var(--home-stagger,0ms)}
.home-motion-heading.home-motion-visible{clip-path:inset(0)}
.home-motion-image{clip-path:inset(7% 7% 7% 7%);transition:opacity 1.2s var(--motion-ease) var(--home-stagger,0ms),transform 1.2s var(--motion-ease) var(--home-stagger,0ms),clip-path 1.2s var(--motion-ease) var(--home-stagger,0ms)}
.home-motion-image.home-motion-visible{clip-path:inset(0)}
.home-motion-image img{transform:scale(1.09);transition:transform 1.6s var(--motion-ease)}
.home-motion-image.home-motion-visible img{transform:scale(1)}
.home-parallax{translate:0 var(--home-parallax,0px);will-change:translate}
.home-experience .hero{min-height:min(900px,100svh);height:100svh}
.home-experience .hero-image{opacity:1}
.home-experience .hero-image:after{background:linear-gradient(90deg,#071c33e8 0%,#0b274d9c 43%,#09223d16 100%),linear-gradient(0deg,#071c33cf 0%,transparent 63%)}
.home-experience .hero-image img{animation:none;transform:scale(1.1);transition:transform 1.8s var(--motion-ease)}
.home-experience .hero-image.home-motion-visible img{transform:scale(1)}
.home-experience .hero-content{padding-bottom:clamp(110px,15vh,180px)}
.home-experience .hero h1{max-width:1050px;font-size:clamp(54px,9vw,132px)}
.home-experience .section{padding-block:clamp(100px,13vw,180px)}
.home-experience #intro{min-height:88vh;display:grid;align-items:center}
.home-experience .category-section{background:linear-gradient(180deg,#fff 0%,#f8f7f3 100%)}
.home-experience .category-card{min-height:460px;border-radius:2px}
.home-experience .category-card img{transform:scale(1.08);transition:transform 1.5s var(--motion-ease),opacity .8s ease}
.home-experience .category-card:hover img{transform:scale(1.13)}
.home-experience .category-info{transition:transform .8s var(--motion-ease)}
.home-experience .category-card:hover .category-info{transform:translateY(-8px)}
.home-experience .system-section{padding-block:clamp(100px,13vw,170px);background:radial-gradient(ellipse at 85% 20%,#1d4c73 0%,var(--navy) 54%)}
.home-experience .system-track{grid-template-columns:repeat(5,minmax(210px,1fr));gap:18px}
.home-experience .system-card img{height:clamp(210px,22vw,310px);object-fit:cover}
.home-experience .projects-section{background:#e9e6df}
.home-experience .project-card:nth-child(2){margin-top:110px}
.home-experience .project-card:nth-child(3){margin-top:44px}
.home-experience .project-image{height:clamp(330px,36vw,530px)}
.home-experience .project-card:first-child .project-image{height:clamp(420px,46vw,640px)}
.home-experience .craft{background:#fff}
.home-experience .craft-image{height:clamp(470px,54vw,740px)}
.home-experience .story{min-height:88vh}
.home-experience .story-photo{min-height:88vh;overflow:hidden}
.home-experience .story-photo img{transform:scale(1.08);transition:transform 1.8s var(--motion-ease)}
.home-experience .story-photo.home-motion-visible img{transform:scale(1)}
.home-experience .story-copy{padding-inline:clamp(38px,9vw,150px)}
.home-experience .quote-band{padding-block:clamp(92px,12vw,160px);background:linear-gradient(125deg,#164978,#0f355e)}
.home-experience .quote-band:after{transition:transform 1.2s var(--motion-ease)}
.home-scroll-progress{position:fixed;z-index:19;right:clamp(15px,2.4vw,36px);top:50%;transform:translateY(-50%);display:flex;flex-direction:column;align-items:center;gap:13px;color:#fff;mix-blend-mode:difference;pointer-events:none}
.home-scroll-progress__label,.home-scroll-progress__end{font:700 8px var(--display);letter-spacing:.18em;writing-mode:vertical-rl}
.home-scroll-progress__track{width:1px;height:100px;background:#ffffff55;overflow:hidden}
.home-scroll-progress__track i{display:block;width:100%;height:100%;background:currentColor;transform:scaleY(0);transform-origin:top}
.home-scroll-progress__end{opacity:.6}
.home-experience .reveal{opacity:0;transform:translate3d(0,28px,0);transition:opacity .95s cubic-bezier(.22,1,.36,1) var(--reveal-delay,0ms),transform .95s cubic-bezier(.22,1,.36,1) var(--reveal-delay,0ms);will-change:opacity,transform}
.home-experience .reveal.visible{opacity:1;transform:translate3d(0,0,0)}
.home-experience .category-grid .reveal:nth-child(1),.home-experience .product-grid .reveal:nth-child(1),.home-experience .project-grid .reveal:nth-child(1),.home-experience .article-grid .reveal:nth-child(1){--reveal-delay:40ms}
.home-experience .category-grid .reveal:nth-child(2),.home-experience .product-grid .reveal:nth-child(2),.home-experience .project-grid .reveal:nth-child(2),.home-experience .article-grid .reveal:nth-child(2){--reveal-delay:120ms}
.home-experience .category-grid .reveal:nth-child(3),.home-experience .product-grid .reveal:nth-child(3),.home-experience .project-grid .reveal:nth-child(3),.home-experience .article-grid .reveal:nth-child(3){--reveal-delay:200ms}
.home-experience .category-grid .reveal:nth-child(4),.home-experience .product-grid .reveal:nth-child(4),.home-experience .project-grid .reveal:nth-child(4),.home-experience .article-grid .reveal:nth-child(4){--reveal-delay:280ms}
.home-experience .category-card,.home-experience .project-card,.home-experience .product-card,.home-experience .article-card,.home-experience .system-card{transition:transform .65s cubic-bezier(.22,1,.36,1),box-shadow .65s cubic-bezier(.22,1,.36,1)}
.home-experience .category-card:hover,.home-experience .project-card:hover,.home-experience .product-card:hover,.home-experience .article-card:hover{transform:translateY(-6px);box-shadow:0 18px 42px #0c2b5018}
.home-experience .category-card img,.home-experience .project-image img,.home-experience .product-photo img,.home-experience .article-image img{transition:transform 1.1s cubic-bezier(.22,1,.36,1),filter .8s ease}
.home-experience .category-card:hover img,.home-experience .project-card:hover img,.home-experience .product-card:hover img,.home-experience .article-card:hover img{transform:scale(1.055)}
@media(max-width:1000px){.home-experience .category-card{min-height:390px}.home-experience .system-track{grid-template-columns:repeat(5,260px);overflow:auto;overscroll-behavior-x:contain;scrollbar-width:thin;padding-bottom:16px}.home-experience .project-card:nth-child(2){margin-top:68px}.home-scroll-progress{right:12px}}
@media(max-width:700px){.home-experience .hero{min-height:680px;height:92svh}.home-experience .hero-content{padding-bottom:115px}.home-experience .hero h1{font-size:clamp(45px,13vw,76px)}.home-experience .section{padding-block:78px}.home-experience #intro{min-height:0;display:block}.home-experience .category-card{min-height:350px}.home-experience .project-card:nth-child(2),.home-experience .project-card:nth-child(3){margin-top:0}.home-experience .project-image,.home-experience .project-card:first-child .project-image{height:360px}.home-experience .craft-image{height:420px}.home-experience .story{min-height:0}.home-experience .story-photo{min-height:370px;height:370px}.home-experience .story-copy{padding:68px 25px}.home-experience .quote-band{padding-block:68px}.home-scroll-progress{display:none}}
@media(prefers-reduced-motion:reduce){.home-section-motion,.home-motion-item{opacity:1;transform:none;clip-path:none;transition:none}.home-parallax{translate:none;will-change:auto}.hero-image img,.home-motion-image img,.home-experience .story-photo img{animation:none;transform:none;transition:none}.home-experience .reveal{opacity:1;transform:none;transition:none}.home-experience .category-card:hover,.home-experience .project-card:hover,.home-experience .product-card:hover,.home-experience .article-card:hover{transform:none;box-shadow:none}}
`;

fs.writeFileSync(path.join(publicDir, 'site.css'), style[1] + motion);
fs.writeFileSync(path.join(publicDir, 'site-shell.html'), body[1]);
fs.writeFileSync(path.join(publicDir, 'site-script.js'), script);
