import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Anton, Archivo_Black, Barlow_Condensed, Bodoni_Moda, Inter, Newsreader, Space_Mono } from "next/font/google";
import { SvgDefs } from "@/components/art/SvgDefs";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { Cursor } from "@/components/motion/Cursor";
import { Landing } from "@/components/motion/Landing";
import { ScrollEffects } from "@/components/motion/ScrollEffects";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { TransitionProvider } from "@/components/motion/Transition";
import { AudioProvider } from "@/components/music/AudioProvider";
import { MiniPlayer } from "@/components/music/Players";
import { tracks } from "@/content";
import { site } from "@/content/site";
import { findCollageAsset } from "@/lib/collage";
import "./globals.css";

// One file per role; only the weights/styles actually used are requested.
const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton", display: "swap" });
const archivoBlack = Archivo_Black({ subsets: ["latin"], weight: "400", variable: "--font-archivo-black", display: "swap" });
const bodoni = Bodoni_Moda({ subsets: ["latin"], style: "italic", axes: ["opsz"], variable: "--font-bodoni", display: "swap" });
const barlow = Barlow_Condensed({ subsets: ["latin"], weight: "800", variable: "--font-barlow", display: "swap" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: "400", variable: "--font-space-mono", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
// Long-form reading text (essays, paragraphs) stays in a text serif for legibility.
const newsreader = Newsreader({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-newsreader", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s — ${site.name}` },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title: site.name, description: site.description },
};

export const viewport: Viewport = { themeColor: "#0c0b0d" };

// Hides reveal targets before first paint (only when JS runs and motion is allowed),
// and un-hides everything if the motion layer hasn't started within 3.5s.
// Also marks a homepage visit's first load of the session for the landing reel (see Landing.tsx);
// the reel itself is CSS; if it somehow hasn't handed off within 5s the page is shown anyway.
// Failsafe: if content in view is still hidden 6.5s after load and no animation ever touched it
// (no inline styles from GSAP, so motion failed to start), it is forced visible.
const motionBoot = `(function(){var d=document.documentElement;if(!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('js-motion');setTimeout(function(){if(!window.__psyMotionReady)d.classList.remove('js-motion')},3500);setTimeout(function(){var s='[data-letter],[data-portrait],[data-piece],[data-hero-fade],[data-reveal],[data-tagline] .split-unit,[data-split] .split-unit',l=document.querySelectorAll(s);for(var i=0;i<l.length;i++){var r=l[i].getBoundingClientRect();if(r.width&&r.top<innerHeight*0.8&&r.bottom>0&&!l[i].style.opacity&&!l[i].style.visibility){var c=getComputedStyle(l[i]);if(c.visibility==='hidden'||parseFloat(c.opacity)<0.05){d.classList.add('motion-failsafe');break}}}},6500);try{if(location.pathname==='/'&&!sessionStorage.getItem('psy-landed')){d.classList.add('psy-landing');setTimeout(function(){if(d.classList.contains('psy-landing')){d.classList.remove('psy-landing');try{sessionStorage.setItem('psy-landed','1')}catch(e){}window.dispatchEvent(new Event('psy:landed'))}},5000)}}catch(e){}}})();`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const menuFlower = await findCollageAsset("iris");
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${anton.variable} ${archivoBlack.variable} ${bodoni.variable} ${barlow.variable} ${spaceMono.variable} ${inter.variable} ${newsreader.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBoot }} />
      </head>
      <body>
        <SvgDefs />
        <Landing />
        <AudioProvider tracks={tracks}>
          <TransitionProvider>
            <Nav menuFlower={menuFlower} />
            <main id="main">{children}</main>
            <Footer />
          </TransitionProvider>
          <MiniPlayer />
        </AudioProvider>
        <SmoothScroll />
        <ScrollEffects />
        <Cursor />
        <div className="paper" aria-hidden="true" />
        <div className="vignette" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />
        <Analytics />
      </body>
    </html>
  );
}
