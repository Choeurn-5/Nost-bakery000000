"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Play, X } from "lucide-react";
import { localized } from "@/lib/utils";

interface FreshPromiseProps {
  section?: {
    headlineEn?: string;
    headlineKm?: string;
    subHeadlineEn?: string;
    subHeadlineKm?: string;
    bodyEn?: string;
    bodyKm?: string;
    image?: string | null;
    videoUrl?: string | null;
  } | null;
  locale: string;
}

export function FreshPromise({ section, locale }: FreshPromiseProps) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const isKm = locale === "km";

  const headline =
    (section && localized(section as unknown as Record<string, unknown>, "headline", locale)) ||
    (isKm ? "ការសន្យាគុណភាពស្រស់ៗរបស់យើង" : "Our Fresh Promise");

  const subHeadline =
    (section && localized(section as unknown as Record<string, unknown>, "subHeadline", locale)) ||
    (isKm
      ? "ការប្តេជ្ញាចិត្តចំពោះគុណភាព និងសិល្បៈនៃការដុតនំពិតប្រាកដ"
      : "The dedication to artisan craft, honest ingredients, and daily baking.");

  const promisePoints = [
    {
      title: isKm ? "ដុតស្រស់រៀងរាល់ថ្ងៃ" : "Baked every day",
      desc: isKm
        ? "នំប៉័ង និងនំផេស្ត្រីទាំងអស់ត្រូវបានដុតដំបូងគេនៅពេលព្រលឹម ធានាភាពស្រស់ និងក្លិនឈ្ងុយជាប់ជានិច្ច។"
        : "Every loaf and croissant is baked early each dawn so you receive maximum aroma, flakiness, and warm crunch.",
    },
    {
      title: isKm ? "គ្រឿងផ្សំពិត ផ្ចិតផ្ចង់ក្នុងការធ្វើ" : "Real ingredients, careful craft",
      desc: isKm
        ? "ប្រើប្រាស់ប៊ឺបារាំងសុទ្ធ ម្សៅគុណភាពខ្ពស់ និងផ្អាប់មេធម្មជាតិ ដោយគ្មានសារធាតុគីមីបន្ថែម។"
        : "Pure French butter, high-grade unbleached flour, and natural long fermentations. No artificial preservatives or shortcuts.",
    },
    {
      title: isKm ? "ផលិតនៅក្រុងសៀមរាប" : "Made in Siem Reap",
      desc: isKm
        ? "ផលិតឡើងដោយមោទនភាពក្នុងទឹកដីសៀមរាប បម្រើដល់អតិថិជន និងសណ្ឋាគារល្បីៗជាច្រើន។"
        : "Proudly crafted in the heart of Siem Reap, supplying local residents, travelers, and premier hospitality venues.",
    },
  ];

  return (
    <>
      <section className="py-20 lg:py-28 bg-cream bg-paper relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Image with animated entrance */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="lg:col-span-7"
            >
              <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden shadow-2xl border border-espresso/10 bg-[#e7d8c4] group">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-108"
                  style={{
                    backgroundImage: `url(${section?.image || "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80"})`,
                  }}
                />

                {/* Video Play Overlay Button with animated pulse ripple */}
                <div className="absolute inset-0 bg-espresso/25 flex items-center justify-center backdrop-blur-[2px] transition-all duration-300 group-hover:bg-espresso/35">
                  <button
                    onClick={() => setIsVideoModalOpen(true)}
                    className="relative inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-warm-white/95 text-espresso font-semibold shadow-2xl hover:scale-105 hover:bg-warm-white active:scale-95 transition-all duration-300 cursor-pointer"
                    aria-label="Watch how we bake"
                  >
                    {/* Pulsing ring */}
                    <span className="absolute -inset-1 rounded-full bg-golden/30 animate-ping opacity-75" />

                    <div className="relative w-9 h-9 rounded-full bg-golden flex items-center justify-center text-warm-white shrink-0 shadow-sm">
                      <Play className="w-4 h-4 fill-warm-white ml-0.5" />
                    </div>
                    <span className="relative text-sm sm:text-base font-semibold">
                      {isKm ? "ទស្សនាការដុតនំរបស់យើង" : "Watch how we bake"}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Text & Points */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="lg:col-span-5 flex flex-col justify-center"
            >
              <span className="section-label inline-block mb-2">
                {isKm ? "ស្ដង់ដារគុណភាព" : "ARTISAN STANDARDS"}
              </span>

              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-espresso mb-4 leading-tight tracking-tight">
                {headline}
              </h2>

              <p className="text-base sm:text-lg text-espresso/75 font-body leading-relaxed mb-8">
                {subHeadline}
              </p>

              {/* Three Promise Points with micro-hover interactions */}
              <div className="space-y-6">
                {promisePoints.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.45,
                      delay: 0.15 + index * 0.1,
                      ease: "easeOut",
                    }}
                    className="flex items-start gap-4 p-3 -mx-3 rounded-xl hover:bg-warm-white/50 transition-colors duration-200 group"
                  >
                    <div className="mt-1 w-7 h-7 rounded-full bg-golden/20 flex items-center justify-center text-golden shrink-0 group-hover:scale-110 group-hover:bg-golden group-hover:text-warm-white transition-all duration-300 shadow-xs">
                      <CheckCircle2 className="w-5 h-5 transition-transform group-hover:rotate-6" />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-bold text-espresso mb-1 group-hover:text-golden transition-colors">
                        {point.title}
                      </h3>
                      <p className="text-sm text-espresso/70 leading-relaxed font-body">
                        {point.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-6 border-t border-espresso/10">
                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="group inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-golden hover:text-caramel transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-golden/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-3.5 h-3.5 fill-golden ml-0.5" />
                  </div>
                  <span>{isKm ? "ទស្សនាការដុតនំរបស់យើង (វីដេអូ)" : "Watch how we bake (Video)"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video Modal with AnimatePresence */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label="Watch how we bake video"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/80 backdrop-blur-md"
            onClick={() => setIsVideoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-3xl bg-espresso rounded-[22px] overflow-hidden shadow-2xl border border-warm-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-warm-white/10 text-warm-white">
                <h3 className="font-heading text-xl font-bold">
                  {isKm ? "សិល្បៈនៃការដុតនំនៅ NOST" : "The Craft of Baking at NOST"}
                </h3>
                <button
                  onClick={() => setIsVideoModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-warm-white/10 hover:bg-warm-white/20 text-warm-white flex items-center justify-center transition-colors"
                  aria-label="Close video modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Content */}
              <div className="relative aspect-video w-full bg-black flex items-center justify-center">
                {section?.videoUrl ? (
                  <iframe
                    src={section.videoUrl}
                    title="How we bake video"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="text-center p-8 text-warm-white">
                    <div className="w-16 h-16 rounded-full bg-golden/20 flex items-center justify-center text-golden mx-auto mb-4 animate-bounce">
                      <Play className="w-7 h-7 fill-golden ml-0.5" />
                    </div>
                    <h4 className="font-heading text-2xl font-bold mb-2">
                      Behind the Scenes in Our Kitchen
                    </h4>
                    <p className="text-sm text-warm-white/70 max-w-md mx-auto">
                      From early morning dough lamination to hot loaves coming out of the stone oven.
                      Full feature video coming soon!
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
