import Image from "next/image";
import type { ReactNode } from "react";
import type { CollageAsset } from "@/lib/collage";
import { Torn } from "./Torn";

/**
 * A collage fragment from public/images/collage/. Transparent files float as
 * cut-outs; opaque ones are torn like prints. Falls back to the SVG stand-in.
 */
export function CollageCutout({ asset, alt, sizes, fallback, seed = 29, priority = false }: { asset: CollageAsset | null; alt: string; sizes: string; fallback: ReactNode; seed?: number; /** Load immediately (above the fold). */ priority?: boolean }) {
  if (!asset) return <>{fallback}</>;
  const ratio = { aspectRatio: `${asset.width} / ${asset.height}` };
  const img = <Image src={asset.src} alt={alt} fill sizes={sizes} priority={priority} className={asset.alpha ? "object-contain" : "object-cover"} />;
  return asset.alpha ? (
    <div className="relative" style={ratio}>
      {img}
    </div>
  ) : (
    <Torn seed={seed} depth={6} className="relative" style={ratio}>
      {img}
    </Torn>
  );
}
