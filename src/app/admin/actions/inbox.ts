"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import { getAuthenticatedUser, logActivity } from "@/lib/auth-check";
import { SubmissionStatus } from "@prisma/client";

export async function updateSubmissionStatus(id: string | number, status: SubmissionStatus | string) {
  try {
    const user = await getAuthenticatedUser();

    const res = await api.updateInboxItem(id, { status });
    if (!res.success) {
      return { success: false, error: res.error || "Failed to update status" };
    }

    await logActivity({
      userId: user.id,
      action: "updated submission status",
      entity: "FormSubmission",
      entityId: String(id),
      details: `Status changed to ${status}`,
    });

    revalidatePath("/admin/inbox");
    revalidatePath("/admin");

    return { success: true, data: res.data };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update status";
    return { success: false, error: msg };
  }
}

export async function updateSubmissionNotes(id: string | number, notes: string) {
  try {
    const user = await getAuthenticatedUser();

    const res = await api.updateInboxItem(id, { notes });
    if (!res.success) {
      return { success: false, error: res.error || "Failed to save notes" };
    }

    await logActivity({
      userId: user.id,
      action: "updated submission notes",
      entity: "FormSubmission",
      entityId: String(id),
      details: `Notes updated`,
    });

    revalidatePath("/admin/inbox");

    return { success: true, data: res.data };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to save notes";
    return { success: false, error: msg };
  }
}

export async function deleteSubmission(id: string | number) {
  try {
    const user = await getAuthenticatedUser();

    const res = await api.deleteInboxItem(id);
    if (!res.success) {
      return { success: false, error: res.error || "Failed to delete submission" };
    }

    await logActivity({
      userId: user.id,
      action: "deleted submission",
      entity: "FormSubmission",
      entityId: String(id),
      details: `Deleted submission ID ${id}`,
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

    const res = await api.getAdminInbox();
    const submissions: any[] = res.data ?? [];

    const headers = ["ID", "Name", "Phone", "Email", "Type", "Status", "Message", "Notes", "Created At"];
    const rows = submissions.map((s) => [
      s.id,
      `"${(s.name || "").replace(/"/g, '""')}"`,
      `"${s.phone || ""}"`,
      `"${s.email || ""}"`,
      s.type || s.formType || "CONTACT",
      s.status || "NEW",
      `"${(s.message || "").replace(/"/g, '""')}"`,
      `"${(s.notes || "").replace(/"/g, '""')}"`,
      s.createdAt ? new Date(s.createdAt).toISOString() : "",
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    return { success: true, csv: csvContent };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to export CSV";
    return { success: false, error: msg };
  }
}
