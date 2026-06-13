"use client";

import { useEffect, useState } from "react";
import {
  getDietPlan,
  setDietPlan,
  StoredDietPlan,
} from "@/lib/store";
import {
  Apple,
  Droplets,
  Edit2,
  Save,
  Shield,
  MessageSquare,
  Check,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/lib/toast-context";
import PageTitle from "@/components/PageTitle";
import Link from "next/link";

const PATIENT_ID = "1";

export default function NutritionPage() {
  const [plan, setPlan] = useState<StoredDietPlan | null>(null);
  const [editing, setEditing] = useState(false);
  const [waterGlasses, setWaterGlasses] = useState(5);
  const [form, setForm] = useState<StoredDietPlan | null>(null);
  const toast = useToast();

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
    toast.addToast("Diyet planı güncellendi.", "success");
  };

  return (
    <>
      <PageTitle title="Beslenme" />
      <div className="space-y-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="bg-surface rounded-[var(--radius-xl)] border border-border p-5 sm:p-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-navy-600 uppercase tracking-widest mb-1">Beslenme</p>
            <h1 className="text-xl sm:text-2xl font-semibold text-text-primary mb-1">
              Beslenme Planı
            </h1>
            <p className="text-sm text-text-secondary">
              Diyetisyeninizin önerilerini görün, su hedefini takip edin ve sorularınızı iletin.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {!editing && plan && (
              <button
                type="button"
                onClick={() => { setEditing(true); setForm(plan); }}
                className="inline-flex items-center gap-1.5 rounded-[var(--radius-lg)] border border-border bg-surface px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface-muted transition-colors cursor-pointer"
              >
                <Edit2 size={14} />
                Düzenle
              </button>
            )}
          </div>
        </div>

        {/* Nutrition safety note */}
        <div className="mt-4 flex items-start gap-2 bg-warning-50 border border-warning-200 rounded-[var(--radius-lg)] px-4 py-3">
          <Shield size={14} className="text-warning-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-warning-700 leading-relaxed">
            <span className="font-semibold">Beslenme önerileri kişisel sağlık durumunuza göre değişebilir.</span>{" "}
            Potasyum, fosfor, sodyum ve protein hedeflerinizi doktorunuz veya diyetisyeniniz belirlemelidir.
            Listelenen değerler genel kılavuz niteliğindedir.
          </p>
        </div>
      </div>

      {plan && !editing && (
        <>
          {/* Metric cards */}
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 xl:grid-cols-5">
            {[
              { label: "Kalori Hedefi", value: `${plan.calorieTarget}`, unit: "kcal/gün", bg: "bg-warning-50", border: "border-warning-200", text: "text-warning-700" },
              { label: "Protein Hedefi", value: plan.proteinTarget, unit: "", bg: "bg-navy-50", border: "border-navy-200", text: "text-navy-700" },
              { label: "Potasyum Sınırı", value: plan.potassiumLimit, unit: "", bg: "bg-warning-50", border: "border-warning-200", text: "text-warning-700" },
              { label: "Fosfor Sınırı", value: plan.phosphorusLimit, unit: "", bg: "bg-medical-50", border: "border-medical-200", text: "text-medical-700" },
              { label: "Sıvı Hedefi", value: plan.fluidLimit, unit: "", bg: "bg-info-50", border: "border-info-200", text: "text-info-700" },
            ].map((item) => (
              <div key={item.label} className={`rounded-[var(--radius-xl)] border ${item.border} ${item.bg} p-4`}>
                <p className={`text-[10px] font-semibold uppercase tracking-wide ${item.text} opacity-70 mb-2`}>{item.label}</p>
                <p className={`text-xl font-bold tabular-nums ${item.text}`}>{item.value}</p>
                {item.unit && <p className={`text-xs ${item.text} opacity-60 mt-0.5`}>{item.unit}</p>}
              </div>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.3fr,0.7fr]">
            {/* Meal plan */}
            <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-[var(--radius-md)] bg-success-50 flex items-center justify-center">
                    <Apple size={15} className="text-success-600" />
                  </div>
                  <p className="text-sm font-semibold text-text-primary">Öğün Planı</p>
                </div>
                <span className="text-[10px] font-medium text-text-muted bg-surface-muted px-2 py-1 rounded border border-border">
                  Diyetisyen planı
                </span>
              </div>
              <div className="space-y-2.5">
                {plan.meals.map((meal, index) => (
                  <div key={`${meal.meal}-${index}`} className="rounded-[var(--radius-lg)] border border-border bg-surface-muted p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 rounded-full bg-success-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-[9px] font-bold text-success-700">{index + 1}</span>
                      </div>
                      <p className="text-sm font-semibold text-text-primary">{meal.meal}</p>
                    </div>
                    <ul className="space-y-1.5 pl-7">
                      {meal.items.map((item, itemIndex) => (
                        <li key={`${meal.meal}-${itemIndex}`} className="flex items-start gap-1.5">
                          <Check size={11} className="text-success-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-text-secondary">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {/* Water tracker */}
              <div className="rounded-[var(--radius-xl)] border border-info-200 bg-info-50 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Droplets size={16} className="text-info-600" />
                  <p className="text-sm font-semibold text-info-800">Günlük Su Takibi</p>
                </div>

                {/* Visual glasses */}
                <div className="flex gap-1.5 flex-wrap mb-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setWaterGlasses(i + 1 <= waterGlasses && waterGlasses === i + 1 ? i : i + 1)}
                      className={`w-8 h-10 rounded-[var(--radius-md)] border-2 flex items-center justify-center transition-all cursor-pointer ${
                        i < waterGlasses
                          ? "border-info-400 bg-info-400"
                          : "border-info-200 bg-white/60"
                      }`}
                      aria-label={`${i + 1}. bardak`}
                    >
                      <Droplets size={12} className={i < waterGlasses ? "text-white" : "text-info-200"} />
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold tabular-nums text-info-700">{waterGlasses}<span className="text-base text-info-500">/8</span></p>
                    <p className="text-xs text-info-600">bardak içildi</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setWaterGlasses((v) => Math.max(0, v - 1))}
                      className="w-8 h-8 rounded-full border-2 border-info-300 text-info-600 font-bold text-sm hover:bg-info-100 cursor-pointer flex items-center justify-center transition-colors"
                    >−</button>
                    <button
                      type="button"
                      onClick={() => setWaterGlasses((v) => Math.min(8, v + 1))}
                      className="w-8 h-8 rounded-full border-2 border-info-300 text-info-600 font-bold text-sm hover:bg-info-100 cursor-pointer flex items-center justify-center transition-colors"
                    >+</button>
                  </div>
                </div>
              </div>

              {/* Restrictions */}
              <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle size={15} className="text-warning-600" />
                  <p className="text-sm font-semibold text-text-primary">Beslenme Kısıtlamaları</p>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {plan.restrictions.map((restriction, index) => (
                    <span key={`${restriction}-${index}`} className="rounded-full border border-warning-200 bg-warning-50 px-2.5 py-1 text-xs font-semibold text-warning-700">
                      {restriction}
                    </span>
                  ))}
                </div>
                {plan.notes && (
                  <p className="text-xs text-text-secondary leading-relaxed border-t border-border pt-3">{plan.notes}</p>
                )}
              </div>

              {/* Dietitian contact */}
              <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-4">
                <p className="text-xs font-semibold text-text-primary mb-2">Beslenme sorunuz mu var?</p>
                <p className="text-xs text-text-secondary mb-3 leading-relaxed">
                  Plan hakkında soru sormak veya değişiklik talep etmek için mesaj gönderin.
                </p>
                <Link href="/messages">
                  <button type="button" className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-600 hover:text-navy-700 cursor-pointer transition-colors">
                    <MessageSquare size={13} />
                    Diyetisyene Mesaj Gönder
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      {editing && form && (
        <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-text-primary">Hasta Düzenleme Modu</p>
              <p className="text-xs text-text-tertiary">Kalori hedefleri, kısıtlamalar ve öğünleri hasta olarak güncelleyebilirsiniz.</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-[var(--radius-lg)] border border-border px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface-muted cursor-pointer"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-[var(--radius-lg)] bg-success-500 px-4 py-2 text-sm font-semibold text-white hover:bg-success-600 cursor-pointer"
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
                <label className="mb-1 block text-xs font-medium text-text-tertiary">{field.label}</label>
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
                  className="w-full rounded-[var(--radius-lg)] border border-border bg-surface px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-navy-500"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-text-tertiary">Kısıtlamalar</label>
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
              className="w-full resize-none rounded-[var(--radius-lg)] border border-border bg-surface px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-text-tertiary">Öğünler</label>
            <div className="space-y-3">
              {form.meals.map((meal, index) => (
                <div key={`${meal.meal}-${index}`} className="rounded-[var(--radius-lg)] border border-border bg-surface-muted p-4">
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
                    className="w-full rounded-[var(--radius-lg)] border border-border bg-surface px-3 py-2 text-sm font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-navy-500"
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
                    className="mt-2 w-full resize-none rounded-[var(--radius-lg)] border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-navy-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-text-tertiary">Ek Notlar</label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(event) => setForm((prev) => (prev ? { ...prev, notes: event.target.value } : prev))}
              className="w-full resize-none rounded-[var(--radius-lg)] border border-border bg-surface px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
          </div>
        </div>
      )}
    </div>
    </>
  );
}
