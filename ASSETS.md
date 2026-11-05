# PSYIXEL — high-resolution asset replacement list

Every image below is currently a low-resolution piece cut from the 977 × 1610 reference
mockup (or, for the portrait, your supplied cut-out). They stay in place as placeholders
until a replacement is imported. Nothing in the layout, typography, motion or spacing
changes when you swap them.

## How replacing works

```bash
npm run asset -- --list                       # all slots, sizes, transparency
npm run asset -- iris ~/Desktop/iris-final.png
```

- Accepts PNG, WebP, JPG, AVIF; converts to WebP and keeps transparency.
- Checks the file against the slot: transparency where required, aspect ratio within 1.5 %.
  If the shape is off it stops and offers `--fit cover` (crop) or `--fit contain` (pad).
- Copies the placeholder it replaces to `assets/placeholders/` first, so you can roll back.
- Writes to the exact path the site already reads. Refresh — no code changes.

Every slot has a **locked frame** (`src/content/asset-manifest.json`). The page reserves that
shape, and the image is fitted into it — so even a slightly different crop can't push the
composition around. **Match the aspect ratio and the landmark positions described below**
and the new art lands exactly where the old one sits.

---

## Art direction for all pieces

| | |
|---|---|
| **Photography** | Black-and-white film look: deep but not crushed blacks, soft lifted mid-greys, fine 35 mm grain, slight softness. Cinematic, quiet, high contrast. |
| **Accent** | One colour only: lavender — `#AB92D9` (main), `#C9B6EC` (light), `#6C5596` (deep). Applied as a duotone/tint on paper or petals, never neon. |
| **Paper** | Warm ivory `#E4DDCF`–`#ECE5D8`; torn edges with a light fibrous rim; faint creases and print texture. |
| **Ground** | Pieces sit on near-black `#0C0B0D`. Transparent pieces need **clean alpha** (no grey halos, no baked background). Keep flyaway hair and torn fibres in the alpha. |
| **Shadows** | Don't bake drop shadows outside the object — the site adds them. Shadows *within* the object (folds, curls) are good. |
| **Colour exception** | Only *Red Moon Variations* uses warm colour (ember moon `#B8492F`, salmon wall). |
| **Delivery** | sRGB. Transparent slots: PNG (16-bit welcome) or lossless WebP. Opaque slots: PNG or JPG quality ≥ 92. At least the target size; larger is fine (it's downsized on import). |

Generating with AI? Create cut-outs on a flat mid-grey or chroma-green background and remove
it with a matting tool that preserves hair; generate at or above target size rather than
upscaling. Prompt lines are included per asset as a starting point.

---

## Inventory

Sizes in pixels, **W × H**. "Frame" is the aspect ratio the layout reserves.

| P | Slot | File the site reads | Placeholder now | Target | Frame | Transparent | Appears |
|---|---|---|---|---|---|---|---|
| 1 | `portrait` | `public/images/collage/portrait.webp` | 1086 × 1448 | **2400 × 3200** | 0.750 (3:4) | yes | Hero figure over the wordmark |
| 1 | `iris` | `public/images/collage/iris.webp` | 690 × 396 | **2400 × 1377** | 1.742 | yes | Hero, lower left, cut by the hero edge |
| 1 | `eye` | `public/images/collage/eye.webp` | 324 × 396 | **1200 × 1467** | 0.818 | yes | Hero, top right over the "L" |
| 1 | `moon` | `public/images/collage/moon.webp` | 360 × 388 | **1200 × 1293** | 0.928 | yes | Hero, left edge |
| 1 | `about-collage` | `public/images/collage/about-collage.webp` | 596 × 348 | **2000 × 1168** | 1.713 | yes | 03 About, marble bust collage |
| 1 | `the-second-nature` | `public/images/works/the-second-nature.webp` | 294 × 230 | **1600 × 1260** | 1.270 | no | Archive thumb; `/art/the-second-nature` |
| 1 | `manifesto-collage` | `public/images/collage/manifesto-collage.webp` | 734 × 436 | **2400 × 1426** | 1.683 | yes | 01 Manifesto, right |
| 2 | `about-moon` | `public/images/collage/about-moon.webp` | 314 × 280 | **1200 × 1070** | 1.121 | yes | 03 About, right |
| 2 | `rock` | `public/images/collage/rock.webp` | 238 × 324 | **900 × 1225** | 0.735 | yes | Hero, right edge |
| 2 | `music-collage` | `public/images/collage/music-collage.webp` | 492 × 256 | **1800 × 937** | 1.922 | yes | Listen section, left |
| 2 | `red-moon-variations` | `public/images/works/red-moon-variations.webp` | 298 × 230 | **1600 × 1260** | 1.270 | no | Archive thumb; player cover; `/music` |
| 2 | `world-studio` | `public/images/works/world-studio.webp` | 370 × 224 | **1600 × 1000** | 1.600 | no | Studio card |
| 2 | `world-photography` | `public/images/works/world-photography.webp` | 350 × 224 | **1600 × 1000** | 1.600 | no | Photography card |
| 2 | `world-art` | `public/images/works/world-art.webp` | 342 × 224 | **1600 × 1000** | 1.600 | no | Art card |
| 2 | `world-words` | `public/images/works/world-words.webp` | 352 × 224 | **1600 × 1000** | 1.600 | no | Words card |
| 2 | `world-music` | `public/images/works/world-music.webp` | 392 × 224 | **1600 × 1000** | 1.600 | no | Music card |
| 3 | `a-quiet-exit` | `public/images/works/a-quiet-exit.webp` | 290 × 230 | **1600 × 1260** | 1.270 | no | Archive thumb |
| 3 | `fragments-vol-1` | `public/images/works/fragments-vol-1.webp` | 326 × 230 | **1600 × 1260** | 1.270 | no | Archive thumb; `/music` |
| 3 | `contact-rock` | `public/images/collage/contact-rock.webp` | 324 × 288 | **1200 × 1067** | 1.125 | yes | 04 Get in touch, right edge |

Targets are sized for a 1920 px-wide screen at 2× pixel density.
Positions below are given as **x %, y %** of the image frame (0,0 = top left).

---

## Priority 1

### `portrait` — hero figure · 2400 × 3200 · transparent

**What it is.** Black-and-white photograph of a young woman, head thrown far back, eyes
closed, lips slightly parted — a moment of surrender. Three-quarter profile, face turned
up toward the light. Dark, shoulder-length wavy hair caught in wind: a loose mass falling
behind, with fine flyaway strands lifting above the head and a few crossing the brow and
cheek. Black ribbed turtleneck. Soft directional light from the face side; luminous skin
with visible texture, deep shadow under the jaw.

**Orientation.** The current file faces **up-left** and the site mirrors it (`flip: true` in
`src/content/hero.ts`) so on the page she looks up-right into the tagline. Deliver the
same orientation, or deliver facing up-right and set `flip: false` — that's a setting, not code.

**Landmarks** (in the file as delivered, facing left) — match these and the overlap with
the PSYIXEL letters stays identical:

| Feature | x % | y % |
|---|---|---|
| Top of hair (flyaways) | ~50 | 3 |
| Closed eye | 36 | 23 |
| Nose tip | 22 | 23 |
| Chin point | 9 | 35 |
| Ear | 46 | 43 |
| Turtleneck collar top | 28 | 53 |
| Hair mass, right edge | 97 | 40–80 |
| Shoulders run off | — | 100 |

**Alpha.** Hair matting is the make-or-break detail: keep individual strands.
**Prompt.** *black and white film photograph, young woman head tilted far back, eyes closed, lips parted, windswept dark wavy shoulder-length hair with flyaway strands, black ribbed turtleneck, soft side light, fine 35mm grain, editorial, isolated on plain grey background*

### `iris` — hero flower · 2400 × 1377 · transparent

**What it is.** A real bearded iris photographed close, desaturated to dusty lavender
(`#9D86C9`–`#C9B6EC`) with darker violet veins (`#6C5596`) and slightly translucent,
ruffled petals. Fine grain; looks like a matte print cut out with scissors.

**Composition.**
- Large upright petal curling up on the left (x 5–35 %, y 0–70 %).
- Main fall petal drooping down through the centre (x 35–62 %, y 25–100 %).
- Two petals sweeping out to the right and down (x 55–100 %, y 30–90 %).
- Stem and a narrow leaf blade rising from the bottom edge near x 45 %.
- The bottom of the flower is **cut by the frame's bottom edge**. On the site, that edge is the hero's torn border.

**Prompt.** *purple bearded iris flower close-up, dusty desaturated lavender petals with dark violet veins, ruffled translucent petals, matte vintage print, fine grain, isolated on plain grey background*

### `eye` — hero, top right · 1200 × 1467 · transparent

**What it is.** A torn fragment of lavender paper (`#A990D8`), irregular torn edges with
a paler fibrous rim on all sides, tilted about −6°, a faint fold line across it. Printed on it,
a black-and-white **extreme close-up of an open human eye**. The photo is multiplied
into the paper: blacks stay near-black, highlights take the lavender.

**Landmarks.** Eyebrow hairs across the top (y 15–30 %). Iris and pupil at x 55 %, y 52 %. Upper lashes
dark and long. Skin texture and fine creases visible. The paper fills the frame edge to
edge; transparency only outside the tear.

**Prompt.** *extreme close-up black and white photograph of an open human eye with eyebrow, printed on torn lavender paper, duotone black and lavender, torn fibrous edges, paper texture, isolated*

### `moon` — hero, left edge · 1200 × 1293 · transparent

**What it is.** A vintage black-and-white photo print: a full moon above a dense bank of
billowing cumulus clouds. Dark grey sky. Warm ivory border, torn along the top edge
(diagonal, rough) and slightly curled. The whole print is rotated about −8°.

**Landmarks.** Moon centre x 55 %, y 42 %, diameter ≈ 28 % of the width, with crisp craters. Clouds fill
the lower half and catch the moonlight. Border thicker at the bottom (like a Polaroid).

**Prompt.** *vintage black and white photograph print of full moon above cumulus clouds, white border, torn top edge, slightly curled paper, rotated, fine grain, isolated*

### `about-collage` — marble statue · 2000 × 1168 · transparent

**What it is.** A layered collage around a **classical marble bust**: a Greek/Roman male head with curly
hair, tilted back, gazing up-right. Weathered marble with cracks, chips and grain. Black
and white.

**Composition.**
- Bust face at x 25–60 %, y 10–90 %. Cropped at the neck and shoulder at the bottom-left, with a broken, chipped edge.
- Behind it, a stepped block of flat lavender `#A990D8` (x 45–90 %, y 15–80 %).
- Lower right: a torn photo of pale sky with white cumulus clouds (x 60–100 %, y 55–100 %). This is the only cool blue-grey in the palette; keep it soft.
- A torn lavender paper scrap along the left edge.

**Prompt.** *collage: classical marble bust of a young man with curly hair tilting his head back, weathered cracked marble, black and white, flat lavender rectangle behind, torn photo of cumulus clouds, torn paper edges, isolated*

### `the-second-nature` — archive + artwork page · 1600 × 1260 · opaque

**What it is.** A black-and-white marble bust, frontal and serene, eyes downcast. A burst of
pale lilies and blossoms grows out of the top of the head like hair. Dark, textured
background. Quiet, surreal.

**Composition.** Subject centred. The `/art/the-second-nature` page crops the **middle 4 : 5**,
so keep the face and flowers within x 22–78 %.

**Prompt.** *black and white photograph of a classical marble bust with lilies and flowers blooming from the top of its head, eyes downcast, dark background, surreal, fine grain*

### `manifesto-collage` — section 01 · 2400 × 1426 · transparent

A small collage of three torn prints plus line work:

| Piece | Area (x %, y %) | Description |
|---|---|---|
| Flower print | 47–100, 3–100 | Close-up of a pale lavender hibiscus/mallow bloom with a dark centre and visible veins; part of a second bloom at top-left; dark background inside the print; torn left and top edges |
| Petal scrap | 32–50, 3–40 | Small torn piece of lavender petals, overlapping the flower print's top-left |
| Horizon print | 0–52, 55–96 | Misty lavender-grey sky over a dark hill rising left→right; a tiny lone figure standing near the crest (≈ x 30 %, y 70 % of the whole frame); torn right edge overlaps the flower print |
| Orbit lines | centre ≈ 25, 22; span ≈ 42 % wide | Two thin ivory ellipses (2–3 px), tilted ≈ −10° |

Transparent everywhere outside the prints and lines.

**Prompt (flower).** *close-up of pale lavender hibiscus flower, dark centre, desaturated lavender duotone, matte print*
**Prompt (horizon).** *misty lavender grey landscape, lone person standing on hill crest, minimal, film grain*

---

## Priority 2

### `about-moon` · 1200 × 1070 · transparent
A detailed black-and-white full moon, centre x 53 %, y 50 %, diameter ≈ 47 % of the width, with a soft
terminator shadow on the lower left. Two thin ivory orbit ellipses tilted ≈ −35° wrap
around it, almost touching the frame edges (x 2–98 %, y 5–95 %).

### `rock` — hero right edge · 900 × 1225 · transparent
A fragment of weathered grey granite mountain, lit from the left, with deep crevices. Jagged peak near
the top right (x 70–85 %, y 0–10 %). The broad base runs off the right and bottom edges.

### `music-collage` · 1800 × 937 · transparent
Vintage over-ear headphones in black-and-white, cracked leather and stone-like texture, at a three-quarter angle.
- Headband arcs from x 30 % to 85 % along the top.
- Ear cups at x 40 %, y 60 % and x 80 %, y 55 %.
- Below: torn lavender paper strips (x 0–60 %, y 70–100 %).
- A grey rock chunk at the bottom-left (x 0–25 %, y 55–100 %).
- A thin lavender sine/waveform line enters from the left edge at y 35 %.

### `red-moon-variations` · 1600 × 1260 · opaque
- Dusk-to-night sky, deep navy fading to black.
- Large ember-red full moon at x 30 %, y 30 %.
- On the right half, a salmon-pink concrete wall or building corner with one small dark square window.
- Soft pink clouds at the bottom left.

This is also the music player cover, shown small, so keep the moon and wall readable at thumbnail size.

### World cards — `world-studio`, `-photography`, `-art`, `-words`, `-music` · 1600 × 1000 · opaque
The card title sits over the top and the caption over the bottom. Keep the **top 12 % and
bottom 12 % calm and dark**, with the subject in the middle band.

| Slot | Description |
|---|---|
| `world-studio` | A sculptural sweep of white paper/fabric curling through darkness, like a calla-lily ribbon, centre-right; a dry lavender brush stroke across the left third |
| `world-photography` | Black-and-white motion-blurred portrait: a person turning their head, hair whipping, ghosted double exposure, centred |
| `world-art` | Thick impasto paint, lavender and ivory brush swipes running diagonally, with torn-paper fragments and dark gaps |
| `world-words` | Aged ivory paper with faded cursive handwriting and a torn top edge; black silhouettes of wildflowers rising from the bottom; dark above the tear |
| `world-music` | A black vinyl record cropped at the right with glossy grooves and a lavender label; a lavender audio waveform spike line across the left half |

---

## Priority 3

### `a-quiet-exit` · 1600 × 1260 · opaque
A lavender-tinted misty meadow with tall grass. A motion-blurred figure in a dark coat walks
away, centre-right. Soft fog, very little contrast in the background.

### `fragments-vol-1` · 1600 × 1260 · opaque
A clear/transparent cassette tape tilted ≈ −8° on a misty lavender-grey background. The label strip reads
**PSYIXEL** in handwritten italic, and the reels are visible through the shell.

### `contact-rock` · 1200 × 1067 · transparent
A large grey rock/mountain fragment lit from the upper left, with a jagged left silhouette, filling the
right ~70 % and the bottom. Dark crevices. A sibling of the hero `rock`; it can come from the same
source photo.

---

## Not images — stay as code

The PSYIXEL wordmark, all headings and copy, the nav, the music player, torn section seams,
lavender pen lines, stars, the hero orbit/scribble lines, the grain, paper and vignette
overlays are live HTML/SVG/CSS. They animate and stay sharp at any size.
