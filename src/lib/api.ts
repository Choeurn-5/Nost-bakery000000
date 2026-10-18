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

// ─── camelCase → snake_case transformer (for requests to Laravel) ───

function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);
}

function toSnakeCaseKeys(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(toSnakeCaseKeys);
  if (typeof obj === "object" && obj !== null && !(obj instanceof Date)) {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      result[camelToSnake(key)] = toSnakeCaseKeys(value);
    }
    return result;
  }
  return obj;
}

// ─── Admin fetch helper (with X-Admin-Secret authorization) ───

const ADMIN_SECRET = process.env.ADMIN_API_SECRET || "nost-bakery-internal-admin-secret-2025";

async function adminFetch<T>(
  path: string,
  options?: {
    method?: string;
    body?: Record<string, unknown>;
  }
): Promise<{ success: boolean; data?: T; message?: string; error?: string }> {
  try {
    const url = `${API_BASE}/api/admin${path}`;
    const method = options?.method || "GET";
    const body = options?.body ? JSON.stringify(toSnakeCaseKeys(options.body)) : undefined;

    const res = await fetch(url, {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Admin-Secret": ADMIN_SECRET,
      },
      body,
      cache: "no-store",
    });

    const json = await res.json().catch(() => null);

    if (!res.ok || (json && !json.success)) {
      const errMsg = json?.message || `Admin API error: ${res.status} ${res.statusText}`;
      return { success: false, error: errMsg };
    }

    return {
      success: true,
      data: json?.data ? (transformKeys(json.data) as T) : undefined,
      message: json?.message,
    };
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Network error contacting Admin API";
    return { success: false, error: errMsg };
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

export type ApiSiteSettings = NonNullable<ApiSettings["settings"]>;
export type ApiAnnouncement = NonNullable<ApiSettings["announcement"]>;

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

  // ─── Admin API Operations (Connected directly to Laravel) ───
  getAdminStats: () =>
    adminFetch<{
      counts: {
        products: number;
        publishedProducts: number;
        featuredProducts: number;
        outOfStock: number;
        categories: number;
        promotions: number;
        submissions: number;
        unreadSubmissions: number;
        orders: number;
        pendingOrders: number;
      };
      recentSubmissions: any[];
      recentProducts: any[];
    }>("/stats"),

  // Products
  getAdminProducts: (params?: { category?: string; status?: string; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set("category", params.category);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.search) searchParams.set("search", params.search);
    const qs = searchParams.toString();
    return adminFetch<any[]>(`/products${qs ? `?${qs}` : ""}`);
  },

  getAdminProduct: (id: string | number) =>
    adminFetch<any>(`/products/${id}`),

  createProduct: (data: Record<string, unknown>) =>
    adminFetch<any>("/products", { method: "POST", body: data }),

  updateProduct: (id: string | number, data: Record<string, unknown>) =>
    adminFetch<any>(`/products/${id}`, { method: "PUT", body: data }),

  deleteProduct: (id: string | number, force?: boolean) =>
    adminFetch(`/products/${id}${force ? "?force=1" : ""}`, { method: "DELETE" }),

  reorderProducts: (items: Array<{ id: string | number; sortOrder: number }>) =>
    adminFetch("/products/reorder", { method: "POST", body: { items } }),

  // Categories
  getAdminCategories: () =>
    adminFetch<any[]>("/categories"),

  getAdminCategory: (id: string | number) =>
    adminFetch<any>(`/categories/${id}`),

  createCategory: (data: Record<string, unknown>) =>
    adminFetch<any>("/categories", { method: "POST", body: data }),

  updateCategory: (id: string | number, data: Record<string, unknown>) =>
    adminFetch<any>(`/categories/${id}`, { method: "PUT", body: data }),

  deleteCategory: (id: string | number, force?: boolean) =>
    adminFetch(`/categories/${id}${force ? "?force=1" : ""}`, { method: "DELETE" }),

  reorderCategories: (items: Array<{ id: string | number; sortOrder: number }>) =>
    adminFetch("/categories/reorder", { method: "POST", body: { items } }),

  // Promotions
  getAdminPromotions: () =>
    adminFetch<any[]>("/promotions"),

  getAdminPromotion: (id: string | number) =>
    adminFetch<any>(`/promotions/${id}`),

  createPromotion: (data: Record<string, unknown>) =>
    adminFetch<any>("/promotions", { method: "POST", body: data }),

  updatePromotion: (id: string | number, data: Record<string, unknown>) =>
    adminFetch<any>(`/promotions/${id}`, { method: "PUT", body: data }),

  deletePromotion: (id: string | number) =>
    adminFetch(`/promotions/${id}`, { method: "DELETE" }),

  // Site Settings & Announcement Bar
  getAdminSettings: () =>
    adminFetch<ApiSiteSettings>("/settings"),

  updateSettings: (data: Record<string, unknown>) =>
    adminFetch<ApiSiteSettings>("/settings", { method: "POST", body: data }),

  getAdminAnnouncement: () =>
    adminFetch<ApiAnnouncement>("/announcement"),

  updateAnnouncement: (data: Record<string, unknown>) =>
    adminFetch<ApiAnnouncement>("/announcement", { method: "POST", body: data }),

  // Home Sections
  getAdminHomeSections: () =>
    adminFetch<ApiHomeSection[]>("/home-sections"),

  saveHomeSection: (data: Record<string, unknown>) =>
    adminFetch<ApiHomeSection>("/home-sections", { method: "POST", body: data }),

  deleteHomeSection: (id: string | number) =>
    adminFetch(`/home-sections/${id}`, { method: "DELETE" }),

  reorderHomeSections: (items: Array<{ id: string | number; sortOrder: number }>) =>
    adminFetch("/home-sections/reorder", { method: "POST", body: { items } }),

  // Inbox & Submissions
  getAdminInbox: (params?: { type?: string; status?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.type) searchParams.set("type", params.type);
    if (params?.status) searchParams.set("status", params.status);
    const qs = searchParams.toString();
    return adminFetch<any[]>(`/inbox${qs ? `?${qs}` : ""}`);
  },

  updateInboxItem: (id: string | number, data: Record<string, unknown>) =>
    adminFetch(`/inbox/${id}`, { method: "PUT", body: data }),

  deleteInboxItem: (id: string | number) =>
    adminFetch(`/inbox/${id}`, { method: "DELETE" }),

  // Locations
  getAdminLocations: () =>
    adminFetch<any[]>("/locations"),

  saveLocation: (data: Record<string, unknown>, id?: string | number) =>
    adminFetch<any>(id ? `/locations/${id}` : "/locations", {
      method: id ? "PUT" : "POST",
      body: data,
    }),

  deleteLocation: (id: string | number) =>
    adminFetch(`/locations/${id}`, { method: "DELETE" }),

  reorderLocations: (items: Array<{ id: string | number; sortOrder: number }>) =>
    adminFetch("/locations/reorder", { method: "POST", body: { items } }),

  // Stories
  getAdminStories: () =>
    adminFetch<any[]>("/stories"),

  saveStory: (data: Record<string, unknown>, id?: string | number) =>
    adminFetch<any>(id ? `/stories/${id}` : "/stories", {
      method: id ? "PUT" : "POST",
      body: data,
    }),

  deleteStory: (id: string | number) =>
    adminFetch(`/stories/${id}`, { method: "DELETE" }),

  reorderStories: (items: Array<{ id: string | number; sortOrder: number }>) =>
    adminFetch("/stories/reorder", { method: "POST", body: { items } }),

  // Testimonials
  getAdminTestimonials: () =>
    adminFetch<any[]>("/testimonials"),

  saveTestimonial: (data: Record<string, unknown>, id?: string | number) =>
    adminFetch<any>(id ? `/testimonials/${id}` : "/testimonials", {
      method: id ? "PUT" : "POST",
      body: data,
    }),

  deleteTestimonial: (id: string | number) =>
    adminFetch(`/testimonials/${id}`, { method: "DELETE" }),

  reorderTestimonials: (items: Array<{ id: string | number; sortOrder: number }>) =>
    adminFetch("/testimonials/reorder", { method: "POST", body: { items } }),

  // Gallery
  getAdminGallery: () =>
    adminFetch<any[]>("/gallery"),

  saveGalleryItem: (data: Record<string, unknown>, id?: string | number) =>
    adminFetch<any>(id ? `/gallery/${id}` : "/gallery", {
      method: id ? "PUT" : "POST",
      body: data,
    }),

  deleteGalleryItem: (id: string | number) =>
    adminFetch(`/gallery/${id}`, { method: "DELETE" }),

  reorderGallery: (items: Array<{ id: string | number; sortOrder: number }>) =>
    adminFetch("/gallery/reorder", { method: "POST", body: { items } }),

  // Wholesale
  getAdminWholesale: () =>
    adminFetch<{ settings: any; steps: any[] }>("/wholesale"),

  saveWholesaleSettings: (data: Record<string, unknown>) =>
    adminFetch<any>("/wholesale", { method: "POST", body: data }),

  saveWholesaleStep: (data: Record<string, unknown>, id?: string | number) =>
    adminFetch<any>(id ? `/wholesale/steps/${id}` : "/wholesale/steps", {
      method: id ? "PUT" : "POST",
      body: data,
    }),

  deleteWholesaleStep: (id: string | number) =>
    adminFetch(`/wholesale/steps/${id}`, { method: "DELETE" }),

  reorderWholesaleSteps: (items: Array<{ id: string | number; sortOrder: number }>) =>
    adminFetch("/wholesale/steps/reorder", { method: "POST", body: { items } }),

  // FAQs
  getAdminFaqs: (section?: string) =>
    adminFetch<any[]>(`/faqs${section ? `?section=${section}` : ""}`),

  saveFaq: (data: Record<string, unknown>, id?: string | number) =>
    adminFetch<any>(id ? `/faqs/${id}` : "/faqs", {
      method: id ? "PUT" : "POST",
      body: data,
    }),

  deleteFaq: (id: string | number) =>
    adminFetch(`/faqs/${id}`, { method: "DELETE" }),

  reorderFaqs: (items: Array<{ id: string | number; sortOrder: number }>) =>
    adminFetch("/faqs/reorder", { method: "POST", body: { items } }),

  // Pages & SEO
  getAdminPagesSeo: () =>
    adminFetch<any[]>("/pages-seo"),

  savePageSeo: (data: Record<string, unknown>) =>
    adminFetch<any>("/pages-seo", { method: "POST", body: data }),

  // Users
  getAdminUsers: () =>
    adminFetch<any[]>("/users"),

  saveAdminUser: (data: Record<string, unknown>, id?: string | number) =>
    adminFetch<any>(id ? `/users/${id}` : "/users", {
      method: id ? "PUT" : "POST",
      body: data,
    }),

  deleteAdminUser: (id: string | number) =>
    adminFetch(`/users/${id}`, { method: "DELETE" }),

  // Media Library
  getAdminMedia: () =>
    adminFetch<any[]>("/media"),

  saveMedia: (data: Record<string, unknown>) =>
    adminFetch<any>("/media", { method: "POST", body: data }),

  deleteMedia: (id: string | number) =>
    adminFetch(`/media/${id}`, { method: "DELETE" }),

  // Activity Log
  getAdminActivityLogs: () =>
    adminFetch<any[]>("/activity-log"),

  logActivity: (data: {
    userId?: string;
    userEmail?: string;
    userName?: string;
    action: string;
    entity: string;
    entityId?: string | null;
    details?: string | null;
  }) =>
    adminFetch<any>("/activity-log", { method: "POST", body: data }),
};

export const adminApi = api;

