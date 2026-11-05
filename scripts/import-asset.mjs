// Imports a finished artwork into its slot without touching any component.
//
//   npm run asset -- <slot> <file> [--fit cover|contain] [--force]
//   npm run asset -- --list
//
// - Checks transparency and aspect ratio against src/content/asset-manifest.json
// - Converts to WebP (keeping alpha), downsizes to the target size if larger
// - Backs up the placeholder it replaces to assets/placeholders/ (once)
// - Writes to the exact path the site already uses, so the layout is unchanged
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const manifest = JSON.parse(readFileSync("src/content/asset-manifest.json", "utf8"));
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const positional = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--fit");

if (flag("--list") || positional.length < 2) {
  console.log("Slots (priority · slot · target · alpha · used in):");
  for (const s of [...manifest.slots].sort((a, b) => a.priority - b.priority))
    console.log(`  P${s.priority}  ${s.slot.padEnd(20)} ${`${s.target[0]}×${s.target[1]}`.padEnd(11)} ${s.alpha ? "transparent" : "opaque     "}  ${s.usedIn}`);
  if (!flag("--list")) console.log("\nUsage: npm run asset -- <slot> <file> [--fit cover|contain] [--force]");
  process.exit(flag("--list") ? 0 : 1);
}

const [slotName, input] = positional;
const slot = manifest.slots.find((s) => s.slot === slotName);
if (!slot) fail(`Unknown slot "${slotName}". Run: npm run asset -- --list`);
if (!existsSync(input)) fail(`File not found: ${input}`);

const meta = await sharp(readFileSync(input)).metadata();
const [fw, fh] = slot.frame;
const frameRatio = fw / fh;
const ratio = meta.width / meta.height;
const drift = Math.abs(ratio / frameRatio - 1);
const fit = opt("--fit");
const force = flag("--force");

console.log(`${slot.slot}: ${meta.width}×${meta.height} (${ratio.toFixed(3)}), frame ${frameRatio.toFixed(3)}, ${meta.hasAlpha ? "has" : "no"} alpha`);

if (slot.alpha && !meta.hasAlpha && !force)
  fail("This slot needs a transparent background (PNG/WebP with alpha). Use --force to import an opaque image anyway.");
if (drift > 0.015 && !fit)
  fail(
    `Aspect ratio is ${(drift * 100).toFixed(1)}% off the frame. Re-export at ${slot.target[0]}×${slot.target[1]}, or add\n` +
      "  --fit cover    (crop to the frame, centred)\n" +
      "  --fit contain  (fit inside the frame, transparent/dark padding)",
  );
if (meta.width < slot.target[0] * 0.6) console.warn(`! Smaller than recommended (${slot.target[0]}px wide) — it may look soft on large screens.`);

const outW = Math.min(slot.target[0], meta.width);
const outH = Math.round(outW / frameRatio);
let img = sharp(readFileSync(input)).rotate();
if (drift > 0.015)
  img = img.resize(outW, outH, {
    fit: fit === "contain" ? "contain" : "cover",
    background: slot.alpha ? { r: 0, g: 0, b: 0, alpha: 0 } : { r: 12, g: 11, b: 13, alpha: 1 },
  });
else img = img.resize({ width: outW, withoutEnlargement: true });

// Destination: collage slots are found by name (any extension); works have a fixed path.
const dest = slot.kind === "collage" ? `${slot.path}.webp` : slot.path;
const dir = path.dirname(dest);
const base = path.basename(slot.path).replace(/\.webp$/, "");

mkdirSync("assets/placeholders", { recursive: true });
for (const f of readdirSync(dir).filter((f) => f.replace(/\.[^.]+$/, "") === base)) {
  const backup = path.join("assets/placeholders", f);
  if (!existsSync(backup)) {
    copyFileSync(path.join(dir, f), backup);
    console.log(`  placeholder kept at ${backup}`);
  }
  // Other formats of the same slot would compete with the new file; remove them.
  if (slot.kind === "collage" && path.join(dir, f) !== path.normalize(dest)) rmSync(path.join(dir, f));
}

const buffer = await img.webp({ quality: 90, alphaQuality: 100, effort: 5 }).toBuffer();
writeFileSync(dest, buffer);
const out = await sharp(buffer).metadata();
console.log(`✓ ${dest}  ${out.width}×${out.height}${out.hasAlpha ? " (transparent)" : ""}`);
console.log("  Refresh the page — no code changes needed.");

function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}
