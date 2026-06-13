"use client";

import { useMemo, useState } from "react";
import LabImportPanel from "@/components/labs/LabImportPanel";
import LabTrendExplorer from "@/components/labs/LabTrendExplorer";
import { getLabImportHistory, getLabData, getPatient, LAB_METRIC_DEFINITIONS } from "@/lib/store";
import type { LabDataPoint, LabMetricKey } from "@/lib/store";
import { Activity, FileText, FileUp, TrendingUp, TrendingDown, Minus, Shield, Info } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import PageTitle from "@/components/PageTitle";

const PATIENT_ID = "1";

// Key metrics to show as summary cards
const KEY_METRICS: LabMetricKey[] = ["creatinine", "gfr", "tacrolimus", "potassium"];

interface MetricSummary {
  key: LabMetricKey;
  label: string;
  unit: string;
  lastValue: number | null;
  prevValue: number | null;
  lastDate: string | null;
  normalMin: number;
  normalMax: number;
  description: string;
  higherIsBetter?: boolean;
}

function getLastTwo(points: LabDataPoint[], key: LabMetricKey): [number | null, number | null, string | null] {
  const filtered = points
    .filter((p) => p[key] !== undefined && p[key] !== null)
    .sort((a, b) => (a.date > b.date ? -1 : 1));
  const last = filtered[0];
  const prev = filtered[1];
  return [
    last ? (last[key] as number) : null,
    prev ? (prev[key] as number) : null,
    last ? last.date : null,
  ];
}

function getStatus(value: number, min: number, max: number, higherIsBetter?: boolean): "normal" | "low" | "high" {
  if (value < min) return higherIsBetter ? "low" : "low";
  if (value > max) return higherIsBetter ? "high" : "high";
  return "normal";
}

export default function PatientLabsPage() {
  const patient = getPatient(PATIENT_ID);
  const [refreshKey, setRefreshKey] = useState(0);
  const points = useMemo(() => getLabData(PATIENT_ID), [refreshKey]);
  const history = useMemo(() => getLabImportHistory(PATIENT_ID).slice(0, 5), [refreshKey]);

  const metricSummaries: MetricSummary[] = useMemo(() => {
    return KEY_METRICS.map((key) => {
      const def = LAB_METRIC_DEFINITIONS.find((d) => d.key === key)!;
      const [lastValue, prevValue, lastDate] = getLastTwo(points, key);
      return {
        key,
        label: def.label,
        unit: def.unit,
        lastValue,
        prevValue,
        lastDate,
        normalMin: def.normalMin,
        normalMax: def.normalMax,
        description: def.description,
        higherIsBetter: def.higherIsBetter,
      };
    });
  }, [points]);

  const hasAnyData = metricSummaries.some((m) => m.lastValue !== null);

  return (
    <>
      <PageTitle title="Laboratuvar" />
      <div className="space-y-6 max-w-7xl mx-auto">

        {/* ===== HEADER ===== */}
        <div className="bg-surface rounded-[var(--radius-xl)] border border-border p-5 sm:p-6 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-navy-600 uppercase tracking-widest mb-1">Laboratuvar</p>
              <h1 className="text-xl sm:text-2xl font-semibold text-text-primary mb-1">
                Laboratuvar Sonuçları
              </h1>
              <p className="text-sm text-text-secondary max-w-lg">
                Kreatinin, eGFR, Tacrolimus ve diğer değerlerinizi zamana göre takip edin.
                Sonuçlarınızı her zaman doktorunuzla değerlendirin.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
            </div>
          </div>

          {/* Safety note */}
          <div className="mt-4 flex items-start gap-2 bg-info-50 border border-info-200 rounded-[var(--radius-lg)] px-4 py-3">
            <Shield size={14} className="text-info-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-info-700 leading-relaxed">
              Laboratuvar sonuçları yalnızca takip amaçlıdır. Değerlerin yorumu ve tedavi kararları doktorunuza aittir.
              Referans aralıkları genel rehber niteliğindedir; bireysel hedefleriniz farklılık gösterebilir.
            </p>
          </div>
        </div>

        {/* ===== KEY METRIC CARDS ===== */}
        {hasAnyData ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {metricSummaries.map((metric) => {
              const hasData = metric.lastValue !== null;
              if (!hasData) {
                return (
                  <div key={metric.key} className="bg-surface rounded-[var(--radius-xl)] border border-border p-5">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">{metric.label}</p>
                    <p className="text-sm text-text-muted">Veri yok</p>
                    <p className="text-xs text-text-muted mt-1">{metric.unit}</p>
                  </div>
                );
              }

              const status = getStatus(metric.lastValue!, metric.normalMin, metric.normalMax, metric.higherIsBetter);
              const change = metric.prevValue !== null ? metric.lastValue! - metric.prevValue : null;
              const changePercent = metric.prevValue ? Math.abs((change! / metric.prevValue) * 100).toFixed(1) : null;

              const statusConfig = {
                normal: {
                  bg: "bg-success-50",
                  border: "border-success-200",
                  label: "Hedef aralıkta",
                  labelColor: "text-success-700",
                  valueColor: "text-success-700",
                },
                high: {
                  bg: "bg-warning-50",
                  border: "border-warning-200",
                  label: "Yüksek — doktorla değerlendirin",
                  labelColor: "text-warning-700",
                  valueColor: "text-warning-700",
                },
                low: {
                  bg: metric.higherIsBetter ? "bg-warning-50" : "bg-info-50",
                  border: metric.higherIsBetter ? "border-warning-200" : "border-info-200",
                  label: metric.higherIsBetter ? "Düşük — doktorla değerlendirin" : "Düşük — doktorla değerlendirin",
                  labelColor: metric.higherIsBetter ? "text-warning-700" : "text-info-700",
                  valueColor: metric.higherIsBetter ? "text-warning-700" : "text-info-700",
                },
              }[status];

              return (
                <div key={metric.key} className={`${statusConfig.bg} border ${statusConfig.border} rounded-[var(--radius-xl)] p-5`}>
                  <div className="flex items-start justify-between mb-3">
                    <p className={`text-xs font-semibold uppercase tracking-wide ${statusConfig.labelColor} opacity-70`}>
                      {metric.label}
                    </p>
                    {change !== null && (
                      <div className="flex items-center gap-0.5">
                        {change > 0 ? (
                          <TrendingUp size={13} className={statusConfig.labelColor} />
                        ) : change < 0 ? (
                          <TrendingDown size={13} className={statusConfig.labelColor} />
                        ) : (
                          <Minus size={13} className={statusConfig.labelColor} />
                        )}
                        <span className={`text-[10px] font-semibold ${statusConfig.labelColor}`}>
                          {change > 0 ? "+" : ""}{changePercent}%
                        </span>
                      </div>
                    )}
                  </div>

                  <p className={`text-3xl font-bold tabular-nums ${statusConfig.valueColor} mb-0.5`}>
                    {metric.lastValue}
                  </p>
                  <p className={`text-xs ${statusConfig.labelColor} opacity-70 mb-3`}>{metric.unit}</p>

                  <div className="space-y-1">
                    <p className={`text-[10px] font-medium ${statusConfig.labelColor} opacity-60`}>
                      Ref: {metric.normalMin}–{metric.normalMax} {metric.unit}
                    </p>
                    {metric.lastDate && (
                      <p className={`text-[10px] ${statusConfig.labelColor} opacity-50`}>
                        {new Date(metric.lastDate).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    )}
                    <p className={`text-[10px] font-medium ${statusConfig.labelColor} opacity-80 pt-1`}>
                      {statusConfig.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-surface rounded-[var(--radius-xl)] border border-border p-8 text-center">
            <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-surface-muted flex items-center justify-center mx-auto mb-3">
              <Activity size={22} className="text-text-muted" />
            </div>
            <p className="text-sm font-semibold text-text-primary mb-1">Henüz laboratuvar sonucu eklenmedi</p>
            <p className="text-xs text-text-secondary max-w-xs mx-auto">
              İlk sonucu yükleyerek trend takibine başlayabilirsiniz. e-Nabız'dan yapıştırmak veya PDF yüklemek en hızlı yöntemdir.
            </p>
          </div>
        )}

        {/* ===== IMPORT PANEL ===== */}
        <LabImportPanel
          patientId={PATIENT_ID}
          patientName={patient?.name ?? "Hasta"}
          importedBy={patient?.name ?? "Hasta"}
          onImported={() => setRefreshKey((value) => value + 1)}
        />

        {/* ===== TREND + HISTORY ===== */}
        <div className="grid gap-6 xl:grid-cols-[1.4fr,0.6fr]">
          <LabTrendExplorer
            title="Kişisel Laboratuvar Trendleri"
            subtitle="Tüm yeni sonuçlar doktor ve diyetisyen panellerine de yansır."
            points={points}
            defaultMetrics={["creatinine", "gfr", "tacrolimus", "potassium"]}
            accent="navy"
          />

          <div className="space-y-4">
            {/* Reference ranges info */}
            <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-5">
              <div className="flex items-center gap-2 mb-4">
                <Info size={15} className="text-navy-600" />
                <p className="text-sm font-semibold text-text-primary">Referans Aralıkları</p>
              </div>
              <div className="space-y-2">
                {KEY_METRICS.map((key) => {
                  const def = LAB_METRIC_DEFINITIONS.find((d) => d.key === key)!;
                  return (
                    <div key={key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <p className="text-xs font-semibold text-text-primary">{def.label}</p>
                        <p className="text-[10px] text-text-muted">{def.description}</p>
                      </div>
                      <span className="text-xs font-mono text-text-secondary tabular-nums">
                        {def.normalMin}–{def.normalMax} {def.unit}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-text-muted mt-3 leading-relaxed">
                Bu aralıklar genel rehber niteliğindedir. Bireysel hedefleriniz doktorunuz tarafından belirlenir.
              </p>
            </div>

            {/* Recent reports */}
            <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-5">
              <div className="flex items-center gap-2 mb-4">
                <FileText size={15} className="text-navy-600" />
                <p className="text-sm font-semibold text-text-primary">Son Yüklenen Raporlar</p>
              </div>

              <div className="space-y-3">
                {history.length === 0 ? (
                  <EmptyState
                    icon={FileUp}
                    title="Henüz rapor yüklenmedi"
                    description="e-Nabız'dan çıktı alıp yapıştırabilir veya PDF yükleyebilirsiniz."
                  />
                ) : (
                  history.map((item, index) => (
                    <div key={`${item.date}-${index}`} className="rounded-[var(--radius-lg)] border border-border bg-surface-muted p-3.5">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-xs font-semibold text-text-primary">
                          {new Date(item.date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                        <span className="text-[10px] text-text-muted bg-surface px-1.5 py-0.5 rounded border border-border flex-shrink-0">
                          {item.sourceType}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-muted mb-2">{item.sourceFileName || item.sourceLabel || "Rapor"}</p>
                      <div className="grid grid-cols-3 gap-1">
                        {[
                          { label: "Kreatinin", value: item.creatinine },
                          { label: "GFR", value: item.gfr },
                          { label: "Tacrolimus", value: item.tacrolimus },
                        ].map((v) => (
                          <div key={v.label} className="text-center bg-surface rounded p-1.5 border border-border">
                            <p className="text-[10px] text-text-muted">{v.label}</p>
                            <p className="text-xs font-semibold text-text-primary tabular-nums">{v.value ?? "—"}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
