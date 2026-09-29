"use client";

import type { AnchorHTMLAttributes } from "react";
import { useScrollTo } from "@/lib/lenis-provider";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: `#${string}` };

/** In-page link that glides with Lenis instead of jumping. */
export function AnchorLink({ href, onClick, ...rest }: Props) {
  const scrollTo = useScrollTo();
  return (
    <a
      href={href}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        event.preventDefault();
        scrollTo(href);
      }}
      {...rest}
    />
  );
}
