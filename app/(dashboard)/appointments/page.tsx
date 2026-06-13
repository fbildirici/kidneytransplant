"use client";

import { useMemo, useState } from "react";
import {
  AppointmentSlot,
  bookAppointment,
  getPatientAppointments,
  getSlots,
  ProviderRole,
} from "@/lib/store";
import { useToast } from "@/lib/toast-context";
import { Calendar, CalendarDays, CalendarX2, CheckCircle, Clock, UserRound, Users, XCircle, AlertCircle } from "lucide-react";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import PageTitle from "@/components/PageTitle";

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
  const toast = useToast();

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
    const slot = getSlots().find((s) => s.id === slotId);
    bookAppointment(slotId, PATIENT_ID, PATIENT_NAME);
    setRefreshKey((value) => value + 1);
    if (slot) {
      toast.addToast(
        `${slot.providerName} için ${slot.date} ${slot.time} randevu talebiniz oluşturuldu. Koordinatör onayı bekleniyor.`,
        "success"
      );
    }
  };

  return (
    <>
      <PageTitle title="Randevular" />
      <div className="space-y-6 max-w-6xl mx-auto">
      <div className="bg-surface rounded-[var(--radius-xl)] border border-border p-5 sm:p-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-navy-600 uppercase tracking-widest mb-1">Randevular</p>
            <h1 className="text-xl sm:text-2xl font-semibold text-text-primary mb-1">
              Randevu Talebi Oluştur
            </h1>
            <p className="text-sm text-text-secondary">
              Doktor veya diyetisyen için slot seçin. Talebiniz koordinatör onayından sonra kesinleşir; onaylandığında bildirim alırsınız.
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-start gap-2 bg-warning-50 border border-warning-200 rounded-[var(--radius-lg)] px-4 py-3">
          <AlertCircle size={14} className="text-warning-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-warning-700 leading-relaxed">
            Randevu sistemi olağan kontroller içindir. Acil tıbbi durumlarda 112'yi arayın veya en yakın acil servise başvurun.
          </p>
        </div>
      </div>

      <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary mb-3">Sağlayıcı</p>
        <div className="flex flex-wrap gap-2">
          {[
            { id: "doctor", label: "Doktor" },
            { id: "dietitian", label: "Diyetisyen" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setProviderRole(item.id as ProviderRole)}
              className={`rounded-[var(--radius-lg)] border px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer ${
                providerRole === item.id
                  ? "border-navy-300 bg-navy-50 text-navy-700"
                  : "border-border bg-surface text-text-secondary hover:border-border-hover"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users size={16} className="text-navy-600" />
            <p className="text-sm font-semibold text-text-primary">Müsait Slotlar</p>
          </div>

          <div className="space-y-4">
            {Object.keys(groupedAvailable).length === 0 ? (
              <EmptyState
                icon={CalendarX2}
                title="Müsait slot bulunmuyor"
                description="Seçili sağlayıcı için şu anda müsait randevu slotu yok."
              />
            ) : (
              Object.entries(groupedAvailable).map(([date, slots]) => (
                <div key={date} className="rounded-[var(--radius-lg)] border border-border bg-surface-muted p-4">
                  <p className="text-sm font-semibold text-text-primary">{formatDate(date)}</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    {slots.map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => requestAppointment(slot.id)}
                        className="rounded-[var(--radius-lg)] border border-border bg-surface px-3 py-3 text-left text-sm font-semibold text-text-primary hover:bg-navy-50 hover:border-navy-200 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-navy-600" />
                          {slot.time}
                        </div>
                        <p className="mt-2 text-xs text-text-tertiary">{slot.providerName}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={16} className="text-success-600" />
              <p className="text-sm font-semibold text-text-primary">Benim Taleplerim</p>
            </div>

            <div className="space-y-3">
              {upcoming.length === 0 ? (
                <EmptyState
                  icon={CalendarDays}
                  title="Henüz randevu talebiniz yok"
                  description="Doktor veya diyetisyen için slot seçip talep oluşturabilirsiniz."
                  action={{ label: "Slot Gör", href: "/appointments" }}
                />
              ) : (
                upcoming.map((slot) => (
                  <div key={slot.id} className="rounded-[var(--radius-lg)] border border-border bg-surface-muted p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{formatDate(slot.date)} · {slot.time}</p>
                        <p className="text-xs text-text-tertiary">{slot.providerName} · {slot.specialty}</p>
                      </div>
                      {slot.status === "approved" ? (
                        <Badge variant="success"><CheckCircle size={10} /> Onaylı</Badge>
                      ) : slot.status === "pending" ? (
                        <Badge variant="warning"><Clock size={10} /> Onay Bekliyor</Badge>
                      ) : (
                        <Badge variant="danger"><XCircle size={10} /> Reddedildi</Badge>
                      )}
                    </div>
                    {slot.rejectionReason && <p className="mt-2 text-xs text-danger-600">{slot.rejectionReason}</p>}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-5">
            <div className="flex items-center gap-2 mb-3">
              <UserRound size={16} className="text-navy-600" />
              <p className="text-sm font-semibold text-text-primary">Onay Akışı</p>
            </div>
            <ol className="space-y-2 text-sm text-text-secondary">
              <li>1. Uygun slotu seçip talep oluşturursunuz.</li>
              <li>2. Koordinatör doktor/diyetisyen programına göre onay verir.</li>
              <li>3. Onay sonrası randevu onaylı durumuna geçer.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
