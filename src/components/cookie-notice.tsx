"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CookieNoticeProps {
  storageKey?: string;
  className?: string;
}

export function CookieNotice({
  storageKey = "nost_cookie_consent",
  className,
}: CookieNoticeProps) {
  const t = useTranslations("common");
  const [isAccepted, setIsAccepted] = React.useState<boolean>(true);
  const [mounted, setMounted] = React.useState<boolean>(false);

  React.useEffect(() => {
    setMounted(true);
    try {
      const consent = window.localStorage.getItem(storageKey);
      setIsAccepted(consent === "accepted");
    } catch {
      setIsAccepted(false);
    }
  }, [storageKey]);

  const handleAccept = () => {
    setIsAccepted(true);
    try {
      window.localStorage.setItem(storageKey, "accepted");
    } catch {
      // Ignore localStorage errors
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <AnimatePresence>
      {!isAccepted && (
        <motion.div
          role="region"
          aria-label="Cookie consent banner"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "fixed bottom-14 md:bottom-0 left-0 right-0 z-40 p-3 md:p-4 pointer-events-none",
            className
          )}
        >
          <div className="max-w-4xl mx-auto bg-cream border border-espresso/15 shadow-[0_-4px_24px_rgba(58,36,24,0.12)] rounded-t-2xl md:rounded-2xl p-4 md:px-6 md:py-4 pointer-events-auto backdrop-blur-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="p-2 rounded-xl bg-golden/15 text-golden shrink-0 mt-0.5 sm:mt-0" aria-hidden="true">
                  <Cookie className="h-5 w-5" />
                </span>
                <p className="text-xs md:text-sm text-espresso/90 leading-relaxed">
                  {t("cookieNotice")}
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                <button
                  type="button"
                  onClick={handleAccept}
                  className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-[12px] bg-golden hover:bg-caramel text-warm-white text-xs md:text-sm font-semibold tracking-wide shadow-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden focus-visible:ring-offset-2"
                >
                  {t("accept")}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CookieNotice;
