"use client";
import { Bell, Search, Menu, Pill, MessageSquare, Calendar, Activity, CheckCircle, X, TrendingUp } from "lucide-react";
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
    iconBg: "bg-navy-100",
    iconColor: "text-navy-600",
    title: "İlaç Hatırlatması",
    desc: "Tacrolimus 2mg — Saat 20:00 dozunu almayı unutmayın.",
    time: "5 dk önce",
    read: false,
  },
  {
    id: "2",
    icon: MessageSquare,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    title: "Doktor Yanıtladı",
    desc: "Dr. Ayşe Kaya tacrolimus seviyeniz hakkındaki mesajınızı yanıtladı.",
    time: "1 saat önce",
    read: false,
  },
  {
    id: "3",
    icon: Calendar,
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    title: "Yaklaşan Randevu",
    desc: "Dr. Ayşe Kaya ile yarın 10:00'da randevunuz var. Hazırlıklı olun.",
    time: "2 saat önce",
    read: false,
  },
  {
    id: "4",
    icon: TrendingUp,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    title: "Lab Sonuçları Güncellendi",
    desc: "Kreatinin değeriniz güncellendi: 1.2 mg/dL — Normal aralıkta.",
    time: "Dün",
    read: true,
  },
  {
    id: "5",
    icon: Activity,
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
    title: "Haftalık İlaç Uyum Raporu",
    desc: "Bu hafta %94 ilaç uyumu sağladınız. Harika gidiyorsunuz!",
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

  // Close panel on outside click
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

  // Close panel on Esc
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
      <header className="sticky top-0 z-40 glass border-b border-slate-200/50 shadow-[0_1px_8px_-4px_rgba(0,48,128,0.07)]">
        <div className="flex items-center justify-between px-4 lg:px-7 py-3 gap-4">

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer flex-shrink-0"
            aria-label="Menüyü aç"
          >
            <Menu size={21} />
          </button>

          {/* Search */}
          <div className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-3.5 py-2.5 flex-1 max-w-sm border border-slate-200/70 focus-within:border-navy-300 focus-within:ring-2 focus-within:ring-navy-500/10 transition-all group">
            <Search size={16} className="text-slate-400 flex-shrink-0 group-focus-within:text-navy-500 transition-colors" />
            <input
              type="text"
              placeholder="Ara..."
              className="bg-transparent text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none w-full"
              aria-label="Ara"
            />
            <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] text-slate-400 bg-white border border-slate-200 rounded px-1.5 py-0.5 font-mono flex-shrink-0">
              ⌘K
            </kbd>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <div className="relative">
              <button
                ref={bellRef}
                onClick={() => setNotifOpen((v) => !v)}
                className={`relative p-2.5 rounded-xl transition-colors cursor-pointer ${
                  notifOpen
                    ? "bg-navy-50 text-navy-600"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                }`}
                aria-label="Bildirimler"
                aria-expanded={notifOpen}
                aria-haspopup="dialog"
              >
                <Bell size={19} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-[9px] font-black text-white leading-none">{unreadCount}</span>
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notifOpen && (
                <div
                  ref={panelRef}
                  className="absolute right-0 top-full mt-2 w-[min(92vw,360px)] bg-white rounded-2xl shadow-2xl shadow-slate-200/80 border border-slate-100 overflow-hidden z-50 animate-scale-in"
                >
                  {/* Panel header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-navy-50 flex items-center justify-center">
                        <Bell size={15} className="text-navy-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Bildirimler</p>
                        {unreadCount > 0 && (
                          <p className="text-[11px] text-slate-400">{unreadCount} okunmamış</p>
                        )}
                      </div>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors cursor-pointer"
                      >
                        <CheckCircle size={12} />
                        Tümünü oku
                      </button>
                    )}
                  </div>

                  {/* Notification list */}
                  <div className="max-h-[420px] overflow-y-auto divide-y divide-slate-50">
                    {notifications.length === 0 ? (
                      <div className="py-12 text-center">
                        <Bell size={28} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-sm text-slate-400">Tüm bildirimler okundu</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markRead(notif.id)}
                          className={`flex items-start gap-3.5 px-5 py-4 transition-colors cursor-pointer group ${
                            notif.read
                              ? "hover:bg-slate-50/70"
                              : "bg-navy-50/40 hover:bg-navy-50/70"
                          }`}
                        >
                          {/* Icon */}
                          <div className={`w-9 h-9 rounded-xl ${notif.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <notif.icon size={16} className={notif.iconColor} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-sm leading-tight ${notif.read ? "font-medium text-slate-700" : "font-bold text-slate-900"}`}>
                                {notif.title}
                              </p>
                              <button
                                onClick={(e) => { e.stopPropagation(); dismiss(notif.id); }}
                                className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-slate-300 hover:text-slate-500 transition-all cursor-pointer flex-shrink-0"
                              >
                                <X size={13} />
                              </button>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{notif.desc}</p>
                            <p className="text-[10px] text-slate-400 mt-1.5 font-medium">{notif.time}</p>
                          </div>

                          {/* Unread dot */}
                          {!notif.read && (
                            <div className="w-2 h-2 rounded-full bg-navy-500 flex-shrink-0 mt-2" />
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Panel footer */}
                  {notifications.length > 0 && (
                    <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
                      <button
                        onClick={() => setNotifications([])}
                        className="text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors cursor-pointer w-full text-center"
                      >
                        Tüm bildirimleri temizle
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User info */}
            <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-700 leading-tight">Ahmet Yılmaz</p>
                <p className="text-[11px] text-slate-400 leading-tight">Nakil Hastası</p>
              </div>
              <div className="relative">
                <Avatar name="Ahmet Yılmaz" size="md" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
