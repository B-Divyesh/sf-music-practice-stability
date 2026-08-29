# Adversarial first-read review 5 — Steady Take

Date: 2026-08-29 UTC

Work order: `music-practice-stability-review-5`

Candidate: `ae98592e542738763771da97394cf7b7bbe7e7c1`

Live URL: <https://music-practice-stability.sociobot.in>

## Verdict

**PASS**

There are zero findings, no failing or skipped claim test, and no unlisted
claim. All 25 earlier findings remain fixed on the live site and in the
candidate code.

## First read before scrolling

Fresh Chromium contexts with no reused storage, cookies, or service workers
were opened at 390 × 844 and 1440 × 900. Before scrolling or interacting, the
page answered all three required questions:

- What it does: measures timing consistency across repeated practice takes.
- For whom: beginning instrumentalists practising a short passage.
- What to click first: **Try it with sample data**.

The exact first-screen text is “Measure timing consistency across takes,” “For
beginning instrumentalists who want consistent timing across a short passage,”
and “Try it with sample data.” The adjacent text says what the action shows:
“See six sessions and a 52% drop in timing spread.” The privacy, offline, and
price facts end at y=641 px on mobile and y=818 px on desktop. This gate passes.

## Findings

None.

## Complete copy audit

Counts use whitespace-separated displayed words; hyphenated terms count as one.
No sentence exceeds 22 words. No banned marketing word, jargon problem,
metaphor, mood heading, slogan, or inconsistent product term remains.

### Landing page sentences

| Sentence | Words |
| --- | ---: |
| For beginning instrumentalists who want consistent timing across a short passage. | 11 |
| See six sessions and a 52% drop in timing spread. | 10 |
| Audio stays on this device. | 5 |
| Works offline after the first visit. | 6 |
| Free for one saved passage. | 5 |
| Geometric timing rows become more evenly spaced beside a mechanical metronome. *(image alt)* | 11 |
| Later timing rows show the attacks landing closer together. | 9 |
| Steady Take compares the gaps between your attacks. | 8 |
| Smaller spread means your repetitions align more closely. | 8 |
| 26 milliseconds timing spread, 52% lower than the first session. | 10 |
| Set the passage. | 3 |
| Name it, choose the tempo, and set its attack count. | 10 |
| Play six takes. | 3 |
| Use your microphone, a MIDI note, or the large tap key. | 11 |
| Compare the spread. | 3 |
| Mark controlled takes and watch the same passage over time. | 10 |
| Microphone mode looks for separate attacks above the recent sound level. | 11 |
| Use tap input if it adds unwanted marks. | 8 |
| Steady Take reports attack timing and timing spread. | 8 |
| It does not show MIDI note names or technique feedback. | 10 |
| You can correct any take before saving. | 7 |
| No recording is kept. | 4 |
| Only attack times and your passage history are stored on this device. | 12 |
| Practice one passage free. | 4 |
| The full version saves unlimited practice passages on this device. | 10 |
| Dodo hosts checkout and handles payment through Sociobot. | 8 |
| Read the Steady Take purchase terms. | 6 |
| Measure timing consistency across repeated takes. | 6 |

Checked non-sentence headings, labels, and actions: “Timing practice for
beginners” (4), “Measure timing consistency across takes” (5), “Try it with
sample data” (5), “Sample timing result” (3), “Compare timing spread” (3),
“Read the chart as text” (5), “How it works” (3), “Repeat one short passage”
(4), “Clear limits” (2), “What Steady Take measures” (4), “Full version” (2),
“Keep every passage” (3), “Buy the full version” (4), “Activate full version”
(3), and “Verify license” (2). Each names its section, destination, state, or
result. Navigation links name destinations and are not command buttons.

### README sentences

| Sentence | Words |
| --- | ---: |
| Steady Take measures timing consistency across repeated practice takes. | 9 |
| It is for beginning instrumentalists working on short technical passages. | 10 |
| Set a passage, start its optional reference pulse, then play six takes. | 12 |
| Use microphone, MIDI, or tap input. | 6 |
| The app compares matched attacks and shows timing spread in milliseconds. | 11 |
| You can mark controlled takes and compare saved sessions over time. | 11 |
| Audio and practice history stay on the device. | 8 |
| Audio is analysed in memory and is not recorded. | 9 |
| The app works offline after the first connected visit. | 9 |
| Try the sample demo. | 4 |
| It does not use your practice history. | 7 |
| It includes six sessions for a G major crossing, with the measured result visible before the capture controls. | 18 |
| Requirements: Node.js 20 or later. | 5 |
| Open http://127.0.0.1:5173. | 2 |
| Playwright 1.58.2 is pinned. | 4 |
| Chromium must be available at PLAYWRIGHT_BROWSERS_PATH, or install it with npx playwright install chromium. | 14 |
| The exact deployment command is npm run build. | 8 |
| The static output is dist/, with dist/index.html at its root. | 10 |
| Claim tests can run alone. | 5 |
| Real data uses IndexedDB database steady-take. | 6 |
| A localStorage fallback is used only when IndexedDB is unavailable. | 10 |
| Export CSV for analysis or JSON for a full backup. | 10 |
| The demo uses the separate demo:steady-take sessionStorage key. | 8 |
| Microphone mode looks for separate attacks above the recent sound level. | 10 |
| Use tap input if it adds unwanted marks. | 8 |
| Steady Take reports attack timing and timing spread. | 8 |
| It does not show MIDI note names or technique feedback. | 10 |
| The free version saves one passage. | 6 |
| A $12 one-time purchase saves unlimited practice passages on this device. | 11 |
| Dodo hosts checkout and handles payment through Sociobot. | 8 |
| Deploy dist/ as a static site. | 6 |
| staticwebapp.config.json supplies the SPA fallback, 404 behavior, MIME mapping, and security headers. | 12 |
| The factory owns infrastructure, DNS, billing registration, and release configuration. | 10 |
| MIT licensed. | 2 |
| See LICENSE. | 2 |

“For example:” and the Project records bullets are labels or fragments rather
than sentences. README headings name their content. Developer terms such as
IndexedDB, localStorage, SPA, and MIME appear only in run, data, and deployment
documentation. The deployed sample is a working link.

### Terminology

| Concept | Term used |
| --- | --- |
| Learner-selected exercise | passage |
| One played event | attack |
| One performance | take |
| Six measured takes | session |
| Difference across matched attacks | timing spread |
| Tempo guide | reference pulse |
| Learner quality marker | controlled |
| Core outcome | timing consistency |
| Paid state | full version |

## Demo and sandbox verification

- One click on the first-screen action opened the supported `/?demo=1` URL.
- At 390 × 844, the persistent “Demo — sample data, nothing is saved” banner,
  G major crossing sample, latest 26 ms result, 54-to-26 ms chart, six-session
  statement, and 52% change were visible before scrolling. The result ended at
  y=719 px.
- The sample contains six dated sessions, six takes per session, controlled
  marks, 72 BPM, and four attacks. It is realistic rather than placeholder data.
- **Add a sample session** changed six rows to seven. **Reset demo** returned it
  to six. After another change, **Start for real** removed
  `sessionStorage["demo:steady-take"]`; returning to the demo restored six rows.
- A real “Review 5 real scale” passage remained in IndexedDB and reappeared
  after leaving demo mode. It never appeared in the demo.
- A fresh direct demo created only the `demo:steady-take` sessionStorage key:
  localStorage remained empty and `indexedDB.databases()` returned no database.
- The complete live demo request log was same-origin only. No analytics, CDN,
  model, payment, or other third-party request occurred during the sample flow.
- After service-worker control, a live offline reload retained G major crossing,
  six rows, and the result; the status changed to “Offline now.”

The demo gate passes. Reset works, real data remains separate, demo changes are
discarded on exit, and the product is already in use on the first post-click
screen.

## Claims verification

The repository was cloned with `--no-local` into
`/tmp/steady-take-review5-ymfHoF/repo`, then installed with `npm ci`. Every exact
test command in `.factory/claims.json` was run independently. Each passed once
in Chromium desktop and once in the 390 px mobile project.

| Claim ID | Result | Observable evidence |
| --- | --- | --- |
| `sample-improvement` | PASS 2/2 | Six sessions, latest 26 ms, and 52% lower appear in the first mobile viewport. |
| `offline-reload` | PASS 2/2 | The controlled demo and its result survive an offline reload. |
| `update-check` | PASS 2/2 | The service-worker update script and scope are same-origin. |
| `local-only` | PASS 2/2 | The sample flow makes no external request. |
| `tap-capture` | PASS 2/2 | Six four-attack takes save with measured spread. |
| `input-options` | PASS 2/2 | Microphone capture starts and fixture MIDI completes a take. |
| `permission-on-demand` | PASS 2/2 | Neither device API runs before Start take; each runs after its input starts. |
| `microphone-detection` | PASS 2/2 | Steady background is ignored; four impulses create one take. |
| `scope-limits` | PASS 2/2 | Fixture MIDI output and CSV contain timing fields, not note names or technique feedback. |
| `reference-pulse` | PASS 2/2 | A 120 BPM pulse follows 500 ms intervals, mutes, and stops. |
| `csv-export` | PASS 2/2 | The CSV contains the documented history header. |
| `data-backup` | PASS 2/2 | JSON exports, imports, and clears local history. |
| `site-storage-clear` | PASS 2/2 | Clearing browser storage removes the saved passage. |
| `free-passage-limit` | PASS 2/2 | The free state saves one passage and explains the second-passage limit. |
| `paid-passages` | PASS 2/2 | A valid fixture license saves 25 distinct passages without a product cap. |
| `full-version-price` | PASS 2/2 | Hosted checkout states $12.00 and a one-time unlock. |
| `payment-host` | PASS 2/2 | No checkout is embedded; Sociobot redirects to Dodo. |
| `controlled-takes` | PASS 2/2 | A controlled mark persists in the saved session. |
| `demo-isolation` | PASS 2/2 | Real and demo records stay separate; leaving demo discards sample changes. |
| `storage-fallback` | PASS 2/2 | Data survives reload in `steady-take:fallback` when IndexedDB fails. |
| `audio-not-recorded` | PASS 2/2 | Microphone capture creates no MediaRecorder, audio file, or external request. |
| `take-correction` | PASS 2/2 | A take can be removed, replaced, and saved. |
| `license-on-demand` | PASS 2/2 | Sociobot verification traffic starts only after token submission. |
| `revoked-license` | PASS 2/2 | A revoked fixture removes cached full-version access. |
| `offline-license-cache` | PASS 2/2 | Cached valid access remains active when a recheck cannot run offline. |

There are 25 manifest entries and 25 unique `@claim:<id>` tags. No registered
test failed or was skipped. The live landing page, application routes, legal
pages, and README were cross-checked against this registry. No claim-like
sentence lacks an entry.

The same clean clone passed the full `npm test` run with 85 passed and one
intentional mobile duplicate of the static-config assertion skipped. `npm run
build` passed and created `dist/index.html`. Application JavaScript is 36.08 kB
raw and 12.76 kB gzip.

## Earlier-finding verification

Every earlier review, polish report, and prior handoff was read in full. Each
finding was checked against the live site and current code or its clean claim
test.

| Earlier finding | Status and current evidence |
| --- | --- |
| F-1-1 | Fixed — the seeded result and chart end at y=719 px in the first mobile demo viewport. |
| F-1-2 | Fixed — learner copy uses “attack”; deterministic microphone detection passes. |
| F-1-3 | Fixed — the IndexedDB-disabled storage fallback survives reload. |
| F-1-4 | Fixed — Dodo/Sociobot wording is consistent and the hosted redirect passes. |
| F-1-5 | Fixed — the optional reference pulse starts, mutes, stops, and follows the selected BPM. |
| F-1-6 | Fixed — all three desktop facts end by y=818 px in a 900 px viewport. |
| F-1-7 | Fixed — each route and the static 404 have complete, distinct metadata. |
| F-1-8 | Fixed — the h1 states the timing-consistency job. |
| F-1-9 | Fixed — the eyebrow identifies timing practice for beginners. |
| F-1-10 | Fixed — the section heading names what Steady Take measures. |
| F-1-11 | Fixed — the caption says later attacks land closer together. |
| F-1-12 | Fixed — learner copy uses “attack”; `onsets_ms` remains only a CSV field. |
| F-1-13 | Fixed — the action says “Activate full version.” |
| F-1-14 | Fixed — the named Steady Take purchase terms are linked. |
| F-1-15 | Fixed — README links the deployed demo and explains its separation. |
| F-1-16 | Fixed — both 404 implementations use “Page not found.” |
| F-2-1 | Fixed — timing-only scope is precise and `scope-limits` passes. |
| F-2-2 | Fixed — update traffic is registered and proved same-origin. |
| F-2-3 | Fixed — the unproved refund-handler sentence remains absent. |
| F-2-4 | Fixed — browser-level storage deletion is registered and passes. |
| F-3-1 | Fixed — Start for real removes the demo key and the next demo has six rows. |
| F-3-2 | Fixed — readiness requires service-worker control; blocked workers say “Online only.” |
| F-3-3 | Fixed — microphone and MIDI APIs are requested only after Start take. |
| F-3-4 | Fixed — offline paid-access continuity is registered and passes. |
| F-4-1 | Fixed — every visitor-facing surface uses “timing consistency”; “timing stability” is absent. |

No earlier finding is unfixed, half-fixed, or regressed.

## Structure, accessibility, links, and visual identity

- `/`, `/practice`, `/demo`, `/privacy`, and `/terms` return 200 on direct
  load. `/review-5-missing-page` returns the designed page with HTTP 404.
- Each route has `lang="en"`, one h1, one main landmark, a distinct title under
  60 characters, a plain meta description, canonical URL, Open Graph/Twitter
  metadata, SVG favicon, and 180 px apple-touch icon. The social image is a real
  1200 × 630 product-specific asset.
- The sitemap lists all five application routes. `robots.txt`, manifest,
  favicon, social card, offline page, and every destination link load.
  Same-document skip links target the present main landmark; the checkout link
  is separately proved by the payment claims.
- SPA forward navigation and browser Back move focus to the new h1 within the
  route render, update the polite announcement, and return to the top.
- Every route has the same header and footer. Privacy and Terms are present on
  each. The 404 provides ways home and to practice.
- Live Axe scans found zero violations at desktop and 390 px on all five routes
  and the 404. The factory URL verifier found one h1, `lang`, `main`, complete
  alt text, labeled buttons, and zero console errors on home and demo.
- The clean suite covers keyboard use, 44 px targets, 200% text, form errors,
  malformed-data recovery, route focus, and reduced motion.
- Response headers include CSP with `frame-ancestors`, HSTS, `nosniff`, strict
  origin referrer policy, and microphone-only permissions policy.
- The cream graph paper, coral attack marks, generated cut-paper timing art,
  clipped dark instrument, square controls, and Fraunces numerals are specific
  to this product. The layout is not a generic SaaS template. Asset provenance
  is recorded in `.factory/design.md`.

## Missed leverage

No missing AI feature is found. Timing measurement is deterministic and
local-first; model inference would add network and privacy cost without helping
the core job. The useful adjacent capabilities implied by the brief are already
present: microphone, MIDI, and tap input; an optional local reference pulse;
CSV export; JSON import/export; offline use; and explicit data clearing. Sync is
not implied strongly enough to justify weakening the local-only model.

## What would make this perfect

Nothing remains to change or test under this review. The first read, one-click
demo, sandbox boundary, claims registry, copy, routes, accessibility, offline
behavior, payment disclosure, history closure, and product-specific identity
all meet the stated standard.
