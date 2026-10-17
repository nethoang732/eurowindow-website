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
    document.querySelectorAll('a[href^="/"],img[src^="/"],source[src^="/"]').forEach((el) => {
      const attribute = el.tagName === 'A' ? 'href' : 'src';
      const value = el.getAttribute(attribute);
      if (value !== BASE_PATH && !value.startsWith(BASE_PATH + '/')) el.setAttribute(attribute, BASE_PATH + value);
    });
  }
`;

let script = body[2];
script = script.replaceAll('infoew@eurowindow.biz', 'info@example.com');
script = script.replaceAll('Chọn cửa phù hợp', 'Chọn Cửa phù hợp');
script = script.replaceAll('kênh chính thức', 'kênh tư vấn');
const featuredSystemPattern = /<section class="section system-section">[\s\S]*?<\/section>/;
if (!featuredSystemPattern.test(script)) throw new Error('Could not find the featured systems section');
script = script.replace(featuredSystemPattern, '${featuredAluminumSystems()}');
let aluminumPage = fs.readFileSync(path.join(root, 'scripts', 'aluminum-page.js'), 'utf8');
const aluminumGuide = `
  function aluminumGuideSection(){
    const points=[
      ['Cửa đi nhôm kính','Mở quay tạo lối đi rộng. Mở trượt tiết kiệm chỗ; xếp trượt giúp mở gần hết ô cửa.'],
      ['Cửa sổ nhôm kính','Chọn mở quay, mở hất, quay lật hoặc mở trượt theo vị trí cửa và nhu cầu thông gió.'],
      ['Cửa nhôm cầu cách nhiệt','Phù hợp vị trí chịu nắng nhiều hoặc khi gia chủ muốn giảm truyền nhiệt qua khung cửa.'],
      ['Vách kính mặt tiền','Dùng cho mặt tiền cần nhiều ánh sáng. Kích thước và kết cấu cần tính theo tải trọng gió của công trình.']
    ];
    const applications=[
      ['Nhà phố','Nhà mặt phố thường cần giảm tiếng ồn và hạn chế nắng gắt. Cửa trượt hữu ích ở nơi không đủ chỗ cho cánh mở.'],
      ['Biệt thự','Cửa mở rộng hoặc xếp trượt nối phòng khách với sân vườn. Chọn kính và phụ kiện theo kích thước cửa.'],
      ['Chung cư','Kiểm tra quy định của tòa nhà trước khi thay cửa. Chọn kiểu mở và kính phù hợp với hướng căn hộ, tiếng ồn và nhu cầu thông gió.'],
      ['Mặt tiền hiện đại','Vách kính giúp mặt tiền sáng và thoáng. Thiết kế cần tính tải trọng gió, thoát nước và cách bảo trì.']
    ];
    const rows=aluminumProducts.map(item=>[item.name,item.image,item.type,item.opening,item.system]);
    const intro=['Cửa đi phục vụ lối ra vào; cửa sổ lấy sáng và thông gió; vách kính mở rộng tầm nhìn ở mặt tiền hoặc không gian chung.', 'Khung có cầu cách nhiệt giúp giảm truyền nhiệt qua thanh nhôm. Khả năng cách âm, cách nhiệt còn tùy loại kính, gioăng, độ kín và chất lượng lắp đặt.'];
    return productGuideLayout('Cửa nhôm Eurowindow',points,applications,rows,intro);
  }
`;
aluminumPage = aluminumPage.replace('  function officialAluminumPage(){', `${aluminumGuide}\n  function officialAluminumPage(){`);
const aluminumSectionsPattern = /<section class="aluminum-overview">[\s\S]*?<\/section><section class="section aluminum-benefits">[\s\S]*?<\/section>/;
if (!aluminumSectionsPattern.test(aluminumPage)) throw new Error('Could not find the aluminum overview and project sections');
aluminumPage = aluminumPage.replace(aluminumSectionsPattern, '${aluminumGuideSection()}');
aluminumPage += `
  function featuredAluminumSystems(){
    const grouped=new Map();
    aluminumProducts.forEach(item=>{if(!grouped.has(item.system))grouped.set(item.system,[]);grouped.get(item.system).push(item)});
    systems.splice(0,systems.length,...[...grouped.entries()].map(([system,items])=>{
      const name=system.replace(/^Hệ\\s+/,'');
      const types=[...new Set(items.map(item=>item.type))].join(' & ');
      const openings=[...new Set(items.map(item=>item.opening))].join(', ');
      const slug=name.toLocaleLowerCase('vi').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
      return {slug,name,type:types,desc:types+'; các kiểu mở gồm '+openings+'.',image:items[0].image,spec:system};
    }));
    const cards=systems.map(system=>({name:system.name,type:system.type,desc:system.desc,image:system.image,href:'/he-nhom/'+system.slug}));
    const families=[['cua-upvc','uPVC'],['cua-go','Cửa gỗ'],['cua-thong-minh-the-he-moi','Cửa thông minh']];
    families.forEach(([slug,label])=>{
      const groups=new Map();
      (productCatalogData[slug]||[]).forEach(row=>{const variant=row[4];if(!groups.has(variant))groups.set(variant,[]);groups.get(variant).push(row)});
      groups.forEach((rows,variant)=>{
        const [name,image,type,configuration]=rows[0];
        cards.push({name:variant,type:label,desc:type+' · '+configuration,image:productCatalogImage(image),href:'/san-pham/'+slug+'?he='+encodeURIComponent(variant)});
      });
    });
    const renderCards=duplicate=>cards.map(item=>'<article class="system-card reveal"'+(duplicate?' aria-hidden="true" inert':'')+'><a href="'+item.href+'"><img loading="lazy" alt="'+item.type+' '+item.name+'" src="'+item.image+'"><small>'+item.type+'</small><h3>'+item.name+'</h3><p>'+item.desc+'</p><span>Xem chi tiết <span>↗</span></span></a></article>').join('');
    return '<section class="section system-section"><div class="wrap"><div class="section-head"><div><span class="eyebrow">03 / NỀN TẢNG</span><h2 class="serif">Các hệ cửa nổi bật</h2></div></div><div class="system-marquee"><div class="system-track">'+renderCards(false)+renderCards(true)+'</div></div><button class="system-marquee-control" type="button" aria-pressed="false" aria-label="Tạm dừng chuyển động">Tạm dừng</button></div></section>';
  }
  function wireFeaturedSystemMarquee(){const section=document.querySelector('.system-section');if(!section)return;const control=section.querySelector('.system-marquee-control');if(!control)return;control.addEventListener('click',()=>{const paused=section.classList.toggle('is-paused');control.setAttribute('aria-pressed',String(paused));control.setAttribute('aria-label',paused?'Tiếp tục chuyển động':'Tạm dừng chuyển động');control.textContent=paused?'Tiếp tục':'Tạm dừng'})}
`;
const productPages = fs.readFileSync(path.join(root, 'scripts', 'product-pages.js'), 'utf8');
const productPagesWithCatalog = productPages.replace('</section>${productGuideSections(content,slug)}', '</section>${productCatalogSection(slug)}${productGuideSections(content,slug)}');
if (productPagesWithCatalog === productPages) throw new Error('Could not insert product catalog sections into product pages');
const productCatalogs = fs.readFileSync(path.join(root, 'scripts', 'product-catalogs.js'), 'utf8');
const productCatalogsWithFilterLinks = productCatalogs.replace("let filter='all';const render=()=>{const options=", "let filter=new URLSearchParams(location.search).get('he')||'all';const render=()=>{const options=");
script = script.replace('  function render(){', `${aluminumPage}\n${productPagesWithCatalog}\n${productCatalogsWithFilterLinks}\n  function render(){`);
script = script.replace('const render=()=>{const items=catalog[group].items', 'if(!tabs||!filters||!grid)return;const render=()=>{const items=catalog[group].items');
script = script.replace("function wireProductCatalog(){const root=document.querySelector('.door-catalog');", "function wireProductCatalog(){if(document.querySelector('[data-product-family-catalog]')){wireProductFamilyCatalog();return}const root=document.querySelector('.official-aluminum-catalog');");
script = script.replace("const catalog=window.__EURO_ALUMINUM_CATALOG__;if(!catalog)return;let group='type',filter='all';", "const catalog=window.__EURO_ALUMINUM_CATALOG__;if(!catalog)return;const requestedSystem=new URLSearchParams(location.search).get('he');let group=requestedSystem?'system':'type',filter=requestedSystem||'all';");
script = script.replace('href="/bao-gia">Trao đổi cùng tư vấn viên', 'href="/san-pham/cua-nhom?he=${encodeURIComponent(\'Hệ \'+s.name)}">Xem sản phẩm thuộc hệ này');
script = script.replace('function systemsPage(){return `', 'function systemsPage(){featuredAluminumSystems();return `');
script = script.replace('function systemDetail(slug){let s=systems.find', 'function systemDetail(slug){featuredAluminumSystems();let s=systems.find');
script = script.replace('  function productDetail(slug){', "  function productDetail(slug){if(slug==='cua-nhom')return officialAluminumPage();if(productPageContent[slug])return officialProductPage(slug);");
script = script.replace("else if(p==='/san-pham')html=productsPage();", "else if(p==='/san-pham')html=officialProductListingPage();");
script = script.replace("document.querySelector('#productGrid').innerHTML=list.map(c=>productCard({...c,tag:c.tag})).join('');", "document.querySelector('#productGrid').innerHTML=list.map(c=>productCard({...c,tag:c.tag,desc:productListingCopy[c.slug]||c.desc})).join('');");
script = script.replace('wireProductGallery();wireProductCatalog()', 'wireProductGallery();wireProductCatalog();wireFeaturedSystemMarquee()');
script = script.replace('  function aluminumCatalogCard(item){', '  function legacyAluminumCatalogCard(item){');
script = script.replace("options=['T?t c?',", "options=['Tất cả',");
script = script.replace("document.title=(titles[p]||slugTitle)+' | Eurowindow';", "document.title=(p==='/san-pham/cua-nhom'?'Cửa nhôm Eurowindow: Cửa đi, cửa sổ & vách kính':(p==='/san-pham'?'Sản phẩm Eurowindow':(productPageContent[p.split('/').pop()]?.title||titles[p]||slugTitle)))+' | Eurowindow';");
script = script.replace("meta.content=(titles[p]||slugTitle)+' — giải pháp cửa nhôm kính và tư vấn theo nhu cầu công trình từ Eurowindow.';", "meta.content=p==='/san-pham/cua-nhom'?'Khám phá cửa nhôm kính Eurowindow: cửa đi, cửa sổ, cửa mở quay, mở trượt và vách kính. Tư vấn cấu hình, lắp đặt và báo giá theo công trình.':(productPageContent[p.split('/').pop()]?.intro||titles[p]||slugTitle);");
script = script.replace('  const img=', `${basePatch}\n  const img=`);
script = script.replace('const pics=(obj,w=1000)=>img(obj.image,w);', "const pics=(obj,w=1000)=>obj.image.startsWith('http')?obj.image:img(obj.image,w);");
script = script.replace("  function render(){let p=location.pathname.replace(/\\/$/,'')||'/';", "  function render(){let p=stripBase(location.pathname.replace(/\\/$/,'')||'/');");
script = script.replace("document.querySelector('#main').innerHTML=html;const titles=", "document.querySelector('#main').innerHTML=html;prefixLinks();const titles=");
script = script.replace("a.getAttribute('href')===p|| (p.startsWith(a.getAttribute('href')+'/')", "stripBase(a.getAttribute('href'))===p|| (p.startsWith(stripBase(a.getAttribute('href'))+'/')");
script = script.replace("u.pathname===(location.pathname||'/')", "stripBase(u.pathname)===stripBase(location.pathname||'/')");
script = script.replace('navigate(u.pathname+u.search)', 'navigate(stripBase(u.pathname)+u.search)');
script = script.replace("function navigate(url){history.pushState({},'',url);render()}", "function navigate(url){history.pushState({},'',BASE_PATH+url);render()}");
script = script.replace("document.querySelector(u.hash)?.scrollIntoView({behavior:'smooth'})", "window.__EUROWINDOW_LENIS__?window.__EUROWINDOW_LENIS__.scrollTo(document.querySelector(u.hash)):document.querySelector(u.hash)?.scrollIntoView({behavior:'smooth'})");
script = script.replace("window.scrollTo(0,0);observe();wirePage();", "window.__EUROWINDOW_LENIS__?window.__EUROWINDOW_LENIS__.scrollTo(0,{immediate:true}):window.scrollTo(0,0);observe();wirePage();");
script = script.replace("document.querySelector('#main').innerHTML=html;prefixLinks();const titles=", "document.querySelector('#main').innerHTML=html;prefixLinks();const main=document.querySelector('#main');main.classList.toggle('home-page',p==='/');if(homeMotionCleanup){homeMotionCleanup();homeMotionCleanup=null;}if(p==='/')homeMotionCleanup=setupHomeMotion();const titles=");
script = script.replace("if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}", "if(e.isIntersecting)e.target.classList.add('visible');else e.target.classList.remove('visible')");
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
      if(entry.isIntersecting)entry.target.classList.add('home-motion-visible');
      else entry.target.classList.remove('home-motion-visible');
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
.brand-image{width:clamp(160px,16vw,210px);height:50px;display:flex;align-items:center;flex:none}
.brand-image img{width:100%;height:100%;object-fit:contain;object-position:left center}
.footer .brand-image{width:220px;height:54px;filter:brightness(0) invert(1)}
@media(max-width:700px){.brand-image{width:min(48vw,165px);height:42px}.footer .brand-image{width:210px;height:50px}.nav{color:#fff}.site-header.scrolled .nav{color:var(--navy)}}
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
.site-header .head-cta{display:inline-flex;align-items:center;justify-content:center;gap:9px;padding:12px 17px;border:1px solid #72afe0;background:linear-gradient(120deg,#174f84 0%,#246da8 58%,#3b82ba 100%);color:#fff;box-shadow:0 8px 24px #071d3566;font-weight:800;letter-spacing:.09em;transition:background .25s ease,border-color .25s ease,box-shadow .25s ease,transform .25s ease}
.site-header .head-cta:hover{color:#fff;border-color:#b5dcf7;background:linear-gradient(120deg,#205f98 0%,#317cb8 58%,#4e96ca 100%);box-shadow:0 11px 28px #071d357a;transform:translateY(-2px)}
.site-header .head-cta:active{transform:translateY(0)}
@media(max-width:700px){
body{font-size:15px}
.nav{font-size:10px}
.head-inner{gap:12px}.brand-image{width:min(40vw,165px)}.head-cta{padding:9px 10px;font-size:9px;letter-spacing:.06em}
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
#main.home-page .project-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;align-items:stretch}
#main.home-page .project-grid>.project-card{min-width:0;align-self:stretch}
#main.home-page .project-grid>.project-card:nth-child(2),#main.home-page .project-grid>.project-card:nth-child(3){margin-top:0!important}
#main.home-page .project-grid>.project-card .project-image{height:clamp(280px,27vw,390px)}
#main.home-page .hero h1{font-size:clamp(44px,5.6vw,90px);max-width:1320px}
#main.home-page .hero{height:100vh;height:100svh;min-height:100vh;min-height:100svh}
#main.home-page .hero-content{padding:150px 0 86px}
#main.home-page .hero-image{opacity:.9}
#main.home-page .hero-image:after{background:linear-gradient(180deg,transparent 58%,var(--cream) 100%),linear-gradient(90deg,rgba(5,24,46,.52) 0%,rgba(5,24,46,.3) 48%,rgba(5,24,46,.08) 100%),linear-gradient(0deg,rgba(5,24,46,.4) 0%,transparent 60%)}
#main.home-page .hero-meta,#main.home-page .scroll-note{color:var(--navy)}
#main.home-page .scroll-note:before{background:var(--blue)}
#main.home-page .hero-video{position:absolute;inset:0;overflow:hidden;pointer-events:none}
#main.home-page .hero-image img{position:absolute;inset:0;z-index:0}
#main.home-page .hero-image:after{z-index:2;pointer-events:none}
#main.home-page .hero-video{z-index:1}
#main.home-page .hero-content,#main.home-page .hero-meta,#main.home-page .scroll-note{z-index:3}
#main.home-page .hero-video video{position:absolute;left:50%;top:50%;width:100vw;height:56.25vw;min-width:177.78vh;min-height:100vh;object-fit:cover;transform:translate(-50%,-50%);border:0}
@media(max-width:1000px){#main.home-page .project-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:700px){#main.home-page .project-grid{grid-template-columns:1fr}#main.home-page .project-grid>.project-card:nth-child(3){display:block}#main.home-page .project-grid>.project-card .project-image{height:360px}#main.home-page .hero h1{font-size:clamp(40px,10.5vw,56px);max-width:100%}#main.home-page .hero-content{padding:112px 0 76px}}
@media(max-height:700px) and (max-width:700px){#main.home-page .hero-content{padding:88px 0 55px}}
@media(max-height:820px) and (min-width:701px){#main.home-page .hero h1{font-size:clamp(42px,5vw,72px)}#main.home-page .hero-content{padding:118px 0 68px}}
@media(max-height:520px) and (min-width:701px){#main.home-page .hero-content{padding:96px 0 24px}#main.home-page .hero h1{font-size:clamp(34px,4.6vh,48px);margin:12px 0}.hero .eyebrow{font-size:9px}.hero-copy{font-size:13px;line-height:1.4}.hero-actions{margin-top:18px}.hero-meta{display:none}.scroll-note{bottom:12px}}
#main [style*="#d8d2c4"]{background:linear-gradient(135deg,#dce8f3,#f1f6fb)!important}
`;

const aluminumStyles = `
.system-marquee{overflow:hidden;position:relative}
.system-track{display:flex;flex-wrap:nowrap!important;grid-template-columns:none;width:max-content;gap:14px;overflow:visible;padding:0;animation:system-scroll-right 72s linear infinite!important;animation-duration:72s!important;animation-iteration-count:infinite!important}
.system-section.is-paused .system-track,.system-marquee:hover .system-track,.system-marquee:focus-within .system-track{animation-play-state:paused}
.system-card{flex:0 0 clamp(245px,23vw,320px)}
.system-card small{display:block;color:var(--gold2);font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-top:12px}
.system-marquee-control{margin-top:18px;border:1px solid #ffffff55;background:transparent;color:#fff;padding:9px 13px;font:600 11px var(--display);cursor:pointer}
.system-marquee-control:hover,.system-marquee-control:focus-visible{background:#ffffff18}
@keyframes system-scroll-right{from{transform:translateX(-50%)}to{transform:translateX(0)}}
.product-family-catalog .door-catalog-grid{align-items:stretch}
.product-family-catalog .door-catalog-card{display:flex;flex-direction:column;height:100%}
.product-family-catalog .door-catalog-visual{height:clamp(330px,22vw,370px);padding:14px;background:#f8fafc}
.product-family-catalog .door-catalog-visual img{display:block;width:min(100%,300px);height:min(100%,300px);object-fit:contain;object-position:center}
.product-family-catalog .door-catalog-info{display:flex;flex:1;flex-direction:column}
.product-family-catalog .door-catalog-info{background:#f3f6f9}
.product-family-catalog .door-catalog-info h3{text-align:left;min-height:52px;font-size:15px;line-height:1.45}
.product-family-catalog .door-catalog-info .button{align-self:flex-start;margin:0 0 14px;background:var(--navy);border-color:var(--navy)}
.product-guide{background:#edf3f8}
.product-guide-layout{display:grid;grid-template-columns:minmax(360px,.95fr) minmax(0,1.05fr);gap:clamp(24px,3vw,42px);align-items:stretch}
.product-guide-gallery{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);grid-template-rows:repeat(2,minmax(0,1fr));gap:12px;min-height:560px}
.product-guide-gallery-item{position:relative;min-width:0;min-height:0;margin:0;overflow:hidden;background:#dfe8ef}
.product-guide-gallery-item:first-child{grid-row:span 2}
.product-guide-gallery-item img{display:block;width:100%;height:100%;object-fit:cover;transition:transform .6s cubic-bezier(.2,.7,.2,1)}
.product-guide-gallery-item:hover img{transform:scale(1.035)}
.product-guide-gallery-item:after{position:absolute;inset:45% 0 0;content:"";background:linear-gradient(transparent,#071c33a8);pointer-events:none}
.product-guide-gallery-item figcaption{position:absolute;z-index:1;left:16px;right:16px;bottom:15px;color:#fff;font-size:11px;font-weight:600;line-height:1.4}
.product-guide-gallery-count-2{grid-template-columns:1.15fr .85fr;grid-template-rows:minmax(400px,1fr);min-height:420px}
.product-guide-gallery-count-2 .product-guide-gallery-item:first-child{grid-row:auto}
.product-guide-gallery-count-1{grid-template-columns:1fr;grid-template-rows:minmax(440px,1fr);min-height:460px}
.product-guide-gallery-count-1 .product-guide-gallery-item:first-child{grid-row:auto}
.product-guide-copy{display:flex;flex-direction:column;justify-content:center;gap:24px}
.product-guide-topic+.product-guide-topic{padding-top:20px;border-top:1px solid #cbd8e4}
.product-guide-label{display:block;margin-bottom:12px;color:#3479b8;font-size:9px;font-weight:700;letter-spacing:.13em}
.product-guide-point-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.product-guide-point{min-width:0;padding:15px 16px 16px;background:#fff;border-top:2px solid #2873b7}
.product-guide-point h3,.product-guide-application h3{margin:0 0 6px;color:var(--navy);font-size:14px;line-height:1.35}
.product-guide-point p,.product-guide-application p{margin:0;color:var(--muted);font-size:12px;line-height:1.6}
.product-guide-application-list{display:grid}
.product-guide-application{display:grid;grid-template-columns:20px minmax(0,1fr);gap:10px;padding:10px 0;border-bottom:1px solid #d4dee7}
.product-guide-application:first-child{padding-top:0}
.product-guide-application:last-child{padding-bottom:0;border-bottom:0}
.product-guide-application-mark{width:7px;height:7px;margin:5px 0 0 3px;background:#2b78b7;transform:rotate(45deg)}
.product-guide-subhead{margin:52px 0 22px}
.product-guide-subhead h3{margin:12px 0 0;color:var(--navy);font-size:clamp(27px,3vw,38px);line-height:1.15}
@media(max-width:1000px){.product-guide-layout{grid-template-columns:1fr}.product-guide-gallery{min-height:440px}.product-guide-copy{display:grid;grid-template-columns:1fr 1fr;gap:22px;align-items:start}.product-guide-topic+.product-guide-topic{padding:0 0 0 22px;border-top:0;border-left:1px solid #cbd8e4}}
@media(max-width:700px){.product-family-catalog .door-catalog-visual{height:300px;padding:12px}.product-family-catalog .door-catalog-visual img{width:min(100%,276px);height:min(100%,276px)}.product-family-catalog .door-catalog-info h3{min-height:0}.product-guide-gallery{grid-template-columns:1.1fr .9fr;grid-template-rows:repeat(2,minmax(135px,1fr));min-height:290px;gap:8px}.product-guide-gallery-item:first-child{grid-row:span 2}.product-guide-gallery-count-2{grid-template-rows:minmax(230px,1fr);min-height:240px}.product-guide-gallery-count-2 .product-guide-gallery-item:first-child{grid-row:auto}.product-guide-gallery-count-1{grid-template-columns:1fr;grid-template-rows:minmax(270px,1fr);min-height:280px}.product-guide-copy{grid-template-columns:1fr;gap:18px}.product-guide-topic+.product-guide-topic{padding:18px 0 0;border-top:1px solid #cbd8e4;border-left:0}.product-guide-point-grid{gap:8px}.product-guide-point{padding:13px}.product-guide-point h3,.product-guide-application h3{font-size:13px}.product-guide-point p,.product-guide-application p{font-size:11px}.product-guide-gallery-item figcaption{left:11px;right:11px;bottom:10px;font-size:10px}.product-guide-subhead{margin-top:36px}}
.official-aluminum-catalog .door-catalog-info{background:#f3f6f9}
.official-aluminum-catalog .door-catalog-info h3{text-align:left;min-height:52px;font-size:15px;line-height:1.45}
.official-aluminum-catalog .door-catalog-info .button{margin:0 0 14px;background:var(--navy);border-color:var(--navy)}
.official-aluminum-catalog .door-catalog-visual{background:#f8fafc}
.official-aluminum-catalog .door-catalog-visual{height:clamp(330px,22vw,370px);padding:14px}
.official-aluminum-catalog .door-catalog-visual img{display:block;width:min(100%,300px)!important;height:min(100%,300px)!important;object-fit:contain!important;object-position:center}
.aluminum-card-summary{margin:0 0 14px;color:var(--muted);font-size:13px;line-height:1.55}
.aluminum-source-link,.aluminum-inline-source a,.aluminum-source-note a{color:#174f84;text-decoration:underline;text-underline-offset:3px}
.aluminum-inline-source,.aluminum-source-note{display:none}
.aluminum-source-link{display:inline-block;margin-top:13px;font-size:12px;font-weight:600}
.aluminum-inline-source,.aluminum-source-note{margin:20px 0 0;color:var(--muted);font-size:13px;line-height:1.65}
.aluminum-benefits{background:#edf3f8}
.aluminum-benefit-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:15px}
.aluminum-benefit-grid article{padding:25px;background:#fff;border-top:3px solid #246da8}
.aluminum-benefit-grid h3{margin:0 0 10px;color:var(--navy);font-size:18px}
.aluminum-benefit-grid p{margin:0;color:var(--muted);font-size:13px;line-height:1.7}
.aluminum-pricing{background:#fff}
.aluminum-price-scroll{overflow-x:auto}
.aluminum-pricing table{width:100%;border-collapse:collapse;min-width:680px}
.aluminum-pricing th,.aluminum-pricing td{padding:16px 18px;text-align:left;border-bottom:1px solid var(--line);font-size:14px}
.aluminum-pricing th{background:var(--navy);color:#fff;font-weight:700}
.aluminum-pricing tr:nth-child(even) td{background:#f3f6f9}
.aluminum-pricing td:last-child{font-weight:700;color:var(--navy)}
.page-hero-compact{padding:112px 0 22px}.page-hero-compact .crumb{margin-bottom:12px}.page-hero-compact h1{margin:10px 0 0;font-size:clamp(42px,6vw,72px)}@media(max-width:700px){.page-hero-compact{padding:96px 0 18px}.page-hero-compact h1{font-size:48px}}.aluminum-faq{background:#edf3f8}.aluminum-faq-list{display:grid;grid-template-columns:1fr 1fr;gap:14px}.aluminum-faq-item{padding:22px 24px;background:#fff;border-left:3px solid #246da8}.aluminum-faq-item h3{margin:0 0 9px;color:var(--navy);font-size:17px}.aluminum-faq-item p{margin:0;color:var(--muted);font-size:14px;line-height:1.7}.aluminum-pricing .detail-copy{max-width:900px;margin:0 0 22px;color:var(--muted);line-height:1.8}@media(max-width:700px){.aluminum-faq-list{grid-template-columns:1fr}.aluminum-faq-item{padding:18px}}
@media(max-width:900px){.aluminum-benefit-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:700px){.aluminum-benefit-grid{grid-template-columns:1fr}.official-aluminum-catalog .door-catalog-visual{height:300px;padding:12px}.official-aluminum-catalog .door-catalog-visual img{width:min(100%,276px)!important;height:min(100%,276px)!important}.official-aluminum-catalog .door-catalog-info h3{min-height:0}}
.aluminum-overview{padding:100px 0;background:#fff}.aluminum-overview-intro{max-width:860px;margin:0 auto 46px;text-align:center}.aluminum-overview-intro h2{margin:16px 0;color:var(--navy);font:500 clamp(35px,4.6vw,58px) var(--display);line-height:1.1;letter-spacing:-.04em}.aluminum-overview-intro p{margin:0;color:var(--muted);font-size:16px;line-height:1.8}.aluminum-overview-layout{display:grid;grid-template-columns:minmax(0,.88fr) minmax(0,1.12fr);gap:clamp(32px,6vw,78px);align-items:start}.aluminum-overview-image{height:100%;min-height:510px;margin:0;background:#edf2f5}.aluminum-overview-image img{width:100%;height:100%;object-fit:cover}.aluminum-overview-copy>p{margin:0;color:var(--muted);font-size:15px;line-height:1.85}.aluminum-overview-points{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:26px 0}.aluminum-overview-points article{padding:18px;background:#f3f6f8;border-left:3px solid #246da8}.aluminum-overview-points h3,.aluminum-overview-subtitle{margin:0 0 7px;color:var(--navy);font-size:17px}.aluminum-overview-points p{margin:0;color:var(--muted);font-size:13px;line-height:1.65}.aluminum-overview-subtitle{margin-top:30px;font:600 24px var(--display)}.aluminum-overview-list{display:grid;gap:9px;margin:15px 0;padding:0;list-style:none;color:var(--muted);font-size:14px;line-height:1.65}.aluminum-overview-list li{position:relative;padding-left:18px}.aluminum-overview-list li:before{content:'•';position:absolute;left:0;color:#246da8;font-weight:700}.aluminum-overview-list strong{color:var(--navy)}.aluminum-overview-note{margin-top:22px!important;padding:14px 16px;border-left:3px solid var(--gold);background:#f6f1e6;font-size:13px!important}@media(max-width:800px){.aluminum-overview-layout{grid-template-columns:1fr}.aluminum-overview-image{min-height:360px;max-height:460px}.aluminum-overview-intro{text-align:left}.aluminum-overview-points{grid-template-columns:1fr 1fr}}@media(max-width:520px){.aluminum-overview{padding:68px 0}.aluminum-overview-intro{margin-bottom:28px}.aluminum-overview-intro p{font-size:14px}.aluminum-overview-image{min-height:290px}.aluminum-overview-points{grid-template-columns:1fr}.aluminum-overview-copy>p{font-size:14px}.aluminum-overview-subtitle{font-size:22px}}
`;
fs.writeFileSync(path.join(publicDir, 'site.css'), style[1] + blueTheme + motion + aluminumStyles);
fs.writeFileSync(path.join(publicDir, 'site-shell.html'), body[1].replaceAll('infoew@eurowindow.biz', 'info@example.com').replaceAll('kênh chính thức', 'kênh tư vấn'));
fs.writeFileSync(path.join(publicDir, 'site-script.js'), script);


