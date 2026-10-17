"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
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
  productIds: z.array(z.string()).default([]),
});

export async function createPromotion(input: z.input<typeof promotionSchema>) {
  try {
    const user = await getAuthenticatedUser();
    const validated = promotionSchema.parse(input);

    const promotion = await prisma.promotion.create({
      data: {
        titleEn: validated.titleEn,
        titleKm: validated.titleKm,
        badgeTextEn: validated.badgeTextEn,
        badgeTextKm: validated.badgeTextKm,
        descriptionEn: validated.descriptionEn,
        descriptionKm: validated.descriptionKm,
        image: validated.image || null,
        imageAltEn: validated.imageAltEn,
        imageAltKm: validated.imageAltKm,
        startDate: validated.startDate ? new Date(validated.startDate) : null,
        endDate: validated.endDate ? new Date(validated.endDate) : null,
        dailyStartTime: validated.dailyStartTime || null,
        dailyEndTime: validated.dailyEndTime || null,
        finePrintEn: validated.finePrintEn,
        finePrintKm: validated.finePrintKm,
        showOnHome: validated.showOnHome,
        status: validated.status,
        products: {
          create: validated.productIds.map((pId) => ({
            productId: pId,
          })),
        },
      },
      include: { products: true },
    });

    await logActivity({
      userId: user.id,
      action: "created promotion",
      entity: "Promotion",
      entityId: promotion.id,
      details: `Created promotion "${promotion.titleEn}"`,
    });

    revalidatePath("/admin/promotions");
    revalidatePath("/admin");
    revalidatePath("/", "layout");

    return { success: true, data: promotion };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to create promotion";
    return { success: false, error: msg };
  }
}

export async function updatePromotion(id: string, input: z.input<typeof promotionSchema>) {
  try {
    const user = await getAuthenticatedUser();
    const validated = promotionSchema.parse(input);

    // Delete existing product links
    await prisma.promotionProduct.deleteMany({ where: { promotionId: id } });

    const promotion = await prisma.promotion.update({
      where: { id },
      data: {
        titleEn: validated.titleEn,
        titleKm: validated.titleKm,
        badgeTextEn: validated.badgeTextEn,
        badgeTextKm: validated.badgeTextKm,
        descriptionEn: validated.descriptionEn,
        descriptionKm: validated.descriptionKm,
        image: validated.image || null,
        imageAltEn: validated.imageAltEn,
        imageAltKm: validated.imageAltKm,
        startDate: validated.startDate ? new Date(validated.startDate) : null,
        endDate: validated.endDate ? new Date(validated.endDate) : null,
        dailyStartTime: validated.dailyStartTime || null,
        dailyEndTime: validated.dailyEndTime || null,
        finePrintEn: validated.finePrintEn,
        finePrintKm: validated.finePrintKm,
        showOnHome: validated.showOnHome,
        status: validated.status,
        products: {
          create: validated.productIds.map((pId) => ({
            productId: pId,
          })),
        },
      },
      include: { products: true },
    });

    await logActivity({
      userId: user.id,
      action: "updated promotion",
      entity: "Promotion",
      entityId: promotion.id,
      details: `Updated promotion "${promotion.titleEn}"`,
    });

    revalidatePath("/admin/promotions");
    revalidatePath(`/admin/promotions/${id}`);
    revalidatePath("/admin");
    revalidatePath("/", "layout");

    return { success: true, data: promotion };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update promotion";
    return { success: false, error: msg };
  }
}

export async function deletePromotion(id: string) {
  try {
    const user = await getAuthenticatedUser();

    await prisma.promotionProduct.deleteMany({ where: { promotionId: id } });
    const deleted = await prisma.promotion.delete({ where: { id } });

    await logActivity({
      userId: user.id,
      action: "deleted promotion",
      entity: "Promotion",
      entityId: id,
      details: `Deleted promotion "${deleted.titleEn}"`,
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
