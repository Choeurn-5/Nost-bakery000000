import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-golden text-espresso font-semibold shadow-sm hover:bg-caramel hover:text-warm-white focus-visible:ring-golden active:scale-[0.98]",
  secondary:
    "bg-cream text-espresso font-medium shadow-sm hover:bg-butter/70 focus-visible:ring-espresso/30 active:scale-[0.98]",
  outline:
    "border-2 border-golden bg-transparent text-golden font-medium hover:bg-golden/10 focus-visible:ring-golden active:scale-[0.98]",
  ghost:
    "bg-transparent text-espresso font-medium hover:bg-cream/60 focus-visible:ring-espresso/20 active:scale-[0.98]",
  danger:
    "bg-berry text-warm-white font-medium shadow-sm hover:bg-berry/90 focus-visible:ring-berry active:scale-[0.98]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-xs rounded-[12px] gap-1.5",
  md: "h-11 px-5 text-sm rounded-[14px] min-h-[44px] gap-2",
  lg: "h-12 px-6 text-base rounded-[16px] min-h-[48px] gap-2.5",
  icon: "h-11 w-11 p-0 rounded-[14px] min-h-[44px] min-w-[44px] justify-center",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      disabled,
      asChild = false,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const baseClasses = cn(
      "inline-flex items-center justify-center font-sans tracking-wide transition-all duration-200 select-none",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-warm-white",
      "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
      variantStyles[variant],
      sizeStyles[size],
      className
    );

    if (asChild) {
      if (!React.isValidElement(children)) {
        return null;
      }

      const childProps = children.props as Record<string, unknown>;
      const mergedClassName = cn(baseClasses, childProps.className as string | undefined);

      return React.cloneElement(
        children as React.ReactElement<Record<string, unknown>>,
        {
          ...props,
          ref,
          className: mergedClassName,
          "aria-disabled": isDisabled || undefined,
        }
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={loading}
        className={baseClasses}
        {...props}
      >
        {loading ? (
          <>
            <Loader2
              className="h-4 w-4 animate-spin text-current shrink-0"
              aria-hidden="true"
            />
            <span>{loadingText || children}</span>
          </>
        ) : (
          <>
            {leftIcon && (
              <span className="shrink-0 inline-flex items-center" aria-hidden="true">
                {leftIcon}
              </span>
            )}
            {children}
            {rightIcon && (
              <span className="shrink-0 inline-flex items-center" aria-hidden="true">
                {rightIcon}
              </span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
