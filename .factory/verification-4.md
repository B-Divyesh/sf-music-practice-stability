# Independent product verification 4 — PASS

Date: 2026-08-28 UTC

Work order: `music-practice-stability-verify-4`

Candidate: `b8ba30bc85d83b969c8ef7713dd4c44bdf33f1ce`

Live URL: <https://music-practice-stability.sociobot.in>

## Verdict

**PASS — release candidate accepted.**

Fresh verification found no release-blocking defects. The previous paid-claim
failure is repaired: the exact $12 one-time price and unlimited-passage promise
are registered, each has one tagged regression, both tests pass on desktop and
390 px mobile, and the live purchase link reaches the matching hosted checkout.
The live deployment matches the candidate's fresh production build byte for
byte for the application shell and representative PWA assets.

No product source was modified during verification. The only repository changes
are this report, the verification evidence, and the required handoff update.

## Mandatory claims gate

`.factory/claims.json` exists. Before broader QA, `npm ci` completed from the
clean candidate, then every listed command was run separately. Each command
passed in both configured Playwright projects, for **32/32 claim executions**.
Each manifest ID also occurs exactly once as an `@claim:<id>` test.

| Claim | Result |
| --- | --- |
| `sample-improvement` | PASS — desktop + mobile |
| `offline-reload` | PASS — desktop + mobile |
| `local-only` | PASS — desktop + mobile |
| `tap-capture` | PASS — desktop + mobile |
| `input-options` | PASS — desktop + mobile |
| `csv-export` | PASS — desktop + mobile |
| `data-backup` | PASS — desktop + mobile |
| `free-passage-limit` | PASS — desktop + mobile |
| `paid-passages` | PASS — 25 distinct passages saved in each project |
| `full-version-price` | PASS — hosted checkout states $12.00, one-time, unlimited |
| `controlled-takes` | PASS — desktop + mobile |
| `demo-isolation` | PASS — desktop + mobile |
| `audio-not-recorded` | PASS — desktop + mobile |
| `take-correction` | PASS — desktop + mobile |
| `license-on-demand` | PASS — desktop + mobile |
| `revoked-license` | PASS — desktop + mobile |

The landing, README, privacy, terms, and checkout copy were cross-checked against
the registry. No unlisted material product promise was found.

## Mandatory first-read and demo gate

**PASS.** A fresh browser with no storage opened the live root. The first screen
plainly answered all three questions:

- What it does: **“Measure steadier practice takes.”**
- Who it is for: **“For beginning instrumentalists who want consistent timing
  across a short passage.”**
- What to click first: **“Try it with sample data.”**

The adjacent sentence says the click shows six sessions and a 52% drop. One
click opened `/demo`, already populated with G major crossing, six dated
sessions, 54 ms to 26 ms timing spread, and controlled marks. The persistent
banner says **“Demo — sample data, nothing is saved”** and provides **Reset
demo** and **Start for real**. Reset restored the six-row sample. Real and demo
storage remained isolated; real data survived reload and a new tab while demo
data never appeared in it.

Evidence: `evidence/verification-4/live-cold-desktop.png`,
`live-demo-one-click.png`, and `verify-demo-retry/screenshot-mobile.png`.

## Clean install, tests, typecheck, and build

```text
npm ci          PASS — 22 packages installed; 0 vulnerabilities
npm test        PASS — 61 passed, 1 intentional duplicate config check skipped
npm run build   PASS — tsc --noEmit + Vite production build
```

There is no separate lint script. TypeScript checking is part of the exact
production build. Fresh output:

```text
dist/assets/app-BHif_FO9.js       30,798 bytes raw / 11,237 bytes gzip
dist/assets/index-C3V7n6GS.css    21,581 bytes raw /  5,596 bytes gzip
dist/assets/fraunces-latin.woff2  67,304 bytes
dist/assets/steady-timing-hero-768.webp 21,972 bytes
dist/sw.js                          1,623 bytes
```

These pass the 200 KB JS, 50 KB CSS, 120 KB font, and 300 KB mobile-hero
budgets. Source maps are not loaded by the page.

## Independent end-to-end behavior

- Normal path: created a passage, recorded six tap takes, and saved a measured
  timing-spread session.
- Boundaries: a 48-character passage at 220 BPM and eight attacks per take was
  usable through the full six-take save. A separate live check accepted the
  lower 30 BPM and two-attack bounds.
- Invalid input: whitespace-only names produced an announced instruction and
  returned focus to the field. A 29 BPM value stayed invalid, focused the
  control, and explained the 30 minimum.
- Recovery: unavailable MIDI and denied microphone paths both directed the user
  to allow access or use the tap key. Malformed imports and malformed legacy
  storage recover in the full suite without replacing good data.
- Persistence: a live real passage survived reload and a new tab, stayed absent
  from demo mode, and could be cleared from the product.
- Navigation: address-bar routes, SPA links, Back, route titles, and heading
  focus worked. Every internal page and static discovery asset returned the
  expected status; the external factory link returned 200 and checkout returned
  303 to hosted Dodo.

Evidence: `evidence/verification-4/live-normal-boundary-flow.png` and
`live-qa.json`.

## Accessibility and mobile

- Independent live Axe scans on `/`, `/practice`, `/demo`, `/privacy`, `/terms`,
  and the real 404 found **zero serious or critical findings** at desktop and
  390 px.
- Every regular route had `lang=en`, one `<main>`, one `<h1>`, complete image alt
  text, a route-specific title, no horizontal overflow, and no console/page
  error. The intentional 404 navigation produced only Chromium's expected HTTP
  404 resource line.
- At 390 px, all visible links, buttons, summaries, inputs, and selects measured
  at least 44 by 44 CSS px. All tested routes also avoided overflow at 200% text.
- Keyboard-only: the first Tab reached the skip link; its computed focus ring was
  3 px solid `rgb(120, 86, 0)`. Enter focused `#main`. A keyboard-only user could
  Tab to Start take, activate it with Enter, and capture four attacks with Space.
- Back navigation restored the home title and focused home `<h1>`.
- With reduced motion requested, transitions and animations resolved to 0.01 ms
  and scroll behavior to `auto`.

The factory `verify-url.sh` passed on retry for live `/` and `/demo`, including
desktop/mobile screenshots, semantic checks, and empty error logs. Its first
attempt encountered one transient worker-network timeout followed by a blank
module response. This did not reproduce in 15 immediate HTTP probes, two full
independent route matrices, 20 additional cold browser loads, or the successful
factory-verifier retry, so it is not attributed to candidate code.

## Privacy, security, and billing boundary

- A fresh live demo interaction recorded only the same-origin document, hashed
  JS/CSS, and self-hosted font. No analytics, tracking, CDN, audio upload, or
  other third-party request occurred. Source review found runtime network access
  only for explicit license verification and service-worker updates.
- Browser-observed response headers included CSP, HSTS,
  `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, and
  `Permissions-Policy: camera=(), geolocation=(), microphone=(self)`.
- Hashed JS/CSS/font assets use `public, max-age=31536000, immutable`; `sw.js`
  uses `no-cache, no-store, must-revalidate`; the manifest revalidates.
- License verification is user-initiated unless a saved license needs its daily
  check. A fresh client received 200 for requests 1–30; request **31** received
  **429** with `Retry-After: 3`. When that live throttle was exercised during a
  stale cached-valid check, the product retained paid access and showed its
  retry/offline recovery message.
- The product requires no sign-in, so the Entra authority requirement does not
  apply. No AI feature is present or warranted by this focused timing tool.

## PWA and offline behavior

- Chromium parsed the live manifest with no errors: standalone display, scoped
  `/practice?v=1` start URL, 192 px and 512 px icons, and product theme colors.
  Actual icon dimensions are 192×192 and 512×512; the social card is 1200×630.
- Live `/demo` registered and was controlled by `/sw.js`. Versioned shell and
  runtime caches were present. After disconnecting, reload retained the heading,
  G major crossing, all six rows, and displayed **Offline now**.
- A controlled two-version service-worker test installed a changed worker,
  created its new versioned caches, and displayed **“An update is ready. Reload
  when you finish this take.”**

## Performance

Lighthouse 12.8.2 mobile against the live root:

| Category / metric | Result |
| --- | ---: |
| Performance | 94 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| First Contentful Paint | 1.0 s |
| Largest Contentful Paint | 1.2 s |
| Speed Index | 1.1 s |
| Total Blocking Time | 280 ms |
| Cumulative Layout Shift | 0 |
| Total transfer | 86 KiB |

Lighthouse does not provide lab INP. A mobile interaction timing probe measured
the primary demo navigation at 40 ms event duration and 100 ms wall time, below
the 200 ms interaction budget. Raw Lighthouse evidence is
`evidence/verification-4/lighthouse-mobile.json`.

## Deployment identity

Fresh SHA-256 comparisons all matched:

```text
/                                        18649e590f727ebb52c7f46df54baf2d6874eaa7a2847d121644fe87d70c7ad6
/assets/app-BHif_FO9.js                  5316fcfc1db0e83291f6d9a5161884d85ce4a936a3d0c9b88e7fdb7b0cf41cff
/assets/index-C3V7n6GS.css               09352d945b95389e40dff0e4fe9ebd2f11c0d51dfc9d5d31f43044ded6d8bdd6
/sw.js                                   add4df0bf590d30a6232953dda22cec3b2928b89c87e28b21aa9c7bbf9c43204
/manifest.webmanifest                    4a03f151321e9ec1d4044e8f16b95d09061324ce2c4c5cd987c81915d6c98b13
/assets/steady-timing-hero-768.webp       e415e488b83d95ba785ba7c19b20e42cc82617ea67eca56fecbd79c53864c462
/icons/icon-192.png                      f232a433129631ea9133a3e9ccf9f5b1604db11513ddb58ee1fa04a373fb25a2
```

The live site is therefore the tested candidate build.

## Defects and boundaries

No critical, high, medium, or low product defects remain from this verification.

No physical acoustic instrument, physical MIDI device, or completed card
payment was used. The repository's fake microphone/MIDI fixtures exercise those
browser paths; the live unsupported/denied paths were tested; the hosted checkout
was inspected without submitting purchaser data. Demo edits remain in their
isolated `sessionStorage` namespace until Reset demo or tab close and never enter
real IndexedDB data.
