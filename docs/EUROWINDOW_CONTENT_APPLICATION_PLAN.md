# Kế hoạch áp dụng biên tập cho route website hiện tại

## Cơ sở kiểm kê

Export có 118 trang nội dung dạng index.html, sau khi loại trang 404. Build Next gần nhất báo 123 static routes; con số đó gồm cả route không phải trang nội dung. Yêu cầu ghi 130 route, chênh 12 route so với các đường dẫn nội dung hiện có trong export. Sitemap local không cung cấp đối chiếu độc lập trong môi trường này. Không tự tạo URL cho phần chênh; 12 vị trí cuối bảng cần lấy URL từ CMS hoặc production trước khi biên tập.

Đây là kế hoạch nội dung, không phải chỉ thị sửa mã. Giữ nguyên URL, slug, tên và mã sản phẩm. Thứ tự: trang chủ/giới thiệu → danh mục → sản phẩm → hệ nhôm → công trình/tin → SEO metadata.

## Phân bổ route đã thấy trong export

| Nhóm | Số route | Ưu tiên |
|---|---:|---|
| Bài viết/chuyên mục tin | 21 | P5 |
| Báo giá | 1 | P5 |
| Catalogue | 1 | P5 |
| Chi tiết sản phẩm | 50 | P3 |
| Chính sách | 2 | P5 |
| Công trình | 12 | P5 |
| Danh mục chính sách | 1 | P5 |
| Danh mục công trình | 1 | P5 |
| Danh mục sản phẩm | 11 | P2 |
| Giới thiệu | 1 | P1 |
| Hệ nhôm | 5 | P4 |
| Liên hệ | 1 | P5 |
| Showroom | 1 | P5 |
| Tin tức | 1 | P5 |
| Trang thông tin | 9 | P5 |

## Bản đồ từng route

| # | Route hiện có | Nhóm | Đề xuất biên tập |
|---:|---|---|---|
| 1 | **/bao-gia** | Báo giá | Không tự điền giá; nêu yếu tố ảnh hưởng và theo quy trình báo giá đã duyệt. |
| 2 | **/catalogue** | Catalogue | Mô tả đúng tài liệu và phiên bản; không thêm thông số ngoài catalogue. |
| 3 | **/chinh-sach** | Danh mục chính sách | Giữ nghĩa pháp lý; chỉ sửa rõ câu sau khi chủ sở hữu chính sách duyệt. |
| 4 | **/chinh-sach/bao-hanh** | Chính sách | Giữ nghĩa pháp lý; chỉ sửa rõ câu sau khi chủ sở hữu chính sách duyệt. |
| 5 | **/chinh-sach/bao-mat-thong-tin** | Chính sách | Giữ nghĩa pháp lý; chỉ sửa rõ câu sau khi chủ sở hữu chính sách duyệt. |
| 6 | **/cong-trinh-tieu-bieu** | Danh mục công trình | Biên tập theo nội dung hiển thị; xác minh tuyên bố kỹ thuật trước khi xuất bản. |
| 7 | **/cong-trinh-tieu-bieu/benh-vien-viet-phap** | Công trình | Giữ dữ kiện dự án; chỉ mô tả hạng mục cửa/vách khi hồ sơ dự án xác nhận. |
| 8 | **/cong-trinh-tieu-bieu/cang-hang-khong-quoc-te-phu-bai** | Công trình | Giữ dữ kiện dự án; chỉ mô tả hạng mục cửa/vách khi hồ sơ dự án xác nhận. |
| 9 | **/cong-trinh-tieu-bieu/cong-trinh-cap-quoc-gia** | Công trình | Giữ dữ kiện dự án; chỉ mô tả hạng mục cửa/vách khi hồ sơ dự án xác nhận. |
| 10 | **/cong-trinh-tieu-bieu/cong-trinh-dan-dung** | Công trình | Giữ dữ kiện dự án; chỉ mô tả hạng mục cửa/vách khi hồ sơ dự án xác nhận. |
| 11 | **/cong-trinh-tieu-bieu/diamond-crown-hai-phong** | Công trình | Giữ dữ kiện dự án; chỉ mô tả hạng mục cửa/vách khi hồ sơ dự án xác nhận. |
| 12 | **/cong-trinh-tieu-bieu/khach-san-da-nang-golden-bay** | Công trình | Giữ dữ kiện dự án; chỉ mô tả hạng mục cửa/vách khi hồ sơ dự án xác nhận. |
| 13 | **/cong-trinh-tieu-bieu/khach-san-four-point-sheraton** | Công trình | Giữ dữ kiện dự án; chỉ mô tả hạng mục cửa/vách khi hồ sơ dự án xác nhận. |
| 14 | **/cong-trinh-tieu-bieu/khu-do-thi-sala** | Công trình | Giữ dữ kiện dự án; chỉ mô tả hạng mục cửa/vách khi hồ sơ dự án xác nhận. |
| 15 | **/cong-trinh-tieu-bieu/nha-pho-chua-thong-son-tay** | Công trình | Giữ dữ kiện dự án; chỉ mô tả hạng mục cửa/vách khi hồ sơ dự án xác nhận. |
| 16 | **/cong-trinh-tieu-bieu/nha-quoc-hoi** | Công trình | Giữ dữ kiện dự án; chỉ mô tả hạng mục cửa/vách khi hồ sơ dự án xác nhận. |
| 17 | **/cong-trinh-tieu-bieu/toa-nha-van-phong-chung-cu** | Công trình | Giữ dữ kiện dự án; chỉ mô tả hạng mục cửa/vách khi hồ sơ dự án xác nhận. |
| 18 | **/cong-trinh-tieu-bieu/tru-so-bo-ngoai-giao** | Công trình | Giữ dữ kiện dự án; chỉ mô tả hạng mục cửa/vách khi hồ sơ dự án xác nhận. |
| 19 | **/du-an** | Trang thông tin | Biên tập theo nội dung hiển thị; xác minh tuyên bố kỹ thuật trước khi xuất bản. |
| 20 | **/du-an/biet-thu-ven-song** | Trang thông tin | Biên tập theo nội dung hiển thị; xác minh tuyên bố kỹ thuật trước khi xuất bản. |
| 21 | **/du-an/khong-gian-do-thi** | Trang thông tin | Biên tập theo nội dung hiển thị; xác minh tuyên bố kỹ thuật trước khi xuất bản. |
| 22 | **/du-an/nha-ben-doi** | Trang thông tin | Biên tập theo nội dung hiển thị; xác minh tuyên bố kỹ thuật trước khi xuất bản. |
| 23 | **/du-an/nha-vuon-an-yen** | Trang thông tin | Biên tập theo nội dung hiển thị; xác minh tuyên bố kỹ thuật trước khi xuất bản. |
| 24 | **/du-an/residence-horizon** | Trang thông tin | Biên tập theo nội dung hiển thị; xác minh tuyên bố kỹ thuật trước khi xuất bản. |
| 25 | **/du-an/villa-an-vien** | Trang thông tin | Biên tập theo nội dung hiển thị; xác minh tuyên bố kỹ thuật trước khi xuất bản. |
| 26 | **/gioi-thieu** | Giới thiệu | Giữ lịch sử/năng lực có nguồn; thay tuyên bố rộng bằng quy trình hoặc dịch vụ có tài liệu. |
| 27 | **/he-nhom** | Hệ nhôm | Nêu hệ/ứng dụng và kiểu mở đã xác minh; thông số, tương thích kính/phụ kiện phải có catalogue. |
| 28 | **/he-nhom/ea55-ea60i** | Hệ nhôm | Nêu hệ/ứng dụng và kiểu mở đã xác minh; thông số, tương thích kính/phụ kiện phải có catalogue. |
| 29 | **/he-nhom/ea70** | Hệ nhôm | Nêu hệ/ứng dụng và kiểu mở đã xác minh; thông số, tương thích kính/phụ kiện phải có catalogue. |
| 30 | **/he-nhom/ea95-ea95i** | Hệ nhôm | Nêu hệ/ứng dụng và kiểu mở đã xác minh; thông số, tương thích kính/phụ kiện phải có catalogue. |
| 31 | **/he-nhom/fa52** | Hệ nhôm | Nêu hệ/ứng dụng và kiểu mở đã xác minh; thông số, tương thích kính/phụ kiện phải có catalogue. |
| 32 | **/index.html** | Trang thông tin | Biên tập theo nội dung hiển thị; xác minh tuyên bố kỹ thuật trước khi xuất bản. |
| 33 | **/lien-he** | Liên hệ | Giữ thông tin liên hệ và biểu mẫu chính xác; rà soát nhất quán với dữ liệu chủ. |
| 34 | **/san-pham** | Trang thông tin | Biên tập theo nội dung hiển thị; xác minh tuyên bố kỹ thuật trước khi xuất bản. |
| 35 | **/san-pham/cua-cuon** | Danh mục sản phẩm | Giải thích phạm vi danh mục và tiêu chí phân biệt theo vật liệu/công năng; nối tới trang con liên quan. |
| 36 | **/san-pham/cua-cuon/cua-cuon-nhom-khe-thoang-easd45** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 37 | **/san-pham/cua-di-mo-quay** | Danh mục sản phẩm | Giải thích phạm vi danh mục và tiêu chí phân biệt theo vật liệu/công năng; nối tới trang con liên quan. |
| 38 | **/san-pham/cua-di-mo-truot** | Danh mục sản phẩm | Giải thích phạm vi danh mục và tiêu chí phân biệt theo vật liệu/công năng; nối tới trang con liên quan. |
| 39 | **/san-pham/cua-go** | Danh mục sản phẩm | Giải thích phạm vi danh mục và tiêu chí phân biệt theo vật liệu/công năng; nối tới trang con liên quan. |
| 40 | **/san-pham/cua-go/cua-go-chong-chay** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 41 | **/san-pham/cua-go/cua-go-composite** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 42 | **/san-pham/cua-go/cua-go-cong-nghiep** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 43 | **/san-pham/cua-go/cua-go-ghep-thanh** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 44 | **/san-pham/cua-go/cua-go-tu-nhien** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 45 | **/san-pham/cua-nhom** | Danh mục sản phẩm | Giải thích phạm vi danh mục và tiêu chí phân biệt theo vật liệu/công năng; nối tới trang con liên quan. |
| 46 | **/san-pham/cua-nhom/cua-di-nhom-1-canh-mo-quay-ngoai** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 47 | **/san-pham/cua-nhom/cua-di-nhom-1-canh-mo-quay-trong** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 48 | **/san-pham/cua-nhom/cua-di-nhom-2-canh-mo-quay-ngoai** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 49 | **/san-pham/cua-nhom/cua-di-nhom-2-canh-mo-quay-trong** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 50 | **/san-pham/cua-nhom/cua-di-nhom-2-canh-mo-truot** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 51 | **/san-pham/cua-nhom/cua-di-nhom-4-canh-mo-truot** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 52 | **/san-pham/cua-nhom/cua-di-nhom-4-canh-xep-truot** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 53 | **/san-pham/cua-nhom/cua-so-nhom-1-canh-mo-quay-ngoai** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 54 | **/san-pham/cua-nhom/cua-so-nhom-1-canh-mo-quay-trong** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 55 | **/san-pham/cua-nhom/cua-so-nhom-2-canh-mo-quay-ngoai** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 56 | **/san-pham/cua-nhom/cua-so-nhom-2-canh-mo-quay-trong** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 57 | **/san-pham/cua-nhom/cua-so-nhom-2-canh-mo-truot** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 58 | **/san-pham/cua-nhom/cua-so-nhom-mo-hat** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 59 | **/san-pham/cua-nhom/cua-so-nhom-mo-quay-lat-trong** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 60 | **/san-pham/cua-nhom/mai-che** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 61 | **/san-pham/cua-nhom/vach-nhom-kinh-he-semi-unitized** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 62 | **/san-pham/cua-nhom/vach-nhom-kinh-lon-he-spider** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 63 | **/san-pham/cua-nhom/vach-nhom-kinh-lon-he-stick** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 64 | **/san-pham/cua-nhom/vach-nhom-kinh-lon-he-unitized** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 65 | **/san-pham/cua-so-mo-hat** | Danh mục sản phẩm | Giải thích phạm vi danh mục và tiêu chí phân biệt theo vật liệu/công năng; nối tới trang con liên quan. |
| 66 | **/san-pham/cua-so-mo-quay** | Danh mục sản phẩm | Giải thích phạm vi danh mục và tiêu chí phân biệt theo vật liệu/công năng; nối tới trang con liên quan. |
| 67 | **/san-pham/cua-thong-minh-the-he-moi** | Danh mục sản phẩm | Giải thích phạm vi danh mục và tiêu chí phân biệt theo vật liệu/công năng; nối tới trang con liên quan. |
| 68 | **/san-pham/cua-thong-minh-the-he-moi/cua-ban-le-san-tu-dong** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 69 | **/san-pham/cua-thong-minh-the-he-moi/cua-gap-truot-doc-tu-dong** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 70 | **/san-pham/cua-thong-minh-the-he-moi/cua-mai-kinh-skylight** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 71 | **/san-pham/cua-thong-minh-the-he-moi/cua-so-day-ngang-tu-dong** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 72 | **/san-pham/cua-thong-minh-the-he-moi/cua-so-tu-dong** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 73 | **/san-pham/cua-thong-minh-the-he-moi/cua-so-tu-dong-dieu-khien-bang-giong-noi** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 74 | **/san-pham/cua-thong-minh-the-he-moi/cua-truot-slim-ray-treo** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 75 | **/san-pham/cua-thong-minh-the-he-moi/cua-truot-tu-dong** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 76 | **/san-pham/cua-thong-minh-the-he-moi/kinh-dien-doi-mau** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 77 | **/san-pham/cua-thong-minh-the-he-moi/vach-truot-doc-tu-dong** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 78 | **/san-pham/cua-upvc** | Danh mục sản phẩm | Giải thích phạm vi danh mục và tiêu chí phân biệt theo vật liệu/công năng; nối tới trang con liên quan. |
| 79 | **/san-pham/cua-upvc/cua-di-upvc-1-canh-mo-quay-ngoai** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 80 | **/san-pham/cua-upvc/cua-di-upvc-2-canh-mo-quay-ngoai** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 81 | **/san-pham/cua-upvc/cua-di-upvc-2-canh-mo-truot** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 82 | **/san-pham/cua-upvc/cua-di-upvc-4-canh-xep-truot** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 83 | **/san-pham/cua-upvc/cua-di-upvc-6-canh-xep-truot** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 84 | **/san-pham/cua-upvc/cua-so-upvc-1-canh-mo-quay-ngoai** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 85 | **/san-pham/cua-upvc/cua-so-upvc-2-canh-mo-truot** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 86 | **/san-pham/cua-upvc/cua-so-upvc-2-canh-quay-lat-trong** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 87 | **/san-pham/cua-upvc/cua-so-upvc-4-canh-mo-truot** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 88 | **/san-pham/cua-upvc/cua-so-upvc-mo-hat** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 89 | **/san-pham/cua-xep-truot** | Danh mục sản phẩm | Giải thích phạm vi danh mục và tiêu chí phân biệt theo vật liệu/công năng; nối tới trang con liên quan. |
| 90 | **/san-pham/vach-kinh-mat-dung** | Danh mục sản phẩm | Giải thích phạm vi danh mục và tiêu chí phân biệt theo vật liệu/công năng; nối tới trang con liên quan. |
| 91 | **/san-pham/vach-kinh-mat-dung/hop-kinh-va-hop-kinh-kho-lon** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 92 | **/san-pham/vach-kinh-mat-dung/kinh-an-toan-nhieu-lop** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 93 | **/san-pham/vach-kinh-mat-dung/kinh-cach-nhiet-an-toan-act** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 94 | **/san-pham/vach-kinh-mat-dung/kinh-cuong-luc-va-ban-cuong-luc** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 95 | **/san-pham/vach-kinh-mat-dung/kinh-hoa-van** | Chi tiết sản phẩm | Giữ tên/mã; biên tập riêng theo kiểu mở, vị trí phù hợp, vật liệu và thông tin cần xác nhận; rà hiệu suất với catalogue. |
| 96 | **/showroom** | Showroom | Giữ nguyên địa chỉ/liên hệ; chỉnh câu giới thiệu nếu có nguồn xác nhận. |
| 97 | **/tin-tuc** | Tin tức | Giữ vai trò trang chỉ mục; mô tả phân loại nội dung, không dùng câu quảng cáo chung. |
| 98 | **/tin-tuc/anh-sang-tu-nhien-trong-nha** | Bài viết/chuyên mục tin | Giữ chủ thể, mốc thời gian và sự kiện; phân biệt tin với bài tư vấn, kiểm tra nguồn nội bộ. |
| 99 | **/tin-tuc/ban-tin-tuyen-dung-thang-7-2026** | Bài viết/chuyên mục tin | Giữ chủ thể, mốc thời gian và sự kiện; phân biệt tin với bài tư vấn, kiểm tra nguồn nội bộ. |
| 100 | **/tin-tuc/bao-tri-cua-nhom-kinh** | Bài viết/chuyên mục tin | Giữ chủ thể, mốc thời gian và sự kiện; phân biệt tin với bài tư vấn, kiểm tra nguồn nội bộ. |
| 101 | **/tin-tuc/chon-cua-nhom-cho-cong-trinh** | Bài viết/chuyên mục tin | Giữ chủ thể, mốc thời gian và sự kiện; phân biệt tin với bài tư vấn, kiểm tra nguồn nội bộ. |
| 102 | **/tin-tuc/chon-mau-khung-nhom** | Bài viết/chuyên mục tin | Giữ chủ thể, mốc thời gian và sự kiện; phân biệt tin với bài tư vấn, kiểm tra nguồn nội bộ. |
| 103 | **/tin-tuc/cong-bo-ket-qua-cuoc-thi-eurowindow-noi-lam-viec-toi-yeu-hanh-trinh-cham-toi-trai-tim-va-lan-toa-niem-tu-hao** | Bài viết/chuyên mục tin | Giữ chủ thể, mốc thời gian và sự kiện; phân biệt tin với bài tư vấn, kiểm tra nguồn nội bộ. |
| 104 | **/tin-tuc/eurowindow-cung-cap-lap-dat-cua-va-vach-kinh-tai-khu-do-thi-vinhomes-global-gate-co-loa** | Bài viết/chuyên mục tin | Giữ chủ thể, mốc thời gian và sự kiện; phân biệt tin với bài tư vấn, kiểm tra nguồn nội bộ. |
| 105 | **/tin-tuc/eurowindow-dong-hanh-cung-gala-doanh-nhan-thang-long-2026-va-vinh-du-nhan-bang-khen-tu-vcci** | Bài viết/chuyên mục tin | Giữ chủ thể, mốc thời gian và sự kiện; phân biệt tin với bài tư vấn, kiểm tra nguồn nội bộ. |
| 106 | **/tin-tuc/eurowindow-lan-thu-8-lien-tiep-dat-thuong-hieu-quoc-gia-viet-nam** | Bài viết/chuyên mục tin | Giữ chủ thể, mốc thời gian và sự kiện; phân biệt tin với bài tư vấn, kiểm tra nguồn nội bộ. |
| 107 | **/tin-tuc/eurowindow-trung-thau-thi-cong-he-cua-va-vach-nhom-kinh-du-an-fpt-telecom-tower** | Bài viết/chuyên mục tin | Giữ chủ thể, mốc thời gian và sự kiện; phân biệt tin với bài tư vấn, kiểm tra nguồn nội bộ. |
| 108 | **/tin-tuc/khong-gian-mo-va-cua-truot** | Bài viết/chuyên mục tin | Giữ chủ thể, mốc thời gian và sự kiện; phân biệt tin với bài tư vấn, kiểm tra nguồn nội bộ. |
| 109 | **/tin-tuc/kich-thuoc-cua-thong-gio-nha-ve-sinh** | Bài viết/chuyên mục tin | Giữ chủ thể, mốc thời gian và sự kiện; phân biệt tin với bài tư vấn, kiểm tra nguồn nội bộ. |
| 110 | **/tin-tuc/quy-trinh-tu-van-thiet-ke** | Bài viết/chuyên mục tin | Giữ chủ thể, mốc thời gian và sự kiện; phân biệt tin với bài tư vấn, kiểm tra nguồn nội bộ. |
| 111 | **/tin-tuc/the-le-chuong-trinh-khuyen-mai-sam-cua-don-sang-san-sang-rinh-xe** | Bài viết/chuyên mục tin | Giữ chủ thể, mốc thời gian và sự kiện; phân biệt tin với bài tư vấn, kiểm tra nguồn nội bộ. |
| 112 | **/tin-tuc/tin-du-an** | Bài viết/chuyên mục tin | Giữ chủ thể, mốc thời gian và sự kiện; phân biệt tin với bài tư vấn, kiểm tra nguồn nội bộ. |
| 113 | **/tin-tuc/tin-khuyen-mai** | Bài viết/chuyên mục tin | Giữ chủ thể, mốc thời gian và sự kiện; phân biệt tin với bài tư vấn, kiểm tra nguồn nội bộ. |
| 114 | **/tin-tuc/tin-noi-bo** | Bài viết/chuyên mục tin | Giữ chủ thể, mốc thời gian và sự kiện; phân biệt tin với bài tư vấn, kiểm tra nguồn nội bộ. |
| 115 | **/tin-tuc/tin-tuc-su-kien** | Bài viết/chuyên mục tin | Giữ chủ thể, mốc thời gian và sự kiện; phân biệt tin với bài tư vấn, kiểm tra nguồn nội bộ. |
| 116 | **/tin-tuc/tu-van** | Bài viết/chuyên mục tin | Giữ chủ thể, mốc thời gian và sự kiện; phân biệt tin với bài tư vấn, kiểm tra nguồn nội bộ. |
| 117 | **/tin-tuc/tuyen-dung** | Bài viết/chuyên mục tin | Giữ chủ thể, mốc thời gian và sự kiện; phân biệt tin với bài tư vấn, kiểm tra nguồn nội bộ. |
| 118 | **/tin-tuc/video** | Bài viết/chuyên mục tin | Giữ chủ thể, mốc thời gian và sự kiện; phân biệt tin với bài tư vấn, kiểm tra nguồn nội bộ. |
| 119 | **Chưa có trong export** | Chờ đối chiếu | Lấy URL chuẩn từ CMS/production; phân loại rồi áp dụng quy tắc tương ứng. Không đoán nội dung hoặc tạo route mới. |
| 120 | **Chưa có trong export** | Chờ đối chiếu | Lấy URL chuẩn từ CMS/production; phân loại rồi áp dụng quy tắc tương ứng. Không đoán nội dung hoặc tạo route mới. |
| 121 | **Chưa có trong export** | Chờ đối chiếu | Lấy URL chuẩn từ CMS/production; phân loại rồi áp dụng quy tắc tương ứng. Không đoán nội dung hoặc tạo route mới. |
| 122 | **Chưa có trong export** | Chờ đối chiếu | Lấy URL chuẩn từ CMS/production; phân loại rồi áp dụng quy tắc tương ứng. Không đoán nội dung hoặc tạo route mới. |
| 123 | **Chưa có trong export** | Chờ đối chiếu | Lấy URL chuẩn từ CMS/production; phân loại rồi áp dụng quy tắc tương ứng. Không đoán nội dung hoặc tạo route mới. |
| 124 | **Chưa có trong export** | Chờ đối chiếu | Lấy URL chuẩn từ CMS/production; phân loại rồi áp dụng quy tắc tương ứng. Không đoán nội dung hoặc tạo route mới. |
| 125 | **Chưa có trong export** | Chờ đối chiếu | Lấy URL chuẩn từ CMS/production; phân loại rồi áp dụng quy tắc tương ứng. Không đoán nội dung hoặc tạo route mới. |
| 126 | **Chưa có trong export** | Chờ đối chiếu | Lấy URL chuẩn từ CMS/production; phân loại rồi áp dụng quy tắc tương ứng. Không đoán nội dung hoặc tạo route mới. |
| 127 | **Chưa có trong export** | Chờ đối chiếu | Lấy URL chuẩn từ CMS/production; phân loại rồi áp dụng quy tắc tương ứng. Không đoán nội dung hoặc tạo route mới. |
| 128 | **Chưa có trong export** | Chờ đối chiếu | Lấy URL chuẩn từ CMS/production; phân loại rồi áp dụng quy tắc tương ứng. Không đoán nội dung hoặc tạo route mới. |
| 129 | **Chưa có trong export** | Chờ đối chiếu | Lấy URL chuẩn từ CMS/production; phân loại rồi áp dụng quy tắc tương ứng. Không đoán nội dung hoặc tạo route mới. |
| 130 | **Chưa có trong export** | Chờ đối chiếu | Lấy URL chuẩn từ CMS/production; phân loại rồi áp dụng quy tắc tương ứng. Không đoán nội dung hoặc tạo route mới. |

## Thứ tự triển khai các Phase tiếp theo

1. Đối chiếu 12 route chênh với production, CMS hoặc sitemap nội bộ.
2. Hoàn thiện trang chủ và giới thiệu bằng dữ liệu năng lực đã xác minh.
3. Biên tập danh mục theo khác biệt vật liệu và nhu cầu.
4. Xử lý 50 trang chi tiết theo thông tin từng mẫu; ưu tiên trang thiếu ứng dụng hoặc cần kiểm chứng tuyên bố kỹ thuật.
5. Rà hệ nhôm, công trình, bài tư vấn, tin và CTA theo nhóm.
6. Rà title, description, internal links, breadcrumbs, metadata, JSON-LD và responsive theo route.

## Ranh giới xác minh

Mọi câu về tiêu chuẩn, chứng nhận, xuất xứ, hiệu suất, giá và dự án cần nguồn nội bộ gắn với đúng trang. Website tham khảo chỉ dùng để học cách giải thích và tổ chức nội dung; không chuyển số liệu hoặc hotline sang website hiện tại.
