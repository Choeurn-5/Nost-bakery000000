"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, logActivity } from "@/lib/auth-check";

const testimonialSchema = z.object({
  name: z.string().min(1, "Customer name is required"),
  textEn: z.string().min(1, "English testimonial text is required"),
  textKm: z.string().default(""),
  rating: z.number().int().min(1).max(5).default(5),
  photo: z.string().nullable().optional(),
  isVisible: z.boolean().default(false), // hidden by default as requested
  sortOrder: z.number().int().default(0),
});

export async function createTestimonial(input: z.infer<typeof testimonialSchema>) {
  try {
    const user = await getAuthenticatedUser();
    const validated = testimonialSchema.parse(input);

    const count = await prisma.testimonial.count();

    const testimonial = await prisma.testimonial.create({
      data: {
        ...validated,
        sortOrder: validated.sortOrder || count,
      },
    });

    await logActivity({
      userId: user.id,
      action: "created testimonial",
      entity: "Testimonial",
      entityId: testimonial.id,
      details: `Added testimonial from "${testimonial.name}" (${testimonial.rating} stars)`,
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

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: validated,
    });

    await logActivity({
      userId: user.id,
      action: "updated testimonial",
      entity: "Testimonial",
      entityId: testimonial.id,
      details: `Updated testimonial from "${testimonial.name}"`,
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
    const testimonial = await prisma.testimonial.delete({ where: { id } });

    await logActivity({
      userId: user.id,
      action: "deleted testimonial",
      entity: "Testimonial",
      entityId: id,
      details: `Deleted testimonial from "${testimonial.name}"`,
    });

    revalidatePath("/admin/testimonials");
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to delete testimonial";
    return { success: false, error: msg };
  }
}
