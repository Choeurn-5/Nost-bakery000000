"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import { getAuthenticatedUser, logActivity } from "@/lib/auth-check";

const testimonialSchema = z.object({
  name: z.string().min(1, "Customer name is required"),
  textEn: z.string().min(1, "English testimonial text is required"),
  textKm: z.string().default(""),
  rating: z.number().int().min(1).max(5).default(5),
  photo: z.string().nullable().optional(),
  isVisible: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export async function createTestimonial(input: z.infer<typeof testimonialSchema>) {
  try {
    const user = await getAuthenticatedUser();
    const validated = testimonialSchema.parse(input);

    const res = await api.saveTestimonial(validated);
    if (!res.success) {
      return { success: false, error: res.error || "Failed to create testimonial" };
    }

    const testimonial = res.data;

    await logActivity({
      userId: user.id,
      action: "created testimonial",
      entity: "Testimonial",
      entityId: String(testimonial?.id || ""),
      details: `Added testimonial from "${validated.name}" (${validated.rating} stars)`,
    });

    revalidatePath("/admin/testimonials");
    revalidatePath("/", "layout");

    return { success: true, data: testimonial };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to create testimonial";
    return { success: false, error: msg };
  }
}

export async function updateTestimonial(id: string, input: z.infer<typeof testimonialSchema>) {
  try {
    const user = await getAuthenticatedUser();
    const validated = testimonialSchema.parse(input);

    const res = await api.saveTestimonial(validated, id);
    if (!res.success) {
      return { success: false, error: res.error || "Failed to update testimonial" };
    }

    const testimonial = res.data;

    await logActivity({
      userId: user.id,
      action: "updated testimonial",
      entity: "Testimonial",
      entityId: String(id),
      details: `Updated testimonial from "${validated.name}"`,
    });

    revalidatePath("/admin/testimonials");
    revalidatePath("/", "layout");

    return { success: true, data: testimonial };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update testimonial";
    return { success: false, error: msg };
  }
}

export async function deleteTestimonial(id: string) {
  try {
    const user = await getAuthenticatedUser();
    const res = await api.deleteTestimonial(id);
    if (!res.success) {
      return { success: false, error: res.error || "Failed to delete testimonial" };
    }

    await logActivity({
      userId: user.id,
      action: "deleted testimonial",
      entity: "Testimonial",
      entityId: id,
      details: `Deleted testimonial ID "${id}"`,
    });

    revalidatePath("/admin/testimonials");
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to delete testimonial";
    return { success: false, error: msg };
  }
}

export async function reorderTestimonials(orderedIds: string[]) {
  try {
    const user = await getAuthenticatedUser();

    const res = await api.reorderTestimonials(
      orderedIds.map((id, index) => ({ id, sortOrder: index }))
    );
    if (!res.success) {
      return { success: false, error: res.error || "Failed to reorder testimonials" };
    }

    await logActivity({
      userId: user.id,
      action: "reordered testimonials",
      entity: "Testimonial",
      details: `Reordered ${orderedIds.length} testimonials`,
    });

    revalidatePath("/admin/testimonials");
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to reorder testimonials";
    return { success: false, error: msg };
  }
}
