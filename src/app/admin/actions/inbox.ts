"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, logActivity } from "@/lib/auth-check";
import { SubmissionStatus } from "@prisma/client";

export async function updateSubmissionStatus(id: string, status: SubmissionStatus) {
  try {
    const user = await getAuthenticatedUser();

    const submission = await prisma.formSubmission.update({
      where: { id },
      data: { status },
    });

    await logActivity({
      userId: user.id,
      action: "updated submission status",
      entity: "FormSubmission",
      entityId: id,
      details: `Status changed to ${status} for ${submission.name}`,
    });

    revalidatePath("/admin/inbox");
    revalidatePath("/admin");

    return { success: true, data: submission };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update status";
    return { success: false, error: msg };
  }
}

export async function updateSubmissionNotes(id: string, notes: string) {
  try {
    const user = await getAuthenticatedUser();

    const submission = await prisma.formSubmission.update({
      where: { id },
      data: { notes },
    });

    await logActivity({
      userId: user.id,
      action: "updated submission notes",
      entity: "FormSubmission",
      entityId: id,
      details: `Notes updated for ${submission.name}`,
    });

    revalidatePath("/admin/inbox");

    return { success: true, data: submission };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to save notes";
    return { success: false, error: msg };
  }
}

export async function deleteSubmission(id: string) {
  try {
    const user = await getAuthenticatedUser();

    const submission = await prisma.formSubmission.delete({ where: { id } });

    await logActivity({
      userId: user.id,
      action: "deleted submission",
      entity: "FormSubmission",
      entityId: id,
      details: `Deleted submission from ${submission.name}`,
    });

    revalidatePath("/admin/inbox");
    revalidatePath("/admin");

    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to delete submission";
    return { success: false, error: msg };
  }
}

export async function exportCsvAction() {
  try {
    await getAuthenticatedUser();

    const submissions = await prisma.formSubmission.findMany({
      orderBy: { createdAt: "desc" },
    });

    const headers = ["ID", "Name", "Phone", "Email", "Type", "Status", "Message", "Notes", "Created At"];
    const rows = submissions.map((s) => [
      s.id,
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.phone}"`,
      `"${s.email || ""}"`,
      s.type,
      s.status,
      `"${s.message.replace(/"/g, '""')}"`,
      `"${s.notes.replace(/"/g, '""')}"`,
      s.createdAt.toISOString(),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    return { success: true, csv: csvContent };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to export CSV";
    return { success: false, error: msg };
  }
}
