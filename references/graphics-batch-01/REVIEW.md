# Graphics batch 01: review (4 Nov 2026)

**Imported 4 Nov:** `rock` only (via `npm run asset`; the previous file is in `assets/placeholders/rock.webp`). Nothing else was imported. Every current file is backed up in `assets/originals-backup-2026-11-04/`. I previewed each candidate by temporarily swapping it into the live page; the temporary files are gone.

## Technical checks (all eight pass)

| Slot | Size vs target | Ratio drift | Alpha | Fine detail (current → candidate)\* |
|---|---|---|---|---|
| rock | 900×1225 = target | 0.02% | real alpha, clean edge (0.3% semi-transparent, no dark fringe; current: 15%, 86% dark) | 1.4 → **24.7** |
| studio-hero-collage | 2760×1644 = target | 0% | real alpha | 3.9 → 2.8 |
| art-hero-brush | 2760×1524 = target | 0% | real alpha | 6.6 → 5.1 |
| world-studio / -art / -words / -music / -photography | 1600×1000 = target | 0.11% | opaque (alpha channel unused) | 1.4–2.9 → 7–31 |

\* Fine detail = mean edge contrast (Laplacian) at an equal 800px width. It shows real detail versus soft enlargements, but a flat vector image scores low even when it is crisp.

## Visual verdict

| Candidate | Verdict | Why |
|---|---|---|
| **rock** | ✅ **Import** | Real photographic rock texture where the current file is a blurred enlargement of the mockup. The alpha cut is clean, with no dark halo. It fills the same box; the silhouette is a slightly narrower peak with a little more empty space on the left. |
| studio-hero-collage | ❌ Don't import | Sharp, but flat vector shading replaces the photographed paper and grain. The ribbon now crosses the "STUDIO" title, and the lavender stroke shrinks and moves left. That changes the locked composition. |
| art-hero-brush | ❌ Don't import | Two smooth, zig-zag-edged bands replace the dense impasto collage. The texture and the composition are both lost. |
| world-photography | ❌ Don't import | It reuses the hero portrait, so the homepage would show the same face twice. It is also not the blurred figure turning, and not an independent photograph (the README says so too). |
| world-studio, world-art | ❌ Don't import | Same flat vector language as the rejected heroes. They read as clip-art next to the photographic archive cards. |
| world-words | ❌ Don't import | Crisp, but the squiggle "handwriting" reads as fake text, and the flowers are flat silhouettes. The current card looks more authentic despite being soft. |
| world-music | ⚠️ Optional / not recommended | The cleanest of the cards, but the waveform is a hairline (the lavender burst is the card's focal point) and the record has no surface texture. Mixed with the other four current cards, it would look out of style. |

**experimental_not_for_import/** was not opened for import or previewed in the site, as instructed.

## Still unresolved (need genuine high-detail sources)
Every photograph-like image other than the iris, rock (once imported) and portrait (already being tracked) remains low-resolution. See `IMAGE-AUDIT.md`. Notably: the eye, moon, page-hero collages, photography set, art-statue, studio-print and archive covers.
