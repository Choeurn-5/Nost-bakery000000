"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
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

    const res = await api.saveLocation(validated);
    if (!res.success) {
      return { success: false, error: res.error || "Failed to create location" };
    }

    const location = res.data;

    await logActivity({
      userId: user.id,
      action: "created location",
      entity: "Location",
      entityId: String(location?.id || ""),
      details: `Created branch "${validated.nameEn}"`,
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

    const res = await api.saveLocation(validated, id);
    if (!res.success) {
      return { success: false, error: res.error || "Failed to update location" };
    }

    const location = res.data;

    await logActivity({
      userId: user.id,
      action: "updated location",
      entity: "Location",
      entityId: String(id),
      details: `Updated branch "${validated.nameEn}"`,
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
    const res = await api.deleteLocation(id);
    if (!res.success) {
      return { success: false, error: res.error || "Failed to delete location" };
    }

    await logActivity({
      userId: user.id,
      action: "deleted location",
      entity: "Location",
      entityId: id,
      details: `Deleted branch ID "${id}"`,
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

    const res = await api.reorderLocations(
      orderedIds.map((id, index) => ({ id, sortOrder: index }))
    );
    if (!res.success) {
      return { success: false, error: res.error || "Failed to reorder locations" };
    }

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
