# Đặc tả yêu cầu: Hoàn thiện website Eurowindow

## Mục tiêu

Hoàn thiện trang chủ, điều hướng catalogue, các hiệu ứng và trang chi tiết sản phẩm theo yêu cầu tổng hợp của người dùng. Duy trì trải nghiệm độc lập, responsive và dùng ảnh sẵn có trong repo.

## Phạm vi

1. Trang chủ thay ảnh cho Cửa nhôm, Cửa uPVC và Cửa thông minh bằng ảnh đúng sản phẩm; giữ ảnh của Cửa gỗ, Cửa cuốn và Kính & Vách kính. Nếu ảnh lỗi, thẻ vẫn phải có trạng thái dự phòng hữu ích.
2. Catalogue Eurowindow PDF được phục vụ từ `public/data`, có trang `/catalogue` để xem trước, mở toàn màn hình và tải xuống. Menu Giới thiệu có mục con “Về chúng tôi” và “Catalogue”.
3. Hiệu ứng trang vẫn hoạt động ở chế độ bình thường và chế độ bật chuyển động đầy đủ; chế độ giảm chuyển động của hệ điều hành được tôn trọng. Menu Giới thiệu và Sản phẩm mở khi rê chuột hoặc dùng bàn phím, có thể đóng khi chọn liên kết, bấm ngoài hoặc nhấn Escape.
4. Dải “Các dòng cửa nổi bật” là một hàng ngang có thể tự trượt, tạm dừng và kéo bằng chuột. Giữ các nhóm cửa chính theo trạng thái hiện tại, bao gồm Cửa nhôm, uPVC, Cửa gỗ, Cửa cuốn và Cửa thông minh; giữ nhịp tự trượt chậm.
5. Không thêm loại sản phẩm chỉ để thay ảnh. Ảnh cục bộ phải đúng chủng loại, kiểu mở và số cánh khi có thể đối chiếu; dùng tên file theo quy ước hiện có.
6. Giữ 50 đường dẫn trang sản phẩm con. Mỗi trang có lời giới thiệu riêng theo sản phẩm gốc, phần mô tả không trình bày cấu hình như một thuộc tính phân loại, gallery có tối đa ba ảnh cục bộ lấy từ thư viện hiện hữu, hỗ trợ popup đóng và chuyển ảnh trước/sau. Không tạo ảnh mới.
7. Gộp thông tin cần biết với khối tư vấn/báo giá theo bố cục dễ đọc; không còn liên kết điều hướng tới website `eurowindow.biz`.
8. Trang chi tiết hiển thị ảnh sau phần giới thiệu, một ảnh nếu thư viện chỉ có một ảnh phù hợp và tối đa ba ảnh nếu có nhiều ảnh. Không sinh ảnh để lấp chỗ. Mẫu trang phải trả HTTP 200.

## Tiêu chí nghiệm thu

- Ba ảnh được thay chỉ ở đúng nhóm đã nêu; ba nhóm cần giữ nguyên không đổi.
- Ảnh lỗi không làm thẻ rỗng hoặc hiện biểu tượng ảnh hỏng; fallback dừng sau lần thử dự phòng.
- PDF tồn tại, xem trước và tải xuống qua đường dẫn cùng website.
- Hai dropdown có liên kết nội bộ đúng, đóng theo các thao tác nêu trên và dùng được trên di động.
- Dải thẻ luôn hiển thị đủ nội dung, không trượt vào vùng trống khi kéo; pause/resume và reduced-motion hoạt động.
- Tất cả 50 trang con vẫn có route; gallery tối đa ba ảnh, mọi ảnh gallery là đường dẫn cục bộ tồn tại.
- Không còn `href` dẫn tới `eurowindow.biz`.
- Kiểm tra HTTP 200 cho catalogue và các trang mẫu, bao gồm trang chi tiết sản phẩm.

## Ràng buộc

- Giữ nguyên PDF catalogue đã có trong `public/data/catalogue-eurowindow-2024.pdf`.
- Dùng ảnh sẵn có; không tạo ảnh minh họa mới.
- Không thêm hoặc bỏ trang sản phẩm con ngoài tập 50 route.
- Không sửa nội dung liên hệ email/điện thoại khi yêu cầu chỉ loại bỏ liên kết tới website ngoài.

## Đánh giá hiện trạng

- Đã có PDF catalogue, route xem trước/tải và tập 50 route/dữ liệu.
- Đã có dải thẻ có thể kéo/tạm dừng và ảnh trang chủ được ánh xạ cho ba nhóm.
- Còn thiếu markup dropdown trong shell được dựng khi build; có CSS/JS dropdown nhưng chưa có phần tử menu để tương tác.
- `productChildGallery` hiện có thể đưa URL ảnh ngoài vào gallery và trả tới năm ảnh; trang chi tiết đặt gallery cạnh/trước nội dung giới thiệu.
- Shell trang chủ nằm trong tệp bị Git-ignore nhưng hiện chưa được sinh bởi `prepare-site.cjs`; cần chuyển việc tạo shell vào bước chuẩn bị để build mới vẫn đầy đủ.

## Cập nhật phạm vi 2026-10-18

Yêu cầu mới nhất thay thế các mục 6 và 8 ở trên: xóa toàn bộ 50 trang sản phẩm con. Giữ các trang danh mục sản phẩm và thẻ giới thiệu mẫu cửa, nhưng bỏ liên kết chi tiết tới những trang đã xóa. URL cũ phải hiển thị 404, không còn được tạo trong build hoặc dữ liệu route/SEO.

Tiêu chí nghiệm thu cập nhật:

- Build không tạo 50 route `/san-pham/chi-tiet/...`.
- Các thẻ sản phẩm trong danh mục không còn liên kết tới URL chi tiết bị xóa.
- Preview trả mã 404 cho URL sản phẩm con cũ; trang danh mục vẫn trả 200.

Yêu cầu bổ sung: thiết kế lại cụm thông tin sản phẩm trên mọi trang danh mục theo bố cục gọn, sang trọng, ổn định khi tải ảnh và tương thích màn hình nhỏ; giữ bộ lọc, liên kết tư vấn, gallery và điều khiển hiện có.
