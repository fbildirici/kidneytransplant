"use client";
import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { getMedications, setMedications as storeSaveMedications } from "@/lib/store";
import {
  Pill, Plus, Check, Clock, Calendar, TrendingUp, Edit2, Trash2, Search, Stethoscope, Save,
} from "lucide-react";
import DemoBadge from "@/components/ui/DemoBadge";
const MY_PATIENT_ID = "1";

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
  "bg-teal-100 text-teal-700 border-teal-200",
  "bg-emerald-100 text-emerald-700 border-emerald-200",
  "bg-cyan-100 text-cyan-700 border-cyan-200",
  "bg-sky-100 text-sky-700 border-sky-200",
  "bg-violet-100 text-violet-700 border-violet-200",
  "bg-indigo-100 text-indigo-700 border-indigo-200",
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

const weekDays = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

// Mock weekly adherence data
const weeklyAdherence = [
  { day: "Pzt", taken: 5, total: 5 },
  { day: "Sal", taken: 5, total: 5 },
  { day: "Çar", taken: 4, total: 5 },
  { day: "Per", taken: 5, total: 5 },
  { day: "Cum", taken: 5, total: 5 },
  { day: "Cmt", taken: 3, total: 5 },
  { day: "Paz", taken: 2, total: 5 },
];

const emptyForm = { name: "", dosage: "", frequency: "Günde 2 kez", times: "08:00,20:00", notes: "" };

export default function MedicationsPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMed, setEditingMed] = useState<Medication | null>(null);
  const [medForm, setMedForm] = useState(emptyForm);
  const [searchQuery, setSearchQuery] = useState("");
  const [todayLog, setTodayLog] = useState<Record<string, boolean>>({});

  // Load doctor-prescribed medications from store on mount
  useEffect(() => {
    const stored = getMedications(MY_PATIENT_ID);
    const mapped: Medication[] = stored.map((m, i) => ({
      id: m.id, name: m.name, dosage: m.dosage, frequency: m.frequency,
      times: m.times, notes: m.notes, active: m.active,
      color: COLORS[i % COLORS.length],
      prescribedBy: m.prescribedBy,
    }));
    setMedications(mapped);
    // Initialize today log with all false
    const log: Record<string, boolean> = {};
    mapped.forEach((med) => med.times.forEach((t) => { log[`${med.id}-${t}`] = false; }));
    setTodayLog(log);
  }, []);

  const toggleTaken = (key: string) => {
    setTodayLog((prev) => ({ ...prev, [key]: !prev[key] }));
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
      storeSaveMedications(MY_PATIENT_ID, updated.map((m) => ({
        id: m.id, patientId: MY_PATIENT_ID, name: m.name, dosage: m.dosage,
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
      storeSaveMedications(MY_PATIENT_ID, updated.map((m) => ({
        id: m.id, patientId: MY_PATIENT_ID, name: m.name, dosage: m.dosage,
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
    storeSaveMedications(MY_PATIENT_ID, updated.map((m) => ({
      id: m.id, patientId: MY_PATIENT_ID, name: m.name, dosage: m.dosage,
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-600 via-navy-500 to-teal-600 p-6 sm:p-7 text-white shadow-xl shadow-navy-500/20">
        <div className="absolute -right-10 -top-10 w-52 h-52 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute inset-0 dot-pattern opacity-10" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Pill size={15} className="text-teal-300" />
              <span className="text-teal-300 text-sm font-semibold">İlaç Yönetimi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-1.5">İlaç Takibi</h1>
            <p className="text-white/60 text-sm">İlaçlarınızı düzenli takip edin, sağlığınızı koruyun.</p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white text-navy-700 hover:bg-white/92 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-navy-900/15 flex-shrink-0"
          >
            <Plus size={15} />
            Yeni İlaç Ekle
          </button>
        </div>
      </div>

      {/* Doctor prescribed notice */}
      {medications.length > 0 && medications[0].prescribedBy && (
        <div className="flex items-center gap-3 p-4 bg-teal-50 border border-teal-200 rounded-2xl">
          <Stethoscope size={18} className="text-teal-600 flex-shrink-0" />
          <p className="text-sm text-teal-800">
            İlaçlarınız <span className="font-bold">{medications[0].prescribedBy}</span> tarafından yazılmıştır. Değişiklik için doktorunuzla iletişime geçin.
          </p>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card-navy rounded-2xl p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-navy-500 flex items-center justify-center shadow-lg shadow-navy-500/25">
              <Pill className="text-white" size={19} />
            </div>
            <span className="text-xs font-semibold text-navy-400 bg-white/70 px-2 py-0.5 rounded-full">Aktif</span>
          </div>
          <p className="text-xs font-semibold text-navy-500/70 uppercase tracking-wide mb-0.5">Aktif İlaç</p>
          <p className="text-3xl font-black text-navy-700">{medications.filter((m) => m.active).length}</p>
        </div>
        <div className="stat-card-emerald rounded-2xl p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Check className="text-white" size={19} />
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-white/70 px-2 py-0.5 rounded-full">Bugün</span>
          </div>
          <p className="text-xs font-semibold text-emerald-600/70 uppercase tracking-wide mb-0.5">Alınan Doz</p>
          <p className="text-3xl font-black text-emerald-700">
            {takenDoses}<span className="text-xl text-emerald-500">/{totalDoses}</span>
          </p>
        </div>
        <div className="stat-card-cyan rounded-2xl p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <TrendingUp className="text-white" size={19} />
            </div>
            <span className="text-xs font-semibold text-cyan-600 bg-white/70 px-2 py-0.5 rounded-full">Oran</span>
          </div>
          <p className="text-xs font-semibold text-cyan-600/70 uppercase tracking-wide mb-0.5">Uyum Oranı</p>
          <p className="text-3xl font-black text-cyan-700">%{isNaN(adherenceRate) ? 0 : adherenceRate}</p>
        </div>
        <div className="stat-card-violet rounded-2xl p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-violet-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Calendar className="text-white" size={19} />
            </div>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">Demo</span>
          </div>
          <p className="text-xs font-semibold text-violet-600/70 uppercase tracking-wide mb-0.5">Gün Serisi</p>
          <p className="text-3xl font-black text-violet-700">12</p>
        </div>
      </div>

      {/* Weekly Adherence Chart */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-900">Haftalık İlaç Uyumu</h2>
          <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">Örnek veri</span>
        </div>
        <div className="flex items-end justify-between gap-2 h-32">
          {weeklyAdherence.map((day) => {
            const pct = (day.taken / day.total) * 100;
            return (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-slate-100 rounded-lg overflow-hidden h-20 flex flex-col justify-end">
                  <div
                    className={`w-full rounded-lg transition-all duration-500 ${
                      pct === 100
                        ? "bg-gradient-to-t from-navy-500 to-teal-400"
                        : pct >= 80
                          ? "bg-gradient-to-t from-navy-400 to-teal-300"
                          : "bg-gradient-to-t from-amber-400 to-amber-300"
                    }`}
                    style={{ height: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500 font-medium">
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
              <h2 className="font-semibold text-slate-900">
                Bugünkü Program
              </h2>
            </div>
            <Badge variant="info">
              {takenDoses}/{totalDoses} alındı
            </Badge>
          </div>
          <div className="divide-y divide-slate-50">
            {medications.map((med) =>
              med.times.map((time) => {
                const key = `${med.id}-${time}`;
                const isTaken = todayLog[key] ?? false;
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between px-4 py-3 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleTaken(key)}
                        className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-300 cursor-pointer ${
                          isTaken
                            ? "bg-gradient-to-r from-navy-500 to-teal-500 border-transparent scale-110"
                            : "border-slate-300 hover:border-navy-400"
                        }`}
                      >
                        {isTaken && (
                          <Check size={14} className="text-white" />
                        )}
                      </button>
                      <div>
                        <p
                          className={`text-sm font-medium ${isTaken ? "text-slate-400 line-through" : "text-slate-900"}`}
                        >
                          {med.name}
                        </p>
                        <p className="text-xs text-slate-400">{med.dosage}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Clock size={14} />
                        <span className="text-sm">{time}</span>
                      </div>
                      {isTaken ? (
                        <Badge variant="success">Alındı</Badge>
                      ) : (
                        <Badge variant="warning">Bekliyor</Badge>
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
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="İlaç ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="modern-field w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent"
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
                    <p className="text-sm font-semibold text-slate-900">
                      {med.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
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
                      <p className="text-xs text-slate-400 mt-2">
                        {med.notes}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEditModal(med)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => deleteMedication(med.id)} className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer">
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
            <label className="block text-sm font-medium text-slate-700">İlaç Adı</label>
            <input
              value={medForm.name}
              onChange={(e) => setMedForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Örn: Tacrolimus"
              className="modern-field w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Doz</label>
              <input
                value={medForm.dosage}
                onChange={(e) => setMedForm((p) => ({ ...p, dosage: e.target.value }))}
                placeholder="Örn: 2mg"
                className="modern-field w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Sıklık</label>
              <select
                value={medForm.frequency}
                onChange={(e) => setMedForm((p) => ({ ...p, frequency: e.target.value }))}
                className="modern-field modern-select w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent"
              >
                {FREQ_OPTIONS.map((f) => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Alım Saatleri <span className="text-slate-400 font-normal">(virgülle ayırın)</span></label>
            <input
              value={medForm.times}
              onChange={(e) => setMedForm((p) => ({ ...p, times: e.target.value }))}
              placeholder="08:00,20:00"
              className="modern-field w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Notlar</label>
            <textarea
              rows={3}
              value={medForm.notes}
              onChange={(e) => setMedForm((p) => ({ ...p, notes: e.target.value }))}
              placeholder="İlaç hakkında notlarınız..."
              className="modern-field w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent resize-none"
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
  );
}
