import { api } from "@/lib/api";
import { SettingsForm } from "./settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  let settings: any = null;
  try {
    const data = await api.getSettings();
    settings = data?.settings ?? null;
  } catch {
    settings = null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#3A2418]">
          Site Settings
        </h1>
        <p className="text-sm text-[#3A2418]/70 mt-1">
          Configure company contact information, brand logos, global SEO tags, and tracking scripts.
        </p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}
