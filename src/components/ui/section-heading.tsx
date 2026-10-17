import * as React from "react";
import { cn } from "@/lib/utils";

export type HeadingAlign = "left" | "center" | "right";
export type HeadingTag = "h1" | "h2" | "h3" | "h4";

export interface SectionHeadingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  label?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: HeadingAlign;
  as?: HeadingTag;
  inverted?: boolean;
}

export function SectionHeading({
  label,
  title,
  subtitle,
  align = "center",
  as: Tag = "h2",
  inverted = false,
  className,
  ...props
}: SectionHeadingProps) {
  const alignmentClasses = {
    left: "text-left items-start",
    center: "text-center items-center mx-auto",
    right: "text-right items-end ml-auto",
  }[align];

  return (
    <div
      className={cn("flex flex-col space-y-3", alignmentClasses, className)}
      {...props}
    >
      {label && (
        <span
          className={cn(
            "text-xs font-semibold tracking-[0.18em] uppercase font-sans select-none",
            inverted ? "text-butter" : "text-golden"
          )}
        >
          {label}
        </span>
      )}

      <Tag
        className={cn(
          "font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.15] tracking-tight",
          inverted ? "text-warm-white" : "text-espresso"
        )}
      >
        {title}
      </Tag>

      {subtitle && (
        <p
          className={cn(
            "text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl font-sans",
            inverted ? "text-warm-white/80" : "text-espresso/75"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
