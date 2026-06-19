"use client";
import { useState, useMemo } from "react";
import PageTitle from "@/components/PageTitle";
import Card from "@/components/ui/Card";
import LineChart from "@/components/charts/LineChart";
import type { ChartSeries } from "@/components/charts/LineChart";
import {
  getRetrospectiveCohortSummary,
  LAB_METRIC_DEFINITIONS,
} from "@/lib/store";
import {
  Users, TrendingUp, TrendingDown, Minus, FlaskConical,
  Pill, AlertTriangle, CheckCircle, Info, Filter, Download,
  ShieldCheck, Microscope, BarChart3,
} from "lucide-react";

const COHORT_META = {
  adherenceRate: 88.7,
  labFollowUpRate: 93.4,
  dietCoverageRate: 81.2,
  tacrolimusInRangePct: 74.1,
  stablePct: 67.8,
  warningPct: 23.6,
  criticalPct: 8.6,
  avgTransplantMonths: 18.4,
};

const YEAR_OPTIONS = ["Tümü", "2022–2023", "2023–2024", "2024–2025", "2025–2026"];
const AGE_OPTIONS = ["Tümü", "18–30", "31–45", "46–60", "60+"];
const DOCTOR_OPTIONS = ["Tümü", "Dr. Ayşe Kaya", "Dr. Mehmet Yıldız", "Dr. Seda Polat", "Dr. Ali Eren"];

function TrendIcon({ change, higherIsBetter = false }: { change: number; higherIsBetter?: boolean }) {
  if (Math.abs(change) < 0.01) return <Minus size={13} className="text-text-tertiary" />;
  const positive = higherIsBetter ? change > 0 : change < 0;
  if (positive) return <TrendingDown size={13} className="text-success-600" />;
  return <TrendingUp size={13} className="text-danger-600" />;
}

function StatusBadge({ value, min, max, higherIsBetter = false }: { value: number; min: number; max: number; higherIsBetter?: boolean }) {
  const inRange = value >= min && value <= max;
  const critical = higherIsBetter ? value < min * 0.85 : value > max * 1.25;
  if (inRange) return <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-success-50 text-success-700 border border-success-200">Normal</span>;
  if (critical) return <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-danger-50 text-danger-700 border border-danger-200">Kritik</span>;
  return <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-warning-50 text-warning-700 border border-warning-200">Dikkat</span>;
}

export default function AnalyticsPage() {
  const [yearFilter, setYearFilter] = useState("Tümü");
  const [ageFilter, setAgeFilter] = useState("Tümü");
  const [doctorFilter, setDoctorFilter] = useState("Tümü");

  const cohort = useMemo(() => getRetrospectiveCohortSummary(1000), []);

  const chartData = useMemo(
    () =>
      cohort.monthlyAverages.map((pt) => ({
        label: pt.date,
        values: {
          creatinine: pt.creatinine ?? 0,
          gfr: pt.gfr ?? 0,
          tacrolimus: pt.tacrolimus ?? 0,
          hemoglobin: pt.hemoglobin ?? 0,
          crp: pt.crp ?? 0,
          potassium: pt.potassium ?? 0,
        },
      })),
    [cohort]
  );

  const creatSeries: ChartSeries[] = [{ key: "creatinine", label: "Kreatinin", color: "#0ea5e9", unit: "mg/dL" }];
  const gfrSeries: ChartSeries[] = [{ key: "gfr", label: "GFR", color: "#10b981", unit: "mL/min" }];
  const tacroSeries: ChartSeries[] = [{ key: "tacrolimus", label: "Tacrolimus", color: "#6366f1", unit: "ng/mL" }];
  const multiSeries: ChartSeries[] = [
    { key: "hemoglobin", label: "Hemoglobin", color: "#ec4899", unit: "g/dL" },
    { key: "crp", label: "CRP", color: "#dc2626", unit: "mg/L" },
    { key: "potassium", label: "Potasyum", color: "#14b8a6", unit: "mmol/L" },
  ];

  const latestCr = cohort.monthlyAverages.at(-1)?.creatinine?.toFixed(2) ?? "-";
  const latestGfr = cohort.monthlyAverages.at(-1)?.gfr?.toFixed(1) ?? "-";
  const latestTac = cohort.monthlyAverages.at(-1)?.tacrolimus?.toFixed(1) ?? "-";

  const summaryCards = [
    { label: "Toplam Hasta", value: "1.000", sub: "Geriye dönük kohort", icon: Users, color: "stat-card-navy" },
    { label: "Ort. Kreatinin", value: `${latestCr} mg/dL`, sub: "Son 12 ay ortalaması", icon: FlaskConical, color: "stat-card-cyan" },
    { label: "Ort. GFR", value: `${latestGfr} mL/min`, sub: "Son 12 ay ortalaması", icon: BarChart3, color: "stat-card-emerald" },
    { label: "Tacrolimus Hedefte", value: `%${COHORT_META.tacrolimusInRangePct}`, sub: "8–12 ng/mL aralığında", icon: CheckCircle, color: "stat-card-violet" },
    { label: "İlaç Uyum Oranı", value: `%${COHORT_META.adherenceRate}`, sub: "7 günlük ortalama", icon: Pill, color: "stat-card-emerald" },
    { label: "Lab Takip Oranı", value: `%${COHORT_META.labFollowUpRate}`, sub: "Planlanan kontroller", icon: Microscope, color: "stat-card-cyan" },
    { label: "Diyet Planı Kapsamı", value: `%${COHORT_META.dietCoverageRate}`, sub: "Aktif plan olan hasta", icon: ShieldCheck, color: "stat-card-navy" },
    { label: "Stabil Hasta", value: `%${COHORT_META.stablePct}`, sub: `Uyarı: %${COHORT_META.warningPct} · Kritik: %${COHORT_META.criticalPct}`, icon: TrendingUp, color: "stat-card-violet" },
  ];

  return (
    <>
      <PageTitle title="Popülasyon İstatistikleri" />
      <div className="space-y-6 max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-surface rounded-[var(--radius-xl)] border border-border p-5 sm:p-6 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-navy-600 uppercase tracking-widest mb-1">Araştırma Paneli</p>
              <h1 className="text-xl sm:text-2xl font-semibold text-text-primary mb-1">
                Popülasyon İstatistikleri
              </h1>
              <p className="text-sm text-text-secondary">
                1.000 hastalık anonim geriye dönük kohort — böbrek nakli sonrası klinik takip analizi
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary border border-border rounded-[var(--radius-lg)] px-3 py-2 hover:bg-surface-muted transition-colors cursor-pointer">
                <Download size={13} /> Rapor İndir
              </button>
            </div>
          </div>

          {/* Research context banner */}
          <div className="mt-4 flex items-start gap-2.5 bg-navy-50 border border-navy-200 rounded-[var(--radius-lg)] px-4 py-3">
            <Info size={14} className="text-navy-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-navy-700 leading-relaxed">
              <span className="font-semibold">TÜBİTAK 2577 / TÜSEB C Grubu Araştırma Verisi:</span>{" "}
              Bu panel, nakil sonrası 6–36 ay aralığında takip edilen hastaların anonim klinik verilerini kapsamaktadır.
              Tüm veriler KVKK ve Kişisel Sağlık Verileri Hakkında Yönetmelik çerçevesinde anonimleştirilmiştir.
              Doğrudan tanı veya tedavi kararı için kullanılamaz.
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card padding="sm">
          <div className="flex flex-wrap items-center gap-3 px-4 py-3">
            <Filter size={14} className="text-text-tertiary flex-shrink-0" />
            <span className="text-xs font-semibold text-text-secondary">Filtrele:</span>
            <div className="flex flex-wrap gap-2">
              {([["Nakil Yılı", YEAR_OPTIONS, yearFilter, setYearFilter], ["Yaş Grubu", AGE_OPTIONS, ageFilter, setAgeFilter], ["Doktor", DOCTOR_OPTIONS, doctorFilter, setDoctorFilter]] as const).map(([label, options, value, setter]) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className="text-xs text-text-tertiary">{label}:</span>
                  <select
                    value={value}
                    onChange={(e) => (setter as (v: string) => void)(e.target.value)}
                    className="text-xs border border-border rounded-[var(--radius-md)] px-2 py-1 bg-surface text-text-primary focus:outline-none focus:ring-1 focus:ring-navy-400 cursor-pointer"
                  >
                    {(options as readonly string[]).map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <span className="text-[10px] text-text-tertiary ml-auto italic">Filtreler bu demo sürümde görsel amaçlıdır</span>
          </div>
        </Card>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((card) => (
            <div key={card.label} className={`${card.color} rounded-[var(--radius-xl)] p-5`}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-[var(--radius-lg)] bg-surface/20 flex items-center justify-center">
                  <card.icon size={16} className="text-current opacity-80" />
                </div>
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-60 mb-0.5">{card.label}</p>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-[11px] opacity-60 mt-0.5 leading-tight">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Patient Status Distribution */}
        <Card>
          <h2 className="font-semibold text-text-primary mb-4">Hasta Durum Dağılımı</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: "Stabil", pct: COHORT_META.stablePct, color: "bg-success-500", text: "text-success-700", bg: "bg-success-50", border: "border-success-200", count: Math.round(1000 * COHORT_META.stablePct / 100) },
              { label: "Uyarı", pct: COHORT_META.warningPct, color: "bg-warning-500", text: "text-warning-700", bg: "bg-warning-50", border: "border-warning-200", count: Math.round(1000 * COHORT_META.warningPct / 100) },
              { label: "Kritik", pct: COHORT_META.criticalPct, color: "bg-danger-500", text: "text-danger-700", bg: "bg-danger-50", border: "border-danger-200", count: Math.round(1000 * COHORT_META.criticalPct / 100) },
            ].map((s) => (
              <div key={s.label} className={`rounded-[var(--radius-xl)] p-4 ${s.bg} border ${s.border}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-semibold ${s.text}`}>{s.label}</span>
                  <span className={`text-lg font-bold ${s.text}`}>%{s.pct}</span>
                </div>
                <div className="h-2.5 bg-white/60 rounded-full overflow-hidden">
                  <div className={`h-full ${s.color} rounded-full transition-all`} style={{ width: `${s.pct}%` }} />
                </div>
                <p className={`text-xs mt-1.5 ${s.text} opacity-70`}>{s.count} hasta</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-text-primary">Kreatinin Trendi</h2>
                <p className="text-xs text-text-tertiary mt-0.5">12 aylık kohort ortalaması (mg/dL)</p>
              </div>
              <span className="text-xs font-semibold text-navy-600 bg-navy-50 border border-navy-200 px-2 py-0.5 rounded-full">n=1.000</span>
            </div>
            <LineChart
              data={chartData}
              series={creatSeries}
              height={200}
              normalRanges={{ creatinine: { min: 0.7, max: 1.3 } }}
            />
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-text-primary">GFR Trendi</h2>
                <p className="text-xs text-text-tertiary mt-0.5">12 aylık kohort ortalaması (mL/min/1.73m²)</p>
              </div>
              <span className="text-xs font-semibold text-success-700 bg-success-50 border border-success-200 px-2 py-0.5 rounded-full">n=1.000</span>
            </div>
            <LineChart
              data={chartData}
              series={gfrSeries}
              height={200}
              normalRanges={{ gfr: { min: 60, max: 120 } }}
            />
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-text-primary">Tacrolimus Trendi</h2>
                <p className="text-xs text-text-tertiary mt-0.5">12 aylık kohort ortalaması (ng/mL)</p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-indigo-700 bg-indigo-50 border border-indigo-200">n=1.000</span>
            </div>
            <LineChart
              data={chartData}
              series={tacroSeries}
              height={200}
              normalRanges={{ tacrolimus: { min: 8, max: 12 } }}
            />
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-text-primary">Diğer Belirteçler</h2>
                <p className="text-xs text-text-tertiary mt-0.5">Hemoglobin, CRP, Potasyum</p>
              </div>
            </div>
            <LineChart data={chartData} series={multiSeries} height={200} />
          </Card>
        </div>

        {/* Metric Summary Table */}
        <Card padding="sm">
          <div className="px-4 pt-4 pb-2 flex items-center justify-between">
            <h2 className="font-semibold text-text-primary">Metrik Özeti — 12 Aylık Analiz</h2>
            <span className="text-xs text-text-tertiary">Kohort ortalamaları</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-tertiary uppercase tracking-wide">Metrik</th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-text-tertiary uppercase tracking-wide">Ort. Değer</th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-text-tertiary uppercase tracking-wide">12A Değişim</th>
                  <th className="text-center px-4 py-2.5 text-xs font-semibold text-text-tertiary uppercase tracking-wide">Normal Aralık</th>
                  <th className="text-center px-4 py-2.5 text-xs font-semibold text-text-tertiary uppercase tracking-wide">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cohort.metricSummaries.map((s) => {
                  const def = LAB_METRIC_DEFINITIONS.find((d) => d.key === s.key);
                  return (
                    <tr key={s.key} className="hover:bg-surface-muted/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-text-primary">{s.label}</p>
                        <p className="text-xs text-text-tertiary">{def?.description}</p>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-semibold text-text-primary">{s.latestMean.toFixed(2)}</span>
                        <span className="text-xs text-text-tertiary ml-1">{s.unit}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <TrendIcon change={s.change12m} higherIsBetter={def?.higherIsBetter} />
                          <span className={`text-xs font-semibold ${Math.abs(s.change12m) < 0.01 ? "text-text-tertiary" : s.change12m > 0 ? "text-danger-600" : "text-success-600"}`}>
                            {s.change12m > 0 ? "+" : ""}{s.change12m.toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-xs text-text-tertiary">
                        {s.normalMin}–{s.normalMax} {s.unit}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge value={s.latestMean} min={s.normalMin} max={s.normalMax} higherIsBetter={def?.higherIsBetter} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Research Notes */}
        <Card>
          <div className="flex items-start gap-3">
            <AlertTriangle size={16} className="text-warning-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-2">Çalışma Kısıtlamaları ve Notlar</h3>
              <ul className="space-y-1.5 text-xs text-text-secondary leading-relaxed">
                <li>• Veriler geriye dönük (retrospektif) olup prospektif çalışma verilerinden farklılık gösterebilir.</li>
                <li>• Kohort homojenliği varsayılmış; komorbidite, transplant tipi ve immünosupresyon protokolü varyasyonları kontrol edilmemiştir.</li>
                <li>• Lab verilerinde kayıp veri oranı &lt;%5; kayıp veriler son gözlem değeriyle taşınmıştır (LOCF yöntemi).</li>
                <li>• Bu analiz platform prototipine özgüdür; gerçek klinik kararlar için kullanılmamalıdır.</li>
                <li>• Veri toplama dönemi: Temmuz 2024 – Haziran 2026 · Kayıt merkezi: Tek merkez · IRB onayı: Simüle edilmiştir.</li>
              </ul>
            </div>
          </div>
        </Card>

      </div>
    </>
  );
}
