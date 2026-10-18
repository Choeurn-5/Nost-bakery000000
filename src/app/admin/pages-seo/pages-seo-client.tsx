"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { FileText, Save, Loader2, Globe } from "lucide-react";
import { ImageUpload } from "@/components/admin/image-upload";


const STANDARD_PAGES = [
  { slug: "home", label: "Home Page" },
  { slug: "menu", label: "Menu & Catalog" },
  { slug: "wholesale", label: "Wholesale & B2B" },
  { slug: "cafe", label: "Cafe & Dine-in" },
  { slug: "bakery", label: "Our Story & Craft" },
  { slug: "promotions", label: "Promotions & Offers" },
  { slug: "contact", label: "Contact & Locations" },
];

interface PageSeoItem {
  id?: string | number;
  pageSlug?: string;
  page_slug?: string;
  titleEn?: string;
  title_en?: string;
  titleKm?: string;
  title_km?: string;
  descriptionEn?: string;
  description_en?: string;
  descriptionKm?: string;
  description_km?: string;
  ogImage?: string;
  og_image?: string;
}

export function PagesSeoClient({ initialPages }: { initialPages: PageSeoItem[] }) {
  const [pages, setPages] = useState<PageSeoItem[]>(initialPages);
  const [selectedSlug, setSelectedSlug] = useState<string>("home");
  const [activeLang, setActiveLang] = useState<"en" | "km">("en");
  const [isPending, setIsPending] = useState(false);

  const currentPage = pages.find(
    (p) => (p.page_slug || p.pageSlug) === selectedSlug
  ) || {
    pageSlug: selectedSlug,
    page_slug: selectedSlug,
    titleEn: "",
    titleKm: "",
    descriptionEn: "",
    descriptionKm: "",
    ogImage: "",
  };

  const [formData, setFormData] = useState<Record<string, PageSeoItem>>(() => {
    const map: Record<string, PageSeoItem> = {};
    for (const p of pages) {
      const slug = p.page_slug || p.pageSlug || "";
      if (slug) map[slug] = p;
    }
    return map;
  });

  const currentForm = formData[selectedSlug] || currentPage;

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [selectedSlug]: {
        ...currentForm,
        pageSlug: selectedSlug,
        page_slug: selectedSlug,
        [field]: value,
      },
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    const payload = {
      pageSlug: selectedSlug,
      titleEn: currentForm.titleEn || currentForm.title_en || "",
      titleKm: currentForm.titleKm || currentForm.title_km || "",
      descriptionEn: currentForm.descriptionEn || currentForm.description_en || "",
      descriptionKm: currentForm.descriptionKm || currentForm.description_km || "",
      ogImage: currentForm.ogImage || currentForm.og_image || "",
    };

    try {
      const res = await api.savePageSeo(payload);
      if (res.success && res.data) {
        toast.success(`SEO updated for "${selectedSlug}" page!`);
        setPages((prev) => {
          const filtered = prev.filter((p) => (p.page_slug || p.pageSlug) !== selectedSlug);
          return [...filtered, res.data];
        });
      } else {
        toast.error(res.error || "Failed to update SEO settings");
      }
    } catch {
      toast.error("Error saving SEO settings");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Page Selector Sidebar */}
      <div className="lg:col-span-1 bg-white rounded-xl border border-[#3A2418]/10 p-4 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#3A2418]/60 mb-3 px-2">
          Select Page
        </h3>
        <div className="space-y-1">
          {STANDARD_PAGES.map((page) => {
            const isSelected = selectedSlug === page.slug;
            return (
              <button
                key={page.slug}
                type="button"
                onClick={() => setSelectedSlug(page.slug)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                  isSelected
                    ? "bg-[#6A9A8A] text-white font-semibold"
                    : "text-[#3A2418]/80 hover:bg-[#FAF6F0] hover:text-[#3A2418]"
                }`}
              >
                <span>{page.label}</span>
                <span className="text-xs opacity-75">/{page.slug}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SEO Editor */}
      <div className="lg:col-span-3 bg-white rounded-xl border border-[#3A2418]/10 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#3A2418]/10 mb-6">
          <div>
            <h2 className="text-xl font-bold font-serif text-[#3A2418] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#6A9A8A]" />
              SEO Settings for {STANDARD_PAGES.find((p) => p.slug === selectedSlug)?.label}
            </h2>
            <p className="text-xs text-[#3A2418]/60 mt-0.5">Route: /{selectedSlug}</p>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center gap-1 bg-[#FAF6F0] p-1 rounded-lg border border-[#3A2418]/10">
            <button
              type="button"
              onClick={() => setActiveLang("en")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                activeLang === "en"
                  ? "bg-[#3A2418] text-white"
                  : "text-[#3A2418]/70 hover:text-[#3A2418]"
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setActiveLang("km")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                activeLang === "km"
                  ? "bg-[#3A2418] text-white"
                  : "text-[#3A2418]/70 hover:text-[#3A2418]"
              }`}
            >
              Khmer (ភាសាខ្មែរ)
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {activeLang === "en" ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#3A2418] uppercase tracking-wider mb-1.5">
                  Meta Title (English)
                </label>
                <input
                  type="text"
                  value={currentForm.titleEn || currentForm.title_en || ""}
                  onChange={(e) => handleChange("titleEn", e.target.value)}
                  placeholder="e.g. Fresh Artisan Sourdough & French Bakery | NOST Bakery"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#3A2418]/20 bg-[#FAF6F0]/30 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#6A9A8A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3A2418] uppercase tracking-wider mb-1.5">
                  Meta Description (English)
                </label>
                <textarea
                  rows={4}
                  value={currentForm.descriptionEn || currentForm.description_en || ""}
                  onChange={(e) => handleChange("descriptionEn", e.target.value)}
                  placeholder="e.g. Discover hand-laminated croissants, natural leaven sourdough loaves, and specialty coffee in Phnom Penh."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#3A2418]/20 bg-[#FAF6F0]/30 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#6A9A8A]"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#3A2418] uppercase tracking-wider mb-1.5">
                  Meta Title (Khmer)
                </label>
                <input
                  type="text"
                  value={currentForm.titleKm || currentForm.title_km || ""}
                  onChange={(e) => handleChange("titleKm", e.target.value)}
                  placeholder="ចំណងជើងទំព័រជាភាសាខ្មែរ"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#3A2418]/20 bg-[#FAF6F0]/30 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#6A9A8A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3A2418] uppercase tracking-wider mb-1.5">
                  Meta Description (Khmer)
                </label>
                <textarea
                  rows={4}
                  value={currentForm.descriptionKm || currentForm.description_km || ""}
                  onChange={(e) => handleChange("descriptionKm", e.target.value)}
                  placeholder="ការពិពណ៌នាទំព័រជាភាសាខ្មែរ"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#3A2418]/20 bg-[#FAF6F0]/30 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#6A9A8A]"
                />
              </div>
            </>
          )}

          <div>
            <ImageUpload
              label="Open Graph (Social Share) Image (Upload from Device)"
              value={currentForm.ogImage || currentForm.og_image || ""}
              onChange={(url) => handleChange("ogImage", url)}
              placeholderText={`${selectedSlug.toUpperCase()} Social`}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 bg-[#3A2418] text-white rounded-lg text-sm font-semibold hover:bg-[#3A2418]/90 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save SEO Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
