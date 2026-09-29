"use client";

import { useRef } from "react";
import { site } from "@/content/site";
import { gsap, SplitText } from "@/lib/gsap";
import { useScrollTrigger } from "@/lib/useScrollTrigger";

export function FooterWordmark() {
  const root = useRef<HTMLDivElement>(null);

  useScrollTrigger(root, ({ scope, conditions }) => {
    if (conditions.reduced) return;
    const chars = SplitText.create(scope.querySelector("[data-mark]"), {
      type: conditions.desktop ? "chars" : "words",
      tag: "span",
      aria: "none",
    });
    gsap.from(conditions.desktop ? chars.chars : chars.words, {
      yPercent: 110,
      duration: 1.4,
      ease: "expo.out",
      stagger: conditions.desktop ? 0.035 : 0.1,
      scrollTrigger: { trigger: scope, start: "top 92%", once: true },
    });
    gsap.from("[data-mark-dot]", {
      scale: 0,
      duration: 0.9,
      ease: "back.out(3)",
      delay: 0.7,
      scrollTrigger: { trigger: scope, start: "top 92%", once: true },
    });
  });

  return (
    <div ref={root} aria-hidden className="@container mt-20 overflow-hidden md:mt-28">
      {/* Sized to the container; smaller optical sizes set wider, hence the mobile step down. */}
      <p className="text-[14.2cqi] leading-[0.8] font-extrabold tracking-[-0.045em] whitespace-nowrap md:text-[15cqi]">
        <span data-mark className="inline-block pb-[0.06em]">
          {site.name}
        </span>
        <span data-mark-dot className="ml-[0.03em] inline-block size-[0.14em] rounded-full bg-signal align-baseline" />
      </p>
    </div>
  );
}
