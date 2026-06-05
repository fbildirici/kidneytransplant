"use client";

import { getDietPlan, getPatients } from "@/lib/store";
import { Users } from "lucide-react";

export default function DietitianPatientsPage() {
  const patients = getPatients();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 p-6 sm:p-7 text-white shadow-xl shadow-emerald-500/20">
        <div className="absolute inset-0 dot-pattern opacity-10" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Users size={15} className="text-green-300" />
            <span className="text-green-300 text-sm font-semibold">Hasta Yönetimi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-1.5">Beslenme Takip Listesi</h1>
          <p className="text-white/65 text-sm">Doktorun açtığı tüm hastalar ve güncel diyet verileri burada görünür.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {patients.map((patient) => {
          const plan = getDietPlan(patient.id);
          return (
            <div key={patient.id} className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-bold text-slate-900">{patient.name}</p>
                  <p className="text-sm text-slate-500">
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
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Kalori</p>
                  <p className="mt-1 text-xl font-black text-slate-900">{plan?.calorieTarget ?? "-"} kcal</p>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Sıvı</p>
                  <p className="mt-1 text-xl font-black text-slate-900">{plan?.fluidLimit ?? "-"}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>Son diyet güncellemesi: {plan?.lastUpdated ?? "-"}</p>
                <p>Güncelleyen rol: {plan?.updatedByRole ?? "-"}</p>
                <p>Kreatinin: {patient.creatinine} · Tacrolimus: {patient.tacrolimusLevel}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
