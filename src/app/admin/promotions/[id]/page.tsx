import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PromotionEditor } from "../promotion-editor";

export const dynamic = "force-dynamic";

interface EditPromotionPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditPromotionPage({ params }: EditPromotionPageProps) {
  const { id } = await params;

  const [promotion, products] = await Promise.all([
    prisma.promotion.findUnique({
      where: { id },
      include: {
        products: {
          include: { product: true },
        },
      },
    }),
    prisma.product.findMany({
      where: { status: { not: "TRASHED" } },
      orderBy: { nameEn: "asc" },
    }),
  ]);

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
