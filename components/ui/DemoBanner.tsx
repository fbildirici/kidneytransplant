"use client";
import { useState } from "react";
import { FlaskConical, X } from "lucide-react";

export default function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-amber-50 border-b border-amber-200">
      <FlaskConical size={15} className="text-amber-600 flex-shrink-0" />
      <p className="flex-1 text-xs text-amber-800 font-medium">
        <span className="font-bold">Demo Modu:</span> Bu sayfadaki bazı değerler (sağlık skoru, seri, su takibi, haftalık uyum) örnek veridir. Gerçek verileriniz giriş sonrası doktor kaydıyla oluşur.
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="p-1 rounded-lg text-amber-500 hover:bg-amber-100 transition-colors flex-shrink-0"
        aria-label="Demo uyarısını kapat"
      >
        <X size={14} />
      </button>
    </div>
  );
}
