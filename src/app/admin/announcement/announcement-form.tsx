"use client";

import { useState } from "react";
import { updateAnnouncementBar } from "@/app/admin/actions/settings";
import { LanguageTabs } from "@/components/admin/language-tabs";
import { KhmerWarningBadge } from "@/components/admin/khmer-warning-badge";
import { toast } from "sonner";
import {
  Save,
  Loader2,
  Megaphone,
  Eye,
  Calendar,
  Link as LinkIcon,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { AnnouncementBar } from "@prisma/client";

interface AnnouncementFormProps {
  initialData: AnnouncementBar | null;
}

export function AnnouncementForm({ initialData }: AnnouncementFormProps) {
  const [langTab, setLangTab] = useState<"en" | "km">("en");
  const [isPending, setIsPending] = useState(false);

  const [textEn, setTextEn] = useState(
    initialData?.textEn || "Buy 1 Get 1 Free · Every day 6:00 PM – 9:00 PM"
  );
  const [textKm, setTextKm] = useState(initialData?.textKm || "");
  const [link, setLink] = useState(initialData?.link || "/promotions");
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [startDate, setStartDate] = useState(
    initialData?.startDate
      ? new Date(initialData.startDate).toISOString().slice(0, 10)
      : ""
  );
  const [endDate, setEndDate] = useState(
    initialData?.endDate
      ? new Date(initialData.endDate).toISOString().slice(0, 10)
      : ""
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      const res = await updateAnnouncementBar({
        textEn,
        textKm,
        link: link.trim() || null,
        isActive,
        startDate: startDate ? startDate : null,
        endDate: endDate ? endDate : null,
      });

      if (!res.success) {
        toast.error(res.error || "Failed to update announcement");
      } else {
        toast.success("Announcement bar updated successfully!");
      }
    } catch {
      toast.error("An error occurred while saving.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Visual Live Preview Header */}
      <div className="p-6 bg-[#F1E6D4] rounded-2xl border border-[#C98A3D]/20 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#A66A2A]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#3A2418]">
              Live Visual Preview (Website Header)
            </span>
          </div>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              isActive
                ? "bg-emerald-600/10 text-emerald-800 border border-emerald-600/20"
                : "bg-[#9E3B3B]/10 text-[#9E3B3B] border border-[#9E3B3B]/20"
            }`}
          >
            {isActive ? (
              <>
                <CheckCircle2 className="w-3 h-3" />
                <span>Live Active</span>
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3" />
                <span>Currently Inactive</span>
              </>
            )}
          </span>
        </div>

        {/* Live Banner Mockup */}
        <div className="overflow-hidden rounded-xl bg-[#3A2418] text-[#FBF7F1] py-2.5 px-4 text-center text-xs font-medium tracking-wide shadow-md flex items-center justify-center gap-2 transition-all">
          <span className="w-2 h-2 rounded-full bg-[#C98A3D] animate-ping shrink-0" />
          <span className="truncate">
            {langTab === "km" && textKm ? textKm : textEn}
          </span>
          {link && (
            <span className="underline decoration-[#C98A3D] text-[#soft-butter] text-[11px] ml-2 shrink-0">
              Details →
            </span>
          )}
        </div>
        <p className="text-[11px] text-[#3A2418]/60 text-center">
          Note: Toggle languages using the tab below to preview English and Khmer modes.
        </p>
      </div>

      {/* Editor Form */}
      <form onSubmit={handleSubmit} className="p-6 bg-[#F1E6D4] rounded-2xl border border-[#C98A3D]/20 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#3A2418]/10">
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-[#C98A3D]" />
            <h2 className="text-base font-bold font-serif text-[#3A2418]">
              Banner Configuration
            </h2>
          </div>

          <LanguageTabs
            activeTab={langTab}
            onChange={setLangTab}
            hasKmValue={Boolean(textKm)}
          />
        </div>

        {/* Active Toggle Switch */}
        <div className="flex items-center justify-between p-4 bg-[#FBF7F1] rounded-xl border border-[#C98A3D]/20">
          <div>
            <span className="text-sm font-bold text-[#3A2418] block">
              Enable Announcement Banner
            </span>
            <span className="text-xs text-[#3A2418]/60">
              When disabled, the announcement bar is hidden across all pages.
            </span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-[#C98A3D]"></div>
          </label>
        </div>

        {/* Text Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#3A2418]">
              Announcement Text ({langTab.toUpperCase()})
            </label>
            {langTab === "km" && <KhmerWarningBadge value={textKm} />}
          </div>

          {langTab === "en" ? (
            <input
              type="text"
              required
              value={textEn}
              onChange={(e) => setTextEn(e.target.value)}
              placeholder="e.g. Buy 1 Get 1 Free · Every day 6:00 PM – 9:00 PM"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-2 focus:ring-[#C98A3D]"
            />
          ) : (
            <input
              type="text"
              value={textKm}
              onChange={(e) => setTextKm(e.target.value)}
              placeholder="ឧទាហរណ៍៖ ទិញ ១ ថែម ១ ដោយឥតគិតថ្លៃ · រៀងរាល់ថ្ងៃ ម៉ោង ៦:០០ ល្ងាច – ៩:០០ យប់"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-2 focus:ring-[#C98A3D]"
            />
          )}
        </div>

        {/* Target Link */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#3A2418] flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5 text-[#A66A2A]" />
            <span>Target Click Link (Optional)</span>
          </label>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="/promotions or https://..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-2 focus:ring-[#C98A3D]"
          />
        </div>

        {/* Date Window */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#3A2418]/10">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#3A2418] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#A66A2A]" />
              <span>Start Date (Optional)</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-2 focus:ring-[#C98A3D]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#3A2418] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#A66A2A]" />
              <span>End Date (Optional)</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-2 focus:ring-[#C98A3D]"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-[#3A2418]/10 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C98A3D] hover:bg-[#A66A2A] text-[#FBF7F1] font-semibold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Banner…</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Announcement</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
