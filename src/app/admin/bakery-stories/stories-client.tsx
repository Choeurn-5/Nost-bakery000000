"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { BookOpen, Plus, Trash2, Edit2, Save, X, Loader2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/image-upload";


interface StoryItem {
  id: string | number;
  headingEn: string;
  headingKm?: string | null;
  textEn: string;
  textKm?: string | null;
  image?: string | null;
  layout?: string | null;
  sortOrder: number;
  isVisible: boolean;
}

export function StoriesClient({ initialStories }: { initialStories: StoryItem[] }) {
  const [stories, setStories] = useState<StoryItem[]>(initialStories);
  const [editingItem, setEditingItem] = useState<Partial<StoryItem> | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.headingEn || !editingItem?.textEn) {
      toast.error("Please enter a heading and story text.");
      return;
    }

    setIsPending(true);
    try {
      const res = await api.saveStory(
        editingItem as Record<string, unknown>,
        editingItem.id
      );
      if (res.success && res.data) {
        toast.success("Story block saved!");
        if (editingItem.id) {
          setStories((prev) => prev.map((s) => (s.id === editingItem.id ? res.data : s)));
        } else {
          setStories((prev) => [...prev, res.data]);
        }
        setEditingItem(null);
      } else {
        toast.error(res.error || "Failed to save story block");
      }
    } catch {
      toast.error("Error saving story block");
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this story block?")) return;
    try {
      const res = await api.deleteStory(id);
      if (res.success) {
        toast.success("Story block deleted.");
        setStories((prev) => prev.filter((s) => s.id !== id));
      } else {
        toast.error(res.error || "Failed to delete story block");
      }
    } catch {
      toast.error("Error deleting story block");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-xs text-[#3A2418]/70">
          Showing {stories.length} bakery story and brand philosophy block(s).
        </p>
        <button
          onClick={() =>
            setEditingItem({
              headingEn: "",
              headingKm: "",
              textEn: "",
              textKm: "",
              image: "",
              isVisible: true,
              sortOrder: stories.length,
            })
          }
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C98A3D] text-[#FBF7F1] hover:bg-[#A66A2A] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Story Block</span>
        </button>
      </div>

      {editingItem && (
        <form onSubmit={handleSave} className="p-6 rounded-2xl bg-[#FBF7F1] border border-[#C98A3D]/30 shadow-md space-y-4">
          <div className="flex justify-between items-center border-b border-[#C98A3D]/20 pb-3">
            <h3 className="font-bold font-serif text-base text-[#3A2418]">
              {editingItem.id ? "Edit Story Block" : "Add New Story Block"}
            </h3>
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="p-1 rounded-lg text-[#3A2418]/60 hover:text-[#3A2418]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#3A2418] mb-1">Heading (EN)</label>
              <input
                type="text"
                required
                value={editingItem.headingEn || ""}
                onChange={(e) => setEditingItem({ ...editingItem, headingEn: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#C98A3D]/20 text-[#3A2418]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#3A2418] mb-1">Heading (KM)</label>
              <input
                type="text"
                value={editingItem.headingKm || ""}
                onChange={(e) => setEditingItem({ ...editingItem, headingKm: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#C98A3D]/20 text-[#3A2418]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#3A2418] mb-1">Story Content (EN)</label>
              <textarea
                rows={4}
                required
                value={editingItem.textEn || ""}
                onChange={(e) => setEditingItem({ ...editingItem, textEn: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#C98A3D]/20 text-[#3A2418]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#3A2418] mb-1">Story Content (KM)</label>
              <textarea
                rows={4}
                value={editingItem.textKm || ""}
                onChange={(e) => setEditingItem({ ...editingItem, textKm: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#C98A3D]/20 text-[#3A2418]"
              />
            </div>
          </div>

          <div>
            <ImageUpload
              label="Story Illustration / Photograph (Upload from Device)"
              value={editingItem.image}
              onChange={(url) => setEditingItem({ ...editingItem, image: url })}
              placeholderText="Bakery Craft"
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
              <span>Save Story Block</span>
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {stories.map((story) => (
          <div
            key={story.id}
            className="p-5 rounded-2xl bg-[#F1E6D4] border border-[#C98A3D]/20 shadow-xs hover:border-[#C98A3D]/50 transition-all flex flex-col md:flex-row gap-4 items-start"
          >
            {story.image && (
              <img
                src={story.image}
                alt={story.headingEn}
                className="w-full md:w-48 h-32 object-cover rounded-xl shrink-0"
              />
            )}
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold font-serif text-base text-[#3A2418]">{story.headingEn}</h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingItem(story)}
                    className="p-1.5 rounded-lg text-[#C98A3D] hover:bg-[#FBF7F1]"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(story.id)}
                    className="p-1.5 rounded-lg text-[#9E3B3B] hover:bg-[#9E3B3B]/10"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-[#3A2418]/80 leading-relaxed">{story.textEn}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
