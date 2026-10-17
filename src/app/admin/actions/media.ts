"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, logActivity } from "@/lib/auth-check";

const mediaSchema = z.object({
  url: z.string().min(1, "URL is required"),
  filename: z.string().min(1, "Filename is required"),
  altEn: z.string().default(""),
  altKm: z.string().default(""),
  mimeType: z.string().default("image/jpeg"),
  width: z.number().int().optional(),
  height: z.number().int().optional(),
  size: z.number().int().optional(),
});

export async function createMediaFile(input: z.infer<typeof mediaSchema>) {
  try {
    const user = await getAuthenticatedUser();
    const validated = mediaSchema.parse(input);

    const media = await prisma.mediaFile.create({
      data: validated,
    });

    await logActivity({
      userId: user.id,
      action: "uploaded media",
      entity: "MediaFile",
      entityId: media.id,
      details: `Added media "${media.filename}"`,
    });

    revalidatePath("/admin/media");
    return { success: true, data: media };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to record media";
    return { success: false, error: msg };
  }
}

export async function deleteMediaFile(id: string) {
  try {
    const user = await getAuthenticatedUser();
    const media = await prisma.mediaFile.delete({ where: { id } });

    await logActivity({
      userId: user.id,
      action: "deleted media",
      entity: "MediaFile",
      entityId: id,
      details: `Deleted media "${media.filename}"`,
    });

    revalidatePath("/admin/media");
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to delete media";
    return { success: false, error: msg };
  }
}
