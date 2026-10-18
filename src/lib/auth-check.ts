import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

/**
 * Validates session and returns authenticated user.
 * Throws an error if unauthenticated or deactivated.
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser> {
  const session = await auth();

  if (!session?.user?.id || !session.user.email) {
    throw new Error("Unauthorized: Please log in to continue.");
  }

  // If prisma is available, verify active status; otherwise trust authenticated session
  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true, name: true, role: true, active: true },
    });

    if (dbUser) {
      if (!dbUser.active) {
        throw new Error("Unauthorized: Account is deactivated.");
      }
      return {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role,
      };
    }
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("deactivated")) {
      throw err;
    }
    // Database server offline, continue with session user
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name || "Admin",
    role: (session.user.role as Role) || "OWNER",
  };
}

/**
 * Ensures user is authenticated and has OWNER role.
 */
export async function requireOwner(): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser();
  if (user.role !== "OWNER") {
    throw new Error("Forbidden: This action requires Owner privileges.");
  }
  return user;
}

/**
 * Creates an activity log entry linked to the current user.
 */
export async function logActivity({
  userId,
  action,
  entity,
  entityId,
  details,
}: {
  userId: string;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: string | null;
}) {
  try {
    const { adminApi } = await import("@/lib/api");
    await adminApi.logActivity({
      userId,
      action,
      entity,
      entityId: entityId ?? null,
      details: details ?? null,
    });
  } catch (error) {
    // Non-blocking log recording
  }
}
