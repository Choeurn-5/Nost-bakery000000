"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import { getAuthenticatedUser, logActivity } from "@/lib/auth-check";
import { ContentStatus } from "@prisma/client";

const promotionSchema = z.object({
  titleEn: z.string().min(1, "English title is required"),
  titleKm: z.string().default(""),
  badgeTextEn: z.string().default(""),
  badgeTextKm: z.string().default(""),
  descriptionEn: z.string().default(""),
  descriptionKm: z.string().default(""),
  image: z.string().nullable().optional(),
  imageAltEn: z.string().default(""),
  imageAltKm: z.string().default(""),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  dailyStartTime: z.string().nullable().optional(),
  dailyEndTime: z.string().nullable().optional(),
  finePrintEn: z.string().default(""),
  finePrintKm: z.string().default(""),
  showOnHome: z.boolean().default(false),
  status: z.nativeEnum(ContentStatus).default(ContentStatus.DRAFT),
  productIds: z.array(z.union([z.string(), z.number()])).default([]),
});

export async function createPromotion(input: z.input<typeof promotionSchema>) {
  try {
    const user = await getAuthenticatedUser();
    const validated = promotionSchema.parse(input);

    const res = await api.createPromotion({
      titleEn: validated.titleEn,
      titleKm: validated.titleKm,
      badgeTextEn: validated.badgeTextEn,
      badgeTextKm: validated.badgeTextKm,
      descriptionEn: validated.descriptionEn,
      descriptionKm: validated.descriptionKm,
      image: validated.image || null,
      imageAltEn: validated.imageAltEn,
      imageAltKm: validated.imageAltKm,
      startDate: validated.startDate || null,
      endDate: validated.endDate || null,
      dailyStartTime: validated.dailyStartTime || null,
      dailyEndTime: validated.dailyEndTime || null,
      finePrintEn: validated.finePrintEn,
      finePrintKm: validated.finePrintKm,
      showOnHome: validated.showOnHome,
      status: validated.status,
      productIds: validated.productIds.map(Number).filter((n) => !isNaN(n) && n > 0),
    });

    if (!res.success) {
      return { success: false, error: res.error || "Failed to create promotion" };
    }

    await logActivity({
      userId: user.id,
      action: "created promotion",
      entity: "Promotion",
      entityId: res.data?.id ? String(res.data.id) : null,
      details: `Created promotion "${validated.titleEn}"`,
    });

    revalidatePath("/admin/promotions");
    revalidatePath("/admin");
    revalidatePath("/", "layout");

    return { success: true, data: res.data };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to create promotion";
    return { success: false, error: msg };
  }
}

export async function updatePromotion(id: string | number, input: z.input<typeof promotionSchema>) {
  try {
    const user = await getAuthenticatedUser();
    const validated = promotionSchema.parse(input);

    const res = await api.updatePromotion(id, {
      titleEn: validated.titleEn,
      titleKm: validated.titleKm,
      badgeTextEn: validated.badgeTextEn,
      badgeTextKm: validated.badgeTextKm,
      descriptionEn: validated.descriptionEn,
      descriptionKm: validated.descriptionKm,
      image: validated.image || null,
      imageAltEn: validated.imageAltEn,
      imageAltKm: validated.imageAltKm,
      startDate: validated.startDate || null,
      endDate: validated.endDate || null,
      dailyStartTime: validated.dailyStartTime || null,
      dailyEndTime: validated.dailyEndTime || null,
      finePrintEn: validated.finePrintEn,
      finePrintKm: validated.finePrintKm,
      showOnHome: validated.showOnHome,
      status: validated.status,
      productIds: validated.productIds.map(Number).filter((n) => !isNaN(n) && n > 0),
    });

    if (!res.success) {
      return { success: false, error: res.error || "Failed to update promotion" };
    }

    await logActivity({
      userId: user.id,
      action: "updated promotion",
      entity: "Promotion",
      entityId: String(id),
      details: `Updated promotion "${validated.titleEn}"`,
    });

    revalidatePath("/admin/promotions");
    revalidatePath(`/admin/promotions/${id}`);
    revalidatePath("/admin");
    revalidatePath("/", "layout");

    return { success: true, data: res.data };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update promotion";
    return { success: false, error: msg };
  }
}

export async function deletePromotion(id: string | number) {
  try {
    const user = await getAuthenticatedUser();

    const res = await api.deletePromotion(id);
    if (!res.success) {
      return { success: false, error: res.error || "Failed to delete promotion" };
    }

    await logActivity({
      userId: user.id,
      action: "deleted promotion",
      entity: "Promotion",
      entityId: String(id),
      details: `Deleted promotion ID ${id}`,
    });

    revalidatePath("/admin/promotions");
    revalidatePath("/admin");
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to delete promotion";
    return { success: false, error: msg };
  }
}
