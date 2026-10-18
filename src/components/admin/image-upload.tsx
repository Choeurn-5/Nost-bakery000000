"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  Trash2,
  Link as LinkIcon,
  Wand2,
  UploadCloud,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { placeholderImage } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";

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
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      await uploadFile(file);
    } else if (file) {
      toast.error("Please drop a valid image file (JPEG, PNG, WebP, etc.)");
    }
  };

  const uploadFile = async (file: File) => {
    // Validate file size limit on client before sending (e.g., 25MB)
    if (file.size > 25 * 1024 * 1024) {
      toast.error("Image file is too large. Maximum size is 25MB.");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading(`Uploading "${file.name}" to backend storage...`);

    try {
      const res = await api.uploadImage(file);

      if (res.success && res.url) {
        toast.success("Image uploaded from device successfully!", { id: toastId });
        setCustomUrl(res.url);
        onChange(res.url);
      } else {
        toast.error(res.error || "Failed to upload image to backend storage.", { id: toastId });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload error";
      toast.error(msg, { id: toastId });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const isBackendImage = value && (value.includes("/storage/uploads/") || value.includes("/uploads/"));

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#3A2418]">
          {label}
        </label>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif"
        className="hidden"
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 bg-[#FBF7F1] rounded-xl border transition-colors ${
          isDragging
            ? "border-[#6A9A8A] bg-[#6A9A8A]/10 ring-2 ring-[#6A9A8A]/30"
            : "border-[#C98A3D]/20 hover:border-[#C98A3D]/40"
        }`}
      >
        {/* Preview Container */}
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          title="Click to select image from device"
          className="relative w-24 h-24 rounded-lg bg-[#F1E6D4] overflow-hidden border border-[#3A2418]/10 flex items-center justify-center shrink-0 cursor-pointer group"
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center p-2 text-center">
              <Loader2 className="w-6 h-6 text-[#6A9A8A] animate-spin mb-1" />
              <span className="text-[10px] font-semibold text-[#3A2418]/70">Uploading...</span>
            </div>
          ) : value ? (
            <>
              <Image
                src={value}
                alt={label}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                sizes="96px"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-medium text-center p-1">
                Change Photo
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-[#3A2418]/40 group-hover:text-[#6A9A8A] transition-colors p-1 text-center">
              <UploadCloud className="w-6 h-6 mb-1" />
              <span className="text-[9px] font-medium leading-tight">Choose File</span>
            </div>
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
                className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-white border border-[#C98A3D]/40 text-[#3A2418] focus:outline-hidden focus:ring-1 focus:ring-[#C98A3D]"
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
              {/* Primary Upload from Device Button */}
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#6A9A8A] hover:bg-[#588576] text-white shadow-xs cursor-pointer transition-colors disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload from Device</span>
                  </>
                )}
              </button>

              {/* Paste URL Option */}
              <button
                type="button"
                onClick={() => {
                  setCustomUrl(value || "");
                  setIsOpenInput(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#F1E6D4] hover:bg-[#EBDDC7] text-[#3A2418] border border-[#3A2418]/10 cursor-pointer transition-colors"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Paste Link</span>
              </button>

              {/* Placeholder Option */}
              <button
                type="button"
                onClick={handleGeneratePlaceholder}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#C98A3D]/10 hover:bg-[#C98A3D]/20 text-[#A66A2A] cursor-pointer transition-colors"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Sample</span>
              </button>

              {/* Clear / Remove */}
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

          {/* Stored Location & Preview Link */}
          {value && (
            <div className="flex items-center gap-2 max-w-md">
              {isBackendImage && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-green-100 text-green-800 shrink-0">
                  <CheckCircle2 className="w-3 h-3" /> Backend Storage
                </span>
              )}
              <p className="text-[11px] text-[#3A2418]/60 truncate" title={value}>
                {value}
              </p>
            </div>
          )}

          <p className="text-[11px] text-[#3A2418]/50">
            {helperText || "PNG, JPG, WebP, GIF or SVG up to 25MB. Drag & drop or click Upload to pick from your computer or phone."}
          </p>
        </div>
      </div>
    </div>
  );
}
