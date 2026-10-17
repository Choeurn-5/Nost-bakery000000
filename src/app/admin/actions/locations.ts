"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, logActivity } from "@/lib/auth-check";

const locationSchema = z.object({
  nameEn: z.string().min(1, "English branch name is required"),
  nameKm: z.string().default(""),
  addressEn: z.string().min(1, "English address is required"),
  addressKm: z.string().default(""),
  hoursEn: z.string().default(""),
  hoursKm: z.string().default(""),
  image: z.string().nullable().optional(),
  imageAltEn: z.string().default(""),
  imageAltKm: z.string().default(""),
  mapEmbedUrl: z.string().nullable().optional(),
  directionsLink: z.string().nullable().optional(),
  services: z.array(z.string()).default(["Dine-in", "Takeaway"]),
  sortOrder: z.number().int().default(0),
  isVisible: z.boolean().default(true),
});

export async function createLocation(input: z.infer<typeof locationSchema>) {
  try {
    const user = await getAuthenticatedUser();
    const validated = locationSchema.parse(input);

    const count = await prisma.location.count();

    const location = await prisma.location.create({
      data: {
        ...validated,
        sortOrder: validated.sortOrder || count,
      },
    });

    await logActivity({
      userId: user.id,
      action: "created location",
      entity: "Location",
      entityId: location.id,
      details: `Created branch "${location.nameEn}"`,
    });

    revalidatePath("/admin/locations");
    revalidatePath("/", "layout");

    return { success: true, data: location };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to create location";
    return { success: false, error: msg };
  }
}

export async function updateLocation(id: string, input: z.infer<typeof locationSchema>) {
  try {
    const user = await getAuthenticatedUser();
    const validated = locationSchema.parse(input);

    const location = await prisma.location.update({
      where: { id },
      data: validated,
    });

    await logActivity({
      userId: user.id,
      action: "updated location",
      entity: "Location",
      entityId: location.id,
      details: `Updated branch "${location.nameEn}"`,
    });

    revalidatePath("/admin/locations");
    revalidatePath("/", "layout");

    return { success: true, data: location };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update location";
    return { success: false, error: msg };
  }
}

export async function deleteLocation(id: string) {
  try {
    const user = await getAuthenticatedUser();
    const location = await prisma.location.delete({ where: { id } });

    await logActivity({
      userId: user.id,
      action: "deleted location",
      entity: "Location",
      entityId: id,
      details: `Deleted branch "${location.nameEn}"`,
    });

    revalidatePath("/admin/locations");
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to delete location";
    return { success: false, error: msg };
  }
}

export async function reorderLocations(orderedIds: string[]) {
  try {
    const user = await getAuthenticatedUser();

    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.location.update({
          where: { id },
          data: { sortOrder: index },
        })
      )
    );

    await logActivity({
      userId: user.id,
      action: "reordered locations",
      entity: "Location",
      details: `Reordered ${orderedIds.length} branches`,
    });

    revalidatePath("/admin/locations");
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to reorder locations";
    return { success: false, error: msg };
  }
}
