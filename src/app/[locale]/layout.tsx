import React from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n/request";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnnouncementBar } from "@/components/announcement-bar";
import { MobileBottomBar } from "@/components/mobile-bottom-bar";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Provide messages to Client Components
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div lang={locale} className={locale === "km" ? "font-km min-h-screen flex flex-col" : "min-h-screen flex flex-col"}>
        <AnnouncementBar />
        <Header />
        <div className="flex-1 pb-16 md:pb-0">
          {children}
        </div>
        <Footer />
        <MobileBottomBar />
      </div>
    </NextIntlClientProvider>
  );
}
