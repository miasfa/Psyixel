import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { cache } from "react";
import sharp from "sharp";
import type { PlateImage } from "@/components/art/Plate";
import manifest from "@/content/asset-manifest.json";

/**
 * Convention-based collage assets (server only).
 *
 * Drop a file named after its slot into public/images/collage/ — e.g.
 * `portrait.webp`, `iris.png`, `moon.jpg` — and the matching collage piece
 * switches from its SVG stand-in to your image on the next build/refresh.
 * No component code changes needed. If several formats exist for one slot,
 * the most recently modified file wins.
 *
 * Slots listed in src/content/asset-manifest.json keep a fixed frame (aspect
 * ratio), so a replacement image never moves or resizes anything on the page;
 * the image is fitted inside that frame.
 */

export type CollageAsset = {
  src: string;
  /** Frame the layout reserves (manifest frame, or the file's own size for unlisted slots). */
  width: number;
  height: number;
  /** True when the file has an alpha channel (a cut-out). */
  alpha: boolean;
};

const DIR = path.join(/* turbopackIgnore: true */ process.cwd(), "public", "images", "collage");
const EXT = ["avif", "webp", "png", "jpg", "jpeg"];
const FRAMES = new Map(manifest.slots.filter((s) => s.kind === "collage").map((s) => [s.slot, s.frame as [number, number]]));

export const findCollageAsset = cache(async (slot: string): Promise<CollageAsset | null> => {
  const candidates = EXT.map((ext) => ({ ext, file: path.join(/* turbopackIgnore: true */ DIR, `${slot}.${ext}`) }))
    .filter((c) => existsSync(c.file))
    .sort((a, b) => statSync(b.file).mtimeMs - statSync(a.file).mtimeMs);

  for (const { ext, file } of candidates) {
    try {
      // Read from a buffer so no file handle stays open (lets assets be swapped while the server runs).
      const meta = await sharp(readFileSync(file)).metadata();
      if (!meta.width || !meta.height) continue;
      const frame = FRAMES.get(slot);
      return {
        src: `/images/collage/${slot}.${ext}?v=${Math.round(statSync(file).mtimeMs)}`,
        width: frame?.[0] ?? meta.width,
        height: frame?.[1] ?? meta.height,
        alpha: Boolean(meta.hasAlpha),
      };
    } catch {
      continue;
    }
  }
  return null;
});

/** A PlateImage that uses /images/collage/<slot>.* when present, else its SVG variant. */
export async function collagePlate(slot: string, fallback: PlateImage): Promise<PlateImage> {
  const asset = await findCollageAsset(slot);
  return asset ? { ...fallback, src: asset.src } : fallback;
}
