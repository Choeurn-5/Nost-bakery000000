"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, logActivity } from "@/lib/auth-check";
import { StoryLayout } from "@prisma/client";

const storySchema = z.object({
  headingEn: z.string().min(1, "English heading is required"),
  headingKm: z.string().default(""),
  textEn: z.string().default(""),
  textKm: z.string().default(""),
  image: z.string().nullable().optional(),
  imageAltEn: z.string().default(""),
  imageAltKm: z.string().default(""),
  layout: z.nativeEnum(StoryLayout).default(StoryLayout.IMAGE_LEFT),
  sortOrder: z.number().int().default(0),
  isVisible: z.boolean().default(true),
});

export async function createStoryBlock(input: z.infer<typeof storySchema>) {
  try {
    const user = await getAuthenticatedUser();
    const validated = storySchema.parse(input);

    const count = await prisma.storyBlock.count();

    const block = await prisma.storyBlock.create({
      data: {
        ...validated,
        sortOrder: validated.sortOrder || count,
      },
    });

    await logActivity({
      userId: user.id,
      action: "created story block",
      entity: "StoryBlock",
      entityId: block.id,
      details: `Created story block "${block.headingEn}"`,
    });

    revalidatePath("/admin/bakery-stories");
    revalidatePath("/", "layout");

    return { success: true, data: block };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to create story block";
    return { success: false, error: msg };
  }
}

export async function updateStoryBlock(id: string, input: z.infer<typeof storySchema>) {
  try {
    const user = await getAuthenticatedUser();
    const validated = storySchema.parse(input);

    const block = await prisma.storyBlock.update({
      where: { id },
      data: validated,
    });

    await logActivity({
      userId: user.id,
      action: "updated story block",
      entity: "StoryBlock",
      entityId: block.id,
      details: `Updated story block "${block.headingEn}"`,
    });

    revalidatePath("/admin/bakery-stories");
    revalidatePath("/", "layout");

    return { success: true, data: block };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update story block";
    return { success: false, error: msg };
  }
}

export async function deleteStoryBlock(id: string) {
  try {
    const user = await getAuthenticatedUser();
    const block = await prisma.storyBlock.delete({ where: { id } });

    await logActivity({
      userId: user.id,
      action: "deleted story block",
      entity: "StoryBlock",
      entityId: id,
      details: `Deleted story block "${block.headingEn}"`,
    });

    revalidatePath("/admin/bakery-stories");
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to delete story block";
    return { success: false, error: msg };
  }
}

export async function reorderStoryBlocks(orderedIds: string[]) {
  try {
    const user = await getAuthenticatedUser();

    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.storyBlock.update({
          where: { id },
          data: { sortOrder: index },
        })
      )
    );

    await logActivity({
      userId: user.id,
      action: "reordered story blocks",
      entity: "StoryBlock",
      details: `Reordered ${orderedIds.length} story blocks`,
    });

    revalidatePath("/admin/bakery-stories");
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to reorder story blocks";
    return { success: false, error: msg };
  }
}
