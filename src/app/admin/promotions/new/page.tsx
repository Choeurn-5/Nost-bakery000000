import { api } from "@/lib/api";
import { PromotionEditor } from "../promotion-editor";

export const dynamic = "force-dynamic";

export default async function AdminNewPromotionPage() {
  const prodsRes = await api.getAdminProducts();
  const products = prodsRes?.data ?? (await api.getProducts()) ?? [];

  return (
    <div className="space-y-6">
      <PromotionEditor availableProducts={products as any} />
    </div>
  );
}
