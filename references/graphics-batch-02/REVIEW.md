# Graphics batch 02: review (4 Nov 2026)

Four candidates were supplied in chat. All four were previewed in place (in a background browser tab, at desktop and 375px mobile) and imported.

| Slot | Size / ratio | Alpha & edges | Verdict |
|---|---|---|---|
| world-studio | 1600×1000, −0.11% | opaque | ✅ Imported. Photographic organza ribbon plus impasto stroke, replacing a blurred crop. **Fixed:** a stray ivory scrap on the right edge (x 1579–1599, y 641–684) was painted black; it was visible on the mobile card. The 3:4 crop on the About page still shows both the ribbon and the stroke. |
| world-words | 1600×1000, −0.11% | opaque | ✅ Imported. Torn manuscript with flower silhouettes, matching the original subject at much higher detail. **Fixed:** a lavender sliver on the left edge (x 0–27, y 119–276) was painted black. |
| about-collage | 2000×1168, −0.02% | real alpha: 15% fully transparent, 0.9% soft edge, no white or dark fringe (0.1% opaque near-white) | ✅ Imported. Clean cut-out on the dark page. The bust is cropped flat by the frame at the left and bottom, as the original was. On desktop the cloud tucks behind "PSYIXEL", like the previous lavender scrap did. |
| contact-horizon | 1600×1266, 0% | opaque | ✅ Imported. Same composition (lone figure, slope from the left), with real rock and paper texture in place of mush. |

**Backups:**
- **Originals:** `assets/placeholders/<slot>.webp` (written by `npm run asset`), plus the full snapshot in `assets/originals-backup-2026-11-04/`.
- **Supplied files:** kept untouched here. The edge-cleaned versions that were imported are `*-cleaned.png`.

**Cache:** the world covers are referenced as fixed paths, so `src/content/worlds.ts` now adds `?v=2` to them. Without it, browsers that had cached the old optimized image kept showing it.
