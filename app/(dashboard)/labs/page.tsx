"use client";

import { useMemo, useState } from "react";
import LabImportPanel from "@/components/labs/LabImportPanel";
import LabTrendExplorer from "@/components/labs/LabTrendExplorer";
import { getLabImportHistory, getLabData, getPatient } from "@/lib/store";
import { Activity, FileText } from "lucide-react";
import DemoBadge from "@/components/ui/DemoBadge";

const PATIENT_ID = "1";

export default function PatientLabsPage() {
  const patient = getPatient(PATIENT_ID);
  const [refreshKey, setRefreshKey] = useState(0);
  const points = useMemo(() => getLabData(PATIENT_ID), [refreshKey]);
  const history = useMemo(() => getLabImportHistory(PATIENT_ID).slice(0, 5), [refreshKey]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-600 via-navy-500 to-teal-600 p-6 sm:p-7 text-white shadow-xl shadow-navy-500/20">
        <div className="absolute inset-0 dot-pattern opacity-10" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={15} className="text-teal-300" />
            <span className="text-teal-300 text-sm font-semibold">Laboratuvar</span>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-1.5">Laboratuvar Sonuçlarım</h1>
            <DemoBadge text="Örnek veri" className="bg-white/90 border-white/50 text-amber-700" />
          </div>
          <p className="text-white/65 text-sm">Kreatinin, GFR, Tacrolimus ve diğer sonuçlarınızı trend olarak görüntüleyin; isterseniz yeni raporu da sisteme ekleyin.</p>
        </div>
      </div>

      <LabImportPanel
        patientId={PATIENT_ID}
        patientName={patient?.name ?? "Hasta"}
        importedBy={patient?.name ?? "Hasta"}
        onImported={() => setRefreshKey((value) => value + 1)}
      />

      <div className="grid gap-6 xl:grid-cols-[1.4fr,0.6fr]">
        <LabTrendExplorer
          title="Kişisel Laboratuvar Trendleri"
          subtitle="Tüm yeni sonuçlar doktor ve diyetisyen panellerine de yansır."
          points={points}
          defaultMetrics={["creatinine", "gfr", "tacrolimus", "potassium"]}
          accent="navy"
        />

        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={16} className="text-navy-600" />
            <p className="text-sm font-bold text-slate-900">Son Yüklenen Raporlar</p>
          </div>

          <div className="space-y-3">
            {history.length === 0 ? (
              <p className="text-sm text-slate-400">Henüz rapor yüklenmedi.</p>
            ) : (
              history.map((item, index) => (
                <div key={`${item.date}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
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
      </div>
    </div>
  );
}
