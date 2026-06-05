import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
          variant === "primary" && "bg-gradient-to-r from-navy-500 to-teal-600 text-white hover:from-navy-600 hover:to-teal-700 focus:ring-navy-400 shadow-lg shadow-navy-500/20 hover:shadow-xl hover:shadow-navy-500/25",
          variant === "secondary" && "bg-navy-50 text-navy-600 hover:bg-navy-100 focus:ring-navy-400",
          variant === "outline" && "border-2 border-navy-200 text-navy-600 hover:bg-navy-50 focus:ring-navy-400",
          variant === "ghost" && "text-slate-600 hover:bg-slate-100 focus:ring-slate-400",
          variant === "danger" && "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400",
          size === "sm" && "px-3.5 py-1.5 text-sm gap-1.5",
          size === "md" && "px-5 py-2.5 text-sm gap-2",
          size === "lg" && "px-7 py-3.5 text-base gap-2.5",
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
