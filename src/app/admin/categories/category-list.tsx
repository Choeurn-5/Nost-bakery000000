"use client";

import { useState } from "react";
import Image from "next/image";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
} from "@/app/admin/actions/categories";
import { LanguageTabs } from "@/components/admin/language-tabs";
import { KhmerWarningBadge } from "@/components/admin/khmer-warning-badge";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";
import {
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  ShoppingBag,
  X,
  Loader2,
  FolderPlus,
} from "lucide-react";
import type { Category } from "@prisma/client";

interface CategoryWithCount extends Category {
  _count: {
    products: number;
  };
}

interface CategoryListProps {
  initialCategories: CategoryWithCount[];
}

export function CategoryList({ initialCategories }: CategoryListProps) {
  const [categories, setCategories] = useState<CategoryWithCount[]>(initialCategories);
  const [langTab, setLangTab] = useState<"en" | "km">("en");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null);

  // Modal form states
  const [nameEn, setNameEn] = useState("");
  const [nameKm, setNameKm] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [isPending, setIsPending] = useState(false);

  // Delete dialog state
  const [deleteTarget, setDeleteTarget] = useState<CategoryWithCount | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openCreateModal = () => {
    setEditingCategory(null);
    setNameEn("");
    setNameKm("");
    setSlug("");
    setImage("");
    setIsVisible(true);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryWithCount) => {
    setEditingCategory(cat);
    setNameEn(cat.nameEn);
    setNameKm(cat.nameKm || "");
    setSlug(cat.slug);
    setImage(cat.image || "");
    setIsVisible(cat.isVisible);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      if (editingCategory) {
        const res = await updateCategory(editingCategory.id, {
          nameEn,
          nameKm,
          slug,
          image: image || null,
          isVisible,
        });

        if (!res.success) {
          toast.error(res.error || "Failed to update category");
        } else {
          toast.success("Category updated successfully!");
          setCategories((prev) =>
            prev.map((c) =>
              c.id === editingCategory.id ? { ...c, ...res.data! } : c
            )
          );
          setIsModalOpen(false);
        }
      } else {
        const res = await createCategory({
          nameEn,
          nameKm,
          slug,
          image: image || null,
          isVisible,
        });

        if (!res.success) {
          toast.error(res.error || "Failed to create category");
        } else {
          toast.success("Category created successfully!");
          setCategories((prev) => [
            ...prev,
            { ...res.data!, _count: { products: 0 } },
          ]);
          setIsModalOpen(false);
        }
      }
    } catch {
      toast.error("Failed to save category");
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const res = await deleteCategory(deleteTarget.id);
      if (!res.success) {
        toast.error(res.error || "Failed to delete category");
      } else {
        toast.success(`Category "${deleteTarget.nameEn}" deleted.`);
        setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
        setDeleteTarget(null);
      }
    } catch {
      toast.error("Error occurred while deleting");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const newCategories = [...categories];
    const [moved] = newCategories.splice(index, 1);
    newCategories.splice(targetIndex, 0, moved);

    setCategories(newCategories);

    try {
      const ids = newCategories.map((c) => c.id);
      const res = await reorderCategories(ids);
      if (!res.success) {
        toast.error("Failed to save reorder");
      }
    } catch {
      toast.error("Error saving category order");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#F1E6D4] border border-[#C98A3D]/20 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3A2418]">
            Display View:
          </span>
          <LanguageTabs activeTab={langTab} onChange={setLangTab} />
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C98A3D] hover:bg-[#A66A2A] text-[#FBF7F1] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Category List Table */}
      <div className="bg-[#F1E6D4] rounded-2xl border border-[#C98A3D]/20 overflow-hidden shadow-xs">
        {categories.length === 0 ? (
          <div className="p-10 text-center text-[#3A2418]/60 space-y-3">
            <FolderPlus className="w-10 h-10 text-[#C98A3D] mx-auto opacity-70" />
            <p className="text-sm font-medium">No product categories created yet.</p>
            <button
              onClick={openCreateModal}
              className="text-xs text-[#A66A2A] font-semibold underline"
            >
              Add your first category
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#3A2418]/10">
            {categories.map((cat, idx) => (
              <div
                key={cat.id}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-[#FBF7F1]/60 transition-colors"
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative w-14 h-14 rounded-xl bg-[#FBF7F1] border border-[#3A2418]/10 overflow-hidden shrink-0 flex items-center justify-center">
                    {cat.image ? (
                      <Image
                        src={cat.image}
                        alt={cat.nameEn}
                        fill
                        className="object-cover"
                        sizes="56px"
                        unoptimized
                      />
                    ) : (
                      <ShoppingBag className="w-6 h-6 text-[#C98A3D]/40" />
                    )}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-[#3A2418]">
                        {langTab === "km" && cat.nameKm ? cat.nameKm : cat.nameEn}
                      </span>
                      {langTab === "km" && !cat.nameKm && (
                        <KhmerWarningBadge value={cat.nameKm} />
                      )}
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#3A2418]/5 text-[#3A2418]/70">
                        /{cat.slug}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#3A2418]/60">
                      <span className="inline-flex items-center gap-1">
                        <ShoppingBag className="w-3.5 h-3.5 text-[#C98A3D]" />
                        {cat._count.products} products
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                          cat.isVisible ? "text-emerald-700" : "text-gray-500"
                        }`}
                      >
                        {cat.isVisible ? (
                          <>
                            <Eye className="w-3 h-3" /> Visible
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" /> Hidden
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, "up")}
                    className="p-1.5 text-[#3A2418]/60 hover:text-[#3A2418] rounded-lg hover:bg-[#FBF7F1] disabled:opacity-20 cursor-pointer"
                    title="Move up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    disabled={idx === categories.length - 1}
                    onClick={() => handleMove(idx, "down")}
                    className="p-1.5 text-[#3A2418]/60 hover:text-[#3A2418] rounded-lg hover:bg-[#FBF7F1] disabled:opacity-20 cursor-pointer"
                    title="Move down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 text-[#A66A2A] hover:bg-[#C98A3D]/10 rounded-lg cursor-pointer"
                    title="Edit category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(cat)}
                    className="p-1.5 text-[#9E3B3B] hover:bg-[#9E3B3B]/10 rounded-lg cursor-pointer"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#FBF7F1] rounded-2xl p-6 shadow-2xl border border-[#C98A3D]/20 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#3A2418]/10">
              <h3 className="text-lg font-bold font-serif text-[#3A2418]">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-[#3A2418]/60 hover:text-[#3A2418] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#3A2418]">
                  Category Name (English)
                </label>
                <input
                  type="text"
                  required
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g. Sourdough & Crusty Breads"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-1 focus:ring-[#C98A3D]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#3A2418]">
                    Category Name (Khmer)
                  </label>
                  <KhmerWarningBadge value={nameKm} />
                </div>
                <input
                  type="text"
                  value={nameKm}
                  onChange={(e) => setNameKm(e.target.value)}
                  placeholder="ឧ. នំប៉័ងដំបែធម្មជាតិ"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-1 focus:ring-[#C98A3D]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#3A2418]">
                  URL Slug (Optional - auto generated if blank)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="sourdough-crusty-breads"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-1 focus:ring-[#C98A3D]"
                />
              </div>

              <ImageUpload
                label="Category Cover Image"
                value={image}
                onChange={setImage}
                placeholderText="NOST Category"
              />

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F1E6D4] border border-[#C98A3D]/20">
                <span className="text-xs font-semibold text-[#3A2418]">
                  Visible in Navigation & Catalog
                </span>
                <input
                  type="checkbox"
                  checked={isVisible}
                  onChange={(e) => setIsVisible(e.target.checked)}
                  className="w-4 h-4 accent-[#C98A3D]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#3A2418]/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#3A2418] hover:bg-[#F1E6D4] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#C98A3D] hover:bg-[#A66A2A] text-[#FBF7F1] text-xs font-semibold shadow-xs disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving…</span>
                    </>
                  ) : (
                    <span>{editingCategory ? "Save Changes" : "Create Category"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Category"
        description={`Are you sure you want to delete "${deleteTarget?.nameEn}"? Categories containing active products cannot be removed.`}
        confirmText="Delete Category"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
