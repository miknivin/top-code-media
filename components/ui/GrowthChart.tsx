export const CHART = { width: 600, height: 400, baseline: 352 };

/** One point per process step, climbing faster as the process compounds. */
export const chartPoints: [number, number][] = [
  [40, 318],
  [144, 296],
  [248, 256],
  [352, 196],
  [456, 128],
  [560, 40],
];

/** Catmull-Rom through every point, written out as cubic Béziers. */
function smoothPath(points: [number, number][]) {
  const at = (i: number) => points[Math.max(0, Math.min(points.length - 1, i))];
  let d = `M${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0]} ${p2[1]}`;
  }
  return d;
}

const curve = smoothPath(chartPoints);
const area = `${curve} L${chartPoints[chartPoints.length - 1][0]} ${CHART.baseline} L${chartPoints[0][0]} ${CHART.baseline}Z`;

export function GrowthChart({ className }: { className?: string }) {
  const [endX, endY] = chartPoints[chartPoints.length - 1];
  return (
    <svg
      viewBox={`0 0 ${CHART.width} ${CHART.height}`}
      className={className}
      role="img"
      aria-label="A growth curve rising through six steps: Understand, Strategize, Create, Launch, Optimize and Scale."
    >
      <defs>
        <linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--color-signal)" stopOpacity="0.45" />
          <stop offset="1" stopColor="var(--color-signal)" stopOpacity="0" />
        </linearGradient>
        <clipPath id="chart-reveal">
          <rect data-area-clip x="0" y="0" width={CHART.width} height={CHART.height} />
        </clipPath>
      </defs>

      <g stroke="currentColor" strokeOpacity="0.12">
        {[40, 118, 196, 274].map((y) => (
          <path key={y} d={`M24 ${y}H${CHART.width - 16}`} />
        ))}
        {chartPoints.map(([x]) => (
          <path key={x} d={`M${x} 24V${CHART.baseline}`} strokeDasharray="3 6" />
        ))}
      </g>
      <path d={`M24 ${CHART.baseline}H${CHART.width - 16}`} stroke="currentColor" strokeOpacity="0.4" />

      <text x="24" y="16" className="fill-current font-mono text-[11px] tracking-[0.2em] uppercase" opacity="0.55">
        Growth ↑
      </text>

      <path d={area} fill="url(#chart-fill)" clipPath="url(#chart-reveal)" />
      <path
        data-curve
        d={curve}
        pathLength={1}
        fill="none"
        stroke="var(--color-signal)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {chartPoints.map(([x, y], i) => (
        <g key={x}>
          <circle data-point cx={x} cy={y} r="6.5" fill="var(--color-signal)" stroke="var(--color-ink)" strokeWidth="3" />
          <text x={x} y={CHART.baseline + 26} textAnchor="middle" className="font-mono text-[13px]" fill="var(--color-signal-soft)">
            0{i + 1}
          </text>
        </g>
      ))}

      <g data-head transform={`translate(${endX} ${endY})`}>
        <circle r="24" fill="var(--color-signal)" opacity="0.18" />
        <circle r="10" fill="var(--color-signal)" />
      </g>
    </svg>
  );
}
