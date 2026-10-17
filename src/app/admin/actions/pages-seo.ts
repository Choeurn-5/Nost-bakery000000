"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
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

    const seo = await prisma.pageSeo.upsert({
      where: { pageSlug: validated.pageSlug },
      update: {
        titleEn: validated.titleEn,
        titleKm: validated.titleKm,
        descriptionEn: validated.descriptionEn,
        descriptionKm: validated.descriptionKm,
        ogImage: validated.ogImage || null,
      },
      create: {
        pageSlug: validated.pageSlug,
        titleEn: validated.titleEn,
        titleKm: validated.titleKm,
        descriptionEn: validated.descriptionEn,
        descriptionKm: validated.descriptionKm,
        ogImage: validated.ogImage || null,
      },
    });

    await logActivity({
      userId: user.id,
      action: "updated page seo",
      entity: "PageSeo",
      entityId: seo.id,
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
