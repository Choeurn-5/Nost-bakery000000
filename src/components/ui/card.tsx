import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverLift?: boolean;
  variant?: "cream" | "warm-white" | "outline";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverLift = true, variant = "cream", children, ...props }, ref) => {
    const variantClasses = {
      cream: "bg-cream border border-espresso/5 text-espresso",
      "warm-white": "bg-warm-white border border-espresso/10 text-espresso",
      outline: "bg-transparent border-2 border-cream text-espresso",
    }[variant];

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-[16px] shadow-card overflow-hidden",
          variantClasses,
          hoverLift &&
            "transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover motion-reduce:hover:translate-y-0",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6 pb-3", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as: Tag = "h3", ...props }, ref) => (
    <Tag
      ref={ref}
      className={cn(
        "font-heading text-xl md:text-2xl font-semibold leading-tight tracking-tight text-espresso",
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

export type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-espresso/75 leading-relaxed font-sans", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

export type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0 font-sans", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

export type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0 font-sans", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";
