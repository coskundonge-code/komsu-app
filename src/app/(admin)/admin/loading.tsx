'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboardLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f0f2f5]">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-[#e0e0e0] bg-white">
        <div className="h-14 px-4 flex items-center justify-between">
          <Skeleton className="w-40 h-6 rounded" />
          <div className="flex gap-2">
            <Skeleton className="w-8 h-8 rounded" />
            <Skeleton className="w-8 h-8 rounded" />
          </div>
        </div>
      </div>

      {/* Main content area - with sidebar */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <aside className="w-64 border-r border-[#e0e0e0] bg-white p-4 flex-shrink-0">
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Skeleton key={i} className="w-full h-10 rounded" />
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {/* Page title */}
            <Skeleton className="w-48 h-8 rounded mb-6" />

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg border border-[#e0e0e0] p-4 space-y-3">
                  <Skeleton className="w-24 h-4 rounded" />
                  <Skeleton className="w-32 h-6 rounded" />
                  <Skeleton className="w-20 h-3 rounded" />
                </div>
              ))}
            </div>

            {/* Charts/Tables section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-lg border border-[#e0e0e0] p-4">
                  <Skeleton className="w-32 h-6 rounded mb-4" />
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <div key={j} className="h-8 flex items-center">
                        <Skeleton className="flex-1 h-4 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Table section */}
            <div className="bg-white rounded-lg border border-[#e0e0e0] p-4">
              <Skeleton className="w-40 h-6 rounded mb-4" />
              <div className="space-y-3">
                {/* Table header */}
                <div className="flex gap-3 pb-3 border-b border-[#e0e0e0]">
                  <Skeleton className="w-20 h-4 rounded" />
                  <Skeleton className="flex-1 h-4 rounded" />
                  <Skeleton className="w-24 h-4 rounded" />
                  <Skeleton className="w-16 h-4 rounded" />
                </div>
                {/* Table rows */}
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-3 py-3 border-b border-[#e0e0e0]">
                    <Skeleton className="w-20 h-4 rounded" />
                    <Skeleton className="flex-1 h-4 rounded" />
                    <Skeleton className="w-24 h-4 rounded" />
                    <Skeleton className="w-16 h-4 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
