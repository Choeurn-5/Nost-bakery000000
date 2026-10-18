"use client";

import { useState } from "react";
import { updateSubmissionStatus, deleteSubmission, exportCsvAction } from "@/app/admin/actions/inbox";
import { toast } from "sonner";
import {
  Inbox,
  Mail,
  Phone,
  Calendar,
  Trash2,
  CheckCircle,
  Clock,
  Download,
  Filter,
} from "lucide-react";

interface Submission {
  id: string | number;
  name: string;
  phone: string;
  email?: string | null;
  type?: string | null;
  formType?: string | null;
  message?: string | null;
  status: string;
  notes?: string | null;
  createdAt?: string | null;
}

export function InboxClient({ initialSubmissions }: { initialSubmissions: Submission[] }) {
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [filterType, setFilterType] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [isExporting, setIsExporting] = useState(false);

  const filtered = submissions.filter((s) => {
    const type = s.type || s.formType || "CONTACT";
    const matchesType = filterType === "ALL" || type === filterType;
    const matchesStatus = filterStatus === "ALL" || s.status === filterStatus;
    return matchesType && matchesStatus;
  });

  const handleStatusChange = async (id: string | number, newStatus: string) => {
    try {
      const res = await updateSubmissionStatus(id, newStatus);
      if (res.success) {
        toast.success(`Updated status to ${newStatus}`);
        setSubmissions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
        );
      } else {
        toast.error(res.error || "Failed to update status");
      }
    } catch {
      toast.error("Error updating status");
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await deleteSubmission(id);
      if (res.success) {
        toast.success("Message deleted");
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
      } else {
        toast.error(res.error || "Failed to delete message");
      }
    } catch {
      toast.error("Error deleting message");
    }
  };

  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      const res = await exportCsvAction();
      if (res.success && res.csv) {
        const blob = new Blob([res.csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `nost-inbox-export-${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Export downloaded successfully");
      } else {
        toast.error(res.error || "Failed to export CSV");
      }
    } catch {
      toast.error("Error exporting CSV");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="p-4 rounded-2xl bg-[#F1E6D4] border border-[#C98A3D]/20 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#3A2418]">
            <Filter className="w-4 h-4 text-[#C98A3D]" />
            <span>Filter:</span>
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/20 text-[#3A2418]"
          >
            <option value="ALL">All Types</option>
            <option value="CONTACT">Contact Inquiries</option>
            <option value="WHOLESALE">Wholesale Inquiries</option>
            <option value="CAREERS">Careers</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/20 text-[#3A2418]"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New</option>
            <option value="READ">Read</option>
            <option value="REPLIED">Replied</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        <button
          onClick={handleExportCsv}
          disabled={isExporting}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C98A3D] text-[#FBF7F1] hover:bg-[#A66A2A] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? "Exporting..." : "Export CSV"}</span>
        </button>
      </div>

      {/* Submissions List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#F1E6D4] border border-[#C98A3D]/20 text-[#3A2418]/60">
          <Inbox className="w-10 h-10 mx-auto text-[#C98A3D] mb-3 opacity-60" />
          <p className="text-sm font-semibold">No inquiries found matching criteria.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[#F1E6D4] border border-[#C98A3D]/20 hover:border-[#C98A3D]/50 shadow-xs transition-all space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-base text-[#3A2418]">{item.name}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#C98A3D]/15 text-[#A66A2A] border border-[#C98A3D]/20 uppercase">
                    {item.type || item.formType || "CONTACT"}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      item.status === "NEW"
                        ? "bg-[#9E3B3B]/10 text-[#9E3B3B] border border-[#9E3B3B]/30"
                        : item.status === "REPLIED"
                        ? "bg-green-100 text-green-800"
                        : "bg-[#3A2418]/10 text-[#3A2418]"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#3A2418]/60">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {item.createdAt ? new Date(item.createdAt).toLocaleString() : "Recently"}
                  </span>
                </div>
              </div>

              {/* Contact Details */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#3A2418]/80">
                <a
                  href={`tel:${item.phone}`}
                  className="flex items-center gap-1.5 hover:text-[#C98A3D] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C98A3D]" />
                  <span>{item.phone}</span>
                </a>
                {item.email && (
                  <a
                    href={`mailto:${item.email}`}
                    className="flex items-center gap-1.5 hover:text-[#C98A3D] transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#C98A3D]" />
                    <span>{item.email}</span>
                  </a>
                )}
              </div>

              {/* Message */}
              {item.message && (
                <div className="p-3.5 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/15 text-xs text-[#3A2418] leading-relaxed">
                  {item.message}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 border-t border-[#3A2418]/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStatusChange(item.id, "READ")}
                    className="px-2.5 py-1 rounded-lg bg-[#FBF7F1] hover:bg-[#C98A3D] hover:text-[#FBF7F1] transition-colors cursor-pointer border border-[#C98A3D]/20 text-[11px] font-medium"
                  >
                    Mark Read
                  </button>
                  <button
                    onClick={() => handleStatusChange(item.id, "REPLIED")}
                    className="px-2.5 py-1 rounded-lg bg-[#FBF7F1] hover:bg-green-700 hover:text-white transition-colors cursor-pointer border border-[#C98A3D]/20 text-[11px] font-medium"
                  >
                    Mark Replied
                  </button>
                  <button
                    onClick={() => handleStatusChange(item.id, "ARCHIVED")}
                    className="px-2.5 py-1 rounded-lg bg-[#FBF7F1] hover:bg-[#3A2418] hover:text-white transition-colors cursor-pointer border border-[#C98A3D]/20 text-[11px] font-medium"
                  >
                    Archive
                  </button>
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  title="Delete Inquiry"
                  className="p-1.5 rounded-lg text-[#9E3B3B] hover:bg-[#9E3B3B]/10 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
