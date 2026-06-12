"use client";

import { useEffect, useState } from "react";
import { getDietPlan, getPatients, setDietPlan, StoredDietPlan } from "@/lib/store";
import { Apple, Save, UserRoundCog } from "lucide-react";
import PageTitle from "@/components/PageTitle";

export default function DietPlansPage() {
  const patients = getPatients();
  const [selectedId, setSelectedId] = useState(patients[0]?.id ?? "");
  const [plan, setPlan] = useState<StoredDietPlan | null>(null);
  const [form, setForm] = useState<StoredDietPlan | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loaded = getDietPlan(selectedId);
    setPlan(loaded);
    setForm(loaded);
  }, [selectedId]);

  const savePlan = () => {
    if (!form) return;
    const updated: StoredDietPlan = {
      ...form,
      patientId: selectedId,
      lastUpdated: new Date().toISOString().slice(0, 10),
      prescribedBy: "Dyt. Zeynep Arslan",
      updatedByRole: "dietitian",
      patientEditable: true,
    };
    setDietPlan(selectedId, updated);
    setPlan(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const selectedPatient = patients.find((patient) => patient.id === selectedId);

  return (
    <>
      <PageTitle title="Diyet Planları" />
      <div className="space-y-6 max-w-6xl mx-auto">
      <div className="relative overflow-hidden rounded-[var(--radius-xl)] bg-medical-700 p-6 sm:p-7 text-white shadow-elevated">
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Apple size={15} className="text-green-300" />
              <span className="text-green-300 text-sm font-semibold">Diyet Yönetimi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1.5">Ortak Diyet Planı Düzenleyici</h1>
            <p className="text-white/65 text-sm">Diyetisyen ile hasta aynı plan üzerinde çalışabilir; en son kim güncellediyse burada görünür.</p>
          </div>
          {saved && (
            <div className="rounded-[var(--radius-lg)] bg-white/10 border border-white/15 px-4 py-3 text-sm font-semibold text-white">
              Diyet planı kaydedildi.
            </div>
          )}
        </div>
      </div>

      <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-5 shadow-card">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-text-tertiary">Hasta</label>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {patients.map((patient) => (
            <button
              key={patient.id}
              type="button"
              onClick={() => setSelectedId(patient.id)}
              className={`rounded-[var(--radius-xl)] border px-4 py-3 text-left transition-colors cursor-pointer ${
                selectedId === patient.id
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                  : "border-border bg-surface text-text-secondary hover:border-border-hover"
              }`}
            >
              <p className="text-sm font-semibold">{patient.name}</p>
              <p className="text-xs text-text-muted">{patient.weight} · BMI {patient.bmi}</p>
            </button>
          ))}
        </div>
      </div>

      {form && (
        <div className="grid gap-6 xl:grid-cols-[1fr,0.9fr]">
          <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-text-primary">{selectedPatient?.name} için Diyet Planı</p>
                <p className="text-xs text-text-muted">
                  Son güncelleme: {plan?.lastUpdated ?? "-"} · Güncelleyen: {plan?.updatedByRole ?? "-"}
                </p>
              </div>
              <button
                type="button"
                onClick={savePlan}
                className="rounded-[var(--radius-lg)] bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Save size={15} />
                  Kaydet
                </span>
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {[
                { key: "calorieTarget", label: "Kalori" },
                { key: "proteinTarget", label: "Protein" },
                { key: "potassiumLimit", label: "Potasyum" },
                { key: "phosphorusLimit", label: "Fosfor" },
                { key: "fluidLimit", label: "Sıvı" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="mb-1 block text-xs font-medium text-text-secondary">{field.label}</label>
                  <input
                    type="text"
                    value={String(form[field.key as keyof StoredDietPlan] ?? "")}
                    onChange={(event) =>
                      setForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              [field.key]: field.key === "calorieTarget" ? Number(event.target.value) || 0 : event.target.value,
                            }
                          : prev
                      )
                    }
                    className="modern-field w-full rounded-[var(--radius-lg)] border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-text-secondary">Kısıtlamalar</label>
              <textarea
                rows={4}
                value={form.restrictions.join("\n")}
                onChange={(event) =>
                  setForm((prev) =>
                    prev
                      ? {
                          ...prev,
                          restrictions: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean),
                        }
                      : prev
                  )
                }
                className="modern-field w-full resize-none rounded-[var(--radius-lg)] border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div className="space-y-3">
              {form.meals.map((meal, index) => (
                <div key={`${meal.meal}-${index}`} className="rounded-[var(--radius-xl)] border border-border bg-surface-muted p-4">
                  <label className="mb-1 block text-xs font-medium text-text-secondary">Öğün Başlığı</label>
                  <input
                    type="text"
                    value={meal.meal}
                    onChange={(event) =>
                      setForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              meals: prev.meals.map((entry, mealIndex) =>
                                mealIndex === index ? { ...entry, meal: event.target.value } : entry
                              ),
                            }
                          : prev
                      )
                    }
                    className="modern-field w-full rounded-[var(--radius-lg)] border border-border px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                  <label className="mb-1 mt-3 block text-xs font-medium text-text-secondary">Besinler</label>
                  <textarea
                    rows={3}
                    value={meal.items.join("\n")}
                    onChange={(event) =>
                      setForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              meals: prev.meals.map((entry, mealIndex) =>
                                mealIndex === index
                                  ? {
                                      ...entry,
                                      items: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean),
                                    }
                                  : entry
                              ),
                            }
                          : prev
                      )
                    }
                    className="modern-field w-full resize-none rounded-[var(--radius-lg)] border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-text-secondary">Notlar</label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(event) => setForm((prev) => (prev ? { ...prev, notes: event.target.value } : prev))}
                className="modern-field w-full resize-none rounded-[var(--radius-lg)] border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-5 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <UserRoundCog size={16} className="text-cyan-600" />
                <p className="text-sm font-bold text-text-primary">Hasta Tarafından Eklenen Notlar</p>
              </div>
              <div className="space-y-2">
                {(plan?.patientNotes ?? []).length === 0 ? (
                  <p className="text-sm text-text-muted">Hasta henüz ek not bırakmadı.</p>
                ) : (
                  (plan?.patientNotes ?? []).map((note, index) => (
                    <div key={`${note}-${index}`} className="rounded-[var(--radius-xl)] bg-cyan-50 p-4 text-sm text-text-secondary">
                      {note}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-5 shadow-card">
              <p className="text-sm font-bold text-text-primary mb-3">Rol Tabanlı Yetki</p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>Diyetisyen planı resmi olarak güncelleyebilir.</li>
                <li>Hasta da aynı planı düzenleyebilir ve not ekleyebilir.</li>
                <li>En son güncelleyen rol üst bilgi alanında görünür.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
