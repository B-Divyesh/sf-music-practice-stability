# Independent product verification — FAIL

Date: 2026-08-28 UTC

Work order: `music-practice-stability-verify-1`

Candidate: `f7b0742fe18a2781b07e36907ce83693f9586bff`

Live URL: `https://music-practice-stability.sociobot.in`

## Verdict

**FAIL — do not release.**

The candidate build is functional, fast, and byte-for-byte deployed, but the
advertised purchase action returns HTTP 404. The release also misses the
non-negotiable touch-target and focus-contrast requirements, accepts a blank
passage name, has unlisted public claims, and ships dead/incorrect links and
cache behavior. These are fresh observations from the candidate and live URL,
not a restatement of the builder handoff.

## Release-blocking findings

### Critical — the advertised purchase cannot be completed

The landing page offers “Buy the full version” for a $12 one-time purchase.
Its production target is:

`https://api.sociobot.in/api/v1/products/music-practice-stability/checkout`

Fresh GET result:

```text
HTTP/2 404
content-type: application/json

{"error":"enabled factory product","status":404}
```

The buyer reaches an API error instead of hosted checkout. The product is not
end-to-end complete under the paid-unlock contract. The builder handoff's note
that registration was still required is therefore a current production defect,
not a resolved deployment-only issue.

### High — required accessible target sizes and focus contrast fail

At 390 px, measured visible targets include:

- Header links: 20–26 px high.
- Footer links: 23 px high.
- “Read the chart as text”: 20 px high.
- The privacy/terms email link: 19 px high.
- “Start for real”: 22 px high.
- Captured-take remove controls: 32 by 32 px in the candidate CSS.

These are below the required 44 by 44 CSS px target. The 3 px focus outline is
visible, but its gold `#D8A928` color has only 1.92:1 contrast against the paper
`#F4F0E6`, below the required 3:1 focus-indicator contrast. Axe does not detect
either manual criterion.

### High — public claims are missing from the claim registry

All listed claims passed, but public copy contains additional testable promises
without a corresponding `.factory/claims.json` entry and tagged test. Examples:

- Landing/README: users can mark takes as controlled.
- README: demo mode never reads or writes real practice data.
- Landing/README: audio is analysed in memory and is not recorded.
- Landing/README: the full version adds “complete history.”

The controlled-mark and demo-isolation behavior passed manual checks, but the
claims contract requires those promises to be listed and exercised on every
build. “Complete history” is also not represented by the paid-passages test or
by a distinct paid behavior.

## Other findings

### Medium — whitespace creates a blank passage

Entering three spaces in the required Passage name field and submitting creates
an instrument with an empty heading and the notice ` is ready.`. Empty input and
29 BPM are correctly blocked by native validation, and the documented 30/220
BPM and 2/8 attack boundaries work. Trimmed empty input needs explicit rejection
and an announced recovery message.

### Medium — unknown URLs return HTTP 200

`/definitely-missing` renders the designed “This page missed the count” screen,
but the network response is HTTP 200. This is a soft 404 and does not meet the
real-404 routing requirement.

### Medium — the Param Factory footer link is dead

Every internal link returned 200. `https://paramfactory.com/` failed DNS lookup
(`Could not resolve host`). The checkout link separately returns 404 as noted
above.

### Medium — production assets lack immutable caching

The document, JavaScript, CSS, font, images, manifest, and service worker all
return `Cache-Control: public, must-revalidate, max-age=30`. Application assets
also use fixed names such as `assets/app.js`. This does not satisfy the required
long-lived immutable caching policy for versioned production assets.

### Low — home has slight overflow at 200% text size

At 390 px with the root text size doubled, the home page measured 393 px of
scroll width in a 390 px viewport. The other tested routes remained at 390 px.

## Mandatory first-read and demo gate

**PASS.** After a cold browser navigation completed, the first screen said:

- What: “Measure steadier practice takes,” with timing spread explained below.
- For whom: “For beginning instrumentalists who want consistent timing across
  a short passage.”
- What to click: “Try it with sample data.”

That action is visible on desktop and at 390 px and opens `/demo` in one click.
The result immediately shows “G major crossing,” six sessions, the 54 ms to
26 ms trend, and the persistent “Demo — sample data, nothing is saved” banner
with Reset demo and Start for real actions.

## Claims gate

`.factory/claims.json` exists. After the clean dependency install, every exact
command passed in both configured Playwright projects:

| Claim | Result |
| --- | --- |
| `sample-improvement` | PASS — 2/2 |
| `offline-reload` | PASS — 2/2 |
| `local-only` | PASS — 2/2 |
| `tap-capture` | PASS — 2/2 |
| `input-options` | PASS — 2/2 |
| `csv-export` | PASS — 2/2 |
| `data-backup` | PASS — 2/2 |
| `free-passage-limit` | PASS — 2/2 |
| `paid-passages` | PASS — 2/2 with a fixture verify response |

The first literal pre-install invocation could not load `@playwright/test`, as
expected in a clone without `node_modules`. `npm ci` installed the pinned
dependency cleanly; all claim commands then executed and passed. No claim result
above relies on the pre-install attempt.

## Clean-clone quality gates

Executed at the exact candidate commit:

```text
npm ci                         PASS — 22 packages, 0 vulnerabilities
npm audit --audit-level=high  PASS — 0 vulnerabilities
npm test                       PASS — 30/30 in 1.1 minutes
npx tsc --noEmit               PASS
npm run build                  PASS
```

No lint script exists in `package.json`.

Fresh production output:

```text
dist/index.html       1.83 kB (0.62 kB gzip)
dist/assets/app.css  20.58 kB (5.37 kB gzip)
dist/assets/app.js   28.31 kB (10.46 kB gzip)
```

The JavaScript, CSS, font, and image budgets pass. The self-hosted font is
67,304 bytes; the responsive hero files are 21,972 and 44,826 bytes.

## Deployment identity

**PASS.** A fresh local production build was compared with the live deployment.
Ten primary artifacts matched byte-for-byte: index, app JavaScript, app CSS,
service worker, manifest, both hero images, font, and 192/512 icons. Selected
SHA-256 values:

```text
index.html       27f3d1019332389e67c854450a0d556a0e5c4032fdf066ae221d548a900b3edd
assets/app.js    71a53ca303ec01512263a26bdccc059111a118a4573cc1f4aae1047d7d8fafec
assets/app.css   4330aaae0cf3988f2db4e1a6e80b2c00204209ee25f0b5f0c6ba54b4b1f11149
sw.js            c0c177a43f15cdfb26ab94ab401c928bc6c35d1725ee52dc8beb626d2f7f120c
```

This proves the live static artifact matches candidate `f7b0742…` despite the
footer exposing only product build `v1.0.0`.

## End-to-end behavior

The following independent live checks passed:

- Created passages at 30 BPM / 2 attacks and 220 BPM / 8 attacks.
- Reload preserved the passage in IndexedDB.
- Captured six tap takes, marked two controlled, removed and recaptured a take,
  saved the session, and observed a six-take row with two controlled marks.
- CSV and JSON export/import/clear paths passed the clean local claim suite.
- Invalid JSON produced a plain recovery message and left the form usable.
- Denied microphone permission produced a recovery message and kept tap input.
- Missing MIDI produced a recovery message and kept tap input.
- Free mode blocked a second passage; fixture-backed valid licensing allowed it.
- A live invalid license returned `{valid:false, reason:"invalid"}`, showed the
  correct UI error, and stored no license.
- Demo reset, Start for real, browser back, and stable route focus worked.
- Demo sessionStorage and real IndexedDB data remained isolated.

Real acoustic audio and physical MIDI hardware were unavailable. Those paths
were checked with browser permission failure and the repository's fake-device
and MIDI-fixture integration tests.

## Accessibility and responsive review

Desktop and 390 px checks covered `/`, `/demo`, `/practice`, `/privacy`,
`/terms`, and an unknown route.

- Exactly one `h1` and one `main` on every route; heading order is valid.
- Route-specific titles and `lang="en"` are present.
- No standard-width horizontal overflow.
- Skip link moves focus to `main`; tab order is logical; Enter/Space paths work.
- Visible focus style is present, subject to the contrast defect above.
- `prefers-reduced-motion: reduce` removes smooth scrolling and reduces
  transitions/animations to 0.01 ms.
- Axe 4.10 reported 0 violations, including 0 serious/critical, on every tested
  product route in the live mobile check.
- The supplied URL verifier reported no console/page errors, one h1, main,
  English language, complete image alt text, and labeled buttons on home/demo.
- Manual touch-target and focus contrast checks failed as documented.

## PWA and offline behavior

- Manifest loads with standalone display, versioned start URL, correct colors,
  and valid 192/512 icons; the 512 icon includes maskable purpose.
- The live service worker activates and controls the page.
- Cache names observed: `steady-take-v1-shell` and
  `steady-take-v1-runtime`.
- After a connected `/demo` visit, offline reload retained the passage, six
  seeded sessions, 26 ms summary, and displayed “Offline now.”
- A controlled service-worker byte change installed successfully and surfaced
  “An update is ready. Reload when you finish this take.”

## Privacy, network, and response policy

- Home, demo, practice, privacy, terms, and error routes produced no console or
  page errors and no unexpected outbound requests.
- The sample interaction made only same-origin requests. No analytics,
  telemetry, CDN font/script, Azure endpoint, or embedded payment provider is
  present.
- The only runtime cross-origin integration in the product code is the explicit
  Sociobot checkout/license service.
- Live headers include HSTS, `X-Content-Type-Options: nosniff`, strict-origin
  referrer policy, a microphone-self/camera-off/geolocation-off permissions
  policy, and a restrictive CSP allowing connections only to self and
  `api.sociobot.in`.

## API rate limiting

The read-only license verify endpoint was tested with one baseline request and
a rapid 160-request burst from the verifier IP:

```text
Baseline: 200, valid=false, reason=invalid
Burst: 29 x 200, 131 x 429 in 1.376 seconds
First 429: burst request 30 (the 31st request including baseline)
Retry-After: 4 seconds, then 3 seconds
CORS: Access-Control-Allow-Origin matched the product origin
```

Rate limiting therefore passes at an observed threshold of 30 accepted requests
per window, with the required `Retry-After` header.

## Fresh Lighthouse result

Mobile simulated throttling against the live home page:

```text
Performance     91
Accessibility  100
Best practices 100
SEO            100
FCP             0.9 s
LCP             1.5 s
TBT             380 ms
CLS             0
Speed Index     1.1 s
Total transfer  127 KiB
```

Lighthouse did not provide a lab INP value because no interaction trace was
recorded. The specified performance, LCP, CLS, and transfer budgets pass.

## Required remediation before re-verification

1. Register/enable the production Sociobot product and prove checkout reaches
   hosted checkout and returns a usable license.
2. Make every interactive target at least 44 by 44 px and use a focus indicator
   with at least 3:1 contrast on every surface.
3. Add claim entries and tagged tests for every public promise, or remove the
   promises. Resolve the “complete history” paid copy specifically.
4. Reject trimmed-empty passage names with an announced recovery message.
5. Return a real 404 status, repair/remove the dead Param Factory link, and add
   versioned immutable asset caching.
6. Re-run every claim command, the full suite, production build, live browser
   matrix, offline/update checks, checkout, rate-limit burst, and Lighthouse.
