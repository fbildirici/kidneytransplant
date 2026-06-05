import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "link";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-semibold rounded-[var(--radius-md)] transition-all duration-200 focus:outline-none focus-visible:ring-[3px] focus-visible:ring-navy-500/20 disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]",

          variant === "primary" &&
            "bg-navy-600 text-white hover:bg-navy-700 shadow-subtle hover:shadow-card",

          variant === "secondary" &&
            "bg-surface-muted text-text-primary hover:bg-surface-subtle border border-border",

          variant === "outline" &&
            "bg-transparent text-navy-600 border border-navy-200 hover:bg-navy-50 hover:border-navy-300",

          variant === "ghost" &&
            "bg-transparent text-text-secondary hover:bg-surface-muted hover:text-text-primary",

          variant === "danger" &&
            "bg-danger-500 text-white hover:bg-danger-600 shadow-subtle",

          variant === "link" &&
            "bg-transparent text-navy-600 hover:text-navy-700 underline-offset-4 hover:underline p-0 h-auto",

          size === "sm" && "px-3 py-1.5 text-sm gap-1.5 h-8",
          size === "md" && "px-4 py-2 text-sm gap-2 h-10",
          size === "lg" && "px-5 py-2.5 text-base gap-2 h-11",

          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
