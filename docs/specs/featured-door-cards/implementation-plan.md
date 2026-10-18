# Kế hoạch triển khai: Thẻ sản phẩm nổi bật

## Các bước

1. Giữ mẫu `renderCards` trong `scripts/prepare-site.cjs` không gắn lớp `reveal` vào `.system-card`.
2. Giới hạn đích snap trong `onPointerUp` vào phạm vi clone `[-2 * cycleWidth, 0]` trước khi gọi `animateTo`.
3. Giữ nguyên logic tạo bản sao, trạng thái accessibility, dữ liệu thẻ và điều khiển băng chuyền.
4. Chạy bước chuẩn bị site để cập nhật `public/site-script.js` từ nguồn.
5. Cập nhật checkout xem trước `b2876dc` đang chạy để trang local nhận cả hai sửa đổi.
6. Rà soát diff và xác nhận trang local phản hồi sau khi khởi động lại.

## Kiểm tra phạm vi

- Không thêm hoặc chạy bộ kiểm thử theo yêu cầu hiện tại.
- Không thay đổi các file dữ liệu sản phẩm đang có thay đổi ngoài ý muốn.
- Sau khi cập nhật, báo rõ các file đã sửa và trạng thái kiểm tra.
