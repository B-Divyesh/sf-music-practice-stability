# Steady Take — polish 3 handoff

Date: 2026-08-28 UTC
Work order: `music-practice-stability-polish-3`
Status: **PASS — deployed and cold-verified**
Repair commit: `e67f6e7b0cc778c01223727e6b2a9c466b852cef`

## Delivered

- Fixed every F-3 finding and independently reverified every F-1 and F-2
  finding. The complete ID → change → evidence map is
  `.factory/polish-3.md`.
- Demo exit is now truly isolated: **Start for real** removes the demo storage
  namespace before real practice is rendered. Reset and exit both restore a
  fresh six-session sample on the next demo visit.
- Offline status is now accurate before and after service-worker control.
  Permission and offline full-version promises are registered, fixture-tested
  claims with precise copy.
- Updated the catalog line to: “Track timing consistency across repeated
  practice takes.” It is verb-first and 56 characters (57 bytes with its
  trailing newline).

## Verification evidence

- Clean clone: `npm ci`, every one of the 25 `.factory/claims.json` commands
  separately (50 desktop/mobile executions), `npm test` (**83 passed, 1
  intentional skip**), and `npm run build` all passed.
- Local production URL checks: `evidence/polish-3-local/home/verify.json` and
  `evidence/polish-3-local/demo/verify.json`. They record 200 responses,
  correct title/lang, one h1, a main landmark, no missing alts or unlabeled
  buttons, and no console errors.
- Local mobile Lighthouse: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; LCP 1.7 s, CLS 0, transfer 109 KiB
  (`evidence/polish-3-local/lighthouse-mobile.json`).
- Live cold checks after deploy: `evidence/polish-3-live/live-qa.json`,
  `routes.json`, and the two `verify.json` files. They cover all F-3 states,
  titles/metadata/focus, legal links, and a real 404.
- Live Axe checks on `/`, `/practice`, `/?demo=1`, `/privacy`, and `/terms` at
  desktop and 390 px mobile: zero violations, including zero serious/critical
  (`evidence/polish-3-live/axe.json`).

## Build and deployment

- `dist/` built successfully. App JS: 36.08 kB raw / 12.77 kB gzip; CSS:
  24.03 kB raw / 6.04 kB gzip.
- Deployed with `/opt/fleet/lib/deploy-static.sh music-practice-stability dist`.
- Static app `sf-music-practice-stability`; deployment
  `d93c5bea-1884-4d6b-ba17-2638500ab01c`.
- Live: https://music-practice-stability.sociobot.in. The cold page serves
  `app-TnXIPTD0.js`, matching the repaired build.

## Run locally

```sh
npm ci
npm test
npm run build
npm run preview
```

For the isolated sample, open `/?demo=1` or click **Try it with sample data**.
Demo state lives only in `sessionStorage` under `demo:steady-take`; real
practice remains in its separate local-first storage.

## Known gaps

None. The product is static, local-first, and deployed as the required PWA
artifact; no infrastructure, DNS, or billing configuration was changed.
