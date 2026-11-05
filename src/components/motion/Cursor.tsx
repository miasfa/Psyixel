"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, reducedMotion } from "@/lib/motion";

/**
 * Desktop-only cursor: a precise lavender dot plus a lagging ring that grows
 * over interactive elements and shows a word from `data-cursor="View"`. Both
 * hide whenever the pointer leaves the window or the window loses focus, so
 * nothing is left behind on the page. Over text fields the custom cursor steps
 * aside for the native text cursor. Elements with `data-magnetic` lean
 * toward the pointer.
 */
const TEXT_ENTRY = "textarea, select, [contenteditable=''], [contenteditable='true'], input:not([type='button'],[type='submit'],[type='reset'],[type='checkbox'],[type='radio'],[type='range'],[type='file'],[type='image'])";
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState("");

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || reducedMotion()) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");
    let shown = false;
    const show = (on: boolean) => {
      if (on === shown) return;
      shown = on;
      gsap.to([dot.current, ring.current], { autoAlpha: on ? 1 : 0, duration: 0.3 });
    };
    gsap.set([dot.current, ring.current], { autoAlpha: 0 });

    const dx = gsap.quickTo(dot.current, "x", { duration: 0.08, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.08, ease: "power3" });

    const rx = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3" });

    let magnet: HTMLElement | null = null;
    const release = () => {
      if (magnet) gsap.to(magnet, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
      magnet = null;
    };

    let last: HTMLElement | null = null;
    const describe = (t: HTMLElement | null) => {
      const interactive = t?.closest<HTMLElement>("a, button, [data-cursor], input, textarea, select, [role='slider']");
      const text = interactive?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? "";
      setLabel(text);
      ring.current!.dataset.state = interactive ? (text ? "label" : "hover") : "";
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const t = e.target as HTMLElement | null;
      last = t;
      if (t?.closest(TEXT_ENTRY)) {
        // Native I-beam only: the ring would cover what is being typed.
        show(false);
        release();
        setLabel("");
        ring.current!.dataset.state = "";
        return;
      }
      show(true);
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);

      describe(t);

      const m = t?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (m !== magnet) release();
      if (m) {
        magnet = m;
        const r = m.getBoundingClientRect();
        const strength = parseFloat(m.dataset.magnetic || "0.35");
        gsap.to(m, {
          x: (e.clientX - (r.left + r.width / 2)) * strength,
          y: (e.clientY - (r.top + r.height / 2)) * strength,
          duration: 0.5,
          ease: "power3.out",
        });
      }
    };
    // Hide when the pointer leaves the window (relatedTarget is null) or focus moves elsewhere.
    const out = (e: MouseEvent) => {
      if (!e.relatedTarget) {
        show(false);
        release();
      }
    };
    const hide = () => {
      show(false);
      release();
    };
    const down = () => gsap.to(ring.current, { scale: 0.8, duration: 0.2 });
    const up = () => {
      gsap.to(ring.current, { scale: 1, duration: 0.4, ease: "back.out(3)" });
      // A click can change the label (Play → Pause) without the pointer moving.
      window.setTimeout(() => last?.isConnected && !last.closest(TEXT_ENTRY) && describe(last), 120);
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("mouseout", out);
    window.addEventListener("blur", hide);
    document.addEventListener("visibilitychange", hide);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("mouseout", out);
      window.removeEventListener("blur", hide);
      document.removeEventListener("visibilitychange", hide);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[120]">
      <div ref={dot} className="absolute -left-[3px] -top-[3px] h-1.5 w-1.5 rounded-full bg-lav" />
      <div
        ref={ring}
        className="group/cursor absolute -left-5 -top-5 flex h-10 w-10 items-center justify-center rounded-full border border-ivory/40 transition-[width,height,left,top,background-color,border-color] duration-500 ease-[var(--ease-expo)] data-[state=hover]:-left-8 data-[state=hover]:-top-8 data-[state=hover]:h-16 data-[state=hover]:w-16 data-[state=hover]:border-lav data-[state=label]:-left-12 data-[state=label]:-top-12 data-[state=label]:h-24 data-[state=label]:w-24 data-[state=label]:border-transparent data-[state=label]:bg-lav"
      >
        <span className="t-label text-[0.6875rem] text-ink opacity-0 transition-opacity duration-300 group-data-[state=label]/cursor:opacity-100">
          {label}
        </span>
      </div>
    </div>
  );
}
