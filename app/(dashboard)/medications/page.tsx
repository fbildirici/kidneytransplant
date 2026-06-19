"use client";
import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { getMedications, setMedications as storeSaveMedications, getMedicationLog, saveMedicationLog, getWeeklyAdherence, getAdherenceStreak } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import {
  Pill, Plus, Check, Clock, Calendar, TrendingUp, Edit2, Trash2, Search, Stethoscope, Save,
} from "lucide-react";
import PageTitle from "@/components/PageTitle";

const CRITICAL_DRUG_PATTERNS = [
  "tacrolimus", "prograf", "mycophenolate", "cellcept", "mofetil",
  "prednizolon", "prednisolone", "siklosporin", "cyclosporine",
  "everolimus", "sirolimus", "azatioprin", "azathioprine",
];

function isCriticalDrug(name: string): boolean {
  const lower = name.toLowerCase();
  return CRITICAL_DRUG_PATTERNS.some((pattern) => lower.includes(pattern));
}

const COLORS = [
  "bg-medical-50 text-medical-700 border-medical-200",
  "bg-success-50 text-success-700 border-success-200",
  "bg-navy-50 text-navy-700 border-navy-200",
  "bg-navy-50 text-navy-700 border-navy-200",
  "bg-medical-50 text-medical-700 border-medical-200",
  "bg-navy-50 text-navy-700 border-navy-200",
];

const FREQ_OPTIONS = ["Günde 1 kez", "Günde 2 kez", "Günde 3 kez", "Günde 4 kez", "Haftada 1 kez"];

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  notes: string;
  color: string;
  active: boolean;
  prescribedBy?: string;
}

const emptyForm = { name: "", dosage: "", frequency: "Günde 2 kez", times: "08:00,20:00", notes: "" };

const TODAY_DATE = new Date().toISOString().split("T")[0];

export default function MedicationsPage() {
  const { user } = useAuth();
  const patientId = user?.uid ?? "1";

  const [medications, setMedications] = useState<Medication[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMed, setEditingMed] = useState<Medication | null>(null);
  const [medForm, setMedForm] = useState(emptyForm);
  const [searchQuery, setSearchQuery] = useState("");
  const [todayLog, setTodayLog] = useState<Record<string, boolean>>({});
  const [weeklyAdherence, setWeeklyAdherence] = useState<{ day: string; taken: number; total: number }[]>([]);
  const [streak, setStreak] = useState(0);

  // Load doctor-prescribed medications from store on mount
  useEffect(() => {
    const stored = getMedications(patientId);
    const mapped: Medication[] = stored.map((m, i) => ({
      id: m.id, name: m.name, dosage: m.dosage, frequency: m.frequency,
      times: m.times, notes: m.notes, active: m.active,
      color: COLORS[i % COLORS.length],
      prescribedBy: m.prescribedBy,
    }));
    setMedications(mapped);
    // Load persisted today log
    const persistedLog = getMedicationLog(patientId, TODAY_DATE);
    const log: Record<string, boolean> = {};
    mapped.forEach((med) => med.times.forEach((t) => { log[`${med.id}-${t}`] = persistedLog[`${med.id}-${t}`] ?? false; }));
    setTodayLog(log);
    setWeeklyAdherence(getWeeklyAdherence(patientId));
    setStreak(getAdherenceStreak(patientId));
  }, [patientId]);

  const toggleTaken = (key: string) => {
    setTodayLog((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      saveMedicationLog(patientId, TODAY_DATE, updated);
      return updated;
    });
  };

  const openAddModal = () => {
    setEditingMed(null);
    setMedForm(emptyForm);
    setShowAddModal(true);
  };

  const openEditModal = (med: Medication) => {
    setEditingMed(med);
    setMedForm({ name: med.name, dosage: med.dosage, frequency: med.frequency, times: med.times.join(","), notes: med.notes });
    setShowAddModal(true);
  };

  const saveMedication = () => {
    if (!medForm.name.trim()) return;
    const times = medForm.times.split(",").map((t) => t.trim()).filter(Boolean);
    if (editingMed) {
      const updated = medications.map((m) =>
        m.id === editingMed.id ? { ...m, ...medForm, times } : m
      );
      setMedications(updated);
      storeSaveMedications(patientId, updated.map((m) => ({
        id: m.id, patientId: patientId, name: m.name, dosage: m.dosage,
        frequency: m.frequency, times: m.times, notes: m.notes,
        prescribedBy: m.prescribedBy || "Hasta", prescribedDate: new Date().toISOString().split("T")[0], active: m.active,
      })));
    } else {
      const newMed: Medication = {
        id: `m-${Date.now()}`, name: medForm.name, dosage: medForm.dosage,
        frequency: medForm.frequency, times, notes: medForm.notes,
        color: COLORS[medications.length % COLORS.length], active: true, prescribedBy: "Hasta",
      };
      const updated = [...medications, newMed];
      setMedications(updated);
      storeSaveMedications(patientId, updated.map((m) => ({
        id: m.id, patientId: patientId, name: m.name, dosage: m.dosage,
        frequency: m.frequency, times: m.times, notes: m.notes,
        prescribedBy: m.prescribedBy || "Hasta", prescribedDate: new Date().toISOString().split("T")[0], active: m.active,
      })));
      // add to today log
      times.forEach((t) => setTodayLog((prev) => ({ ...prev, [`${newMed.id}-${t}`]: false })));
    }
    setShowAddModal(false);
    setEditingMed(null);
  };

  const deleteMedication = (id: string) => {
    const updated = medications.filter((m) => m.id !== id);
    setMedications(updated);
    storeSaveMedications(patientId, updated.map((m) => ({
      id: m.id, patientId: patientId, name: m.name, dosage: m.dosage,
      frequency: m.frequency, times: m.times, notes: m.notes,
      prescribedBy: m.prescribedBy || "Hasta", prescribedDate: "", active: m.active,
    })));
  };

  const filteredMedications = medications.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalDoses = Object.keys(todayLog).length;
  const takenDoses = Object.values(todayLog).filter(Boolean).length;
  const adherenceRate = Math.round((takenDoses / totalDoses) * 100);

  return (
    <>
      <PageTitle title="İlaçlarım" />
      <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-surface rounded-[var(--radius-xl)] border border-border p-5 sm:p-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-navy-600 uppercase tracking-widest mb-1">İlaç Takibi</p>
            <h1 className="text-xl sm:text-2xl font-semibold text-text-primary mb-1">
              Bugünkü İlaçlarım
            </h1>
            <p className="text-sm text-text-secondary">
              Saat, doz ve alındı durumunu güvenle takip edin.
            </p>
          </div>
          <Button size="sm" onClick={openAddModal}>
            <Plus size={15} />
            İlaç Ekle
          </Button>
        </div>

        {/* Safety note */}
        <div className="mt-4 flex items-start gap-2 bg-warning-50 border border-warning-200 rounded-[var(--radius-lg)] px-4 py-3">
          <Stethoscope size={14} className="text-warning-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-warning-700 leading-relaxed">
            <span className="font-semibold">İlaç dozunuzu yalnızca doktorunuzun önerisiyle değiştirin.</span>{" "}
            Bu ekran takip amaçlıdır. Yeni ilaç ekleme veya mevcut dozu değiştirme kararı doktorunuza aittir.
            {medications.length > 0 && medications[0].prescribedBy && medications[0].prescribedBy !== "Hasta" && (
              <span> İlaçlarınız <strong>{medications[0].prescribedBy}</strong> tarafından yazılmıştır.</span>
            )}
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card-navy rounded-[var(--radius-xl)] p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-[var(--radius-lg)] bg-navy-500 flex items-center justify-center shadow-lg shadow-navy-500/25">
              <Pill className="text-white" size={19} />
            </div>
            <span className="text-xs font-semibold text-navy-400 bg-surface/70 px-2 py-0.5 rounded-full">Aktif</span>
          </div>
          <p className="text-xs font-semibold text-navy-500/70 uppercase tracking-wide mb-0.5">Aktif İlaç</p>
          <p className="text-3xl font-bold text-navy-700">{medications.filter((m) => m.active).length}</p>
        </div>
        <div className="stat-card-emerald rounded-[var(--radius-xl)] p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-[var(--radius-lg)] bg-success-500 flex items-center justify-center shadow-subtle">
              <Check className="text-white" size={19} />
            </div>
            <span className="text-xs font-semibold text-success-600 bg-surface/70 px-2 py-0.5 rounded-full">Bugün</span>
          </div>
          <p className="text-xs font-semibold text-success-600/70 uppercase tracking-wide mb-0.5">Alınan Doz</p>
          <p className="text-3xl font-bold text-success-700">
            {takenDoses}<span className="text-xl text-success-500">/{totalDoses}</span>
          </p>
        </div>
        <div className="stat-card-cyan rounded-[var(--radius-xl)] p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-[var(--radius-lg)] bg-medical-500 flex items-center justify-center shadow-subtle">
              <TrendingUp className="text-white" size={19} />
            </div>
            <span className="text-xs font-semibold text-medical-600 bg-surface/70 px-2 py-0.5 rounded-full">Oran</span>
          </div>
          <p className="text-xs font-semibold text-medical-600/70 uppercase tracking-wide mb-0.5">Uyum Oranı</p>
          <p className="text-3xl font-bold text-medical-700">%{isNaN(adherenceRate) ? 0 : adherenceRate}</p>
        </div>
        <div className="stat-card-violet rounded-[var(--radius-xl)] p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-[var(--radius-lg)] bg-navy-500 flex items-center justify-center shadow-subtle">
              <Calendar className="text-white" size={19} />
            </div>
          </div>
          <p className="text-xs font-semibold text-navy-600/70 uppercase tracking-wide mb-0.5">Gün Serisi</p>
          <p className="text-3xl font-bold text-navy-700">{streak}</p>
        </div>
      </div>

      {/* Weekly Adherence Chart */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-text-primary">Haftalık İlaç Uyumu</h2>
        </div>
        <div className="flex items-end justify-between gap-2 h-32">
          {weeklyAdherence.map((day) => {
            const pct = (day.taken / day.total) * 100;
            return (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-surface-muted rounded-[var(--radius-md)] overflow-hidden h-20 flex flex-col justify-end">
                  <div
                    className={`w-full rounded-[var(--radius-md)] transition-all duration-500 ${
                      pct === 100
                        ? "bg-navy-500"
                        : pct >= 80
                          ? "bg-navy-400"
                          : "bg-amber-400"
                    }`}
                    style={{ height: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-text-secondary font-medium">
                  {day.day}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <Card className="lg:col-span-2" padding="sm">
          <div className="flex items-center justify-between p-4 pb-2">
            <div className="flex items-center gap-2">
              <Clock className="text-navy-500" size={20} />
              <h2 className="font-semibold text-text-primary">
                Bugünkü Program
              </h2>
            </div>
            <Badge variant="info">
              {takenDoses}/{totalDoses} alındı
            </Badge>
          </div>
          <div className="divide-y divide-border">
            {medications.map((med) =>
              med.times.map((time) => {
                const key = `${med.id}-${time}`;
                const isTaken = todayLog[key] ?? false;
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between px-4 py-3 hover:bg-surface-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleTaken(key)}
                        className={`w-7 h-7 rounded-[var(--radius-md)] border-2 flex items-center justify-center transition-all duration-300 cursor-pointer ${
                          isTaken
                            ? "bg-navy-500 border-transparent scale-110"
                            : "border-border-hover hover:border-navy-400"
                        }`}
                      >
                        {isTaken && (
                          <Check size={14} className="text-white" />
                        )}
                      </button>
                      <div>
                        <p
                          className={`text-sm font-medium ${isTaken ? "text-text-tertiary line-through" : "text-text-primary"}`}
                        >
                          {med.name}
                        </p>
                        <p className="text-xs text-text-tertiary">{med.dosage}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-text-secondary">
                        <Clock size={14} />
                        <span className="text-sm">{time}</span>
                      </div>
                      {isTaken ? (
                        <Badge variant="success"><Check size={10} /> Alındı</Badge>
                      ) : (
                        <Badge variant="warning"><Clock size={10} /> Bekliyor</Badge>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Medication List */}
        <div className="space-y-4">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
            />
            <input
              type="text"
              placeholder="İlaç ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="modern-field w-full pl-9 pr-4 py-2.5 rounded-[var(--radius-lg)] border border-border text-sm focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent"
            />
          </div>
          {filteredMedications.map((med) => (
            <Card key={med.id} hover padding="sm">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-3 h-3 rounded-full mt-1.5 ${med.color.split(" ")[0]}`}
                  />
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      {med.name}
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {med.dosage} • {med.frequency}
                    </p>
                    <div className="flex gap-1 mt-2">
                      {med.times.map((t) => (
                        <Badge key={t} variant="default">
                          {t}
                        </Badge>
                      ))}
                    </div>
                    {med.notes && (
                      <p className="text-xs text-text-tertiary mt-2">
                        {med.notes}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEditModal(med)} className="p-1.5 rounded-[var(--radius-md)] text-text-tertiary hover:bg-surface-muted hover:text-text-secondary transition-colors cursor-pointer">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => deleteMedication(med.id)} className="p-1.5 rounded-[var(--radius-md)] text-text-tertiary hover:bg-danger-50 hover:text-danger-500 transition-colors cursor-pointer">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Add / Edit Medication Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setEditingMed(null); }}
        title={editingMed ? "İlacı Düzenle" : "Yeni İlaç Ekle"}
        size="md"
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-secondary">İlaç Adı</label>
            <input
              value={medForm.name}
              onChange={(e) => setMedForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Örn: Tacrolimus"
              className="modern-field w-full rounded-[var(--radius-lg)] border border-border bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-secondary">Doz</label>
              <input
                value={medForm.dosage}
                onChange={(e) => setMedForm((p) => ({ ...p, dosage: e.target.value }))}
                placeholder="Örn: 2mg"
                className="modern-field w-full rounded-[var(--radius-lg)] border border-border bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-secondary">Sıklık</label>
              <select
                value={medForm.frequency}
                onChange={(e) => setMedForm((p) => ({ ...p, frequency: e.target.value }))}
                className="modern-field modern-select w-full rounded-[var(--radius-lg)] border border-border bg-surface px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent"
              >
                {FREQ_OPTIONS.map((f) => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-secondary">Alım Saatleri <span className="text-text-tertiary font-normal">(virgülle ayırın)</span></label>
            <input
              value={medForm.times}
              onChange={(e) => setMedForm((p) => ({ ...p, times: e.target.value }))}
              placeholder="08:00,20:00"
              className="modern-field w-full rounded-[var(--radius-lg)] border border-border bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-secondary">Notlar</label>
            <textarea
              rows={3}
              value={medForm.notes}
              onChange={(e) => setMedForm((p) => ({ ...p, notes: e.target.value }))}
              placeholder="İlaç hakkında notlarınız..."
              className="modern-field w-full rounded-[var(--radius-lg)] border border-border bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" className="flex-1" onClick={() => { setShowAddModal(false); setEditingMed(null); }}>
              İptal
            </Button>
            <Button className="flex-1" onClick={saveMedication} disabled={!medForm.name.trim()}>
              <Save size={15} />
              {editingMed ? "Güncelle" : "İlaç Ekle"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
    </>
  );
}
