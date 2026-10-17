"use client";

import { useState } from "react";
import Image from "next/image";
import { Image as ImageIcon, Trash2, Link as LinkIcon, Wand2 } from "lucide-react";
import { placeholderImage } from "@/lib/utils";

interface ImageUploadProps {
  label?: string;
  value?: string | null;
  onChange: (url: string) => void;
  placeholderText?: string;
  helperText?: string;
}

export function ImageUpload({
  label = "Image",
  value,
  onChange,
  placeholderText = "Product Image",
  helperText,
}: ImageUploadProps) {
  const [isOpenInput, setIsOpenInput] = useState(false);
  const [customUrl, setCustomUrl] = useState(value || "");

  const handleApplyUrl = () => {
    onChange(customUrl.trim());
    setIsOpenInput(false);
  };

  const handleGeneratePlaceholder = () => {
    const url = placeholderImage(placeholderText, 800, 600);
    setCustomUrl(url);
    onChange(url);
  };

  const handleClear = () => {
    setCustomUrl("");
    onChange("");
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#3A2418]">
          {label}
        </label>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 bg-[#FBF7F1] rounded-xl border border-[#C98A3D]/20">
        {/* Preview Container */}
        <div className="relative w-24 h-24 rounded-lg bg-[#F1E6D4] overflow-hidden border border-[#3A2418]/10 flex items-center justify-center shrink-0">
          {value ? (
            <Image
              src={value}
              alt={label}
              fill
              className="object-cover"
              sizes="96px"
              unoptimized
            />
          ) : (
            <ImageIcon className="w-8 h-8 text-[#3A2418]/30" />
          )}
        </div>

        {/* Action Controls */}
        <div className="flex-1 space-y-2 w-full">
          {isOpenInput ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="Enter image URL (https://...)"
                className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-white border border-[#C98A3D]/40 text-[#3A2418] focus:outline-none focus:ring-1 focus:ring-[#C98A3D]"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-3 py-1.5 text-xs font-medium bg-[#C98A3D] text-white rounded-lg hover:bg-[#A66A2A] cursor-pointer"
              >
                Set
              </button>
              <button
                type="button"
                onClick={() => setIsOpenInput(false)}
                className="px-2 py-1.5 text-xs text-[#3A2418]/60 hover:text-[#3A2418] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setCustomUrl(value || "");
                  setIsOpenInput(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#F1E6D4] hover:bg-[#soft-butter] text-[#3A2418] border border-[#3A2418]/10 cursor-pointer transition-colors"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>{value ? "Change Image URL" : "Enter Image URL"}</span>
              </button>

              <button
                type="button"
                onClick={handleGeneratePlaceholder}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#C98A3D]/10 hover:bg-[#C98A3D]/20 text-[#A66A2A] cursor-pointer transition-colors"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Sample Placeholder</span>
              </button>

              {value && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-[#9E3B3B] hover:bg-[#9E3B3B]/10 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>
          )}

          {value && (
            <p className="text-[11px] text-[#3A2418]/60 truncate max-w-md">
              {value}
            </p>
          )}

          {helperText && (
            <p className="text-[11px] text-[#3A2418]/50">{helperText}</p>
          )}
        </div>
      </div>
    </div>
  );
}
