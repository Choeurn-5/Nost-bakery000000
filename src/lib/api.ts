/**
 * NOST Bakery — Backend API Client
 *
 * Fetches data from the Laravel REST API at manage.nostbakery.com/api
 * and transforms snake_case responses to camelCase for React components.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://manage.nostbakery.com";

// ─── snake_case → camelCase transformer ───

function snakeToCamel(str: string): string {
  return str.replace(/_([a-z0-9])/g, (_, char) => char.toUpperCase());
}

function transformKeys(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(transformKeys);
  if (typeof obj === "object" && obj !== null) {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      result[snakeToCamel(key)] = transformKeys(value);
    }
    return result;
  }
  return obj;
}

// ─── Generic fetch helper ───

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
}

async function apiFetch<T>(
  path: string,
  options?: { revalidate?: number; tags?: string[] }
): Promise<T | null> {
  try {
    const url = `${API_BASE}/api${path}`;
    const res = await fetch(url, {
      next: {
        revalidate: options?.revalidate ?? 3600,
        tags: options?.tags,
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.warn(`API fetch failed: ${res.status} ${res.statusText} — ${url}`);
      return null;
    }

    const json: ApiResponse<T> = await res.json();
    if (!json.success) {
      console.warn(`API returned success=false for ${url}`);
      return null;
    }

    return transformKeys(json.data) as T;
  } catch (err) {
    console.warn(`API fetch error for ${path}:`, err);
    return null;
  }
}

async function apiPost<T>(
  path: string,
  body: Record<string, unknown>
): Promise<{ success: boolean; data?: T; message?: string }> {
  try {
    const url = `${API_BASE}/api${path}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const json = await res.json();
    return {
      success: json.success ?? res.ok,
      data: json.data ? (transformKeys(json.data) as T) : undefined,
      message: json.message,
    };
  } catch (err) {
    console.warn(`API POST error for ${path}:`, err);
    return { success: false, message: "Network error" };
  }
}

// ─── Type definitions for API responses ───

export interface ApiHomeSection {
  id: string;
  sectionKey: string;
  headlineEn: string;
  headlineKm: string;
  subHeadlineEn: string;
  subHeadlineKm: string;
  bodyEn: string;
  bodyKm: string;
  buttonLabelEn: string;
  buttonLabelKm: string;
  buttonLink: string;
  button2LabelEn: string;
  button2LabelKm: string;
  button2Link: string;
  image: string | null;
  videoUrl: string | null;
  isVisible: boolean;
  sortOrder: number;
  extraData: unknown;
}

export interface ApiProductImage {
  id: string;
  url: string;
  altEn: string;
  altKm: string;
  sortOrder: number;
}

export interface ApiProduct {
  id: string;
  nameEn: string;
  nameKm: string;
  slug: string;
  descriptionEn: string;
  descriptionKm: string;
  price: number | null;
  categoryId: string;
  badges: string[];
  availability: string;
  channelTags: string[];
  isFeatured: boolean;
  sortOrder: number;
  status: string;
  images: ApiProductImage[];
  category?: ApiCategory;
  promotions?: unknown[];
}

export interface ApiCategory {
  id: string;
  nameEn: string;
  nameKm: string;
  slug: string;
  image: string | null;
  imageAltEn: string;
  imageAltKm: string;
  isVisible: boolean;
  sortOrder: number;
  productsCount?: number;
  products?: ApiProduct[];
}

export interface ApiPromotion {
  id: string;
  titleEn: string;
  titleKm: string;
  badgeTextEn: string;
  badgeTextKm: string;
  descriptionEn: string;
  descriptionKm: string;
  image: string | null;
  imageAltEn: string;
  imageAltKm: string;
  startDate: string | null;
  endDate: string | null;
  dailyStartTime: string | null;
  dailyEndTime: string | null;
  finePrintEn: string;
  finePrintKm: string;
  showOnHome: boolean;
  status: string;
  products?: ApiProduct[];
}

export interface ApiSettings {
  settings: {
    id: string;
    logoLight: string | null;
    logoDark: string | null;
    phoneNumbers: string[];
    email: string;
    telegramLink: string;
    facebookLink: string;
    websiteUrl: string;
    addressEn: string;
    addressKm: string;
    seoTitleEn: string;
    seoTitleKm: string;
    seoDescriptionEn: string;
    seoDescriptionKm: string;
    ogImage: string | null;
    googleAnalyticsId: string | null;
    facebookPixelId: string | null;
    cookieNoticeTextEn: string;
    cookieNoticeTextKm: string;
    footerTextEn: string;
    footerTextKm: string;
  } | null;
  announcement: {
    id: string;
    textEn: string;
    textKm: string;
    link: string | null;
    isActive: boolean;
  } | null;
}

export interface ApiLocation {
  id: string;
  nameEn: string;
  nameKm: string;
  addressEn: string;
  addressKm: string;
  hoursEn: string;
  hoursKm: string;
  image: string | null;
  mapEmbedUrl: string | null;
  directionsLink: string | null;
  services: string[];
  sortOrder: number;
  isVisible: boolean;
}

export interface ApiStoryBlock {
  id: string;
  headingEn: string;
  headingKm: string;
  textEn: string;
  textKm: string;
  image: string | null;
  imageAltEn: string;
  imageAltKm: string;
  layout: string;
  sortOrder: number;
  isVisible: boolean;
}

export interface ApiGalleryItem {
  id: string;
  type: string;
  url: string;
  captionEn: string;
  captionKm: string;
  altEn: string;
  altKm: string;
  showOnHome: boolean;
  sortOrder: number;
}

export interface ApiTestimonial {
  id: string;
  name: string;
  textEn: string;
  textKm: string;
  rating: number;
  photo: string | null;
  isVisible: boolean;
  sortOrder: number;
}

export interface ApiFaqItem {
  id: string;
  questionEn: string;
  questionKm: string;
  answerEn: string;
  answerKm: string;
  section: string;
  sortOrder: number;
  isVisible: boolean;
}

export interface ApiWholesaleSettings {
  id: string;
  heroHeadlineEn: string;
  heroHeadlineKm: string;
  heroSubHeadlineEn: string;
  heroSubHeadlineKm: string;
  heroImage: string | null;
  deliveryCoverageEn: string;
  deliveryCoverageKm: string;
  minimumOrderTextEn: string;
  minimumOrderTextKm: string;
}

export interface ApiWholesaleStep {
  id: string;
  titleEn: string;
  titleKm: string;
  descriptionEn: string;
  descriptionKm: string;
  icon: string;
  sortOrder: number;
}

export interface ApiWholesaleData {
  settings: ApiWholesaleSettings | null;
  steps: ApiWholesaleStep[];
  faqs: ApiFaqItem[];
}

export interface ApiPageSeo {
  id: string;
  pageSlug: string;
  titleEn: string;
  titleKm: string;
  descriptionEn: string;
  descriptionKm: string;
  ogImage: string | null;
}

// ─── API endpoint functions ───

export const api = {
  // Settings & Announcements
  getSettings: () =>
    apiFetch<ApiSettings>("/settings", { revalidate: 3600 }),

  getAnnouncement: () =>
    apiFetch<ApiSettings["announcement"]>("/announcements", { revalidate: 300 }),

  getPageSeo: (slug: string) =>
    apiFetch<ApiPageSeo>(`/seo/${slug}`, { revalidate: 3600 }),

  // Categories
  getCategories: () =>
    apiFetch<ApiCategory[]>("/categories", { revalidate: 3600 }),

  getCategoryBySlug: (slug: string) =>
    apiFetch<ApiCategory>(`/categories/${slug}`, { revalidate: 3600 }),

  // Products
  getProducts: (params?: {
    category?: string;
    featured?: boolean;
    badge?: string;
    channel?: string;
    search?: string;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set("category", params.category);
    if (params?.featured) searchParams.set("featured", "1");
    if (params?.badge) searchParams.set("badge", params.badge);
    if (params?.channel) searchParams.set("channel", params.channel);
    if (params?.search) searchParams.set("search", params.search);
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    const qs = searchParams.toString();
    return apiFetch<ApiProduct[]>(`/products${qs ? `?${qs}` : ""}`, { revalidate: 3600 });
  },

  getFavouriteProducts: () =>
    apiFetch<ApiProduct[]>("/products/favourites", { revalidate: 3600 }),

  getProductBySlug: (slug: string) =>
    apiFetch<ApiProduct>(`/products/${slug}`, { revalidate: 3600 }),

  // Promotions
  getPromotions: () =>
    apiFetch<ApiPromotion[]>("/promotions", { revalidate: 3600 }),

  getHomePromotions: () =>
    apiFetch<ApiPromotion[]>("/promotions/home", { revalidate: 3600 }),

  // Content & Sections
  getHomeSections: () =>
    apiFetch<Record<string, ApiHomeSection>>("/content/home-sections", { revalidate: 3600 }),

  getStoryBlocks: () =>
    apiFetch<ApiStoryBlock[]>("/content/story-blocks", { revalidate: 3600 }),

  getWholesale: () =>
    apiFetch<ApiWholesaleData>("/content/wholesale", { revalidate: 3600 }),

  getLocations: () =>
    apiFetch<ApiLocation[]>("/content/locations", { revalidate: 3600 }),

  getFaqs: (section?: string) => {
    const qs = section ? `?section=${section}` : "";
    return apiFetch<ApiFaqItem[]>(`/content/faqs${qs}`, { revalidate: 3600 });
  },

  getTestimonials: () =>
    apiFetch<ApiTestimonial[]>("/content/testimonials", { revalidate: 3600 }),

  getGallery: (homeOnly?: boolean) => {
    const qs = homeOnly ? "?home=1" : "";
    return apiFetch<ApiGalleryItem[]>(`/content/gallery${qs}`, { revalidate: 3600 });
  },

  // Orders
  createOrder: (data: Record<string, unknown>) =>
    apiPost("/orders", data),

  getOrder: (orderNumber: string) =>
    apiFetch(`/orders/${orderNumber}`, { revalidate: 0 }),

  // Contact
  submitContact: (data: Record<string, unknown>) =>
    apiPost("/contact", data),
};
