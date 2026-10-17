import * as React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { localized, formatPrice, placeholderImage } from "@/lib/utils";
import { getPageMetadata } from "@/lib/seo";
import { WholesaleEnquiryForm } from "@/components/wholesale/enquiry-form";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Package,
  Truck,
  CheckCircle,
  Snowflake,
  ShieldCheck,
  Clock,
  Sparkles,
} from "lucide-react";

interface WholesalePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: WholesalePageProps): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata("wholesale", locale, {
    title: locale === "km" ? "ការផ្គត់ផ្គង់លក់ដុំ និង នំប៉័ងកក" : "Wholesale & Frozen Bakery Supply",
    description:
      locale === "km"
        ? "ការផ្គត់ផ្គង់នំប៉័ងកកឆៅ និងត្រៀមដុត សម្រាប់សណ្ឋាគារ ហាងកាហ្វេ និងភោជនីយដ្ឋានទូទាំងប្រទេសកម្ពុជា"
        : "Consistent quality raw-frozen and ready-to-bake croissants, viennoiseries, and artisan breads for hotels, cafés, and restaurants.",
  });
}

export default async function WholesalePage({ params }: WholesalePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "wholesale" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  // 1. Fetch Wholesale settings and data with defensive try/catch
  let settings: any = null;
  let productsRaw: any[] = [];
  let stepsRaw: any[] = [];
  let faqsRaw: any[] = [];

  try {
    settings = await prisma.wholesaleSettings.findUnique({
      where: { id: "default" },
    });
    productsRaw = await prisma.product.findMany({
      where: {
        status: "PUBLISHED",
        availability: { not: "HIDDEN" },
        channelTags: {
          hasSome: ["FROZEN", "WHOLESALE"],
        },
      },
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }],
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
          take: 1,
        },
      },
    });
    stepsRaw = await prisma.wholesaleStep.findMany({
      orderBy: { sortOrder: "asc" },
    });
    faqsRaw = await prisma.faqItem.findMany({
      where: {
        section: "wholesale",
        isVisible: true,
      },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    settings = null;
    productsRaw = [];
    stepsRaw = [];
    faqsRaw = [];
  }

  const heroHeadline = settings
    ? localized(settings as unknown as Record<string, unknown>, "heroHeadline", locale) || t("heroHeadline")
    : t("heroHeadline");

  const heroSubHeadline = settings
    ? localized(settings as unknown as Record<string, unknown>, "heroSubHeadline", locale) || t("heroSubHeadline")
    : t("heroSubHeadline");

  const deliveryCoverage = settings
    ? localized(settings as unknown as Record<string, unknown>, "deliveryCoverage", locale)
    : "";

  const minimumOrder = settings
    ? localized(settings as unknown as Record<string, unknown>, "minimumOrderText", locale)
    : "";

  const defaultFaqs = [
    {
      id: "faq-1",
      q: locale === "km" ? "តើបរិមាណបញ្ជាទិញអប្បបរមា (MOQ) ជាអ្វី?" : "What is the minimum order quantity (MOQ)?",
      a:
        locale === "km"
          ? "សម្រាប់ក្រុងសៀមរាប យើងមិនមានកម្រិតអប្បបរមាខ្ពស់ទេ (ចាប់ពី 20 នំឡើងទៅ)។ សម្រាប់ការដឹកជញ្ជូនទៅកាន់រាជធានីភ្នំពេញ ឬខេត្តផ្សេងៗ យើងរៀបចំតាមប្រអប់កកស្តង់ដារ 50-100 នំ។"
          : "For local Siem Reap deliveries, our minimum order is modest (from 20 pieces). For Phnom Penh and provincial cold-chain shipping, standard insulated boxes start at 50 to 100 pieces per order.",
    },
    {
      id: "faq-2",
      q: locale === "km" ? "តើនំប៉័ងកកឆៅគួររក្សាទុក និងដុតដូចម្តេច?" : "How should raw-frozen croissants be stored and baked?",
      a:
        locale === "km"
          ? "រក្សាទុកក្នុងទូរបង្កកសីតុណ្ហភាព -18°C រហូតដល់ 3 ខែ។ ពេលត្រូវការដុត គ្រាន់តែរំលាយ និងផ្អាប់ទុកឲ្យឡើងទ្វេដង (ប្រហែល 2-2.5 ម៉ោង) រួចដុតក្នុងកម្តៅ 175°C រយៈពេល 16-18 នាទី។"
          : "Keep frozen at -18°C or below for up to 90 days. Thaw and proof at ambient room temperature for approx 2 hours, brush lightly with egg wash, and bake at 175°C for 16–18 minutes until deep golden.",
    },
    {
      id: "faq-3",
      q: locale === "km" ? "តើ NOST ផ្តល់សេវាដឹកជញ្ជូនទៅខេត្តណាខ្លះ?" : "Do you deliver outside Siem Reap?",
      a:
        locale === "km"
          ? "បាទ/ចាស! យើងមានសេវាវេចខ្ចប់រក្សាសីតុណ្ហភាពត្រជាក់ (Cold-box delivery) ទៅកាន់ភ្នំពេញ បាត់ដំបង កំពង់ចាម និងខេត្តធំៗជារៀងរាល់សប្តាហ៍។"
          : "Yes! We ship regularly across Cambodia including Phnom Penh, Battambang, and Kampong Cham via reliable cold-chain bus and temperature-controlled logistics partners.",
    },
    {
      id: "faq-4",
      q: locale === "km" ? "តើខ្ញុំអាចសុំសំណាកសាកល្បង (Sample Tasting) បានទេ?" : "Can we request product samples for tasting?",
      a:
        locale === "km"
          ? "ពិតជាបាន! សូមបំពេញទម្រង់ស្នើសុំខាងក្រោម ឬទាក់ទងមក Telegram របស់យើង ដើម្បីរៀបចំកញ្ចប់សាកល្បងសម្រាប់សណ្ឋាគារ ឬហាងកាហ្វេរបស់អ្នក។"
          : "Absolutely. We are pleased to provide sample tasting boxes for qualified hotels, cafés, and restaurant kitchens. Message our wholesale team to arrange a demonstration pack.",
    },
  ];

  const defaultSteps = [
    {
      step: "01",
      icon: MessageSquare,
      title: t("step1"),
      desc: t("step1Desc"),
    },
    {
      step: "02",
      icon: Package,
      title: t("step2"),
      desc: t("step2Desc"),
    },
    {
      step: "03",
      icon: Truck,
      title: t("step3"),
      desc: t("step3Desc"),
    },
    {
      step: "04",
      icon: CheckCircle,
      title: t("step4"),
      desc: t("step4Desc"),
    },
  ];

  const steps =
    stepsRaw.length > 0
      ? stepsRaw.map((s: (typeof stepsRaw)[number], idx: number) => {
          let IconComp = MessageSquare;
          if (idx === 1 || s.icon?.includes("pack")) IconComp = Package;
          else if (idx === 2 || s.icon?.includes("truck")) IconComp = Truck;
          else if (idx === 3 || s.icon?.includes("check")) IconComp = CheckCircle;

          return {
            step: `0${idx + 1}`,
            icon: IconComp,
            title: localized(s as unknown as Record<string, unknown>, "title", locale) || s.titleEn,
            desc: localized(s as unknown as Record<string, unknown>, "description", locale) || s.descriptionEn,
          };
        })
      : defaultSteps;

  const faqs =
    faqsRaw.length > 0
      ? faqsRaw.map((f: (typeof faqsRaw)[number]) => ({
          id: f.id,
          q: localized(f as unknown as Record<string, unknown>, "question", locale) || f.questionEn,
          a: localized(f as unknown as Record<string, unknown>, "answer", locale) || f.answerEn,
        }))
      : defaultFaqs;

  return (
    <div className="min-h-screen bg-warm-white pb-20 font-sans">
      {/* ── 1. Hero Section ── */}
      <section className="relative bg-cream/50 border-b border-espresso/10 pt-14 pb-16 sm:pt-20 sm:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-golden/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-espresso mb-4">
            <Snowflake className="h-3.5 w-3.5 text-golden" />
            <span>{locale === "km" ? "ដំណោះស្រាយលក់ដុំសម្រាប់អាជីវកម្ម" : "B2B Bakery Solutions"}</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-semibold text-espresso max-w-4xl mx-auto leading-tight mb-5">
            {heroHeadline}
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-espresso/80 leading-relaxed mb-8">
            {heroSubHeadline}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a
              href="#enquiry"
              className="inline-flex min-h-[44px] items-center justify-center rounded-[14px] bg-golden px-6 py-2.5 text-sm font-semibold text-espresso shadow-sm transition-colors hover:bg-caramel hover:text-warm-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden"
            >
              {t("enquiryForm")}
            </a>
            <a
              href="#products"
              className="inline-flex min-h-[44px] items-center justify-center rounded-[14px] bg-warm-white border border-espresso/15 px-6 py-2.5 text-sm font-medium text-espresso shadow-xs transition-colors hover:bg-cream"
            >
              {locale === "km" ? "មើលផលិតផលកក" : "View Frozen Range"}
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-12 pt-8 border-t border-espresso/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-left max-w-4xl mx-auto">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 text-golden shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-espresso/90">Pure French Butter</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Snowflake className="h-5 w-5 text-golden shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-espresso/90">Flash Frozen at -35°C</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Truck className="h-5 w-5 text-golden shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-espresso/90">Nationwide Cold Logistics</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="h-5 w-5 text-golden shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-espresso/90">Bake On Demand</span>
            </div>
          </div>
        </div>
      </section>

      {/* Optional Delivery Coverage Notice */}
      {(deliveryCoverage || minimumOrder) && (
        <aside aria-label="Coverage and minimum order" className="bg-golden/10 border-b border-golden/20 py-3.5 px-4 text-center">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-xs sm:text-sm text-espresso font-medium">
            {deliveryCoverage && <span>📍 {deliveryCoverage}</span>}
            {minimumOrder && <span>📦 {minimumOrder}</span>}
          </div>
        </aside>
      )}

      {/* ── 2. Frozen Product List ── */}
      <section id="products" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="section-label mb-2 inline-block">Supply Portfolio</span>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-espresso mb-3">
            {locale === "km" ? "ផលិតផលកកឆៅ និងត្រៀមដុត" : "Frozen & Ready-to-Bake Line"}
          </h2>
          <p className="text-sm sm:text-base text-espresso/75 leading-relaxed">
            {locale === "km"
              ? "ផ្តល់ជូននូវភាពស្រស់ដូចដុតផ្ទាល់ពីឡ ងាយស្រួលគ្រប់គ្រងស្តុក និងកាត់បន្ថយការខ្ជះខ្ជាយ"
              : "Eliminate early-morning baking overhead. Unbox, proof, and serve authentic bakery aroma in your hotel or café."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productsRaw.length > 0 ? (
            productsRaw.map((p: (typeof productsRaw)[number]) => {
              const name = localized(p as unknown as Record<string, unknown>, "name", locale) || p.nameEn;
              const desc = localized(p as unknown as Record<string, unknown>, "description", locale) || p.descriptionEn;
              const priceStr = formatPrice(p.price);
              const img = p.images[0]?.url || placeholderImage(p.nameEn, 600, 450);

              return (
                <div
                  key={p.id}
                  className="rounded-[18px] bg-warm-white border border-espresso/10 overflow-hidden shadow-card flex flex-col justify-between hover:shadow-card-hover transition-all"
                >
                  <div>
                    <div className="relative aspect-16/10 w-full overflow-hidden bg-cream">
                      <Image
                        src={img}
                        alt={name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 hover:scale-105"
                        placeholder="empty"
                      />
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        <Badge variant="bestseller" size="sm">
                          <Snowflake className="h-3 w-3 mr-1" />
                          FROZEN B2B
                        </Badge>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-heading text-xl font-semibold text-espresso">
                          {name}
                        </h3>
                        {priceStr && (
                          <span className="font-heading text-lg font-semibold text-golden whitespace-nowrap">
                            {priceStr}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-espresso/75 leading-relaxed line-clamp-3">
                        {desc}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <a
                      href="#enquiry"
                      className="inline-flex w-full min-h-[44px] items-center justify-center rounded-[12px] bg-cream text-espresso text-xs sm:text-sm font-semibold hover:bg-golden hover:text-espresso transition-colors"
                    >
                      {tCommon("requestWholesale")}
                    </a>
                  </div>
                </div>
              );
            })
          ) : (
            // Default showcased wholesale staples
            [
              {
                title: "Raw Frozen Butter Croissant (60g & 80g)",
                desc: "100% French butter lamination with 24 layers. Flaky crust, honeycomb interior crumb. Pre-shaped and ready to proof.",
                image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600&auto=format&fit=crop",
              },
              {
                title: "Pain au Chocolat (Chocolate Croissant)",
                desc: "Filled with double Belgian dark chocolate batons. Melts luxuriously in the oven with golden caramelized exterior.",
                image: "https://images.unsplash.com/photo-1623334044303-241021148842?q=80&w=600&auto=format&fit=crop",
              },
              {
                title: "Artisan Sourdough Batard (Pre-Baked)",
                desc: "Naturally fermented 36-hour sourdough. Part-baked; bake for 8 minutes to achieve crackling crust and airy texture.",
                image: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?q=80&w=600&auto=format&fit=crop",
              },
            ].map((mock, i) => (
              <div
                key={i}
                className="rounded-[18px] bg-warm-white border border-espresso/10 overflow-hidden shadow-card p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-cream rounded-[14px] mb-4">
                    <Image
                      src={mock.image}
                      alt={mock.title}
                      fill
                      sizes="33vw"
                      className="object-cover"
                      placeholder="empty"
                    />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-espresso mb-2">
                    {mock.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-espresso/75 leading-relaxed">
                    {mock.desc}
                  </p>
                </div>
                <div className="mt-5">
                  <a
                    href="#enquiry"
                    className="inline-flex w-full min-h-[44px] items-center justify-center rounded-[12px] bg-golden/20 text-espresso text-xs sm:text-sm font-semibold hover:bg-golden transition-colors"
                  >
                    {tCommon("requestWholesale")}
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ── 3. 4-Step 'How Ordering Works' ── */}
      <section className="bg-cream/40 py-16 sm:py-24 border-y border-espresso/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="section-label mb-2 inline-block">Simple & Seamless</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-espresso mb-3">
              {t("howItWorks")}
            </h2>
            <p className="text-sm sm:text-base text-espresso/75 leading-relaxed">
              {locale === "km"
                ? "ដំណើរការបញ្ជាទិញសាមញ្ញ និងរហ័ស ពីការសាកសួររហូតដល់ការដឹកជញ្ជូនដល់កន្លែង"
                : "From your initial enquiry to hot croissants coming out of your kitchen."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {steps.map((step: (typeof steps)[number], idx: number) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="relative rounded-[20px] bg-warm-white border border-espresso/10 p-6 sm:p-7 shadow-card flex flex-col items-start"
                >
                  <div className="flex items-center justify-between w-full mb-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-golden/20 text-golden">
                      <Icon className="h-6 w-6 text-golden" />
                    </div>
                    <span className="font-heading text-2xl font-bold text-espresso/30">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-espresso mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-espresso/75 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. FAQ Accordion ── */}
      <section className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="section-label mb-2 inline-block">Got Questions?</span>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-espresso mb-3">
            {t("faq")}
          </h2>
          <p className="text-sm sm:text-base text-espresso/75 leading-relaxed">
            {locale === "km"
              ? "សំណួរដែលត្រូវបានសួរញឹកញាប់បំផុតអំពីការផ្គត់ផ្គង់លក់ដុំរបស់យើង"
              : "Everything you need to know about partnering with NOST Bakery for wholesale."}
          </p>
        </div>

        <div className="rounded-[20px] bg-warm-white border border-espresso/10 p-6 sm:p-8 md:p-10 shadow-card">
          <Accordion type="single" defaultValue={faqs[0]?.id}>
            {faqs.map((faq: (typeof faqs)[number]) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left font-heading text-lg sm:text-xl">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-espresso/80 text-sm sm:text-base leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── 5. Wholesale Enquiry Form ── */}
      <section id="enquiry" className="py-12 sm:py-16 bg-cream/30 border-t border-espresso/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="section-label mb-2 inline-block">Get Started Today</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-espresso mb-3">
              {t("enquiryForm")}
            </h2>
            <p className="text-sm sm:text-base text-espresso/75 max-w-lg mx-auto leading-relaxed">
              {locale === "km"
                ? "សូមបំពេញព័ត៌មានខាងក្រោម។ ក្រុមការងារលក់ដុំរបស់យើងនឹងទាក់ទងមកលោកអ្នកវិញយ៉ាងឆាប់រហ័ស។"
                : "Tell us about your business and estimated weekly volume. We will send price tiers and arrange sample tastings."}
            </p>
          </div>

          <WholesaleEnquiryForm />
        </div>
      </section>
    </div>
  );
}
