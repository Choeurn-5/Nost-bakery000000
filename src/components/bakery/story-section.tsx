"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn, placeholderImage } from "@/lib/utils";

export type StoryLayoutType = "IMAGE_LEFT" | "IMAGE_RIGHT" | "FULL_WIDTH";

export interface StoryBlockData {
  id: string;
  heading: string;
  text: string;
  image?: string | null;
  imageAlt?: string;
  layout: StoryLayoutType;
}

interface StorySectionProps {
  block: StoryBlockData;
  index: number;
}

export function StorySection({ block, index }: StorySectionProps) {
  // Alternate background between warm-white and cream
  const isEven = index % 2 === 0;
  const bgClass = isEven ? "bg-warm-white" : "bg-cream/40";
  const imageUrl = block.image || placeholderImage(block.heading, 1200, 800);

  if (block.layout === "FULL_WIDTH") {
    return (
      <section className={cn("relative py-16 sm:py-24 md:py-32 overflow-hidden", bgClass)}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="relative rounded-[24px] overflow-hidden min-h-[420px] md:min-h-[500px] flex items-center justify-center p-6 sm:p-12 md:p-16 shadow-card">
            {/* Full-width Background Image */}
            <Image
              src={imageUrl}
              alt={block.imageAlt || block.heading}
              fill
              sizes="100vw"
              className="object-cover"
              placeholder="empty"
            />
            {/* Dark overlay for contrast */}
            <div className="absolute inset-0 bg-espresso/60 backdrop-blur-[2px]" />

            {/* Centered Content */}
            <div className="relative z-10 max-w-3xl text-center text-warm-white">
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-golden mb-3">
                NOST Heritage
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight mb-5 text-warm-white">
                {block.heading}
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-warm-white/90 leading-relaxed font-sans whitespace-pre-line max-w-2xl mx-auto">
                {block.text}
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    );
  }

  const isImageLeft = block.layout === "IMAGE_LEFT";

  return (
    <section className={cn("py-16 sm:py-20 md:py-24 overflow-hidden", bgClass)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center"
        >
          {/* Image Column */}
          <div
            className={cn(
              "lg:col-span-6 w-full",
              isImageLeft ? "lg:order-1" : "lg:order-2"
            )}
          >
            <div className="relative aspect-4/3 w-full rounded-[20px] overflow-hidden shadow-card border border-espresso/10 bg-cream">
              <Image
                src={imageUrl}
                alt={block.imageAlt || block.heading}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                placeholder="empty"
              />
            </div>
          </div>

          {/* Text Column */}
          <div
            className={cn(
              "lg:col-span-6 flex flex-col justify-center",
              isImageLeft ? "lg:order-2" : "lg:order-1"
            )}
          >
            <span className="section-label mb-2">Our Craft & Story</span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-4xl font-semibold text-espresso leading-snug mb-5">
              {block.heading}
            </h2>
            <div className="prose-nost text-espresso/80 text-base sm:text-lg leading-relaxed space-y-4 font-sans whitespace-pre-line">
              {block.text}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
