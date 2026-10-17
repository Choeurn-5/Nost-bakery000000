"use client";

import { Globe } from "lucide-react";

interface LanguageTabsProps {
  activeTab: "en" | "km";
  onChange: (tab: "en" | "km") => void;
  hasKmValue?: boolean;
}

export function LanguageTabs({
  activeTab,
  onChange,
  hasKmValue = true,
}: LanguageTabsProps) {
  return (
    <div className="flex items-center gap-1.5 p-1 bg-[#F1E6D4] rounded-xl border border-[#C98A3D]/20 w-fit">
      <button
        type="button"
        onClick={() => onChange("en")}
        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
          activeTab === "en"
            ? "bg-[#3A2418] text-[#FBF7F1] shadow-sm"
            : "text-[#3A2418]/70 hover:text-[#3A2418] hover:bg-[#FBF7F1]/60"
        }`}
      >
        <Globe className="w-3.5 h-3.5" />
        <span>English (EN)</span>
      </button>

      <button
        type="button"
        onClick={() => onChange("km")}
        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
          activeTab === "km"
            ? "bg-[#3A2418] text-[#FBF7F1] shadow-sm"
            : "text-[#3A2418]/70 hover:text-[#3A2418] hover:bg-[#FBF7F1]/60"
        }`}
      >
        <span>ភាសាខ្មែរ (KM)</span>
        {!hasKmValue && (
          <span className="w-2 h-2 rounded-full bg-[#9E3B3B] animate-pulse" title="Khmer missing" />
        )}
      </button>
    </div>
  );
}
