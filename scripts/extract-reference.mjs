// Cuts the collage pieces out of the PSYIXEL reference mockup as separate,
// individually replaceable image layers (text, wordmark, UI and lines stay
// real HTML). Coordinates are in the 977×1610 reference.
//
// Usage: node scripts/extract-reference.mjs path/to/reference.webp
//
// Keys:
//   lum  near-black → transparent (pieces sit on the page's dark ground)
//   lav  keep only lavender-tinted pixels (separates the iris from the neck behind it)
//   none opaque rectangle (photos that already have their own frame)
// erase: [x, y, w, h] rectangles (reference coords) made transparent — stray copy.
import { mkdirSync } from "node:fs";
import sharp from "sharp";

const src = process.argv[2];
if (!src) {
  console.error("Usage: node scripts/extract-reference.mjs <reference image>");
  process.exit(1);
}

const COLLAGE = "public/images/collage";
const WORKS = "public/images/works";

const pieces = [
  // hero
  { out: `${COLLAGE}/eye.webp`, x: 815, y: 26, w: 162, h: 198, key: "lum" },
  { out: `${COLLAGE}/moon.webp`, x: 0, y: 363, w: 180, h: 194, key: "lum" },
  { out: `${COLLAGE}/iris.webp`, x: 168, y: 372, w: 345, h: 198, key: "lav" },
  { out: `${COLLAGE}/rock.webp`, x: 858, y: 408, w: 119, h: 162, key: "lum", erase: [[858, 408, 50, 52], [858, 488, 24, 26]] },
  // 01 manifesto collage (flower, petal, horizon and orbit lines as one layer)
  { out: `${COLLAGE}/manifesto-collage.webp`, x: 585, y: 552, w: 367, h: 218, key: "lum", erase: [[585, 600, 10, 100]] },
  // five worlds: image band between each card's title and caption
  { out: `${WORKS}/world-studio.webp`, x: 15, y: 827, w: 185, h: 112, key: "none" },
  { out: `${WORKS}/world-photography.webp`, x: 212, y: 827, w: 175, h: 112, key: "none" },
  { out: `${WORKS}/world-art.webp`, x: 399, y: 827, w: 171, h: 112, key: "none" },
  { out: `${WORKS}/world-words.webp`, x: 581, y: 827, w: 176, h: 112, key: "none" },
  { out: `${WORKS}/world-music.webp`, x: 769, y: 827, w: 196, h: 112, key: "none" },
  // music
  { out: `${COLLAGE}/music-collage.webp`, x: 0, y: 993, w: 246, h: 128, key: "lum" },
  // selected work / archive
  { out: `${WORKS}/red-moon-variations.webp`, x: 291, y: 1151, w: 149, h: 115, key: "none" },
  { out: `${WORKS}/the-second-nature.webp`, x: 455, y: 1151, w: 147, h: 115, key: "none" },
  { out: `${WORKS}/a-quiet-exit.webp`, x: 615, y: 1151, w: 145, h: 115, key: "none" },
  { out: `${WORKS}/fragments-vol-1.webp`, x: 776, y: 1151, w: 163, h: 115, key: "none" },
  // about
  { out: `${COLLAGE}/about-collage.webp`, x: 0, y: 1288, w: 298, h: 174, key: "lum" },
  { out: `${COLLAGE}/about-moon.webp`, x: 805, y: 1316, w: 157, h: 140, key: "lum", erase: [[805, 1316, 95, 30]] },
  // get in touch
  { out: `${COLLAGE}/contact-rock.webp`, x: 815, y: 1466, w: 162, h: 144, key: "lum" },
];

const smooth = (v, a, b) => Math.max(0, Math.min(1, (v - a) / (b - a)));

mkdirSync(COLLAGE, { recursive: true });
mkdirSync(WORKS, { recursive: true });

for (const p of pieces) {
  const { data, info } = await sharp(src)
    .extract({ left: p.x, top: p.y, width: p.w, height: p.h })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  if (p.key !== "none") {
    for (let i = 0; i < info.width * info.height; i++) {
      const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      let a = smooth(lum, 18, 44);
      if (p.key === "lav") a = Math.min(a, smooth(b - g, 6, 22) * smooth(lum, 30, 60));
      data[i * 4 + 3] = Math.round(a * 255);
    }
  }
  for (const [ex, ey, ew, eh] of p.erase ?? []) {
    for (let y = Math.max(0, ey - p.y); y < Math.min(p.h, ey - p.y + eh); y++)
      for (let x = Math.max(0, ex - p.x); x < Math.min(p.w, ex - p.x + ew); x++) data[(y * p.w + x) * 4 + 3] = 0;
  }

  // 2× Lanczos upscale + light sharpening: the reference is only 977px wide.
  await sharp(data, { raw: info })
    .resize({ width: info.width * 2, kernel: "lanczos3" })
    .sharpen({ sigma: 0.6 })
    .webp({ quality: 90, alphaQuality: 95 })
    .toFile(p.out);
  console.log("wrote", p.out);
}
