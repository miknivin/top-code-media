"use client";

import { useRef } from "react";
import { scale } from "@/content/site";
import { gsap, SplitText } from "@/lib/gsap";
import { useScrollTrigger } from "@/lib/useScrollTrigger";
import { SectionLabel } from "@/components/ui/SectionLabel";

const sizeSteps = [
  { text: "text-[clamp(1rem,1.3vw,1.3rem)]", dot: "size-2" },
  { text: "text-[clamp(1.35rem,2.1vw,2.2rem)]", dot: "size-3.5" },
  { text: "text-[clamp(1.8rem,3.2vw,3.4rem)]", dot: "size-6" },
];

export default function ScaleSection() {
  const root = useRef<HTMLElement>(null);

  useScrollTrigger(root, ({ scope, conditions }) => {
    if (conditions.reduced) return;
    scope.dataset.motion = "";

    const stage = scope.querySelector<HTMLElement>("[data-stage]")!;
    const word = scope.querySelector<HTMLElement>("[data-flex-word]")!;
    const dot = scope.querySelector<HTMLElement>("[data-dot]")!;
    const flood = scope.querySelector<HTMLElement>("[data-flood]")!;
    const leadWords = SplitText.create(scope.querySelector("[data-lead]"), { type: "words", aria: "none" }).words;

    // The flood grows out of the full stop, so its centre is wherever the dot sits.
    const circle = (grown: boolean) => () => {
      const box = stage.getBoundingClientRect();
      const d = dot.getBoundingClientRect();
      const x = d.left - box.left + d.width / 2;
      const y = d.top - box.top + d.height / 2;
      const radius = grown ? Math.hypot(Math.max(x, box.width - x), Math.max(y, box.height - y)) + 2 : d.width / 2;
      return `circle(${radius}px at ${x}px ${y}px)`;
    };

    // Measured lazily (no immediate render) so the dot has already moved to the widened
    // word's end, and re-measured after each refresh in case the layout changed.
    const floodIn = gsap.fromTo(
      flood,
      { clipPath: circle(false) },
      { clipPath: circle(true), duration: 1.3, ease: "power2.in", immediateRender: false },
    );

    // Not invalidateOnRefresh: that reverts the timeline and leaves staggered from() targets
    // visible until the playhead reaches them.
    gsap
      .timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () => `+=${window.innerHeight * (conditions.mobile ? 2 : 2.6)}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          refreshPriority: 10,
          onRefresh: () => floodIn.invalidate(),
        },
      })
      .from("[data-size]", { y: 50, autoAlpha: 0, duration: 0.5, stagger: 0.18, ease: "power3.out" }, 0)
      .from("[data-size-dot]", { scale: 0, duration: 0.4, stagger: 0.18, ease: "back.out(3)" }, 0.15)
      .fromTo(leadWords, { opacity: 0.45 }, { opacity: 1, duration: 0.25, stagger: 0.07 }, 0.35)
      .fromTo(
        word,
        { "--wght": 200, letterSpacing: "-0.08em", opacity: 0.45 },
        { "--wght": 800, letterSpacing: "-0.045em", opacity: 1, duration: 1, ease: "power2.inOut" },
        ">-0.2",
      )
      .from("[data-body]", { y: 30, autoAlpha: 0, duration: 0.4, ease: "power2.out" }, "<0.4")
      .to(dot, { scale: 1.8, duration: 0.25, ease: "power2.inOut" })
      .to(dot, { scale: 1, duration: 0.2, ease: "power2.in" })
      .add(floodIn)
      .to({}, { duration: 0.25 });

    return () => {
      delete scope.dataset.motion;
    };
  });

  return (
    <section ref={root} id="scale" data-nav="light" className="group/scale relative bg-paper">
      <div
        data-stage
        className="relative flex flex-col justify-center overflow-hidden bg-paper px-5 py-28 md:px-10 group-data-motion/scale:h-svh group-data-motion/scale:py-0"
      >
        <SectionLabel index="06">For every size</SectionLabel>

        <ul aria-label="Who we work with" className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-3 md:gap-x-12">
          {scale.sizes.map((size, i) => (
            <li
              key={size}
              data-size
              className={`flex items-center gap-3 font-semibold tracking-[-0.03em] ${sizeSteps[i].text}`}
            >
              <span data-size-dot aria-hidden className={`inline-block rounded-full bg-ink ${sizeSteps[i].dot}`} />
              {size}
            </li>
          ))}
        </ul>

        <h2 className="mt-8 font-bold tracking-[-0.045em]">
          <span data-lead className="block max-w-[16ch] text-[clamp(2.4rem,5.6vw,6.5rem)] leading-[0.92]">
            {scale.lead.join(" ")}
          </span>
          <span className="block text-[clamp(5.5rem,min(21vw,34svh),22rem)] leading-[0.82] whitespace-nowrap">
            <span data-flex-word className="flex-word inline-block">
              {scale.word}
            </span>
            <span
              data-dot
              aria-hidden
              className="ml-[0.03em] inline-block size-[0.17em] rounded-full bg-signal align-baseline"
            />
          </span>
        </h2>

        <p data-body className="mt-8 max-w-xl text-lg leading-snug text-ink/70 md:text-xl">
          {scale.body}
        </p>

        <div
          data-flood
          data-nav="signal"
          aria-hidden
          className="absolute inset-0 hidden bg-signal group-data-motion/scale:block"
          style={{ clipPath: "circle(0px at 50% 50%)" }}
        />
      </div>
    </section>
  );
}
