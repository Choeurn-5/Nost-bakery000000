import { api } from "@/lib/api";
import { InboxClient } from "./inbox-client";

export const dynamic = "force-dynamic";

export default async function AdminInboxPage() {
  let submissions: any[] = [];
  try {
    const res = await api.getAdminInbox();
    submissions = res?.data ?? [];
  } catch {
    submissions = [];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#3A2418]">
          Inbox & Customer Enquiries
        </h1>
        <p className="text-sm text-[#3A2418]/70 mt-1">
          Review customer inquiries, wholesale requests, and catering order messages received from the website.
        </p>
      </div>

      <InboxClient initialSubmissions={submissions} />
    </div>
  );
}
