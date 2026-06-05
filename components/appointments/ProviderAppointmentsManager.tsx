"use client";

import { useMemo, useState } from "react";
import {
  addProviderSlots,
  AppointmentSlot,
  getProviderSlots,
  resetAppointment,
  setSlots,
  getSlots,
  ProviderRole,
} from "@/lib/store";
import { Calendar, CheckCircle, Clock, Plus, RotateCcw, Trash2, UserCheck, Users } from "lucide-react";

const SLOT_TIMES = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
];

interface ProviderAppointmentsManagerProps {
  providerRole: ProviderRole;
  providerName: string;
  specialty: string;
  accent: {
    banner: string;
    soft: string;
    text: string;
    border: string;
    strong: string;
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ProviderAppointmentsManager({
  providerRole,
  providerName,
  specialty,
  accent,
}: ProviderAppointmentsManagerProps) {
  const [slots, setSlotsState] = useState<AppointmentSlot[]>(() => getProviderSlots(providerRole));
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  const counts = useMemo(
    () => ({
      available: slots.filter((slot) => slot.status === "available").length,
      pending: slots.filter((slot) => slot.status === "pending").length,
      approved: slots.filter((slot) => slot.status === "approved").length,
    }),
    [slots]
  );

  const groupedSlots = useMemo(() => {
    const groups: Record<string, AppointmentSlot[]> = {};
    slots
      .slice()
      .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
      .forEach((slot) => {
        if (!groups[slot.date]) groups[slot.date] = [];
        groups[slot.date].push(slot);
      });
    return groups;
  }, [slots]);

  const refresh = () => setSlotsState(getProviderSlots(providerRole));

  const addSlots = () => {
    if (!selectedDate || selectedTimes.length === 0) return;

    const existingKeys = new Set(
      slots.filter((slot) => slot.date === selectedDate).map((slot) => `${slot.date}-${slot.time}`)
    );

    const newSlots = selectedTimes
      .filter((time) => !existingKeys.has(`${selectedDate}-${time}`))
      .map<AppointmentSlot>((time) => ({
        id: `${providerRole}-${Date.now()}-${time.replace(":", "")}`,
        date: selectedDate,
        time,
        providerRole,
        providerName,
        specialty,
        location: "Merkez Üniversite Hastanesi",
        available: true,
        status: "available",
        createdByRole: providerRole,
      }));

    addProviderSlots(newSlots);
    setSelectedTimes([]);
    refresh();
  };

  const removeSlot = (slotId: string) => {
    const updated = getSlots().filter((slot) => slot.id !== slotId);
    setSlots(updated);
    refresh();
  };

  const resetSlot = (slotId: string) => {
    resetAppointment(slotId);
    refresh();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${accent.banner} p-6 sm:p-7 text-white shadow-xl`}>
        <div className="absolute inset-0 dot-pattern opacity-10" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={15} className="text-white/80" />
              <span className="text-white/80 text-sm font-semibold">Randevu Yönetimi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-1.5">{providerName}</h1>
            <p className="text-white/70 text-sm">{specialty} randevularını oluşturun ve talepleri yönetin.</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-center">
              <p className="text-xs text-white/70 font-medium">Müsait</p>
              <p className="text-xl font-black text-white">{counts.available}</p>
            </div>
            <div className="bg-amber-500/90 border border-amber-300/30 rounded-xl px-4 py-2.5 text-center">
              <p className="text-xs text-white/80 font-medium">Bekleyen</p>
              <p className="text-xl font-black text-white">{counts.pending}</p>
            </div>
            <div className="bg-emerald-500/90 border border-emerald-300/30 rounded-xl px-4 py-2.5 text-center">
              <p className="text-xs text-white/80 font-medium">Onaylı</p>
              <p className="text-xl font-black text-white">{counts.approved}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[320px,1fr] gap-6">
        <div className={`bg-white rounded-2xl border ${accent.border} shadow-sm p-5 space-y-4`}>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Yeni Slot</p>
            <label className="text-xs font-medium text-slate-600 block mb-1">Tarih</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="modern-field w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 block mb-2">Saatler</label>
            <div className="grid grid-cols-3 gap-2">
              {SLOT_TIMES.map((time) => {
                const active = selectedTimes.includes(time);
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() =>
                      setSelectedTimes((prev) =>
                        prev.includes(time) ? prev.filter((item) => item !== time) : [...prev, time]
                      )
                    }
                    className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                      active
                        ? `${accent.soft} ${accent.text} ${accent.border}`
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={addSlots}
            disabled={!selectedDate || selectedTimes.length === 0}
            className={`w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${accent.strong}`}
          >
            <span className="flex items-center justify-center gap-2">
              <Plus size={15} />
              Slotları Ekle
            </span>
          </button>

          <div className={`${accent.soft} rounded-2xl p-4`}>
            <p className={`text-xs font-semibold uppercase tracking-wide ${accent.text}`}>İş Akışı</p>
            <ul className="mt-2 space-y-2 text-xs text-slate-600">
              <li>Hasta slotu seçtiğinde durum `bekleyen` olur.</li>
              <li>Koordinatör onay verdiğinde durum `onaylı` olur.</li>
              <li>Gerekirse slotu tekrar `müsait` hale getirebilirsiniz.</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-900">Planlanan Slotlar</p>
              <p className="text-xs text-slate-400">Gün bazında randevu durumu</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Users size={14} />
              {slots.length} toplam slot
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {Object.keys(groupedSlots).length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-slate-400">Henüz slot oluşturulmadı.</div>
            ) : (
              Object.entries(groupedSlots).map(([date, daySlots]) => (
                <div key={date} className="px-5 py-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar size={15} className="text-slate-400" />
                      <p className="text-sm font-semibold text-slate-800">{formatDate(date)}</p>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">{daySlots.length} slot</span>
                  </div>

                  <div className="space-y-2">
                    {daySlots.map((slot) => (
                      <div
                        key={slot.id}
                        className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${
                          slot.status === "approved"
                            ? "border-emerald-200 bg-emerald-50/60"
                            : slot.status === "pending"
                              ? "border-amber-200 bg-amber-50/60"
                              : slot.status === "rejected"
                                ? "border-rose-200 bg-rose-50/60"
                                : "border-slate-200 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                            <Clock size={15} className="text-slate-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{slot.time}</p>
                            <p className="text-xs text-slate-500">
                              {slot.bookedByPatientName
                                ? `${slot.bookedByPatientName} · ${slot.status === "pending" ? "Koordinatör onayı bekliyor" : slot.status === "approved" ? "Onaylandı" : "Reddedildi"}`
                                : "Müsait"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {slot.status === "approved" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                              <UserCheck size={12} />
                              Onaylı
                            </span>
                          )}
                          {slot.status === "pending" && (
                            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                              Bekleyen
                            </span>
                          )}
                          {slot.status === "available" && (
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                              Müsait
                            </span>
                          )}

                          {slot.status !== "available" ? (
                            <button
                              type="button"
                              onClick={() => resetSlot(slot.id)}
                              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
                              title="Slotu sıfırla"
                            >
                              <RotateCcw size={14} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => removeSlot(slot.id)}
                              className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                              title="Slotu sil"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className={`${accent.soft} border ${accent.border} rounded-2xl p-4`}>
        <div className="flex items-start gap-3">
          <CheckCircle size={18} className={accent.text} />
          <p className="text-sm text-slate-700">
            Hastalar artık {providerRole === "doctor" ? "doktor" : "diyetisyen"} slotlarını seçebiliyor; randevu koordinatör tarafından onaylandığında hem sağlayıcı hem hasta tarafında `onaylı` olarak görünüyor.
          </p>
        </div>
      </div>
    </div>
  );
}
