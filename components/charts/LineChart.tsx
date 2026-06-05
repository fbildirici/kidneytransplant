"use client";

export interface ChartSeries {
  key: string;
  label: string;
  color: string;
  unit: string;
}

interface DataPoint {
  label: string; // x-axis label e.g. "Mar 25"
  values: Record<string, number | undefined>;
}

interface LineChartProps {
  data: DataPoint[];
  series: ChartSeries[];
  height?: number;
  showNormalBands?: boolean;
  normalRanges?: Record<string, { min: number; max: number }>;
}

const PAD = { top: 28, right: 16, bottom: 44, left: 20 };

function formatLabel(date: string): string {
  const [year, month, day] = date.split("-");
  const months = ["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];
  if (!year || !month) return date;
  if (day) return `${parseInt(day)} ${months[parseInt(month) - 1]}`;
  return `${months[parseInt(month) - 1]} ${year.slice(2)}`;
}

export default function LineChart({ data, series, height = 260, normalRanges }: LineChartProps) {
  const W = 800;
  const H = height;
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const n = data.length;

  if (n === 0 || series.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
        Gösterilecek veri yok
      </div>
    );
  }

  // Normalize each series independently to [0, chartH]
  const seriesStats: Record<string, { min: number; max: number; range: number }> = {};
  series.forEach((s) => {
    const vals = data.map((d) => d.values[s.key]).filter((v): v is number => v !== undefined);
    if (vals.length === 0) return;
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const pad = (max - min) * 0.15 || 0.5;
    seriesStats[s.key] = { min: min - pad, max: max + pad, range: max - min + pad * 2 };
  });

  const xPos = (i: number) => PAD.left + (n === 1 ? chartW / 2 : (i / (n - 1)) * chartW);
  const yPos = (key: string, val: number) => {
    const st = seriesStats[key];
    if (!st) return PAD.top + chartH / 2;
    return PAD.top + chartH - ((val - st.min) / st.range) * chartH;
  };

  // Grid lines (5 horizontal)
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((t) => PAD.top + (1 - t) * chartH);

  // Build path for each series
  const buildPath = (key: string): string => {
    const points: { x: number; y: number }[] = [];
    data.forEach((d, i) => {
      const v = d.values[key];
      if (v !== undefined) points.push({ x: xPos(i), y: yPos(key, v) });
    });
    if (points.length < 2) return "";
    return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      style={{ height }}
      aria-label="Lab değerleri trend grafiği"
    >
      {/* Grid */}
      {gridLines.map((y, i) => (
        <line
          key={i}
          x1={PAD.left}
          x2={PAD.left + chartW}
          y1={y}
          y2={y}
          stroke="#e2e8f0"
          strokeWidth="1"
          strokeDasharray={i === 4 ? undefined : "4 3"}
        />
      ))}

      {/* X-axis labels */}
      {data.map((d, i) => {
        const x = xPos(i);
        const show = n <= 12 || i % Math.ceil(n / 12) === 0 || i === n - 1;
        return show ? (
          <text key={i} x={x} y={H - 8} textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="sans-serif">
            {formatLabel(d.label)}
          </text>
        ) : null;
      })}

      {/* Normal range bands */}
      {normalRanges && series.map((s) => {
        const nr = normalRanges[s.key];
        const st = seriesStats[s.key];
        if (!nr || !st) return null;
        const y1 = yPos(s.key, nr.max);
        const y2 = yPos(s.key, nr.min);
        if (y1 < PAD.top || y2 > PAD.top + chartH) return null;
        return (
          <rect
            key={`band-${s.key}`}
            x={PAD.left}
            y={Math.max(PAD.top, y1)}
            width={chartW}
            height={Math.min(PAD.top + chartH, y2) - Math.max(PAD.top, y1)}
            fill={s.color}
            opacity={0.06}
          />
        );
      })}

      {/* Series lines */}
      {series.map((s) => {
        const path = buildPath(s.key);
        if (!path) return null;
        return (
          <path
            key={`line-${s.key}`}
            d={path}
            fill="none"
            stroke={s.color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      })}

      {/* Data point dots + value labels */}
      {series.map((s) =>
        data.map((d, i) => {
          const v = d.values[s.key];
          if (v === undefined) return null;
          const x = xPos(i);
          const y = yPos(s.key, v);
          const isLast = i === n - 1;
          const showLabel = isLast || n <= 6 || i % Math.ceil(n / 6) === 0;
          return (
            <g key={`dot-${s.key}-${i}`}>
              <circle cx={x} cy={y} r="4" fill="white" stroke={s.color} strokeWidth="2" />
              {showLabel && (
                <text
                  x={x}
                  y={y - 8}
                  textAnchor="middle"
                  fontSize="9"
                  fill={s.color}
                  fontWeight="600"
                  fontFamily="sans-serif"
                >
                  {v % 1 === 0 ? v : v.toFixed(1)}
                </text>
              )}
            </g>
          );
        })
      )}

      {/* Legend */}
      {series.map((s, i) => {
        const lx = PAD.left + i * 160;
        const ly = PAD.top - 14;
        return (
          <g key={`legend-${s.key}`}>
            <line x1={lx} x2={lx + 16} y1={ly} y2={ly} stroke={s.color} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx={lx + 8} cy={ly} r="3" fill="white" stroke={s.color} strokeWidth="2" />
            <text x={lx + 22} y={ly + 4} fontSize="10" fill="#475569" fontFamily="sans-serif">
              {s.label} ({s.unit})
            </text>
          </g>
        );
      })}
    </svg>
  );
}
