"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Pill,
  Activity,
  Apple,
  MessageSquare,
  Calendar,
  Bot,
  UserCircle,
  HeartPulse,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Ana Panel", icon: LayoutDashboard },
  { href: "/medications", label: "Bugünkü İlaçlar", icon: Pill },
  { href: "/labs", label: "Laboratuvar", icon: Activity },
  { href: "/nutrition", label: "Beslenme", icon: Apple },
  { href: "/messages", label: "Mesajlar", icon: MessageSquare },
  { href: "/appointments", label: "Randevular", icon: Calendar },
  { href: "/ai-assistant", label: "Sağlık Asistanı", icon: Bot },
  { href: "/profile", label: "Profil", icon: UserCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col bg-surface border-r border-border h-screen sticky top-0 transition-all duration-300 ease-in-out",
        collapsed ? "w-[72px]" : "w-60"
      )}
      aria-label="Ana menü"
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-2.5 border-b border-border transition-all duration-300",
        collapsed ? "p-4 justify-center" : "p-4 px-5"
      )}>
        <div className="w-9 h-9 rounded-[var(--radius-lg)] bg-navy-600 flex items-center justify-center flex-shrink-0 shadow-subtle">
          <HeartPulse className="text-white" size={18} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-bold text-base tracking-tight leading-tight text-text-primary">
              RenaCare
            </h1>
            <p className="text-[10px] text-text-tertiary leading-tight">Hasta Takip Sistemi</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn("flex-1 py-3 space-y-0.5 overflow-y-auto", collapsed ? "px-2" : "px-3")}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "relative flex items-center gap-3 rounded-[var(--radius-lg)] text-sm font-medium transition-all duration-200",
                collapsed ? "px-2.5 py-2.5 justify-center" : "px-3 py-2",
                isActive
                  ? "bg-navy-50 text-navy-700"
                  : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
              )}
            >
              <item.icon
                size={18}
                strokeWidth={isActive ? 2.5 : 2}
                className={cn(
                  "flex-shrink-0 transition-colors",
                  isActive ? "text-navy-600" : "text-text-tertiary"
                )}
              />
              {!collapsed && <span>{item.label}</span>}
              {isActive && !collapsed && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-navy-500 rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User profile + collapse toggle */}
      <div className={cn("border-t border-border pt-3 pb-3 space-y-2", collapsed ? "px-2" : "px-3")}>
        <div
          className={cn(
            "flex items-center gap-2.5 rounded-[var(--radius-lg)] bg-surface-muted transition-all",
            collapsed ? "p-2 justify-center" : "p-2.5 px-3"
          )}
        >
          <div className="w-8 h-8 rounded-[var(--radius-md)] bg-navy-100 flex items-center justify-center text-navy-700 text-xs font-bold flex-shrink-0">
            AY
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-text-primary truncate leading-tight">Ahmet Y.</p>
              <p className="text-[11px] text-text-tertiary leading-tight">Hasta</p>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Genişlet" : "Daralt"}
          className={cn(
            "w-full flex items-center rounded-[var(--radius-md)] text-xs text-text-muted hover:bg-surface-muted hover:text-text-secondary transition-colors cursor-pointer",
            collapsed ? "justify-center py-2" : "justify-center gap-1.5 py-2"
          )}
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Daralt</span></>}
        </button>
      </div>
    </aside>
  );
}
