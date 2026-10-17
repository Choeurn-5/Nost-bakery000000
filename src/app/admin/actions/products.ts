"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, logActivity } from "@/lib/auth-check";
import slugify from "slugify";
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
  categoryId: z.string().min(1, "Please select a category"),
  badges: z.array(z.nativeEnum(ProductBadge)).default([]),
  availability: z.nativeEnum(Availability).default(Availability.AVAILABLE),
  channelTags: z.array(z.nativeEnum(ChannelTag)).default([ChannelTag.RETAIL]),
  isFeatured: z.boolean().default(false),
  status: z.nativeEnum(ContentStatus).default(ContentStatus.DRAFT),
  images: z.array(productImageSchema).default([]),
});

export async function createProduct(input: z.infer<typeof productSchema>) {
  try {
    const user = await getAuthenticatedUser();
    const validated = productSchema.parse(input);

    const baseSlug = validated.slug && validated.slug.trim()
      ? slugify(validated.slug, { lower: true, strict: true })
      : slugify(validated.nameEn, { lower: true, strict: true });

    const existingSlug = await prisma.product.findUnique({ where: { slug: baseSlug } });
    const slug = existingSlug ? `${baseSlug}-${Date.now()}` : baseSlug;

    const count = await prisma.product.count({ where: { categoryId: validated.categoryId } });

    const product = await prisma.product.create({
      data: {
        nameEn: validated.nameEn,
        nameKm: validated.nameKm,
        slug,
        descriptionEn: validated.descriptionEn,
        descriptionKm: validated.descriptionKm,
        price: validated.price ?? null,
        categoryId: validated.categoryId,
        badges: validated.badges,
        availability: validated.availability,
        channelTags: validated.channelTags,
        isFeatured: validated.isFeatured,
        sortOrder: count,
        status: validated.status,
        publishedAt: validated.status === ContentStatus.PUBLISHED ? new Date() : null,
        images: {
          create: validated.images.map((img, idx) => ({
            url: img.url,
            altEn: img.altEn || validated.nameEn,
            altKm: img.altKm || validated.nameKm,
            sortOrder: idx,
          })),
        },
      },
      include: { images: true, category: true },
    });

    await logActivity({
      userId: user.id,
      action: "created product",
      entity: "Product",
      entityId: product.id,
      details: `Created product "${product.nameEn}" (${product.slug}) in "${product.category.nameEn}"`,
    });

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/", "layout");

    return { success: true, data: product };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to create product";
    return { success: false, error: msg };
  }
}

export async function updateProduct(id: string, input: z.infer<typeof productSchema>) {
  try {
    const user = await getAuthenticatedUser();
    const validated = productSchema.parse(input);

    const baseSlug = validated.slug && validated.slug.trim()
      ? slugify(validated.slug, { lower: true, strict: true })
      : slugify(validated.nameEn, { lower: true, strict: true });

    // Check slug collision
    const existingSlug = await prisma.product.findFirst({
      where: { slug: baseSlug, NOT: { id } },
    });
    const slug = existingSlug ? `${baseSlug}-${Date.now()}` : baseSlug;

    // Delete old images and recreate with clean order
    await prisma.productImage.deleteMany({ where: { productId: id } });

    const product = await prisma.product.update({
      where: { id },
      data: {
        nameEn: validated.nameEn,
        nameKm: validated.nameKm,
        slug,
        descriptionEn: validated.descriptionEn,
        descriptionKm: validated.descriptionKm,
        price: validated.price ?? null,
        categoryId: validated.categoryId,
        badges: validated.badges,
        availability: validated.availability,
        channelTags: validated.channelTags,
        isFeatured: validated.isFeatured,
        status: validated.status,
        publishedAt:
          validated.status === ContentStatus.PUBLISHED ? new Date() : undefined,
        images: {
          create: validated.images.map((img, idx) => ({
            url: img.url,
            altEn: img.altEn || validated.nameEn,
            altKm: img.altKm || validated.nameKm,
            sortOrder: idx,
          })),
        },
      },
      include: { images: true, category: true },
    });

    await logActivity({
      userId: user.id,
      action: "updated product",
      entity: "Product",
      entityId: product.id,
      details: `Updated product "${product.nameEn}"`,
    });

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}`);
    revalidatePath("/admin");
    revalidatePath("/", "layout");

    return { success: true, data: product };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update product";
    return { success: false, error: msg };
  }
}

export async function deleteProduct(id: string, hardDelete = false) {
  try {
    const user = await getAuthenticatedUser();

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Product not found" };
    }

    if (hardDelete || existing.status === ContentStatus.TRASHED) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      await prisma.promotionProduct.deleteMany({ where: { productId: id } });
      await prisma.product.delete({ where: { id } });

      await logActivity({
        userId: user.id,
        action: "permanently deleted product",
        entity: "Product",
        entityId: id,
        details: `Deleted product "${existing.nameEn}"`,
      });
    } else {
      await prisma.product.update({
        where: { id },
        data: { status: ContentStatus.TRASHED },
      });

      await logActivity({
        userId: user.id,
        action: "trashed product",
        entity: "Product",
        entityId: id,
        details: `Moved product "${existing.nameEn}" to trash`,
      });
    }

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to delete product";
    return { success: false, error: msg };
  }
}

export async function reorderProducts(orderedIds: string[]) {
  try {
    const user = await getAuthenticatedUser();

    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.product.update({
          where: { id },
          data: { sortOrder: index },
        })
      )
    );

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
