"use client";
import { useState, useEffect } from "react";
import Badge from "@/components/ui/Badge";
import { getGreeting } from "@/lib/utils";
import { getMedications, getSlots } from "@/lib/store";
import {
  Pill,
  Droplets,
  Calendar,
  Trophy,
  Activity,
  Bot,
  MessageSquare,
  Plus,
  Check,
  Clock,
  ArrowRight,
  TrendingUp,
  Heart,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const MY_PATIENT_ID = "1";


interface TodayMed { id: string; name: string; dosage: string; time: string; taken: boolean; }

export default function DashboardPage() {
  const [medications, setMedications] = useState<TodayMed[]>([]);

  const [upcomingAppointments, setUpcomingAppointments] = useState<{ id: string; date: string; time: string }[]>([]);

  useEffect(() => {
    const stored = getMedications(MY_PATIENT_ID);
    const expanded: TodayMed[] = [];
    stored.forEach((med) => {
      med.times.forEach((time) => {
        expanded.push({ id: `${med.id}-${time}`, name: med.name, dosage: med.dosage, time, taken: false });
      });
    });
    setMedications(expanded);

    // Load patient's booked appointments from store
    const today = new Date().toISOString().split("T")[0];
    const slots = getSlots().filter((s) => s.status === "approved" && s.bookedByPatientId === MY_PATIENT_ID && s.date >= today);
    setUpcomingAppointments(slots.slice(0, 2));
  }, []);

  const takenCount = medications.filter((m) => m.taken).length;
  const totalCount = medications.length;
  const progressPercent = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0;

  const toggleMedication = (id: string) => {
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, taken: !m.taken } : m))
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* ===== WELCOME BANNER ===== */}
      <div className="bg-surface rounded-[var(--radius-xl)] border border-border p-5 sm:p-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-text-tertiary mb-1 uppercase tracking-wide">
              {getGreeting()}
            </p>
            <h1 className="text-xl sm:text-2xl font-semibold text-text-primary mb-1">
              Bugün takip etmeniz gerekenler
            </h1>
            <p className="text-sm text-text-secondary">
              İlaç programınızı kontrol edin, yaklaşan randevularınıza ve mesajlarınıza göz atın.
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Link href="/medications">
              <button className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-navy-600 text-white hover:bg-navy-700 rounded-[var(--radius-md)] text-sm font-medium transition-colors shadow-subtle">
                <Plus size={15} />
                İlaç Ekle
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ===== STAT CARDS ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Medication */}
        <div className="stat-card-navy rounded-2xl p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-navy-500 flex items-center justify-center shadow-lg shadow-navy-500/25">
              <Pill className="text-white" size={19} />
            </div>
            <span className="text-xs font-semibold text-navy-400 bg-white/70 px-2 py-0.5 rounded-full">Bugün</span>
          </div>
          <p className="text-xs font-semibold text-navy-500/70 uppercase tracking-wide mb-0.5">Bugünkü İlaçlar</p>
          <p className="text-3xl font-black text-navy-700">
            {takenCount}<span className="text-xl text-navy-400">/{totalCount}</span>
          </p>
          <div className="mt-3 h-1.5 bg-navy-200/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-navy-500 to-teal-500 rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {totalCount === 0 ? (
          <div className="col-span-2 lg:col-span-3 rounded-2xl border border-amber-200 bg-amber-50/50 p-5 flex flex-col justify-center">
            <p className="text-sm font-semibold text-amber-800 mb-2">Henüz ilacınız eklenmemiş</p>
            <p className="text-xs text-amber-700 mb-4">Sağlık skoru, su takibi ve seri verileriniz ilaç kaydı oluşturulduktan sonra aktif olacaktır.</p>
            <div className="flex flex-wrap gap-2">
              <Link href="/medications">
                <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-amber-200 rounded-lg text-xs font-semibold text-amber-700 hover:bg-amber-50 transition-colors">
                  <Plus size={14} />
                  İlaç Ekle
                </span>
              </Link>
              <Link href="/messages">
                <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-amber-200 rounded-lg text-xs font-semibold text-amber-700 hover:bg-amber-50 transition-colors">
                  <MessageSquare size={14} />
                  Doktoruma Mesaj At
                </span>
              </Link>
              <Link href="/ai-assistant">
                <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-amber-200 rounded-lg text-xs font-semibold text-amber-700 hover:bg-amber-50 transition-colors">
                  <Bot size={14} />
                  AI Asistana Sor
                </span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Water */}
            <div className="stat-card-cyan rounded-2xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                  <Droplets className="text-white" size={19} />
                </div>
                <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">Demo</span>
              </div>
              <p className="text-xs font-semibold text-cyan-600/70 uppercase tracking-wide mb-0.5">Su Tüketimi</p>
              <p className="text-3xl font-black text-cyan-700">
                5<span className="text-xl text-cyan-500">/8</span>
              </p>
              <div className="flex gap-1 mt-3">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 h-1.5 rounded-full transition-all ${i <= 5 ? "bg-cyan-500" : "bg-cyan-200"}`}
                  />
                ))}
              </div>
            </div>

            {/* Streak */}
            <div className="stat-card-emerald rounded-2xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <Trophy className="text-white" size={19} />
                </div>
                <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">Demo</span>
              </div>
              <p className="text-xs font-semibold text-emerald-600/70 uppercase tracking-wide mb-0.5">Gün Serisi</p>
              <p className="text-3xl font-black text-emerald-700">12</p>
              <p className="text-xs text-emerald-600 mt-2 font-medium">gün üst üste ✓</p>
            </div>

            {/* Health Score */}
            <div className="stat-card-violet rounded-2xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-violet-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
                  <Activity className="text-white" size={19} />
                </div>
                <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">Demo</span>
              </div>
              <p className="text-xs font-semibold text-violet-600/70 uppercase tracking-wide mb-0.5">Sağlık Skoru</p>
              <p className="text-3xl font-black text-violet-700">92</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp size={13} className="text-emerald-500" />
                <p className="text-xs text-emerald-600 font-semibold">+3 bu hafta</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Today's Medications */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/70 shadow-[0_1px_4px_-2px_rgba(0,0,0,0.06),0_4px_12px_-6px_rgba(0,48,128,0.07)] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-navy-50 flex items-center justify-center">
                <Pill className="text-navy-500" size={18} />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-sm">Bugünkü İlaçlarım</h2>
                <p className="text-xs text-slate-400">{takenCount}/{totalCount} alındı · %{progressPercent} tamamlandı</p>
              </div>
            </div>
            <Link
              href="/medications"
              className="flex items-center gap-1 text-sm font-semibold text-navy-500 hover:text-navy-700 transition-colors"
            >
              Tümü
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-slate-100">
            <div
              className="h-full bg-gradient-to-r from-navy-500 to-teal-500 transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Medication List */}
          <div className="divide-y divide-slate-50">
            {medications.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center px-5">
                <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-surface-muted flex items-center justify-center mb-3">
                  <Pill size={22} className="text-text-muted" />
                </div>
                <p className="text-sm font-semibold text-text-primary mb-1">Henüz ilaç programınız oluşturulmadı</p>
                <p className="text-xs text-text-secondary mb-4 max-w-xs">İlk ilacınızı ekleyebilir veya doktorunuzdan ilaç listenizi paylaşmasını isteyebilirsiniz.</p>
                <Link href="/medications" className="inline-flex items-center gap-1 text-xs font-semibold text-navy-600 hover:text-navy-700 transition-colors">
                  İlaç Yönetimine Git
                  <ArrowRight size={12} />
                </Link>
              </div>
            )}
            {medications.map((med) => (
              <div
                key={med.id}
                className={`flex items-center justify-between px-5 py-3.5 transition-colors ${
                  med.taken ? "bg-slate-50/40" : "hover:bg-slate-50/50"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <button
                    onClick={() => toggleMedication(med.id)}
                    className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-200 cursor-pointer flex-shrink-0 ${
                      med.taken
                        ? "bg-gradient-to-br from-navy-500 to-teal-500 border-transparent shadow-sm"
                        : "border-slate-200 hover:border-navy-400 hover:bg-navy-50 bg-white"
                    }`}
                    aria-label={med.taken ? "İlaç alındı olarak işaretli" : "İlaç al olarak işaretle"}
                  >
                    {med.taken && <Check size={13} className="text-white" />}
                  </button>
                  <div>
                    <p
                      className={`text-sm font-semibold transition-colors ${
                        med.taken ? "text-slate-400 line-through decoration-slate-300" : "text-slate-800"
                      }`}
                    >
                      {med.name}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">{med.dosage}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="hidden sm:flex items-center gap-1 text-slate-400">
                    <Clock size={12} />
                    <span className="text-xs font-medium">{med.time}</span>
                  </div>
                  {med.taken ? (
                    <Badge variant="success">Alındı</Badge>
                  ) : (
                    <Badge variant="warning">Bekliyor</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">

          {/* Quick Actions */}
          <div className="bg-surface rounded-[var(--radius-xl)] border border-border shadow-card p-5">
            <h2 className="font-semibold text-text-primary text-sm mb-4">Hızlı İşlemler</h2>
            <div className="space-y-2">
              <Link href="/medications" className="block">
                <div className="flex items-center gap-3 p-3 rounded-[var(--radius-lg)] bg-navy-50 hover:bg-navy-100 transition-colors group border border-navy-100">
                  <div className="w-9 h-9 rounded-[var(--radius-md)] bg-navy-600 flex items-center justify-center flex-shrink-0">
                    <Pill className="text-white" size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text-primary">İlaçlarımı Yönet</p>
                    <p className="text-xs text-text-tertiary truncate">Programı görüntüle ve doz işaretle</p>
                  </div>
                  <ChevronRight size={14} className="text-text-muted ml-auto group-hover:text-navy-500 transition-colors flex-shrink-0" />
                </div>
              </Link>

              <Link href="/messages" className="block">
                <div className="flex items-center gap-3 p-3 rounded-[var(--radius-lg)] bg-surface-muted hover:bg-surface-subtle transition-colors group border border-border">
                  <div className="w-9 h-9 rounded-[var(--radius-md)] bg-success-500 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="text-white" size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text-primary">Doktora Mesaj Gönder</p>
                    <p className="text-xs text-text-tertiary truncate">Endişelerinizi ve sorularınızı paylaşın</p>
                  </div>
                  <ChevronRight size={14} className="text-text-muted ml-auto group-hover:text-success-500 transition-colors flex-shrink-0" />
                </div>
              </Link>

              <Link href="/labs" className="block">
                <div className="flex items-center gap-3 p-3 rounded-[var(--radius-lg)] bg-surface-muted hover:bg-surface-subtle transition-colors group border border-border">
                  <div className="w-9 h-9 rounded-[var(--radius-md)] bg-info-500 flex items-center justify-center flex-shrink-0">
                    <Activity className="text-white" size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text-primary">Lab Sonucu Yükle</p>
                    <p className="text-xs text-text-tertiary truncate">PDF, Excel veya manuel giriş</p>
                  </div>
                  <ChevronRight size={14} className="text-text-muted ml-auto group-hover:text-info-500 transition-colors flex-shrink-0" />
                </div>
              </Link>

              <Link href="/nutrition" className="block">
                <div className="flex items-center gap-3 p-3 rounded-[var(--radius-lg)] bg-surface-muted hover:bg-surface-subtle transition-colors group border border-border">
                  <div className="w-9 h-9 rounded-[var(--radius-md)] bg-medical-500 flex items-center justify-center flex-shrink-0">
                    <Heart className="text-white" size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text-primary">Beslenme Planımı Gör</p>
                    <p className="text-xs text-text-tertiary truncate">Günlük öğün ve kısıtlamalar</p>
                  </div>
                  <ChevronRight size={14} className="text-text-muted ml-auto group-hover:text-medical-500 transition-colors flex-shrink-0" />
                </div>
              </Link>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-2xl border border-slate-200/70 shadow-[0_1px_4px_-2px_rgba(0,0,0,0.06),0_4px_12px_-6px_rgba(0,48,128,0.07)] p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center">
                <Calendar className="text-navy-500" size={17} />
              </div>
              <h2 className="font-bold text-slate-900 text-sm">Yaklaşan Randevular</h2>
            </div>

            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-8 px-4">
                <Calendar size={24} className="mx-auto text-text-muted mb-2" />
                <p className="text-sm font-medium text-text-primary mb-1">Henüz randevunuz bulunmuyor</p>
                <p className="text-xs text-text-secondary mb-3">Doktor veya diyetisyen randevusu talep edebilirsiniz.</p>
                <Link href="/appointments" className="inline-flex items-center gap-1 text-xs font-semibold text-navy-600 hover:text-navy-700 transition-colors">
                  Randevu Talebi Oluştur
                  <ArrowRight size={12} />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.map((apt) => (
                  <div key={apt.id} className="rounded-xl overflow-hidden border border-slate-100">
                    <div className="h-1 bg-gradient-to-r from-navy-500 to-teal-500" />
                    <div className="p-3.5">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <p className="text-sm font-semibold text-slate-900 leading-tight">Nefroloji Kontrolü</p>
                        <span className="text-xs font-bold text-navy-500 bg-navy-50 px-2 py-0.5 rounded-full flex-shrink-0">
                          {new Date(apt.date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">Dr. Ayşe Kaya</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 text-slate-400">
                          <Clock size={11} />
                          <span className="text-xs">{apt.time}</span>
                        </div>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs text-slate-400">Merkez Üniversite Hastanesi</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
