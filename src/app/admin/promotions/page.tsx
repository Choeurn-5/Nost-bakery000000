import { prisma } from "@/lib/prisma";
import { PromotionsTable } from "./promotions-table";

export const dynamic = "force-dynamic";

export default async function AdminPromotionsPage() {
  const promotions = await prisma.promotion.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      products: {
        include: { product: true },
      },
    },
  });

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
