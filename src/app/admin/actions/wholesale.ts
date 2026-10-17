"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, logActivity } from "@/lib/auth-check";

const wholesaleSettingsSchema = z.object({
  heroHeadlineEn: z.string().default("Bakery Supplies for Your Business"),
  heroHeadlineKm: z.string().default(""),
  heroSubHeadlineEn: z.string().default(""),
  heroSubHeadlineKm: z.string().default(""),
  heroImage: z.string().nullable().optional(),
  deliveryCoverageEn: z.string().default(""),
  deliveryCoverageKm: z.string().default(""),
  minimumOrderTextEn: z.string().default(""),
  minimumOrderTextKm: z.string().default(""),
});

export async function updateWholesaleSettings(input: z.infer<typeof wholesaleSettingsSchema>) {
  try {
    const user = await getAuthenticatedUser();
    const validated = wholesaleSettingsSchema.parse(input);

    const updated = await prisma.wholesaleSettings.upsert({
      where: { id: "default" },
      update: validated,
      create: {
        id: "default",
        ...validated,
      },
    });

    await logActivity({
      userId: user.id,
      action: "updated wholesale settings",
      entity: "WholesaleSettings",
      entityId: "default",
      details: "Updated wholesale hero content and delivery terms",
    });

    revalidatePath("/admin/wholesale");
    revalidatePath("/", "layout");

    return { success: true, data: updated };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update wholesale settings";
    return { success: false, error: msg };
  }
}

// ── Wholesale Steps CRUD ──

const stepSchema = z.object({
  titleEn: z.string().min(1, "English title is required"),
  titleKm: z.string().default(""),
  descriptionEn: z.string().default(""),
  descriptionKm: z.string().default(""),
  icon: z.string().default("package"),
  sortOrder: z.number().int().default(0),
});

export async function createWholesaleStep(input: z.infer<typeof stepSchema>) {
  try {
    const user = await getAuthenticatedUser();
    const validated = stepSchema.parse(input);

    const count = await prisma.wholesaleStep.count();

    const step = await prisma.wholesaleStep.create({
      data: {
        ...validated,
        sortOrder: validated.sortOrder || count,
      },
    });

    await logActivity({
      userId: user.id,
      action: "created wholesale step",
      entity: "WholesaleStep",
      entityId: step.id,
      details: `Created step "${step.titleEn}"`,
    });

    revalidatePath("/admin/wholesale");
    return { success: true, data: step };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to create wholesale step";
    return { success: false, error: msg };
  }
}

export async function updateWholesaleStep(id: string, input: z.infer<typeof stepSchema>) {
  try {
    const user = await getAuthenticatedUser();
    const validated = stepSchema.parse(input);

    const step = await prisma.wholesaleStep.update({
      where: { id },
      data: validated,
    });

    await logActivity({
      userId: user.id,
      action: "updated wholesale step",
      entity: "WholesaleStep",
      entityId: step.id,
      details: `Updated step "${step.titleEn}"`,
    });

    revalidatePath("/admin/wholesale");
    return { success: true, data: step };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update wholesale step";
    return { success: false, error: msg };
  }
}

export async function deleteWholesaleStep(id: string) {
  try {
    const user = await getAuthenticatedUser();
    const step = await prisma.wholesaleStep.delete({ where: { id } });

    await logActivity({
      userId: user.id,
      action: "deleted wholesale step",
      entity: "WholesaleStep",
      entityId: id,
      details: `Deleted step "${step.titleEn}"`,
    });

    revalidatePath("/admin/wholesale");
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to delete wholesale step";
    return { success: false, error: msg };
  }
}

export async function reorderWholesaleSteps(orderedIds: string[]) {
  try {
    const user = await getAuthenticatedUser();

    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.wholesaleStep.update({
          where: { id },
          data: { sortOrder: index },
        })
      )
    );

    await logActivity({
      userId: user.id,
      action: "reordered wholesale steps",
      entity: "WholesaleStep",
      details: `Reordered ${orderedIds.length} steps`,
    });

    revalidatePath("/admin/wholesale");
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to reorder steps";
    return { success: false, error: msg };
  }
}

// ── FAQ Items CRUD ──

const faqSchema = z.object({
  questionEn: z.string().min(1, "English question is required"),
  questionKm: z.string().default(""),
  answerEn: z.string().min(1, "English answer is required"),
  answerKm: z.string().default(""),
  section: z.string().default("wholesale"),
  sortOrder: z.number().int().default(0),
  isVisible: z.boolean().default(true),
});

export async function createFaqItem(input: z.infer<typeof faqSchema>) {
  try {
    const user = await getAuthenticatedUser();
    const validated = faqSchema.parse(input);

    const count = await prisma.faqItem.count({ where: { section: validated.section } });

    const faq = await prisma.faqItem.create({
      data: {
        ...validated,
        sortOrder: validated.sortOrder || count,
      },
    });

    await logActivity({
      userId: user.id,
      action: "created faq item",
      entity: "FaqItem",
      entityId: faq.id,
      details: `Created FAQ "${faq.questionEn}"`,
    });

    revalidatePath("/admin/wholesale");
    return { success: true, data: faq };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to create FAQ item";
    return { success: false, error: msg };
  }
}

export async function updateFaqItem(id: string, input: z.infer<typeof faqSchema>) {
  try {
    const user = await getAuthenticatedUser();
    const validated = faqSchema.parse(input);

    const faq = await prisma.faqItem.update({
      where: { id },
      data: validated,
    });

    await logActivity({
      userId: user.id,
      action: "updated faq item",
      entity: "FaqItem",
      entityId: faq.id,
      details: `Updated FAQ "${faq.questionEn}"`,
    });

    revalidatePath("/admin/wholesale");
    return { success: true, data: faq };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update FAQ item";
    return { success: false, error: msg };
  }
}

export async function deleteFaqItem(id: string) {
  try {
    const user = await getAuthenticatedUser();
    const faq = await prisma.faqItem.delete({ where: { id } });

    await logActivity({
      userId: user.id,
      action: "deleted faq item",
      entity: "FaqItem",
      entityId: id,
      details: `Deleted FAQ "${faq.questionEn}"`,
    });

    revalidatePath("/admin/wholesale");
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to delete FAQ item";
    return { success: false, error: msg };
  }
}

export async function reorderFaqItems(orderedIds: string[]) {
  try {
    const user = await getAuthenticatedUser();

    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.faqItem.update({
          where: { id },
          data: { sortOrder: index },
        })
      )
    );

    await logActivity({
      userId: user.id,
      action: "reordered faq items",
      entity: "FaqItem",
      details: `Reordered ${orderedIds.length} FAQ items`,
    });

    revalidatePath("/admin/wholesale");
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to reorder FAQs";
    return { success: false, error: msg };
  }
}
