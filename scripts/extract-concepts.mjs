// Cuts collage layers out of the interior-page concept images
// (references/inner-pages/*-visual-concept.png, 1440×945) so each page can be
// built with live HTML text over separate image layers. Coordinates are in
// concept px; at a 1440px viewport, 1px = 1/14.4 vw.
//
// Usage: node scripts/extract-concepts.mjs [page]
//
// Keys:  lum  near-black → transparent (lum: [lo, hi] sets the luminance ramp)   none  opaque rectangle
// erase: [x, y, w, h] concept-px rectangles made transparent (stray text).
// patch: [x, y, w, h, dx, dy] covers a rectangle with pixels copied from (x+dx, y+dy)
//        — removes overlaid UI marks from opaque photos.
// heal:  [x, y, w, h] fills a rectangle with a heavily blurred copy of its
//        surroundings, feathered at the edges (for marks on busy textures).
import { mkdirSync, readFileSync } from "node:fs";
import sharp from "sharp";

const DIR = "references/inner-pages";
const OUT = "public/images/collage";

const PAGES = {
  studio: {
    src: `${DIR}/studio-visual-concept.png`,
    pieces: [
      // sculptural paper/fabric form + lavender brush, as one layer
      { slot: "studio-hero-collage", x: 520, y: 92, w: 920, h: 548, key: "lum", erase: [[520, 578, 285, 62], [520, 120, 178, 205]] },
      // framed red-moon print (photo only; the frame is drawn in HTML)
      { slot: "studio-print", x: 958, y: 650, w: 380, h: 256, key: "none" },
      // square crop of the paper form, for the "Paper Studies" sample project tile
      { slot: "studio-paper", x: 860, y: 92, w: 470, h: 490, key: "none" },
    ],
  },
  photography: {
    src: `${DIR}/photography-visual-concept.png`,
    pieces: [
      // hero feature photo (bleeds off the bottom); title sits just above it
      { slot: "photo-feature", x: 66, y: 330, w: 616, h: 615, key: "none", patch: [[70, 838, 64, 60, 70, 0]] },
      // three framed prints — photo area only, frames are drawn in HTML
      { slot: "photo-moon", x: 729, y: 469, w: 199, h: 262, key: "none" },
      { slot: "photo-coast", x: 960, y: 469, w: 199, h: 262, key: "none" },
      { slot: "photo-tree", x: 1190, y: 469, w: 195, h: 262, key: "none" },
    ],
  },
  // The Art concept has a ~33px outer frame; positions on the page subtract it.
  art: {
    src: `${DIR}/art-visual-concept.png`,
    pieces: [
      // lavender/ivory brush strokes (year mark "20 / 25 //" removed)
      { slot: "art-hero-brush", x: 520, y: 112, w: 920, h: 508, key: "lum", erase: [[1340, 530, 60, 102], [520, 500, 42, 70]] },
      // tile photos (frames + arrows drawn in HTML; arrows patched out)
      { slot: "art-statue", x: 88, y: 636, w: 390, h: 240, key: "none", heal: [[432, 832, 48, 40]] },
      { slot: "art-brush-study", x: 941, y: 636, w: 370, h: 240, key: "none", heal: [[1266, 832, 48, 40]] },
    ],
  },
  // Same ~33px outer frame as the Art concept.
  words: {
    src: `${DIR}/words-visual-concept.png`,
    pieces: [
      // torn handwritten page, flower silhouettes, rock and lavender pen loop
      // (title tail and the journal list's dates/arrows/rules removed)
      { slot: "words-hero-collage", x: 590, y: 135, w: 850, h: 785, key: "lum", erase: [[590, 135, 112, 210], [590, 585, 318, 300], [1436, 135, 4, 785]] },
    ],
  },
  about: {
    src: `${DIR}/about-visual-concept.png`,
    pieces: [
      // marble head, clouds and lavender paper scraps (title letters removed)
      { slot: "about-hero-collage", x: 0, y: 180, w: 1012, h: 730, key: "lum", lum: [17, 30], erase: [[230, 180, 662, 236], [938, 180, 74, 390]] },
      // moon with its lavender orbit
      { slot: "about-hero-moon", x: 1048, y: 560, w: 345, h: 292, key: "lum", lum: [17, 30] },
    ],
  },
  // The Contact concept shows the page at ~94% scale (content 1358px wide);
  // page positions multiply concept px by 1440/1358.
  contact: {
    src: `${DIR}/contact-visual-concept.png`,
    pieces: [
      // framed horizon photo (frame drawn in HTML)
      { slot: "contact-horizon", x: 46, y: 512, w: 436, h: 345, key: "none" },
      // rock fragment, bottom right (link arrows/rules and the page border removed)
      { slot: "contact-hero-rock", x: 950, y: 540, w: 402, h: 368, key: "lum", lum: [17, 30], erase: [[950, 500, 216, 270]] },
    ],
  },
};

const smooth = (v, a, b) => Math.max(0, Math.min(1, (v - a) / (b - a)));
mkdirSync(OUT, { recursive: true });

const only = process.argv[2];
for (const [page, { src, pieces }] of Object.entries(PAGES)) {
  if (only && only !== page) continue;
  const img = readFileSync(src);
  for (const p of pieces) {
    const { data, info } = await sharp(img).extract({ left: p.x, top: p.y, width: p.w, height: p.h }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    if (p.key === "lum")
      for (let i = 0; i < info.width * info.height; i++) {
        const lum = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
        data[i * 4 + 3] = Math.round(smooth(lum, ...(p.lum ?? [20, 52])) * 255);
      }
    for (const [px, py, pw, ph, dx, dy] of p.patch ?? [])
      for (let y = py - p.y; y < py - p.y + ph; y++)
        for (let x = px - p.x; x < px - p.x + pw; x++) {
          if (x < 0 || y < 0 || x >= p.w || y >= p.h) continue;
          const sx = Math.min(p.w - 1, Math.max(0, x + dx)), sy = Math.min(p.h - 1, Math.max(0, y + dy));
          for (let c = 0; c < 4; c++) data[(y * p.w + x) * 4 + c] = data[(sy * p.w + sx) * 4 + c];
        }
    for (const [ex, ey, ew, eh] of p.erase ?? [])
      for (let y = Math.max(0, ey - p.y); y < Math.min(p.h, ey - p.y + eh); y++)
        for (let x = Math.max(0, ex - p.x); x < Math.min(p.w, ex - p.x + ew); x++) data[(y * p.w + x) * 4 + 3] = 0;
    let raw = data;
    if (p.heal?.length) {
      const blurred = await sharp(data, { raw: info }).blur(14).raw().toBuffer();
      for (const [hx, hy, hw, hh] of p.heal) {
        const F = 10; // feather px
        for (let y = hy - p.y - F; y < hy - p.y + hh + F; y++)
          for (let x = hx - p.x - F; x < hx - p.x + hw + F; x++) {
            if (x < 0 || y < 0 || x >= p.w || y >= p.h) continue;
            const dx = Math.max(hx - p.x - x, x - (hx - p.x + hw - 1), 0), dy = Math.max(hy - p.y - y, y - (hy - p.y + hh - 1), 0);
            const t = Math.max(0, 1 - Math.hypot(dx, dy) / F);
            for (let c = 0; c < 3; c++) { const i = (y * p.w + x) * 4 + c; raw[i] = Math.round(raw[i] * (1 - t) + blurred[i] * t); }
          }
      }
    }
    // 2× for high-density screens (source is 1:1 at a 1440px viewport).
    await sharp(raw, { raw: info })
      .resize({ width: info.width * 2, kernel: "lanczos3" })
      .sharpen({ sigma: 0.5 })
      .webp({ quality: 90, alphaQuality: 95 })
      .toFile(`${OUT}/${p.slot}.webp`);
    console.log(`${page}: ${OUT}/${p.slot}.webp`);
  }
}
