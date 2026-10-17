"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const wholesaleSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  businessName: z.string().trim().min(2, "Business name is required"),
  phone: z.string().trim().min(6, "Valid phone number is required"),
  email: z.string().trim().email("Invalid email address").optional().or(z.literal("")),
  interests: z.array(z.string()).default([]),
  message: z.string().trim().optional(),
});

export type WholesaleActionState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function submitWholesaleEnquiry(
  _prevState: WholesaleActionState,
  formData: FormData
): Promise<WholesaleActionState> {
  const rawInterests = formData.getAll("interests") as string[];
  const rawData = {
    name: formData.get("name"),
    businessName: formData.get("businessName"),
    phone: formData.get("phone"),
    email: formData.get("email") || undefined,
    interests: rawInterests,
    message: formData.get("message") || undefined,
  };

  const validated = wholesaleSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: "Please correct the highlighted fields.",
    };
  }

  const { name, businessName, phone, email, interests, message } = validated.data;

  try {
    const fullMessage = [
      businessName ? `Business: ${businessName}` : null,
      interests.length > 0 ? `Interested in: ${interests.join(", ")}` : null,
      message ? `Message: ${message}` : null,
    ]
      .filter(Boolean)
      .join("\n\n");

    await prisma.formSubmission.create({
      data: {
        name,
        phone,
        email: email || null,
        type: "WHOLESALE",
        message: fullMessage,
        notes: `Business: ${businessName} | Interested in: ${interests.join(", ")}`,
      },
    });

    return {
      success: true,
      message: "Thank you for your enquiry. Our wholesale team will get back to you shortly.",
    };
  } catch (error) {
    console.error("Error creating wholesale submission:", error);
    return {
      success: false,
      message: "Could not submit your enquiry right now. Please message us on Telegram or call us directly.",
    };
  }
}

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  phone: z.string().trim().min(6, "Valid phone number is required"),
  email: z.string().trim().email("Invalid email address").optional().or(z.literal("")),
  type: z.enum(["RETAIL", "CAKE_ORDER", "WHOLESALE"]).default("RETAIL"),
  message: z.string().trim().min(5, "Please provide a brief message"),
});

export type ContactActionState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function submitContactForm(
  _prevState: ContactActionState,
  formData: FormData
): Promise<ContactActionState> {
  const rawData = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email") || undefined,
    type: formData.get("type") || "RETAIL",
    message: formData.get("message"),
  };

  const validated = contactSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: "Please fill in all required fields properly.",
    };
  }

  const { name, phone, email, type, message } = validated.data;

  try {
    await prisma.formSubmission.create({
      data: {
        name,
        phone,
        email: email || null,
        type,
        message,
      },
    });

    return {
      success: true,
      message: "Thank you! We received your message and will reply within a few hours.",
    };
  } catch (error) {
    console.error("Error creating contact submission:", error);
    return {
      success: false,
      message: "Unable to send your message right now. Please reach us directly on Telegram or by phone.",
    };
  }
}
