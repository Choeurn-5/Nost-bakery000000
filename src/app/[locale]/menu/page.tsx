import * as React from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { api } from "@/lib/api";
import { localized } from "@/lib/utils";
import { getPageMetadata } from "@/lib/seo";
import { CategoryTabs, CategoryItem } from "@/components/menu/category-tabs";
import { ProductCard, ProductCardData } from "@/components/menu/product-card";
import { UtensilsCrossed } from "lucide-react";

interface MenuPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}

export async function generateMetadata({
  params,
}: MenuPageProps): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata("menu", locale, {
    title: locale === "km" ? "មីនុយ និង ផលិតផល" : "Menu & Products",
    description:
      locale === "km"
        ? "ស្វែងរកផលិតផលនំប៉័ង នំផេស្ត្រី និងភេសជ្ជៈស្រស់ៗប្រចាំថ្ងៃនៅ NOST Bakery"
        : "Explore our daily baked artisanal breads, fresh viennoiseries, pastries, cakes and savouries.",
  });
}

export default async function MenuPage({
  params,
  searchParams,
}: MenuPageProps) {
  const { locale } = await params;
  const { category: activeCategorySlug } = await searchParams;
  const t = await getTranslations({ locale, namespace: "menu" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  let categories: CategoryItem[] = [];
  let products: ProductCardData[] = [];
  let telegramUsername = "https://t.me/NostBakery";
  let activeCategoryName = t("allCategories");

  try {
    // 1. Fetch categories and products from the API
    const [categoriesData, productsData, settingsData] = await Promise.all([
      api.getCategories(),
      api.getProducts(activeCategorySlug ? { category: activeCategorySlug } : undefined),
      api.getSettings(),
    ]);

    if (categoriesData) {
      categories = categoriesData.map((cat) => ({
        id: cat.id,
        name: localized(cat as unknown as Record<string, unknown>, "name", locale) || cat.nameEn,
        slug: cat.slug,
        count: cat.productsCount ?? 0,
      }));
    }

    // 2. Find active category name
    const activeCategory = categoriesData?.find(
      (c) => c.slug === activeCategorySlug
    );

    // 3. Map products
    if (productsData) {
      products = productsData.map((p) => ({
        id: p.id,
        name: localized(p as unknown as Record<string, unknown>, "name", locale) || p.nameEn,
        description: localized(p as unknown as Record<string, unknown>, "description", locale) || p.descriptionEn,
        price: p.price,
        image: p.images?.[0]?.url || null,
        badges: p.badges,
        availability: p.availability as "AVAILABLE" | "SOLD_OUT" | "HIDDEN",
      }));
    }

    // 4. Fetch site settings for Telegram username
    if (settingsData?.settings?.telegramLink) {
      telegramUsername = settingsData.settings.telegramLink;
    }

    activeCategoryName = activeCategory
      ? localized(activeCategory as unknown as Record<string, unknown>, "name", locale) || activeCategory.nameEn
      : t("allCategories");
  } catch {
    // Fallback data with vibrant Unsplash bakery photos when API is not ready
    categories = [
      { id: "c1", name: locale === "km" ? "វីយែនណ័រហ្សឺរី" : "Viennoiserie", slug: "croissants-viennoiserie", count: 4 },
      { id: "c2", name: locale === "km" ? "នំប៉័ងដុត" : "Artisan Breads", slug: "sourdough-breads", count: 3 },
      { id: "c3", name: locale === "km" ? "នំផេស្ត្រី និង នំខេក" : "Pastries & Cakes", slug: "pastries-tarts", count: 4 },
      { id: "c4", name: locale === "km" ? "កាហ្វេ និង នំប្រៃ" : "Café & Savouries", slug: "cafe-savouries", count: 3 },
    ];

    const fallbackList: ProductCardData[] = [
      {
        id: "p1",
        name: locale === "km" ? "នំក្រូសង់ប៊ឺបុរាណ" : "Classic Butter Croissant",
        description: locale === "km" ? "នំក្រូសង់ប៊ឺសុទ្ធ ស្រួយស្រទាប់ៗតាមបែបបារាំង។" : "Flaky golden butter French croissant with honeycombed interior.",
        price: 2.0,
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
        badges: ["BEST_SELLER"],
        availability: "AVAILABLE",
      },
      {
        id: "p2",
        name: locale === "km" ? "នំក្រូសង់សូកូឡា" : "Pain au Chocolat",
        description: locale === "km" ? "នំស្រួយស្រទាប់រុំជាមួយសូកូឡាខ្មៅពីរបន្ទះ។" : "Multi-layered butter croissant folded with double dark French chocolate batons.",
        price: 2.5,
        image: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&w=800&q=80",
        badges: ["NEW"],
        availability: "AVAILABLE",
      },
      {
        id: "p3",
        name: locale === "km" ? "នំប៉័ងសួរដូ" : "Artisan Country Sourdough Loaf",
        description: locale === "km" ? "ផ្អាប់តាមបែបធម្មជាតិ ២៤ម៉ោង រសជាតិជូរស្រាល ស្រួយសំបកក្រៅ។" : "Naturally fermented 24h sourdough loaf with a deeply caramelized crust.",
        price: 4.5,
        image: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80",
        badges: [],
        availability: "AVAILABLE",
      },
      {
        id: "p4",
        name: locale === "km" ? "នំក្រូសង់អាល់ម៉ុន" : "Almond Twice-Baked Croissant",
        description: locale === "km" ? "ញាត់ក្រែមអាល់ម៉ុនឈ្ងុយឆ្ងាញ់ និងរោយបន្ទះអាល់ម៉ុនលីង។" : "Filled with rich almond frangipane cream and topped with toasted sliced almonds.",
        price: 2.8,
        image: "https://images.unsplash.com/photo-1623334044303-241021148842?auto=format&fit=crop&w=800&q=80",
        badges: ["BEST_SELLER"],
        availability: "AVAILABLE",
      },
      {
        id: "p5",
        name: locale === "km" ? "នំតាតផ្លែឈើស្រស់" : "Fresh Strawberry Vanilla Tartlet",
        description: locale === "km" ? "នំតាតសំបកស្រួយ ជាមួយក្រែមវ៉ានីឡា និងស្ត្រប៊ឺរីស្រស់។" : "Crisp butter sablé shell with silky Tahitian vanilla custard and fresh strawberries.",
        price: 3.5,
        image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80",
        badges: ["NEW"],
        availability: "AVAILABLE",
      },
      {
        id: "p6",
        name: locale === "km" ? "នំខេកសូកូឡាមូស" : "Dark Chocolate Mousse Cake",
        description: locale === "km" ? "នំខេកសូកូឡាបែលហ្ស៊ិក ៧០% រសជាតិដិតជាប់មាត់។" : "Velvety 70% dark Belgian chocolate mousse with cocoa mirror glaze.",
        price: 4.0,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
        badges: [],
        availability: "AVAILABLE",
      },
      {
        id: "p7",
        name: locale === "km" ? "នំប៉័ងបាហ្គែតបារាំង" : "Traditional French Baguette",
        description: locale === "km" ? "នំប៉័ងបារាំងបុរាណ សំបកស្រួយក្រៀម សាច់នំទន់ស្វិត។" : "Crispy golden crust with airy, open crumb, baked fresh twice daily.",
        price: 1.5,
        image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80",
        badges: [],
        availability: "AVAILABLE",
      },
      {
        id: "p8",
        name: locale === "km" ? "សាំងវិចហ្វូកាសៀ" : "Prosciutto & Mozzarella Focaccia",
        description: locale === "km" ? "នំប៉័ងហ្វូកាសៀប្រេងអូលីវ សាច់ជ្រូកប្រៃ និងឈីសស្រស់។" : "Rosemary olive oil focaccia layered with Italian prosciutto and fresh mozzarella.",
        price: 5.5,
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
        badges: ["SEASONAL"],
        availability: "AVAILABLE",
      },
    ];

    products = activeCategorySlug
      ? fallbackList.filter((_, i) => (activeCategorySlug.includes("croissant") ? i < 4 : i >= 2))
      : fallbackList;
  }

  return (
    <div className="min-h-screen bg-warm-white pb-20">
      {/* Header Banner */}
      <section className="bg-cream/50 border-b border-espresso/10 pt-12 pb-10 sm:pt-16 sm:pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-label mb-2 inline-block">Siem Reap Bakery & Pastry</span>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-espresso mb-3">
            {t("title")}
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-espresso/75 font-sans leading-relaxed">
            {locale === "km"
              ? "រាល់ផលិតផលនំប៉័ង និងនំផេស្ត្រីរបស់យើងត្រូវបានដុតជារៀងរាល់ព្រឹកដោយគ្រឿងផ្សំគុណភាពខ្ពស់"
              : "Handcrafted fresh each morning using artisanal techniques and pure, wholesome ingredients."}
          </p>
        </div>
      </section>

      {/* Sticky Category Navigation Tabs */}
      <CategoryTabs
        categories={categories}
        activeCategory={activeCategorySlug}
        locale={locale}
        allLabel={t("allCategories")}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        {/* Category Header & Product Counter */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-espresso/10">
          <h2 className="font-heading text-xl sm:text-2xl font-semibold text-espresso">
            {activeCategoryName}
          </h2>
          <span className="text-xs sm:text-sm text-espresso/60 font-medium font-sans">
            {products.length} {locale === "km" ? "មុខទំនិញ" : products.length === 1 ? "item" : "items"}
          </span>
        </div>

        {/* Product Grid: 2 cols mobile, 3 cols tablet, 4 cols desktop */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                telegramUsername={telegramUsername}
                askOnTelegramLabel={tCommon("askOnTelegram")}
                soldOutLabel={t("soldOut")}
                badgeLabels={{
                  new: t("new"),
                  bestSeller: t("bestSeller"),
                  seasonal: t("seasonal"),
                  featured: t("featured"),
                }}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[20px] bg-cream/40 border border-espresso/10 p-12 text-center my-12">
            <UtensilsCrossed className="mx-auto h-12 w-12 text-golden/60 mb-3" />
            <h3 className="font-heading text-xl font-semibold text-espresso mb-1">
              {locale === "km" ? "មិនទាន់មានទំនិញក្នុងក្រុមនេះនៅឡើយទេ" : "No products found in this category"}
            </h3>
            <p className="text-sm text-espresso/70 max-w-md mx-auto">
              {locale === "km"
                ? "សូមជ្រើសរើសក្រុមទំនិញផ្សេងទៀត ឬទាក់ទងមកយើងតាម Telegram"
                : "Please browse another category or message us directly on Telegram for today's special bake."}
            </p>
          </div>
        )}

        {/* Bottom Disclaimer Note */}
        <div className="mt-14 pt-6 border-t border-espresso/10 text-center">
          <p className="text-xs sm:text-sm text-espresso/65 font-sans leading-relaxed max-w-xl mx-auto">
            {tCommon("priceNote")}
          </p>
        </div>
      </main>
    </div>
  );
}
