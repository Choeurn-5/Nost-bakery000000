"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import { getAuthenticatedUser, logActivity } from "@/lib/auth-check";

const homeSectionSchema = z.object({
  sectionKey: z.string().optional(),
  headlineEn: z.string().default(""),
  headlineKm: z.string().default(""),
  subHeadlineEn: z.string().default(""),
  subHeadlineKm: z.string().default(""),
  bodyEn: z.string().default(""),
  bodyKm: z.string().default(""),
  buttonLabelEn: z.string().default(""),
  buttonLabelKm: z.string().default(""),
  buttonLink: z.string().default(""),
  button2LabelEn: z.string().default(""),
  button2LabelKm: z.string().default(""),
  button2Link: z.string().default(""),
  image: z.string().nullable().optional(),
  videoUrl: z.string().nullable().optional(),
  isVisible: z.boolean().default(true),
});

export async function updateHomeSection(id: string | number, input: z.input<typeof homeSectionSchema>) {
  try {
    const user = await getAuthenticatedUser();
    const validated = homeSectionSchema.parse(input);

    const res = await api.saveHomeSection({
      id,
      sectionKey: validated.sectionKey || String(id),
      ...validated,
    });

    if (!res.success) {
      return { success: false, error: res.error || "Failed to update home section" };
    }

    await logActivity({
      userId: user.id,
      action: "updated home section",
      entity: "HomeSection",
      entityId: String(id),
      details: `Updated section "${res.data?.sectionKey || id}"`,
    });

    revalidatePath("/admin/home-sections");
    revalidatePath("/", "layout");

    return { success: true, data: res.data };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update home section";
    return { success: false, error: msg };
  }
}

export async function reorderHomeSections(orderedIds: Array<string | number>) {
  try {
    const user = await getAuthenticatedUser();

    const items = orderedIds.map((id, index) => ({
      id,
      sortOrder: index,
    }));

    const res = await api.reorderHomeSections(items);
    if (!res.success) {
      return { success: false, error: res.error || "Failed to reorder home sections" };
    }

    await logActivity({
      userId: user.id,
      action: "reordered home sections",
      entity: "HomeSection",
      details: `Reordered ${orderedIds.length} home sections`,
    });

    revalidatePath("/admin/home-sections");
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to reorder home sections";
    return { success: false, error: msg };
  }
}
