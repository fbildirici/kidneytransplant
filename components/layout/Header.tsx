"use client";
import { Bell, Menu, Pill, MessageSquare, Calendar, Activity, CheckCircle, X, TrendingUp } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { useState, useRef, useEffect } from "react";
import MobileNav from "./MobileNav";
import type { ElementType } from "react";

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

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    icon: Pill,
    iconBg: "bg-navy-50",
    iconColor: "text-navy-600",
    title: "İlaç Hatırlatması",
    desc: "Tacrolimus 2mg — Saat 20:00 dozunu almayı unutmayın.",
    time: "5 dk önce",
    read: false,
  },
  {
    id: "2",
    icon: MessageSquare,
    iconBg: "bg-success-50",
    iconColor: "text-success-600",
    title: "Doktor Yanıtladı",
    desc: "Dr. Ayşe Kaya tacrolimus seviyeniz hakkındaki mesajınızı yanıtladı.",
    time: "1 saat önce",
    read: false,
  },
  {
    id: "3",
    icon: Calendar,
    iconBg: "bg-medical-50",
    iconColor: "text-medical-600",
    title: "Yaklaşan Randevu",
    desc: "Dr. Ayşe Kaya ile yarın 10:00'da randevunuz var.",
    time: "2 saat önce",
    read: false,
  },
  {
    id: "4",
    icon: TrendingUp,
    iconBg: "bg-info-50",
    iconColor: "text-info-600",
    title: "Lab Sonuçları Güncellendi",
    desc: "Kreatinin değeriniz güncellendi: 1.2 mg/dL — Normal aralıkta.",
    time: "Dün",
    read: true,
  },
  {
    id: "5",
    icon: Activity,
    iconBg: "bg-warning-50",
    iconColor: "text-warning-600",
    title: "Haftalık İlaç Uyum Raporu",
    desc: "Bu hafta %94 ilaç uyumu sağladınız.",
    time: "2 gün önce",
    read: true,
  },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const panelRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        bellRef.current &&
        !bellRef.current.contains(e.target as Node)
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

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const dismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 lg:px-6 py-3 gap-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-[var(--radius-md)] text-text-secondary hover:bg-surface-muted hover:text-text-primary transition-colors cursor-pointer flex-shrink-0"
            aria-label="Menüyü aç"
          >
            <Menu size={20} />
          </button>

          {/* Right section */}
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
                            notif.read
                              ? "hover:bg-surface-muted"
                              : "bg-navy-50/30 hover:bg-navy-50/50"
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

            {/* User info */}
            <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-border">
              <div className="text-right">
                <p className="text-sm font-medium text-text-primary leading-tight">Ahmet Y.</p>
                <p className="text-[11px] text-text-tertiary leading-tight">Hasta</p>
              </div>
              <div className="relative">
                <Avatar name="Ahmet Yılmaz" size="md" />
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
