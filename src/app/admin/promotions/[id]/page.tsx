import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { PromotionEditor } from "../promotion-editor";

export const dynamic = "force-dynamic";

interface EditPromotionPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditPromotionPage({ params }: EditPromotionPageProps) {
  const { id } = await params;

  let promotion: any = null;
  let products: any[] = [];

  try {
    const [allPromos, allProducts] = await Promise.all([
      api.getPromotions(),
      api.getProducts(),
    ]);
    const found = (allPromos ?? []).find((p) => String(p.id) === id);
    if (found) {
      promotion = {
        ...found,
        products: (found.products ?? []).map((prod) => ({
          product: prod,
        })),
      };
    }
    products = allProducts ?? [];
  } catch {
    promotion = null;
    products = [];
  }

  if (!promotion) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PromotionEditor
        initialPromotion={promotion}
        availableProducts={products}
      />
    </div>
  );
}
