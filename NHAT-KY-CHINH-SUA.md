# Nhật ký chỉnh sửa website Eurowindow

File này ghi lại các thay đổi giao diện và chức năng được yêu cầu từ mốc bắt đầu theo dõi trở đi, để tiện tra cứu và tiếp tục chỉnh sửa website.

## Mốc bắt đầu

- Ngày: 18/10/2026.
- Website local được mở tại `http://127.0.0.1:4173/`.
- Trạng thái giao diện tham chiếu: mốc commit `ff22920`.
- Việc mở website ở mốc này không làm thay đổi giao diện hay chức năng.

## Các thay đổi được ghi nhận

### 18/10/2026 — Bắt đầu ghi nhật ký

- Tạo file nhật ký này theo yêu cầu.
- Chưa có thay đổi giao diện hoặc chức năng website trong mục này.

## Lịch sử theo khoảng hội thoại được đánh dấu

### Từ Annotation 1 đến Annotation 2 — Trang chủ và trang sản phẩm con

Các mục dưới đây ghi lại thứ tự yêu cầu và kết quả trong khoảng hội thoại này. Một số mục là bước trung gian đã được điều chỉnh hoặc hoàn tác ở yêu cầu sau; trạng thái cuối khoảng được ghi riêng ở cuối.

1. **Đồng bộ hình ảnh trang chủ:** thay ảnh thẻ Cửa nhôm, Cửa uPVC và Cửa thông minh bằng ảnh sản phẩm mới phù hợp; giữ nguyên Cửa gỗ, Cửa cuốn và Kính & Vách kính khi chưa có ảnh tương ứng. Sau đó xử lý thẻ bị lỗi ảnh.
2. **Catalogue và điều hướng:** tìm Catalogue Eurowindow trên máy, đưa PDF vào dữ liệu website; thêm menu con “Về chúng tôi” và “Catalogue” dưới mục Giới thiệu; tạo trang xem trước và tải catalogue.
3. **Hiệu ứng và menu:** giữ hiệu ứng để xem trang, đồng thời đảm bảo cách xử lý ở cả chế độ chuyển động; thêm menu xổ xuống khi rê chuột cho Giới thiệu và Sản phẩm, liên kết đến đúng trang, đóng sau khi chọn hoặc khi bấm ra ngoài, và làm chuyển động xổ xuống mượt hơn.
4. **Khu vực sản phẩm nổi bật:** điều chỉnh danh sách hệ cửa, bổ sung nhóm uPVC, cửa gỗ và cửa thông minh; chuyển dải thẻ sang một hàng trượt, hỗ trợ tạm dừng và kéo bằng chuột, chỉnh nhịp trượt chậm hơn. Các yêu cầu về số nhóm, nội dung và hiệu ứng đã được tinh chỉnh qua nhiều lượt; yêu cầu sau cùng trong giai đoạn này ưu tiên các nhóm cửa chính.
5. **Rà soát ảnh sản phẩm:** kiểm tra ảnh thiếu và ảnh không đúng chủng loại; bổ sung ảnh phù hợp từ nguồn Eurowindow, lưu trong thư mục ảnh của website và đặt tên theo quy tắc mở cửa – chủng loại – số cánh – Eurowindow (ví dụ `cua-di-nhom-mo-quay-2-canh-eurowindow`). Không thêm loại sản phẩm mới khi yêu cầu chỉ là thay ảnh; cửa một cánh phải dùng ảnh một cánh, cửa hai cánh phải dùng ảnh hai cánh.
6. **Trang sản phẩm con:** rà soát các trang gốc Eurowindow, tạo trang chi tiết có đường dẫn riêng cho từng sản phẩm con, nội dung về sản phẩm và ảnh đúng loại cửa. Điều chỉnh nội dung để chỉ mô tả sản phẩm, không đưa phần cấu hình vào; kiểm tra thao tác gallery và popup, gồm đóng, chuyển ảnh trước/sau và tự đóng menu khi chọn liên kết.
7. **Bố cục và liên kết:** gộp phần “Điểm cần biết” với tư vấn/báo giá theo bố cục hợp lý, thu gọn khoảng trống giữa các cụm và gỡ các liên kết dẫn sang Eurowindow.biz để website hoạt động độc lập.
8. **Trạng thái chốt tại Annotation 2:** áp dụng trên 50 trang sản phẩm con. Phần thông tin sản phẩm có đoạn giới thiệu riêng bám nội dung sản phẩm gốc, tối ưu từ khóa tự nhiên, sau đó là các ô ảnh công trình thực tế lấy từ thư viện sẵn có. Hiển thị một ô khi chỉ có một ảnh, tối đa ba ô khi có nhiều ảnh; không tự tạo ảnh để lấp chỗ. Đã cập nhật dữ liệu, giao diện dự phòng và kiểm tra trang mẫu trả mã 200.

**Tệp chính được nhắc đến trong phần chốt:** `scripts/product-pages.js`, `scripts/prepare-site.cjs`, `app/[[...slug]]/page.js`. Các thay đổi liên quan danh mục, ảnh, menu và trang Catalogue có thể nằm thêm trong `scripts/product-catalogs.js`, `dist/index.html`, `app/layout.js` và thư mục `public/`.

## Mẫu ghi cho các lần chỉnh sửa tiếp theo

### YYYY-MM-DD — Tên ngắn của thay đổi

- Yêu cầu:
- Trang hoặc khu vực bị ảnh hưởng:
- Nội dung thay đổi:
- Tệp liên quan:
- Kiểm tra:
- Commit GitHub (nếu có):
