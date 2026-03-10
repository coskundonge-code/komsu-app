'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function DiscoverLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f0f2f5]">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#e0e0e0] p-4">
        <div className="max-w-7xl mx-auto">
          {/* Title and search */}
          <div className="mb-4">
            <Skeleton className="w-48 h-8 rounded mb-4" />
            <Skeleton className="w-full h-10 rounded-lg" />
          </div>

          {/* Trending filters */}
          <div className="flex gap-2 overflow-x-auto pt-4 pb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full flex-shrink-0" />
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4">
        {/* Featured/Hero section */}
        <div className="mb-8">
          <Skeleton className="w-40 h-6 rounded mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Large featured item */}
            <div className="md:row-span-2 bg-white rounded-lg shadow-md border border-[#e0e0e0] overflow-hidden">
              <Skeleton className="w-full h-80 rounded-none" />
              <div className="p-4 space-y-2">
                <Skeleton className="w-full h-4 rounded" />
                <Skeleton className="w-3/4 h-4 rounded" />
              </div>
            </div>

            {/* Small featured items */}
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden">
                <Skeleton className="w-full h-32 rounded-none" />
                <div className="p-3 space-y-1">
                  <Skeleton className="w-full h-3 rounded" />
                  <Skeleton className="w-3/4 h-3 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories section */}
        <div className="mb-8">
          <Skeleton className="w-40 h-6 rounded mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-lg border border-[#e0e0e0] p-4 text-center hover:shadow-md transition-shadow">
                <Skeleton className="w-16 h-16 rounded-full mx-auto mb-3" />
                <Skeleton className="w-full h-4 rounded" />
                <Skeleton className="w-20 h-3 rounded mx-auto mt-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Trending posts section */}
        <div className="mb-8">
          <Skeleton className="w-40 h-6 rounded mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden hover:shadow-md transition-shadow">
                {/* Post image with trending badge */}
                <div className="relative">
                  <Skeleton className="w-full h-40 rounded-none" />
                  <div className="absolute top-2 left-2 bg-[#ff6b6b] bg-opacity-90 rounded px-2 py-1">
                    <Skeleton className="w-12 h-4 rounded" />
                  </div>
                </div>

                {/* Post content */}
                <div className="p-4 space-y-3">
                  {/* Category */}
                  <Skeleton className="w-20 h-3 rounded" />

                  {/* Title */}
                  <Skeleton className="w-full h-4 rounded" />
                  <Skeleton className="w-4/5 h-4 rounded" />

                  {/* Description */}
                  <div className="space-y-1">
                    <Skeleton className="w-full h-3 rounded" />
                    <Skeleton className="w-3/4 h-3 rounded" />
                  </div>

                  {/* Engagement metrics */}
                  <div className="flex gap-3 pt-3 border-t border-[#e0e0e0]">
                    <Skeleton className="w-16 h-3 rounded" />
                    <Skeleton className="w-16 h-3 rounded" />
                    <Skeleton className="w-16 h-3 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* People to follow section */}
        <div className="mb-8">
          <Skeleton className="w-48 h-6 rounded mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg border border-[#e0e0e0] p-4 text-center">
                <Skeleton className="w-16 h-16 rounded-full mx-auto mb-3" />
                <Skeleton className="w-full h-4 rounded mb-1" />
                <Skeleton className="w-24 h-3 rounded mx-auto mb-3" />
                <Skeleton className="w-full h-8 rounded-lg" />
              </div>
            ))}
          </div>
        </div>

        {/* Load more */}
        <div className="text-center">
          <Skeleton className="w-32 h-10 rounded-lg mx-auto" />
        </div>
      </main>
    </div>
  );
}
