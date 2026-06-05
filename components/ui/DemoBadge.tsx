"use client";

import { FlaskConical } from "lucide-react";

interface DemoBadgeProps {
  text?: string;
  className?: string;
}

export default function DemoBadge({ text = "Örnek veri", className = "" }: DemoBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full ${className}`}
    >
      <FlaskConical size={12} />
      {text}
    </span>
  );
}
