# SEO Phase 10 — kiểm toán toàn website

Ngày: 2026-11-02 (Asia/Bangkok). Production build local; origin cấu hình https://eurowindowmn.vn.

## Phạm vi và giới hạn

- Framework: Next.js 14.2.35 App Router, React 18.3.1. Nội dung tại lib/content/site-sections.json; sản phẩm tại lib/products/*.js; route/template tại app/ và components/.
- Route nội dung từ manifest: 125; sitemap local: 124; HTTP 200: 125/125; robots local HTTP 200.
- Không truy cập được sitemap/robots production: web fetch từ chối URL và HTTPS request từ shell bị đóng. 124 URL nêu trong yêu cầu chưa được tái xác minh; inventory local không đại diện crawl production.
- Đo HTTP local, HTML ban đầu, title, description, H1, canonical, sitemap membership và SSR. Search Console/analytics không được kết nối nên rank, CTR, indexation và CWV thực địa chưa xác minh.

## Ưu tiên

- **P0:** Không thấy lỗi crawl local. Xác minh production sitemap, status/redirect, canonical và robots trước release.
- **P1:** Domain canonical/sitemap; danh mục sản phẩm và trang chuyển đổi báo giá/liên hệ; xác nhận index bằng Search Console.
- **P2:** Rà nội dung từng bài, alt theo ngữ cảnh ảnh, orphan/broken links, trùng lặp và video khi production crawl được.

## Kiểm kê URL route local

| Route | HTTP | Sitemap | Title | Description | H1 | Canonical | SSR chars | Ghi chú |
|---|---:|---|---|---|---|---|---:|---|
| /san-pham/cua-cuon/cua-cuon-nhom-khe-thoang-easd45 | 200 | Có | Có | Có | Cửa cuốn nhôm khe thoáng EASD45 | https://eurowindowmn.vn/san-pham/cua-cuon/cua-cuon-nhom-khe-thoang-easd45/ | 5171 | — |
| /san-pham/cua-go/cua-go-chong-chay | 200 | Có | Có | Có | Cửa gỗ chống cháy | https://eurowindowmn.vn/san-pham/cua-go/cua-go-chong-chay/ | 8704 | — |
| /san-pham/cua-go/cua-go-composite | 200 | Có | Có | Có | Cửa gỗ composite | https://eurowindowmn.vn/san-pham/cua-go/cua-go-composite/ | 8714 | — |
| /san-pham/cua-go/cua-go-cong-nghiep | 200 | Có | Có | Có | Cửa gỗ công nghiệp | https://eurowindowmn.vn/san-pham/cua-go/cua-go-cong-nghiep/ | 6779 | — |
| /san-pham/cua-go/cua-go-ghep-thanh | 200 | Có | Có | Có | Cửa gỗ ghép thanh | https://eurowindowmn.vn/san-pham/cua-go/cua-go-ghep-thanh/ | 6071 | — |
| /san-pham/cua-go/cua-go-tu-nhien | 200 | Có | Có | Có | Cửa gỗ tự nhiên | https://eurowindowmn.vn/san-pham/cua-go/cua-go-tu-nhien/ | 8253 | — |
| /san-pham/cua-thong-minh-the-he-moi/cua-ban-le-san-tu-dong | 200 | Có | Có | Có | Cửa bản lề sàn tự động | https://eurowindowmn.vn/san-pham/cua-thong-minh-the-he-moi/cua-ban-le-san-tu-dong/ | 5191 | — |
| /san-pham/cua-thong-minh-the-he-moi/cua-gap-truot-doc-tu-dong | 200 | Có | Có | Có | Cửa gấp trượt dọc tự động | https://eurowindowmn.vn/san-pham/cua-thong-minh-the-he-moi/cua-gap-truot-doc-tu-dong/ | 5285 | — |
| /san-pham/cua-thong-minh-the-he-moi/cua-mai-kinh-skylight | 200 | Có | Có | Có | Cửa mái kính Skylight | https://eurowindowmn.vn/san-pham/cua-thong-minh-the-he-moi/cua-mai-kinh-skylight/ | 5434 | — |
| /san-pham/cua-thong-minh-the-he-moi/cua-so-day-ngang-tu-dong | 200 | Có | Có | Có | Cửa sổ đẩy ngang tự động | https://eurowindowmn.vn/san-pham/cua-thong-minh-the-he-moi/cua-so-day-ngang-tu-dong/ | 4598 | — |
| /san-pham/cua-thong-minh-the-he-moi/cua-so-tu-dong | 200 | Có | Có | Có | Cửa sổ tự động | https://eurowindowmn.vn/san-pham/cua-thong-minh-the-he-moi/cua-so-tu-dong/ | 5070 | — |
| /san-pham/cua-thong-minh-the-he-moi/cua-so-tu-dong-dieu-khien-bang-giong-noi | 200 | Có | Có | Có | Cửa sổ tự động điều khiển bằng giọng nói | https://eurowindowmn.vn/san-pham/cua-thong-minh-the-he-moi/cua-so-tu-dong-dieu-khien-bang-giong-noi/ | 5394 | — |
| /san-pham/cua-thong-minh-the-he-moi/cua-truot-slim-ray-treo | 200 | Có | Có | Có | Cửa trượt Slim ray treo | https://eurowindowmn.vn/san-pham/cua-thong-minh-the-he-moi/cua-truot-slim-ray-treo/ | 5113 | — |
| /san-pham/cua-thong-minh-the-he-moi/cua-truot-tu-dong | 200 | Có | Có | Có | Cửa trượt tự động | https://eurowindowmn.vn/san-pham/cua-thong-minh-the-he-moi/cua-truot-tu-dong/ | 6243 | — |
| /san-pham/cua-thong-minh-the-he-moi/kinh-dien-doi-mau | 200 | Có | Có | Có | Kính điện đổi màu | https://eurowindowmn.vn/san-pham/cua-thong-minh-the-he-moi/kinh-dien-doi-mau/ | 6239 | — |
| /san-pham/cua-thong-minh-the-he-moi/vach-truot-doc-tu-dong | 200 | Có | Có | Có | Vách trượt dọc tự động | https://eurowindowmn.vn/san-pham/cua-thong-minh-the-he-moi/vach-truot-doc-tu-dong/ | 5694 | — |
| /san-pham/cua-upvc/cua-di-upvc-1-canh-mo-quay-ngoai | 200 | Có | Có | Có | Cửa đi uPVC 1 cánh mở quay ngoài | https://eurowindowmn.vn/san-pham/cua-upvc/cua-di-upvc-1-canh-mo-quay-ngoai/ | 2632 | — |
| /san-pham/cua-upvc/cua-di-upvc-2-canh-mo-quay-ngoai | 200 | Có | Có | Có | Cửa đi uPVC 2 cánh mở quay ngoài | https://eurowindowmn.vn/san-pham/cua-upvc/cua-di-upvc-2-canh-mo-quay-ngoai/ | 5127 | — |
| /san-pham/cua-upvc/cua-di-upvc-2-canh-mo-truot | 200 | Có | Có | Có | Cửa đi uPVC 2 cánh mở trượt | https://eurowindowmn.vn/san-pham/cua-upvc/cua-di-upvc-2-canh-mo-truot/ | 2715 | — |
| /san-pham/cua-upvc/cua-di-upvc-4-canh-xep-truot | 200 | Có | Có | Có | Cửa đi uPVC 4 cánh xếp trượt | https://eurowindowmn.vn/san-pham/cua-upvc/cua-di-upvc-4-canh-xep-truot/ | 4893 | — |
| /san-pham/cua-upvc/cua-di-upvc-6-canh-xep-truot | 200 | Có | Có | Có | Cửa đi uPVC 6 cánh xếp trượt | https://eurowindowmn.vn/san-pham/cua-upvc/cua-di-upvc-6-canh-xep-truot/ | 4933 | — |
| /san-pham/cua-upvc/cua-so-upvc-1-canh-mo-quay-ngoai | 200 | Có | Có | Có | Cửa sổ uPVC 1 cánh mở quay ngoài | https://eurowindowmn.vn/san-pham/cua-upvc/cua-so-upvc-1-canh-mo-quay-ngoai/ | 5057 | — |
| /san-pham/cua-upvc/cua-so-upvc-2-canh-mo-truot | 200 | Có | Có | Có | Cửa sổ uPVC 2 cánh mở trượt | https://eurowindowmn.vn/san-pham/cua-upvc/cua-so-upvc-2-canh-mo-truot/ | 5180 | — |
| /san-pham/cua-upvc/cua-so-upvc-2-canh-quay-lat-trong | 200 | Có | Có | Có | Cửa sổ uPVC 2 cánh quay lật trong | https://eurowindowmn.vn/san-pham/cua-upvc/cua-so-upvc-2-canh-quay-lat-trong/ | 5463 | — |
| /san-pham/cua-upvc/cua-so-upvc-4-canh-mo-truot | 200 | Có | Có | Có | Cửa sổ uPVC 4 cánh mở trượt | https://eurowindowmn.vn/san-pham/cua-upvc/cua-so-upvc-4-canh-mo-truot/ | 4813 | — |
| /san-pham/cua-upvc/cua-so-upvc-mo-hat | 200 | Có | Có | Có | Cửa sổ uPVC mở hất | https://eurowindowmn.vn/san-pham/cua-upvc/cua-so-upvc-mo-hat/ | 4661 | — |
| /san-pham/vach-kinh-mat-dung/hop-kinh-va-hop-kinh-kho-lon | 200 | Có | Có | Có | Hộp kính và hộp kính khổ lớn | https://eurowindowmn.vn/san-pham/vach-kinh-mat-dung/hop-kinh-va-hop-kinh-kho-lon/ | 5490 | — |
| /san-pham/vach-kinh-mat-dung/kinh-an-toan-nhieu-lop | 200 | Có | Có | Có | Kính an toàn nhiều lớp | https://eurowindowmn.vn/san-pham/vach-kinh-mat-dung/kinh-an-toan-nhieu-lop/ | 5479 | — |
| /san-pham/vach-kinh-mat-dung/kinh-cach-nhiet-an-toan-act | 200 | Có | Có | Có | Kính cách nhiệt an toàn ACT | https://eurowindowmn.vn/san-pham/vach-kinh-mat-dung/kinh-cach-nhiet-an-toan-act/ | 5820 | — |
| /san-pham/vach-kinh-mat-dung/kinh-cuong-luc-va-ban-cuong-luc | 200 | Có | Có | Có | Kính cường lực và bán cường lực | https://eurowindowmn.vn/san-pham/vach-kinh-mat-dung/kinh-cuong-luc-va-ban-cuong-luc/ | 5950 | — |
| /san-pham/vach-kinh-mat-dung/kinh-hoa-van | 200 | Có | Có | Có | Kính hoa văn | https://eurowindowmn.vn/san-pham/vach-kinh-mat-dung/kinh-hoa-van/ | 5229 | — |
| /san-pham/cua-nhom/cua-di-nhom-1-canh-mo-quay-ngoai | 200 | Có | Có | Có | Cửa đi nhôm 1 cánh mở quay ngoài | https://eurowindowmn.vn/san-pham/cua-nhom/cua-di-nhom-1-canh-mo-quay-ngoai/ | 5634 | — |
| /san-pham/cua-nhom/cua-di-nhom-1-canh-mo-quay-trong | 200 | Có | Có | Có | Cửa đi nhôm 1 cánh mở quay trong | https://eurowindowmn.vn/san-pham/cua-nhom/cua-di-nhom-1-canh-mo-quay-trong/ | 7312 | — |
| /san-pham/cua-nhom/cua-di-nhom-2-canh-mo-quay-ngoai | 200 | Có | Có | Có | Cửa đi nhôm 2 cánh mở quay ngoài | https://eurowindowmn.vn/san-pham/cua-nhom/cua-di-nhom-2-canh-mo-quay-ngoai/ | 7370 | — |
| /san-pham/cua-nhom/cua-di-nhom-2-canh-mo-quay-trong | 200 | Có | Có | Có | Cửa đi nhôm 2 cánh mở quay trong | https://eurowindowmn.vn/san-pham/cua-nhom/cua-di-nhom-2-canh-mo-quay-trong/ | 5422 | — |
| /san-pham/cua-nhom/cua-di-nhom-2-canh-mo-truot | 200 | Có | Có | Có | Cửa đi nhôm 2 cánh mở trượt | https://eurowindowmn.vn/san-pham/cua-nhom/cua-di-nhom-2-canh-mo-truot/ | 5420 | — |
| /san-pham/cua-nhom/cua-di-nhom-4-canh-mo-truot | 200 | Có | Có | Có | Cửa đi nhôm 4 cánh mở trượt | https://eurowindowmn.vn/san-pham/cua-nhom/cua-di-nhom-4-canh-mo-truot/ | 6089 | — |
| /san-pham/cua-nhom/cua-di-nhom-4-canh-xep-truot | 200 | Có | Có | Có | Cửa đi nhôm 4 cánh xếp trượt | https://eurowindowmn.vn/san-pham/cua-nhom/cua-di-nhom-4-canh-xep-truot/ | 6731 | — |
| /san-pham/cua-nhom/cua-so-nhom-1-canh-mo-quay-ngoai | 200 | Có | Có | Có | Cửa sổ nhôm 1 cánh mở quay ngoài | https://eurowindowmn.vn/san-pham/cua-nhom/cua-so-nhom-1-canh-mo-quay-ngoai/ | 8144 | — |
| /san-pham/cua-nhom/cua-so-nhom-1-canh-mo-quay-trong | 200 | Có | Có | Có | Cửa sổ nhôm 1 cánh mở quay trong | https://eurowindowmn.vn/san-pham/cua-nhom/cua-so-nhom-1-canh-mo-quay-trong/ | 6244 | — |
| /san-pham/cua-nhom/cua-so-nhom-2-canh-mo-quay-ngoai | 200 | Có | Có | Có | Cửa sổ nhôm 2 cánh mở quay ngoài | https://eurowindowmn.vn/san-pham/cua-nhom/cua-so-nhom-2-canh-mo-quay-ngoai/ | 6434 | — |
| /san-pham/cua-nhom/cua-so-nhom-2-canh-mo-quay-trong | 200 | Có | Có | Có | Cửa sổ nhôm 2 cánh mở quay trong | https://eurowindowmn.vn/san-pham/cua-nhom/cua-so-nhom-2-canh-mo-quay-trong/ | 6320 | — |
| /san-pham/cua-nhom/cua-so-nhom-2-canh-mo-truot | 200 | Có | Có | Có | Cửa sổ nhôm 2 cánh mở trượt | https://eurowindowmn.vn/san-pham/cua-nhom/cua-so-nhom-2-canh-mo-truot/ | 6258 | — |
| /san-pham/cua-nhom/cua-so-nhom-mo-hat | 200 | Có | Có | Có | Cửa sổ nhôm mở hất | https://eurowindowmn.vn/san-pham/cua-nhom/cua-so-nhom-mo-hat/ | 6671 | — |
| /san-pham/cua-nhom/cua-so-nhom-mo-quay-lat-trong | 200 | Có | Có | Có | Cửa sổ nhôm mở quay lật trong | https://eurowindowmn.vn/san-pham/cua-nhom/cua-so-nhom-mo-quay-lat-trong/ | 7074 | — |
| /san-pham/cua-nhom/mai-che | 200 | Có | Có | Có | Mái che kính | https://eurowindowmn.vn/san-pham/cua-nhom/mai-che/ | 5139 | — |
| /san-pham/cua-nhom/vach-nhom-kinh-he-semi-unitized | 200 | Có | Có | Có | Vách nhôm kính hệ Semi-Unitized | https://eurowindowmn.vn/san-pham/cua-nhom/vach-nhom-kinh-he-semi-unitized/ | 5530 | — |
| /san-pham/cua-nhom/vach-nhom-kinh-lon-he-spider | 200 | Có | Có | Có | Vách nhôm kính lớn hệ Spider | https://eurowindowmn.vn/san-pham/cua-nhom/vach-nhom-kinh-lon-he-spider/ | 5360 | — |
| /san-pham/cua-nhom/vach-nhom-kinh-lon-he-stick | 200 | Có | Có | Có | Vách nhôm kính lớn hệ Stick | https://eurowindowmn.vn/san-pham/cua-nhom/vach-nhom-kinh-lon-he-stick/ | 6817 | — |
| /san-pham/cua-nhom/vach-nhom-kinh-lon-he-unitized | 200 | Có | Có | Có | Vách nhôm kính lớn hệ Unitized | https://eurowindowmn.vn/san-pham/cua-nhom/vach-nhom-kinh-lon-he-unitized/ | 5836 | — |
| / | 200 | Có | Có | Có | Giải pháp cửa hàng đầu Việt Nam | https://eurowindowmn.vn/ | 4279 | — |
| /bao-gia | 200 | Có | Có | Có | Kết nối với Eurowindow | https://eurowindowmn.vn/bao-gia/ | 662 | — |
| /catalogue | 200 | Có | Có | Có | Catalogue Eurowindow | https://eurowindowmn.vn/catalogue/ | 868 | — |
| /chinh-sach | 200 | Có | Có | Có | Chính sách | https://eurowindowmn.vn/chinh-sach/ | 514 | — |
| /chinh-sach/bao-hanh | 200 | Có | Có | Có | Chính sách bảo hành | https://eurowindowmn.vn/chinh-sach/bao-hanh/ | 3609 | — |
| /cong-trinh-tieu-bieu | 200 | Có | Có | Có | Công trình tiêu biểu | https://eurowindowmn.vn/cong-trinh-tieu-bieu/ | 1406 | — |
| /cong-trinh-tieu-bieu/benh-vien-viet-phap | 200 | Có | Có | Có | Bệnh viện Việt Pháp | https://eurowindowmn.vn/cong-trinh-tieu-bieu/benh-vien-viet-phap/ | 1187 | — |
| /cong-trinh-tieu-bieu/cang-hang-khong-quoc-te-phu-bai | 200 | Có | Có | Có | CẢNG HÀNG KHÔNG PHÚ BÀI HUẾ | https://eurowindowmn.vn/cong-trinh-tieu-bieu/cang-hang-khong-quoc-te-phu-bai/ | 1215 | — |
| /cong-trinh-tieu-bieu/cong-trinh-cap-quoc-gia | 200 | Có | Có | Có |  | https://eurowindowmn.vn/cong-trinh-tieu-bieu/cong-trinh-cap-quoc-gia/ | 952 | — |
| /cong-trinh-tieu-bieu/cong-trinh-dan-dung | 200 | Có | Có | Có |  | https://eurowindowmn.vn/cong-trinh-tieu-bieu/cong-trinh-dan-dung/ | 656 | — |
| /cong-trinh-tieu-bieu/diamond-crown-hai-phong | 200 | Có | Có | Có | DIAMOND CROWN HẢI PHÒNG | https://eurowindowmn.vn/cong-trinh-tieu-bieu/diamond-crown-hai-phong/ | 906 | — |
| /cong-trinh-tieu-bieu/khach-san-da-nang-golden-bay | 200 | Có | Có | Có | Khách sạn Đà Nẵng Golden Bay | https://eurowindowmn.vn/cong-trinh-tieu-bieu/khach-san-da-nang-golden-bay/ | 921 | — |
| /cong-trinh-tieu-bieu/khach-san-four-point-sheraton | 200 | Có | Có | Có | Khách sạn Four Point Sheraton | https://eurowindowmn.vn/cong-trinh-tieu-bieu/khach-san-four-point-sheraton/ | 924 | — |
| /cong-trinh-tieu-bieu/khu-do-thi-sala | 200 | Có | Có | Có | Khu đô thị Sala | https://eurowindowmn.vn/cong-trinh-tieu-bieu/khu-do-thi-sala/ | 863 | — |
| /cong-trinh-tieu-bieu/nha-pho-chua-thong-son-tay | 200 | Có | Có | Có | Nhà phố Chùa Thông, TX. Sơn Tây, Hà Nội | https://eurowindowmn.vn/cong-trinh-tieu-bieu/nha-pho-chua-thong-son-tay/ | 996 | — |
| /cong-trinh-tieu-bieu/nha-quoc-hoi | 200 | Có | Có | Có | Nhà Quốc hội | https://eurowindowmn.vn/cong-trinh-tieu-bieu/nha-quoc-hoi/ | 1285 | — |
| /cong-trinh-tieu-bieu/toa-nha-van-phong-chung-cu | 200 | Có | Có | Có |  | https://eurowindowmn.vn/cong-trinh-tieu-bieu/toa-nha-van-phong-chung-cu/ | 662 | — |
| /cong-trinh-tieu-bieu/tru-so-bo-ngoai-giao | 200 | Có | Có | Có | Trụ sở Bộ Ngoại giao | https://eurowindowmn.vn/cong-trinh-tieu-bieu/tru-so-bo-ngoai-giao/ | 1305 | — |
| /du-an | 200 | Không | Có | Có | Công trình tiêu biểu | https://eurowindowmn.vn/cong-trinh-tieu-bieu/ | 1406 | ngoài sitemap |
| /gioi-thieu | 200 | Có | Có | Có | Tiên phong – Kiến tạo – Đồng hành | https://eurowindowmn.vn/gioi-thieu/ | 1752 | — |
| /lien-he | 200 | Có | Có | Có | Kết nối với Eurowindow | https://eurowindowmn.vn/lien-he/ | 662 | — |
| /san-pham | 200 | Có | Có | Có | Cửa, kính và vách kính | https://eurowindowmn.vn/san-pham/ | 1396 | — |
| /san-pham/cua-cuon | 200 | Có | Có | Có | Cửa cuốn Eurowindow | https://eurowindowmn.vn/san-pham/cua-cuon/ | 3566 | — |
| /san-pham/cua-di-mo-quay | 200 | Có | Có | Có | Cửa đi mở quay | https://eurowindowmn.vn/san-pham/cua-di-mo-quay/ | 2518 | — |
| /san-pham/cua-di-mo-truot | 200 | Có | Có | Có | Cửa đi mở trượt | https://eurowindowmn.vn/san-pham/cua-di-mo-truot/ | 2347 | — |
| /san-pham/cua-go | 200 | Có | Có | Có | Cửa gỗ Eurowindow | https://eurowindowmn.vn/san-pham/cua-go/ | 10557 | — |
| /san-pham/cua-nhom | 200 | Có | Có | Có | Cửa nhôm Eurowindow | https://eurowindowmn.vn/san-pham/cua-nhom/ | 10613 | — |
| /san-pham/cua-so-mo-hat | 200 | Có | Có | Có | Cửa sổ mở hất | https://eurowindowmn.vn/san-pham/cua-so-mo-hat/ | 2120 | — |
| /san-pham/cua-so-mo-quay | 200 | Có | Có | Có | Cửa sổ mở quay | https://eurowindowmn.vn/san-pham/cua-so-mo-quay/ | 2505 | — |
| /san-pham/cua-thong-minh-the-he-moi | 200 | Có | Có | Có | Cửa thông minh thế hệ mới Eurowindow | https://eurowindowmn.vn/san-pham/cua-thong-minh-the-he-moi/ | 10648 | — |
| /san-pham/cua-upvc | 200 | Có | Có | Có | Cửa uPVC Eurowindow | https://eurowindowmn.vn/san-pham/cua-upvc/ | 5468 | — |
| /san-pham/cua-xep-truot | 200 | Có | Có | Có | Cửa xếp trượt | https://eurowindowmn.vn/san-pham/cua-xep-truot/ | 2256 | — |
| /san-pham/vach-kinh-mat-dung | 200 | Có | Có | Có | Kính và vách kính Eurowindow | https://eurowindowmn.vn/san-pham/vach-kinh-mat-dung/ | 10009 | — |
| /showroom | 200 | Có | Có | Có | Hệ thống showroom Eurowindow | https://eurowindowmn.vn/showroom/ | 3450 | — |
| /tin-tuc | 200 | Có | Có | Có | Tin tức | https://eurowindowmn.vn/tin-tuc/ | 3471 | — |
| /tin-tuc/cap-nhat-cuoc-thi-eurowindow-noi-lam-viec-toi-yeu-16-cau-chuyen-dau-tien-va-loi-moi-goi-tiep-noi-hanh-trinh | 200 | Có | Có | Có | Cập nhật cuộc thi "Eurowindow – Nơi làm việc tôi yêu": 16 câu chuyện đầu tiên và lời mời gọi tiếp nối hành trình | https://eurowindowmn.vn/tin-tuc/cap-nhat-cuoc-thi-eurowindow-noi-lam-viec-toi-yeu-16-cau-chuyen-dau-tien-va-loi-moi-goi-tiep-noi-hanh-trinh/ | 6071 | — |
| /tin-tuc/cap-nhat-cuoc-thi-eurowindow-noi-lam-viec-toi-yeu-28-bai-du-thi-va-chang-nuoc-rut-truoc-gio-khoa-cong | 200 | Có | Có | Có | Cập nhật cuộc thi "Eurowindow – Nơi làm việc tôi yêu": 28 bài dự thi và chặng nước rút trước giờ khóa cổng | https://eurowindowmn.vn/tin-tuc/cap-nhat-cuoc-thi-eurowindow-noi-lam-viec-toi-yeu-28-bai-du-thi-va-chang-nuoc-rut-truoc-gio-khoa-cong/ | 5300 | — |
| /tin-tuc/chuong-trinh-khuyen-mai-dac-biet-danh-cho-khach-hang-mua-kinh-dien-eurowindow | 200 | Có | Có | Có | Chương trình khuyến mại đặc biệt dành cho khách hàng mua kính điện Eurowindow | https://eurowindowmn.vn/tin-tuc/chuong-trinh-khuyen-mai-dac-biet-danh-cho-khach-hang-mua-kinh-dien-eurowindow/ | 5242 | — |
| /tin-tuc/cong-bo-ket-qua-cuoc-thi-eurowindow-noi-lam-viec-toi-yeu-hanh-trinh-cham-toi-trai-tim-va-lan-toa-niem-tu-hao | 200 | Có | Có | Có | CÔNG BỐ KẾT QUẢ CUỘC THI "EUROWINDOW – NƠI LÀM VIỆC TÔI YÊU": HÀNH TRÌNH CHẠM TỚI TRÁI TIM VÀ LAN TỎA NIỀM TỰ HÀO | https://eurowindowmn.vn/tin-tuc/cong-bo-ket-qua-cuoc-thi-eurowindow-noi-lam-viec-toi-yeu-hanh-trinh-cham-toi-trai-tim-va-lan-toa-niem-tu-hao/ | 6333 | — |
| /tin-tuc/dem-gala-bung-no-cam-xuc-eurowindow-khep-lai-mua-giai-cup-2026-trong-niem-vui-ky-niem-24-nam-thanh-lap | 200 | Có | Có | Có | Đêm Gala bùng nổ cảm xúc – Eurowindow khép lại mùa giải "Cup 2026" trong niềm vui kỷ niệm 24 năm thành lập | https://eurowindowmn.vn/tin-tuc/dem-gala-bung-no-cam-xuc-eurowindow-khep-lai-mua-giai-cup-2026-trong-niem-vui-ky-niem-24-nam-thanh-lap/ | 7791 | — |
| /tin-tuc/eurowindow-but-pha-tren-hanh-trinh-tai-thiet-kien-tao-moi-truong-lam-viec-chuyen-nghiep | 200 | Có | Có | Có | EUROWINDOW BỨT PHÁ TRÊN HÀNH TRÌNH TÁI THIẾT: KIẾN TẠO MÔI TRƯỜNG LÀM VIỆC CHUYÊN NGHIỆP | https://eurowindowmn.vn/tin-tuc/eurowindow-but-pha-tren-hanh-trinh-tai-thiet-kien-tao-moi-truong-lam-viec-chuyen-nghiep/ | 5244 | — |
| /tin-tuc/eurowindow-cung-cap-lap-dat-cua-va-vach-kinh-tai-khu-do-thi-vinhomes-global-gate-co-loa | 200 | Có | Có | Có | Eurowindow cung cấp, lắp đặt cửa và vách kính tại khu đô thị Vinhomes Global Gate Cổ Loa | https://eurowindowmn.vn/tin-tuc/eurowindow-cung-cap-lap-dat-cua-va-vach-kinh-tai-khu-do-thi-vinhomes-global-gate-co-loa/ | 5700 | — |
| /tin-tuc/eurowindow-cung-cap-va-thi-cong-gan-30-000m2-cua-vach-kinh-tai-du-an-sunshine-crystal-river | 200 | Có | Có | Có | Eurowindow cung cấp và thi công gần 30.000m2 cửa, vách kính tại dự án Sunshine Crystal River | https://eurowindowmn.vn/tin-tuc/eurowindow-cung-cap-va-thi-cong-gan-30-000m2-cua-vach-kinh-tai-du-an-sunshine-crystal-river/ | 5875 | — |
| /tin-tuc/eurowindow-dong-hanh-cung-gala-doanh-nhan-thang-long-2026-va-vinh-du-nhan-bang-khen-tu-vcci | 200 | Có | Có | Có | Eurowindow đồng hành cùng Gala Doanh nhân Thăng Long 2026 và vinh dự nhận bằng khen từ VCCI | https://eurowindowmn.vn/tin-tuc/eurowindow-dong-hanh-cung-gala-doanh-nhan-thang-long-2026-va-vinh-du-nhan-bang-khen-tu-vcci/ | 7032 | — |
| /tin-tuc/eurowindow-dong-hanh-cung-giai-golf-cdc-nhan-ky-niem-35-nam-thanh-lap | 200 | Có | Có | Có | Eurowindow đồng hành cùng Giải Golf CDC nhân kỷ niệm 35 năm thành lập | https://eurowindowmn.vn/tin-tuc/eurowindow-dong-hanh-cung-giai-golf-cdc-nhan-ky-niem-35-nam-thanh-lap/ | 5447 | — |
| /tin-tuc/eurowindow-gop-phan-kien-tao-khong-gian-song-thuong-luu-du-an-sunshine-noble-palace-long-bien | 200 | Có | Có | Có | Eurowindow góp phần kiến tạo không gian sống thượng lưu dự án Sunshine Noble Palace Long Biên | https://eurowindowmn.vn/tin-tuc/eurowindow-gop-phan-kien-tao-khong-gian-song-thuong-luu-du-an-sunshine-noble-palace-long-bien/ | 5744 | — |
| /tin-tuc/eurowindow-khuyen-mai-nhan-dip-vietbuild-don-cua-tan-gia-nhan-qua-nghi-duong | 200 | Có | Có | Có | EUROWINDOW KHUYẾN MÃI NHÂN DỊP VIETBUILD: “ĐÓN CỬA TÂN GIA – NHẬN QUÀ NGHỈ DƯỠNG” | https://eurowindowmn.vn/tin-tuc/eurowindow-khuyen-mai-nhan-dip-vietbuild-don-cua-tan-gia-nhan-qua-nghi-duong/ | 7601 | — |
| /tin-tuc/eurowindow-kien-tao-khong-gian-song-thuong-luu-tai-chung-cu-cao-tang-the-prive-nam-rach-chiec | 200 | Có | Có | Có | Eurowindow kiến tạo không gian sống thượng lưu tại chung cư cao tầng The Privé Nam Rạch Chiếc | https://eurowindowmn.vn/tin-tuc/eurowindow-kien-tao-khong-gian-song-thuong-luu-tai-chung-cu-cao-tang-the-prive-nam-rach-chiec/ | 5763 | — |
| /tin-tuc/eurowindow-lan-thu-8-lien-tiep-dat-thuong-hieu-quoc-gia-viet-nam | 200 | Có | Có | Có | Eurowindow lần thứ 8 liên tiếp đạt Thương hiệu quốc gia Việt Nam | https://eurowindowmn.vn/tin-tuc/eurowindow-lan-thu-8-lien-tiep-dat-thuong-hieu-quoc-gia-viet-nam/ | 5944 | — |
| /tin-tuc/eurowindow-tang-toc-tren-hanh-trinh-90-ngay-tai-thiet-noi-lam-viec-tot-nhat | 200 | Có | Có | Có | EUROWINDOW TĂNG TỐC TRÊN HÀNH TRÌNH “90 NGÀY TÁI THIẾT NƠI LÀM VIỆC TỐT NHẤT” | https://eurowindowmn.vn/tin-tuc/eurowindow-tang-toc-tren-hanh-trinh-90-ngay-tai-thiet-noi-lam-viec-tot-nhat/ | 6438 | — |
| /tin-tuc/eurowindow-thi-cong-cua-va-vach-nhom-kinh-cho-du-an-to-hop-nghi-duong-5-sao-the-residences-at-arbora-quang-nam | 200 | Có | Có | Có | Eurowindow thi công cửa và vách nhôm kính cho dự án Tổ hợp nghỉ dưỡng 5 sao The Residences at Arbora (Quảng Nam) | https://eurowindowmn.vn/tin-tuc/eurowindow-thi-cong-cua-va-vach-nhom-kinh-cho-du-an-to-hop-nghi-duong-5-sao-the-residences-at-arbora-quang-nam/ | 6960 | — |
| /tin-tuc/eurowindow-thi-cong-he-vach-kinh-mat-dung-khu-nghi-duong-ban-mong-sa-pa | 200 | Có | Có | Có | Eurowindow thi công hệ vách kính mặt dựng khu nghỉ dưỡng Bản Mòng - Sa Pa | https://eurowindowmn.vn/tin-tuc/eurowindow-thi-cong-he-vach-kinh-mat-dung-khu-nghi-duong-ban-mong-sa-pa/ | 6060 | — |
| /tin-tuc/eurowindow-to-chuc-tram-yeu-thuong-tiep-them-nghi-luc-cho-benh-nhi-co-hoan-canh-kho-khan | 200 | Có | Có | Có | Eurowindow tổ chức “Trạm Yêu Thương”, tiếp thêm nghị lực cho bệnh nhi có hoàn cảnh khó khăn | https://eurowindowmn.vn/tin-tuc/eurowindow-to-chuc-tram-yeu-thuong-tiep-them-nghi-luc-cho-benh-nhi-co-hoan-canh-kho-khan/ | 5495 | — |
| /tin-tuc/eurowindow-to-chuc-workshop-giai-phap-xanh-cho-can-nha-hien-dai-tai-thanh-hoa | 200 | Có | Có | Có | Eurowindow tổ chức Workshop “Giải Pháp Xanh Cho Căn Nhà Hiện Đại” tại Thanh Hóa | https://eurowindowmn.vn/tin-tuc/eurowindow-to-chuc-workshop-giai-phap-xanh-cho-can-nha-hien-dai-tai-thanh-hoa/ | 7747 | — |
| /tin-tuc/eurowindow-trung-thau-thi-cong-cua-va-vach-nhom-kinh-du-an-the-9-stellars | 200 | Có | Có | Có | Eurowindow trúng thầu thi công cửa và vách nhôm kính dự án The 9 Stellars | https://eurowindowmn.vn/tin-tuc/eurowindow-trung-thau-thi-cong-cua-va-vach-nhom-kinh-du-an-the-9-stellars/ | 5191 | — |
| /tin-tuc/eurowindow-trung-thau-thi-cong-he-cua-va-vach-nhom-kinh-du-an-fpt-telecom-tower | 200 | Có | Có | Có | Eurowindow trúng thầu thi công hệ cửa và vách nhôm kính dự án FPT Telecom Tower | https://eurowindowmn.vn/tin-tuc/eurowindow-trung-thau-thi-cong-he-cua-va-vach-nhom-kinh-du-an-fpt-telecom-tower/ | 6866 | — |
| /tin-tuc/eurowindow-tu-hao-duoc-vinh-danh-top-10-doanh-nghiep-viet-nam-xanh-2026 | 200 | Có | Có | Có | Eurowindow tự hào được vinh danh Top 10 doanh nghiệp Việt Nam xanh 2026 | https://eurowindowmn.vn/tin-tuc/eurowindow-tu-hao-duoc-vinh-danh-top-10-doanh-nghiep-viet-nam-xanh-2026/ | 5839 | — |
| /tin-tuc/ngay-hoi-hien-mau-eurowindow-2026-giot-hong-se-chia-huong-toi-ky-niem-24-nam-thanh-lap | 200 | Có | Có | Có | Ngày hội hiến máu Eurowindow 2026: "Giọt hồng sẻ chia" hướng tới kỷ niệm 24 năm thành lập | https://eurowindowmn.vn/tin-tuc/ngay-hoi-hien-mau-eurowindow-2026-giot-hong-se-chia-huong-toi-ky-niem-24-nam-thanh-lap/ | 6758 | — |
| /tin-tuc/phat-dong-cuoc-thi-eurowindow-noi-lam-viec-toi-yeu | 200 | Có | Có | Có | PHÁT ĐỘNG CUỘC THI "EUROWINDOW – NƠI LÀM VIỆC TÔI YÊU" | https://eurowindowmn.vn/tin-tuc/phat-dong-cuoc-thi-eurowindow-noi-lam-viec-toi-yeu/ | 5616 | — |
| /tin-tuc/the-le-chuong-trinh-khuyen-mai-dau-tu-xung-tam-uu-dai-cuc-pham | 200 | Có | Có | Có | THỂ LỆ CHƯƠNG TRÌNH KHUYẾN MÃI “ĐẦU TƯ XỨNG TẦM – ƯU ĐÃI CỰC PHẨM” | https://eurowindowmn.vn/tin-tuc/the-le-chuong-trinh-khuyen-mai-dau-tu-xung-tam-uu-dai-cuc-pham/ | 5887 | — |
| /tin-tuc/the-le-chuong-trinh-khuyen-mai-don-ha-sang-nhan-uu-dai-vang | 200 | Có | Có | Có | Thể lệ chương trình khuyến mãi: "Đón hạ sang - Nhận ưu đãi vàng" | https://eurowindowmn.vn/tin-tuc/the-le-chuong-trinh-khuyen-mai-don-ha-sang-nhan-uu-dai-vang/ | 7739 | — |
| /tin-tuc/the-le-chuong-trinh-khuyen-mai-mo-cua-hom-nay-nhan-ngay-uu-dai | 200 | Có | Có | Có | Thể lệ chương trình khuyến mãi: "Mở của hôm nay - Nhận ngay ưu đãi" | https://eurowindowmn.vn/tin-tuc/the-le-chuong-trinh-khuyen-mai-mo-cua-hom-nay-nhan-ngay-uu-dai/ | 6582 | — |
| /tin-tuc/the-le-chuong-trinh-khuyen-mai-mua-cua-trung-xe-nghi-duong-don-he | 200 | Có | Có | Có | Thể lệ chương trình khuyến mãi : "MUA CỬA TRÚNG XE – NGHỈ DƯỠNG ĐÓN HÈ" | https://eurowindowmn.vn/tin-tuc/the-le-chuong-trinh-khuyen-mai-mua-cua-trung-xe-nghi-duong-don-he/ | 6343 | — |
| /tin-tuc/the-le-chuong-trinh-khuyen-mai-ngan-uu-dai-vang-tri-an-khach-hang-nhan-ky-niem-20-nam-thanh-lap-eurowindow | 200 | Có | Có | Có | THỂ LỆ CHƯƠNG TRÌNH KHUYẾN MÃI: “NGÀN ƯU ĐÃI VÀNG – TRI ÂN KHÁCH HÀNG” NHÂN KỶ NIỆM 20 NĂM THÀNH LẬP EUROWINDOW | https://eurowindowmn.vn/tin-tuc/the-le-chuong-trinh-khuyen-mai-ngan-uu-dai-vang-tri-an-khach-hang-nhan-ky-niem-20-nam-thanh-lap-eurowindow/ | 15286 | — |
| /tin-tuc/the-le-chuong-trinh-khuyen-mai-sam-cua-don-sang-san-sang-rinh-xe | 200 | Có | Có | Có | Thể lệ chương trình khuyến mại “Sắm cửa đón sang – Sẵn sàng rinh xế” | https://eurowindowmn.vn/tin-tuc/the-le-chuong-trinh-khuyen-mai-sam-cua-don-sang-san-sang-rinh-xe/ | 9194 | — |
| /tin-tuc/the-le-chuong-trinh-khuyen-mai-sieu-pham-sang-uu-dai-vang | 200 | Có | Có | Có | Thể lệ chương trình khuyến mãi “Siêu phẩm sang – Ưu đãi vàng” | https://eurowindowmn.vn/tin-tuc/the-le-chuong-trinh-khuyen-mai-sieu-pham-sang-uu-dai-vang/ | 5549 | — |
| /tin-tuc/the-le-chuong-trinh-khuyen-mai-tri-an-khach-hang-ngan-qua-tang-sang-nhan-ky-niem-22-nam-thanh-lap-eurowindow | 200 | Có | Có | Có | THỂ LỆ CHƯƠNG TRÌNH KHUYẾN MÃI: “TRI ÂN KHÁCH HÀNG – NGÀN QUÀ TẶNG SANG” NHÂN KỶ NIỆM 22 NĂM THÀNH LẬP EUROWINDOW | https://eurowindowmn.vn/tin-tuc/the-le-chuong-trinh-khuyen-mai-tri-an-khach-hang-ngan-qua-tang-sang-nhan-ky-niem-22-nam-thanh-lap-eurowindow/ | 20043 | — |
| /tin-tuc/tin-du-an | 200 | Có | Có | Có |  | https://eurowindowmn.vn/tin-tuc/tin-du-an/ | 3466 | — |
| /tin-tuc/tin-khuyen-mai | 200 | Có | Có | Có |  | https://eurowindowmn.vn/tin-tuc/tin-khuyen-mai/ | 3366 | — |
| /tin-tuc/tin-noi-bo | 200 | Có | Có | Có |  | https://eurowindowmn.vn/tin-tuc/tin-noi-bo/ | 3641 | — |
| /tin-tuc/tin-tuc-su-kien | 200 | Có | Có | Có |  | https://eurowindowmn.vn/tin-tuc/tin-tuc-su-kien/ | 3495 | — |
| /tin-tuc/toa-dam-xu-huong-nguon-nhan-luc-chien-luoc-phat-trien-va-quan-tri-trong-boi-canh-moi | 200 | Có | Có | Có | Tọa đàm "Xu hướng nguồn nhân lực - Chiến lược phát triển và quản trị trong bối cảnh mới" | https://eurowindowmn.vn/tin-tuc/toa-dam-xu-huong-nguon-nhan-luc-chien-luoc-phat-trien-va-quan-tri-trong-boi-canh-moi/ | 4858 | — |
| /tin-tuc/tong-giam-doc-eurowindow-nguyen-canh-hong-duoc-vinh-danh-doanh-nhan-viet-nam-tieu-bieu-nam-2026 | 200 | Có | Có | Có | Tổng Giám đốc Eurowindow Nguyễn Cảnh Hồng được vinh danh Doanh nhân Việt Nam tiêu biểu năm 2026 | https://eurowindowmn.vn/tin-tuc/tong-giam-doc-eurowindow-nguyen-canh-hong-duoc-vinh-danh-doanh-nhan-viet-nam-tieu-bieu-nam-2026/ | 7378 | — |
| /tin-tuc/tong-ket-chien-dich-eurowindow-90-ngay-tai-thiet-noi-lam-viec-tot-nhat | 200 | Có | Có | Có | TỔNG KẾT CHIẾN DỊCH "EUROWINDOW - 90 NGÀY TÁI THIẾT NƠI LÀM VIỆC TỐT NHẤT" | https://eurowindowmn.vn/tin-tuc/tong-ket-chien-dich-eurowindow-90-ngay-tai-thiet-noi-lam-viec-tot-nhat/ | 7424 | — |
| /tin-tuc/trung-tam-hoi-nghi-tinh-yen-bai-bieu-tuong-kien-truc-moi-mang-hoi-tho-thien-nhien-tay-bac-dau-an-eurowindow | 200 | Có | Có | Có | Trung tâm Hội nghị tỉnh Yên Bái – Biểu tượng kiến trúc mới mang hơi thở thiên nhiên Tây Bắc & dấu ấn Eurowindow | https://eurowindowmn.vn/tin-tuc/trung-tam-hoi-nghi-tinh-yen-bai-bieu-tuong-kien-truc-moi-mang-hoi-tho-thien-nhien-tay-bac-dau-an-eurowindow/ | 5182 | — |

## Kết luận kỹ thuật

- Build prerender thành công. Các route đã được request local với slash cuối; host/slash/HTTP→HTTPS redirect production chưa đo.
- Source dùng fallback HTTPS https://eurowindowmn.vn; NEXT_PUBLIC_SITE_URL ghi đè được. Preview disallow crawler; production robots allow crawl và trỏ sitemap.
- Metadata/nội dung đo trên HTML trước hydration. Chưa tạo link graph đầy đủ để chứng minh orphan pages.
- JSON-LD cần validator/Rich Results Test. Alt rỗng có thể đúng với ảnh trang trí. Video schema và nội dung trùng/mỏng cần review thủ công.

## Khi production truy cập được

1. Crawl 124 URL production được báo cáo và so với 124 URL sitemap local; ghi status, redirect chain, canonical.
2. Dùng Search Console kiểm tra index coverage, canonical Google chọn, impressions, clicks, CTR, position và truy vấn.
3. Dùng PageSpeed/CrUX đo CWV; không suy diễn từ build local.
4. Kiểm tra broken links, orphan pages và nội dung trùng sau khi sitemap production truy cập được.
