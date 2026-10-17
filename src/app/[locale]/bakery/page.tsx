import * as React from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { localized } from "@/lib/utils";
import { getPageMetadata } from "@/lib/seo";
import { StorySection, StoryBlockData } from "@/components/bakery/story-section";
import { Sparkles, Heart, Award, Wheat } from "lucide-react";

interface BakeryPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: BakeryPageProps): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata("bakery", locale, {
    title: locale === "km" ? "រឿងរ៉ាវរបស់យើង" : "Our Bakery & Story",
    description:
      locale === "km"
        ? "ស្វែងយល់អំពីរឿងរ៉ាវ សិល្បៈនៃការធ្វើនំ និងគ្រឿងផ្សំពិតៗនៅពីក្រោយ NOST Bakery & Pastry សៀមរាប"
        : "Discover the craftsmanship, French baking heritage, and pure ingredients behind every loaf at NOST Bakery & Pastry Siem Reap.",
  });
}

export default async function BakeryPage({ params }: BakeryPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "bakery" });

  // 1. Fetch story blocks ordered by sortOrder with defensive offline try/catch
  let blocksRaw: any[] = [];
  try {
    blocksRaw = await prisma.storyBlock.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    blocksRaw = [];
  }

  // Fallback story blocks if database is not yet seeded
  const fallbackBlocks: StoryBlockData[] = [
    {
      id: "story-1",
      heading:
        locale === "km"
          ? "ដើមកំណើតនៃ NOST — ក្តីស្រឡាញ់លើសិល្បៈដុតនំបារាំង"
          : "The NOST Story — Passion for French Artisan Baking",
      text:
        locale === "km"
          ? "NOST Bakery & Pastry ចាប់ផ្តើមឡើងពីក្តីស្រឡាញ់ចំពោះសិល្បៈនៃការធ្វើនំប៉័ងប្រពៃណីបារាំង។ យើងជឿជាក់ថានំប៉័ងដ៏ល្អបំផុតគឺកើតចេញពីការយកចិត្តទុកដាក់លើពេលវេលា ការផ្អាប់ម្សៅដោយធម្មជាតិ និងគ្រឿងផ្សំសុទ្ធសាធ ដោយមិនប្រើសារធាតុរក្សាទុកឡើយ។\n\nរាល់ព្រឹកព្រលឹម ក្រុមជាងដុតនំរបស់យើងចាប់ផ្តើមរៀបចំឡដុតនំ ដើម្បីធានាថានំប៉័ង និងនំក្រូរសង់ដែលទៅដល់ដៃលោកអ្នកគឺក្តៅៗ ស្រួយ និងឈ្ងុយប៊័រពិតប្រាកដ។"
          : "NOST Bakery & Pastry was born in the heart of Siem Reap with an enduring passion for classic French viennoiserie and sourdough craft.\n\nWe believe extraordinary bakery begins with honest patience: long natural fermentation, premium French butter, unbleached flours, and zero chemical shortcuts. Every batch is mixed, rolled, laminated, and baked with unwavering discipline before sunrise.",
      layout: "IMAGE_LEFT",
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1200&auto=format&fit=crop",
      imageAlt: "Artisan French croissants and bakery pastries",
    },
    {
      id: "story-2",
      heading:
        locale === "km"
          ? "គ្រឿងផ្សំពិតៗ គ្មានការកាត់បន្ថយគុណភាព"
          : "Pure Ingredients, Generous Craft, Zero Shortcuts",
      text:
        locale === "km"
          ? "ភាពខុសគ្នានៃនំប៉័ងរបស់យើងគឺគុណភាពគ្រឿងផ្សំ។ យើងជ្រើសរើសប៊័រនាំចូលពីប្រទេសបារាំង ម្សៅស្រូវសាលីគុណភាពខ្ពស់ និងមេផ្សិតធម្មជាតិដែលយើងថែរក្សាជារៀងរាល់ថ្ងៃ។"
          : "From our 24-layer golden croissants to our crackling sourdough batards, every bite celebrates genuine artisan standards. We bake for those who value authenticity, crunch, and delicate crumb.",
      layout: "FULL_WIDTH",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1600&auto=format&fit=crop",
      imageAlt: "Freshly baked artisan bread and natural flour sourdough",
    },
    {
      id: "story-3",
      heading:
        locale === "km"
          ? "ពីឡដុតនំរបស់យើង ទៅកាន់តុអាហារសណ្ឋាគារ និងហាងកាហ្វេ"
          : "From Our Oven to Hotels, Cafés & Community",
      text:
        locale === "km"
          ? "ក្រៅពីការបម្រើអតិថិជនផ្ទាល់នៅហាងកាហ្វេ NOST ក៏ជាដៃគូផ្គត់ផ្គង់នំប៉័ងកក និងស្រស់ដល់សណ្ឋាគារលំដាប់ខ្ពស់ ហាងកាហ្វេ និងភោជនីយដ្ឋានជាច្រើននៅសៀមរាប និងរាជធានីភ្នំពេញ។\n\nយើងមានមោទនភាពដែលបាននាំមកនូវភាពស្រស់ និងរសជាតិដ៏សម្បូរបែបដល់តុអាហារពេលព្រឹករបស់ភ្ញៀវទេសចរ និងប្រជាជនក្នុងតំបន់។"
          : "Beyond welcoming daily visitors to our cozy Wat Bo café, NOST proudly supplies premier boutique hotels, riverfront cafés, and culinary establishments across Siem Reap and Cambodia with our fresh bakes and frozen ready-to-bake range.\n\nEvery day, our team continues to refine traditional formulas to keep Siem Reap’s mornings smelling of freshly baked goodness.",
      layout: "IMAGE_RIGHT",
      image: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=1200&auto=format&fit=crop",
      imageAlt: "Master baker kneading bread dough in artisan bakery",
    },
  ];

  const blocks: StoryBlockData[] =
    blocksRaw.length > 0
      ? blocksRaw.map((b: (typeof blocksRaw)[number]) => ({
          id: b.id,
          heading: localized(b as unknown as Record<string, unknown>, "heading", locale) || b.headingEn,
          text: localized(b as unknown as Record<string, unknown>, "text", locale) || b.textEn,
          image: b.image,
          imageAlt: localized(b as unknown as Record<string, unknown>, "imageAlt", locale) || b.imageAltEn,
          layout: b.layout as "IMAGE_LEFT" | "IMAGE_RIGHT" | "FULL_WIDTH",
        }))
      : fallbackBlocks;

  return (
    <div className="min-h-screen bg-warm-white pb-20 font-sans">
      {/* ── Page Header ── */}
      <section className="bg-cream/50 border-b border-espresso/10 pt-14 pb-14 sm:pt-20 sm:pb-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-label mb-2 inline-block">Siem Reap Artisans</span>
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-semibold text-espresso mb-4">
            {t("title")}
          </h1>
          <p className="text-base sm:text-lg text-espresso/80 font-sans max-w-2xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>

          {/* Pillars of NOST */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="rounded-[16px] bg-warm-white/80 p-4 border border-espresso/10 shadow-xs">
              <Wheat className="h-5 w-5 text-golden mb-2" />
              <div className="text-xs font-semibold text-espresso uppercase tracking-wider">Natural</div>
              <div className="text-xs text-espresso/70 mt-0.5">Slow Fermentation</div>
            </div>
            <div className="rounded-[16px] bg-warm-white/80 p-4 border border-espresso/10 shadow-xs">
              <Sparkles className="h-5 w-5 text-golden mb-2" />
              <div className="text-xs font-semibold text-espresso uppercase tracking-wider">French Butter</div>
              <div className="text-xs text-espresso/70 mt-0.5">No Margarine</div>
            </div>
            <div className="rounded-[16px] bg-warm-white/80 p-4 border border-espresso/10 shadow-xs">
              <Award className="h-5 w-5 text-golden mb-2" />
              <div className="text-xs font-semibold text-espresso uppercase tracking-wider">Artisan</div>
              <div className="text-xs text-espresso/70 mt-0.5">Handcrafted Daily</div>
            </div>
            <div className="rounded-[16px] bg-warm-white/80 p-4 border border-espresso/10 shadow-xs">
              <Heart className="h-5 w-5 text-golden mb-2" />
              <div className="text-xs font-semibold text-espresso uppercase tracking-wider">Siem Reap</div>
              <div className="text-xs text-espresso/70 mt-0.5">Local Pride</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Story Blocks Section List ── */}
      <main>
        {blocks.map((block, index) => (
          <StorySection key={block.id} block={block} index={index} />
        ))}
      </main>
    </div>
  );
}
