import { api } from "@/lib/api";
import { WholesaleForm } from "./wholesale-form";

export const dynamic = "force-dynamic";

export default async function AdminWholesalePage() {
  let wholesaleData: any = null;
  try {
    const res = await api.getAdminWholesale();
    wholesaleData = res?.data?.settings ?? null;
  } catch {
    wholesaleData = null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#3A2418]">
          Wholesale & B2B Settings
        </h1>
        <p className="text-sm text-[#3A2418]/70 mt-1">
          Manage business supply conditions, minimum order quantities, delivery terms, and order process steps.
        </p>
      </div>

      <WholesaleForm initialData={wholesaleData} />
    </div>
  );
}
