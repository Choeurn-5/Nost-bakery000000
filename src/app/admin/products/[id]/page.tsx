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
    const [prodRes, catsRes] = await Promise.all([
      api.getAdminProduct(id),
      api.getAdminCategories(),
    ]);
    product = prodRes?.data ?? null;
    categories = catsRes?.data ?? [];
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
