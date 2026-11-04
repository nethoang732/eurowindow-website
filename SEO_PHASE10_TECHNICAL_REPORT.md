# SEO Phase 10 — báo cáo kỹ thuật Phase 10.8

## Base và thay đổi

- Base code: 55077ea5c02d1f7ad98263bf352d4a67d1193af9, được fetch từ origin/main ngày 2026-11-04.
- lib/content/site-section-utils.js: fallback canonical HTTPS https://eurowindowmn.vn, chỉ chấp nhận host production đã duyệt; từ chối host preview, HTTP, port và host khác.
- components/site-sections/SectionPage.jsx: category dự án/tin tức dùng descriptor category cho H1.
- app/not-found.js: title riêng, noindex,nofollow, không canonical.
- dist/index.html: thay duy nhất H1 trang chủ; sửa regex form không được chuyển vào candidate.
- app/robots.js và app/sitemap.js trên base mới đã có robots preview block và sitemap production; không sửa hai file này.

## Crawl và kiểm thử

- Local manifest 125 route; local và Production sitemap mỗi bên 124 URL, tập URL khớp nhau.
- 124 URL sitemap trả HTTP 200, canonical self-reference đúng domain, có title/description/H1 và không noindex.
- Robots/sitemap 200; alias /du-an/ 200 canonical tới /cong-trinh-tieu-bieu/; 404 có noindex, không canonical; /he-nhom/ redirect 308 tới /san-pham/cua-nhom/.
- 193 JSON-LD blocks parse hợp lệ.
- npm.cmd run build thành công, compile và lint/validity check tích hợp hoàn tất, 130 trang tĩnh sinh ra.
- Playwright trên 5 route ở 1365, 768 và 390 px: không overflow hoặc page error.
- API POST kiểm thử với body trống trả CONTACT_SUBMISSIONS_DISABLED (503), không gọi lưu lead. Route API không nằm trong candidate.
- git diff --check được chạy trên đúng các file SEO staged; không stage video LFS.
- package.json không có lệnh lint/typecheck riêng. Không có mã TypeScript nên không có typecheck TypeScript độc lập.

## Giới hạn

Search Console chưa kết nối; chưa xác minh query, clicks, impressions, CTR, vị trí trung bình, trạng thái index/Google-selected canonical hoặc CWV thực địa. Production chưa được deploy candidate nên H1 Production vẫn cần xác minh sau phát hành.
