"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Settings,
  Megaphone,
  Home,
  Grid3x3,
  ShoppingBag,
  Tag,
  Truck,
  MapPin,
  BookOpen,
  Image as ImageIcon,
  MessageSquare,
  Inbox,
  FileText,
  Users,
  FolderOpen,
  Clock,
  LogOut,
  Croissant,
  X,
  ExternalLink,
} from "lucide-react";
import type { Role } from "@prisma/client";

interface AdminSidebarProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role: Role;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ user, isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const isOwner = user.role === "OWNER";

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Site Settings", href: "/admin/settings", icon: Settings },
    { label: "Announcement", href: "/admin/announcement", icon: Megaphone },
    { label: "Home Page", href: "/admin/home-sections", icon: Home },
    { label: "Categories", href: "/admin/categories", icon: Grid3x3 },
    { label: "Products", href: "/admin/products", icon: ShoppingBag },
    { label: "Promotions", href: "/admin/promotions", icon: Tag },
    { label: "Wholesale", href: "/admin/wholesale", icon: Truck },
    { label: "Locations", href: "/admin/locations", icon: MapPin },
    { label: "Our Bakery", href: "/admin/bakery-stories", icon: BookOpen },
    { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
    { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
    { label: "Inbox", href: "/admin/inbox", icon: Inbox },
    { label: "Pages & SEO", href: "/admin/pages-seo", icon: FileText },
    { label: "Media Library", href: "/admin/media", icon: FolderOpen },
    ...(isOwner
      ? [
          { label: "Users", href: "/admin/users", icon: Users },
          { label: "Activity Log", href: "/admin/activity-log", icon: Clock },
        ]
      : []),
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/admin/login" });
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden backdrop-blur-xs transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#F1E6D4] border-r border-[#C98A3D]/20 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-[#C98A3D]/20 flex items-center justify-between">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 font-bold font-serif text-[#3A2418] text-lg tracking-tight"
          >
            <span className="p-1.5 rounded-lg bg-[#C98A3D] text-[#FBF7F1] flex items-center justify-center">
              <Croissant className="w-5 h-5" />
            </span>
            <span>NOST Bakery</span>
          </Link>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-[#3A2418]/60 hover:text-[#3A2418] hover:bg-[#FBF7F1]/60"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Site Link Pill */}
        <div className="px-4 py-2.5 bg-[#soft-butter]/30 border-b border-[#C98A3D]/10">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#FBF7F1]/80 hover:bg-[#FBF7F1] text-xs font-semibold text-[#A66A2A] transition-colors border border-[#C98A3D]/20"
          >
            <span>View Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Navigation Links Scrollable Area */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 admin-sidebar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl transition-all ${
                  isActive
                    ? "border-l-4 border-[#C98A3D] text-[#C98A3D] font-bold bg-[#FBF7F1] shadow-xs"
                    : "text-[#3A2418]/80 hover:text-[#3A2418] hover:bg-[#FBF7F1]/50"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#C98A3D]" : "text-[#3A2418]/60"}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout Bottom Bar */}
        <div className="p-3 border-t border-[#C98A3D]/20 bg-[#F1E6D4]">
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#FBF7F1]/70 border border-[#C98A3D]/10">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#C98A3D] text-[#FBF7F1] font-bold text-xs flex items-center justify-center shrink-0">
                {user.name ? user.name.slice(0, 2).toUpperCase() : "NB"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#3A2418] truncate">
                  {user.name || "Administrator"}
                </p>
                <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider bg-[#3A2418]/10 text-[#3A2418]">
                  {user.role}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-[#9E3B3B] hover:bg-[#9E3B3B]/10 transition-colors shrink-0 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
