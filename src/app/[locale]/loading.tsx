import * as React from "react";
import { Skeleton, SkeletonCard, SkeletonText } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading page content"
      className="w-full min-h-[70vh] bg-warm-white py-8 md:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12"
    >
      {/* Hero Banner Skeleton */}
      <div className="relative rounded-2xl md:rounded-3xl bg-cream/50 border border-espresso/5 p-6 md:p-12 overflow-hidden shadow-card">
        <div className="max-w-2xl space-y-5">
          <Skeleton className="h-4 w-36 rounded-full bg-golden/20" />
          <Skeleton className="h-10 md:h-14 w-4/5 rounded-xl" />
          <SkeletonText lines={2} gap="space-y-3" />
          <div className="flex items-center gap-4 pt-4">
            <Skeleton className="h-11 w-36 rounded-xl bg-golden/30" />
            <Skeleton className="h-11 w-32 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Content Section Skeleton */}
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <Skeleton className="h-3 w-28 rounded-full" />
            <Skeleton className="h-8 w-48 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-24 rounded-lg hidden sm:block" />
        </div>

        {/* Product / Offer Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </div>
  );
}
