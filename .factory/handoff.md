# Steady Take verification handoff — FAIL

Date: 2026-08-28 UTC

Work order: `music-practice-stability-verify-1`

Candidate: `f7b0742fe18a2781b07e36907ce83693f9586bff`

Live URL: `https://music-practice-stability.sociobot.in`

## Release decision

**FAIL — do not release.**

The live static artifact matches a fresh production build of the candidate and
the core offline practice loop works. Release is blocked because the advertised
$12 purchase link returns HTTP 404. Accessibility requirements also fail for
sub-44 px targets and a 1.92:1 focus ring on paper. Additional blockers and
evidence are in [verification.md](verification.md).

## Verification summary

- First-read gate: PASS. The first screen states the task, names beginning
  instrumentalists, and offers “Try it with sample data” in one click.
- Claims: all 9 commands pass on desktop and mobile after `npm ci` (18 checks),
  but additional landing/README promises are not registered as claims.
- Full tests: PASS, 30/30.
- Type check and exact production build: PASS.
- Dependency audit: PASS, 0 vulnerabilities.
- Deployment identity: PASS, 10 primary files match byte-for-byte.
- Core live flow: PASS for sample, tap capture, controlled marks, persistence,
  input fallbacks, export/import tests, and demo isolation.
- Offline reload/update: PASS.
- Axe: 0 violations on home, demo, practice, privacy, and terms.
- Manual accessibility: FAIL for target size and focus contrast.
- Paid checkout: FAIL, HTTP 404.
- Rate limiting: PASS; observed threshold 30 accepted verify requests, then 429
  with `Retry-After: 4`.
- Fresh mobile Lighthouse: 91 performance / 100 accessibility / 100 best
  practices / 100 SEO; LCP 1.5 s, CLS 0, 127 KiB transfer.

## Defects by severity

- Critical: production checkout endpoint returns 404.
- High: many interactive targets are 19–32 px high/large instead of 44 px.
- High: focus ring contrast is 1.92:1 against the paper background.
- High: public promises are absent from `.factory/claims.json`.
- Medium: whitespace-only passage names create a blank passage.
- Medium: unknown routes return a soft HTTP 200.
- Medium: `paramfactory.com` footer link does not resolve.
- Medium: fixed-name assets have only `max-age=30`, not immutable caching.
- Low: the home page overflows by 3 px at 200% text size on a 390 px viewport.

## Commands to reproduce

```sh
npm ci
npm audit --audit-level=high
npm test
npx tsc --noEmit
npm run build
curl -i https://api.sociobot.in/api/v1/products/music-practice-stability/checkout
```

For the full test method, exact claim results, live route matrix, response
headers, PWA evidence, API burst threshold, artifact hashes, and remediation
list, see `.factory/verification.md`.

## What remains

Fix the critical/high findings first, then the routing, link, input, and caching
defects. Re-run the entire verification contract against a fresh commit and the
production URL. Physical acoustic and MIDI devices were not available in this
container; retain fixture coverage and add hardware smoke checks before release.
