import { api } from "@/lib/api";
import { TestimonialsClient } from "./testimonials-client";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  let testimonials: any[] = [];
  try {
    const res = await api.getAdminTestimonials();
    testimonials = res?.data ?? [];
  } catch {
    testimonials = [];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#3A2418]">
          Customer Testimonials & Reviews
        </h1>
        <p className="text-sm text-[#3A2418]/70 mt-1">
          Curate and display authentic guest feedback, star ratings, and community reviews.
        </p>
      </div>

      <TestimonialsClient initialItems={testimonials} />
    </div>
  );
}
