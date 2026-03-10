'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function NotificationsLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f0f2f5]">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#e0e0e0] p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <Skeleton className="w-40 h-8 rounded" />
            <div className="flex gap-2">
              <Skeleton className="w-20 h-8 rounded-lg" />
              <Skeleton className="w-20 h-8 rounded-lg" />
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full flex-shrink-0" />
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4">
        {/* Notifications list */}
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-[#e0e0e0] p-4 hover:bg-[#f9f9f9] transition-colors cursor-pointer"
            >
              <div className="flex gap-4">
                {/* Avatar */}
                <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-2">
                  {/* Title */}
                  <div className="flex items-start justify-between gap-2">
                    <Skeleton className="w-48 h-4 rounded" />
                    <Skeleton className="w-12 h-3 rounded flex-shrink-0" />
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <Skeleton className="w-full h-3 rounded" />
                    <Skeleton className="w-4/5 h-3 rounded" />
                  </div>

                  {/* Meta info */}
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="w-20 h-2 rounded" />
                    <Skeleton className="w-24 h-2 rounded" />
                  </div>
                </div>

                {/* Unread indicator */}
                {i % 3 === 0 && (
                  <Skeleton className="w-3 h-3 rounded-full flex-shrink-0 mt-1" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Load more button */}
        <div className="mt-6 text-center">
          <Skeleton className="w-32 h-10 rounded-lg mx-auto" />
        </div>
      </main>
    </div>
  );
}
