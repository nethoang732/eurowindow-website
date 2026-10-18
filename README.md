# Website Eurowindow

Website giới thiệu các sản phẩm và giải pháp của Eurowindow, được xây dựng bằng Next.js. Nội dung website tĩnh được chuẩn bị từ `dist/index.html` thông qua `scripts/prepare-site.cjs`.

## Chạy website

```bash
npm install
npm run dev
```

Mở địa chỉ localhost mà Next.js hiển thị trong terminal. Lệnh `npm run build` tạo bản dựng để triển khai.

## Cập nhật nội dung và giao diện

- Chỉnh sửa cấu trúc, nội dung và hành vi dùng chung trong `scripts/prepare-site.cjs`.
- Chạy lại `node scripts/prepare-site.cjs` sau khi sửa để cập nhật các tệp được sinh trong `public/`.
- Các trang sản phẩm và dữ liệu danh mục nằm trong `scripts/product-pages.js` và `scripts/product-catalogs.js`.
- Ảnh sản phẩm tải về và thông tin trang nguồn được lưu trong `public/images/eurowindow-products/`.
- Khi thay đổi mã giao diện dùng chung, tăng phiên bản `product-pages-*` trong `components/SiteShell.js` và `app/layout.js` để trình duyệt tải lại các tệp CSS/JS đã cập nhật.

## Quy tắc menu xổ xuống

Menu **Giới thiệu** và **Sản phẩm** dùng chung hành vi trong `scripts/prepare-site.cjs`. Khi rê chuột hoặc chuyển focus vào một mục, menu còn lại phải đóng; trên màn hình nhỏ, nút mở menu cũng đóng menu anh em trước khi mở menu được chọn. Khi bấm một liên kết trong menu, menu hiện tại thu gọn. Nếu chỉnh sửa menu, hãy giữ các trạng thái `open`, `is-dismissed` và thuộc tính `aria-expanded` đồng bộ để menu không bị mở chồng và vẫn dùng được bằng bàn phím.
