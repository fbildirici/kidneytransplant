"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Pill,
  Apple,
  Bot,
  MessageSquare,
  UserCircle,
  HeartPulse,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Activity,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Ana Panel", icon: LayoutDashboard },
  { href: "/medications", label: "İlaçlarım", icon: Pill },
  { href: "/nutrition", label: "Beslenme", icon: Apple },
  { href: "/appointments", label: "Randevu Al", icon: Calendar },
  { href: "/labs", label: "Laboratuvar", icon: Activity },
  { href: "/ai-assistant", label: "AI Asistan", icon: Bot },
  { href: "/messages", label: "Doktor Mesajları", icon: MessageSquare },
  { href: "/profile", label: "Profilim", icon: UserCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col sidebar-frosted border-r border-slate-200/60 transition-all duration-300 ease-in-out h-screen sticky top-0 shadow-[1px_0_12px_-4px_rgba(0,48,128,0.06)]",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-2.5 border-b border-slate-100 transition-all duration-300",
        collapsed ? "p-4 justify-center" : "p-5"
      )}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-navy-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-navy-500/25">
          <HeartPulse className="text-white" size={19} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-extrabold text-lg tracking-tight leading-tight">
              <span className="text-navy-500">Rena</span>
              <span className="text-teal-600">Care</span>
            </h1>
            <p className="text-[10px] text-slate-400 leading-tight">Böbrek Sağlığı Asistanı</p>
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
                "relative flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200",
                collapsed ? "px-2.5 py-2.5 justify-center" : "px-3 py-2.5",
                isActive
                  ? "bg-gradient-to-r from-navy-500 to-teal-600 text-white shadow-md shadow-navy-500/25"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              )}
            >
              <item.icon
                size={19}
                className={cn(
                  "flex-shrink-0 transition-colors",
                  isActive ? "text-white" : "text-slate-400"
                )}
              />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User profile + collapse toggle */}
      <div className={cn("border-t border-slate-100 pt-3 pb-3 space-y-2", collapsed ? "px-2" : "px-3")}>
        {/* User info */}
        <div
          className={cn(
            "flex items-center gap-2.5 rounded-xl bg-slate-50 transition-all",
            collapsed ? "p-2 justify-center" : "p-3"
          )}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-navy-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            AY
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-700 truncate leading-tight">Ahmet Yılmaz</p>
              <p className="text-xs text-slate-400 leading-tight">Nakil Hastası</p>
            </div>
          )}
        </div>

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
