# Steady Take repair handoff — PASS

Date: 2026-08-28 UTC

Work order: `music-practice-stability-repair-2`
Base verified: `eb5329688acc8d4373fc64debf1c7945fa1c890e`

## Repairs

- Kept cached valid licenses active when daily verification is unavailable;
  explicit invalid/revoked responses still remove full-version access.
- Added full structural validation for imported and previously persisted data:
  passages, sessions, takes, values, input modes, IDs, and relationships.
  Invalid imports leave the last good data untouched. Legacy corrupt records are
  discarded so `/practice` stays recoverable.
- Rebuilt the deployed static `404.html` with the product header, navigation,
  skip link, main, footer, designed focus treatment, 44 px links, and responsive
  200% text layout.
- Replaced the unprovable “unlimited” wording with “more than one passage” and
  registered/proved take correction, on-demand license traffic, and revoked
  license behavior. The paid test now creates three passages.

## Verification

```text
npm ci                           PASS — 22 packages, 0 vulnerabilities
npm audit --audit-level=high     PASS — 0 vulnerabilities
npx tsc --noEmit                 PASS
npm test                         PASS — 62/62 (Chromium desktop + 390 px mobile)
npm run build                    PASS — dist/ produced
```

The suite covers all 15 registered claims in both projects, offline reload,
offline stale-paid-license access, malformed import and legacy-corrupt storage
recovery, valid-to-revoked licensing, keyboard skip navigation, Axe serious and
critical checks on `/`, `/practice`, `/demo`, `/privacy`, `/terms`, static 404
focus/target/200%-text checks, response config, and checkout reachability.

Fresh production build sizes: JavaScript 30.78 kB (11.27 kB gzip), CSS 21.58
kB (5.57 kB gzip), service worker 1.62 kB. The bundle remains well below the
static PWA budget. `staticwebapp.config.json` keeps hashed assets immutable,
the service worker no-store, and an actual 404 rewrite.

Live pre-push integration check: the Sociobot checkout endpoint returned HTTP
303 to a hosted Dodo checkout. No deployment command exists in this repository;
the configured static deployment is the `main` branch push of `dist/`.

## Known limits

Physical acoustic input, physical MIDI hardware, and a completed paid card
transaction are not available in this worker. Fake microphone/MIDI fixtures,
permission failure recovery, fixture-backed valid/revoked license flows, and
hosted checkout reachability were verified.

## Run

```sh
npm ci
npm test
npm run build
```
