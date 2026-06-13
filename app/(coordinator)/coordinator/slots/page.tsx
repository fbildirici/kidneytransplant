"use client";

import { useState } from "react";
import { ProviderRole } from "@/lib/store";
import ProviderAppointmentsManager from "@/components/appointments/ProviderAppointmentsManager";
import PageTitle from "@/components/PageTitle";
import { Stethoscope, Apple } from "lucide-react";

const DOCTOR_OPTIONS = [
  { name: "Dr. Ayşe Kaya",    specialty: "Nefrolog" },
  { name: "Dr. Mehmet Demir", specialty: "Üroloji" },
];

const DIETITIAN_OPTIONS = [
  { name: "Dyt. Zeynep Arslan", specialty: "Diyetisyen" },
  { name: "Dyt. Fatma Yılmaz",  specialty: "Diyetisyen" },
];

const DOCTOR_ACCENT = {
  banner: "bg-navy-700",
  soft:   "bg-navy-50",
  text:   "text-navy-700",
  border: "border-navy-200",
  strong: "bg-navy-600 hover:bg-navy-700",
};

const DIETITIAN_ACCENT = {
  banner: "bg-teal-700",
  soft:   "bg-teal-50",
  text:   "text-teal-700",
  border: "border-teal-200",
  strong: "bg-teal-600 hover:bg-teal-700",
};

export default function CoordinatorSlotsPage() {
  const [providerRole, setProviderRole] = useState<ProviderRole>("doctor");
  const [providerIdx, setProviderIdx] = useState(0);

  const providerList = providerRole === "doctor" ? DOCTOR_OPTIONS : DIETITIAN_OPTIONS;
  const provider = providerList[providerIdx] ?? providerList[0];
  const accent = providerRole === "doctor" ? DOCTOR_ACCENT : DIETITIAN_ACCENT;

  return (
    <>
      <PageTitle title="Slot Yönetimi" />
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="bg-surface rounded-[var(--radius-xl)] border border-border p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary mb-3">
            Sağlayıcı Seçimi
          </p>
          <div className="flex flex-wrap gap-3 mb-4">
            {[
              { id: "doctor",    label: "Doktor",      icon: Stethoscope },
              { id: "dietitian", label: "Diyetisyen",  icon: Apple },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => { setProviderRole(item.id as ProviderRole); setProviderIdx(0); }}
                className={`flex items-center gap-2 rounded-[var(--radius-lg)] border px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer ${
                  providerRole === item.id
                    ? "border-navy-300 bg-navy-50 text-navy-700"
                    : "border-border bg-surface text-text-secondary hover:border-border-hover"
                }`}
              >
                <item.icon size={15} />
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {providerList.map((p, i) => (
              <button
                key={p.name}
                type="button"
                onClick={() => setProviderIdx(i)}
                className={`rounded-[var(--radius-lg)] border px-3 py-2 text-sm transition-colors cursor-pointer ${
                  providerIdx === i
                    ? "border-teal-300 bg-teal-50 text-teal-700 font-semibold"
                    : "border-border bg-surface text-text-secondary hover:border-border-hover"
                }`}
              >
                {p.name}
                <span className="ml-1.5 text-xs text-text-muted">· {p.specialty}</span>
              </button>
            ))}
          </div>
        </div>

        <ProviderAppointmentsManager
          key={`${providerRole}-${provider.name}`}
          providerRole={providerRole}
          providerName={provider.name}
          specialty={provider.specialty}
          accent={accent}
        />
      </div>
    </>
  );
}
