import { api } from "@/lib/api";
import { PromotionsTable } from "./promotions-table";

export const dynamic = "force-dynamic";

export default async function AdminPromotionsPage() {
  let promotions: any[] = [];
  try {
    const res = await api.getAdminPromotions();
    const data = res?.data ?? (await api.getPromotions()) ?? [];
    promotions = data.map((p: any) => ({
      ...p,
      products: (p.products ?? []).map((prod: any) => ({
        product: prod,
      })),
    }));
  } catch {
    promotions = [];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#3A2418]">
          Promotions & Special Offers
        </h1>
        <p className="text-sm text-[#3A2418]/70 mt-1">
          Create marketing discounts, evening flash sales, seasonal specials, and featured offers.
        </p>
      </div>

      <PromotionsTable promotions={promotions} />
    </div>
  );
}
