"use client";

import * as React from "react";
import { Toaster as SonnerToaster, toast } from "sonner";

export type ToasterProps = React.ComponentProps<typeof SonnerToaster>;

export function Toaster({
  position = "top-right",
  expand = false,
  richColors = false,
  closeButton = true,
  ...props
}: ToasterProps) {
  return (
    <SonnerToaster
      position={position}
      expand={expand}
      richColors={richColors}
      closeButton={closeButton}
      toastOptions={{
        classNames: {
          toast:
            "group font-sans rounded-[14px] p-4 border shadow-[0_8px_30px_rgba(58,36,24,0.12)] bg-cream text-espresso border-espresso/15 flex items-center gap-3",
          title: "font-semibold text-sm text-espresso leading-snug",
          description: "text-xs text-espresso/75 leading-relaxed mt-0.5",
          actionButton:
            "bg-golden text-espresso font-medium text-xs rounded-[10px] px-3 py-1.5 hover:bg-caramel hover:text-warm-white transition-colors duration-150",
          cancelButton:
            "bg-warm-white text-espresso font-medium text-xs rounded-[10px] px-3 py-1.5 hover:bg-cream transition-colors duration-150 border border-espresso/10",
          closeButton:
            "bg-warm-white/80 text-espresso/70 hover:text-espresso hover:bg-warm-white border border-espresso/10 rounded-full transition-colors",
          success:
            "!bg-cream !border-golden/50 [&_[data-icon]]:text-golden",
          error:
            "!bg-[#FDF2F2] !border-berry/40 !text-espresso [&_[data-icon]]:text-berry",
          warning:
            "!bg-[#FFFBF0] !border-golden/60 [&_[data-icon]]:text-golden",
          info:
            "!bg-cream !border-espresso/20 [&_[data-icon]]:text-espresso",
        },
      }}
      {...props}
    />
  );
}

export { toast };
