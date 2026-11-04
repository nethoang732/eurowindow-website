# SEO Phase 10 — theo dõi Search Console

## Kết nối Search Console

1. Xác nhận tài khoản có quyền Owner hoặc Full user với property `https://eurowindowmn.vn/` (Domain property được ưu tiên nếu DNS đã xác minh).
2. Mở **Indexing → Sitemaps**, gửi `https://eurowindowmn.vn/sitemap.xml`, sau đó kiểm tra trạng thái đọc sitemap và số URL được phát hiện.
3. Mở **Indexing → Pages** và so sánh URL indexed/not indexed với 124 URL của sitemap hiện tại. Xem lý do loại trừ, canonical do Google chọn và URL quan trọng bị crawl lỗi.
4. Trong **Performance → Search results**, chọn Web, quốc gia Việt Nam và cửa sổ 28 ngày; so sánh với 28 ngày trước. Lưu clicks, impressions, CTR và average position theo query/page/device.
5. Dùng **URL Inspection** cho trang chủ, danh mục sản phẩm, báo giá, liên hệ và trang chi tiết có giá trị chuyển đổi. Kiểm tra canonical khai báo, canonical Google chọn và thời điểm crawl.
6. Dùng PageSpeed Insights/CrUX riêng để theo dõi CWV. Search Console Page Experience và lab score không đại diện cho cùng một bộ dữ liệu.

Không có dữ liệu GSC trong phiên này. Không suy ra index, thứ hạng hoặc hiệu quả chuyển đổi từ sitemap hay build local.

## Nhịp theo dõi đề xuất

- Hàng tuần: sitemap processing, lỗi mới trong Pages, clicks/impressions/CTR theo trang và nhóm truy vấn.
- Hàng tháng: so sánh 28 ngày với kỳ trước và cùng kỳ năm trước; kiểm tra trang có impressions cao nhưng CTR thấp, trang quan trọng chưa index và truy vấn mới.
- Sau mỗi lần phát hành: xác minh robots/sitemap/canonical/HTTP cho nhóm URL đại diện và theo dõi coverage trong các ngày kế tiếp.
- CWV: xem CrUX/Search Console theo chu kỳ dữ liệu của Google; dùng Lighthouse lab để chẩn đoán, không gộp lab với field data.

## Mẫu báo cáo SEO hàng tuần

**Tuần bắt đầu:** YYYY-MM-DD
**Property:** `https://eurowindowmn.vn/`
**Khoảng dữ liệu:** 7 ngày gần nhất; so sánh 7 ngày trước

| Chỉ số | Kỳ này | Kỳ trước | Thay đổi | Nguồn / ghi chú |
|---|---:|---:|---:|---|
| URL sitemap được phát hiện |  |  |  | GSC Sitemaps |
| Trang indexed |  |  |  | GSC Pages |
| Impressions |  |  |  | GSC Performance |
| Clicks |  |  |  | GSC Performance |
| CTR |  |  |  | GSC Performance |
| Average position |  |  |  | GSC Performance; trung bình có thể bị ảnh hưởng bởi mix query |
| Lỗi crawl mới |  |  |  | GSC Pages / URL Inspection |
| CWV URL tốt / cần cải thiện / kém |  |  |  | GSC CWV / CrUX |

### Truy vấn và trang cần hành động

| Query / URL | Impressions | Clicks | CTR | Position | Quan sát | Việc tiếp theo | Chủ trì |
|---|---:|---:|---:|---:|---|---|---|
|  |  |  |  |  |  |  |  |

### Kiểm tra bắt buộc

- Trang impressions cao, CTR thấp: kiểm tra ý định truy vấn và độ khớp của title/snippet.
- Trang quan trọng chưa index: xác minh HTTP, robots/noindex, canonical, internal links và nội dung hữu ích.
- Query/trang có xu hướng tăng hoặc giảm: so theo thiết bị, quốc gia và loại tìm kiếm trước khi thay nội dung.
- Báo cáo ghi ngày xuất dữ liệu và bộ lọc; không gọi biến động ngắn hạn là kết quả do một thay đổi nếu chưa có bằng chứng.
