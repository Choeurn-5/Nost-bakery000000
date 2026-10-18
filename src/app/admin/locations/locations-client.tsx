"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { MapPin, Plus, Trash2, Edit2, Save, X, Loader2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/image-upload";


interface LocationItem {
  id: string | number;
  nameEn: string;
  nameKm?: string | null;
  addressEn: string;
  addressKm?: string | null;
  hoursEn?: string | null;
  hoursKm?: string | null;
  image?: string | null;
  mapEmbedUrl?: string | null;
  directionsLink?: string | null;
  isVisible: boolean;
  sortOrder: number;
}

export function LocationsClient({ initialLocations }: { initialLocations: LocationItem[] }) {
  const [locations, setLocations] = useState<LocationItem[]>(initialLocations);
  const [editingItem, setEditingItem] = useState<Partial<LocationItem> | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.nameEn || !editingItem?.addressEn) {
      toast.error("Please enter a name and address.");
      return;
    }

    setIsPending(true);
    try {
      const res = await api.saveLocation(
        editingItem as Record<string, unknown>,
        editingItem.id
      );
      if (res.success && res.data) {
        toast.success("Location saved successfully!");
        if (editingItem.id) {
          setLocations((prev) => prev.map((loc) => (loc.id === editingItem.id ? res.data : loc)));
        } else {
          setLocations((prev) => [...prev, res.data]);
        }
        setEditingItem(null);
      } else {
        toast.error(res.error || "Failed to save location");
      }
    } catch {
      toast.error("Error saving location");
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this location?")) return;
    try {
      const res = await api.deleteLocation(id);
      if (res.success) {
        toast.success("Location deleted.");
        setLocations((prev) => prev.filter((loc) => loc.id !== id));
      } else {
        toast.error(res.error || "Failed to delete location");
      }
    } catch {
      toast.error("Error deleting location");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-xs text-[#3A2418]/70">
          Showing {locations.length} bakery branch location(s).
        </p>
        <button
          onClick={() =>
            setEditingItem({
              nameEn: "",
              nameKm: "",
              addressEn: "",
              addressKm: "",
              hoursEn: "Open Daily 6:30 AM – 7:30 PM",
              hoursKm: "",
              isVisible: true,
              sortOrder: locations.length,
            })
          }
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C98A3D] text-[#FBF7F1] hover:bg-[#A66A2A] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Location</span>
        </button>
      </div>

      {editingItem && (
        <form onSubmit={handleSave} className="p-6 rounded-2xl bg-[#FBF7F1] border border-[#C98A3D]/30 shadow-md space-y-4">
          <div className="flex justify-between items-center border-b border-[#C98A3D]/20 pb-3">
            <h3 className="font-bold font-serif text-base text-[#3A2418]">
              {editingItem.id ? "Edit Bakery Location" : "Add New Bakery Location"}
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
              <label className="block text-xs font-semibold text-[#3A2418] mb-1">Location Name (EN)</label>
              <input
                type="text"
                required
                value={editingItem.nameEn || ""}
                onChange={(e) => setEditingItem({ ...editingItem, nameEn: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#C98A3D]/20 text-[#3A2418]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#3A2418] mb-1">Location Name (KM)</label>
              <input
                type="text"
                value={editingItem.nameKm || ""}
                onChange={(e) => setEditingItem({ ...editingItem, nameKm: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#C98A3D]/20 text-[#3A2418]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#3A2418] mb-1">Address (EN)</label>
              <input
                type="text"
                required
                value={editingItem.addressEn || ""}
                onChange={(e) => setEditingItem({ ...editingItem, addressEn: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#C98A3D]/20 text-[#3A2418]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#3A2418] mb-1">Address (KM)</label>
              <input
                type="text"
                value={editingItem.addressKm || ""}
                onChange={(e) => setEditingItem({ ...editingItem, addressKm: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#C98A3D]/20 text-[#3A2418]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#3A2418] mb-1">Opening Hours (EN)</label>
              <input
                type="text"
                value={editingItem.hoursEn || ""}
                onChange={(e) => setEditingItem({ ...editingItem, hoursEn: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#C98A3D]/20 text-[#3A2418]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#3A2418] mb-1">Google Maps / Directions Link</label>
              <input
                type="text"
                value={editingItem.directionsLink || ""}
                onChange={(e) => setEditingItem({ ...editingItem, directionsLink: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#C98A3D]/20 text-[#3A2418]"
              />
            </div>
          </div>

          <div>
            <ImageUpload
              label="Branch Photo / Storefront (Upload from Device)"
              value={editingItem.image}
              onChange={(url) => setEditingItem({ ...editingItem, image: url })}
              placeholderText="Branch Storefront"
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
              <span>Save Location</span>
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="p-5 rounded-2xl bg-[#F1E6D4] border border-[#C98A3D]/20 flex flex-col justify-between shadow-xs hover:border-[#C98A3D]/50 transition-all space-y-3"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C98A3D]" />
                  <span className="font-bold text-base text-[#3A2418]">{loc.nameEn}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${loc.isVisible ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                  {loc.isVisible ? "Visible" : "Hidden"}
                </span>
              </div>
              <p className="text-xs text-[#3A2418]/80 mt-1">{loc.addressEn}</p>
              {loc.hoursEn && <p className="text-xs text-[#A66A2A] font-medium mt-1">🕒 {loc.hoursEn}</p>}
            </div>

            <div className="pt-3 border-t border-[#3A2418]/10 flex items-center justify-end gap-2">
              <button
                onClick={() => setEditingItem(loc)}
                className="p-1.5 rounded-lg text-[#C98A3D] hover:bg-[#FBF7F1] transition-colors"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(loc.id)}
                className="p-1.5 rounded-lg text-[#9E3B3B] hover:bg-[#9E3B3B]/10 transition-colors"
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
