"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import { getAuthenticatedUser, logActivity } from "@/lib/auth-check";

const categorySchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  nameEn: z.string().min(1, "English name is required"),
  nameKm: z.string().default(""),
  slug: z.string().optional(),
  image: z.string().nullable().optional(),
  imageAltEn: z.string().default(""),
  imageAltKm: z.string().default(""),
  isVisible: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export async function createCategory(input: z.input<typeof categorySchema>) {
  try {
    const user = await getAuthenticatedUser();
    const validated = categorySchema.parse(input);

    const res = await api.createCategory({
      nameEn: validated.nameEn,
      nameKm: validated.nameKm,
      slug: validated.slug || undefined,
      image: validated.image || null,
      imageAltEn: validated.imageAltEn,
      imageAltKm: validated.imageAltKm,
      isVisible: validated.isVisible,
      sortOrder: validated.sortOrder,
    });

    if (!res.success) {
      return { success: false, error: res.error || "Failed to create category" };
    }

    await logActivity({
      userId: user.id,
      action: "created category",
      entity: "Category",
      entityId: res.data?.id ? String(res.data.id) : null,
      details: `Created category "${validated.nameEn}"`,
    });

    revalidatePath("/admin/categories");
    revalidatePath("/", "layout");

    return { success: true, data: res.data };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to create category";
    return { success: false, error: msg };
  }
}

export async function updateCategory(id: string | number, input: z.input<typeof categorySchema>) {
  try {
    const user = await getAuthenticatedUser();
    const validated = categorySchema.parse(input);

    const res = await api.updateCategory(id, {
      nameEn: validated.nameEn,
      nameKm: validated.nameKm,
      slug: validated.slug || undefined,
      image: validated.image || null,
      imageAltEn: validated.imageAltEn,
      imageAltKm: validated.imageAltKm,
      isVisible: validated.isVisible,
      sortOrder: validated.sortOrder,
    });

    if (!res.success) {
      return { success: false, error: res.error || "Failed to update category" };
    }

    await logActivity({
      userId: user.id,
      action: "updated category",
      entity: "Category",
      entityId: String(id),
      details: `Updated category "${validated.nameEn}"`,
    });

    revalidatePath("/admin/categories");
    revalidatePath("/", "layout");

    return { success: true, data: res.data };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update category";
    return { success: false, error: msg };
  }
}

export async function deleteCategory(id: string | number) {
  try {
    const user = await getAuthenticatedUser();

    const res = await api.deleteCategory(id);
    if (!res.success) {
      return { success: false, error: res.error || "Failed to delete category" };
    }

    await logActivity({
      userId: user.id,
      action: "deleted category",
      entity: "Category",
      entityId: String(id),
      details: `Deleted category ID ${id}`,
    });

    revalidatePath("/admin/categories");
    revalidatePath("/", "layout");

    return { success: true, data: res.data };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to delete category";
    return { success: false, error: msg };
  }
}

export async function reorderCategories(orderedIds: Array<string | number>) {
  try {
    const user = await getAuthenticatedUser();

    const items = orderedIds.map((id, index) => ({
      id,
      sortOrder: index,
    }));

    const res = await api.reorderCategories(items);
    if (!res.success) {
      return { success: false, error: res.error || "Failed to reorder categories" };
    }

    await logActivity({
      userId: user.id,
      action: "reordered categories",
      entity: "Category",
      details: `Reordered ${orderedIds.length} categories`,
    });

    revalidatePath("/admin/categories");
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to reorder categories";
    return { success: false, error: msg };
  }
}
