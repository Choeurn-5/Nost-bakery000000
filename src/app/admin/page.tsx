import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { api } from "@/lib/api";
import {
  Inbox,
  ShoppingBag,
  Tag,
  Grid3x3,
  Plus,
  Megaphone,
  ArrowRight,
  Clock,
  Phone,
  Mail,
  CheckCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let newEnquiriesCount = 0;
  let publishedProductsCount = 0;
  let activePromotionsCount = 0;
  let categoriesCount = 0;
  let recentSubmissions: any[] = [];

  try {
    const [
      enquiries,
      products,
      promos,
      cats,
      submissions,
    ] = await Promise.all([
      prisma.formSubmission.count({ where: { status: "NEW" } }),
      prisma.product.count({ where: { status: "PUBLISHED" } }),
      prisma.promotion.count({ where: { status: "PUBLISHED" } }),
      prisma.category.count(),
      prisma.formSubmission.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
    ]);
    newEnquiriesCount = enquiries;
    publishedProductsCount = products;
    activePromotionsCount = promos;
    categoriesCount = cats;
    recentSubmissions = submissions;
  } catch {
    try {
      const [prods, cats, promos] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getPromotions(),
      ]);
      publishedProductsCount = prods?.length ?? 0;
      categoriesCount = cats?.length ?? 0;
      activePromotionsCount = promos?.length ?? 0;
    } catch {
      // offline fallback
    }
  }

  const statCards = [
    {
      title: "New Enquiries",
      count: newEnquiriesCount,
      icon: Inbox,
      color: "bg-[#9E3B3B]/10 text-[#9E3B3B] border-[#9E3B3B]/20",
      href: "/admin/inbox",
      badge: newEnquiriesCount > 0 ? `${newEnquiriesCount} unread` : "Up to date",
    },
    {
      title: "Published Products",
      count: publishedProductsCount,
      icon: ShoppingBag,
      color: "bg-[#C98A3D]/10 text-[#C98A3D] border-[#C98A3D]/20",
      href: "/admin/products",
      badge: "In Catalog",
    },
    {
      title: "Active Promotions",
      count: activePromotionsCount,
      icon: Tag,
      color: "bg-[#A66A2A]/10 text-[#A66A2A] border-[#A66A2A]/20",
      href: "/admin/promotions",
      badge: "Live Offers",
    },
    {
      title: "Categories",
      count: categoriesCount,
      icon: Grid3x3,
      color: "bg-[#3A2418]/10 text-[#3A2418] border-[#3A2418]/20",
      href: "/admin/categories",
      badge: "Active",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title & Intro */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#3A2418]">
            Dashboard Overview
          </h1>
          <p className="text-sm text-[#3A2418]/70 mt-1">
            Welcome to the NOST Bakery & Pastry CMS control center.
          </p>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#C98A3D] text-[#FBF7F1] hover:bg-[#A66A2A] shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
          <Link
            href="/admin/announcement"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#F1E6D4] text-[#3A2418] hover:bg-[#soft-butter] border border-[#C98A3D]/20 transition-colors"
          >
            <Megaphone className="w-4 h-4 text-[#A66A2A]" />
            <span>Edit Announcement</span>
          </Link>
          <Link
            href="/admin/promotions/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#F1E6D4] text-[#3A2418] hover:bg-[#soft-butter] border border-[#C98A3D]/20 transition-colors"
          >
            <Tag className="w-4 h-4 text-[#A66A2A]" />
            <span>New Promotion</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="p-5 rounded-2xl bg-[#F1E6D4] border border-[#C98A3D]/20 hover:border-[#C98A3D] shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-[#3A2418]/70">
                    {stat.title}
                  </span>
                  <div className="text-3xl font-bold font-serif text-[#3A2418] mt-1">
                    {stat.count}
                  </div>
                </div>
                <div className={`p-3 rounded-xl border ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#3A2418]/10 flex items-center justify-between text-xs">
                <span className="text-[#3A2418]/60 font-medium">{stat.badge}</span>
                <span className="text-[#A66A2A] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  View <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Latest Enquiries Section */}
      <div className="bg-[#F1E6D4] rounded-2xl border border-[#C98A3D]/20 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-[#C98A3D]/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Inbox className="w-5 h-5 text-[#C98A3D]" />
            <h2 className="text-base font-bold font-serif text-[#3A2418]">
              Latest Form Submissions
            </h2>
          </div>
          <Link
            href="/admin/inbox"
            className="text-xs font-semibold text-[#A66A2A] hover:underline flex items-center gap-1"
          >
            <span>View All Inbox</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentSubmissions.length === 0 ? (
          <div className="p-8 text-center text-[#3A2418]/60 text-sm">
            <CheckCircle className="w-8 h-8 text-[#C98A3D] mx-auto mb-2 opacity-60" />
            No enquiries received yet. Form submissions will appear here.
          </div>
        ) : (
          <div className="divide-y divide-[#3A2418]/10">
            {recentSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="p-4 sm:p-5 hover:bg-[#FBF7F1]/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-[#3A2418]">
                      {sub.name}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        sub.status === "NEW"
                          ? "bg-[#9E3B3B]/10 text-[#9E3B3B] border border-[#9E3B3B]/20"
                          : sub.status === "CONTACTED"
                          ? "bg-[#C98A3D]/10 text-[#A66A2A] border border-[#C98A3D]/20"
                          : "bg-emerald-600/10 text-emerald-800 border border-emerald-600/20"
                      }`}
                    >
                      {sub.status}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#3A2418]/5 text-[#3A2418]/80">
                      {sub.type.replace("_", " ")}
                    </span>
                  </div>

                  <p className="text-xs text-[#3A2418]/70 line-clamp-1">
                    {sub.message || "No message body provided."}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-[#3A2418]/60 pt-0.5">
                    <span className="inline-flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#A66A2A]" />
                      {sub.phone}
                    </span>
                    {sub.email && (
                      <span className="inline-flex items-center gap-1">
                        <Mail className="w-3 h-3 text-[#A66A2A]" />
                        {sub.email}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col sm:items-end justify-between items-center gap-2 shrink-0">
                  <span className="text-[11px] text-[#3A2418]/50 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </span>
                  <Link
                    href={`/admin/inbox?id=${sub.id}`}
                    className="text-xs font-semibold text-[#A66A2A] hover:text-[#3A2418] transition-colors"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
