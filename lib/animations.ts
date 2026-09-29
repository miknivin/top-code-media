import { gsap, SplitText } from "./gsap";

type RevealOptions = {
  trigger?: Element;
  start?: string;
  y?: number;
  stagger?: number;
  delay?: number;
};

/** The base text-block reveal: slide up and fade in once, when the block enters. */
export function fadeUp(targets: gsap.TweenTarget, { trigger, start = "top 85%", y = 48, stagger = 0.08, delay = 0 }: RevealOptions = {}) {
  const first = gsap.utils.toArray<Element>(targets)[0];
  return gsap.from(targets, {
    y,
    autoAlpha: 0,
    duration: 1.2,
    ease: "expo.out",
    stagger,
    delay,
    scrollTrigger: { trigger: trigger ?? first, start, once: true },
  });
}

/**
 * Masked line-by-line rise. `autoSplit` re-splits when fonts load or the width
 * changes; returning the tween from onSplit lets SplitText carry its progress over.
 */
export function revealLines(el: HTMLElement, { trigger, start = "top 82%", stagger = 0.1, delay = 0 }: RevealOptions = {}) {
  return SplitText.create(el, {
    type: "lines",
    mask: "lines",
    linesClass: "split-line",
    autoSplit: true,
    onSplit: (self) =>
      gsap.from(self.lines, {
        yPercent: 115,
        rotate: 2.5,
        transformOrigin: "0% 0%",
        duration: 1.35,
        ease: "expo.out",
        stagger,
        delay,
        scrollTrigger: { trigger: trigger ?? el, start, once: true },
      }),
  });
}

/**
 * Words brighten one by one as the paragraph is read past. Scrubbed, so desktop and
 * mobile only. Unread words stay at 45%, which still clears 3:1 for large text.
 */
export function readingScrub(el: HTMLElement, { start = "top 80%", end = "bottom 55%" }: { start?: string; end?: string } = {}) {
  // aria "none": the words stay readable in place, and aria-label isn't valid on a plain <p>.
  const split = SplitText.create(el, { type: "words", aria: "none" });
  gsap.fromTo(
    split.words,
    { opacity: 0.45 },
    { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: el, start, end, scrub: true } },
  );
  return split;
}

/** Strokes marked with pathLength="1" draw themselves in. */
export function drawIn(targets: gsap.TweenTarget, vars: gsap.TweenVars = {}) {
  return gsap.fromTo(
    targets,
    { strokeDasharray: 1, strokeDashoffset: 1 },
    { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut", stagger: 0.08, ...vars },
  );
}

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";

/**
 * Letters flicker through random glyphs and lock in left to right. The real text
 * lives in data-text so an interrupted run can always be restored (see restoreDecoded).
 */
export function decode(el: HTMLElement, { duration = 1 }: { duration?: number } = {}) {
  const text = (el.dataset.text ??= el.textContent ?? "");
  const state = { progress: 0 };
  let lastFrame = -1;
  const randomFor = (char: string) => {
    const set = char === char.toUpperCase() && char !== char.toLowerCase() ? UPPER : LOWER;
    return /[a-z]/i.test(char) ? set[(Math.random() * set.length) | 0] : char;
  };
  return gsap.fromTo(
    state,
    { progress: 0 },
    {
      progress: 1,
      duration,
      ease: "power1.inOut",
      onUpdate: () => {
        const frame = Math.floor(state.progress * duration * 24);
        if (frame === lastFrame) return;
        lastFrame = frame;
        const locked = Math.floor(state.progress * text.length);
        el.textContent = text.slice(0, locked) + [...text.slice(locked)].map(randomFor).join("");
      },
      onComplete: () => {
        el.textContent = text;
      },
    },
  );
}

export function restoreDecoded(scope: Element) {
  scope.querySelectorAll<HTMLElement>("[data-text]").forEach((el) => {
    el.textContent = el.dataset.text ?? el.textContent;
  });
}

/** Builds a paused timeline from the data-a tags inside an illustration (see ServiceArt). */
export function artTimeline(root: Element) {
  const parts = (kind: string) => root.querySelectorAll(`[data-a="${kind}"]`);
  const tl = gsap.timeline({ paused: true });
  const draw = parts("draw");
  const grow = parts("grow");
  const growX = parts("grow-x");
  const pop = parts("pop");
  const fade = parts("fade");
  if (draw.length) {
    tl.fromTo(
      draw,
      { strokeDasharray: 1, strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut", stagger: 0.06 },
      0,
    );
  }
  if (grow.length) tl.from(grow, { scaleY: 0, transformOrigin: "50% 100%", duration: 1, ease: "expo.out", stagger: 0.07 }, 0.15);
  if (growX.length) tl.from(growX, { scaleX: 0, transformOrigin: "0% 50%", duration: 1, ease: "expo.out", stagger: 0.05 }, 0.25);
  if (fade.length) tl.from(fade, { autoAlpha: 0, y: 8, duration: 0.8, ease: "power2.out", stagger: 0.06 }, 0.3);
  if (pop.length) tl.from(pop, { scale: 0, transformOrigin: "50% 50%", duration: 0.8, ease: "back.out(2.2)", stagger: 0.07 }, 0.35);
  return tl;
}

/** Small deterministic PRNG so scatter positions are identical across refreshes. */
export function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), state | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
