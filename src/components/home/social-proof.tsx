"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { localized } from "@/lib/utils";

export interface GalleryItemProps {
  id: string;
  url: string;
  captionEn?: string;
  captionKm?: string;
  altEn?: string;
  altKm?: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  textEn: string;
  textKm?: string;
  rating: number;
  photo?: string | null;
  isVisible: boolean;
}

interface SocialProofProps {
  galleryItems: GalleryItemProps[];
  testimonials: TestimonialItem[];
  locale: string;
}

const FALLBACK_GALLERY: GalleryItemProps[] = [
  {
    id: "g1",
    url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
    captionEn: "Morning croissant lamination",
    captionKm: "ការរៀបស្រទាប់នំក្រូសង់ពេលព្រឹក",
  },
  {
    id: "g2",
    url: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80",
    captionEn: "Fresh country sourdough loaves",
    captionKm: "នំប៉័ងសួរដូដុតស្រស់ៗ",
  },
  {
    id: "g3",
    url: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=600&q=80",
    captionEn: "Handcrafting strawberry tarts",
    captionKm: "ការរៀបចំធ្វើនំតាតស្ត្រប៊ឺរី",
  },
  {
    id: "g4",
    url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80",
    captionEn: "Afternoon espresso & pastry pairing",
    captionKm: "កាហ្វេអេស្ព្រេសូ និងនំផេស្ត្រីពេលរសៀល",
  },
  {
    id: "g5",
    url: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=600&q=80",
    captionEn: "Ready-to-bake croissants for partner hotels",
    captionKm: "នំក្រូសង់កកសម្រាប់សណ្ឋាគារដៃគូ",
  },
  {
    id: "g6",
    url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80",
    captionEn: "NOST café corner at Angkor Mansion",
    captionKm: "ជ្រុងហាងកាហ្វេ NOST នៅ Angkor Mansion",
  },
];

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "t1",
    name: "Sophie Laurent",
    textEn: "Hands down the best French croissants in Siem Reap! The lamination is crisp and buttery, reminiscent of top Paris bakeries.",
    textKm: "ពិតជាក្រូសង់បារាំងដែលឆ្ងាញ់បំផុតនៅសៀមរាប! ស្រទាប់នំស្រួយ និងឈ្ងុយប៊ឺដូចនៅប៉ារីស។",
    rating: 5,
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    isVisible: true,
  },
  {
    id: "t2",
    name: "Vireak Chan",
    textEn: "Our boutique hotel has been ordering their raw-frozen croissants for breakfast service. The consistency and quality are unmatched.",
    textKm: "សណ្ឋាគារយើងខ្ញុំបានកុម្ម៉ង់នំក្រូសង់កករបស់ NOST សម្រាប់អាហារពេលព្រឹក។ គុណភាព និងរសជាតិពិតជាជាប់លាប់ល្អឥតខ្ចោះ។",
    rating: 5,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    isVisible: true,
  },
  {
    id: "t3",
    name: "Elena Rostova",
    textEn: "The sourdough bread has the perfect crust and chew. Pair it with their flat white in the air-conditioned café corner — pure bliss!",
    textKm: "នំប៉័ងសួរដូមានសំបកស្រួយ និងសាច់នំទន់ស្វិតឆ្ងាញ់។ ញ៉ាំជាមួយកាហ្វេ Flat White ក្នុងហាងគឺពិតជាមានក្តីសុខណាស់!",
    rating: 5,
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    isVisible: true,
  },
];

export function SocialProof({ galleryItems, testimonials, locale }: SocialProofProps) {
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);

  const isKm = locale === "km";
  const displayGallery =
    galleryItems && galleryItems.length > 0
      ? galleryItems.slice(0, 6)
      : FALLBACK_GALLERY;

  const visibleTestimonials =
    testimonials && testimonials.filter((t) => t.isVisible).length > 0
      ? testimonials.filter((t) => t.isVisible)
      : DEFAULT_TESTIMONIALS;

  const prevTestimonial = () => {
    setActiveTestimonialIdx((prev) =>
      prev === 0 ? visibleTestimonials.length - 1 : prev - 1
    );
  };

  const nextTestimonial = () => {
    setActiveTestimonialIdx((prev) =>
      prev === visibleTestimonials.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section className="py-20 lg:py-28 bg-cream/30 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with smooth entrance */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
        >
          <span className="section-label inline-block mb-2">
            {isKm ? "ពីផ្ទះបាយរបស់យើង" : "FROM OUR KITCHEN"}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-espresso mb-4 tracking-tight">
            {isKm ? "រឿងរ៉ាវ និងទិដ្ឋភាពប្រចាំថ្ងៃ" : "Fresh Moments Every Day"}
          </h2>
          <p className="text-base sm:text-lg text-espresso/70 font-body">
            {isKm
              ? "ទស្សនារូបភាពពីសកម្មភាពដុតនំ និងការពេញចិត្តរបស់អតិថិជនយើង"
              : "A glimpse behind the flour, butter, and warm smiles in our bakery."}
          </p>
        </motion.div>

        {/* Gallery Grid (2 cols mobile, 3 cols desktop) with staggered entrance */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-12">
          {displayGallery.map((item, index) => {
            const caption =
              localized(item as unknown as Record<string, unknown>, "caption", locale) ||
              item.captionEn ||
              "NOST Bakery";

            return (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  delay: (index % 6) * 0.08,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
                className="group relative aspect-square rounded-[18px] sm:rounded-[22px] overflow-hidden bg-cream border border-espresso/10 shadow-card hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300"
              >
                {item.url ? (
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                    style={{ backgroundImage: `url(${item.url})` }}
                  />
                ) : (
                  <div className="w-full h-full bg-[#ecdfd1] flex flex-col items-center justify-center p-4 text-center transition-transform duration-700 ease-out group-hover:scale-110">
                    <div className="w-12 h-12 rounded-full bg-warm-white/80 flex items-center justify-center text-golden mb-2 shadow-sm">
                      <Heart className="w-5 h-5 text-golden" />
                    </div>
                    <span className="font-heading text-base sm:text-lg font-bold text-espresso/70 line-clamp-2">
                      {caption}
                    </span>
                  </div>
                )}

                {/* Subtle hover overlay with caption */}
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-5 text-warm-white">
                  <p className="text-xs sm:text-sm font-medium tracking-wide translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    {caption}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Follow us link with animated button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <a
            href="https://www.facebook.com/NOSTBakeryPastry"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-warm-white hover:bg-espresso hover:text-warm-white border border-espresso/10 text-espresso text-sm sm:text-base font-semibold shadow-sm hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <svg
              className="w-4 h-4 text-golden fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>
              {isKm ? "តាមដានពួកយើងនៅលើ Facebook" : "Follow us on Facebook"}
            </span>
          </a>
        </motion.div>

        {/* Testimonials Slider with animated crossfade */}
        {visibleTestimonials.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="pt-12 border-t border-espresso/10"
          >
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs font-semibold tracking-widest uppercase text-golden mb-2 block">
                {isKm ? "មតិអតិថិជន" : "GUEST EXPERIENCES"}
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-espresso tracking-tight">
                {isKm ? "អ្វីដែលភ្ញៀវនិយាយអំពីយើង" : "What Our Guests Say"}
              </h3>
            </div>

            <div className="relative max-w-3xl mx-auto bg-warm-white border border-espresso/10 rounded-[24px] p-8 sm:p-12 shadow-card hover:shadow-2xl transition-shadow duration-300">
              <AnimatePresence mode="wait">
                {(() => {
                  const current = visibleTestimonials[activeTestimonialIdx];
                  if (!current) return null;
                  const text =
                    localized(current as unknown as Record<string, unknown>, "text", locale) ||
                    current.textEn;

                  return (
                    <motion.div
                      key={current.id || activeTestimonialIdx}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="text-center flex flex-col items-center"
                    >
                      {/* Stars */}
                      <div className="flex items-center gap-1.5 text-golden mb-6">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < current.rating
                                ? "fill-golden text-golden"
                                : "text-espresso/20"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Quote */}
                      <p className="font-heading text-xl sm:text-2xl text-espresso italic leading-relaxed mb-6 font-medium max-w-2xl">
                        “{text}”
                      </p>

                      {/* Reviewer info */}
                      <div className="flex items-center gap-3">
                        {current.photo ? (
                          <div
                            className="w-11 h-11 rounded-full bg-cover bg-center border border-espresso/15 shadow-sm"
                            style={{ backgroundImage: `url(${current.photo})` }}
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-golden/20 text-golden font-bold flex items-center justify-center font-heading text-lg">
                            {current.name.charAt(0)}
                          </div>
                        )}
                        <div className="text-left">
                          <span className="font-heading font-bold text-base sm:text-lg text-espresso block leading-snug">
                            {current.name}
                          </span>
                          <span className="text-xs text-espresso/60">
                            {isKm ? "អតិថិជន NOST" : "Verified Customer"}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>

              {/* Slider Arrows */}
              {visibleTestimonials.length > 1 && (
                <div className="flex items-center justify-between absolute top-1/2 -translate-y-1/2 inset-x-2 sm:-inset-x-5 pointer-events-none">
                  <button
                    onClick={prevTestimonial}
                    aria-label="Previous testimonial"
                    className="w-10 h-10 rounded-full bg-warm-white border border-espresso/15 text-espresso hover:bg-cream hover:scale-110 active:scale-95 flex items-center justify-center pointer-events-auto transition-all duration-200 shadow-md"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    aria-label="Next testimonial"
                    className="w-10 h-10 rounded-full bg-warm-white border border-espresso/15 text-espresso hover:bg-cream hover:scale-110 active:scale-95 flex items-center justify-center pointer-events-auto transition-all duration-200 shadow-md"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
