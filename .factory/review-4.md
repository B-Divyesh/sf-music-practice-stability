# Adversarial first-read review 4 — Steady Take

Date: 2026-08-29 UTC

Work order: `music-practice-stability-review-4`

Candidate: `7cb914dcc88b296d12f3974b91d3180121f2217e`

Live URL: <https://music-practice-stability.sociobot.in>

## Verdict

**FAIL**

There is one minor finding and no blocking finding. The product is clear on the
first screen, the demo is immediate and isolated, all 25 registered claim
commands pass in both browser projects, and all 24 earlier findings remain
fixed. The remaining copy uses two terms for the same core measure. A PASS
requires zero findings.

## First read before scrolling

Fresh Chromium contexts with no reused storage, cookies, or service workers
were opened at 390 × 844 and 1440 × 900.

- What it does: measures how consistently a musician repeats the timing of a
  short passage.
- For whom: beginning instrumentalists.
- What to click first: **Try it with sample data**.

The exact first-screen text answers all three: “Measure timing consistency
across takes,” “For beginning instrumentalists who want consistent timing
across a short passage,” and “Try it with sample data.” The adjacent sentence
says what the action shows: “See six sessions and a 52% drop in timing spread.”
The three privacy, offline, and price facts end at y=645 px on mobile and y=822
px on desktop. This gate passes.

## Findings

### Minor

#### F-4-1 — The core measure has two names

- Exact locations/quotes: landing h1, **“Measure timing consistency across
  takes”**; landing footer, **“Measure timing stability across repeated
  takes.”**; README opening, **“Steady Take measures timing stability across
  repeated practice takes.”**
- Why this fails: “timing consistency” and “timing stability” name the same
  concept. A first-time reader must decide whether the product measures one
  metric or two. The plain-words contract requires one term for one concept.
- Concrete fix: use **timing consistency** throughout. Rewrite the footer as
  “Measure timing consistency across repeated takes.” Rewrite the README
  opening as “Steady Take measures timing consistency across repeated practice
  takes.” Apply the same term to the manifest description and initial HTML
  description so installed and no-script surfaces agree.

## Complete landing and README copy audit

Counts use whitespace-separated displayed words; hyphenated terms count as one.
No sentence exceeds 22 words and no banned marketing word appears. Headings
name their sections and visible actions name their result. The dagger marks the
terminology conflict in F-4-1.

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
| Measure timing stability across repeated takes. † | 6 |

Checked non-sentence labels, headings, and actions: “Timing practice for
beginners” (4), “Measure timing consistency across takes” (5), “Try it with
sample data” (5), “Sample timing result” (3), “Compare timing spread” (3),
“Read the chart as text” (5), “How it works” (3), “Repeat one short passage”
(4), “Clear limits” (2), “What Steady Take measures” (4), “Full version” (2),
“Keep every passage” (3), “Buy the full version” (4), “Activate full version”
(3), and “Verify license” (2). No action or heading needs a separate rewrite.

### README sentences

| Sentence | Words |
| --- | ---: |
| Steady Take measures timing stability across repeated practice takes. † | 9 |
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

README headings identify their content. “For example:” and the five Project
records entries are labels/fragments rather than sentences; each names the code
or record it points to. The deployed sample is a working link. Developer terms
such as IndexedDB, localStorage, SPA, and MIME appear only in run, data, and
deploy documentation.

### Terminology check

| Concept | Current term |
| --- | --- |
| Learner-selected exercise | passage |
| One played event | attack |
| One performance | take |
| Six measured takes | session |
| Difference across matched attacks | timing spread |
| Tempo guide | reference pulse |
| Learner quality marker | controlled |
| Core product outcome | **timing consistency / timing stability — conflict (F-4-1)** |

## Demo and sandbox verification

- One click from the landing action opens the supported `/?demo=1` entry point.
- At 390 × 844, the persistent “Demo — sample data, nothing is saved” banner,
  G major crossing, “Latest spread: 26 ms,” 54-to-26 ms chart, six-session
  statement, and 52% result are visible without scrolling. The result ends at
  y=719 px, and the current passage instrument begins in the same viewport.
- The sample has six dated sessions, six takes per session, controlled marks,
  72 BPM, and four attacks. It is realistic rather than placeholder data.
- **Add a sample session** changes six rows to seven. **Reset demo** returns it
  to six. After another change, **Start for real** removes
  `sessionStorage["demo:steady-take"]`; returning to `/demo` restores six rows.
- A fresh direct `/demo` context creates only the `demo:steady-take`
  sessionStorage key. It creates no localStorage key or IndexedDB database.
  The clean `demo-isolation` claim also creates real data first and confirms it
  remains separate and unchanged.
- The complete live demo request log contains only
  `music-practice-stability.sociobot.in` requests. No analytics, CDN, payment,
  model, or other third-party request occurs during the demo flow.
- After service-worker control, a live offline reload retains G major crossing,
  its six sessions, and the 26 ms summary. The status changes to “Offline now.”

No demo or sandbox finding remains.

## Claims verification

A no-local clone of the remote repository was created at
`/tmp/steady-take-review4-19fzdD/repo`, checked at the candidate commit, and
installed with `npm ci`. Every exact `test` command in `.factory/claims.json`
was run independently. Each command passed once in Chromium desktop and once
in the 390 px mobile project.

| Claim ID | Result | Observable evidence |
| --- | --- | --- |
| `sample-improvement` | PASS 2/2 | Six sessions, latest 26 ms, and 52% lower are in the first mobile viewport. |
| `offline-reload` | PASS 2/2 | The seeded demo and result survive a controlled offline reload. |
| `update-check` | PASS 2/2 | The worker update script and scope are same-origin. |
| `local-only` | PASS 2/2 | The sample flow makes no external request. |
| `tap-capture` | PASS 2/2 | Six four-attack takes save with a measured spread. |
| `input-options` | PASS 2/2 | Microphone capture starts and fixture MIDI completes a take. |
| `permission-on-demand` | PASS 2/2 | Neither API is called before Start take; each is called after its chosen input starts. |
| `microphone-detection` | PASS 2/2 | Steady background is ignored and four separated impulses make one take. |
| `scope-limits` | PASS 2/2 | Fixture MIDI output and CSV contain timing fields, not note names or technique feedback. |
| `reference-pulse` | PASS 2/2 | A 120 BPM pulse follows 500 ms intervals, mutes, and stops. |
| `csv-export` | PASS 2/2 | The CSV download contains the documented history header. |
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
| `take-correction` | PASS 2/2 | A take can be removed, replaced, and saved before the session is stored. |
| `license-on-demand` | PASS 2/2 | Sociobot verification traffic begins only after token submission. |
| `revoked-license` | PASS 2/2 | A revoked fixture removes cached full-version access. |
| `offline-license-cache` | PASS 2/2 | Cached valid access remains active when a recheck cannot run offline. |

Each claim ID occurs exactly once as an `@claim:<id>` test tag. There are 25
manifest entries and 25 unique tags. No registered test failed or was skipped.
The live landing and README product claims map to these entries; no unlisted
claim was found.

The same clean clone passed the full `npm test` run with **83 passed and one
intentional duplicate config assertion skipped**. `npm run build` passed and
created `dist/index.html`. Application JavaScript is 36.08 kB raw / 12.77 kB
gzip. The live page serves `app-TnXIPTD0.js` and `index-B97EmEPq.css`, matching
the clean build.

## Earlier-finding verification

Every earlier review, polish report, and prior handoff was read. Each finding
was checked against the live site and current code or its clean claim test.

| Earlier finding | Status and current evidence |
| --- | --- |
| F-1-1 | Fixed — the seeded result and chart end at y=719 px in the first mobile demo viewport. |
| F-1-2 | Fixed — learner copy uses “attack”; deterministic microphone detection passes. |
| F-1-3 | Fixed — the IndexedDB-disabled storage fallback survives reload. |
| F-1-4 | Fixed — Dodo/Sociobot wording is consistent and the hosted redirect passes. |
| F-1-5 | Fixed — the optional local reference pulse starts, mutes, and stops at the selected BPM. |
| F-1-6 | Fixed — all three desktop facts end by y=822 px in a 900 px viewport. |
| F-1-7 | Fixed — route-specific metadata and the static 404 metadata are live and complete. |
| F-1-8 | Fixed — the h1 plainly states the timing-consistency job. |
| F-1-9 | Fixed — the eyebrow identifies timing practice for beginners. |
| F-1-10 | Fixed — the limits heading names what Steady Take measures. |
| F-1-11 | Fixed — the caption explains that later attacks land closer together. |
| F-1-12 | Fixed — learner copy uses “attack”; `onsets_ms` remains only a CSV field. |
| F-1-13 | Fixed — the action says “Activate full version.” |
| F-1-14 | Fixed — the named purchase terms are linked. |
| F-1-15 | Fixed — README links the deployed demo and explains its separation. |
| F-1-16 | Fixed — both 404 implementations use “Page not found.” |
| F-2-1 | Fixed — the timing-only scope is precise and `scope-limits` passes. |
| F-2-2 | Fixed — update traffic is registered and proved same-origin. |
| F-2-3 | Fixed — the unprovable refund-handler statement remains absent. |
| F-2-4 | Fixed — browser-level storage deletion is registered and passes. |
| F-3-1 | Fixed — Start for real removes the demo key and the next demo has six rows. |
| F-3-2 | Fixed — a blocked worker says “Online only”; readiness requires worker control. |
| F-3-3 | Fixed — microphone and MIDI access are requested only after Start take. |
| F-3-4 | Fixed — offline paid-access continuity is registered and passes. |

No earlier finding is half-fixed or regressed. F-4-1 is a newly identified
cross-surface terminology issue, not a reopened earlier finding.

## Structure, accessibility, links, and visual identity

- `/`, `/practice`, `/demo`, `/privacy`, and `/terms` return 200 on direct
  load. `/missing-review-4` returns a designed HTTP 404.
- Each route has `lang="en"`, one h1, one main landmark, a route-specific title
  under 60 characters, a plain meta description, canonical URL, OG/Twitter
  metadata, social image, and favicon. The home title follows “Steady Take —
  measure timing consistency.”
- SPA forward navigation and browser Back move focus to the new h1, update the
  polite route announcement, and return to the top.
- The header and footer are consistent. Privacy and Terms are present on every
  route. `robots.txt`, the manifest, favicon, social card, and all five sitemap
  URLs load successfully.
- Every link from every rendered route was crawled. Internal routes, Param
  Factory, and hosted checkout reach successful final responses; the explicit
  support link is `mailto:`. Same-document skip links target the present main
  landmark, including on the intentional 404 document.
- The factory URL verifier passes live `/` and `/?demo=1`: one h1, title, lang,
  main, complete image alt text, labeled buttons, and zero console errors.
- Live Axe scans report zero violations of any impact on all five routes and
  the 404 at 390 px. The clean suite also verifies 44 px controls, keyboard
  entry, visible route focus, 200% text, reduced-motion behavior, and no mobile
  horizontal overflow.
- The cream graph-paper field, coral attack marks, tactile timing-sheet art,
  clipped dark instrument, square controls, and Fraunces numerals are specific
  to this product. The layout is not a generic centered SaaS hero or feature
  card grid. Asset provenance is recorded in `.factory/design.md`.

No structure, routing, accessibility, dead-link, console, performance, or
visual-identity finding remains.

## Missed leverage

No missing AI feature is found. The core measurement is deterministic and
local-first; model inference would add network and privacy cost without helping
the timing calculation. The brief's useful adjacent capabilities already
exist: microphone, MIDI, and tap input; a local reference pulse; CSV export;
JSON import/export; offline use; and explicit data clearing. Sync is not implied
strongly enough to justify weakening the local-only model.

## What would make this perfect

Use “timing consistency” for the core outcome everywhere a visitor sees the
product, including the landing footer, README opening, manifest, and initial
HTML description. Then rerun the sentence audit and confirm the old phrase is
absent from user-facing copy. Nothing else remains to change in this review.
