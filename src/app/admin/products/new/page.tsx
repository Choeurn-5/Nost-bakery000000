import { prisma } from "@/lib/prisma";
import { ProductEditor } from "../product-editor";

export const dynamic = "force-dynamic";

export default async function AdminNewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <ProductEditor categories={categories} />
    </div>
  );
}
