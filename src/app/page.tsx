import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { PrintSurface } from "@/components/home/PrintSurface";
import { site } from "@/content";
import { pageMeta } from "@/lib/meta";
import { AboutTeaser, GetInTouch, Manifesto, MusicFeature, SelectedWork, Worlds } from "@/components/home/Sections";

export const metadata: Metadata = pageMeta({ title: `${site.name} — ${site.tagline}`, description: site.description, path: "/", absoluteTitle: true });

export default function Home() {
  return (
    <div className="print-surface relative">
      <Hero />
      <Manifesto />
      <Worlds />
      <MusicFeature />
      <SelectedWork />
      <AboutTeaser />
      <GetInTouch />
      <PrintSurface />
    </div>
  );
}
