"use client";

import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "default";
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#FBF7F1] rounded-2xl p-6 shadow-2xl border border-[#C98A3D]/20 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl ${
                variant === "danger"
                  ? "bg-[#9E3B3B]/10 text-[#9E3B3B]"
                  : "bg-[#C98A3D]/10 text-[#C98A3D]"
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#3A2418]">{title}</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-[#3A2418]/50 hover:text-[#3A2418] p-1 rounded-lg hover:bg-[#F1E6D4]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-[#3A2418]/80 mb-6 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium rounded-xl text-[#3A2418] hover:bg-[#F1E6D4] transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-semibold rounded-xl text-[#FBF7F1] shadow-sm transition-all cursor-pointer disabled:opacity-50 ${
              variant === "danger"
                ? "bg-[#9E3B3B] hover:bg-[#7e2e2e]"
                : "bg-[#C98A3D] hover:bg-[#A66A2A]"
            }`}
          >
            {isLoading ? "Processing…" : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
