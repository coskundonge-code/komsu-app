'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function BusinessListingsLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f0f2f5]">
      {/* Header with filters */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#e0e0e0] p-4">
        <div className="max-w-7xl mx-auto">
          {/* Title and search */}
          <div className="mb-4">
            <Skeleton className="w-48 h-8 rounded mb-4" />
            <Skeleton className="w-full h-10 rounded-lg" />
          </div>

          {/* Filter options */}
          <div className="flex gap-2 overflow-x-auto pt-4 pb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full flex-shrink-0" />
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4">
        {/* Grid layout for businesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden hover:shadow-md transition-shadow">
              {/* Business image/banner */}
              <div className="relative">
                <Skeleton className="w-full h-40 rounded-none" />
                {/* Rating badge */}
                <div className="absolute top-2 right-2 bg-[#00833e] bg-opacity-90 rounded p-2">
                  <Skeleton className="w-12 h-8 rounded" />
                </div>
              </div>

              {/* Business info */}
              <div className="p-4 space-y-3">
                {/* Business name */}
                <Skeleton className="w-full h-4 rounded" />
                <Skeleton className="w-4/5 h-4 rounded" />

                {/* Category and location */}
                <div className="space-y-2 pt-2">
                  <Skeleton className="w-32 h-3 rounded" />
                  <Skeleton className="w-full h-3 rounded" />
                </div>

                {/* Description */}
                <div className="space-y-2 pt-2">
                  <Skeleton className="w-full h-3 rounded" />
                  <Skeleton className="w-4/5 h-3 rounded" />
                </div>

                {/* Hours section */}
                <div className="pt-3 border-t border-[#e0e0e0]">
                  <Skeleton className="w-20 h-3 rounded mb-2" />
                  <Skeleton className="w-full h-3 rounded" />
                </div>

                {/* Contact button */}
                <Skeleton className="w-full h-10 rounded mt-3" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
