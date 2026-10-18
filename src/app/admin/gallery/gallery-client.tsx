"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Image as ImageIcon, Plus, Trash2, Save, X, Loader2 } from "lucide-react";

interface GalleryItem {
  id: string | number;
  url: string;
  captionEn?: string | null;
  captionKm?: string | null;
  showOnHome: boolean;
  sortOrder: number;
}

export function GalleryClient({ initialItems }: { initialItems: GalleryItem[] }) {
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [newItemUrl, setNewItemUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [showOnHome, setShowOnHome] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemUrl.trim()) {
      toast.error("Please enter an image URL");
      return;
    }

    setIsPending(true);
    try {
      const res = await api.saveGalleryItem({
        url: newItemUrl.trim(),
        captionEn: caption.trim() || null,
        showOnHome,
        sortOrder: items.length,
      });

      if (res.success && res.data) {
        toast.success("Image added to gallery!");
        setItems((prev) => [...prev, res.data]);
        setNewItemUrl("");
        setCaption("");
        setShowAddForm(false);
      } else {
        toast.error(res.error || "Failed to add image");
      }
    } catch {
      toast.error("Error adding image");
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;
    try {
      const res = await api.deleteGalleryItem(id);
      if (res.success) {
        toast.success("Photo removed from gallery.");
        setItems((prev) => prev.filter((item) => item.id !== id));
      } else {
        toast.error(res.error || "Failed to delete photo");
      }
    } catch {
      toast.error("Error deleting photo");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-xs text-[#3A2418]/70">
          Showing {items.length} photo(s) in the bakery visual showcase.
        </p>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C98A3D] text-[#FBF7F1] hover:bg-[#A66A2A] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Photo</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="p-6 rounded-2xl bg-[#FBF7F1] border border-[#C98A3D]/30 shadow-md space-y-4">
          <div className="flex justify-between items-center border-b border-[#C98A3D]/20 pb-2">
            <h3 className="font-bold font-serif text-base text-[#3A2418]">Add Photo to Gallery</h3>
            <button type="button" onClick={() => setShowAddForm(false)} className="p-1 rounded-lg text-[#3A2418]/60">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#3A2418] mb-1">Image URL</label>
              <input
                type="text"
                required
                value={newItemUrl}
                onChange={(e) => setNewItemUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#C98A3D]/20 text-[#3A2418]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#3A2418] mb-1">Caption</label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Morning sourdough loaves fresh from the oven"
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#C98A3D]/20 text-[#3A2418]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showOnHome"
              checked={showOnHome}
              onChange={(e) => setShowOnHome(e.target.checked)}
              className="rounded text-[#C98A3D]"
            />
            <label htmlFor="showOnHome" className="text-xs font-medium text-[#3A2418]">
              Feature on Home Page Instagram / Visual Showcase Grid
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#3A2418]/70 hover:bg-[#F1E6D4]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#C98A3D] text-[#FBF7F1] hover:bg-[#A66A2A] text-xs font-bold"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Photo</span>
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-2xl overflow-hidden border border-[#C98A3D]/20 bg-[#F1E6D4] shadow-xs aspect-square flex flex-col justify-between"
          >
            <img
              src={item.url}
              alt={item.captionEn || "NOST Bakery photo"}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
              <span className="self-end px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-[#3A2418]">
                {item.showOnHome ? "Home Grid" : "Gallery Only"}
              </span>

              <div className="flex items-center justify-between text-white">
                <span className="text-[11px] font-medium truncate pr-2">{item.captionEn}</span>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
