# Perfection-loop polish 4 — complete finding closure

Date: 2026-08-29 UTC

Base review commit: `2a3a4507997c1dfb6fa0dc75c7302d1d705c0509`

Product repair commit: `7a99c8dc0bd973063fc1614d81c06d978cffa00d`

Deployment: `cc18382e-d587-4ef4-9fd9-6da2446846ef`

Live URL: <https://music-practice-stability.sociobot.in>

All four reviews and all three earlier polish reports were read. Every finding
below was checked against the repair build and the cold deployed site. No
finding is deferred.

## Finding map

| Finding | Change made or retained | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the seeded 26 ms result and 54-to-26 ms chart before every demo control. | `@claim:sample-improvement`; `.factory/evidence/polish-4-live/demo/screenshot-mobile.png`; live `/?demo=1`, result bottom 719 px in an 844 px viewport. |
| F-1-2 | Kept deterministic microphone attack detection and learner-facing “attack” wording. | `@claim:microphone-detection`; full suite 85 passed; live `/`. |
| F-1-3 | Kept the IndexedDB-to-`steady-take:fallback` recovery path. | `@claim:storage-fallback`; clean-clone claim run passed in desktop and mobile; live `/practice`. |
| F-1-4 | Kept the single payment sentence: “Dodo hosts checkout and handles payment through Sociobot.” | `@claim:payment-host`; `@claim:full-version-price`; live `/terms`. |
| F-1-5 | Kept the optional local reference pulse with BPM timing, mute, and stop controls. | `@claim:reference-pulse`; live `/?demo=1`. |
| F-1-6 | Kept the compact asymmetric hero; all three facts remain in the 1440 × 900 first screen. | `desktop first screen includes all three product facts`; `.factory/evidence/polish-4-live/home/screenshot-desktop.png`; live `/`. |
| F-1-7 | Kept per-route title, description, canonical, Open Graph/Twitter data, focus restoration, and complete 404 metadata. | `each route has specific metadata and navigation restores focus`; `.factory/evidence/polish-4-live/live-qa.json`; live route matrix. |
| F-1-8 | Kept the direct h1 “Measure timing consistency across takes.” | `visitor-facing surfaces use timing consistency as the core term`; live `/`. |
| F-1-9 | Kept the informative eyebrow “Timing practice for beginners.” | `.factory/copy-audit.md`; live `/`. |
| F-1-10 | Kept the literal heading “What Steady Take measures.” | `.factory/copy-audit.md`; live `/`. |
| F-1-11 | Kept the caption explaining that later attacks land closer together. | `.factory/copy-audit.md`; `.factory/evidence/polish-4-live/home/screenshot-desktop.png`. |
| F-1-12 | Kept “attack” in learner copy; `onsets_ms` appears only as the documented CSV field. | `@claim:scope-limits`; `@claim:csv-export`; live `/`. |
| F-1-13 | Kept the result-naming action “Activate full version.” | `@claim:license-on-demand`; live `/`. |
| F-1-14 | Kept the named, linked Steady Take purchase terms action. | `@claim:payment-host`; live `/terms`. |
| F-1-15 | Kept the deployed, clickable sample link and plain isolation wording in README. | README link to live `/?demo=1`; `@claim:demo-isolation`. |
| F-1-16 | Kept literal “Page not found” copy in the SPA and static 404 documents. | `static 404 has the standard skeleton, 44px controls, and no 200% text overflow`; `.factory/evidence/polish-4-live/404-mobile.png`; live `/missing-polish-4` returned 404. |
| F-2-1 | Kept the exact timing-only scope and the omission of note names and technique feedback. | `@claim:scope-limits`; live `/terms`. |
| F-2-2 | Kept the same-origin installed-app update disclosure and behavior. | `@claim:update-check`; live `/privacy`. |
| F-2-3 | Kept the unprovable refund-handler sentence removed. Checkout hosting and revocation remain separately testable. | `@claim:payment-host`; `@claim:revoked-license`; live `/terms`. |
| F-2-4 | Kept browser-level site-storage deletion behavior and closed IndexedDB operations. | `@claim:site-storage-clear`; live `/privacy`. |
| F-3-1 | Kept immediate deletion of `demo:steady-take` when Start for real leaves demo mode. | `@claim:demo-isolation`; `.factory/evidence/polish-4-live/live-qa.json` records seven → exit → six. |
| F-3-2 | Kept truthful Preparing, Ready, Online only, and Offline now service-worker states. | `@claim:offline-reload`; `offline availability never claims readiness without service-worker control`; live offline reload in `live-qa.json`. |
| F-3-3 | Kept the exact on-demand permission statement and deferred both browser API calls until Start take. | `@claim:permission-on-demand`; live `/privacy`. |
| F-3-4 | Kept cached paid access active after an offline verification failure. | `@claim:offline-license-cache`; clean-clone claim run passed in both projects. |
| F-4-1 | Replaced “timing stability” with “timing consistency” in the application/static 404 footers, README opening, initial HTML description, and install manifest. Bumped the displayed build to v1.3.0 and the manifest start URL to `?v=2`. | `visitor-facing surfaces use timing consistency as the core term`; `.factory/copy-audit.md`; live `/`, `/404.html`, and `/manifest.webmanifest`; live `live-qa.json` scans every route. |

## Verification evidence

- Clean clone: `/tmp/steady-take-polish4-clean-eJjEPe/repo`, detached at
  `7a99c8dc0bd973063fc1614d81c06d978cffa00d`, installed with `npm ci`.
- All 25 exact commands in `.factory/claims.json` passed independently in both
  browser projects: 50/50 claim executions.
- Clean-clone `npm test`: 85 passed, one intentional duplicate static-config
  assertion skipped. Clean-clone `npm run build`: passed with `dist/index.html`.
- Production size: application JavaScript 36.08 kB raw / 12.70 kB gzip; CSS
  24.03 kB raw / 6.06 kB gzip.
- Playwright Axe integration found zero serious or critical violations on `/`,
  `/practice`, `/?demo=1`, `/privacy`, `/terms`, and the 404 at both configured
  viewport profiles.
- Factory URL verifier evidence is under `.factory/evidence/polish-4-local/`
  and `.factory/evidence/polish-4-live/`; all checked 200 pages had zero console
  errors, one h1, one main landmark, `lang="en"`, alt text, and labeled buttons.
- Live Lighthouse 12.8.2: Performance 100, Accessibility 100, Best Practices
  100, SEO 100, FCP 0.9 s, LCP 1.5 s, TBT 0 ms, CLS 0, transfer 133,235 bytes.
- Live application, JS, CSS, service worker, and manifest SHA-256 hashes match
  the deployed `dist/` files exactly.

No cumulative review finding remains unresolved.
