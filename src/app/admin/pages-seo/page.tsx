import { api } from "@/lib/api";
import { PagesSeoClient } from "./pages-seo-client";

export const dynamic = "force-dynamic";

export default async function AdminPagesSeoPage() {
  let pagesSeo: any[] = [];
  try {
    const res = await api.getAdminPagesSeo();
    pagesSeo = res?.data ?? [];
  } catch {
    pagesSeo = [];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#3A2418]">
          Pages SEO & Metadata
        </h1>
        <p className="text-sm text-[#3A2418]/70 mt-1">
          Customize search engine title tags, meta descriptions, and social sharing previews for every page.
        </p>
      </div>

      <PagesSeoClient initialPages={pagesSeo} />
    </div>
  );
}
