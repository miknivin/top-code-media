import type { ResultIconKind } from "@/content/site";

const paths: Record<ResultIconKind, string[]> = {
  reach: ["M8.2 8.2a5.4 5.4 0 0 0 0 7.6M15.8 8.2a5.4 5.4 0 0 1 0 7.6", "M5.3 5.3a9.5 9.5 0 0 0 0 13.4M18.7 5.3a9.5 9.5 0 0 1 0 13.4"],
  engage: [
    "M4 4.5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-9.5L6 20v-3.5H4a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1z",
    "M12 13.6s-3.1-1.8-3.1-3.9a1.7 1.7 0 0 1 3.1-1 1.7 1.7 0 0 1 3.1 1c0 2.1-3.1 3.9-3.1 3.9z",
  ],
  leads: ["M3 4h18l-7 8.2v6.3l-4 2v-8.3z"],
  convert: ["M5 8.5h14l-1.2 11.5H6.2z", "M9 8.5V7a3 3 0 0 1 6 0v1.5", "M9.3 14.3l2 2 3.6-4"],
  repeat: ["M4.5 11a7.5 7.5 0 0 1 13-4.2l1.8 1.8M19.3 4v4.6h-4.6", "M19.5 13a7.5 7.5 0 0 1-13 4.2l-1.8-1.8M4.7 20v-4.6h4.6"],
  growth: ["M3 17.5l6-6 4 4 8-8", "M15.5 7.5H21V13"],
};

export function ResultIcon({ kind, className }: { kind: ResultIconKind; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {kind === "reach" && <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />}
      {paths[kind].map((d) => (
        <path key={d} data-icon-path d={d} pathLength={1} />
      ))}
    </svg>
  );
}
