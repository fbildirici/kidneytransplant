"use client";

import { useMemo, useState } from "react";
import {
  approveAppointment,
  getPendingAppointments,
  rejectAppointment,
} from "@/lib/store";
import { CalendarCheck2, CheckCircle, ClipboardList, XCircle } from "lucide-react";

const COORDINATOR_NAME = "Koordinatör Selin Demir";

export default function CoordinatorPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const pending = useMemo(() => getPendingAppointments(), [refreshKey]);

  const approve = (slotId: string) => {
    approveAppointment(slotId, COORDINATOR_NAME);
    setRefreshKey((value) => value + 1);
  };

  const reject = (slotId: string) => {
    rejectAppointment(slotId, COORDINATOR_NAME, "Koordinatör program uyuşmazlığı nedeniyle reddetti.");
    setRefreshKey((value) => value + 1);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-500 to-emerald-600 p-6 sm:p-7 text-white shadow-xl shadow-cyan-500/20">
        <div className="absolute inset-0 dot-pattern opacity-10" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CalendarCheck2 size={15} className="text-cyan-100" />
              <span className="text-cyan-100 text-sm font-semibold">Koordinatör Onay Merkezi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-1.5">Randevu Onayları</h1>
            <p className="text-white/70 text-sm">Doktor ve diyetisyen için oluşturulan bekleyen randevu taleplerini yönetin.</p>
          </div>
          <div className="rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-center">
            <p className="text-xs text-white/70 font-medium">Bekleyen Talep</p>
            <p className="text-2xl font-black text-white">{pending.length}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardList size={16} className="text-teal-600" />
          <p className="text-sm font-bold text-slate-900">Bekleyen Onay Listesi</p>
        </div>

        <div className="space-y-3">
          {pending.length === 0 ? (
            <p className="text-sm text-slate-400">Bekleyen randevu talebi kalmadı.</p>
          ) : (
            pending.map((slot) => (
              <div key={slot.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {slot.bookedByPatientName} · {slot.date} {slot.time}
                    </p>
                    <p className="text-xs text-slate-500">
                      {slot.providerRole === "doctor" ? "Doktor" : "Diyetisyen"} · {slot.providerName} · {slot.location}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => approve(slot.id)}
                      className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <CheckCircle size={15} />
                        Onayla
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => reject(slot.id)}
                      className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-600 cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <XCircle size={15} />
                        Reddet
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
