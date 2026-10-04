"use client";

import { useRef } from "react";
import { results } from "@/content/site";
import { decode, drawIn, fadeUp, restoreDecoded, revealLines } from "@/lib/animations";
import { gsap } from "@/lib/gsap";
import { useScrollTrigger } from "@/lib/useScrollTrigger";
import { Arrow } from "@/components/ui/Arrow";
import { ResultIcon } from "@/components/ui/ResultIcon";
import { SectionLabel } from "@/components/ui/SectionLabel";

export default function Results() {
  const root = useRef<HTMLElement>(null);

  useScrollTrigger(root, ({ scope, conditions }) => {
    if (conditions.reduced) return;

    revealLines(scope.querySelector<HTMLElement>("[data-title]")!);
    fadeUp("[data-lede]", { delay: 0.2 });

    const rows = gsap.utils.toArray<HTMLElement>("[data-row]", scope);
    rows.forEach((row) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 88%", once: true } });
      tl.from(row.querySelector("[data-rule]"), { scaleX: 0, transformOrigin: "0% 50%", duration: 1.3, ease: "expo.inOut" })
        .from(row.querySelectorAll("[data-row-part]"), { y: 36, autoAlpha: 0, duration: 1.1, stagger: 0.07 }, 0.25)
        .add(decode(row.querySelector<HTMLElement>("[data-row-title]")!, { duration: 0.9 }), 0.35)
        .add(drawIn(row.querySelectorAll("[data-icon-path]"), { duration: 1.2 }), 0.35);
    });

    if (!conditions.desktop || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return () => restoreDecoded(scope);
    }

    // Hover: signal floods in from the edge the pointer crossed.
    const cleanups = rows.map((row) => {
      const fill = row.querySelector<HTMLElement>("[data-fill]")!;
      const title = row.querySelector<HTMLElement>("[data-row-title]")!;
      const arrow = row.querySelector<HTMLElement>("[data-row-arrow]")!;
      gsap.set(fill, { scaleY: 0 });
      const fromTop = (event: PointerEvent) => {
        const rect = row.getBoundingClientRect();
        return event.clientY < rect.top + rect.height / 2;
      };
      const enter = (event: PointerEvent) => {
        gsap.set(fill, { transformOrigin: fromTop(event) ? "50% 0%" : "50% 100%" });
        gsap.to(fill, { scaleY: 1, duration: 0.55, ease: "expo.out", overwrite: true });
        gsap.to(title, { x: 24, duration: 0.7, ease: "expo.out", overwrite: true });
        gsap.to(arrow, { rotation: -45, scale: 1.15, duration: 0.7, ease: "expo.out", overwrite: true });
        row.dataset.hot = "";
      };
      const leave = (event: PointerEvent) => {
        gsap.set(fill, { transformOrigin: fromTop(event) ? "50% 0%" : "50% 100%" });
        gsap.to(fill, { scaleY: 0, duration: 0.5, ease: "expo.out", overwrite: true });
        gsap.to(title, { x: 0, duration: 0.7, ease: "expo.out", overwrite: true });
        gsap.to(arrow, { rotation: 0, scale: 1, duration: 0.7, ease: "expo.out", overwrite: true });
        delete row.dataset.hot;
      };
      row.addEventListener("pointerenter", enter);
      row.addEventListener("pointerleave", leave);
      return () => {
        row.removeEventListener("pointerenter", enter);
        row.removeEventListener("pointerleave", leave);
        delete row.dataset.hot;
      };
    });
    return () => {
      cleanups.forEach((fn) => fn());
      restoreDecoded(scope);
    };
  });

  return (
    <section
      ref={root}
      id="results"
      data-nav="light"
      className="relative z-10 -mt-10 rounded-t-[2.5rem] bg-paper px-5 pt-28 pb-24 md:px-10 md:pt-36 md:pb-32"
    >
      <div className="grid gap-y-10 md:grid-cols-12">
        <SectionLabel index="05" className="md:col-span-3 md:pt-5">
          What you get
        </SectionLabel>
        <div className="md:col-span-9">
          <h2 data-title className="text-[clamp(2.8rem,7.4vw,8.5rem)] leading-[0.9] font-bold tracking-[-0.042em]">
            Results that <em className="font-serif font-normal tracking-[-0.02em] text-signal italic">matter.</em>
          </h2>
          <p data-lede className="mt-8 max-w-xl text-lg leading-snug text-ink/70 md:text-xl">
            We measure success the way you do: in customers and revenue, not likes and impressions. Every campaign is
            built to move one of these six numbers.
          </p>
        </div>
      </div>

      <ol className="mt-20 md:mt-28">
        {results.map((result, i) => (
          <li key={result.title} data-row className="group/row relative isolate">
            <span data-rule aria-hidden className="absolute inset-x-0 top-0 h-px bg-ink/20" />
            <span data-fill aria-hidden className="absolute inset-0 -z-10 bg-signal" style={{ transform: "scaleY(0)" }} />
            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-3 py-7 transition-colors duration-300 group-data-hot/row:text-paper md:gap-x-6 md:px-4 md:py-9">
              <span data-row-part className="col-span-2 font-mono text-[0.7rem] tracking-[0.2em] md:col-span-1">
                R—{String(i + 1).padStart(2, "0")}
              </span>
              <span data-row-part className="col-span-2 md:col-span-1">
                <ResultIcon kind={result.icon} className="size-9 md:size-11" />
              </span>
              <h3
                data-row-part
                aria-label={result.title}
                className="col-span-8 text-[clamp(1.7rem,3.5vw,3.6rem)] leading-[0.95] font-semibold tracking-[-0.04em] md:col-span-5"
              >
                <span data-row-title className="inline-block">
                  {result.title}
                </span>
              </h3>
              <p
                data-row-part
                className="col-span-10 col-start-3 text-base leading-snug text-ink/70 transition-colors duration-300 group-data-hot/row:text-paper/90 md:col-span-4 md:col-start-auto"
              >
                {result.body}
              </p>
              <span data-row-part className="hidden justify-self-end md:col-span-1 md:block">
                <span data-row-arrow className="grid size-12 place-items-center rounded-full bg-ink text-lg text-paper">
                  <Arrow />
                </span>
              </span>
            </div>
          </li>
        ))}
        <li aria-hidden className="h-px bg-ink/20" />
      </ol>
    </section>
  );
}
