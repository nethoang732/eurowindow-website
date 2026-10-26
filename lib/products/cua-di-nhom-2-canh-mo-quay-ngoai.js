import productImageManifest from './product-image-manifest.json';

const legacyGallery = [
  '/images/door-reference/nhom-Cua-nhom-mo-quay-2-canh--2.jpg',
  '/images/door-reference/nhom-Cua-nhom-mo-quay-2-canh--3.jpg',
  '/images/door-reference/nhom-Cua-nhom-mo-quay-2-canh.jpg',
  '/images/door-reference/nhom-Cua-nhom-mo-quay-2-canh--1.jpg',
  '/images/door-reference/nhom-Cua-nhom-mo-quay-2-canh--4.jpg'
];
const galleryPhotos = productImageManifest['cua-di-nhom-2-canh-mo-quay-ngoai'] || legacyGallery;
const productGallery = galleryPhotos.map((src) => ({ src, alt: 'Cửa đi nhôm 2 cánh mở quay ngoài Eurowindow' }));
const product = {
  slug: 'cua-di-nhom-2-canh-mo-quay-ngoai',
  name: 'Cửa đi nhôm 2 cánh mở quay ngoài',
  category: 'Cửa đi nhôm',
  summary: 'Cửa nhôm kính hai cánh mở ra ngoài, giữ thông thoáng diện tích sàn phía trong. Dùng cho lối ra ban công, hiên, sân sau và lối đi phụ.',
  description: 'Cửa đi nhôm kính hai cánh mở quay ra ngoài. Cánh cửa mở về phía ngoài công trình, không chiếm diện tích sàn bên trong. Kích thước được sản xuất theo ô chờ thực tế.',
  constructionFacts: [
    ['Profile nhôm', 'Hợp kim 6063-T5, hoàn thiện bằng sơn tĩnh điện.'],
    ['Hệ nhôm', 'Có thể dùng hệ EA60i hoặc EA55. Riêng EA60i có cầu cách nhiệt polyamide PA66.'],
    ['Kính', 'Kính đơn cường lực hoặc kính an toàn dày 5–12,38 mm; kính hộp dày 18–32 mm.'],
    ['Gioăng', 'Gioăng EPDM.'],
    ['Phụ kiện', 'Phụ kiện có thể chọn từ Cmech hoặc Eurowindow.'],
    ['Màu hoàn thiện', 'Xám sần, RAL 9007 sần, RAL 7022 sần, RAL 9010 bóng hoặc vân gỗ.']
  ],
  specifications: [
    ['Loại cửa', 'Cửa đi nhôm kính'],
    ['Số cánh', '2 cánh'],
    ['Hướng mở', 'Mở quay ra ngoài'],
    ['Kích thước phổ biến', '1.400 × 2.200 mm; 1.600 × 2.400 mm']
  ],
  benefits: [
    ['Thông thoáng diện tích bên trong', 'Cánh mở ra ngoài, giữ diện tích sàn phía trong thông thoáng khi đóng mở.'],
    ['Khẩu độ mở rộng', 'Hai cánh mở tối đa 180°, tạo lối đi rộng giữa các không gian.'],
    ['Kết nối trong và ngoài nhà', 'Lắp tại cửa ra ban công, hiên, sân sau hoặc lối đi phụ.']
  ],
  applications: [
    ['Ban công', 'Tạo lối đi trực tiếp giữa phòng và ban công.'],
    ['Hiên và sân vườn', 'Kết nối không gian trong nhà với hiên hoặc sân vườn.'],
    ['Lối đi phụ', 'Giữ diện tích sàn trong nhà thông thoáng khi mở cửa.']
  ],
  faqs: [
    ['Cửa đi nhôm 2 cánh mở quay ngoài dùng ở đâu?', 'Sản phẩm dùng cho cửa ra ban công, hiên, sân sau và lối đi phụ.'],
    ['Cửa mở theo hướng nào?', 'Hai cánh mở ra phía ngoài công trình. Bố trí cửa với khoảng trống đủ rộng ở phía ngoài.'],
    ['Kích thước cửa phổ biến là bao nhiêu?', 'Kích thước phổ biến gồm 1.400 × 2.200 mm và 1.600 × 2.400 mm. Cửa được sản xuất theo ô chờ thực tế của công trình.'],
    ['Cửa có những chọn cửa nào?', 'Hệ nhôm EA60i hoặc EA55; kính đơn cường lực hoặc an toàn dày 5–12,38 mm; kính hộp dày 18–32 mm; phụ kiện Cmech hoặc Eurowindow.'],
    ['Giá cửa được tính theo yếu tố nào?', 'Giá được tính theo kích thước, hệ nhôm, loại kính, màu hoàn thiện và phụ kiện. Gọi (024) 3747 4700 để nhận báo giá.']
  ],
  gallery: productGallery,
  detailImage: {
    src: productGallery[0].src,
    alt: productGallery[0].alt
  },
  showBatchExtensions: true,
  related: ['cua-di-nhom-2-canh-mo-quay-trong', 'cua-di-nhom-4-canh-mo-truot']
};
export default product;
