import { api } from "@/lib/api";
import { MediaClient } from "./media-client";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  let mediaList: any[] = [];
  try {
    const res = await api.getAdminMedia();
    mediaList = res?.data ?? [];
  } catch {
    mediaList = [];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#3A2418]">
          Media Asset Library
        </h1>
        <p className="text-sm text-[#3A2418]/70 mt-1">
          Store, organize, and copy image links for products, promotions, home sections, and stories.
        </p>
      </div>

      <MediaClient initialMedia={mediaList} />
    </div>
  );
}
