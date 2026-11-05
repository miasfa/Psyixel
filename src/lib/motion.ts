"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Lenis instance is shared through a tiny module-level store. */
let lenis: Lenis | null = null;
export const setLenis = (l: Lenis | null) => {
  lenis = l;
};
export const getLenis = () => lenis;

/** Fixed header height plus a little air, so anchored sections aren't hidden under the nav. */
export const anchorOffset = () => (document.querySelector("header")?.getBoundingClientRect().height ?? 72) + 16;

/** Document y for a target: a number, an element, or a "#id" / selector (offset by the header). */
export function targetY(target: string | number | HTMLElement): number | null {
  if (typeof target === "number") return target;
  let el: Element | null = null;
  if (typeof target === "string") {
    const id = target.startsWith("#") ? decodeURIComponent(target.slice(1)) : "";
    try {
      el = (id && document.getElementById(id)) || document.querySelector(target);
    } catch {
      el = null;
    }
  } else el = target;
  if (!el) return null;
  return Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY - anchorOffset()));
}

/**
 * Jump without animation, keeping Lenis and ScrollTrigger's scroll cache in step.
 * (A plain window.scrollTo leaves ScrollTrigger's cached value behind, and its next
 * refresh() would restore the old position.) Returns false if the target is missing.
 */
export function jumpTo(target: string | number | HTMLElement) {
  const y = targetY(target);
  if (y === null) return false;
  lenis?.scrollTo(y, { immediate: true, force: true });
  ScrollTrigger.getScrollFunc(window)(y);
  return true;
}

export function scrollToTarget(target: string | number | HTMLElement, immediate = false) {
  const y = targetY(target);
  if (y === null) return;
  if (immediate) return void jumpTo(y);
  if (lenis) lenis.scrollTo(y, { duration: 1.4 });
  else window.scrollTo({ top: y, behavior: reducedMotion() ? "instant" : "smooth" });
}
