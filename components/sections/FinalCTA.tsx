"use client";

import { useRef } from "react";
import { finalCta, site } from "@/content/site";
import { fadeUp, revealLines } from "@/lib/animations";
import { useScrollTrigger } from "@/lib/useScrollTrigger";
import { Arrow } from "@/components/ui/Arrow";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SectionLabel } from "@/components/ui/SectionLabel";

export default function FinalCTA() {
  const root = useRef<HTMLElement>(null);

  useScrollTrigger(root, ({ scope, conditions }) => {
    if (conditions.reduced) return;
    revealLines(scope.querySelector<HTMLElement>("[data-title]")!, { stagger: 0.12, start: "top 85%" });
    scope.querySelectorAll("[data-cta-part]").forEach((part) => fadeUp(part, { delay: 0.2, start: "top 94%" }));
  });

  const mailto = `mailto:${site.email}?subject=${encodeURIComponent("Let’s grow together")}`;

  return (
    <section
      ref={root}
      id="contact"
      data-nav="signal"
      className="relative bg-signal px-5 pt-24 pb-28 text-ink md:px-10 md:pt-32 md:pb-36"
    >
      <SectionLabel index="07" dotClassName="bg-ink">
        Let’s talk
      </SectionLabel>

      <div className="mt-10 grid gap-12 md:grid-cols-12 md:items-end">
        <h2
          data-title
          className="text-[clamp(3.2rem,10.4vw,13rem)] leading-[0.86] font-bold tracking-tighter md:col-span-9"
        >
          {finalCta.title[0]}
          <br />
          {finalCta.title[1]}
          <br />
          {finalCta.title[2]}{" "}
          <em className="font-serif font-normal tracking-[-0.02em] italic">{finalCta.accent}</em>
        </h2>
        <div data-cta-part className="md:col-span-3 md:justify-self-end">
          <MagneticButton
            href={mailto}
            className="size-44 rounded-full bg-ink text-center text-lg leading-tight font-semibold text-paper md:size-[clamp(13rem,17vw,17rem)] md:text-xl"
            fillClassName="bg-paper"
            hoverColor="#0f0e0c"
            strength={0.4}
          >
            <span className="flex flex-col items-center gap-3 px-6">
              {finalCta.cta}
              <Arrow direction="up-right" className="text-3xl" />
            </span>
          </MagneticButton>
        </div>
      </div>

      <div className="mt-16 grid gap-8 md:mt-24 md:grid-cols-12 md:items-end">
        <p data-cta-part className="max-w-md text-xl leading-snug md:col-span-6 md:text-2xl">
          {finalCta.body}
        </p>
        <a
          data-cta-part
          href={`mailto:${site.email}`}
          className="self-start text-xl font-semibold tracking-[-0.02em] underline decoration-2 underline-offset-8 md:col-span-6 md:justify-self-end md:self-end md:text-3xl"
        >
          {site.email}
        </a>
      </div>

      <p
        data-cta-part
        className="mt-20 flex flex-wrap justify-between gap-3 border-t border-ink/25 pt-5 font-mono text-[0.68rem] tracking-[0.2em] uppercase md:mt-28"
      >
        <span>{site.legalName}</span>
        <span>{site.licence}</span>
        <span>{site.reach}</span>
      </p>
    </section>
  );
}
