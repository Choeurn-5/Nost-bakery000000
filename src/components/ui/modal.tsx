"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  size?: ModalSize;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[calc(100vw-2rem)] min-h-[calc(100vh-2rem)]",
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  showCloseButton = true,
  closeOnOverlayClick = true,
  className,
}: ModalProps) {
  const isClient = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const titleId = React.useId();
  const descriptionId = React.useId();

  // Lock body scroll when modal is open
  React.useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen]);

  // Handle Escape key to close
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="presentation"
        >
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-espresso/60 backdrop-blur-xs"
            onClick={closeOnOverlayClick ? onClose : undefined}
            aria-hidden="true"
          />

          {/* Modal Dialog Card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={description ? descriptionId : undefined}
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
            className={cn(
              "relative z-10 w-full rounded-[20px] bg-warm-white border border-espresso/10 p-6 md:p-8",
              "shadow-[0_20px_60px_-15px_rgba(58,36,24,0.35)]",
              "focus-visible:outline-none",
              sizeClasses[size],
              className
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="absolute top-4 right-4 sm:top-6 sm:right-6 h-11 w-11 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-[12px] text-espresso/70 hover:text-espresso hover:bg-cream transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            )}

            {/* Header if title or description provided */}
            {(title || description) && (
              <div className="mb-5 pr-8">
                {title && (
                  <h2
                    id={titleId}
                    className="font-heading text-2xl sm:text-3xl font-semibold text-espresso leading-snug"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p
                    id={descriptionId}
                    className="mt-1.5 text-sm text-espresso/75 leading-relaxed font-sans"
                  >
                    {description}
                  </p>
                )}
              </div>
            )}

            {/* Modal Body */}
            <div className="relative font-sans">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export type ModalHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 mb-4 pr-8", className)}
      {...props}
    />
  )
);
ModalHeader.displayName = "ModalHeader";

export type ModalTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

export const ModalTitle = React.forwardRef<HTMLHeadingElement, ModalTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "font-heading text-2xl font-semibold leading-tight text-espresso",
        className
      )}
      {...props}
    />
  )
);
ModalTitle.displayName = "ModalTitle";

export type ModalDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export const ModalDescription = React.forwardRef<
  HTMLParagraphElement,
  ModalDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-espresso/75 leading-relaxed font-sans", className)}
    {...props}
  />
));
ModalDescription.displayName = "ModalDescription";

export type ModalBodyProps = React.HTMLAttributes<HTMLDivElement>;

export const ModalBody = React.forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("py-2 font-sans", className)} {...props} />
  )
);
ModalBody.displayName = "ModalBody";

export type ModalFooterProps = React.HTMLAttributes<HTMLDivElement>;

export const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-6 border-t border-espresso/10 mt-6",
        className
      )}
      {...props}
    />
  )
);
ModalFooter.displayName = "ModalFooter";
