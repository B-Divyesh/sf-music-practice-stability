# Independent product verification 2 — FAIL

Date: 2026-08-28 UTC

Work order: `music-practice-stability-verify-2`

Candidate: `602e4fca80252380cd7b654ee4283199c8c2f894`

Live URL: `https://music-practice-stability.sociobot.in`

## Verdict

**FAIL — do not release.**

The previous deployment-only checkout failure is fixed: the live buy action now
returns HTTP 303 to hosted Dodo checkout, and the hosted page returns HTTP 200.
The live static files also match the candidate byte for byte. Fresh independent
testing nevertheless found four release blockers: stale cached licenses relock
when the user is offline, a malformed JSON import can persist corrupt data and
brick the practice page, the live 404 fails the required mobile accessibility
baseline, and public claims remain outside or beyond the claim registry's
coverage.

No product source was changed during this verification.

## Release-blocking findings

### High — a paid license relocks offline after its daily cache expires

The paid-unlock contract requires optimistic use of the cached valid verdict
and background reconciliation. A network failure is not an invalid verdict.
Fresh live reproduction:

1. Cache `/practice` under the active service worker and create one passage.
2. Seed the same keys a real activation uses:
   `sb_license:music-practice-stability` and a valid cached verdict whose
   `checkedAt` is two days old.
3. Put the browser offline and reload `/practice`.

Observed result:

```text
Offline now
The license could not be verified. Check the token and your connection.
Add passage with full version
sb_license_verdict:music-practice-stability = null
```

The app catches both an explicit invalid response and a network error in the
same branch at `src/main.ts:386-400`, deletes the cached valid verdict, and sets
`isPaid = false`. A legitimate one-time buyer therefore loses paid access after
24 hours whenever offline or whenever the billing endpoint is temporarily
unreachable. Free practice remains available, but the paid product does not
meet the offline/first-paint contract.

### High — a malformed backup is persisted and bricks `/practice`

Invalid JSON syntax is handled correctly. A syntactically valid file with only
the two expected top-level arrays is not validated below that level. This live
input was accepted:

```json
{"passages":[null],"sessions":[]}
```

The import path at `src/main.ts:475-483` assigns and persists the object before
rendering. The first render emitted:

```text
Cannot read properties of null (reading 'id')
```

After reload, `#app` was empty and the same uncaught page error occurred. The
bad object remained in IndexedDB, so the in-app clear/import recovery controls
were no longer reachable. Recovery requires browser-level site-data deletion.
This fails invalid-input recovery and risks making otherwise recoverable local
history inaccessible.

### High — the real 404 fails touch and 200% text-resize requirements

The live unknown route correctly returns HTTP 404, but Static Web Apps serves
`public/404.html` rather than the richer in-app 404. At both desktop and 390 px,
its only action, “Return home,” measures about 132 by 21 CSS px instead of the
required 44 px minimum height. At 390 px with 200% text, the page becomes 464 px
wide: 74 px of horizontal overflow. The 404 also omits the standard header,
footer, skip link, and product navigation required on every route.

Axe reports no serious/critical rule violation because target size and this
text-resize failure require manual checks. Screenshot evidence is
`.factory/evidence/verification-2/live-404-mobile-200pct.png`.

### High — the public claim set is not fully registered and proved

All 12 listed claim commands pass, but the required landing/README/legal-copy
cross-check still fails:

- Landing copy promises, “You can correct any take before saving.” Removal and
  re-capture work manually, but no `.factory/claims.json` entry or tagged claim
  test covers that promise.
- Privacy copy promises that license verification contacts Sociobot only after
  the user enters or buys a license. Fresh network logs support it, but it has
  no registered claim or recurring tagged test.
- Terms promise that a refunded or revoked license stops full-version access.
  The only license claim fixture is valid; no claim test transitions a cached
  valid license to revoked/invalid.
- `paid-passages` claims “unlimited saved passages,” while its sandbox and test
  create exactly two passages (`tests/e2e/claims.spec.ts:113-126`). That proves
  a second passage, not the advertised absence of a product cap.

The claims contract says unlisted public claims fail review and each tagged test
must assert the promised observable result. Manual observations do not replace
the missing recurring tests.

## Mandatory first-read and demo gate

**PASS.** A cold live visit answers all three questions in plain words:

- What: “Measure steadier practice takes.”
- For whom: “For beginning instrumentalists who want consistent timing across
  a short passage.”
- First action: “Try it with sample data,” followed by what appears.

At 390 by 844 px, the headline, audience sentence, action, and result sentence
all fit in the first viewport. The action begins at y=526 and is about 248 by
49 px. Screenshot evidence is
`.factory/evidence/verification-2/live-first-read-mobile.png`.

One click opens `/demo`, immediately showing “G major crossing,” six saved
sessions, 26 ms latest spread, and 52% improvement. The persistent demo banner
contains Reset demo and Start for real. Reset changed seven rows back to six;
Start for real removed the banner and opened empty real storage.

## Claims gate

`.factory/claims.json` exists. After `npm ci`, every exact declared command ran
individually from the demo entry point and passed in both configured projects:

| Claim | Fresh result |
| --- | --- |
| `sample-improvement` | PASS — 2/2 |
| `offline-reload` | PASS — 2/2 |
| `local-only` | PASS — 2/2 |
| `tap-capture` | PASS — 2/2 |
| `input-options` | PASS — 2/2 |
| `csv-export` | PASS — 2/2 |
| `data-backup` | PASS — 2/2 |
| `free-passage-limit` | PASS — 2/2 |
| `paid-passages` | PASS — 2/2, with the coverage defect above |
| `controlled-takes` | PASS — 2/2 |
| `demo-isolation` | PASS — 2/2 |
| `audio-not-recorded` | PASS — 2/2 |

The release still fails the claims contract because the copy cross-check and
test-sufficiency review above are part of that gate.

## Clean-checkout quality gates

Executed at candidate `602e4fca80252380cd7b654ee4283199c8c2f894`:

```text
npm ci                         PASS — 22 packages, 0 vulnerabilities
npm audit --audit-level=high  PASS — 0 vulnerabilities
npx tsc --noEmit              PASS
npm test                       PASS — 44 passed, 2 expected project skips
npm run build                  PASS — exact production build produced dist/
```

There is no lint script in `package.json`. Production output:

```text
dist/index.html                  1.85 kB (0.64 kB gzip)
dist/assets/app-CCwLzSCn.js     28.66 kB (10.60 kB gzip)
dist/assets/index-C3V7n6GS.css  21.58 kB (5.57 kB gzip)
dist/sw.js                       1.62 kB
```

## Deployment identity and HTTP behavior

**PASS.** Fresh local production output and the live deployment have identical
SHA-256 values for index, service worker, manifest, JS, CSS, hero image, font,
and both primary PWA icons. Selected values:

```text
index.html                    40662ee5ae258c15adcb9c73f906defa6f82b3a0594862c73a8e2fe300b6647f
sw.js                         ecef018b029b3e3e4974da6405a24f53a17d245fc15641d1a6fc163403e5801d
assets/app-CCwLzSCn.js        ef2db470e387053147840a57861580260d12245ee6f6350fb18710794efaaab2
assets/index-C3V7n6GS.css     09352d945b95389e40dff0e4fe9ebd2f11c0d51dfc9d5d31f43044ded6d8bdd6
manifest.webmanifest          4a03f151321e9ec1d4044e8f16b95d09061324ce2c4c5cd987c81915d6c98b13
```

`/`, `/demo`, `/practice`, `/privacy`, and `/terms` return 200. An unknown URL
returns 404. Hashed JS/CSS return one-year immutable caching; `sw.js` is
`no-cache, no-store`; the manifest is `no-cache, must-revalidate`. Documents
use a 30-second must-revalidate policy.

Live response headers include HSTS, `nosniff`, strict-origin referrer policy,
microphone-self/camera-off/geolocation-off permissions policy, and a CSP whose
only external connection/form origin is `https://api.sociobot.in`.

## End-to-end product behavior

Fresh live checks passed the useful practice loop:

- Created a 30 BPM, two-attack passage, captured six takes, marked one
  controlled, removed and re-recorded a take, saved a 5 ms session, reloaded,
  and found the row and controlled count intact.
- Created the 220 BPM, eight-attack maximum passage successfully.
- Used deterministic onset sets whose independently calculated standard spread
  is 6 ms; the live saved result was exactly 6 ms.
- Whitespace-only names receive an announced recovery message and focus; 29 and
  221 BPM are blocked as range underflow/overflow.
- Invalid JSON syntax recovers; structurally malformed JSON fails as documented.
- Denied microphone and unavailable MIDI paths give plain recovery messages and
  leave tap input available.
- CSV, valid JSON round-trip, clear, free limit, valid-license second passage,
  controlled mark, demo isolation, and no-recording behavior pass their claim
  tests.
- Browser back and forward restore the route title and focus the new h1.

Real acoustic audio and physical MIDI hardware were unavailable. Repository
fixtures cover permission, fake microphone, and MIDI-message paths; a hardware
smoke test remains useful.

## Accessibility, responsive behavior, and motion

Desktop and 390 px live checks covered `/`, `/demo`, `/practice`, `/privacy`,
`/terms`, and the real 404.

- All app routes have `lang=en`, one h1, one main, valid heading order,
  route-specific titles, labeled controls, no standard-width overflow, and no
  200% text overflow.
- Axe 4.10.2 found zero serious/critical violations on every route and profile.
- The factory URL verifier passed home and demo with no console/page errors;
  JSON evidence is in `.factory/evidence/verification-2/verify-*.json`.
- Keyboard-only setup and capture passed using Tab, Enter, and Space. Every
  focused app control showed the 3 px designed outline; observed colors were
  `#785600` on paper and `#F7DA71` on the dark instrument.
- All visible controls on app routes measured at least 44 by 44 CSS px.
- Reduced-motion emulation matched and reduced maximum animation/transition
  durations to 0.01 ms with automatic scrolling.
- A 4x CPU-throttled, slow-network sample-link interaction produced a 160 ms
  Event Timing duration, within the 200 ms interaction budget.

The static 404 exceptions are the release blocker described above. Its expected
404 main-document response also creates Chromium's standard failed-resource
console message; no application JavaScript error occurs there.

## PWA, privacy, and networking

- The manifest uses standalone display, a versioned practice start URL, matching
  palette colors, 192/512 icons, and maskable purpose.
- The live service worker activated and controlled `/demo`. Observed caches were
  `steady-take-CCwLzSCn-shell` and `steady-take-CCwLzSCn-runtime`.
- After a connected visit, offline reload preserved the seeded passage, all six
  sessions, the 26 ms/52% summary, and displayed “Offline now.”
- A local server using the exact candidate build supplied a changed service
  worker version. The new worker installed and the UI showed, “An update is
  ready. Reload when you finish this take.”
- A complete six-take live demo flow made four requests, all same-origin, with
  no failed responses. Home and idle app routes likewise made no unexpected
  external request. There are no analytics, trackers, CDN fonts/scripts, Azure
  model calls, or embedded payment-provider resources.
- License verification is the only observed runtime cross-origin request and
  occurs after explicit license submission. The cached-license offline defect
  is separate from the audio/history privacy behavior.

## Billing and rate limiting

The previous checkout deployment failure is resolved:

```text
GET /api/v1/products/music-practice-stability/checkout
303 Location: https://checkout.dodopayments.com/session/...
follow redirect: 200
```

A live invalid token produced the correct recovery UI and stored neither a
license nor a verdict. The hosted checkout itself was not paid through during
verification.

The license verify endpoint was freshly exercised from one client with 60
rapid sequential requests:

```text
requests 1-30: HTTP 200
requests 31-60: HTTP 429
Retry-After: 4
Access-Control-Allow-Origin: https://music-practice-stability.sociobot.in
```

Observed allowance: **30 accepted requests per window per client**. The 429 and
`Retry-After` requirement passes.

## Performance and bundle budgets

All static budgets pass: JS 28.66 kB, CSS 21.58 kB, font 67.30 kB, responsive
hero 21.97/44.83 kB, and measured first-load transfer 85-127 KiB.

Three fresh mobile Lighthouse runs were intentionally retained because the
first was a noisy outlier:

| Run | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 89 | 100 | 100 | 100 | 1.2 s | 420 ms | 0 |
| 2 | 99 | 100 | 100 | 100 | 1.5 s | 130 ms | 0 |
| 3 | 100 | 100 | 100 | 100 | 1.4 s | 30 ms | 0 |

Median performance is 99 and median LCP is 1.4 s, so the Lighthouse-class gate
passes despite one host-noise run below 90. Raw reports are under
`.factory/evidence/verification-2/lighthouse-live*.json`.

## Required remediation

1. Distinguish invalid/revoked license responses from network failures. Keep a
   cached valid license active offline and on transient verification failure.
2. Validate every imported passage, session, take, scalar, enum, and relationship
   before assigning or persisting it; reject invalid files without changing the
   last good data. Add a reload recovery test.
3. Make the deployed static 404 responsive at 200%, give Return home a 44 px
   target and visible designed focus, and include the required site skeleton.
4. Register and tag every public functional/privacy/license claim. Replace or
   rigorously test “unlimited,” and add cached-valid to invalid/revoked and
   offline paid-license cases.
5. Re-run every claim command, the full suite/build, live identity, both mobile
   accessibility checks, offline paid behavior, checkout/rate limit, and the
   three-run Lighthouse sample.
