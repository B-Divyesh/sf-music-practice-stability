# Steady Take repair handoff — PASS

Date: 2026-08-28 UTC

Work order: `music-practice-stability-repair-1`

Baseline verifier commit: `f49bad0d16acd78bdfbfbacf5737522cec8d2f00`

Repair commit: `4334d9d` (`fix: repair verified release blockers`)

Live URL: https://music-practice-stability.sociobot.in

## Result

All documented release blockers were repaired and the committed production
artifact was deployed as the same static PWA. The live checkout now redirects
to hosted Dodo checkout (HTTP 303, then HTTP 200), and the product has an
enabled $12 one-time Sociobot factory registration. No payment credential or
payment-provider integration was added to the client.

## Repairs

- Registered the live `music-practice-stability` factory product for the $12
  Steady Take Full Version unlock. The existing client checkout URL remains
  `https://api.sociobot.in/api/v1/products/music-practice-stability/checkout`.
- Made visible header, footer, demo, legal, chart-summary, controlled-mark,
  and remove controls at least 44 by 44 CSS px at 390 px. The controlled check
  box now has a 44 px hit target with a compact custom visual.
- Replaced the paper focus ring with `#785600` (5.90:1 on paper; 3.08:1 on the
  gold demo bar), and use `#F7DA71` (9.44:1 on night) inside dark surfaces.
- Added three missing public claims and tagged sandbox coverage for controlled
  marks, demo isolation, and in-memory/non-recorded microphone input. Removed
  the unsupported “complete history” paid-copy promise.
- Reject whitespace-only passage names, announce the recovery message, and
  restore focus to the field.
- Replaced the dead `paramfactory.com` footer target with the live Param
  Factory catalog at `https://hello-factory.sociobot.in/`.
- Switched app JS and CSS to content-hashed names and generate `sw.js` at
  build time so its precache tracks those exact assets. Static-host routes now
  explicitly rewrite only real SPA routes; unknown URLs receive the designed
  `/404.html` with an HTTP 404 response. Hashed `/assets/*` and `/icons/*`
  carry `Cache-Control: public, max-age=31536000, immutable`.
- Removed the 3 px 200%-text overflow at a 390 px viewport.

## Verification

Fresh local checks:

```sh
npm ci                              # 22 packages installed
npm audit --audit-level=high        # 0 vulnerabilities
npm test                            # 44 passed, 2 expected project-scoped skips
npx tsc --noEmit                    # pass
npm run build                       # pass; dist/ is produced
```

The 12 registered claim tests all pass in both desktop Chromium and the 390 px
mobile project. The full suite includes exact regressions for the whitespace
name, all visible touch targets, 200% text zoom, static 404/cache routing, and
the live checkout redirect.

Live checks after deployment:

- `/`, `/practice`, `/demo`, `/privacy`, and `/terms` return 200; an unknown
  route returns **404** and the designed “This page missed the count” page.
- `/assets/app-CCwLzSCn.js` and `/assets/index-C3V7n6GS.css` return 200 with
  immutable one-year caching. `sw.js` is no-cache and the manifest is
  must-revalidate.
- The checkout endpoint returns 303 to `checkout.dodopayments.com`; following
  it returns 200.
- Local and live SHA-256 values match for index, service worker, manifest,
  application JS/CSS, hero image, font, and both PWA icons.
- `/opt/fleet/lib/verify-url.sh` passed for home and demo: titles, `lang=en`,
  one h1, main landmark, image alt text, labeled buttons, and no console/page
  errors. Evidence is under `.factory/evidence/repair-home` and
  `.factory/evidence/repair-demo`.
- Live Axe scans found 0 serious/critical violations on `/`, `/demo`,
  `/practice`, `/privacy`, and `/terms` at desktop and 390 px. Manual target
  measurements found no visible control below 44 px. Keyboard skip-link focus
  and 200% text zoom passed live.
- Fresh live `/demo` loaded under the activated service worker and reloaded
  offline with the seeded passage and the 26 ms / 52% trend. Observed caches:
  `steady-take-CCwLzSCn-shell` and `steady-take-CCwLzSCn-runtime`.
- The sample network flow made only same-origin requests. Live CSP,
  referrer-policy, and microphone/camera/geolocation permissions policy are
  present.
- Mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; FCP 0.9 s, LCP 1.5 s, CLS 0, transfer 127 KiB. JSON evidence:
  `.factory/evidence/repair-lighthouse.json`.

## Run and deploy

```sh
npm ci
npm test
npx tsc --noEmit
npm run build
/opt/fleet/lib/deploy-static.sh music-practice-stability dist
```

## Known gaps

Physical acoustic input and real MIDI hardware were unavailable in this
container. The browser permission-failure and fake-device/MIDI fixture paths
remain covered. A real instrument and MIDI-device smoke test is still useful
before a future major release.
