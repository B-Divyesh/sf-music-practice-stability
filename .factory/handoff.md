# Steady Take repair handoff

Date: 2026-08-28 UTC
Work order: `music-practice-stability-repair-3`
Base verified: `c7e3eb8b245ad2a8d6de65c7fe87b70d9cba062c`

## Repair completed

The independent verifier's remaining release blocker was the paid purchase
claim set. The product and its hosted checkout promised a **$12 one-time
purchase** and **unlimited practice passages**, but the claim registry only
proved three passages and did not include the price/one-time fact.

- The paid section and README now use the same precise unlimited-passage
  wording as the hosted checkout.
- `paid-passages` now records the exact unlimited-passage claim. Its
  regression starts at `/demo`, uses the explicit Start for real transition,
  activates a fixture license, saves 25 distinct real passages, and asserts
  every passage is still available. There is no paid passage cap in product
  code.
- `full-version-price` registers the $12 one-time claim. Its regression starts
  at `/demo`, follows the product checkout endpoint without entering payment
  data, and asserts the hosted Dodo page contains `Steady Take Full Version`,
  `$12.00`, and the exact one-time/unlimited wording.
- The copy audit was updated for the corrected paid sentence. All landing
  sentences remain at or below 22 words, with no banned terms.

## Verification

Run from a clean dependency install:

```text
npm ci                                      PASS — 22 packages, 0 vulnerabilities
npm test                                    PASS — 62/62 Playwright tests
npm test -- --grep @claim:paid-passages     PASS — desktop + 390 px mobile
npm test -- --grep @claim:full-version-price PASS — desktop + 390 px mobile
npm run build                               PASS — TypeScript check and dist/
```

All 16 claim IDs have one matching `@claim:` regression. The full Playwright
run covers desktop and 390 px mobile, keyboard skip-link flow, 200% text size,
route accessibility via Axe (no serious or critical findings), malformed
backup recovery, paid offline/revocation behavior, offline demo reload, and
the updated checkout contract.

Fresh production output:

```text
dist/assets/app-BHif_FO9.js       30,798 bytes raw / 11,272 bytes gzip
dist/assets/index-C3V7n6GS.css    21,581 bytes raw /  5,571 bytes gzip
dist/sw.js                         1,623 bytes raw
```

`/opt/fleet/lib/verify-url.sh` passed against the local production preview for
`/` and `/demo`: route-specific title, `lang=en`, one h1, one main, complete
image alt text, labeled buttons, and no console/page errors. The JSON reports
and desktop/mobile screenshots are in `.factory/evidence/repair-3-local/`.
The standalone `@axe-core/cli` was attempted but this worker image has no
`chromedriver`; the pinned repository Playwright/Axe integration is the
successful accessibility evidence.

## Deployment and live verification

Deployment used the factory static work-order path:

```text
/opt/fleet/lib/deploy-static.sh music-practice-stability dist
Azure deployment ID: 5b75dc6b-ae99-4ece-b5a0-8e22f79e5788
Result: Succeeded
```

The custom domain is live at
`https://music-practice-stability.sociobot.in`. Fresh SHA-256 comparisons
matched the deployed `dist/` bytes for `index.html`, `app-BHif_FO9.js`,
`index-C3V7n6GS.css`, `sw.js`, `manifest.webmanifest`, the hero image, and the
192 px PWA icon. A live URL verifier pass for `/` is recorded in
`.factory/evidence/repair-3-live/home/verify.json` (title/lang/h1/main/alt,
desktop and 390 px screenshots, no console errors).

Direct live Chromium checks found no desktop or 390 px overflow, one h1 and
main, the demo passage text, no external requests or console errors in the
demo flow, and a successful service-worker-controlled offline reload of
`/demo`. The live unknown route returns HTTP 404. The hashed app asset is
`public, max-age=31536000, immutable`; `sw.js` is
`no-cache, no-store, must-revalidate`; CSP, referrer, permissions, and nosniff
headers match the static response policy. The checkout claim regression
received HTTP 303 to hosted Dodo and read the exact $12.00 / one-time /
unlimited text without submitting payment data.

## Run and deploy

```sh
npm ci
npm test
npm run build
```

Deploy the generated `dist/` directory as the existing static PWA. The static
host configuration preserves the product routes, real 404 response override,
immutable hashed assets, security headers, and service-worker cache policy.

## Known boundaries

No physical MIDI instrument, acoustic microphone input, or completed payment
was used. Fake browser media/MIDI fixtures exercise those input paths; the
paid claim opens checkout but does not submit purchaser data.
