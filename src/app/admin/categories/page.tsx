import { api } from "@/lib/api";
import { CategoryList } from "./category-list";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  let categories: any[] = [];
  try {
    const data = await api.getCategories();
    categories = (data ?? []).map((cat) => ({
      ...cat,
      _count: { products: cat.productsCount ?? 0 },
    }));
  } catch {
    categories = [];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#3A2418]">
          Product Categories
        </h1>
        <p className="text-sm text-[#3A2418]/70 mt-1">
          Organize bakery items into menu categories, arrange sorting order, and manage bilingual names.
        </p>
      </div>

      <CategoryList initialCategories={categories} />
    </div>
  );
}
