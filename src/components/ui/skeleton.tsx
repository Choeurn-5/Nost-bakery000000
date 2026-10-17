import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shimmer?: boolean;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, shimmer = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label="Loading..."
        aria-busy="true"
        className={cn(
          "relative overflow-hidden bg-cream/75 rounded-[14px]",
          shimmer && [
            "before:absolute before:inset-0 before:-translate-x-full",
            "before:bg-gradient-to-r before:from-transparent before:via-warm-white/50 before:to-transparent",
            "before:animate-shimmer",
          ],
          className
        )}
        {...props}
      />
    );
  }
);
Skeleton.displayName = "Skeleton";

export interface SkeletonTextProps
  extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number;
  gap?: string;
}

export function SkeletonText({
  lines = 3,
  gap = "space-y-2",
  className,
  ...props
}: SkeletonTextProps) {
  return (
    <div className={cn("w-full", gap, className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => {
        const isLast = i === lines - 1;
        const width = isLast ? "w-3/5" : i % 2 === 0 ? "w-full" : "w-4/5";
        return (
          <Skeleton
            key={i}
            className={cn("h-4 rounded-[6px]", width)}
          />
        );
      })}
    </div>
  );
}

export function SkeletonCircle({
  size = "md",
  className,
  ...props
}: {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const sizeMap = {
    sm: "h-8 w-8",
    md: "h-11 w-11",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  };

  return (
    <Skeleton
      className={cn("rounded-full shrink-0", sizeMap[size], className)}
      {...props}
    />
  );
}

export function SkeletonCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[16px] bg-cream/40 border border-espresso/5 p-4 space-y-4 shadow-card",
        className
      )}
      {...props}
    >
      <Skeleton className="w-full aspect-[4/3] rounded-[12px]" />
      <div className="space-y-2 pt-1">
        <Skeleton className="h-6 w-3/4 rounded-[8px]" />
        <Skeleton className="h-4 w-full rounded-[6px]" />
        <Skeleton className="h-4 w-1/2 rounded-[6px]" />
      </div>
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-6 w-16 rounded-[8px]" />
        <Skeleton className="h-10 w-24 rounded-[12px]" />
      </div>
    </div>
  );
}
