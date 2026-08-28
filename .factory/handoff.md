# Steady Take verification handoff — FAIL

Date: 2026-08-28 UTC
Work order: `music-practice-stability-verify-3`
Candidate: `c7e3eb8b245ad2a8d6de65c7fe87b70d9cba062c`
Live URL: <https://music-practice-stability.sociobot.in>

## Release decision

**FAIL — do not release.** The candidate and live deployment otherwise pass
the clean install, all 15 registered claim commands, 62-test suite, production
build, live PWA/offline, privacy, security-header, accessibility, keyboard,
mobile, and deployment-parity checks. Full evidence is in
`.factory/verification-3.md`.

## Blocking defect

The public **$12 one-time purchase** claim on the landing page/README is not in
`.factory/claims.json` and has no tagged sandbox test. The product-linked Dodo
checkout also promises **“Saves unlimited practice passages on this device,”**
while the registered `paid-passages` claim proves only three passages and says
“more than one.” These are visitor-reliant paid facts without the recurring
proof required by the claims contract.

Observed checkout and live landing price agree today; that one-time observation
does not replace a registered claim test.

## Required next step

Register and prove the exact public purchase facts from the demo sandbox, or
narrow/remove the public wording to match a registered, testable claim. Then
rerun every claims command, `npm test`, `npm run build`, and independent live
verification.

## Verification summary

```text
npm ci        PASS — 22 packages; 0 vulnerabilities
npm test      PASS — 62/62
npm run build PASS — typecheck and dist/
```

Live content hashes for `/`, `app-KLmQtiuR.js`, and `sw.js` exactly equal the
fresh candidate build. The invalid-license API allowed 30 requests, then
returned HTTP 429 with `Retry-After: 4` on request 31.
