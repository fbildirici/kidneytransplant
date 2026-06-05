import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
}

export default function Card({ className, hover = false, padding = "md", children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-200/70 shadow-[0_1px_4px_-2px_rgba(0,0,0,0.06),0_4px_12px_-6px_rgba(0,48,128,0.07)]",
        hover && "card-hover cursor-pointer",
        padding === "sm" && "p-4",
        padding === "md" && "p-6",
        padding === "lg" && "p-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
