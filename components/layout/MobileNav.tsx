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
  X,
  Calendar,
  Activity,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Ana Panel", icon: LayoutDashboard },
  { href: "/medications", label: "İlaçlarım", icon: Pill },
  { href: "/labs", label: "Laboratuvar", icon: Activity },
  { href: "/nutrition", label: "Beslenme", icon: Apple },
  { href: "/messages", label: "Mesajlar", icon: MessageSquare },
  { href: "/appointments", label: "Randevular", icon: Calendar },
  { href: "/ai-assistant", label: "Akıllı Asistan", icon: Bot },
  { href: "/profile", label: "Profil", icon: UserCircle },
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
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      <div className="fixed left-0 top-0 bottom-0 w-72 bg-surface shadow-popover animate-slide-up">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[var(--radius-lg)] bg-navy-600 flex items-center justify-center shadow-subtle">
              <LayoutDashboard className="text-white" size={18} />
            </div>
            <div>
              <h1 className="font-bold text-base text-text-primary">RenaCare</h1>
              <p className="text-[10px] text-text-tertiary -mt-0.5">Hasta Takip Sistemi</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-[var(--radius-md)] text-text-tertiary hover:bg-surface-muted cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <nav className="p-3 space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-[var(--radius-lg)] text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-navy-50 text-navy-700"
                    : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                )}
              >
                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-navy-600" : "text-text-tertiary"} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
