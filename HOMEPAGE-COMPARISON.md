# Homepage vs reference: visual comparison (4 Nov 2026)

Nothing has been edited.

**References used:**
- **A:** the homepage mockup you attached, saved as `references/homepage-reference.webp` (977×1610).
- **B:** the seven inner-page concepts in `references/inner-pages/`. Only one image was attached, so I took these as the second reference.

**Method:**
- Pages were captured at 1440×900 and 390×844 in the in-app browser, after `document.fonts.ready`, a full scroll pass (to trigger every reveal) and a settle delay.
- Measurements come from the DOM (`getComputedStyle` and bounding boxes), converted to the reference's scale (×977/1440).
- Background statistics come from screenshots and the reference, both resampled to 760px wide, measured only over empty dark areas.

Labels used below:
- **[M]** measured.
- **[E]** visual estimate.

The screenshots are JPEG and slightly downscaled, so the fine-grain figures are approximate. Consistent direction across two scales is what matters.

## What already matches

- **Section positions [M]**, at reference scale (current vs reference): hero 0–568 vs ≈0–560; 01 at 568 vs ≈565; worlds 776 vs ≈775; listen 993 vs ≈995; archive 1138 vs ≈1135; about 1315 vs ≈1305; contact 1465–1620 vs ≈1465–1610.
  - Every section is within about 10px. The page is taller only because of the footer, which the reference doesn't show.
- **Fonts [M]:** Anton (wordmark/poster), Archivo Black, Bodoni Moda italic, Barlow Condensed, Space Mono, Inter and Newsreader all load.
  - Hero italic: 44.5px / 41.8px line height at reference scale ≈ reference [E].
  - Manifesto body: Newsreader 12.7 / 17.5 ≈ reference [E].
- **Wordmark position [M]:** the ink box starts at the same x and y as the reference (±1px at 760 scale).
- **Mean background tone [M]:** `#121212` (reference) vs `#121113` (site), with luminance 17.8 vs 17.6.

## The five differences that matter most

| # | Difference | Evidence | In scope for pass 1? |
|---|---|---|---|
| 1 | **Printed surface is too clean.** The reference's dark field is a worn print: fine grain, hairline scratches, fold marks and dust. Ours is a smooth near-black with animated grain. | **[M]** Fine-grain SD (pixel minus 1.2px blur) in empty areas: reference 5.4 vs site 3.2 at 760px (7.9 vs 3.1 at 572px), so roughly 1.7–2.5× more texture in the reference. Large-scale mottling is similar (18.1 vs 16.2). **[E]** The reference has visible near-vertical scratches and pale specks; the site has none. Speck counts gave conflicting results at the two scales, so they aren't used. | **Yes** |
| 2 | **Edges are darkened.** The global vignette dims the sides; the reference is evenly lit to the edges. | **[M]** Dark-field luminance from left edge to centre: reference 19.0 → 18.4 (flat); site 15.5 → 18.4 (left 6% is 16% darker). The right edge of the site sample is unusable because the pane's scrollbar was in it. | **Yes** |
| 3 | **Section seams are heavy bands, not printed hairlines.** | **[M]** `TornRule` is a 12px band filled `#18161a` (lighter than the page `#0c0b0d`) with a 22%-ivory edge. **[E]** In the reference, sections are separated by thin pale rules or torn edges with no grey band. The site's bars read as five horizontal stripes. | Later. It's structural, not texture. |
| 4 | **Portrait tone.** The reference portrait is darker, warmer and higher in contrast; the hair dissolves into the black. Ours is lighter, cooler and studio-clean. It's the largest single area on the page. | **[E]** Visual only. | No: approved asset. Noted for later discussion. |
| 5 | **Wordmark ink and small type.** The reference letters are more worn and slightly warmer. Its mono captions are a step larger. | **[M]** Wordmark ivory: reference ≈`#e0d5ce` vs site `#e5e0d6`. Dark-speck share in the P stem: ≈22% vs 17.6% (approximate, since the box includes the letter edge). Site hero caption Space Mono 6.5px and card captions 6.1px at reference scale; reference ≈7.5–8px and ≈6.5–7px **[E]**. | No: approved wordmark and layout. |

**Mobile (390px):** there's no mobile reference. Long stretches of empty dark field (above and below each heading, between sections) make difference 1 more visible on phones than on desktop.

**Inner pages vs their concepts (reference B) [M]:** the concepts are cleaner than the homepage reference, and the site already has as much texture as them or more:

| Page | Concept grain | Site grain |
|---|---|---|
| studio | 1.7 | 3.8 |
| photography | 1.6 | 1.6 |
| art | 1.8 | 5.0 |
| words | 2.0 | 3.4 |
| music | 1.5 | 7.4 (vinyl grooves inflate this) |
| about | 1.4 | 1.8 |
| contact | 1.2 | 2.6 |

So a texture change must be **homepage-only**. Making the global overlays stronger would push the inner pages further from their concepts.

## Texture assets already in the project

| Asset | What it is | Use for this pass |
|---|---|---|
| `.grain` (globals.css) | Animated SVG fractal noise, overlay blend, 11%, fixed to the viewport, all pages | Keep as is. Making it stronger would also strengthen the flicker. |
| `.paper` | Low-frequency mottling, soft-light, 50%, fixed, all pages | Keep. Mottling already matches. |
| `.vignette` | Radial darkening to 55% black, all pages | Soften on the homepage only. |
| `.dust` | CSS radial-gradient specks, **defined but unused** | Could be reused, but it's a regular repeating grid that would show as a pattern. |
| `ink-worn` utility, `wordmark-ink.webp` (512px tile) | Letterpress speckle for display type | Not for backgrounds. |
| SVG filters `f-noise`, `f-stone` (SvgDefs) | Grain and stone for placeholder art | Not suitable as a page layer. |
| `references/inner-pages/assets/grain.png` | Your prototype's 450×450 greyscale noise tile (mean 126, SD 27) | A possible source for static print grain. It isn't in `public/` yet. |
| Scratches, folds, halftone, distressed print | **None exist** | Would need a small, project-generated SVG (no package). |

## Proposed first change: homepage background and printed texture only

**Goal:** close differences 1 and 2 without touching the portrait, wordmark, artwork, layout, seams, animations or inner pages.

1. **Static print grain (homepage only).**
   - One extra fixed, non-animated layer: SVG `feTurbulence` at a higher frequency than `.grain` (about 1.4, 2 octaves, greyscale), overlay blend, about 8–10% opacity.
   - It sits between `.paper` and `.vignette`.
   - Target: fine-grain SD at 760px from 3.2 to about 5 (reference 5.4).
   - Alternative source: your prototype's `grain.png`, copied to `public/images/textures/`.
2. **Hairline scratches and dust that move with the page.**
   - A small, deterministic SVG tile (~1200×1600, a few KB) generated in-project the same way `TornRule` is (seeded): about 20 near-vertical hairline scratches at 0.5–1px and 6–12% ivory, plus about 100 irregular specks.
   - Laid absolutely over the homepage's content, so it scrolls with the "print" like the reference instead of floating on the screen.
   - Pointer-events off, screen blend, low opacity, so it also crosses photos lightly, as in a printed piece.
3. **Even edges.** On the homepage only, lower the vignette to about 35% so the edges sit within about 5% of the centre (now 16% darker).
4. **Neutral black.** On the homepage only, shift the base from `#0c0b0d` toward a neutral `#0d0d0d`, removing the slight violet cast (R−B −1.7 vs reference +0.2 [M]). Luminance stays the same.

**How it's scoped:**
- A wrapper class on the homepage only.
- `body:has(...)` to adjust the global vignette and background colour.
- No new packages, and no changes to `layout.tsx` overlays for other pages.
- Reduced-motion is unaffected, since nothing new animates.

**Checks after implementing:**
- Re-run the same measurements: grain SD about 5, edge falloff ≤5%, R−B about 0.
- Screenshots at 1440, 1920 and 390.
- Confirm the inner pages are unchanged (same grain numbers as the table above).
- Check scroll performance (two static layers, no new animation).
- Run a build.

---

## Pass 1: homepage texture (implemented 4 Nov 2026)

**Frontend Design plugin:** a "Frontend design skill" plugin is enabled on the claude.ai account, but its skill isn't loaded in this session, so it was **not** used.

**What changed** (homepage only):
- `src/components/home/PrintSurface.tsx` (new). A page-anchored layer over the homepage sections. It scrolls with the composition and repeats nothing:
  - **Static grain:** sparse bright grains, screen-blended, so blacks stay deep.
  - **Scratches:** 24 hairline scratches (35% broken), 3 faint long film hairlines and 12 paper fibres.
  - **Dust:** 150 specks, mostly pale; dark specks only show on light paper and photos.
  - **Hero focus zone:** the portrait's face and the tagline are kept clear of scratches and dark specks.
  - **One drawing for the whole page:** the marks are a single SVG, with stroke widths fixed in pixels so specks stay round.
- `src/app/page.tsx`: the sections are wrapped in `.print-surface` with the layer on top (z-70, under the header and menu). Pointer events are off.
- `src/app/globals.css`: `.print-grain` (static SVG noise, 16%, screen) and `body:has(.print-surface) .vignette { opacity: .4 }`.

**Left unchanged:** the background colour (`#0c0b0d`), portrait, wordmark, artwork, typography, layout, dividers, animations and every inner page.

**Measured, from full-resolution headless-Chrome captures of production builds (approximate, for guidance only):**

| | Empty-field luminance | Fine-grain SD |
|---|---|---|
| 1440 before → after | 16.5 → 17.9 | 3.63 → 4.04 |
| 390 before → after | 15.8 → 17.6 | 2.70 → 3.68 |

- **Blacks:** they rise by only 1.4–1.8 levels out of 255, so they stay deep.
- **Grain:** a restrained increase, deliberately well below the reference.
- **Edge darkening (1440, shot 2):** left −25% → −21%, right −11% → −7% versus the centre. This sample includes artwork near the edges, so treat it as a rough figure. The vignette itself is now 40% of its former strength on the homepage.

**Checks:**
- **Page height unchanged:** 3049px at 1440 and 5707px at 390, so the layout didn't move.
- **Inner pages:** all seven render without the layer, with the vignette at full strength.
- **Clicks:** the overlay never intercepts a click. 14 of 18 homepage links passed the click-through test. The other 4 are world cards, where the test hits their own scrolling card row instead of the overlay; that's unrelated to this change.
- **Scrolling:** headless scroll frame times were 6.9ms p50 and 15ms p95.
- **1920px:** no visible repetition. The marks are one non-repeating drawing, and the 373px grain tile is too fine to read as a pattern.
- **Checks:** `tsc` and `next build` pass.

**Mobile reference (for the later mobile pass):** the brief mentions a second reference with a mobile homepage and mobile menu concept, but no image came through with that message. Please re-attach it and it will be recorded here before the mobile pass.

## Mobile reference (recorded 4 Nov 2026, for the later mobile pass; not implemented)

Saved as `references/inner-worlds-with-mobile.webp`, the full inner-worlds board (1433×2000). Its bottom row adds:
- **Mobile homepage:**
  - **Top:** "PSYIXEL —" logo top-left and a hamburger icon top-right. The wordmark is huge and bleeds off both edges, with the portrait (head tilted back) overlapping it.
  - **Lower half:** the lavender iris cut-out bottom-left.
  - **Bottom:** the tagline "Between the visible and the imagined." in Bodoni italic, left-aligned, set smaller than on desktop. Under it, the mono caption "A hybrid creative practice spanning studio, photography, art, words, and music."
- **Mobile menu:**
  - A full-screen black panel with "PSYIXEL —" and a close ✕ at top.
  - The seven pages listed in Bodoni italic (Studio → Contact), left-aligned and vertically stacked.
  - A lavender iris cut-out in the bottom-right corner.
- **Site map:** Home (hero, overview, latest work) · Studio (creative direction and projects) · Photography (photo series and galleries) · Art (visual art and experiments) · Words (essays, notes and writing) · Music (releases, mixes and soundscapes) · About (the practice, process and background) · Contact (collaborations, inquiries and more).

## Pass 2: homepage dividers (implemented 4 Nov 2026)

**What changed:**
- `TornRule` gained `tone="rule"`. It draws a thin, slightly uneven pale printed rule: a gently drifting line with the odd nick, in runs of varying ink density (30–52% ivory) and occasional small breaks.
- The rule stays inside the existing 12px seam.
- With `cover`, the area below the rule is filled with the page colour, so artwork that crosses a seam (hero iris and portrait, About bust) still ends on a torn edge.
- All five homepage seams use it: the hero bottom and four in `Sections.tsx`.

**Left unchanged:** inner pages keep the default grey `band` (2–3 per page, confirmed in built HTML), along with texture, typography, images and animations.

**Positions:** section tops and heights are identical before and after:
- **1440:** 0 / 837 / 1144 / 1466 / 1680 / 1943 / 2165, page 3049.
- **390:** 0 / 694 / 1578 / 1920 / 2707 / 3427 / 4357, page 5707.

**Checks:** `tsc` and `next build` pass.

## Pass 3: mobile hero and mobile menu (implemented 4 Nov 2026)

**Hero (below 768px only; desktop classes untouched):**
- **Wordmark:** stays behind the portrait. It's widened to 114% and shifted 15% left, so the P bleeds off the left edge as in the concept.
- **Portrait and iris:** these are the main composition.
  - Portrait (`content/hero.ts`, mobile): left −4%, top 27vw, width 110%.
  - Iris: left −9%, top 95vw, width 88%.
- **Tagline:** two left-aligned lines ("Between the visible / and the imagined.") at 10.4vw (37–45px), then the lavender swoosh. The description follows at 11.2px (was 9.6px), with 1.75 line height.
- **In flow:** the tagline block sits in normal page flow (`mt-[149vw]`), so the hero's height follows its content and text can't collide with artwork.
- **Hidden on phones:** the category list, date marker, eye, moon card, rock and the mobile scribble.
- **Height:** the mobile hero is about 130px taller at 390px (694 → 828px), so the sections below start lower but are themselves unchanged.

**Menu (shared, all pages, below 1024px):**
- **Panel:** a full-screen dark panel (`role="dialog"`, `aria-modal`) with the seven pages in Bodoni italic at 2.6rem, left-aligned. The current page shows in lavender.
- **Flower:** the iris cut-out sits cropped at the bottom right. It's passed from the layout as `menuFlower`.
- **Header:** the "Close ✕" toggle stays in the header.
- **Behaviour:** Tab and Shift+Tab cycle between the close button and the links. Escape closes the menu and returns focus to the toggle. Lenis and body scroll are locked while it's open. Navigating closes the menu.

**Checks (production build, headless Chrome) — all pass:**
- No horizontal overflow at 360, 390 or 430, and the tagline and description stay fully on screen.
- The hidden pieces are `display:none`.
- Menu: opens with focus on the first link, Tab wraps, Shift+Tab reaches the close button, the background doesn't scroll on wheel, Escape restores everything, and the Studio and Contact links navigate and close the menu.

**Desktop 1440:** section positions are identical; the hero viewport's pixel diff is 0.05/255 mean.

**Checks:** `tsc` and `next build` pass.

## Pass 4: homepage card and caption typography (implemented 4 Nov 2026)

**Measured before editing** (1440px, reference scaled ×1440/977). Space Mono sizes are derived from character advance:

| Element | Before | Reference | After |
|---|---|---|---|
| Card headings (Studio, Photography, Art, Music) | Barlow Condensed 800, cap ≈39px, width/height ≈3.5 (Studio) | cap ≈55–60px, width/height ≈2.4 (Studio), 1.56 (Art) | **Anton** (already the project's display face), 4.45vw (64px): cap ≈56px. Photography is 3.95vw, narrowed to fit, as before |
| Words heading | Bodoni italic 3.47vw, 168×38px | ≈171×43px | unchanged (within 2% width) |
| Card numbers | 9.6px | ≈14px | `max(0.6rem, 0.96vw)` = 13.8px |
| Card descriptions | 9px / 1.5 | ≈10.4px / 1.63 | `max(0.56rem, 0.72vw)` = 10.4px / 1.63 (1.4 and tighter tracking below 1280px, so it clears the image at 1024) |
| Hero category list | 11px, 0.12em, 1.9 | ≈15.5px, ≈0.2em, 1.65 | `max(0.6875rem, 1.08vw)` = 15.6px, 0.2em, 1.65 |
| Hero description | 9.6px, 17rem wide | ≈14px, ≈0.18em, 1.5, 3 lines | `max(0.6rem, 0.97vw)` = 14px, 0.18em, 1.5, 23vw wide |
| Selected-work captions | 9.6px / 1.5 | ≈12.3px / 1.6 | `clamp(0.6rem, 0.85vw, 12.24px)` / 1.6 |

**Why Anton:** Barlow Condensed was a demonstrated proportion mismatch. At equal cap height, Anton's ART is 136×86 against the reference's 89×57 (same ratio, 1.58 vs 1.56); Barlow's is 2.1. Anton is the face already used for the inner-page titles.

**Mobile:**
- Card descriptions 10.9px (was 9px), numbers 11.2px.
- Archive captions 10.2px (was 9.6px), with 0.1em tracking and the old 14.4px line height, so wrapping and section positions are unchanged.
- The mobile hero and menu are untouched.

**Positions:** identical before and after at 360, 390, 430, 1024, 1440 and 1920px. On desktop, a negative bottom margin returns the archive captions' extra height; the text sits in the section's existing bottom padding, unclipped.

**Overflow:** no horizontal overflow, and no title, number or caption leaves its card or collides with the number or image, at 360, 390, 430, 768, 1024, 1440 and 1920.

**Checks:** `tsc` and `next build` pass.
