"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createProduct, updateProduct } from "@/app/admin/actions/products";
import { LanguageTabs } from "@/components/admin/language-tabs";
import { KhmerWarningBadge } from "@/components/admin/khmer-warning-badge";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  Trash2,
  Sparkles,
  ShoppingBag,
  Layers,
  Tag,
} from "lucide-react";
import {
  ProductBadge,
  Availability,
  ChannelTag,
  ContentStatus,
  type Category,
  type Product,
  type ProductImage,
} from "@prisma/client";

interface ProductWithRelations extends Product {
  category?: Category;
  images: ProductImage[];
}

interface ProductEditorProps {
  initialProduct?: ProductWithRelations | null;
  categories: Category[];
}

interface ImageInput {
  url: string;
  altEn: string;
  altKm: string;
}

export function ProductEditor({ initialProduct, categories }: ProductEditorProps) {
  const router = useRouter();
  const [langTab, setLangTab] = useState<"en" | "km">("en");
  const [isPending, setIsPending] = useState(false);

  // Form states
  const [nameEn, setNameEn] = useState(initialProduct?.nameEn || "");
  const [nameKm, setNameKm] = useState(initialProduct?.nameKm || "");
  const [slug, setSlug] = useState(initialProduct?.slug || "");
  const [descriptionEn, setDescriptionEn] = useState(initialProduct?.descriptionEn || "");
  const [descriptionKm, setDescriptionKm] = useState(initialProduct?.descriptionKm || "");
  const [price, setPrice] = useState<string>(
    initialProduct?.price != null ? String(initialProduct.price) : ""
  );
  const [categoryId, setCategoryId] = useState(
    initialProduct?.categoryId || (categories[0]?.id || "")
  );

  const [badges, setBadges] = useState<ProductBadge[]>(
    initialProduct?.badges || []
  );
  const [availability, setAvailability] = useState<Availability>(
    initialProduct?.availability || Availability.AVAILABLE
  );
  const [channelTags, setChannelTags] = useState<ChannelTag[]>(
    initialProduct?.channelTags && initialProduct.channelTags.length > 0
      ? initialProduct.channelTags
      : [ChannelTag.RETAIL]
  );
  const [isFeatured, setIsFeatured] = useState(initialProduct?.isFeatured || false);
  const [status, setStatus] = useState<ContentStatus>(
    initialProduct?.status || ContentStatus.PUBLISHED
  );

  // Multiple Images
  const [images, setImages] = useState<ImageInput[]>(
    initialProduct?.images && initialProduct.images.length > 0
      ? initialProduct.images.map((img) => ({
          url: img.url,
          altEn: img.altEn || "",
          altKm: img.altKm || "",
        }))
      : [{ url: "", altEn: "", altKm: "" }]
  );

  const toggleBadge = (badge: ProductBadge) => {
    setBadges((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  };

  const toggleChannelTag = (tag: ChannelTag) => {
    setChannelTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddImageSlot = () => {
    setImages([...images, { url: "", altEn: "", altKm: "" }]);
  };

  const handleImageChange = (index: number, field: keyof ImageInput, val: string) => {
    const updated = [...images];
    updated[index] = { ...updated[index], [field]: val };
    setImages(updated);
  };

  const handleRemoveImageSlot = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameEn.trim()) {
      toast.error("Please enter an English product name");
      return;
    }

    if (!categoryId) {
      toast.error("Please choose a category");
      return;
    }

    setIsPending(true);

    const validImages = images
      .filter((img) => img.url.trim().length > 0)
      .map((img, idx) => ({
        url: img.url.trim(),
        altEn: img.altEn.trim() || nameEn,
        altKm: img.altKm.trim() || nameKm,
        sortOrder: idx,
      }));

    try {
      if (initialProduct?.id) {
        const res = await updateProduct(initialProduct.id, {
          nameEn,
          nameKm,
          slug: slug.trim() || undefined,
          descriptionEn,
          descriptionKm,
          price: price.trim() ? parseFloat(price) : null,
          categoryId,
          badges,
          availability,
          channelTags,
          isFeatured,
          status,
          images: validImages,
        });

        if (!res.success) {
          toast.error(res.error || "Failed to update product");
        } else {
          toast.success("Product updated successfully!");
          router.push("/admin/products");
          router.refresh();
        }
      } else {
        const res = await createProduct({
          nameEn,
          nameKm,
          slug: slug.trim() || undefined,
          descriptionEn,
          descriptionKm,
          price: price.trim() ? parseFloat(price) : null,
          categoryId,
          badges,
          availability,
          channelTags,
          isFeatured,
          status,
          images: validImages,
        });

        if (!res.success) {
          toast.error(res.error || "Failed to create product");
        } else {
          toast.success("Product created successfully!");
          router.push("/admin/products");
          router.refresh();
        }
      }
    } catch {
      toast.error("An error occurred while saving the product");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-2xl bg-[#F1E6D4] border border-[#C98A3D]/20 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-xl text-[#3A2418] hover:bg-[#FBF7F1] transition-colors"
            title="Back to products list"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-lg font-bold font-serif text-[#3A2418]">
              {initialProduct ? `Edit "${initialProduct.nameEn}"` : "Create New Bakery Item"}
            </h2>
            <p className="text-xs text-[#3A2418]/60">
              Fill in product pricing, categorization, photos and bilingual descriptions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LanguageTabs
            activeTab={langTab}
            onChange={setLangTab}
            hasKmValue={Boolean(nameKm)}
          />

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#C98A3D] hover:bg-[#A66A2A] text-[#FBF7F1] text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving…</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{initialProduct ? "Save Changes" : "Publish Product"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Core Product Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Details Box */}
          <div className="p-6 rounded-2xl bg-[#F1E6D4] border border-[#C98A3D]/20 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-[#3A2418]">
              Product Title & Description
            </h3>

            {/* Name EN/KM */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#3A2418]">
                  Product Name ({langTab.toUpperCase()})
                </label>
                {langTab === "km" && <KhmerWarningBadge value={nameKm} />}
              </div>

              {langTab === "en" ? (
                <input
                  type="text"
                  required
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g. Classic Butter Croissant"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-1 focus:ring-[#C98A3D]"
                />
              ) : (
                <input
                  type="text"
                  value={nameKm}
                  onChange={(e) => setNameKm(e.target.value)}
                  placeholder="ឧ. នំខ្វាសង់ប័រពិសេស"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-1 focus:ring-[#C98A3D]"
                />
              )}
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#3A2418]">
                URL Slug (Optional - auto-generated from name if left empty)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="classic-butter-croissant"
                className="w-full px-3.5 py-2 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-xs text-[#3A2418] focus:outline-none focus:ring-1 focus:ring-[#C98A3D]"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#3A2418]">
                  Product Description ({langTab.toUpperCase()})
                </label>
                {langTab === "km" && <KhmerWarningBadge value={descriptionKm} />}
              </div>

              {langTab === "en" ? (
                <textarea
                  rows={4}
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder="Flaky, buttery layers baked fresh each morning using imported French butter..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-1 focus:ring-[#C98A3D]"
                />
              ) : (
                <textarea
                  rows={4}
                  value={descriptionKm}
                  onChange={(e) => setDescriptionKm(e.target.value)}
                  placeholder="ស្រទាប់ស្រួយ និងឈ្ងុយប័រ ដុតថ្មីៗជារៀងរាល់ព្រឹក..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-1 focus:ring-[#C98A3D]"
                />
              )}
            </div>
          </div>

          {/* Multiple Image Gallery Upload Box */}
          <div className="p-6 rounded-2xl bg-[#F1E6D4] border border-[#C98A3D]/20 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-[#3A2418]">
                Product Photos & Media
              </h3>
              <button
                type="button"
                onClick={handleAddImageSlot}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#A66A2A] hover:text-[#3A2418]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Image Slot</span>
              </button>
            </div>

            <div className="space-y-4">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/20 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#A66A2A]">
                      Image #{idx + 1} {idx === 0 && "(Primary Cover)"}
                    </span>
                    {images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImageSlot(idx)}
                        className="text-[#9E3B3B] hover:bg-[#9E3B3B]/10 p-1 rounded-lg"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <ImageUpload
                    label=""
                    value={img.url}
                    onChange={(url) => handleImageChange(idx, "url", url)}
                    placeholderText={nameEn || "NOST Product"}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <input
                      type="text"
                      value={img.altEn}
                      onChange={(e) => handleImageChange(idx, "altEn", e.target.value)}
                      placeholder="Alt text (English)"
                      className="px-3 py-1.5 rounded-lg bg-white border border-[#C98A3D]/30 text-xs text-[#3A2418]"
                    />
                    <input
                      type="text"
                      value={img.altKm}
                      onChange={(e) => handleImageChange(idx, "altKm", e.target.value)}
                      placeholder="Alt text (Khmer)"
                      className="px-3 py-1.5 rounded-lg bg-white border border-[#C98A3D]/30 text-xs text-[#3A2418]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Product Attributes, Price, Categories, Status */}
        <div className="space-y-6">
          {/* Status & Category Card */}
          <div className="p-6 rounded-2xl bg-[#F1E6D4] border border-[#C98A3D]/20 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-[#3A2418]">
              Publishing & Category
            </h3>

            {/* Publishing Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#3A2418]">
                Publishing Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ContentStatus)}
                className="w-full px-3 py-2 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-xs text-[#3A2418] font-semibold cursor-pointer"
              >
                <option value={ContentStatus.PUBLISHED}>Published (Live Online)</option>
                <option value={ContentStatus.DRAFT}>Draft (Internal Only)</option>
                <option value={ContentStatus.SCHEDULED}>Scheduled</option>
                <option value={ContentStatus.TRASHED}>Trashed</option>
              </select>
            </div>

            {/* Category Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#3A2418]">
                Category
              </label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-xs text-[#3A2418] cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#3A2418]">
                Unit Price (USD $)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A66A2A] font-bold text-xs">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="2.50"
                  className="w-full pl-7 pr-4 py-2 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-xs font-bold text-[#3A2418] focus:outline-none focus:ring-1 focus:ring-[#C98A3D]"
                />
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#3A2418]">
                Availability
              </label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value as Availability)}
                className="w-full px-3 py-2 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-xs text-[#3A2418] cursor-pointer"
              >
                <option value={Availability.AVAILABLE}>Available (In Stock)</option>
                <option value={Availability.SOLD_OUT}>Sold Out for Today</option>
                <option value={Availability.HIDDEN}>Hidden / Unavailable</option>
              </select>
            </div>

            {/* Featured toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/20">
              <span className="text-xs font-semibold text-[#3A2418] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#C98A3D]" />
                <span>Featured Product</span>
              </span>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 accent-[#C98A3D]"
              />
            </div>
          </div>

          {/* Badges Box */}
          <div className="p-6 rounded-2xl bg-[#F1E6D4] border border-[#C98A3D]/20 space-y-3 shadow-xs">
            <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-[#3A2418]">
              Promotional Badges
            </h3>

            <div className="space-y-2">
              {[
                { id: ProductBadge.NEW, label: "New Arrival" },
                { id: ProductBadge.BEST_SELLER, label: "Best Seller" },
                { id: ProductBadge.SEASONAL, label: "Seasonal Special" },
                { id: ProductBadge.FEATURED, label: "Chef's Feature" },
              ].map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/10 cursor-pointer text-xs font-medium text-[#3A2418]"
                >
                  <input
                    type="checkbox"
                    checked={badges.includes(item.id)}
                    onChange={() => toggleBadge(item.id)}
                    className="w-4 h-4 accent-[#C98A3D]"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Channel Tags */}
          <div className="p-6 rounded-2xl bg-[#F1E6D4] border border-[#C98A3D]/20 space-y-3 shadow-xs">
            <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-[#3A2418]">
              Distribution Channels
            </h3>

            <div className="space-y-2">
              {[
                { id: ChannelTag.RETAIL, label: "Retail / Café Counter" },
                { id: ChannelTag.WHOLESALE, label: "Wholesale Supply" },
                { id: ChannelTag.FROZEN, label: "Frozen / Ready-to-Bake" },
              ].map((channel) => (
                <label
                  key={channel.id}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/10 cursor-pointer text-xs font-medium text-[#3A2418]"
                >
                  <input
                    type="checkbox"
                    checked={channelTags.includes(channel.id)}
                    onChange={() => toggleChannelTag(channel.id)}
                    className="w-4 h-4 accent-[#C98A3D]"
                  />
                  <span>{channel.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
