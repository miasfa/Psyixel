import type { MetadataRoute } from "next";
import { artworks, collections, getWritings, nav, site, studioProjects } from "@/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    ...nav.map((n) => n.href),
    ...studioProjects.map((p) => `/studio/${p.slug}`),
    ...collections.map((c) => `/photography/${c.slug}`),
    ...artworks.map((a) => `/art/${a.slug}`),
    ...getWritings().map((w) => `/words/${w.slug}`),
  ];
  return paths.map((p) => ({ url: new URL(p, site.url).toString() }));
}
