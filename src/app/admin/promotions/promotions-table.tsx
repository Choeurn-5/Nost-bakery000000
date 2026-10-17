"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { deletePromotion } from "@/app/admin/actions/promotions";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { getPromotionStatus } from "@/lib/utils";
import { toast } from "sonner";
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  Home,
} from "lucide-react";
import type { Promotion, PromotionProduct, Product } from "@prisma/client";

interface PromotionWithProducts extends Promotion {
  products: (PromotionProduct & { product: Product })[];
}

interface PromotionsTableProps {
  promotions: PromotionWithProducts[];
}

export function PromotionsTable({ promotions: initialPromotions }: PromotionsTableProps) {
  const [promotions, setPromotions] = useState<PromotionWithProducts[]>(initialPromotions);
  const [deleteTarget, setDeleteTarget] = useState<PromotionWithProducts | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const res = await deletePromotion(deleteTarget.id);
      if (!res.success) {
        toast.error(res.error || "Failed to delete promotion");
      } else {
        toast.success(`Promotion "${deleteTarget.titleEn}" deleted.`);
        setPromotions((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        setDeleteTarget(null);
      }
    } catch {
      toast.error("Error occurred while deleting");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F1E6D4] border border-[#C98A3D]/20 shadow-xs">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-[#C98A3D]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#3A2418]">
            {promotions.length} Active & Scheduled Campaigns
          </span>
        </div>

        <Link
          href="/admin/promotions/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C98A3D] hover:bg-[#A66A2A] text-[#FBF7F1] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Promotion</span>
        </Link>
      </div>

      {/* Promotions Table */}
      <div className="bg-[#F1E6D4] rounded-2xl border border-[#C98A3D]/20 overflow-hidden shadow-xs">
        {promotions.length === 0 ? (
          <div className="p-12 text-center text-[#3A2418]/60 space-y-3">
            <Tag className="w-10 h-10 text-[#C98A3D] mx-auto opacity-70" />
            <p className="text-sm font-medium">No promotions created yet.</p>
            <Link
              href="/admin/promotions/new"
              className="text-xs text-[#A66A2A] font-semibold underline block"
            >
              Launch your first deal or evening discount
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#C98A3D]/20 bg-[#FBF7F1]/80 text-[#3A2418]/70 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Offer</th>
                  <th className="py-3 px-4">Schedule / Hours</th>
                  <th className="py-3 px-4">Linked Products</th>
                  <th className="py-3 px-4">Display</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3A2418]/10">
                {promotions.map((promo) => {
                  const autoStatus = getPromotionStatus(promo);

                  return (
                    <tr
                      key={promo.id}
                      className="hover:bg-[#FBF7F1]/60 transition-colors"
                    >
                      {/* Offer Info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl bg-[#FBF7F1] border border-[#3A2418]/10 overflow-hidden shrink-0 flex items-center justify-center">
                            {promo.image ? (
                              <Image
                                src={promo.image}
                                alt={promo.titleEn}
                                fill
                                className="object-cover"
                                sizes="48px"
                                unoptimized
                              />
                            ) : (
                              <Tag className="w-5 h-5 text-[#C98A3D]/50" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-[#3A2418]">
                              {promo.titleEn}
                            </div>
                            {promo.badgeTextEn && (
                              <span className="inline-block mt-0.5 px-2 py-0.2 rounded text-[10px] font-bold uppercase bg-[#9E3B3B]/10 text-[#9E3B3B] border border-[#9E3B3B]/20">
                                {promo.badgeTextEn}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Schedule / Hours */}
                      <td className="py-3 px-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-[#3A2418]/80">
                          <Calendar className="w-3.5 h-3.5 text-[#A66A2A]" />
                          <span>
                            {promo.startDate
                              ? new Date(promo.startDate).toLocaleDateString()
                              : "Ongoing"}
                            {" → "}
                            {promo.endDate
                              ? new Date(promo.endDate).toLocaleDateString()
                              : "No end"}
                          </span>
                        </div>
                        {promo.dailyStartTime && promo.dailyEndTime && (
                          <div className="flex items-center gap-1.5 text-[#A66A2A] font-semibold">
                            <Clock className="w-3 h-3" />
                            <span>
                              {promo.dailyStartTime} – {promo.dailyEndTime}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Linked Products */}
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[#3A2418]/5 text-[#3A2418]">
                          {promo.products.length} products
                        </span>
                      </td>

                      {/* Display Settings */}
                      <td className="py-3 px-4">
                        {promo.showOnHome ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-600/10 px-2 py-0.5 rounded-full">
                            <Home className="w-3 h-3" /> On Home
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#3A2418]/50">
                            Promotions page only
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              promo.status === "PUBLISHED"
                                ? "bg-emerald-600/10 text-emerald-800 border border-emerald-600/20"
                                : "bg-gray-400/20 text-gray-700"
                            }`}
                          >
                            {promo.status}
                          </span>
                          <div className="text-[10px] text-[#3A2418]/60 font-medium">
                            Live state: {autoStatus.replace("_", " ")}
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/promotions/${promo.id}`}
                            className="p-1.5 text-[#A66A2A] hover:bg-[#C98A3D]/10 rounded-lg"
                            title="Edit Promotion"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setDeleteTarget(promo)}
                            className="p-1.5 text-[#9E3B3B] hover:bg-[#9E3B3B]/10 rounded-lg cursor-pointer"
                            title="Delete Promotion"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Promotion"
        description={`Are you sure you want to delete the promotion "${deleteTarget?.titleEn}"? This offer will immediately disappear from the website.`}
        confirmText="Delete Promotion"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
