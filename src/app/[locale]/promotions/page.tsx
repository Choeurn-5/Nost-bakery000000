import * as React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { api } from "@/lib/api";
import { localized, getPromotionStatus, placeholderImage } from "@/lib/utils";
import { getPageMetadata } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Calendar,
  Sparkles,
  Send,
  Tag,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface PromotionsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PromotionsPageProps): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata("promotions", locale, {
    title: locale === "km" ? "កម្មវិធីប្រូម៉ូសិន" : "Promotions & Special Offers",
    description:
      locale === "km"
        ? "ការផ្តល់ជូនពិសេសប្រចាំថ្ងៃ និងកម្មវិធីប្រូម៉ូសិនពី NOST Bakery & Pastry សៀមរាប"
        : "Discover daily special offers, evening BOGO happy hours, and seasonal pastry deals at NOST Bakery Siem Reap.",
  });
}

function formatTimeWindow(start: string | null, end: string | null): string | null {
  if (!start && !end) return null;
  const formatHour = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const displayH = h % 12 === 0 ? 12 : h % 12;
    const displayM = m > 0 ? `:${m.toString().padStart(2, "0")}` : "";
    return `${displayH}${displayM} ${period}`;
  };

  if (start && end) {
    return `${formatHour(start)} – ${formatHour(end)}`;
  }
  return start ? `From ${formatHour(start)}` : `Until ${formatHour(end!)}`;
}

export default async function PromotionsPage({ params }: PromotionsPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "promotions" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  // 1. Fetch published promotions with defensive try/catch
  let promotionsRaw: any[] = [];
  let settings: any = null;
  try {
    const [promoData, settingsData] = await Promise.all([
      api.getPromotions(),
      api.getSettings(),
    ]);
    promotionsRaw = promoData ?? [];
    settings = settingsData?.settings ?? null;
  } catch {
    promotionsRaw = [];
    settings = null;
  }

  const telegramUrl = settings?.telegramLink || "https://t.me/NostBakery";

  // Fallback promotions if database is empty
  const fallbackPromotions = [
    {
      id: "promo-bogo",
      titleEn: "Buy 1 Get 1 Free · Daily Evening Happy Hour",
      titleKm: "ទិញ ១ ថែម ១ · រៀងរាល់ល្ងាច ៦:០០ ដល់ ៩:០០ យប់",
      badgeTextEn: "BOGO SPECIAL",
      badgeTextKm: "ទិញ ១ ថែម ១",
      descriptionEn:
        "Every single evening between 6:00 PM and 9:00 PM, enjoy Buy 1 Get 1 Free on all fresh viennoiseries, pastries and breads remaining on our display counter. Perfect for evening treats or next morning's breakfast!",
      descriptionKm:
        "រៀងរាល់ល្ងាច ចាប់ពីម៉ោង ៦:០០ ដល់ ៩:០០ យប់ រីករាយជាមួយការទិញ ១ ថែម ១ លើរាល់នំប៉័ង និងនំផេស្ត្រីស្រស់ៗដែលនៅសល់លើបញ្ជរដុតនំ។",
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop",
      startDate: new Date("2025-01-01"),
      endDate: null,
      dailyStartTime: "18:00",
      dailyEndTime: "21:00",
      finePrintEn: "Applies to counter items only. Free item must be of equal or lesser value. While stock lasts daily.",
      finePrintKm: "អនុវត្តចំពោះមុខទំនិញលើបញ្ជរតែប៉ុណ្ណោះ។ របស់ថែមត្រូវតែមានតម្លៃស្មើ ឬទាបជាង។ ចំនួនមានកំណត់ប្រចាំថ្ងៃ។",
    },
    {
      id: "promo-morning",
      titleEn: "Morning Coffee & Fresh Butter Croissant Set",
      titleKm: "ឈុតកាហ្វេពេលព្រឹក & នំក្រូរសង់ប៊័រស្រស់",
      badgeTextEn: "MORNING COMBO",
      badgeTextKm: "ឈុតពេលព្រឹក",
      descriptionEn:
        "Start your day right in Siem Reap! Pair any handcrafted espresso or cold brew coffee with our signature 24-layer French butter croissant for a special combination price of just $3.50.",
      descriptionKm:
        "ចាប់ផ្តើមថ្ងៃថ្មីរបស់អ្នកជាមួយនឹងកាហ្វេឈ្ងុយឆ្ងាញ់ និងនំក្រូរសង់ប៊័របារាំងស្រួយៗក្នុងតម្លៃពិសេសត្រឹមតែ $3.50 ប៉ុណ្ណោះ។",
      image: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=1000&auto=format&fit=crop",
      startDate: new Date("2025-01-01"),
      endDate: null,
      dailyStartTime: "06:30",
      dailyEndTime: "10:30",
      finePrintEn: "Available for both dine-in and takeaway every morning until 10:30 AM.",
      finePrintKm: "មានសម្រាប់ទទួលទាននៅហាង និងខ្ចប់ទៅផ្ទះ រៀងរាល់ព្រឹកដល់ម៉ោង ១០:៣០។",
    },
    {
      id: "promo-weekend",
      titleEn: "Weekend Artisan Sourdough & Pastry Basket",
      titleKm: "កន្ត្រកនំប៉័ងសួរដូ និងផេស្ត្រីចុងសប្តាហ៍",
      badgeTextEn: "WEEKEND BOX",
      badgeTextKm: "ប្រអប់ចុងសប្តាហ៍",
      descriptionEn:
        "Pre-order your family sourdough loaf plus an assortment of 4 gourmet pastries (Almond Croissant, Chocolate Twist, Fruit Danish, Cinnamon Roll) with a complimentary house fruit preserve.",
      descriptionKm:
        "កុម្ម៉ង់ទុកជាមុននូវនំប៉័ងសួរដូគ្រួសារ រួមជាមួយនំផេស្ត្រីពិសេស ៤ មុខ ទទួលបានការថែមជូនដំណាប់ផ្លែឈើធម្មជាតិ ១ កំប៉ុង។",
      image: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?q=80&w=1000&auto=format&fit=crop",
      startDate: new Date("2025-01-01"),
      endDate: null,
      dailyStartTime: null,
      dailyEndTime: null,
      finePrintEn: "Pre-order recommended 24 hours in advance via Telegram.",
      finePrintKm: "សូមកុម្ម៉ង់ទុកមុន ២៤ ម៉ោងតាមរយៈ Telegram។",
    },
  ];

  const promotions = promotionsRaw.length > 0 ? promotionsRaw : fallbackPromotions;

  return (
    <div className="min-h-screen bg-warm-white pb-20 font-sans">
      {/* ── Page Header ── */}
      <section className="bg-cream/50 border-b border-espresso/10 pt-12 pb-14 sm:pt-16 sm:pb-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-berry/15 text-berry px-3.5 py-1 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>NOST Special Offers</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-semibold text-espresso mb-3">
            {t("title")}
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-espresso/80 leading-relaxed font-sans">
            {locale === "km"
              ? "ស្វែងយល់ពីកម្មវិធីបញ្ចុះតម្លៃ និងការផ្តល់ជូនពិសេសប្រចាំថ្ងៃពីផ្ទះដុតនំរបស់យើង"
              : "Enjoy exclusive deals, evening happy hours, and artisanal bundle sets baked fresh daily in Siem Reap."}
          </p>
        </div>
      </section>

      {/* ── Promotions Cards Grid ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {promotions.map((promo: (typeof promotions)[number]) => {
            const title =
              localized(promo as unknown as Record<string, unknown>, "title", locale) ||
              promo.titleEn;
            const desc =
              localized(promo as unknown as Record<string, unknown>, "description", locale) ||
              promo.descriptionEn;
            const badgeText =
              localized(promo as unknown as Record<string, unknown>, "badgeText", locale) ||
              promo.badgeTextEn;
            const finePrint =
              localized(promo as unknown as Record<string, unknown>, "finePrint", locale) ||
              promo.finePrintEn;
            const img = promo.image || placeholderImage(promo.titleEn, 800, 500);

            // Calculate status chip
            const statusKey = getPromotionStatus({
              startDate: promo.startDate,
              endDate: promo.endDate,
              dailyStartTime: promo.dailyStartTime,
              dailyEndTime: promo.dailyEndTime,
            });

            const timeWindowStr = formatTimeWindow(promo.dailyStartTime, promo.dailyEndTime);

            // Status chip badge config
            let statusBadge = {
              text: t("validNow"),
              className: "bg-golden/20 text-espresso border border-golden/40 font-semibold",
              icon: <CheckCircle2 className="h-3.5 w-3.5 text-golden mr-1" />,
            };

            if (statusKey === "evening_only") {
              statusBadge = {
                text: t("eveningOnly"),
                className: "bg-butter text-espresso font-semibold",
                icon: <Clock className="h-3.5 w-3.5 text-espresso/70 mr-1" />,
              };
            } else if (statusKey === "upcoming") {
              statusBadge = {
                text: t("upcoming"),
                className: "bg-cream text-espresso border border-espresso/15 font-medium",
                icon: <Calendar className="h-3.5 w-3.5 text-espresso/60 mr-1" />,
              };
            } else if (statusKey === "ended") {
              statusBadge = {
                text: t("ended"),
                className: "bg-espresso/10 text-espresso/50 font-medium",
                icon: <AlertCircle className="h-3.5 w-3.5 text-espresso/40 mr-1" />,
              };
            }

            return (
              <article
                key={promo.id}
                className="flex flex-col justify-between rounded-[20px] bg-warm-white border border-espresso/10 overflow-hidden shadow-card hover:shadow-card-hover transition-all"
              >
                <div>
                  {/* Photo & Badge header */}
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-cream">
                    <Image
                      src={img}
                      alt={title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      placeholder="empty"
                    />

                    {/* Promo badge (Berry) */}
                    {badgeText && (
                      <div className="absolute top-3 left-3 z-10">
                        <Badge variant="promo" size="sm" className="shadow-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {badgeText}
                        </Badge>
                      </div>
                    )}

                    {/* Dynamic Status chip */}
                    <div className="absolute top-3 right-3 z-10">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs shadow-xs ${statusBadge.className}`}
                      >
                        {statusBadge.icon}
                        {statusBadge.text}
                      </span>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-6">
                    <h2 className="font-heading text-2xl font-semibold text-espresso leading-snug mb-3">
                      {title}
                    </h2>

                    <p className="text-sm text-espresso/80 leading-relaxed mb-4">
                      {desc}
                    </p>

                    {/* Time Window & Validity metadata */}
                    <div className="space-y-2 border-t border-espresso/10 pt-4 text-xs text-espresso/70">
                      {timeWindowStr && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-golden shrink-0" />
                          <span className="font-medium text-espresso/90">
                            {timeWindowStr}
                          </span>
                        </div>
                      )}

                      {promo.endDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-golden shrink-0" />
                          <span>
                            {locale === "km" ? "ផុតកំណត់ត្រឹម៖ " : "Valid until: "}
                            {new Date(promo.endDate).toLocaleDateString(
                              locale === "km" ? "km-KH" : "en-US",
                              { year: "numeric", month: "short", day: "numeric" }
                            )}
                          </span>
                        </div>
                      )}

                      {finePrint && (
                        <p className="italic text-[11px] text-espresso/60 pt-1">
                          * {finePrint}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 pt-0">
                  <a
                    href={`${telegramUrl}?text=${encodeURIComponent(
                      `Hello NOST Bakery! I'd like to ask about the "${title}" promotion.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-[14px] bg-golden px-4 py-2 text-sm font-semibold text-espresso shadow-xs hover:bg-caramel hover:text-warm-white transition-colors"
                  >
                    <Send className="h-4 w-4" />
                    <span>{tCommon("askOnTelegram")}</span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* ── Fine-print line at bottom ── */}
        <div className="mt-16 pt-6 border-t border-espresso/10 text-center">
          <p className="text-xs sm:text-sm text-espresso/65 font-sans leading-relaxed max-w-2xl mx-auto">
            {t("finePrint")}
          </p>
        </div>
      </main>
    </div>
  );
}
