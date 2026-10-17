"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { localized } from "@/lib/utils";

export interface PromotionItem {
  id: string;
  titleEn: string;
  titleKm?: string;
  badgeTextEn?: string;
  badgeTextKm?: string;
  descriptionEn?: string;
  descriptionKm?: string;
  finePrintEn?: string;
  finePrintKm?: string;
  image?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  dailyStartTime?: string | null;
  dailyEndTime?: string | null;
}

interface TodaysOffersProps {
  promotions: PromotionItem[];
  locale: string;
}

const FALLBACK_PROMOTIONS: PromotionItem[] = [
  {
    id: "fallback-promo-1",
    titleEn: "Evening Special: Buy 1 Get 1 Free",
    titleKm: "ការផ្តល់ជូនពិសេសពេលល្ងាច៖ ទិញ ១ ថែម ១",
    badgeTextEn: "Daily 6:00 PM – 9:00 PM",
    badgeTextKm: "រៀងរាល់ថ្ងៃ ម៉ោង ៦:០០ ល្ងាច – ៩:០០ យប់",
    descriptionEn:
      "Enjoy fresh daily baked loaves and pastries at half price before our closing hours. Baked with love today, enjoyed tonight.",
    descriptionKm:
      "រីករាយជាមួយនំប៉័ង និងនំផេស្ត្រីស្រស់ៗជារៀងរាល់ថ្ងៃជាមួយនឹងតម្លៃពិសេសមុនពេលបិទទ្វារ។",
    image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "fallback-promo-2",
    titleEn: "Morning Pastry & Artisan Coffee Combo",
    titleKm: "ឈុតនំផេស្ត្រីពេលព្រឹក និងកាហ្វេ",
    badgeTextEn: "Limited Daily Offer",
    badgeTextKm: "ការផ្តល់ជូនប្រចាំថ្ងៃ",
    descriptionEn:
      "Start your Siem Reap morning right. Pair any freshly baked golden butter croissant with our house-roasted specialty espresso.",
    descriptionKm:
      "ចាប់ផ្តើមពេលព្រឹករបស់អ្នកនៅសៀមរាប។ ញ៉ាំនំក្រូសង់ប៊ឺស្រស់ៗជាមួយកាហ្វេអេស្ព្រេសូឈ្ងុយឆ្ងាញ់។",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
  },
];

export function TodaysOffers({ promotions, locale }: TodaysOffersProps) {
  const displayPromos =
    promotions && promotions.length > 0
      ? promotions.slice(0, 2)
      : FALLBACK_PROMOTIONS;

  const isKm = locale === "km";
  const sectionHeading = isKm ? "ការផ្តល់ជូនថ្ងៃនេះ" : "Today's Offers";
  const sectionSub = isKm
    ? "រីករាយជាមួយការផ្តល់ជូនពិសេសពីឡនំរបស់យើង"
    : "Special treats and daily specials fresh from our oven";
  const viewOfferLabel = isKm ? "មើលការផ្តល់ជូន" : "View offer";
  const noteLabel = isKm
    ? "ការផ្តល់ជូនអាចមានការផ្លាស់ប្តូរ។ សូមបញ្ជាក់ជាមួយយើងខ្ញុំ។"
    : "Offers may change. Please confirm with us.";

  return (
    <section className="py-20 lg:py-24 bg-warm-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with smooth entrance */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
        >
          <span className="section-label inline-block mb-2">
            {isKm ? "ពិសេសសម្រាប់អ្នក" : "CURATED SPECIALS"}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-espresso mb-4 tracking-tight">
            {sectionHeading}
          </h2>
          <p className="text-base sm:text-lg text-espresso/70 leading-relaxed font-body">
            {sectionSub}
          </p>
        </motion.div>

        {/* 2 Promo Cards Side by Side with entrance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {displayPromos.map((promo, index) => {
            const title = localized(promo as unknown as Record<string, unknown>, "title", locale);
            const desc = localized(promo as unknown as Record<string, unknown>, "description", locale);
            const badge =
              localized(promo as unknown as Record<string, unknown>, "badgeText", locale) ||
              (isKm ? "ការផ្តល់ជូនពិសេស" : "Limited Special");

            return (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
                className="group relative bg-[#fffdfa] border border-espresso/10 rounded-[22px] p-7 sm:p-9 shadow-card hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Decorative subtle accent with animated pulse */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-soft-butter/30 to-transparent rounded-bl-full pointer-events-none transition-transform duration-700 group-hover:scale-125" />

                <div>
                  {promo.image && (
                    <div className="relative aspect-[16/9] w-full rounded-[16px] overflow-hidden mb-6 bg-cream shadow-inner">
                      <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-108"
                        style={{ backgroundImage: `url(${promo.image})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-espresso/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}

                  {/* Badge with pulse effect */}
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-berry text-warm-white text-xs font-semibold uppercase tracking-wider mb-5 shadow-sm animate-pulse-glow">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{badge}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-espresso group-hover:text-golden transition-colors duration-200 mb-3 leading-snug">
                    {title}
                  </h3>

                  {/* Description */}
                  <p className="text-base text-espresso/75 leading-relaxed font-body mb-8">
                    {desc}
                  </p>
                </div>

                {/* Link with animated arrow */}
                <div className="pt-4 border-t border-espresso/8 flex items-center justify-between">
                  <Link
                    href={`/${locale}/promotions`}
                    className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-golden group-hover:text-caramel transition-colors"
                  >
                    <span>{viewOfferLabel}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Note at Bottom */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-center text-xs sm:text-sm text-espresso/60 italic mt-10"
        >
          {noteLabel}
        </motion.p>
      </div>
    </section>
  );
}
