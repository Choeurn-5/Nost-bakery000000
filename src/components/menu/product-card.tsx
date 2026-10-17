"use client";

import * as React from "react";
import Image from "next/image";
import { Badge, BadgeVariant } from "@/components/ui/badge";
import { formatPrice, placeholderImage } from "@/lib/utils";
import { Send, Sparkles, Flame, Clock } from "lucide-react";

export interface ProductCardData {
  id: string;
  name: string;
  description?: string | null;
  price?: number | null;
  image?: string | null;
  badges: string[];
  availability: "AVAILABLE" | "SOLD_OUT" | "HIDDEN";
}

interface ProductCardProps {
  product: ProductCardData;
  telegramUsername?: string;
  askOnTelegramLabel: string;
  soldOutLabel: string;
  badgeLabels?: {
    new?: string;
    bestSeller?: string;
    seasonal?: string;
    featured?: string;
  };
}

export function ProductCard({
  product,
  telegramUsername = "NostBakery",
  askOnTelegramLabel,
  soldOutLabel,
  badgeLabels,
}: ProductCardProps) {
  const isSoldOut = product.availability === "SOLD_OUT";
  const displayPrice = formatPrice(product.price);
  const imageUrl = product.image || placeholderImage(product.name, 600, 450);

  const telegramUrl = React.useMemo(() => {
    const text = encodeURIComponent(
      `Hello NOST Bakery! I'm interested in ordering / inquiring about: "${product.name}"${
        product.price ? ` ($${product.price.toFixed(2)})` : ""
      }.`
    );
    const cleanUser = telegramUsername.replace("@", "").replace("https://t.me/", "");
    return `https://t.me/${cleanUser}?text=${text}`;
  }, [product.name, product.price, telegramUsername]);

  return (
    <article className="group relative flex flex-col justify-between h-full rounded-[16px] bg-warm-white border border-espresso/10 overflow-hidden shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover motion-reduce:hover:translate-y-0">
      <div>
        {/* Product Image Container */}
        <div className="relative aspect-4/3 w-full overflow-hidden bg-cream/50">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            placeholder="empty"
          />

          {/* Sold out overlay */}
          {isSoldOut && (
            <div className="absolute inset-0 bg-espresso/60 backdrop-blur-xs flex items-center justify-center p-2 z-10">
              <span className="rounded-full bg-warm-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-espresso shadow-xs">
                {soldOutLabel}
              </span>
            </div>
          )}

          {/* Badges container */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10 max-w-[85%] pointer-events-none">
            {product.badges.map((badge) => {
              let variant: BadgeVariant = "default";
              let text = badge;
              let Icon: React.ReactNode = null;

              if (badge === "NEW") {
                variant = "new";
                text = badgeLabels?.new || "New";
                Icon = <Sparkles className="h-3 w-3" />;
              } else if (badge === "BEST_SELLER") {
                variant = "bestseller";
                text = badgeLabels?.bestSeller || "Best Seller";
                Icon = <Flame className="h-3 w-3" />;
              } else if (badge === "SEASONAL") {
                variant = "seasonal";
                text = badgeLabels?.seasonal || "Seasonal";
                Icon = <Clock className="h-3 w-3" />;
              } else if (badge === "FEATURED") {
                text = badgeLabels?.featured || "Featured";
              }

              return (
                <Badge
                  key={badge}
                  variant={variant}
                  size="sm"
                  icon={Icon}
                  className="shadow-xs text-[10px] sm:text-xs"
                >
                  {text}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-5 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading text-lg sm:text-xl font-semibold text-espresso line-clamp-2 leading-tight">
              {product.name}
            </h3>

            {/* Optional Price Display (hidden if null) */}
            {displayPrice && (
              <span className="shrink-0 font-heading text-base sm:text-lg font-semibold text-golden whitespace-nowrap">
                {displayPrice}
              </span>
            )}
          </div>

          {product.description && (
            <p className="text-xs sm:text-sm text-espresso/75 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>
      </div>

      {/* Card Action */}
      <div className="p-4 sm:p-5 pt-0">
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${askOnTelegramLabel} for ${product.name}`}
          className="inline-flex w-full min-h-[44px] items-center justify-center gap-2 rounded-[12px] bg-golden text-espresso text-xs sm:text-sm font-semibold tracking-wide shadow-xs transition-colors hover:bg-caramel hover:text-warm-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden focus-visible:ring-offset-2 active:scale-[0.98]"
        >
          <Send className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{askOnTelegramLabel}</span>
        </a>
      </div>
    </article>
  );
}
