# Káº¿ hoáº¡ch triá»ƒn khai: HoÃ n thiá»‡n website Eurowindow

## Äiá»u chá»‰nh 2026-10-18

Loáº¡i bá» 50 trang sáº£n pháº©m con khá»i static params, dá»¯ liá»‡u route vÃ  mÃ£ dá»±ng trang; chuyá»ƒn tháº» máº«u cá»­a thÃ nh ná»™i dung tÄ©nh trong trang danh má»¥c; tráº£ 404 cho URL cÅ©. Giá»¯ nguyÃªn cÃ¡c trang danh má»¥c sáº£n pháº©m.

PhÃ¡t hÃ nh stylesheet thÃ´ng tin sáº£n pháº©m dÃ¹ng chung, kiá»ƒm tra build vÃ  mÃ£ pháº£n há»“i cá»§a sÃ¡u trang danh má»¥c chÃ­nh cÃ¹ng stylesheet.

## CÃ¡c bÆ°á»›c

1. Sinh shell Ä‘iá»u hÆ°á»›ng trong `prepare-site.cjs`, thÃªm dropdown Giá»›i thiá»‡u/Sáº£n pháº©m vá»›i liÃªn káº¿t ná»™i bá»™ vÃ  tráº¡ng thÃ¡i Ä‘Ã³ng má»Ÿ truy cáº­p Ä‘Æ°á»£c.
2. Chuáº©n hÃ³a danh sÃ¡ch áº£nh sáº£n pháº©m con: chá»‰ Ä‘Æ°á»ng dáº«n cá»¥c bá»™ cÃ³ tháº­t, tá»‘i Ä‘a ba áº£nh, loáº¡i URL ngoÃ i vÃ  áº£nh bá»• trá»£ khÃ´ng cÃ³ tá»‡p tÆ°Æ¡ng á»©ng.
3. Äiá»u chá»‰nh HTML/CSS trang con Ä‘á»ƒ pháº§n giá»›i thiá»‡u Ä‘á»©ng trÆ°á»›c gallery lÆ°á»›i 1â€“3 áº£nh, Ä‘á»“ng thá»i giá»¯ popup, nÃºt trÆ°á»›c/sau vÃ  ná»™i dung theo tá»«ng sáº£n pháº©m.
4. ThÃªm xá»­ lÃ½ lá»—i áº£nh cho tháº» trang chá»§ vÃ  tháº» sáº£n pháº©m; giá»¯ nguyÃªn cÃ¡c áº£nh ngoÃ i pháº¡m vi yÃªu cáº§u.
5. Äiá»u chá»‰nh nhá»‹p dáº£i tháº» vÃ  cÃ¡ch xá»­ lÃ½ reduced-motion; giá»¯ kÃ©o, snap, tá»± cháº¡y vÃ  táº¡m dá»«ng.
6. XÃ¡c nháº­n catalogue PDF vÃ  nhÃ¡nh táº£i/xem trÆ°á»›c váº«n trá» tá»›i tá»‡p cá»¥c bá»™.
7. Cháº¡y bÆ°á»›c chuáº©n bá»‹, kiá»ƒm tra táº­p 50 route/áº£nh local/href ngoÃ i, build website vÃ  smoke-check HTTP 200 cho trang chá»§, catalogue, trang sáº£n pháº©m vÃ  má»™t trang chi tiáº¿t.
8. Ghi káº¿t quáº£ triá»ƒn khai vÃ o `NHAT-KY-CHINH-SUA.md`.

## NgoÃ i pháº¡m vi

- KhÃ´ng táº£i áº£nh má»›i hoáº·c táº¡o áº£nh má»›i khi thÆ° viá»‡n hiá»‡n táº¡i khÃ´ng cÃ³ áº£nh tÆ°Æ¡ng á»©ng.
- KhÃ´ng Ä‘á»•i danh má»¥c, tÃªn hay thá»© tá»± cÃ¡c nhÃ³m tháº» Ä‘Ã£ Ä‘Æ°á»£c yÃªu cáº§u giá»¯.
- KhÃ´ng triá»ƒn khai thay Ä‘á»•i lÃªn hosting; chá»‰ cáº­p nháº­t checkout local.

## Compact spacing between product information groups ? 2026-10-18

- [x] Reduce section spacing between product information, pricing, and FAQ.
- [x] Preserve gallery dimensions, responsive behavior, and existing interactions.
- [x] Build completed; all 11 product category routes return HTTP 200.
