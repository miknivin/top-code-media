"use client";

import type Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { gsap, loadGsap, ScrollTrigger } from "./gsap";
import { whenIdle } from "./idle";

const LenisContext = createContext<Lenis | null>(null);

export function LenisProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // Pinned sections change the page height after hydration, so browser-restored
    // positions land in the wrong place. Start from the top (or the hash) instead.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let LenisClass: typeof Lenis | undefined;
    let instance: Lenis | null = null;
    let cancelled = false;
    let cancelIdle = () => {};
    const tick = (time: number) => instance?.raf(time * 1000);

    const start = () => {
      if (!LenisClass || reduced.matches) return;
      instance = new LenisClass({ lerp: 0.085, smoothWheel: true, autoRaf: false });
      instance.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      setLenis(instance);
    };
    const stop = () => {
      if (!instance) return;
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      instance.destroy();
      instance = null;
      setLenis(null);
    };
    const onPreferenceChange = () => {
      stop();
      start();
    };

    // Lenis loads after GSAP, off the critical path. The sections queued their setups
    // on the same promise first, so the refresh and any #hash jump below run once every
    // pin exists.
    loadGsap()
      .then(() => import("lenis"))
      .then((module) => {
        if (cancelled) return;
        LenisClass = module.default;
        start();
        reduced.addEventListener("change", onPreferenceChange);
        return document.fonts?.ready;
      })
      .then(() => {
        if (cancelled) return;
        cancelIdle = whenIdle(() => {
          ScrollTrigger.refresh();
          const target = window.location.hash && document.querySelector(window.location.hash);
          if (target instanceof HTMLElement) {
            if (instance) instance.scrollTo(target, { immediate: true });
            else target.scrollIntoView();
          }
        }, 1500);
      });

    return () => {
      cancelled = true;
      cancelIdle();
      reduced.removeEventListener("change", onPreferenceChange);
      stop();
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

/** Smooth-scrolls to an in-page anchor, falling back to native scrolling without Lenis. */
export function useScrollTo() {
  const lenis = useContext(LenisContext);
  return useCallback(
    (href: string) => {
      const target = href === "#top" ? 0 : document.querySelector<HTMLElement>(href);
      if (target === null) return;
      if (lenis) {
        // Resolve the destination from the real scroll position: Lenis adds the element's
        // offset to its own last-known position, which lags a native scroll that happened
        // just before the click (a focused link scrolled into view, for example).
        const top =
          target === 0
            ? 0
            : target.getBoundingClientRect().top +
              window.scrollY -
              (parseFloat(getComputedStyle(target).scrollMarginTop) || 0);
        lenis.scrollTo(top, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
      } else if (target === 0) {
        window.scrollTo({ top: 0 });
      } else {
        target.scrollIntoView();
      }
      const { pathname, search } = window.location;
      history.replaceState(null, "", href === "#top" ? pathname + search : href);
    },
    [lenis],
  );
}

export function useLenis() {
  return useContext(LenisContext);
}
