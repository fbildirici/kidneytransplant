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
        "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold",
        variant === "default" && "bg-slate-100 text-slate-600",
        variant === "success" && "bg-emerald-100 text-emerald-700",
        variant === "warning" && "bg-amber-100 text-amber-700",
        variant === "danger" && "bg-red-100 text-red-700",
        variant === "info" && "bg-teal-100 text-teal-700",
        className
      )}
    >
      {children}
    </span>
  );
}
