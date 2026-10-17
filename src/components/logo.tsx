import * as React from "react";
import { cn } from "@/lib/utils";

export interface LogoProps {
  variant?: "dark" | "light";
  className?: string;
  width?: number | string;
}

export function Logo({
  variant = "dark",
  className,
  width = 160,
}: LogoProps) {
  const fillColor = variant === "light" ? "#FBF7F1" : "#3A2418";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 160 44"
      width={width}
      height="auto"
      className={cn("overflow-visible transition-colors duration-200 select-none", className)}
      role="img"
      aria-label="NOST Bakery & Pastry"
    >
      <title>NOST Bakery &amp; Pastry</title>
      {/* Primary Wordmark */}
      <text
        x="80"
        y="25"
        textAnchor="middle"
        fill={fillColor}
        style={{
          fontFamily: 'var(--font-heading), "Cormorant Garamond", Georgia, serif',
          fontSize: "28px",
          fontWeight: 700,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
        }}
      >
        NOST
      </text>

      {/* Sub-label */}
      <text
        x="80"
        y="38"
        textAnchor="middle"
        fill={fillColor}
        opacity={variant === "light" ? 0.9 : 0.75}
        style={{
          fontFamily: 'var(--font-body), "Inter", system-ui, sans-serif',
          fontSize: "7px",
          fontWeight: 600,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
        }}
      >
        BAKERY &amp; PASTRY
      </text>
    </svg>
  );
}

export default Logo;
