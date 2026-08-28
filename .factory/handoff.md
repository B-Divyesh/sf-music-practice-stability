# Steady Take adversarial review handoff

Date: 2026-08-28 UTC

Work order: `music-practice-stability-review-1`

Candidate reviewed: `7cfbc65ecc1e613e0f49a0140ae16d7889896fb1`

## Outcome

**FAIL** — `.factory/review-1.md` records 16 findings: one blocking, four
major, and eleven minor. Product code was not modified.

The blocker is the one-click demo presentation: its promised 26 ms / 52%
improvement result is 2,295 px down the 390 px page rather than visible in the
first post-click viewport. Unlisted microphone, storage-fallback, and payment
claims also prevent acceptance.

## Verification performed

- Opened the live home and demo cold at 390 × 844 and 1440 × 900.
- Exercised demo add/reset, real/demo isolation, direct demo entry, and live
  service-worker offline reload.
- Recorded the live demo request stream and confirmed same-origin-only traffic.
- Ran all 16 claim commands separately from a fresh `--no-local` clone: 32/32
  desktop/mobile executions passed.
- Ran the complete clean-clone suite: 61 passed, 1 intentional duplicate static
  check skipped.
- Ran `npm run build`: passed and produced `dist/`; app JS was 11.27 kB gzip.
- Crawled live links and routes, checked status, titles, h1/main/lang,
  canonicals, metadata, headers, keyboard route focus/back behavior, and the
  designed 404.
- Ran live Axe checks on all routes and the 404 at desktop and mobile sizes:
  zero serious/critical findings.
- Ran `/opt/fleet/lib/verify-url.sh` against the live home: passed with no
  console errors.
- Read the brief, design, claims, demo record, README, source, tests, and the
  prior handoff. No earlier review or polish file exists.

## Reproduce

```sh
npm ci
npm test
npm run build
```

Claim commands are listed in `.factory/claims.json`. The complete first-read,
copy audit, finding details, claim results, history check, and required fixes
are in `.factory/review-1.md`.

## Next step

Address every finding, deploy the repaired candidate, and rerun the full review
from scratch. Do not treat the passing existing suite as acceptance: it does
not cover the demo first viewport or the unlisted claims identified here.
