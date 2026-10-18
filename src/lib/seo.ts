import type { Metadata } from "next";
import { api } from "@/lib/api";
import { localized } from "@/lib/utils";

interface PageSeoDefaults {
  title: string;
  description: string;
}

export async function getPageMetadata(
  pageSlug: string,
  locale: string,
  fallback: PageSeoDefaults
): Promise<Metadata> {
  try {
    const [seoRecord, settingsData] = await Promise.all([
      api.getPageSeo(pageSlug),
      api.getSettings(),
    ]);

    const siteSettings = settingsData?.settings ?? null;

    const defaultSiteTitle =
      locale === "km"
        ? siteSettings?.seoTitleKm || siteSettings?.seoTitleEn || "NOST Bakery & Pastry"
        : siteSettings?.seoTitleEn || "NOST Bakery & Pastry — Fresh Bakery in Siem Reap";

    const title = seoRecord
      ? localized(seoRecord as unknown as Record<string, unknown>, "title", locale) || fallback.title
      : fallback.title;

    const description = seoRecord
      ? localized(seoRecord as unknown as Record<string, unknown>, "description", locale) || fallback.description
      : fallback.description;

    const ogImage = seoRecord?.ogImage || siteSettings?.ogImage || undefined;

    return {
      title: `${title} | ${defaultSiteTitle}`,
      description,
      openGraph: {
        title: `${title} | ${defaultSiteTitle}`,
        description,
        images: ogImage ? [{ url: ogImage }] : undefined,
      },
    };
  } catch (error) {
    console.error(`Failed to fetch SEO for ${pageSlug}:`, error);
    return {
      title: `${fallback.title} | NOST Bakery & Pastry`,
      description: fallback.description,
    };
  }
}
