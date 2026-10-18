# Thiết kế: Hoàn thiện website Eurowindow

## Cập nhật phạm vi 2026-10-18

Theo yêu cầu mới nhất, build chỉ sinh các trang danh mục sản phẩm. Bỏ dữ liệu route/SEO của 50 trang con và bỏ điểm điều hướng chi tiết trên thẻ mẫu. Preview phục vụ trang 404 với mã trạng thái 404 cho đường dẫn đã xóa.

Phần thông tin sản phẩm dùng stylesheet chung: ảnh và nội dung đặt theo lưới cân đối ở màn hình rộng, xếp dọc trên di động, giới hạn kích thước khung ảnh để tránh bố cục quá khổ. Các nút lọc, gallery, báo giá và tư vấn không đổi hành vi.

## Quyết định

- `scripts/prepare-site.cjs` là nguồn tạo shell, CSS và script trình duyệt; không sửa các tệp `public/site-*` bị ignore như nguồn chính.
- Sinh markup dropdown vào `public/site-shell.html` trong bước chuẩn bị. Dùng liên kết thật cho trang Giới thiệu/Sản phẩm và các mục con; thêm nút mở menu dành cho màn hình nhỏ.
- Ánh xạ fallback ảnh theo danh mục bằng ảnh cục bộ đã có. Khi ảnh lỗi, thử đúng ảnh dự phòng một lần rồi hiển thị placeholder có tên sản phẩm.
- Giữ các ảnh chưa được yêu cầu thay trong các thẻ danh mục. Không thêm danh mục kính vào dải “Các dòng cửa nổi bật”, vì dải này ưu tiên các nhóm cửa chính; danh mục kính vẫn hiện trong lưới sản phẩm trang chủ.
- Dùng bộ ảnh gallery hiện hữu làm nguồn duy nhất. Lọc URL về đường dẫn cục bộ và lấy tối đa ba ảnh khác nhau. Trước khi dùng ảnh bổ trợ, xác nhận tệp tồn tại; không thay thế bằng ảnh không liên quan.
- Trình bày nội dung giới thiệu trước, sau đó là lưới gallery 1–3 ảnh. Các nút ảnh mở lightbox hiện có, giữ thao tác đóng và chuyển trước/sau.
- Tăng khoảng chờ tự trượt của dải thẻ từ 5 lên 7 giây; khi bật `prefers-reduced-motion`, dừng tự trượt và bỏ thời lượng chuyển động; tham số `?motion=full` vẫn cho phép xem hiệu ứng đầy đủ.
- Giữ các mục giá, tư vấn và ứng dụng trong cột thông tin bên cạnh, giảm khoảng cách thừa mà không đưa lại khối “Điểm cần biết” trùng lặp.

## Luồng dữ liệu

```text
dist/index.html + dữ liệu sản phẩm + thư viện ảnh
                 │
                 ▼
        scripts/prepare-site.cjs
           ├─ public/site-shell.html
           ├─ public/site-script.js
           └─ public/data/product-child-*.json
```

## Lưu ý nguồn ảnh

Ảnh dùng trong các trang chi tiết là ảnh sản phẩm/công trình đã có trong thư mục ảnh của website. Chỉ gắn caption “công trình thực tế” khi caption nguồn và ảnh có căn cứ trong dữ liệu nguồn; không biến ảnh cấu tạo hoặc ảnh minh họa thành ảnh công trình bằng cách đổi nhãn.

## Compact spacing between product information groups ? 2026-10-18

- Reduce vertical gaps between the information, pricing, and FAQ groups while preserving gallery dimensions.
- Keep existing interactions and responsive behavior.

## Layered product gallery ? 2026-10-18

- Replace the static product information gallery with a depth-stacked carousel. Populate it from matching product catalog images, with up to five actual images per category.
- Keep local-site vanilla JavaScript architecture; provide looping autoplay, controls, pagination, pointer swipe, and reduced-motion handling.
