export function ProcessStep({ index, title, body }: { index: number; title: string; body: string }) {
  return (
    <li
      data-step
      className="relative border-t border-paper/15 py-8 group-data-motion/proc:absolute group-data-motion/proc:inset-x-0 group-data-motion/proc:top-0 group-data-motion/proc:border-0 group-data-motion/proc:py-0"
    >
      <span
        aria-hidden
        className="absolute top-9 left-[calc(-1.5rem-5.5px)] size-2.5 rounded-full bg-signal ring-4 ring-ink group-data-motion/proc:hidden md:hidden"
      />
      <p className="font-mono text-[0.68rem] tracking-[0.2em] text-signal uppercase">
        Step {String(index + 1).padStart(2, "0")}
      </p>
      <h3 className="mt-3 text-[clamp(2.5rem,5.2vw,5.75rem)] leading-[0.9] font-bold tracking-[-0.042em]">{title}</h3>
      <p className="mt-5 max-w-md text-lg leading-snug text-paper/70">{body}</p>
    </li>
  );
}
