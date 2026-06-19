"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import PageTitle from "@/components/PageTitle";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import LineChart from "@/components/charts/LineChart";
import type { ChartSeries } from "@/components/charts/LineChart";
import {
  getPatient, updatePatient, getMedications, getLabData, getDietPlan,
  getDoctorMessages,
  LAB_METRIC_DEFINITIONS,
  type PatientRecord, type StoredMedication, type LabDataPoint, type StoredDietPlan,
} from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import {
  ArrowLeft, User, Pill, FlaskConical, Utensils,
  MessageSquare, FileText, AlertTriangle, CheckCircle,
  Edit2, Save, X, Heart,
} from "lucide-react";

const TABS = [
  { id: "overview", label: "Genel Bakış", icon: User },
  { id: "medications", label: "İlaçlar", icon: Pill },
  { id: "labs", label: "Laboratuvar", icon: FlaskConical },
  { id: "diet", label: "Diyet", icon: Utensils },
  { id: "messages", label: "Mesajlar", icon: MessageSquare },
  { id: "notes", label: "Klinik Notlar", icon: FileText },
] as const;

type TabId = (typeof TABS)[number]["id"];

function StatusChip({ status }: { status: PatientRecord["status"] }) {
  if (status === "stable") return <Badge variant="success"><CheckCircle size={11} /> Stabil</Badge>;
  if (status === "warning") return <Badge variant="warning"><AlertTriangle size={11} /> Uyarı</Badge>;
  return <Badge variant="danger"><AlertTriangle size={11} /> Kritik</Badge>;
}

function PatientOverviewTab({ patient, medications, latestLab }: { patient: PatientRecord; medications: StoredMedication[]; latestLab: LabDataPoint | null }) {
  return (
    <div className="space-y-5">
      {/* Epikriz */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Heart size={15} className="text-danger-500" />
          <h3 className="font-semibold text-text-primary text-sm">Epikriz</h3>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">{patient.epicrisis}</p>
      </Card>

      {/* Key metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Kreatinin", value: patient.creatinine, sub: "Son değer", color: "text-medical-700" },
          { label: "Tacrolimus", value: patient.tacrolimusLevel, sub: "Son değer", color: "text-indigo-700" },
          { label: "GFR", value: latestLab?.gfr ? `${latestLab.gfr.toFixed(1)} mL/min` : "—", sub: "Son değer", color: "text-success-700" },
          { label: "CRP", value: latestLab?.crp ? `${latestLab.crp.toFixed(1)} mg/L` : "—", sub: "İnflamasyon", color: "text-text-primary" },
        ].map((m) => (
          <div key={m.label} className="bg-surface-muted rounded-[var(--radius-xl)] p-4 border border-border">
            <p className="text-xs text-text-tertiary mb-1">{m.label}</p>
            <p className={`text-lg font-bold ${m.color}`}>{m.value}</p>
            <p className="text-[10px] text-text-tertiary mt-0.5">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Patient info */}
      <Card>
        <h3 className="font-semibold text-text-primary text-sm mb-3">Hasta Bilgileri</h3>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          {[
            ["Ad Soyad", patient.name],
            ["Yaş", `${patient.age} yaş`],
            ["Kan Grubu", patient.bloodGroup],
            ["Kilo / BMI", `${patient.weight} · BMI ${patient.bmi}`],
            ["Nakil Tarihi", patient.transplantDate],
            ["Son Ziyaret", patient.lastVisit],
            ["Sorumlu Doktor", patient.assignedDoctorName],
            ["Diyetisyen", patient.assignedDietitianName],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between border-b border-border pb-2 last:border-0">
              <span className="text-text-tertiary">{label}</span>
              <span className="font-medium text-text-primary">{value}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Active medications summary */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-text-primary text-sm">Aktif İlaçlar</h3>
          <Badge variant="info">{medications.filter((m) => m.active).length} ilaç</Badge>
        </div>
        <div className="space-y-2">
          {medications.filter((m) => m.active).map((med) => (
            <div key={med.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium text-text-primary">{med.name}</p>
                <p className="text-xs text-text-tertiary">{med.dosage} · {med.frequency}</p>
              </div>
              <div className="flex gap-1">
                {med.times.map((t) => <Badge key={t} variant="default">{t}</Badge>)}
              </div>
            </div>
          ))}
          {medications.length === 0 && <p className="text-sm text-text-tertiary">İlaç kaydı bulunamadı.</p>}
        </div>
      </Card>
    </div>
  );
}

function MedicationsTab({ patientId, medications }: { patientId: string; medications: StoredMedication[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-text-primary">Reçeteli İlaçlar</h3>
      </div>
      {medications.map((med) => (
        <Card key={med.id} padding="sm">
          <div className="flex items-start justify-between p-1">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-text-primary">{med.name}</p>
                {med.active
                  ? <Badge variant="success">Aktif</Badge>
                  : <Badge variant="default">Pasif</Badge>}
              </div>
              <p className="text-sm text-text-secondary">{med.dosage} · {med.frequency}</p>
              <div className="flex gap-1 mt-2 flex-wrap">
                {med.times.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-navy-50 text-navy-700 border border-navy-200 font-medium">{t}</span>
                ))}
              </div>
              {med.notes && <p className="text-xs text-text-tertiary mt-1.5 italic">{med.notes}</p>}
              <p className="text-xs text-text-tertiary mt-1">Yazan: {med.prescribedBy} · {med.prescribedDate}</p>
            </div>
          </div>
        </Card>
      ))}
      {medications.length === 0 && (
        <p className="text-sm text-text-tertiary text-center py-8">Bu hasta için ilaç kaydı yok.</p>
      )}
    </div>
  );
}

function LabsTab({ labData }: { labData: LabDataPoint[] }) {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["creatinine", "gfr", "tacrolimus"]);

  const chartData = labData.map((pt) => ({
    label: pt.date,
    values: Object.fromEntries(
      LAB_METRIC_DEFINITIONS.map((d) => [d.key, pt[d.key] as number | undefined])
    ) as Record<string, number | undefined>,
  }));

  const series: ChartSeries[] = LAB_METRIC_DEFINITIONS
    .filter((d) => selectedMetrics.includes(d.key))
    .map((d) => ({ key: d.key, label: d.label, color: d.color, unit: d.unit }));

  const normalRanges = Object.fromEntries(
    LAB_METRIC_DEFINITIONS.map((d) => [d.key, { min: d.normalMin, max: d.normalMax }])
  );

  return (
    <div className="space-y-5">
      {/* Metric selector */}
      <Card padding="sm">
        <div className="px-2 py-2 flex flex-wrap gap-2">
          {LAB_METRIC_DEFINITIONS.map((d) => (
            <button
              key={d.key}
              onClick={() => setSelectedMetrics((prev) => prev.includes(d.key) ? prev.filter((k) => k !== d.key) : [...prev, d.key])}
              className={`text-xs font-medium px-2.5 py-1 rounded-full border cursor-pointer transition-all ${selectedMetrics.includes(d.key) ? "border-transparent text-white" : "border-border text-text-tertiary hover:border-navy-300"}`}
              style={selectedMetrics.includes(d.key) ? { backgroundColor: d.color } : {}}
            >
              {d.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Chart */}
      {series.length > 0 && chartData.length > 0 ? (
        <Card>
          <LineChart data={chartData} series={series} height={260} normalRanges={normalRanges} />
        </Card>
      ) : (
        <Card><p className="text-sm text-text-tertiary text-center py-8">Metrik veya veri seçin.</p></Card>
      )}

      {/* Data table */}
      {labData.length > 0 && (
        <Card padding="sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-3 py-2 font-semibold text-text-tertiary uppercase tracking-wide">Tarih</th>
                  {["Kreatinin", "GFR", "Tacrolimus", "Üre", "Potasyum", "CRP"].map((h) => (
                    <th key={h} className="text-right px-3 py-2 font-semibold text-text-tertiary uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[...labData].reverse().map((pt, i) => (
                  <tr key={i} className="hover:bg-surface-muted/50">
                    <td className="px-3 py-2 font-medium text-text-primary">{pt.date}</td>
                    <td className="px-3 py-2 text-right">{pt.creatinine?.toFixed(2) ?? "—"}</td>
                    <td className="px-3 py-2 text-right">{pt.gfr?.toFixed(1) ?? "—"}</td>
                    <td className="px-3 py-2 text-right">{pt.tacrolimus?.toFixed(1) ?? "—"}</td>
                    <td className="px-3 py-2 text-right">{pt.urea?.toFixed(1) ?? "—"}</td>
                    <td className="px-3 py-2 text-right">{pt.potassium?.toFixed(2) ?? "—"}</td>
                    <td className="px-3 py-2 text-right">{pt.crp?.toFixed(1) ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

function DietTab({ diet }: { diet: StoredDietPlan | null }) {
  if (!diet) return (
    <Card><p className="text-sm text-text-tertiary text-center py-8">Bu hasta için diyet planı tanımlanmamış.</p></Card>
  );
  return (
    <div className="space-y-4">
      <Card>
        <h3 className="font-semibold text-text-primary mb-3">Diyet Planı</h3>
        <div className="grid sm:grid-cols-2 gap-3 text-sm mb-4">
          {[
            ["Kalori Hedefi", `${diet.calorieTarget} kcal/gün`],
            ["Protein", diet.proteinTarget],
            ["Potasyum Limiti", diet.potassiumLimit],
            ["Fosfor Limiti", diet.phosphorusLimit],
            ["Sıvı Limiti", diet.fluidLimit],
            ["Hazırlayan", diet.prescribedBy],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between border-b border-border pb-2 last:border-0">
              <span className="text-text-tertiary">{label}</span>
              <span className="font-medium text-text-primary">{value}</span>
            </div>
          ))}
        </div>
        {diet.restrictions.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wide mb-2">Kısıtlamalar</p>
            <div className="flex flex-wrap gap-1.5">
              {diet.restrictions.map((r) => (
                <span key={r} className="text-xs px-2.5 py-1 rounded-full bg-danger-50 text-danger-700 border border-danger-200">{r}</span>
              ))}
            </div>
          </div>
        )}
        {diet.notes && <p className="text-xs text-text-tertiary italic border-t border-border pt-3">{diet.notes}</p>}
      </Card>

      {diet.meals.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          {diet.meals.map((meal) => (
            <Card key={meal.meal}>
              <p className="font-semibold text-text-primary text-sm mb-2">{meal.meal}</p>
              <ul className="space-y-1">
                {meal.items.map((item, i) => (
                  <li key={i} className="text-xs text-text-secondary flex items-start gap-1.5">
                    <span className="text-text-tertiary mt-0.5">•</span>{item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function MessagesTab({ patientId }: { patientId: string }) {
  const messages = getDoctorMessages().filter((m) => m.patientId === patientId);
  if (messages.length === 0) return (
    <Card><p className="text-sm text-text-tertiary text-center py-8">Bu hastadan gelen mesaj yok.</p></Card>
  );
  return (
    <div className="space-y-3">
      {messages.map((msg) => (
        <Card key={msg.id} padding="sm">
          <div className="p-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-text-primary text-sm">{msg.subject}</p>
                <p className="text-xs text-text-tertiary">{new Date(msg.sentAt).toLocaleString("tr-TR")}</p>
              </div>
              <Badge variant={msg.urgency === "high" ? "danger" : msg.urgency === "medium" ? "warning" : "default"}>
                {msg.urgency === "high" ? "Acil" : msg.urgency === "medium" ? "Orta" : "Düşük"}
              </Badge>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">{msg.content}</p>
            {msg.replyContent && (
              <div className="bg-success-50 border border-success-200 rounded-[var(--radius-lg)] px-3 py-2.5 mt-2">
                <p className="text-xs font-semibold text-success-700 mb-1">Doktor yanıtı — {msg.repliedBy}</p>
                <p className="text-xs text-success-700 leading-relaxed">{msg.replyContent}</p>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

function NotesTab({ patient, onSave }: { patient: PatientRecord; onSave: (notes: string) => void }) {
  const [notes, setNotes] = useState(patient.notes ?? "");
  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    onSave(notes);
    setEditing(false);
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-text-primary text-sm">Klinik Notlar</h3>
          {editing ? (
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => { setNotes(patient.notes ?? ""); setEditing(false); }}>
                <X size={13} /> İptal
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save size={13} /> Kaydet
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>
              <Edit2 size={13} /> Düzenle
            </Button>
          )}
        </div>
        {editing ? (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={8}
            className="w-full rounded-[var(--radius-lg)] border border-border bg-surface-muted px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-navy-400 resize-none"
            placeholder="Klinik notlarınızı buraya yazın..."
          />
        ) : (
          <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap min-h-[4rem]">
            {notes || <span className="text-text-tertiary italic">Henüz klinik not eklenmemiş.</span>}
          </p>
        )}
      </Card>
    </div>
  );
}

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: patientId } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [patient, setPatient] = useState<PatientRecord | null>(null);
  const [medications, setMedications] = useState<StoredMedication[]>([]);
  const [labData, setLabData] = useState<LabDataPoint[]>([]);
  const [diet, setDiet] = useState<StoredDietPlan | null>(null);

  useEffect(() => {
    const p = getPatient(patientId);
    if (!p) return;
    setPatient(p);
    setMedications(getMedications(patientId));
    setLabData(getLabData(patientId));
    setDiet(getDietPlan(patientId));
  }, [patientId]);

  const handleSaveNotes = (notes: string) => {
    if (!patient) return;
    updatePatient(patientId, { notes });
    setPatient((prev) => prev ? { ...prev, notes } : prev);
  };

  if (!patient) return (
    <div className="flex items-center justify-center min-h-64">
      <p className="text-text-tertiary">Hasta bulunamadı.</p>
    </div>
  );

  const latestLab = labData.length > 0 ? labData[labData.length - 1] : null;
  const pendingMessages = getDoctorMessages().filter((m) => m.patientId === patientId && !m.readByDoctor).length;

  return (
    <>
      <PageTitle title={patient.name} />
      <div className="space-y-5 max-w-6xl mx-auto">

        {/* Back + header */}
        <div className="flex items-start gap-4">
          <button
            onClick={() => router.back()}
            className="mt-1 p-2 rounded-[var(--radius-lg)] border border-border hover:bg-surface-muted transition-colors flex-shrink-0 cursor-pointer"
          >
            <ArrowLeft size={15} className="text-text-secondary" />
          </button>
          <div className="flex-1 bg-surface rounded-[var(--radius-xl)] border border-border p-5 shadow-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-navy-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-navy-700">{patient.initials}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-lg font-semibold text-text-primary">{patient.name}</h1>
                    <StatusChip status={patient.status} />
                    {pendingMessages > 0 && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-danger-500 text-white">{pendingMessages} okunmamış</span>
                    )}
                  </div>
                  <p className="text-xs text-text-tertiary mt-0.5">
                    {patient.age} yaş · {patient.bloodGroup} · Nakil: {patient.transplantDate} · Son ziyaret: {patient.lastVisit}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => setActiveTab("messages")}>
                  <MessageSquare size={13} /> Mesaj
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 bg-surface-muted rounded-[var(--radius-xl)] p-1.5 border border-border overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-[var(--radius-lg)] text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                activeTab === tab.id
                  ? "bg-surface text-navy-700 shadow-sm border border-border"
                  : "text-text-tertiary hover:text-text-secondary"
              }`}
            >
              <tab.icon size={13} />
              {tab.label}
              {tab.id === "messages" && pendingMessages > 0 && (
                <span className="w-4 h-4 rounded-full bg-danger-500 text-white text-[9px] font-bold flex items-center justify-center">{pendingMessages}</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "overview" && <PatientOverviewTab patient={patient} medications={medications} latestLab={latestLab} />}
        {activeTab === "medications" && <MedicationsTab patientId={patientId} medications={medications} />}
        {activeTab === "labs" && <LabsTab labData={labData} />}
        {activeTab === "diet" && <DietTab diet={diet} />}
        {activeTab === "messages" && <MessagesTab patientId={patientId} />}
        {activeTab === "notes" && <NotesTab patient={patient} onSave={handleSaveNotes} />}
      </div>
    </>
  );
}
