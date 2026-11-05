import type { Artwork } from "./types";

/**
 * Artworks, in display order. The first three appear as the framed tiles in
 * the /art hero; every work gets a page at /art/<slug>. Images live in
 * /public/images/art/. `position` sets the crop focus for landscape frames.
 * Titles are working titles until replaced.
 */
const A = "/images/art";

export const artworks: Artwork[] = [
  {
    slug: "spoon-eye",
    title: "Spoon Eye",
    medium: "Digital",
    image: { src: `${A}/spoon-eye.webp`, mono: false, variant: "paint", position: "50% 42%", alt: "Comic-style boy in a yellow T-shirt with one eye scooped out on a spoon, tongue out and vines from his nose, a hand holding a cigarette beside him, against an orange sun and blue rays" },
  },
  {
    slug: "tiger-lily",
    title: "Tiger Lily",
    medium: "Digital",
    image: { src: `${A}/tiger-lily.webp`, mono: false, variant: "paint", position: "50% 45%", alt: "Orange spotted lily with teal leaves, dripping white paint and scattered dots on a pale blue wash" },
  },
  {
    slug: "sun-halo",
    title: "Sun Halo",
    medium: "Digital",
    image: { src: `${A}/sun-halo.webp`, mono: false, variant: "paint", position: "50% 22%", alt: "Grey-skinned figure with closed red-lined eyes holding a small sun to their lips, framed by a yellow halo and orange rays" },
  },
  {
    slug: "rainbow-yak",
    title: "Rainbow Yak",
    medium: "Digital",
    image: { src: `${A}/rainbow-yak.webp`, mono: false, variant: "paint", position: "50% 40%", alt: "Black long-faced yak with a shaggy brown fringe and coloured drips running down its face, under a rainbow and a white sun at night" },
  },
  {
    slug: "fractured-eye",
    title: "Fractured Eye",
    medium: "Digital",
    image: { src: `${A}/fractured-eye.webp`, mono: false, variant: "paint", position: "50% 40%", alt: "Abstract face split into flat colour shapes inside a jagged circle, a bark-textured hand reaching up, on red, orange and yellow rays" },
  },
  {
    slug: "sunburst-portrait",
    title: "Sunburst Portrait",
    medium: "Digital",
    image: { src: `${A}/sunburst-portrait.webp`, mono: false, variant: "paint", position: "50% 35%", alt: "Portrait with dark curly hair and mismatched eyes, a colourful globe over the mouth and a hand raised to it, against a fan of warm rays on black" },
  },
];
