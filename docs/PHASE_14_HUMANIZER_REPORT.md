# Báo cáo Phase 14 — Humanizer

## Phạm vi

Biên tập nội dung theo định hướng giải pháp cửa phù hợp với kiến trúc và nhu cầu của từng công trình. Giữ nguyên giao diện, URL, tên và mã sản phẩm, dữ liệu công trình, cấu trúc SEO và các thông số kỹ thuật chưa có tài liệu xác minh.

## Nội dung đã cập nhật

- Trang chủ: chuyển phần mở đầu sang tư vấn lựa chọn cửa và kính theo kiến trúc, kích thước ô chờ và công năng; giữ dữ kiện Eurowindow thành lập năm 2002.
- Trang giới thiệu: chỉnh câu chữ gọn và cụ thể hơn, giữ nguyên các dữ kiện sẵn có.
- Danh mục cửa: cập nhật mô tả theo vật liệu, vị trí lắp đặt, kiểu mở và nhu cầu sử dụng.
- Trang sản phẩm: rà soát nội dung 50 trang, giữ tên, mã và dữ kiện sẵn có; diễn đạt thông tin theo từng nhóm sản phẩm. Không thêm chứng nhận, tiêu chuẩn, xuất xứ hoặc hiệu suất khi chưa có hồ sơ.
- Trang hệ nhôm: diễn đạt lợi ích theo từng mẫu và điều kiện lắp đặt; nêu các yếu tố cần cân nhắc khi chọn cửa, kính và phụ kiện.
- Rà lại cách dùng từ trên website: bỏ cách gọi “cấu hình” trong nội dung hiển thị, thay bằng thông tin cụ thể về kiểu mở, mẫu cửa, vật liệu, kính, phụ kiện hoặc yêu cầu cần xác nhận. Chỉnh lời kêu gọi tư vấn và nhãn minh họa sản phẩm cho tự nhiên hơn.
- Trang công trình/tin tức: chỉnh phần giới thiệu danh mục cho rõ nội dung hơn.
- SEO metadata: cập nhật title và description cho trang chủ, giới thiệu, danh mục cửa, một số nhóm sản phẩm và hệ nhôm; rút gọn một số title bài viết dài. Không đổi URL hay cấu trúc dữ liệu.

## Kiểm tra

- `npm.cmd run build`: thành công; Next.js tạo 123 static routes.
- Metadata tĩnh: quét 119 trang `index.html`, gồm 50 trang chi tiết sản phẩm; không thiếu title hoặc description, không có title dài hơn 80 ký tự.
- JSON-LD: các khối được phát hiện đều parse thành công.
- Responsive/browser regression: 7 URL đại diện ở 390, 768 và 1440 px (21 lượt); tất cả trả HTTP 200, không phát hiện tràn ngang hoặc lỗi JavaScript.
- SEO heading: trang `/san-pham/cua-nhom/` đang có hai H1. Build và hiển thị không bị ảnh hưởng; cần cân nhắc chỉnh heading trong một đợt cấu trúc SEO riêng.

## Giới hạn

Nội dung kỹ thuật và dữ liệu công trình chỉ được giữ hoặc diễn đạt lại từ dữ liệu sẵn có. Báo cáo này không xác nhận độc lập nguồn gốc, chứng nhận, tiêu chuẩn, thông số thử nghiệm hay hiệu suất của sản phẩm.
