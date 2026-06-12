"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import {
  createPatient,
  getDietPlan,
  getLatestLabPoint,
  getMedications,
  getPatients,
  LabDataPoint,
  PatientRecord,
  StoredDietPlan,
  StoredMedication,
} from "@/lib/store";
import {
  Activity,
  Apple,
  FilePlus2,
  Pill,
  Plus,
  Stethoscope,
  TrendingUp,
  Users,
} from "lucide-react";
import PageTitle from "@/components/PageTitle";

const DOCTOR_NAME = "Dr. Ayşe Kaya";
const DIETITIAN_NAME = "Dyt. Zeynep Arslan";

const emptyPatientForm = {
  name: "",
  age: "45",
  transplantDate: "2026-04-01",
  bloodGroup: "A Rh+",
  weight: "70 kg",
  bmi: "24.0",
  epicrisis: "",
  notes: "",
  medicationName: "Tacrolimus (Prograf)",
  medicationDosage: "1mg",
  medicationFrequency: "Günde 2 kez",
  medicationTimes: "08:00,20:00",
  medicationNotes: "",
  calorieTarget: "2000",
  proteinTarget: "80g/gün",
  potassiumLimit: "2.5g/gün",
  phosphorusLimit: "1000mg/gün",
  fluidLimit: "2L/gün",
  dietNotes: "",
  creatinine: "1.2",
  gfr: "65",
  tacrolimus: "9.5",
};

function statusBadge(status: PatientRecord["status"]) {
  if (status === "critical") return "bg-red-100 text-red-700";
  if (status === "warning") return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
}

export default function DoctorDashboard() {
  const [patients, setPatients] = useState<PatientRecord[]>(() => getPatients());
  const [selectedPatientId, setSelectedPatientId] = useState<string>(() => getPatients()[0]?.id ?? "");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState(emptyPatientForm);

  const selectedPatient = useMemo(
    () => patients.find((patient) => patient.id === selectedPatientId) ?? null,
    [patients, selectedPatientId]
  );

  const selectedMeds = selectedPatient ? getMedications(selectedPatient.id) : [];
  const selectedDiet = selectedPatient ? getDietPlan(selectedPatient.id) : null;
  const selectedLabs = selectedPatient ? getLatestLabPoint(selectedPatient.id) : null;

  const stats = {
    total: patients.length,
    critical: patients.filter((patient) => patient.status === "critical").length,
    avgCreatinine: (
      patients
        .map((patient) => Number.parseFloat(patient.creatinine))
        .filter((value) => Number.isFinite(value))
        .reduce((sum, value, _, arr) => sum + value / Math.max(1, arr.length), 0)
    ).toFixed(2),
  };

  const createNewPatient = () => {
    const medicationTimes = form.medicationTimes
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const medications: StoredMedication[] = form.medicationName.trim()
      ? [
          {
            id: "",
            patientId: "",
            name: form.medicationName,
            dosage: form.medicationDosage,
            frequency: form.medicationFrequency,
            times: medicationTimes,
            notes: form.medicationNotes,
            prescribedBy: DOCTOR_NAME,
            prescribedDate: form.transplantDate,
            active: true,
          },
        ]
      : [];

    const dietPlan: StoredDietPlan = {
      patientId: "",
      prescribedBy: DIETITIAN_NAME,
      calorieTarget: Number(form.calorieTarget) || 2000,
      proteinTarget: form.proteinTarget,
      potassiumLimit: form.potassiumLimit,
      phosphorusLimit: form.phosphorusLimit,
      fluidLimit: form.fluidLimit,
      restrictions: ["Greyfurt/Pomelo yasak"],
      meals: [],
      notes: form.dietNotes,
      lastUpdated: form.transplantDate,
      updatedByRole: "doctor",
      patientEditable: true,
      patientNotes: [],
    };

    const labs: LabDataPoint[] = [
      {
        date: form.transplantDate,
        creatinine: Number(form.creatinine),
        gfr: Number(form.gfr),
        tacrolimus: Number(form.tacrolimus),
        sourceType: "manual",
        sourceLabel: "İlk doktor kaydı",
        importedBy: DOCTOR_NAME,
      },
    ];

    const created = createPatient(
      {
        name: form.name,
        age: Number(form.age),
        transplantDate: form.transplantDate,
        lastVisit: form.transplantDate,
        pendingMessages: 0,
        bloodGroup: form.bloodGroup,
        weight: form.weight,
        bmi: form.bmi,
        assignedDoctorName: DOCTOR_NAME,
        assignedDietitianName: DIETITIAN_NAME,
        epicrisis: form.epicrisis || `${form.name} için yeni hasta kaydı oluşturuldu.`,
        notes: form.notes,
      },
      {
        medications,
        dietPlan,
        labs,
      }
    );

    const nextPatients = getPatients();
    setPatients(nextPatients);
    setSelectedPatientId(created.id);
    setShowCreateModal(false);
    setForm(emptyPatientForm);
  };

  return (
    <>
      <PageTitle title="Doktor Paneli" />
      <div className="space-y-6 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-[var(--radius-xl)] bg-navy-700 p-6 sm:p-7 text-white shadow-elevated">
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Stethoscope size={15} className="text-white/70" />
              <span className="text-white/70 text-sm font-semibold">Doktor Paneli</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1.5">Nakil Hasta Yönetimi</h1>
            <p className="text-white/65 text-sm">Yeni hasta kaydı, ilk ilaç dozu, diyet planı ve laboratuvar başlangıç verisini tek yerden yönetin.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] bg-surface px-4 py-3 text-sm font-semibold text-teal-700 shadow-elevated shadow-teal-900/15 transition-colors hover:bg-white/90 cursor-pointer"
          >
            <Plus size={16} />
            Yeni Hasta Aç
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-[var(--radius-xl)] bg-surface border border-border p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">Aktif Hasta</p>
          <p className="mt-2 text-3xl font-bold text-text-primary">{stats.total}</p>
        </div>
        <div className="rounded-[var(--radius-xl)] bg-surface border border-border p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">Kritik Hasta</p>
          <p className="mt-2 text-3xl font-bold text-red-600">{stats.critical}</p>
        </div>
        <div className="rounded-[var(--radius-xl)] bg-surface border border-border p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">Ort. Kreatinin</p>
          <p className="mt-2 text-3xl font-bold text-text-primary">{stats.avgCreatinine}</p>
          <p className="text-xs text-text-muted">mg/dL</p>
        </div>
        <div className="rounded-[var(--radius-xl)] bg-surface border border-border p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">Hızlı Erişim</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/doctor/labs" className="rounded-[var(--radius-lg)] bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-700">
              Laboratuvar Merkezi
            </Link>
            <Link href="/doctor/appointments" className="rounded-[var(--radius-lg)] bg-slate-100 px-3 py-2 text-xs font-semibold text-text-secondary">
              Randevular
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
        <div className="rounded-[var(--radius-xl)] border border-border bg-surface shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-text-primary">Hastalar</p>
              <p className="text-xs text-text-muted">Doktorun yönettiği tüm kayıtlar</p>
            </div>
            <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
              {patients.length}
            </span>
          </div>

          <div className="divide-y divide-border">
            {patients.map((patient) => (
              <button
                key={patient.id}
                type="button"
                onClick={() => setSelectedPatientId(patient.id)}
                className={`w-full text-left px-5 py-4 transition-colors cursor-pointer ${
                  selectedPatientId === patient.id ? "bg-teal-50/70" : "hover:bg-surface-muted"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[var(--radius-lg)] bg-medical-500 flex items-center justify-center text-white text-sm font-bold">
                      {patient.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{patient.name}</p>
                      <p className="text-xs text-text-muted">
                        Kreatinin {patient.creatinine} · Tac {patient.tacrolimusLevel}
                      </p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge(patient.status)}`}>
                    {patient.status === "critical" ? "Kritik" : patient.status === "warning" ? "Dikkat" : "Stabil"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {selectedPatient ? (
            <>
              <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-5 shadow-card">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Users size={15} className="text-teal-600" />
                      <span className="text-xs font-semibold uppercase tracking-wide text-teal-700">Hasta Kartı</span>
                    </div>
                    <h2 className="text-2xl font-bold text-text-primary">{selectedPatient.name}</h2>
                    <p className="text-sm text-text-tertiary">
                      Nakil: {selectedPatient.transplantDate} · Kan Grubu: {selectedPatient.bloodGroup} · BMI: {selectedPatient.bmi}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href="/doctor/labs" className="rounded-[var(--radius-lg)] bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-700">
                      Lab Gir
                    </Link>
                    <Link href="/doctor/appointments" className="rounded-[var(--radius-lg)] bg-slate-100 px-3 py-2 text-xs font-semibold text-text-secondary">
                      Randevu Takvimi
                    </Link>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-[var(--radius-xl)] bg-surface-muted p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">Son Kreatinin</p>
                    <p className="mt-1 text-2xl font-bold text-text-primary">{selectedPatient.creatinine}</p>
                  </div>
                  <div className="rounded-[var(--radius-xl)] bg-surface-muted p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">Tacrolimus</p>
                    <p className="mt-1 text-2xl font-bold text-text-primary">{selectedPatient.tacrolimusLevel}</p>
                  </div>
                  <div className="rounded-[var(--radius-xl)] bg-surface-muted p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">İlaç Sayısı</p>
                    <p className="mt-1 text-2xl font-bold text-text-primary">{selectedMeds.length}</p>
                  </div>
                  <div className="rounded-[var(--radius-xl)] bg-surface-muted p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">Son Ziyaret</p>
                    <p className="mt-1 text-2xl font-bold text-text-primary">{selectedPatient.lastVisit}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-5 shadow-card">
                  <div className="flex items-center gap-2 mb-4">
                    <Pill size={18} className="text-teal-600" />
                    <p className="text-sm font-bold text-text-primary">Başlangıç / Güncel İlaç Planı</p>
                  </div>
                  <div className="space-y-3">
                    {selectedMeds.length === 0 ? (
                      <p className="text-sm text-text-muted">Henüz ilaç planı tanımlanmamış.</p>
                    ) : (
                      selectedMeds.map((medication) => (
                        <div key={medication.id} className="rounded-[var(--radius-xl)] border border-border bg-surface-muted p-4">
                          <p className="text-sm font-semibold text-text-primary">{medication.name}</p>
                          <p className="text-xs text-text-tertiary">
                            {medication.dosage} · {medication.frequency} · {medication.times.join(", ")}
                          </p>
                          {medication.notes && <p className="mt-2 text-xs text-text-tertiary">{medication.notes}</p>}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-5 shadow-card">
                  <div className="flex items-center gap-2 mb-4">
                    <Apple size={18} className="text-emerald-600" />
                    <p className="text-sm font-bold text-text-primary">Diyet Planı Özeti</p>
                  </div>
                  {selectedDiet ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-[var(--radius-xl)] bg-emerald-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Kalori</p>
                          <p className="mt-1 text-xl font-bold text-text-primary">{selectedDiet.calorieTarget} kcal</p>
                        </div>
                        <div className="rounded-[var(--radius-xl)] bg-emerald-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Protein</p>
                          <p className="mt-1 text-xl font-bold text-text-primary">{selectedDiet.proteinTarget}</p>
                        </div>
                      </div>
                      <p className="text-sm text-text-secondary">{selectedDiet.notes || "Ek not girilmemiş."}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-text-muted">Henüz diyet planı oluşturulmamış.</p>
                  )}
                </div>
              </div>

              <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-5 shadow-card">
                <div className="flex items-center gap-2 mb-4">
                  <Activity size={18} className="text-cyan-600" />
                  <p className="text-sm font-bold text-text-primary">En Son Laboratuvar Özeti</p>
                </div>
                {selectedLabs ? (
                  <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
                    {[
                      { label: "Kreatinin", value: selectedLabs.creatinine, unit: "mg/dL" },
                      { label: "GFR", value: selectedLabs.gfr, unit: "mL/min" },
                      { label: "Tacrolimus", value: selectedLabs.tacrolimus, unit: "ng/mL" },
                      { label: "Üre", value: selectedLabs.urea, unit: "mg/dL" },
                      { label: "Potasyum", value: selectedLabs.potassium, unit: "mmol/L" },
                      { label: "Fosfor", value: selectedLabs.phosphorus, unit: "mg/dL" },
                    ].map((item) => (
                      <div key={item.label} className="rounded-[var(--radius-xl)] bg-cyan-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">{item.label}</p>
                        <p className="mt-1 text-xl font-bold text-text-primary">
                          {item.value !== undefined ? item.value : "-"} {item.unit}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-text-muted">Hasta için laboratuvar kaydı bulunmuyor.</p>
                )}
              </div>

              <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-5 shadow-card">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={18} className="text-violet-600" />
                  <p className="text-sm font-bold text-text-primary">Epikriz / Klinik Not</p>
                </div>
                <p className="text-sm leading-6 text-text-secondary">{selectedPatient.epicrisis}</p>
              </div>
            </>
          ) : (
            <div className="rounded-[var(--radius-xl)] border border-dashed border-border-strong bg-surface p-10 text-center text-sm text-text-muted">
              Hastaları görmek için önce bir kayıt seçin.
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Yeni Hasta Kaydı" size="lg">
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { key: "name", label: "Hasta Adı" },
              { key: "age", label: "Yaş", type: "number" },
              { key: "transplantDate", label: "Nakil / Kayıt Tarihi", type: "date" },
              { key: "bloodGroup", label: "Kan Grubu" },
              { key: "weight", label: "Kilo" },
              { key: "bmi", label: "BMI" },
            ].map((field) => (
              <div key={field.key}>
                <label className="mb-1 block text-xs font-medium text-text-secondary">{field.label}</label>
                <input
                  type={field.type || "text"}
                  value={form[field.key as keyof typeof form]}
                  onChange={(event) => setForm((prev) => ({ ...prev, [field.key]: event.target.value }))}
                  className="modern-field w-full rounded-[var(--radius-lg)] border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-text-secondary">Epikriz</label>
            <textarea
              rows={3}
              value={form.epicrisis}
              onChange={(event) => setForm((prev) => ({ ...prev, epicrisis: event.target.value }))}
              className="modern-field w-full resize-none rounded-[var(--radius-lg)] border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <div className="rounded-[var(--radius-xl)] border border-border bg-surface-muted p-4">
              <div className="mb-3 flex items-center gap-2">
                <Pill size={16} className="text-teal-600" />
                <p className="text-sm font-bold text-text-primary">İlk İlaç Dozu</p>
              </div>
              <div className="space-y-2">
                {[
                  { key: "medicationName", label: "İlaç" },
                  { key: "medicationDosage", label: "Doz" },
                  { key: "medicationFrequency", label: "Sıklık" },
                  { key: "medicationTimes", label: "Saatler" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="mb-1 block text-xs font-medium text-text-secondary">{field.label}</label>
                    <input
                      type="text"
                      value={form[field.key as keyof typeof form]}
                      onChange={(event) => setForm((prev) => ({ ...prev, [field.key]: event.target.value }))}
                      className="modern-field w-full rounded-[var(--radius-lg)] border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[var(--radius-xl)] border border-border bg-surface-muted p-4">
              <div className="mb-3 flex items-center gap-2">
                <Apple size={16} className="text-emerald-600" />
                <p className="text-sm font-bold text-text-primary">İlk Diyet Planı</p>
              </div>
              <div className="space-y-2">
                {[
                  { key: "calorieTarget", label: "Kalori" },
                  { key: "proteinTarget", label: "Protein" },
                  { key: "potassiumLimit", label: "Potasyum" },
                  { key: "fluidLimit", label: "Sıvı" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="mb-1 block text-xs font-medium text-text-secondary">{field.label}</label>
                    <input
                      type="text"
                      value={form[field.key as keyof typeof form]}
                      onChange={(event) => setForm((prev) => ({ ...prev, [field.key]: event.target.value }))}
                      className="modern-field w-full rounded-[var(--radius-lg)] border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[var(--radius-xl)] border border-border bg-surface-muted p-4">
              <div className="mb-3 flex items-center gap-2">
                <TrendingUp size={16} className="text-cyan-600" />
                <p className="text-sm font-bold text-text-primary">İlk Laboratuvar</p>
              </div>
              <div className="space-y-2">
                {[
                  { key: "creatinine", label: "Kreatinin" },
                  { key: "gfr", label: "GFR" },
                  { key: "tacrolimus", label: "Tacrolimus" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="mb-1 block text-xs font-medium text-text-secondary">{field.label}</label>
                    <input
                      type="text"
                      value={form[field.key as keyof typeof form]}
                      onChange={(event) => setForm((prev) => ({ ...prev, [field.key]: event.target.value }))}
                      className="modern-field w-full rounded-[var(--radius-lg)] border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="flex-1 rounded-[var(--radius-lg)] border border-border px-4 py-3 text-sm font-semibold text-text-secondary hover:bg-surface-muted cursor-pointer"
            >
              İptal
            </button>
            <button
              type="button"
              onClick={createNewPatient}
              disabled={!form.name.trim()}
              className="flex-1 rounded-[var(--radius-lg)] bg-teal-500 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="flex items-center justify-center gap-2">
                <FilePlus2 size={16} />
                Hasta Kaydını Oluştur
              </span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
    </>
  );
}
