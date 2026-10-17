"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, logActivity } from "@/lib/auth-check";
import slugify from "slugify";

const categorySchema = z.object({
  id: z.string().optional(),
  nameEn: z.string().min(1, "English name is required"),
  nameKm: z.string().default(""),
  slug: z.string().optional(),
  image: z.string().nullable().optional(),
  imageAltEn: z.string().default(""),
  imageAltKm: z.string().default(""),
  isVisible: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export async function createCategory(input: z.infer<typeof categorySchema>) {
  try {
    const user = await getAuthenticatedUser();
    const validated = categorySchema.parse(input);

    const slug = validated.slug && validated.slug.trim()
      ? slugify(validated.slug, { lower: true, strict: true })
      : slugify(validated.nameEn, { lower: true, strict: true });

    // Check slug uniqueness
    const existing = await prisma.category.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const count = await prisma.category.count();

    const category = await prisma.category.create({
      data: {
        nameEn: validated.nameEn,
        nameKm: validated.nameKm,
        slug: finalSlug,
        image: validated.image || null,
        imageAltEn: validated.imageAltEn,
        imageAltKm: validated.imageAltKm,
        isVisible: validated.isVisible,
        sortOrder: validated.sortOrder || count,
      },
    });

    await logActivity({
      userId: user.id,
      action: "created category",
      entity: "Category",
      entityId: category.id,
      details: `Created category "${category.nameEn}" (${category.slug})`,
    });

    revalidatePath("/admin/categories");
    revalidatePath("/", "layout");

    return { success: true, data: category };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to create category";
    return { success: false, error: msg };
  }
}

export async function updateCategory(id: string, input: z.infer<typeof categorySchema>) {
  try {
    const user = await getAuthenticatedUser();
    const validated = categorySchema.parse(input);

    const slug = validated.slug && validated.slug.trim()
      ? slugify(validated.slug, { lower: true, strict: true })
      : slugify(validated.nameEn, { lower: true, strict: true });

    const category = await prisma.category.update({
      where: { id },
      data: {
        nameEn: validated.nameEn,
        nameKm: validated.nameKm,
        slug,
        image: validated.image || null,
        imageAltEn: validated.imageAltEn,
        imageAltKm: validated.imageAltKm,
        isVisible: validated.isVisible,
        sortOrder: validated.sortOrder,
      },
    });

    await logActivity({
      userId: user.id,
      action: "updated category",
      entity: "Category",
      entityId: category.id,
      details: `Updated category "${category.nameEn}"`,
    });

    revalidatePath("/admin/categories");
    revalidatePath("/", "layout");

    return { success: true, data: category };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update category";
    return { success: false, error: msg };
  }
}

export async function deleteCategory(id: string) {
  try {
    const user = await getAuthenticatedUser();

    // Check if category has products
    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      return {
        success: false,
        error: `Cannot delete category with ${productCount} active product(s). Please reassign or delete them first.`,
      };
    }

    const category = await prisma.category.delete({ where: { id } });

    await logActivity({
      userId: user.id,
      action: "deleted category",
      entity: "Category",
      entityId: id,
      details: `Deleted category "${category.nameEn}"`,
    });

    revalidatePath("/admin/categories");
    revalidatePath("/", "layout");

    return { success: true, data: category };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to delete category";
    return { success: false, error: msg };
  }
}

export async function reorderCategories(orderedIds: string[]) {
  try {
    const user = await getAuthenticatedUser();

    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.category.update({
          where: { id },
          data: { sortOrder: index },
        })
      )
    );

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
