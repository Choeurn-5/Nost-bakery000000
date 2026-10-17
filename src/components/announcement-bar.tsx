"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export interface AnnouncementBarProps {
  message?: string;
  href?: string;
  linkLabel?: string;
  storageKey?: string;
  className?: string;
}

export function AnnouncementBar({
  message = "Fresh French croissants & artisan breads baked daily in Siem Reap",
  href = "/promotions",
  linkLabel,
  storageKey = "nost_announcement_dismissed",
  className,
}: AnnouncementBarProps) {
  const [isDismissed, setIsDismissed] = React.useState<boolean>(true);
  const [mounted, setMounted] = React.useState<boolean>(false);

  React.useEffect(() => {
    setMounted(true);
    try {
      const stored = window.sessionStorage.getItem(storageKey);
      setIsDismissed(stored === "true");
    } catch {
      setIsDismissed(false);
    }
  }, [storageKey]);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      window.sessionStorage.setItem(storageKey, "true");
    } catch {
      // Ignore sessionStorage errors
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.aside
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          aria-label="Announcement"
          className={cn(
            "relative z-50 bg-espresso text-warm-white text-xs md:text-sm border-b border-white/10 overflow-hidden",
            className
          )}
        >
          <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-between gap-4">
            <div className="flex-1 flex items-center justify-center text-center gap-2 flex-wrap">
              <span className="font-medium text-warm-white/95">{message}</span>
              {href && (
                <Link
                  href={href}
                  className="group inline-flex items-center gap-1 font-semibold text-golden hover:text-butter underline underline-offset-4 transition-colors"
                >
                  <span>{linkLabel || "Learn more"}</span>
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              )}
            </div>

            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss announcement"
              className="shrink-0 p-1.5 -mr-1 text-warm-white/70 hover:text-warm-white rounded-lg hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

export default AnnouncementBar;
