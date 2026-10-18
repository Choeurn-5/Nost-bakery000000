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
    const [promoRes, prodsRes] = await Promise.all([
      api.getAdminPromotion(id),
      api.getAdminProducts(),
    ]);
    const found = promoRes?.data;
    if (found) {
      promotion = {
        ...found,
        products: (found.products ?? []).map((prod: any) => ({
          product: prod,
        })),
      };
    }
    products = prodsRes?.data ?? [];
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
