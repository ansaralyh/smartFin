import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-brand-darker">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(
          "flex h-12 w-full rounded-xl border border-brand-light bg-white px-4 text-base text-brand-darker placeholder:text-slate-400 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20",
          error && "border-expense",
          className,
        )}
        {...props}
      />
      {error && <p className="text-sm text-expense">{error}</p>}
    </div>
  ),
);
Input.displayName = "Input";
