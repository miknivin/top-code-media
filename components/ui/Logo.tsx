import { cn } from "@/lib/cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("shrink-0", className)}>
      <rect width="32" height="32" rx="9" fill="currentColor" />
      <path
        d="M8.5 11.5h10.5M13.75 11.5v11"
        stroke="var(--logo-cut, var(--color-paper))"
        strokeWidth="3.4"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="23.4" cy="11.5" r="2.7" fill="var(--color-signal)" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="size-8" />
      <span className="text-[1.05rem] font-bold leading-none tracking-[-0.04em]">
        Top Code <span className="font-light">Media</span>
      </span>
    </span>
  );
}
