import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { ProductEditor } from "../product-editor";

export const dynamic = "force-dynamic";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  let product: any = null;
  let categories: any[] = [];

  try {
    const [allProducts, cats] = await Promise.all([
      api.getProducts(),
      api.getCategories(),
    ]);
    product = (allProducts ?? []).find((p) => String(p.id) === id || p.slug === id) ?? null;
    categories = cats ?? [];
  } catch {
    product = null;
    categories = [];
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <ProductEditor initialProduct={product} categories={categories} />
    </div>
  );
}
