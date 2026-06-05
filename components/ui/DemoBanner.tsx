"use client";
import { useState } from "react";
import { FlaskConical, X } from "lucide-react";

export default function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="flex items-center gap-3 px-5 py-2.5 bg-surface-muted border-b border-border">
      <FlaskConical size={14} className="text-text-tertiary flex-shrink-0" />
      <p className="flex-1 text-xs text-text-secondary">
        <span className="font-semibold text-text-primary">Demo modu:</span> Bu ekrandaki bazı veriler örnektir. Gerçek kullanımda doktor ve hasta kayıtlarına göre güncellenir.
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="p-1 rounded-[var(--radius-md)] text-text-muted hover:bg-surface-subtle hover:text-text-secondary transition-colors flex-shrink-0"
        aria-label="Kapat"
      >
        <X size={14} />
      </button>
    </div>
  );
}
