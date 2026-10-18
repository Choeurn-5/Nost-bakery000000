import { api } from "@/lib/api";
import { ProductsTable } from "./products-table";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  let products: any[] = [];
  let categories: any[] = [];

  try {
    const [prodsRes, catsRes] = await Promise.all([
      api.getAdminProducts(),
      api.getAdminCategories(),
    ]);
    products = prodsRes?.data ?? [];
    categories = catsRes?.data ?? [];
  } catch {
    products = [];
    categories = [];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#3A2418]">
          Products Management
        </h1>
        <p className="text-sm text-[#3A2418]/70 mt-1">
          Catalog of all breads, viennoiseries, pastries, cakes, and beverages with pricing and inventory status.
        </p>
      </div>

      <ProductsTable products={products} categories={categories} />
    </div>
  );
}
