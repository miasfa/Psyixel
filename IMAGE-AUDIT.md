# PSYIXEL — Image Quality Audit

_Audited 4 Nov 2026 across every page and detail route at 1440px, 1920px and 375px widths. No layout, typography, motion or colour was changed._

## Summary

- **35 raster files, 1 that is genuinely high-resolution.** Only `iris.webp` (your supplied file) holds enough real detail for a 2× screen at 1920px.
- **Most files carry far less real detail than their dimensions suggest.**
  - 31 of the 35 files were cut from the two reference images: the 977px-wide homepage mockup, or the 1440×945 page concept screenshots. Each cut was then enlarged 2× with Lanczos.
  - So their pixel dimensions are twice their real detail. "True detail" below is the honest figure.
  - None of these can be made sharp by any rendering setting. They need new source images (Part 3).
- **One real rendering fault, now fixed.** Next.js was re-encoding every image as AVIF at quality 75, which cut file sizes by roughly 4–5× and threw away grain and hair detail. For example, the portrait went from 380 KB to 82 KB and the Studio collage from 331 KB to 77 KB.
- **The portrait** (your supplied image, 1086px wide) is the most important image on the site and has 46% of the detail a 2× display needs at 1920px.

## Part 1 — Asset table (sorted by visual importance)

- **True detail:** real source pixels, not interpolated ones.
- **Shown at:** the largest CSS width on screen at 1440 / 1920 / 375px.
- **2× need:** the largest of those widths × 2.
- **Score:** true detail ÷ 2× need. Below 100% means the image is being enlarged on high-density screens; below about 50% the blur is visible at 1×.

| # | File | Used in | File px | True detail | Alpha | Shown at (1440/1920/375) | 2× need | Score | Source |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `collage/portrait.webp` | Home hero figure | 1086×1448 | **1086px** | yes | 886 / 1181 / 263 | 2362px | 46% | Your supplied image |
| 2 | `collage/eye.webp` | Home hero eye | 324×396 | **162px** | yes | 237 / 316 / 120 | 632px | 26% | Homepage reference crop (977px mockup), 2× Lanczos |
| 3 | `collage/iris.webp` | Home hero iris | 2000×1148 | **2000px** | yes | 505 / 673 / 278 | 1346px | ✅ 149% | Your supplied image |
| 4 | `collage/moon.webp` | Home hero moon | 360×388 | **180px** | yes | 263 / 351 / 143 | 702px | 26% | Homepage reference crop (977px mockup), 2× Lanczos |
| 5 | `collage/rock.webp` | Home hero rock | 900×1225 | **900px** | yes | 174 / 232 / 113 | 464px | ✅ 194% | **Replaced 4 Nov** with batch 01 `rock.png`: AI-generated original, downscaled from 1075×1463. Old file in `assets/placeholders/` + `assets/originals-backup-2026-11-04/` |
| 6 | `collage/studio-hero-collage.webp` | Studio hero collage | 1624×968 | **1624px** | yes | 920 / 1227 / 416 | 2454px | 66% | **Replaced 4 Nov** with a newly generated image at its native size (not enlarged). Better detail, but below the 2760px target. Clean alpha edges on dark. Its paper tail reaches further left than before, so the tagline and intro now sit above the collage (z-10, with a soft dark text shadow). Old file in `assets/header-backup-2026-11-04-before-regen/` |
| 7 | `collage/art-hero-brush.webp` | Art hero brush | 1688×932 | **1688px** | yes | 920 / 1227 / 375 | 2454px | 69% | **Replaced 4 Nov** with a newly generated image at its native size (not enlarged). Better detail, but below the 2760px target. No visible halo on dark; a very faint magenta fringe shows only when alpha is amplified 8×. Old file in `assets/header-backup-2026-11-04-before-regen/` |
| 8 | `collage/words-hero-collage.webp` | Words hero collage | 1306×1205 | **1306px** | yes | 850 / 1133 / 297 | 2266px | 58% | **Replaced 4 Nov** with a newly generated image at its native size (not enlarged). Better detail, but below the 2550px target. Clean alpha edges on dark. Old file in `assets/header-backup-2026-11-04-before-regen/` |
| 9 | `collage/about-hero-collage.webp` | About hero collage | 1476×1065 | **1476px** | yes | 1013 / 1350 / 375 | 2700px | 55% | **Replaced 4 Nov** with a newly generated image at its native size (not enlarged). Better detail, but below the 3036px target. Clean alpha edges on dark, no halo. Old file in `assets/header-backup-2026-11-04-before-regen/` |
| 10 | `collage/photo-feature.webp` | Photography feature / viewer / Music playlist | 1232×1230 | **616px** | no | 782 / 1042 / 343 | 2084px | 30% | Concept screenshot crop, 2× Lanczos |
| 11 | `collage/art-statue.webp` | Art exhibition + /art/marble-study | 780×480 | **390px** | no | 763 / 1017 / 338 | 2034px | 19% | Concept screenshot crop, 2× Lanczos |
| 12 | `collage/studio-print.webp` | Studio project + Art gallery | 760×512 | **380px** | no | 764 / 1018 / 338 | 2036px | 19% | Concept screenshot crop, 2× Lanczos |
| 13 | `collage/photo-moon.webp` | Photography grid/viewer + Music playlist | 398×524 | **199px** | no | 547 / 729 / 343 | 1458px | 14% | Concept screenshot crop, 2× Lanczos |
| 14 | `collage/photo-coast.webp` | Photography grid | 398×524 | **199px** | no | 429 / 572 / 332 | 1144px | 17% | Concept screenshot crop, 2× Lanczos |
| 15 | `collage/photo-tree.webp` | Photography thumbnails | 390×524 | **195px** | no | 203 / 270 / 96 | 540px | 36% | Concept screenshot crop, 2× Lanczos |
| 16 | `collage/art-brush-study.webp` | Art gallery + Music playlist | 740×480 | **370px** | no | 532 / 709 / 343 | 1418px | 26% | Concept screenshot crop, 2× Lanczos |
| 17 | `works/the-second-nature.webp` | Home archive + Art gallery | 294×230 | **147px** | no | 532 / 709 / 336 | 1418px | 10% | Homepage reference crop (977px mockup), 2× Lanczos |
| 18 | `collage/studio-paper.webp` | Studio project | 940×980 | **470px** | no | 533 / 711 / 337 | 1422px | 33% | Concept screenshot crop, 2× Lanczos |
| 19 | `collage/contact-horizon.webp` | Contact framed photo | 1600×1266 | **1600px** | no | 463 / 617 / 334 | 1234px | ✅ 130% | **Replaced 4 Nov** (batch 02) |
| 20 | `collage/contact-hero-rock.webp` | Contact rock | 804×736 | **402px** | yes | 426 / 568 / 240 | 1136px | 35% | Concept screenshot crop, 2× Lanczos |
| 21 | `collage/about-hero-moon.webp` | About moon | 690×584 | **345px** | yes | 346 / 461 / 206 | 922px | 37% | Concept screenshot crop, 2× Lanczos |
| 22 | `collage/manifesto-collage.webp` | Home 01 manifesto collage | 734×436 | **367px** | yes | 541 / 721 / 343 | 1442px | 25% | Homepage reference crop (977px mockup), 2× Lanczos |
| 23 | `collage/about-collage.webp` | Home 03 about + /art/marble-study | 2000×1168 | **2000px** | yes | 555 / 740 / 375 | 1480px | ✅ 135% | **Replaced 4 Nov** (batch 02), real alpha, clean edges |
| 24 | `collage/music-collage.webp` | Home music collage | 492×256 | **246px** | yes | 363 / 484 / hidden | 968px | 25% | Homepage reference crop (977px mockup), 2× Lanczos |
| 25 | `works/a-quiet-exit.webp` | Home archive + Photography detail | 290×230 | **145px** | no | 551 / 735 / 343 | 1470px | 10% | Homepage reference crop (977px mockup), 2× Lanczos |
| 26 | `works/world-photography.webp` | World cards (Home, About) + Photography detail | 350×224 | **175px** | no | 551 / 735 / 343 | 1470px | 12% | Homepage reference crop (977px mockup), 2× Lanczos |
| 27 | `works/world-studio.webp` | World cards (Home, About) | 1600×1000 | **1600px** | no | 261 / 348 / 338 | 696px | ✅ 230% | **Replaced 4 Nov** (batch 02, stray edge scrap painted out) |
| 28 | `works/world-art.webp` | World cards (Home, About) | 342×224 | **171px** | no | 261 / 348 / 338 | 696px | 25% | Homepage reference crop (977px mockup), 2× Lanczos |
| 29 | `works/world-words.webp` | World cards (Home, About) | 1600×1000 | **1600px** | no | 261 / 348 / 338 | 696px | ✅ 230% | **Replaced 4 Nov** (batch 02, lavender edge sliver painted out) |
| 30 | `works/world-music.webp` | World cards (Home, About) | 392×224 | **196px** | no | 261 / 348 / 338 | 696px | 28% | Homepage reference crop (977px mockup), 2× Lanczos |
| 31 | `works/red-moon-variations.webp` | Home archive + Music | 298×230 | **149px** | no | 258 / 344 / 318 | 688px | 22% | Homepage reference crop (977px mockup), 2× Lanczos |
| 32 | `works/fragments-vol-1.webp` | Home archive + Music | 326×230 | **163px** | no | 237 / 316 / 167 | 632px | 26% | Homepage reference crop (977px mockup), 2× Lanczos |
| 33 | `collage/about-moon.webp` | Home 03 about moon | 314×280 | **157px** | yes | 230 / 307 / 192 | 614px | 26% | Homepage reference crop (977px mockup), 2× Lanczos |
| 34 | `collage/contact-rock.webp` | Home get-in-touch rock | 324×288 | **162px** | yes | 239 / 319 / hidden | 638px | 25% | Homepage reference crop (977px mockup), 2× Lanczos |

**Not raster, already sharp at any density:**
- The wordmark: inline SVG paths, plus a 512px ink texture tile that repeats.
- Every placeholder `Plate` artwork (generated SVG).
- Torn-paper edges, rules, sparkles, orbits and icons.
- The grain, paper and vignette overlays (procedural SVG noise).

**Other quality notes:**
- **Halo risk:** pieces keyed off a dark background (eye, moon, rock, every `*-collage`, contact rock) have soft, semi-dark fringes. Those fringes are left over from the keying, not a real alpha cut. New files with true alpha fix this.
- **Patched source:** `photo-feature` was partly repainted to remove text from the concept, so a small area is invented texture.
- **Monochrome filter:** `.photo-mono` (grayscale, contrast 1.12, brightness 0.92) is applied to the photography images. It adds no blur, so it stays as art direction.
- **Grain overlay:** the 11% animated film grain over the whole page is part of the look. It slightly lowers perceived sharpness, but it is not a fault.

## Part 2 — Rendering fixes made

1. **Encoding** (`next.config.ts`):
   - AVIF q75 → **WebP q92**, and `images.qualities: [92]`.
   - Files now leave the optimizer close to their source quality: portrait 373 KB, iris 557 KB, Studio collage 344 KB at w=1920.
   - Before/after crops: `.tmp/image-quality-before-after.png`.
   - The portrait's hair and the iris's grain visibly improve. The Studio collage barely changes, because its source is itself an enlargement.
2. **Undersized `sizes` attributes:**
   - Homepage "get in touch" rock: `13vw` → `17vw`. It is displayed at 16.6vw.
   - Art exhibition list: `45vw` → `55vw`. It is displayed at about 52vw.
   - Every other `sizes` value was checked against the measured width and already asks for a large enough file.
3. **Words hero collage:** removed a 3px grey vertical line on its right edge, left over from the concept's frame.
4. **Asset manifest:** the recommended `target` sizes for `studio-print`, `studio-paper` and `art-statue` are raised to what a 2× display at 1920px needs.
5. **Aspect ratios:** checked. Each cut-out renders with `object-contain` in a box with its natural ratio. Opaque photos use `object-cover` inside frames that already match their crop, so nothing is stretched.

## Part 3 — Replacements needed

I have no image-generation tool in this environment, and I won't upscale these files and present them as high-resolution. Each asset below needs a genuinely new source. That can be your own photo or artwork, a properly licensed original, or an image you generate from the prompt given.

**Import any of them with one command.** It checks transparency, dimensions and aspect ratio, and fits the file into the locked frame so the layout cannot move:

```
npm run asset -- <slot> path/to/file.png
```

**Common spec for every asset:**
- **Format:** PNG (16-bit is fine) or lossless WebP. Never JPEG for cut-outs.
- **Cut-outs:** transparent background with a real alpha channel. No black, white or checkerboard rectangle. Cut by hand or with a matte. Paper fibres along torn edges should be partially transparent, not keyed out.
- **Colour:** black-and-white silver-gelatin look; lavender `#ab92d9`–`#c9b8ec` only where the current piece has it; warm ivory paper `#ece5d8`.
- **Grain:** fine 35mm film grain, about ISO 400, baked into the image at the delivered size, not added after an enlargement.
- **Framing:** the same crop, angle and subject position as the current piece (see `IMAGE-AUDIT-contact-sheet.png`). The frame aspect ratios are fixed by the manifest.

**Style suffix to add to every generation prompt below:**
> analog black-and-white film photograph, silver gelatin print, fine 35mm grain, deep charcoal blacks, soft cinematic light, surreal editorial collage aesthetic, high detail, sharp focus, no text, no watermark

### Priority 1 — Homepage hero (largest and most visible)

| Slot | Deliver at | Alpha | Brief / prompt |
|---|---|---|---|
| `portrait` | 2400×3200 or more | yes | **Best source: your original photo at full resolution.** The current cut-out came from a 1086px file. If you have the camera original, send it and I'll re-cut it. Prompt if generating: _young woman in profile facing right, head tilted back, eyes closed, serene, shoulder-length dark wavy hair blowing loose to the left, black turtleneck, studio, isolated cut-out on transparent background_ |
| `eye` | 1200×1467 | yes | _torn scrap of lavender-tinted paper with a close-up of a single human eye looking forward, heavy lashes, torn ragged paper edges with visible fibres, slight tilt_ (you said you're re-exporting this one) |
| `moon` | 1200×1293 | yes | _torn vintage photo print, slightly rotated, full moon above billowing cumulus clouds, ivory paper border, curled torn corners_ |
| `rock` | — | — | ✅ Replaced 4 Nov (graphics batch 01). |
| `iris` | — | — | ✅ No replacement needed. |

### Priority 2 — Page hero collages (each about 64–94vw wide)

| Slot | Deliver at | Alpha | Brief |
|---|---|---|---|
| `about-hero-collage` | 3036×2190 | yes | ⚠️ Replaced 4 Nov with a 1476×1065 generated version (sharper, still under target). Classical marble bust (Apollo type) turned three-quarters up and right, framed by torn cloud-photo scraps and lavender paint-daubed paper, torn edges, layered collage. Pieces layered across the left two-thirds. |
| `studio-hero-collage` | 2760×1644 | yes | ⚠️ Replaced 4 Nov with a 1624×968 generated version (sharper, still under target). A single sheet of folded ivory paper twisting like a wave across the frame, with a broad dry-brush lavender stroke beneath it, on transparent ground. |
| `art-hero-brush` | 2760×1524 | yes | ⚠️ Replaced 4 Nov with a 1688×932 generated version (sharper, still under target). Expressive palette-knife strokes of lavender, violet and ivory paint, torn into horizontal collage strips, thick impasto texture. |
| `words-hero-collage` | 2550×2355 | yes | ⚠️ Replaced 4 Nov with a 1306×1205 generated version (sharper, still under target). Torn aged manuscript page with faded cursive handwriting, black silhouettes of wildflowers and thistles overlaid, a thin ink loop at top, torn pale rock at the bottom. |
| `photo-feature` | 2400×2396 | no | Motion-blurred figure whipping their hair, head turning, dark vignetted backdrop, ghosted. **Ideal: your own long-exposure photo.** |

### Priority 3 — Gallery and project images (shown up to about 1000px)

| Slot | Deliver at | Brief |
|---|---|---|
| `art-statue` | 2100×1292 | Close-up of a marble bust, curly hair, looking up and right, dramatic side light, black background. |
| `studio-print` | 2100×1415 | Red-orange full moon in a night sky with dusky pink clouds, a corner of a pale pink concrete building with one square window (keep the colour; this one isn't monochrome). |
| `photo-moon` | 1600×2107 | Portrait-format: full moon glowing through haze over a sea of clouds. |
| `photo-coast` | 1600×2107 | Portrait-format: rocky coastline, sea stacks, waves breaking, overcast. |
| `photo-tree` | 1600×2150 | Portrait-format: lone bare tree in an empty field, low horizon, flat grey sky. |
| `art-brush-study` | 1600×1038 | Diagonal lavender and ivory paint strokes on black, flecks and splatter. |
| `the-second-nature` | 1600×1260 | Marble bust crowned with pale lilies, flowers sprouting from the head, black background. |
| `studio-paper` | 1500×1564 | The same folded-paper wave as the Studio hero, on black, with a lavender stroke below. |
| `contact-horizon` | 1600×1266 | A lone figure standing on a dark hillside under a pale lavender sky, paper texture. |
| `contact-hero-rock` | 1400×1282 (alpha) | Pale granite rock edge rising from the lower right, cut-out. |
| `about-hero-moon` | 1380×1168 (alpha) | Full moon with thin lavender elliptical orbit lines, cut-out. |

### Priority 4 — Homepage sections, world cards, archive

| Slot | Deliver at | Brief |
|---|---|---|
| `manifesto-collage` | 2400×1426 (alpha) | Lavender hibiscus flower, a torn lavender-sky print with a tiny figure on a ridge, thin ink orbit lines. |
| `about-collage` | 2000×1168 (alpha) | Marble bust with a torn lavender cloud photo, torn edges. |
| `music-collage` | 1800×937 (alpha) | Vintage over-ear headphones, a waveform line, lavender paint scraps. |
| `world-studio` / `-photography` / `-art` / `-words` / `-music` | 1600×1000 each | Studio: paper ribbon waves with a lavender stroke · Photography: blurred figure turning · Art: torn lavender paint collage · Words: torn handwritten page with flower silhouettes · Music: vinyl record with lavender label and a waveform. |
| `a-quiet-exit` | 1600×1260 | Motion-blurred figure walking away through a lavender-tinted meadow, haze. |
| `red-moon-variations` | 1600×1260 | Variant of `studio-print` (red moon and a pink building). |
| `fragments-vol-1` | 1600×1260 | Clear cassette tape on black, lavender tint. The label text "PSYIXEL" can be added later as real type. |
| `about-moon` / `contact-rock` | 1200×1070 / 1200×1067 (alpha) | Moon with orbit lines; pale rock edge. |

## Part 4 — Quality control checklist (run per replacement)

- [ ] `npm run asset` passes: real alpha, correct ratio, at or above the target size.
- [ ] Live preview at 1440, 1920 and 375px, with screenshots before and after.
- [ ] 2× zoom check for halos, banding, compression artifacts and pixelation.
- [ ] Optimizer output size checked at w=1920; page weight noted.
- [ ] Animations (reveal, parallax, spin) and interactions still work.
