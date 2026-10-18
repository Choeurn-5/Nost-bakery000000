"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import { getAuthenticatedUser, logActivity } from "@/lib/auth-check";
import { ProductBadge, Availability, ChannelTag, ContentStatus } from "@prisma/client";

const productImageSchema = z.object({
  url: z.string().min(1, "Image URL is required"),
  altEn: z.string().default(""),
  altKm: z.string().default(""),
  sortOrder: z.number().int().default(0),
});

const productSchema = z.object({
  nameEn: z.string().min(1, "English product name is required"),
  nameKm: z.string().default(""),
  slug: z.string().optional(),
  descriptionEn: z.string().default(""),
  descriptionKm: z.string().default(""),
  price: z.number().nullable().optional(),
  compareAtPrice: z.number().nullable().optional(),
  categoryId: z.union([z.string(), z.number()]).transform(String),
  badges: z.array(z.nativeEnum(ProductBadge)).default([]),
  availability: z.nativeEnum(Availability).default(Availability.AVAILABLE),
  channelTags: z.array(z.nativeEnum(ChannelTag)).default([ChannelTag.RETAIL]),
  isFeatured: z.boolean().default(false),
  status: z.nativeEnum(ContentStatus).default(ContentStatus.DRAFT),
  images: z.array(productImageSchema).default([]),
});

export async function createProduct(input: z.input<typeof productSchema>) {
  try {
    const user = await getAuthenticatedUser();
    const validated = productSchema.parse(input);

    const res = await api.createProduct({
      nameEn: validated.nameEn,
      nameKm: validated.nameKm,
      slug: validated.slug || undefined,
      descriptionEn: validated.descriptionEn,
      descriptionKm: validated.descriptionKm,
      price: validated.price,
      compareAtPrice: validated.compareAtPrice,
      categoryId: validated.categoryId,
      badges: validated.badges,
      availability: validated.availability,
      channelTags: validated.channelTags,
      isFeatured: validated.isFeatured,
      status: validated.status,
      images: validated.images,
    });

    if (!res.success) {
      return { success: false, error: res.error || "Failed to create product" };
    }

    await logActivity({
      userId: user.id,
      action: "created product",
      entity: "Product",
      entityId: res.data?.id ? String(res.data.id) : null,
      details: `Created product "${validated.nameEn}"`,
    });

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/", "layout");

    return { success: true, data: res.data };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to create product";
    return { success: false, error: msg };
  }
}

export async function updateProduct(id: string | number, input: z.input<typeof productSchema>) {
  try {
    const user = await getAuthenticatedUser();
    const validated = productSchema.parse(input);

    const res = await api.updateProduct(id, {
      nameEn: validated.nameEn,
      nameKm: validated.nameKm,
      slug: validated.slug || undefined,
      descriptionEn: validated.descriptionEn,
      descriptionKm: validated.descriptionKm,
      price: validated.price,
      compareAtPrice: validated.compareAtPrice,
      categoryId: validated.categoryId,
      badges: validated.badges,
      availability: validated.availability,
      channelTags: validated.channelTags,
      isFeatured: validated.isFeatured,
      status: validated.status,
      images: validated.images,
    });

    if (!res.success) {
      return { success: false, error: res.error || "Failed to update product" };
    }

    await logActivity({
      userId: user.id,
      action: "updated product",
      entity: "Product",
      entityId: String(id),
      details: `Updated product "${validated.nameEn}"`,
    });

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}`);
    revalidatePath("/admin");
    revalidatePath("/", "layout");

    return { success: true, data: res.data };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update product";
    return { success: false, error: msg };
  }
}

export async function deleteProduct(id: string | number, hardDelete = false) {
  try {
    const user = await getAuthenticatedUser();

    const res = await api.deleteProduct(id, hardDelete);
    if (!res.success) {
      return { success: false, error: res.error || "Failed to delete product" };
    }

    await logActivity({
      userId: user.id,
      action: hardDelete ? "permanently deleted product" : "trashed product",
      entity: "Product",
      entityId: String(id),
      details: `Deleted product ID ${id}`,
    });

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to delete product";
    return { success: false, error: msg };
  }
}

export async function reorderProducts(orderedIds: Array<string | number>) {
  try {
    const user = await getAuthenticatedUser();

    const items = orderedIds.map((id, index) => ({
      id,
      sortOrder: index,
    }));

    const res = await api.reorderProducts(items);
    if (!res.success) {
      return { success: false, error: res.error || "Failed to reorder products" };
    }

    await logActivity({
      userId: user.id,
      action: "reordered products",
      entity: "Product",
      details: `Reordered ${orderedIds.length} products`,
    });

    revalidatePath("/admin/products");
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to reorder products";
    return { success: false, error: msg };
  }
}
