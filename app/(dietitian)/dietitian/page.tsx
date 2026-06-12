"use client";

import Link from "next/link";
import { getDietPlan, getPatients } from "@/lib/store";
import { Apple, Calendar, Salad } from "lucide-react";
import PageTitle from "@/components/PageTitle";

export default function DietitianDashboard() {
  const patients = getPatients();
  const plans = patients.map((patient) => ({
    patient,
    plan: getDietPlan(patient.id),
  }));

  const attentionCount = patients.filter((patient) => patient.status !== "stable").length;

  return (
    <>
      <PageTitle title="Diyetisyen Paneli" />
      <div className="space-y-6 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-[var(--radius-xl)] bg-medical-700 p-6 sm:p-7 text-white shadow-elevated">
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Salad size={15} className="text-medical-200" />
              <span className="text-medical-200 text-sm font-semibold">Diyetisyen Paneli</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1.5">Klinik Beslenme Takibi</h1>
            <p className="text-white/65 text-sm">Doktor tarafından açılan yeni hastalar ve hastanın kendi güncellediği diyet planları bu panelde birleşir.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/dietitian/diet-plans" className="rounded-[var(--radius-lg)] bg-surface px-4 py-3 text-sm font-semibold text-emerald-700 shadow-elevated">
              Diyet Planları
            </Link>
            <Link href="/dietitian/appointments" className="rounded-[var(--radius-lg)] bg-white/15 border border-white/15 px-4 py-3 text-sm font-semibold text-white">
              Randevular
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">Takipteki Hasta</p>
          <p className="mt-2 text-3xl font-bold text-text-primary">{patients.length}</p>
        </div>
        <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">Dikkat Gereken</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">{attentionCount}</p>
        </div>
        <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">Planı Olan</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">{plans.filter((entry) => entry.plan).length}</p>
        </div>
        <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">Hasta Düzenledi</p>
          <p className="mt-2 text-3xl font-bold text-cyan-600">{plans.filter((entry) => entry.plan?.updatedByRole === "patient").length}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {plans.map(({ patient, plan }) => (
          <div key={patient.id} className="rounded-[var(--radius-xl)] border border-border bg-surface p-5 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-bold text-text-primary">{patient.name}</p>
                <p className="text-sm text-text-tertiary">{patient.weight} · BMI {patient.bmi} · {patient.assignedDoctorName}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                patient.status === "critical"
                  ? "bg-red-100 text-red-700"
                  : patient.status === "warning"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-emerald-700"
              }`}>
                {patient.status === "critical" ? "Kritik" : patient.status === "warning" ? "Dikkat" : "Stabil"}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-[var(--radius-xl)] bg-emerald-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Kalori</p>
                <p className="mt-1 text-xl font-bold text-text-primary">{plan?.calorieTarget ?? "-"} kcal</p>
              </div>
              <div className="rounded-[var(--radius-xl)] bg-emerald-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Protein</p>
                <p className="mt-1 text-xl font-bold text-text-primary">{plan?.proteinTarget ?? "-"}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-text-tertiary">
                Son güncelleme: {plan?.lastUpdated ?? "-"} · Güncelleyen: {plan?.updatedByRole ?? "diyetisyen"}
              </div>
              <div className="flex gap-2">
                <Link href="/dietitian/diet-plans" className="rounded-[var(--radius-lg)] bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                  <span className="flex items-center gap-1">
                    <Apple size={13} />
                    Planı Düzenle
                  </span>
                </Link>
                <Link href="/dietitian/appointments" className="rounded-[var(--radius-lg)] bg-surface-muted px-3 py-2 text-xs font-semibold text-text-secondary">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} />
                    Görüşme
                  </span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
