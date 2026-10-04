"use client";

import type { AnchorHTMLAttributes } from "react";
import { useScrollTo } from "@/lib/lenis-provider";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/**
 * Link to a section ("#services" or "/#services"). When the section is on the current
 * page it glides there with Lenis; otherwise it behaves as a normal link, so the same
 * footer works on the home page and on the privacy policy.
 */
export function AnchorLink({ href, onClick, ...rest }: Props) {
  const scrollTo = useScrollTo();
  return (
    <a
      href={href}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
        const url = new URL(href, window.location.href);
        if (url.pathname !== window.location.pathname || !url.hash) return;
        const hash = url.hash as `#${string}`;
        if (hash !== "#top" && !document.querySelector(hash)) return;
        event.preventDefault();
        scrollTo(hash);
      }}
      {...rest}
    />
  );
}
