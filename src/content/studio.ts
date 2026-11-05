import type { Service, StudioProject } from "./types";

export const services: Service[] = [
  {
    slug: "websites",
    title: "Websites",
    summary: "Websites shaped around the people, work, and ideas they represent. I bring design and development together so the finished site feels considered and works well.",
    includes: ["Design & development", "Page layouts", "Responsive layouts"],
  },
  {
    slug: "digital-experiences",
    title: "Digital experiences",
    summary: "Interactive pages and experiments that use movement, image, and sound to draw people into an idea.",
    includes: ["Interactive pages", "Motion & sound", "Prototypes"],
  },
  {
    slug: "visual-design",
    title: "Visual design",
    summary: "Layouts, imagery, and graphic compositions for projects that need a distinct visual voice.",
    includes: ["Editorial layouts", "Graphic compositions", "Image making"],
  },
  {
    slug: "branding",
    title: "Branding",
    summary: "Finding the visual language of a project through its typography, colours, imagery, and identity.",
    includes: ["Visual identity", "Typography & colour", "Identity guidelines"],
  },
  {
    slug: "creative-direction",
    title: "Creative direction",
    summary: "Making sense of the early ideas, finding a direction, and keeping it clear as the work develops.",
    includes: ["Concept development", "Visual references", "Art direction"],
  },
];

export const process = [
  { step: "Listen", text: "We talk about what you’re making, who it’s for, and what matters to you." },
  { step: "Explore", text: "I gather references, test ideas, and share a direction we can discuss." },
  { step: "Make", text: "I develop the work, share progress, and refine it with your feedback." },
  { step: "Finish", text: "We work through the details, prepare the final files or launch, and make sure you know what comes next." },
];

/** The three practice areas listed in the /studio hero, each linking to its service. */
export const studioFocus = [
  { label: "Creative direction", href: "#creative-direction" },
  { label: "Visual systems", href: "#visual-design" },
  { label: "Experimental projects", href: "#digital-experiences" },
];

/**
 * Studio case studies, in display order. Each project gets a page at
 * /studio/<slug>. Screenshots live in /public/images/studio/<slug>/ (16:10).
 * Optional fields (year, client, problem, decisions, result, url) are only
 * shown when set.
 */
const D = "/images/studio/dalian-dawody";
const C = "/images/studio/carlstad-korcenter";
const P = "/images/studio/psyixel";

export const studioProjects: StudioProject[] = [
  {
    slug: "dalian-dawody",
    title: "Dalian Dawody",
    client: "Dalian Dawody",
    disciplines: ["Web design", "Development"],
    summary: "A bilingual website for Muay Thai fighter Dalian Dawody, bringing together his story, fights, training, press and partners.",
    role: "Design & Development",
    problem: [
      "Dalian is a Muay Thai fighter from Karlstad. The site needed to introduce him to fans, press and partners, and give people a direct way to ask about training with him.",
      "It covers his story, his fights, his appearance in Physical 100: Sweden, personal and online training, seminars and events, press coverage and partners, in both English and Swedish.",
    ],
    screenshots: [
      { src: `${D}/02-in-the-ring.webp`, mono: false, variant: "fabric", alt: "In the Ring section with large fight photographs", caption: "In the Ring: fight photographs shown large, each with a short title." },
      { src: `${D}/03-physical-100.webp`, mono: false, variant: "fabric", alt: "Physical 100: Sweden section on a yellow background", caption: "The Physical 100: Sweden section, set apart in the site’s yellow." },
      { src: `${D}/04-training.webp`, mono: false, variant: "fabric", alt: "Beyond the Bell training list with expandable sessions", caption: "Training sessions as an expandable list, each linking to a request." },
      { src: `${D}/06-mobile.webp`, mono: false, variant: "fabric", alt: "Three mobile screens of the Dalian Dawody website", caption: "On mobile: the home page, Training and the training request page." },
      { src: `${D}/05-booking.webp`, mono: false, variant: "fabric", alt: "Train with Dalian request page", caption: "The training request page." },
      { src: `${D}/07-press.webp`, mono: false, variant: "fabric", alt: "Making His Mark press coverage grid", caption: "Press coverage, dated and linked to each source." },
    ],
    decisions: [
      "A near-black base with one yellow accent. The yellow is kept for calls to action, highlighted words and the Physical 100 section, so it always points somewhere.",
      "Heavy condensed capitals for headlines, set very large against full-bleed fight photography, with a quieter sans serif for reading text.",
      "One clear action across the site: “Train with Dalian” sits in the header, and each training option links straight to the request form.",
      "English and Swedish versions, switched from the header.",
    ],
    result: [
      "A live bilingual website with pages for his story, training, seminars and events, training requests, press, partners and contact.",
    ],
    url: "https://daliandawody.com",
    cover: { src: `${D}/cover.webp`, mono: false, variant: "fabric", alt: "Dalian Dawody website home page: his name in large ivory capitals beside a photo of him in the ring" },
  },
  {
    slug: "carlstad-korcenter",
    title: "Carlstad Körcenter",
    client: "Carlstad Körcenter AB",
    disciplines: ["Web design", "Development"],
    summary: "A Swedish-language website for a driving school in Karlstad, built around lessons, packages, prices and getting in touch.",
    role: "Design & Development",
    problem: [
      "Carlstad Körcenter is a driving school in Karlstad. Its website needed to show what the school offers and what it costs, and make it easy to book a first lesson.",
      "The content covers driving lessons, lesson packages, an intensive two-week course with accommodation, a full price list, theory, and the school’s contact details.",
    ],
    screenshots: [
      { src: `${C}/01-home.webp`, mono: false, variant: "fabric", alt: "Carlstad Körcenter home page with a car in front of the Karlstad skyline", caption: "The home page, with the two main actions in the first view." },
      { src: `${C}/02-packages.webp`, mono: false, variant: "fabric", alt: "Driving lesson packages with prices", caption: "Lesson packages as cards, with the intensive course beside them." },
      { src: `${C}/03-prices.webp`, mono: false, variant: "fabric", alt: "Price list in two columns", caption: "The full price list in a plain two-column table." },
      { src: `${C}/04-contact.webp`, mono: false, variant: "fabric", alt: "About section and contact form", caption: "About the school, opening hours and a short request form." },
      { src: `${C}/05-intensive.webp`, mono: false, variant: "fabric", alt: "Intensive course page", caption: "A separate page for the intensive course." },
      { src: `${C}/06-mobile.webp`, mono: false, variant: "fabric", alt: "Three mobile screens of the Carlstad Körcenter website", caption: "On mobile: the home page, packages and price list." },
    ],
    decisions: [
      "Navy and white with a single warm yellow for the main buttons, so “Boka körlektion” stands out everywhere it appears.",
      "Prices shown openly: each package lists its lessons, its usual price and its package price, and every individual service is in the price list.",
      "The phone number and booking button stay in the header, so contact is always one step away.",
      "Most of the content sits on one page with anchored sections, and the intensive course has a page of its own.",
    ],
    result: [
      "A live website covering the school’s lessons, packages, intensive course, prices and contact details, with a request form for booking a first lesson.",
    ],
    url: "https://carlstadkorcenter.se",
    cover: { src: `${C}/cover.webp`, mono: false, variant: "fabric", alt: "Two mobile screens of the Carlstad Körcenter website on navy" },
  },
  {
    slug: "psyixel",
    title: "Psyixel",
    client: "Self-initiated",
    disciplines: ["Web design", "Development", "Motion"],
    summary: "This website: a personal space for my design, photography, art, writing and music.",
    role: "Design & Development",
    problem: [
      "Psyixel brings together work that usually lives in separate places. Each discipline needed room to feel like its own world while still belonging to one site.",
    ],
    screenshots: [
      { src: `${P}/01-home.webp`, mono: false, variant: "fabric", alt: "Psyixel home page: the wordmark over a collage of a face, an eye and a lavender iris", caption: "The home page: the wordmark printed over a torn-paper collage." },
      { src: `${P}/02-studio.webp`, mono: false, variant: "fabric", alt: "Studio page with a folded paper sculpture and a lavender brush stroke", caption: "Studio, with a direct link down to the projects." },
      { src: `${P}/03-art.webp`, mono: false, variant: "fabric", alt: "Art page with lavender paint strokes and three framed digital works", caption: "Art: the latest works framed under the header." },
      { src: `${P}/06-worlds.webp`, mono: false, variant: "fabric", alt: "Five cards for Studio, Photography, Art, Words and Music", caption: "The five sections, each with its own image and line of intent." },
      { src: `${P}/04-words.webp`, mono: false, variant: "fabric", alt: "Words page with a torn manuscript collage and a list of pieces", caption: "Words: an index of poems and essays beside a torn manuscript." },
      { src: `${P}/05-music.webp`, mono: false, variant: "fabric", alt: "Music page with a record, waveform and player", caption: "Music: a player with real waveforms for each track." },
      { src: `${P}/07-mobile.webp`, mono: false, variant: "fabric", alt: "Three mobile screens of the Psyixel website", caption: "On mobile: the home page, Art and a poem." },
    ],
    decisions: [
      "Charcoal, ivory and lavender throughout, with torn-paper collage, grain and black-and-white imagery holding the different sections together.",
      "Each section has its own type and mood: condensed poster capitals, an italic serif for display lines, a mono for labels and a reading serif for longer text.",
      "Short transition screens when moving between sections, and a landing sequence shown once per visit.",
      "Content lives in typed files, so new photographs, tracks, writing and projects can be added without touching the layouts.",
    ],
    result: [
      "The site you’re on now, with Studio, Photography, Art, Words and Music sections, a music player, and recent listening from Last.fm.",
    ],
    url: "/",
    urlLabel: "Back to the homepage",
    cover: { src: `${P}/cover.webp?v=2`, mono: false, variant: "fabric", alt: "A three-by-three board of Psyixel pages: home, Studio, Photography, Art, Words, Music, the five sections, About and Contact" },
  },
];
