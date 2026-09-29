import { cn } from "@/lib/cn";

type Direction = "right" | "down" | "up-right" | "up";

const rotation: Record<Direction, string> = {
  right: "",
  down: "rotate-90",
  "up-right": "-rotate-45",
  up: "-rotate-90",
};

export function Arrow({ direction = "right", className }: { direction?: Direction; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("size-[1em] shrink-0", rotation[direction], className)}>
      <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
