import * as React from "react";
import { useTranslations } from "next-intl";
import { Home, UtensilsCrossed } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-warm-white">
      <div className="max-w-md w-full text-center flex flex-col items-center">
        {/* Artisan Bakery 404 SVG Illustration */}
        <div className="w-44 h-44 mb-6 relative flex items-center justify-center">
          <svg
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-sm select-none"
            aria-hidden="true"
          >
            {/* Background Halo */}
            <circle cx="100" cy="100" r="80" fill="#F1E6D4" opacity="0.6" />
            <circle cx="100" cy="100" r="62" fill="#F4D9A6" opacity="0.45" />

            {/* Steam wisps */}
            <path
              d="M85 55C85 45 92 40 92 32"
              stroke="#C98A3D"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.7"
            />
            <path
              d="M100 50C100 40 107 35 107 27"
              stroke="#C98A3D"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.5"
            />
            <path
              d="M115 55C115 45 122 40 122 32"
              stroke="#C98A3D"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.7"
            />

            {/* Artisanal Loaf / Croissant Body */}
            <ellipse cx="100" cy="115" rx="58" ry="32" fill="#C98A3D" />
            <ellipse cx="100" cy="112" rx="52" ry="26" fill="#F4D9A6" />

            {/* Scoring / Crust Lines */}
            <path
              d="M72 104C78 116 86 122 92 124"
              stroke="#A66A2A"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M94 100C100 114 106 122 112 124"
              stroke="#A66A2A"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M116 104C122 116 126 120 132 122"
              stroke="#A66A2A"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Crumbs */}
            <circle cx="56" cy="148" r="3" fill="#C98A3D" />
            <circle cx="72" cy="154" r="2" fill="#A66A2A" />
            <circle cx="138" cy="150" r="3" fill="#C98A3D" />
            <circle cx="150" cy="144" r="2" fill="#A66A2A" />
          </svg>
        </div>

        {/* 404 Status Pill */}
        <span className="inline-block px-3.5 py-1 rounded-full bg-cream border border-espresso/10 text-golden font-semibold text-xs uppercase tracking-widest mb-3">
          Error 404
        </span>

        {/* Heading */}
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-espresso mb-3 tracking-tight">
          {t("title")}
        </h1>

        {/* Description */}
        <p className="text-espresso/75 text-sm sm:text-base mb-8 max-w-sm leading-relaxed">
          {t("description")}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link
            href="/"
            className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-golden hover:bg-caramel text-warm-white font-semibold text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden focus-visible:ring-offset-2"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            <span>{t("goHome")}</span>
          </Link>
          <Link
            href="/menu"
            className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cream hover:bg-butter/50 text-espresso font-semibold text-sm border border-espresso/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden"
          >
            <UtensilsCrossed className="h-4 w-4" aria-hidden="true" />
            <span>Explore Menu</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
