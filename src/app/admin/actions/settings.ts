"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import { getAuthenticatedUser, logActivity } from "@/lib/auth-check";

const siteSettingsSchema = z.object({
  logoLight: z.string().nullable().optional(),
  logoDark: z.string().nullable().optional(),
  phoneNumbers: z.array(z.string()).default([]),
  email: z.string().email().default("info@nostbakery.com"),
  telegramLink: z.string().default("https://t.me/NostBakery"),
  facebookLink: z.string().default("https://www.facebook.com/NOSTBakeryPastry"),
  websiteUrl: z.string().default("nostbakery.com"),
  addressEn: z.string().default("Siem Reap, Cambodia"),
  addressKm: z.string().default(""),
  seoTitleEn: z.string().default("NOST Bakery & Pastry — Fresh Bakery in Siem Reap"),
  seoTitleKm: z.string().default(""),
  seoDescriptionEn: z.string().default(""),
  seoDescriptionKm: z.string().default(""),
  ogImage: z.string().nullable().optional(),
  googleAnalyticsId: z.string().nullable().optional(),
  facebookPixelId: z.string().nullable().optional(),
  cookieNoticeTextEn: z.string().default(""),
  cookieNoticeTextKm: z.string().default(""),
  footerTextEn: z.string().default(""),
  footerTextKm: z.string().default(""),
});

export async function updateSiteSettings(formData: z.input<typeof siteSettingsSchema>) {
  try {
    const user = await getAuthenticatedUser();
    const validated = siteSettingsSchema.parse(formData);

    const res = await api.updateSettings(validated as Record<string, unknown>);

    if (!res.success) {
      return { success: false, error: res.error || "Failed to update settings" };
    }

    await logActivity({
      userId: user.id,
      action: "updated site settings",
      entity: "SiteSettings",
      entityId: "default",
      details: "Updated general contact, SEO and analytics configuration",
    });

    revalidatePath("/admin/settings");
    revalidatePath("/", "layout");

    return { success: true, data: res.data };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update settings";
    return { success: false, error: msg };
  }
}

const announcementSchema = z.object({
  textEn: z.string().min(1, "English announcement text is required"),
  textKm: z.string().default(""),
  link: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
});

export async function updateAnnouncementBar(formData: z.input<typeof announcementSchema>) {
  try {
    const user = await getAuthenticatedUser();
    const validated = announcementSchema.parse(formData);

    const res = await api.updateAnnouncement({
      textEn: validated.textEn,
      textKm: validated.textKm,
      link: validated.link || null,
      isActive: validated.isActive,
      startDate: validated.startDate || null,
      endDate: validated.endDate || null,
    });

    if (!res.success) {
      return { success: false, error: res.error || "Failed to update announcement" };
    }

    await logActivity({
      userId: user.id,
      action: "updated announcement bar",
      entity: "AnnouncementBar",
      entityId: "default",
      details: `Active: ${validated.isActive}. EN: ${validated.textEn.slice(0, 30)}`,
    });

    revalidatePath("/admin/announcement");
    revalidatePath("/", "layout");

    return { success: true, data: res.data };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update announcement";
    return { success: false, error: msg };
  }
}
