"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Save, Loader2, Truck } from "lucide-react";
import { ImageUpload } from "@/components/admin/image-upload";

export function WholesaleForm({ initialData }: { initialData: any }) {
  const [isPending, setIsPending] = useState(false);
  const [formData, setFormData] = useState({
    heroHeadlineEn: initialData?.heroHeadlineEn || "Bakery Supplies for Your Business",
    heroHeadlineKm: initialData?.heroHeadlineKm || "ការផ្គត់ផ្គង់នំប៉័ងសម្រាប់អាជីវកម្មរបស់អ្នក",
    heroSubHeadlineEn: initialData?.heroSubHeadlineEn || "Fresh daily wholesale delivery for hotels, cafes, and restaurants across Siem Reap.",
    heroSubHeadlineKm: initialData?.heroSubHeadlineKm || "",
    heroImage: initialData?.heroImage || initialData?.hero_image || "",
    deliveryCoverageEn: initialData?.deliveryCoverageEn || "Daily morning delivery in Siem Reap town center and hotel zone.",
    deliveryCoverageKm: initialData?.deliveryCoverageKm || "",
    minimumOrderTextEn: initialData?.minimumOrderTextEn || "Minimum $30 per delivery order.",
    minimumOrderTextKm: initialData?.minimumOrderTextKm || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      const res = await api.saveWholesaleSettings(formData);
      if (res.success) {
        toast.success("Wholesale settings saved successfully!");
      } else {
        toast.error(res.error || "Failed to save settings");
      }
    } catch {
      toast.error("Error saving wholesale settings");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-6 rounded-2xl bg-[#F1E6D4] border border-[#C98A3D]/20 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-[#C98A3D]/20 pb-3">
          <Truck className="w-5 h-5 text-[#C98A3D]" />
          <h2 className="font-bold font-serif text-base text-[#3A2418]">
            Wholesale Page Content & Delivery Terms
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#3A2418] mb-1">Hero Headline (EN)</label>
            <input
              type="text"
              value={formData.heroHeadlineEn}
              onChange={(e) => setFormData({ ...formData, heroHeadlineEn: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/20 text-[#3A2418]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#3A2418] mb-1">Hero Headline (KM)</label>
            <input
              type="text"
              value={formData.heroHeadlineKm}
              onChange={(e) => setFormData({ ...formData, heroHeadlineKm: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/20 text-[#3A2418]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#3A2418] mb-1">Sub-headline (EN)</label>
            <textarea
              rows={2}
              value={formData.heroSubHeadlineEn}
              onChange={(e) => setFormData({ ...formData, heroSubHeadlineEn: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/20 text-[#3A2418]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#3A2418] mb-1">Sub-headline (KM)</label>
            <textarea
              rows={2}
              value={formData.heroSubHeadlineKm}
              onChange={(e) => setFormData({ ...formData, heroSubHeadlineKm: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/20 text-[#3A2418]"
            />
          </div>
        </div>

        <div>
          <ImageUpload
            label="Wholesale Hero Background Banner (Upload from Device)"
            value={formData.heroImage}
            onChange={(url) => setFormData({ ...formData, heroImage: url })}
            placeholderText="Wholesale Supply"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#3A2418] mb-1">Delivery Coverage (EN)</label>
            <input
              type="text"
              value={formData.deliveryCoverageEn}
              onChange={(e) => setFormData({ ...formData, deliveryCoverageEn: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/20 text-[#3A2418]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#3A2418] mb-1">Minimum Order Text (EN)</label>
            <input
              type="text"
              value={formData.minimumOrderTextEn}
              onChange={(e) => setFormData({ ...formData, minimumOrderTextEn: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/20 text-[#3A2418]"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C98A3D] text-[#FBF7F1] hover:bg-[#A66A2A] text-xs font-bold shadow-xs transition-colors cursor-pointer"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Wholesale Settings</span>
        </button>
      </div>
    </form>
  );
}
