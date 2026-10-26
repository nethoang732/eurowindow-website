# PHASE 17 — Báo cáo nghiệm thu trải nghiệm mobile

**Kết luận: NOT ACCEPTED**

Các kiểm tra giao diện và thao tác di động đạt trên bộ route đã dựng. Chưa thể nghiệm thu toàn bộ vì biểu mẫu báo giá chỉ kiểm tra dữ liệu trên thiết bị, không gửi yêu cầu; các chỉ số Lighthouse và INP chưa có kết quả; canonical cần cấu hình domain triển khai.

## Phạm vi và môi trường

- Bản dựng production Next.js chạy thành công với 123 trang được tạo tĩnh.
- Kiểm tra 118 route HTML trên 9 kích thước: 320×694, 360×800, 375×812, 390×844, 430×932, 768×1024, 1440×900, 844×390 và 1024×768. Tổng cộng 1.062 lượt.
- Trình duyệt: Microsoft Edge điều khiển bằng Playwright, viewport cảm ứng cho luồng mobile. Đây là kiểm tra trình duyệt tự động, chưa thay cho thử trên thiết bị iOS/Android thật.
- Build không tải được stylesheet Google Fonts do môi trường chặn mạng. Kiểm tra và ảnh chụp cục bộ dùng font dự phòng; không xác nhận được trạng thái font trên mạng production.

## Bảng nghiệm thu

| Tiêu chí | Trạng thái | Kết quả và bằng chứng |
|---|---|---|
| Route hiển thị và phản hồi lỗi trình duyệt | PASS | 118/118 route trả trang; 0 lỗi JavaScript trong 1.062 lượt. |
| Responsive và tràn ngang | PASS | 0 route tràn ngang ở cả 9 kích thước, gồm viewport dọc và ngang. |
| Tiêu đề, mô tả và H1 | PASS | 118/118 route có title, description và đúng một H1 trong lần rà ngữ nghĩa cuối. |
| Ảnh và điều khiển chạm | PASS | Không có ảnh thiếu alt hoặc ảnh hỏng; không có điều khiển được rà dưới 44×44 px. Nút chuyển ảnh sản phẩm đo được 44×44 px và đổi ảnh khi chạm. |
| Menu mobile, submenu và bàn phím | PASS | Mở menu/submenu; Escape lần một đóng submenu và trả focus về nút submenu; Escape lần hai đóng menu và trả focus về nút menu. |
| Lịch sử trình duyệt | PASS | Kiểm tra danh mục → sản phẩm → Back về danh mục → Forward về sản phẩm. |
| CTA báo giá cố định | PASS | Ẩn trên ảnh đầu trang, hiện ở phần nội dung, dẫn tới form báo giá và ẩn lại khi form vào vùng nhìn. |
| Tôn trọng giảm chuyển động | PASS | Khi giả lập `prefers-reduced-motion: reduce`, cuộn neo dùng `auto`. Cuộn bằng bánh xe vẫn hoạt động theo kiểm tra thủ công trước đó. |
| Kiểm tra hợp lệ biểu mẫu | PASS | Form báo giá báo lỗi khi bỏ trống trường bắt buộc; các trường nội dung có nhãn truy cập. |
| Gửi yêu cầu báo giá | FAIL | Gửi thử hợp lệ không tạo POST. Thông báo nói rõ dữ liệu chỉ được kiểm tra trên thiết bị, chưa được gửi và hướng khách gọi hotline. Chưa có luồng gửi tới máy chủ để nghiệm thu. |
| JSON-LD | PASS | 50 trang có JSON-LD; tất cả khối được parse thành công. Các trang khác không có JSON-LD. |
| Canonical | BLOCKED | Không có canonical trên 118 route. Hàm tạo origin phụ thuộc biến môi trường domain (`VERCEL_PROJECT_PRODUCTION_URL`, `NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL` hoặc `NEXT_PUBLIC_SITE_URL`); các biến này không có trong môi trường kiểm tra. Không tự đặt domain thay thế. |
| LCP và CLS tại chỗ | PASS, đo thủ công | Trang chủ ở viewport 390×844: LCP đo bằng PerformanceObserver khoảng 304 ms, CLS 0 trong phiên đo cục bộ. Đây không phải điểm Lighthouse hay số liệu thực địa. |
| Lighthouse Performance / Accessibility / Best Practices / SEO | NOT TESTED | Không có Lighthouse trong dependency hoặc cache cục bộ; cài đặt không khả dụng do hạn chế mạng. Không báo điểm giả lập. |
| INP | NOT TESTED | Không có dữ liệu thực địa hoặc phép đo INP đáng tin cậy trong lượt kiểm tra này. |
| Thiết bị thật và bàn phím ảo | NOT TESTED | Chưa kiểm tra trên điện thoại vật lý, trình đọc màn hình hoặc bàn phím ảo iOS/Android. |

## Thay đổi trong Phase 17

- Điều hướng và CTA trên mobile hỗ trợ focus, phím Escape, khôi phục focus và thao tác chạm.
- Nút thư viện ảnh đạt vùng chạm 44×44 px; CTA báo giá tránh che ảnh đầu trang và biểu mẫu.
- Các trang danh mục, hệ nhôm và chi tiết sản phẩm dùng một H1; nội dung tiêu đề phụ dùng cấp heading phù hợp.
- Bổ sung kích thước tối thiểu cho điều khiển mobile, xử lý reduced motion và giới hạn tràn ngang cho vùng ảnh/bài viết.
- Kéo dài vùng hiển thị nội dung chính để tránh dịch chuyển footer khi script trang khởi tạo; đổi stylesheet Google Fonts thành tải ưu tiên không chặn render, đồng thời giữ cơ chế áp dụng stylesheet sau khi tải xong.
- Biểu mẫu có nhãn truy cập rõ hơn. Không thêm API gửi form hoặc giả lập gửi thành công.

## Kết quả kiểm thử

- `npm.cmd run build`: PASS. Next.js hoàn tất biên dịch và tạo 123 trang. Có cảnh báo Google Fonts không tải được vì mạng bị chặn; build dùng font dự phòng.
- Playwright route matrix: PASS — 118 route × 9 viewport = 1.062 lượt; không có lỗi, thiếu title/description/H1, tràn ngang, ảnh hỏng hoặc điều khiển dưới 44 px.
- Rà ngữ nghĩa 118 route: PASS — đúng một H1, title và description đầy đủ; 50 JSON-LD hợp lệ; không có ID trùng hoặc ảnh thiếu alt.
- Luồng chạm menu → danh mục → sản phẩm → báo giá: PASS về điều hướng và hiển thị. Việc gửi báo giá chưa được thực hiện và là FAIL nghiệm thu.
- Đo tại chỗ trang chủ: LCP ≈304 ms; CLS = 0. Đo cục bộ trong trình duyệt, không thay thế Lighthouse.
- `git -c core.longpaths=true diff --check`: PASS; chỉ có cảnh báo chuyển đổi LF/CRLF của Git trên một số file.

## Ảnh và dữ liệu kiểm tra

Ảnh và JSON route/interaction nêu trong bản báo cáo ban đầu nằm trong `output/playwright/phase17/` của workspace cũ, trên phiên bản trước khi đồng bộ với `main`; chúng không được đưa vào nhánh tích hợp. Kết quả xác minh mới được ghi bên dưới.

## Điều kiện cần đóng trước khi nghiệm thu

1. Kết nối form báo giá với endpoint thật, xác nhận trạng thái gửi thành công/lỗi và kiểm tra dữ liệu được nhận.
2. Chạy Lighthouse trên bản production có mạng, ghi điểm Performance, Accessibility, Best Practices và SEO; bổ sung kiểm tra INP phù hợp.
3. Cấu hình origin production để sinh canonical, sau đó kiểm tra canonical trên route triển khai.
4. Kiểm tra thủ công trên iOS và Android, gồm bàn phím ảo, focus và thao tác menu.

Không commit, push hoặc deploy.

## Tái kiểm tra trên nhánh GitHub mới nhất — 2026-10-26

- Production build: PASS; Next.js tạo 142 trang tĩnh. Môi trường không tải được Google Fonts nên build dùng font dự phòng.
- Kiểm kê static export tìm thấy 138 tệp HTML; loại `site-shell.html` vì là shell nội bộ do `prepare-site.cjs` tạo, không phải route công khai. Ma trận gồm 137 route x 3 viewport (320x694, 390x844, 1440x900), tổng 411 lượt.
- 137/137 route trả HTTP thành công, có title, meta description và đúng một H1; không tràn ngang. Không ghi nhận lỗi JavaScript.
- Trường tìm kiếm và nút phân trang trên `/showroom` và `/tin-tuc` được đo lại ở viewport 390 px; các trường/nút đạt 44x44 px.
- Lượt này không gửi biểu mẫu tới endpoint thật, không đo Lighthouse/INP, canonical production hay thiết bị iOS/Android. Các mục này vẫn cần xác nhận riêng.
- Yêu cầu không commit/push/deploy thuộc Phase 17 ban đầu; người dùng sau đó đã yêu cầu cập nhật GitHub và Vercel ở lượt riêng.
