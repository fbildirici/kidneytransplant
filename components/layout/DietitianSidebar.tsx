"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, Apple, BookOpen, HeartPulse,
  ChevronLeft, ChevronRight, LogOut, Salad, Calendar,
} from "lucide-react";
import { useState } from "react";
import { useAuth, getInitials } from "@/lib/auth-context";

const navItems = [
  { href: "/dietitian",                  label: "Ana Panel",       icon: LayoutDashboard },
  { href: "/dietitian/patients",         label: "Hastalarım",      icon: Users },
  { href: "/dietitian/diet-plans",       label: "Diyet Planları",  icon: Apple },
  { href: "/dietitian/appointments",     label: "Randevular",      icon: Calendar },
  { href: "/dietitian/nutrition-guide",  label: "Beslenme Rehberi", icon: BookOpen },
];

export default function DietitianSidebar() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const displayName = profile?.displayName ?? "Diyetisyen";
  const shortName   = displayName.split(" ").map((p, i) => i === 0 ? p : `${p[0]}.`).join(" ");
  const initials    = getInitials(displayName);
  const specialty   = profile?.specialty ?? "Klinik Diyetisyen";

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col sidebar-frosted border-r border-border/60 transition-all duration-300 ease-in-out h-screen sticky top-0 shadow-[1px_0_12px_-4px_rgba(5,150,105,0.06)]",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-2.5 border-b border-border transition-all duration-300", collapsed ? "p-4 justify-center" : "p-5")}>
        <div className="w-9 h-9 rounded-[var(--radius-lg)] bg-navy-700 flex items-center justify-center flex-shrink-0 shadow-elevated">
          <HeartPulse className="text-white" size={19} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-extrabold text-lg tracking-tight leading-tight">
              <span className="text-navy-500">Rena</span><span className="text-teal-600">Care</span>
            </h1>
            <p className="text-[10px] text-text-muted leading-tight">Diyetisyen Paneli</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn("flex-1 py-4 space-y-0.5 overflow-y-auto", collapsed ? "px-2" : "px-3")}>
        {!collapsed && <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-3 pb-2">Menü</p>}
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-[var(--radius-lg)] text-sm font-medium transition-all duration-200",
                collapsed ? "px-2.5 py-2.5 justify-center" : "px-3 py-2.5",
                isActive ? "bg-navy-700 text-white shadow-elevated" : "text-text-tertiary hover:bg-surface-muted hover:text-text-primary"
              )}
            >
              <item.icon size={19} className={cn("flex-shrink-0 transition-colors", isActive ? "text-white" : "text-text-muted")} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Profile + logout + collapse */}
      <div className={cn("border-t border-border pt-3 pb-3 space-y-2", collapsed ? "px-2" : "px-3")}>
        <div className={cn("flex items-center gap-2.5 rounded-[var(--radius-lg)] bg-emerald-50 transition-all", collapsed ? "p-2 justify-center" : "p-3")}>
          <div className="w-8 h-8 rounded-lg bg-navy-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials || <Salad size={14} />}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-semibold text-text-secondary truncate leading-tight">{shortName}</p>
              <p className="text-xs text-emerald-600 leading-tight font-medium">{specialty}</p>
            </div>
          )}
        </div>

        <button
          onClick={signOut}
          title={collapsed ? "Çıkış Yap" : undefined}
          className={cn(
            "w-full flex items-center rounded-[var(--radius-lg)] text-xs text-text-muted hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer",
            collapsed ? "justify-center py-2 px-2" : "gap-1.5 py-2 px-3"
          )}
        >
          <LogOut size={15} />
          {!collapsed && <span>Çıkış Yap</span>}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Genişlet" : "Daralt"}
          className={cn(
            "w-full flex items-center rounded-[var(--radius-lg)] text-xs text-text-muted hover:bg-surface-muted hover:text-text-secondary transition-colors cursor-pointer",
            collapsed ? "justify-center py-2" : "justify-center gap-1.5 py-2"
          )}
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Daralt</span></>}
        </button>
      </div>
    </aside>
  );
}
