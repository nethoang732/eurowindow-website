# Báo cáo batch Cửa nhôm

## Phạm vi và kiểm kê

- Catalog toàn dự án có 55 vị trí hiển thị, 50 sản phẩm duy nhất và 5 sản phẩm xuất hiện ở hai danh mục. Các sản phẩm lặp là Vách nhôm kính lớn hệ Stick, Vách nhôm kính lớn hệ Spider, Vách nhôm kính hệ Semi-Unitized, Vách nhôm kính lớn hệ Unitized và Mái che.
- Nhóm Cửa nhôm có 19 cấu hình duy nhất; một trang đã được duyệt trước đó.
- Batch này thêm 18 trang chi tiết, dùng chung route động và component đã duyệt.
- Không mở rộng sang các batch uPVC, gỗ, cửa cuốn, cửa thông minh hoặc kính/vách ngoài các cấu hình nhôm trong catalog.
- Mọi route có ID và slug ổn định lấy từ đường dẫn catalog; các trang được sinh tĩnh bằng `generateStaticParams()`. Năm thẻ vách/mái trùng ở danh mục Kính & Vách trỏ về cùng route Cửa nhôm.

## Tình trạng ảnh

- 18 trang mới dùng minh họa SVG nội bộ tại `public/images/products/[slug]/minh-hoa.svg`.
- Không tái sử dụng ảnh chụp hiện có vì repository chưa kèm bằng chứng cấp phép để xác nhận quyền dùng trên website công khai.
- Minh họa nêu rõ bằng alt text rằng đây không phải ảnh chụp hoặc bản vẽ thi công. Không có ảnh ngoài, hotlink hay xử lý watermark.
- Cần nhận bộ ảnh được cấp phép hoặc xác nhận quyền sử dụng trước khi thay minh họa bằng ảnh sản phẩm.

## Nguồn đối chiếu nội bộ

Các URL dưới đây chỉ để biên tập và xác minh dữ kiện; không được đưa vào nội dung website, canonical, JSON-LD hoặc tài nguyên trang.

| Slug | Trang đối chiếu |
| --- | --- |
| cua-di-nhom-1-canh-mo-quay-trong | https://eurowindow.biz/cua-vach-nhom/cua-di-nhom/cua-di-nhom-1-canh-mo-quay-trong.html |
| cua-di-nhom-2-canh-mo-quay-trong | https://eurowindow.biz/cua-vach-nhom/cua-di-nhom/cua-di-nhom-2-canh-mo-quay-trong.html |
| cua-di-nhom-1-canh-mo-quay-ngoai | https://eurowindow.biz/cua-vach-nhom/cua-di-nhom/cua-di-nhom-1-canh-mo-quay-ngoai.html |
| cua-di-nhom-2-canh-mo-truot | https://eurowindow.biz/cua-vach-nhom/cua-di-nhom/cua-di-nhom-2-canh-mo-truot.html |
| cua-di-nhom-4-canh-mo-truot | https://eurowindow.biz/cua-vach-nhom/cua-di-nhom/cua-di-nhom-4-canh-mo-truot.html |
| cua-di-nhom-4-canh-xep-truot | https://eurowindow.biz/cua-vach-nhom/cua-di-nhom/cua-di-nhom-4-canh-xep-truot.html |
| cua-so-nhom-1-canh-mo-quay-trong | https://eurowindow.biz/cua-vach-nhom/cua-so-nhom/cua-so-nhom-1-canh-mo-quay-trong.html |
| cua-so-nhom-2-canh-mo-quay-trong | https://eurowindow.biz/cua-vach-nhom/cua-so-nhom/cua-so-nhom-2-canh-mo-quay-trong.html |
| cua-so-nhom-1-canh-mo-quay-ngoai | https://eurowindow.biz/cua-vach-nhom/cua-so-nhom/cua-so-nhom-1-canh-mo-quay-ngoai.html |
| cua-so-nhom-2-canh-mo-quay-ngoai | https://eurowindow.biz/cua-vach-nhom/cua-so-nhom/cua-so-nhom-2-canh-mo-quay-ngoai.html |
| cua-so-nhom-2-canh-mo-truot | https://eurowindow.biz/cua-vach-nhom/cua-so-nhom/cua-so-nhom-2-canh-mo-truot.html |
| cua-so-nhom-mo-hat | https://eurowindow.biz/cua-vach-nhom/cua-so-nhom/cua-so-nhom-mo-hat.html |
| cua-so-nhom-mo-quay-lat-trong | https://eurowindow.biz/cua-vach-nhom/cua-so-nhom/cua-so-nhom-mo-quay-lat-trong.html |
| vach-nhom-kinh-lon-he-stick | https://eurowindow.biz/cua-vach-nhom/vach-kinh-nhom/vach-nhom-kinh-lon-he-stick.html |
| vach-nhom-kinh-lon-he-spider | https://eurowindow.biz/cua-vach-nhom/vach-kinh-nhom/vach-nhom-kinh-lon-he-spider.html |
| vach-nhom-kinh-he-semi-unitized | https://eurowindow.biz/cua-vach-nhom/vach-kinh-nhom/vach-nhom-kinh-he-semi-unitized.html |
| vach-nhom-kinh-lon-he-unitized | https://eurowindow.biz/cua-vach-nhom/vach-kinh-nhom/vach-nhom-kinh-lon-he-unitized.html |
| mai-che | https://eurowindow.biz/cua-vach-nhom/vach-kinh-nhom/mai-che.html |

## Dữ kiện còn cần xác nhận

- Kích thước theo ô chờ, báo giá, phụ kiện và màu cụ thể phải được chốt theo công trình; không được điền mặc định.
- Một số trang chỉ thể hiện dữ kiện đã xác minh về loại cửa, số cánh, kiểu mở hoặc phương án lắp dựng. Các trường kỹ thuật chưa kiểm tra không được phát hành như thông số chắc chắn.
- Form hiện kiểm tra dữ liệu trên trình duyệt nhưng chưa gửi yêu cầu tới backend; nội dung giao diện nêu rõ giới hạn này.
- Canonical và sitemap cần biến môi trường domain production của Vercel (`VERCEL_PROJECT_PRODUCTION_URL`, `NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL` hoặc `NEXT_PUBLIC_SITE_URL`). Không có domain trong shell local hiện tại.

## Kiểm thử

- Production build Next.js 14.2.35: thành công; sinh 59 route tĩnh, trong đó có 19 route sản phẩm Cửa nhôm. Build thực hiện bước lint và kiểm tra tính hợp lệ kiểu dữ liệu.
- Không có script lint hoặc typecheck độc lập; repository hiện không có cấu hình ESLint hay TypeScript riêng.
- Playwright: 19/19 trang và 18/18 minh họa trả HTTP 200; các trang có một H1, metadata và hai JSON-LD hợp lệ.
- Liên kết: 19 thẻ ở danh mục Cửa nhôm hoạt động; 5 thẻ trùng trong danh mục Kính & Vách trỏ về cùng route chính. Không phát hiện liên kết nội bộ lỗi hoặc liên kết href/src/canonical công khai tới Eurowindow.biz.
- Desktop, tablet 768 px và mobile 390 px không tràn ngang. CTA mobile xuất hiện ở trang mới; trang mẫu cũ vẫn có gallery 5 ảnh và không nhận CTA mới. Thao tác gallery và xác thực cục bộ biểu mẫu đã kiểm tra.
- Tài liệu nguồn ảnh trả 404 trong export sau khi chuyển khỏi `public/`.
- `sitemap.xml` local trả 200 nhưng chưa có URL vì shell local không có domain production Vercel. Trên Vercel, `VERCEL_PROJECT_PRODUCTION_URL` được hệ thống cung cấp cho bước build; khi deploy, sitemap và canonical lấy domain đó nếu domain không bị loại trừ bởi quy tắc bảo vệ.
