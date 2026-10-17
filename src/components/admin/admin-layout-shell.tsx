"use client";

import { useState } from "react";
import { AdminSidebar } from "./admin-sidebar";
import { Menu, Croissant } from "lucide-react";
import { Toaster } from "sonner";
import type { Role } from "@prisma/client";

interface AdminLayoutShellProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role: Role;
  };
  children: React.ReactNode;
}

export function AdminLayoutShell({ user, children }: AdminLayoutShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FBF7F1] text-[#3A2418] flex">
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#F1E6D4",
            color: "#3A2418",
            border: "1px solid rgba(201, 138, 61, 0.3)",
          },
        }}
      />

      {/* Sidebar */}
      <AdminSidebar
        user={user}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Mobile Top Header */}
        <header className="lg:hidden h-14 bg-[#F1E6D4] border-b border-[#C98A3D]/20 px-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-xl text-[#3A2418] hover:bg-[#FBF7F1]/70 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 font-bold font-serif text-[#3A2418]">
            <Croissant className="w-4 h-4 text-[#C98A3D]" />
            <span>NOST Bakery</span>
          </div>

          <div className="w-8" />
        </header>

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
