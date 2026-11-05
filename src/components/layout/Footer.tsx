import { nav, site } from "@/content/site";
import { TLink } from "@/components/motion/TLink";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="gutter relative overflow-hidden border-t hairline pb-8 pt-16">
      <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="t-serif text-4xl text-ivory md:text-5xl">{site.tagline}</p>
          <p className="t-label mt-6 max-w-sm text-bone/70">{site.core.join(" ")}</p>
        </div>
        <nav aria-label="Footer">
          <p className="t-label mb-4 text-lav">Index</p>
          <ul className="space-y-1.5 font-sans text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <TLink href={n.href} transitionLabel={n.label} className="text-ivory/70 transition-colors hover:text-lav">
                  {n.label}
                </TLink>
              </li>
            ))}
          </ul>
        </nav>
        {/* Contact column: the public email, plus profiles once site.socials has entries */}
        {(site.email || site.socials.length > 0) && (
          <div>
            <p className="t-label mb-4 text-lav">Get in touch</p>
            <ul className="space-y-1.5 font-sans text-sm">
              {site.email && (
                <li>
                  <a href={`mailto:${site.email}`} className="text-ivory/70 underline decoration-lav/60 underline-offset-4 transition-colors hover:text-lav">
                    {site.email}
                  </a>
                </li>
              )}
              {site.socials.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="text-ivory/70 hover:text-lav">
                    {site.name} on {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="t-label mt-14 flex flex-wrap justify-between gap-2 text-dust">
        <span>© {year} Psyixel</span>
        <span>{site.signature}</span>
      </div>
    </footer>
  );
}
