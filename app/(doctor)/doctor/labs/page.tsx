"use client";

import { useMemo, useState } from "react";
import LabImportPanel from "@/components/labs/LabImportPanel";
import LabTrendExplorer from "@/components/labs/LabTrendExplorer";
import {
  getCohortSnapshotCards,
  getLabImportHistory,
  getLabData,
  getLiveCohortAverage,
  getPatients,
  getRetrospectiveCohortSummary,
  LabDataPoint,
} from "@/lib/store";
import { Activity, Database, FileText, UploadCloud, Users } from "lucide-react";

const DOCTOR_NAME = "Dr. Ayşe Kaya";

export default function DoctorLabsPage() {
  const patients = getPatients();
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id ?? "");
  const [refreshKey, setRefreshKey] = useState(0);

  const selectedPatient = patients.find((patient) => patient.id === selectedPatientId) ?? null;
  const patientPoints = useMemo(() => getLabData(selectedPatientId), [selectedPatientId, refreshKey]);
  const importHistory = useMemo(() => getLabImportHistory(selectedPatientId).slice(0, 6), [selectedPatientId, refreshKey]);
  const liveAverage = useMemo(() => getLiveCohortAverage(), [refreshKey]);
  const retrospective = useMemo(() => getRetrospectiveCohortSummary(1000), []);
  const snapshotCards = useMemo(() => getCohortSnapshotCards(), [refreshKey]);

  const handleImported = (_points: LabDataPoint[]) => {
    setRefreshKey((value) => value + 1);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-500 to-emerald-600 p-6 sm:p-7 text-white shadow-xl shadow-cyan-500/20">
        <div className="absolute inset-0 dot-pattern opacity-10" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Activity size={15} className="text-cyan-100" />
              <span className="text-cyan-100 text-sm font-semibold">Laboratuvar Merkezi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-1.5">PDF / Excel / Copy-Paste Laboratuvar Akışı</h1>
            <p className="text-white/70 text-sm">Doktor raporları sisteme atabilir, trendleri hem tek hasta hem tüm kohort için izleyebilir.</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-center">
              <p className="text-xs text-white/70 font-medium">Hasta</p>
              <p className="text-xl font-black text-white">{patients.length}</p>
            </div>
            <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-center">
              <p className="text-xs text-white/70 font-medium">Retro</p>
              <p className="text-xl font-black text-white">1000</p>
            </div>
            <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-center">
              <p className="text-xs text-white/70 font-medium">Import</p>
              <p className="text-xl font-black text-white">{importHistory.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold text-slate-900">Hasta Seçimi</p>
            <p className="text-xs text-slate-400">Laboratuvar ekleyeceğiniz veya trendini inceleyeceğiniz hastayı seçin.</p>
          </div>
          <select
            value={selectedPatientId}
            onChange={(event) => setSelectedPatientId(event.target.value)}
            className="modern-field modern-select rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedPatient && (
        <LabImportPanel
          patientId={selectedPatient.id}
          patientName={selectedPatient.name}
          importedBy={DOCTOR_NAME}
          onImported={handleImported}
        />
      )}

      <div className="grid gap-6 xl:grid-cols-[1.4fr,0.6fr]">
        <LabTrendExplorer
          title={`${selectedPatient?.name ?? "Hasta"} Laboratuvar Trendleri`}
          subtitle="Kreatinin, GFR, Tacrolimus ve diger parametreler tarih bazında izlenir."
          points={patientPoints}
        />

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <UploadCloud size={16} className="text-teal-600" />
              <p className="text-sm font-bold text-slate-900">Son Import Geçmişi</p>
            </div>
            <div className="space-y-3">
              {importHistory.length === 0 ? (
                <p className="text-sm text-slate-400">Bu hasta için import geçmişi yok.</p>
              ) : (
                importHistory.map((item, index) => (
                  <div key={`${item.date}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <p className="text-sm font-semibold text-slate-900">{item.date}</p>
                    <p className="text-xs text-slate-500">
                      {item.sourceType} · {item.sourceFileName || item.sourceLabel || "Rapor"}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      Kreatinin: {item.creatinine ?? "-"} · GFR: {item.gfr ?? "-"} · Tacrolimus: {item.tacrolimus ?? "-"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={16} className="text-cyan-600" />
              <p className="text-sm font-bold text-slate-900">Desteklenen Girdiler</p>
            </div>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>e-Nabız web ekranından kopyalanan metin</li>
              <li>PDF laboratuvar sonuç raporu</li>
              <li>Excel / CSV çok satırlı laboratuvar listesi</li>
              <li>Doktor tarafından manuel tekil metrik girişi</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Users size={16} className="text-teal-600" />
              <p className="text-sm font-bold text-slate-900">Canlı Kohort Özeti</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {snapshotCards.map((card) => (
                <div key={card.label} className="rounded-2xl bg-teal-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">{card.label}</p>
                  <p className="mt-1 text-xl font-black text-slate-900">{card.value}</p>
                </div>
              ))}
            </div>
          </div>

          <LabTrendExplorer
            title="Canlı Hasta Kohortu Ortalaması"
            subtitle="Sistemde kayıtlı tüm hastaların ortalama laboratuvar eğrileri."
            points={liveAverage}
            defaultMetrics={["creatinine", "gfr", "tacrolimus"]}
            accent="teal"
          />
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Database size={16} className="text-violet-600" />
              <p className="text-sm font-bold text-slate-900">1000 Hastalık Retrospektif Analiz</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {retrospective.metricSummaries.slice(0, 6).map((metric) => (
                <div key={metric.key} className="rounded-2xl bg-violet-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">{metric.label}</p>
                  <p className="mt-1 text-xl font-black text-slate-900">
                    {metric.latestMean.toFixed(metric.key === "gfr" ? 0 : 1)} {metric.unit}
                  </p>
                  <p className="text-xs text-slate-500">12 ay degisimi: {metric.change12m > 0 ? "+" : ""}{metric.change12m}</p>
                </div>
              ))}
            </div>
          </div>

          <LabTrendExplorer
            title="Retrospektif 1000 Hasta Trendleri"
            subtitle="Gerçek veri yuklenene kadar sistem içi kohort gösterimi için de-identifiye demo seri."
            points={retrospective.monthlyAverages}
            defaultMetrics={["creatinine", "gfr", "tacrolimus", "potassium"]}
            accent="emerald"
          />
        </div>
      </div>
    </div>
  );
}
