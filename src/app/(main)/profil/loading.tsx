'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function ProfileLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f0f2f5]">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#e0e0e0] p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Skeleton className="w-40 h-6 rounded" />
          <Skeleton className="w-8 h-8 rounded" />
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4">
        {/* Profile header section */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden mb-4">
          {/* Cover image */}
          <Skeleton className="w-full h-40 rounded-none" />

          {/* Profile info */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end mb-6">
              {/* Avatar (positioned over cover) */}
              <div className="-mt-24 mb-4">
                <Skeleton className="w-32 h-32 rounded-full border-4 border-white" />
              </div>

              {/* User info */}
              <div className="flex-1 space-y-3">
                <Skeleton className="w-48 h-6 rounded" />
                <Skeleton className="w-64 h-4 rounded" />
                <div className="flex gap-2">
                  <Skeleton className="w-16 h-4 rounded" />
                  <Skeleton className="w-20 h-4 rounded" />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 w-full md:w-auto">
                <Skeleton className="flex-1 md:flex-none w-24 h-10 rounded-lg" />
                <Skeleton className="flex-1 md:flex-none w-24 h-10 rounded-lg" />
              </div>
            </div>

            {/* Bio/Description */}
            <div className="space-y-2 pt-4 border-t border-[#e0e0e0]">
              <Skeleton className="w-full h-3 rounded" />
              <Skeleton className="w-4/5 h-3 rounded" />
              <Skeleton className="w-3/4 h-3 rounded" />
            </div>
          </div>
        </div>

        {/* Tabs section */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden mb-4">
          <div className="border-b border-[#e0e0e0] p-4 flex gap-4">
            <Skeleton className="w-20 h-4 rounded" />
            <Skeleton className="w-20 h-4 rounded" />
            <Skeleton className="w-20 h-4 rounded" />
          </div>

          {/* Tab content - Posts grid */}
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-[#f0f2f5] rounded-lg overflow-hidden">
                  <Skeleton className="w-full h-32 rounded-none" />
                  <div className="p-3 space-y-2">
                    <Skeleton className="w-full h-3 rounded" />
                    <Skeleton className="w-3/4 h-3 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* About section */}
          <div className="bg-white rounded-lg border border-[#e0e0e0] p-4">
            <Skeleton className="w-24 h-6 rounded mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="w-24 h-4 rounded" />
                  <Skeleton className="w-32 h-4 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Joined section */}
          <div className="bg-white rounded-lg border border-[#e0e0e0] p-4">
            <Skeleton className="w-20 h-6 rounded mb-4" />
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="flex-1 h-4 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
