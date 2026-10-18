# Nháº­t kÃ½ chá»‰nh sá»­a website Eurowindow

File nÃ y ghi láº¡i cÃ¡c thay Ä‘á»•i giao diá»‡n vÃ  chá»©c nÄƒng Ä‘Æ°á»£c yÃªu cáº§u tá»« má»‘c báº¯t Ä‘áº§u theo dÃµi trá»Ÿ Ä‘i, Ä‘á»ƒ tiá»‡n tra cá»©u vÃ  tiáº¿p tá»¥c chá»‰nh sá»­a website.

## Má»‘c báº¯t Ä‘áº§u

- NgÃ y: 18/10/2026.
- Website local Ä‘Æ°á»£c má»Ÿ táº¡i `http://127.0.0.1:4173/`.
- Tráº¡ng thÃ¡i giao diá»‡n tham chiáº¿u: má»‘c commit `ff22920`.
- Viá»‡c má»Ÿ website á»Ÿ má»‘c nÃ y khÃ´ng lÃ m thay Ä‘á»•i giao diá»‡n hay chá»©c nÄƒng.

## CÃ¡c thay Ä‘á»•i Ä‘Æ°á»£c ghi nháº­n

### 18/10/2026 â€” Báº¯t Ä‘áº§u ghi nháº­t kÃ½

- Táº¡o file nháº­t kÃ½ nÃ y theo yÃªu cáº§u.
- ChÆ°a cÃ³ thay Ä‘á»•i giao diá»‡n hoáº·c chá»©c nÄƒng website trong má»¥c nÃ y.

### 18/10/2026 â€” Cáº­p nháº­t ná»™i dung vÃ  chuyá»ƒn Ä‘á»™ng trang sáº£n pháº©m

- YÃªu cáº§u: ghi láº¡i cÃ¡c cáº­p nháº­t hiá»‡n cÃ³ trong workspace vÃ  má»Ÿ láº¡i báº£n website má»›i nháº¥t.
- Trang hoáº·c khu vá»±c bá»‹ áº£nh hÆ°á»Ÿng: trang sáº£n pháº©m nhÃ´m vÃ  ná»™i dung chi tiáº¿t sáº£n pháº©m.
- Ná»™i dung thay Ä‘á»•i:
  - Bá» kháº³ng Ä‘á»‹nh cá»­a má»Ÿ quay trong â€œÄ‘áº¿n 180Â°â€ khá»i tiÃªu Ä‘á» sáº£n pháº©m.
  - Äiá»u chá»‰nh chuyá»ƒn Ä‘á»™ng danh sÃ¡ch sáº£n pháº©m: tÃ´n trá»ng cháº¿ Ä‘á»™ giáº£m chuyá»ƒn Ä‘á»™ng, bá» hiá»‡u á»©ng reveal trÃªn tháº» vÃ  giá»›i háº¡n vá»‹ trÃ­ kÃ©o Ä‘á»ƒ danh sÃ¡ch khÃ´ng trÆ°á»£t ra ngoÃ i.
  - Cá»¡ chá»¯ tiÃªu Ä‘á» trÃªn mÃ n hÃ¬nh nhá» co giÃ£n theo chiá»u rá»™ng thiáº¿t bá»‹.
  - Giá»¯ Ä‘á»‹a chá»‰ email tÆ° váº¥n tháº­t khi chuáº©n bá»‹ trang; tinh chá»‰nh cÃ¡ch viáº¿t má»™t sá»‘ nhÃ£n giao diá»‡n.
  - ThÃªm `.backups/` vÃ o `.gitignore`.
- Tá»‡p liÃªn quan: `.gitignore`, `public/data/product-child-content.json`, `scripts/prepare-site.cjs`, `scripts/product-pages.js`.
- Kiá»ƒm tra: má»Ÿ báº£n local táº¡i `http://127.0.0.1:4173/`; mÃ¡y chá»§ tráº£ vá» HTTP 200.
- Commit GitHub: chÆ°a cÃ³.

### 18/10/2026 â€” HoÃ n thiá»‡n website theo Ä‘áº·c táº£ SDD

- YÃªu cáº§u: Ä‘á»“ng bá»™ áº£nh sáº£n pháº©m, menu, catalogue, chuyá»ƒn Ä‘á»™ng trang vÃ  50 trang sáº£n pháº©m con.
- Trang hoáº·c khu vá»±c bá»‹ áº£nh hÆ°á»Ÿng: trang chá»§, menu Ä‘iá»u hÆ°á»›ng, catalogue, dáº£i sáº£n pháº©m ná»•i báº­t vÃ  trang chi tiáº¿t sáº£n pháº©m.
- Ná»™i dung thay Ä‘á»•i:
  - Sinh menu xá»• xuá»‘ng Giá»›i thiá»‡u vÃ  Sáº£n pháº©m cÃ¹ng cÃ¡c liÃªn káº¿t ná»™i bá»™ trong shell cá»§a website.
  - ThÃªm fallback áº£nh; dÃ¹ng áº£nh cá»¥c bá»™ Eurowindow phÃ¹ há»£p cho cÃ¡c tháº» Cá»­a nhÃ´m, uPVC vÃ  Cá»­a thÃ´ng minh, giá»¯ cÃ¡c nhÃ³m Cá»­a gá»—, Cá»­a cuá»‘n vÃ  KÃ­nh & VÃ¡ch kÃ­nh.
  - TÄƒng nhá»‹p tá»± trÆ°á»£t cá»§a dáº£i cá»­a ná»•i báº­t lÃªn 7 giÃ¢y; giá»¯ kÃ©o, táº¡m dá»«ng/tiáº¿p tá»¥c vÃ  há»— trá»£ cháº¿ Ä‘á»™ giáº£m chuyá»ƒn Ä‘á»™ng.
  - Táº£i bá»• sung 11 áº£nh cá»­a nhÃ´m/vÃ¡ch kÃ­nh Ä‘Ãºng chá»§ng loáº¡i, kiá»ƒu má»Ÿ, sá»‘ cÃ¡nh hoáº·c há»‡ vÃ¡ch; ghi nguá»“n trang sáº£n pháº©m trong `public/images/eurowindow-products/SOURCES.md`.
  - Giá»¯ PDF catalogue local, trang xem trÆ°á»›c/táº£i vÃ  Ä‘áº·t MIME `application/pdf` cho mÃ¡y chá»§ preview.
  - Chuáº©n hÃ³a 50 trang con: má»—i trang cÃ³ lá»i giá»›i thiá»‡u riÃªng, 1â€“3 áº£nh local tá»« thÆ° viá»‡n hiá»‡n cÃ³; giá»¯ popup vÃ  Ä‘iá»u khiá»ƒn áº£nh trÆ°á»›c/sau.
- Tá»‡p liÃªn quan: `scripts/prepare-site.cjs`, `scripts/product-pages.js`, `scripts/aluminum-page.js`, `preview-server.cjs`, dá»¯ liá»‡u JSON sáº£n pháº©m, thÆ° má»¥c áº£nh Eurowindow vÃ  `docs/specs/website-refresh-2026-10/`.
- Kiá»ƒm tra: `npm run build` thÃ nh cÃ´ng; 54 route (trang chá»§, catalogue, danh má»¥c, PDF vÃ  50 trang con) tráº£ HTTP 200; PDF tráº£ `application/pdf`; gallery khÃ´ng cÃ³ URL áº£nh ngoÃ i hoáº·c tá»‡p local thiáº¿u.
- Commit GitHub: chÆ°a cÃ³.

## Máº«u ghi cho cÃ¡c láº§n chá»‰nh sá»­a tiáº¿p theo

### YYYY-MM-DD â€” TÃªn ngáº¯n cá»§a thay Ä‘á»•i

- YÃªu cáº§u:
- Trang hoáº·c khu vá»±c bá»‹ áº£nh hÆ°á»Ÿng:
- Ná»™i dung thay Ä‘á»•i:
- Tá»‡p liÃªn quan:
- Kiá»ƒm tra:
- Commit GitHub (náº¿u cÃ³):


### 18/10/2026 â€” XÃ³a trang sáº£n pháº©m con

- YÃªu cáº§u: XÃ³a toÃ n bá»™ trang sáº£n pháº©m con.
- Ná»™i dung thay Ä‘á»•i: Gá»¡ 50 route khá»i static build vÃ  dá»¯ liá»‡u route/SEO; bá» liÃªn káº¿t chi tiáº¿t trÃªn cÃ¡c tháº» máº«u; giá»¯ cÃ¡c trang danh má»¥c sáº£n pháº©m. URL Ä‘Ã£ xÃ³a tráº£ vá» 404 trong preview.
- Tá»‡p liÃªn quan: `app/[[...slug]]/page.js`, `scripts/prepare-site.cjs`, `scripts/product-catalogs.js`, `scripts/aluminum-page.js`, `preview-server.cjs`.
- Kiá»ƒm tra: Build táº¡o 39 trang thay vÃ¬ 89; trang danh má»¥c tráº£ 200, URL sáº£n pháº©m con thá»­ tráº£ 404; mÃ£ dá»±ng trang khÃ´ng cÃ²n route/link `chi-tiet`.

### 18/10/2026 â€” Thiáº¿t káº¿ láº¡i cá»¥m thÃ´ng tin sáº£n pháº©m

- YÃªu cáº§u: LÃ m gá»n vÃ  nÃ¢ng cáº¥p bá»‘ cá»¥c thÃ´ng tin trÃªn táº¥t cáº£ trang sáº£n pháº©m.
- Ná»™i dung thay Ä‘á»•i: ThÃªm stylesheet dÃ¹ng chung vá»›i bá»‘ cá»¥c áº£nh/ná»™i dung cÃ¢n Ä‘á»‘i, tháº» thÃ´ng tin gá»n, khung áº£nh á»•n Ä‘á»‹nh vÃ  cÃ¡ch xáº¿p responsive; giá»¯ nguyÃªn thao tÃ¡c gallery, bá»™ lá»c vÃ  liÃªn káº¿t tÆ° váº¥n.
- Tá»‡p liÃªn quan: `app/layout.js`, `public/site-product-pages.css`, tÃ i liá»‡u SDD.
- Kiá»ƒm tra: Build táº¡o 39 trang; sÃ¡u trang danh má»¥c vÃ  stylesheet Ä‘á»u tráº£ HTTP 200.

### 2026-10-18 ? Compact spacing between product information groups

- Clarification: Reduce vertical gaps between the information, pricing, and FAQ groups while preserving gallery dimensions.
- Changes: Tightened section padding and spacing between headings, cards, pricing, and FAQ. Restored the product guide gallery to its previous height.
- Files: public/site-product-pages.css, app/layout.js.

### 2026-10-18 ? Reduce gaps between product content sections

- Tightened the vertical padding around Product Information, Pricing Consultation, and FAQ sections across product pages. Gallery dimensions and internal content spacing remain intact.
- Updated the product stylesheet cache version.

### 2026-10-18 ? Layered product gallery

- Replaced the product information image grid with a depth carousel using relevant product images from each category.
- Added autoplay, looping, previous/next controls, pagination, click selection, and pointer swipe; autoplay pauses on hover/focus and respects reduced-motion settings.
- Implemented with the existing vanilla JavaScript site shell; no external sample imagery or dependency added.

### 2026-10-18 ? Fix depth carousel column placement

- Fixed the product information carousel overflowing its gallery column and overlapping product copy.
- Explicitly assigned gallery and copy to separate grid columns on desktop and stacked them on smaller screens.
- Rebuilt the 39 static routes.

### 2026-10-18 — Gộp tư vấn chi phí và giải đáp sản phẩm

- Gộp khối báo giá và danh sách câu hỏi thường gặp thành một cụm hai cột, giữ nguyên nội dung FAQ và liên kết yêu cầu báo giá. Trên màn hình nhỏ, hai phần xếp dọc.
- Áp dụng qua bộ dựng dùng chung cho các trang danh mục sản phẩm; dùng nền xanh xám nhạt, thẻ trắng, điểm nhấn vàng champagne và bóng đổ nhẹ.
- Tệp: `scripts/prepare-site.cjs`, `public/site-product-pages.css`, `app/layout.js`.
- Kiểm tra: `node --check public/site-script.js`; trang cửa nhôm, JS và CSS đều trả HTTP 200.

### 2026-10-18 — Đồng bộ ảnh sản phẩm và sửa dải thẻ chồng hàng

- Dùng cùng ảnh đại diện theo nhóm cửa trên thẻ danh mục trang chủ, trang sản phẩm và dải sản phẩm nổi bật; kiểm tra đủ sáu ảnh trong bản xuất.
- Sửa dải sản phẩm nổi bật về một hàng trượt ngang. Trước đó stylesheet không có quy tắc marquee đang hoạt động nên thẻ bị dàn thành nhiều hàng; bỏ nhóm thẻ lặp tĩnh vì JS đã tự tạo bản sao để chạy vòng lặp.
- Chừa khoảng an toàn cho nút mũi tên ở thẻ danh mục để không đè lên nội dung.
- Tệp: `scripts/prepare-site.cjs`, `scripts/product-pages.js`, `public/site-product-pages.css`, `app/layout.js`.
- Kiểm tra: cú pháp JS hợp lệ; trang chủ, JS và CSS trả HTTP 200; sáu ảnh đại diện có trong bản xuất.

### 2026-10-18 — Bổ sung điều khiển qua lại cho dải sản phẩm nổi bật

- Thêm nút chuyển nhóm cửa trước/sau, mỗi lần đi một thẻ; giữ nút tạm dừng/tự chạy và thao tác kéo.
- Tăng vùng bấm, bổ sung trạng thái focus để có thể thao tác bằng chuột và bàn phím.
- Tệp: `scripts/prepare-site.cjs`, `public/site-product-pages.css`, `app/layout.js`.
- Kiểm tra: cú pháp JS hợp lệ; preview và các asset mới trả HTTP 200, có đủ nút trước/sau.

### 2026-10-18 — Rà soát hiển thị toàn site và kéo-thả dải sản phẩm

- Tắt native drag trên ảnh/liên kết trong dải cửa, bắt pointer an toàn cho chuột/cảm ứng, kéo theo RAF và snap mượt vào thẻ gần nhất; dừng autoplay khi rê vào dải và cho chạy lại khi rời.
- Đồng bộ chiều tự chạy với nút chuyển tiếp; giữ drag ngang mà không chặn cuộn dọc trên màn hình cảm ứng.
- Rà 37 đường dẫn xuất, không có trang lỗi; rà 50 đường dẫn ảnh nội bộ trong mã, không có tệp thiếu; CSS qua parser và JS qua kiểm tra cú pháp.
- Tệp: `scripts/prepare-site.cjs`, `public/site-product-pages.css`, `app/layout.js`.
