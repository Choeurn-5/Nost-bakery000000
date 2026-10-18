import { api } from "@/lib/api";
import { ProductEditor } from "../product-editor";

export const dynamic = "force-dynamic";

export default async function AdminNewProductPage() {
  const catsRes = await api.getAdminCategories();
  const categories = catsRes?.data ?? (await api.getCategories()) ?? [];

  return (
    <div className="space-y-6">
      <ProductEditor categories={categories as any} />
    </div>
  );
}
