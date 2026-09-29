"use client";

import { useRef } from "react";
import { marquee } from "@/content/site";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useScrollTrigger } from "@/lib/useScrollTrigger";

function Spark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        d="M12 2.5v19M2.5 12h19M5.3 5.3l13.4 13.4M18.7 5.3 5.3 18.7"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/** Tilted service ribbon. Drifts on its own; scroll speed pushes it and scroll direction flips it. */
export default function Marquee() {
  const root = useRef<HTMLDivElement>(null);

  useScrollTrigger(root, ({ scope, conditions }) => {
    if (conditions.reduced) return;
    const track = scope.querySelector<HTMLElement>("[data-track]");
    if (!track) return;

    const setX = gsap.quickSetter(track, "x", "px");
    const baseSpeed = conditions.mobile ? 45 : 80;
    let width = track.scrollWidth / 2;
    let x = 0;
    let direction = -1;
    let boost = 0;

    const tick = (_time: number, deltaTime: number) => {
      x = gsap.utils.wrap(-width, 0, x + direction * (baseSpeed + boost) * (deltaTime / 1000));
      setX(x);
      boost *= 0.93;
    };

    ScrollTrigger.create({
      trigger: scope,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => (self.isActive ? gsap.ticker.add(tick) : gsap.ticker.remove(tick)),
      onUpdate: (self) => {
        direction = self.direction === 1 ? -1 : 1;
        boost = Math.min(Math.abs(self.getVelocity()) * 0.3, 1100);
      },
      onRefresh: () => {
        width = track.scrollWidth / 2;
      },
    });

    return () => gsap.ticker.remove(tick);
  });

  return (
    <div ref={root} data-nav="signal" className="relative z-20 -my-[4vw] -ml-[5vw] w-[110vw] -rotate-2 bg-signal text-ink">
      <div className="overflow-hidden py-4 md:py-6">
        <div data-track className="flex w-max will-change-transform">
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1 || undefined} className="flex shrink-0 items-center">
              {marquee.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-[0.45em] pr-[0.45em] text-[clamp(2rem,5.2vw,5.5rem)] font-extrabold leading-none tracking-[-0.045em] whitespace-nowrap"
                >
                  {item}
                  <Spark className="size-[0.55em]" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
