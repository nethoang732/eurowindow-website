# Phase 15 — Báo cáo biên tập nội dung website

## Tóm tắt

Đã kiểm tra 118 path trong manifest và 50 trang chi tiết sản phẩm; 15 path trong số đó là soft 404. Đã biên tập nội dung trên 33 route có dữ liệu: trang chủ, trang giới thiệu, trang danh mục sản phẩm, 7 trang danh mục theo giải pháp và 23 trang chi tiết. Chỉ sửa đoạn có câu quảng cáo chung chung, lặp ý, lỗi diễn đạt hoặc thông tin có thể viết rõ hơn mà không suy đoán thông số. Áp dụng Humanizer để bỏ câu sáo rỗng và SEO guide để giữ tiêu đề mô tả đúng trang, đồng thời giữ metadata/JSON-LD hợp lệ.

Không thêm tuyên bố về xuất xứ châu Âu, tiêu chuẩn EN/CE/ISO, chứng nhận hay hiệu suất kỹ thuật. Không thay đổi tên/mã sản phẩm, slug, giá, hotline, dữ liệu công trình, liên kết nội bộ hoặc cấu trúc giao diện. Không commit, push hay deploy.

## Kiểm kê route và chênh lệch 118/123/130

| Số liệu | Ý nghĩa |
| --- | --- |
| 118 | Số path trang trong danh sách static route của Next.js và manifest. Con số này gồm cả path không có bản ghi nội dung tương ứng. |
| 103 | Số path trong 118 path hiển thị trang có dữ liệu. 50 là trang chi tiết sản phẩm; 11 là trang danh mục. |
| 15 | Path được build nhưng render tiêu đề “Trang bạn tìm chưa có ở đây.” vì không có nội dung tương ứng. Đây là soft 404, không phải trang biên tập được. |
| 123 | Bộ đếm `Generating static pages (0/123)` của lần build. Trong thư mục export có 118 trang theo path, hai trang lỗi (`404.html`, `404/index.html`), `site-shell.html`, `robots.txt` và `sitemap.xml`. |
| 130 | Số dòng trong kế hoạch ứng dụng nội dung cũ, gồm 118 path và 12 dòng giữ chỗ “Chưa có trong export”. 12 dòng này không phải route và không được tạo thành trang. |

15 path không có nội dung tương ứng:

- Sáu dự án: `/du-an/biet-thu-ven-song`, `/du-an/khong-gian-do-thi`, `/du-an/nha-ben-doi`, `/du-an/nha-vuon-an-yen`, `/du-an/residence-horizon`, `/du-an/villa-an-vien`.
- Ba hệ nhôm: `/he-nhom/ea70`, `/he-nhom/ea95-ea95i`, `/he-nhom/fa52`.
- Sáu bài viết: `/tin-tuc/anh-sang-tu-nhien-trong-nha`, `/tin-tuc/bao-tri-cua-nhom-kinh`, `/tin-tuc/chon-cua-nhom-cho-cong-trinh`, `/tin-tuc/chon-mau-khung-nhom`, `/tin-tuc/khong-gian-mo-va-cua-truot`, `/tin-tuc/quy-trinh-tu-van-thiet-ke`.

Không xóa hoặc đổi các path này vì yêu cầu là giữ URL; cũng không tạo dữ liệu dự án, hệ nhôm hay bài viết khi chưa có nguồn. Cần đối chiếu với chủ sở hữu dữ liệu trước khi quyết định thêm nội dung hoặc xử lý redirect.

`/` và `/index.html` dùng cùng nội dung trang chủ. Đã sửa bộ render phía trình duyệt để `/index.html` được chuẩn hóa về trang chủ và các trang đã render từ server giữ nguyên nội dung, title và H1 do server cung cấp.

## Nội dung đã biên tập

Các nhóm route được sửa:

- Trang chủ: nội dung giới thiệu, lựa chọn cửa theo vị trí sử dụng và mô tả nhóm sản phẩm.
- Giới thiệu: câu lịch sử, tiêu đề và đoạn nói về năng lực/đối tác.
- Danh mục `/san-pham`: H1 được đổi từ “Sản phẩm Eurowindow” thành “Cửa, kính và vách kính”.
- Bảy danh mục theo giải pháp: cửa uPVC, cửa gỗ, cửa cuốn, cửa thông minh, vách kính mặt dựng, cửa đi mở quay và cửa sổ mở quay.
- 23 trang sản phẩm: 10 mẫu cửa uPVC, một mẫu cửa gỗ tự nhiên, 10 trang cửa thông minh dùng chung nhóm FAQ, một trang kính an toàn nhiều lớp và một trang cửa gỗ chống cháy.

Route đã biên tập:

- Trang chung: `/`, `/gioi-thieu`, `/san-pham`.
- Danh mục: `/san-pham/cua-upvc`, `/san-pham/cua-go`, `/san-pham/cua-cuon`, `/san-pham/cua-thong-minh-the-he-moi`, `/san-pham/vach-kinh-mat-dung`, `/san-pham/cua-di-mo-quay`, `/san-pham/cua-so-mo-quay`.
- Chi tiết uPVC: `/san-pham/cua-upvc/cua-di-upvc-1-canh-mo-quay-ngoai`, `/san-pham/cua-upvc/cua-di-upvc-2-canh-mo-quay-ngoai`, `/san-pham/cua-upvc/cua-di-upvc-2-canh-mo-truot`, `/san-pham/cua-upvc/cua-di-upvc-4-canh-xep-truot`, `/san-pham/cua-upvc/cua-di-upvc-6-canh-xep-truot`, `/san-pham/cua-upvc/cua-so-upvc-1-canh-mo-quay-ngoai`, `/san-pham/cua-upvc/cua-so-upvc-2-canh-mo-truot`, `/san-pham/cua-upvc/cua-so-upvc-2-canh-quay-lat-trong`, `/san-pham/cua-upvc/cua-so-upvc-4-canh-mo-truot`, `/san-pham/cua-upvc/cua-so-upvc-mo-hat`.
- Chi tiết cửa thông minh: `/san-pham/cua-thong-minh-the-he-moi/cua-ban-le-san-tu-dong`, `/san-pham/cua-thong-minh-the-he-moi/cua-gap-truot-doc-tu-dong`, `/san-pham/cua-thong-minh-the-he-moi/cua-mai-kinh-skylight`, `/san-pham/cua-thong-minh-the-he-moi/cua-so-day-ngang-tu-dong`, `/san-pham/cua-thong-minh-the-he-moi/cua-so-tu-dong`, `/san-pham/cua-thong-minh-the-he-moi/cua-so-tu-dong-dieu-khien-bang-giong-noi`, `/san-pham/cua-thong-minh-the-he-moi/cua-truot-slim-ray-treo`, `/san-pham/cua-thong-minh-the-he-moi/cua-truot-tu-dong`, `/san-pham/cua-thong-minh-the-he-moi/kinh-dien-doi-mau`, `/san-pham/cua-thong-minh-the-he-moi/vach-truot-doc-tu-dong`.
- Các chi tiết còn lại: `/san-pham/cua-go/cua-go-tu-nhien`, `/san-pham/vach-kinh-mat-dung/kinh-an-toan-nhieu-lop`, `/san-pham/cua-go/cua-go-chong-chay`.

Ví dụ biên tập:

| Trước | Sau |
| --- | --- |
| “Năm 2002, Eurowindow đưa cửa uPVC theo tiêu chuẩn châu Âu…” | “Eurowindow hoạt động trong lĩnh vực cửa và kính tại Việt Nam từ năm 2002.” Câu mới không gắn năm hoạt động với một tuyên bố tiêu chuẩn chưa có hồ sơ kèm theo. |
| Mô tả cửa uPVC dùng chung, không nêu sự khác nhau giữa kiểu mở. | Mô tả từng mẫu theo cách cánh vận hành: trượt ngang trên ray, mở quay theo cung mở, hoặc quay lật để tạo khe thông gió. Đồng thời nêu yếu tố cần tính như khoảng quét và mặt bằng. |
| Đoạn lựa chọn cửa nói chung về cách âm, cách nhiệt cho sản phẩm. | Nêu các thành phần cần xem xét cùng nhau như khung, kính, gioăng, phụ kiện, kiểu mở và vị trí lắp đặt; không mặc định mọi mẫu có cùng tính năng. |

> Lưu ý: đoạn giới thiệu hoạt động từ năm 2002 được giữ dựa trên nội dung hiện hữu của website. Tài liệu xác nhận mốc này chưa được cung cấp trong phạm vi công việc; cần xác minh trước khi coi là dữ liệu đã chứng thực.

## Nội dung giữ nguyên và dữ liệu cần xác minh

Đã giữ lại tên/mã sản phẩm, thông số và mô tả kỹ thuật vốn có, dữ liệu dự án/tin tức, giá, hotline, liên kết, URL, SEO metadata do ứng dụng quản lý và cấu trúc JSON-LD. Các số liệu hoặc tuyên bố đã có trong source nhưng chưa thấy catalogue/hồ sơ kỹ thuật làm căn cứ không được xem là đã xác minh chỉ vì chúng đang xuất hiện trên website.

Các nội dung nên đối chiếu với tài liệu gốc trước khi biên tập tiếp:

- Hợp kim, mác nhôm, độ dày, tên hệ nhôm và giới hạn kích thước.
- Loại kính, cấu tạo hộp kính, kính an toàn/cường lực, lớp phủ và các chỉ số âm học/nhiệt học.
- Vật liệu uPVC, lõi gia cường, phụ kiện, gioăng và khả năng tương thích giữa các bộ phận.
- Cấp chịu lửa và thời gian chịu lửa của cửa gỗ chống cháy.
- Vật liệu, lớp bề mặt, khả năng dùng ở khu vực ẩm của các dòng cửa gỗ.
- Tính năng điều khiển, cảm biến, kết nối và cơ chế vận hành của cửa thông minh.
- Tiêu chuẩn, chứng nhận, xuất xứ, quy trình sản xuất và số liệu thử nghiệm.

Nguồn tham khảo Eurowindow.biz chỉ được dùng để quan sát cách tổ chức nội dung; không dùng làm căn cứ cho thông số, giá, hotline, chứng nhận hoặc dữ liệu của website hiện tại. Không có tài liệu catalogue/kiểm nghiệm nội bộ trong phạm vi nghiên cứu này.

## Kiểm thử

- `npm.cmd run build`: thành công; Next.js tạo 123 static pages.
- Playwright trên preview build: kiểm tra 118 path trong manifest. Không có lỗi tải trang hoặc lỗi JavaScript; title, description và H1 đều có mặt. 15 path soft 404 được ghi nhận ở trên.
- `/` và `/index.html`: cùng title và H1 sau khi sửa alias.
- JSON-LD: 50 trang sản phẩm có dữ liệu Product/BreadcrumbList; không có lỗi phân tích JSON. Không sửa schema.
- Responsive: 30 lượt kiểm tra trên 10 route đại diện ở độ rộng 390, 768 và 1440 px; không phát hiện tràn ngang.
- Có hai route nội dung công trình dùng title giống nhau: `/du-an` và `/cong-trinh-tieu-bieu`. Giữ nguyên để tránh đổi metadata/URL ngoài phạm vi.
- 12 trang danh mục/hệ có hai H1 do cấu trúc hero và nội dung hiện tại. Chúng vẫn có H1 và nội dung; không đổi cấu trúc giao diện trong đợt này.
- `out/sitemap.xml` rỗng do môi trường build không có `NEXT_PUBLIC_SITE_URL`. Không tự đặt domain thay thế; cần cấu hình origin chính thức để sitemap sinh URL tuyệt đối.
- Chưa có kiểm thử so sánh ảnh pixel giữa các phiên bản; responsive regression được kiểm tra qua DOM và overflow.
- `git -c core.longpaths=true diff --check`: thành công sau khi bỏ dấu cách thừa tại `lib/products/cua-nhom.js:87` (dòng thuộc thay đổi đã có sẵn trong workspace). Lệnh thường `git diff --check` không quét hết diff do một tên ảnh quá dài trong working tree; pathspec riêng các file Phase 15 cũng qua kiểm tra.

## File thuộc phạm vi Phase 15

- `dist/index.html`
- `lib/products/catalog-products.js`
- `scripts/product-pages.js`
- `scripts/prepare-site.cjs`
- `docs/PHASE_15_CONTENT_IMPLEMENTATION_REPORT.md`

Đã bỏ một dấu cách cuối dòng trong `lib/products/cua-nhom.js` để `git diff --check` qua được; không thay đổi nội dung của file này trong Phase 15.

Các thay đổi tồn tại sẵn từ Phase 14 và những file người dùng chưa commit không được tính vào danh sách biên tập Phase 15. Không có thao tác commit, push hoặc deploy.
