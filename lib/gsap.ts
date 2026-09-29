import { whenIdle } from "./idle";

type Gsap = typeof import("gsap").gsap;
type ScrollTriggerStatic = typeof import("gsap/ScrollTrigger").ScrollTrigger;
type SplitTextStatic = typeof import("gsap/SplitText").SplitText;

/*
 * GSAP stays out of the initial bundle. These are live bindings: they are empty
 * until loadGsap() resolves, and every consumer only touches them after awaiting it.
 */
export let gsap: Gsap;
export let ScrollTrigger: ScrollTriggerStatic;
export let SplitText: SplitTextStatic;

let loading: Promise<void> | undefined;

/**
 * Fetches GSAP, ScrollTrigger and SplitText once the page is idle, so the chunk never
 * competes with the hero's first paint, then registers the plugins. Safe to call often.
 */
export function loadGsap() {
  loading ??= new Promise<void>((resolve) => whenIdle(() => resolve(), 1200))
    .then(() => Promise.all([import("gsap"), import("gsap/ScrollTrigger"), import("gsap/SplitText")]))
    .then(([core, scrollTrigger, splitText]) => {
      gsap = core.gsap;
      ScrollTrigger = scrollTrigger.ScrollTrigger;
      SplitText = splitText.SplitText;
      gsap.registerPlugin(ScrollTrigger, SplitText);
      gsap.defaults({ ease: "expo.out", duration: 1 });
      ScrollTrigger.config({ ignoreMobileResize: true });
    });
  return loading;
}

/** One set of conditions for every section, so breakpoints never drift apart. */
export const motionQueries = {
  desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 767.98px) and (prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
} as const;

export type MotionConditions = Record<keyof typeof motionQueries, boolean>;
