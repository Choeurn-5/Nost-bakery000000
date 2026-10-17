import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminLayoutShell } from "@/components/admin/admin-layout-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NOST Bakery CMS",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const currentPath = headersList.get("x-admin-pathname") || "";

  // If user is on the login page
  if (currentPath === "/admin/login") {
    return <>{children}</>;
  }

  // Auth check for all other admin routes
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <AdminLayoutShell
      user={{
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      }}
    >
      {children}
    </AdminLayoutShell>
  );
}
