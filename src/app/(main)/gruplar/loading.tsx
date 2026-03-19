'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function GroupsLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-surface border-b border-border p-4">
        <div className="max-w-7xl mx-auto">
          {/* Title */}
          <Skeleton className="w-48 h-8 rounded mb-4" />

          {/* Search and filters */}
          <div className="flex gap-2 mb-4">
            <Skeleton className="flex-1 h-10 rounded-lg" />
            <Skeleton className="w-24 h-10 rounded-lg" />
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full flex-shrink-0" />
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4">
        {/* Grid layout for groups */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow">
              {/* Group banner */}
              <div className="relative bg-gradient-to-r from-[#e0e0e0] to-[#d0d0d0]">
                <Skeleton className="w-full h-32 rounded-none" />
                {/* Group avatar overlay */}
                <div className="absolute -bottom-6 left-4">
                  <Skeleton className="w-16 h-16 rounded-full border-4 border-white" />
                </div>
              </div>

              {/* Group info */}
              <div className="p-4 pt-10 space-y-3">
                {/* Group name */}
                <Skeleton className="w-full h-4 rounded" />
                <Skeleton className="w-4/5 h-4 rounded" />

                {/* Member count and description */}
                <div className="space-y-2 pt-2">
                  <Skeleton className="w-32 h-3 rounded" />
                  <Skeleton className="w-full h-3 rounded" />
                  <Skeleton className="w-3/4 h-3 rounded" />
                </div>

                {/* Privacy badge */}
                <div className="flex gap-2 pt-2">
                  <Skeleton className="w-16 h-5 rounded" />
                  <Skeleton className="w-16 h-5 rounded" />
                </div>

                {/* Join/View button */}
                <Skeleton className="w-full h-10 rounded mt-4" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
