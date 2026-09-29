"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, loadGsap } from "@/lib/gsap";
import { useScrollTo } from "@/lib/lenis-provider";
import { cn } from "@/lib/cn";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  fillClassName?: string;
  /** Text colour while the fill covers the button. */
  hoverColor?: string;
  strength?: number;
  "aria-label"?: string;
};

/** A link that leans toward the pointer and floods with colour on hover (fine pointers only). */
export function MagneticButton({
  href,
  children,
  className,
  fillClassName = "bg-signal",
  hoverColor,
  strength = 0.3,
  ...rest
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const scrollTo = useScrollTo();

  useEffect(() => {
    const el = ref.current;
    const inner = innerRef.current;
    const fill = fillRef.current;
    if (!el || !inner || !fill) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    let detach: (() => void) | undefined;
    let cancelled = false;
    loadGsap().then(() => {
      if (cancelled) return;
      detach = attach();
    });
    return () => {
      cancelled = true;
      detach?.();
    };

    function attach() {
      if (!el || !inner || !fill) return;

      let restColor = "";
      const ease = "elastic.out(1, 0.45)";
      const xTo = gsap.quickTo(el, "x", { duration: 0.9, ease });
      const yTo = gsap.quickTo(el, "y", { duration: 0.9, ease });
      const ixTo = gsap.quickTo(inner, "x", { duration: 0.9, ease });
      const iyTo = gsap.quickTo(inner, "y", { duration: 0.9, ease });

      const onMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        xTo(dx * strength);
        yTo(dy * strength);
        ixTo(dx * strength * 0.45);
        iyTo(dy * strength * 0.45);
      };
      // The fill rests just below the button (top: 100%): yPercent -100 covers it,
      // 0 parks it below, -200 parks it above. Entry and exit follow the pointer.
      const onEnter = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const fromTop = event.clientY < rect.top + rect.height / 2;
        gsap.fromTo(
          fill,
          { yPercent: fromTop ? -200 : 0 },
          { yPercent: -100, duration: 0.6, ease: "expo.out", overwrite: true },
        );
        if (hoverColor) {
          restColor = getComputedStyle(el).color;
          gsap.to(inner, { color: hoverColor, duration: 0.3, overwrite: "auto" });
        }
      };
      const onLeave = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const toTop = event.clientY < rect.top + rect.height / 2;
        gsap.to(fill, { yPercent: toTop ? -200 : 0, duration: 0.6, ease: "expo.out", overwrite: true });
        if (hoverColor) {
          gsap.to(inner, {
            color: restColor,
            duration: 0.3,
            overwrite: "auto",
            onComplete: () => gsap.set(inner, { clearProps: "color" }),
          });
        }
        xTo(0);
        yTo(0);
        ixTo(0);
        iyTo(0);
      };

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerenter", onEnter);
        el.removeEventListener("pointerleave", onLeave);
        gsap.killTweensOf([el, inner, fill]);
        gsap.set([el, inner, fill], { clearProps: "transform,color" });
      };
    }
  }, [strength, hoverColor]);

  return (
    <a
      ref={ref}
      href={href}
      onClick={(event) => {
        if (!href.startsWith("#")) return;
        event.preventDefault();
        scrollTo(href);
      }}
      className={cn("relative isolate inline-flex items-center justify-center overflow-hidden", className)}
      {...rest}
    >
      <span ref={fillRef} aria-hidden className={cn("absolute inset-x-0 top-full -z-10 h-full", fillClassName)} />
      <span ref={innerRef} className="relative inline-flex items-center gap-3">
        {children}
      </span>
    </a>
  );
}
