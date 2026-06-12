import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

export default function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-md)] text-[11px] font-semibold tracking-wide",
        variant === "default" && "bg-surface-muted text-text-secondary border border-border",
        variant === "success" && "bg-success-100 text-success-700",
        variant === "warning" && "bg-warning-100 text-warning-700",
        variant === "danger" && "bg-danger-100 text-danger-700",
        variant === "info" && "bg-info-100 text-info-700",
        className
      )}
    >
      {children}
    </span>
  );
}
