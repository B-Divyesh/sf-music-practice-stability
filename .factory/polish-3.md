# Perfection-loop polish 3 — complete finding closure

Date: 2026-08-28 UTC
Repair commit: `e67f6e7b0cc778c01223727e6b2a9c466b852cef` (`fix: close review 3 demo and offline gaps`)
Deployed URL: https://music-practice-stability.sociobot.in

This closure pass read every earlier review and polish record. All 24 finding
IDs are accounted for below; no earlier "fixed" item was treated as exempt.
The repair keeps the existing graph-paper timing notebook identity, rather than
substituting a generic product shell.

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | The demo retains the seeded 26 ms / 52% result and compact trend before its controls. | `@claim:sample-improvement`; `evidence/polish-3-live/demo/screenshot-mobile.png`; live `/?demo=1` |
| F-1-2 | Kept deterministic microphone attack detection and learner-facing attack wording. | `@claim:microphone-detection`; `evidence/polish-3-live/home/screenshot-desktop.png`; live `/practice` |
| F-1-3 | Kept the IndexedDB-to-localStorage recovery path. | `@claim:storage-fallback`; `evidence/polish-3-local/practice-online-only-mobile.png`; live `/practice` |
| F-1-4 | Kept the single plain payment sentence: Dodo hosts checkout and handles payment through Sociobot. | `@claim:payment-host`; `evidence/polish-3-live/terms-mobile.png`; live `/terms` |
| F-1-5 | Kept the optional local reference pulse, with mute and stop controls. | `@claim:reference-pulse`; `evidence/polish-3-local/practice-online-only-mobile.png`; live `/practice` |
| F-1-6 | Kept the tightened desktop first screen so all three facts fit in 1440 × 900. | `desktop first screen includes all three product facts`; `evidence/polish-3-local/home-desktop.png`; live `/` |
| F-1-7 | Kept route-specific titles, descriptions, canonical/OG/Twitter metadata, focus restoration, and static 404 metadata. | `each route has specific metadata and navigation restores focus`; `evidence/polish-3-live/404-mobile.png`; live `/privacy`, `/terms`, and `/definitely-missing-polish-3` (`routes.json`) |
| F-1-8 | Kept the plain job headline “Measure timing consistency across takes.” | `.factory/copy-audit.md`; `evidence/polish-3-live/home/screenshot-desktop.png`; live `/` |
| F-1-9 | Kept the informative “Timing practice for beginners” eyebrow. | `.factory/copy-audit.md`; `evidence/polish-3-live/home/screenshot-desktop.png`; live `/` |
| F-1-10 | Kept the literal “What Steady Take measures” limits heading. | `.factory/copy-audit.md`; `evidence/polish-3-live/home/screenshot-desktop.png`; live `/` |
| F-1-11 | Kept the literal caption about later attacks landing closer together. | `.factory/copy-audit.md`; `evidence/polish-3-live/home/screenshot-desktop.png`; live `/` |
| F-1-12 | Kept “attack” for learner copy; `onsets_ms` remains only the CSV field name. | `@claim:csv-export`; `@claim:scope-limits`; `evidence/polish-3-live/home/screenshot-desktop.png`; live `/` |
| F-1-13 | Kept the result-naming “Activate full version” action. | `@claim:license-on-demand`; `evidence/polish-3-live/home/screenshot-desktop.png`; live `/` |
| F-1-14 | Kept the named, linked Steady Take purchase terms action. | `@claim:payment-host`; `evidence/polish-3-live/terms-mobile.png`; live `/terms` |
| F-1-15 | Kept the deployed clickable sample-demo link and isolation wording in README. | README link check; `evidence/polish-3-live/demo/screenshot-mobile.png`; live `/?demo=1` |
| F-1-16 | Kept literal “Page not found” copy on SPA and static 404 routes. | `static 404 has the standard skeleton, 44px controls, and no 200% text overflow`; `evidence/polish-3-live/404-mobile.png`; live `/definitely-missing-polish-3` |
| F-2-1 | Kept the precise timing-only scope sentence and fixture MIDI timing-only export coverage. | `@claim:scope-limits`; `evidence/polish-3-live/terms-mobile.png`; live `/terms` |
| F-2-2 | Kept the registered same-origin service-worker update disclosure. | `@claim:update-check`; `evidence/polish-3-local/privacy-mobile.png`; live `/privacy` |
| F-2-3 | Kept the unprovable refund-handler sentence removed; checkout and revocation remain independently testable. | `@claim:payment-host`; `@claim:revoked-license`; `evidence/polish-3-live/terms-mobile.png`; live `/terms` |
| F-2-4 | Kept the registered browser-storage deletion behaviour and reliable database cleanup. | `@claim:site-storage-clear`; `evidence/polish-3-local/privacy-mobile.png`; live `/privacy` |
| F-3-1 | Leaving demo now calls `resetDemo()` before real practice renders. `Start for real` removes `demo:steady-take`; a later demo starts with the six-row seed. `.factory/demo.md` now states this immediate discard. | `@claim:demo-isolation`; `evidence/polish-3-live/live-qa.json`; `evidence/polish-3-live/demo-isolation-mobile.png`; live `/?demo=1` |
| F-3-2 | The connection pill now distinguishes Preparing offline use, Ready offline only after service-worker control, Online only when unavailable, and Offline now. Status updates no longer rerender active practice controls. | `@claim:offline-reload`; `offline availability never claims readiness without service-worker control`; `evidence/polish-3-live/practice-online-only-mobile.png`; live `/practice` |
| F-3-3 | Replaced browser-dependent permission language with the precise on-demand statement; both browser APIs are called only after the chosen input starts. | `@claim:permission-on-demand`; `evidence/polish-3-local/privacy-mobile.png`; `evidence/polish-3-live/live-qa.json`; live `/privacy` and `/?demo=1` |
| F-3-4 | Added the exact cached-license continuity claim and moved its former untagged test to `@claim:offline-license-cache`. | `@claim:offline-license-cache`; `evidence/polish-3-live/offline-license-mobile.png`; live `/practice` |

## Verification

- A clean remote clone of `e67f6e7b0cc778c01223727e6b2a9c466b852cef`
  installed with `npm ci`. Every one of the 25 commands in
  `.factory/claims.json` was invoked independently; desktop and mobile
  projects both passed, for 50 claim executions.
- Full clean-clone `npm test`: **83 passed, 1 intentionally skipped** (the
  duplicate static-config assertion is deliberately Chromium-only). `npm run
  build` passed and produced `dist/`.
- Production build sizes: application JS 36.08 kB raw / 12.77 kB gzip; CSS
  24.03 kB raw / 6.04 kB gzip. The application is well below the static first
  load JavaScript budget.
- Local production URL checks for `/` and `/?demo=1` are in
  `evidence/polish-3-local/*/verify.json`: 200, correct title/lang, one h1,
  main landmark, no missing image alt, no unlabeled buttons, and no console
  errors. Mobile Lighthouse: Performance **100**, Accessibility **100**, Best
  Practices **100**, SEO **100**; LCP 1.7 s, CLS 0, transfer 109 KiB
  (`evidence/polish-3-local/lighthouse-mobile.json`).
- The factory URL verifier was repeated cold after deploy for `/` and
  `/?demo=1` (`evidence/polish-3-live/*/verify.json`). Live Playwright Axe
  found zero violations on `/`, `/practice`, `/?demo=1`, `/privacy`, and
  `/terms` at desktop and 390 px mobile (`evidence/polish-3-live/axe.json`).
- Cold live scripted checks in `evidence/polish-3-live/live-qa.json` confirm
  demo exit removes the key and restores six rows, blocked service workers say
  Online only, both permission APIs remain on demand, and a cached license
  continues offline. `evidence/polish-3-live/routes.json` records real status
  codes, all route metadata, focus restoration, legal-link 200s, and the real
  404.

## Deployment

Deployed through the configured static work order with
`/opt/fleet/lib/deploy-static.sh music-practice-stability dist`.

- Static app: `sf-music-practice-stability`
- Deployment ID: `d93c5bea-1884-4d6b-ba17-2638500ab01c`
- Custom domain: https://music-practice-stability.sociobot.in (200)
- Cold live HTML references `app-TnXIPTD0.js`, the bundle built from the repair
  commit.

No review finding remains unresolved.
