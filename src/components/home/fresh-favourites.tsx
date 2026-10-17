"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MessageCircle, ArrowRight } from "lucide-react";
import { formatPrice, localized } from "@/lib/utils";

export interface ProductItem {
  id: string;
  nameEn: string;
  nameKm?: string;
  slug: string;
  descriptionEn?: string;
  descriptionKm?: string;
  price?: number | null;
  badges?: string[];
  images?: { url: string; altEn?: string }[];
}

interface FreshFavouritesProps {
  products: ProductItem[];
  locale: string;
}

const FALLBACK_PRODUCTS: ProductItem[] = [
  {
    id: "prod-1",
    nameEn: "Classic Butter Croissant",
    nameKm: "នំក្រូសង់ប៊ឺបុរាណ",
    slug: "classic-butter-croissant",
    descriptionEn: "Multi-layered French laminated pastry baked crisp and flaky with pure butter.",
    descriptionKm: "នំក្រូសង់ប៊ឺសុទ្ធ ស្រួយស្រទាប់ៗតាមបែបបារាំង។",
    price: 2.0,
    badges: ["BEST_SELLER"],
    images: [{ url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80", altEn: "Classic Butter Croissant" }],
  },
  {
    id: "prod-2",
    nameEn: "Pain au Chocolat",
    nameKm: "នំក្រូសង់សូកូឡា",
    slug: "pain-au-chocolat",
    descriptionEn: "Flaky golden butter dough folded with double dark French chocolate batons.",
    descriptionKm: "នំស្រួយស្រទាប់រុំជាមួយសូកូឡាខ្មៅពីរបន្ទះ។",
    price: 2.5,
    badges: ["NEW"],
    images: [{ url: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&w=800&q=80", altEn: "Pain au Chocolat" }],
  },
  {
    id: "prod-3",
    nameEn: "Artisan Country Sourdough",
    nameKm: "នំប៉័ងសួរដូ",
    slug: "artisan-country-sourdough",
    descriptionEn: "Naturally fermented for 24 hours, giving an open crumb and deeply caramelized crust.",
    descriptionKm: "ផ្អាប់តាមបែបធម្មជាតិ ២៤ម៉ោង រសជាតិជូរស្រាល ស្រួយសំបកខាងក្រៅ។",
    price: 4.5,
    badges: [],
    images: [{ url: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80", altEn: "Artisan Country Sourdough" }],
  },
  {
    id: "prod-4",
    nameEn: "Almond Twice-Baked Croissant",
    nameKm: "នំក្រូសង់អាល់ម៉ុន",
    slug: "almond-twice-baked-croissant",
    descriptionEn: "Filled with rich almond frangipane cream and topped with toasted sliced almonds.",
    descriptionKm: "ញាត់ក្រែមអាល់ម៉ុនឈ្ងុយឆ្ងាញ់ និងរោយបន្ទះអាល់ម៉ុនលីង។",
    price: 2.8,
    badges: ["BEST_SELLER"],
    images: [{ url: "https://images.unsplash.com/photo-1623334044303-241021148842?auto=format&fit=crop&w=800&q=80", altEn: "Almond Twice-Baked Croissant" }],
  },
  {
    id: "prod-5",
    nameEn: "Lemon Meringue Tartlet",
    nameKm: "នំតាតក្រូចឆ្មា",
    slug: "lemon-meringue-tartlet",
    descriptionEn: "Crisp butter sablé shell filled with zesty curd and torched Italian meringue.",
    descriptionKm: "នំតាតសំបកស្រួយ ជាមួយក្រែមក្រូចឆ្មាជូរអែម និងមេរ៉ាង។",
    price: 3.5,
    badges: ["NEW"],
    images: [{ url: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80", altEn: "Lemon Meringue Tartlet" }],
  },
  {
    id: "prod-6",
    nameEn: "Salted Caramel Éclair",
    nameKm: "នំអេក្លែរការ៉ាមែលប្រៃ",
    slug: "salted-caramel-eclair",
    descriptionEn: "Choux pastry filled with silky diplomat cream and topped with caramel glaze.",
    descriptionKm: "នំស៊ូទន់ស្រាល បំពេញដោយក្រែមការ៉ាមែលប្រៃឈ្ងុយឆ្ងាញ់។",
    price: 3.0,
    badges: [],
    images: [{ url: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80", altEn: "Salted Caramel Éclair" }],
  },
  {
    id: "prod-7",
    nameEn: "Cinnamon & Cardamom Knot",
    nameKm: "នំក្រវាញក្លិនឈុន",
    slug: "cinnamon-cardamom-knot",
    descriptionEn: "Brioche dough spiced with freshly ground cardamom and cinnamon butter.",
    descriptionKm: "នំប្រ៊ីយ៉ូសទន់ល្មើយ ក្លិនឈ្ងុយឈុន និងក្រវាញ។",
    price: 2.2,
    badges: ["SEASONAL"],
    images: [{ url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80", altEn: "Cinnamon & Cardamom Knot" }],
  },
];

export function FreshFavourites({ products, locale }: FreshFavouritesProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const displayProducts =
    products && products.length > 0 ? products : FALLBACK_PRODUCTS;

  const isKm = locale === "km";
  const sectionHeading = isKm ? "នំពេញនិយមប្រចាំថ្ងៃ" : "Fresh Favourites";
  const sectionSub = isKm
    ? "នំដែលអតិថិជនយើងចូលចិត្តបំផុត ដុតស្រស់រៀងរាល់ព្រឹក"
    : "Our most beloved daily bakes, straight from the oven to start your morning.";
  const askOrderLabel = isKm ? "សួរ / កុម្ម៉ង់" : "Ask / Order";

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const cardWidth = 330;
    const scrollAmount = direction === "left" ? -cardWidth * 1.5 : cardWidth * 1.5;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section className="py-20 lg:py-24 bg-warm-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Controls and Motion */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14 gap-4"
        >
          <div className="max-w-xl">
            <span className="section-label inline-block mb-2">
              {isKm ? "ដុតស្រស់រាល់ថ្ងៃ" : "DAILY SELECTIONS"}
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-espresso mb-3 tracking-tight">
              {sectionHeading}
            </h2>
            <p className="text-base sm:text-lg text-espresso/70 font-body">
              {sectionSub}
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            <button
              onClick={() => handleScroll("left")}
              aria-label="Previous products"
              className="w-11 h-11 rounded-full border border-espresso/15 bg-warm-white hover:bg-cream text-espresso flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll("right")}
              aria-label="Next products"
              className="w-11 h-11 rounded-full border border-espresso/15 bg-warm-white hover:bg-cream text-espresso flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Horizontal Scrolling Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {displayProducts.map((prod, index) => {
            const name = localized(prod as unknown as Record<string, unknown>, "name", locale);
            const desc = localized(
              prod as unknown as Record<string, unknown>,
              "description",
              locale
            );
            const isNew = prod.badges?.includes("NEW");
            const isBestSeller = prod.badges?.includes("BEST_SELLER");
            const priceFormatted = formatPrice(prod.price);
            const firstImage = prod.images?.[0]?.url;

            // Telegram direct order link
            const tgMessage = encodeURIComponent(
              `Hello NOST Bakery! I'm interested in ordering: ${prod.nameEn}`
            );
            const orderLink = `https://t.me/NostBakery?text=${tgMessage}`;

            return (
              <motion.div
                key={prod.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  delay: (index % 5) * 0.08,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
                className="w-[280px] sm:w-[320px] shrink-0 snap-start bg-[#fffdfa] border border-espresso/10 rounded-[20px] overflow-hidden shadow-card hover:shadow-2xl hover:-translate-y-2.5 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Product Image / Visual Placeholder with zoom */}
                <div className="relative aspect-[4/3] w-full bg-cream overflow-hidden">
                  {firstImage ? (
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                      style={{ backgroundImage: `url(${firstImage})` }}
                    />
                  ) : (
                    <div className="w-full h-full bg-[#f4ebe1] flex items-center justify-center transition-transform duration-700 ease-out group-hover:scale-110">
                      <div className="text-center p-4">
                        <span className="font-heading text-3xl font-bold text-espresso/25 block mb-1">
                          NOST
                        </span>
                        <span className="text-xs uppercase tracking-wider text-espresso/40">
                          Bakery & Pastry
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                    {isNew && (
                      <span className="bg-golden text-warm-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                        {isKm ? "ថ្មី" : "NEW"}
                      </span>
                    )}
                    {isBestSeller && (
                      <span className="bg-espresso text-warm-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                        {isKm ? "ពេញនិយម" : "POPULAR"}
                      </span>
                    )}
                  </div>

                  {/* Price Tag with hover bounce */}
                  {priceFormatted && (
                    <div className="absolute bottom-3 right-3 bg-warm-white/95 backdrop-blur-sm border border-espresso/10 text-espresso font-bold text-sm px-3 py-1 rounded-full shadow-sm group-hover:scale-105 transition-transform duration-200">
                      {priceFormatted}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading text-xl font-bold text-espresso mb-1.5 group-hover:text-golden transition-colors line-clamp-1">
                      {name}
                    </h3>
                    <p className="text-xs sm:text-sm text-espresso/70 line-clamp-2 leading-relaxed mb-4 font-body">
                      {desc}
                    </p>
                  </div>

                  {/* Order Button with micro-interaction */}
                  <div className="pt-2">
                    <a
                      href={orderLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-[12px] bg-cream hover:bg-golden hover:text-warm-white text-espresso transition-all duration-300 active:scale-[0.98] shadow-xs hover:shadow-md group/btn"
                    >
                      <MessageCircle className="w-4 h-4 text-golden group-hover/btn:text-warm-white transition-colors" />
                      <span>{askOrderLabel}</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All Menu Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-10"
        >
          <Link
            href={`/${locale}/menu`}
            className="group inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-golden hover:text-caramel transition-colors underline underline-offset-4 decoration-golden/40 hover:decoration-golden"
          >
            <span>{isKm ? "មើលបញ្ជីមុខទំនិញពេញលេញ" : "Explore full bakery menu"}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
