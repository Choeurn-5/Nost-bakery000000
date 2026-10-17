"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, logActivity } from "@/lib/auth-check";
import { GalleryType } from "@prisma/client";

const gallerySchema = z.object({
  type: z.nativeEnum(GalleryType).default(GalleryType.IMAGE),
  url: z.string().min(1, "URL is required"),
  captionEn: z.string().default(""),
  captionKm: z.string().default(""),
  altEn: z.string().default(""),
  altKm: z.string().default(""),
  showOnHome: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export async function createGalleryItem(input: z.infer<typeof gallerySchema>) {
  try {
    const user = await getAuthenticatedUser();
    const validated = gallerySchema.parse(input);

    const count = await prisma.galleryItem.count();

    const item = await prisma.galleryItem.create({
      data: {
        ...validated,
        sortOrder: validated.sortOrder || count,
      },
    });

    await logActivity({
      userId: user.id,
      action: "created gallery item",
      entity: "GalleryItem",
      entityId: item.id,
      details: `Added ${item.type.toLowerCase()} to gallery`,
    });

    revalidatePath("/admin/gallery");
    revalidatePath("/", "layout");

    return { success: true, data: item };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to create gallery item";
    return { success: false, error: msg };
  }
}

export async function updateGalleryItem(id: string, input: z.infer<typeof gallerySchema>) {
  try {
    const user = await getAuthenticatedUser();
    const validated = gallerySchema.parse(input);

    const item = await prisma.galleryItem.update({
      where: { id },
      data: validated,
    });

    await logActivity({
      userId: user.id,
      action: "updated gallery item",
      entity: "GalleryItem",
      entityId: item.id,
      details: `Updated ${item.type.toLowerCase()} in gallery`,
    });

    revalidatePath("/admin/gallery");
    revalidatePath("/", "layout");

    return { success: true, data: item };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update gallery item";
    return { success: false, error: msg };
  }
}

export async function deleteGalleryItem(id: string) {
  try {
    const user = await getAuthenticatedUser();
    const item = await prisma.galleryItem.delete({ where: { id } });

    await logActivity({
      userId: user.id,
      action: "deleted gallery item",
      entity: "GalleryItem",
      entityId: id,
      details: `Deleted ${item.type.toLowerCase()} from gallery`,
    });

    revalidatePath("/admin/gallery");
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to delete gallery item";
    return { success: false, error: msg };
  }
}

export async function reorderGalleryItems(orderedIds: string[]) {
  try {
    const user = await getAuthenticatedUser();

    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.galleryItem.update({
          where: { id },
          data: { sortOrder: index },
        })
      )
    );

    await logActivity({
      userId: user.id,
      action: "reordered gallery",
      entity: "GalleryItem",
      details: `Reordered ${orderedIds.length} gallery items`,
    });

    revalidatePath("/admin/gallery");
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to reorder gallery";
    return { success: false, error: msg };
  }
}
