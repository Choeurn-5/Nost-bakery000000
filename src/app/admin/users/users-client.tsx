"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Users, UserPlus, Trash2, Shield, CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface AdminUser {
  id: string | number;
  name: string;
  email: string;
  role: string;
  active: boolean;
  created_at?: string;
  createdAt?: string;
}

export function UsersClient({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "EDITOR",
  });
  const [isPending, setIsPending] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsPending(true);
    try {
      const res = await api.saveAdminUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      if (res.success && res.data) {
        toast.success(`User "${res.data.name}" created successfully!`);
        setUsers((prev) => [...prev, res.data]);
        setFormData({ name: "", email: "", password: "", role: "EDITOR" });
        setIsAdding(false);
      } else {
        toast.error(res.error || "Failed to create user");
      }
    } catch {
      toast.error("Error creating user");
    } finally {
      setIsPending(false);
    }
  };

  const handleToggleActive = async (user: AdminUser) => {
    if (user.role === "OWNER") {
      toast.error("Cannot change the OWNER status");
      return;
    }

    try {
      const newStatus = !user.active;
      const res = await api.saveAdminUser({ active: newStatus }, user.id);
      if (res.success) {
        toast.success(`Account ${newStatus ? "activated" : "deactivated"}`);
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, active: newStatus } : u))
        );
      } else {
        toast.error(res.error || "Failed to update account status");
      }
    } catch {
      toast.error("Error updating account status");
    }
  };

  const handleDelete = async (user: AdminUser) => {
    if (user.role === "OWNER") {
      toast.error("Cannot delete the primary OWNER account");
      return;
    }
    if (!confirm(`Are you sure you want to delete user ${user.name} (${user.email})?`)) return;

    try {
      const res = await api.deleteAdminUser(user.id);
      if (res.success) {
        toast.success("User deleted");
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
      } else {
        toast.error(res.error || "Failed to delete user");
      }
    } catch {
      toast.error("Error deleting user");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#3A2418]/10 shadow-xs">
        <div>
          <span className="text-sm font-semibold text-[#3A2418]">
            {users.length} Registered Team Member{users.length === 1 ? "" : "s"}
          </span>
          <p className="text-xs text-[#3A2418]/60 mt-0.5">
            Owners have full privileges; Editors can modify content, products, and handle inbox submissions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-[#6A9A8A] text-white rounded-lg text-sm font-semibold hover:bg-[#588576] transition-colors flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Add Team Member
        </button>
      </div>

      {/* Add User Modal / Form */}
      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="bg-white p-6 rounded-xl border-2 border-[#6A9A8A]/30 shadow-sm space-y-4"
        >
          <h3 className="text-base font-bold text-[#3A2418] font-serif">
            Create New Admin Account
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#3A2418] uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Sophy Seng"
                className="w-full px-3.5 py-2 rounded-lg border border-[#3A2418]/20 bg-[#FAF6F0]/30 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#6A9A8A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3A2418] uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="sophy@nostbakery.com"
                className="w-full px-3.5 py-2 rounded-lg border border-[#3A2418]/20 bg-[#FAF6F0]/30 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#6A9A8A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3A2418] uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Min 6 characters"
                className="w-full px-3.5 py-2 rounded-lg border border-[#3A2418]/20 bg-[#FAF6F0]/30 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#6A9A8A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3A2418] uppercase tracking-wider mb-1">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-[#3A2418]/20 bg-[#FAF6F0]/30 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#6A9A8A]"
              >
                <option value="EDITOR">Editor (Manage Content)</option>
                <option value="ADMIN">Admin (Full Store Access)</option>
                <option value="OWNER">Owner (Master Administrator)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-sm text-[#3A2418]/70 hover:bg-[#FAF6F0] rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 bg-[#3A2418] text-white rounded-lg text-sm font-semibold hover:bg-[#3A2418]/90 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create User"}
            </button>
          </div>
        </form>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-[#3A2418]/10 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAF6F0] text-[#3A2418] text-xs uppercase font-bold tracking-wider border-b border-[#3A2418]/10">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3A2418]/5">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[#FAF6F0]/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-[#3A2418]">{user.name}</p>
                    <p className="text-xs text-[#3A2418]/60">{user.email}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        user.role === "OWNER"
                          ? "bg-amber-100 text-amber-800"
                          : user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      <Shield className="w-3 h-3" />
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      disabled={user.role === "OWNER"}
                      onClick={() => handleToggleActive(user)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold cursor-pointer ${
                        user.active
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      } ${user.role === "OWNER" ? "cursor-default" : ""}`}
                    >
                      {user.active ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" /> Deactivated
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {user.role !== "OWNER" && (
                      <button
                        type="button"
                        onClick={() => handleDelete(user)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-block"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
