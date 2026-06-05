"use client";

import { useMemo, useState } from "react";
import LineChart, { ChartSeries } from "@/components/charts/LineChart";
import { LAB_METRIC_DEFINITIONS, LabDataPoint, LabMetricKey } from "@/lib/store";
import { Activity, Filter } from "lucide-react";

interface LabTrendExplorerProps {
  title: string;
  subtitle: string;
  points: LabDataPoint[];
  defaultMetrics?: LabMetricKey[];
  accent?: string;
}

export default function LabTrendExplorer({
  title,
  subtitle,
  points,
  defaultMetrics = ["creatinine", "gfr", "tacrolimus"],
  accent = "teal",
}: LabTrendExplorerProps) {
  const [selectedMetrics, setSelectedMetrics] = useState<LabMetricKey[]>(defaultMetrics);

  const series = useMemo<ChartSeries[]>(
    () =>
      LAB_METRIC_DEFINITIONS.filter((metric) => selectedMetrics.includes(metric.key)).map((metric) => ({
        key: metric.key,
        label: metric.label,
        color: metric.color,
        unit: metric.unit,
      })),
    [selectedMetrics]
  );

  const normalRanges = useMemo(
    () =>
      LAB_METRIC_DEFINITIONS.filter((metric) => selectedMetrics.includes(metric.key)).reduce<Record<string, { min: number; max: number }>>(
        (acc, metric) => {
          acc[metric.key] = { min: metric.normalMin, max: metric.normalMax };
          return acc;
        },
        {}
      ),
    [selectedMetrics]
  );

  const chartData = useMemo(
    () =>
      points.map((point) => ({
        label: point.date,
        values: selectedMetrics.reduce<Record<string, number | undefined>>((acc, metricKey) => {
          acc[metricKey] = point[metricKey];
          return acc;
        }, {}),
      })),
    [points, selectedMetrics]
  );

  const latestPoint = points.at(-1);
  const cardMetrics = selectedMetrics.slice(0, 4);

  const accentClass =
    accent === "emerald"
      ? "text-emerald-600 bg-emerald-50 border-emerald-200"
      : accent === "navy"
        ? "text-navy-600 bg-navy-50 border-navy-200"
        : "text-teal-600 bg-teal-50 border-teal-200";

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-bold text-slate-900">{title}</p>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {LAB_METRIC_DEFINITIONS.map((metric) => {
            const active = selectedMetrics.includes(metric.key);
            return (
              <button
                key={metric.key}
                type="button"
                onClick={() =>
                  setSelectedMetrics((prev) =>
                    prev.includes(metric.key)
                      ? prev.length === 1
                        ? prev
                        : prev.filter((key) => key !== metric.key)
                      : [...prev, metric.key]
                  )
                }
                className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                  active ? accentClass : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Filter size={12} />
                  {metric.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cardMetrics.map((metricKey) => {
          const metric = LAB_METRIC_DEFINITIONS.find((item) => item.key === metricKey);
          if (!metric) return null;
          return (
            <div key={metric.key} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{metric.label}</p>
              <p className="mt-1 text-2xl font-black text-slate-900">
                {latestPoint?.[metric.key] !== undefined ? latestPoint[metric.key]?.toFixed(metric.key === "gfr" ? 0 : 1) : "-"}
              </p>
              <p className="text-xs text-slate-400">{metric.unit}</p>
            </div>
          );
        })}
      </div>

      {points.length > 0 ? (
        <LineChart data={chartData} series={series} normalRanges={normalRanges} />
      ) : (
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-12 text-sm text-slate-400">
          <span className="flex items-center gap-2">
            <Activity size={16} />
            Gösterilecek laboratuvar verisi yok
          </span>
        </div>
      )}
    </div>
  );
}
