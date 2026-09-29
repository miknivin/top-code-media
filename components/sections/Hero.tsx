"use client";

import { useRef, type CSSProperties } from "react";
import { hero, site } from "@/content/site";
import { gsap, SplitText } from "@/lib/gsap";
import { useScrollTrigger } from "@/lib/useScrollTrigger";
import { AnchorLink } from "@/components/ui/AnchorLink";
import { Arrow } from "@/components/ui/Arrow";
import { DubaiClock } from "@/components/ui/DubaiClock";
import { MagneticButton } from "@/components/ui/MagneticButton";

const delay = (d: number) => ({ "--d": d }) as CSSProperties;

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useScrollTrigger(root, ({ scope, conditions }) => {
    if (conditions.reduced) return;

    // Badge keeps turning; scrolling winds it further.
    gsap.to("[data-badge-ring]", { rotation: 360, duration: 22, repeat: -1, ease: "none" });

    const out = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: scope, start: "top top", end: "bottom top", scrub: true },
    });
    gsap.utils.toArray<HTMLElement>("[data-hero-line]").forEach((line, i) => {
      out.to(line, { yPercent: -22 * (i + 1), xPercent: i % 2 ? 2 : -2 }, 0);
    });
    out
      .to("[data-badge-scroll]", { rotation: 220, scale: 0.8 }, 0)
      .to("[data-hero-out]", { autoAlpha: 0, y: -60 }, 0)
      .to("[data-hero-grid]", { yPercent: 18 }, 0);

    if (!conditions.desktop || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    return proximityType(scope);
  });

  return (
    <section
      ref={root}
      id="top"
      data-nav="light"
      className="relative isolate flex min-h-svh flex-col overflow-hidden bg-paper px-5 pt-24 pb-[calc(4vw+2.5rem)] md:px-10 md:pt-28"
    >
      <div data-hero-grid aria-hidden className="hero-grid pointer-events-none absolute inset-0 -z-10" />

      <div className="flex items-center justify-between gap-6 font-mono text-[0.68rem] uppercase tracking-[0.2em]">
        <p className="hero-fade flex items-center gap-3" style={delay(0)}>
          <span aria-hidden className="inline-block size-1.5 rounded-full bg-signal" />
          {hero.eyebrow}
        </p>
        <p className="hero-fade hidden text-right md:block" style={delay(1)}>
          {site.licence}{" "}
          <span aria-hidden className="mx-2 inline-block size-1 rounded-full bg-signal align-middle" />{" "}
          {site.reach}
        </p>
      </div>

      <div className="relative my-auto py-10 md:py-8">
        <h1
          aria-label={hero.lines.map((line) => `${line.lead} ${line.word.replace(/\.$/, "")}.`).join(" ")}
          className="text-[14vw] leading-[0.86] tracking-tighter md:text-[clamp(2.6rem,min(12.2vw,18svh),13rem)]"
        >
          {hero.lines.map((line, i) => (
            <span key={line.word} data-hero-line className="block whitespace-nowrap">
              <span className="hero-rise" style={delay(i)}>
                <span data-prox="light" className="font-light">
                  {line.lead}
                </span>{" "}
                {line.accent ? (
                  <em className="font-serif text-[1.08em] font-normal tracking-[-0.03em] italic">{line.word}</em>
                ) : (
                  <span data-prox="bold" className="font-extrabold tracking-[-0.035em]">
                    {line.word.replace(/\.$/, "")}
                  </span>
                )}
                <span
                  aria-hidden
                  className="ml-[0.04em] inline-block size-[0.15em] rounded-full bg-signal align-baseline"
                />
              </span>
            </span>
          ))}
        </h1>

        <div className="hero-spin-in absolute right-0 bottom-10 hidden size-[clamp(5.5rem,11vw,11rem)] md:block">
          <div data-badge-scroll className="size-full">
            <AnchorLink
              href="#growth-loop"
              aria-label="Scroll to the growth loop"
              className="group relative grid size-full place-items-center"
            >
              <svg data-badge-ring viewBox="0 0 200 200" aria-hidden className="absolute inset-0 size-full">
                <defs>
                  <path id="badge-circle" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
                </defs>
                <text className="fill-current font-mono text-[14px] uppercase">
                  <textPath href="#badge-circle" textLength="500" lengthAdjust="spacing">
                    {`${site.tagline.join(" ● ")} ● ${site.name} ● `}
                  </textPath>
                </text>
              </svg>
              <span className="grid size-[44%] place-items-center rounded-full bg-ink text-[clamp(1rem,1.8vw,1.6rem)] text-paper">
                <Arrow direction="down" />
              </span>
            </AnchorLink>
          </div>
        </div>
      </div>

      <div data-hero-out className="grid gap-8 md:grid-cols-12 md:items-end">
        <p className="hero-fade max-w-md text-lg leading-snug text-ink/75 md:col-span-5 md:text-xl" style={delay(2)}>
          {hero.body}
        </p>
        <div className="hero-fade flex flex-wrap items-center gap-x-8 gap-y-4 md:col-span-7 md:justify-end" style={delay(3)}>
          <MagneticButton
            href="#contact"
            className="rounded-full bg-ink px-7 py-4 text-base font-semibold text-paper"
            hoverColor="#0f0e0c"
          >
            {hero.cta} <Arrow />
          </MagneticButton>
          <AnchorLink
            href="#services"
            className="group inline-flex items-center gap-2 border-b border-ink/30 pb-1 font-medium transition-colors hover:border-ink"
          >
            {hero.secondary}
          </AnchorLink>
        </div>
      </div>

      <div data-hero-out className="mt-10">
        <div
          className="hero-fade flex items-center justify-between gap-6 border-t border-ink/15 pt-4 font-mono text-[0.68rem] uppercase tracking-[0.2em]"
          style={delay(4)}
        >
          <DubaiClock />
          <p className="hidden items-center gap-3 md:flex">
            {site.tagline.map((word, i) => (
              <span key={word} className="flex items-center gap-3">
                {i > 0 && <Arrow className="text-signal" />}
                {word}
              </span>
            ))}
          </p>
          <span>Scroll</span>
        </div>
      </div>
    </section>
  );
}

/**
 * An inversion lens on the weight axis: near the pointer, light letters swell to
 * bold and bold letters thin out. Each letter's box is locked to its resting width
 * with the glyph centred inside it, so a change in weight never reflows the line;
 * the letters thicken in place instead of shoving their neighbours sideways.
 */
function proximityType(scope: HTMLElement) {
  let cancelled = false;
  let detach: (() => void) | undefined;
  if (document.fonts.status === "loaded") detach = attach();
  else document.fonts.ready.then(() => !cancelled && (detach = attach()));
  return () => {
    cancelled = true;
    detach?.();
  };

  function attach() {
    const targets = [...scope.querySelectorAll<HTMLElement>("[data-prox]")];
    // Splitting into one box per letter drops the font's kerning, which would jolt the
    // headline sideways the instant the effect switches on. Record where every letter
    // sits first, then put each one back. Everything below runs in one task, so no
    // frame is painted between the split and the correction.
    const original = targets.flatMap(letterLefts);
    // The last group on each line is followed by content that isn't split (the dot, or
    // the italic "mind"); remember where that content starts so it can be pinned too.
    const lineEnds = targets.filter((target, i) => {
      const next = targets[i + 1];
      return !next || next.closest("[data-hero-line]") !== target.closest("[data-hero-line]");
    });
    const originalFollowers = lineEnds.map((target) => target.nextElementSibling?.getBoundingClientRect().left);

    // The h1 carries the accessible name, so the split spans can be hidden outright.
    const split = SplitText.create(targets, {
      type: "chars",
      charsClass: "prox-char",
      tag: "span",
      smartWrap: true,
      aria: "hidden",
    });
    const letters = (split.chars as HTMLElement[]).map((el) => {
      const bold = el.closest("[data-prox]")?.getAttribute("data-prox") === "bold";
      const rest = bold ? 800 : 300;
      el.style.setProperty("--wght", String(rest));
      return { el, rest, peak: bold ? 420 : 720, value: 0, x: 0, y: 0 };
    });

    // Widths and kerning corrections are stored in em so they follow the fluid type size.
    const fontSize = parseFloat(getComputedStyle(letters[0].el).fontSize);
    const widths = letters.map((letter) => letter.el.getBoundingClientRect().width);
    const lefts = letters.map((letter) => letter.el.getBoundingClientRect().left);
    let line: Element | null = null;
    let carried = 0;
    letters.forEach((letter, i) => {
      const letterLine = letter.el.closest("[data-hero-line]");
      if (letterLine !== line) {
        line = letterLine;
        carried = 0;
      }
      const shift = (original[i] ?? lefts[i]) - lefts[i];
      letter.el.style.marginLeft = `${(shift - carried) / fontSize}em`;
      letter.el.style.width = `${widths[i] / fontSize}em`;
      carried = shift;
    });
    // A lone letter box doesn't end exactly where its advance did in running text, so pad
    // the line's last letter until the content after it is back where it started.
    const followers = lineEnds.map((target) => target.nextElementSibling?.getBoundingClientRect().left);
    lineEnds.forEach((target, i) => {
      const before = originalFollowers[i];
      const after = followers[i];
      const chars = target.querySelectorAll<HTMLElement>(".prox-char");
      if (before === undefined || after === undefined || !chars.length) return;
      chars[chars.length - 1].style.marginRight = `${(before - after) / fontSize}em`;
    });

    const pointer = { x: -1e4, y: -1e4 };
    let measuredAt = Number.NaN;
    let running = false;

    const measure = () => {
      const box = scope.getBoundingClientRect();
      for (const letter of letters) {
        const r = letter.el.getBoundingClientRect();
        letter.x = r.left + r.width / 2 - box.left;
        letter.y = r.top + r.height / 2 - box.top;
      }
      measuredAt = window.scrollY;
    };

    const tick = (_time: number, deltaTime: number) => {
      const radius = Math.max(220, window.innerWidth * 0.18);
      // Frame-rate independent easing: the same feel at 60Hz and 120Hz.
      const ease = 1 - Math.pow(1 - 0.12, deltaTime / (1000 / 60));
      let settling = false;
      for (const letter of letters) {
        const distance = Math.hypot(pointer.x - letter.x, pointer.y - letter.y);
        const f = Math.max(0, 1 - distance / radius);
        const target = f * f * (3 - 2 * f);
        letter.value += (target - letter.value) * ease;
        if (Math.abs(target - letter.value) > 0.001) settling = true;
        const weight = letter.rest + (letter.peak - letter.rest) * letter.value;
        letter.el.style.setProperty("--wght", weight.toFixed(1));
      }
      if (!settling && pointer.x < -9e3) {
        running = false;
        gsap.ticker.remove(tick);
      }
    };

    const onMove = (event: PointerEvent) => {
      if (window.scrollY !== measuredAt) measure();
      const box = scope.getBoundingClientRect();
      pointer.x = event.clientX - box.left;
      pointer.y = event.clientY - box.top;
      if (!running) {
        running = true;
        gsap.ticker.add(tick);
      }
    };
    const onLeave = () => {
      pointer.x = pointer.y = -1e4;
    };
    const onResize = () => {
      measuredAt = Number.NaN;
    };

    scope.addEventListener("pointermove", onMove);
    scope.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);
    return () => {
      scope.removeEventListener("pointermove", onMove);
      scope.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(tick);
      split.revert();
    };
  }
}

/** Viewport x of every non-space character inside `el`, in document order. */
function letterLefts(el: HTMLElement) {
  const lefts: number[] = [];
  const range = document.createRange();
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent ?? "";
    for (let i = 0; i < text.length; i++) {
      if (/\s/.test(text[i])) continue;
      range.setStart(node, i);
      range.setEnd(node, i + 1);
      lefts.push(range.getBoundingClientRect().left);
    }
  }
  return lefts;
}
