import { api } from "@/lib/api";
import { StoriesClient } from "./stories-client";

export const dynamic = "force-dynamic";

export default async function AdminStoriesPage() {
  let stories: any[] = [];
  try {
    const res = await api.getAdminStories();
    stories = res?.data ?? [];
  } catch {
    stories = [];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#3A2418]">
          Our Bakery Stories & History
        </h1>
        <p className="text-sm text-[#3A2418]/70 mt-1">
          Share your artisan sourdough philosophy, French heritage, local Cambodian ingredients, and baking craft stories.
        </p>
      </div>

      <StoriesClient initialStories={stories} />
    </div>
  );
}
