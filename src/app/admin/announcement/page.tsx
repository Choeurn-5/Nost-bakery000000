import { prisma } from "@/lib/prisma";
import { AnnouncementForm } from "./announcement-form";

export const dynamic = "force-dynamic";

export default async function AdminAnnouncementPage() {
  const announcement = await prisma.announcementBar.findUnique({
    where: { id: "default" },
  });

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
