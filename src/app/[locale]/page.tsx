import React from "react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { localized } from "@/lib/utils";

// Home Page Sections
import { HeroSection } from "@/components/home/hero-section";
import { TodaysOffers } from "@/components/home/todays-offers";
import { ShopByCategory } from "@/components/home/shop-by-category";
import { ForBusinesses } from "@/components/home/for-businesses";
import { TheCafe } from "@/components/home/the-cafe";
import { ReachAcrossCambodia } from "@/components/home/reach-cambodia";

// Dynamic imports for interactive client-heavy components to enhance initial page load
const FreshFavourites = dynamic(
  () => import("@/components/home/fresh-favourites").then((m) => m.FreshFavourites),
  { ssr: true }
);

const FreshPromise = dynamic(
  () => import("@/components/home/fresh-promise").then((m) => m.FreshPromise),
  { ssr: true }
);

const SocialProof = dynamic(
  () => import("@/components/home/social-proof").then((m) => m.SocialProof),
  { ssr: true }
);

const OrderOrEnquire = dynamic(
  () => import("@/components/home/order-enquire").then((m) => m.OrderOrEnquire),
  { ssr: true }
);

// Revalidate page cache every hour
export const revalidate = 3600;

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isKm = locale === "km";

  try {
    const seo = await prisma.pageSeo.findUnique({
      where: { pageSlug: "home" },
    });

    if (seo) {
      const title = localized(seo as unknown as Record<string, unknown>, "title", locale);
      const description = localized(seo as unknown as Record<string, unknown>, "description", locale);
      if (title) {
        return {
          title,
          description: description || undefined,
        };
      }
    }
  } catch {
    // Silently continue to fallback metadata
  }

  return {
    title: isKm
      ? "NOST Bakery & Pastry — នំប៉័ង និង នំផេស្ត្រី ស្រស់ៗ នៅសៀមរាប"
      : "NOST Bakery & Pastry — Fresh Bakery & Pastries in Siem Reap",
    description: isKm
      ? "នំប៉័ង នំផេស្ត្រី នំខេក និងបង្អែមដុតស្រស់ៗរៀងរាល់ថ្ងៃនៅក្រុងសៀមរាប ប្រទេសកម្ពុជា។ ហាងកាហ្វេ និងសេវាផ្គត់ផ្គង់នំកកលក់ដុំ។"
      : "Fresh artisan breads, flaky pastries, celebration cakes and cafe delights in Siem Reap, Cambodia. Cafe, takeaway and wholesale frozen bakery supplies.",
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch all home data concurrently with defensive error handling
  let homeSections: Array<{
    id: string;
    sectionKey: string;
    headlineEn: string;
    headlineKm: string;
    subHeadlineEn: string;
    subHeadlineKm: string;
    bodyEn: string;
    bodyKm: string;
    image: string | null;
    videoUrl: string | null;
  }> = [];

  let featuredProducts: Array<{
    id: string;
    nameEn: string;
    nameKm: string;
    slug: string;
    descriptionEn: string;
    descriptionKm: string;
    price: number | null;
    badges: string[];
    images: { url: string; altEn?: string }[];
  }> = [];

  let categories: Array<{
    id: string;
    nameEn: string;
    nameKm: string;
    slug: string;
    image: string | null;
  }> = [];

  let activePromotions: Array<{
    id: string;
    titleEn: string;
    titleKm: string;
    badgeTextEn: string;
    badgeTextKm: string;
    descriptionEn: string;
    descriptionKm: string;
    finePrintEn: string;
    finePrintKm: string;
    image: string | null;
  }> = [];

  let firstLocation: {
    id?: string;
    nameEn?: string;
    nameKm?: string;
    addressEn?: string;
    addressKm?: string;
    hoursEn?: string;
    hoursKm?: string;
    image?: string | null;
    directionsLink?: string | null;
    services?: string[];
  } | null = null;

  let galleryItems: Array<{
    id: string;
    url: string;
    captionEn: string;
    captionKm: string;
  }> = [];

  let testimonials: Array<{
    id: string;
    name: string;
    textEn: string;
    textKm: string;
    rating: number;
    photo: string | null;
    isVisible: boolean;
  }> = [];

  try {
    const [
      dbSections,
      dbProducts,
      dbCategories,
      dbPromotions,
      dbLocation,
      dbGallery,
      dbTestimonials,
    ] = await Promise.all([
      // 1. Home sections
      prisma.homeSection.findMany({
        where: { isVisible: true },
        orderBy: { sortOrder: "asc" },
      }),
      // 2. Featured products
      prisma.product.findMany({
        where: {
          isFeatured: true,
          status: "PUBLISHED",
        },
        include: {
          images: {
            orderBy: { sortOrder: "asc" },
            select: { url: true, altEn: true },
          },
        },
        orderBy: { sortOrder: "asc" },
        take: 8,
      }),
      // 3. Categories
      prisma.category.findMany({
        where: { isVisible: true },
        orderBy: { sortOrder: "asc" },
        take: 6,
      }),
      // 4. Active promotions for home
      prisma.promotion.findMany({
        where: {
          showOnHome: true,
          status: "PUBLISHED",
        },
        orderBy: { createdAt: "desc" },
        take: 2,
      }),
      // 5. First bakery location
      prisma.location.findFirst({
        where: { isVisible: true },
        orderBy: { sortOrder: "asc" },
      }),
      // 6. Gallery items for home
      prisma.galleryItem.findMany({
        where: { showOnHome: true },
        orderBy: { sortOrder: "asc" },
        take: 8,
      }),
      // 7. Visible testimonials
      prisma.testimonial.findMany({
        where: { isVisible: true },
        orderBy: { sortOrder: "asc" },
      }),
    ]);

    homeSections = dbSections as any;
    featuredProducts = (dbProducts as any[]).map((p: any) => ({
      id: p.id,
      nameEn: p.nameEn,
      nameKm: p.nameKm,
      slug: p.slug,
      descriptionEn: p.descriptionEn,
      descriptionKm: p.descriptionKm,
      price: p.price,
      badges: p.badges,
      images: p.images,
    }));
    categories = dbCategories as any;
    activePromotions = dbPromotions as any;
    firstLocation = dbLocation as any;
    galleryItems = dbGallery as any;
    testimonials = dbTestimonials as any;
  } catch (err: unknown) {
    // Log gracefully in server output so build/dev doesn't crash if DB is not ready
    console.warn("Notice: Prisma query fallback engaged for home page.", err);
  }

  // Key-based section lookups
  const heroSection = homeSections.find((s) => s.sectionKey === "hero");
  const promiseSection = homeSections.find((s) => s.sectionKey === "promise");
  const businessSection = homeSections.find((s) => s.sectionKey === "business");
  const cafeSection = homeSections.find((s) => s.sectionKey === "cafe");
  const reachSection = homeSections.find((s) => s.sectionKey === "reach");

  return (
    <main className="min-h-screen bg-warm-white text-espresso selection:bg-soft-butter selection:text-espresso">
      {/* 1. Hero Section */}
      <HeroSection
        headline={
          heroSection
            ? localized(heroSection as unknown as Record<string, unknown>, "headline", locale)
            : undefined
        }
        subHeadline={
          heroSection
            ? localized(heroSection as unknown as Record<string, unknown>, "subHeadline", locale)
            : undefined
        }
        image={heroSection?.image}
      />

      {/* 2. Today's Offers */}
      <TodaysOffers
        promotions={activePromotions}
        locale={locale}
      />

      {/* 3. Shop by Category */}
      <ShopByCategory
        categories={categories}
        locale={locale}
      />

      {/* 4. Fresh Favourites */}
      <FreshFavourites
        products={featuredProducts}
        locale={locale}
      />

      {/* 5. Fresh Promise */}
      <FreshPromise
        section={promiseSection}
        locale={locale}
      />

      {/* 6. For Businesses (Wholesale) */}
      <ForBusinesses
        section={businessSection}
        locale={locale}
      />

      {/* 7. The Café */}
      <TheCafe
        location={firstLocation}
        section={cafeSection}
        locale={locale}
      />

      {/* 8. Reach Across Cambodia */}
      <ReachAcrossCambodia
        section={reachSection}
        locale={locale}
      />

      {/* 9. Social Proof & Testimonials */}
      <SocialProof
        galleryItems={galleryItems}
        testimonials={testimonials}
        locale={locale}
      />

      {/* 10. Order or Enquire */}
      <OrderOrEnquire
        locale={locale}
      />
    </main>
  );
}
