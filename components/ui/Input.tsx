import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, hint, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full rounded-[var(--radius-md)] border bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-all duration-200",
              "focus:outline-none focus:ring-[3px] focus:ring-navy-500/15 focus:border-navy-400",
              "hover:border-border-strong",
              !!icon && "pl-10",
              !!error
                ? "border-danger-300 focus:border-danger-400 focus:ring-danger-500/15"
                : "border-border",
              className
            )}
            {...props}
          />
        </div>
        {error ? (
          <p className="text-xs text-danger-600 font-medium">{error}</p>
        ) : hint ? (
          <p className="text-xs text-text-tertiary">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
