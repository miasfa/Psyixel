"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/content/site";
import type { CollageAsset } from "@/lib/collage";
import { getLenis, gsap, reducedMotion } from "@/lib/motion";
import { TLink } from "@/components/motion/TLink";

export function Nav({ menuFlower }: { menuFlower?: CollageAsset | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const lenis = getLenis();
    if (open) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
      if (!reducedMotion() && panel.current) {
        gsap.fromTo(
          panel.current.querySelectorAll("[data-menu-item]"),
          { yPercent: 110, rotate: 4 },
          { yPercent: 0, rotate: 0, duration: 0.9, ease: "expo.out", stagger: 0.05, delay: 0.15 },
        );
      }
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setOpen(false);
          toggle.current?.focus();
          return;
        }
        if (e.key !== "Tab" || !panel.current || !toggle.current) return;
        const stops = [toggle.current, ...panel.current.querySelectorAll<HTMLElement>("a[href]")];
        const at = stops.indexOf(document.activeElement as HTMLElement);
        const next = at === -1 ? 0 : (at + (e.shiftKey ? -1 : 1) + stops.length) % stops.length;
        e.preventDefault();
        stops[next].focus();
      };
      window.addEventListener("keydown", onKey);
      panel.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
      return () => window.removeEventListener("keydown", onKey);
    }
    lenis?.start();
    document.body.style.overflow = "";
  }, [open]);

  const active = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className={`fixed inset-x-0 top-0 z-[80] transition-[background-color,backdrop-filter] duration-500 ${open ? "bg-ink" : scrolled ? "bg-ink/70 backdrop-blur-md" : ""}`}>
      <a href="#main" className="t-label sr-only z-[200] bg-lav px-3 py-2 text-ink focus:not-sr-only focus:absolute focus:left-3 focus:top-3">
        Skip to content
      </a>
      <nav aria-label="Primary" className="gutter flex h-16 items-center justify-between md:h-[4.5rem]">
        <TLink href="/" transitionLabel="Psyixel" className="group flex items-center gap-3" data-magnetic="0.2" aria-label="Psyixel — home">
          <span className="font-sans text-[0.95rem] font-bold uppercase tracking-[0.42em]">Psyixel</span>
          <span className="h-px w-6 bg-ivory transition-all duration-500 group-hover:w-10 group-hover:bg-lav" />
        </TLink>

        <ul className="hidden items-center gap-[1.2vw] font-sans text-[max(0.82rem,1.12vw)] lg:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <TLink
                href={item.href}
                transitionLabel={item.label}
                aria-current={active(item.href) ? "page" : undefined}
                className="group relative block px-3.5 py-2 text-ivory/80 transition-colors hover:text-ivory aria-[current=page]:text-ivory"
                data-magnetic="0.25"
              >
                <span className="relative block overflow-hidden">
                  <span className="block transition-transform duration-500 ease-[var(--ease-expo)] group-hover:-translate-y-full">{item.label}</span>
                  <span className="t-serif absolute inset-0 block translate-y-full text-[1.05em] text-lav transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-y-0">
                    {item.label}
                  </span>
                </span>
                <span className="absolute inset-x-3.5 bottom-0.5 h-[1.5px] origin-left scale-x-0 bg-lav transition-transform duration-500 group-aria-[current=page]:scale-x-100" />
              </TLink>
            </li>
          ))}
        </ul>

        <span aria-hidden="true" className="hidden h-3 w-3 rounded-full bg-lav shadow-[0_0_18px_rgba(171,146,217,0.7)] lg:block" />

        <button
          ref={toggle}
          type="button"
          className="t-label flex items-center gap-3 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
          <span className="relative block h-3 w-6" aria-hidden="true">
            <span className={`absolute left-0 top-0.5 h-px w-6 bg-ivory transition-transform duration-500 ${open ? "translate-y-1 rotate-45" : ""}`} />
            <span className={`absolute bottom-0.5 left-0 h-px w-6 bg-lav transition-transform duration-500 ${open ? "-translate-y-1 -rotate-45" : ""}`} />
          </span>
        </button>
      </nav>

      {/* Mobile menu: full-screen dark panel, italic serif links, iris fragment bottom-right */}
      <div
        id="mobile-menu"
        ref={panel}
        hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="fixed inset-0 top-16 z-[79] overflow-y-auto overscroll-contain bg-ink lg:hidden"
      >
        {menuFlower && (
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-[6%] -right-[16%] w-[86%] max-w-[26rem] -rotate-[12deg] opacity-90">
            <div className="relative" style={{ aspectRatio: `${menuFlower.width} / ${menuFlower.height}` }}>
              <Image src={menuFlower.src} alt="" fill sizes="(max-width: 1024px) 86vw, 26rem" className="object-contain" />
            </div>
          </div>
        )}
        <ul className="relative flex flex-col gap-[min(1.2vh,0.6rem)] px-[calc(var(--gutter)+0.5rem)] pb-[38vh] pt-[min(8vh,3.5rem)]">
          {nav.map((item) => (
            <li key={item.href} className="overflow-hidden">
              <TLink
                href={item.href}
                transitionLabel={item.label}
                data-menu-item
                aria-current={active(item.href) ? "page" : undefined}
                className="t-serif inline-block py-1 text-[2.6rem] leading-[1.1] text-ivory transition-colors hover:text-lav aria-[current=page]:text-lav"
              >
                {item.label}
              </TLink>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
