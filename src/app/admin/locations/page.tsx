import { api } from "@/lib/api";
import { LocationsClient } from "./locations-client";

export const dynamic = "force-dynamic";

export default async function AdminLocationsPage() {
  let locations: any[] = [];
  try {
    const res = await api.getAdminLocations();
    locations = res?.data ?? [];
  } catch {
    locations = [];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#3A2418]">
          Bakery Locations & Branches
        </h1>
        <p className="text-sm text-[#3A2418]/70 mt-1">
          Manage physical store branches, opening hours, addresses, contact details, and Google Map locations.
        </p>
      </div>

      <LocationsClient initialLocations={locations} />
    </div>
  );
}
