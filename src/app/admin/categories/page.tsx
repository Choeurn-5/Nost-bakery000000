import { prisma } from "@/lib/prisma";
import { CategoryList } from "./category-list";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

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
