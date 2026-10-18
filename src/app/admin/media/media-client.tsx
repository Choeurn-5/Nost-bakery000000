"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { FolderOpen, Plus, Trash2, Copy, Check, ExternalLink, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

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
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newFilename, setNewFilename] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleCopy = (id: string | number, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Image URL copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl || !newFilename) {
      toast.error("Please provide both URL and filename");
      return;
    }

    setIsPending(true);
    try {
      const res = await api.saveMedia({
        url: newUrl,
        filename: newFilename,
        altEn: newFilename,
      });

      if (res.success && res.data) {
        toast.success("Media file recorded!");
        setMediaList((prev) => [res.data, ...prev]);
        setNewUrl("");
        setNewFilename("");
        setIsAdding(false);
      } else {
        toast.error(res.error || "Failed to save media");
      }
    } catch {
      toast.error("Error saving media");
    } finally {
      setIsPending(false);
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
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-[#6A9A8A] text-white rounded-lg text-sm font-semibold hover:bg-[#588576] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Media Asset
        </button>
      </div>

      {/* Add Media Modal / Inline Form */}
      {isAdding && (
        <form
          onSubmit={handleAddMedia}
          className="bg-white p-6 rounded-xl border-2 border-[#6A9A8A]/30 shadow-sm space-y-4"
        >
          <h3 className="text-base font-bold text-[#3A2418] font-serif">
            Register Media Asset
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#3A2418] uppercase tracking-wider mb-1">
                Asset Name / Filename
              </label>
              <input
                type="text"
                required
                value={newFilename}
                onChange={(e) => setNewFilename(e.target.value)}
                placeholder="e.g. sourdough-country-loaf.jpg"
                className="w-full px-3.5 py-2 rounded-lg border border-[#3A2418]/20 bg-[#FAF6F0]/30 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#6A9A8A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3A2418] uppercase tracking-wider mb-1">
                Image or Asset URL
              </label>
              <input
                type="url"
                required
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or Cloudinary URL"
                className="w-full px-3.5 py-2 rounded-lg border border-[#3A2418]/20 bg-[#FAF6F0]/30 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#6A9A8A]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-sm text-[#3A2418]/70 hover:bg-[#FAF6F0] rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 bg-[#3A2418] text-white rounded-lg text-sm font-semibold hover:bg-[#3A2418]/90 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Asset"}
            </button>
          </div>
        </form>
      )}

      {/* Media Grid */}
      {mediaList.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#3A2418]/10 p-12 text-center">
          <FolderOpen className="w-12 h-12 text-[#3A2418]/30 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#3A2418]">No media assets recorded yet</h3>
          <p className="text-sm text-[#3A2418]/60 mt-1 max-w-md mx-auto">
            Add images and photography here to organize assets for easy reuse across all pages and product listings.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mediaList.map((media) => {
            const isCopied = copiedId === media.id;
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

                  {/* Hover Quick Actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(media.id, media.url)}
                      title="Copy URL"
                      className="p-2 bg-white text-[#3A2418] rounded-lg shadow-sm hover:bg-[#FAF6F0] transition-colors"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
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
                      className="p-2 bg-white text-red-600 rounded-lg shadow-sm hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-2.5 flex-1 flex flex-col justify-between">
                  <p className="text-xs font-semibold text-[#3A2418] truncate" title={media.filename}>
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
