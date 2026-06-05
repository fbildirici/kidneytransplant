"use client";

import { useEffect, useState } from "react";
import {
  getDietPlan,
  setDietPlan,
  StoredDietPlan,
} from "@/lib/store";
import {
  Apple,
  CheckCircle,
  Droplets,
  Edit2,
  Leaf,
  Save,
} from "lucide-react";
import DemoBadge from "@/components/ui/DemoBadge";

const PATIENT_ID = "1";

export default function NutritionPage() {
  const [plan, setPlan] = useState<StoredDietPlan | null>(null);
  const [editing, setEditing] = useState(false);
  const [waterGlasses, setWaterGlasses] = useState(5);
  const [form, setForm] = useState<StoredDietPlan | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loaded = getDietPlan(PATIENT_ID);
    setPlan(loaded);
    setForm(loaded);
  }, []);

  const handleSave = () => {
    if (!form) return;
    const updated: StoredDietPlan = {
      ...form,
      patientId: PATIENT_ID,
      lastUpdated: new Date().toISOString().slice(0, 10),
      updatedByRole: "patient",
      patientEditable: true,
      patientNotes: form.patientNotes ?? [],
    };
    setDietPlan(PATIENT_ID, updated);
    setPlan(updated);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-600 p-6 sm:p-7 text-white shadow-xl shadow-teal-500/20">
        <div className="absolute inset-0 dot-pattern opacity-10" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Leaf size={15} className="text-emerald-300" />
              <span className="text-emerald-300 text-sm font-semibold">Beslenme Merkezi</span>
            </div>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl font-black text-white mb-1.5">Diyet Planım</h1>
              <DemoBadge text="Örnek plan" className="bg-white/90 border-white/50 text-amber-700" />
            </div>
            <p className="text-white/65 text-sm">Diyetisyen tarafından girilen planı görebilir, hasta olarak düzenleme yapabilir ve not ekleyebilirsiniz.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 text-center">
              <p className="text-xs text-white/70 font-medium">Su Hedefi</p>
              <p className="text-xl font-black text-white">{waterGlasses}/8</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditing(true);
                setForm(plan);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-teal-700 shadow-lg hover:bg-white/90 cursor-pointer"
            >
              <Edit2 size={15} />
              Diyeti Düzenle
            </button>
          </div>
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle size={18} className="text-emerald-600" />
          Hasta tarafından güncellenen diyet planı diyetisyen paneline de yansıtıldı.
        </div>
      )}

      {plan && !editing && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {[
              { label: "Kalori", value: `${plan.calorieTarget} kcal`, color: "bg-orange-50 text-orange-700" },
              { label: "Protein", value: plan.proteinTarget, color: "bg-blue-50 text-blue-700" },
              { label: "Potasyum", value: plan.potassiumLimit, color: "bg-yellow-50 text-yellow-700" },
              { label: "Fosfor", value: plan.phosphorusLimit, color: "bg-purple-50 text-purple-700" },
              { label: "Sıvı", value: plan.fluidLimit, color: "bg-cyan-50 text-cyan-700" },
            ].map((item) => (
              <div key={item.label} className={`rounded-2xl p-4 ${item.color}`}>
                <p className="text-[10px] font-semibold uppercase tracking-wide opacity-75">{item.label}</p>
                <p className="mt-1 text-xl font-black">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
            <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Apple size={18} className="text-emerald-600" />
                <p className="text-sm font-bold text-slate-900">Öğün Planı</p>
              </div>
              <div className="space-y-3">
                {plan.meals.map((meal, index) => (
                  <div key={`${meal.meal}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <p className="text-sm font-semibold text-slate-900">{meal.meal}</p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-600">
                      {meal.items.map((item, itemIndex) => (
                        <li key={`${meal.meal}-${itemIndex}`}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Droplets size={18} className="text-cyan-600" />
                  <p className="text-sm font-bold text-slate-900">Su Takibi</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setWaterGlasses((value) => Math.max(0, value - 1))}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    -
                  </button>
                  <div className="flex-1 rounded-2xl bg-cyan-50 px-4 py-4 text-center">
                    <p className="text-3xl font-black text-slate-900">{waterGlasses}</p>
                    <p className="text-xs text-slate-500">bardak</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWaterGlasses((value) => Math.min(8, value + 1))}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-slate-900 mb-3">Kısıtlamalar</p>
                <div className="flex flex-wrap gap-2">
                  {plan.restrictions.map((restriction, index) => (
                    <span key={`${restriction}-${index}`} className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                      {restriction}
                    </span>
                  ))}
                </div>
                {plan.notes && <p className="mt-4 text-sm text-slate-600">{plan.notes}</p>}
              </div>
            </div>
          </div>
        </>
      )}

      {editing && form && (
        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-slate-900">Hasta Düzenleme Modu</p>
              <p className="text-xs text-slate-400">Kalori hedefleri, kısıtlamalar ve öğünleri hasta olarak güncelleyebilirsiniz.</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Save size={15} />
                  Kaydet
                </span>
              </button>
            </div>
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
                <label className="mb-1 block text-xs font-medium text-slate-600">{field.label}</label>
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
                  className="modern-field w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Kısıtlamalar</label>
            <textarea
              rows={4}
              value={form.restrictions.join("\n")}
              onChange={(event) =>
                setForm((prev) =>
                  prev
                    ? {
                        ...prev,
                        restrictions: event.target.value
                          .split("\n")
                          .map((item) => item.trim())
                          .filter(Boolean),
                      }
                    : prev
                )
              }
              className="modern-field w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Öğünler</label>
            <div className="space-y-3">
              {form.meals.map((meal, index) => (
                <div key={`${meal.meal}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
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
                    className="modern-field w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
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
                                      items: event.target.value
                                        .split("\n")
                                        .map((item) => item.trim())
                                        .filter(Boolean),
                                    }
                                  : entry
                              ),
                            }
                          : prev
                      )
                    }
                    className="modern-field mt-2 w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Ek Notlar</label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(event) => setForm((prev) => (prev ? { ...prev, notes: event.target.value } : prev))}
              className="modern-field w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
        </div>
      )}
    </div>
  );
}
