"use client";

import { useMemo, useState } from "react";
import {
  AppointmentSlot,
  bookAppointment,
  getPatientAppointments,
  getSlots,
  ProviderRole,
} from "@/lib/store";
import { Calendar, CheckCircle, Clock, UserRound, Users } from "lucide-react";
import DemoBadge from "@/components/ui/DemoBadge";

const PATIENT_ID = "1";
const PATIENT_NAME = "Ahmet Yılmaz";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function PatientAppointmentsPage() {
  const [providerRole, setProviderRole] = useState<ProviderRole>("doctor");
  const [refreshKey, setRefreshKey] = useState(0);

  const upcoming = useMemo(() => getPatientAppointments(PATIENT_ID), [refreshKey]);
  const availableSlots = useMemo(
    () =>
      getSlots()
        .filter((slot) => slot.providerRole === providerRole && slot.status === "available")
        .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)),
    [providerRole, refreshKey]
  );

  const groupedAvailable = useMemo(() => {
    const groups: Record<string, AppointmentSlot[]> = {};
    availableSlots.forEach((slot) => {
      if (!groups[slot.date]) groups[slot.date] = [];
      groups[slot.date].push(slot);
    });
    return groups;
  }, [availableSlots]);

  const requestAppointment = (slotId: string) => {
    bookAppointment(slotId, PATIENT_ID, PATIENT_NAME);
    setRefreshKey((value) => value + 1);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-600 via-navy-500 to-teal-600 p-6 sm:p-7 text-white shadow-xl shadow-navy-500/20">
        <div className="absolute inset-0 dot-pattern opacity-10" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={15} className="text-teal-300" />
            <span className="text-teal-300 text-sm font-semibold">Randevu Merkezi</span>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-1.5">Randevu Talebi Oluştur</h1>
            <DemoBadge text="Demo verisi" className="bg-white/90 border-white/50 text-amber-700" />
          </div>
          <p className="text-white/65 text-sm">Doktor veya diyetisyen için slot seçin. Talebiniz koordinatör onayından sonra kesinleşir.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">Sağlayıcı</p>
        <div className="flex flex-wrap gap-2">
          {[
            { id: "doctor", label: "Doktor" },
            { id: "dietitian", label: "Diyetisyen" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setProviderRole(item.id as ProviderRole)}
              className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer ${
                providerRole === item.id
                  ? "border-teal-200 bg-teal-50 text-teal-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Users size={16} className="text-teal-600" />
            <p className="text-sm font-bold text-slate-900">Müsait Slotlar</p>
          </div>

          <div className="space-y-4">
            {Object.keys(groupedAvailable).length === 0 ? (
              <p className="text-sm text-slate-400">Seçili sağlayıcı için müsait slot yok.</p>
            ) : (
              Object.entries(groupedAvailable).map(([date, slots]) => (
                <div key={date} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-sm font-semibold text-slate-900">{formatDate(date)}</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    {slots.map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => requestAppointment(slot.id)}
                        className="rounded-xl border border-teal-200 bg-white px-3 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-teal-50 hover:border-teal-300 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-teal-600" />
                          {slot.time}
                        </div>
                        <p className="mt-2 text-xs text-slate-500">{slot.providerName}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={16} className="text-emerald-600" />
              <p className="text-sm font-bold text-slate-900">Benim Taleplerim</p>
            </div>

            <div className="space-y-3">
              {upcoming.length === 0 ? (
                <p className="text-sm text-slate-400">Henüz randevu talebiniz yok.</p>
              ) : (
                upcoming.map((slot) => (
                  <div key={slot.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{formatDate(slot.date)} · {slot.time}</p>
                        <p className="text-xs text-slate-500">{slot.providerName} · {slot.specialty}</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        slot.status === "approved"
                          ? "bg-emerald-100 text-emerald-700"
                          : slot.status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-700"
                      }`}>
                        {slot.status === "approved" ? "Onaylı" : slot.status === "pending" ? "Onay Bekliyor" : "Reddedildi"}
                      </span>
                    </div>
                    {slot.rejectionReason && <p className="mt-2 text-xs text-rose-600">{slot.rejectionReason}</p>}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <UserRound size={16} className="text-navy-600" />
              <p className="text-sm font-bold text-slate-900">Onay Akışı</p>
            </div>
            <ol className="space-y-2 text-sm text-slate-600">
              <li>1. Uygun slotu seçip talep oluşturursunuz.</li>
              <li>2. Koordinatör doktor/diyetisyen programına göre onay verir.</li>
              <li>3. Onay sonrası randevu `onaylı` durumuna geçer.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
