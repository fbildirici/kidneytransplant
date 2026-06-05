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
  X,
  Calendar,
  Activity,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Ana Panel", icon: LayoutDashboard },
  { href: "/medications", label: "İlaçlarım", icon: Pill },
  { href: "/nutrition", label: "Beslenme", icon: Apple },
  { href: "/appointments", label: "Randevular", icon: Calendar },
  { href: "/labs", label: "Laboratuvar", icon: Activity },
  { href: "/ai-assistant", label: "AI Asistan", icon: Bot },
  { href: "/messages", label: "Doktor Mesajları", icon: MessageSquare },
  { href: "/profile", label: "Profilim", icon: UserCircle },
];

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-navy-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-0 top-0 bottom-0 w-72 bg-white shadow-xl animate-slide-up">
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-500 to-teal-500 flex items-center justify-center shadow-lg shadow-navy-500/20">
              <HeartPulse className="text-white" size={22} />
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight">
                <span className="text-navy-500">Rena</span>
                <span className="text-teal-600">Care</span>
              </h1>
              <p className="text-[10px] text-slate-400 -mt-0.5">Böbrek Sağlığı Asistanı</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-navy-500 to-teal-600 text-white shadow-lg shadow-navy-500/20"
                    : "text-slate-500 hover:bg-navy-50 hover:text-navy-600"
                )}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
