"use client";

import { useRef } from "react";
import { approach, processSteps } from "@/content/site";
import { fadeUp, revealLines } from "@/lib/animations";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useScrollTrigger } from "@/lib/useScrollTrigger";
import { chartPoints, GrowthChart } from "@/components/ui/GrowthChart";
import { ProcessStep } from "@/components/ui/ProcessStep";
import { SectionLabel } from "@/components/ui/SectionLabel";

const SIGNAL = "#9600ff";
const SIGNAL_TEXT = "#b066ff";
const INK = "#0f0e0c";
const PAPER = "#f3efe7";
const UPCOMING = "rgba(243, 239, 231, 0.35)";

/** Distance along the curve at which it passes x (the curve only moves rightward). */
function lengthAtX(path: SVGPathElement, x: number, total: number) {
  let lo = 0;
  let hi = total;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (path.getPointAtLength(mid).x < x) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export default function ProcessStepper() {
  const root = useRef<HTMLElement>(null);

  useScrollTrigger(root, ({ scope, conditions }) => {
    if (conditions.reduced) return;

    revealLines(scope.querySelector<HTMLElement>("[data-title]")!);
    fadeUp("[data-copy]");
    gsap.utils.toArray<HTMLElement>("[data-no]").forEach((row) => {
      const scroll = { trigger: row, start: "top 80%", end: "top 52%", scrub: true };
      gsap.fromTo(row.querySelector("[data-strike]"), { scaleX: 0 }, { scaleX: 1, transformOrigin: "0% 50%", ease: "none", scrollTrigger: scroll });
      gsap.fromTo(row.querySelector("s"), { opacity: 1 }, { opacity: 0.4, ease: "none", scrollTrigger: scroll });
    });

    const path = scope.querySelector<SVGPathElement>("[data-curve]")!;
    const head = scope.querySelector<SVGGElement>("[data-head]")!;
    const clip = scope.querySelector<SVGRectElement>("[data-area-clip]")!;
    const points = gsap.utils.toArray<SVGCircleElement>("[data-point]", scope);
    const steps = gsap.utils.toArray<HTMLElement>("[data-step]", scope);
    const total = path.getTotalLength();
    const fractions = chartPoints.map(([x], i) =>
      i === 0 ? 0 : i === chartPoints.length - 1 ? 1 : lengthAtX(path, x, total) / total,
    );

    const drawTo = (fraction: number) => {
      const point = path.getPointAtLength(fraction * total);
      path.style.strokeDashoffset = String(1 - fraction);
      head.setAttribute("transform", `translate(${point.x} ${point.y})`);
      clip.setAttribute("width", String(point.x));
    };
    gsap.set(path, { strokeDasharray: 1 });

    if (conditions.mobile) {
      const chart = scope.querySelector<SVGSVGElement>("[data-chart] svg")!;
      const draw = { progress: 0 };
      drawTo(0);
      gsap.to(draw, {
        progress: 1,
        duration: 2.2,
        ease: "power2.inOut",
        scrollTrigger: { trigger: chart, start: "top 75%", once: true },
        onUpdate: () => drawTo(draw.progress),
      });
      gsap.from(points, { scale: 0, transformOrigin: "50% 50%", stagger: 0.25, delay: 0.3, duration: 0.6, ease: "back.out(3)", scrollTrigger: { trigger: chart, start: "top 75%", once: true } });

      const list = scope.querySelector<HTMLElement>("[data-steps]")!;
      gsap.fromTo(
        "[data-vline]",
        { scaleY: 0, opacity: 1 },
        { scaleY: 1, transformOrigin: "50% 0%", ease: "none", scrollTrigger: { trigger: list, start: "top 70%", end: "bottom 60%", scrub: true } },
      );
      steps.forEach((step) => fadeUp(step, { y: 40 }));
      return;
    }

    // Desktop: pin the stage and let scroll drive the whole chart.
    scope.dataset.motion = "";
    const stage = scope.querySelector<HTMLElement>("[data-stage]")!;
    const segments = gsap.utils.toArray<HTMLElement>("[data-seg]", scope);
    const segmentLabels = gsap.utils.toArray<HTMLElement>("[data-seg-label]", scope);
    const digits = scope.querySelector<HTMLElement>("[data-digits]")!;
    const last = steps.length - 1;
    let current = -1;

    gsap.set(steps, { autoAlpha: 0 });
    gsap.set(segments, { scaleX: 0, transformOrigin: "0% 50%" });

    const show = (next: number) => {
      const direction = next > current ? 1 : -1;
      if (current >= 0) {
        gsap.to(steps[current], { autoAlpha: 0, y: -40 * direction, duration: 0.4, ease: "power2.in", overwrite: true });
      }
      gsap.fromTo(
        steps[next],
        { autoAlpha: 0, y: 56 * direction },
        { autoAlpha: 1, y: 0, duration: 0.9, ease: "expo.out", delay: current >= 0 ? 0.18 : 0, overwrite: true },
      );
      gsap.to(digits, { yPercent: (-100 / steps.length) * next, duration: 0.8, ease: "expo.inOut", overwrite: true });
      points.forEach((point, i) =>
        gsap.to(point, {
          attr: { r: i === next ? 10 : 6.5 },
          fill: i <= next ? SIGNAL : INK,
          stroke: i <= next ? INK : UPCOMING,
          duration: 0.4,
          overwrite: true,
        }),
      );
      segmentLabels.forEach((label, i) =>
        gsap.to(label, { opacity: i === next ? 1 : 0.6, color: i === next ? SIGNAL_TEXT : PAPER, duration: 0.3, overwrite: true }),
      );
      current = next;
    };

    const render = (raw: number) => {
      // A little dwell at both ends so the first and last steps get their moment.
      const p = gsap.utils.clamp(0, 1, (raw - 0.05) / 0.83);
      const along = p * last;
      const i = Math.min(last - 1, Math.floor(along));
      drawTo(fractions[i] + (fractions[i + 1] - fractions[i]) * (along - i));
      segments.forEach((segment, k) => gsap.set(segment, { scaleX: k === 0 ? 1 : gsap.utils.clamp(0, 1, along - (k - 1)) }));

      const next = Math.min(last, Math.floor(along + 1e-4));
      if (next !== current) show(next);
    };

    const proxy = { progress: 0 };
    gsap.to(proxy, {
      progress: 1,
      ease: "none",
      onUpdate: () => render(proxy.progress),
      scrollTrigger: {
        trigger: stage,
        start: "top top",
        end: () => `+=${window.innerHeight * 5}`,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        refreshPriority: 20,
      },
    });
    render(0);

    return () => {
      delete scope.dataset.motion;
    };
  });

  return (
    <section
      ref={root}
      id="process"
      data-nav="dark"
      className="group/proc relative z-10 -mt-10 rounded-t-[2.5rem] bg-ink text-paper"
    >
      <div className="grid gap-y-10 px-5 pt-28 pb-16 md:grid-cols-12 md:px-10 md:pt-36 md:pb-24">
        <SectionLabel index="04" className="md:col-span-3 md:pt-5">
          How we work
        </SectionLabel>
        <div className="md:col-span-9">
          <h2 data-title className="text-[clamp(2.8rem,7.4vw,8.5rem)] leading-[0.9] font-bold tracking-[-0.042em]">
            {approach.title[0]}{" "}
            <em className="font-serif font-normal tracking-[-0.02em] text-signal italic">{approach.title[1]}</em>{" "}
            {approach.title[2]}
          </h2>
          <ul className="mt-12 space-y-2 text-[clamp(1.6rem,3.4vw,3.4rem)] leading-[1.1] font-semibold tracking-[-0.035em] md:mt-16">
            {approach.struck.map((phrase) => (
              <li key={phrase} data-no>
                No{" "}
                <span className="relative inline-block">
                  <s className="no-underline opacity-40">{phrase}</s>
                  <span
                    data-strike
                    aria-hidden
                    className="absolute top-[54%] right-[-0.06em] left-[-0.06em] h-[0.09em] rounded-full bg-signal"
                  />
                </span>
                .
              </li>
            ))}
          </ul>
          <p data-copy className="mt-12 max-w-xl text-lg leading-snug text-paper/70 md:text-xl">
            {approach.body}
          </p>
        </div>
      </div>

      <div
        data-stage
        className="relative bg-ink px-5 pb-28 md:px-10 group-data-motion/proc:flex group-data-motion/proc:h-svh group-data-motion/proc:items-center group-data-motion/proc:pb-0"
      >
        <div className="grid w-full gap-12 md:grid-cols-12 md:items-center md:gap-10">
          <div
            data-chart
            className="md:sticky md:top-28 md:order-last md:col-span-7 md:self-start group-data-motion/proc:static group-data-motion/proc:self-auto"
          >
            <GrowthChart className="w-full overflow-visible" />
          </div>

          <div className="md:col-span-5">
            <div
              aria-hidden
              className="hidden items-start text-[clamp(6rem,11vw,11rem)] leading-none font-bold tracking-[-0.06em] group-data-motion/proc:flex"
            >
              <span>0</span>
              <span className="relative h-[1em] overflow-hidden">
                <span data-digits className="flex flex-col">
                  {processSteps.map((_, i) => (
                    <span key={i} className="h-[1em]">
                      {i + 1}
                    </span>
                  ))}
                </span>
              </span>
              <span className="mt-[0.2em] ml-3 font-mono text-sm font-normal tracking-normal text-paper/50">/06</span>
            </div>
            <div className="relative">
              <span
                data-vline
                aria-hidden
                className="absolute top-0 bottom-0 left-[calc(1.5rem-0.5px)] w-0.5 bg-signal opacity-0 md:hidden"
              />
              <ol
                data-steps
                className="relative ml-6 border-l border-paper/15 pl-6 md:ml-0 md:border-0 md:pl-0 group-data-motion/proc:mt-6 group-data-motion/proc:h-60"
              >
                {processSteps.map((step, i) => (
                  <ProcessStep key={step.title} index={i} title={step.title} body={step.body} />
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div aria-hidden className="absolute inset-x-10 bottom-14 hidden grid-cols-6 gap-4 group-data-motion/proc:grid">
          {processSteps.map((step, i) => (
            <div key={step.title} data-seg-label className="opacity-60">
              <div className="h-px overflow-hidden bg-paper/20">
                <div data-seg className="h-full bg-signal" />
              </div>
              <p className="mt-3 font-mono text-[0.68rem] tracking-[0.18em] uppercase">
                0{i + 1} {step.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
