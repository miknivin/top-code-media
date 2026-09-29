import { cn } from "@/lib/cn";

type Props = { index: string; children: React.ReactNode; className?: string; dotClassName?: string };

export function SectionLabel({ index, children, className, dotClassName = "bg-signal" }: Props) {
  return (
    <p className={cn("flex items-center gap-3 self-start font-mono text-[0.7rem] tracking-[0.2em] uppercase", className)}>
      <span aria-hidden className={cn("inline-block size-1.5 rounded-full", dotClassName)} />
      <span>({index})</span>
      <span>{children}</span>
    </p>
  );
}
