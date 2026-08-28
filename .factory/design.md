# Steady Take visual thesis

## Direction: measured generative geometry

Steady Take turns repeated musical attacks into visible geometry. The visual
system uses a cream graph-paper field, ink-like navy marks, and coral onset
points. Repetition appears as stacked traces: imperfect spacing slowly settles
into a controlled grid. This connects the artwork, timing plots, progress marks,
buttons, and empty states to the product's real job.

This is intentionally a single light treatment. The warm paper field supports
long practice sessions, while the deep navy instrument panel stays visually
stable. Browser and installed-app chrome are painted `#F4F0E6`.

## Tokens

| Role | Token | Value | Use |
| --- | --- | --- | --- |
| Paper | `--paper` | `#F4F0E6` | page background |
| Paper shade | `--paper-deep` | `#E6DFD0` | quiet regions |
| Ink | `--ink` | `#132A32` | primary text and strokes |
| Muted ink | `--ink-soft` | `#526166` | secondary text |
| Night | `--night` | `#18353C` | practice instrument |
| Coral | `--coral` | `#C84034` | primary actions and timing points |
| Coral dark | `--coral-dark` | `#A92F25` | hover and focus contrast |
| Mint | `--mint` | `#A7CFB4` | controlled state |
| Gold | `--gold` | `#D8A928` | listening and warning |
| Danger | `--danger` | `#A12C31` | errors |

All body text combinations meet 4.5:1. Color is paired with text, pattern, or
shape for state.

## Type and spacing

- Display: self-hosted Fraunces variable subset, used for the wordmark and major
  numerals. Its slightly irregular forms suit human timing without feeling
  casual.
- Body: system sans stack (`Inter`-like platform faces) for immediate controls
  and legible small-screen instructions. No font request leaves the device.
- Scale: 14, 16, 18, 24, 38, and fluid 64 px.
- Spacing uses an 8 px base. Main section rhythm is 72–112 px; controls use
  8/16/24 px groupings. Text measure stops at 68 characters.

## Layout and shape language

The landing screen is an asymmetric practice sheet rather than a centered hero.
Copy occupies the left two-fifths. The generated timing plate and live practice
instrument overlap the right side like sheets on a music stand. Thin ruled
lines, clipped corners, numbered circular marks, and square-ended bars repeat
through the product. Cards are reserved for separate passages and takes.

At 390 px, the art becomes a short header plate and all recording controls stack
in one thumb-friendly column. History tables switch to labeled blocks.

## Interaction grammar and motion

Buttons depress two pixels like a metronome key. New onset marks grow from their
baseline over 180 ms. A completed take settles with one 240 ms horizontal snap.
Nothing loops. With `prefers-reduced-motion: reduce`, transforms and smooth
scrolling are removed and state changes are instant.

Focus uses a 3 px gold ring with a 3 px paper offset. Every target is at least
44 px. Charts include a written summary and a data table.

## Asset plan and provenance

The hero is an original generated still-life: layered cream timing sheets,
coral and mint geometric onset marks, and a dark green-black mechanical
metronome assembled from precise shapes. It explains the idea of repeatability
without pretending to show a real app screen. It contains no people, brands,
logos, or required text.

Prompt sheet:

> Use case: stylized-concept. Asset type: wide landing-page hero illustration.
> Primary request: an editorial still life about musical timing becoming steady.
> Scene: layered warm cream graph-paper sheets with seven horizontal timing
> lanes; early lanes have uneven coral circular onset marks and later lanes align
> into a calm mint grid; a small abstract mechanical metronome made from deep
> green-black geometric planes anchors the right edge. Style: tactile cut-paper
> generative geometry with crisp vector-like edges, subtle paper grain, restrained
> screen-print texture. Composition: wide 3:2, diagonal rhythm, generous calm
> negative space, no interface screenshot. Lighting: soft side light, short
> shadows. Palette: warm ivory, deep ink navy, burnt coral, pale mint, one muted
> gold accent. No text, no letters, no notation, no logos, no watermark, no
> people, no photorealistic devices, no gradients.

Generated with the factory image deployment through
`/opt/fleet/lib/gen-image.sh` on 2026-08-28. The selected PNG source and prompt
sidecar live in `assets/src/`. Shipping WebP derivatives are ≤300 KB. Other
marks, charts, favicon, and PWA icons are hand-authored product-specific SVG or
canvas geometry under the MIT project license.
