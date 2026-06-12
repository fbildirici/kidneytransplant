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
      <div className={`relative overflow-hidden rounded-[var(--radius-xl)] bg-navy-700 p-6 sm:p-7 text-white shadow-elevated`}>
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={15} className="text-white/80" />
              <span className="text-white/80 text-sm font-semibold">Randevu Yönetimi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1.5">{providerName}</h1>
            <p className="text-white/70 text-sm">{specialty} randevularını oluşturun ve talepleri yönetin.</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 border border-white/15 rounded-[var(--radius-lg)] px-4 py-2.5 text-center">
              <p className="text-xs text-white/70 font-medium">Müsait</p>
              <p className="text-xl font-bold text-white">{counts.available}</p>
            </div>
            <div className="bg-amber-500/90 border border-amber-300/30 rounded-[var(--radius-lg)] px-4 py-2.5 text-center">
              <p className="text-xs text-white/80 font-medium">Bekleyen</p>
              <p className="text-xl font-bold text-white">{counts.pending}</p>
            </div>
            <div className="bg-emerald-500/90 border border-emerald-300/30 rounded-[var(--radius-lg)] px-4 py-2.5 text-center">
              <p className="text-xs text-white/80 font-medium">Onaylı</p>
              <p className="text-xl font-bold text-white">{counts.approved}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[320px,1fr] gap-6">
        <div className={`bg-surface rounded-[var(--radius-xl)] border ${accent.border} shadow-card p-5 space-y-4`}>
          <div>
            <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wide mb-2">Yeni Slot</p>
            <label className="text-xs font-medium text-text-secondary block mb-1">Tarih</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="modern-field w-full rounded-[var(--radius-lg)] border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-text-secondary block mb-2">Saatler</label>
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
                    className={`rounded-[var(--radius-lg)] border px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                      active
                        ? `${accent.soft} ${accent.text} ${accent.border}`
                        : "border-border bg-surface text-text-secondary hover:border-border-hover hover:bg-surface-muted"
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
            className={`w-full rounded-[var(--radius-lg)] px-4 py-3 text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${accent.strong}`}
          >
            <span className="flex items-center justify-center gap-2">
              <Plus size={15} />
              Slotları Ekle
            </span>
          </button>

          <div className={`${accent.soft} rounded-[var(--radius-xl)] p-4`}>
            <p className={`text-xs font-semibold uppercase tracking-wide ${accent.text}`}>İş Akışı</p>
            <ul className="mt-2 space-y-2 text-xs text-text-secondary">
              <li>Hasta slotu seçtiğinde durum `bekleyen` olur.</li>
              <li>Koordinatör onay verdiğinde durum `onaylı` olur.</li>
              <li>Gerekirse slotu tekrar `müsait` hale getirebilirsiniz.</li>
            </ul>
          </div>
        </div>

        <div className="bg-surface rounded-[var(--radius-xl)] border border-border shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-text-primary">Planlanan Slotlar</p>
              <p className="text-xs text-text-muted">Gün bazında randevu durumu</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-text-tertiary">
              <Users size={14} />
              {slots.length} toplam slot
            </div>
          </div>

          <div className="divide-y divide-border">
            {Object.keys(groupedSlots).length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-text-muted">Henüz slot oluşturulmadı.</div>
            ) : (
              Object.entries(groupedSlots).map(([date, daySlots]) => (
                <div key={date} className="px-5 py-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar size={15} className="text-text-muted" />
                      <p className="text-sm font-semibold text-text-primary">{formatDate(date)}</p>
                    </div>
                    <span className="text-xs font-semibold text-text-muted">{daySlots.length} slot</span>
                  </div>

                  <div className="space-y-2">
                    {daySlots.map((slot) => (
                      <div
                        key={slot.id}
                        className={`flex items-center justify-between rounded-[var(--radius-xl)] border px-4 py-3 ${
                          slot.status === "approved"
                            ? "border-emerald-200 bg-emerald-50/60"
                            : slot.status === "pending"
                              ? "border-amber-200 bg-amber-50/60"
                              : slot.status === "rejected"
                                ? "border-rose-200 bg-rose-50/60"
                                : "border-border bg-surface"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-[var(--radius-lg)] bg-surface-muted flex items-center justify-center">
                            <Clock size={15} className="text-text-secondary" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-text-primary">{slot.time}</p>
                            <p className="text-xs text-text-tertiary">
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
                            <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-semibold text-text-secondary">
                              Müsait
                            </span>
                          )}

                          {slot.status !== "available" ? (
                            <button
                              type="button"
                              onClick={() => resetSlot(slot.id)}
                              className="rounded-lg p-2 text-text-muted hover:bg-surface-muted hover:text-text-secondary transition-colors cursor-pointer"
                              title="Slotu sıfırla"
                            >
                              <RotateCcw size={14} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => removeSlot(slot.id)}
                              className="rounded-lg p-2 text-text-muted hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
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

      <div className={`${accent.soft} border ${accent.border} rounded-[var(--radius-xl)] p-4`}>
        <div className="flex items-start gap-3">
          <CheckCircle size={18} className={accent.text} />
          <p className="text-sm text-text-secondary">
            Hastalar artık {providerRole === "doctor" ? "doktor" : "diyetisyen"} slotlarını seçebiliyor; randevu koordinatör tarafından onaylandığında hem sağlayıcı hem hasta tarafında `onaylı` olarak görünüyor.
          </p>
        </div>
      </div>
    </div>
  );
}
