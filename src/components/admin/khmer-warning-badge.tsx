import { AlertCircle } from "lucide-react";

interface KhmerWarningBadgeProps {
  value?: string | null;
  className?: string;
}

export function KhmerWarningBadge({ value, className = "" }: KhmerWarningBadgeProps) {
  if (value && value.trim().length > 0) {
    return null;
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#9E3B3B]/10 text-[#9E3B3B] border border-[#9E3B3B]/20 ${className}`}
      title="Khmer translation is missing for this field"
    >
      <AlertCircle className="w-3 h-3 shrink-0" />
      <span>Khmer missing</span>
    </span>
  );
}
