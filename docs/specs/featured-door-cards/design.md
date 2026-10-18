# Thiết kế: Thẻ sản phẩm nổi bật

## Quyết định

1. Không gắn lớp `reveal` vào các phần tử `.system-card` khi tạo HTML cho băng chuyền.
2. Giới hạn đích snap sau thao tác kéo trong khoảng `[-2 * cycleWidth, 0]`, là vùng mà track có bản sao ở hai phía.

## Lý do

`reveal` là hiệu ứng xuất hiện theo giao điểm. Băng chuyền dùng `transform` để dịch chuyển một track rộng hơn khung nhìn, vì vậy việc hiển thị nội dung không nên phụ thuộc vào giao điểm ban đầu của từng thẻ. Bỏ lớp này khỏi riêng các thẻ băng chuyền giúp chúng luôn hiển thị mà không tác động tới hiệu ứng reveal ở các khu vực khác.

Trong lúc kéo, `wrap()` đã giữ vị trí trong phạm vi clone. Tuy nhiên, vị trí snap tính theo quán tính có thể vượt quá hai biên đó. Giới hạn đích trước animation sẽ ngăn track chạy vào vùng không có nội dung. Sau animation, logic wrap hiện tại vẫn chuẩn hóa vị trí để duy trì vòng lặp.

## Điểm thay đổi

- Sửa mẫu HTML trong `scripts/prepare-site.cjs`, là nguồn tạo `public/site-script.js` khi chạy bước chuẩn bị site.
- Sửa `onPointerUp` trong cùng mẫu để clamp đích snap trước khi gọi `animateTo`.
- Giữ nguyên lớp `.system-card` và các thuộc tính `aria-hidden`/`inert` trên bản sao.
- Không cần thay CSS, cấu trúc track, thuật toán vòng lặp hoặc dữ liệu sản phẩm.

## Tương thích

Thẻ gốc và bản sao vẫn dùng cùng cấu trúc, kích thước và tương tác hiện có. Các thẻ sẽ hiển thị ổn định dù đang ở đầu track hay vừa được đưa vào khung nhìn bởi chuyển động ngang.
