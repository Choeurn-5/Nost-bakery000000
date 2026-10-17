"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireOwner, logActivity } from "@/lib/auth-check";
import { Role } from "@prisma/client";

const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.nativeEnum(Role).default(Role.EDITOR),
});

export async function createUser(input: z.infer<typeof createUserSchema>) {
  try {
    const currentOwner = await requireOwner();
    const validated = createUserSchema.parse(input);

    const email = validated.email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: "A user with this email already exists." };
    }

    const hashedPassword = await bcrypt.hash(validated.password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: validated.name,
        email,
        hashedPassword,
        role: validated.role,
        active: true,
      },
      select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
    });

    await logActivity({
      userId: currentOwner.id,
      action: "created user",
      entity: "User",
      entityId: newUser.id,
      details: `Created user "${newUser.name}" (${newUser.email}) with role ${newUser.role}`,
    });

    revalidatePath("/admin/users");
    return { success: true, data: newUser };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to create user";
    return { success: false, error: msg };
  }
}

export async function updateUserRole(userId: string, newRole: Role) {
  try {
    const currentOwner = await requireOwner();

    if (userId === currentOwner.id) {
      return { success: false, error: "You cannot change your own role." };
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
      select: { id: true, name: true, email: true, role: true },
    });

    await logActivity({
      userId: currentOwner.id,
      action: "changed user role",
      entity: "User",
      entityId: userId,
      details: `Changed role for "${updatedUser.name}" to ${newRole}`,
    });

    revalidatePath("/admin/users");
    return { success: true, data: updatedUser };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update user role";
    return { success: false, error: msg };
  }
}

export async function toggleUserActive(userId: string) {
  try {
    const currentOwner = await requireOwner();

    if (userId === currentOwner.id) {
      return { success: false, error: "You cannot deactivate your own account." };
    }

    const target = await prisma.user.findUnique({ where: { id: userId } });
    if (!target) {
      return { success: false, error: "User not found" };
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { active: !target.active },
      select: { id: true, name: true, email: true, active: true },
    });

    await logActivity({
      userId: currentOwner.id,
      action: updated.active ? "activated user" : "deactivated user",
      entity: "User",
      entityId: userId,
      details: `${updated.active ? "Activated" : "Deactivated"} account for "${updated.name}"`,
    });

    revalidatePath("/admin/users");
    return { success: true, data: updated };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to toggle user status";
    return { success: false, error: msg };
  }
}
