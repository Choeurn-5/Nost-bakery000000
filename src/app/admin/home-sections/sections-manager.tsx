"use client";

import { useState } from "react";
import { updateHomeSection, reorderHomeSections } from "@/app/admin/actions/home-sections";
import { LanguageTabs } from "@/components/admin/language-tabs";
import { KhmerWarningBadge } from "@/components/admin/khmer-warning-badge";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";
import {
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Save,
  Loader2,
  Eye,
  EyeOff,
  Video,
  Layers,
} from "lucide-react";
import type { HomeSection } from "@prisma/client";

interface SectionsManagerProps {
  initialSections: HomeSection[];
}

export function SectionsManager({ initialSections }: SectionsManagerProps) {
  const [sections, setSections] = useState<HomeSection[]>(initialSections);
  const [expandedId, setExpandedId] = useState<string | null>(initialSections[0]?.id || null);
  const [langTab, setLangTab] = useState<"en" | "km">("en");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleFieldChange = (id: string, field: keyof HomeSection, value: unknown) => {
    setSections((prev) =>
      prev.map((sec) => (sec.id === id ? { ...sec, [field]: value } : sec))
    );
  };

  const handleSaveSection = async (section: HomeSection) => {
    setSavingId(section.id);
    try {
      const res = await updateHomeSection(section.id, {
        headlineEn: section.headlineEn,
        headlineKm: section.headlineKm,
        subHeadlineEn: section.subHeadlineEn,
        subHeadlineKm: section.subHeadlineKm,
        bodyEn: section.bodyEn,
        bodyKm: section.bodyKm,
        buttonLabelEn: section.buttonLabelEn,
        buttonLabelKm: section.buttonLabelKm,
        buttonLink: section.buttonLink,
        button2LabelEn: section.button2LabelEn,
        button2LabelKm: section.button2LabelKm,
        button2Link: section.button2Link,
        image: section.image,
        videoUrl: section.videoUrl,
        isVisible: section.isVisible,
      });

      if (!res.success) {
        toast.error(res.error || "Failed to update section");
      } else {
        toast.success(`Section "${section.sectionKey}" saved successfully!`);
      }
    } catch {
      toast.error("Failed to save section changes");
    } finally {
      setSavingId(null);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIndex, 0, moved);

    setSections(newSections);
    setIsReordering(true);

    try {
      const ids = newSections.map((s) => s.id);
      const res = await reorderHomeSections(ids);
      if (!res.success) {
        toast.error("Failed to reorder sections");
      } else {
        toast.success("Home sections reordered!");
      }
    } catch {
      toast.error("Error saving section order");
    } finally {
      setIsReordering(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Bar with Language Selector */}
      <div className="flex items-center justify-between p-4 bg-[#F1E6D4] rounded-2xl border border-[#C98A3D]/20 shadow-xs">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#C98A3D]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#3A2418]">
            Manage Landing Page Blocks ({sections.length} Sections)
          </span>
        </div>

        <LanguageTabs
          activeTab={langTab}
          onChange={setLangTab}
        />
      </div>

      {/* Sections Accordion List */}
      <div className="space-y-3">
        {sections.map((section, idx) => {
          const isExpanded = expandedId === section.id;
          const isSaving = savingId === section.id;

          return (
            <div
              key={section.id}
              className="bg-[#F1E6D4] rounded-2xl border border-[#C98A3D]/20 overflow-hidden shadow-xs transition-all"
            >
              {/* Accordion Header */}
              <div className="p-4 sm:p-5 flex items-center justify-between gap-4 select-none">
                <div
                  onClick={() => toggleExpand(section.id)}
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#3A2418] text-[#FBF7F1] text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-[#3A2418] font-serif uppercase tracking-wide">
                        {section.sectionKey}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          section.isVisible
                            ? "bg-emerald-600/10 text-emerald-800"
                            : "bg-gray-400/20 text-gray-600"
                        }`}
                      >
                        {section.isVisible ? "Visible" : "Hidden"}
                      </span>
                    </div>

                    <p className="text-xs text-[#3A2418]/60 truncate mt-0.5">
                      {langTab === "km" && section.headlineKm
                        ? section.headlineKm
                        : section.headlineEn || "No headline set"}
                    </p>
                  </div>
                </div>

                {/* Right controls: Up / Down Reorder and Expand Arrow */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    disabled={idx === 0 || isReordering}
                    onClick={() => handleMove(idx, "up")}
                    className="p-1.5 text-[#3A2418]/60 hover:text-[#3A2418] hover:bg-[#FBF7F1]/80 rounded-lg disabled:opacity-20 cursor-pointer"
                    title="Move section up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    disabled={idx === sections.length - 1 || isReordering}
                    onClick={() => handleMove(idx, "down")}
                    className="p-1.5 text-[#3A2418]/60 hover:text-[#3A2418] hover:bg-[#FBF7F1]/80 rounded-lg disabled:opacity-20 cursor-pointer"
                    title="Move section down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleExpand(section.id)}
                    className="p-1.5 text-[#3A2418]/70 hover:text-[#3A2418] hover:bg-[#FBF7F1]/80 rounded-lg cursor-pointer ml-1"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Accordion Body Editor */}
              {isExpanded && (
                <div className="p-5 border-t border-[#3A2418]/10 bg-[#FBF7F1] space-y-5 animate-in fade-in duration-150">
                  {/* Visibility Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#F1E6D4]/60 border border-[#C98A3D]/20">
                    <span className="text-xs font-semibold text-[#3A2418]">
                      Show this section on landing page
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleFieldChange(section.id, "isVisible", !section.isVisible)
                      }
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        section.isVisible
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-400 text-white"
                      }`}
                    >
                      {section.isVisible ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Visible</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Hidden</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Headline & Subheadline */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#3A2418]">
                          Headline ({langTab.toUpperCase()})
                        </label>
                        {langTab === "km" && (
                          <KhmerWarningBadge value={section.headlineKm} />
                        )}
                      </div>
                      {langTab === "en" ? (
                        <input
                          type="text"
                          value={section.headlineEn}
                          onChange={(e) =>
                            handleFieldChange(section.id, "headlineEn", e.target.value)
                          }
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-1 focus:ring-[#C98A3D]"
                        />
                      ) : (
                        <input
                          type="text"
                          value={section.headlineKm}
                          onChange={(e) =>
                            handleFieldChange(section.id, "headlineKm", e.target.value)
                          }
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-1 focus:ring-[#C98A3D]"
                        />
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#3A2418]">
                          Sub-Headline ({langTab.toUpperCase()})
                        </label>
                        {langTab === "km" && (
                          <KhmerWarningBadge value={section.subHeadlineKm} />
                        )}
                      </div>
                      {langTab === "en" ? (
                        <input
                          type="text"
                          value={section.subHeadlineEn}
                          onChange={(e) =>
                            handleFieldChange(
                              section.id,
                              "subHeadlineEn",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-1 focus:ring-[#C98A3D]"
                        />
                      ) : (
                        <input
                          type="text"
                          value={section.subHeadlineKm}
                          onChange={(e) =>
                            handleFieldChange(
                              section.id,
                              "subHeadlineKm",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-1 focus:ring-[#C98A3D]"
                        />
                      )}
                    </div>
                  </div>

                  {/* Body Paragraph */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#3A2418]">
                        Body Description ({langTab.toUpperCase()})
                      </label>
                      {langTab === "km" && (
                        <KhmerWarningBadge value={section.bodyKm} />
                      )}
                    </div>
                    {langTab === "en" ? (
                      <textarea
                        rows={3}
                        value={section.bodyEn}
                        onChange={(e) =>
                          handleFieldChange(section.id, "bodyEn", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-1 focus:ring-[#C98A3D]"
                      />
                    ) : (
                      <textarea
                        rows={3}
                        value={section.bodyKm}
                        onChange={(e) =>
                          handleFieldChange(section.id, "bodyKm", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-1 focus:ring-[#C98A3D]"
                      />
                    )}
                  </div>

                  {/* Primary & Secondary Buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#3A2418]/10">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#A66A2A] block uppercase">
                        Primary Button
                      </label>
                      <input
                        type="text"
                        value={
                          langTab === "en"
                            ? section.buttonLabelEn
                            : section.buttonLabelKm
                        }
                        onChange={(e) =>
                          handleFieldChange(
                            section.id,
                            langTab === "en" ? "buttonLabelEn" : "buttonLabelKm",
                            e.target.value
                          )
                        }
                        placeholder={`Button Label (${langTab.toUpperCase()})`}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#C98A3D]/30 text-xs text-[#3A2418]"
                      />
                      <input
                        type="text"
                        value={section.buttonLink}
                        onChange={(e) =>
                          handleFieldChange(section.id, "buttonLink", e.target.value)
                        }
                        placeholder="Link URL (/menu, /contact, etc.)"
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#C98A3D]/30 text-xs text-[#3A2418]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#A66A2A] block uppercase">
                        Secondary Button
                      </label>
                      <input
                        type="text"
                        value={
                          langTab === "en"
                            ? section.button2LabelEn
                            : section.button2LabelKm
                        }
                        onChange={(e) =>
                          handleFieldChange(
                            section.id,
                            langTab === "en"
                              ? "button2LabelEn"
                              : "button2LabelKm",
                            e.target.value
                          )
                        }
                        placeholder={`Button 2 Label (${langTab.toUpperCase()})`}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#C98A3D]/30 text-xs text-[#3A2418]"
                      />
                      <input
                        type="text"
                        value={section.button2Link}
                        onChange={(e) =>
                          handleFieldChange(section.id, "button2Link", e.target.value)
                        }
                        placeholder="Link 2 URL (/wholesale, etc.)"
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#C98A3D]/30 text-xs text-[#3A2418]"
                      />
                    </div>
                  </div>

                  {/* Media Assets */}
                  <div className="pt-3 border-t border-[#3A2418]/10 space-y-4">
                    <ImageUpload
                      label="Section Background / Hero Image"
                      value={section.image}
                      onChange={(url) =>
                        handleFieldChange(section.id, "image", url || null)
                      }
                      placeholderText={`NOST ${section.sectionKey}`}
                    />

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#3A2418] flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5 text-[#A66A2A]" />
                        <span>Background Video URL (Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={section.videoUrl || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            section.id,
                            "videoUrl",
                            e.target.value || null
                          )
                        }
                        placeholder="https://...mp4 or YouTube embed"
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#C98A3D]/30 text-xs text-[#3A2418]"
                      />
                    </div>
                  </div>

                  {/* Save button for this section */}
                  <div className="pt-4 border-t border-[#3A2418]/10 flex justify-end">
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => handleSaveSection(section)}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#C98A3D] hover:bg-[#A66A2A] text-[#FBF7F1] font-semibold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving Section…</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>Save {section.sectionKey} Section</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
