import { api } from "@/lib/api";
import { AnnouncementForm } from "./announcement-form";

export const dynamic = "force-dynamic";

export default async function AdminAnnouncementPage() {
  let announcement: any = null;
  try {
    const res = await api.getAdminAnnouncement();
    announcement = res?.data ?? (await api.getAnnouncement()) ?? null;
  } catch {
    announcement = null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#3A2418]">
          Announcement Bar
        </h1>
        <p className="text-sm text-[#3A2418]/70 mt-1">
          Control the top notification bar, flash sale countdowns, and operational updates displayed across the website.
        </p>
      </div>

      <AnnouncementForm initialData={announcement} />
    </div>
  );
}
