"use client";

import { useRef } from "react";
import { services } from "@/content/site";
import { artTimeline, fadeUp, revealLines } from "@/lib/animations";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useScrollTrigger } from "@/lib/useScrollTrigger";
import { Arrow } from "@/components/ui/Arrow";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ServiceCard } from "@/components/ui/ServiceCard";

export default function Services() {
  const root = useRef<HTMLElement>(null);

  useScrollTrigger(root, ({ scope, conditions }) => {
    if (conditions.reduced) return;
    const cards = gsap.utils.toArray<HTMLElement>("[data-card]", scope);
    const arts = cards.map((card) => artTimeline(card.querySelector("[data-art]")!));

    revealLines(scope.querySelector<HTMLElement>("[data-title]")!);
    fadeUp("[data-intro-copy]", { stagger: 0.1, delay: 0.2 });

    if (conditions.mobile) {
      cards.forEach((card, i) => {
        gsap.from(card, { y: 80, autoAlpha: 0, duration: 1.2, scrollTrigger: { trigger: card, start: "top 90%", once: true } });
        ScrollTrigger.create({ trigger: card, start: "top 65%", once: true, onEnter: () => arts[i].play() });
      });
      return;
    }

    scope.dataset.rail = "";
    const pin = scope.querySelector<HTMLElement>("[data-pin]")!;
    const track = scope.querySelector<HTMLElement>("[data-track]")!;
    const bar = scope.querySelector<HTMLElement>("[data-bar]")!;
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

    const rail = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: scope,
        start: "top top",
        end: () => `+=${distance()}`,
        pin,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: 30,
      },
    });
    rail.to(track, { x: () => -distance() }, 0).fromTo(bar, { scaleX: 0 }, { scaleX: 1, transformOrigin: "0% 50%" }, 0);

    const cleanups: (() => void)[] = [];
    cards.forEach((card, i) => {
      // Cards arrive tilted like a dealt hand and settle as they reach the middle.
      gsap.fromTo(
        card,
        { yPercent: 12, rotation: 6 },
        {
          yPercent: 0,
          rotation: 0,
          ease: "none",
          scrollTrigger: { trigger: card, containerAnimation: rail, start: "left 100%", end: "left 50%", scrub: true },
        },
      );
      ScrollTrigger.create({
        trigger: card,
        containerAnimation: rail,
        start: "left 75%",
        onEnter: () => arts[i].play(),
        onLeaveBack: () => arts[i].reverse(),
      });
      const replay = () => !arts[i].isActive() && arts[i].progress() === 1 && arts[i].restart();
      card.addEventListener("pointerenter", replay);
      cleanups.push(() => card.removeEventListener("pointerenter", replay));
    });

    return () => {
      cleanups.forEach((fn) => fn());
      delete scope.dataset.rail;
    };
  });

  return (
    <section ref={root} id="services" data-nav="light" className="group/svc relative bg-paper">
      <div
        data-pin
        className="relative px-5 pb-28 md:px-10 group-data-rail/svc:h-svh group-data-rail/svc:overflow-hidden group-data-rail/svc:px-0 group-data-rail/svc:pb-0"
      >
        <div
          data-track
          className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 group-data-rail/svc:flex group-data-rail/svc:h-full group-data-rail/svc:w-max group-data-rail/svc:items-center group-data-rail/svc:gap-6 group-data-rail/svc:px-10 group-data-rail/svc:will-change-transform"
        >
          <header className="flex flex-col justify-center pt-4 pb-10 md:col-span-2 xl:col-span-3 group-data-rail/svc:w-[36vw] group-data-rail/svc:shrink-0 group-data-rail/svc:pr-12 group-data-rail/svc:pb-0">
            <SectionLabel index="03">What we do</SectionLabel>
            <h2
              data-title
              className="mt-8 text-[clamp(2.8rem,5.8vw,7rem)] leading-[0.9] font-bold tracking-[-0.042em]"
            >
              Six ways we <em className="font-serif font-normal tracking-[-0.02em] text-signal italic">grow</em> your
              business.
            </h2>
            <p data-intro-copy className="mt-6 max-w-sm text-lg leading-snug text-ink/70">
              One team for every channel that matters. Pick a single service or plug into the whole growth engine.
            </p>
            <p
              data-intro-copy
              className="mt-10 hidden items-center gap-3 font-mono text-[0.68rem] tracking-[0.2em] uppercase group-data-rail/svc:flex"
            >
              Keep scrolling <Arrow className="text-signal" />
            </p>
          </header>

          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}

          <aside className="flex flex-col justify-center gap-6 rounded-[1.75rem] bg-bone p-8 ring-1 ring-ink/10 ring-inset md:col-span-2 xl:col-span-3 group-data-rail/svc:h-[min(76svh,44rem)] group-data-rail/svc:w-[28vw] group-data-rail/svc:shrink-0 group-data-rail/svc:bg-transparent group-data-rail/svc:ring-0">
            <p className="text-[clamp(2rem,3vw,3.25rem)] leading-[0.95] font-bold tracking-[-0.045em]">
              Not sure where to start?
            </p>
            <p className="max-w-xs text-ink/70">
              Tell us the goal. We’ll recommend the mix that gets you there, even if it’s smaller than you expected.
            </p>
            <MagneticButton
              href="#contact"
              className="self-start rounded-full bg-ink px-6 py-3.5 font-semibold text-paper"
              hoverColor="#0f0e0c"
            >
              Get a recommendation <Arrow />
            </MagneticButton>
          </aside>
        </div>

        <div aria-hidden className="absolute inset-x-10 bottom-8 hidden h-px bg-ink/15 group-data-rail/svc:block">
          <div data-bar className="h-full bg-ink" />
        </div>
      </div>
    </section>
  );
}
