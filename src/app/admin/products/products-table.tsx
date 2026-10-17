"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { deleteProduct } from "@/app/admin/actions/products";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  ShoppingBag,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import type { Product, Category, ProductImage, ContentStatus, Availability, ProductBadge } from "@prisma/client";

interface ProductWithRelations extends Product {
  category: Category;
  images: ProductImage[];
}

interface ProductsTableProps {
  products: ProductWithRelations[];
  categories: Category[];
}

export function ProductsTable({ products: initialProducts, categories }: ProductsTableProps) {
  const [products, setProducts] = useState<ProductWithRelations[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [deleteTarget, setDeleteTarget] = useState<ProductWithRelations | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.nameKm.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "ALL" || p.categoryId === selectedCategory;

      const matchesStatus =
        selectedStatus === "ALL" || p.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, selectedCategory, selectedStatus]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const isTrashed = deleteTarget.status === "TRASHED";
      const res = await deleteProduct(deleteTarget.id, isTrashed);

      if (!res.success) {
        toast.error(res.error || "Failed to delete product");
      } else {
        if (isTrashed) {
          toast.success(`Product "${deleteTarget.nameEn}" permanently deleted.`);
          setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        } else {
          toast.success(`Product "${deleteTarget.nameEn}" moved to Trash.`);
          setProducts((prev) =>
            prev.map((p) =>
              p.id === deleteTarget.id ? { ...p, status: "TRASHED" as ContentStatus } : p
            )
          );
        }
        setDeleteTarget(null);
      }
    } catch {
      toast.error("An error occurred while deleting.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search, Filter & Action Bar */}
      <div className="p-4 rounded-2xl bg-[#F1E6D4] border border-[#C98A3D]/20 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A66A2A]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product name or slug…"
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-xs text-[#3A2418] placeholder-[#3A2418]/50 focus:outline-none focus:ring-1 focus:ring-[#C98A3D]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-[#FBF7F1] px-2.5 py-1.5 rounded-xl border border-[#C98A3D]/30 text-xs">
            <Filter className="w-3.5 h-3.5 text-[#A66A2A]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-[#3A2418] focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-[#FBF7F1] px-2.5 py-1.5 rounded-xl border border-[#C98A3D]/30 text-xs">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-[#3A2418] focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="TRASHED">Trash</option>
            </select>
          </div>

          {/* New Product Button */}
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C98A3D] hover:bg-[#A66A2A] text-[#FBF7F1] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-[#F1E6D4] rounded-2xl border border-[#C98A3D]/20 overflow-hidden shadow-xs">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-[#3A2418]/60 space-y-3">
            <ShoppingBag className="w-10 h-10 text-[#C98A3D] mx-auto opacity-70" />
            <p className="text-sm font-medium">No products match your search/filter criteria.</p>
            <Link
              href="/admin/products/new"
              className="text-xs text-[#A66A2A] font-semibold underline block"
            >
              Create a new product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#C98A3D]/20 bg-[#FBF7F1]/80 text-[#3A2418]/70 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Badges & Availability</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3A2418]/10">
                {filteredProducts.map((product) => {
                  const thumbnail = product.images[0]?.url;

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-[#FBF7F1]/60 transition-colors"
                    >
                      {/* Thumbnail & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl bg-[#FBF7F1] border border-[#3A2418]/10 overflow-hidden shrink-0 flex items-center justify-center">
                            {thumbnail ? (
                              <Image
                                src={thumbnail}
                                alt={product.nameEn}
                                fill
                                className="object-cover"
                                sizes="48px"
                                unoptimized
                              />
                            ) : (
                              <ShoppingBag className="w-5 h-5 text-[#C98A3D]/50" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-[#3A2418]">
                              {product.nameEn}
                            </div>
                            {product.nameKm && (
                              <div className="text-[11px] text-[#3A2418]/60">
                                {product.nameKm}
                              </div>
                            )}
                            <div className="text-[10px] text-[#A66A2A]">
                              /{product.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[#3A2418]/5 text-[#3A2418] border border-[#3A2418]/10">
                          {product.category?.nameEn || "Uncategorized"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-bold text-[#3A2418]">
                        {formatPrice(product.price) || "Inquire"}
                      </td>

                      {/* Badges & Availability */}
                      <td className="py-3 px-4 space-y-1">
                        <div className="flex flex-wrap gap-1">
                          {product.badges.map((badge: ProductBadge) => (
                            <span
                              key={badge}
                              className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#C98A3D]/10 text-[#A66A2A] border border-[#C98A3D]/20"
                            >
                              {badge.replace("_", " ")}
                            </span>
                          ))}
                        </div>
                        <span
                          className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                            product.availability === "AVAILABLE"
                              ? "text-emerald-700 bg-emerald-500/10"
                              : product.availability === "SOLD_OUT"
                              ? "text-red-700 bg-red-500/10"
                              : "text-gray-600 bg-gray-500/10"
                          }`}
                        >
                          {product.availability}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            product.status === "PUBLISHED"
                              ? "bg-emerald-600/10 text-emerald-800 border border-emerald-600/20"
                              : product.status === "DRAFT"
                              ? "bg-amber-600/10 text-amber-800 border border-amber-600/20"
                              : product.status === "TRASHED"
                              ? "bg-red-600/10 text-red-800 border border-red-600/20"
                              : "bg-blue-600/10 text-blue-800 border border-blue-600/20"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="p-1.5 text-[#A66A2A] hover:bg-[#C98A3D]/10 rounded-lg"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setDeleteTarget(product)}
                            className="p-1.5 text-[#9E3B3B] hover:bg-[#9E3B3B]/10 rounded-lg cursor-pointer"
                            title={product.status === "TRASHED" ? "Delete permanently" : "Move to Trash"}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title={deleteTarget?.status === "TRASHED" ? "Permanently Delete Product" : "Move Product to Trash"}
        description={
          deleteTarget?.status === "TRASHED"
            ? `Are you sure you want to permanently delete "${deleteTarget?.nameEn}"? This action cannot be undone.`
            : `Are you sure you want to move "${deleteTarget?.nameEn}" to the trash? It will be hidden from the online store.`
        }
        confirmText={deleteTarget?.status === "TRASHED" ? "Delete Forever" : "Move to Trash"}
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
