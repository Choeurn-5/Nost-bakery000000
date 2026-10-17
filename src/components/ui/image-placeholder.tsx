import * as React from "react";
import { Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type AspectRatioType = "1/1" | "4/3" | "16/9" | "3/2" | "2/3" | "9/16" | "auto";

export interface ImagePlaceholderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  sublabel?: string;
  aspectRatio?: AspectRatioType;
  showIcon?: boolean;
}

const aspectRatioClasses: Record<AspectRatioType, string> = {
  "1/1": "aspect-square",
  "4/3": "aspect-[4/3]",
  "16/9": "aspect-video",
  "3/2": "aspect-[3/2]",
  "2/3": "aspect-[2/3]",
  "9/16": "aspect-[9/16]",
  auto: "",
};

export function ImagePlaceholder({
  label = "Replace: pastry image",
  sublabel,
  aspectRatio = "4/3",
  showIcon = true,
  className,
  ...props
}: ImagePlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden rounded-[16px] bg-cream border border-espresso/10 p-6 text-center select-none shadow-xs",
        aspectRatioClasses[aspectRatio],
        className
      )}
      {...props}
    >
      {/* Decorative Warm Background Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(#3A2418 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
        aria-hidden="true"
      />

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-2 max-w-[85%]">
        {showIcon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warm-white/80 border border-espresso/10 text-golden shadow-xs">
            <ImageIcon className="h-6 w-6" aria-hidden="true" />
          </div>
        )}

        <div className="inline-flex items-center gap-1.5 rounded-full bg-warm-white/90 border border-espresso/10 px-3.5 py-1 shadow-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-golden" aria-hidden="true" />
          <span className="font-mono text-xs font-medium text-espresso/80 truncate max-w-[240px]">
            {label}
          </span>
        </div>

        {sublabel && (
          <span className="text-xs text-espresso/60 font-sans leading-tight">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
