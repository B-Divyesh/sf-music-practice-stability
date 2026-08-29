# Steady Take — polish 4 handoff

Date: 2026-08-29 UTC

Work order: `music-practice-stability-polish-4`

Base: `2a3a4507997c1dfb6fa0dc75c7302d1d705c0509`

Product repair: `7a99c8dc0bd973063fc1614d81c06d978cffa00d`

Status: **Complete — zero review findings remain**

## Delivered

- Closed F-4-1 by using “timing consistency” on every visitor-facing surface:
  application and 404 footers, README opening, initial metadata, and PWA
  manifest. A browser/source regression test prevents the old term returning.
- Re-audited all 24 earlier findings rather than relying on prior closure. The
  first-screen facts, isolated one-click demo, claim tests, reference pulse,
  real routes and 404, focus restoration, legal copy, storage boundaries,
  mobile layout, and offline states remain correct.
- Updated `.factory/catalog-description.txt` to the 58-character verb-first
  sentence “Measure timing consistency across repeated practice takes.”
- Updated `.factory/copy-audit.md` and wrote `.factory/polish-4.md` with an
  explicit finding → change → evidence row for all 25 cumulative findings.
- Preserved the measured-generative-geometry identity: warm graph paper,
  cut-paper timing rows, ink navy, coral attacks, mint results, Fraunces
  numerals, clipped corners, and non-looping motion.

## How to run and verify

```sh
npm ci
npm test
npm run build
npm run preview -- --port 4173
```

The supported demo entry point is `/?demo=1`; `/demo` remains its route alias.
Every command in `.factory/claims.json` can also be run independently.

## Exact verification

- Clean clone: `/tmp/steady-take-polish4-clean-eJjEPe/repo`, commit
  `7a99c8dc0bd973063fc1614d81c06d978cffa00d`.
- `npm ci`: passed with zero vulnerabilities.
- Every registered claim command: 25/25 passed independently in Chromium and
  390 px mobile, for 50/50 claim executions.
- Full clean-clone `npm test`: 85 passed; one intentionally duplicated
  static-config assertion skipped in the mobile project.
- `npm run build`: passed and produced `dist/index.html`.
- Bundle sizes: JS 36.08 kB raw / 12.70 kB gzip; CSS 24.03 kB raw / 6.06 kB
  gzip. Both are far below the static product budgets.
- Accessibility: Playwright Axe found zero serious or critical violations on
  every route and the 404 in desktop and mobile. Keyboard skip, forward/Back
  h1 focus, 44 px targets, 200% text, form errors, chart text, and reduced
  motion all pass the full suite.
- Factory URL verifier: live `/`, `/?demo=1`, `/privacy`, and `/terms` returned
  200 with correct title/lang/main/h1/alt/labels and zero console errors.
- Demo/privacy/offline: cold live `/?demo=1` used only
  `sessionStorage["demo:steady-take"]`, created no IndexedDB database or
  localStorage key, made no external request, reset to six sessions, discarded
  changes on Start for real, and reloaded its seed offline.
- Routing: live `/practice`, `/?demo=1`, `/privacy`, and `/terms` have distinct
  title/description metadata. `/missing-polish-4` returned HTTP 404 with the
  designed page. Forward and Back navigation focused the new h1.
- Security: live headers include CSP with response-header `frame-ancestors`,
  HSTS, `nosniff`, strict-origin referrer policy, and microphone-only permission
  policy.
- Live Lighthouse 12.8.2: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 0.9 s, LCP 1.5 s, TBT 0 ms, CLS 0, transfer 133,235 bytes.

Evidence is in `.factory/evidence/polish-4-local/` and
`.factory/evidence/polish-4-live/`. The cumulative mapping is in
`.factory/polish-4.md`.

## Deployment

- Command: `/opt/fleet/lib/deploy-static.sh music-practice-stability dist`
- Static app: `sf-music-practice-stability`
- Deployment ID: `cc18382e-d587-4ef4-9fd9-6da2446846ef`
- Live URL: <https://music-practice-stability.sociobot.in>
- Live app bundle: `/assets/app-BiNUcb-4.js`
- Live/local hashes match for `index.html`, app JS, CSS, `sw.js`, and
  `manifest.webmanifest`.

## Known gaps and next steps

No product defect or review finding is known. Physical acoustic instruments,
physical MIDI hardware, and a completed card payment were outside automated
verification; deterministic browser fixtures cover microphone/MIDI behavior,
and the live hosted checkout was inspected without submitting purchaser data.
No follow-up implementation is required for this work order.
