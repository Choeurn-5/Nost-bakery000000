"use client";

import React, { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Phone, Send, Mail, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { submitContactForm } from "@/app/actions/contact";
import { contactSchema, type ContactFormData } from "@/lib/schemas/contact";

interface OrderOrEnquireProps {
  locale: string;
}

export function OrderOrEnquire({ locale }: OrderOrEnquireProps) {
  const isKm = locale === "km";
  const [isPending, startTransition] = useTransition();
  const [submissionStatus, setSubmissionStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema) as any,
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      type: "RETAIL",
      message: "",
      botCheck: "",
    },
  });

  const onSubmit = (data: ContactFormData) => {
    setSubmissionStatus({ type: null, message: "" });

    startTransition(async () => {
      const result = await submitContactForm(data);
      if (result.success) {
        setSubmissionStatus({
          type: "success",
          message:
            result.message ||
            (isKm
              ? "អរគុណច្រើន! យើងខ្ញុំបានទទួលសំណើរបស់អ្នកហើយ។"
              : "Thank you! We've received your inquiry and will reach out shortly."),
        });
        reset();
      } else {
        setSubmissionStatus({
          type: "error",
          message:
            result.error ||
            (isKm
              ? "មានបញ្ហាក្នុងការផ្ញើ។ សូមព្យាយាមម្តងទៀត ឬទាក់ទងមក Telegram។"
              : "Something went wrong. Please try again or message us on Telegram."),
        });
      }
    });
  };

  const contactCards = [
    {
      icon: Phone,
      title: isKm ? "ទូរសព្ទទំនាក់ទំនង" : "Direct Phone",
      value: "060 731 888",
      subValue: "099 200 076",
      href: "tel:+85560731888",
      cta: isKm ? "ហៅទូរសព្ទឥឡូវ" : "Call direct",
    },
    {
      icon: Send,
      title: isKm ? "ឆានែល Telegram" : "Instant Telegram",
      value: "@NostBakery",
      subValue: isKm ? "ឆ្លើយតបរហ័សក្នុងថ្ងៃ" : "Fastest response within hours",
      href: "https://t.me/NostBakery",
      cta: isKm ? "ផ្ញើសារតាម Telegram" : "Chat on Telegram",
      isExternal: true,
    },
    {
      icon: Mail,
      title: isKm ? "អ៊ីមែលផ្លូវការ" : "Email Enquiries",
      value: "info@nostbakery.com",
      subValue: isKm ? "សម្រាប់កិច្ចសហការ និងលក់ដុំ" : "For contracts & partnerships",
      href: "mailto:info@nostbakery.com",
      cta: isKm ? "ផ្ញើអ៊ីមែល" : "Send email",
    },
  ];

  return (
    <section id="contact-order" className="py-20 lg:py-28 bg-warm-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Motion */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-center max-w-2xl mx-auto mb-14 sm:mb-16"
        >
          <span className="section-label inline-block mb-2">
            {isKm ? "ទាក់ទង ឬកុម្ម៉ង់" : "GET IN TOUCH"}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-espresso mb-4 tracking-tight">
            {isKm ? "កុម្ម៉ង់នំ ឬសាកសួរព័ត៌មាន" : "Order or Enquire"}
          </h2>
          <p className="text-base sm:text-lg text-espresso/70 font-body">
            {isKm
              ? "បំពេញទម្រង់ខាងក្រោម ឬទាក់ទងមកយើងខ្ញុំដោយផ្ទាល់តាមរយៈទូរសព្ទ ឬ Telegram"
              : "Send us a quick message about retail orders, custom celebration cakes, or wholesale supplies."}
          </p>
        </motion.div>

        {/* Contact Form Card with Motion */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.65, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="max-w-2xl mx-auto bg-[#fffdfa] border border-espresso/10 rounded-[24px] p-6 sm:p-10 shadow-2xl mb-16"
        >
          {/* Status feedback */}
          {submissionStatus.type === "success" && (
            <div className="mb-6 p-4 rounded-[14px] bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3 animate-fade-up">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{submissionStatus.message}</p>
            </div>
          )}

          {submissionStatus.type === "error" && (
            <div className="mb-6 p-4 rounded-[14px] bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 animate-fade-up">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{submissionStatus.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Honeypot anti-spam field */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="botCheck">Leave this empty</label>
              <input
                id="botCheck"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...register("botCheck")}
              />
            </div>

            {/* Name & Phone in 2 cols */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-espresso mb-2">
                  {isKm ? "ឈ្មោះរបស់អ្នក *" : "Your Name *"}
                </label>
                <input
                  type="text"
                  placeholder={isKm ? "ឧ. សុខា" : "e.g. John Doe"}
                  className={`w-full h-12 px-4 rounded-[14px] bg-warm-white border text-sm text-espresso placeholder:text-espresso/35 focus:outline-none focus:ring-2 focus:ring-golden/40 transition-all ${
                    errors.name ? "border-rose-400 bg-rose-50/20" : "border-espresso/15"
                  }`}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-rose-500 mt-1 font-medium">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-espresso mb-2">
                  {isKm ? "លេខទូរសព្ទ *" : "Phone Number *"}
                </label>
                <input
                  type="tel"
                  placeholder={isKm ? "ឧ. 012 345 678" : "e.g. +855 12 345 678"}
                  className={`w-full h-12 px-4 rounded-[14px] bg-warm-white border text-sm text-espresso placeholder:text-espresso/35 focus:outline-none focus:ring-2 focus:ring-golden/40 transition-all ${
                    errors.phone ? "border-rose-400 bg-rose-50/20" : "border-espresso/15"
                  }`}
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-xs text-rose-500 mt-1 font-medium">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email (Optional) & Interest Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-espresso mb-2">
                  {isKm ? "អ៊ីមែល (មិនបង្ខំ)" : "Email Address (Optional)"}
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className={`w-full h-12 px-4 rounded-[14px] bg-warm-white border text-sm text-espresso placeholder:text-espresso/35 focus:outline-none focus:ring-2 focus:ring-golden/40 transition-all ${
                    errors.email ? "border-rose-400 bg-rose-50/20" : "border-espresso/15"
                  }`}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-rose-500 mt-1 font-medium">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-espresso mb-2">
                  {isKm ? "ប្រភេទចំណាប់អារម្មណ៍ *" : "Interest Type *"}
                </label>
                <select
                  className="w-full h-12 px-4 rounded-[14px] bg-warm-white border border-espresso/15 text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-golden/40 transition-all appearance-none cursor-pointer"
                  {...register("type")}
                >
                  <option value="RETAIL">
                    {isKm ? "ការទិញរាយ / ហាងកាហ្វេ (Retail)" : "Retail & Café Orders"}
                  </option>
                  <option value="CAKE_ORDER">
                    {isKm ? "កម្ម៉ង់នំខេកពិសេស (Custom Cake)" : "Custom Cake Order"}
                  </option>
                  <option value="WHOLESALE">
                    {isKm ? "ការផ្គត់ផ្គង់លក់ដុំ (Wholesale B2B)" : "Wholesale & Business"}
                  </option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-espresso mb-2">
                {isKm ? "សារ ឬព័ត៌មានលម្អិត" : "Message / Enquiry Details"}
              </label>
              <textarea
                rows={4}
                placeholder={
                  isKm
                    ? "ប្រាប់យើងពីចំនួននំ ឬកាលបរិច្ឆេទដែលអ្នកចង់បាន..."
                    : "Tell us what you are looking for, quantity, event date, or any specific requirements..."
                }
                className={`w-full p-4 rounded-[14px] bg-warm-white border text-sm text-espresso placeholder:text-espresso/35 focus:outline-none focus:ring-2 focus:ring-golden/40 transition-all resize-y min-h-[110px] ${
                  errors.message ? "border-rose-400 bg-rose-50/20" : "border-espresso/15"
                }`}
                {...register("message")}
              />
              {errors.message && (
                <p className="text-xs text-rose-500 mt-1 font-medium">
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full h-13 rounded-[14px] bg-golden hover:bg-caramel hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none text-warm-white font-bold text-base shadow-lg shadow-golden/20 hover:shadow-xl hover:shadow-golden/30 flex items-center justify-center gap-2 transition-all duration-300 mt-4 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{isKm ? "កំពុងផ្ញើ..." : "Sending..."}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{isKm ? "ផ្ញើសំណើឥឡូវនេះ" : "Submit Enquiry"}</span>
                </>
              )}
            </button>

            <p className="text-center text-xs text-espresso/60 italic pt-2">
              {isKm
                ? "យើងខ្ញុំនឹងឆ្លើយតបវិញក្នុងរយៈពេលប៉ុន្មានម៉ោង។"
                : "We usually reply within a few hours during business hours."}
            </p>
          </form>
        </motion.div>

        {/* 3 Contact Cards Below with Staggered Entrance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.a
                key={index}
                href={card.href}
                target={card.isExternal ? "_blank" : undefined}
                rel={card.isExternal ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
                className="group bg-[#fffdfa] border border-espresso/10 rounded-[22px] p-6 sm:p-7 shadow-card hover:shadow-2xl hover:-translate-y-2 hover:border-golden/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-golden/15 text-golden flex items-center justify-center mb-4 group-hover:scale-115 group-hover:rotate-6 group-hover:bg-golden group-hover:text-warm-white transition-all duration-300 shadow-sm">
                    <Icon className="w-6 h-6 transition-colors" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-espresso/60 block mb-1">
                    {card.title}
                  </span>
                  <span className="font-heading text-xl font-bold text-espresso group-hover:text-golden transition-colors block mb-1">
                    {card.value}
                  </span>
                  <p className="text-xs sm:text-sm text-espresso/70">
                    {card.subValue}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-espresso/8 flex items-center justify-between text-xs sm:text-sm font-semibold text-golden group-hover:text-caramel">
                  <span>{card.cta}</span>
                  <span className="transition-transform group-hover:translate-x-1.5">→</span>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
