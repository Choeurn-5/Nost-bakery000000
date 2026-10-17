"use client";

import React from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Clock, Coffee, Truck, ArrowRight } from "lucide-react";

interface HeroSectionProps {
  headline?: string;
  subHeadline?: string;
  image?: string | null;
}

export function HeroSection({ headline, subHeadline, image }: HeroSectionProps) {
  const tHome = useTranslations("home");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const heroHeadline = headline || tHome("heroHeadline");
  const heroSubHeadline = subHeadline || tHome("heroSubHeadline");

  const trustPoints = [
    {
      icon: Clock,
      label: tCommon("bakedFreshDaily"),
    },
    {
      icon: Coffee,
      label: locale === "km" ? "កាហ្វេ និងភេសជ្ជៈ" : "Fresh Coffee & Drinks",
    },
    {
      icon: Truck,
      label: tCommon("frozenBakerySupply"),
    },
  ];

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen w-full flex flex-col justify-between overflow-hidden bg-espresso text-warm-white selection:bg-golden selection:text-white">
      {/* Background with slow zoom */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center animate-slow-zoom transition-transform"
          style={{
            backgroundImage: `url(${image || "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1920&q=80"})`,
          }}
        />

        {/* Balanced, softer overlay so the background photo is bright and clearly visible */}
        <div
          className="absolute inset-0 bg-espresso/35"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-espresso/70 via-espresso/30 to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-espresso/20"
          aria-hidden="true"
        />
      </div>

      {/* Hero Content with staggered fluid entrance */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 flex-1 flex flex-col justify-center">
        <div className="max-w-3xl">
          {/* Label with gentle slide & fade */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <span className="h-px w-6 bg-butter" />
            <span
              style={{ color: "#F4D9A6" }}
              className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-butter drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]"
            >
              {tHome("heroLabel")}
            </span>
          </motion.div>

          {/* Headline - Explicit pure white inline style + dark drop shadow */}
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{ color: "#FFFFFF" }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-6 drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]"
          >
            {heroHeadline}
          </motion.h1>

          {/* Sub-headline - Explicit pure white inline style + drop shadow */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
            style={{ color: "#FFFFFF" }}
            className="text-lg sm:text-xl font-medium leading-relaxed max-w-2xl mb-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]"
          >
            {heroSubHeadline}
          </motion.p>

          {/* CTAs with hover and scale */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
          >
            <Link
              href={`/${locale}/menu`}
              className="group inline-flex items-center justify-center gap-2 h-12 sm:h-13 px-8 text-base font-semibold text-warm-white bg-golden hover:bg-caramel hover:scale-[1.03] hover:shadow-xl hover:shadow-golden/25 active:scale-[0.98] rounded-[14px] shadow-lg shadow-golden/20 transition-all duration-300"
            >
              <span>{tCommon("orderNow")}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href={`/${locale}/wholesale`}
              className="inline-flex items-center justify-center h-12 sm:h-13 px-8 text-base font-semibold text-warm-white border-2 border-warm-white/80 hover:bg-warm-white/15 hover:border-warm-white hover:scale-[1.03] active:scale-[0.98] rounded-[14px] transition-all duration-300"
            >
              {tCommon("wholesaleEnquiry")}
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Trust Points Row */}
      <div className="relative z-10 w-full border-t border-warm-white/10 bg-espresso/50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {trustPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.55 + index * 0.12,
                    ease: "easeOut",
                  }}
                  className="flex items-center gap-3.5 text-warm-white/90 hover:text-warm-white group transition-colors cursor-default"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-golden/20 text-golden shrink-0 group-hover:scale-110 group-hover:bg-golden group-hover:text-warm-white transition-all duration-300 shadow-xs">
                    <Icon className="w-5 h-5 transition-transform group-hover:rotate-6" />
                  </div>
                  <span className="text-sm sm:text-base font-medium tracking-wide">
                    {point.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
