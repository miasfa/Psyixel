"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/motion";

/**
 * Declarative scroll motion. Server components opt in with data attributes:
 *   data-split="scroll"          staggered char/word entrance (see <SplitText/>)
 *   data-reveal="up|clip|fade|scale|left"   entrance on scroll (data-delay="0.2", data-start="top bottom")
 *   data-speed="0.4"             parallax (positive = slower/behind, negative = faster/in front)
 *   data-spin="20"               rotation scrubbed with scroll (degrees across the viewport)
 *   data-draw                    SVG stroke draws in
 * Re-initialises on every route change.
 */
export function ScrollEffects() {
  const pathname = usePathname();

  useEffect(() => {
    (window as unknown as { __psyMotionReady?: boolean }).__psyMotionReady = true;
    const root = document.documentElement;

    if (reducedMotion()) {
      root.classList.remove("js-motion");
      return;
    }
    root.classList.add("js-motion");

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-split="scroll"]').forEach((el) => {
        const units = el.querySelectorAll(".split-unit");
        gsap.fromTo(
          units,
          { yPercent: 115, rotate: 7, autoAlpha: 0 },
          {
            yPercent: 0,
            rotate: 0,
            autoAlpha: 1,
            duration: 1.15,
            ease: "expo.out",
            stagger: { each: units.length > 30 ? 0.012 : 0.028 },
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        const type = el.dataset.reveal;
        const delay = parseFloat(el.dataset.delay ?? "0");
        // data-start lets above-the-fold pieces near the viewport edge reveal on load.
        const st = { trigger: el, start: el.dataset.start ?? "top 90%", once: true };
        const base = { duration: 1, ease: "expo.out", delay, scrollTrigger: st };
        if (type === "clip") {
          gsap.fromTo(
            el,
            { clipPath: "inset(100% 0% 0% 0%)", autoAlpha: 1, scale: 1.08 },
            { clipPath: "inset(0% 0% 0% 0%)", scale: 1, ...base, duration: 1.15, ease: "expo.inOut", clearProps: "clipPath,transform" },
          );
        } else if (type === "scale") {
          gsap.fromTo(el, { scale: 0.6, rotate: -8, autoAlpha: 0 }, { scale: 1, rotate: 0, autoAlpha: 1, ...base });
        } else if (type === "left") {
          gsap.fromTo(el, { x: -60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ...base });
        } else if (type === "fade") {
          gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, ...base, duration: 1.2, ease: "power2.out" });
        } else {
          gsap.fromTo(el, { y: 70, autoAlpha: 0 }, { y: 0, autoAlpha: 1, ...base });
        }
      });

      gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
        const amount = parseFloat(el.dataset.speed ?? "0") * 140;
        gsap.fromTo(
          el,
          { y: -amount },
          {
            y: amount,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-spin]").forEach((el) => {
        const deg = parseFloat(el.dataset.spin ?? "0");
        gsap.fromTo(
          el,
          { rotate: -deg / 2 },
          { rotate: deg / 2, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.8 } },
        );
      });

      gsap.utils.toArray<SVGPathElement>("[data-draw]").forEach((path) => {
        if (path.closest("[data-hero]")) return;
        const len = path.getTotalLength();
        gsap.fromTo(
          path,
          { strokeDasharray: len, strokeDashoffset: len },
          { strokeDashoffset: 0, duration: 2.4, ease: "power2.inOut", scrollTrigger: { trigger: path, start: "top 85%", once: true } },
        );
      });
    });

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [pathname]);

  return null;
}
