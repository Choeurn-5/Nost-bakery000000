"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
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

    const res = await api.saveWholesaleSettings(validated);
    if (!res.success) {
      return { success: false, error: res.error || "Failed to update wholesale settings" };
    }

    await logActivity({
      userId: user.id,
      action: "updated wholesale settings",
      entity: "WholesaleSettings",
      entityId: "wholesale-settings",
      details: "Updated wholesale hero content and delivery terms",
    });

    revalidatePath("/admin/wholesale");
    revalidatePath("/", "layout");

    return { success: true, data: res.data };
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

    const res = await api.saveWholesaleStep(validated);
    if (!res.success) {
      return { success: false, error: res.error || "Failed to create wholesale step" };
    }

    const step = res.data;

    await logActivity({
      userId: user.id,
      action: "created wholesale step",
      entity: "WholesaleStep",
      entityId: String(step?.id || ""),
      details: `Created step "${validated.titleEn}"`,
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

    const res = await api.saveWholesaleStep(validated, id);
    if (!res.success) {
      return { success: false, error: res.error || "Failed to update wholesale step" };
    }

    const step = res.data;

    await logActivity({
      userId: user.id,
      action: "updated wholesale step",
      entity: "WholesaleStep",
      entityId: String(id),
      details: `Updated step "${validated.titleEn}"`,
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
    const res = await api.deleteWholesaleStep(id);
    if (!res.success) {
      return { success: false, error: res.error || "Failed to delete wholesale step" };
    }

    await logActivity({
      userId: user.id,
      action: "deleted wholesale step",
      entity: "WholesaleStep",
      entityId: id,
      details: `Deleted wholesale step ID "${id}"`,
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

    const res = await api.reorderWholesaleSteps(
      orderedIds.map((id, index) => ({ id, sortOrder: index }))
    );
    if (!res.success) {
      return { success: false, error: res.error || "Failed to reorder steps" };
    }

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

    const res = await api.saveFaq(validated);
    if (!res.success) {
      return { success: false, error: res.error || "Failed to create FAQ item" };
    }

    const faq = res.data;

    await logActivity({
      userId: user.id,
      action: "created faq item",
      entity: "FaqItem",
      entityId: String(faq?.id || ""),
      details: `Created FAQ "${validated.questionEn}"`,
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

    const res = await api.saveFaq(validated, id);
    if (!res.success) {
      return { success: false, error: res.error || "Failed to update FAQ item" };
    }

    const faq = res.data;

    await logActivity({
      userId: user.id,
      action: "updated faq item",
      entity: "FaqItem",
      entityId: String(id),
      details: `Updated FAQ "${validated.questionEn}"`,
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
    const res = await api.deleteFaq(id);
    if (!res.success) {
      return { success: false, error: res.error || "Failed to delete FAQ item" };
    }

    await logActivity({
      userId: user.id,
      action: "deleted faq item",
      entity: "FaqItem",
      entityId: id,
      details: `Deleted FAQ ID "${id}"`,
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

    const res = await api.reorderFaqs(
      orderedIds.map((id, index) => ({ id, sortOrder: index }))
    );
    if (!res.success) {
      return { success: false, error: res.error || "Failed to reorder FAQs" };
    }

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
