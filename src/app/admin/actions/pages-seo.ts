"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import { getAuthenticatedUser, logActivity } from "@/lib/auth-check";

const pageSeoSchema = z.object({
  pageSlug: z.string().min(1, "Page slug is required"),
  titleEn: z.string().default(""),
  titleKm: z.string().default(""),
  descriptionEn: z.string().default(""),
  descriptionKm: z.string().default(""),
  ogImage: z.string().nullable().optional(),
});

export async function updatePageSeo(input: z.infer<typeof pageSeoSchema>) {
  try {
    const user = await getAuthenticatedUser();
    const validated = pageSeoSchema.parse(input);

    const res = await api.savePageSeo(validated);
    if (!res.success) {
      return { success: false, error: res.error || "Failed to update page SEO" };
    }

    const seo = res.data;

    await logActivity({
      userId: user.id,
      action: "updated page seo",
      entity: "PageSeo",
      entityId: String(seo?.id || ""),
      details: `Updated SEO meta for page "${validated.pageSlug}"`,
    });

    revalidatePath("/admin/pages-seo");
    revalidatePath("/", "layout");

    return { success: true, data: seo };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update page SEO";
    return { success: false, error: msg };
  }
}
