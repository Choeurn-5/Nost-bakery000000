"use client";

import * as React from "react";
import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { submitContactForm, ContactActionState } from "@/app/actions/form-actions";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Send } from "lucide-react";

interface ContactFormProps {
  className?: string;
  defaultType?: "RETAIL" | "CAKE_ORDER" | "WHOLESALE";
}

export function ContactForm({ className, defaultType = "RETAIL" }: ContactFormProps) {
  const t = useTranslations("contact");
  const tCommon = useTranslations("common");

  const [state, formAction, isPending] = useActionState<ContactActionState, FormData>(
    submitContactForm,
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
            {t("success")}
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
          <h3 className="font-heading text-2xl sm:text-3xl font-semibold text-espresso mb-2">
            {t("formTitle")}
          </h3>
          <p className="text-sm text-espresso/70 mb-6 leading-relaxed">
            {tCommon("replyNote")}
          </p>

          {state.message && !state.success && (
            <div className="mb-6 rounded-[12px] bg-berry/10 border border-berry/20 p-4 text-sm text-berry flex items-start gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{state.message}</span>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label
                htmlFor="contact-name"
                className="block text-xs font-semibold uppercase tracking-wider text-espresso/70 mb-1.5"
              >
                {t("name")} <span className="text-berry">*</span>
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                placeholder="Your full name"
                className="w-full min-h-[44px] rounded-[12px] border border-espresso/20 bg-cream/30 px-4 py-2.5 text-sm text-espresso placeholder:text-espresso/40 transition-colors focus:border-golden focus:bg-warm-white focus:outline-none focus:ring-2 focus:ring-golden/30"
              />
              {state.errors?.name && (
                <p className="mt-1 text-xs text-berry">{state.errors.name[0]}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="contact-phone"
                  className="block text-xs font-semibold uppercase tracking-wider text-espresso/70 mb-1.5"
                >
                  {t("phone")} <span className="text-berry">*</span>
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="+855 12 345 678"
                  className="w-full min-h-[44px] rounded-[12px] border border-espresso/20 bg-cream/30 px-4 py-2.5 text-sm text-espresso placeholder:text-espresso/40 transition-colors focus:border-golden focus:bg-warm-white focus:outline-none focus:ring-2 focus:ring-golden/30"
                />
                {state.errors?.phone && (
                  <p className="mt-1 text-xs text-berry">{state.errors.phone[0]}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-xs font-semibold uppercase tracking-wider text-espresso/70 mb-1.5"
                >
                  {t("emailAddress")}
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  className="w-full min-h-[44px] rounded-[12px] border border-espresso/20 bg-cream/30 px-4 py-2.5 text-sm text-espresso placeholder:text-espresso/40 transition-colors focus:border-golden focus:bg-warm-white focus:outline-none focus:ring-2 focus:ring-golden/30"
                />
                {state.errors?.email && (
                  <p className="mt-1 text-xs text-berry">{state.errors.email[0]}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="contact-type"
                className="block text-xs font-semibold uppercase tracking-wider text-espresso/70 mb-1.5"
              >
                {t("interestedIn")}
              </label>
              <select
                id="contact-type"
                name="type"
                defaultValue={defaultType}
                className="w-full min-h-[44px] rounded-[12px] border border-espresso/20 bg-cream/30 px-4 py-2.5 text-sm text-espresso transition-colors focus:border-golden focus:bg-warm-white focus:outline-none focus:ring-2 focus:ring-golden/30"
              >
                <option value="RETAIL">{t("retail")}</option>
                <option value="CAKE_ORDER">{t("cakeOrder")}</option>
                <option value="WHOLESALE">{t("wholesaleInquiry")}</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="block text-xs font-semibold uppercase tracking-wider text-espresso/70 mb-1.5"
              >
                {t("message")} <span className="text-berry">*</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={4}
                required
                placeholder={t("messagePlaceholder")}
                className="w-full rounded-[12px] border border-espresso/20 bg-cream/30 px-4 py-3 text-sm text-espresso placeholder:text-espresso/40 transition-colors focus:border-golden focus:bg-warm-white focus:outline-none focus:ring-2 focus:ring-golden/30 leading-relaxed"
              />
              {state.errors?.message && (
                <p className="mt-1 text-xs text-berry">{state.errors.message[0]}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <span className="text-xs text-espresso/60 text-center sm:text-left">
                {tCommon("priceNote")}
              </span>
              <Button
                type="submit"
                loading={isPending}
                loadingText={tCommon("loading")}
                rightIcon={<Send className="h-4 w-4" />}
                className="w-full sm:w-auto"
              >
                {tCommon("sendMessage")}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
