import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().trim().min(6, { message: "Please enter a valid phone number." }),
  email: z
    .string()
    .trim()
    .email({ message: "Invalid email address." })
    .optional()
    .or(z.literal("")),
  type: z.enum(["RETAIL", "CAKE_ORDER", "WHOLESALE"], {
    errorMap: () => ({ message: "Please select an enquiry type." }),
  }),
  message: z.string().trim().max(1500, { message: "Message cannot exceed 1500 characters." }),
  // Honeypot field (hidden from real users to catch bot spam)
  botCheck: z.string().max(0, { message: "Spam detected" }),
});

export type ContactFormData = z.infer<typeof contactSchema>;
