import type { Metadata } from "next";
import { site } from "@/content";

/** The shared brand card (src/app/opengraph-image.tsx). */
const BRAND_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name} — ${site.tagline}` };

/**
 * Per-page metadata: canonical URL, Open Graph and Twitter copy. Paths are
 * resolved against `metadataBase` (site.url), so production builds emit
 * absolute https://psyixel.com URLs. Pages without an image of their own use
 * the brand card.
 */
export function pageMeta({
  title,
  description,
  path,
  image,
  type = "website",
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: { src?: string; alt: string };
  type?: "website" | "article";
  /** Use the title as-is instead of "Title — Psyixel". */
  absoluteTitle?: boolean;
}): Metadata {
  const full = absoluteTitle ? title : `${title} — ${site.name}`;
  const images = image?.src ? [{ url: image.src, alt: image.alt }] : [BRAND_IMAGE];
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: { type, siteName: site.name, url: path, title: full, description, images },
    twitter: { card: "summary_large_image", title: full, description, images: images.map((i) => i.url) },
  };
}
