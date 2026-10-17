"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, ChevronDown, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { localized } from "@/lib/utils";

interface ReachAcrossCambodiaProps {
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

export function ReachAcrossCambodia({ section, locale }: ReachAcrossCambodiaProps) {
  const [showProvinces, setShowProvinces] = useState(false);

  const isKm = locale === "km";

  const headline =
    (section && localized(section as unknown as Record<string, unknown>, "headline", locale)) ||
    (isKm ? "ដឹកជញ្ជូនទូទាំងប្រទេសកម្ពុជា" : "Reach Across Cambodia");

  const copy =
    (section && localized(section as unknown as Record<string, unknown>, "subHeadline", locale)) ||
    (isKm
      ? "ផ្តល់ជូនភាពស្រស់ថ្មីលើសពីក្រុងសៀមរាប"
      : "Delivering freshness beyond Siem Reap.");

  const description =
    (section && localized(section as unknown as Record<string, unknown>, "body", locale)) ||
    (isKm
      ? "យើងផ្តល់ជូនសេវាដឹកជញ្ជូនផលិតផលនំកក និងនំដុតរួច តាមរយៈរថយន្តរក្សាសីតុណ្ហភាពត្រជាក់ ដើម្បីធានាថាគុណភាពនំនៅតែល្អឥតខ្ចោះនៅពេលទៅដល់ដៃអ្នក។"
      : "Through our reliable cold-chain network, NOST supplies frozen dough, par-baked croissants, and specialty breads to hospitality venues and partner cafés across the country.");

  const provinces = [
    "Siem Reap (Hub)", "Phnom Penh", "Battambang", "Banteay Meanchey",
    "Kampot", "Preah Sihanouk", "Kandal", "Kampong Cham",
    "Kampong Thom", "Kep", "Koh Kong", "Pursat",
    "Preah Vihear", "Oddar Meanchey", "Kampong Chhnang", "Kampong Speu",
    "Takeo", "Prey Veng", "Svay Rieng", "Kratie",
    "Stung Treng", "Ratanakiri", "Mondulkiri", "Pailin", "Tboung Khmum"
  ];

  return (
    <section className="py-20 lg:py-28 bg-warm-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Info & Actions */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="lg:col-span-6"
          >
            <span className="section-label inline-block mb-2">
              {isKm ? "បណ្តាញចែកចាយទូទាំងប្រទេស" : "COLD CHAIN DISTRIBUTION"}
            </span>

            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-espresso mb-3 leading-tight tracking-tight">
              {headline}
            </h2>

            <p className="font-heading text-xl sm:text-2xl text-golden font-semibold mb-6">
              {copy}
            </p>

            <p className="text-base sm:text-lg text-espresso/75 leading-relaxed font-body mb-8">
              {description}
            </p>

            {/* Trust points */}
            <div className="space-y-3.5 mb-8">
              <div className="flex items-center gap-3 text-espresso/80 p-2.5 -mx-2.5 rounded-xl hover:bg-cream/40 transition-colors">
                <ShieldCheck className="w-5 h-5 text-golden shrink-0" />
                <span className="text-sm sm:text-base font-medium">
                  {isKm
                    ? "រក្សាសីតុណ្ហភាពត្រជាក់ជាប់ជានិច្ច (-18°C សម្រាប់នំកក)"
                    : "Strict -18°C cold-chain maintenance for raw frozen pastries"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-espresso/80 p-2.5 -mx-2.5 rounded-xl hover:bg-cream/40 transition-colors">
                <Truck className="w-5 h-5 text-golden shrink-0" />
                <span className="text-sm sm:text-base font-medium">
                  {isKm
                    ? "ការដឹកជញ្ជូនទៀងទាត់តាមកាលវិភាគកំណត់"
                    : "Reliable scheduled departures connecting key provinces"}
                </span>
              </div>
            </div>

            {/* Check delivery button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href={`/${locale}/contact?type=wholesale`}
                className="group inline-flex items-center justify-center gap-2.5 h-12 sm:h-13 px-7 text-sm sm:text-base font-semibold text-warm-white bg-golden hover:bg-caramel hover:scale-[1.03] active:scale-95 rounded-[14px] shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <Truck className="w-4 h-4" />
                <span>
                  {isKm ? "ពិនិត្យការដឹកជញ្ជូនទៅកាន់តំបន់របស់អ្នក" : "Check delivery to your area"}
                </span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* 25 Provinces expandable section with smooth AnimatePresence */}
            <div className="mt-8 pt-6 border-t border-espresso/10">
              <button
                onClick={() => setShowProvinces(!showProvinces)}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-espresso/70 hover:text-golden transition-colors cursor-pointer"
              >
                <span>
                  {showProvinces
                    ? (isKm ? "លាក់បញ្ជីខេត្តទាំង ២៥" : "Hide 25 provinces coverage list")
                    : (isKm ? "បង្ហាញបញ្ជីខេត្តទាំង ២៥ ដែលយើងអាចដឹកដល់ ▼" : "View nationwide provincial coverage ▼")}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    showProvinces ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Collapsible animated provinces grid */}
              <AnimatePresence>
                {showProvinces && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 p-5 rounded-[18px] bg-cream/50 border border-espresso/8 shadow-sm">
                      <p className="text-xs font-semibold text-espresso/70 mb-3 uppercase tracking-wider">
                        {isKm ? "ខេត្ត-ក្រុងដែលមានបណ្តាញដឹកជញ្ជូន" : "Serviced Provinces & Cities"}
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-espresso/80">
                        {provinces.map((prov, i) => (
                          <div key={i} className="flex items-center gap-1.5 py-1 px-1.5 rounded-md hover:bg-warm-white/70 transition-colors">
                            <CheckCircle2 className="w-3.5 h-3.5 text-golden shrink-0" />
                            <span className={prov.includes("Hub") ? "font-bold text-golden" : ""}>
                              {prov}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right Column: Elegant Cambodia Map SVG with animated entry */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="lg:col-span-6 flex items-center justify-center"
          >
            <div className="relative w-full max-w-lg aspect-square bg-cream/40 rounded-[26px] border border-espresso/10 p-6 sm:p-8 flex items-center justify-center shadow-2xl overflow-hidden hover:shadow-card-hover transition-shadow duration-300 group">
              {/* Subtle background radial glow */}
              <div className="absolute inset-0 bg-radial from-soft-butter/30 via-transparent to-transparent pointer-events-none group-hover:scale-110 transition-transform duration-700" />

              {/* Cambodia stylized vector map */}
              <svg
                viewBox="0 0 600 500"
                className="w-full h-full drop-shadow-md select-none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Simplified smooth Cambodia outline */}
                <path
                  d="M170 120 
                     C200 90, 260 85, 320 95 
                     C360 85, 410 80, 470 120 
                     C510 150, 520 200, 500 250 
                     C490 280, 460 320, 440 370 
                     C420 400, 370 410, 330 400 
                     C300 420, 260 430, 220 425 
                     C170 420, 130 380, 120 340 
                     C110 300, 90 250, 110 200 
                     C130 150, 150 135, 170 120 Z"
                  fill="#F1E6D4"
                  stroke="#C98A3D"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                  className="transition-all duration-300"
                />

                {/* Tonle Sap Lake shape */}
                <path
                  d="M210 210 C240 180, 290 220, 320 260 C290 280, 240 270, 210 210 Z"
                  fill="#E6D3BC"
                  opacity="0.6"
                />

                {/* Delivery routes arcs radiating from Siem Reap */}
                <path
                  d="M250 180 Q300 240 360 320"
                  stroke="#C98A3D"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                  opacity="0.75"
                />
                <path
                  d="M250 180 Q210 200 175 220"
                  stroke="#C98A3D"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                  opacity="0.75"
                />
                <path
                  d="M250 180 Q280 290 285 390"
                  stroke="#C98A3D"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                  opacity="0.5"
                />
                <path
                  d="M250 180 Q330 220 390 270"
                  stroke="#C98A3D"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                  opacity="0.5"
                />

                {/* Major city nodes */}
                <circle cx="360" cy="320" r="5" fill="#3A2418" />
                <text x="375" y="325" fill="#3A2418" fontSize="13" fontWeight="600" fontFamily="sans-serif">
                  Phnom Penh
                </text>

                <circle cx="175" cy="220" r="4.5" fill="#3A2418" opacity="0.8" />
                <text x="110" y="225" fill="#3A2418" fontSize="12" fontWeight="500" fontFamily="sans-serif">
                  Battambang
                </text>

                <circle cx="285" cy="390" r="4.5" fill="#3A2418" opacity="0.8" />
                <text x="210" y="405" fill="#3A2418" fontSize="12" fontWeight="500" fontFamily="sans-serif">
                  Sihanoukville
                </text>

                {/* Siem Reap (Hub with Pulsing Golden Ring) */}
                <g transform="translate(250, 180)">
                  <circle cx="0" cy="0" r="18" fill="#C98A3D" opacity="0.25">
                    <animate attributeName="r" values="10;26;10" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.45;0.05;0.45" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="0" cy="0" r="9" fill="#C98A3D" />
                  <circle cx="0" cy="0" r="4" fill="#FBF7F1" />
                  <text
                    x="16"
                    y="5"
                    fill="#3A2418"
                    fontSize="15"
                    fontWeight="800"
                    fontFamily="serif"
                  >
                    SIEM REAP
                  </text>
                  <text
                    x="16"
                    y="19"
                    fill="#C98A3D"
                    fontSize="11"
                    fontWeight="700"
                    fontFamily="sans-serif"
                    letterSpacing="0.05em"
                  >
                    ★ MAIN BAKERY HUB
                  </text>
                </g>
              </svg>

              {/* Map Footer Label */}
              <div className="absolute bottom-4 left-6 right-6 text-center">
                <span className="text-[11px] uppercase tracking-wider text-espresso/60 font-semibold">
                  {isKm
                    ? "ការផ្គត់ផ្គង់ប្រចាំថ្ងៃពីក្រុងសៀមរាប"
                    : "Daily Fresh Deliveries From Siem Reap Bakery"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
