'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f0f2f5]">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#e0e0e0] p-4">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="w-40 h-8 rounded" />
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Settings sidebar menu */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-[#e0e0e0] p-4">
              <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="w-full h-10 rounded" />
                ))}
              </div>
            </div>
          </aside>

          {/* Settings content */}
          <div className="lg:col-span-3 space-y-4">
            {/* Account settings section */}
            <div className="bg-white rounded-lg border border-[#e0e0e0] p-6">
              <Skeleton className="w-48 h-6 rounded mb-4" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-b border-[#e0e0e0] pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <Skeleton className="w-32 h-4 rounded" />
                      <Skeleton className="w-12 h-6 rounded-full" />
                    </div>
                    <Skeleton className="w-64 h-3 rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* Preferences section */}
            <div className="bg-white rounded-lg border border-[#e0e0e0] p-6">
              <Skeleton className="w-40 h-6 rounded mb-4" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-b border-[#e0e0e0] pb-4 last:border-0">
                    <Skeleton className="w-32 h-4 rounded mb-2" />
                    <div className="flex gap-2">
                      <Skeleton className="w-16 h-8 rounded" />
                      <Skeleton className="w-16 h-8 rounded" />
                      <Skeleton className="w-16 h-8 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notification settings */}
            <div className="bg-white rounded-lg border border-[#e0e0e0] p-6">
              <Skeleton className="w-56 h-6 rounded mb-4" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between border-b border-[#e0e0e0] pb-4 last:border-0">
                    <div className="flex-1">
                      <Skeleton className="w-40 h-4 rounded mb-1" />
                      <Skeleton className="w-60 h-3 rounded" />
                    </div>
                    <Skeleton className="w-12 h-6 rounded-full flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Danger zone */}
            <div className="bg-white rounded-lg border border-red-200 border-dashed p-6">
              <Skeleton className="w-48 h-6 rounded mb-4" />
              <Skeleton className="w-64 h-4 rounded mb-4" />
              <Skeleton className="w-32 h-10 rounded bg-red-100" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
