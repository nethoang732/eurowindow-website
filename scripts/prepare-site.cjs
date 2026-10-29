const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'dist', 'index.html'), 'utf8');
const publicDir = path.join(root, 'public');
const productImageManifest = JSON.parse(fs.readFileSync(path.join(root, 'lib', 'products', 'product-image-manifest.json'), 'utf8'));
const sectionContent = JSON.parse(fs.readFileSync(path.join(root, 'lib', 'content', 'site-sections.json'), 'utf8'));
fs.mkdirSync(publicDir, { recursive: true });
const pdfjsBuildDir = path.join(root, 'node_modules', 'pdfjs-dist', 'build');
const pdfjsPublicDir = path.join(publicDir, 'pdfjs');
fs.mkdirSync(pdfjsPublicDir, { recursive: true });
fs.copyFileSync(path.join(pdfjsBuildDir, 'pdf.mjs'), path.join(pdfjsPublicDir, 'pdf.js'));
fs.copyFileSync(path.join(pdfjsBuildDir, 'pdf.worker.mjs'), path.join(pdfjsPublicDir, 'pdf.worker.js'));


const style = source.match(/<style>([\s\S]*?)<\/style>/i);
const body = source.match(/<body>([\s\S]*?)<script>([\s\S]*?)<\/script>\s*<\/body>/i);
if (!style || !body) throw new Error('Could not extract the legacy website shell');
const reducedMotionCss = '@media(prefers-reduced-motion:reduce){*,*::before,*::after{scroll-behavior:auto!important;animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}.reveal{opacity:1;transform:none}}';
if (!style[1].includes(reducedMotionCss)) throw new Error('Could not find the reduced-motion rule in the legacy stylesheet');
const siteStyles = style[1]
  .replace(reducedMotionCss, '@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.35s!important;animation-iteration-count:1!important;transition-duration:.2s!important}.reveal{transform:translateY(6px);transition-duration:.25s!important}.reveal.visible{opacity:1;transform:none}}')
  .replace('@media(prefers-reduced-motion:reduce){.gallery-slide,.gallery-slide img,.gallery-lightbox,.gallery-lightbox img{transition:none}}', '@media(prefers-reduced-motion:reduce){.gallery-slide,.gallery-slide img,.gallery-lightbox,.gallery-lightbox img{transition-duration:.2s}}');

const basePatch = `
  const BASE_PATH = window.__EUROWINDOW_BASE_PATH__ || '';
  const productImageManifest=${JSON.stringify(productImageManifest)};
  if (new URLSearchParams(location.search).get('motion') === 'full') document.documentElement.dataset.motionMode = 'full';
  let homeMotionCleanup = null;
  const stripBase = (value) => {
    if (!BASE_PATH) return value;
    return value === BASE_PATH ? '/' : (value.startsWith(BASE_PATH + '/') ? value.slice(BASE_PATH.length) : value);
  };
  function prefixLinks(){
    if (!BASE_PATH) return;
    document.querySelectorAll('a[href^="/"],img[src^="/"],source[src^="/"],iframe[src^="/"]').forEach((el) => {
      const attribute = el.tagName === 'A' ? 'href' : 'src';
      const value = el.getAttribute(attribute);
      if (value !== BASE_PATH && !value.startsWith(BASE_PATH + '/')) el.setAttribute(attribute, BASE_PATH + value);
    });
  }
  const prefersReducedMotion=()=>document.documentElement.dataset.motionMode!=='full'&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
`;

let script = body[2];
const sharedCtaPattern = /const cta=\(\)=>`<section class="quote-band">[\s\S]*?<\/section>`;/;
if (!sharedCtaPattern.test(script)) throw new Error('Could not find the shared consultation banner');
script = script.replace(sharedCtaPattern, 'const cta=()=>`<section class="quote-band"><div class="wrap quote-grid"><div class="quote-copy"><span class="eyebrow">Tư vấn giải pháp cửa</span><h2 class="serif">Nhận tư vấn<br><span class="gold">giải pháp phù hợp</span></h2><p>Chia sẻ nhu cầu, đội ngũ Eurowindow sẽ hỗ trợ bạn nhanh chóng.</p></div>${form(true)}</div></section>`;');
const aboutValuesSectionPattern = /<section class="about-values"[\s\S]*?<\/section>/;
if (!aboutValuesSectionPattern.test(script)) throw new Error('Could not find the About page values section');
script = script.replace(aboutValuesSectionPattern, '');
let shell = body[1];
shell = shell.replace('<a href="/du-an">Công trình</a>', '<a data-next-route="true" href="/cong-trinh-tieu-bieu/">Công trình tiêu biểu</a><a data-next-route="true" href="/showroom/">Hệ thống showroom</a>');
shell = shell.replace('<a href="/tin-tuc">Góc kiến trúc</a>', '<a data-next-route="true" href="/tin-tuc/">Tin tức</a><a data-next-route="true" href="/chinh-sach/">Chính sách</a>');
const sectionProjectCards = sectionContent.projects.map((project) => ({
  slug: project.slug, name: project.name, type: sectionContent.projectCategories.find((category) => category.slug === project.category)?.name || 'Công trình',
  place: project.city || project.location || '', image: project.image, desc: project.summary || ''
}));
const sectionPostCards = sectionContent.articles.map((article) => ({
  slug: article.slug, title: article.title,
  topic: sectionContent.newsCategories.find((category) => category.slug === article.category)?.name || 'Tin tức',
  date: article.date.split('-').reverse().join('.'), image: article.image, desc: article.summary
}));
script = script.replace(/const projects=\[[\s\S]*?\];/, 'const projects=' + JSON.stringify(sectionProjectCards) + ';');
const featuredNewsCards = [...sectionContent.articles].sort((left, right) => right.date.localeCompare(left.date)).slice(0, 3).map((article) => ({
  slug: article.slug, title: article.title,
  topic: sectionContent.newsCategories.find((category) => category.slug === article.category)?.name || 'Tin t\u1ee9c',
  date: article.date.split('-').reverse().join('.'), image: article.image, desc: article.summary
}));
script = script.replace(/const posts=\[[\s\S]*?\];/, 'const posts=' + JSON.stringify(sectionPostCards) + ';const featuredPosts=' + JSON.stringify(featuredNewsCards) + ';');
script = script.replace('<div class="news-grid">${posts.slice(0,3).map(featuredPostCard).join(\'\')}</div></div></section>', '<div class="news-grid">${featuredPosts.map(featuredPostCard).join(\'\')}</div></div></section>');
script = script.replace('07 / G\u00f3c ki\u1ebfn tr\u00fac', '05 / TIN T\u1ee8C');
script = script.replace('\u00dd t\u01b0\u1edfng cho kh\u00f4ng gian', 'Tin t\u1ee9c v\u00e0 ho\u1ea1t \u0111\u1ed9ng');

script = script.replace('href="/du-an/' + String.fromCharCode(36) + '{x.slug}"', 'data-next-route="true" href="/cong-trinh-tieu-bieu/' + String.fromCharCode(36) + '{x.slug}/"');
script = script.replace('href="/tin-tuc/' + String.fromCharCode(36) + '{x.slug}"', 'data-next-route="true" href="/tin-tuc/' + String.fromCharCode(36) + '{x.slug}/"');
script = script.replace("if(!a||a.hasAttribute('download')", "if(!a||document.querySelector('#main[data-server-route]')||a.hasAttribute('data-next-route')||a.hasAttribute('download')");
const cataloguePage = "\n  function cataloguePage(){\n    const file='/data/catalogue-eurowindow-2024.pdf';\n    const icon=(d)=>'<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"'+d+'\"/></svg>';\n    return '<div class=\"catalogue-page\"><section class=\"catalogue-hero\" aria-labelledby=\"catalogue-title\"><img class=\"catalogue-hero-image\" src=\"/images/sections/toa-thap-kinh-minh-hoa.webp\" alt=\"\" fetchpriority=\"high\" decoding=\"async\"><div class=\"catalogue-hero-shade\"></div><div class=\"wrap catalogue-hero-inner\"><nav class=\"catalogue-breadcrumb\" aria-label=\"Đường dẫn trang\"><a href=\"/\">Trang chủ</a><span aria-hidden=\"true\">/</span><span aria-current=\"page\">Tài liệu</span></nav><p class=\"catalogue-kicker\"><span></span>Tài liệu</p><h1 id=\"catalogue-title\">Catalogue <span>Eurowindow</span></h1><p class=\"catalogue-hero-copy\">Khám phá danh mục sản phẩm và giải pháp cửa Eurowindow<br class=\"catalogue-desktop-break\"> qua tài liệu catalogue được cập nhật mới nhất.</p></div></section><section class=\"catalogue-content\" aria-label=\"Xem và tải catalogue\"><div class=\"wrap catalogue-layout\"><div class=\"catalogue-viewer-wrap\"><div class=\"catalogue-viewer\" data-pdf-viewer><div class=\"catalogue-pdf-toolbar\" role=\"toolbar\" aria-label=\"Điều khiển xem Catalogue\"><div class=\"catalogue-pdf-tools\"><button type=\"button\" data-pdf-action=\"first\" aria-label=\"Trang đầu\" title=\"Trang đầu\">▦</button><button type=\"button\" data-pdf-action=\"previous\" aria-label=\"Trang trước\" title=\"Trang trước\">‹</button><button type=\"button\" data-pdf-action=\"next\" aria-label=\"Trang sau\" title=\"Trang sau\">›</button><input type=\"number\" min=\"1\" value=\"1\" data-pdf-page-input aria-label=\"Số trang\"><span>/ <span data-pdf-page-count>53</span></span></div><div class=\"catalogue-pdf-tools\"><button type=\"button\" data-pdf-action=\"zoom-out\" aria-label=\"Thu nhỏ\" title=\"Thu nhỏ\">−</button><span class=\"catalogue-pdf-zoom\" data-pdf-zoom>100%</span><button type=\"button\" data-pdf-action=\"zoom-in\" aria-label=\"Phóng to\" title=\"Phóng to\">+</button><button type=\"button\" data-pdf-action=\"fit\" aria-label=\"Vừa chiều rộng\" title=\"Vừa chiều rộng\">↔</button><button type=\"button\" data-pdf-action=\"fullscreen\" aria-label=\"Toàn màn hình\" title=\"Toàn màn hình\">⛶</button></div></div><div class=\"catalogue-pdf-stage\" data-pdf-stage><canvas data-pdf-canvas aria-label=\"Trang Catalogue hiện tại\"></canvas><p class=\"catalogue-pdf-status\" data-pdf-status role=\"status\" aria-live=\"polite\">Đang tải bản xem trước Catalogue...</p></div><div class=\"catalogue-pdf-thumbnails\" data-pdf-thumbnails aria-label=\"Chọn trang Catalogue\"></div></div><div class=\"catalogue-viewer-caption\"><span>Catalogue Eurowindow 2024</span><span>PDF / 53 trang</span></div></div><aside class=\"catalogue-side\"><div class=\"catalogue-info-card\"><p class=\"catalogue-kicker\"><span></span>Ấn phẩm sản phẩm</p><h2>Catalogue Eurowindow 2024</h2><p class=\"catalogue-description\">Tài liệu giới thiệu các giải pháp và sản phẩm Eurowindow. Bạn có thể xem từng trang trong khung xem trước hoặc tải toàn bộ catalogue về thiết bị.</p><dl class=\"catalogue-facts\"><div>'+icon('M7 3h7l5 5v13H7z M14 3v5h5 M10 13h6 M10 17h6')+'<dt>Ấn bản</dt><dd>2024</dd></div><div>'+icon('M7 3h7l5 5v13H7z M14 3v5h5 M10 13h6 M10 17h6')+'<dt>Định dạng</dt><dd>PDF</dd></div><div>'+icon('M7 3h7l5 5v13H7z M14 3v5h5 M10 13h6 M10 17h6')+'<dt>Số trang</dt><dd>53 trang</dd></div><div>'+icon('M6 7c0-2 12-2 12 0s-12 2-12 0Zm0 5c0 2 12 2 12 0M6 7v10c0 2 12 2 12 0V7 M6 12c0 2 12 2 12 0')+'<dt>Dung lượng</dt><dd>8,8 MB</dd></div></dl><a class=\"button catalogue-download\" href=\"'+file+'\" download=\"Catalogue Eurowindow 2024.pdf\">'+icon('M12 3v12m0 0 4-4m-4 4-4-4 M5 17v4h14v-4')+'Tải catalogue <span aria-hidden=\"true\">→</span></a></div><div class=\"catalogue-note\">'+icon('M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Zm0-15v5m0 4h.01')+'<p>Bản xem trước hiển thị từng trang ngay trong khung. Nhấn Tải catalogue nếu cần lưu bản PDF.</p></div></aside></div></section></div>'+cta();\n  }\n";
script = script.replace('  function render(){', cataloguePage + '\n  function render(){', "  function render(){if(document.querySelector('#main[data-server-route]'))return;");
const navigationPattern = /<nav class="nav" id="nav" aria-label="Điều hướng chính">[\s\S]*?<\/nav>/;
if (!navigationPattern.test(shell)) throw new Error('Could not find the primary navigation in the site shell');
const navigationMarkup = "<nav class=\"nav\" id=\"nav\" aria-label=\"Điều hướng chính\">\n      <div class=\"nav-dropdown nav-dropdown-about\"><div class=\"nav-dropdown-head\"><a class=\"nav-dropdown-trigger\" href=\"/gioi-thieu\" aria-haspopup=\"true\">Giới thiệu</a><button class=\"nav-dropdown-toggle\" type=\"button\" aria-label=\"Mở menu Giới thiệu\" aria-expanded=\"false\">⌄</button></div><div class=\"nav-dropdown-menu\"><a href=\"/gioi-thieu\">Về chúng tôi</a></div></div>\n      <div class=\"nav-dropdown nav-dropdown-products\"><div class=\"nav-dropdown-head\"><a class=\"nav-dropdown-trigger\" href=\"/san-pham\" aria-haspopup=\"true\">Sản phẩm</a><button class=\"nav-dropdown-toggle\" type=\"button\" aria-label=\"Mở menu Sản phẩm\" aria-expanded=\"false\">⌄</button></div><div class=\"nav-dropdown-menu nav-dropdown-menu-products\"><a href=\"/san-pham/cua-nhom/\">Cửa nhôm</a><a href=\"/san-pham/cua-upvc/\">Cửa uPVC</a><a href=\"/san-pham/cua-go/\">Cửa gỗ</a><a href=\"/san-pham/cua-cuon/\">Cửa cuốn</a><a href=\"/san-pham/cua-thong-minh-the-he-moi/\">Cửa thông minh</a><a href=\"/san-pham/vach-kinh-mat-dung/\">Kính &amp; Vách kính</a></div></div>\n<a data-next-route=\"true\" href=\"/showroom/\">Showroom</a>\n      <div class=\"nav-dropdown nav-dropdown-projects\"><div class=\"nav-dropdown-head\"><a data-next-route=\"true\" class=\"nav-dropdown-trigger\" href=\"/cong-trinh-tieu-bieu/\" aria-haspopup=\"true\">Công trình</a><button class=\"nav-dropdown-toggle\" type=\"button\" aria-label=\"Mở menu Công trình\" aria-expanded=\"false\">⌄</button></div><div class=\"nav-dropdown-menu\"><a data-next-route=\"true\" href=\"/cong-trinh-tieu-bieu/\">Tất cả công trình</a><a data-next-route=\"true\" href=\"/cong-trinh-tieu-bieu/cong-trinh-cap-quoc-gia/\">Công trình cấp quốc gia</a><a data-next-route=\"true\" href=\"/cong-trinh-tieu-bieu/toa-nha-van-phong-chung-cu/\">Tòa nhà văn phòng – chung cư</a><a data-next-route=\"true\" href=\"/cong-trinh-tieu-bieu/cong-trinh-dan-dung/\">Công trình dân dụng</a></div></div>\n      <div class=\"nav-dropdown nav-dropdown-news\"><div class=\"nav-dropdown-head\"><a data-next-route=\"true\" class=\"nav-dropdown-trigger\" href=\"/tin-tuc/\" aria-haspopup=\"true\">Tin tức</a><button class=\"nav-dropdown-toggle\" type=\"button\" aria-label=\"Mở menu Tin tức\" aria-expanded=\"false\">⌄</button></div><div class=\"nav-dropdown-menu\"><a data-next-route=\"true\" href=\"/tin-tuc/\">Tất cả tin tức</a><a data-next-route=\"true\" href=\"/tin-tuc/tin-tuc-su-kien/\">Tin tức sự kiện</a><a data-next-route=\"true\" href=\"/tin-tuc/tin-du-an/\">Tin dự án</a><a data-next-route=\"true\" href=\"/tin-tuc/tin-noi-bo/\">Tin nội bộ</a><a data-next-route=\"true\" href=\"/tin-tuc/tin-khuyen-mai/\">Tin khuyến mãi</a><a data-next-route=\"true\" href=\"/tin-tuc/tu-van/\">Tư vấn</a><a data-next-route=\"true\" href=\"/tin-tuc/video/\">Video</a></div></div>\n      <div class=\"nav-dropdown nav-dropdown-policies\"><div class=\"nav-dropdown-head\"><a data-next-route=\"true\" class=\"nav-dropdown-trigger\" href=\"/chinh-sach/\" aria-haspopup=\"true\">Chính sách</a><button class=\"nav-dropdown-toggle\" type=\"button\" aria-label=\"Mở menu Chính sách\" aria-expanded=\"false\">⌄</button></div><div class=\"nav-dropdown-menu\"><a data-next-route=\"true\" href=\"/chinh-sach/bao-hanh/\">Chính sách bảo hành</a></div></div>\n      <a href=\"/lien-he\">Liên hệ</a>\n    </nav>";
const navigationWithoutAdviceAndVideo = navigationMarkup.replace(/<a data-next-route="true" href="\/tin-tuc\/(?:tu-van|video)\/">[^<]*<\/a>/g, '');
shell = shell.replace(navigationPattern, navigationWithoutAdviceAndVideo.replace('href="/lien-he">','href="/bao-gia">'));
shell = shell.replace(/(<a href="\/gioi-thieu">[^<]+<\/a>)(<\/div><\/div>)/, '$1<a href="/catalogue">Catalogue</a>$2');
const galleryMotionPattern = /const start=\(\)=>\{if\(window\.matchMedia\('\(prefers-reduced-motion: reduce\)'\)\.matches\)return;/;
if (!galleryMotionPattern.test(script)) throw new Error('Could not find the product gallery motion preference check');
script = script.replace(galleryMotionPattern, 'const start=()=>{if(prefersReducedMotion())return;');
script = script.replace(
  'const start=()=>{if(prefersReducedMotion())return;clearInterval(timer);timer=setInterval(()=>show(current+1),5200)};',
  'const start=()=>{clearInterval(timer);timer=null};'
);
script = script.replaceAll('Chọn cửa phù hợp', 'Chọn Cửa phù hợp');
script = script.replaceAll('kênh chính thức', 'kênh tư vấn');
const homepageCategoriesPattern = /(const categories=\[[\s\S]*?\];)/;
if (!homepageCategoriesPattern.test(script)) throw new Error('Could not find the homepage product categories');
script = script.replace(homepageCategoriesPattern, `$1
  const productCategoryImages={
    'cua-nhom':{src:'/images/door-reference/nhom-Cua-nhom-mo-quay-2-canh.jpg',alt:'Cửa nhôm kính hai cánh mở quay Eurowindow'},
    'cua-upvc':{src:'/images/eurowindow-products/cua-di-upvc-2-canh-mo-truot-eurowindow.webp',alt:'Cửa đi uPVC hai cánh mở trượt Eurowindow'},
    'cua-go':{src:'/images/eurowindow-products/cua-go-tu-nhien-eurowindow.webp',alt:'Cửa gỗ tự nhiên Eurowindow'},
    'cua-cuon':{src:'/images/eurowindow-products/cua-cuon-nhom-khe-thoang-easd45-eurowindow.webp',alt:'Cửa cuốn nhôm khe thoáng EASD45 Eurowindow'},
    'cua-thong-minh-the-he-moi':{src:'/images/eurowindow-products/cua-di-tu-dong-mo-truot-2-hoac-4-canh-eurowindow.webp',alt:'Cửa trượt tự động Eurowindow'},
    'vach-kinh-mat-dung':{src:'/images/eurowindow-products/vach-nhom-kinh-unitized-eurowindow.webp',alt:'Vách kính mặt dựng Eurowindow'}
  };
  window.__EUROWINDOW_PRODUCT_CATEGORY_IMAGES__=productCategoryImages;
  categories.forEach(category=>{if(productCategoryImages[category.slug])category.image=productCategoryImages[category.slug].src});`);
script = script.replace('  const img=', `  function installImageFallbacks(){
    if(window.__EUROWINDOW_IMAGE_FALLBACKS__)return;
    window.__EUROWINDOW_IMAGE_FALLBACKS__=true;
    const fallbacks=[
      ['/san-pham/cua-nhom','/images/door-reference/nhom-Cua-nhom-mo-quay-2-canh.jpg'],
      ['/san-pham/cua-upvc','/images/eurowindow-products/cua-di-upvc-2-canh-mo-truot-eurowindow.webp'],
      ['/san-pham/cua-go','/images/eurowindow-products/cua-go-tu-nhien-eurowindow.webp'],
      ['/san-pham/cua-cuon','/images/eurowindow-products/cua-cuon-nhom-khe-thoang-easd45-eurowindow.webp'],
      ['/san-pham/cua-thong-minh','/images/eurowindow-products/cua-di-tu-dong-mo-truot-2-hoac-4-canh-eurowindow.webp'],
      ['/san-pham/vach-kinh','/images/eurowindow-products/kinh-an-toan-eurowindow.webp']
    ];
    document.addEventListener('error',event=>{
      const image=event.target;
      if(!(image instanceof HTMLImageElement))return;
      const stage=Number(image.dataset.fallbackStage||0),href=image.closest('a[href]')?.getAttribute('href')||'',alt=(image.alt||'').toLocaleLowerCase('vi');
      if(stage===0){
        const mapped=fallbacks.find(([route])=>href.startsWith(route)||alt.includes(route.split('/').pop().replace('cua-','').replaceAll('-',' ')))?.[1];
        const fallback=mapped||'/eurowindow-building.jpg';
        if(image.getAttribute('src')!==fallback){image.dataset.fallbackStage='1';image.removeAttribute('srcset');image.src=fallback;return}
      }
      image.dataset.fallbackStage='2';image.removeAttribute('srcset');
      const label=(image.alt||'Ảnh sản phẩm Eurowindow').replace(/[&<>\"]/g,' ').slice(0,44);
      image.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 640"><rect width="960" height="640" fill="#e7eef4"/><path d="M0 470 220 280l150 135 180-220 410 300v145H0z" fill="#c9d9e7"/><path d="M0 520h960" stroke="#9ab5cb" stroke-width="8"/><text x="480" y="570" text-anchor="middle" fill="#174f84" font-family="Arial,sans-serif" font-size="24">'+label+'</text></svg>');
    },true);
  }
  const img=`);
script = script.replace("const pics=(obj,w=1000)=>img(obj.image,w);", "const pics=(obj,w=1000)=>obj.image.startsWith('http')||obj.image.startsWith('/')?obj.image:img(obj.image,w);");
script = script.replace('src="${img(x.image)}"', 'src="${pics(x)}"');
script = script.replace(
  "document.querySelector('#menuBtn').addEventListener('click'",
  "const navDropdowns=[...document.querySelectorAll('.nav-dropdown')];const closeOtherDropdowns=active=>navDropdowns.forEach(item=>{if(item===active)return;item.classList.add('is-dismissed');item.classList.remove('open');item.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded','false')});navDropdowns.forEach(dropdown=>{const trigger=dropdown.querySelector('.nav-dropdown-trigger');const activate=()=>{closeOtherDropdowns(dropdown);dropdown.classList.remove('is-dismissed')};trigger?.addEventListener('pointerenter',activate);trigger?.addEventListener('focus',activate);dropdown.querySelectorAll('.nav-dropdown-menu a').forEach(link=>link.addEventListener('click',()=>{dropdown.classList.add('is-dismissed');dropdown.classList.remove('open');dropdown.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded','false')}))});document.querySelectorAll('.nav-dropdown-toggle').forEach(button=>button.addEventListener('click',()=>{const dropdown=button.closest('.nav-dropdown');const open=!dropdown.classList.contains('open');closeOtherDropdowns(dropdown);dropdown.classList.toggle('open',open);dropdown.classList.remove('is-dismissed');button.setAttribute('aria-expanded',String(open))}));const toggleMobileMenu=button=>{const nav=document.querySelector('#nav');if(!nav)return;const open=nav.classList.toggle('open');button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?'Đóng menu':'Mở menu');button.textContent=open?'×':'☰'};document.addEventListener('click',event=>{const button=event.target instanceof Element?event.target.closest('#menuBtn'):null;if(!button)return;const nav=document.querySelector('#nav');if(!nav)return;const open=nav.classList.toggle('open');button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?'\u0110\u00f3ng menu':'M\u1edf menu');button.textContent=open?'\u00d7':'\u2630'});document.querySelector('#nav')?.addEventListener('click',event=>{const link=event.target instanceof Element?event.target.closest('a'):null;if(!link)return;const nav=document.querySelector('#nav');nav?.classList.remove('open');const button=document.querySelector('#menuBtn');button?.setAttribute('aria-expanded','false');button?.setAttribute('aria-label','M\u1edf menu');if(button)button.textContent='\u2630';document.querySelectorAll('.nav-dropdown').forEach(item=>{item.classList.remove('open');item.classList.remove('is-dismissed');item.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded','false')})});document.querySelector('#menuBtn').addEventListener('click'"
);
script = script.replace(
  "document.querySelector('#menuBtn').addEventListener('click'",
  "document.addEventListener('click',event=>{if(!event.target.closest('.nav-dropdown'))document.querySelectorAll('.nav-dropdown').forEach(item=>{item.classList.add('is-dismissed');item.classList.remove('open');item.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded','false')})});document.addEventListener('keydown',event=>{if(event.key!=='Escape')return;const active=event.target instanceof Element?event.target:null;const dropdown=active?.closest('.nav-dropdown:not(.is-dismissed)')||document.querySelector('.nav-dropdown.open');if(dropdown){dropdown.classList.add('is-dismissed');dropdown.classList.remove('open');const toggle=dropdown.querySelector('.nav-dropdown-toggle');toggle?.setAttribute('aria-expanded','false');toggle?.focus();return}const nav=document.querySelector('#nav.open');if(nav){nav.classList.remove('open');const button=document.querySelector('#menuBtn');button?.setAttribute('aria-expanded','false');button?.setAttribute('aria-label','M? menu');if(button)button.textContent='?';button?.focus()}});document.querySelector('#menuBtn').addEventListener('click'"
);
script = script.replace("'/gioi-thieu':'Tiên phong, Kiến tạo, Đồng hành',", "'/gioi-thieu':'Tiên phong, Kiến tạo, Đồng hành',");
const featuredSystemPattern = /<section class="section system-section">[\s\S]*?<\/section>/;
if (!featuredSystemPattern.test(script)) throw new Error('Could not find the featured systems section');
  script = script.replace(featuredSystemPattern, '${featuredAluminumSystems(true)}');
let aluminumPage = fs.readFileSync(path.join(root, 'scripts', 'aluminum-page.js'), 'utf8');
const aluminumArticleText = fs.readFileSync(path.join(root, 'scripts', 'cua-nhom-content.txt'), 'utf8').replace(/^\uFEFF/, '').trim();
const aluminumArticleEscape = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const aluminumArticleMarkup = aluminumArticleText.split(/\r?\n/).filter(line => line.trim()).map(line => {
  const trimmed = line.trim();
  const illustration = trimmed.match(/^\[\[IMAGE\|([^|]+)\|(.+)\]\]$/);
  if (illustration) {
    const [, src, alt] = illustration;
    if (!src.startsWith('/images/') || !fs.existsSync(path.join(publicDir, src.slice(1)))) {
      throw new Error(`Aluminum article illustration is missing or invalid: ${src}`);
    }
    return `<figure class="aluminum-editorial-figure"><img src="${aluminumArticleEscape(src)}" alt="${aluminumArticleEscape(alt)}" loading="lazy" decoding="async"></figure>`;
  }
  const text = aluminumArticleEscape(trimmed);
  const tag = /^\d+\.\d+\.\d+\./.test(text) ? 'h4' : /^\d+\.\d+\./.test(text) ? 'h3' : /^\d+\./.test(text) ? 'h2' : 'p';
  return `<${tag}>${text}</${tag}>`;
}).join('\n');
const aluminumArticleHtml = `<section class="section aluminum-editorial"><div class="wrap"><article class="aluminum-editorial-content">${aluminumArticleMarkup}</article></div></section>`;
const aluminumArticleSection = `function aluminumArticleSection(){return ${JSON.stringify(aluminumArticleHtml)}}`;
const aluminumTailPattern = /<section class="aluminum-overview">[\s\S]*?<section class="quote-band">[\s\S]*?<\/section>/;
if (!aluminumTailPattern.test(aluminumPage)) throw new Error('Could not find the old aluminum content tail');
aluminumPage = aluminumPage.replace(aluminumTailPattern, '${aluminumArticleSection()}<section class="quote-band"><div class="wrap quote-grid"><div><span class="eyebrow">TƯ VẤN CỬA NHÔM</span><h2 class="serif">Chọn Cửa phù hợp<br><span class="gold">với công trình của bạn</span></h2><p>Chia sẻ vị trí lắp, kích thước ô chờ và nhu cầu sử dụng để được tư vấn lựa chọn.</p></div>${form(true)}</div></section>');
aluminumPage += `
  function featuredAluminumSystems(homePage=false){
    const grouped=new Map();
    aluminumProducts.forEach(item=>{if(!grouped.has(item.system))grouped.set(item.system,[]);grouped.get(item.system).push(item)});
    systems.splice(0,systems.length,...[...grouped.entries()].map(([system,items])=>{
      const name=system.replace(/^Hệ\\s+/,'');
      const types=[...new Set(items.map(item=>item.type))].join(' & ');
      const openings=[...new Set(items.map(item=>item.opening))].join(', ');
      const slug=name.toLocaleLowerCase('vi').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
      return {slug,name,type:types,desc:types+'; các kiểu mở gồm '+openings+'.',image:items[0].image,spec:system};
    }));
    const cards=systems.map(system=>({name:system.name,type:system.type,desc:system.desc,image:system.image,href:'/san-pham/cua-nhom/?he='+encodeURIComponent(system.name)}));
    const families=[['cua-upvc','uPVC'],['cua-go','Cửa gỗ'],['cua-thong-minh-the-he-moi','Cửa thông minh']];
    families.forEach(([slug,label])=>{
      const groups=new Map();
      (productCatalogData[slug]||[]).forEach(row=>{const variant=row[4];if(!groups.has(variant))groups.set(variant,[]);groups.get(variant).push(row)});
      groups.forEach((rows,variant)=>{
        const [name,image,type,configuration]=rows[0];
        cards.push({name:variant,type:label,desc:type+' · '+configuration,image:productCatalogImage(image),href:'/san-pham/'+slug+'?he='+encodeURIComponent(variant)});
      });
    });
    cards.splice(0,cards.length,
      {name:'Cửa cuốn',type:'Cửa cuốn',desc:'Giải pháp cửa cuốn cho lối ra vào cần đóng mở gọn và thuận tiện.',image:productCategoryImages['cua-cuon'].src,href:'/san-pham/cua-cuon/'},
      {name:'Cửa thông minh',type:'Tích hợp công nghệ',desc:'Các giải pháp cửa tự động và sản phẩm tích hợp công nghệ cho nhu cầu sử dụng tiện nghi.',image:productCategoryImages['cua-thong-minh-the-he-moi'].src,href:'/san-pham/cua-thong-minh-the-he-moi/'},
      {name:'Cửa nhôm',type:'Nhôm kính',desc:'Cửa đi, cửa sổ và vách kính theo hệ nhôm, kiểu mở và cấu hình phù hợp công trình.',image:productCategoryImages['cua-nhom'].src,href:'/san-pham/cua-nhom/'},
      {name:'Cửa uPVC',type:'uPVC',desc:'Cửa đi và cửa sổ uPVC với nhiều kiểu mở cho nhà ở và công trình.',image:productCategoryImages['cua-upvc'].src,href:'/san-pham/cua-upvc/'},
      {name:'Cửa gỗ',type:'Gỗ tự nhiên & công nghiệp',desc:'Các dòng cửa gỗ với lựa chọn vật liệu và bề mặt hoàn thiện đa dạng.',image:productCategoryImages['cua-go'].src,href:'/san-pham/cua-go/'}
    );    const renderCards=()=>cards.map(item=>'<article class="system-card"><a href="'+item.href+'"><img loading="lazy" alt="'+item.type+' '+item.name+'" src="'+item.image+'"><small>'+item.type+'</small><h3>'+item.name+'</h3><p>'+item.desc+'</p><span>Xem chi tiết <span>→</span></span></a></article>').join('');
    const heading=homePage?'<div class="section-head system-heading"><div><span class="eyebrow">03 / SẢN PHẨM</span><h2 class="serif">Các dòng cửa <span>nổi bật</span></h2><p>Giải pháp cửa hiện đại, đa dạng vật liệu, đáp ứng nhu cầu của từng công trình.</p></div><a class="button link system-all-link" href="/san-pham">Xem tất cả sản phẩm <span class="arrow" aria-hidden="true">→</span></a></div>':'<div class="section-head"><div><span class="eyebrow">03 / SẢN PHẨM</span><h2 class="serif">Các dòng cửa nổi bật</h2></div></div>';
    return '<section class="section system-section"><div class="wrap">'+heading+'<div class="system-marquee"'+(homePage?' role="region" aria-label="Các dòng cửa nổi bật"':'')+'><div class="system-track">'+renderCards()+'</div></div><div class="system-marquee-controls"><button class="system-marquee-arrow" data-system-prev type="button" aria-label="Xem nhóm cửa trước">&#8592;</button><button class="system-marquee-control" type="button" aria-pressed="false" aria-label="Tạm dừng chuyển động">Tạm dừng</button><button class="system-marquee-arrow" data-system-next type="button" aria-label="Xem nhóm cửa tiếp theo">&#8594;</button></div></div></section>';
  }
  function wireFeaturedSystemMarquee(){
    if(window.__EUROWINDOW_SYSTEM_RESIZE__)removeEventListener('resize',window.__EUROWINDOW_SYSTEM_RESIZE__);
    const section=document.querySelector('.system-section');
    if(!section)return;
    // The homepage carousel is controlled by the page-only Motion for React layer.
    // Keep this legacy controller for the same section when it appears elsewhere.
    if(section.closest('#main.home-page'))return;
    const track=section.querySelector('.system-track'),control=section.querySelector('.system-marquee-control');
    const previous=section.querySelector('[data-system-prev]'),next=section.querySelector('[data-system-next]');
    if(!track||!control||!previous||!next)return;
    const originals=[...track.children].filter(card=>!card.hasAttribute('inert'));
    if(!originals.length)return;
    const disableNativeDragging=root=>root.querySelectorAll('a,img').forEach(el=>{el.draggable=false});
    disableNativeDragging(track);
    const makeLoop=()=>originals.map(card=>{const clone=card.cloneNode(true);clone.removeAttribute('inert');clone.setAttribute('aria-hidden','true');clone.classList.remove('reveal','visible');clone.querySelectorAll('a,button,[tabindex]').forEach(el=>el.tabIndex=-1);disableNativeDragging(clone);return clone});
    track.replaceChildren(...makeLoop(),...originals,...makeLoop());
    let timer=null,moving=false,drag=null,suppressClick=false,position=0,cycleWidth=0,dragFrame=0,pointerInside=false;
    const gap=()=>parseFloat(getComputedStyle(track).gap)||0;
    const measure=()=>{cycleWidth=originals.reduce((sum,card)=>sum+card.getBoundingClientRect().width,0)+gap()*originals.length;return cycleWidth};
    const distance=card=>(card?.getBoundingClientRect().width||0)+gap();
    const wrap=value=>{if(!cycleWidth)return value;while(value>=0)value-=cycleWidth;while(value< -2*cycleWidth)value+=cycleWidth;return value};
    const schedule=()=>{clearTimeout(timer);if(!section.classList.contains('is-paused')&&!pointerInside)timer=setTimeout(slide,3000)};
    const animateTo=(target,duration)=>{
      moving=true;track.style.transition='transform '+duration+'ms cubic-bezier(.22,1,.36,1)';track.style.transform='translate3d('+target+'px,0,0)';
      let fallback;
      const finish=event=>{if(event&&(event.target!==track||event.propertyName!=='transform'))return;clearTimeout(fallback);track.removeEventListener('transitionend',finish);position=wrap(target);track.style.transition='none';track.style.transform='translate3d('+position+'px,0,0)';track.getBoundingClientRect();track.style.removeProperty('transition');moving=false;track.classList.remove('is-sliding');schedule()};
      track.addEventListener('transitionend',finish);fallback=setTimeout(finish,duration+120);
    };
    const onPointerMove=event=>{
      if(!drag||event.pointerId!==drag.pointerId)return;
      const dx=event.clientX-drag.x,dy=event.clientY-drag.y,now=performance.now();
      if(!drag.active&&Math.abs(dy)>Math.abs(dx)+5){window.removeEventListener('pointermove',onPointerMove);window.removeEventListener('pointerup',onPointerUp);window.removeEventListener('pointercancel',onPointerCancel);drag=null;schedule();return}
      if(Math.abs(dx)<4&&!drag.active)return;
      if(!drag.active){drag.active=true;track.classList.add('is-dragging');track.style.transition='none';suppressClick=true;try{track.setPointerCapture(event.pointerId)}catch{}}
      event.preventDefault();drag.velocity=(event.clientX-drag.lastX)/Math.max(1,now-drag.lastTime);drag.lastX=event.clientX;drag.lastTime=now;
      position=wrap(drag.startPosition+dx);if(!dragFrame)dragFrame=requestAnimationFrame(()=>{dragFrame=0;track.style.transform='translate3d('+position+'px,0,0)'});
    };
    const onPointerUp=event=>{
      if(!drag||event.pointerId!==drag.pointerId)return;
      const current=drag;drag=null;window.removeEventListener('pointermove',onPointerMove);window.removeEventListener('pointerup',onPointerUp);window.removeEventListener('pointercancel',onPointerCancel);track.classList.remove('is-dragging');
      if(!current.active){schedule();return}
      if(dragFrame){cancelAnimationFrame(dragFrame);dragFrame=0;track.style.transform='translate3d('+position+'px,0,0)'}
      const step=distance(originals[0]),momentum=Math.max(-step*1.5,Math.min(step*1.5,current.velocity*220));
      const snapTarget=Math.round((position+momentum+cycleWidth)/step)*step-cycleWidth;
      const target=wrap(Math.max(-2*cycleWidth,Math.min(0,snapTarget)));
      track.classList.add('is-sliding');animateTo(target,Math.min(2000,1200+Math.abs(current.velocity)*180));setTimeout(()=>{suppressClick=false},80);
    };
    const onPointerCancel=event=>{if(drag)drag.velocity=0;onPointerUp(event)};
    track.addEventListener('pointerdown',event=>{if((event.pointerType==='mouse'&&event.button!==0)||moving||track.children.length<2)return;clearTimeout(timer);drag={pointerId:event.pointerId,x:event.clientX,y:event.clientY,lastX:event.clientX,lastTime:performance.now(),startPosition:position,velocity:0,active:false};window.addEventListener('pointermove',onPointerMove,{passive:false});window.addEventListener('pointerup',onPointerUp);window.addEventListener('pointercancel',onPointerCancel)});
    track.addEventListener('click',event=>{if(suppressClick){event.preventDefault();event.stopImmediatePropagation()}},true);
    measure();position=-cycleWidth;track.style.transition='none';track.style.transform='translate3d('+position+'px,0,0)';track.getBoundingClientRect();track.style.removeProperty('transition');
    window.__EUROWINDOW_SYSTEM_RESIZE__=()=>{const phase=(position+cycleWidth)/cycleWidth;measure();position=wrap(-cycleWidth+phase*cycleWidth);if(!moving&&!drag)track.style.transform='translate3d('+position+'px,0,0)'};
    addEventListener('resize',window.__EUROWINDOW_SYSTEM_RESIZE__,{passive:true});
    const slide=()=>{
      if(moving||drag||section.classList.contains('is-paused'))return;
      track.classList.add('is-sliding');animateTo(position-distance(originals[0]),2000);
    };
    const marquee=section.querySelector('.system-marquee');
    marquee?.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'||event.pointerType==='pen'){pointerInside=true;clearTimeout(timer)}});
    marquee?.addEventListener('pointerleave',event=>{if(event.pointerType==='mouse'||event.pointerType==='pen'){pointerInside=false;if(!moving&&!drag)schedule()}});
    const stepBy=direction=>{
      if(moving||drag)return;
      clearTimeout(timer);
      const target=wrap(position+distance(originals[0])*direction);
      track.classList.add('is-sliding');animateTo(target,2000);
    };
    previous.addEventListener('click',()=>stepBy(1));
    next.addEventListener('click',()=>stepBy(-1));
    control.addEventListener('click',()=>{const paused=section.classList.toggle('is-paused');control.setAttribute('aria-pressed',String(paused));control.setAttribute('aria-label',paused?'Tiếp tục trình chiếu':'Tạm dừng trình chiếu');control.textContent=paused?'Tiếp tục':'Tạm dừng';if(paused)clearTimeout(timer);else if(!moving)schedule()});
    schedule();
  }
`;
const productPages = fs.readFileSync(path.join(root, 'scripts', 'product-pages.js'), 'utf8');
const productPagesWithoutChildPages = productPages.replace(/  const productChildFamilies=[\s\S]*?(?=  function productOverviewSection\(content,slug\)\{)/, '');
const productPagesWithCatalog = productPagesWithoutChildPages.replace('</section>${productGuideSections(content,slug)}', '</section>${productCatalogSection(slug)}${productGuideSections(content,slug)}').replace(" onerror=\"this.closest('.gallery-slide').classList.add('image-unavailable')\"", '');
if (productPagesWithCatalog === productPagesWithoutChildPages) throw new Error('Could not insert product catalog sections into product pages');
const productCatalogs = fs.readFileSync(path.join(root, 'scripts', 'product-catalogs.js'), 'utf8');
fs.mkdirSync(path.join(publicDir, 'data'), { recursive: true });
fs.rmSync(path.join(publicDir, 'data', 'product-child-routes.json'), { force: true });
fs.rmSync(path.join(publicDir, 'data', 'product-child-content.json'), { force: true });
const productCatalogsWithFilterLinks = productCatalogs
  .replace("let filter='all';const render=()=>{const options=", "let filter=new URLSearchParams(location.search).get('he')||'all';const render=()=>{const options=");
const pricingFaqMerge = `
  function mergePricingFaqSections(){
    const main=document.querySelector('#main');
    const pricing=main?.querySelector('.aluminum-pricing');
    const faq=main?.querySelector('.aluminum-faq');
    if(!pricing||!faq)return;
    const pricingWrap=pricing.querySelector(':scope > .wrap');
    const faqWrap=faq.querySelector(':scope > .wrap');
    const pricingHead=pricingWrap?.querySelector('.section-head');
    const faqHead=faqWrap?.querySelector('.section-head');
    const faqList=faqWrap?.querySelector('.aluminum-faq-list');
    if(!pricingWrap||!faqWrap||!pricingHead||!faqHead||!faqList)return;
    const layout=document.createElement('div');layout.className='wrap product-pricing-faq-layout';
    const offer=document.createElement('div');offer.className='product-pricing-faq-offer';
    const answers=document.createElement('div');answers.className='product-pricing-faq-answers';
    offer.append(pricingHead,...pricingWrap.querySelectorAll(':scope > .detail-copy, :scope > .button'));
    answers.append(faqHead,faqList);
    layout.append(offer,answers);
    pricing.className='section product-pricing-faq';pricing.replaceChildren(layout);
    faq.remove();
  }
`;
script = script.replace('  function render(){', `${aluminumArticleSection}\n${aluminumPage}\n${productPagesWithCatalog}\n${productCatalogsWithFilterLinks}\n${pricingFaqMerge}\n  function render(){`);
script = script.replace('  function render(){', '  installImageFallbacks();\n  function render(){');
script = script.replace('const render=()=>{const items=catalog[group].items', 'if(!tabs||!filters||!grid)return;const render=()=>{const items=catalog[group].items');
script = script.replace("function wireProductCatalog(){const root=document.querySelector('.door-catalog');", "function wireProductCatalog(){if(document.querySelector('[data-product-family-catalog]')){wireProductFamilyCatalog();return}const root=document.querySelector('.official-aluminum-catalog');");
script = script.replace("const catalog=window.__EURO_ALUMINUM_CATALOG__;if(!catalog)return;let group='type',filter='all';", "const catalog=window.__EURO_ALUMINUM_CATALOG__;if(!catalog)return;const requestedSystem=new URLSearchParams(location.search).get('he');let group=requestedSystem&&catalog.system?'system':'type',filter=requestedSystem&&catalog.system?requestedSystem:'all';");
script = script.replace('href="/bao-gia">Trao đổi cùng tư vấn viên', 'href="/san-pham/cua-nhom?he=${encodeURIComponent(\'Hệ \'+s.name)}">Xem sản phẩm thuộc hệ này');
script = script.replace('function systemsPage(){return `', 'function systemsPage(){featuredAluminumSystems();return `');
script = script.replace('function systemDetail(slug){let s=systems.find', 'function systemDetail(slug){featuredAluminumSystems();let s=systems.find');
script = script.replace('  function productDetail(slug){', "  function productDetail(slug){if(slug==='cua-nhom')return officialAluminumPage();if(productPageContent[slug])return officialProductPage(slug);");
script = script.replace("document.title=(titles[p]||slugTitle)+' | Eurowindow';", "document.title=(p==='/san-pham/cua-nhom'?'Cửa nhôm Eurowindow: Cửa đi, cửa sổ & vách kính':(p==='/san-pham'?'Sản phẩm Eurowindow':(productPageContent[p.split('/').pop()]?.title||titles[p]||slugTitle)))+' | Eurowindow';");
const pageMetaDescriptionPattern = /if\(meta\)meta\.content=.*?;document\.querySelectorAll\('\.nav a'\)/;
if (!pageMetaDescriptionPattern.test(script)) throw new Error('Could not find the generated page description assignment');
const pageMetaDescription = String.raw`if(meta)meta.content=p==='/san-pham/cua-nhom'?'T\u00ecm hi\u1ec3u c\u1eeda nh\u00f4m Eurowindow: \u01b0u \u0111i\u1ec3m, c\u1ea5u t\u1ea1o profile, k\u00ednh, ph\u1ee5 ki\u1ec7n v\u00e0 ki\u1ec3u m\u1edf c\u1eeda \u0111i, c\u1eeda s\u1ed5, v\u00e1ch nh\u00f4m k\u00ednh.' :(p==='/gioi-thieu'?'T\u00ecm hi\u1ec3u h\u00e0nh tr\u00ecnh Eurowindow t\u1eeb n\u0103m 2002, c\u00e1c d\u00f2ng s\u1ea3n ph\u1ea9m v\u00e0 ba gi\u00e1 tr\u1ecb Ti\u00ean phong, Ki\u1ebfn t\u1ea1o, \u0110\u1ed3ng h\u00e0nh.':(titles[p]||slugTitle)+' \u2014 gi\u1ea3i ph\u00e1p c\u1eeda nh\u00f4m k\u00ednh v\u00e0 t\u01b0 v\u1ea5n theo nhu c\u1ea7u c\u00f4ng tr\u00ecnh t\u1eeb Eurowindow.');document.querySelectorAll('.nav a')`;
script = script.replace(pageMetaDescriptionPattern, pageMetaDescription);
script = script.replace("else if(p==='/san-pham')html=productsPage();", "else if(p==='/san-pham')html=officialProductListingPage();");
script = script.replace("document.querySelector('#productGrid').innerHTML=list.map(c=>productCard({...c,tag:c.tag})).join('');", "document.querySelector('#productGrid').innerHTML=list.map(c=>productCard({...c,tag:c.tag,desc:productListingCopy[c.slug]||c.desc})).join('');");
script = script.replace('wireProductGallery();wireProductCatalog()', 'wireProductGallery();wireProductCatalog();wireProductListingImages();wireFeaturedSystemMarquee()');
script = script.replace(".join('');observe()}));wireProductGallery()", ".join('');observe();wireProductListingImages()}));wireProductGallery()");
script = script.replace('  function aluminumCatalogCard(item){', '  function legacyAluminumCatalogCard(item){');
script = script.replace("options=['T?t c?',", "options=['Tất cả',");
script = script.replace('  const img=', `${basePatch}\n  const img=`);
script = script.replace('const pics=(obj,w=1000)=>img(obj.image,w);', "const pics=(obj,w=1000)=>obj.image.startsWith('http')?obj.image:img(obj.image,w);");
script = script.replace("  function render(){let p=location.pathname.replace(/\\/$/,'')||'/';", "  function render(){let p=stripBase(location.pathname.replace(/\\/$/,'')||'/');");
script = script.replace("document.querySelector('#main').innerHTML=html;const titles=", "document.querySelector('#main').innerHTML=html;prefixLinks();const titles=");
script = script.replace("a.getAttribute('href')===p|| (p.startsWith(a.getAttribute('href')+'/')", "stripBase(a.getAttribute('href'))===p|| (p.startsWith(stripBase(a.getAttribute('href'))+'/')");
script = script.replace("u.pathname===(location.pathname||'/')", "stripBase(u.pathname)===stripBase(location.pathname||'/')");
script = script.replace('navigate(u.pathname+u.search)', 'navigate(stripBase(u.pathname)+u.search)');
script = script.replace("if(u.origin===location.origin){e.preventDefault();", "if(u.origin===location.origin){if(e.defaultPrevented||!document.querySelector('#main')||document.querySelector('#main[data-server-route]')||a.hasAttribute('data-next-route'))return;const productPath=stripBase(u.pathname).split('/').filter(Boolean);if(productPath.length===3&&productPath[0]==='san-pham'&&['cua-nhom','cua-upvc','cua-go','cua-cuon','cua-thong-minh-the-he-moi','vach-kinh-mat-dung'].includes(productPath[1]))return;e.preventDefault();");
script = script.replace("window.addEventListener('scroll',()=>{const header=document.querySelector('#header');if(header)header.classList.toggle('scrolled',window.scrollY>35)},{passive:true});render();", "window.addEventListener('scroll',()=>document.querySelector('#header').classList.toggle('scrolled',window.scrollY>35),{passive:true});window.__EUROWINDOW_RENDER__=render;render();");
script = script.replace("function navigate(url){history.pushState({},'',url);render()}", "function navigate(url){history.pushState({},'',BASE_PATH+url);render()}");
script = script.replace("if(!a||a.target==='_blank'||e.metaKey", "if(!a||a.hasAttribute('download')||a.target==='_blank'||e.metaKey");
script = script.replace("document.querySelector(u.hash)?.scrollIntoView({behavior:'smooth'})", "window.__EUROWINDOW_LENIS__?window.__EUROWINDOW_LENIS__.scrollTo(document.querySelector(u.hash)):document.querySelector(u.hash)?.scrollIntoView({behavior:'smooth'})");
script = script.replace("window.scrollTo(0,0);observe();wirePage();", "window.__EUROWINDOW_LENIS__?window.__EUROWINDOW_LENIS__.scrollTo(0,{immediate:true}):window.scrollTo(0,0);observe();wirePage();");
script = script.replace("document.querySelector('#main').innerHTML=html;prefixLinks();const titles=", "document.querySelector('#main').innerHTML=html;prefixLinks();const childHero=document.querySelector('.product-child-hero .detail-grid');if(childHero){const copy=childHero.querySelector('.detail-info'),gallery=childHero.querySelector('.detail-gallery,.product-seo-gallery');if(copy&&gallery)childHero.insertBefore(copy,gallery)}const main=document.querySelector('#main');main.classList.toggle('home-page',p==='/');if(homeMotionCleanup){homeMotionCleanup();homeMotionCleanup=null;}if(p==='/')homeMotionCleanup=setupHomeMotion();const titles=");
script = script.replace("document.querySelector('#main').innerHTML=html;prefixLinks();const childHero=", "document.querySelector('#main').innerHTML=html;mergePricingFaqSections();prefixLinks();const childHero=");
script = script.replace("if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}", "if(e.isIntersecting){e.target.classList.add('visible');if(document.querySelector('#main.home-page'))io.unobserve(e.target)}else if(!document.querySelector('#main.home-page'))e.target.classList.remove('visible')");
script = script.replace('  function observe(){', `  function setupHomeMotion(){
    const root=document.querySelector('#main');
    if(!root||prefersReducedMotion())return ()=>{};
    const sections=[...root.querySelectorAll(':scope > section')];
    const heroVideo=root.querySelector('#home-hero-video');
    const heroVideoSources=(heroVideo?.dataset.heroPlaylist||'').split(',').map(source=>source.trim()).filter(Boolean).map(source=>BASE_PATH+source);
    let heroVideoIndex=0;
    const playNextHeroVideo=()=>{
      if(!heroVideo||heroVideoSources.length<2)return;
      heroVideoIndex=(heroVideoIndex+1)%heroVideoSources.length;
      heroVideo.src=heroVideoSources[heroVideoIndex];
      heroVideo.load();
      const playback=heroVideo.play();
      if(playback?.catch)playback.catch(()=>{});
    };
    if(heroVideo&&heroVideoSources.length>1){heroVideo.loop=false;heroVideo.addEventListener('ended',playNextHeroVideo);}
    // Animate the marquee as a unit: its children are cloned and translated for the loop.
    const itemSelector='.hero-content > *, .hero-meta, .scroll-note, .intro-art, .intro-copy > *, .section-head h2, .section-head .eyebrow, .section-head p, .section-head .button, .category-grid .category-card, .system-marquee, .project-grid .project-card, .craft-image, .craft-copy > *, .story-photo, .story-copy > *, .quote-grid > div > *, .quote-form input:not([aria-hidden="true"]), .quote-form textarea, .quote-form select, .quote-form button, .news-grid .news-card, .article-image, .article-body > *';
    const items=new Set();
    sections.forEach(section=>{
      section.classList.add('home-section-motion');
      section.querySelectorAll(itemSelector).forEach((el,index)=>{
        if(el.classList.contains('reveal'))return;
        el.classList.add('home-motion-item');
        el.style.setProperty('--home-stagger',Math.min(index,5)*65+'ms');
        items.add(el);
      });
    });
    const animated=[...sections,...items];
    if(!('IntersectionObserver'in window)){
      animated.forEach(el=>el.classList.add('home-motion-visible'));
      return ()=>{if(heroVideo)heroVideo.removeEventListener('ended',playNextHeroVideo);};
    }
    const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add('home-motion-visible');
      revealObserver.unobserve(entry.target);
    }),{threshold:.08,rootMargin:'0px 0px -6% 0px'});
    animated.forEach(el=>revealObserver.observe(el));
    const desktopMotionQuery=window.matchMedia('(min-width: 900px) and (pointer: fine)');
    const desktopPointer=desktopMotionQuery.matches;
    const parallax=desktopPointer?[...root.querySelectorAll('.hero-image img,.intro-art img,.craft-image img,.story-photo img')]:[];
    const active=new Set();
    let frame=0,visibilityObserver=null;
    if(parallax.length){
      visibilityObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
        if(entry.isIntersecting){active.add(entry.target);entry.target.classList.add('home-parallax-active');}
        else{active.delete(entry.target);entry.target.classList.remove('home-parallax-active');}
      }),{rootMargin:'100px 0px'});
      parallax.forEach(el=>{el.classList.add('home-parallax');visibilityObserver.observe(el);});
    }
    const update=()=>{
      frame=0;
      active.forEach(el=>{
        const amplitude=desktopMotionQuery.matches&&!prefersReducedMotion()?8:0;
        if(!amplitude){el.style.removeProperty('--home-parallax');el.classList.remove('home-parallax-active');return;}
        const rect=el.getBoundingClientRect();
        const offset=Math.max(-amplitude,Math.min(amplitude,(rect.top+rect.height/2-window.innerHeight/2)*-.025));
        el.style.setProperty('--home-parallax',offset.toFixed(2)+'px');
      });
    };
    const onScroll=()=>{if(!frame)frame=requestAnimationFrame(update);};
    const lenis=window.__EUROWINDOW_LENIS__;
    if(lenis)lenis.on('scroll',onScroll);else window.addEventListener('scroll',onScroll,{passive:true});
    if(parallax.length)window.addEventListener('resize',onScroll,{passive:true});
    update();
    return ()=>{revealObserver.disconnect();visibilityObserver?.disconnect();if(heroVideo)heroVideo.removeEventListener('ended',playNextHeroVideo);if(lenis)lenis.off('scroll',onScroll);else window.removeEventListener('scroll',onScroll);if(parallax.length)window.removeEventListener('resize',onScroll);if(frame)cancelAnimationFrame(frame);parallax.forEach(el=>{el.style.removeProperty('--home-parallax');el.classList.remove('home-parallax','home-parallax-active');});};
  }
  function observe(){`);
script = script.replace("  document.querySelector('#menuBtn').addEventListener", "  prefixLinks();\n  document.querySelector('#menuBtn').addEventListener");
script = script.replace(
  /document\.querySelector\('#menuBtn'\)\.addEventListener\('click',\(\)=>\{let n=document\.querySelector\('#nav'\);let open=n\.classList\.toggle\('open'\);document\.querySelector\('#menuBtn'\)\.setAttribute\('aria-expanded',String\(open\)\);document\.querySelector\('#menuBtn'\)\.innerHTML=open\?[^}]+}\);/,
  ""
);

script = script.replace("button?.setAttribute('aria-label','M? menu');if(button)button.textContent='?'", "button?.setAttribute('aria-label','M\u1edf menu');if(button)button.textContent='\u2630'");
// Delegate header events because App Router replaces shell nodes between routes.
const dropdownDelegationStart = script.indexOf("const navDropdowns=[...document.querySelectorAll('.nav-dropdown')];");
const dropdownDelegationEnd = script.indexOf("document.addEventListener('click',event=>{if(!event.target.closest('.nav-dropdown'))", dropdownDelegationStart);
if (dropdownDelegationStart < 0 || dropdownDelegationEnd < 0) throw new Error('Could not locate shared header interactions');
const unifiedHeaderInteractions = [
  "let mobileNavScrollY=0;let mobileNavBodyStyles=null;const setMobileNavLock=locked=>{const body=document.body;if(locked){if(!window.matchMedia('(max-width:1100px)').matches||mobileNavBodyStyles)return;mobileNavScrollY=window.scrollY;mobileNavBodyStyles={position:body.style.position,top:body.style.top,left:body.style.left,right:body.style.right,width:body.style.width};body.style.position='fixed';body.style.top=`-${mobileNavScrollY}px`;body.style.left='0';body.style.right='0';body.style.width='100%';document.documentElement.classList.add('mobile-nav-open');return}if(!mobileNavBodyStyles)return;Object.assign(body.style,mobileNavBodyStyles);mobileNavBodyStyles=null;document.documentElement.classList.remove('mobile-nav-open');window.scrollTo(0,mobileNavScrollY)};",
  "const closeOtherDropdowns=active=>document.querySelectorAll('.nav-dropdown').forEach(item=>{if(item===active)return;item.classList.add('is-dismissed');item.classList.remove('open');item.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded','false')});",
  "routeScopedListener(document,'pointerover',event=>{if(event.pointerType!=='mouse'||!(event.target instanceof Element))return;const trigger=event.target.closest('.nav-dropdown-trigger');if(!trigger)return;const dropdown=trigger.closest('.nav-dropdown');if(event.relatedTarget instanceof Node&&dropdown.contains(event.relatedTarget))return;closeOtherDropdowns(dropdown);dropdown.classList.remove('is-dismissed')});",
  "routeScopedListener(document,'focusin',event=>{if(!(event.target instanceof Element))return;const trigger=event.target.closest('.nav-dropdown-trigger');if(!trigger)return;const dropdown=trigger.closest('.nav-dropdown');closeOtherDropdowns(dropdown);dropdown.classList.remove('is-dismissed')});",
  "routeScopedListener(document,'click',event=>{const toggle=event.target instanceof Element?event.target.closest('.nav-dropdown-toggle'):null;if(!toggle)return;const dropdown=toggle.closest('.nav-dropdown');if(!dropdown)return;const open=!dropdown.classList.contains('open');closeOtherDropdowns(dropdown);dropdown.classList.toggle('open',open);dropdown.classList.remove('is-dismissed');toggle.setAttribute('aria-expanded',String(open))});",
  "routeScopedListener(document,'click',event=>{const button=event.target instanceof Element?event.target.closest('#menuBtn'):null;if(!button)return;const nav=document.querySelector('#nav');if(!nav)return;const open=nav.classList.toggle('open');setMobileNavLock(open);button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?'\\u0110\\u00f3ng menu':'M\\u1edf menu');button.textContent=open?'\\u00d7':'\\u2630'});",
  "routeScopedListener(document,'click',event=>{const link=event.target instanceof Element?event.target.closest('#nav a'):null;if(!link)return;const nav=document.querySelector('#nav');nav?.classList.remove('open');setMobileNavLock(false);const button=document.querySelector('#menuBtn');button?.setAttribute('aria-expanded','false');button?.setAttribute('aria-label','M\\u1edf menu');if(button)button.textContent='\\u2630';closeOtherDropdowns(null)});",
  "routeScopedListener(document,'keydown',event=>{if(event.key!=='Escape')return;const nav=document.querySelector('#nav.open');if(!nav)return;nav.classList.remove('open');setMobileNavLock(false)});"
].join('');
script = script.slice(0, dropdownDelegationStart) + unifiedHeaderInteractions + script.slice(dropdownDelegationEnd);
const motion = `
/* Motion is isolated to the homepage and starts once items enter the viewport. */
.home-page .home-section-motion{opacity:0;transform:translate3d(0,8px,0);transition:opacity .68s cubic-bezier(.22,1,.36,1),transform .68s cubic-bezier(.22,1,.36,1)}
.home-page .home-section-motion.home-motion-visible{opacity:1;transform:none}
.home-page .home-motion-item{opacity:0;transform:translate3d(0,14px,0);transition:opacity .66s cubic-bezier(.22,1,.36,1) var(--home-stagger,0ms),transform .66s cubic-bezier(.22,1,.36,1) var(--home-stagger,0ms)}
.home-page .home-motion-item.home-motion-visible{opacity:1;transform:none}
.home-page .home-parallax{translate:0 var(--home-parallax,0px)}
.home-page .home-parallax-active{will-change:translate}
.home-page .hero-image img{animation:slowZoom 20s cubic-bezier(.2,.7,.2,1) both}
.home-page .reveal{opacity:0;transform:translate3d(0,16px,0);transition:opacity .68s cubic-bezier(.22,1,.36,1) var(--reveal-delay,0ms),transform .68s cubic-bezier(.22,1,.36,1) var(--reveal-delay,0ms)}
.home-page .reveal.visible{opacity:1;transform:translate3d(0,0,0)}
@media(max-width:700px){.home-page .home-motion-item{transform:translate3d(0,10px,0);transition-duration:.54s}.home-page .reveal{transform:translate3d(0,12px,0);transition-duration:.56s}.home-page .hero-image img{animation-duration:24s}}
@media(prefers-reduced-motion:reduce){html:not([data-motion-mode="full"]) #main.home-page .home-section-motion,html:not([data-motion-mode="full"]) #main.home-page .home-motion-item,html:not([data-motion-mode="full"]) #main.home-page .reveal{opacity:1!important;transform:none!important;transition:none!important;will-change:auto!important}html:not([data-motion-mode="full"]) #main.home-page .home-parallax{translate:none!important;will-change:auto!important}html:not([data-motion-mode="full"]) #main.home-page .hero-image img{animation:none!important}html:not([data-motion-mode="full"]) #main.home-page .category-card:hover,html:not([data-motion-mode="full"]) #main.home-page .project-card:hover,html:not([data-motion-mode="full"]) #main.home-page .news-card:hover{transform:none;box-shadow:none}html:not([data-motion-mode="full"]) #main.home-page .category-card:hover img,html:not([data-motion-mode="full"]) #main.home-page .project-card:hover img{transform:none}}
`;

const blueTheme = `
/* Cool sapphire palette shared by every route. */
:root{--navy:#102b4c;--blue:#1d4d7c;--blue2:#3975a7;--gold:#79a9d6;--gold2:#d4e7f8;--cream:#f3f7fb;--white:#fff;--ink:#17283b;--muted:#64778b;--line:#dce6f0}
.nav-dropdown{position:relative;display:flex;align-items:center;height:100%}
.nav-dropdown-menu{position:absolute;z-index:30;top:100%;left:-18px;display:grid;min-width:205px;padding:8px;background:#fff;color:var(--navy);box-shadow:0 16px 38px #071d3530;opacity:0;visibility:hidden;pointer-events:none;transform:translateY(10px) scale(.985);transform-origin:top center;transition:opacity .24s ease,transform .34s cubic-bezier(.22,1,.36,1),visibility 0s linear .34s}
.nav-dropdown:hover .nav-dropdown-menu,.nav-dropdown:focus-within .nav-dropdown-menu,.nav-dropdown.open .nav-dropdown-menu{opacity:1;visibility:visible;pointer-events:auto;transform:translateY(0) scale(1);transition:opacity .24s ease,transform .34s cubic-bezier(.22,1,.36,1),visibility 0s}
.nav-dropdown.is-dismissed .nav-dropdown-menu{opacity:0;visibility:hidden;transform:translateY(10px) scale(.985);pointer-events:none;transition:opacity .2s ease,transform .3s cubic-bezier(.22,1,.36,1),visibility 0s linear .3s}
.nav .nav-dropdown-menu a{padding:12px 14px;border-radius:2px;letter-spacing:.06em;white-space:nowrap;opacity:0;transform:translateY(-5px);transition:opacity .2s ease,transform .28s cubic-bezier(.22,1,.36,1)}
.nav-dropdown:hover .nav-dropdown-menu a,.nav-dropdown:focus-within .nav-dropdown-menu a,.nav-dropdown.open .nav-dropdown-menu a{opacity:1;transform:translateY(0)}
.nav-dropdown.is-dismissed .nav-dropdown-menu a{opacity:0;transform:translateY(-5px);transition-delay:0ms}
.nav .nav-dropdown-menu a:after{left:14px;bottom:7px}
.nav .nav-dropdown-menu a:hover{background:#f3f7fb}
.nav .nav-dropdown-menu a.active{color:#246da8}
.nav-dropdown-head{display:contents}
.nav-dropdown-toggle{display:none}
.nav-dropdown-menu-products{min-width:230px}@media(max-width:700px){.nav-dropdown{display:block;width:100%;height:auto}.nav .nav-dropdown-menu{position:static;display:grid;grid-template-columns:1fr;min-width:0;max-height:0;overflow:hidden;padding:0 0 0 18px;background:transparent;color:inherit;box-shadow:none;opacity:0;visibility:hidden;transform:translateY(-5px);transition:max-height .38s cubic-bezier(.22,1,.36,1),opacity .22s ease,transform .3s cubic-bezier(.22,1,.36,1),padding .3s ease,visibility 0s linear .38s}.nav .nav-dropdown:hover .nav-dropdown-menu,.nav .nav-dropdown:focus-within .nav-dropdown-menu,.nav .nav-dropdown.open .nav-dropdown-menu{max-height:380px;padding:0 0 8px 18px;opacity:1;visibility:visible;transform:translateY(0);pointer-events:auto;transition:max-height .38s cubic-bezier(.22,1,.36,1),opacity .22s ease,transform .3s cubic-bezier(.22,1,.36,1),padding .3s ease,visibility 0s}.nav .nav-dropdown.is-dismissed .nav-dropdown-menu{max-height:0;padding-bottom:0;opacity:0;visibility:hidden;transform:translateY(-5px);pointer-events:none;transition:max-height .32s cubic-bezier(.4,0,.2,1),opacity .18s ease,transform .25s ease,padding .25s ease,visibility 0s linear .32s}.nav .nav-dropdown-menu a{padding:11px 14px;font-size:18px;border-bottom:0}.nav .nav-dropdown-menu a:after{display:none}.catalogue-page{padding:40px 0 64px}.catalogue-info-card{display:flex}.catalogue-info-card h2{font-size:39px}.catalogue-viewer-head{padding:14px;align-items:flex-start}.catalogue-viewer-head>a{font-size:10px}.catalogue-viewer iframe{height:72vh;min-height:470px}}
@media(max-width:700px){.nav-dropdown .nav-dropdown-head{display:flex;align-items:center;gap:14px}.nav .nav-dropdown .nav-dropdown-trigger{flex:1}.nav-dropdown .nav-dropdown-toggle{display:grid;place-items:center;width:42px;height:48px;flex:none;border:0;background:transparent;color:inherit;font-size:20px;cursor:pointer}.site-header.scrolled .nav-dropdown .nav-dropdown-toggle{color:var(--navy)}}
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
#main.home-page .hero{height:100vh;height:100svh;height:100dvh;min-height:100vh;min-height:100svh;min-height:100dvh}
#main.home-page .hero-content{padding:calc(var(--site-header-stack,128px) + 48px) 0 86px}
#main.home-page .hero-image{opacity:.9}
#main.home-page .hero-image:after{background:linear-gradient(180deg,transparent 58%,var(--cream) 100%),linear-gradient(90deg,rgba(5,24,46,.52) 0%,rgba(5,24,46,.3) 48%,rgba(5,24,46,.08) 100%),linear-gradient(0deg,rgba(5,24,46,.4) 0%,transparent 60%)}
#main.home-page .hero-meta,#main.home-page .scroll-note{color:var(--navy)}
#main.home-page .scroll-note:before{background:var(--blue)}
#main.home-page .hero-video{position:absolute;inset:0;overflow:hidden;pointer-events:none}
#main.home-page .hero-image img{position:absolute;inset:0;z-index:0}
#main.home-page .hero-image:after{z-index:2;pointer-events:none}
#main.home-page .hero-video{z-index:1}
#main.home-page .hero-content,#main.home-page .hero-meta,#main.home-page .scroll-note{z-index:3}
#main.home-page .hero-video video{position:absolute;inset:0;width:100%;height:100%;min-width:0;min-height:0;object-fit:cover;object-position:center;transform:none;border:0}
@media(max-width:1000px){#main.home-page .project-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:700px){#main.home-page .project-grid{grid-template-columns:1fr}#main.home-page .project-grid>.project-card:nth-child(3){display:block}#main.home-page .project-grid>.project-card .project-image{height:360px}#main.home-page .hero h1{font-size:clamp(40px,10.5vw,56px);max-width:100%}#main.home-page .hero-content{padding:calc(var(--site-header-stack,111px) + 48px) 0 76px}}
@media(max-height:700px) and (max-width:700px){#main.home-page .hero-content{padding:calc(var(--site-header-stack,111px) + 40px) 0 55px}}
@media(max-height:820px) and (min-width:701px){#main.home-page .hero h1{font-size:clamp(42px,5vw,72px)}#main.home-page .hero-content{padding:calc(var(--site-header-stack,128px) + 48px) 0 68px}}\n@media(max-height:760px) and (min-width:701px){#main.home-page .hero h1{font-size:clamp(36px,4.8vw,62px)}#main.home-page .hero-content{padding:calc(var(--site-header-stack,128px) + 24px) 0 66px}#main.home-page .hero h1{margin:14px 0 16px}#main.home-page .hero-actions{margin-top:22px}}\n@media(max-height:740px) and (max-width:700px){#main.home-page .hero h1{font-size:clamp(34px,9.5vw,48px)}#main.home-page .hero-content{padding:calc(var(--site-header-stack,111px) + 18px) 0 66px}#main.home-page .hero h1{margin:14px 0 16px}#main.home-page .hero-actions{margin-top:22px}}
@media(max-height:520px) and (min-width:701px){#main.home-page .hero-content{padding:calc(var(--site-header-stack,128px) + 40px) 0 24px}#main.home-page .hero h1{font-size:clamp(34px,4.6vh,48px);margin:12px 0}.hero .eyebrow{font-size:9px}.hero-copy{font-size:13px;line-height:1.4}.hero-actions{margin-top:18px}.hero-meta{display:none}.scroll-note{bottom:12px}}
#main [style*="#d8d2c4"]{background:linear-gradient(135deg,#dce8f3,#f1f6fb)!important}
`;

const aluminumStyles = `
.system-card img{object-fit:contain;object-position:center;background:#f3f6f8}
.detail-gallery .gallery-slide img{object-fit:contain;object-position:center;background:#0c2b50}
.system-marquee{overflow:hidden;position:relative}
.system-section>.wrap{width:min(1760px,calc(100% - 64px))}
.system-track{display:flex;flex-wrap:nowrap!important;grid-template-columns:none;width:max-content;gap:14px;overflow:visible;padding:0;transform:translateX(0);transition:transform .72s cubic-bezier(.22,1,.36,1)}
.system-track{touch-action:pan-y;cursor:grab}.system-track:active{cursor:grabbing}.system-track a{-webkit-user-drag:none;user-select:none}
.system-track.is-dragging,.system-track.is-sliding{will-change:transform}
.system-card{flex:0 0 clamp(245px,23vw,320px)}
.system-card small{display:block;color:var(--gold2);font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-top:12px}
.system-marquee-control{margin-top:18px;border:1px solid #ffffff55;background:transparent;color:#fff;padding:9px 13px;font:600 11px var(--display);cursor:pointer}
.system-marquee-control:hover,.system-marquee-control:focus-visible{background:#ffffff18}
@media(prefers-reduced-motion:reduce){html:not([data-motion-mode="full"]) .system-track,html:not([data-motion-mode="full"]) .nav-dropdown-menu,html:not([data-motion-mode="full"]) .nav-dropdown-menu a,html:not([data-motion-mode="full"]) .gallery-slide,html:not([data-motion-mode="full"]) .gallery-lightbox{transition-duration:.2s!important;animation-duration:.35s!important}}
@media(max-width:700px){.system-section>.wrap{width:calc(100% - 40px)}}
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
@media(max-width:700px){.product-family-catalog .door-catalog-visual{height:300px;padding:12px}.product-family-catalog .door-catalog-visual img{width:min(100%,276px);height:min(100%,276px)}.product-family-catalog .door-catalog-info h3{min-height:0}.product-guide-gallery{grid-template-columns:1.1fr .9fr;grid-template-rows:repeat(2,minmax(135px,1fr));min-height:290px;gap:8px}.product-guide-gallery-item:first-child{grid-row:span 2}.product-guide-gallery-count-2{grid-template-rows:minmax(230px,1fr);min-height:240px}.product-guide-gallery-count-2 .product-guide-gallery-item:first-child{grid-row:auto}.product-guide-gallery-count-1{grid-template-columns:1fr;grid-template-rows:minmax(270px,1fr);min-height:280px}.product-guide-copy{grid-template-columns:1fr;gap:18px}.product-guide-topic+.product-guide-topic{padding:18px 0 0;border-top:1px solid #cbd8e4;border-left:0}.product-guide-point-grid{gap:8px}.product-guide-point{padding:13px}.product-guide-point h3,.product-guide-application h3{font-size:13px}.product-guide-point p,.product-guide-application p{font-size:11px}.product-guide-gallery-item figcaption{left:11px;right:11px;bottom:10px;font-size:10px}.product-guide-subhead{margin-top:36px}.upvc-editorial-content{font-size:14px;line-height:1.75}.upvc-editorial-content .upvc-editorial-lead{font-size:15px}.upvc-editorial-content h3{margin:32px 0 15px;padding-top:20px;font-size:23px}.upvc-editorial-content h4{margin:22px 0 9px;font-size:16px}}
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
.page-hero-compact{padding:calc(var(--site-header-stack,128px) + 54px) 0 22px}.page-hero-compact .crumb{margin-bottom:12px}.page-hero-compact h1{margin:10px 0 0;font-size:clamp(42px,6vw,72px)}@media(max-width:700px){.page-hero-compact{padding:calc(var(--site-header-stack,111px) + 48px) 0 18px}.page-hero-compact h1{font-size:clamp(32px,9vw,48px)}}.aluminum-faq{background:#edf3f8}.aluminum-faq-list{display:grid;grid-template-columns:1fr 1fr;gap:14px}.aluminum-faq-item{padding:22px 24px;background:#fff;border-left:3px solid #246da8}.aluminum-faq-item h3{margin:0 0 9px;color:var(--navy);font-size:17px}.aluminum-faq-item p{margin:0;color:var(--muted);font-size:14px;line-height:1.7}.aluminum-pricing .detail-copy{max-width:900px;margin:0 0 22px;color:var(--muted);line-height:1.8}@media(max-width:700px){.aluminum-faq-list{grid-template-columns:1fr}.aluminum-faq-item{padding:18px}}
@media(max-width:900px){.aluminum-benefit-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:700px){.aluminum-benefit-grid{grid-template-columns:1fr}.official-aluminum-catalog .door-catalog-visual{height:300px;padding:12px}.official-aluminum-catalog .door-catalog-visual img{width:min(100%,276px)!important;height:min(100%,276px)!important}.official-aluminum-catalog .door-catalog-info h3{min-height:0}}
.aluminum-overview{padding:100px 0;background:#fff}.aluminum-overview-intro{max-width:860px;margin:0 auto 46px;text-align:center}.aluminum-overview-intro h2{margin:16px 0;color:var(--navy);font:500 clamp(35px,4.6vw,58px) var(--display);line-height:1.1;letter-spacing:-.04em}.aluminum-overview-intro p{margin:0;color:var(--muted);font-size:16px;line-height:1.8}.aluminum-overview-layout{display:grid;grid-template-columns:minmax(0,.88fr) minmax(0,1.12fr);gap:clamp(32px,6vw,78px);align-items:start}.aluminum-overview-image{height:100%;min-height:510px;margin:0;background:#edf2f5}.aluminum-overview-image img{width:100%;height:100%;object-fit:cover}.aluminum-overview-copy>p{margin:0;color:var(--muted);font-size:15px;line-height:1.85}.aluminum-overview-points{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:26px 0}.aluminum-overview-points article{padding:18px;background:#f3f6f8;border-left:3px solid #246da8}.aluminum-overview-points h3,.aluminum-overview-subtitle{margin:0 0 7px;color:var(--navy);font-size:17px}.aluminum-overview-points p{margin:0;color:var(--muted);font-size:13px;line-height:1.65}.aluminum-overview-subtitle{margin-top:30px;font:600 24px var(--display)}.aluminum-overview-list{display:grid;gap:9px;margin:15px 0;padding:0;list-style:none;color:var(--muted);font-size:14px;line-height:1.65}.aluminum-overview-list li{position:relative;padding-left:18px}.aluminum-overview-list li:before{content:'•';position:absolute;left:0;color:#246da8;font-weight:700}.aluminum-overview-list strong{color:var(--navy)}.aluminum-overview-note{margin-top:22px!important;padding:14px 16px;border-left:3px solid var(--gold);background:#f6f1e6;font-size:13px!important}@media(max-width:800px){.aluminum-overview-layout{grid-template-columns:1fr}.aluminum-overview-image{min-height:360px;max-height:460px}.aluminum-overview-intro{text-align:left}.aluminum-overview-points{grid-template-columns:1fr 1fr}}@media(max-width:520px){.aluminum-overview{padding:68px 0}.aluminum-overview-intro{margin-bottom:28px}.aluminum-overview-intro p{font-size:14px}.aluminum-overview-image{min-height:290px}.aluminum-overview-points{grid-template-columns:1fr}.aluminum-overview-copy>p{font-size:14px}.aluminum-overview-subtitle{font-size:22px}}
`;
const productChildStyles = `
.product-breadcrumb{display:flex;flex-wrap:wrap;gap:9px;align-items:center;margin:0 0 26px;color:#71849a;font-size:11px;line-height:1.5}.product-breadcrumb a{color:#246da8;text-decoration:none}.product-breadcrumb a:hover{text-decoration:underline;text-underline-offset:3px}.product-breadcrumb span:last-child{color:#243b55}
.product-child-title{margin:0 0 20px;color:var(--navy);font:500 clamp(32px,4.2vw,54px) var(--display);line-height:1.08;letter-spacing:-.035em}.product-child-hero .detail-grid{display:flex;flex-direction:column;gap:32px}.product-child-hero .detail-info{order:1;max-width:940px}.product-child-hero .detail-gallery,.product-child-hero .product-seo-gallery{order:2}.product-child-hero .detail-copy{max-width:900px}.product-child-hero .detail-copy p{line-height:1.8}.product-child-hero .detail-gallery{display:block;min-height:0}.product-child-hero .gallery-controls{position:static;display:flex;justify-content:center;gap:14px;margin-top:12px}.product-child-hero .detail-gallery:before,.product-child-hero .product-seo-gallery:before{display:block;margin:0 0 16px;color:var(--navy);font:600 14px var(--display);letter-spacing:.1em;text-transform:uppercase;content:'HÌNH ẢNH SẢN PHẨM & CÔNG TRÌNH'}.product-child-hero .gallery-stage{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:14px;min-height:0}.product-child-hero .gallery-slide{position:relative;inset:auto;width:100%;height:clamp(230px,25vw,340px);padding:0;opacity:1;visibility:visible;transform:none;border:1px solid #d9e3ec;background:#fff}.product-child-hero .gallery-slide.active{z-index:1;transform:none;border-color:#7ba5c9;box-shadow:0 8px 24px #174f8412}.product-child-hero .gallery-slide img{object-fit:contain;background:#edf2f6}.product-child-hero .gallery-slide.image-unavailable{display:none}.product-child-hero .gallery-slide:after{inset:58% 0 0}.product-child-hero .gallery-caption{left:0;right:0;bottom:0;padding:24px 14px 12px}.product-child-hero .product-seo-gallery{grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))}.product-child-story figure{display:none}
.product-child-information{background:#edf3f8}.product-child-information-grid{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(250px,.75fr);gap:28px;align-items:start}.product-child-information-grid>.wrap{min-width:0}.product-child-information h2{max-width:760px;margin:14px 0 25px;color:var(--navy);font:500 clamp(30px,4vw,48px) var(--display);line-height:1.12;letter-spacing:-.035em}.product-child-information .product-guide-point-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.product-child-uses{padding:25px 27px;background:#fff;border-top:3px solid #2873b7}.product-child-uses h2{margin:12px 0 20px;font-size:30px}.product-child-uses ul{display:grid;gap:12px;margin:0;padding:0;list-style:none}.product-child-uses li{position:relative;padding-left:20px;color:#526b82;font-size:14px;line-height:1.6}.product-child-uses li:before{position:absolute;left:0;content:'—';color:#2873b7}.product-child-uses p{margin:20px 0 0;padding-top:16px;border-top:1px solid #d6e1eb;color:#71849a;font-size:12px;line-height:1.7}.product-child-related .section-head{align-items:end}.product-child-related .door-catalog-info h3 a{color:inherit;text-decoration:none}.product-child-related .door-catalog-info h3 a:hover{color:#2873b7}
.product-seo-gallery{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;align-content:start}.product-seo-gallery figure{position:relative;min-width:0;min-height:170px;margin:0;overflow:hidden;background:#e9eff4}.product-seo-gallery figure:first-child{grid-column:1/-1;min-height:clamp(300px,36vw,510px)}.product-seo-gallery img{display:block;width:100%;height:100%;min-height:inherit;object-fit:contain;background:#edf2f6}.product-seo-gallery figcaption{position:absolute;inset:auto 0 0;padding:22px 13px 12px;color:#fff;font-size:11px;background:linear-gradient(transparent,#102b4ccc)}
.door-catalog-visual[href]:hover img{transform:scale(1.025)}.door-catalog-visual img{transition:transform .35s ease}
@media(max-width:900px){.product-child-information-grid{grid-template-columns:1fr}.product-child-uses{max-width:none}}
@media(max-width:700px){.product-breadcrumb{margin-bottom:18px;font-size:10px}.product-child-title{font-size:36px}.product-child-hero .gallery-stage{grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))}.product-child-hero .gallery-slide{height:260px}.product-child-information .product-guide-point-grid{grid-template-columns:1fr}.product-child-uses{padding:20px}.product-child-related .section-head{align-items:start}.product-seo-gallery{grid-template-columns:1fr 1fr}.product-seo-gallery figure:first-child{min-height:290px}.product-seo-gallery figure{min-height:130px}}
`;
const productChildPricingStyles = `.product-child-price{margin-top:26px;padding-top:22px;border-top:1px solid #d6e1eb}.product-child-price h3{margin:12px 0 9px;color:var(--navy);font:600 22px var(--display);line-height:1.25}.product-child-price p{margin:8px 0;color:#71849a;font-size:13px;line-height:1.7}.product-child-price .button{margin-top:8px}.product-child-price .eyebrow{color:#2873b7}

.product-child-story-list{display:grid;gap:30px}.product-child-story{min-width:0}.product-child-story h3{margin:0 0 10px;color:#176bb0;font-size:17px;line-height:1.45}.product-child-story p{margin:0 0 16px;color:#526b82;font-size:14px;line-height:1.75}.product-child-story figure{width:min(100%,720px);margin:0 auto}.product-child-story img{display:block;width:100%;max-height:460px;object-fit:contain;background:#fff}.product-child-story figcaption{margin-top:7px;color:#71849a;font-size:11px;font-style:italic;line-height:1.5;text-align:center}
@media(max-width:700px){.product-child-story-list{gap:22px}.product-child-story h3{font-size:15px}.product-child-story p{font-size:13px}.product-child-story img{max-height:340px}}

n${script}\n})();}`;
const cataloguePdfViewerScript = `function initCataloguePdfViewer(){
 const root=document.querySelector('.catalogue-viewer[data-pdf-viewer]');if(!root||root.dataset.pdfReady==='true')return;root.dataset.pdfReady='true';
 const basePath=window.__EUROWINDOW_BASE_PATH__||'',totalPages=53,previewUrl=number=>basePath+'/catalogue-preview/page-'+number+'.webp';
 const canvas=root.querySelector('[data-pdf-canvas]'),context=canvas.getContext('2d',{alpha:false}),stage=root.querySelector('[data-pdf-stage]'),status=root.querySelector('[data-pdf-status]'),pageInput=root.querySelector('[data-pdf-page-input]'),pageCount=root.querySelector('[data-pdf-page-count]'),zoomLabel=root.querySelector('[data-pdf-zoom]'),thumbnails=root.querySelector('[data-pdf-thumbnails]');
 let currentPage=1,zoom=1,renderToken=0;
 const showError=(error)=>{console.error('Catalogue preview image failed:',error);canvas.style.display='none';status.hidden=false;status.textContent='Không tải được trang xem trước. Hãy thử tải lại trang.'};
 const renderPage=(value)=>{currentPage=Math.max(1,Math.min(totalPages,Number(value)||1));pageInput.value=String(currentPage);thumbnails.querySelectorAll('[data-thumb-page]').forEach(button=>button.setAttribute('aria-current',Number(button.dataset.thumbPage)===currentPage?'page':'false'));const selectedThumb=thumbnails.querySelector('[data-thumb-page="'+currentPage+'"]');selectedThumb?.scrollIntoView({block:'nearest',inline:'nearest',behavior:'smooth'});const token=++renderToken,image=new Image();image.decoding='async';image.onload=()=>{if(token!==renderToken)return;const fitScale=Math.max(.2,(stage.clientWidth-28)/image.naturalWidth),scale=fitScale*zoom,ratio=Math.min(window.devicePixelRatio||1,2),width=Math.ceil(image.naturalWidth*scale),height=Math.ceil(image.naturalHeight*scale);canvas.width=Math.ceil(width*ratio);canvas.height=Math.ceil(height*ratio);canvas.style.width=width+'px';canvas.style.height=height+'px';canvas.style.display='block';context.clearRect(0,0,canvas.width,canvas.height);context.drawImage(image,0,0,canvas.width,canvas.height);zoomLabel.textContent=Math.round(zoom*100)+'%';status.hidden=true};image.onerror=showError;image.src=previewUrl(currentPage)};
 const renderThumbnail=(button)=>{const image=button.querySelector('img');if(!image||image.dataset.loaded==='true')return;image.dataset.loaded='true';image.src=previewUrl(Number(button.dataset.thumbPage))};
 const makeThumbnails=()=>{const observer='IntersectionObserver'in window?new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){renderThumbnail(entry.target);observer.unobserve(entry.target)}}),{root:thumbnails,rootMargin:'120px',threshold:.01}):null;for(let number=1;number<=totalPages;number++){const button=document.createElement('button');button.type='button';button.className='catalogue-pdf-thumb';button.dataset.thumbPage=String(number);button.setAttribute('aria-label','Trang '+number);button.setAttribute('aria-current',number===currentPage?'page':'false');const image=document.createElement('img');image.alt='';image.loading='lazy';const label=document.createElement('span');label.textContent=String(number);button.append(image,label);button.addEventListener('click',()=>renderPage(number));thumbnails.append(button);if(observer)observer.observe(button);else renderThumbnail(button)}};
 let pointerStartX=null,pointerStartScroll=0,didDrag=false,suppressThumbClickUntil=0;
 thumbnails.addEventListener('pointerdown',event=>{if(event.pointerType!=='mouse'||event.button!==0)return;pointerStartX=event.clientX;pointerStartScroll=thumbnails.scrollLeft;didDrag=false;thumbnails.classList.add('is-pointer-down')});
 thumbnails.addEventListener('pointermove',event=>{if(pointerStartX===null||event.buttons!==1)return;const delta=event.clientX-pointerStartX;if(Math.abs(delta)>5){didDrag=true;thumbnails.setPointerCapture?.(event.pointerId);thumbnails.scrollLeft=pointerStartScroll-delta}});
 const finishThumbnailDrag=()=>{if(didDrag)suppressThumbClickUntil=performance.now()+250;pointerStartX=null;didDrag=false;thumbnails.classList.remove('is-pointer-down')};
 thumbnails.addEventListener('pointerup',finishThumbnailDrag);thumbnails.addEventListener('pointercancel',finishThumbnailDrag);
 thumbnails.addEventListener('click',event=>{if(performance.now()<suppressThumbClickUntil){event.preventDefault();event.stopImmediatePropagation()}},true);
 pageCount.textContent=String(totalPages);makeThumbnails();renderPage(1);
 root.querySelectorAll('[data-pdf-action]').forEach(button=>button.addEventListener('click',async()=>{const action=button.dataset.pdfAction;if(action==='first')renderPage(1);if(action==='previous')renderPage(currentPage-1);if(action==='next')renderPage(currentPage+1);if(action==='zoom-in'){zoom=Math.min(2.5,zoom+.15);renderPage(currentPage)}if(action==='zoom-out'){zoom=Math.max(.55,zoom-.15);renderPage(currentPage)}if(action==='fit'){zoom=1;renderPage(currentPage)}if(action==='fullscreen'){if(document.fullscreenElement)await document.exitFullscreen();else await root.requestFullscreen()}}));pageInput.addEventListener('change',()=>renderPage(pageInput.value));
 if(window.__EW_CATALOGUE_RESIZE__)window.removeEventListener('resize',window.__EW_CATALOGUE_RESIZE__);window.__EW_CATALOGUE_RESIZE__=()=>{if(root.isConnected)renderPage(currentPage)};window.addEventListener('resize',window.__EW_CATALOGUE_RESIZE__,{passive:true});
}`;
const renderFunctionIndex = script.indexOf('function render(){');
const catalogueRoutePattern = "else if(p==='/gioi-thieu')html=about();";
if (!script.includes(catalogueRoutePattern)) throw new Error('Could not find the route table for the Catalogue page');
script = script.replace(catalogueRoutePattern, "else if(p==='/gioi-thieu')html=about();else if(p==='/catalogue')html=cataloguePage();");
script = script.replace("const titles={'/':", "const titles={'/catalogue':'Catalogue Eurowindow 2024','/':");
if(renderFunctionIndex<0)throw new Error('Could not locate route renderer for Catalogue viewer');
script=script.slice(0,renderFunctionIndex)+cataloguePdfViewerScript+'\n'+script.slice(renderFunctionIndex);
const legacyRenderer = 'function render(){';
const guardedRenderer = "function render(){if(!document.querySelector('#main'))return;if(document.querySelector('#main[data-server-route]')){wirePage();return;}";
if (!script.includes(legacyRenderer)) throw new Error('Could not locate the legacy renderer for server route protection');
script = script.replace(legacyRenderer, guardedRenderer);
if (!script.includes(guardedRenderer)) throw new Error('Could not protect server-rendered routes from the legacy renderer');
script=script.replace("document.querySelector('#main').innerHTML=html;", "document.querySelector('#main').innerHTML=html;if(p==='/catalogue')initCataloguePdfViewer();");
script = `if(window.__EUROWINDOW_LEGACY_SCRIPT_READY__){window.__EUROWINDOW_RENDER__?.();}else{(()=>{${script}\nwindow.__EUROWINDOW_RENDER__=render;window.__EUROWINDOW_LEGACY_SCRIPT_READY__=true;})();}`;
const routeEventScope = "const routeEventController=new AbortController();const routeScopedListener=(target,type,listener,options)=>target.addEventListener(type,listener,{...(typeof options==='boolean'?{capture:options}:options||{}),signal:routeEventController.signal});";
script = script.replaceAll('document.addEventListener(', 'routeScopedListener(document, ');
script = script.replaceAll('window.addEventListener(', 'routeScopedListener(window, ');
script = '(function(){' + routeEventScope + '\n' + script + '\nwindow.__EUROWINDOW_SITE_SCRIPT_CLEANUP__=()=>{homeMotionCleanup?.();routeEventController.abort()};})();';
const homepageVideosFunction = String.raw`  const homeVideos = () => {
    const videos = [
      { id: '6QQiQ_QF5tE', title: "Giới thiệu Cửa Nhôm Eurowindow", label: 'Video tiêu biểu' },
      { id: 'ZAwH1iiBM9A', title: "Quy trình Sản xuất Lắp đặt tại Eurowindow", label: 'Giải pháp theo không gian' },
      { id: 'FBSkHkhxwW4', title: "\"Siêu Phẩm\" Techno Park Tower - Top 10 Tòa Nhà Thông Minh Nhất Thế Giới", label: 'Giới thiệu sản phẩm' },
      { id: '3YcEFHJ-_hU', title: "Giới thiệu Cửa Thông Minh Thế Hệ Mới", label: 'Dự án quy mô lớn' },
      { id: 'bTJwKVPjHqY', title: "Phóng sự giới thiệu Eurowindow - Năm 2022", label: 'Kinh nghiệm và hướng dẫn' },
      { id: 'MAQVOgmgJ0U', title: "Kiến trúc độc đáo ấn tượng của Bệnh viện Đa khoa Hồng Ngọc", label: 'Video Eurowindow' },
    ];
    const videoUrl = (video) => 'https://www.youtube.com/watch?v=' + video.id;
    const playIcon = '<span class="home-video-card-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l10-6.5z"/></svg></span>';
    const feature = videos[0];
    return '<section class="section home-video-section" aria-labelledby="home-video-title"><div class="wrap home-video-wrap">'
      + '<div class="home-video-feature-grid"><div class="home-video-intro"><span class="eyebrow">06 / Video tiêu biểu</span>'
      + '<h2 id="home-video-title">Khám phá <span>Eurowindow</span></h2></div>'
      + '<a class="home-video-feature" href="' + videoUrl(feature) + '" target="_blank" rel="noopener noreferrer" aria-label="Xem video: ' + feature.title + ' trên YouTube">'
      + '<img loading="lazy" decoding="async" src="https://i.ytimg.com/vi/' + feature.id + '/hqdefault.jpg" alt="Hình xem trước video Eurowindow">'
      + '<span class="home-video-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l10-6.5z"/></svg></span>'
      + '<span class="home-video-feature-caption"><strong>' + feature.title + '</strong></span></a></div>'
      + '<div class="home-video-list" id="home-video-list" aria-label="Các video Eurowindow">'
      + videos.slice(1).map((video) => '<a class="home-video-card" href="' + videoUrl(video) + '" target="_blank" rel="noopener noreferrer" aria-label="Xem video: ' + video.title + ' trên YouTube">'
        + '<span class="home-video-card-image"><img loading="lazy" decoding="async" src="https://i.ytimg.com/vi/' + video.id + '/hqdefault.jpg" alt="">' + playIcon + '</span>'
        + '<strong>' + video.title + '</strong></a>').join('')
      + '</div><div class="home-video-controls" aria-label="Điều khiển danh sách video">'
      + '<button type="button" data-video-scroll="-1" aria-label="Video trước" aria-controls="home-video-list">←</button>'
      + '<button type="button" data-video-scroll="1" aria-label="Video tiếp theo" aria-controls="home-video-list">→</button>'
      + '</div></div></section>';
  };
`;
const homepageVideoWiringFunction = String.raw`  function wireHomeVideos() {
    const root = document.querySelector('.home-video-section');
    const list = root?.querySelector('#home-video-list');
    let feature = root?.querySelector('.home-video-feature');
    if (!root || !list || !feature || list.dataset.loopReady) return;
    list.dataset.loopReady = 'true';
    const originalCount = list.children.length;
    const originalMarkup = list.innerHTML;
    list.insertAdjacentHTML('beforeend', originalMarkup + originalMarkup);
    let cycle = 0;
    let normalizeFrame = 0;
    const measureCycle = () => {
      const first = list.querySelector('.home-video-card');
      if (!first) return;
      const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
      cycle = (first.getBoundingClientRect().width + gap) * originalCount;
    };
    const normalizeScroll = () => {
      if (normalizeFrame || !cycle) return;
      normalizeFrame = requestAnimationFrame(() => {
        normalizeFrame = 0;
        const offset = list.scrollLeft - cycle;
        const centeredOffset = ((offset + cycle * 0.5) % cycle + cycle) % cycle - cycle * 0.5;
        const normalizedScroll = cycle + centeredOffset;
        if (Math.abs(normalizedScroll - list.scrollLeft) > 1) list.scrollLeft = normalizedScroll;
      });
    };
    requestAnimationFrame(() => { measureCycle(); list.scrollLeft = cycle; });
    if ('ResizeObserver' in window) {
      const resizeObserver = new ResizeObserver(measureCycle);
      resizeObserver.observe(list);
      list.__homeVideoResizeObserver = resizeObserver;
    }
    list.addEventListener('scroll', normalizeScroll, { passive: true });
    const play = (link) => {
      let id = '';
      try { id = new URL(link.href, window.location.href).searchParams.get('v') || ''; } catch {}
      if (!id) return;
      const title = (link.getAttribute('aria-label') || 'Video Eurowindow').replace(/^Xem video:\s*/i, '').replace(/\s+trên YouTube$/i, '');
      const frame = document.createElement('iframe');
      frame.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&playsinline=1&rel=0';
      frame.title = title;
      frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      frame.allowFullscreen = true;
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      if (feature.tagName === 'A') {
        const player = document.createElement('div');
        player.className = feature.className;
        player.classList.add('is-playing');
        feature.replaceWith(player);
        feature = player;
      }
      feature.replaceChildren(frame);
      feature.classList.add('is-playing');
      list.querySelectorAll('.home-video-card').forEach((card) => {
        const active = new URL(card.href, window.location.href).searchParams.get('v') === id;
        card.classList.toggle('is-current', active);
        card.setAttribute('aria-current', active ? 'true' : 'false');
      });
      if (link.classList.contains('home-video-card')) feature.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
    };
    root.addEventListener('click', (event) => {
      const link = event.target.closest('a.home-video-feature, a.home-video-card');
      if (!link) return;
      event.preventDefault();
      play(link);
    });
    root.querySelectorAll('[data-video-scroll]').forEach((button) => button.addEventListener('click', () => {
      const direction = Number(button.dataset.videoScroll) || 1;
      list.scrollBy({ left: direction * (list.clientWidth * 0.8), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }));
  }
`;
if (!script.includes('function wireHomeVideos()')) {
  const insertionPoint = '  const pageHero=';
  if (!script.includes(insertionPoint)) throw new Error('Could not find homepage video wiring insertion point');
  script = script.replace(insertionPoint, homepageVideoWiringFunction + '\n' + insertionPoint);
}
if (!script.includes('const homeVideos = () =>')) {
  const insertionPoint = '  const pageHero=';
  if (!script.includes(insertionPoint)) throw new Error('Could not find homepage video insertion point');
  script = script.replace(insertionPoint, homepageVideosFunction + '\n' + insertionPoint);
}
const homepageContactFunction = String.raw`  const homeContact = () => {
    return '<section class="quote-band home-contact" aria-labelledby="home-contact-title"><div class="wrap home-contact-grid">'
      + '<div class="home-contact-intro"><span class="eyebrow">07 / Liên hệ</span><h2 class="serif" id="home-contact-title">Liên hệ với <span class="gold">Eurowindow</span></h2><p>Nhận tư vấn giải pháp cửa phù hợp với công trình của bạn.</p>'
      + '<div class="home-contact-support" aria-label="Hình thức hỗ trợ"><div class="home-contact-support-item"><span class="home-contact-support-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4V5Z"/><path d="M8 9h8M8 12h5"/></svg></span><span><strong>Tư vấn chuyên sâu</strong><small>Trao đổi theo vị trí và cách sử dụng.</small></span></div>'
      + '<div class="home-contact-support-item"><span class="home-contact-support-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2"/><path d="m19.4 15 .1.1a1.8 1.8 0 0 1-2.5 2.5l-.1-.1a1.8 1.8 0 0 0-3 .9v.2a1.8 1.8 0 0 1-3.6 0v-.2a1.8 1.8 0 0 0-3-.9l-.1.1a1.8 1.8 0 0 1-2.5-2.5l.1-.1a1.8 1.8 0 0 0-.9-3H3.8a1.8 1.8 0 0 1 0-3.6H4a1.8 1.8 0 0 0 .9-3l-.1-.1a1.8 1.8 0 0 1 2.5-2.5l.1.1a1.8 1.8 0 0 0 3-.9v-.2a1.8 1.8 0 0 1 3.6 0V2a1.8 1.8 0 0 0 3 .9l.1-.1a1.8 1.8 0 0 1 2.5 2.5l-.1.1a1.8 1.8 0 0 0 .9 3h.2a1.8 1.8 0 0 1 0 3.6h-.2a1.8 1.8 0 0 0-.9 3Z"/></svg></span><span><strong>Giải pháp phù hợp</strong><small>Cửa, kính và phụ kiện theo thiết kế.</small></span></div>'
      + '<div class="home-contact-support-item"><span class="home-contact-support-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5M9 12h6M9 16h6"/></svg></span><span><strong>Hỗ trợ nhanh chóng</strong><small>Gọi điện hoặc gửi email cho Eurowindow.</small></span></div></div></div>'
      + '<div class="home-contact-form-panel"><div class="home-contact-form-heading"><h3>Gửi yêu cầu tư vấn</h3><p>Để lại thông tin, chúng tôi sẽ liên hệ sớm nhất.</p></div><form class="quote-form home-contact-form" data-quote aria-describedby="home-contact-note">'
      + '<label class="home-contact-field"><span class="home-contact-field-accessible">Họ và tên *</span><input class="field" name="name" type="text" autocomplete="name" placeholder="Họ và tên *" required></label>'
      + '<label class="home-contact-field"><span class="home-contact-field-accessible">Số điện thoại *</span><input class="field" name="phone" type="tel" autocomplete="tel" pattern="[0-9+() .-]{9,16}" placeholder="Số điện thoại *" required></label>'
      + '<label class="home-contact-field"><span class="home-contact-field-accessible">Địa chỉ công trình</span><input class="field" name="project_address" type="text" autocomplete="street-address" placeholder="Địa chỉ công trình"></label>'
      + '<label class="home-contact-field"><span class="home-contact-field-accessible">Bạn quan tâm sản phẩm nào?</span><select class="field" name="interest"><option value="">Bạn quan tâm sản phẩm nào?</option><option>Cửa đi</option><option>Cửa sổ</option><option>Vách kính &amp; mặt dựng</option><option>Khác</option></select></label>'
      + '<label class="home-contact-field home-contact-field--full"><span class="home-contact-field-accessible">Nội dung yêu cầu</span><textarea class="field" name="message" rows="3" placeholder="Nội dung yêu cầu"></textarea></label>'
      + '<input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" class="home-contact-honeypot">'
      + '<button class="button home-contact-submit" type="submit">Gửi yêu cầu tư vấn <span class="arrow" aria-hidden="true">→</span></button><p class="form-note" id="home-contact-note">Thông tin công trình sẽ được gửi tới Eurowindow để tư vấn.</p><div class="form-message" role="status" aria-live="polite"></div></form></div>'
      + '<aside class="home-contact-info" aria-labelledby="home-contact-info-title"><div class="home-contact-info-content"><h3 id="home-contact-info-title">Thông tin liên hệ</h3><p>Kết nối trực tiếp với Eurowindow qua các kênh dưới đây.</p>'
      + '<a class="home-contact-detail" href="tel:0967111082"><span class="home-contact-detail-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6.6 3.5 9 3l2 4.2-2 1.7a15 15 0 0 0 6.1 6.1l1.7-2 4.2 2-.5 2.4a2 2 0 0 1-2 1.6A15.5 15.5 0 0 1 5 5.5a2 2 0 0 1 1.6-2Z"/></svg></span><span><small>Hotline tư vấn</small><strong>0967 111 082</strong></span></a>'
      + '<a class="home-contact-detail" href="mailto:hoangnm3@eurowindow.biz"><span class="home-contact-detail-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14"/><path d="m4 7 8 6 8-6"/></svg></span><span><small>Email</small><strong>hoangnm3@eurowindow.biz</strong></span></a>'
      + '<div class="home-contact-detail"><span class="home-contact-detail-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg></span><span><small>Trụ sở chính</small><strong>02 Tôn Thất Tùng, Kim Liên,<br>Hà Nội</strong></span></div>'
      + '</div></aside></div></section>';
  };
`;
if (!script.includes('const homeContact = () =>')) {
  const insertionPoint = '  const pageHero=';
  if (!script.includes(insertionPoint)) throw new Error('Could not find homepage contact insertion point');
  script = script.replace(insertionPoint, homepageContactFunction + '\n' + insertionPoint);
}
if (!script.includes('${homeVideos()}${homeContact()}')) {
  const homepageCta = '${homeFaq()}${cta()}';
  if (script.includes(homepageCta)) {
    script = script.replace(homepageCta, '${homeVideos()}${homeContact()}');
  } else {
    // Older checked-in homepage shells place the shared CTA directly after the
    // project sections and do not include the newer FAQ block. Keep the video
    // and contact sections homepage-only in both source variants.
    const homeStart = script.indexOf('function home(){');
    const homeEnd = script.indexOf('\n  function ', homeStart + 1);
    const homeMarkup = homeStart >= 0
      ? script.slice(homeStart, homeEnd >= 0 ? homeEnd : undefined)
      : '';
    if (!homeMarkup.includes('${cta()}')) {
      throw new Error('Could not find a homepage insertion point for the video and contact sections');
    }
    script = script.replace('${cta()}', '${homeVideos()}${homeContact()}${cta()}');
  }
}
const videoScrollHook = 'wireProductListingImages();wireFeaturedSystemMarquee()';
if (!script.includes(videoScrollHook)) throw new Error('Could not find homepage video control hook');
script = script.replace(videoScrollHook, videoScrollHook + ';wireHomeVideos();');
fs.writeFileSync(path.join(publicDir, 'site-script.js'), script);
const pageShell = shell.replace(/<main id="main">[\s\S]*?<\/main>/i, '<main id="main"></main>');
if (!pageShell.includes('<main id="main"></main>')) throw new Error('Could not create the page shell placeholder');
fs.writeFileSync(path.join(publicDir, 'site-shell.html'), pageShell);
const showroomStyles = String.raw`
.section-page-hero-showroom{position:relative;isolation:isolate;display:flex;align-items:center;min-height:240px;padding:0;overflow:hidden;background:#0b2b4e;color:#fff}
.section-page-hero-showroom .section-page-hero-image,.section-page-hero-showroom .section-page-hero-shade{position:absolute;z-index:-2;inset:0;width:100%;height:100%}
.section-page-hero-showroom .section-page-hero-image{object-fit:cover;object-position:center 48%}
.section-page-hero-showroom .section-page-hero-shade{z-index:-1;background:linear-gradient(90deg,#082848f2 0%,#0b3155df 46%,#0b31557a 72%,#08284838 100%),linear-gradient(0deg,#071f3770,transparent 60%)}
.section-page-hero-showroom .wrap{position:relative;z-index:1;width:min(100% - 40px,1180px);margin-inline:auto;padding-top:calc(var(--site-header-stack,128px) + 50px);padding-bottom:27px}
.section-page-hero-showroom .section-breadcrumb,.section-page-hero-showroom .eyebrow{color:#e2bd70}
.section-page-hero-showroom h1{max-width:760px;margin:0;color:#fff;font-size:clamp(38px,5vw,58px);line-height:1.05;letter-spacing:-.045em}
.section-page-hero-showroom .section-hero-copy{max-width:520px;margin:12px 0 0;color:#f4f5f6;line-height:1.55}
.showroom-directory{--sr-navy:#102f53;--sr-gold:#c9a153;--sr-cream:#f7f6f1;color:var(--sr-navy)}
.section-content-area:has(.showroom-directory){padding:0;background:var(--sr-cream)}
.section-content-area:has(.showroom-directory)>.wrap{width:min(100% - 40px,1180px);max-width:1180px}
.showroom-search-panel{padding:24px 0 4px}
.showroom-search{display:grid;grid-template-columns:minmax(200px,1fr) auto auto;gap:14px;align-items:center}
.showroom-search-input{height:46px;padding:0 14px;display:flex;align-items:center;gap:11px;background:white;border:1px solid #d9d9d4}
.showroom-search-input svg,.showroom-nearby svg,.showroom-highlight-icon svg,.showroom-contact svg,.showroom-result-actions svg,.showroom-image-fallback svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;flex:none}
.showroom-search-input svg{color:#263b4e}
.showroom-search-input input{width:100%;height:100%;border:0;outline:0;background:transparent;color:var(--sr-navy);font:inherit;font-size:13px}
.showroom-search-input:focus-within{outline:2px solid #b9934d;outline-offset:1px}
.showroom-search-submit,.showroom-nearby{height:46px;padding:0 20px;border:1px solid var(--sr-navy);display:inline-flex;align-items:center;justify-content:center;gap:9px;background:var(--sr-navy);color:#fff;font:inherit;font-size:12px;font-weight:700;cursor:pointer}
.showroom-nearby{background:transparent;color:var(--sr-navy)}
.showroom-search-submit:hover{background:#184674}.showroom-nearby:hover{background:#fff}
.showroom-filters{display:grid;grid-template-columns:repeat(3,minmax(135px,1fr)) auto;gap:20px;align-items:end;padding-top:19px}
.showroom-filters label{display:grid;gap:6px;color:#31475a;font-size:11px;font-weight:600}
.showroom-filters select{height:38px;width:100%;padding:0 11px;border:1px solid #d8d9d6;background:white;color:#415366;font:inherit;font-size:12px}
.showroom-filters select:focus-visible,.showroom-search button:focus-visible,.showroom-card button:focus-visible,.showroom-pagination button:focus-visible{outline:2px solid #b99146;outline-offset:2px}
.showroom-clear{height:38px;border:0;background:transparent;color:var(--sr-navy);font:inherit;font-size:11px;text-decoration:underline;cursor:pointer}
.showroom-geo-message{margin:10px 0 0;color:#6e5730;font-size:12px}
.showroom-highlights{display:grid;grid-template-columns:repeat(4,1fr);gap:0;padding:25px 0 30px}
.showroom-highlights>div{min-height:64px;padding:4px 22px;display:flex;align-items:center;gap:15px;border-right:1px solid #e0dfda}
.showroom-highlights>div:first-child{padding-left:0}.showroom-highlights>div:last-child{border:0}
.showroom-highlight-icon{width:47px;height:47px;border:1px solid var(--sr-gold);border-radius:50%;display:grid;place-items:center;color:var(--sr-gold)}
.showroom-flower{font-size:24px}
.showroom-highlights p{margin:0;color:#66717b;font-size:11px;line-height:1.4}
.showroom-highlights strong{display:block;margin-top:2px;color:var(--sr-navy);font-size:21px;line-height:1.15;font-weight:600}
.showroom-highlights small{display:block;font-size:12px;font-weight:500}
.showroom-results{padding:2px 0 34px}
.showroom-results-heading{display:flex;align-items:end;justify-content:space-between;gap:18px;margin-bottom:18px}
.showroom-results-heading .eyebrow{margin:0 0 9px;color:#b68d45;font-size:10px;letter-spacing:.14em;font-weight:700}
.showroom-results-heading h2,.showroom-map-copy h2{margin:0;color:var(--sr-navy);font-size:clamp(25px,3.2vw,36px);line-height:1.1;letter-spacing:-.035em}
.showroom-result-actions{display:flex;align-items:center;gap:14px;color:#74808a;font-size:11px}
.showroom-result-actions [role=group]{display:flex;gap:4px}
.showroom-result-actions button{width:34px;height:34px;border:1px solid #d8d8d2;background:#fff;color:var(--sr-navy);cursor:pointer}
.showroom-result-actions button[aria-pressed=true]{border-color:var(--sr-gold);background:var(--sr-gold);color:#fff}
.showroom-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:15px}
.showroom-card{min-width:0;background:#fff;border:1px solid #ebe9e3;box-shadow:0 8px 22px #0d2b4810;transition:box-shadow .2s ease,transform .2s ease}
.showroom-card:hover{transform:translateY(-2px);box-shadow:0 14px 26px #0d2b4819}
.showroom-card-map{position:relative;display:block;width:100%;height:152px;padding:0;overflow:hidden;border:0;background:#e7edf0;cursor:pointer}
.showroom-card-image{width:100%;height:100%;object-fit:cover;transition:transform .35s ease}
.showroom-card-map:hover .showroom-card-image{transform:scale(1.035)}
.showroom-city-tag{position:absolute;left:12px;bottom:11px;padding:6px 10px;background:#fff;color:var(--sr-navy);font-size:9px;font-weight:800;letter-spacing:.04em;text-transform:uppercase}
.showroom-image-fallback{height:100%;display:grid;place-items:center;color:#9daeb6}
.showroom-card-body{padding:13px 14px 14px}
.showroom-card-body h3{margin:0 0 7px;color:var(--sr-navy);font-size:15px;line-height:1.3;font-weight:700}
.showroom-address{min-height:35px;margin:0 0 9px;color:#64717c;font-size:11px;line-height:1.55}
.showroom-contact{display:grid;gap:5px}
.showroom-contact a{min-width:0;display:flex;align-items:center;gap:8px;color:#546777;font-size:10px;text-decoration:none}
.showroom-contact a:hover{color:#a47d35}
.showroom-contact svg{width:13px;height:13px;color:#b99048}
.showroom-contact a span{overflow-wrap:anywhere}
.showroom-card-links{display:flex;justify-content:space-between;gap:8px;margin-top:10px;padding-top:9px;border-top:1px solid #efeee9}
.showroom-card-links button,.showroom-card-links a{padding:0;border:0;background:none;color:#986f2e;font:inherit;font-size:10px;font-weight:700;text-decoration:none;cursor:pointer}
.showroom-card-links button:hover,.showroom-card-links a:hover{text-decoration:underline}
.showroom-empty{padding:45px 20px;text-align:center;background:#fff}
.showroom-empty h3{margin:0 0 7px}.showroom-empty p{margin:0;color:#64717c;font-size:13px}
.showroom-pagination{display:flex;justify-content:center;gap:8px;padding:23px 0 0}
.showroom-pagination button{width:34px;height:34px;border:1px solid #d7d7d0;border-radius:50%;background:#fff;color:var(--sr-navy);cursor:pointer}
.showroom-pagination button[aria-current=page]{border-color:var(--sr-gold);background:var(--sr-gold);color:white}
.showroom-map-section{display:grid;grid-template-columns:minmax(250px,.75fr) minmax(0,1.65fr);min-height:275px;margin:0 calc((min(100vw - 40px,1180px) - 100vw)/2);padding-left:max(calc((100vw - 1180px)/2),20px);background:#e9f0f2}
.showroom-map-copy{padding:35px 30px 30px 0;align-self:center}
.showroom-map-copy .eyebrow{margin:0 0 11px;color:#b68d45;font-size:10px;font-weight:700;letter-spacing:.14em}
.showroom-map-copy h2{max-width:280px;font-size:31px}
.showroom-map-copy>p:not(.eyebrow){max-width:320px;margin:11px 0 16px;color:#65727e;font-size:12px;line-height:1.6}
.showroom-map-copy>a{display:inline-flex;align-items:center;gap:12px;padding:11px 15px;background:var(--sr-gold);color:var(--sr-navy);font-size:10px;font-weight:800;text-decoration:none}
.showroom-map-frame{position:relative;min-height:275px;overflow:hidden;background:#d5e3e9}
.showroom-map-frame iframe{position:absolute;inset:0;width:100%;height:100%;border:0;filter:saturate(.78)}
.showroom-map-card{position:absolute;top:16px;left:16px;width:min(310px,calc(100% - 32px));padding:10px;display:grid;grid-template-columns:78px 1fr;gap:10px;background:#fff;box-shadow:0 5px 20px #0d2b4826}
.showroom-map-card>img{width:78px;height:74px;object-fit:cover}
.showroom-map-card strong{display:block;margin-bottom:5px;color:var(--sr-navy);font-size:11px}
.showroom-map-card p{margin:0 0 4px;color:#64717c;font-size:9px;line-height:1.35}
.showroom-map-card a{display:block;color:#89652a;font-size:9px;line-height:1.5;text-decoration:none}
.showroom-grid.is-list{grid-template-columns:1fr}
.showroom-grid.is-list .showroom-card{display:grid;grid-template-columns:minmax(220px,.8fr) 1fr}
.showroom-grid.is-list .showroom-card-map{height:100%;min-height:190px}
.showroom-grid.is-list .showroom-card-body{padding:18px}
.showroom-cta{position:relative;overflow:hidden;background:linear-gradient(112deg,#0b2e53,#164b78);color:white}
.showroom-cta:after{content:"EW";position:absolute;right:6%;top:-.5em;color:#ffffff08;font-size:clamp(180px,30vw,360px);font-weight:800;line-height:1;pointer-events:none}
.showroom-cta>.wrap{position:relative;z-index:1;width:min(100% - 40px,1180px);min-height:190px;margin-inline:auto;display:flex;align-items:center;justify-content:space-between;gap:30px;padding-top:28px;padding-bottom:28px}
.showroom-cta .eyebrow{margin:0 0 10px;color:#d4b064;font-size:10px;font-weight:700;letter-spacing:.14em}
.showroom-cta h2{max-width:530px;margin:0;color:#fff;font-size:clamp(26px,3vw,38px);line-height:1.12;letter-spacing:-.03em}
.showroom-cta p:not(.eyebrow){max-width:460px;margin:10px 0 0;color:#d6e1e9;font-size:12px;line-height:1.55}
.showroom-cta-link{min-width:170px;padding:14px 18px;display:inline-flex;justify-content:space-between;gap:18px;background:#c9a153;color:#102f53;font-size:10px;font-weight:800;letter-spacing:.07em;text-decoration:none}
.showroom-cta-link:hover{background:#dfbd74}

.showroom-grid.is-list .showroom-address{min-height:0}
@media(max-width:900px){.showroom-search{grid-template-columns:minmax(0,1fr) auto}.showroom-nearby{grid-column:1/-1;justify-self:start}.showroom-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.showroom-highlights>div{padding-inline:13px}.showroom-map-section{grid-template-columns:minmax(220px,.8fr) minmax(0,1.2fr)}}
@media(max-width:650px){.section-page-hero-showroom{min-height:245px}.section-page-hero-showroom .wrap{width:calc(100% - 36px);padding-top:calc(var(--site-header-stack,111px) + 48px)}.section-page-hero-showroom .section-page-hero-image{object-position:62% center}.section-page-hero-showroom .section-page-hero-shade{background:linear-gradient(90deg,#082848f4,#0b3155d9 66%,#0b315580)}.section-content-area:has(.showroom-directory)>.wrap{width:calc(100% - 32px)}.showroom-search-panel{padding-top:18px}.showroom-search{grid-template-columns:1fr auto;gap:8px}.showroom-search-submit{padding-inline:12px}.showroom-nearby{grid-column:1/-1}.showroom-filters{grid-template-columns:1fr 1fr;gap:12px}.showroom-filters label:first-child{grid-column:1/-1}.showroom-clear{justify-self:start}.showroom-highlights{grid-template-columns:1fr 1fr;padding:19px 0 24px}.showroom-highlights>div{padding:10px 8px;border-right:0;border-bottom:1px solid #e0dfda}.showroom-highlights>div:nth-child(odd){padding-left:0}.showroom-highlights>div:nth-last-child(-n+2){border-bottom:0}.showroom-highlight-icon{width:40px;height:40px}.showroom-highlights strong{font-size:18px}.showroom-results-heading{align-items:start;flex-direction:column}.showroom-result-actions{width:100%;justify-content:space-between}.showroom-grid{grid-template-columns:1fr;gap:12px}.showroom-card-map{height:190px}.showroom-grid.is-list .showroom-card{grid-template-columns:1fr}.showroom-grid.is-list .showroom-card-map{height:175px}.showroom-map-section{display:flex;flex-direction:column;margin-inline:-16px;padding-left:16px}.showroom-map-copy{padding:25px 16px 20px 0}.showroom-map-frame{min-height:270px}.showroom-map-card{top:10px;left:10px}.showroom-address{min-height:0}}
@media(prefers-reduced-motion:reduce){.showroom-card,.showroom-card-image{transition:none}}
`;
const catalogueStyles = "\n.catalogue-page{--catalogue-cream:#f5f3ed;--catalogue-navy:#0d2e52;--catalogue-gold:#c69a47;background:var(--catalogue-cream);color:#152e4b}\n.catalogue-hero{position:relative;isolation:isolate;display:flex;align-items:center;min-height:330px;overflow:hidden;background:#09294b;color:#fff}\n.catalogue-hero-image,.catalogue-hero-shade{position:absolute;z-index:-2;inset:0;width:100%;height:100%}.catalogue-hero-image{object-fit:cover;object-position:center 48%}.catalogue-hero-shade{z-index:-1;background:linear-gradient(90deg,#082849f5 0%,#0b3155e8 39%,#0c315566 67%,#09274720 100%),linear-gradient(0deg,#081e3688,transparent 48%)}\n.catalogue-hero-inner{padding-top:calc(var(--site-header-stack,128px) + 40px);padding-bottom:25px}.catalogue-breadcrumb{display:flex;align-items:center;gap:10px;margin:0 0 20px;color:#ffffffb8;font-size:10px;letter-spacing:.1em;text-transform:uppercase}.catalogue-breadcrumb a{color:#fff;text-decoration:none}.catalogue-kicker{display:flex;align-items:center;gap:11px;margin:0 0 12px;color:var(--catalogue-gold);font-size:10px;font-weight:700;letter-spacing:.15em;text-transform:uppercase}.catalogue-kicker>span{width:24px;height:1px;background:currentColor}.catalogue-hero h1{margin:0;color:#fff;font:500 clamp(36px,4.6vw,58px)/1.06 var(--display);letter-spacing:-.05em;animation:catalogue-title-enter .7s .05s both}.catalogue-hero h1 span{color:#d4ad61}.catalogue-hero-copy{margin:9px 0 0;color:#ffffffdf;font-size:14px;line-height:1.55}\n.catalogue-content{padding:26px 0 28px;background:var(--catalogue-cream)}.catalogue-layout{display:grid;grid-template-columns:minmax(0,1.78fr) minmax(295px,.88fr);gap:26px;align-items:start}.catalogue-viewer-wrap{min-width:0;background:#fff;box-shadow:0 12px 34px #102b4c14}.catalogue-viewer{display:flex;flex-direction:column;height:clamp(680px,80vh,980px);min-height:620px;background:#202a32;color:#fff}.catalogue-pdf-toolbar{flex:none;min-height:48px;padding:6px 10px;display:flex;align-items:center;justify-content:space-between;gap:8px;background:#26333e;color:#fff;border-bottom:1px solid #ffffff20}.catalogue-pdf-tools{display:flex;align-items:center;gap:5px}.catalogue-pdf-tools button{width:34px;height:34px;padding:0;border:1px solid transparent;background:transparent;color:#fff;font-size:18px;cursor:pointer}.catalogue-pdf-tools button:hover,.catalogue-pdf-tools button:focus-visible{background:#ffffff18;outline:2px solid #d4ad61;outline-offset:1px}.catalogue-pdf-tools input{width:42px;height:30px;padding:2px;border:1px solid #ffffff55;background:#1d2832;color:#fff;text-align:center}.catalogue-pdf-tools>span{font-size:10px;color:#dce2e7;white-space:nowrap}.catalogue-pdf-zoom{min-width:38px;text-align:center}.catalogue-pdf-stage{position:relative;flex:1;min-height:0;overflow:auto;overscroll-behavior:contain;touch-action:pan-x pan-y;-webkit-overflow-scrolling:touch;display:flex;justify-content:center;align-items:flex-start;padding:12px;background:#39444e}.catalogue-pdf-stage canvas{display:none;max-width:none;background:#fff;box-shadow:0 4px 18px #0004}.catalogue-pdf-status{align-self:center;margin:auto;padding:18px;color:#fff;font-size:13px;text-align:center}.catalogue-pdf-status a{display:block;margin-top:10px;color:#e3c477;text-decoration:underline}.catalogue-pdf-thumbnails{flex:none;height:112px;padding:8px 12px;display:flex;gap:10px;overflow-x:auto;overflow-y:hidden;overscroll-behavior-x:contain;touch-action:pan-x;scrollbar-width:thin;background:#fff;cursor:grab;user-select:none}.catalogue-pdf-thumbnails.is-pointer-down{cursor:grabbing}.catalogue-pdf-thumb{flex:none;width:66px;padding:3px;border:1px solid #d8dadd;background:#f6f7f7;color:#173350;cursor:pointer}.catalogue-pdf-thumb[aria-current=\"page\"],.catalogue-pdf-thumb:hover{border:2px solid #c69a47;padding:2px}.catalogue-pdf-thumb img{display:block;width:100%;height:55px;object-fit:contain;background:#e8edf0}.catalogue-pdf-thumb span{display:block;padding-top:2px;font-size:9px}.catalogue-viewer-caption{display:flex;justify-content:space-between;gap:12px;padding:10px 14px;color:#66717b;font-size:10px;letter-spacing:.04em}.catalogue-side{display:grid;gap:12px}.catalogue-info-card{padding:26px 25px 20px;background:#fff;border:1px solid #ebe8e1;box-shadow:0 12px 34px #102b4c0a}.catalogue-info-card .catalogue-kicker{margin-bottom:14px}.catalogue-info-card h2{margin:0 0 12px;color:var(--catalogue-navy);font:600 clamp(21px,2vw,25px)/1.2 var(--display);letter-spacing:-.035em}.catalogue-description{margin:0;color:#52606c;font-size:12px;line-height:1.65}.catalogue-facts{display:grid;gap:0;margin:16px 0 17px;padding:10px 0;border-top:1px solid #ece9e2;border-bottom:1px solid #ece9e2}.catalogue-facts>div{display:grid;grid-template-columns:18px minmax(82px,1fr) auto;gap:9px;align-items:center;min-height:30px}.catalogue-facts svg,.catalogue-download svg,.catalogue-open svg,.catalogue-note svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.55;stroke-linecap:round;stroke-linejoin:round}.catalogue-facts svg{color:#a9853b}.catalogue-facts dt{color:#53616e;font-size:11px}.catalogue-facts dd{margin:0;color:#112d4d;font-size:11px;font-weight:700}.catalogue-download,.catalogue-open{display:flex;width:100%;min-height:43px;align-items:center;justify-content:center;gap:10px;padding:0 13px;text-align:center;text-decoration:none;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.catalogue-download{margin:0 0 9px;background:#c4a15e;border-color:#c4a15e;color:#102d4f}.catalogue-download:hover{background:#d7b875;border-color:#d7b875}.catalogue-download span,.catalogue-open span{margin-left:auto;font-size:15px}.catalogue-open{border:1px solid #8192a1;color:#102d4f}.catalogue-open:hover{background:#f0f3f5}.catalogue-note{display:grid;grid-template-columns:24px 1fr;gap:10px;align-items:start;padding:14px 16px;background:#eeefed;color:#64717c}.catalogue-note svg{color:#c39a4e}.catalogue-note p{margin:0;font-size:11px;line-height:1.6}\n@keyframes catalogue-title-enter{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}\n@media(max-width:900px){.catalogue-layout{grid-template-columns:minmax(0,1.3fr) minmax(275px,.9fr);gap:18px}.catalogue-info-card{padding:22px 18px}.catalogue-viewer{height:clamp(620px,76vh,850px);min-height:580px}}\n@media(max-width:700px){.catalogue-hero{min-height:285px}.catalogue-hero-image{object-position:58% center}.catalogue-hero-shade{background:linear-gradient(90deg,#082849f5 0%,#0b3155e5 62%,#0c315588 100%)}.catalogue-hero-inner{padding-top:calc(var(--site-header-stack,111px) + 48px);padding-bottom:25px}.catalogue-breadcrumb{margin-bottom:17px}.catalogue-hero h1{font-size:clamp(35px,9vw,48px)}.catalogue-hero-copy{max-width:390px;font-size:12px}.catalogue-desktop-break{display:none}.catalogue-content{padding:18px 0 22px}.catalogue-layout{grid-template-columns:1fr;gap:15px}.catalogue-viewer{height:78svh;min-height:560px;max-height:860px}.catalogue-pdf-toolbar{flex-wrap:wrap;justify-content:center}.catalogue-pdf-stage{min-height:0}.catalogue-info-card{padding:23px 20px}.catalogue-note{padding:13px 15px}.catalogue-viewer-caption{font-size:9px}}\n@media(prefers-reduced-motion:reduce){.catalogue-hero h1{animation-duration:.35s!important}.catalogue-pdf-thumb,.catalogue-download,.catalogue-open{transition-duration:.2s!important}}\n";
const aluminumEditorialStyles = String.raw`
.aluminum-editorial{padding:clamp(42px,6vw,76px) 0;background:#f7f7f4;color:#304257}
.aluminum-editorial>.wrap{width:min(1120px,calc(100% - 64px))}
.aluminum-editorial-content{max-width:980px;margin-inline:auto}
.aluminum-editorial-content p{margin:0 0 17px;color:#536477;font-size:15px;line-height:1.85}
.aluminum-editorial-content>p:first-of-type{color:#173958;font-size:17px;font-weight:500;line-height:1.8}
.aluminum-editorial-content h2{margin:36px 0 18px;padding:0 0 12px;border-bottom:1px solid #dce3e8;color:#0d2e52;font:600 clamp(24px,3vw,32px)/1.25 var(--display);letter-spacing:-.025em}
.aluminum-editorial-content h3{margin:24px 0 10px;color:#173958;font:600 clamp(18px,2.2vw,22px)/1.35 var(--display);letter-spacing:-.015em}
.aluminum-editorial-content h4{margin:17px 0 8px;color:#244b70;font:600 16px/1.4 var(--display)}
.aluminum-editorial-figure{width:100%;margin:18px auto 34px;overflow:hidden;border:1px solid #dce3e8;background:#edf1f3}
.aluminum-editorial-figure img{display:block;width:100%;height:auto;max-height:620px;object-fit:contain}
.aluminum-editorial-content h2:first-child,.aluminum-editorial-content h3:first-child,.aluminum-editorial-content h4:first-child{margin-top:0}
@media(max-width:700px){.aluminum-editorial{padding:36px 0}.aluminum-editorial>.wrap{width:calc(100% - 40px)}.aluminum-editorial-content p{font-size:14px;line-height:1.75}.aluminum-editorial-content>p:first-of-type{font-size:15px}.aluminum-editorial-content h2{margin:28px 0 14px;font-size:23px}.aluminum-editorial-content h3{margin:21px 0 8px;font-size:18px}.aluminum-editorial-content h4{margin:17px 0 7px;font-size:15px}.aluminum-editorial-figure{margin:14px auto 26px}.aluminum-editorial-figure img{max-height:440px}}
`;
fs.writeFileSync(path.join(publicDir, 'site.css'), siteStyles + showroomStyles + catalogueStyles + aluminumEditorialStyles + motion + '\n@media(max-width:700px){.contact-grid{grid-template-columns:minmax(0,1fr)}.contact-grid>*{min-width:0}}\n@media(max-width:700px){.showroom-filters select,.showroom-search-input input{min-height:44px}.showroom-search-submit,.showroom-nearby,.showroom-clear{min-height:44px}.showroom-result-actions>div button,.showroom-pagination button{width:44px;height:44px;min-width:44px;min-height:44px}.showroom-card-links button,.showroom-card-links a{display:inline-flex;min-height:44px;align-items:center}}\n@media(pointer:coarse){.showroom-filters select,.showroom-search-input input{min-height:44px}.showroom-search-submit,.showroom-nearby,.showroom-clear{min-height:44px}.showroom-result-actions>div button,.showroom-pagination button{width:44px;height:44px;min-width:44px;min-height:44px}.showroom-card-links button,.showroom-card-links a{display:inline-flex;min-height:44px;align-items:center}}');
const aboutCompactStyles = "\n/* Compact spacing for the About page only. */\n#main .about-page .about-hero{min-height:clamp(440px,50vh,600px)}\n#main .about-page .about-hero-inner{padding:86px 0 42px}\n#main .about-page .about-breadcrumb{margin-bottom:24px}\n#main .about-page .about-origin{min-height:0}\n#main .about-page .about-origin-copy{padding-block:40px}\n#main .about-page .about-origin-media{height:clamp(460px,42vw,600px);min-height:0}\n#main .about-page .about-origin-media img{min-height:0}\n#main .about-page .about-feature{min-height:0}\n#main .about-page .about-feature-copy{padding:clamp(36px,4.5vw,58px) clamp(28px,5vw,64px)}\n#main .about-page .about-feature-copy h2{margin-bottom:12px}\n#main .about-page .about-feature-copy>p:not(.about-kicker){margin-bottom:10px;line-height:1.62}\n#main .about-page .about-feature-media{height:clamp(420px,38vw,560px);min-height:0}\n#main .about-page .about-feature-media img{min-height:0}\n#main .about-page .about-values{padding-block:58px}\n@media(max-width:700px){\n #main .about-page .about-hero{min-height:clamp(510px,72svh,610px)}\n #main .about-page .about-hero-inner{padding:calc(var(--site-header-stack,111px) + 22px) 0 42px}\n #main .about-page .about-breadcrumb{margin-bottom:24px}\n #main .about-page .about-origin-copy{padding:34px 0 26px}\n #main .about-page .about-origin-media{height:min(76vw,300px);min-height:0}\n #main .about-page .about-origin-media img{min-height:0}\n #main .about-page .about-feature-copy{padding:34px 20px 28px}\n #main .about-page .about-feature-media{height:min(67vw,280px);min-height:0}\n #main .about-page .about-values{padding-block:42px}\n}\n";
fs.appendFileSync(path.join(publicDir, 'site.css'), aboutCompactStyles);
const productCategoryCompactStyles = String.raw`
/* Compact vertical rhythm for product category pages only. */
#main:has(.aluminum-editorial)>.section{padding-block:62px}
#main:has(.aluminum-editorial)>.page-hero-compact{padding-top:calc(var(--site-header-stack,128px) + 34px);padding-bottom:16px}
#main:has(.aluminum-editorial)>.page-hero-compact h1{margin-top:8px}
#main:has(.aluminum-editorial) .section-head{margin-bottom:26px}
#main:has(.aluminum-editorial) .product-guide-layout{gap:24px}
#main:has(.aluminum-editorial) .product-guide-gallery{min-height:440px}
#main:has(.aluminum-editorial) .product-guide-gallery-count-2{min-height:350px}
#main:has(.aluminum-editorial) .product-guide-gallery-count-1{min-height:390px}
#main:has(.aluminum-editorial) .product-guide-copy{gap:17px}
#main:has(.aluminum-editorial) .product-guide-topic+.product-guide-topic{padding-top:15px}
#main:has(.aluminum-editorial) .product-guide-point{padding:12px 13px}
#main:has(.aluminum-editorial) .product-guide-label{margin-bottom:8px}
#main:has(.aluminum-editorial) .aluminum-editorial{padding-block:38px}
#main:has(.aluminum-editorial) .aluminum-editorial-content p{margin-bottom:12px;line-height:1.72}
#main:has(.aluminum-editorial) .aluminum-editorial-content h2{margin:27px 0 13px;padding-bottom:9px}
#main:has(.aluminum-editorial) .aluminum-editorial-content h3{margin:18px 0 8px}
#main:has(.aluminum-editorial) .aluminum-editorial-content h4{margin:14px 0 6px}
#main:has(.aluminum-editorial) .aluminum-editorial-figure{margin:12px auto 22px}
#main:has(.aluminum-editorial) .aluminum-pricing .detail-copy{margin-bottom:14px;line-height:1.65}
#main:has(.aluminum-editorial) .aluminum-faq-list{gap:10px}
#main:has(.aluminum-editorial) .aluminum-faq-item{padding:17px 19px}
#main:has(.aluminum-editorial) .quote-band{padding-block:48px}
#main:has(.aluminum-editorial) .quote-grid{gap:30px}
@media(max-width:1000px){
 #main:has(.aluminum-editorial)>.section{padding-block:48px}
 #main:has(.aluminum-editorial) .product-guide-gallery{min-height:380px}
 #main:has(.aluminum-editorial) .product-guide-gallery-count-2{min-height:310px}
 #main:has(.aluminum-editorial) .product-guide-gallery-count-1{min-height:340px}
}
@media(max-width:700px){
 #main:has(.aluminum-editorial)>.section{padding-block:30px}
 #main:has(.aluminum-editorial)>.page-hero-compact{padding-top:calc(var(--site-header-stack,111px) + 30px);padding-bottom:12px}
 #main:has(.aluminum-editorial) .section-head{margin-bottom:18px}
 #main:has(.aluminum-editorial) .section-head h2{font-size:clamp(27px,7vw,36px)}
 #main:has(.aluminum-editorial) .product-guide-layout{gap:18px}
 #main:has(.aluminum-editorial) .product-guide-gallery{min-height:260px;grid-template-rows:repeat(2,minmax(120px,1fr));gap:7px}
 #main:has(.aluminum-editorial) .product-guide-gallery-count-2{min-height:220px;grid-template-rows:minmax(210px,1fr)}
 #main:has(.aluminum-editorial) .product-guide-gallery-count-1{min-height:250px;grid-template-rows:minmax(240px,1fr)}
 #main:has(.aluminum-editorial) .product-guide-copy{gap:14px}
 #main:has(.aluminum-editorial) .product-guide-topic+.product-guide-topic{padding-top:13px}
 #main:has(.aluminum-editorial) .product-guide-point{padding:11px}
 #main:has(.aluminum-editorial) .aluminum-editorial{padding-block:25px}
 #main:has(.aluminum-editorial) .aluminum-editorial>.wrap{width:calc(100% - 32px)}
 #main:has(.aluminum-editorial) .aluminum-editorial-content p{margin-bottom:10px;font-size:14px;line-height:1.65}
 #main:has(.aluminum-editorial) .aluminum-editorial-content>p:first-of-type{font-size:14px;line-height:1.65}
 #main:has(.aluminum-editorial) .aluminum-editorial-content h2{margin:22px 0 10px;padding-bottom:7px;font-size:21px}
 #main:has(.aluminum-editorial) .aluminum-editorial-content h3{margin:16px 0 6px;font-size:17px}
 #main:has(.aluminum-editorial) .aluminum-editorial-content h4{margin:12px 0 5px;font-size:15px}
 #main:has(.aluminum-editorial) .aluminum-editorial-figure{margin:10px auto 16px}
 #main:has(.aluminum-editorial) .aluminum-editorial-figure img{max-height:320px}
 #main:has(.aluminum-editorial) .aluminum-pricing th,#main:has(.aluminum-editorial) .aluminum-pricing td{padding:11px 12px;font-size:12px}
 #main:has(.aluminum-editorial) .aluminum-faq-item{padding:14px}
 #main:has(.aluminum-editorial) .quote-band{padding-block:30px}
 #main:has(.aluminum-editorial) .quote-grid{gap:18px}
}
`;
fs.appendFileSync(path.join(publicDir, 'site.css'), productCategoryCompactStyles);
