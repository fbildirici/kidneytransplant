"use client";

import { getDietPlan, getPatients } from "@/lib/store";
import { Users } from "lucide-react";
import PageTitle from "@/components/PageTitle";

export default function DietitianPatientsPage() {
  const patients = getPatients();

  return (
    <>
      <PageTitle title="Hastalarım" />
      <div className="space-y-6 max-w-6xl mx-auto">
      <div className="relative overflow-hidden rounded-[var(--radius-xl)] bg-medical-700 p-6 sm:p-7 text-white shadow-elevated">
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Users size={15} className="text-green-300" />
            <span className="text-green-300 text-sm font-semibold">Hasta Yönetimi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1.5">Beslenme Takip Listesi</h1>
          <p className="text-white/65 text-sm">Doktorun açtığı tüm hastalar ve güncel diyet verileri burada görünür.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {patients.map((patient) => {
          const plan = getDietPlan(patient.id);
          return (
            <div key={patient.id} className="rounded-[var(--radius-xl)] border border-border bg-surface p-5 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-bold text-text-primary">{patient.name}</p>
                  <p className="text-sm text-text-tertiary">
                    {patient.weight} · BMI {patient.bmi} · {patient.bloodGroup}
                  </p>
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
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Sıvı</p>
                  <p className="mt-1 text-xl font-bold text-text-primary">{plan?.fluidLimit ?? "-"}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm text-text-secondary">
                <p>Son diyet güncellemesi: {plan?.lastUpdated ?? "-"}</p>
                <p>Güncelleyen rol: {plan?.updatedByRole ?? "-"}</p>
                <p>Kreatinin: {patient.creatinine} · Tacrolimus: {patient.tacrolimusLevel}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </>
  );
}
