"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CalendarCheck2, ChevronLeft, ChevronRight, HeartPulse, LayoutDashboard, LogOut } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/coordinator", label: "Onay Merkezi", icon: LayoutDashboard },
];

export default function CoordinatorSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col sidebar-frosted border-r border-slate-200/60 transition-all duration-300 ease-in-out h-screen sticky top-0 shadow-[1px_0_12px_-4px_rgba(8,145,178,0.08)]",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      <div className={cn("flex items-center gap-2.5 border-b border-slate-100 transition-all duration-300", collapsed ? "p-4 justify-center" : "p-5")}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/25">
          <HeartPulse className="text-white" size={19} />
        </div>
        {!collapsed && (
          <div>
            <h1 className="font-extrabold text-lg tracking-tight leading-tight">
              <span className="text-navy-500">Rena</span>
              <span className="text-teal-600">Care</span>
            </h1>
            <p className="text-[10px] text-slate-400 leading-tight">Koordinatör Paneli</p>
          </div>
        )}
      </div>

      <nav className={cn("flex-1 py-4 space-y-0.5 overflow-y-auto", collapsed ? "px-2" : "px-3")}>
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
                isActive ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              )}
            >
              <item.icon size={19} className={cn(isActive ? "text-white" : "text-slate-400")} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={cn("border-t border-slate-100 pt-3 pb-3 space-y-2", collapsed ? "px-2" : "px-3")}>
        <div className={cn("flex items-center gap-2.5 rounded-xl bg-cyan-50 transition-all", collapsed ? "p-2 justify-center" : "p-3")}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
            <CalendarCheck2 size={14} />
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-semibold text-slate-700">Selin Demir</p>
              <p className="text-xs text-cyan-600">Koordinatör</p>
            </div>
          )}
        </div>

        <Link
          href="/login"
          className={cn(
            "flex items-center rounded-xl text-xs text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer",
            collapsed ? "justify-center py-2 px-2" : "gap-1.5 py-2 px-3"
          )}
        >
          <LogOut size={15} />
          {!collapsed && <span>Çıkış Yap</span>}
        </Link>

        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          className={cn(
            "w-full flex items-center rounded-xl text-xs text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors cursor-pointer",
            collapsed ? "justify-center py-2" : "justify-center gap-1.5 py-2"
          )}
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Daralt</span></>}
        </button>
      </div>
    </aside>
  );
}
