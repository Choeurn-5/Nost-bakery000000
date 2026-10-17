import * as React from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { localized } from "@/lib/utils";
import { getPageMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/contact/contact-form";
import {
  Phone,
  Send,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
} from "lucide-react";

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata("contact", locale, {
    title: locale === "km" ? "ទំនាក់ទំនង និង បញ្ជាទិញ" : "Contact & Order",
    description:
      locale === "km"
        ? "ទាក់ទងមកកាន់ NOST Bakery & Pastry សម្រាប់កុម្ម៉ង់នំខួបកំណើត នំប៉័ងដុតស្រស់ ឬការផ្គត់ផ្គង់អាជីវកម្ម"
        : "Reach out to NOST Bakery for retail inquiries, bespoke cake orders, and wholesale baking partnerships in Siem Reap.",
  });
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  // 1. Fetch site settings for contact details with defensive try/catch
  let settings: any = null;
  let location: any = null;
  try {
    settings = await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });
    location = await prisma.location.findFirst({
      where: { isVisible: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    settings = null;
    location = null;
  }

  const phoneNumbers =
    settings?.phoneNumbers && settings.phoneNumbers.length > 0
      ? settings.phoneNumbers
      : ["060 731 888", "099 200 076"];

  const email = settings?.email || "info@nostbakery.com";
  const telegramLink = settings?.telegramLink || "https://t.me/NostBakery";
  const facebookLink = settings?.facebookLink || "https://www.facebook.com/NOSTBakeryPastry";
  const address = settings
    ? localized(settings as unknown as Record<string, unknown>, "address", locale) || settings.addressEn
    : "Siem Reap, Cambodia";

  const mapEmbedUrl =
    location?.mapEmbedUrl ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15545.922449567482!2d103.856!3d13.36!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3110170000000001%3A0x0!2sSiem%20Reap!5e0!3m2!1sen!2skh!4v1700000000000!5m2!1sen!2skh";

  const hours = location
    ? localized(location as unknown as Record<string, unknown>, "hours", locale) || location.hoursEn
    : "Daily: 6:30 AM – 9:00 PM";

  return (
    <div className="min-h-screen bg-warm-white pb-20 font-sans">
      {/* ── Page Header ── */}
      <section className="bg-cream/50 border-b border-espresso/10 pt-12 pb-14 sm:pt-16 sm:pb-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-label mb-2 inline-block">We'd Love to Hear from You</span>
          <h1 className="font-heading text-3xl sm:text-5xl font-semibold text-espresso mb-3">
            {t("title")}
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-espresso/80 leading-relaxed font-sans">
            {locale === "km"
              ? "មានសំណួរអំពីផលិតផល ឬចង់កុម្ម៉ង់នំពិសេស? ផ្ញើសារមកយើង ឬទាក់ទងមកកាន់ទូរសព្ទផ្ទាល់"
              : "Have a question about daily bakes, bespoke cake orders, or wholesale? Reach out directly and we will respond promptly."}
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-golden/15 px-4 py-1.5 text-xs sm:text-sm font-medium text-espresso">
            <Clock className="h-4 w-4 text-golden" />
            <span>{tCommon("replyNote")}</span>
          </div>
        </div>
      </section>

      {/* ── Main Content Grid: Info Cards + Contact Form ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Contact Channels & Operating Info */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="section-label mb-1.5 inline-block">Direct Channels</span>
              <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-espresso mb-3">
                Get in Touch
              </h2>
              <p className="text-sm text-espresso/75 leading-relaxed">
                Connect with our Siem Reap kitchen via phone, Telegram message, or visit our café in person.
              </p>
            </div>

            {/* Contact Info Cards */}
            <div className="space-y-4">
              {/* Phone card with tap-to-call */}
              <div className="rounded-[18px] bg-cream/40 border border-espresso/10 p-5 shadow-xs">
                <div className="flex items-center gap-3.5 mb-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-golden/20 text-golden shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-espresso/70">
                      {tCommon("phone")} (Tap to Call)
                    </h3>
                  </div>
                </div>
                <div className="pl-13.5 flex flex-wrap gap-2 sm:gap-3">
                  {phoneNumbers.map((phone: string, idx: number) => (
                    <a
                      key={idx}
                      href={`tel:${phone.replace(/\s+/g, "")}`}
                      className="inline-flex min-h-[44px] items-center rounded-[10px] bg-warm-white px-3.5 py-1.5 text-sm font-semibold text-espresso border border-espresso/10 hover:border-golden hover:text-golden transition-colors"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </div>

              {/* Telegram card */}
              <div className="rounded-[18px] bg-cream/40 border border-espresso/10 p-5 shadow-xs">
                <div className="flex items-center gap-3.5 mb-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-golden/20 text-golden shrink-0">
                    <Send className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-espresso/70">
                      Telegram Channel
                    </h3>
                  </div>
                </div>
                <div className="pl-13.5">
                  <a
                    href={telegramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-[10px] bg-warm-white px-4 py-2 text-sm font-semibold text-espresso border border-espresso/10 hover:border-golden hover:text-golden transition-colors"
                  >
                    <MessageCircle className="h-4 w-4 text-golden" />
                    <span>{tCommon("messageOnTelegram")}</span>
                  </a>
                </div>
              </div>

              {/* Email card */}
              <div className="rounded-[18px] bg-cream/40 border border-espresso/10 p-5 shadow-xs">
                <div className="flex items-center gap-3.5 mb-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-golden/20 text-golden shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-espresso/70">
                      {tCommon("email")}
                    </h3>
                  </div>
                </div>
                <div className="pl-13.5">
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex min-h-[44px] items-center rounded-[10px] bg-warm-white px-4 py-2 text-sm font-medium text-espresso border border-espresso/10 hover:border-golden hover:text-golden transition-colors"
                  >
                    {email}
                  </a>
                </div>
              </div>

              {/* Physical Location & Hours */}
              <div className="rounded-[18px] bg-cream/40 border border-espresso/10 p-5 shadow-xs space-y-3">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-golden/20 text-golden shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-espresso/70 mb-1">
                      Siem Reap Bakery Café
                    </h3>
                    <p className="text-sm text-espresso/85 leading-relaxed">
                      {address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-2 border-t border-espresso/10">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-golden/20 text-golden shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-espresso/70 mb-1">
                      Opening Hours
                    </h3>
                    <p className="text-sm text-espresso/85 leading-relaxed">
                      {hours}
                    </p>
                  </div>
                </div>
              </div>

              {/* Facebook link */}
              {facebookLink && (
                <div className="pt-2">
                  <a
                    href={facebookLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-2 text-xs sm:text-sm font-semibold text-golden hover:text-caramel transition-colors"
                  >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>{tCommon("followFacebook")}</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Contact & Order Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>

        {/* ── Map Embed Section ── */}
        <section className="mt-16 sm:mt-24 rounded-[24px] overflow-hidden border border-espresso/10 shadow-card bg-cream">
          <div className="p-6 sm:p-8 bg-warm-white border-b border-espresso/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="section-label mb-1 inline-block">Find Us in Siem Reap</span>
              <h2 className="font-heading text-2xl font-semibold text-espresso">
                Visit Our Bakery Café
              </h2>
            </div>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center rounded-[12px] bg-golden px-5 py-2 text-xs sm:text-sm font-semibold text-espresso hover:bg-caramel hover:text-warm-white transition-colors"
            >
              {tCommon("directions")}
            </a>
          </div>

          <div className="aspect-21/9 min-h-[360px] w-full">
            <iframe
              src={mapEmbedUrl}
              title="NOST Bakery Location Map"
              className="w-full h-full min-h-[360px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </section>
      </main>
    </div>
  );
}
