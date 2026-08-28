# Independent product verification 3 — FAIL

Date: 2026-08-28 UTC
Work order: `music-practice-stability-verify-3`
Candidate: `c7e3eb8b245ad2a8d6de65c7fe87b70d9cba062c`
Live URL: <https://music-practice-stability.sociobot.in>

## Verdict

**FAIL — do not release until the paid purchase claims are registered and
proved.**

The prior deployment-only concern is not present. The live root HTML,
`/assets/app-KLmQtiuR.js`, and `/sw.js` SHA-256 values exactly match this
candidate's fresh `dist/` build. The product works through its central practice
loop and the deployed PWA passed the functional, accessibility, privacy,
offline, and header checks below. It nevertheless fails the mandatory claims
contract: public purchase facts a visitor can rely on are absent from
`.factory/claims.json` and therefore have no recurring tagged sandbox proof.

No product code was modified during verification.

## Release-blocking finding

### High — paid price and unlimited-passage promise are unregistered claims

The landing page and README state that the full version is a **$12 one-time
purchase**. That exact price/one-time promise has no corresponding entry in
`.factory/claims.json` and no `@claim:` test. The hosted checkout reached by
the product's own **Buy the full version** action independently presents:

```text
Steady Take Full Version
$12.00
One-time unlock for Steady Take. Saves unlimited practice passages on this device.
```

The checkout statement is also a public, product-linked claim. The only
related registered claim is `paid-passages`, whose weaker wording is “saves
more than one passage”; its test saves three passages. That does not prove the
checkout's unlimited-passage promise, and it does not prove the $12 one-time
purchase fact. The claims contract requires every visitor-reliant statement to
be listed and asserted from the demo entry point; it explicitly treats an
unlisted claim as a failing review. The observed checkout currently agrees
with the landing price, but an observation is not recurring proof.

Repair by either registering and testing the exact price/one-time and
unlimited-passage claims (including an observable sandbox assertion suited to
the promise), or narrowing/removing the public wording so it matches a
registered, testable claim. Re-verify all claims after that change.

## Required claims run first

From the clean candidate, I ran every command in `.factory/claims.json`
serially before broader QA. All commands completed successfully; each runs the
Chromium desktop and 390 px mobile project, for 30 passing claim executions.

| Claim ID | Result |
| --- | --- |
| `sample-improvement` | PASS |
| `offline-reload` | PASS |
| `local-only` | PASS |
| `tap-capture` | PASS |
| `input-options` | PASS |
| `csv-export` | PASS |
| `data-backup` | PASS |
| `free-passage-limit` | PASS |
| `paid-passages` | PASS (proves three passages, not unlimited) |
| `controlled-takes` | PASS |
| `demo-isolation` | PASS |
| `audio-not-recorded` | PASS |
| `take-correction` | PASS |
| `license-on-demand` | PASS |
| `revoked-license` | PASS |

## First-read and demo gate

**PASS.** A cold live landing page plainly says **“Measure steadier practice
takes”**, says it is **“For beginning instrumentalists who want consistent
timing across a short passage,”** and gives the first action **“Try it with
sample data”** with the immediate outcome **“See six sessions and a 52% drop
in timing spread.”** The action opens `/demo` in one click.

The live demo has six realistic seeded sessions, a persistent **“Demo — sample
data, nothing is saved”** banner, **Reset demo**, and **Start for real**. A
fresh 390 px context observed six table rows and no viewport overflow.

## Local clean-build evidence

```text
npm ci                         PASS — 22 packages installed; 0 vulnerabilities
npm test                       PASS — 62/62 Playwright tests
npm run build                  PASS — typecheck plus production dist/
```

There is no separate lint script; `npm run build` runs `tsc --noEmit` before
Vite's exact production build. Fresh output budgets:

```text
JavaScript: 30,777 bytes raw / 11,232 bytes gzip
CSS:        21,581 bytes raw / 5,596 bytes gzip
Font:       67,304 bytes raw
Service worker: 1,623 bytes raw
```

These are below the static PWA JS/CSS/font budgets.

## Independent live functional checks

- `/practice`: whitespace-only passage name produced the announced recovery
  message “Enter a passage name, then save the passage.” and returned focus to
  the name field. A normal four-attack passage was created; six tap takes were
  captured, including a controlled mark. The complete capture/save, export,
  import, limit, MIDI/microphone fixture, correction, and revocation paths are
  also covered by the passing clean-build claim suite.
- PWA: live `/demo` registered one active service worker. After one online
  reload, a fresh context was set offline and reloaded successfully with its
  `/demo` heading and all six seeded rows. `sw.js` is no-store, uses
  versioned shell/runtime caches, `skipWaiting`, `clientsClaim`, and the app
  has an `updatefound` notice (“An update is ready. Reload when you finish this
  take.”).
- Payment integration: the live checkout endpoint returned HTTP 303 to hosted
  Dodo checkout; the destination returned HTTP 200 and displayed the product
  and price above. No card details were entered.
- Rate allowance: 30 sequential harmless invalid-license verification requests
  returned 200; request **31** returned **429** with `Retry-After: 4`. The
  documented/observed allowance is therefore 30 requests for that short window.

## Privacy, security, and accessibility evidence

- A fresh live `/demo` request log contained only same-origin document, JS,
  CSS, and self-hosted font requests. It made no third-party request; console
  and page-error logs were empty. The page's explicit license-on-demand test
  separately verifies the Sociobot request is only made after token entry.
- Live response headers include HSTS, CSP, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, and
  `Permissions-Policy: camera=(), geolocation=(), microphone=(self)`.
  Hashed application assets are `max-age=31536000, immutable`; `sw.js` is
  `no-cache, no-store, must-revalidate`; the manifest is revalidated.
- Independent Axe scans found zero serious or critical violations on `/`,
  `/practice`, `/demo`, `/privacy`, `/terms`, and the real HTTP 404 route.
  Each regular route had `lang=en`, exactly one `<main>`, exactly one `<h1>`,
  its route-specific title, no console/page errors, no 390 px overflow, and no
  overflow after 200% text sizing. The 404's only console error is the browser
  reporting its intentional HTTP 404 navigation, not a script/page exception.
- Keyboard-only smoke test: the first Tab reaches **Skip to main content** and
  Enter places focus on `#main`; focus is visibly styled. At reduced-motion,
  live animation and transition durations resolve to `0.00001s`.

## Deployment parity

Fresh SHA-256 comparisons:

```text
live /                       = dist/index.html
live /assets/app-KLmQtiuR.js = dist/assets/app-KLmQtiuR.js
live /sw.js                  = dist/sw.js
```

The live root and application routes return HTTP 200; an unknown route returns
the designed HTTP 404. `/robots.txt`, `/sitemap.xml`, manifest, favicon, and
legal/demo/practice routes all return HTTP 200.

## Known test boundaries

No physical instrument/MIDI device or completed payment was used. Microphone
and MIDI flows use the repository's fake-device fixtures; payment verification
used hosted-checkout inspection without submitting purchaser data.
