"use client";

import { useState, useRef } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  FolderOpen,
  Plus,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Loader2,
  Image as ImageIcon,
  UploadCloud,
  CheckCircle2,
} from "lucide-react";

interface MediaItem {
  id: string | number;
  url: string;
  filename: string;
  mimeType?: string;
  mime_type?: string;
  size?: number | null;
  width?: number | null;
  height?: number | null;
  created_at?: string;
  createdAt?: string;
}

export function MediaClient({ initialMedia }: { initialMedia: MediaItem[] }) {
  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMedia);
  const [copiedId, setCopiedId] = useState<string | number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = (id: string | number, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Image URL copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await uploadFiles(Array.from(files));
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    if (files.length > 0) {
      await uploadFiles(files);
    } else {
      toast.error("Please drop valid image files (JPEG, PNG, WebP, etc.)");
    }
  };

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);
    let successCount = 0;

    for (const file of files) {
      const toastId = toast.loading(`Uploading "${file.name}" to backend storage...`);
      try {
        const res = await api.uploadImage(file);
        if (res.success && res.url) {
          toast.success(`"${file.name}" uploaded successfully!`, { id: toastId });
          const newMedia: MediaItem = {
            id: res.filename || Date.now(),
            url: res.url,
            filename: res.filename || file.name,
            size: res.size || file.size,
            width: res.width,
            height: res.height,
          };
          setMediaList((prev) => [newMedia, ...prev]);
          successCount++;
        } else {
          toast.error(res.error || `Failed to upload "${file.name}"`, { id: toastId });
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Error uploading";
        toast.error(msg, { id: toastId });
      }
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (successCount > 0) {
      toast.success(`${successCount} image(s) saved to backend storage.`);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Are you sure you want to remove this media reference?")) return;
    try {
      const res = await api.deleteMedia(id);
      if (res.success) {
        toast.success("Media deleted");
        setMediaList((prev) => prev.filter((m) => m.id !== id));
      } else {
        toast.error(res.error || "Failed to delete");
      }
    } catch {
      toast.error("Error deleting media");
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden File Input (Supports Multiple File Selection) */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif"
        className="hidden"
      />

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#3A2418]/10 shadow-xs">
        <div>
          <span className="text-sm font-semibold text-[#3A2418]">
            {mediaList.length} Media Asset{mediaList.length === 1 ? "" : "s"}
          </span>
          <p className="text-xs text-[#3A2418]/60 mt-0.5">
            Click copy on any asset to paste into products, categories, stories, or hero sections.
          </p>
        </div>

        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-[#6A9A8A] text-white rounded-lg text-sm font-semibold hover:bg-[#588576] transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-4 h-4" />
              <span>Upload Images from Device</span>
            </>
          )}
        </button>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`p-8 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${
          isDragging
            ? "border-[#6A9A8A] bg-[#6A9A8A]/10 scale-[1.01]"
            : "border-[#C98A3D]/30 bg-[#FAF6F0]/40 hover:border-[#6A9A8A] hover:bg-[#FAF6F0]"
        }`}
      >
        <div className="max-w-md mx-auto space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#FAF6F0] flex items-center justify-center mx-auto text-[#6A9A8A] shadow-xs">
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>
          <h4 className="font-bold font-serif text-base text-[#3A2418]">
            {isUploading ? "Uploading to Backend Storage..." : "Drag & Drop Photos Here, or Browse"}
          </h4>
          <p className="text-xs text-[#3A2418]/60">
            Supports JPEG, PNG, WebP, GIF, SVG, and AVIF up to 25MB each. Multiple files supported.
          </p>
        </div>
      </div>

      {/* Media Grid */}
      {mediaList.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#3A2418]/10 p-12 text-center">
          <FolderOpen className="w-12 h-12 text-[#3A2418]/30 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#3A2418]">No media assets recorded yet</h3>
          <p className="text-sm text-[#3A2418]/60 mt-1 max-w-md mx-auto">
            Click &ldquo;Upload Images from Device&rdquo; to store bakery photos on your backend server.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mediaList.map((media) => {
            const isCopied = copiedId === media.id;
            const isBackend =
              media.url &&
              (media.url.includes("/storage/uploads/") || media.url.includes("/uploads/"));

            return (
              <div
                key={media.id}
                className="group relative bg-white rounded-xl border border-[#3A2418]/10 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="relative aspect-square bg-[#FAF6F0] w-full overflow-hidden">
                  {media.url ? (
                    <img
                      src={media.url}
                      alt={media.filename}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-[#3A2418]/20" />
                    </div>
                  )}

                  {/* Backend badge */}
                  {isBackend && (
                    <span className="absolute top-2 left-2 inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-green-900/80 text-white backdrop-blur-xs">
                      <CheckCircle2 className="w-2.5 h-2.5 text-green-300" /> Backend
                    </span>
                  )}

                  {/* Hover Quick Actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(media.id, media.url)}
                      title="Copy URL"
                      className="p-2 bg-white text-[#3A2418] rounded-lg shadow-sm hover:bg-[#FAF6F0] transition-colors cursor-pointer"
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <a
                      href={media.url}
                      target="_blank"
                      rel="noreferrer"
                      title="Open full size"
                      className="p-2 bg-white text-[#3A2418] rounded-lg shadow-sm hover:bg-[#FAF6F0] transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDelete(media.id)}
                      title="Delete asset"
                      className="p-2 bg-white text-red-600 rounded-lg shadow-sm hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-2.5 flex-1 flex flex-col justify-between">
                  <p
                    className="text-xs font-semibold text-[#3A2418] truncate"
                    title={media.filename}
                  >
                    {media.filename}
                  </p>
                  <p className="text-[10px] text-[#3A2418]/50 truncate mt-0.5">
                    {media.url}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
