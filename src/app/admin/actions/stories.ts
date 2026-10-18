"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import { getAuthenticatedUser, logActivity } from "@/lib/auth-check";

const storySchema = z.object({
  headingEn: z.string().min(1, "English heading is required"),
  headingKm: z.string().default(""),
  textEn: z.string().default(""),
  textKm: z.string().default(""),
  image: z.string().nullable().optional(),
  imageAltEn: z.string().default(""),
  imageAltKm: z.string().default(""),
  layout: z.enum(["IMAGE_LEFT", "IMAGE_RIGHT", "FULL_WIDTH"]).default("IMAGE_LEFT"),
  sortOrder: z.number().int().default(0),
  isVisible: z.boolean().default(true),
});

export async function createStoryBlock(input: z.infer<typeof storySchema>) {
  try {
    const user = await getAuthenticatedUser();
    const validated = storySchema.parse(input);

    const res = await api.saveStory(validated);
    if (!res.success) {
      return { success: false, error: res.error || "Failed to create story block" };
    }

    const block = res.data;

    await logActivity({
      userId: user.id,
      action: "created story block",
      entity: "StoryBlock",
      entityId: String(block?.id || ""),
      details: `Created story block "${validated.headingEn}"`,
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

    const res = await api.saveStory(validated, id);
    if (!res.success) {
      return { success: false, error: res.error || "Failed to update story block" };
    }

    const block = res.data;

    await logActivity({
      userId: user.id,
      action: "updated story block",
      entity: "StoryBlock",
      entityId: String(id),
      details: `Updated story block "${validated.headingEn}"`,
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
    const res = await api.deleteStory(id);
    if (!res.success) {
      return { success: false, error: res.error || "Failed to delete story block" };
    }

    await logActivity({
      userId: user.id,
      action: "deleted story block",
      entity: "StoryBlock",
      entityId: id,
      details: `Deleted story block ID "${id}"`,
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

    const res = await api.reorderStories(
      orderedIds.map((id, index) => ({ id, sortOrder: index }))
    );
    if (!res.success) {
      return { success: false, error: res.error || "Failed to reorder story blocks" };
    }

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
