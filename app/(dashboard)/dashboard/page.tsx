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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-600 via-navy-500 to-teal-600 p-6 sm:p-7 text-white shadow-xl shadow-navy-500/20">
        {/* Decorative blobs */}
        <div className="absolute -right-10 -top-10 w-52 h-52 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute right-1/3 bottom-0 w-40 h-40 bg-teal-400/10 rounded-full blur-2xl" />
        <div className="absolute inset-0 dot-pattern opacity-10" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={15} className="text-teal-300" />
              <span className="text-teal-300 text-sm font-semibold">Hoş Geldiniz</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-1.5">
              {getGreeting()}, Ahmet! 👋
            </h1>
            <p className="text-white/60 text-sm">
              Bugün sağlığınız için neler yapabileceğinize bakalım.
            </p>
          </div>
          <div className="flex gap-2.5 flex-shrink-0">
            <Link href="/ai-assistant">
              <button className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white/15 hover:bg-white/25 rounded-xl text-sm font-semibold text-white transition-colors border border-white/15">
                <Bot size={15} />
                AI&apos;a Sor
              </button>
            </Link>
            <Link href="/medications">
              <button className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white text-navy-700 hover:bg-white/92 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-navy-900/15">
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
                <div className="w-14 h-14 rounded-2xl bg-navy-50 flex items-center justify-center mb-3">
                  <Pill size={24} className="text-navy-300" />
                </div>
                <p className="text-sm font-semibold text-slate-500 mb-1">İlaç bulunamadı</p>
                <p className="text-xs text-slate-400 mb-4">Doktorunuz ilaçlarınızı ekleyince burada görünecek.</p>
                <Link href="/medications" className="text-xs font-semibold text-navy-500 hover:text-navy-700 transition-colors">
                  İlaç Yönetimine Git →
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
          <div className="bg-white rounded-2xl border border-slate-200/70 shadow-[0_1px_4px_-2px_rgba(0,0,0,0.06),0_4px_12px_-6px_rgba(0,48,128,0.07)] p-5">
            <h2 className="font-bold text-slate-900 text-sm mb-4">Hızlı İşlemler</h2>
            <div className="space-y-2">
              <Link href="/ai-assistant" className="block">
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-navy-50 hover:bg-navy-100 transition-colors group border border-navy-100/50">
                  <div className="w-10 h-10 rounded-xl bg-navy-500 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm shadow-navy-500/20 flex-shrink-0">
                    <Bot className="text-white" size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">AI Asistana Sor</p>
                    <p className="text-xs text-slate-400 truncate">Sağlık sorularınızı sorun</p>
                  </div>
                  <ChevronRight size={15} className="text-slate-300 ml-auto group-hover:text-navy-400 transition-colors flex-shrink-0" />
                </div>
              </Link>

              <Link href="/messages" className="block">
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors group border border-emerald-100/50">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm shadow-emerald-500/20 flex-shrink-0">
                    <MessageSquare className="text-white" size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">Doktora Mesaj</p>
                    <p className="text-xs text-slate-400 truncate">Endişelerinizi paylaşın</p>
                  </div>
                  <ChevronRight size={15} className="text-slate-300 ml-auto group-hover:text-emerald-400 transition-colors flex-shrink-0" />
                </div>
              </Link>

              <Link href="/nutrition" className="block">
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-teal-50 hover:bg-teal-100 transition-colors group border border-teal-100/50">
                  <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm shadow-teal-500/20 flex-shrink-0">
                    <Heart className="text-white" size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">Beslenme Rehberi</p>
                    <p className="text-xs text-slate-400 truncate">Günlük beslenme planı</p>
                  </div>
                  <ChevronRight size={15} className="text-slate-300 ml-auto group-hover:text-teal-400 transition-colors flex-shrink-0" />
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
              <div className="text-center py-6">
                <Calendar size={28} className="mx-auto text-slate-300 mb-2" />
                <p className="text-xs text-slate-400">Yaklaşan randevunuz yok.</p>
                <Link href="/appointments" className="text-xs text-navy-500 font-semibold hover:underline mt-1 inline-block">Randevu Al</Link>
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
