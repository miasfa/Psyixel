// Traces the PSYIXEL wordmark from the 977×1610 reference into vector paths.
//
//   node scripts/build-wordmark.mjs <reference image>
//
// 1. Ivory-ink mask of the lettering (reference px).
// 2. Removes things that aren't letters (index list, tagline, eye paper).
// 3. Adds reconstructions ONLY where the reference hides the letters behind
//    the portrait (Y stem, lower I, X lower-left leg) — extrapolated from the
//    visible edges, listed below so they can be refined.
// 4. Smooths (4× upsample + light blur closes specks/hair strands) and traces.
// 5. Writes src/components/art/wordmark-data.ts: one outline path, plus one
//    clip region per letter so every letter is a separate animatable layer.
import { writeFileSync } from "node:fs";
import { readFileSync } from "node:fs";
import sharp from "sharp";
import potrace from "potrace";

const src = process.argv[2];
if (!src) throw new Error("Usage: node scripts/build-wordmark.mjs <reference image>");

// Wordmark region in reference px.
const X0 = 10, Y0 = 38, W = 880, H = 292, S = 4; // S = trace scale

// Not letters: [x, y, w, h] in reference px.
const EXCLUDE = [
  [85, 262, 77, 30], // STUDIO / PHOTOGRAPHY… index (left of the S foot)
  [85, 292, 140, 90], // …and below it
  [660, 284, 260, 60], // "Between" tagline
  [866, 30, 120, 300], // eye paper / beyond the L
];
// Not letters, irregular: face highlights between the X legs (polygon, reference px).
const EXCLUDE_POLY = [
  [[552, 204], [562, 204], [594, 272], [596, 300], [520, 300]],
];

// Hidden behind the portrait in the reference → reconstructed (reference px).
const RECONSTRUCT = [
  // Y stem: straight down from the visible fork (x 343–400) to the baseline.
  [[343, 152], [401, 152], [402, 289], [342, 289]],
  // I: continues its visible left lean (≈ -0.15 px/px) to the baseline.
  [[443, 138], [491, 138], [468, 289], [420, 289]],
  // X lower-left leg: mirror of the visible lower-right leg.
  [[523, 190], [568, 190], [530, 289], [480, 289]],
  // P stem: straight edges under the print damage; slanted foot as in the reference.
  [[27, 56], [80, 56], [80, 290], [27, 306]],
  [[27, 54], [125, 54], [125, 92], [27, 92]], // P top band (print damage)
  [[121, 64], [146, 61], [157, 65], [164, 73], [167, 86], [168, 150], [118, 150]], // P bowl, inside the rounded corner
  // S lower bowl below the counter, where dense hair hides it (follows the outer curve).
  [[225, 228], [262, 222], [300, 212], [304, 240], [293, 262], [272, 276], [245, 281], [222, 280]],
  // L foot: completed under the eye paper (top 203, toe x 861).
  [[790, 203], [860, 203], [861, 263], [790, 268]],
];
// Hidden/damaged curves rebuilt as strokes: [svg path in reference px, stroke width].
const RECONSTRUCT_STROKES = [];

// The S is close to point-symmetric: its lower-right bowl (behind hair in the
// reference) is rebuilt by rotating its clean upper-left bowl 180° about the
// letter's centre — the reference's own pixels, not a drawn guess.
// [source x0, y0, x1, y1] (reference px) and centre (cx, cy).
// Only the outer band of the bowl is mirrored, so the lower counter stays true to the reference.
// Counters cut back out after the fills, from the reference's measured edges.
const CARVE = [
  [[83, 98], [118, 98], [111, 145], [83, 145]], // P counter
];

const MIRROR_S = { src: [172, 60, 212, 170], cx: 237, cy: 164 };

// Letter boundaries (reference px), left→right; each is a polyline top→bottom.
const CUTS = [
  [[171, 0], [171, 192], [120, 198], [120, 400]], // P | S
  [[293, 0], [293, 60], [305, 80], [313, 100], [322, 140], [326, 400]], // S | Y
  [[452, 0], [452, 54], [444, 80], [437, 100], [431, 120], [424, 140], [415, 170], [411, 400]], // Y | I
  [[506, 0], [507, 54], [509, 80], [512, 110], [516, 150], [518, 195], [474, 290], [474, 400]], // I | X
  [[649, 0], [649, 54], [642, 80], [637, 100], [633, 200], [640, 250], [644, 270], [644, 400]], // X | E
  [[751, 0], [751, 400]], // E | L
];
const LETTERS = Array.from("PSYIXEL");

// ── 1–3. mask ───────────────────────────────────────────────────
const { data } = await sharp(readFileSync(src)).removeAlpha().extract({ left: X0, top: Y0, width: W, height: H }).raw().toBuffer({ resolveWithObject: true });
const mask = Buffer.alloc(W * H);
for (let p = 0; p < W * H; p++) {
  const r = data[p * 3], g = data[p * 3 + 1], b = data[p * 3 + 2];
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  mask[p] = lum > 170 && r - b > 4 && r - b < 45 ? 255 : 0;
}
{
  const { src: [sx0, sy0, sx1, sy1], cx, cy } = MIRROR_S;
  for (let y = sy0; y <= sy1; y++)
    for (let x = sx0; x <= sx1; x++) {
      if (!mask[(y - Y0) * W + (x - X0)]) continue;
      const tx = Math.round(2 * cx - x), ty = Math.round(2 * cy - y);
      if (tx >= X0 && tx < X0 + W && ty >= Y0 && ty < Y0 + H) mask[(ty - Y0) * W + (tx - X0)] = 255;
    }
}
for (const [x, y, w, h] of EXCLUDE)
  for (let yy = Math.max(0, y - Y0); yy < Math.min(H, y - Y0 + h); yy++)
    for (let xx = Math.max(0, x - X0); xx < Math.min(W, x - X0 + w); xx++) mask[yy * W + xx] = 0;

const poly = (pts) => pts.map(([x, y]) => `${(x - X0) * S},${(y - Y0) * S}`).join(" ");
const cutout = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W * S}" height="${H * S}">${EXCLUDE_POLY.map((p) => `<polygon points="${poly(p)}" fill="#000"/>`).join("")}</svg>`);
const recon = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W * S}" height="${H * S}">` +
    RECONSTRUCT.map((p) => `<polygon points="${poly(p)}" fill="#fff"/>`).join("") +
    `<g transform="scale(${S}) translate(${-X0} ${-Y0})">` +
    RECONSTRUCT_STROKES.map(([d, w]) => `<path d="${d}" stroke="#fff" stroke-width="${w}" fill="none"/>`).join("") +
    `</g></svg>`,
);

// ── 4. smooth + trace ──────────────────────────────────────────
// Morphological closing (dilate → erode) removes print specks and hair strands
// inside the letters without moving their outer edges.
const up = await sharp(mask, { raw: { width: W, height: H, channels: 1 } })
  .resize(W * S, H * S, { kernel: "cubic" })
  .composite([{ input: cutout, blend: "darken" }])
  .png()
  .toBuffer();
const dilated = await sharp(up).blur(7).threshold(40).png().toBuffer();
const closed = await sharp(dilated).blur(7).threshold(178).png().toBuffer(); // tuned so outer edges land on the reference's
const carve = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W * S}" height="${H * S}">${CARVE.map((p) => `<polygon points="${poly(p)}" fill="#000"/>`).join("")}</svg>`);
const big = await sharp(closed)
  .composite([{ input: recon, blend: "lighten" }, { input: carve, blend: "darken" }])
  .blur(2)
  .threshold(128)
  .png()
  .toBuffer();
writeFileSync(".tmp/wordmark-mask.png", big);

const svg = await new Promise((res, rej) =>
  potrace.trace(big, { turdSize: 900, optTolerance: 0.35, alphaMax: 1.05, threshold: 128, blackOnWhite: false, color: "#000", background: "transparent" }, (e, s) => (e ? rej(e) : res(s))),
);
const d = svg.match(/ d="([^"]+)"/)[1];

// ── 5. regions + write ─────────────────────────────────────────
const toLocal = (pts) => pts.map(([x, y]) => [Math.round((x - X0) * S), Math.round((y - Y0) * S)]);
const left = [[[X0 - 50, 0], [X0 - 50, 400]], ...CUTS];
const right = [...CUTS, [[X0 + W + 50, 0], [X0 + W + 50, 400]]];
const regions = LETTERS.map((_, i) => {
  const a = toLocal(left[i]), b = toLocal(right[i]).reverse();
  return [...a, ...b].map(([x, y]) => `${x},${y}`).join(" ");
});
// rough per-letter centre (transform origin for scroll scatter), as % of the box
const centres = LETTERS.map((_, i) => {
  const xs = [...left[i], ...right[i]].map(([x]) => x);
  const cx = (Math.min(...xs.filter((x) => x > 0)) + Math.max(...xs)) / 2;
  return [+(((cx - X0) / W) * 100).toFixed(1), 55];
});

const out = `// Generated by scripts/build-wordmark.mjs from the reference mockup — do not edit by hand.
// Traced outline of the PSYIXEL wordmark (reference px × ${S}), plus one clip
// region per letter so each letter can animate independently.
export const WORDMARK = {
  width: ${W * S},
  height: ${H * S},
  /** Position of the traced box in the 977px-wide reference (for layout). */
  ref: { x: ${X0}, y: ${Y0}, w: ${W}, h: ${H}, page: 977 },
  path: ${JSON.stringify(d)},
  letters: ${JSON.stringify(LETTERS)},
  regions: ${JSON.stringify(regions)},
  /** Transform origin per letter, % of the wordmark box. */
  origins: ${JSON.stringify(centres)},
} as const;
`;
writeFileSync("src/components/art/wordmark-data.ts", out);
writeFileSync(".tmp/wordmark.json", JSON.stringify({ width: W * S, height: H * S, path: d, regions, ref: { x: X0, y: Y0, w: W, h: H } }));
console.log(`path ${d.length} chars, ${LETTERS.length} letter regions → src/components/art/wordmark-data.ts`);
