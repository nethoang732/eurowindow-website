import approvedDoor from './cua-di-nhom-2-canh-mo-quay-ngoai';
import productImageManifest from './product-image-manifest.json';

const doorFacts = [
  ['Thanh profile', 'Nhôm hợp kim 6063-T5, hoàn thiện sơn tĩnh điện.'],
  ['Hệ nhôm', 'EA55 hoặc EA60i; chi tiết cụ thể cần chốt theo công trình.'],
  ['Kính', 'Kính đơn cường lực hoặc an toàn; có thể lựa chọn kính hộp.'],
  ['Gioăng', 'EPDM.'],
  ['Phụ kiện', 'Cmech hoặc Eurowindow, tùy mẫu được xác nhận.']
];
const windowFacts = [
  ['Thanh profile', 'Nhôm hợp kim 6063-T5, hoàn thiện sơn tĩnh điện.'],
  ['Hệ nhôm', 'EA55 hoặc EA60i; chi tiết cụ thể cần chốt theo công trình.'],
  ['Kính', 'Kính đơn cường lực hoặc an toàn; có thể lựa chọn kính hộp.'],
  ['Gioăng', 'EPDM.'],
  ['Phụ kiện', 'Bản lề chữ A, chốt đa điểm và tay nắm; lựa chọn Cmech hoặc Eurowindow.']
];
const items = [
  {
    slug:'cua-di-nhom-1-canh-mo-quay-trong', name:'Cửa đi nhôm 1 cánh mở quay trong', type:'Cửa đi', operation:'Một cánh mở quay vào phía trong.', wings:'1 cánh',
    systems:['EA55','EA60i'], facts:doorFacts,
    applications:[['Lối đi trong nhà','Bố trí tại ô cửa đi có khoảng trống ở phía mở.'],['Lối ra hiên','Hướng cánh mở vào trong cần được tính cùng đồ đạc và lối lưu thông.']],
    benefit:'Cánh quay vào trong theo một cung mở xác định.', related:['cua-di-nhom-2-canh-mo-quay-ngoai','cua-di-nhom-2-canh-mo-quay-trong']
  },
  {
    slug:'cua-di-nhom-2-canh-mo-quay-trong', name:'Cửa đi nhôm 2 cánh mở quay trong', type:'Cửa đi', operation:'Hai cánh mở quay vào phía trong.', wings:'2 cánh',
    systems:['EA55','EA60i'], facts:doorFacts,
    applications:[['Lối đi trong nhà','Phù hợp ô cửa đi cần bố trí hai cánh mở vào trong.'],['Kết nối các không gian','Cần chừa khoảng trống phía trong theo cung mở của hai cánh.']],
    benefit:'Hai cánh quay vào trong theo khoảng mở của từng cánh.', related:['cua-di-nhom-2-canh-mo-quay-ngoai','cua-di-nhom-1-canh-mo-quay-trong']
  },
  {
    slug:'cua-di-nhom-1-canh-mo-quay-ngoai', name:'Cửa đi nhôm 1 cánh mở quay ngoài', type:'Cửa đi', operation:'Một cánh mở quay ra phía ngoài.', wings:'1 cánh',
    systems:['EA55','EA60i'], facts:doorFacts,
    applications:[['Cửa phụ','Bố trí tại ô cửa có khoảng trống an toàn ở phía ngoài.'],['Lối ra ngoài nhà','Kiểm tra hướng đi và khoảng mở trước khi chốt vị trí lắp đặt.']],
    benefit:'Cánh quay ra ngoài, để trống phần sàn phía trong khi thao tác mở.', related:['cua-di-nhom-2-canh-mo-quay-ngoai','cua-di-nhom-1-canh-mo-quay-trong']
  },
  {
    slug:'cua-di-nhom-2-canh-mo-truot', name:'Cửa đi nhôm 2 cánh mở trượt', type:'Cửa đi', operation:'Cánh cửa trượt theo phương ngang trên ray.', wings:'2 cánh',
    systems:['EA90','EA95i','SC95'], facts:[['Cơ chế','Cánh trượt theo phương ngang trên ray.'],['Hệ nhôm','Các lựa chọn được công bố: EA90, EA95i hoặc SC95.']],
    applications:[['Lối ra ban công','Cách mở trượt không cần chừa cung quay cho cánh.'],['Ô cửa đi cần tiết kiệm vùng thao tác','Bố trí ray và hướng trượt theo mặt bằng thực tế.']],
    benefit:'Cánh di chuyển theo ray ngang, không quét vào vùng sử dụng bên cạnh cửa.', related:['cua-di-nhom-4-canh-mo-truot','cua-di-nhom-4-canh-xep-truot']
  },
  {
    slug:'cua-di-nhom-4-canh-mo-truot', name:'Cửa đi nhôm 4 cánh mở trượt', type:'Cửa đi', operation:'Các cánh di chuyển theo phương ngang trên ray.', wings:'4 cánh',
    systems:['EA90','EA95i','EA115'], facts:[['Thanh profile','Nhôm hợp kim 6063-T5, hoàn thiện sơn tĩnh điện.'],['Cơ chế','Cánh trượt theo phương ngang trên ray.'],['Hệ nhôm','EA90, EA95i hoặc EA115; cần chọn tùy mẫu công trình.']],
    applications:[['Lối ra sân hoặc ban công','Hướng trượt và phần mở thông thủy cần được tính theo mặt bằng.'],['Ô cửa đi nhiều cánh','Bố trí theo hệ ray và phương án đã thống nhất cho công trình.']],
    benefit:'Bốn cánh trượt trên ray, không cần khoảng quét của cánh mở quay.', related:['cua-di-nhom-2-canh-mo-truot','cua-di-nhom-4-canh-xep-truot']
  },
  {
    slug:'cua-di-nhom-4-canh-xep-truot', name:'Cửa đi nhôm 4 cánh xếp trượt', type:'Cửa đi', operation:'Các cánh kết hợp trượt và xếp gọn về một phía.', wings:'4 cánh',
    systems:['EA55'], facts:[['Thanh profile','Nhôm hợp kim 6063-T5, hoàn thiện sơn tĩnh điện.'],['Cơ chế','Cánh kết hợp trượt trên ray và quay trên bản lề để xếp.'],['Hệ nhôm','EA55.']],
    applications:[['Lối kết nối không gian','Các cánh xếp gọn về phía được bố trí trong thiết kế.'],['Ô cửa cần mở rộng','Cần xác định vị trí xếp cánh và khoảng trống cạnh cửa.']],
    benefit:'Các cánh trượt và xếp về một phía khi mở.', related:['cua-di-nhom-4-canh-mo-truot','cua-di-nhom-2-canh-mo-truot']
  },
  {
    slug:'cua-so-nhom-1-canh-mo-quay-trong', name:'Cửa sổ nhôm 1 cánh mở quay trong', type:'Cửa sổ', operation:'Một cánh mở quay vào phía trong.', wings:'1 cánh',
    systems:['EA55','EA60i'], facts:windowFacts,
    applications:[['Phòng ngủ','Hướng mở vào trong cần tính cùng rèm và đồ nội thất gần cửa.'],['Phòng làm việc','Bố trí theo kích thước ô chờ và khoảng thao tác phía trong.']],
    benefit:'Cánh quay vào trong, thuận tiện tiếp cận mặt kính từ phía trong nhà.', related:['cua-so-nhom-2-canh-mo-quay-trong','cua-so-nhom-mo-quay-lat-trong']
  },
  {
    slug:'cua-so-nhom-2-canh-mo-quay-trong', name:'Cửa sổ nhôm 2 cánh mở quay trong', type:'Cửa sổ', operation:'Hai cánh mở quay vào phía trong.', wings:'2 cánh',
    systems:['EA55','EA60i'], facts:windowFacts,
    applications:[['Phòng khách','Hai cánh mở vào trong; cần chừa khoảng thao tác phía trong.'],['Phòng ngủ','Có thể bố trí lưới chống côn trùng ở mặt ngoài tùy mẫu phù hợp.']],
    benefit:'Hai cánh quay vào trong, hỗ trợ tiếp cận mặt kính từ phía trong nhà.', related:['cua-so-nhom-1-canh-mo-quay-trong','cua-so-nhom-2-canh-mo-quay-ngoai']
  },
  {
    slug:'cua-so-nhom-1-canh-mo-quay-ngoai', name:'Cửa sổ nhôm 1 cánh mở quay ngoài', type:'Cửa sổ', operation:'Một cánh mở quay ra phía ngoài.', wings:'1 cánh',
    systems:['EA55','EA60i'], facts:windowFacts,
    applications:[['Ô cửa sổ có khoảng mở ngoài','Kiểm tra lối đi, lan can và các yếu tố bên ngoài trước khi lắp.'],['Phòng ngủ hoặc phòng làm việc','Căn cứ vào vị trí, kích thước và hướng mở của ô cửa.']],
    benefit:'Cánh quay ra ngoài, không chiếm phần diện tích sử dụng trong phòng.', related:['cua-so-nhom-2-canh-mo-quay-ngoai','cua-so-nhom-1-canh-mo-quay-trong']
  },
  {
    slug:'cua-so-nhom-2-canh-mo-quay-ngoai', name:'Cửa sổ nhôm 2 cánh mở quay ngoài', type:'Cửa sổ', operation:'Hai cánh mở quay ra phía ngoài.', wings:'2 cánh',
    systems:['EA55','EA60i'], facts:windowFacts,
    applications:[['Phòng ngủ hoặc phòng khách','Bố trí tại vị trí có khoảng mở ngoài phù hợp.'],['Mặt tiền công trình','Kiểm tra không gian phía ngoài để cánh không vướng lối đi chung.']],
    benefit:'Hai cánh quay ra ngoài, dành phần diện tích trong phòng cho công năng khác.', related:['cua-so-nhom-2-canh-mo-quay-trong','cua-so-nhom-1-canh-mo-quay-ngoai']
  },
  {
    slug:'cua-so-nhom-2-canh-mo-truot', name:'Cửa sổ nhôm 2 cánh mở trượt', type:'Cửa sổ', operation:'Cánh cửa trượt ngang trên ray.', wings:'2 cánh',
    systems:[], facts:[['Cơ chế','Cánh cửa trượt ngang trên ray.'],['Số cánh','2 cánh.']],
    applications:[['Ô cửa có vùng thao tác hẹp','Cánh trượt không tạo cung quay vào phòng.'],['Ban công hoặc hành lang','Kiểm tra hướng trượt và phần mở theo mặt bằng.']],
    benefit:'Cánh trượt ngang, không cần khoảng quét vào trong hoặc ngoài phòng.', related:['cua-so-nhom-1-canh-mo-quay-trong','cua-so-nhom-mo-hat']
  },
  {
    slug:'cua-so-nhom-mo-hat', name:'Cửa sổ nhôm mở hất', type:'Cửa sổ', operation:'Cánh mở hất ra ngoài theo giới hạn của bộ cửa.', wings:'',
    systems:[], facts:[['Cơ chế','Cánh mở hất ra ngoài; góc mở phụ thuộc mẫu bộ cửa.']],
    applications:[['Ô cửa sổ ở vị trí cao','Lựa chọn vị trí tay nắm và cách vận hành theo thiết kế.'],['Phòng cần thông gió','Giới hạn mở phụ thuộc vào bộ phụ kiện.']],
    benefit:'Cánh mở hất ra ngoài; giới hạn mở được xác định tùy mẫu.', related:['cua-so-nhom-mo-quay-lat-trong','cua-so-nhom-2-canh-mo-truot']
  },
  {
    slug:'cua-so-nhom-mo-quay-lat-trong', name:'Cửa sổ nhôm mở quay lật trong', type:'Cửa sổ', operation:'Hai chế độ: mở quay vào trong hoặc lật phần trên vào trong.', wings:'',
    systems:[], facts:[['Cơ chế','Mở quay toàn phần hoặc lật phần trên vào trong.']],
    applications:[['Phòng ngủ','Chế độ lật tạo khe thông gió nhỏ hơn chế độ mở quay.'],['Ô cửa cần tiếp cận mặt kính','Chế độ mở quay giúp tiếp cận từ phía trong.']],
    benefit:'Hai chế độ mở để lựa chọn theo nhu cầu thông gió và thao tác.', related:['cua-so-nhom-mo-hat','cua-so-nhom-1-canh-mo-quay-trong']
  },
  {
    slug:'vach-nhom-kinh-lon-he-stick', name:'Vách nhôm kính lớn hệ Stick', type:'Vách kính', operation:'Hệ vách cố định; các cấu kiện được lắp dựng tại công trình.', wings:'',
    systems:[], facts:[['Cách lắp dựng','Thanh nhôm và kính được gia công tại nhà máy, sau đó liên kết và lắp dựng tại công trình.'],['Cấu tạo','Profile nhôm, gioăng EPDM và kính được tùy mẫu dự án.']],
    applications:[['Mặt dựng nhiều góc cạnh','Quy trình lắp tại công trình cho phép xử lý theo hình học mặt tiền.'],['Công trình thương mại','Thiết kế cần căn cứ hồ sơ kỹ thuật dự án.']],
    benefit:'Các bộ phận được lắp dựng tại công trình, có thể tổ chức theo hình dạng mặt tiền.', related:['vach-nhom-kinh-lon-he-spider','vach-nhom-kinh-he-semi-unitized']
  },
  {
    slug:'vach-nhom-kinh-lon-he-spider', name:'Vách nhôm kính lớn hệ Spider', type:'Vách kính', operation:'Vách kính cố định, liên kết bằng phụ kiện điểm.', wings:'',
    systems:[], facts:[['Đặc trưng','Liên kết điểm cho phép hạn chế kết cấu che khuất trên bề mặt kính.'],['Lựa chọn','Kích thước kính và liên kết cần được tính theo hồ sơ công trình.']],
    applications:[['Sảnh công trình','Dùng tại không gian lớn cần tầm nhìn rộng.'],['Showroom hoặc khách sạn','Cần thiết kế liên kết theo tải trọng và kích thước thực tế.']],
    benefit:'Giải pháp liên kết điểm giúp bề mặt kính liền mạch hơn.', related:['vach-nhom-kinh-lon-he-stick','vach-nhom-kinh-lon-he-unitized']
  },
  {
    slug:'vach-nhom-kinh-he-semi-unitized', name:'Vách nhôm kính hệ Semi-Unitized', type:'Vách kính', operation:'Một phần gia công tại nhà máy, phần lắp dựng hoàn thiện tại công trình.', wings:'',
    systems:[], facts:[['Cách lắp dựng','Kết hợp gia công trước tại nhà máy với lắp dựng và hoàn thiện tại công trình.'],['Cấu tạo','Profile nhôm, gioăng EPDM và các loại kính theo thiết kế dự án.']],
    applications:[['Mặt dựng quy mô lớn','Phương án thi công cần thống nhất theo tiến độ và điều kiện công trường.'],['Công trình có cấu kiện lặp lại','Xác định tỷ lệ gia công trước theo thiết kế và kế hoạch lắp dựng.']],
    benefit:'Kết hợp công đoạn gia công tại nhà máy với lắp dựng tại công trường.', related:['vach-nhom-kinh-lon-he-stick','vach-nhom-kinh-lon-he-unitized']
  },
  {
    slug:'vach-nhom-kinh-lon-he-unitized', name:'Vách nhôm kính lớn hệ Unitized', type:'Vách kính', operation:'Các module mặt dựng được hoàn thiện tại nhà máy rồi lắp vào công trình.', wings:'',
    systems:[], facts:[['Cách lắp dựng','Module mặt dựng được gia công, lắp ghép và hoàn thiện tại nhà máy trước khi cẩu lắp.'],['Điều kiện thiết kế','Phù hợp để xem xét ở mặt dựng có nhịp và tầng lặp lại; cần xác nhận theo dự án.']],
    applications:[['Tòa nhà cao tầng','Lập phương án module theo nhịp mặt tiền và điều kiện cẩu lắp.'],['Mặt dựng đồng nhất','Đánh giá tính lặp lại của các tầng trong hồ sơ thiết kế.']],
    benefit:'Phần lớn công đoạn lắp ghép module diễn ra tại nhà máy.', related:['vach-nhom-kinh-he-semi-unitized','vach-nhom-kinh-lon-he-stick']
  },
  {
    slug:'mai-che', name:'Mái che kính', type:'Vách kính', operation:'Hệ mái kính cố định kết hợp với kết cấu khung.', wings:'',
    systems:[], facts:[['Vật liệu','Profile nhôm có cầu cách nhiệt kết hợp kính hộp bơm khí trơ.'],['Kính hộp','Độ dày công bố trong khoảng 16–32 mm.'],['Độ dốc','Thiết kế trong khoảng 18–60 độ theo yêu cầu công trình.']],
    applications:[['Sảnh hoặc lối vào','Tận dụng ánh sáng tự nhiên tại khu vực mái che.'],['Không gian công cộng','Hình dáng và độ dốc được xác định theo hồ sơ công trình.']],
    benefit:'Kết hợp kính và khung để đưa ánh sáng tự nhiên qua phần mái.', related:['vach-nhom-kinh-lon-he-stick','vach-nhom-kinh-lon-he-unitized']
  }
];

const faqFor = (item) => [
  [`${item.name} phù hợp lắp đặt ở đâu?`, item.applications[0][1]],
  ['Sản phẩm vận hành như thế nào?', item.operation],
  ['Thông tin cụ thể được xác định ra sao?', 'Hệ nhôm, kính, phụ kiện và kích thước cần được xác nhận theo ô chờ và hồ sơ của công trình.'],
  ['Có thể chọn kính và phụ kiện theo yêu cầu không?', 'Loại kính và phụ kiện được xác định tùy mẫu sản phẩm và yêu cầu của công trình.'],
  ['Làm thế nào để nhận tư vấn?', 'Gọi (024) 3747 4700, cho biết vị trí lắp đặt và nhu cầu của bạn để được tư vấn.']
];
const operationLabel = (slug) => {
  if (slug.includes('mo-quay-lat-trong')) return 'Mở quay lật trong';
  if (slug.includes('mo-quay-trong')) return 'Mở quay trong';
  if (slug.includes('mo-quay-ngoai')) return 'Mở quay ngoài';
  if (slug.includes('xep-truot')) return 'Xếp trượt';
  if (slug.includes('mo-truot')) return 'Mở trượt';
  if (slug.includes('mo-hat')) return 'Mở hất';
  if (slug.includes('semi-unitized')) return 'Hệ Semi-Unitized';
  if (slug.includes('unitized')) return 'Hệ Unitized';
  if (slug.includes('spider')) return 'Hệ Spider';
  if (slug.includes('stick')) return 'Hệ Stick';
  return 'Mái che kính';
};
const verifiedProductPhotos = {
  'cua-di-nhom-1-canh-mo-quay-trong': '/images/eurowindow-products/cua-di-nhom-mo-quay-trong-1-canh-eurowindow.webp',
  'cua-di-nhom-1-canh-mo-quay-ngoai': '/images/eurowindow-products/cua-di-nhom-mo-quay-ngoai-1-canh-eurowindow.webp',
  'cua-di-nhom-2-canh-mo-truot': '/images/door-reference/nhom-Cua-nhom-mo-truot-2-canh.jpg',
  'cua-di-nhom-4-canh-mo-truot': '/images/door-reference/nhom-Cua-di-nhom-mo-truot-4-canh.jpg',
  'cua-di-nhom-4-canh-xep-truot': '/images/eurowindow-products/cua-di-nhom-xep-truot-4-canh-eurowindow.webp',
  'cua-so-nhom-1-canh-mo-quay-trong': '/images/eurowindow-products/cua-so-nhom-mo-quay-trong-1-canh-eurowindow.webp',
  'cua-so-nhom-1-canh-mo-quay-ngoai': '/images/eurowindow-products/cua-so-nhom-mo-quay-ngoai-1-canh-eurowindow.webp',
  'cua-so-nhom-2-canh-mo-truot': '/images/door-reference/nhom-Cua-so-nhom-mo-trout-2-canh.jpg',
  'cua-so-nhom-mo-quay-lat-trong': '/images/eurowindow-products/cua-so-nhom-quay-lat-trong-eurowindow.webp',
  'vach-nhom-kinh-lon-he-stick': '/images/eurowindow-products/vach-nhom-kinh-stick-eurowindow.webp',
  'vach-nhom-kinh-lon-he-spider': '/images/eurowindow-products/vach-nhom-kinh-spider-eurowindow.webp',
  'vach-nhom-kinh-he-semi-unitized': '/images/eurowindow-products/vach-nhom-kinh-semi-unitized-eurowindow.webp',
  'vach-nhom-kinh-lon-he-unitized': '/images/eurowindow-products/vach-nhom-kinh-unitized-eurowindow.webp',
  'mai-che': '/images/eurowindow-products/mai-che-kinh-eurowindow.webp'
};
const verifiedProductGalleryPhotos = {
  'cua-so-nhom-1-canh-mo-quay-trong': [
    '/images/eurowindow-products/cua-so-nhom-mo-quay-trong-1-canh-02.webp',
    '/images/eurowindow-products/cua-so-nhom-mo-quay-trong-1-canh-03.webp'
  ]
};
const products = items.map((item) => {
  const downloadedPhotos = productImageManifest[item.slug] || [];
  const photo = downloadedPhotos[0] || verifiedProductPhotos[item.slug];
  const galleryPhotos = [...new Set([
    ...downloadedPhotos,
    verifiedProductPhotos[item.slug],
    photo,
    ...(verifiedProductGalleryPhotos[item.slug] || [])
  ].filter(Boolean))];
  const specs = [
    ['Loại sản phẩm', item.type === 'Vách kính' ? 'Vách nhôm kính' : `${item.type.toLowerCase()} nhôm`],
    ...(item.wings ? [['Số cánh', item.wings]] : []),
    ['Kiểu mở / lắp dựng', item.operation],
    ...(item.systems?.length ? [['Hệ nhôm đã xác nhận', item.systems.join(', ')]] : [])
  ];
  return {
    id: item.slug, slug: item.slug, name: item.name,
    category: item.type === 'Vách kính' ? 'Vách nhôm kính' : `${item.type} nhôm`,
    summary: `${item.benefit} ${item.applications[0][1]}`,
    description: `${item.benefit} ${item.applications[0][1]} Phương án phụ thuộc vào ô chờ và yêu cầu của công trình.`,
    heroKicker: `${item.type === 'Vách kính' ? 'Vách nhôm kính' : `${item.type} nhôm`} · ${operationLabel(item.slug)}`,
    heroFacts: [item.wings, item.operation, ...(item.systems || [])].filter(Boolean),
    benefitHeading: item.benefit,
    benefits: [
      [item.type === 'Vách kính' ? 'Phương án lắp dựng' : 'Cơ chế vận hành', item.benefit],
      ...item.applications
    ],
    constructionFacts: item.facts,
    specifications: specs,
    applications: item.applications,
    faqs: faqFor(item),
    gallery: galleryPhotos.map((src) => ({ src, alt: item.name })),
    detailImage: photo ? { src: photo, alt: item.name } : null,
    isIllustration: false,
    showBatchExtensions: true,
    related: item.related
  };
});

export const aluminumProducts = [approvedDoor, ...products];
export function getAluminumProduct(slug) {
  return aluminumProducts.find((product) => product.slug === slug);
}
