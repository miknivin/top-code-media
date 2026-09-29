"use client";

import { useEffect, useLayoutEffect, useRef, type DependencyList, type RefObject } from "react";
import { gsap, loadGsap, motionQueries, type MotionConditions } from "./gsap";
import { whenIdle } from "./idle";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Setup<T extends HTMLElement> = (args: {
  scope: T;
  conditions: MotionConditions;
}) => void | (() => void);

/**
 * Runs `setup` inside a gsap.matchMedia() context scoped to `scope`, once GSAP has
 * loaded and the browser is idle. Each section therefore builds its animations in its
 * own short task, in page order, after the hero has painted. Every tween, ScrollTrigger
 * and SplitText created in `setup` is reverted when the breakpoint or motion preference
 * changes, and again when the component unmounts.
 */
export function useScrollTrigger<T extends HTMLElement>(
  scope: RefObject<T | null>,
  setup: Setup<T>,
  deps: DependencyList = [],
) {
  const setupRef = useRef(setup);
  useIsomorphicLayoutEffect(() => {
    setupRef.current = setup;
  });

  useIsomorphicLayoutEffect(() => {
    const el = scope.current;
    if (!el) return;

    let cancelled = false;
    let cancelIdle = () => {};
    let mm: gsap.MatchMedia | undefined;

    loadGsap().then(() => {
      if (cancelled) return;
      cancelIdle = whenIdle(() => {
        mm = gsap.matchMedia(el);
        mm.add(motionQueries, (context) =>
          setupRef.current({ scope: el, conditions: context.conditions as MotionConditions }),
        );
      });
    });

    return () => {
      cancelled = true;
      cancelIdle();
      mm?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
