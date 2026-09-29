import type { ServiceArtKind } from "@/content/site";

/*
 * Line illustrations for the service cards. Parts are tagged for the animator:
 *   data-a="draw"   stroke draws on (needs pathLength="1")
 *   data-a="grow"   scales up from the baseline
 *   data-a="grow-x" scales out from the left
 *   data-a="pop"    springs in from its centre
 *   data-a="fade"   fades up
 * Colours: currentColor for line work, --accent for highlights, --card-bg to knock out.
 */

const mono = { className: "font-mono", fontSize: 10, fill: "currentColor", stroke: "none" } as const;

function Chip({ x, y, w, label }: { x: number; y: number; w: number; label: string }) {
  return (
    <g data-a="fade">
      <rect x={x} y={y} width={w} height={22} rx={11} strokeOpacity={0.45} />
      <text x={x + w / 2} y={y + 14.5} textAnchor="middle" {...mono}>
        {label}
      </text>
    </g>
  );
}

function Performance() {
  const bars = [30, 44, 38, 62, 80, 106];
  return (
    <>
      <path data-a="fade" d="M20 100H220M20 60H220" strokeOpacity={0.15} />
      {bars.map((h, i) => (
        <rect
          key={i}
          data-a="grow"
          x={32 + i * 30}
          y={140 - h}
          width={18}
          height={h}
          rx={2}
          stroke="none"
          fill={i === bars.length - 1 ? "var(--accent)" : "currentColor"}
          fillOpacity={i === bars.length - 1 ? 1 : 0.16}
        />
      ))}
      <path data-a="draw" pathLength={1} d="M20 140H222" />
      <path
        data-a="draw"
        pathLength={1}
        d="M41 104C60 98 80 90 101 86S140 66 161 48S196 22 212 15"
        stroke="var(--accent)"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <circle data-a="pop" cx={212} cy={15} r={5} fill="var(--accent)" stroke="none" />
      <Chip x={22} y={14} w={62} label="ROAS ↑" />
    </>
  );
}

function Paid() {
  return (
    <>
      {[62, 44, 26].map((r) => (
        <circle key={r} data-a="draw" pathLength={1} cx={112} cy={82} r={r} />
      ))}
      <path data-a="draw" pathLength={1} d="M112 6v22M112 136v22M36 82h22M166 82h22" />
      <circle data-a="pop" cx={112} cy={82} r={11} fill="var(--accent)" stroke="none" />
      <g data-a="pop">
        <path d="M146 100v40l10-9 8 17 8-3.5-8-17 13.5-1z" fill="currentColor" stroke="none" />
      </g>
      <Chip x={176} y={20} w={56} label="CPC ↓" />
      <Chip x={8} y={124} w={56} label="CTR ↑" />
    </>
  );
}

function Organic() {
  const rows = [58, 88, 118];
  return (
    <>
      <rect data-a="draw" pathLength={1} x={16} y={12} width={208} height={30} rx={15} />
      <g data-a="pop">
        <circle cx={35} cy={26} r={6} />
        <path d="M39.5 30.5l4.5 4.5" strokeLinecap="round" />
      </g>
      <rect data-a="grow-x" x={54} y={24} width={84} height={6} rx={3} fill="currentColor" fillOpacity={0.55} stroke="none" />
      <rect data-a="fade" x={16} y={52} width={208} height={28} rx={6} fill="var(--accent)" stroke="none" />
      {rows.map((y, i) => (
        <g key={y}>
          <text x={28} y={y + 11} {...mono} fontSize={11}>
            {i + 1}
          </text>
          <rect data-a="grow-x" x={44} y={y + 2} width={124 - i * 18} height={5} rx={2.5} fill="currentColor" stroke="none" />
          <rect data-a="grow-x" x={44} y={y + 11} width={84 - i * 10} height={4} rx={2} fill="currentColor" fillOpacity={0.35} stroke="none" />
        </g>
      ))}
      <path
        data-a="draw"
        pathLength={1}
        d="M204 146V100M195 109l9-9 9 9"
        stroke="var(--accent)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  );
}

function Social() {
  const nodes: [number, number][] = [
    [46, 38],
    [40, 124],
    [120, 16],
    [196, 44],
    [200, 128],
    [124, 146],
  ];
  return (
    <>
      {nodes.map(([x, y]) => (
        <path key={`l${x}`} data-a="draw" pathLength={1} d={`M120 82L${x} ${y}`} strokeOpacity={0.5} />
      ))}
      <path data-a="draw" pathLength={1} d="M46 38L120 16L196 44M40 124L124 146L200 128" strokeOpacity={0.25} />
      {nodes.map(([x, y], i) => (
        <g key={`n${x}`} data-a="pop">
          <circle cx={x} cy={y} r={i % 2 ? 8 : 10} fill="var(--card-bg)" />
          <circle cx={x} cy={y} r={2.5} fill="currentColor" stroke="none" />
        </g>
      ))}
      <g data-a="pop">
        <circle cx={120} cy={82} r={22} fill="var(--accent)" stroke="none" />
        <path
          d="M120 92.5s-10-6.2-10-12.6a5.4 5.4 0 0 1 10-2.9 5.4 5.4 0 0 1 10 2.9c0 6.4-10 12.6-10 12.6z"
          fill="var(--card-bg)"
          stroke="none"
        />
      </g>
      <g data-a="fade">
        <path d="M154 60h44a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6h-30l-8 7v-7h-6a6 6 0 0 1-6-6V66a6 6 0 0 1 6-6z" fill="var(--card-bg)" />
        {[166, 176, 186].map((x) => (
          <circle key={x} cx={x} cy={72} r={2} fill="currentColor" stroke="none" />
        ))}
      </g>
    </>
  );
}

function Content() {
  return (
    <>
      <circle data-a="draw" pathLength={1} cx={80} cy={76} r={48} />
      <g transform="rotate(12 150 70)">
        <rect data-a="pop" x={118} y={38} width={64} height={64} rx={8} fill="var(--accent)" stroke="none" />
      </g>
      <path data-a="draw" pathLength={1} d="M156 146l38-66 38 66z" strokeLinejoin="round" />
      <path
        data-a="draw"
        pathLength={1}
        d="M10 140c22-22 42 10 64-8s40-14 58 4"
        strokeWidth={2.5}
        strokeLinecap="round"
        stroke="var(--accent)"
      />
      <g data-a="pop">
        <circle cx={80} cy={76} r={17} fill="currentColor" stroke="none" />
        <path d="M75 67.5v17l14-8.5z" fill="var(--card-bg)" stroke="none" />
      </g>
    </>
  );
}

function Web() {
  return (
    <>
      <rect data-a="draw" pathLength={1} x={14} y={10} width={212} height={140} rx={10} />
      <path data-a="draw" pathLength={1} d="M14 32H226" />
      {[28, 40, 52].map((x) => (
        <circle key={x} data-a="pop" cx={x} cy={21} r={3.5} fill="currentColor" stroke="none" />
      ))}
      <rect data-a="grow-x" x={28} y={46} width={112} height={11} rx={3} fill="currentColor" stroke="none" />
      <rect data-a="grow-x" x={28} y={63} width={86} height={6} rx={3} fill="currentColor" fillOpacity={0.4} stroke="none" />
      <rect data-a="grow-x" x={28} y={74} width={96} height={6} rx={3} fill="currentColor" fillOpacity={0.4} stroke="none" />
      <rect data-a="pop" x={28} y={90} width={58} height={18} rx={9} fill="var(--accent)" stroke="none" />
      <rect data-a="fade" x={152} y={44} width={60} height={64} rx={6} fill="currentColor" fillOpacity={0.12} stroke="none" />
      {[28, 90, 152].map((x) => (
        <rect key={x} data-a="fade" x={x} y={120} width={58} height={18} rx={4} strokeOpacity={0.45} />
      ))}
      <g data-a="pop">
        <path d="M74 100v22l6-5 5 10 4-2-5-10h8z" fill="currentColor" stroke="var(--card-bg)" strokeWidth={1.5} />
      </g>
    </>
  );
}

const art: Record<ServiceArtKind, () => React.JSX.Element> = {
  performance: Performance,
  paid: Paid,
  organic: Organic,
  social: Social,
  content: Content,
  web: Web,
};

export function ServiceArt({ kind, className }: { kind: ServiceArtKind; className?: string }) {
  const Art = art[kind];
  return (
    <svg viewBox="0 0 240 160" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth={1.5}>
      <Art />
    </svg>
  );
}
