# Perfection-loop polish 1 — finding closure

Date: 2026-08-28 UTC

Candidate repaired: `7cfbc65ecc1e613e0f49a0140ae16d7889896fb1`

Review source: `.factory/review-1.md` at
`c175808d063f4fa426c2fb0c673cdf5a4f41fa17`. Git history contains no earlier
`.factory/review-*.md` or `.factory/polish-*.md` file.

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Added a compact 26 ms / 54 ms / six-session result and chart before every demo control. The primary action now opens the isolated `/?demo=1` path. | `@claim:sample-improvement`; `.factory/evidence/polish-1-local/demo-mobile.png`; live `/?demo=1` |
| F-1-2 | Replaced “onset” and unsupported room claims with plain attack-detection instructions. Registered and tested steady background frames plus four separated impulses through the actual analyser loop. | `@claim:microphone-detection`; live landing limits |
| F-1-3 | Registered the existing IndexedDB failure behavior and proved a passage survives reload from `steady-take:fallback`. | `@claim:storage-fallback`; live `/practice` |
| F-1-4 | Standardized the payment sentence to “Dodo hosts checkout and handles payment through Sociobot.” Added a linked purchase-terms action and an observable redirect/no-iframe claim. | `@claim:payment-host`; `@claim:full-version-price`; live `/` and `/terms` |
| F-1-5 | Added a local Web Audio reference pulse tied to passage BPM, with visible beats, mute, stop, and reduced-motion treatment. | `@claim:reference-pulse`; live `/practice` |
| F-1-6 | Tightened desktop hero type, columns, and spacing so all facts end above 900 px. | `desktop first screen includes all three product facts`; `.factory/evidence/polish-1-local/home-desktop.png`; live `/` |
| F-1-7 | Added route-specific description, canonical, Open Graph, Twitter, and URL metadata. Completed static 404 metadata and favicon. | `each route has specific metadata and navigation restores focus`; `static 404 has the standard skeleton...`; live `/practice`, `/?demo=1`, `/privacy`, `/terms`, and `/definitely-missing-polish-1` |
| F-1-8 | Rewrote the h1 as “Measure timing consistency across takes.” | `desktop first screen includes all three product facts`; live `/` |
| F-1-9 | Replaced the slogan eyebrow with “Timing practice for beginners.” | `.factory/copy-audit.md`; live `/` |
| F-1-10 | Replaced the metaphorical limits heading with “What Steady Take measures.” | `.factory/copy-audit.md`; live `/` |
| F-1-11 | Rewrote the caption as “Later timing rows show the attacks landing closer together.” | `.factory/copy-audit.md`; live `/` |
| F-1-12 | Uses “attack” throughout learner copy; `onsets_ms` remains only as the documented CSV field. | `@claim:csv-export`; `.factory/copy-audit.md`; live `/` and `/privacy` |
| F-1-13 | Renamed the restore-purchase action to “Activate full version.” | `@claim:license-on-demand`; live `/` |
| F-1-14 | Replaced the inert sentence with the linked action “Read the Steady Take purchase terms.” | `@claim:payment-host`; live `/terms` |
| F-1-15 | README now links the deployed sample demo and says it does not use practice history. | README link crawl; live `/?demo=1` |
| F-1-16 | Both SPA and static-host 404s now use “Page not found” and a literal address explanation. | `static 404 has the standard skeleton...`; live `/definitely-missing-polish-1` |

## Cross-cutting acceptance evidence

- Full local suite: `npm test` — 73 passed, one intentional duplicate static
  config check skipped across desktop and 390 px mobile projects.
- Build: `npm run build` — 12.53 kB gzip JS, 5.97 kB gzip CSS, `dist/index.html`.
- Accessibility: Playwright Axe on every route at both viewports — no serious
  or critical violations. Local factory URL verifier — zero console errors.
- Performance: local mobile Lighthouse 100 performance, 100 accessibility,
  100 best practices, 100 SEO; LCP 1.7 s, CLS 0, TBT 0 ms.
- Privacy/offline: `@claim:local-only`, `@claim:demo-isolation`,
  `@claim:audio-not-recorded`, `@claim:license-on-demand`, and
  `@claim:offline-reload` all pass in both projects.

Post-deploy evidence is recorded in `.factory/evidence/polish-1-live/` and the
final handoff after the production cold check.
