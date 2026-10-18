"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import { getAuthenticatedUser, logActivity } from "@/lib/auth-check";

const gallerySchema = z.object({
  type: z.enum(["IMAGE", "VIDEO"]).default("IMAGE"),
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

    const res = await api.saveGalleryItem(validated);
    if (!res.success) {
      return { success: false, error: res.error || "Failed to create gallery item" };
    }

    const item = res.data;

    await logActivity({
      userId: user.id,
      action: "created gallery item",
      entity: "GalleryItem",
      entityId: String(item?.id || ""),
      details: `Added ${validated.type.toLowerCase()} to gallery`,
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

    const res = await api.saveGalleryItem(validated, id);
    if (!res.success) {
      return { success: false, error: res.error || "Failed to update gallery item" };
    }

    const item = res.data;

    await logActivity({
      userId: user.id,
      action: "updated gallery item",
      entity: "GalleryItem",
      entityId: String(id),
      details: `Updated ${validated.type.toLowerCase()} in gallery`,
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
    const res = await api.deleteGalleryItem(id);
    if (!res.success) {
      return { success: false, error: res.error || "Failed to delete gallery item" };
    }

    await logActivity({
      userId: user.id,
      action: "deleted gallery item",
      entity: "GalleryItem",
      entityId: id,
      details: `Deleted gallery item ID "${id}"`,
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

    const res = await api.reorderGallery(
      orderedIds.map((id, index) => ({ id, sortOrder: index }))
    );
    if (!res.success) {
      return { success: false, error: res.error || "Failed to reorder gallery" };
    }

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
