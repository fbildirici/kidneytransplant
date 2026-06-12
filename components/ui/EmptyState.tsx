"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ElementType } from "react";

interface EmptyStateProps {
  icon: ElementType;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center px-5">
      <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-surface-muted border border-border flex items-center justify-center mb-3">
        <Icon size={22} className="text-text-muted" />
      </div>
      <p className="text-sm font-semibold text-text-primary mb-1">{title}</p>
      {description && <p className="text-xs text-text-secondary mb-4 max-w-xs">{description}</p>}
      {action && (
        action.href ? (
          <Link
            href={action.href}
            className="inline-flex items-center gap-1 text-xs font-semibold text-navy-600 hover:text-navy-700 transition-colors"
          >
            {action.label}
            <ArrowRight size={12} />
          </Link>
        ) : (
          <button
            onClick={action.onClick}
            className="inline-flex items-center gap-1 text-xs font-semibold text-navy-600 hover:text-navy-700 transition-colors cursor-pointer"
          >
            {action.label}
            <ArrowRight size={12} />
          </button>
        )
      )}
    </div>
  );
}
