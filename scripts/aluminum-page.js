  // Keep this content on /san-pham/cua-nhom only; other product pages use the existing templates.
  // This demo contains no links to external Eurowindow websites.
  const aluminumSource='#';
  const aluminumImageBase='https://storage.sudospaces.com/eurowindow/';
  const aluminumSystem=(slug)=>{
    const confirmed={
      'cua-di-nhom-1-canh-mo-quay-trong':'EA55, EA60i',
      'cua-di-nhom-2-canh-mo-quay-trong':'EA55, EA60i',
      'cua-di-nhom-2-canh-mo-quay-ngoai':'EA55, EA60i',
      'cua-di-nhom-1-canh-mo-quay-ngoai':'EA55, EA60i',
      'cua-di-nhom-2-canh-mo-truot':'EA90, EA95i, SC95',
      'cua-di-nhom-4-canh-mo-truot':'EA90, EA95i, EA115',
      'cua-di-nhom-4-canh-xep-truot':'EA55',
      'cua-so-nhom-1-canh-mo-quay-trong':'EA55, EA60i',
      'cua-so-nhom-2-canh-mo-quay-trong':'EA55, EA60i',
      'cua-so-nhom-1-canh-mo-quay-ngoai':'EA55, EA60i',
      'cua-so-nhom-2-canh-mo-quay-ngoai':'EA55, EA60i'
    };
    return confirmed[slug] ? 'Hệ ' + confirmed[slug] : 'Cần xác nhận tùy mẫu';
  };
  const aluminumProductRows=[
    ['Cửa đi nhôm 1 cánh mở quay trong','Cửa đi','Mở quay trong','2021/12/1-7-medium.jpg.webp','cua-di-nhom/cua-di-nhom-1-canh-mo-quay-trong.html'],
    ['Cửa đi nhôm 2 cánh mở quay trong','Cửa đi','Mở quay trong','2022/04/3-medium.jpg.webp','cua-di-nhom/cua-di-nhom-2-canh-mo-quay-trong.html'],
    ['Cửa đi nhôm 2 cánh mở quay ngoài','Cửa đi','Mở quay ngoài','2022/03/cuadi2canhmoquayngoai-medium.jpg.webp','cua-di-nhom/cua-di-nhom-2-canh-mo-quay-ngoai.html'],
    ['Cửa đi nhôm 1 cánh mở quay ngoài','Cửa đi','Mở quay ngoài','2022/03/cua-di-1-canh-mo-quay-medium.jpg.webp','cua-di-nhom/cua-di-nhom-1-canh-mo-quay-ngoai.html'],
    ['Cửa đi nhôm 2 cánh mở trượt','Cửa đi','Mở trượt','2022/03/cua-di-mo-truot-2-canh-medium.jpg.webp','cua-di-nhom/cua-di-nhom-2-canh-mo-truot.html'],
    ['Cửa đi nhôm 4 cánh mở trượt','Cửa đi','Mở trượt','2024/10/1-5-camera-003-medium.jpg.webp','cua-di-nhom/cua-di-nhom-4-canh-mo-truot.html'],
    ['Cửa đi nhôm 4 cánh xếp trượt','Cửa đi','Xếp trượt','2022/03/cua-di-nhom-xep-truot-4-canh-medium.jpg.webp','cua-di-nhom/cua-di-nhom-4-canh-xep-truot.html'],
    ['Cửa sổ nhôm 1 cánh mở quay trong','Cửa sổ','Mở quay trong','2021/12/untitled-3-medium.jpg.webp','cua-so-nhom/cua-so-nhom-1-canh-mo-quay-trong.html'],
    ['Cửa sổ nhôm 2 cánh mở quay trong','Cửa sổ','Mở quay trong','2021/12/untitled-3-2-medium.jpg.webp','cua-so-nhom/cua-so-nhom-2-canh-mo-quay-trong.html'],
    ['Cửa sổ nhôm 1 cánh mở quay ngoài','Cửa sổ','Mở quay ngoài','2021/12/1-11-medium.jpg.webp','cua-so-nhom/cua-so-nhom-1-canh-mo-quay-ngoai.html'],
    ['Cửa sổ nhôm 2 cánh mở quay ngoài','Cửa sổ','Mở quay ngoài','2021/12/untitled-3-1-medium.jpg.webp','cua-so-nhom/cua-so-nhom-2-canh-mo-quay-ngoai.html'],
    ['Cửa sổ nhôm 2 cánh mở trượt','Cửa sổ','Mở trượt','2021/12/1-9-medium.jpg.webp','cua-so-nhom/cua-so-nhom-2-canh-mo-truot.html'],
    ['Cửa sổ nhôm mở hất','Cửa sổ','Mở hất','2021/12/3-12-medium.jpg.webp','cua-so-nhom/cua-so-nhom-mo-hat.html'],
    ['Cửa sổ nhôm mở quay lật trong','Cửa sổ','Mở quay lật','2021/12/anh1-1-medium.jpg.webp','cua-so-nhom/cua-so-nhom-mo-quay-lat-trong.html'],
    ['Vách nhôm kính lớn hệ Stick','Vách kính','Cố định','2021/12/vachstick-medium.jpg.webp','vach-kinh-nhom/vach-nhom-kinh-lon-he-stick.html'],
    ['Vách nhôm kính lớn hệ Spider','Vách kính','Cố định','2021/12/vachnhom-medium.jpg.webp','vach-kinh-nhom/vach-nhom-kinh-lon-he-spider.html'],
    ['Vách nhôm kính hệ Semi-Unitized','Vách kính','Cố định','2021/12/vachsemiunitized-medium.jpg.webp','vach-kinh-nhom/vach-nhom-kinh-he-semi-unitized.html'],
    ['Vách nhôm kính lớn hệ Unitized','Vách kính','Cố định','2021/12/vachunitized1-medium.jpg.webp','vach-kinh-nhom/vach-nhom-kinh-lon-he-unitized.html'],
    ['Mái che','Vách kính','Cố định','2021/12/maiche-medium.jpg.webp','vach-kinh-nhom/mai-che.html']
  ];
  const aluminumLocalImages=[
    '/images/eurowindow-products/cua-di-nhom-mo-quay-trong-1-canh-eurowindow.webp',
    '/images/door-reference/nhom-Cua-nhom-mo-quay-2-canh.jpg',
    '/images/door-reference/nhom-Cua-nhom-mo-quay-2-canh--1.jpg',
    '/images/eurowindow-products/cua-di-nhom-mo-quay-ngoai-1-canh-eurowindow.webp',
    '/images/door-reference/nhom-Cua-nhom-mo-truot-2-canh.jpg',
    '/images/door-reference/nhom-Cua-nhom-mo-truot-4-canh-clean.png',
    '/images/eurowindow-products/cua-di-nhom-xep-truot-4-canh-eurowindow.webp',
    '/images/eurowindow-products/cua-so-nhom-mo-quay-trong-1-canh-eurowindow.webp',
    '/images/door-reference/nhom-Cua-so-nhom-mo-quay-2-canh.jpg',
    '/images/eurowindow-products/cua-so-nhom-mo-quay-ngoai-1-canh-eurowindow.webp',
    '/images/door-reference/nhom-Cua-so-nhom-mo-quay-2-canh.jpg',
    '/images/door-reference/nhom-Cua-so-nhom-mo-trout-2-canh.jpg',
    '/images/door-reference/nhom-Cua-so-nhom-mo-hat-1-canh.jpg',
    '/images/eurowindow-products/cua-so-nhom-quay-lat-trong-eurowindow.webp',
    '/images/eurowindow-products/vach-nhom-kinh-stick-eurowindow.webp',
    '/images/eurowindow-products/vach-nhom-kinh-spider-eurowindow.webp',
    '/images/eurowindow-products/vach-nhom-kinh-semi-unitized-eurowindow.webp',
    '/images/eurowindow-products/vach-nhom-kinh-unitized-eurowindow.webp',
    '/images/eurowindow-products/mai-che-kinh-eurowindow.webp'
  ];
const aluminumProducts=aluminumProductRows.map(([name,type,opening,image,source],index)=>{const slug=source.split('/').pop().replace(/\.html$/,'');return {name,type,opening,slug,image:productImageManifest[slug]?.[0]||aluminumLocalImages[index]||aluminumImageBase+image,system:aluminumSystem(slug),filter:type}});
  // The system tab reuses every existing product card; its filters are the assigned systems.
  const aluminumProfiles=aluminumProducts.map(item=>({...item,filter:item.system}));
  function aluminumCatalogCard(item){return `<article class="door-catalog-card"><a class="door-catalog-card-hit" href="${BASE_PATH}/san-pham/cua-nhom/${item.slug}/" aria-label="Xem chi tiết ${item.name}"><div class="door-catalog-visual"><img loading="lazy" src="${item.image}" alt="${item.name}"></div><div class="door-catalog-info"><h3>${item.name}</h3>${item.summary?`<p class="aluminum-card-summary">${item.summary}</p>`:''}<ul class="door-catalog-meta"><li>Hệ sản phẩm: ${item.system}</li><li>Loại cửa: ${item.type}</li><li>Cơ chế đóng mở: ${item.opening}</li></ul><span class="door-catalog-card-cta">Xem chi tiết sản phẩm <span aria-hidden="true">↗</span></span></div></a></article>`}
  function officialAluminumCatalog(){const catalog={system:{label:'THEO HỆ SẢN PHẨM',items:aluminumProfiles},type:{label:'THEO LOẠI CỬA',items:aluminumProducts},opening:{label:'THEO CƠ CHẾ ĐÓNG MỞ',items:aluminumProducts.map(item=>({...item,filter:item.opening}))}};window.__EURO_ALUMINUM_CATALOG__=catalog;const group='type',items=catalog[group].items,filters=['Tất cả',...new Set(items.map(item=>item.filter))];return `<section class="door-catalog official-aluminum-catalog"><div class="wrap"><div class="section-head door-catalog-heading"><div><span class="eyebrow">02 / DANH MỤC CỬA NHÔM</span><h2 class="serif">Các dòng sản phẩm</h2></div><p>Xem các mẫu cửa đi, cửa sổ và vách kính theo kiểu mở hoặc hệ nhôm.</p></div><div class="door-catalog-tabs" role="tablist" aria-label="Phân loại cửa nhôm">${Object.entries(catalog).map(([key,data])=>`<button type="button" role="tab" aria-selected="${key===group}" class="door-catalog-tab ${key===group?'active':''}" data-catalog-tab="${key}">${data.label}</button>`).join('')}</div><div class="door-catalog-filters" data-catalog-filters>${filters.map((filter,i)=>`<button type="button" class="door-catalog-filter ${i===0?'active':''}" data-catalog-filter="${i===0?'all':filter}">${filter}</button>`).join('')}</div><div class="door-catalog-grid" data-catalog-grid>${items.map(aluminumCatalogCard).join('')}</div></div></section>`}
  function officialAluminumPage(){
    const gallery=aluminumProducts
      .filter(item=>item.type==='Cửa đi'||item.type==='Cửa sổ')
      .flatMap(item=>(productImageManifest[item.slug]||[item.image]).map((image,index)=>({...item,image,photoIndex:index})))
      .slice(0,12);
    const faq=[
      ['Cửa nhôm Eurowindow có tốt không?','Cửa nhôm Eurowindow có khung chắc chắn, nhiều kiểu mở và mẫu mã hiện đại. Sản phẩm phù hợp cửa đi, cửa sổ và vách kính trong nhà ở, văn phòng.'],
      ['Cửa nhôm Eurowindow giá bao nhiêu?','Giá cửa nhôm thay đổi theo mẫu cửa, dòng sản phẩm, màu sắc và thời điểm. Liên hệ Eurowindow để nhận thông tin báo giá mới nhất.'],
      ['Cửa nhôm kính có cách âm tốt không?','Khả năng cách âm phụ thuộc vào toàn bộ bộ cửa, gồm profile, kính, gioăng, độ kín khít và cách lắp đặt. Kính hộp hoặc kính phù hợp với yêu cầu âm học có thể được cân nhắc theo vị trí công trình.'],
      ['Nên chọn cửa mở quay hay mở trượt?','Cửa mở quay thường cho độ mở rộng và độ kín khít tốt; cửa mở trượt tiết kiệm diện tích thao tác. Chọn kiểu mở theo không gian, hướng gió, tần suất sử dụng và cách bố trí nội thất.'],
      ['Cần lưu ý gì khi lắp đặt cửa nhôm kính?','Cửa nhôm kính cần được lắp đúng hướng mở và sử dụng đồng bộ với phụ kiện của sản phẩm để cửa vận hành êm, kín khít.']
    ];
    return `${pageHero('Sản phẩm','Cửa nhôm Eurowindow','').replace('<section class="page-hero">','<section class="page-hero page-hero-compact">').replace('<p></p>','')}<section class="section"><div class="wrap detail-grid"><div class="detail-gallery" data-gallery><div class="gallery-stage">${gallery.map((item,i)=>`<button type="button" class="gallery-slide ${i===0?'active':''}" data-gallery-slide="${i}" aria-label="Xem ảnh ${item.name}"><img loading="lazy" alt="${item.name}" src="${item.image}"><span class="gallery-caption">${item.type} · ${String(i+1).padStart(2,'0')} / ${String(gallery.length).padStart(2,'0')}</span></button>`).join('')}</div><div class="gallery-controls"><button type="button" data-gallery-prev aria-label="Ảnh trước">&larr;</button><span class="gallery-counter" data-gallery-counter>01 / ${String(gallery.length).padStart(2,'0')}</span><button type="button" data-gallery-next aria-label="Ảnh tiếp theo">&rarr;</button></div></div><div class="detail-info"><span class="detail-label">Cửa đi, cửa sổ và vách nhôm kính</span><h2>Cửa nhôm Eurowindow</h2><div class="detail-copy"><p><strong>Cửa nhôm Eurowindow</strong> có các mẫu cửa đi, cửa sổ và vách kính. Chọn kiểu mở quay khi cần khoảng mở rộng; chọn cửa trượt khi muốn tiết kiệm diện tích. Cửa xếp trượt phù hợp với lối ra sân vườn hoặc ban công rộng.</p><p>Cửa nhôm Eurowindow có nhiều mẫu dành cho nhà phố, biệt thự và chung cư. Tùy kiểu mở, sản phẩm có thể tạo lối đi rộng, tiết kiệm diện tích hoặc kết nối phòng với ban công và sân vườn.</p></div><a class="button" href="/bao-gia">Nhận tư vấn và báo giá <span class="arrow">&nearr;</span></a></div></div></section>${officialAluminumCatalog()}<section class="aluminum-overview"><div class="wrap aluminum-overview-grid"><div class="aluminum-overview-image"><img loading="lazy" src="${aluminumProducts[14].image}" alt="Vách nhôm kính cho công trình hiện đại"></div><div class="aluminum-overview-copy"><span class="eyebrow">LỰA CHỌN GIẢI PHÁP</span><h2>Chọn cửa nhôm theo vị trí sử dụng</h2><p>Cửa đi phục vụ lối ra vào; cửa sổ lấy sáng và thông gió; vách kính mở rộng tầm nhìn ở mặt tiền hoặc không gian chung. Hãy bắt đầu từ công năng của từng vị trí.</p><p>Một số hệ nhôm có cầu cách nhiệt; cấu tạo này hạn chế truyền nhiệt qua khung. Mức cách âm và cách nhiệt của cả bộ cửa phụ thuộc hệ nhôm, kính, gioăng, phụ kiện và cách lắp đặt. Hãy đối chiếu thông số của sản phẩm trước khi lựa chọn.</p><div class="aluminum-overview-points"><article><h3>Cửa đi nhôm kính</h3><p>Mở quay tạo lối đi rộng. Mở trượt tiết kiệm chỗ; xếp trượt giúp mở gần hết ô cửa.</p></article><article><h3>Cửa sổ nhôm kính</h3><p>Chọn mở quay, mở hất, quay lật hoặc mở trượt theo vị trí cửa và nhu cầu thông gió.</p></article><article><h3>Cửa nhôm cầu cách nhiệt</h3><p>Phù hợp vị trí chịu nắng nhiều hoặc khi gia chủ muốn giảm truyền nhiệt qua khung cửa.</p></article><article><h3>Vách kính mặt tiền</h3><p>Dùng cho mặt tiền cần nhiều ánh sáng. Kích thước và kết cấu cần tính theo tải trọng gió của công trình.</p></article></div></div></div></section><section class="section aluminum-benefits"><div class="wrap"><div class="section-head"><div><span class="eyebrow">CHỌN THEO NHU CẦU</span><h2 class="serif">Giải pháp cho từng kiểu công trình</h2></div></div><div class="aluminum-benefit-grid"><article><h3>Nhà phố</h3><p>Nhà mặt phố thường cần giảm tiếng ồn và hạn chế nắng gắt. Cửa trượt hữu ích ở nơi không đủ chỗ cho cánh mở.</p></article><article><h3>Biệt thự</h3><p>Cửa mở rộng hoặc xếp trượt nối phòng khách với sân vườn. Chọn kính và phụ kiện theo kích thước cửa.</p></article><article><h3>Chung cư</h3><p>Kiểm tra quy định của tòa nhà trước khi thay cửa. Chọn kiểu mở và kính phù hợp với hướng căn hộ, tiếng ồn và nhu cầu thông gió.</p></article><article><h3>Mặt tiền hiện đại</h3><p>Vách kính giúp mặt tiền sáng và thoáng. Thiết kế cần tính tải trọng gió, thoát nước và cách bảo trì.</p></article></div></div></section><section class="section aluminum-pricing"><div class="wrap"><div class="section-head"><div><span class="eyebrow">TƯ VẤN CHI PHÍ</span><h2 class="serif">Báo giá cửa nhôm Eurowindow</h2></div><p>Giá phụ thuộc vào hệ nhôm, kính, phụ kiện, kích thước và khối lượng lắp đặt.</p></div><p class="detail-copy">Liên hệ Eurowindow để được giới thiệu mẫu cửa phù hợp và nhận thông tin giá bán mới nhất.</p><a class="button" href="/bao-gia">Yêu cầu báo giá cửa nhôm kính <span class="arrow">&nearr;</span></a></div></section><section class="section aluminum-faq"><div class="wrap"><div class="section-head"><div><span class="eyebrow">GIẢI ĐÁP THƯỜNG GẶP</span><h2 class="serif">Tư vấn chọn cửa nhôm kính</h2></div></div><div class="aluminum-faq-list">${faq.map(([q,a])=>`<article class="aluminum-faq-item"><h3>${q}</h3><p>${a}</p></article>`).join('')}</div></div></section><section class="quote-band"><div class="wrap quote-grid"><div><span class="eyebrow">TƯ VẤN CỬA NHÔM</span><h2 class="serif">Chọn Cửa phù hợp<br><span class="gold">với công trình của bạn</span></h2><p>Chia sẻ vị trí lắp, kích thước ô chờ và nhu cầu sử dụng để được tư vấn lựa chọn.</p></div>${form(true)}</div></section>`;
  }

