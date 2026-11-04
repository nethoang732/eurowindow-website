# PERFORMANCE PHASE 12.1 ? Mobile LCP & Staging Validation

Ng?y: 04/11/2026
Candidate: `codex/phase12-performance` t?i `C:/Users/Administrator/AppData/Local/Temp/p12`
Base ?? fetch: `origin/main` = `55077ea5c02d1f7ad98263bf352d4a67d1193af9`
SEO Phase 12.1 commit SHA: reported in the release handoff; this report is included in that commit.
Parent candidate: `7c5fbc1f6d17aafa6113bb71975636417c2863cd` (`feat(seo): prepare Phase 10 website optimization`), l? m?t commit n?m tr?n `origin/main`.
M?i tr??ng ?o: production build local, Next.js 14.2.35, Lighthouse 13.6.0, Chrome 156.0.8078.80.

## T?m t?t

Candidate gi? nh?n di?n Hero, ?? n?i dung quan tr?ng hi?n th? ngay m? kh?ng ch? IntersectionObserver, d?ng animation ng?n ch? b? sung chuy?n ??ng, v? t?t animation theo `prefers-reduced-motion`. Sau khi responsive `srcset` ???c ?p d?ng cho c? danh m?c v? marquee s?n ph?m, c?ng ?nh n?n mobile theo `image-set`, Lighthouse local median Mobile LCP gi?m t? 7.216 s xu?ng 4.914 s; t?ng transfer gi?m 573,016 B. Raw trace LCP gi?m t? 321 ms xu?ng 245 ms.

??y l? k?t qu? local simulated Lighthouse, kh?ng ph?i PSI field measurement. Mobile LCP v?n c?n cao v? ch?a ???c ?o tr?n Preview/Production. Khuy?n ngh? ??a candidate l?n Vercel Preview sau khi k?t n?i project v? x?c minh Preview env; ch?a khuy?n ngh? ph?t h?nh Production ch? d?a v?o local.

## Ph?n t?ch LCP ?? x?c minh

LCP element trong c? baseline v? candidate l? `main#main > section.hero > div.hero-content > img.hero-brand-logo` (`eurowindow-wordmark`), ???c t?m th?y trong HTML, eager-loaded v? `fetchpriority="high"`. Logo kh?ng b? lazy-load. ?nh n?n hero l? ?nh trang tr? c? `fetchpriority="low"`; kh?ng c?n tranh ?u ti?n cao ngang logo.

Hai lo?i s? li?u Lighthouse c?n ???c ??c ri?ng:

- **LCP metric** d?ng m? ph?ng network/CPU: Mobile 7.216 s ? 4.914 s; Desktop 1.358 s ? 0.879 s.
- **Trace/browser LCP** t? local browser: Mobile 321 ms ? 245 ms; Desktop 297 ms ? 217 ms. Local trace n?y kh?ng ??i di?n cho Production network.
- Lighthouse `metrics.details.timeToFirstByte` m? ph?ng v?n kho?ng 455 ms Mobile v? 124?125 ms Desktop. LCP breakdown trong trace cho th?y TTFB local kho?ng 9?12 ms v? Next production server ?? warm tr?n c?ng m?y. Kh?ng d?ng hai TTFB n?y thay th? cho nhau.

Median breakdown t? Lighthouse trace (ms):

| Thi?t b? | TTFB trace | Resource load delay | Resource load duration | Element render delay |
|---|---:|---:|---:|---:|
| Mobile tr??c | 12.2 | 11.4 | 22.7 | 278.6 |
| Mobile sau | 9.9 | 45.5 | 13.7 | 174.3 |
| Desktop tr??c | 11.8 | 7.6 | 23.2 | 255.0 |
| Desktop sau | 9.4 | 8.9 | 11.3 | 164.2 |

Lighthouse simulated LCP kh?ng b?ng t?ng c?c subpart t? browser trace. V? v?y ? c?c l??t tr??c, thay ??i element render delay kh?ng t?o ra m?c thay ??i t??ng ?ng cho simulated LCP. Batch 5 l??t cu?i cho th?y c? render delay v? resource duration gi?m; mobile load delay t?ng nh?, c?n TTFB m? ph?ng g?n nh? gi? nguy?n. Trace cu?i c? 5 l??t v? ???c l?u ? `%TEMP%\p12-compare-121-final2`.

Server production local kh?i ??ng ?n ??nh (Next b?o Ready sau kho?ng 443 ms); Lighthouse ch?y tr?n server ?? warm, v?i m?t l??t warm-up cho m?i preset. Kh?ng c? b?ng ch?ng cold start c?a server local l?m ch?m trace. K?t qu? n?y kh?ng lo?i tr? TTFB/cold start kh?c tr?n Production.

### CSS, fonts v? t?i t?i nguy?n

- Lighthouse audit v?n ??c t?nh render-blocking savings kho?ng 340 ms Mobile / 70 ms Desktop. CSS quan tr?ng ch?a b? t?ch ho?c tr? ho?n th?m v? c?c stylesheet n?y d?ng chung nhi?u trang; tr? ho?n kh?ng ki?m so?t c? th? l?m nh?y layout/menu ho?c l?m h?ng trang con.
- CSS Mobile Hero, logo v? n?i dung kh?ng c? `opacity:0` ph? thu?c hydration/observer. `scripts/prepare-site.cjs` b? `.hero` kh?i reveal observer; c?c section b?n d??i v?n gi? reveal.
- Montserrat v? Be Vietnam Pro ch?y qua `next/font` v?i `display: swap`, kh?ng c? request Google Fonts runtime. Lighthouse v?n ghi nh?n 15 file font (~220,309 B) tr?n homepage; ch?a gi?m subset/weight ?? tr?nh sai d?u ti?ng Vi?t ho?c ??i typography.
- Audit image delivery cu?i c?n ??c t?nh 262 KiB Mobile v? 911 KiB Desktop; ?? l? potential savings, kh?ng ph?i transfer ?? ?o.

## Tr??c / sau ? 5 l??t m?i c?u h?nh

C?ng Chrome 156.0.8078.80, Lighthouse 13.6.0, production server warm, m?t warm-up m?i preset, storage reset theo m?c ??nh Lighthouse (`disableStorageReset=false`). Mobile: 412?823, DPR 1.75, simulated RTT 150 ms, download 1474.56 Kbps, CPU slowdown ?4. Desktop: 1350?940, DPR 1, preset Desktop. M?i ? l? median c?a 5 l??t.

| Thi?t b? / th?i ?i?m | Performance | LCP | FCP | Speed Index | TBT | CLS | TTFB m? ph?ng | T?ng transfer |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Mobile ? tr??c | 72 | 7.216 s | 1.360 s | 2.279 s | 264 ms | 0.001 | 455 ms | 1,894,038 B |
| Mobile ? sau | 80 | 4.914 s | 1.360 s | 1.797 s | 157 ms | 0 | 455 ms | 1,321,022 B |
| Desktop ? tr??c | 96 | 1.358 s | 0.330 s | 0.691 s | 13 ms | 0.001 | 125 ms | 2,560,263 B |
| Desktop ? sau | 99 | 0.879 s | 0.330 s | 0.521 s | 14 ms | 0.001 | 125 ms | 2,241,366 B |

Mobile LCP local gi?m 2.301 s (31.9%), transfer gi?m 573,016 B (30.3%); Desktop LCP gi?m 0.479 s (35.3%), transfer gi?m 318,897 B (12.5%). FCP g?n nh? kh?ng ??i; Desktop TBT t?ng 1 ms, kh?ng ??ng k?. Payload ch? ?o trang ch? theo c?u h?nh Lighthouse, kh?ng ph?i t?ng dung l??ng to?n site.

T?ch ri?ng hi?u qu? batch ?nh n?n Mobile: so v?i batch 5 l??t ngay tr??c khi th?m `image-set`, transfer Mobile gi?m th?m 115,761 B; screenshot/Playwright x?c nh?n DPR 1.75 ch?n ?nh 1200 px. C?c bi?n th? 640/960/1200 px ch? ?p d?ng breakpoint mobile; desktop ti?p t?c d?ng ?nh g?c. ?nh g?c 1400 px kho?ng 325 KiB; bi?n th? 1200 px kho?ng 209 KiB, 960 px kho?ng 154 KiB, 640 px kho?ng 80 KiB. Kh?ng thay t? l? ho?c ch?nh m?u ?nh.

## Thay ??i trong candidate

- `app/layout.js` ? t? host Montserrat/Be Vietnam Pro b?ng `next/font`; kh?i ph?c listener k?ch ho?t stylesheet c? `data-deferred-stylesheet`; gi? `display: swap`.
- `dist/index.html` ? d?ng CSS variables c?a `next/font`, responsive logo/header/footer, hero background v? wordmark; s?a `sizes` footer theo k?ch th??c hi?n th?.
- `scripts/prepare-site.cjs` ? hero kh?ng ??i IntersectionObserver; responsive ?nh cho category cards v? system marquee.
- `public/home-hero.css` ? entrance animation ng?n cho logo/H1/copy/actions; gi?m-motion t?t animation.
- `public/home-videos.css`, `public/home-contact.css` ? image-set Mobile ri?ng, gi? gradient/layering hi?n h?nh.
- `public/eurowindow-logo-400.webp`, `public/eurowindow-wordmark-720.webp`.
- `public/images/door-reference/nhom-Cua-nhom-mo-quay-2-canh.optimized-720.webp`.
- `public/images/eurowindow-products/cua-cuon-nhom-khe-thoang-easd45-eurowindow-home.webp`.
- `public/images/eurowindow-products/cua-di-tu-dong-mo-truot-2-hoac-4-canh-eurowindow-720.webp`.
- `public/images/eurowindow-products/cua-di-upvc-2-canh-mo-truot-eurowindow-720.webp`.
- `public/images/sections/nha-pho-hien-dai-minh-hoa.mobile-640.webp`, `.mobile-960.webp`, `.mobile-1200.webp`.

Kh?ng thay API bi?u m?u, Supabase ho?c Apps Script. C?c file video Git LFS kh?ng n?m trong thay ??i. `git lfs ls-files` ch? li?t k? hai video hi?n c?. Build sinh t?m hai file PDF.js; ?? kh?i ph?c byte-for-byte t? worktree base v? lo?i kh?i diff.

## Ki?m th?

- `npm.cmd run build`: ??t hai l?n; 130 static pages ???c t?o, Next compile v? b??c lint/type validity ho?n t?t. Repo kh?ng khai b?o script ri?ng `lint` ho?c `typecheck`.
- Lighthouse: 5 Mobile + 5 Desktop tr??c, 5 Mobile + 5 Desktop sau; trace v? DevTools log ?? l?u t?i `%TEMP%\p12-compare-before` v? `%TEMP%\p12-compare-121-final2`. Kh?ng l?u trace trong repository.
- Playwright tr?n production build: Mobile 412?823 DPR 1.75, tablet 768?1024, Desktop 1365?900; kh?ng overflow, kh?ng page error, font loaded, logo opacity 1 v? animation name `hero-brand-arrive`. Mobile menu m? ???c; carousel button ho?t ??ng. `/bao-gia/` v? `/lien-he/` ??u gi? form, tr? 200 v? kh?ng overflow. `prefers-reduced-motion` tr? animation `none`. Mobile ch?n ??ng `nha-pho...mobile-1200.webp`.
- Screenshot cu?i ? `%TEMP%\p12-phase12.1-final-mobile.png` v? `%TEMP%\p12-phase12.1-final-desktop.png`; giao di?n Hero gi? logo, font, b? c?c, m?u v? hi?u ?ng hi?n h?nh.
- Crawl sitemap local: 124 URL; t?t c? 124 tr? 200, canonical ch?nh x?c tr?ng URL sitemap, title/description c? m?t, ??ng m?t H1, JSON-LD parse ???c, kh?ng URL sitemap n?o `noindex`. `robots.txt` v? `sitemap.xml` tr? 200; sitemap v?n c? 124 URL, robots tr? `https://eurowindowmn.vn/sitemap.xml`.
- `node scripts/test-contact-api.cjs`: ??t v?i mock (validation, CORS, size limit, rate limit, persistence/idempotency, email/database error paths). Kh?ng t?o lead th?t. Form API kh?ng b? s?a.
- `git diff --check`: ??t tr?n candidate. Route ki?m tra 404 tr? 404, `noindex`, kh?ng c? canonical; `sitemap.xml`/`robots.txt` v?n tr? 200.
- Secret scan pattern tr?n to?n b? thay ??i v?n b?n ?? ch?n (token GitHub/AWS/Stripe, private key, JWT): kh?ng c? k?t qu?.

## Git / Preview

Fetch `origin main` th?nh c?ng; HEAD remote m?i nh?t t?i th?i ?i?m fetch l? `55077ea5c02d1f7ad98263bf352d4a67d1193af9`. Candidate HEAD l? `7c5fbc1...`, l? m?t commit Phase 10 n?m tr?n `origin/main`; c?c thay ??i bi?u m?u ?? c? trong commit `55077ea` v? c?c commit t? ti?n. Phase 12.1 thay ??i ?? ???c commit trong SHA n?u ? ??u b?o c?o.

Kh?ng t?m th?y `.vercel/project.json`. `vercel whoami` kh?ng tr? k?t qu? trong gi?i h?n ch?y v? ch?a x?c minh ???c t?i kho?n/project/Preview environment. Do ?? kh?ng push nh?nh v? kh?ng t?o Preview deployment; Production kh?ng b? ch?m. C?n li?n k?t ??ng Vercel project v? x?c minh Preview env kh?ng ch?a Production secrets tr??c khi ch?y Preview. Kh?ng g?i lead t? Preview.

`PERFORMANCE_PHASE12_REPORT.md` l? file untracked c? s?n t? Phase 12, kh?ng ???c g?p v?o commit Phase 12.1. Git LFS ch?a hai video c? s?n; kh?ng ??a v?o commit. L?nh LFS status c? l?i quy?n c?p nh?t index trong shared metadata, nh?ng `lfs ls-files` ??c ???c v? kh?ng c? LFS asset n?o trong ph?m vi thay ??i.

## Khuy?n ngh? ph?t h?nh

Local evidence cho th?y Mobile LCP v? payload c?i thi?n r?, nh?ng simulated LCP v?n 4.914 s v? image audit c?n kho?ng 262 KiB. Production baseline PSI 8.6 s kh?ng c?ng m?i tr??ng v?i local. C?n ho?n t?t commit, ??a candidate l?n Preview sau khi c? li?n k?t Vercel, ?o Preview n?m l??t c?ng c?u h?nh v?i Production/PSI n?u c? th?, x?c nh?n giao di?n v? form routing; ch? c?n nh?c Production sau khi field/Preview LCP x?c nh?n kh?ng h?i quy. Kh?ng merge ho?c deploy Production trong Phase 12.1.
