"use server";

import { api } from "@/lib/api";
import { contactSchema, type ContactFormData } from "@/lib/schemas/contact";

export { contactSchema, type ContactFormData };

export type ContactActionResult = {
  success: boolean;
  message?: string;
  error?: string;
};

export async function submitContactForm(
  rawData: unknown
): Promise<ContactActionResult> {
  try {
    const parseResult = contactSchema.safeParse(rawData);

    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0]?.message || "Validation failed.";
      return { success: false, error: firstIssue };
    }

    const { name, phone, email, type, message, botCheck } = parseResult.data;

    // Honeypot check: silently accept bots without saving to prevent spam
    if (botCheck && botCheck.length > 0) {
      return {
        success: true,
        message: "Your message has been received.",
      };
    }

    const res = await api.submitContact({
      name,
      phone,
      email: email && email.length > 0 ? email : null,
      type,
      message: message || "General inquiry",
    });

    if (!res.success) {
      return {
        success: false,
        error: res.message || "Failed to submit enquiry.",
      };
    }

    return {
      success: true,
      message: "Thank you! We have received your inquiry and will reach out soon.",
    };
  } catch (error: unknown) {
    console.error("submitContactForm error:", error);
    return {
      success: false,
      error: "Unable to submit your request at this time. Please contact us via Telegram or phone.",
    };
  }
}
