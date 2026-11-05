"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { scrollToTarget } from "@/lib/motion";
import { useTransition } from "./Transition";

type Props = ComponentProps<typeof Link> & {
  href: string;
  /** Word shown on the transition sheet. */
  transitionLabel?: string;
};

/** Internal link that plays the page transition (falls back to a normal link). */
export function TLink({ href, transitionLabel, onClick, ...rest }: Props) {
  const { navigate } = useTransition();
  const pathname = usePathname();

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (rest.target === "_blank" || /^(https?:|mailto:|tel:)/.test(href)) return;
    const [path, hash] = href.split("#");
    // Same page (possibly with a different query): no sheet, the pathname won't change.
    if (path === "" || path.split("?")[0] === pathname) {
      if (hash) {
        e.preventDefault();
        history.replaceState(null, "", `#${hash}`);
        scrollToTarget(`#${hash}`);
      }
      return;
    }
    e.preventDefault();
    navigate(href, transitionLabel);
  };

  return <Link href={href} onClick={handle} {...rest} />;
}
