"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Clock, Navigation, Coffee, Wifi, Utensils, ArrowRight } from "lucide-react";
import { localized } from "@/lib/utils";

export interface LocationItem {
  id?: string;
  nameEn?: string;
  nameKm?: string;
  addressEn?: string;
  addressKm?: string;
  hoursEn?: string;
  hoursKm?: string;
  image?: string | null;
  directionsLink?: string | null;
  services?: string[];
}

interface TheCafeProps {
  location?: LocationItem | null;
  section?: {
    headlineEn?: string;
    headlineKm?: string;
    bodyEn?: string;
    bodyKm?: string;
    image?: string | null;
  } | null;
  locale: string;
}

const DEFAULT_LOCATION: LocationItem = {
  nameEn: "NOST Bakery Café at Angkor Mansion & Residence",
  nameKm: "ណូស បេកឃើរី ខេហ្វេ នៅ Angkor Mansion & Residence",
  addressEn: "Angkor Mansion & Residence, Krong Siem Reap, Cambodia",
  addressKm: "Angkor Mansion & Residence, ក្រុងសៀមរាប, កម្ពុជា",
  hoursEn: "Daily: 6:30 AM – 9:00 PM",
  hoursKm: "រៀងរាល់ថ្ងៃ៖ ម៉ោង ៦:៣០ ព្រឹក – ៩:០០ យប់",
  directionsLink: "https://maps.google.com/?q=Siem+Reap+Cambodia",
  services: ["Dine-in", "Takeaway", "Artisan Coffee", "High-speed Wi-Fi"],
};

export function TheCafe({ location, section, locale }: TheCafeProps) {
  const isKm = locale === "km";
  const loc = location || DEFAULT_LOCATION;

  const cafeName =
    localized(loc as unknown as Record<string, unknown>, "name", locale) ||
    (isKm
      ? "ណូស បេកឃើរី នៅ Angkor Mansion & Residence"
      : "NOST Bakery at Angkor Mansion & Residence");

  const address =
    localized(loc as unknown as Record<string, unknown>, "address", locale) ||
    DEFAULT_LOCATION.addressEn;

  const hours =
    localized(loc as unknown as Record<string, unknown>, "hours", locale) ||
    DEFAULT_LOCATION.hoursEn;

  const description =
    (section && localized(section as unknown as Record<string, unknown>, "body", locale)) ||
    (isKm
      ? "ក្រៅពីនំប៉័ង និងនំផេស្ត្រីប្រពៃណីបារាំង យើងក៏មានបម្រើជូននូវកាហ្វេស្រស់ កាហ្វេទឹកកក និងភេសជ្ជៈជាច្រើនមុខ ដែលជាការផ្គួបផ្សំដ៏ល្អឥតខ្ចោះជាមួយនំក្រូរសង់ក្តៅៗរបស់អ្នក។"
      : "Along with our French artisan breads and pastries, enjoy freshly brewed espresso, cold brew, and specialty coffees made with premium beans — the perfect pairing for your morning croissant.");

  const displayImage =
    section?.image ||
    loc.image ||
    "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1200&q=80";

  return (
    <section className="py-20 lg:py-28 bg-cream/50 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Details & Hours */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="lg:col-span-5 order-2 lg:order-1"
          >
            <span className="section-label inline-block mb-2">
              {isKm ? "កាហ្វេ និងភេសជ្ជៈ" : "COFFEE & BEVERAGES"}
            </span>

            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-espresso mb-5 leading-tight tracking-tight">
              {isKm ? "កាហ្វេឈ្ងុយឆ្ងាញ់ និងនំប៉័ងដុតក្តៅៗ" : "Fresh Coffee & Daily Bakes"}
            </h2>

            <p className="text-base sm:text-lg text-espresso/75 leading-relaxed font-body mb-8">
              {description}
            </p>

            {/* Info Cards with subtle hover lift */}
            <div className="space-y-4 mb-8">
              {/* Hours */}
              <div className="flex items-start gap-3.5 p-4 rounded-[18px] bg-warm-white border border-espresso/10 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-golden/15 flex items-center justify-center text-golden shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-espresso/60 block mb-0.5">
                    {isKm ? "ម៉ោងបើកបម្រើការ" : "Opening Hours"}
                  </span>
                  <span className="text-base font-bold text-espresso">{hours}</span>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3.5 p-4 rounded-[18px] bg-warm-white border border-espresso/10 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-golden/15 flex items-center justify-center text-golden shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-espresso/60 block mb-0.5">
                    {isKm ? "ទីតាំង" : "Bakery Location"}
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-espresso">
                    {cafeName}
                  </span>
                  <p className="text-xs sm:text-sm text-espresso/70 mt-0.5">{address}</p>
                </div>
              </div>
            </div>

            {/* Amenities Pills with interactive micro-animations */}
            <div className="flex flex-wrap items-center gap-2.5 mb-8">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cream border border-espresso/10 text-xs font-medium text-espresso hover:bg-golden/15 hover:border-golden/40 hover:scale-105 transition-all duration-200 cursor-default">
                <Coffee className="w-3.5 h-3.5 text-golden" />
                {isKm ? "កាហ្វេពិសេស" : "Specialty Coffee"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cream border border-espresso/10 text-xs font-medium text-espresso hover:bg-golden/15 hover:border-golden/40 hover:scale-105 transition-all duration-200 cursor-default">
                <Utensils className="w-3.5 h-3.5 text-golden" />
                {isKm ? "ញ៉ាំក្នុងហាង & ខ្ចប់" : "Dine-in & Takeaway"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cream border border-espresso/10 text-xs font-medium text-espresso hover:bg-golden/15 hover:border-golden/40 hover:scale-105 transition-all duration-200 cursor-default">
                <Wifi className="w-3.5 h-3.5 text-golden" />
                {isKm ? "វ៉ាយហ្វាយឥតគិតថ្លៃ" : "Free Wi-Fi"}
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={loc.directionsLink || "https://maps.google.com/?q=Siem+Reap+Cambodia"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-12 px-7 text-sm sm:text-base font-semibold text-warm-white bg-golden hover:bg-caramel hover:scale-[1.03] active:scale-95 rounded-[14px] shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <Navigation className="w-4 h-4" />
                <span>{isKm ? "បង្ហាញទិសដៅ" : "Get Directions"}</span>
              </a>

              <Link
                href={`/${locale}/menu`}
                className="group inline-flex items-center justify-center gap-2 h-12 px-6 text-sm sm:text-base font-semibold text-espresso hover:text-golden transition-colors"
              >
                <span>{isKm ? "មើលម៉ឺនុយ & ភេសជ្ជៈ" : "Explore Menu & Drinks"}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Large Interior Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="lg:col-span-7 order-1 lg:order-2"
          >
            <div className="relative aspect-[16/11] rounded-[26px] overflow-hidden shadow-2xl border border-espresso/10 bg-[#e7d8c4] group">
              {displayImage ? (
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-108"
                  style={{ backgroundImage: `url(${displayImage})` }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-tr from-[#e5d4c0] via-[#eedecb] to-[#f4e8d9] text-center">
                  <div className="w-20 h-20 rounded-full bg-soft-butter/40 border border-golden/30 flex items-center justify-center text-golden mb-4 shadow-sm">
                    <Coffee className="w-9 h-9" />
                  </div>
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-espresso mb-2">
                    Cozy Café Atmosphere
                  </h3>
                  <p className="text-xs sm:text-sm text-espresso/60 max-w-sm">
                    Angkor Mansion & Residence · Krong Siem Reap
                  </p>
                  <span className="text-[11px] text-espresso/40 mt-3 uppercase tracking-widest font-mono">
                    Replace: café interior photo
                  </span>
                </div>
              )}

              {/* Gradient tint on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Floating badge on image */}
              <div className="absolute bottom-4 left-4 bg-warm-white/95 backdrop-blur-md border border-espresso/10 px-4 py-2.5 rounded-[16px] shadow-lg group-hover:scale-105 transition-transform duration-300">
                <p className="text-xs font-bold text-espresso">
                  {isKm ? "ស្វាគមន៍ជារៀងរាល់ថ្ងៃ" : "Open 7 Days a Week"}
                </p>
                <p className="text-[11px] text-espresso/70 font-medium">6:30 AM – 9:00 PM</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
