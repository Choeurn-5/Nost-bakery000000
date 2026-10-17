import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get localized field value with English fallback.
 */
export function localized(
  obj: Record<string, unknown>,
  field: string,
  locale: string
): string {
  const kmKey = `${field}Km`;
  const enKey = `${field}En`;

  if (locale === "km") {
    const kmVal = obj[kmKey] as string | undefined;
    if (kmVal && kmVal.trim()) return kmVal;
  }

  return (obj[enKey] as string) || "";
}

/**
 * Format price in USD (used for bakery products).
 */
export function formatPrice(price: number | null | undefined): string | null {
  if (price == null) return null;
  return `$${price.toFixed(2)}`;
}

/**
 * Get promotion status based on dates and time window.
 */
export function getPromotionStatus(promo: {
  startDate: Date | null;
  endDate: Date | null;
  dailyStartTime: string | null;
  dailyEndTime: string | null;
}): "valid_now" | "evening_only" | "upcoming" | "ended" {
  const now = new Date();

  if (promo.endDate && now > new Date(promo.endDate)) {
    return "ended";
  }

  if (promo.startDate && now < new Date(promo.startDate)) {
    return "upcoming";
  }

  if (promo.dailyStartTime && promo.dailyEndTime) {
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    const [startH, startM] = promo.dailyStartTime.split(":").map(Number);
    const [endH, endM] = promo.dailyEndTime.split(":").map(Number);
    const startTime = startH * 60 + startM;
    const endTime = endH * 60 + endM;

    if (currentTime >= startTime && currentTime <= endTime) {
      return "valid_now";
    }
    return "evening_only";
  }

  return "valid_now";
}

/**
 * Generate placeholder image URL with text.
 */
export function placeholderImage(text: string, width = 800, height = 600): string {
  const encoded = encodeURIComponent(text);
  return `https://placehold.co/${width}x${height}/F1E6D4/3A2418?text=${encoded}`;
}

/**
 * Truncate text to a maximum length.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}
