"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Snowflake, Flame, Award, Truck, Send, ArrowRight } from "lucide-react";
import { localized } from "@/lib/utils";

interface ForBusinessesProps {
  section?: {
    headlineEn?: string;
    headlineKm?: string;
    subHeadlineEn?: string;
    subHeadlineKm?: string;
    bodyEn?: string;
    bodyKm?: string;
  } | null;
  locale: string;
}

export function ForBusinesses({ section, locale }: ForBusinessesProps) {
  const isKm = locale === "km";

  const headline =
    (section && localized(section as unknown as Record<string, unknown>, "headline", locale)) ||
    (isKm
      ? "ការផ្គត់ផ្គង់នំប៉័ងសម្រាប់សណ្ឋាគារ ហាងកាហ្វេ និងភោជនីយដ្ឋាន"
      : "Bakery supplies for hotels, cafés and restaurants.");

  const subHeadline =
    (section && localized(section as unknown as Record<string, unknown>, "subHeadline", locale)) ||
    (isKm
      ? "បង្កើនគុណភាពអាហារពេលព្រឹក និងនំផេស្ត្រីនៅក្នុងអាជីវកម្មរបស់អ្នក ជាមួយនឹងផលិតផលកកគុណភាពខ្ពស់"
      : "Elevate your guest experience with consistent French-style bakery items, supplied raw-frozen or ready-to-bake.");

  const features = [
    {
      icon: Snowflake,
      title: isKm
        ? "នំក្រូសង់កក (ទំហំតូច និងធំ)"
        : "Raw frozen croissants",
      desc: isKm
        ? "នំក្រូសង់ប៊ឺសុទ្ធ អាចរក្សាទុកបានយូរ និងដុតបានស្រស់ៗគ្រប់ពេលវេលា។"
        : "Small & large formats made with French butter, ready to proof and bake in your kitchen.",
    },
    {
      icon: Flame,
      title: isKm ? "ផលិតផលងាយស្រួលដុត" : "Ready-to-bake items",
      desc: isKm
        ? "ដុតបានរហ័សក្នុងរយៈពេលតែប៉ុន្មាននាទី ជួយសន្សំសំចៃកម្លាំងពលកម្ម។"
        : "Minimal prep required. Bake straight from frozen in 18–22 minutes with perfect flakiness.",
    },
    {
      icon: Award,
      title: isKm ? "គុណភាពជាប់លាប់ខ្ពស់" : "Consistent quality",
      desc: isKm
        ? "គ្រប់បន្ទះនំមានទំហំ និងរសជាតិស្ដង់ដារដូចៗគ្នាជានិច្ច។"
        : "Standardized weight, shaping, and rich butter lamination every single delivery cycle.",
    },
    {
      icon: Truck,
      title: isKm ? "សេវាដឹកជញ្ជូនរហ័ស" : "Delivery options",
      desc: isKm
        ? "ដឹកជញ្ជូនដោយប្រព័ន្ធត្រជាក់នៅក្នុងក្រុងសៀមរាប និងបណ្តាខេត្តនានា។"
        : "Temperature-controlled distribution throughout Siem Reap and scheduled shipments across Cambodia.",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-espresso text-warm-white relative overflow-hidden">
      {/* Decorative ambient background with slow floating glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-golden/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-caramel/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with smooth entrance */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="max-w-3xl mb-14 sm:mb-16"
        >
          <span
            style={{ color: "#F4D9A6" }}
            className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-butter mb-3 block"
          >
            {isKm ? "សម្រាប់អាជីវកម្ម" : "B2B & WHOLESALE PARTNERSHIP"}
          </span>
          <h2
            style={{ color: "#FFFFFF" }}
            className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white !text-white mb-5 leading-tight tracking-tight"
          >
            {headline}
          </h2>
          <p
            style={{ color: "#FBF7F1" }}
            className="text-base sm:text-lg text-white/90 leading-relaxed font-body"
          >
            {subHeadline}
          </p>
        </motion.div>

        {/* 4 Feature Points Grid with staggered animation and hover micro-interactions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
                className="bg-white/[0.08] border border-white/15 rounded-[20px] p-6 hover:bg-white/[0.14] hover:border-golden/60 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-golden/25 text-butter flex items-center justify-center mb-5 group-hover:scale-115 group-hover:rotate-6 group-hover:bg-golden group-hover:text-warm-white transition-all duration-300 shadow-sm">
                    <Icon className="w-6 h-6 text-butter group-hover:text-warm-white transition-colors" />
                  </div>
                  <h3
                    style={{ color: "#FFFFFF" }}
                    className="font-heading text-xl font-bold text-white !text-white mb-2 group-hover:text-butter transition-colors"
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{ color: "#F1E6D4" }}
                    className="text-sm leading-relaxed font-body"
                  >
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Two CTAs with smooth entrance */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 border-t border-warm-white/10"
        >
          <Link
            href={`/${locale}/wholesale`}
            className="inline-flex items-center justify-center gap-2.5 h-12 sm:h-13 px-8 text-base font-semibold text-warm-white bg-golden hover:bg-caramel hover:scale-[1.03] active:scale-[0.98] rounded-[14px] shadow-lg shadow-golden/20 hover:shadow-xl hover:shadow-golden/30 transition-all duration-300"
          >
            <span>{isKm ? "ស្នើសុំព័ត៌មានលក់ដុំ" : "Request Wholesale Info"}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <a
            href="https://t.me/NostBakery"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 h-12 sm:h-13 px-8 text-base font-semibold text-warm-white border border-warm-white/70 hover:bg-warm-white/10 hover:border-warm-white hover:scale-[1.03] active:scale-[0.98] rounded-[14px] transition-all duration-300"
          >
            <Send className="w-4 h-4 text-golden" />
            <span>{isKm ? "ផ្ញើសារតាម Telegram" : "Message on Telegram"}</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
