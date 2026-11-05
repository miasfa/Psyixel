import type { PhotoCollection } from "./types";

/**
 * Photography collections: your photographs in public/images/photography/<collection>/.
 * Each collection's first (size "l") photo leads in the hero viewer on /photography.
 * Filter tags (people / places / nature / sky) only appear when a collection uses them.
 */
const P = "/images/photography";
/** Your photographs: colour is kept (mono: false). */
const photo = (src: string, alt: string, size: "s" | "m" | "l" = "m") => ({ src: `${P}/${src}.webp`, alt, size, mono: false, variant: "horizon" as const });

export const collections: PhotoCollection[] = [
  {
    slug: "sky-notes",
    title: "Sky Notes",
    tags: ["sky"],
    cover: photo("sky-notes/02", "A partially eclipsed sun glowing through dark clouds"),
    photos: [
      photo("sky-notes/02", "A partially eclipsed sun glowing through dark clouds", "l"),
      photo("sky-notes/01", "Dusk from a plane window: wing, cloud sea and three bright points of light"),
      photo("sky-notes/03", "A thin crescent moon and planets over rooftops at twilight"),
      photo("sky-notes/04", "A full moon rising in a pink sky above a chimney, between two buildings"),
      photo("sky-notes/05", "Green and violet northern lights through a cabin window, a bottle on the sill"),
    ],
  },
  {
    slug: "water-lines",
    title: "Water Lines",
    tags: ["places", "nature"],
    cover: photo("water-lines/02", "A rainbow falling into a lake, a red lifebuoy in the foreground"),
    photos: [
      photo("water-lines/02", "A rainbow falling into a lake, a red lifebuoy in the foreground", "l"),
      photo("water-lines/01", "The sun setting over a rocky shore, wild grass in the foreground"),
      photo("water-lines/03", "A boat's wake glittering under a high sun, a city waterfront beyond"),
      photo("water-lines/04", "A lifebuoy on a wooden pier facing a calm lake at golden hour"),
      photo("water-lines/05", "A boardwalk through reeds to a bay with boats at dusk"),
    ],
  },
  {
    slug: "after-dark",
    title: "After Dark",
    tags: ["places"],
    cover: photo("after-dark/01", "An ambulance outside a lit emergency entrance at night, a man sitting on the kerb"),
    photos: [
      photo("after-dark/01", "An ambulance outside a lit emergency entrance at night, a man sitting on the kerb", "l"),
      photo("after-dark/02", "A promenade in fog at night, streetlights and towers fading into the haze"),
      photo("after-dark/03", "Sparks rising from a campfire in the dark"),
    ],
  },
  {
    slug: "quiet-rooms",
    title: "Quiet Rooms",
    tags: ["places"],
    cover: photo("quiet-rooms/04", "Light through window shutters falling on a striped rug in a bare room"),
    photos: [
      photo("quiet-rooms/04", "Light through window shutters falling on a striped rug in a bare room", "l"),
      photo("quiet-rooms/01", "Sunset glowing through window blinds in a dark room"),
      photo("quiet-rooms/02", "Thin lines of light through closed blinds in the dark"),
      photo("quiet-rooms/03", "Looking past outstretched legs into a cluttered room lit by curtained windows"),
      photo("quiet-rooms/05", "Dust caught in light through shutters, a dark room around it"),
      photo("quiet-rooms/06", "Sunlight streaming across a busy office floor, a figure by the desks"),
    ],
  },
  {
    slug: "in-passing",
    title: "In Passing",
    tags: ["places", "nature"],
    cover: photo("in-passing/03", "Railway tracks converging toward a city under a pink and orange sunset"),
    photos: [
      photo("in-passing/03", "Railway tracks converging toward a city under a pink and orange sunset", "l"),
      photo("in-passing/02", "A wet road beside flowering shrubs under a heavy green-grey sky"),
      photo("in-passing/01", "A building framed between two dark cedars in a sunlit park"),
    ],
  },
  {
    slug: "up-close",
    title: "Up Close",
    tags: ["nature"],
    cover: photo("up-close/01", "A red squirrel on a tree trunk holding a green walnut"),
    photos: [
      photo("up-close/01", "A red squirrel on a tree trunk holding a green walnut", "l"),
      photo("up-close/02", "Four kumquats in an open palm above a garden"),
      photo("up-close/03", "Raindrops on a window, a field blurred behind them"),
      photo("up-close/04", "Kumquats in an open palm, with the words: A steady hand does not require a hardened heart"),
      photo("up-close/05", "Three kumquats passed between two cupped hands in warm light"),
    ],
  },
];
