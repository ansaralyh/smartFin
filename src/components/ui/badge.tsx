import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

const variants = {
  default: "bg-stone-100 text-stone-600",
  success: "bg-stone-100 text-stone-700",
  warning: "bg-amber-50 text-amber-800",
  danger: "bg-red-50 text-red-700",
  info: "bg-stone-100 text-stone-600",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof variants }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
