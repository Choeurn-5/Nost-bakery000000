import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "new"
  | "bestseller"
  | "seasonal"
  | "promo";

export type BadgeSize = "sm" | "md";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-butter text-espresso border border-butter/60 font-medium",
  new:
    "bg-golden text-espresso font-semibold shadow-xs",
  bestseller:
    "bg-espresso text-warm-white font-medium shadow-xs",
  seasonal:
    "bg-cream text-espresso border border-espresso/15 font-medium",
  promo:
    "bg-berry text-warm-white font-semibold shadow-xs",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "text-xs px-2.5 py-0.5 rounded-[8px] gap-1",
  md: "text-sm px-3 py-1 rounded-[10px] gap-1.5",
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = "default",
      size = "sm",
      icon,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center tracking-wide uppercase font-sans select-none whitespace-nowrap leading-none transition-colors",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {icon && (
          <span className="shrink-0 inline-flex items-center" aria-hidden="true">
            {icon}
          </span>
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
