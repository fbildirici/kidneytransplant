"use client";
import {
  Bell, Menu, Pill, MessageSquare, Calendar, Activity,
  CheckCircle, X, TrendingUp, Stethoscope, Apple, Users, ClipboardList,
} from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import MobileNav from "./MobileNav";
import type { ElementType } from "react";

type AppRole = "patient" | "doctor" | "dietitian" | "coordinator";

interface UserProfile {
  name: string;
  shortName: string;
  role: string;
}

const ROLE_PROFILES: Record<AppRole, UserProfile> = {
  patient:     { name: "Ahmet Yılmaz",      shortName: "Ahmet Y.",    role: "Hasta" },
  doctor:      { name: "Dr. Ayşe Kaya",     shortName: "Dr. Kaya",    role: "Nefrolog" },
  dietitian:   { name: "Dyt. Zeynep Arslan", shortName: "Dyt. Arslan", role: "Diyetisyen" },
  coordinator: { name: "Selin Demir",        shortName: "S. Demir",    role: "Koordinatör" },
};

interface Notification {
  id: string;
  icon: ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
}

const ROLE_NOTIFICATIONS: Record<AppRole, Notification[]> = {
  patient: [
    {
      id: "p1", icon: Pill, iconBg: "bg-navy-50", iconColor: "text-navy-600",
      title: "İlaç Hatırlatması",
      desc: "Tacrolimus 2mg — Saat 20:00 dozunu almayı unutmayın.",
      time: "5 dk önce", read: false,
    },
    {
      id: "p2", icon: MessageSquare, iconBg: "bg-success-50", iconColor: "text-success-600",
      title: "Doktor Yanıtladı",
      desc: "Dr. Ayşe Kaya tacrolimus seviyeniz hakkındaki mesajınızı yanıtladı.",
      time: "1 saat önce", read: false,
    },
    {
      id: "p3", icon: Calendar, iconBg: "bg-medical-50", iconColor: "text-medical-600",
      title: "Yaklaşan Randevu",
      desc: "Dr. Ayşe Kaya ile yarın 10:00'da randevunuz var.",
      time: "2 saat önce", read: false,
    },
    {
      id: "p4", icon: TrendingUp, iconBg: "bg-info-50", iconColor: "text-info-600",
      title: "Lab Sonuçları Güncellendi",
      desc: "Kreatinin değeriniz güncellendi: 1.2 mg/dL — Normal aralıkta.",
      time: "Dün", read: true,
    },
  ],
  doctor: [
    {
      id: "d1", icon: Activity, iconBg: "bg-danger-50", iconColor: "text-danger-600",
      title: "Kritik Lab Değeri",
      desc: "Mehmet Çelik — Kreatinin 2.4 mg/dL, Tacrolimus 4.1 ng/mL (kritik).",
      time: "10 dk önce", read: false,
    },
    {
      id: "d2", icon: MessageSquare, iconBg: "bg-navy-50", iconColor: "text-navy-600",
      title: "Yeni Hasta Mesajı",
      desc: "Fatma Demir: 'Tacrolimus dozum hakkında sorularım var...'",
      time: "30 dk önce", read: false,
    },
    {
      id: "d3", icon: Calendar, iconBg: "bg-warning-50", iconColor: "text-warning-600",
      title: "Randevu Talebi",
      desc: "Zeynep Arslan — Koordinatör onayı bekleyen randevu talebi.",
      time: "1 saat önce", read: false,
    },
    {
      id: "d4", icon: TrendingUp, iconBg: "bg-success-50", iconColor: "text-success-600",
      title: "Lab Raporu İçe Aktarıldı",
      desc: "Ahmet Yılmaz için 8 lab değeri başarıyla sisteme eklendi.",
      time: "3 saat önce", read: true,
    },
  ],
  dietitian: [
    {
      id: "dt1", icon: Apple, iconBg: "bg-success-50", iconColor: "text-success-600",
      title: "Beslenme Kaydı Güncellendi",
      desc: "Ahmet Yılmaz günlük su hedefini (%87) tamamladı.",
      time: "15 dk önce", read: false,
    },
    {
      id: "dt2", icon: MessageSquare, iconBg: "bg-navy-50", iconColor: "text-navy-600",
      title: "Hasta Mesajı",
      desc: "Fatma Demir: 'Potasyum kısıtlaması hakkında bilgi alabilir miyim?'",
      time: "2 saat önce", read: false,
    },
    {
      id: "dt3", icon: Activity, iconBg: "bg-warning-50", iconColor: "text-warning-600",
      title: "Yüksek Potasyum Uyarısı",
      desc: "Fatma Demir'in son kan sonucunda potasyum 5.3 mmol/L.",
      time: "Dün", read: true,
    },
  ],
  coordinator: [
    {
      id: "c1", icon: Calendar, iconBg: "bg-warning-50", iconColor: "text-warning-600",
      title: "Onay Bekleyen Randevu",
      desc: "Fatma Demir → Dr. Ayşe Kaya randevu talebi onay bekliyor.",
      time: "20 dk önce", read: false,
    },
    {
      id: "c2", icon: Calendar, iconBg: "bg-warning-50", iconColor: "text-warning-600",
      title: "Onay Bekleyen Randevu",
      desc: "Ahmet Yılmaz → Dyt. Zeynep Arslan randevu talebi onay bekliyor.",
      time: "45 dk önce", read: false,
    },
    {
      id: "c3", icon: Users, iconBg: "bg-navy-50", iconColor: "text-navy-600",
      title: "Yeni Hasta Kaydı",
      desc: "Zeynep Arslan sisteme eklendi, doktor ve diyetisyen ataması gerekiyor.",
      time: "3 saat önce", read: true,
    },
    {
      id: "c4", icon: ClipboardList, iconBg: "bg-success-50", iconColor: "text-success-600",
      title: "Randevu Onaylandı",
      desc: "Zeynep Arslan'ın Dr. Ayşe Kaya randevusu onaylandı.",
      time: "Dün", read: true,
    },
  ],
};

function detectRole(pathname: string): AppRole {
  if (pathname.startsWith("/doctor")) return "doctor";
  if (pathname.startsWith("/dietitian")) return "dietitian";
  if (pathname.startsWith("/coordinator")) return "coordinator";
  return "patient";
}

export default function Header() {
  const pathname = usePathname();
  const role = detectRole(pathname);
  const profile = ROLE_PROFILES[role];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(
    () => ROLE_NOTIFICATIONS[role]
  );
  const panelRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);

  // Reset notifications when role changes (pathname change)
  useEffect(() => {
    setNotifications(ROLE_NOTIFICATIONS[role]);
    setNotifOpen(false);
  }, [role]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        bellRef.current && !bellRef.current.contains(e.target as Node)
      ) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setNotifOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id: string) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const dismiss = (id: string) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  return (
    <>
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 lg:px-6 py-3 gap-4">
          {/* Mobile menu button (left, mobile only) */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-[var(--radius-md)] text-text-secondary hover:bg-surface-muted hover:text-text-primary transition-colors cursor-pointer flex-shrink-0"
            aria-label="Menüyü aç"
          >
            <Menu size={20} />
          </button>

          {/* Spacer on desktop so right section stays right */}
          <div className="hidden lg:block flex-1" />

          {/* Right section — notifications + role profile */}
          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <div className="relative">
              <button
                ref={bellRef}
                onClick={() => setNotifOpen((v) => !v)}
                className={`relative p-2 rounded-[var(--radius-md)] transition-colors cursor-pointer ${
                  notifOpen
                    ? "bg-navy-50 text-navy-600"
                    : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                }`}
                aria-label="Bildirimler"
                aria-expanded={notifOpen}
                aria-haspopup="dialog"
              >
                <Bell size={19} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 bg-danger-500 rounded-full border-2 border-surface flex items-center justify-center">
                    <span className="text-[9px] font-bold text-white leading-none">{unreadCount}</span>
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notifOpen && (
                <div
                  ref={panelRef}
                  className="absolute right-0 top-full mt-2 w-[min(92vw,360px)] bg-surface rounded-[var(--radius-xl)] shadow-popover border border-border overflow-hidden z-50 animate-scale-in"
                >
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
                    <div className="flex items-center gap-2">
                      <Bell size={15} className="text-text-secondary" />
                      <div>
                        <p className="text-sm font-semibold text-text-primary">Bildirimler</p>
                        {unreadCount > 0 && (
                          <p className="text-[11px] text-text-tertiary">{unreadCount} okunmamış</p>
                        )}
                      </div>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="flex items-center gap-1 text-xs font-medium text-navy-600 hover:text-navy-700 transition-colors cursor-pointer"
                      >
                        <CheckCircle size={12} />
                        Tümünü oku
                      </button>
                    )}
                  </div>

                  <div className="max-h-[380px] overflow-y-auto divide-y divide-border">
                    {notifications.length === 0 ? (
                      <div className="py-10 text-center">
                        <Bell size={24} className="mx-auto text-text-muted mb-2" />
                        <p className="text-sm text-text-tertiary">Tüm bildirimler okundu</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markRead(notif.id)}
                          className={`flex items-start gap-3 px-5 py-3.5 transition-colors cursor-pointer group ${
                            notif.read ? "hover:bg-surface-muted" : "bg-navy-50/30 hover:bg-navy-50/50"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-[var(--radius-md)] ${notif.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <notif.icon size={15} className={notif.iconColor} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-sm leading-tight ${notif.read ? "font-medium text-text-primary" : "font-semibold text-text-primary"}`}>
                                {notif.title}
                              </p>
                              <button
                                onClick={(e) => { e.stopPropagation(); dismiss(notif.id); }}
                                className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-text-muted hover:text-text-secondary transition-all cursor-pointer flex-shrink-0"
                              >
                                <X size={13} />
                              </button>
                            </div>
                            <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{notif.desc}</p>
                            <p className="text-[10px] text-text-muted mt-1 font-medium">{notif.time}</p>
                          </div>
                          {!notif.read && (
                            <div className="w-2 h-2 rounded-full bg-navy-500 flex-shrink-0 mt-2" />
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="px-5 py-2.5 border-t border-border bg-surface-muted">
                      <button
                        onClick={() => setNotifications([])}
                        className="text-xs text-text-tertiary hover:text-text-secondary font-medium transition-colors cursor-pointer w-full text-center"
                      >
                        Tümünü temizle
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Role-aware user profile */}
            <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-border">
              <div className="text-right">
                <p className="text-sm font-medium text-text-primary leading-tight">{profile.shortName}</p>
                <p className="text-[11px] text-text-tertiary leading-tight">{profile.role}</p>
              </div>
              <div className="relative">
                <Avatar name={profile.name} size="md" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success-500 rounded-full border-2 border-surface" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
