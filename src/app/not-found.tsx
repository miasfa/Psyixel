import { FlowerCut } from "@/components/art/Fragments";
import { ArrowLink } from "@/components/ui/Bits";

export default function NotFound() {
  return (
    <section className="gutter relative flex min-h-[90svh] flex-col items-start justify-center overflow-hidden pt-24">
      <FlowerCut className="drift pointer-events-none absolute -right-[10%] top-[10%] w-[60vw] opacity-60 md:w-[34vw]" rotate={20} />
      <p className="t-label text-lav">404 /</p>
      <h1 className="t-heavy mt-4 text-[22vw] md:text-[12vw]">Lost</h1>
      <p className="t-serif -mt-[0.1em] text-[12vw] text-lav md:text-[6vw]">in the imagined.</p>
      <p className="mt-6 max-w-md font-read text-xl text-ivory/75">This page doesn&rsquo;t exist — or hasn&rsquo;t been made yet.</p>
      <ArrowLink href="/" label="Psyixel" className="mt-10">
        Back to the universe
      </ArrowLink>
    </section>
  );
}
