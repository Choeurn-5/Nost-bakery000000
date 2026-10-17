"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export interface LanguageToggleProps {
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "md";
}

const locales: Array<{ code: "en" | "km"; label: string; fullLabel: string }> = [
  { code: "en", label: "EN", fullLabel: "English" },
  { code: "km", label: "ខ្មែរ", fullLabel: "ភាសាខ្មែរ" },
];

export function LanguageToggle({
  className,
  showIcon = false,
  size = "md",
}: LanguageToggleProps) {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = React.useTransition();

  const handleLocaleChange = (nextLocale: "en" | "km") => {
    if (nextLocale === currentLocale || isPending) return;

    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  const isSmall = size === "sm";

  return (
    <div
      role="group"
      aria-label="Language selection"
      className={cn(
        "inline-flex items-center rounded-[14px] bg-cream/70 p-1 border border-espresso/10 backdrop-blur-xs",
        isPending && "opacity-70 pointer-events-none",
        className
      )}
    >
      {showIcon && (
        <span className="pl-2 pr-1 text-espresso/60 flex items-center" aria-hidden="true">
          <Globe className="h-4 w-4" />
        </span>
      )}

      {locales.map((loc) => {
        const isActive = currentLocale === loc.code;
        return (
          <button
            key={loc.code}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={`Switch to ${loc.fullLabel}`}
            onClick={() => handleLocaleChange(loc.code)}
            disabled={isPending}
            className={cn(
              "relative z-10 flex items-center justify-center font-medium transition-colors select-none",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden rounded-[10px]",
              isSmall
                ? "h-8 px-2.5 text-xs min-w-[36px]"
                : "h-9 px-3 text-xs md:text-sm min-h-[44px] min-w-[44px]",
              isActive
                ? "text-espresso font-semibold"
                : "text-espresso/70 hover:text-espresso"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="active-locale-indicator"
                className="absolute inset-0 z-[-1] rounded-[10px] bg-golden shadow-xs"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className={loc.code === "km" ? "font-serif" : "font-sans"}>
              {loc.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
