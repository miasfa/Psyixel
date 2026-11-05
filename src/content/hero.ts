/**
 * Hero collage configuration.
 *
 * IMAGES: put files in public/images/collage/ named after the slot
 * (portrait, eye, moon, iris, rock). Any of .avif .webp .png .jpg works.
 * A file with transparency is used as a cut-out; an opaque photo becomes a
 * torn print. Delete the file to fall back to the SVG stand-in.
 *
 * LAYOUT: positions below are in vw/% of the hero, so the composition scales
 * with the viewport. Tweak them here — no component edits needed.
 */

export type Placement = {
  /** Distance from the hero's left edge, % of width. */
  left: number;
  /** Distance from the hero's top, in vw. */
  top: number;
  /** Width, % of hero width. */
  width: number;
  /** Rotation in degrees. */
  rotate?: number;
};

export type PortraitConfig = {
  alt: string;
  /** "auto" picks cut-out vs print from the file's transparency. */
  mode: "auto" | "cutout" | "print";
  /** Cut-out placement: large, overlapping the wordmark. */
  cutout: { desktop: Placement; mobile: Placement };
  /** Print placement: a torn photo pasted into the collage. */
  print: { desktop: Placement; mobile: Placement };
  /** Render the photo in black & white (matches the art direction). */
  mono: boolean;
  /** Fade the bottom of a cut-out into the page, % of its height (0 = off). */
  fadeBottom: number;
  /**
   * Fade the top of a cut-out, % of its height (0 = off). Softens hair that
   * rises over the wordmark so the letters read through, as in the reference.
   */
  fadeTop: number;
  /** Pointer-follow strength (0 = still). */
  pointerDepth: number;
  /** How far the figure sinks (slower than the page) as the hero scrolls away, % of its height. */
  scrollRise: number;
  /**
   * Wordmark letters (0 = P … 6 = L) drawn IN FRONT of the portrait, for an
   * interlocked magazine-cover look. Empty = whole wordmark sits behind.
   */
  frontLetters: number[];
  /** Mirror the image horizontally (e.g. to make the face look into the page). */
  flip: boolean;
};

export const portrait: PortraitConfig = {
  alt: "Black-and-white portrait, head tilted back, eyes closed, hair caught in the wind",
  mode: "auto",
  cutout: {
    desktop: { left: 12, top: 11.5, width: 58 },
    mobile: { left: -4, top: 27, width: 110 },
  },
  print: {
    desktop: { left: 33, top: 10.5, width: 33, rotate: -3 },
    mobile: { left: 33, top: 41, width: 46, rotate: -3 },
  },
  mono: true,
  fadeBottom: 26,
  fadeTop: 0,
  pointerDepth: 0.35,
  scrollRise: 8,
  frontLetters: [],
  flip: false,
};

/**
 * Placement of the other hero collage slots. Desktop values are measured from
 * the reference mockup (977px wide: left/width = px / 9.77 %, top = px / 9.77 vw).
 */
export const heroSlotPlacement: Record<"eye" | "moon" | "iris" | "rock", { desktop: Placement; mobile: Placement }> = {
  eye: { desktop: { left: 83.42, top: 2.66, width: 16.58 }, mobile: { left: 68, top: 19, width: 32 } },
  moon: { desktop: { left: 0, top: 37.15, width: 18.42 }, mobile: { left: 1, top: 126, width: 38 } },
  iris: { desktop: { left: 17.2, top: 38.08, width: 35.31 }, mobile: { left: -9, top: 95, width: 88 } },
  rock: { desktop: { left: 87.82, top: 41.76, width: 12.18 }, mobile: { left: 72, top: 136, width: 30 } },
};

/** Alt text for the other hero collage slots (used when an image is supplied). */
export const heroSlots = {
  eye: "Close-up of an eye, torn from a photograph",
  moon: "Full moon above clouds",
  iris: "Purple iris flower",
  rock: "Fragment of rock",
} as const;
