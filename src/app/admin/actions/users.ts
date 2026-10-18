"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import { requireOwner, logActivity } from "@/lib/auth-check";

const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["OWNER", "EDITOR", "ADMIN"]).default("EDITOR"),
});

export async function createUser(input: z.infer<typeof createUserSchema>) {
  try {
    const currentOwner = await requireOwner();
    const validated = createUserSchema.parse(input);

    const email = validated.email.toLowerCase().trim();

    const res = await api.saveAdminUser({
      name: validated.name,
      email,
      password: validated.password,
      role: validated.role,
      active: true,
    });
    if (!res.success) {
      return { success: false, error: res.error || "Failed to create user" };
    }

    const newUser = res.data;

    await logActivity({
      userId: currentOwner.id,
      action: "created user",
      entity: "User",
      entityId: String(newUser?.id || ""),
      details: `Created user "${validated.name}" (${email}) with role ${validated.role}`,
    });

    revalidatePath("/admin/users");
    return { success: true, data: newUser };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to create user";
    return { success: false, error: msg };
  }
}

export async function updateUserRole(userId: string, newRole: string) {
  try {
    const currentOwner = await requireOwner();

    if (String(userId) === String(currentOwner.id)) {
      return { success: false, error: "You cannot change your own role." };
    }

    const res = await api.saveAdminUser({ role: newRole }, userId);
    if (!res.success) {
      return { success: false, error: res.error || "Failed to update user role" };
    }

    await logActivity({
      userId: currentOwner.id,
      action: "changed user role",
      entity: "User",
      entityId: String(userId),
      details: `Changed role for user ID "${userId}" to ${newRole}`,
    });

    revalidatePath("/admin/users");
    return { success: true, data: res.data };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update user role";
    return { success: false, error: msg };
  }
}

export async function toggleUserActive(userId: string, currentActiveStatus?: boolean) {
  try {
    const currentOwner = await requireOwner();

    if (String(userId) === String(currentOwner.id)) {
      return { success: false, error: "You cannot deactivate your own account." };
    }

    const newActiveState = currentActiveStatus !== undefined ? !currentActiveStatus : false;
    const res = await api.saveAdminUser({ active: newActiveState }, userId);
    if (!res.success) {
      return { success: false, error: res.error || "Failed to toggle user status" };
    }

    await logActivity({
      userId: currentOwner.id,
      action: newActiveState ? "activated user" : "deactivated user",
      entity: "User",
      entityId: String(userId),
      details: `${newActiveState ? "Activated" : "Deactivated"} account for user ID "${userId}"`,
    });

    revalidatePath("/admin/users");
    return { success: true, data: res.data };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to toggle user status";
    return { success: false, error: msg };
  }
}

export async function deleteUser(userId: string) {
  try {
    const currentOwner = await requireOwner();

    if (String(userId) === String(currentOwner.id)) {
      return { success: false, error: "You cannot delete your own account." };
    }

    const res = await api.deleteAdminUser(userId);
    if (!res.success) {
      return { success: false, error: res.error || "Failed to delete user" };
    }

    await logActivity({
      userId: currentOwner.id,
      action: "deleted user",
      entity: "User",
      entityId: String(userId),
      details: `Deleted user ID "${userId}"`,
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to delete user";
    return { success: false, error: msg };
  }
}
