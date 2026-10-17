"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

interface CategoryTabsProps {
  categories: CategoryItem[];
  activeCategory?: string;
  locale: string;
  allLabel: string;
}

export function CategoryTabs({
  categories,
  activeCategory,
  locale,
  allLabel,
}: CategoryTabsProps) {
  const currentCategory = activeCategory || "all";
  const tabsContainerRef = React.useRef<HTMLDivElement>(null);

  // Scroll active tab into view on mobile
  React.useEffect(() => {
    if (!tabsContainerRef.current) return;
    const activeEl = tabsContainerRef.current.querySelector<HTMLElement>(
      `[data-category="${currentCategory}"]`
    );
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentCategory]);

  return (
    <div className="sticky top-0 z-30 w-full bg-warm-white/95 backdrop-blur-md border-b border-espresso/10 py-3 sm:py-4 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={tabsContainerRef}
          role="tablist"
          aria-label="Product categories"
          className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar scroll-smooth py-1 -my-1"
        >
          {/* "All" tab */}
          <Link
            href={`/${locale}/menu`}
            role="tab"
            aria-selected={currentCategory === "all"}
            data-category="all"
            className={cn(
              "inline-flex items-center justify-center shrink-0 min-h-[44px] px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 select-none",
              currentCategory === "all"
                ? "bg-golden text-espresso font-semibold shadow-sm"
                : "bg-cream/60 text-espresso/80 hover:bg-cream hover:text-espresso"
            )}
          >
            <span>{allLabel}</span>
          </Link>

          {/* Individual Category Tabs */}
          {categories.map((cat) => {
            const isActive = currentCategory === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/${locale}/menu?category=${cat.slug}`}
                role="tab"
                aria-selected={isActive}
                data-category={cat.slug}
                className={cn(
                  "inline-flex items-center justify-center shrink-0 min-h-[44px] px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 select-none",
                  isActive
                    ? "bg-golden text-espresso font-semibold shadow-sm"
                    : "bg-cream/60 text-espresso/80 hover:bg-cream hover:text-espresso"
                )}
              >
                <span>{cat.name}</span>
                {cat.count !== undefined && (
                  <span
                    className={cn(
                      "ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-semibold",
                      isActive
                        ? "bg-espresso/15 text-espresso"
                        : "bg-espresso/10 text-espresso/70"
                    )}
                  >
                    {cat.count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
