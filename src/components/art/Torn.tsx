import type { CSSProperties, ReactNode } from "react";
import { seeded, round } from "@/lib/random";

type Edge = "top" | "right" | "bottom" | "left";

/** Builds a jagged polygon clip-path (in %) that reads as torn paper. */
export function tornPath(seed: number, edges: Edge[] = ["top", "right", "bottom", "left"], depth = 3.2, steps = 26) {
  const r = seeded(seed);
  const jag = (on: boolean) => (on ? r() * depth : 0);
  const pts: string[] = [];
  const has = (e: Edge) => edges.includes(e);
  for (let i = 0; i <= steps; i++) pts.push(`${round((i / steps) * 100)}% ${round(jag(has("top")))}%`);
  for (let i = 1; i <= steps; i++) pts.push(`${round(100 - jag(has("right")))}% ${round((i / steps) * 100)}%`);
  for (let i = steps - 1; i >= 0; i--) pts.push(`${round((i / steps) * 100)}% ${round(100 - jag(has("bottom")))}%`);
  for (let i = steps - 1; i >= 1; i--) pts.push(`${round(jag(has("left")))}% ${round((i / steps) * 100)}%`);
  return `polygon(${pts.join(",")})`;
}

/**
 * Torn-paper cutout. With `paper`, an ivory paper border is torn around the
 * content (like a photo ripped from a magazine).
 */
export function Torn({
  children,
  seed = 1,
  edges,
  depth,
  paper = false,
  paperColor = "#e4ddcf",
  className = "",
  style,
}: {
  children: ReactNode;
  seed?: number;
  edges?: Edge[];
  depth?: number;
  paper?: boolean;
  paperColor?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const inner = <div className="relative h-full w-full overflow-hidden" style={{ clipPath: tornPath(seed + 7, edges, depth ?? 2.4) }}>{children}</div>;
  if (!paper) {
    return (
      <div className={`relative ${className}`} style={{ ...style, clipPath: tornPath(seed, edges, depth) }}>
        {children}
      </div>
    );
  }
  return (
    <div className={`relative ${className}`} style={style}>
      <div className="absolute inset-0" style={{ background: paperColor, clipPath: tornPath(seed, edges, depth ?? 3.6) }} />
      <div className="absolute inset-[5%]">{inner}</div>
    </div>
  );
}
