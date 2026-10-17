import { prisma } from "@/lib/prisma";
import { ProductsTable } from "./products-table";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
    }),
  ]);

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
