"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquare,
  Calendar,
  HeartPulse,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Stethoscope,
  Activity,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/doctor", label: "Ana Panel", icon: LayoutDashboard },
  { href: "/doctor/labs", label: "Laboratuvar", icon: Activity },
  { href: "/doctor/messages", label: "Mesajlar", icon: MessageSquare, badge: 3 },
  { href: "/doctor/appointments", label: "Randevular", icon: Calendar },
];

export default function DoctorSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col sidebar-frosted border-r border-slate-200/60 transition-all duration-300 ease-in-out h-screen sticky top-0 shadow-[1px_0_12px_-4px_rgba(13,148,136,0.06)]",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-2.5 border-b border-slate-100 transition-all duration-300",
        collapsed ? "p-4 justify-center" : "p-5"
      )}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-teal-500/25">
          <HeartPulse className="text-white" size={19} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-extrabold text-lg tracking-tight leading-tight">
              <span className="text-navy-500">Rena</span>
              <span className="text-teal-600">Care</span>
            </h1>
            <p className="text-[10px] text-slate-400 leading-tight">Doktor Paneli</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn("flex-1 py-4 space-y-0.5 overflow-y-auto", collapsed ? "px-2" : "px-3")}>
        {!collapsed && (
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 pb-2">
            Menü
          </p>
        )}
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200",
                collapsed ? "px-2.5 py-2.5 justify-center" : "px-3 py-2.5",
                isActive
                  ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md shadow-teal-500/25"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              )}
            >
              <item.icon
                size={19}
                className={cn(
                  "flex-shrink-0 transition-colors",
                  isActive ? "text-white" : "text-slate-400"
                )}
              />
              {!collapsed && (
                <span className="flex-1">{item.label}</span>
              )}
              {!collapsed && "badge" in item && item.badge && (
                <span className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center",
                  isActive ? "bg-white/20 text-white" : "bg-red-500 text-white"
                )}>
                  {item.badge}
                </span>
              )}
              {collapsed && "badge" in item && item.badge && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Doctor profile + logout + collapse toggle */}
      <div className={cn("border-t border-slate-100 pt-3 pb-3 space-y-2", collapsed ? "px-2" : "px-3")}>
        {/* Doctor info */}
        <div
          className={cn(
            "flex items-center gap-2.5 rounded-xl bg-teal-50 transition-all",
            collapsed ? "p-2 justify-center" : "p-3"
          )}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            <Stethoscope size={14} />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-700 truncate leading-tight">Dr. Ayşe Kaya</p>
              <p className="text-xs text-teal-600 leading-tight font-medium">Nefrolog</p>
            </div>
          )}
        </div>

        {/* Logout */}
        <Link
          href="/login"
          title={collapsed ? "Çıkış Yap" : undefined}
          className={cn(
            "flex items-center rounded-xl text-xs text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer",
            collapsed ? "justify-center py-2 px-2" : "gap-1.5 py-2 px-3"
          )}
        >
          <LogOut size={15} />
          {!collapsed && <span>Çıkış Yap</span>}
        </Link>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Genişlet" : "Daralt"}
          className={cn(
            "w-full flex items-center rounded-xl text-xs text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors cursor-pointer",
            collapsed ? "justify-center py-2" : "justify-center gap-1.5 py-2"
          )}
        >
          {collapsed ? (
            <ChevronRight size={16} />
          ) : (
            <>
              <ChevronLeft size={16} />
              <span>Daralt</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
