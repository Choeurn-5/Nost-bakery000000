import { api } from "@/lib/api";
import { ActivityLogClient } from "./activity-log-client";

export const dynamic = "force-dynamic";

export default async function AdminActivityLogPage() {
  let logs: any[] = [];
  try {
    const res = await api.getAdminActivityLogs();
    logs = res?.data ?? [];
  } catch {
    logs = [];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#3A2418]">
          Audit & Activity History
        </h1>
        <p className="text-sm text-[#3A2418]/70 mt-1">
          Review system audit trails, catalog updates, user authentications, and content modifications.
        </p>
      </div>

      <ActivityLogClient initialLogs={logs} />
    </div>
  );
}
