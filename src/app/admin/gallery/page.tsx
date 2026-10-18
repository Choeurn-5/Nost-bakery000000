import { api } from "@/lib/api";
import { GalleryClient } from "./gallery-client";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  let items: any[] = [];
  try {
    const res = await api.getAdminGallery();
    items = res?.data ?? [];
  } catch {
    items = [];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#3A2418]">
          Photo Gallery & Social Showcase
        </h1>
        <p className="text-sm text-[#3A2418]/70 mt-1">
          Manage beautiful photography of breads, viennoiseries, cafe moments, and bakery craft.
        </p>
      </div>

      <GalleryClient initialItems={items} />
    </div>
  );
}
