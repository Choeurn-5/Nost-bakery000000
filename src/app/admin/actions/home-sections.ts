"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, logActivity } from "@/lib/auth-check";

const homeSectionSchema = z.object({
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

export async function updateHomeSection(id: string, input: z.infer<typeof homeSectionSchema>) {
  try {
    const user = await getAuthenticatedUser();
    const validated = homeSectionSchema.parse(input);

    const section = await prisma.homeSection.update({
      where: { id },
      data: validated,
    });

    await logActivity({
      userId: user.id,
      action: "updated home section",
      entity: "HomeSection",
      entityId: id,
      details: `Updated section "${section.sectionKey}"`,
    });

    revalidatePath("/admin/home-sections");
    revalidatePath("/", "layout");

    return { success: true, data: section };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update home section";
    return { success: false, error: msg };
  }
}

export async function reorderHomeSections(orderedIds: string[]) {
  try {
    const user = await getAuthenticatedUser();

    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.homeSection.update({
          where: { id },
          data: { sortOrder: index },
        })
      )
    );

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
