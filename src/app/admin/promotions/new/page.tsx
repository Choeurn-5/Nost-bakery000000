import { prisma } from "@/lib/prisma";
import { PromotionEditor } from "../promotion-editor";

export const dynamic = "force-dynamic";

export default async function AdminNewPromotionPage() {
  const products = await prisma.product.findMany({
    where: { status: { not: "TRASHED" } },
    orderBy: { nameEn: "asc" },
  });

  return (
    <div className="space-y-6">
      <PromotionEditor availableProducts={products} />
    </div>
  );
}
