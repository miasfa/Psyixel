import type { PlateImage } from "@/components/art/Plate";

/**
 * Global identity + shared copy (approved writing pass). Anything marked TODO
 * is waiting for real information.
 */
export const site = {
  name: "Psyixel",
  /** Canonical origin. Set NEXT_PUBLIC_SITE_URL to override; production builds default to the live domain. */
  url: process.env.NEXT_PUBLIC_SITE_URL || (process.env.NODE_ENV === "production" ? "https://psyixel.com" : "http://localhost:3000"),
  tagline: "Between the visible and the imagined.",
  description:
    "Psyixel brings together my websites, photography, artwork, writing, and music. Explore the work or get in touch about a project.",
  heroNote: "A personal world of design, photography, art, writing, and music.",
  core: ["Things I build.", "Things I see.", "Things I imagine.", "Things I write.", "Music I make."],
  /** Small footer signature. TODO: may be personalised later. */
  signature: "An ongoing work.",

  manifesto: {
    body: [
      "Psyixel is where I bring together what I make. Websites I build, photographs I take, images I create, words I write, and music I make.",
      "The form changes. The curiosity stays.",
    ],
    aside: "I don’t always know what an idea will become. That’s part of why I follow it.",
  },

  about: {
    /** Homepage About teaser. */
    home: [
      "I don’t experience these interests as separate worlds. A photograph can lead to a piece of writing. A sound can suggest an image. Something I notice can find its way into a website.",
      "Psyixel gives those connections somewhere to grow.",
    ],
    /** About page opening text. */
    intro: ["I’m the person behind Psyixel. I design and build websites, take photographs, make digital art, write, and create music."],
    /** About page, beside the story: the kind of work and the projects welcomed. */
    work: [
      "My web projects range from an athlete’s personal site to a local driving school. I enjoy finding the character of each project and shaping it into something clear, useful, and distinctive.",
      "I welcome website projects for individuals, small businesses, and creative teams, along with collaborations involving imagery, writing, or sound.",
    ],
    /** About page story ("Following my curiosity"). */
    long: [
      "Some things make me want to look more closely. Others make me want to build, write, or find a sound that fits. I don’t always know why something catches my attention, but making something from it helps me find out.",
      "Psyixel gives that curiosity a place to go. Here I can work carefully on a website, follow a visual experiment, or return to a thought that hasn’t quite settled.",
      "“Between the visible and the imagined” is a way of describing that movement. I begin with something I’ve seen, heard, or felt. What I make from it becomes something else.",
    ],
  },

  /** Public contact address (Contact fallback, footer). Leave empty to hide it. */
  email: "hello@psyixel.com",
  /**
   * Web3Forms access key: the contact form delivers messages through Web3Forms
   * to the owner's inbox. Public by design (it only allows sending to that
   * inbox), so it can live here. NEXT_PUBLIC_WEB3FORMS_KEY overrides it.
   */
  web3formsKey: "c11d8fbc-47d8-4158-9d2c-14cf9a92a2ba",
  /** Profiles shown on Contact (with icons) and in the footer. */
  socials: [
    { label: "Instagram", handle: "@psyixel", icon: "instagram", href: "https://www.instagram.com/psyixel/" },
    { label: "Spotify", handle: "Psyixel on Spotify", icon: "spotify", href: "https://open.spotify.com/artist/5JHw4rCDgTd1rjRf4H7qyu" },
  ] as { label: string; handle: string; icon: "instagram" | "spotify"; href: string }[],

} as const;

export const nav = [
  { label: "Studio", href: "/studio" },
  { label: "Photography", href: "/photography" },
  { label: "Art", href: "/art" },
  { label: "Words", href: "/words" },
  { label: "Music", href: "/music" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const heroCollage: Record<"moon" | "eye", PlateImage> = {
  moon: { variant: "moon", alt: "Full moon above a bank of clouds" },
  eye: { variant: "eye", alt: "Close-up of an open eye on lavender paper" },
};
