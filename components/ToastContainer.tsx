"use client";

import { useToast } from "@/lib/toast-context";
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

const typeConfig = {
  success: { icon: CheckCircle, bg: "bg-success-50", border: "border-success-200", text: "text-success-800", iconColor: "text-success-500" },
  error: { icon: AlertCircle, bg: "bg-danger-50", border: "border-danger-200", text: "text-danger-800", iconColor: "text-danger-500" },
  warning: { icon: AlertTriangle, bg: "bg-warning-50", border: "border-warning-200", text: "text-warning-800", iconColor: "text-warning-500" },
  info: { icon: Info, bg: "bg-info-50", border: "border-info-200", text: "text-info-800", iconColor: "text-info-500" },
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2 flex flex-col items-end">
      {toasts.map((toast) => {
        const cfg = typeConfig[toast.type];
        const Icon = cfg.icon;
        return (
          <div
            key={toast.id}
            className={`flex items-center gap-2.5 ${cfg.bg} ${cfg.border} border rounded-[var(--radius-lg)] px-4 py-3 shadow-elevated min-w-[280px] max-w-md animate-slide-up`}
            role="status"
            aria-live="polite"
          >
            <Icon size={16} className={`${cfg.iconColor} flex-shrink-0`} />
            <span className={`text-sm font-medium ${cfg.text} flex-1`}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
              aria-label="Kapat"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
