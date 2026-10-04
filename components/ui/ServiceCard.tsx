import type { CSSProperties } from "react";
import type { CardTheme, services } from "@/content/site";
import { cn } from "@/lib/cn";
import { ServiceArt } from "./ServiceArt";

type Service = (typeof services)[number];

const themes: Record<CardTheme, { className: string; vars: Record<string, string> }> = {
  ink: {
    className: "bg-ink text-paper",
    vars: { "--accent": "var(--color-signal)", "--card-bg": "var(--color-ink)" },
  },
  signal: {
    className: "bg-signal text-paper",
    vars: { "--accent": "var(--color-ink)", "--card-bg": "var(--color-signal)" },
  },
  sand: {
    className: "bg-sand text-ink",
    vars: { "--accent": "var(--color-signal)", "--card-bg": "var(--color-sand)" },
  },
  white: {
    className: "bg-bone text-ink ring-1 ring-ink/10 ring-inset",
    vars: { "--accent": "var(--color-signal)", "--card-bg": "var(--color-bone)" },
  },
};

export function ServiceCard({ service, index }: { service: Service; index: number }) {
  const theme = themes[service.theme];
  return (
    <article
      data-card
      style={theme.vars as CSSProperties}
      className={cn(
        "relative flex shrink-0 flex-col rounded-[1.75rem] p-6 md:p-7",
        "group-data-rail/svc:h-[min(76svh,44rem)] group-data-rail/svc:w-[clamp(21rem,29vw,29rem)]",
        theme.className,
      )}
    >
      <header className="flex items-center justify-between font-mono text-[0.68rem] tracking-[0.2em] uppercase">
        <span>S—{String(index + 1).padStart(2, "0")}</span>
        <span>{service.kicker}</span>
      </header>

      <div data-art className="my-6 grid aspect-[3/2] place-items-center group-data-rail/svc:my-4 group-data-rail/svc:aspect-auto group-data-rail/svc:min-h-0 group-data-rail/svc:flex-1">
        <ServiceArt kind={service.art} className="h-full max-h-56 w-full" />
      </div>

      <h3 className="text-[clamp(1.8rem,2.3vw,2.5rem)] leading-[0.95] font-bold tracking-[-0.04em] text-balance">
        {service.title}
      </h3>
      <p className="mt-4 text-[0.95rem] leading-relaxed opacity-90">{service.body}</p>
      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Includes">
        {service.tags.map((tag) => (
          <li key={tag} className="rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-current/25">
            {tag}
          </li>
        ))}
      </ul>
    </article>
  );
}
