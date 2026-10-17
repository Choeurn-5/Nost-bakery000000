"use client";

import * as React from "react";
import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { submitWholesaleEnquiry, WholesaleActionState } from "@/app/actions/form-actions";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Send } from "lucide-react";

interface EnquiryFormProps {
  className?: string;
}

const INTEREST_OPTIONS = [
  { id: "croissants", labelEn: "Raw Frozen Croissants (Small / Large)", labelKm: "នំប៉័ងក្រូរសង់កកឆៅ (តូច / ធំ)" },
  { id: "pastries", labelEn: "Ready-to-Bake Viennoiseries & Pastries", labelKm: "នំផេស្ត្រីត្រៀមដុត" },
  { id: "breads", labelEn: "Sourdough & Artisan Bread Loaves", labelKm: "នំប៉័ងសួរដូ និងនំប៉័ងសិប្បកម្ម" },
  { id: "baguettes", labelEn: "French Baguettes & Sandwich Breads", labelKm: "បាហ្កែតបារាំង និងនំប៉័ងសាំងវិច" },
  { id: "custom", labelEn: "Custom Bakery Supply / Consultation", labelKm: "ការផ្គត់ផ្គង់តាមតម្រូវការ / ការប្រឹក្សា" },
];

export function WholesaleEnquiryForm({ className }: EnquiryFormProps) {
  const t = useTranslations("wholesale");
  const tCommon = useTranslations("common");

  const [state, formAction, isPending] = useActionState<WholesaleActionState, FormData>(
    submitWholesaleEnquiry,
    {}
  );

  return (
    <div className={className}>
      {state.success ? (
        <div className="rounded-[18px] bg-warm-white border border-golden/30 p-8 sm:p-10 text-center shadow-card">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-golden/15 text-golden mb-4">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="font-heading text-2xl md:text-3xl font-semibold text-espresso mb-2">
            {t("enquiryForm")} Received
          </h3>
          <p className="text-espresso/80 max-w-md mx-auto text-sm sm:text-base mb-6 leading-relaxed">
            {state.message}
          </p>
          <p className="text-xs text-espresso/60 font-medium">
            {tCommon("replyNote")}
          </p>
        </div>
      ) : (
        <form
          action={formAction}
          className="rounded-[20px] bg-warm-white border border-espresso/10 p-6 sm:p-8 md:p-10 shadow-card"
        >
          {state.message && !state.success && (
            <div className="mb-6 rounded-[12px] bg-berry/10 border border-berry/20 p-4 text-sm text-berry flex items-start gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{state.message}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold uppercase tracking-wider text-espresso/70 mb-1.5"
              >
                Contact Name <span className="text-berry">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="e.g. John Doe"
                className="w-full min-h-[44px] rounded-[12px] border border-espresso/20 bg-cream/30 px-4 py-2.5 text-sm text-espresso placeholder:text-espresso/40 transition-colors focus:border-golden focus:bg-warm-white focus:outline-none focus:ring-2 focus:ring-golden/30"
              />
              {state.errors?.name && (
                <p className="mt-1 text-xs text-berry">{state.errors.name[0]}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="businessName"
                className="block text-xs font-semibold uppercase tracking-wider text-espresso/70 mb-1.5"
              >
                Business / Venue Name <span className="text-berry">*</span>
              </label>
              <input
                id="businessName"
                name="businessName"
                type="text"
                required
                placeholder="e.g. Angkor Boutique Hotel & Café"
                className="w-full min-h-[44px] rounded-[12px] border border-espresso/20 bg-cream/30 px-4 py-2.5 text-sm text-espresso placeholder:text-espresso/40 transition-colors focus:border-golden focus:bg-warm-white focus:outline-none focus:ring-2 focus:ring-golden/30"
              />
              {state.errors?.businessName && (
                <p className="mt-1 text-xs text-berry">{state.errors.businessName[0]}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            <div>
              <label
                htmlFor="phone"
                className="block text-xs font-semibold uppercase tracking-wider text-espresso/70 mb-1.5"
              >
                Phone Number (or Telegram) <span className="text-berry">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="e.g. +855 12 345 678"
                className="w-full min-h-[44px] rounded-[12px] border border-espresso/20 bg-cream/30 px-4 py-2.5 text-sm text-espresso placeholder:text-espresso/40 transition-colors focus:border-golden focus:bg-warm-white focus:outline-none focus:ring-2 focus:ring-golden/30"
              />
              {state.errors?.phone && (
                <p className="mt-1 text-xs text-berry">{state.errors.phone[0]}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-espresso/70 mb-1.5"
              >
                Email Address (Optional)
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="e.g. wholesale@business.com"
                className="w-full min-h-[44px] rounded-[12px] border border-espresso/20 bg-cream/30 px-4 py-2.5 text-sm text-espresso placeholder:text-espresso/40 transition-colors focus:border-golden focus:bg-warm-white focus:outline-none focus:ring-2 focus:ring-golden/30"
              />
              {state.errors?.email && (
                <p className="mt-1 text-xs text-berry">{state.errors.email[0]}</p>
              )}
            </div>
          </div>

          {/* Product interests checkboxes */}
          <div className="mb-6">
            <span className="block text-xs font-semibold uppercase tracking-wider text-espresso/70 mb-2.5">
              Products You Need Supply For
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {INTEREST_OPTIONS.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-3 rounded-[12px] border border-espresso/10 bg-cream/20 p-3 cursor-pointer hover:bg-cream/40 transition-colors min-h-[44px]"
                >
                  <input
                    type="checkbox"
                    name="interests"
                    value={item.labelEn}
                    className="h-4 w-4 rounded-[4px] border-espresso/30 text-golden accent-golden focus:ring-golden"
                  />
                  <span className="text-xs sm:text-sm text-espresso font-medium select-none">
                    {item.labelEn}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Message textarea */}
          <div className="mb-6">
            <label
              htmlFor="message"
              className="block text-xs font-semibold uppercase tracking-wider text-espresso/70 mb-1.5"
            >
              Estimated Volume & Specific Requirements
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Tell us about your weekly quantity requirements, preferred delivery schedule, or specific item sizes..."
              className="w-full rounded-[12px] border border-espresso/20 bg-cream/30 px-4 py-3 text-sm text-espresso placeholder:text-espresso/40 transition-colors focus:border-golden focus:bg-warm-white focus:outline-none focus:ring-2 focus:ring-golden/30 leading-relaxed"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p className="text-xs text-espresso/65 text-center sm:text-left">
              {tCommon("replyNote")}
            </p>
            <Button
              type="submit"
              loading={isPending}
              loadingText="Submitting..."
              rightIcon={<Send className="h-4 w-4" />}
              className="w-full sm:w-auto"
            >
              {tCommon("wholesaleEnquiry")}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
