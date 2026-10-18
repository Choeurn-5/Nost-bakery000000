import { api } from "@/lib/api";
import { SectionsManager } from "./sections-manager";

export const dynamic = "force-dynamic";

const DEFAULT_SECTIONS = [
  { sectionKey: "hero", headlineEn: "Artisanal Bakery & Café in Siem Reap", sortOrder: 0 },
  { sectionKey: "offers", headlineEn: "Special Offers & Daily Deals", sortOrder: 1 },
  { sectionKey: "categories", headlineEn: "Explore Our Fresh Creations", sortOrder: 2 },
  { sectionKey: "favourites", headlineEn: "Siem Reap's Daily Favourites", sortOrder: 3 },
  { sectionKey: "promise", headlineEn: "Baked Fresh Every Morning", sortOrder: 4 },
  { sectionKey: "business", headlineEn: "Wholesale & Business Supplies", sortOrder: 5 },
  { sectionKey: "cafe", headlineEn: "Dine-in Experience & Atmosphere", sortOrder: 6 },
  { sectionKey: "reach", headlineEn: "Find Us Across Siem Reap", sortOrder: 7 },
  { sectionKey: "social", headlineEn: "Follow Our Daily Baking Stories", sortOrder: 8 },
  { sectionKey: "cta", headlineEn: "Taste the Real Artisan Difference", sortOrder: 9 },
];

export default async function AdminHomeSectionsPage() {
  let sections: any[] = [];
  try {
    const res = await api.getAdminHomeSections();
    if (res?.data && res.data.length > 0) {
      sections = res.data;
    } else {
      const data = await api.getHomeSections();
      if (data && Object.keys(data).length > 0) {
        sections = Object.values(data);
      }
    }
  } catch {
    sections = [];
  }

  if (sections.length === 0) {
    sections = DEFAULT_SECTIONS.map((sec, idx) => ({
      id: `default-${sec.sectionKey}`,
      sectionKey: sec.sectionKey,
      headlineEn: sec.headlineEn,
      headlineKm: "",
      subHeadlineEn: "",
      subHeadlineKm: "",
      bodyEn: "",
      bodyKm: "",
      buttonLabelEn: "",
      buttonLabelKm: "",
      buttonLink: "",
      button2LabelEn: "",
      button2LabelKm: "",
      button2Link: "",
      image: null,
      videoUrl: null,
      isVisible: true,
      sortOrder: sec.sortOrder ?? idx,
      extraData: null,
    }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#3A2418]">
          Home Page Sections
        </h1>
        <p className="text-sm text-[#3A2418]/70 mt-1">
          Arrange and customize the 10 landing page content blocks, buttons, media visuals, and visibility status.
        </p>
      </div>

      <SectionsManager initialSections={sections} />
    </div>
  );
}
