"use client";

import { useRef } from "react";
import { intro } from "@/content/site";
import { fadeUp, readingScrub, revealLines } from "@/lib/animations";
import { gsap } from "@/lib/gsap";
import { useScrollTrigger } from "@/lib/useScrollTrigger";
import { SectionLabel } from "@/components/ui/SectionLabel";

/** Inline chart chip that sits inside the headline like a word. */
function GrowthPill() {
  const bars = [0.35, 0.55, 0.45, 0.75, 1];
  return (
    <span
      aria-hidden
      className="relative mx-[0.08em] inline-flex h-[0.72em] w-[1.5em] items-end gap-[0.06em] rounded-full bg-ink px-[0.22em] pb-[0.14em] align-[-0.02em]"
    >
      {bars.map((h, i) => (
        <span
          key={i}
          data-pill-bar
          className="block flex-1 rounded-[0.04em] bg-signal"
          style={{ height: `${h * 0.42}em` }}
        />
      ))}
    </span>
  );
}

export default function Intro() {
  const root = useRef<HTMLElement>(null);

  useScrollTrigger(root, ({ scope, conditions }) => {
    if (conditions.reduced) return;
    const title = scope.querySelector<HTMLElement>("[data-title]")!;
    revealLines(title);
    gsap.from("[data-pill-bar]", {
      scaleY: 0,
      transformOrigin: "50% 100%",
      duration: 1.1,
      ease: "back.out(2)",
      stagger: 0.07,
      delay: 0.5,
      scrollTrigger: { trigger: title, start: "top 80%", once: true },
    });

    readingScrub(scope.querySelector<HTMLElement>("[data-statement]")!);
    fadeUp("[data-paragraph]", { stagger: 0.12 });

    // Counters and their rules
    gsap.utils.toArray<HTMLElement>("[data-stat]").forEach((stat, i) => {
      const number = stat.querySelector<HTMLElement>("[data-count]")!;
      const target = Number(number.dataset.count);
      const counter = { value: 0 };
      const tl = gsap.timeline({ scrollTrigger: { trigger: stat, start: "top 90%", once: true }, delay: i * 0.1 });
      tl.from(stat.querySelector("[data-rule]"), { scaleX: 0, transformOrigin: "0% 50%", duration: 1.2, ease: "expo.inOut" })
        .to(
          counter,
          {
            value: target,
            duration: 1.4,
            ease: "power3.out",
            onUpdate: () => {
              number.textContent = String(Math.round(counter.value)).padStart(2, "0");
            },
          },
          0.2,
        )
        .from(stat.querySelector("[data-stat-label]"), { y: 16, autoAlpha: 0, duration: 0.9 }, 0.35);
    });
  });

  return (
    <section
      ref={root}
      id="about"
      data-nav="light"
      className="relative z-10 -mt-10 rounded-t-[2.5rem] bg-paper px-5 pt-28 pb-28 md:px-10 md:pt-36 md:pb-36"
    >
      <div className="grid gap-y-10 md:grid-cols-12">
        <SectionLabel index="02" className="md:col-span-3 md:pt-5">
          Who we are
        </SectionLabel>
        <h2
          data-title
          className="text-[clamp(2.8rem,7.4vw,8.5rem)] leading-[0.9] font-bold tracking-[-0.042em] md:col-span-9"
        >
          {intro.title[0]}
          <br />
          {intro.title[1]} <GrowthPill />{" "}
          <em className="font-serif text-[1.06em] font-normal tracking-[-0.02em] text-signal italic">{intro.accent}</em>
        </h2>
      </div>

      <div className="mt-20 grid gap-y-12 md:mt-28 md:grid-cols-12 md:gap-x-10">
        <p
          data-statement
          className="text-[clamp(1.6rem,2.9vw,2.9rem)] leading-[1.12] font-medium tracking-[-0.03em] md:col-span-6 md:col-start-4"
        >
          {intro.statement}
        </p>
        <div className="space-y-5 text-[1.05rem] leading-relaxed text-ink/70 md:col-span-3 md:pt-3">
          {intro.paragraphs.map((text) => (
            <p key={text.slice(0, 24)} data-paragraph>
              {text}
            </p>
          ))}
        </div>
      </div>

      <dl className="mt-24 grid grid-cols-2 gap-x-5 gap-y-12 md:mt-36 md:grid-cols-4 md:gap-x-10">
        {intro.stats.map((stat) => (
          <div key={stat.label} data-stat className="relative flex flex-col pt-6">
            <span data-rule aria-hidden className="absolute inset-x-0 top-0 h-px bg-ink/25" />
            <dt data-stat-label className="order-last mt-3 max-w-[14rem] text-sm text-ink/65">
              {stat.label}
            </dt>
            <dd
              data-count={stat.value}
              className="order-first text-[clamp(3.5rem,7vw,7rem)] leading-none font-bold tracking-[-0.06em] tabular-nums"
            >
              {String(stat.value).padStart(2, "0")}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
