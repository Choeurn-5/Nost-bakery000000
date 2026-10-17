"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createPromotion, updatePromotion } from "@/app/admin/actions/promotions";
import { LanguageTabs } from "@/components/admin/language-tabs";
import { KhmerWarningBadge } from "@/components/admin/khmer-warning-badge";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  Loader2,
  Calendar,
  Clock,
  Tag,
  Home,
  CheckSquare,
  Square,
} from "lucide-react";
import { ContentStatus, type Product, type Promotion, type PromotionProduct } from "@prisma/client";

interface PromotionWithProducts extends Promotion {
  products: (PromotionProduct & { product: Product })[];
}

interface PromotionEditorProps {
  initialPromotion?: PromotionWithProducts | null;
  availableProducts: Product[];
}

export function PromotionEditor({ initialPromotion, availableProducts }: PromotionEditorProps) {
  const router = useRouter();
  const [langTab, setLangTab] = useState<"en" | "km">("en");
  const [isPending, setIsPending] = useState(false);

  // Form states
  const [titleEn, setTitleEn] = useState(initialPromotion?.titleEn || "");
  const [titleKm, setTitleKm] = useState(initialPromotion?.titleKm || "");
  const [badgeTextEn, setBadgeTextEn] = useState(initialPromotion?.badgeTextEn || "");
  const [badgeTextKm, setBadgeTextKm] = useState(initialPromotion?.badgeTextKm || "");
  const [descriptionEn, setDescriptionEn] = useState(initialPromotion?.descriptionEn || "");
  const [descriptionKm, setDescriptionKm] = useState(initialPromotion?.descriptionKm || "");
  const [finePrintEn, setFinePrintEn] = useState(initialPromotion?.finePrintEn || "");
  const [finePrintKm, setFinePrintKm] = useState(initialPromotion?.finePrintKm || "");
  const [image, setImage] = useState(initialPromotion?.image || "");

  const [startDate, setStartDate] = useState(
    initialPromotion?.startDate
      ? new Date(initialPromotion.startDate).toISOString().slice(0, 10)
      : ""
  );
  const [endDate, setEndDate] = useState(
    initialPromotion?.endDate
      ? new Date(initialPromotion.endDate).toISOString().slice(0, 10)
      : ""
  );
  const [dailyStartTime, setDailyStartTime] = useState(
    initialPromotion?.dailyStartTime || ""
  );
  const [dailyEndTime, setDailyEndTime] = useState(
    initialPromotion?.dailyEndTime || ""
  );
  const [showOnHome, setShowOnHome] = useState(initialPromotion?.showOnHome ?? true);
  const [status, setStatus] = useState<ContentStatus>(
    initialPromotion?.status || ContentStatus.PUBLISHED
  );

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    initialPromotion?.products ? initialPromotion.products.map((p) => p.productId) : []
  );

  const toggleProduct = (pId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(pId) ? prev.filter((id) => id !== pId) : [...prev, pId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titleEn.trim()) {
      toast.error("Please provide an English promotion title");
      return;
    }

    setIsPending(true);

    try {
      if (initialPromotion?.id) {
        const res = await updatePromotion(initialPromotion.id, {
          titleEn,
          titleKm,
          badgeTextEn,
          badgeTextKm,
          descriptionEn,
          descriptionKm,
          finePrintEn,
          finePrintKm,
          image: image || null,
          startDate: startDate ? startDate : null,
          endDate: endDate ? endDate : null,
          dailyStartTime: dailyStartTime || null,
          dailyEndTime: dailyEndTime || null,
          showOnHome,
          status,
          productIds: selectedProductIds,
        });

        if (!res.success) {
          toast.error(res.error || "Failed to update promotion");
        } else {
          toast.success("Promotion updated successfully!");
          router.push("/admin/promotions");
          router.refresh();
        }
      } else {
        const res = await createPromotion({
          titleEn,
          titleKm,
          badgeTextEn,
          badgeTextKm,
          descriptionEn,
          descriptionKm,
          finePrintEn,
          finePrintKm,
          image: image || null,
          startDate: startDate ? startDate : null,
          endDate: endDate ? endDate : null,
          dailyStartTime: dailyStartTime || null,
          dailyEndTime: dailyEndTime || null,
          showOnHome,
          status,
          productIds: selectedProductIds,
        });

        if (!res.success) {
          toast.error(res.error || "Failed to create promotion");
        } else {
          toast.success("Promotion created successfully!");
          router.push("/admin/promotions");
          router.refresh();
        }
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-2xl bg-[#F1E6D4] border border-[#C98A3D]/20 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/promotions"
            className="p-2 rounded-xl text-[#3A2418] hover:bg-[#FBF7F1] transition-colors"
            title="Back to promotions"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-lg font-bold font-serif text-[#3A2418]">
              {initialPromotion ? `Edit "${initialPromotion.titleEn}"` : "Create Promotion Offer"}
            </h2>
            <p className="text-xs text-[#3A2418]/60">
              Set promotional discounts, recurring evening windows, and eligible bakery products.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LanguageTabs
            activeTab={langTab}
            onChange={setLangTab}
            hasKmValue={Boolean(titleKm)}
          />

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#C98A3D] hover:bg-[#A66A2A] text-[#FBF7F1] text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving…</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{initialPromotion ? "Save Changes" : "Create Promotion"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Content Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-[#F1E6D4] border border-[#C98A3D]/20 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-[#3A2418]">
              Promotion Copy & Details
            </h3>

            {/* Title */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#3A2418]">
                  Title ({langTab.toUpperCase()})
                </label>
                {langTab === "km" && <KhmerWarningBadge value={titleKm} />}
              </div>
              {langTab === "en" ? (
                <input
                  type="text"
                  required
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="e.g. Evening Sourdough Buy 1 Get 1 Free"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-1 focus:ring-[#C98A3D]"
                />
              ) : (
                <input
                  type="text"
                  value={titleKm}
                  onChange={(e) => setTitleKm(e.target.value)}
                  placeholder="ឧ. ការបញ្ចុះតម្លៃនំប៉័ងដំបែធម្មជាតិពេលល្ងាច ទិញ ១ ថែម ១"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-1 focus:ring-[#C98A3D]"
                />
              )}
            </div>

            {/* Badge Text */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#3A2418]">
                  Highlight Badge Text ({langTab.toUpperCase()})
                </label>
                {langTab === "km" && <KhmerWarningBadge value={badgeTextKm} />}
              </div>
              {langTab === "en" ? (
                <input
                  type="text"
                  value={badgeTextEn}
                  onChange={(e) => setBadgeTextEn(e.target.value)}
                  placeholder="e.g. BUY 1 GET 1 or 50% OFF"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-xs text-[#3A2418] focus:outline-none focus:ring-1 focus:ring-[#C98A3D]"
                />
              ) : (
                <input
                  type="text"
                  value={badgeTextKm}
                  onChange={(e) => setBadgeTextKm(e.target.value)}
                  placeholder="ឧ. ទិញ ១ ថែម ១"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-xs text-[#3A2418] focus:outline-none focus:ring-1 focus:ring-[#C98A3D]"
                />
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#3A2418]">
                  Description ({langTab.toUpperCase()})
                </label>
                {langTab === "km" && <KhmerWarningBadge value={descriptionKm} />}
              </div>
              {langTab === "en" ? (
                <textarea
                  rows={3}
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder="Enjoy special discount on all freshly baked artisan loaves after 6:00 PM every evening."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-1 focus:ring-[#C98A3D]"
                />
              ) : (
                <textarea
                  rows={3}
                  value={descriptionKm}
                  onChange={(e) => setDescriptionKm(e.target.value)}
                  placeholder="រីករាយជាមួយការបញ្ចុះតម្លៃពិសេសលើនំប៉័ងដុតស្រស់ៗទាំងអស់ចាប់ពីម៉ោង ៦:០០ ល្ងាចជារៀងរាល់ថ្ងៃ។"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-1 focus:ring-[#C98A3D]"
                />
              )}
            </div>

            {/* Fine Print / Terms */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#3A2418]">
                Fine Print & Terms ({langTab.toUpperCase()})
              </label>
              {langTab === "en" ? (
                <input
                  type="text"
                  value={finePrintEn}
                  onChange={(e) => setFinePrintEn(e.target.value)}
                  placeholder="Applicable for takeaway and dine-in. While stock lasts."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-xs text-[#3A2418] focus:outline-none focus:ring-1 focus:ring-[#C98A3D]"
                />
              ) : (
                <input
                  type="text"
                  value={finePrintKm}
                  onChange={(e) => setFinePrintKm(e.target.value)}
                  placeholder="អនុវត្តសម្រាប់ការវេចខ្ចប់ និងការញ៉ាំនៅហាង។ រហូតដល់អស់ពីស្តុក។"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-xs text-[#3A2418] focus:outline-none focus:ring-1 focus:ring-[#C98A3D]"
                />
              )}
            </div>

            {/* Image Upload */}
            <div className="pt-3 border-t border-[#3A2418]/10">
              <ImageUpload
                label="Promotion Banner Image"
                value={image}
                onChange={setImage}
                placeholderText={titleEn || "NOST Special Deal"}
              />
            </div>
          </div>

          {/* Product Association Multi-Select */}
          <div className="p-6 rounded-2xl bg-[#F1E6D4] border border-[#C98A3D]/20 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-[#3A2418]">
                Apply Promotion to Specific Products ({selectedProductIds.length} selected)
              </h3>
            </div>

            <p className="text-xs text-[#3A2418]/60">
              Select which bakery products this offer applies to:
            </p>

            <div className="max-h-60 overflow-y-auto space-y-1.5 p-3 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/20 admin-sidebar">
              {availableProducts.map((p) => {
                const isSelected = selectedProductIds.includes(p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => toggleProduct(p.id)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F1E6D4] cursor-pointer text-xs"
                  >
                    <div className="flex items-center gap-2">
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#C98A3D]" />
                      ) : (
                        <Square className="w-4 h-4 text-[#3A2418]/40" />
                      )}
                      <span className="font-semibold text-[#3A2418]">
                        {p.nameEn}
                      </span>
                    </div>
                    {p.price && (
                      <span className="text-[#A66A2A] font-bold">
                        ${p.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Timing & Visibility */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#F1E6D4] border border-[#C98A3D]/20 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-[#3A2418]">
              Offer Timing & Window
            </h3>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#3A2418]">
                Publish Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ContentStatus)}
                className="w-full px-3 py-2 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-xs text-[#3A2418] font-semibold cursor-pointer"
              >
                <option value={ContentStatus.PUBLISHED}>Published (Active)</option>
                <option value={ContentStatus.DRAFT}>Draft</option>
                <option value={ContentStatus.SCHEDULED}>Scheduled</option>
                <option value={ContentStatus.TRASHED}>Archived / Trashed</option>
              </select>
            </div>

            {/* Show on Home */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/20">
              <span className="text-xs font-semibold text-[#3A2418] flex items-center gap-1.5">
                <Home className="w-4 h-4 text-[#C98A3D]" />
                <span>Show on Home Page</span>
              </span>
              <input
                type="checkbox"
                checked={showOnHome}
                onChange={(e) => setShowOnHome(e.target.checked)}
                className="w-4 h-4 accent-[#C98A3D]"
              />
            </div>

            {/* Start & End Dates */}
            <div className="space-y-3 pt-3 border-t border-[#3A2418]/10">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#3A2418] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#A66A2A]" />
                  <span>Start Date</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#FBF7F1] border border-[#C98A3D]/30 text-xs text-[#3A2418]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#3A2418] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#A66A2A]" />
                  <span>End Date</span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#FBF7F1] border border-[#C98A3D]/30 text-xs text-[#3A2418]"
                />
              </div>
            </div>

            {/* Daily Hours Window */}
            <div className="space-y-3 pt-3 border-t border-[#3A2418]/10">
              <label className="text-xs font-bold text-[#A66A2A] block uppercase flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Daily Time Window (Optional)</span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-[#3A2418]/70 block mb-1">
                    Daily From
                  </label>
                  <input
                    type="time"
                    value={dailyStartTime}
                    onChange={(e) => setDailyStartTime(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-[#FBF7F1] border border-[#C98A3D]/30 text-xs text-[#3A2418]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#3A2418]/70 block mb-1">
                    Daily Until
                  </label>
                  <input
                    type="time"
                    value={dailyEndTime}
                    onChange={(e) => setDailyEndTime(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-[#FBF7F1] border border-[#C98A3D]/30 text-xs text-[#3A2418]"
                  />
                </div>
              </div>
              <p className="text-[11px] text-[#3A2418]/50">
                E.g. Set 18:00 to 21:00 for the evening Happy Hour discount.
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
