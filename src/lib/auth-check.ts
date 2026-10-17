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

  // Double check active status in database
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, name: true, role: true, active: true },
  });

  if (!dbUser || !dbUser.active) {
    throw new Error("Unauthorized: Account is deactivated or not found.");
  }

  return {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name,
    role: dbUser.role,
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
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        entity,
        entityId: entityId ?? null,
        details: details ?? null,
      },
    });
  } catch (error) {
    console.error("Failed to write to ActivityLog:", error);
  }
}
