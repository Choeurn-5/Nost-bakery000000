import { api } from "@/lib/api";
import { UsersClient } from "./users-client";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  let users: any[] = [];
  try {
    const res = await api.getAdminUsers();
    users = res?.data ?? [];
  } catch {
    users = [];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#3A2418]">
          Team Accounts & Permissions
        </h1>
        <p className="text-sm text-[#3A2418]/70 mt-1">
          Manage administrator credentials, grant role-based access, and oversee staff authorizations.
        </p>
      </div>

      <UsersClient initialUsers={users} />
    </div>
  );
}
