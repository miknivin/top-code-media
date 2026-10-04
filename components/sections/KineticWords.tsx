"use client";

import { useRef } from "react";
import { growthLoop } from "@/content/site";
import { seeded } from "@/lib/animations";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { useScrollTrigger } from "@/lib/useScrollTrigger";
import { SectionLabel } from "@/components/ui/SectionLabel";

/**
 * Timeline time is measured in beats; one beat of timeline = BEAT viewport heights
 * of scroll. The first word assembles over the INTRO viewport heights before the
 * pin engages, so the section never arrives empty.
 */
const BEAT = 0.45;
const INTRO = 0.8;
const SIGNAL_TEXT = "#b066ff";
const PAPER = "#f3efe7";

export default function KineticWords() {
  const root = useRef<HTMLElement>(null);

  useScrollTrigger(root, ({ scope, conditions }) => {
    if (conditions.reduced) return;
    const byChar = conditions.desktop;
    scope.dataset.motion = "";

    const stage = scope.querySelector<HTMLElement>("[data-stage]")!;
    const fills = gsap.utils.toArray<HTMLElement>("[data-fill]", scope);
    const stepLabels = gsap.utils.toArray<HTMLElement>("[data-step-label]", scope);
    const counter = scope.querySelector<HTMLElement>("[data-counter]")!;
    gsap.set(fills, { scaleX: 0, transformOrigin: "0% 50%" });

    const words = gsap.utils.toArray<HTMLElement>("[data-word]", scope).map((word) => {
      const letters = word.querySelector<HTMLElement>("[data-letters]")!;
      const glyphs = byChar
        ? (SplitText.create(letters, { type: "chars", charsClass: "inline-block", tag: "span", aria: "hidden" }).chars as HTMLElement[])
        : [letters];
      // Word-level reveals roll through a masked line, like a ticker, instead of crossfading.
      if (!byChar) {
        gsap.set(word.querySelector("h3"), { overflow: "hidden", padding: "0.18em 0 0.14em", margin: "-0.18em 0 -0.14em" });
      }
      return {
        letters,
        glyphs,
        dot: word.querySelector<HTMLElement>("[data-dot]")!,
        caption: word.querySelector<HTMLElement>("[data-caption]")!,
      };
    });

    const vw = () => window.innerWidth;
    const vh = () => window.innerHeight;
    const rand = (w: number, g: number, salt: number) => seeded(w * 131 + g * 17 + salt)();

    // No invalidateOnRefresh on this timeline: a refresh would revert it, and the delayed
    // letters of a staggered from() are never re-rendered afterwards, so every word would
    // show at once. Scatter distances are therefore sized once, which only matters cosmetically.
    const tl = gsap.timeline({ defaults: { ease: "none" } });
    const last = words.length - 1;
    const introBeats = INTRO / BEAT;

    words.forEach((word, w) => {
      const at = w === 0 ? 0 : tl.duration() - 0.35;
      const enter = w === 0 ? introBeats : 1;
      tl.addLabel(`w${w}`, at);

      if (byChar) {
        tl.from(
          word.glyphs,
          {
            x: (g) => (rand(w, g, 1) - 0.5) * vw() * 0.9,
            y: (g) => (rand(w, g, 2) - 0.5) * vh() * 0.9,
            rotation: (g) => (rand(w, g, 3) - 0.5) * 200,
            rotationY: (g) => (rand(w, g, 4) - 0.5) * 140,
            scale: (g) => 0.3 + rand(w, g, 5) * 1.6,
            transformPerspective: 700,
            opacity: 0,
            duration: enter,
            ease: "power3.out",
            stagger: { each: 0.045, from: "center" },
          },
          at,
        );
      } else {
        tl.from(word.glyphs, { yPercent: 160, duration: enter, ease: "power3.out" }, at);
      }
      tl.from(word.caption, { y: 28, opacity: 0, duration: 0.5, ease: "power2.out" }, at + enter * 0.55)
        .from(word.dot, { scale: 0, duration: 0.45, ease: "back.out(3)" }, at + enter * 0.75)
        .to({}, { duration: 0.55 });

      if (w < last) {
        if (byChar) {
          tl.to(word.glyphs, {
            x: (g) => (rand(w, g, 6) - 0.5) * vw() * 0.35,
            y: (g) => -(0.25 + rand(w, g, 7) * 0.4) * vh(),
            rotation: (g) => (rand(w, g, 8) - 0.5) * 120,
            scale: 0.6,
            opacity: 0,
            duration: 0.7,
            ease: "power2.in",
            stagger: { each: 0.03, from: "start" },
          });
        } else {
          tl.to(word.glyphs, { yPercent: -160, duration: 0.7, ease: "power2.in" });
        }
        tl.to(word.dot, { scale: 0, duration: 0.3, ease: "power2.in" }, "<").to(
          word.caption,
          { y: -24, opacity: 0, duration: 0.4, ease: "power2.in" },
          "<",
        );
        return;
      }

      // "Grow" climbs: each letter steps higher than the last and the dot tops the chart.
      // Percentages keep the steps proportional to the type if the window is resized.
      if (byChar) {
        tl.to(word.glyphs, { yPercent: (g) => -g * 11, duration: 0.9, ease: "power2.inOut", stagger: 0.06 });
      } else {
        tl.to(word.glyphs, { scale: 1.06, transformOrigin: "50% 100%", duration: 0.9, ease: "power2.inOut" });
      }
      tl.to(
        word.dot,
        { yPercent: byChar ? -310 : -120, xPercent: 35, scale: 1.5, duration: 0.9, ease: "back.inOut(2)" },
        "<0.15",
      ).to({}, { duration: 0.6 });
    });

    const labels = words.map((_, w) => tl.labels[`w${w}`]);
    const total = tl.duration();
    let active = -1;

    tl.eventCallback("onUpdate", () => {
      const time = tl.time();
      fills.forEach((fill, i) => {
        const end = i < last ? labels[i + 1] : total;
        gsap.set(fill, { scaleX: gsap.utils.clamp(0, 1, (time - labels[i]) / (end - labels[i])) });
      });
      let next = 0;
      labels.forEach((label, i) => {
        if (time >= label + 0.4) next = i;
      });
      if (next === active) return;
      active = next;
      counter.textContent = String(next + 1).padStart(2, "0");
      stepLabels.forEach((label, i) =>
        gsap.to(label, { opacity: i === next ? 1 : 0.6, color: i === next ? SIGNAL_TEXT : PAPER, duration: 0.3, overwrite: true }),
      );
    });

    // Pin for everything after the first word's entrance, which plays on approach.
    ScrollTrigger.create({
      trigger: scope,
      start: "top top",
      end: () => `+=${(total - introBeats) * BEAT * vh()}`,
      pin: stage,
      anticipatePin: 1,
      refreshPriority: 40,
    });
    ScrollTrigger.create({
      trigger: scope,
      start: `top ${INTRO * 100}%`,
      end: () => `+=${total * BEAT * vh()}`,
      animation: tl,
      scrub: 0.7,
    });

    return () => {
      delete scope.dataset.motion;
    };
  });

  return (
    <section
      ref={root}
      id="growth-loop"
      data-nav="dark"
      aria-labelledby="growth-loop-title"
      className="group/kin relative bg-ink text-paper"
    >
      <div
        data-stage
        className="relative overflow-hidden bg-ink px-5 pt-36 pb-28 md:px-10 group-data-motion/kin:h-svh group-data-motion/kin:py-0"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 size-[120vmin] -translate-1/2 bg-[radial-gradient(circle,rgba(150,0,255,0.2),transparent_62%)]"
        />

        <div className="relative z-10 flex items-start justify-between gap-6 group-data-motion/kin:absolute group-data-motion/kin:inset-x-5 group-data-motion/kin:top-24 md:group-data-motion/kin:inset-x-10 md:group-data-motion/kin:top-28">
          <div>
            <SectionLabel index="01">The growth loop</SectionLabel>
            <h2 id="growth-loop-title" className="mt-3 max-w-[18rem] text-sm text-paper/60">
              Five stages. One system. Every stage feeds the next.
            </h2>
          </div>
          <p className="hidden shrink-0 font-mono text-[0.68rem] tracking-[0.2em] whitespace-nowrap group-data-motion/kin:block">
            <span data-counter className="text-signal-soft">
              01
            </span>{" "}
            / {String(growthLoop.length).padStart(2, "0")}
          </p>
        </div>

        <ol className="relative mt-16 space-y-16 group-data-motion/kin:absolute group-data-motion/kin:inset-0 group-data-motion/kin:mt-0 group-data-motion/kin:space-y-0">
          {growthLoop.map((item) => (
            <li
              key={item.word}
              data-word
              className="flex flex-col items-center text-center group-data-motion/kin:absolute group-data-motion/kin:inset-0 group-data-motion/kin:justify-center"
            >
              <h3 aria-label={item.word} className="text-[min(19vw,34svh)] leading-[0.8] font-extrabold tracking-tighter whitespace-nowrap">
                <span data-letters className="inline-block">
                  {item.word}
                </span>
                <span
                  data-dot
                  aria-hidden
                  className="ml-[0.03em] inline-block size-[0.15em] rounded-full bg-signal align-baseline"
                />
              </h3>
              <p data-caption className="mt-[4svh] max-w-sm text-base text-paper/65 md:text-xl">
                {item.line}
              </p>
            </li>
          ))}
        </ol>

        <div
          aria-hidden
          className="absolute inset-x-5 bottom-14 hidden grid-cols-5 gap-3 group-data-motion/kin:grid md:inset-x-10 md:gap-6"
        >
          {growthLoop.map((item, i) => (
            <div key={item.word} data-step-label className="opacity-60">
              <div className="relative h-px overflow-hidden bg-paper/20">
                <div data-fill className="absolute inset-0 bg-signal" />
              </div>
              <p className="mt-3 font-mono text-[0.68rem] tracking-[0.18em] uppercase">
                0{i + 1} <span className="hidden sm:inline">{item.word}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
