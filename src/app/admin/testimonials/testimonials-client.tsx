"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { MessageSquare, Plus, Trash2, Edit2, Save, X, Loader2, Star } from "lucide-react";

interface TestimonialItem {
  id: string | number;
  name: string;
  textEn: string;
  textKm?: string | null;
  rating: number;
  photo?: string | null;
  isVisible: boolean;
  sortOrder: number;
}

export function TestimonialsClient({ initialItems }: { initialItems: TestimonialItem[] }) {
  const [items, setItems] = useState<TestimonialItem[]>(initialItems);
  const [editingItem, setEditingItem] = useState<Partial<TestimonialItem> | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.name || !editingItem?.textEn) {
      toast.error("Please enter customer name and review text");
      return;
    }

    setIsPending(true);
    try {
      const res = await api.saveTestimonial(
        editingItem as Record<string, unknown>,
        editingItem.id
      );

      if (res.success && res.data) {
        toast.success("Testimonial saved!");
        if (editingItem.id) {
          setItems((prev) => prev.map((item) => (item.id === editingItem.id ? res.data : item)));
        } else {
          setItems((prev) => [...prev, res.data]);
        }
        setEditingItem(null);
      } else {
        toast.error(res.error || "Failed to save testimonial");
      }
    } catch {
      toast.error("Error saving testimonial");
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await api.deleteTestimonial(id);
      if (res.success) {
        toast.success("Review deleted.");
        setItems((prev) => prev.filter((item) => item.id !== id));
      } else {
        toast.error(res.error || "Failed to delete review");
      }
    } catch {
      toast.error("Error deleting review");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-xs text-[#3A2418]/70">
          Showing {items.length} customer review(s).
        </p>
        <button
          onClick={() =>
            setEditingItem({
              name: "",
              textEn: "",
              textKm: "",
              rating: 5,
              isVisible: true,
              sortOrder: items.length,
            })
          }
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C98A3D] text-[#FBF7F1] hover:bg-[#A66A2A] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {editingItem && (
        <form onSubmit={handleSave} className="p-6 rounded-2xl bg-[#FBF7F1] border border-[#C98A3D]/30 shadow-md space-y-4">
          <div className="flex justify-between items-center border-b border-[#C98A3D]/20 pb-2">
            <h3 className="font-bold font-serif text-base text-[#3A2418]">
              {editingItem.id ? "Edit Testimonial" : "Add New Testimonial"}
            </h3>
            <button type="button" onClick={() => setEditingItem(null)} className="p-1 rounded-lg text-[#3A2418]/60">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#3A2418] mb-1">Customer Name</label>
              <input
                type="text"
                required
                value={editingItem.name || ""}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                placeholder="Sarah Jenkins"
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#C98A3D]/20 text-[#3A2418]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#3A2418] mb-1">Star Rating (1 - 5)</label>
              <select
                value={editingItem.rating || 5}
                onChange={(e) => setEditingItem({ ...editingItem, rating: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#C98A3D]/20 text-[#3A2418]"
              >
                <option value={5}>5 Stars ★★★★★</option>
                <option value={4}>4 Stars ★★★★☆</option>
                <option value={3}>3 Stars ★★★☆☆</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3A2418] mb-1">Review Text (EN)</label>
            <textarea
              rows={3}
              required
              value={editingItem.textEn || ""}
              onChange={(e) => setEditingItem({ ...editingItem, textEn: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#C98A3D]/20 text-[#3A2418]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditingItem(null)}
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
              <span>Save Review</span>
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-[#F1E6D4] border border-[#C98A3D]/20 flex flex-col justify-between shadow-xs hover:border-[#C98A3D]/50 transition-all space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#3A2418]">{item.name}</span>
                <div className="flex items-center text-amber-500">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-[#3A2418]/80 leading-relaxed italic">
                &ldquo;{item.textEn}&rdquo;
              </p>
            </div>

            <div className="pt-3 border-t border-[#3A2418]/10 flex items-center justify-end gap-2">
              <button
                onClick={() => setEditingItem(item)}
                className="p-1.5 rounded-lg text-[#C98A3D] hover:bg-[#FBF7F1]"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 rounded-lg text-[#9E3B3B] hover:bg-[#9E3B3B]/10"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
