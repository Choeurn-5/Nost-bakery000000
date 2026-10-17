"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { localized } from "@/lib/utils";

export interface CategoryItem {
  id: string;
  nameEn: string;
  nameKm?: string;
  slug: string;
  image?: string | null;
  imageAltEn?: string;
  imageAltKm?: string;
}

interface ShopByCategoryProps {
  categories: CategoryItem[];
  locale: string;
}

const FALLBACK_CATEGORIES: CategoryItem[] = [
  {
    id: "cat-1",
    nameEn: "Viennoiserie & Croissants",
    nameKm: "នំក្រូសង់ និង វីយែនណ័រហ្សឺរី",
    slug: "croissants-viennoiserie",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cat-2",
    nameEn: "Artisan Sourdough & Loaves",
    nameKm: "នំប៉័ងសួរដូ និង នំប៉័ងដុំ",
    slug: "sourdough-breads",
    image: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cat-3",
    nameEn: "Pastries & Fruit Tarts",
    nameKm: "នំផេស្ត្រី និង នំតាតផ្លែឈើ",
    slug: "pastries-tarts",
    image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cat-4",
    nameEn: "Signature Celebration Cakes",
    nameKm: "នំខេកពិសេសសម្រាប់ពិធី",
    slug: "signature-cakes",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cat-5",
    nameEn: "Wholesale Ready-to-Bake",
    nameKm: "នំកកសម្រាប់ដុតលក់ដុំ",
    slug: "wholesale-frozen",
    image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cat-6",
    nameEn: "Café Savouries & Sandwiches",
    nameKm: "នំប្រៃ និង សាំងវិច",
    slug: "cafe-savouries",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
  },
];

export function ShopByCategory({ categories, locale }: ShopByCategoryProps) {
  const displayCategories =
    categories && categories.length > 0
      ? categories.slice(0, 6)
      : FALLBACK_CATEGORIES;

  const isKm = locale === "km";
  const sectionHeading = isKm ? "ទិញតាមប្រភេទនំ" : "Shop by Category";
  const sectionSub = isKm
    ? "ជ្រើសរើសនំប៉័ង និងនំផ្អែមតាមចំណង់ចំណូលចិត្តរបស់អ្នក"
    : "Handcrafted daily from simple, natural ingredients in Siem Reap";

  return (
    <section className="py-20 lg:py-24 bg-cream/40 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with smooth entry */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
        >
          <span className="section-label inline-block mb-2">
            {isKm ? "ម៉ឺនុយរបស់យើង" : "EXPLORE OUR COLLECTION"}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-espresso mb-4 tracking-tight">
            {sectionHeading}
          </h2>
          <p className="text-base sm:text-lg text-espresso/70 leading-relaxed font-body">
            {sectionSub}
          </p>
        </motion.div>

        {/* Categories Grid (2 cols mobile, 3 cols desktop) with staggered entrance */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {displayCategories.map((cat, index) => {
            const name = localized(cat as unknown as Record<string, unknown>, "name", locale);

            return (
              <motion.div
                key={cat.id || index}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.55,
                  delay: (index % 6) * 0.09,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
              >
                <Link
                  href={`/${locale}/menu?category=${encodeURIComponent(cat.slug)}`}
                  className="group relative aspect-[4/5] sm:aspect-square rounded-[18px] sm:rounded-[22px] overflow-hidden bg-cream border border-espresso/8 shadow-card hover:shadow-2xl hover:-translate-y-2 transition-all duration-400 flex flex-col justify-end block"
                >
                  {/* Background Image / Placeholder with smooth scale */}
                  {cat.image ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                      style={{ backgroundImage: `url(${cat.image})` }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#e8dcce] transition-transform duration-700 ease-out group-hover:scale-110 flex items-center justify-center p-4">
                      {/* Placeholder visual */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-soft-butter/40 border border-golden/30 flex items-center justify-center text-espresso/40">
                        <span className="font-heading text-2xl font-bold">
                          {name.charAt(0)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Dynamic Dark Gradient on hover */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-espresso/60 via-espresso/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                    aria-hidden="true"
                  />

                  {/* Bottom Info Banner */}
                  <div className="relative z-10 w-full p-4 sm:p-5 bg-gradient-to-t from-cream via-cream/95 to-cream/0 pt-12 sm:pt-14 text-center flex items-center justify-between transition-colors duration-300">
                    <div className="text-left flex-1 min-w-0 pr-2">
                      <h3 className="font-heading text-lg sm:text-xl lg:text-2xl font-bold text-espresso group-hover:text-golden transition-colors truncate">
                        {name}
                      </h3>
                      <span className="text-xs text-espresso/60 font-medium hidden sm:inline-block">
                        {isKm ? "មើលផលិតផល" : "View items"}
                      </span>
                    </div>

                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-warm-white/95 border border-espresso/10 flex items-center justify-center text-espresso group-hover:bg-golden group-hover:text-warm-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-xs shrink-0">
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
