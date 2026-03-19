'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function PazarLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header with filters */}
      <div className="sticky top-0 z-30 bg-surface border-b border-border p-4">
        <div className="max-w-7xl mx-auto">
          {/* Search bar */}
          <div className="mb-4">
            <Skeleton className="w-full h-10 rounded-lg" />
          </div>

          {/* Filter chips */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full flex-shrink-0" />
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4">
        {/* Grid of listing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden">
              {/* Image placeholder */}
              <Skeleton className="w-full h-40 rounded-none" />

              {/* Content */}
              <div className="p-3 space-y-3">
                {/* Category badge */}
                <Skeleton className="w-16 h-5 rounded" />

                {/* Title */}
                <Skeleton className="w-full h-4 rounded" />
                <Skeleton className="w-4/5 h-4 rounded" />

                {/* Price */}
                <Skeleton className="w-24 h-5 rounded" />

                {/* Description lines */}
                <Skeleton className="w-full h-3 rounded" />
                <Skeleton className="w-3/4 h-3 rounded" />

                {/* Footer with location and date */}
                <div className="flex justify-between pt-2 border-t border-border">
                  <Skeleton className="w-20 h-3 rounded" />
                  <Skeleton className="w-16 h-3 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
