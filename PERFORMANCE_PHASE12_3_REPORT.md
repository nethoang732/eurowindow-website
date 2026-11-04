# PERFORMANCE PHASE 12.3 — RELEASE READINESS REPORT

Date: 2026-11-04
Repository: `nethoang732/eurowindow-website`
Candidate worktree: `C:/Users/Administrator/AppData/Local/Temp/p12`
Branch: `codex/phase12-performance`
Candidate base: `55077ea5c02d1f7ad98263bf352d4a67d1193af9` (GitHub API confirmed `main`; local merge-base agrees)
Candidate source commit before Phase 12.3 edits: `32cd08308bb635b72b90d3db9c02cc6ce00d7db7`
Preview last known from Phase 12.2: `https://eurowindow-website-eu73nvf0n-eurowindow.vercel.app`, deployment `dpl_8KLpbLy5XpUGFCsAcGZ3w9nbTdvS` (Ready at that time; not revalidated in this phase).
Phase 12.3 code commit: `602335b4e4f88bfb229c39634b7f3ef7d59e8c62`.

## Decision

**NEEDS MORE OPTIMIZATION**

The local candidate builds and passes the route, UI, API mock, and SEO checks below. Its five-run simulated Mobile LCP median is 4.13 s and Mobile Performance median is 86, above the 2.5 s LCP goal and below the 90 Performance goal. Production and Preview measurements could not be collected from this environment, so this report does not claim Production readiness.

## Root cause and measurements

The LCP element remains `main#main > section.hero > div.hero-content > img.hero-brand-logo`. It is in the initial HTML, uses `loading="eager"` and `fetchpriority="high"`, and Lighthouse identifies it in all final runs. It does not wait for hydration or IntersectionObserver. A representative local trace recorded observed LCP at 449 ms and a breakdown of 13 ms TTFB, 24 ms resource delay, 18 ms image load, and 394 ms element render delay. Across the five local runs, observed LCP median was 238 ms and the LCP breakdown render-delay median was about 176 ms. The hero logo animation was shortened from 420 ms to 240 ms while retaining its transform effect; `prefers-reduced-motion` still disables it. The trace and aggregate metrics show that the simulated Lighthouse LCP is substantially higher than observed local LCP; these are different measures and must not be conflated.

The simulated LCP and score varied materially between runs. The table below is the sequential local production-build batch after the final changes. Lighthouse used Chrome 156.0.8078.80 and Lighthouse 13.6.0. Mobile used Lighthouse's default simulated mobile network/CPU, viewport 412×823, DPR 1.75; Desktop used the default desktop preset, viewport 1350×940, DPR 1. Runs were sequential with Lighthouse storage/cache reset per run. Traces were saved for run 1 per device. This is local lab data, not PSI/CrUX Production data.

### Mobile — local production build

| Run | Perf | LCP sim (ms) | FCP (ms) | SI (ms) | TBT (ms) | CLS | TTFB audit (ms) | Payload (B) | Observed LCP (ms) |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 77 | 5534 | 1851 | 2584 | 137 | 0.00018 | 10 | 1,245,543 | 449 |
| 2 | 90 | 3562 | 1362 | 2577 | 84 | 0.00017 | 8 | 1,245,543 | 212 |
| 3 | 83 | 4509 | 1361 | 2643 | 79 | 0.00017 | 9 | 1,245,543 | 238 |
| 4 | 89 | 3783 | 1360 | 2228 | 1 | 0.00018 | 7 | 1,245,543 | 210 |
| 5 | 86 | 4134 | 1361 | 2593 | 78 | 0.00017 | 8 | 1,245,543 | 245 |
| **Median** | **86** | **4134** | **1361** | **2584** | **79** | **0.00017** | **8** | **1,245,543** | **238** |

### Desktop — local production build

| Run | Perf | LCP sim (ms) | FCP (ms) | SI (ms) | TBT (ms) | CLS | TTFB audit (ms) | Payload (B) | Observed LCP (ms) |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 99 | 903 | 342 | 719 | 0 | 0.00103 | 10 | 2,010,273 | 212 |
| 2 | 99 | 826 | 332 | 728 | 0 | 0.00101 | 9 | 2,025,975 | 236 |
| 3 | 99 | 977 | 332 | 812 | 0 | 0.00103 | 8 | 2,025,975 | 231 |
| 4 | 99 | 920 | 331 | 691 | 0 | 0.00081 | 7 | 2,025,975 | 196 |
| 5 | 100 | 781 | 331 | 710 | 0 | 0.00081 | 8 | 2,025,975 | 246 |
| **Median** | **99** | **903** | **332** | **719** | **0** | **0.00101** | **8** | **2,025,975** | **231** |

### Compared with earlier local batch

The earlier five-run local batch (same Chrome/Lighthouse harness, before adding 600 px carousel assets and correcting their `sizes`) had Mobile payload median 1,298,130 B. The final batch is 1,245,543 B, a local measured reduction of 52,587 B (about 4.0%). The 600 px candidates are selected for 336 CSS px carousel images at DPR 1.75. This comparison is limited to those two local candidate states; it is not a Production or Preview comparison.

The final Mobile image-delivery audit still estimates about 239 KiB of potential savings, concentrated in the 765 px office image, the 1200 px hero background, and a 1200 px project image. The hero photo fills a tall mobile viewport, so reducing its physical resolution further risks visible softness. CSS audits estimate roughly 296 ms render-blocking savings, and one representative trace found six long tasks; broad stylesheet/JS deferral was not applied because those assets also style and power subpages and interactions.

## Production and Preview verification

Direct requests from this environment to Production and the Vercel Preview failed in Windows Schannel with `SEC_E_NO_CREDENTIALS`; the web access tool also reported both hosts inaccessible. The authenticated Vercel CLI created a new Preview deployment and reported it `READY`, but its protected `vercel curl` request failed with the same Schannel error. Therefore Production HTTP status, metadata, and Lighthouse data remain unverified; Preview deployment readiness is verified, but its HTTP content, metadata, screenshots, and Lighthouse data are not. No Production change was made. Do not interpret unavailable remote checks as PASS.

The previous Preview was verified in Phase 12.2 to use SSO protection and `noindex`/`Disallow: /`. This phase created deployment `dpl_3ZWwofexz5xexLhZKPveNVautnHb` at `https://eurowindow-website-co4dp5vdp-eurowindow.vercel.app`; Vercel reported `READY` with `vercel_authentication` protection. Its remote build completed successfully. The authenticated Vercel CLI confirmed zero Preview custom environment variables, so contact-submission flags and database credential names are absent. No form POST was sent. The CLI's protected content request could not pass Windows Schannel; Preview robots, sitemap, metadata, UI, and Lighthouse could not be rechecked. No protection-bypass secret was used.

Production PSI baseline supplied by the user (not re-fetched): Desktop Performance 91 / LCP 1.4 s; Mobile Performance 71 / LCP 8.6 s. These are not directly comparable to the local lab data above.

## Changes in candidate

- `dist/index.html`: responsive candidates for the hero background, office image, intro wordmark, and header logo; LCP image remains eager/high priority.
- `scripts/prepare-site.cjs`: accurate carousel image `sizes` and 480/600 px candidates for aluminum, uPVC, and wood cards.
- `public/home-hero.css`: preserve the logo arrival transform but shorten the LCP logo animation from 0.42 s to 0.24 s; reduced-motion behavior remains.
- Ten new WebP size variants under `public/` for building, logo, wordmark, hero, and three product cards (480/600 px where appropriate). Originals and larger variants remain available.

No sitemap, robots, canonical, title, description, H1, JSON-LD, form handler, database, or domain configuration was changed.

## QA results

- `npm.cmd run build`: PASS; 130 static routes generated; compile and build-time lint/type validity stage passed.
- Explicit `npx.cmd next lint`: not runnable unattended because this repository has no ESLint configuration and Next opened its interactive setup wizard. No config was generated. TypeScript compiler is not installed as a project dependency; Next production build completed successfully.
- Playwright desktop (1365×900), tablet (768×1024), and mobile (412×823, DPR 1.75): homepage 200; no horizontal overflow or JS/network errors; hero logo opacity 1; mobile menu and carousel controls respond; reduced-motion makes hero animation duration 0 s.
- Representative routes `/san-pham/cua-nhom/`, `/cong-trinh-tieu-bieu/`, `/tin-tuc/`, `/catalogue/`, `/bao-gia/`, `/lien-he/`: all 200 at all three viewports; no horizontal overflow. Quote/contact forms remain present; no browser form submission performed.
- `node scripts/test-contact-api.cjs`: PASS using local mock services only; no real lead or external service was contacted.
- Local production-build crawl: sitemap has exactly 124 URLs; all 124 returned 200 with title, description, one H1, canonical on `https://eurowindowmn.vn`, and valid JSON-LD (193 JSON-LD blocks parsed, zero invalid).
- Local `/robots.txt`: 200, allows crawling, points to `https://eurowindowmn.vn/sitemap.xml`; `/sitemap.xml`: 200 and 124 URLs; unknown route: 404 with `noindex`.
- New responsive image assets: all returned 200; candidate-selected images confirmed in mobile browser.
- `git diff --check` on selected source files: PASS. Secret-pattern scan on changed text sources: zero matches.
- Git LFS: two existing MP4 assets remain LFS-tracked; no LFS object is staged or added. No video is part of this change.

## Git status and release risks

GitHub API check on 2026-11-04 confirmed `main` at `55077ea5c02d1f7ad98263bf352d4a67d1193af9`; candidate merge-base is the same, candidate is two commits ahead and zero behind according to cached local refs. GitHub branch search did not find a remote `codex/phase12-performance` branch. Local fetch/push via Git may still be blocked by Schannel credentials. The GitHub account has repository push permission, but no push was made.

Ordinary Git staging initially could not create `.git/worktrees/p12/index.lock` (`Permission denied`). After verifying the exact path list and user authorization, a narrowly scoped elevated stage/commit succeeded: code commit `602335b4e4f88bfb229c39634b7f3ef7d59e8c62` contains only the 13 listed performance files. No reset, clean, force push, video, or unrelated file was used. `git push --set-upstream origin codex/phase12-performance` failed with Windows Schannel `SEC_E_NO_CREDENTIALS`; the remote candidate branch remains absent. The two pre-existing untracked reports (`PERFORMANCE_PHASE12_2_REPORT.md`, `PERFORMANCE_PHASE12_REPORT.md`) remain untouched. `git lfs status` shows no staged objects. The candidate worktree's two PDF.js files are reported modified after build, but their content hashes equal `HEAD`; they are excluded from staging.

### Trace artifacts

Saved outside the repository under `%TEMP%`:

- `p12-lh-release-mobile-1.json` and `p12-lh-release-mobile-1.trace.json`
- `p12-lh-release-mobile-1.devtoolslog.json`
- `p12-lh-release-desktop-1.json` and `p12-lh-release-desktop-1.trace.json`
- `p12-lh-release-desktop-1.devtoolslog.json`
- `p12-lh-release-summary.json`

## Recommendation

Continue optimizing Mobile before Production. Keep this candidate off Production until a new, safely protected Preview can be deployed and inspected, then run at least five equivalent Preview and Production Lighthouse tests with traces. The local candidate has improved measured payload and local observed LCP, but the simulated Mobile LCP remains above target and remote results are unavailable.
