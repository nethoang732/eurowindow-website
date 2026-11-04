# SEO Phase 10 — báo cáo phát hành

Cập nhật: 2026-11-04 (Asia/Bangkok). Base đã đồng bộ: 55077ea5c02d1f7ad98263bf352d4a67d1193af9 (origin/main).

## Kết quả xác minh

- Local route manifest: 125 route. Sitemap local và Production: 124 URL; hai tập URL giống nhau.
- URL duy nhất ngoài sitemap: /du-an/, trả 200 và canonical về /cong-trinh-tieu-bieu/; không thêm vào sitemap.
- 124/124 URL sitemap Production trả 200, có title, description, H1 và canonical self-reference https://eurowindowmn.vn. Không URL sitemap nào noindex; metadata title/description không trùng chính xác.
- robots.txt và sitemap.xml Production trả 200. Robots cho phép crawl và khai báo sitemap. HTTP/www đều chuyển về HTTPS domain trần; /he-nhom/ chuyển tới /san-pham/cua-nhom/.
- URL 404 kiểm thử trả 404, noindex và không canonical. Có 193 khối JSON-LD, tất cả parse được.
- Production hiện vẫn có H1 trang chủ và một số H1 category chung. Thay đổi local trong candidate đã làm rõ H1; cần deploy và crawl lại mới xác nhận đã sửa Production.

## Candidate SEO

Commit dự kiến gồm 10 file: app/not-found.js, components/site-sections/SectionPage.jsx, lib/content/site-section-utils.js, dist/index.html và sáu tài liệu SEO_PHASE10_*. Không gồm sửa regex form hay các file ngoài phạm vi.

## Kiểm thử

- npm.cmd run build: thành công; Next.js compile, lint/validity check và tạo 130 trang tĩnh.
- Crawl local build: 124/124 URL sitemap HTTP 200; đủ metadata, canonical đúng host; 193 JSON-LD hợp lệ.
- Playwright: 5 route tại desktop/tablet/mobile; không page error hoặc tràn ngang. API form trả CONTACT_SUBMISSIONS_DISABLED theo cấu hình; không ghi lead.
- git diff --check sẽ được xác nhận trên bộ file staged trước commit. Không có lệnh lint hoặc typecheck riêng trong package.json; build có bước lint và kiểm tra tính hợp lệ tích hợp.
- Search Console chưa kết nối nên chưa có query, clicks, impressions, CTR, vị trí, trạng thái index/canonical hoặc Core Web Vitals thực tế.

## Phát hành

Không push/deploy trong Phase 10.8. Sau khi phát hành cần crawl lại H1, canonical, sitemap/robots, redirect và 404; theo dõi Search Console để quyết định ưu tiên biên tập các trang nội dung ngắn.
