  const productCatalogData={
    'cua-upvc':[
      ['Cửa đi uPVC 1 cánh mở quay ngoài','2026/09/cua-di-upvc-1-canh-mo-quay-ra-ngoai.jpg.webp','Cửa đi','Mở quay ngoài'],
      ['Cửa đi uPVC 2 cánh mở quay ngoài','2026/09/cua-di-upvc-2-canh-mo-quay-ra-ngoai.jpg.webp','Cửa đi','Mở quay ngoài'],
      ['Cửa đi uPVC 2 cánh mở trượt','2026/09/cua-di-upvc-2-canh-mo-truot.jpg.webp','Cửa đi','Mở trượt'],
      ['Cửa đi uPVC 4 cánh xếp trượt','2026/09/cua-di-upvc-4-canh-xep-truot.jpg.webp','Cửa đi','Xếp trượt'],
      ['Cửa sổ uPVC mở hất','2026/10/cua-so-upvc-5.jpg.webp','Cửa sổ','Mở hất']
    ],
    'cua-go':[
      ['Cửa gỗ tự nhiên Eurowindow','2026/09/cua-go-tu-nhien-eurowindow.jpg.webp','Cửa gỗ','Gỗ tự nhiên'],
      ['Cửa gỗ công nghiệp Eurowindow','2026/09/cua-go-cong-nghiep-eurowindow.jpg.webp','Cửa gỗ','Gỗ công nghiệp'],
      ['Cửa gỗ ghép thanh Eurowindow','2026/09/cua-go-ghep-thanh-eurowindow.jpg.webp','Cửa gỗ','Gỗ ghép thanh']
    ],
    'cua-cuon':[
      ['Cửa cuốn nhôm khe thoáng EASD45','https://sudospaces.com/eurowindow/2022/05/w600/cuacuon.jpg.webp','Cửa cuốn','Khe thoáng']
    ],
    'cua-thong-minh-the-he-moi':[
      ['Cửa trượt Slim ray treo','2026/07/cua-truot-slim-ray-treo-giup-tong-the-khong-gian-tro-nen-hai-hoa-thoang-dang-hon.jpg.webp','Cửa thông minh','Trượt ray treo']
    ],
    'vach-kinh-mat-dung':[
      ['Kính cường lực và bán cường lực','2026/07/san-pham-kinh-cua-eurowindow-dam-bao-do-an-toan-phu-hop-voi-nhieu-hang-muc-cong-trinh.jpg.webp','Sản phẩm kính','Kính tôi nhiệt'],
      ['Hộp kính và hộp kính khổ lớn','2026/07/cac-san-pham-kinh-cua-eurowindow-duoc-gia-cong-dong-bo-dam-bao-do-chinh-xac-truoc-khi-dua-vao-cong-trinh.jpg.webp','Sản phẩm kính','Hộp kính'],
      ['Kính an toàn','2026/07/san-pham-kinh-cua-eurowindow-dam-bao-do-an-toan-phu-hop-voi-nhieu-hang-muc-cong-trinh.jpg.webp','Sản phẩm kính','Kính dán an toàn'],
      ['Kính cách nhiệt an toàn ACT','2026/07/kinh-can-nhiet-low-e-phu-lop-kim-loai-sieu-mong-co-kha-nang-han-che-khoang-40-su-truyen-nhiet-vao-mua-he-chong-nong-hieu-qua-on-dinh-nhiet-do-trong-nha.jpg.webp','Sản phẩm kính','Kính cách nhiệt'],
      ['Kính hoa văn','2026/07/kinh-hoa-van-cua-eurowindow.jpg.webp','Sản phẩm kính','Kính trang trí'],
      ...aluminumProducts.filter(item=>item.type==='Vách kính').map(item=>[item.name,item.image,'Vách nhôm kính',item.opening])
    ]
  };
  function productCatalogRows(slug){
    let rows=productCatalogData[slug];
    if(!rows&&slug==='cua-xep-truot') rows=aluminumProducts.filter(item=>item.type==='Cửa đi'&&item.opening==='Xếp trượt').map(item=>[item.name,item.image,'Cửa đi',item.opening]);
    if(!rows&&slug.startsWith('cua-di-')) rows=aluminumProducts.filter(item=>item.type==='Cửa đi'&&(slug==='cua-di-mo-quay'?item.opening.includes('quay'):slug==='cua-di-mo-truot'?item.opening==='Mở trượt':item.opening==='Xếp trượt')).map(item=>[item.name,item.image,'Cửa đi',item.opening]);
    if(!rows&&slug.startsWith('cua-so-')) rows=aluminumProducts.filter(item=>item.type==='Cửa sổ'&&(slug==='cua-so-mo-quay'?item.opening.includes('quay'):item.opening==='Mở hất')).map(item=>[item.name,item.image,'Cửa sổ',item.opening]);
    return rows||[];
  }
  function productCatalogImage(image){return image.startsWith('http')?image:'https://storage.sudospaces.com/eurowindow/'+image}
  function productCatalogSection(slug){
    const rows=productCatalogRows(slug);
    if(!rows.length)return '';
    const title=productPageContent[slug].title;
    const headingTitle=title.toLocaleLowerCase('vi').replace(/\bupvc\b/g,'uPVC').replace(/\beurowindow\b/g,'Eurowindow');
    return '<section class="door-catalog product-family-catalog"><div class="wrap"><div class="section-head door-catalog-heading"><div><span class="eyebrow">DANH MỤC SẢN PHẨM</span><h2 class="serif">Các mẫu '+headingTitle+'</h2></div><p>Mẫu mã và cấu hình được xác nhận theo nhu cầu, kích thước và điều kiện thực tế của công trình.</p></div><div class="door-catalog-grid">'+rows.map(row=>{const name=row[0],image=row[1],type=row[2],opening=row[3];return '<article class="door-catalog-card"><div class="door-catalog-visual"><img loading="lazy" src="'+productCatalogImage(image)+'" alt="'+name+'"></div><div class="door-catalog-info"><h3>'+name+'</h3><a class="button" href="/bao-gia?san-pham='+encodeURIComponent(name)+'">Liên hệ báo giá</a><ul class="door-catalog-meta"><li>Danh mục: '+type+'</li><li>Kiểu mở / cấu hình: '+opening+'</li></ul></div></article>';}).join('')+'</div></div></section>';
  }
