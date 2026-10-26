import productImageManifest from './product-image-manifest.json';

const catalog = {
  'cua-upvc': [
    ['Cửa đi uPVC 1 cánh mở quay ngoài','/images/eurowindow-products/cua-di-upvc-1-canh-mo-quay-ngoai-eurowindow.webp','Cửa đi','Mở quay ngoài'],
    ['Cửa đi uPVC 2 cánh mở quay ngoài','/images/eurowindow-products/cua-di-upvc-2-canh-mo-quay-ngoai-01.webp','Cửa đi','Mở quay ngoài'],
    ['Cửa đi uPVC 2 cánh mở trượt','/images/eurowindow-products/cua-di-upvc-2-canh-mo-truot-eurowindow.webp','Cửa đi','Mở trượt'],
    ['Cửa đi uPVC 4 cánh xếp trượt','/images/eurowindow-products/cua-di-upvc-4-canh-xep-truot-eurowindow.webp','Cửa đi','Xếp trượt'],
    ['Cửa đi uPVC 6 cánh xếp trượt','/images/eurowindow-products/cua-di-upvc-xep-truot-6-canh-eurowindow.webp','Cửa đi','Xếp trượt'],
    ['Cửa sổ uPVC 4 cánh mở trượt','/images/eurowindow-products/cua-so-upvc-mo-truot-4-canh-eurowindow.webp','Cửa sổ','Mở trượt'],
    ['Cửa sổ uPVC 2 cánh mở trượt','/images/eurowindow-products/cua-so-upvc-mo-truot-2-canh-eurowindow.webp','Cửa sổ','Mở trượt'],
    ['Cửa sổ uPVC 1 cánh mở quay ngoài','/images/eurowindow-products/cua-so-upvc-mo-quay-ngoai-1-canh-eurowindow.webp','Cửa sổ','Mở quay ngoài'],
    ['Cửa sổ uPVC 2 cánh quay lật trong','/images/eurowindow-products/cua-so-upvc-quay-lat-trong-2-canh-eurowindow.webp','Cửa sổ','Quay lật trong'],
    ['Cửa sổ uPVC mở hất','/images/eurowindow-products/cua-so-upvc-mo-hat-eurowindow.webp','Cửa sổ','Mở hất']
  ],
  'cua-go': [
    ['Cửa gỗ tự nhiên','/images/eurowindow-products/cua-go-tu-nhien-eurowindow.webp','Gỗ tự nhiên','Gỗ tự nhiên tuyển chọn'],
    ['Cửa gỗ công nghiệp','/images/eurowindow-products/cua-go-cong-nghiep-eurowindow.webp','Gỗ công nghiệp','Veneer, HDF, MDF, Laminate'],
    ['Cửa gỗ ghép thanh','/images/eurowindow-products/cua-go-ghep-thanh-eurowindow.webp','Gỗ ghép thanh','Ghép thanh phủ veneer'],
    ['Cửa gỗ chống cháy','/images/eurowindow-products/cua-go-chong-chay-gioang-ngan-khoi-eurowindow.webp','Gỗ chống cháy','Cấp chịu lửa tùy mẫu'],
    ['Cửa gỗ composite','/images/eurowindow-products/cua-go-composite-cau-tao-eurowindow.webp','Gỗ composite','Phủ film vân gỗ hoặc sơn']
  ],
  'cua-cuon': [
    ['Cửa cuốn nhôm khe thoáng EASD45','/images/eurowindow-products/cua-cuon-nhom-khe-thoang-easd45-eurowindow.webp','Cửa cuốn','Khe thoáng']
  ],
  'cua-thong-minh-the-he-moi': [
    ['Cửa trượt Slim ray treo','/images/door-reference/smart-Cua-truot-slim-ray-treo-eurowindow.jpg','Cửa đi','Trượt ray treo'],
    ['Kính điện đổi màu','/images/door-reference/smart-Kinh-dien-thong-minh.jpg','Kính và phụ kiện','Chuyển kính trong suốt và mờ'],
    ['Cửa bản lề sàn tự động','/images/eurowindow-products/cua-di-tu-dong-mo-quay-na-canh-eurowindow.webp','Cửa đi','Mở quay tự động'],
    ['Cửa gấp trượt dọc tự động','/images/eurowindow-products/cua-di-tu-dong-gap-truot-doc-na-canh-eurowindow.webp','Cửa đi','Gấp trượt theo phương dọc'],
    ['Cửa sổ tự động điều khiển bằng giọng nói','/images/door-reference/smart-Cua-so-tu-dong-dieu-khien-bang-giong-noi.jpg','Cửa sổ','Điều khiển bằng giọng nói'],
    ['Vách trượt dọc tự động','/images/door-reference/smart-Cua-truot-doc-tu-dong.jpg','Vách kính','Trượt dọc'],
    ['Cửa sổ đẩy ngang tự động','/images/eurowindow-products/cua-so-tu-dong-day-ngang-na-canh-eurowindow.webp','Cửa sổ','Đẩy ngang'],
    ['Cửa trượt tự động','/images/eurowindow-products/cua-di-tu-dong-mo-truot-2-hoac-4-canh-eurowindow.webp','Cửa đi','Trượt tự động 2 hoặc 4 cánh'],
    ['Cửa mái kính Skylight','/images/eurowindow-products/cua-mai-kinh-skylight-eurowindow.webp','Cửa mái kính','Tự động đóng mở, cảm biến mưa gió'],
    ['Cửa sổ tự động','/images/eurowindow-products/cua-so-tu-dong-na-eurowindow.webp','Cửa sổ','Điều khiển từ xa hoặc nút bấm']
  ],
  'vach-kinh-mat-dung': [
    ['Kính cường lực và bán cường lực','/images/eurowindow-products/kinh-cuong-luc-ban-cuong-luc-eurowindow-web.webp','Sản phẩm kính','Kính tôi nhiệt'],
    ['Hộp kính và hộp kính khổ lớn','/images/eurowindow-products/hop-kinh-kho-lon-eurowindow.webp','Sản phẩm kính','Hộp kính cách âm, cách nhiệt'],
    ['Kính an toàn nhiều lớp','/images/eurowindow-products/kinh-an-toan-eurowindow.webp','Sản phẩm kính','Kính dán an toàn'],
    ['Kính cách nhiệt an toàn ACT','/images/eurowindow-products/kinh-cach-nhiet-an-toan-act-eurowindow.webp','Sản phẩm kính','Kính cách nhiệt an toàn'],
    ['Kính hoa văn','/images/eurowindow-products/kinh-hoa-van-eurowindow.webp','Sản phẩm kính','Kính trang trí']
  ]
};

function slugify(value) {
  return value.toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const familyTitles = {
  'cua-upvc': 'Cửa uPVC', 'cua-go': 'Cửa gỗ', 'cua-cuon': 'Cửa cuốn',
  'cua-thong-minh-the-he-moi': 'Cửa thông minh', 'vach-kinh-mat-dung': 'Kính và vách kính'
};

function productContent(familySlug, name, type, configuration) {
  const lower = name.toLocaleLowerCase('vi');
  const operation = configuration.toLocaleLowerCase('vi');
  if (familySlug === 'cua-upvc') {
    const action = operation.includes('xếp') ? 'Các cánh trượt rồi xếp gọn về một phía, tạo lối mở rộng.'
      : operation.includes('trượt') ? 'Cánh trượt ngang trên ray, không cần khoảng quét như cửa mở quay.'
        : operation.includes('quay lật') ? 'Cánh có thể mở quay hoặc lật phần trên để tạo khe thông gió.'
          : operation.includes('hất') ? 'Cánh mở hất tạo khe thông gió phía trên ô cửa.'
            : `Cánh mở ${operation.includes('ngoài') ? 'ra ngoài' : 'theo hướng thiết kế'}; cần tính khoảng quét theo mặt bằng.`;
    const use = type === 'Cửa đi'
      ? (operation.includes('xếp') ? 'lối ra ban công, sân vườn và vị trí cần mở rộng lối đi' : 'cửa chính, cửa phụ hoặc lối ra ban công')
      : (operation.includes('hất') ? 'ô cửa cần thông gió và hạn chế khoảng mở cánh' : 'phòng khách, phòng ngủ và ô cửa cần lấy sáng');
    return {
      summary: operation.includes('xếp')
        ? `${name} gồm profile uPVC, kính và phụ kiện theo mẫu. Khi mở, các cánh xếp về một phía để dành lối đi rộng hơn. Có thể cân nhắc cho ${use} sau khi kiểm tra vị trí gom cánh.`
        : operation.includes('trượt')
          ? `${name} dùng cánh trượt ngang trên ray, nên không cần khoảng quét như cửa mở quay. Profile uPVC, kính và phụ kiện được chọn theo mẫu; cần xác định hướng trượt theo mặt bằng.`
          : operation.includes('quay lật')
            ? `${name} cho phép mở quay hoặc lật phần trên vào trong để thông gió. Kiểu mở này phù hợp ${use}; cần tính khoảng thao tác và vị trí tay nắm.`
            : operation.includes('hất')
              ? `${name} mở hất, tạo khe thông gió phía trên ô cửa. Trước khi chọn, cần xem kích thước ô chờ, hướng mưa và khả năng tiếp cận tay nắm.`
              : `${name} mở ${operation.includes('ngoài') ? 'ra ngoài' : 'theo hướng thiết kế'}, với khoảng quét cánh cần tính cùng lối đi và đồ đạc gần cửa. Bộ cửa gồm profile uPVC, kính và phụ kiện theo mẫu.`,
      benefitHeading: action,
      benefits: [['Kiểu vận hành', action], ['Profile và lõi gia cường', 'Cửa uPVC sử dụng thanh profile dạng hộp có lõi thép gia cường; từng bộ cửa được xác nhận theo hồ sơ đặt hàng.'], ['Kính, gioăng và phụ kiện', 'Chọn đồng bộ theo vị trí lắp đặt và yêu cầu sử dụng của công trình.']],
      facts: [['Khung cửa', 'Profile uPVC dạng hộp, có lõi thép gia cường.'], ['Kính và phụ kiện', 'Chọn tùy mẫu bộ cửa và yêu cầu công trình.'], ['Dòng profile', 'Eurowindow cung cấp các dòng Asiawindow và Kömmerling; dòng dùng cho sản phẩm cần được xác nhận khi tư vấn.']],
      applications: [[type === 'Cửa đi' ? 'Lối đi trong nhà' : 'Ô cửa lấy sáng', `Kiểu ${operation} được chọn theo vị trí lắp đặt và khoảng thao tác.`], ['Nhà ở', 'Có thể cân nhắc cho nhà phố, căn hộ và biệt thự theo thiết kế ô chờ.']],
      faqs: [[`Cửa uPVC ${operation} vận hành như thế nào?`, action], ['Cửa uPVC có những hệ profile nào?', 'Eurowindow có các dòng Asiawindow và Kömmerling; dòng phù hợp cần xác nhận theo mẫu và chi tiết cụ thể.'], ['Kính và phụ kiện được chọn ra sao?', 'Kính, gioăng và phụ kiện được xác định theo kích thước, vị trí lắp đặt và yêu cầu của công trình.']]
    };
  }

  if (familySlug === 'cua-go') {
    if (lower.includes('tự nhiên')) return {
      summary: 'Cửa gỗ tự nhiên dùng vật liệu gỗ đã qua xử lý và hoàn thiện bề mặt, giữ được sắc thái vân gỗ riêng của từng mẫu. Sản phẩm phù hợp các vị trí nội thất khô ráo; nên tránh tiếp xúc trực tiếp với mưa nắng và khu vực ẩm.',
      benefitHeading: 'Vân gỗ tự nhiên cho không gian nội thất',
      benefits: [['Vật liệu', 'Gỗ tự nhiên được lựa chọn và xử lý trước khi sản xuất.'], ['Kiểu dáng', 'Có thể chọn dạng phẳng, pano, chỉ soi hoặc kết hợp ô kính theo mẫu.'], ['Vị trí sử dụng', 'Thích hợp cửa chính và cửa thông phòng ở khu vực trong nhà, khô ráo.']],
      facts: [['Vật liệu', 'Gỗ tự nhiên; loại gỗ phụ thuộc mẫu đặt hàng.'], ['Hoàn thiện', 'Bề mặt sơn PU.'], ['Lưu ý vị trí', 'Hạn chế tiếp xúc trực tiếp với mưa nắng và khu vực ẩm ướt.']],
      applications: [['Cửa chính và phòng khách', 'Vân gỗ tạo điểm nhấn cho không gian nội thất.'], ['Cửa thông phòng', 'Có thể lựa chọn kiểu dáng và màu hoàn thiện đồng bộ với nội thất.']],
      faqs: [['Cửa gỗ tự nhiên lắp ở đâu?', 'Nên ưu tiên vị trí trong nhà, tránh nơi thường xuyên tiếp xúc nước, mưa nắng hoặc độ ẩm cao.'], ['Có những kiểu dáng nào?', 'Các lựa chọn gồm cửa phẳng, pano, chỉ soi và cửa kết hợp ô kính; mẫu cụ thể tùy thiết kế.'], ['Loại gỗ và hoàn thiện được chốt thế nào?', 'Chủng loại gỗ và bề mặt cần xác nhận theo mẫu, kích thước và mẫu đặt hàng.']]
    };
    if (lower.includes('công nghiệp')) return {
      summary: 'Cửa gỗ công nghiệp kết hợp khung xương gỗ với vật liệu lõi và bề mặt hoàn thiện như MDF, veneer hoặc laminate/melamine. Nhiều màu sắc và bề mặt giúp phối cửa với thiết kế nội thất; nên lắp trong nhà, tránh khu vực ẩm ướt.',
      benefitHeading: 'Nhiều lựa chọn bề mặt cho nội thất',
      benefits: [['Kết cấu', 'Khung xương cánh sử dụng gỗ ghép thanh và ván dăm; cấu tạo chi tiết tùy mẫu.'], ['Bề mặt', 'Có thể lựa chọn veneer, laminate hoặc melamine theo mẫu.'], ['Vị trí sử dụng', 'Phù hợp cửa thông phòng ở khu vực trong nhà, khô ráo.']],
      facts: [['Khung xương', 'Gỗ ghép thanh và ván dăm.'], ['Vật liệu lõi và bề mặt', 'MDF/HDF; veneer, laminate hoặc melamine tùy mẫu.'], ['Lưu ý vị trí', 'Tránh tiếp xúc trực tiếp với mưa nắng và khu vực ẩm ướt.']],
      applications: [['Phòng ngủ và phòng làm việc', 'Lựa chọn bề mặt theo phong cách nội thất.'], ['Cửa thông phòng', 'Có thể phối mẫu cửa đồng bộ giữa các không gian trong nhà.']],
      faqs: [['Cửa gỗ công nghiệp có những bề mặt nào?', 'Các lựa chọn được giới thiệu gồm veneer, laminate và melamine.'], ['Cửa gỗ công nghiệp phù hợp lắp ở đâu?', 'Sản phẩm phù hợp các vị trí trong nhà, tránh khu vực ẩm ướt.'], ['Có thông số kích thước cố định không?', 'Kích thước và cấu tạo cần xác nhận theo mẫu đặt hàng và ô chờ thực tế.']]
    };
    if (lower.includes('ghép thanh')) return {
      summary: 'Cửa gỗ ghép thanh được tạo từ các thanh gỗ đã qua xử lý, ghép thành cánh và có thể hoàn thiện bằng veneer tự nhiên. Kết cấu này giữ vân gỗ tự nhiên và phù hợp cửa thông phòng trong khu vực khô ráo.',
      benefitHeading: 'Kết cấu ghép thanh với bề mặt vân gỗ',
      benefits: [['Kết cấu', 'Các thanh gỗ được xử lý và ghép thành tấm cửa.'], ['Bề mặt', 'Veneer tự nhiên tạo sắc thái vân gỗ; có thể phối theo thiết kế nội thất.'], ['Phụ kiện', 'Gioăng và phụ kiện đồng bộ tùy mẫu sản phẩm.']],
      facts: [['Lõi cửa', 'Gỗ ghép thanh đã qua xử lý.'], ['Bề mặt hoàn thiện', 'Gỗ lạng tự nhiên (veneer), sơn PU tùy mẫu.'], ['Vị trí sử dụng', 'Cửa thông phòng trong nhà, khu vực khô ráo.']],
      applications: [['Phòng ngủ và phòng làm việc', 'Vân gỗ tạo cảm giác ấm áp cho nội thất.'], ['Cửa thông phòng', 'Có thể chọn mẫu phẳng, pano, chỉ soi hoặc kết hợp ô kính.']],
      faqs: [['Cửa gỗ ghép thanh được làm từ gì?', 'Cánh cửa tạo từ các thanh gỗ đã qua xử lý và có thể phủ veneer tự nhiên.'], ['Sản phẩm phù hợp vị trí nào?', 'Phù hợp cửa thông phòng trong nhà và khu vực khô ráo.'], ['Có thể chọn vân gỗ không?', 'Bề mặt và sắc thái hoàn thiện được chọn theo mẫu đặt hàng.']]
    };
    if (lower.includes('chống cháy')) return {
      summary: 'Cửa gỗ chống cháy kết hợp khung xương gỗ với lớp vật liệu chống cháy và gioăng chuyên dụng. Cấp chịu lửa, độ dày và phụ kiện phải được xác nhận theo hồ sơ kỹ thuật của từng công trình.',
      benefitHeading: 'Các lớp vật liệu của cửa chống cháy',
      benefits: [['Lõi cửa', 'Cấu tạo có thể gồm tấm khoáng Calcium Silicate kết hợp vật liệu cách nhiệt.'], ['Gioăng', 'Gioăng chuyên dụng hỗ trợ bịt kín khe khi gặp nhiệt; chi tiết cụ thể theo hồ sơ sản phẩm.'], ['Cấp chịu lửa', 'Không áp dụng một mức chung cho mọi bộ cửa; cần đối chiếu chứng từ và yêu cầu của công trình.']],
      facts: [['Cấu tạo tham khảo', 'Khung xương gỗ, tấm khoáng chống cháy và vật liệu cách nhiệt tùy mẫu.'], ['Gioăng và phụ kiện', 'Loại chuyên dụng được xác định theo bộ cửa.'], ['Cấp chịu lửa', 'Xác nhận theo chứng nhận và hồ sơ kỹ thuật của sản phẩm được đặt.']],
      applications: [['Hành lang và lối thoát', 'Chọn đúng cấp cửa theo thiết kế và yêu cầu PCCC của công trình.'], ['Khu vực kỹ thuật', 'Phương án cần được tư vấn theo hồ sơ dự án và chứng từ nghiệm thu.']],
      faqs: [['Cửa có cấp chịu lửa bao nhiêu?', 'Cấp chịu lửa phụ thuộc mẫu. Cần xem hồ sơ và chứng từ của đúng mẫu cửa được đặt.'], ['Cửa gồm những lớp nào?', 'Cấu tạo có thể gồm khung gỗ, lớp khoáng chống cháy, vật liệu cách nhiệt và gioăng chuyên dụng.'], ['Có thể dùng cho cửa thoát hiểm không?', 'Cần xác nhận theo thiết kế PCCC, vị trí lắp và chứng từ của bộ cửa cụ thể.']]
    };
    return {
      summary: 'Cửa gỗ composite kết hợp bột gỗ, PVC và phụ gia để tạo vật liệu cửa có khả năng kháng ẩm. Bề mặt film vân gỗ hoặc sơn phù hợp nhiều lựa chọn nội thất, đặc biệt ở khu vực thường có hơi ẩm.',
      benefitHeading: 'Vật liệu composite cho khu vực có độ ẩm',
      benefits: [['Vật liệu', 'Hỗn hợp bột gỗ, PVC và phụ gia được định hình thành cấu kiện cửa.'], ['Bề mặt', 'Có thể chọn film vân gỗ hoặc sơn theo mẫu.'], ['Vị trí sử dụng', 'Phù hợp xem xét cho phòng tắm, nhà vệ sinh và khu vực trong nhà có độ ẩm cao.']],
      facts: [['Thành phần', 'Bột gỗ, PVC và phụ gia.'], ['Bề mặt', 'Film vân gỗ hoặc sơn theo mẫu.'], ['Lưu ý', 'Đặc tính vật liệu không thay thế cửa chống cháy chuyên dụng.']],
      applications: [['Phòng tắm và nhà vệ sinh', 'Khả năng kháng ẩm phù hợp khu vực thường có hơi ẩm.'], ['Không gian nội thất', 'Lựa chọn màu và bề mặt theo thiết kế.']],
      faqs: [['Cửa composite có phù hợp khu vực ẩm?', 'Dòng composite được giới thiệu cho phòng tắm, nhà vệ sinh và một số khu vực có độ ẩm cao.'], ['Cửa composite có phải cửa chống cháy?', 'Không. Đặc tính của composite không thay thế cửa chống cháy chuyên dụng.'], ['Có lựa chọn bề mặt nào?', 'Có các lựa chọn film vân gỗ hoặc sơn, tùy mẫu.']]
    };
  }

  if (familySlug === 'cua-cuon') return {
    summary: 'Cửa cuốn nhôm khe thoáng EASD45 dùng nan nhôm dạng khe thoáng và cơ chế cuốn lên phía trên. Khi cửa đóng, các khe hỗ trợ lưu thông không khí; mẫu phù hợp cho nhà phố, gara và cửa hàng mặt phố.',
    benefitHeading: 'Khe thoáng trên thân cửa cuốn',
    benefits: [['Nan cửa', 'Thiết kế nan kép có khe thoáng.'], ['Cơ chế đóng mở', 'Thân cửa cuộn lên phía trên, không cần khoảng quét cánh.'], ['Vị trí sử dụng', 'Nhà phố, cửa hàng, gara, nhà kho và shophouse tùy mẫu.']],
    facts: [['Dòng sản phẩm', 'EASD45 cửa cuốn nhôm khe thoáng.'], ['Lựa chọn', 'Nan nhôm khe thoáng; kích thước và phụ kiện xác nhận theo công trình.'], ['Vận hành', 'Động cơ và điều khiển theo bộ sản phẩm.']],
    applications: [['Nhà phố và shophouse', 'Dành cho lối vào mặt tiền cần che chắn và lưu thông không khí.'], ['Cửa hàng và gara', 'Thân cửa cuộn gọn phía trên khi mở.']],
    faqs: [['EASD45 là dòng cửa nào?', 'Đây là dòng cửa cuốn nhôm khe thoáng Eurowindow.'], ['Cửa có thông thoáng khi đóng không?', 'Các khe trên nan hỗ trợ lưu thông không khí khi cửa đóng.'], ['Kích thước và phụ kiện được xác định ra sao?', 'Kích thước, động cơ, điều khiển và phụ kiện cần được chốt theo vị trí lắp đặt.']]
  };

  if (familySlug === 'cua-thong-minh-the-he-moi') {
    let summary; let benefits; let facts; let applications;
    if (lower.includes('slim')) {
      summary = 'Cửa trượt Slim ray treo dùng ray giấu phía trên, không có ray sàn và khung nhôm thanh mảnh. Cơ chế giảm chấn hỗ trợ đóng mở êm; phù hợp phân chia không gian mà vẫn giữ tầm nhìn thoáng.';
      benefits = [['Ray treo', 'Ray được bố trí phía trên, không dùng ray sàn.'], ['Vận hành', 'Cơ chế đóng mở liên động và phụ kiện giảm chấn.'], ['Ứng dụng', 'Phòng khách, bếp, phòng làm việc và vách ngăn nội thất.']];
      facts = [['Kiểu cửa', 'Cửa trượt ray treo.'], ['Đặc điểm', 'Không dùng ray sàn; khung và phụ kiện theo mẫu.']];
      applications = [['Không gian nội thất', 'Phân chia phòng nhưng hạn chế che khuất tầm nhìn.'], ['Nhà phố và văn phòng nhỏ', 'Có thể cân nhắc khi cần tiết kiệm diện tích sử dụng.']];
    } else if (lower.includes('kính điện')) {
      summary = 'Kính điện đổi màu chuyển giữa trạng thái trong suốt và mờ đục qua công tắc, remote hoặc ứng dụng. Giải pháp giúp thay đổi mức độ riêng tư theo nhu cầu mà không cần rèm che.';
      benefits = [['Chuyển trạng thái', 'Kính chuyển trong suốt hoặc mờ đục khi cấp/ngắt điện tùy mẫu.'], ['Điều khiển', 'Công tắc, remote hoặc ứng dụng tùy hệ thống.'], ['Không gian riêng tư', 'Phòng họp, phòng tắm, phòng tư vấn và vách ngăn.']];
      facts = [['Công nghệ', 'Kính điện đổi màu dùng lớp phim PDLC tùy mẫu sản phẩm.'], ['Điều khiển', 'Công tắc, remote hoặc ứng dụng tùy hệ thống.']];
      applications = [['Phòng họp và phòng tư vấn', 'Chuyển trạng thái kính để điều chỉnh tầm nhìn riêng tư.'], ['Phòng tắm và vách ngăn', 'Thay đổi mức độ che chắn theo nhu cầu sử dụng.']];
    } else if (lower.includes('bản lề sàn')) {
      summary = 'Cửa bản lề sàn tự động hỗ trợ đóng mở tại lối vào có lưu lượng qua lại. Cửa có thể điều khiển bằng cảm biến, remote hoặc nút bấm; cảm biến an toàn cần xác nhận theo bộ sản phẩm.';
      benefits = [['Vận hành tự động', 'Điều khiển bằng cảm biến, remote hoặc nút bấm tùy mẫu.'], ['Lối vào', 'Phù hợp sảnh và khu vực cần hỗ trợ lưu thông.'], ['An toàn', 'Cảm biến và tích hợp báo cháy chỉ áp dụng khi có trong phương án đã thống nhất.']];
      facts = [['Cơ chế', 'Mở quay tự động qua bộ truyền động bản lề sàn.'], ['Điều khiển', 'Cảm biến, remote hoặc nút bấm tùy mẫu.'], ['Phụ kiện an toàn', 'Xác nhận theo bộ cửa được đặt.']];
      applications = [['Sảnh và lối vào', 'Có thể dùng tại văn phòng, khách sạn và khu vực dịch vụ.'], ['Khu vực lưu thông', 'Xác định hướng mở và cảm biến phù hợp theo hiện trạng.']];
    } else if (lower.includes('gấp trượt')) {
      summary = 'Cửa gấp trượt dọc tự động kết hợp vách kính lấy sáng với chuyển động gấp trượt theo phương đứng. Khi mở, có thể tạo phần che phía trên; phương án cụ thể cần đối chiếu thiết kế công trình.';
      benefits = [['Chuyển động', 'Các cánh gấp trượt theo phương đứng.'], ['Công năng', 'Kết hợp vách kính và phần che phía trên theo thiết kế.'], ['Điều khiển', 'Remote hoặc nút bấm; cảm biến tùy mẫu.']];
      facts = [['Kiểu vận hành', 'Gấp trượt dọc tự động.'], ['Điều khiển và cảm biến', 'Chốt tùy mẫu dự án.']];
      applications = [['Hiên và sân vườn', 'Tạo kết nối giữa trong nhà và ngoài trời theo phương án thiết kế.'], ['Không gian cần lấy sáng', 'Vách kính đưa ánh sáng vào khu vực bên trong.']];
    } else if (lower.includes('giọng nói')) {
      summary = 'Cửa sổ tự động điều khiển bằng giọng nói hỗ trợ thao tác bằng lệnh tiếng Việt, remote, ứng dụng hoặc nút bấm. Kiểu mở và kích thước cánh được lựa chọn theo vị trí cửa.';
      benefits = [['Điều khiển', 'Giọng nói tiếng Việt, remote, ứng dụng hoặc nút bấm tùy mẫu.'], ['Kiểu mở', 'Có thể chọn mở quay trong, quay ngoài, quay lật hoặc mở hất.'], ['Vị trí', 'Phù hợp ô cửa cao hoặc nơi thao tác trực tiếp khó khăn.']];
      facts = [['Điều khiển', 'Giọng nói tiếng Việt và các phương thức điều khiển tùy mẫu.'], ['Kiểu mở', 'Quay trong, quay ngoài, quay lật trong hoặc hất ngoài.']];
      applications = [['Nhà ở và căn hộ', 'Có thể sử dụng ở phòng ngủ, phòng khách hoặc phòng làm việc.'], ['Ô cửa cao', 'Hỗ trợ thao tác đóng mở từ xa.']];
    } else if (lower.includes('vách trượt')) {
      summary = 'Vách trượt dọc tự động chuyển đổi giữa trạng thái vách kính và ô thoáng theo phương đứng. Sản phẩm phù hợp với ban công và mặt tiền cần thông thoáng; kích thước, khóa và cơ cấu cần xác nhận theo công trình.';
      benefits = [['Chuyển đổi trạng thái', 'Các tấm kính trượt dọc để mở thông thoáng.'], ['An toàn', 'Khóa và cơ cấu an toàn phụ thuộc mẫu bộ vách.'], ['Vệ sinh', 'Cách tiếp cận và tháo lắp kính cần theo hướng dẫn sản phẩm.']];
      facts = [['Cơ chế', 'Trượt dọc tự động.'], ['Khóa và phụ kiện', 'Xác nhận tùy mẫu và kích thước vách.']];
      applications = [['Ban công', 'Có thể cân nhắc khi cần chuyển đổi giữa không gian mở và khép kín.'], ['Nhà hàng và khách sạn', 'Thiết kế theo mặt bằng và yêu cầu vận hành.']];
    } else if (lower.includes('đẩy ngang')) {
      summary = 'Cửa sổ đẩy ngang tự động di chuyển song song với khung, phù hợp nơi hạn chế khoảng mở cánh hoặc khó thao tác trực tiếp. Remote, ứng dụng và cảm biến thời tiết là các tùy mẫu.';
      benefits = [['Chuyển động song song', 'Cánh mở theo phương ngang, không tạo cung quét vào phòng.'], ['Điều khiển', 'Remote hoặc ứng dụng tùy mẫu.'], ['Điều chỉnh độ mở', 'Có thể dừng tại vị trí mong muốn nếu bộ điều khiển hỗ trợ.']];
      facts = [['Cơ chế', 'Cửa sổ đẩy ngang tự động.'], ['Điều khiển và cảm biến', 'Chọn tùy mẫu công trình.']];
      applications = [['Ô cửa khó thao tác', 'Hỗ trợ vận hành ở vị trí cao hoặc khu vực hạn chế tiếp cận.'], ['Không gian hẹp', 'Không cần chừa khoảng quét cho cánh mở quay.']];
    } else if (lower.includes('skylight')) {
      summary = 'Cửa mái kính Skylight lắp trên mái để đưa ánh sáng tự nhiên vào công trình, hỗ trợ thông gió và thoát khói tùy mẫu. Cảm biến mưa/gió, động cơ và kết nối báo cháy phải được xác nhận cho đúng bộ sản phẩm.';
      benefits = [['Lấy sáng trên mái', 'Bổ sung ánh sáng tự nhiên cho khu vực bên dưới.'], ['Vận hành', 'Đóng mở tự động theo hệ điều khiển được chọn.'], ['Chống thấm và an toàn', 'Gioăng, thoát nước, cảm biến và kết nối PCCC cần xác nhận trong hồ sơ lựa chọn.']];
      facts = [['Vị trí lắp', 'Mái nhà, giếng trời hoặc mái sảnh theo thiết kế.'], ['Động cơ và cảm biến', 'Điện áp, cảm biến mưa/gió và kết nối hệ thống phải được xác nhận theo hồ sơ.']];
      applications = [['Giếng trời và mái sảnh', 'Đưa ánh sáng tự nhiên vào không gian bên dưới.'], ['Khu vực cần thông gió', 'Phương án mở và thoát nước cần tính theo thiết kế mái.']];
    } else if (lower.includes('cửa trượt tự động')) {
      summary = 'Cửa trượt tự động dùng động cơ hỗ trợ đóng mở theo phương ngang. Danh mục có lựa chọn 2 hoặc 4 cánh; hệ cửa và cảm biến phải được chọn theo lưu lượng người và mặt bằng.';
      benefits = [['Đóng mở tự động', 'Động cơ hỗ trợ vận hành cửa trượt.'], ['Lựa chọn cánh', 'Có thể chọn 2 hoặc 4 cánh theo mẫu.'], ['Lưu thông', 'Phù hợp lối vào cần thao tác đóng mở thuận tiện.']];
      facts = [['Cơ chế', 'Trượt ngang tự động.'], ['Số cánh', '2 hoặc 4 cánh theo mẫu và lựa chọn.'], ['Điều khiển', 'Động cơ và cảm biến lựa chọn theo công trình.']];
      applications = [['Sảnh và lối vào', 'Văn phòng, khách sạn và khu vực dịch vụ.'], ['Công trình hiện hữu', 'Khả năng lắp đặt phụ thuộc cửa trượt và mặt bằng thực tế.']];
    } else {
      summary = 'Cửa sổ tự động hỗ trợ đóng mở bằng remote hoặc nút bấm. Kiểu truyền động, kích thước cánh và phương thức điều khiển cần lựa chọn theo vị trí ô cửa.';
      benefits = [['Điều khiển từ xa', 'Remote hoặc nút bấm tùy mẫu.'], ['Vị trí khó tiếp cận', 'Hỗ trợ thao tác với cửa sổ ở vị trí cao.'], ['Kiểu mở', 'Chốt theo mẫu cửa và yêu cầu thông gió.']];
      facts = [['Sản phẩm', 'Cửa sổ tự động.'], ['Điều khiển', 'Remote hoặc nút bấm tùy mẫu.']];
      applications = [['Ô cửa cao', 'Hỗ trợ đóng mở từ xa khi tay khó tiếp cận.'], ['Nhà ở và văn phòng', 'Chọn kiểu mở theo vị trí và nhu cầu thông gió.']];
    }
    return {
      summary, benefitHeading: benefits[0][1], benefits, facts, applications,
      faqs: [[`${name} hoạt động như thế nào?`, summary.split('. ')[0] + '.'], ['Điều khiển bằng cách nào?', 'Phương thức điều khiển và cảm biến phụ thuộc mẫu sản phẩm; cần xác nhận theo bộ cửa được chọn.'], ['Cần chốt những gì trước khi lắp?', 'Cần xác nhận kích thước, vị trí lắp đặt, nguồn điện, hệ điều khiển và phụ kiện theo hồ sơ công trình.']]
    };
  }

  if (lower.includes('cường lực')) return {
    summary: 'Kính cường lực và bán cường lực được xử lý nhiệt để đáp ứng yêu cầu sử dụng của từng hạng mục. Loại kính, chiều dày và kích thước cần xác định theo vị trí lắp đặt và hồ sơ kỹ thuật.',
    benefitHeading: 'Kính xử lý nhiệt cho các hạng mục kiến trúc',
    benefits: [['Loại kính', 'Có kính cường lực và bán cường lực; lựa chọn phụ thuộc yêu cầu thiết kế.'], ['Ứng dụng', 'Cửa, vách ngăn và các hạng mục kính được thiết kế phù hợp.'], ['Lựa chọn', 'Kích thước, chiều dày và gia công xác nhận theo hồ sơ.']],
    facts: [['Sản phẩm', 'Kính cường lực và bán cường lực.'], ['Chiều dày và kích thước', 'Theo thiết kế và yêu cầu của hạng mục.']],
    applications: [['Cửa và vách ngăn', 'Chọn loại kính phù hợp với cấu tạo bộ cửa hoặc vách.'], ['Công trình dân dụng và thương mại', 'Đối chiếu yêu cầu kỹ thuật trước khi đặt hàng.']],
    faqs: [['Cường lực và bán cường lực khác nhau thế nào?', 'Quy trình xử lý và đặc tính của mỗi loại khác nhau; cần chọn theo thiết kế và yêu cầu an toàn.'], ['Kính có chiều dày cố định không?', 'Chiều dày được chốt theo vị trí, kích thước và tải trọng thiết kế.'], ['Kính dùng được ở đâu?', 'Có thể dùng cho cửa, vách và các hạng mục phù hợp theo hồ sơ kỹ thuật.']]
  };
  if (lower.includes('hộp kính')) return {
    summary: 'Hộp kính gồm nhiều lớp kính và khoang kín ở giữa; có thể dùng khí trơ và hạt hút ẩm. Giải pháp này hỗ trợ cách âm, cách nhiệt và hạn chế ngưng tụ theo cấu tạo cụ thể.',
    benefitHeading: 'Cấu tạo nhiều lớp với khoang kín',
    benefits: [['Cấu tạo', 'Nhiều lớp kính ghép thành hộp, khoang giữa được lựa chọn theo yêu cầu.'], ['Hiệu quả sử dụng', 'Hỗ trợ cách âm, cách nhiệt và hạn chế ngưng tụ tùy mẫu.'], ['Khổ kính', 'Hộp kính khổ lớn được lựa chọn theo kích thước và hồ sơ thiết kế.']],
    facts: [['Cấu tạo', 'Nhiều lớp kính và khoang kín; khí trơ, hạt hút ẩm tùy mẫu.'], ['Ứng dụng', 'Cửa, vách và mặt dựng theo thiết kế.']],
    applications: [['Cửa và mặt dựng', 'Lựa chọn theo yêu cầu cách âm, cách nhiệt của công trình.'], ['Ô kính khổ lớn', 'Kích thước và cấu tạo hộp kính cần được tính theo hồ sơ.']],
    faqs: [['Hộp kính có cấu tạo ra sao?', 'Hộp kính sử dụng nhiều lớp kính và khoang kín; vật liệu trong khoang tùy mẫu.'], ['Hộp kính hỗ trợ điều gì?', 'Cấu tạo nhiều lớp hỗ trợ cách âm, cách nhiệt và hạn chế ngưng tụ.'], ['Có thể chọn hộp kính khổ lớn không?', 'Có các lựa chọn khổ lớn; kích thước và cấu tạo cần xác nhận theo thiết kế.']]
  };
  if (lower.includes('an toàn')) return {
    summary: 'Kính an toàn nhiều lớp ghép các lớp kính với màng liên kết. Khi kính nứt vỡ, lớp liên kết hỗ trợ giữ các mảnh; chiều dày và cấu tạo được chọn theo ứng dụng.',
    benefitHeading: 'Cấu tạo nhiều lớp có màng liên kết',
    benefits: [['Cấu tạo', 'Các lớp kính liên kết với nhau bằng màng trung gian.'], ['Ứng dụng', 'Cửa, vách và các vị trí cần xem xét giải pháp kính an toàn.'], ['Lựa chọn', 'Loại kính, chiều dày và số lớp cần chốt theo hồ sơ.']],
    facts: [['Sản phẩm', 'Kính an toàn nhiều lớp.'], ['Cấu tạo', 'Các lớp kính liên kết bằng màng trung gian; lựa chọn theo thiết kế.']],
    applications: [['Cửa và vách kính', 'Xác định cấu tạo theo vị trí lắp và yêu cầu sử dụng.'], ['Mái kính và khu vực công cộng', 'Tham khảo hồ sơ kỹ thuật cho từng phương án.']],
    faqs: [['Kính an toàn nhiều lớp có cấu tạo gì?', 'Các lớp kính được liên kết với nhau bằng màng trung gian.'], ['Khi nứt vỡ, kính có đặc điểm gì?', 'Màng liên kết hỗ trợ giữ các mảnh kính; mức độ phụ thuộc cấu tạo sản phẩm.'], ['Chọn kính theo tiêu chí nào?', 'Số lớp, chiều dày và kích thước cần căn cứ vị trí và hồ sơ thiết kế.']]
  };
  if (lower.includes('act')) return {
    summary: 'Kính cách nhiệt an toàn ACT là kính đơn kết hợp phim, hướng đến giảm năng lượng mặt trời truyền qua và tăng độ an toàn. Hiệu quả phụ thuộc mã phim, cấu tạo và hướng kính của công trình.',
    benefitHeading: 'Kết hợp phim cách nhiệt trên kính',
    benefits: [['Giảm bức xạ', 'Phim hỗ trợ hạn chế năng lượng mặt trời và ánh sáng gây chói theo mã sản phẩm.'], ['An toàn', 'Lựa chọn phim hỗ trợ giữ mảnh kính khi có va chạm.'], ['Lựa chọn theo hướng nắng', 'Mã kính và phim cần được chọn theo vị trí công trình.']],
    facts: [['Cấu tạo', 'Kính đơn dán phim cách nhiệt.'], ['Mã phim và thông số quang học', 'Xác nhận theo bảng kỹ thuật của mã sản phẩm được chọn.']],
    applications: [['Mặt tiền đón nắng', 'Chọn mã phim theo hướng nắng và yêu cầu ánh sáng.'], ['Cửa và vách kính', 'Đối chiếu bảng kỹ thuật trước khi chốt lựa chọn.']],
    faqs: [['ACT là loại kính nào?', 'Đây là kính đơn dán phim cách nhiệt, kết hợp mục tiêu giảm nhiệt truyền qua và tăng an toàn.'], ['Kính giảm nắng ở mức nào?', 'Thông số thay đổi theo mã phim; cần đối chiếu bảng kỹ thuật của mẫu đặt hàng.'], ['Kính phù hợp vị trí nào?', 'Có thể cân nhắc cho các ô kính đón nắng sau khi xem xét hướng và mục tiêu sử dụng.']]
  };
  if (lower.includes('hoa văn')) return {
    summary: 'Kính hoa văn tạo bề mặt trang trí cho cửa, vách ngăn và nội thất. Mẫu hoa văn và mức độ riêng tư được chọn theo thiết kế, vị trí lắp đặt và khả năng lấy sáng mong muốn.',
    benefitHeading: 'Bề mặt kính trang trí theo thiết kế',
    benefits: [['Họa tiết', 'Chọn mẫu bề mặt theo phong cách kiến trúc và nội thất.'], ['Tầm nhìn riêng tư', 'Mức độ che tầm nhìn phụ thuộc họa tiết và lựa chọn kính.'], ['Ứng dụng', 'Cửa, vách ngăn và các hạng mục nội thất.']],
    facts: [['Sản phẩm', 'Kính hoa văn.'], ['Mẫu và kích thước', 'Chọn theo bộ sưu tập và bản vẽ của hạng mục.']],
    applications: [['Vách ngăn và cửa', 'Tạo điểm nhấn bề mặt và điều tiết tầm nhìn.'], ['Không gian nội thất', 'Phối mẫu kính với phong cách tổng thể.']],
    faqs: [['Kính hoa văn dùng ở đâu?', 'Có thể sử dụng cho cửa, vách ngăn và hạng mục nội thất phù hợp.'], ['Kính có bảo đảm riêng tư không?', 'Mức che tầm nhìn phụ thuộc mẫu hoa văn và điều kiện ánh sáng.'], ['Chọn mẫu kính thế nào?', 'Chọn theo mẫu thực tế, kích thước và yêu cầu lấy sáng của công trình.']]
  };
  return null;
}

// Additional locally stored photos are included only when they depict the same product family.
// The primary image remains the product-specific image from the catalog entry above.
const productGalleryAssets = {
  'cua-di-upvc-2-canh-mo-quay-ngoai': [
    '/images/eurowindow-products/cua-di-upvc-2-canh-mo-quay-ngoai-01.webp',
    '/images/eurowindow-products/cua-di-upvc-2-canh-mo-quay-ngoai-02.webp',
    '/images/eurowindow-products/cua-di-upvc-2-canh-mo-quay-ngoai-03.webp',
    '/images/eurowindow-products/cua-di-upvc-2-canh-mo-quay-ngoai-04.webp',
    '/images/eurowindow-products/cua-di-upvc-2-canh-mo-quay-ngoai-05.webp'
  ],
  'cua-go-tu-nhien': [
    '/images/eurowindow-products/cua-go-tu-nhien-vat-lieu-eurowindow.webp',
    '/images/eurowindow-products/cua-go-tu-nhien-cac-dong-go-eurowindow.webp',
    '/images/eurowindow-products/cua-go-tu-nhien-phong-cach-sang-trong-eurowindow.webp'
  ],
  'cua-go-cong-nghiep': [
    '/images/eurowindow-products/cua-go-cong-nghiep-ket-cau-eurowindow.webp',
    '/images/eurowindow-products/cua-go-cong-nghiep-be-mat-eurowindow.webp'
  ],
  'cua-go-ghep-thanh': [
    '/images/eurowindow-products/cua-go-ghep-thanh-ket-cau-eurowindow.webp',
    '/images/eurowindow-products/cua-go-ghep-thanh-veneer-eurowindow.webp'
  ],
  'cua-go-chong-chay': [
    '/images/eurowindow-products/cua-go-chong-chay-cau-tao-eurowindow.webp',
    '/images/eurowindow-products/cua-go-chong-chay-cong-trinh-eurowindow.webp',
    '/images/eurowindow-products/cua-go-chong-chay-gioang-ngan-khoi-eurowindow.webp'
  ],
  'cua-go-composite': [
    '/images/eurowindow-products/cua-go-composite-thiet-ke-eurowindow.webp',
    '/images/eurowindow-products/cua-go-composite-anh-ky-thuat-eurowindow.webp'
  ],
  'cua-cuon-nhom-khe-thoang-easd45': [
    '/images/eurowindow-products/cua-cuon-nhom-khe-thoang-easd45-khe-thoang-eurowindow.webp',
    '/images/eurowindow-products/cua-cuon-nhom-khe-thoang-easd45-van-hanh-eurowindow.webp',
    '/images/eurowindow-products/cua-cuon-nhom-khe-thoang-easd45-dieu-khien-eurowindow.webp',
    '/images/eurowindow-products/cua-cuon-nhom-khe-thoang-easd45-cam-bien-eurowindow.webp',
    '/images/eurowindow-products/cua-cuon-nhom-khe-thoang-easd45-pccc-eurowindow.webp'
  ],
  'cua-mai-kinh-skylight': [
    '/images/eurowindow-products/cua-mai-kinh-skylight-cong-trinh-eurowindow.webp',
    '/images/eurowindow-products/cua-mai-kinh-skylight-dong-co-eurowindow.webp',
    '/images/eurowindow-products/cua-mai-kinh-skylight-kinh-hop-eurowindow.webp',
    '/images/eurowindow-products/cua-mai-kinh-skylight-lay-sang-eurowindow.webp',
    '/images/eurowindow-products/cua-mai-kinh-skylight-khu-nghi-duong-eurowindow.webp'
  ],
  'kinh-cuong-luc-va-ban-cuong-luc': [
    '/images/eurowindow-products/kinh-cuong-luc-ban-cuong-luc-eurowindow.webp'
  ],
  'kinh-an-toan-nhieu-lop': [
    '/images/eurowindow-products/kinh-an-toan-eurowindow.webp'
  ],
  'kinh-dien-doi-mau': [
    '/images/eurowindow-products/kinh-dien-doi-mau-trong-mo-eurowindow.webp',
    '/images/eurowindow-products/kinh-dien-doi-mau-ung-dung-eurowindow.webp'
  ],
  'vach-truot-doc-tu-dong': [
    '/images/eurowindow-products/vach-truot-doc-tu-dong-thiet-ke-eurowindow.webp',
    '/images/eurowindow-products/vach-truot-doc-tu-dong-biet-thu-eurowindow.webp',
    '/images/eurowindow-products/vach-truot-doc-tu-dong-ve-sinh-kinh-eurowindow.webp'
  ]
};

export const catalogProducts = Object.entries(catalog).flatMap(([familySlug, rows]) => rows.map(([name, image, type, configuration]) => {
  const slug = slugify(name);
  const imageAlt = name;
  const downloadedGallery = productImageManifest[slug] || [];
  const primaryImage = downloadedGallery[0] || image;
  const content = productContent(familySlug, name, type, configuration);
  const summary = content?.summary || `${name} · ${configuration}. Thông tin cụ thể được xác nhận theo nhu cầu và vị trí lắp đặt của công trình.`;
  const related = rows.filter(([other]) => other !== name).slice(0, 3).map(([other]) => slugify(other));
  const gallery = (downloadedGallery.length ? downloadedGallery : [image, ...(productGalleryAssets[slug] || [])])
    .filter((src, index, all) => all.indexOf(src) === index)
    .map((src) => ({ src, alt: name }));
  const uses = content?.applications || [['Theo vị trí công trình', 'Lựa chọn và cách lắp đặt cần được xác nhận theo hồ sơ và điều kiện thực tế.']];
  return {
    id: slug, slug, familySlug, familyTitle: familyTitles[familySlug], name, category: familyTitles[familySlug],
    image: primaryImage, summary, description: summary, heroKicker: `${type} · ${configuration}`,
    heroFacts: [type, configuration], benefitHeading: content?.benefitHeading || configuration,
    benefits: content?.benefits || [['Chi tiết sản phẩm', `${type}, kiểu ${configuration.toLocaleLowerCase('vi')}.`], ...uses],
    constructionFacts: content?.facts || [['Loại sản phẩm', type], ['Thông tin trong danh mục', configuration]],
    specifications: [['Danh mục', familyTitles[familySlug]], ['Loại sản phẩm', type], ['Kiểu mở', configuration], ...(content?.facts || []).map(([label, value]) => [label, value])],
    applications: uses,
    faqs: content?.faqs || [
      [`${name} có những kiểu nào?`, `Danh mục hiện ghi nhận kiểu ${configuration.toLocaleLowerCase('vi')}. Các chi tiết khác sẽ được xác nhận khi tư vấn.`],
      ['Phương án lắp đặt được xác định như thế nào?', 'Các chi tiết cần được đối chiếu với vị trí, kích thước ô chờ và yêu cầu của công trình.'],
      ['Làm thế nào để nhận tư vấn?', 'Gọi (024) 3747 4700 để trao đổi nhu cầu và vị trí lắp đặt.']
    ],
    gallery, detailImage: { src: primaryImage, alt: imageAlt },
    isIllustration: false, showBatchExtensions: true, related
  };
}));

export function getCatalogProduct(slug) {
  return catalogProducts.find((product) => product.slug === slug);
}

export function getCatalogProductByRoute(familySlug, slug) {
  return catalogProducts.find((product) => product.familySlug === familySlug && product.slug === slug);
}
