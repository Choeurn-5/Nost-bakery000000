"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Phone, Send, ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export interface MobileBottomBarProps {
  className?: string;
  phoneNumber?: string;
  telegramUrl?: string;
  orderHref?: string;
}

export function MobileBottomBar({
  className,
  phoneNumber = "+85592123456",
  telegramUrl = "https://t.me/nostbakery",
  orderHref = "/contact",
}: MobileBottomBarProps) {
  const t = useTranslations("common");

  return (
    <nav
      aria-label="Mobile quick actions"
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 md:hidden",
        "bg-espresso text-warm-white border-t border-espresso/20",
        "shadow-[0_-4px_20px_rgba(58,36,24,0.18)]",
        "pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1.5 px-3",
        className
      )}
    >
      <div className="grid grid-cols-3 gap-2 items-center max-w-md mx-auto">
        {/* Call Button */}
        <a
          href={`tel:${phoneNumber}`}
          aria-label={t("call")}
          className="flex flex-col items-center justify-center py-1.5 px-2 rounded-xl text-warm-white/80 hover:text-warm-white hover:bg-white/10 active:scale-95 transition-all min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden"
        >
          <Phone className="h-5 w-5 mb-1" aria-hidden="true" />
          <span className="text-[11px] font-medium tracking-tight truncate max-w-full">
            {t("call")}
          </span>
        </a>

        {/* Telegram Button */}
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("telegram")}
          className="flex flex-col items-center justify-center py-1.5 px-2 rounded-xl text-warm-white/80 hover:text-warm-white hover:bg-white/10 active:scale-95 transition-all min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden"
        >
          <Send className="h-5 w-5 mb-1 text-soft-butter" aria-hidden="true" />
          <span className="text-[11px] font-medium tracking-tight truncate max-w-full">
            {t("telegram")}
          </span>
        </a>

        {/* Order Now Button - Golden Accent */}
        <Link
          href={orderHref}
          aria-label={t("orderNow")}
          className="flex flex-col items-center justify-center py-1.5 px-2 rounded-xl bg-golden hover:bg-caramel active:scale-95 text-warm-white font-semibold shadow-sm transition-all min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-butter"
        >
          <ShoppingBag className="h-5 w-5 mb-1" aria-hidden="true" />
          <span className="text-[11px] font-semibold tracking-tight truncate max-w-full">
            {t("orderNow")}
          </span>
        </Link>
      </div>
    </nav>
  );
}

export default MobileBottomBar;
