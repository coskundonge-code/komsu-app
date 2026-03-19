'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function BusinessPanelLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-surface">
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
        <aside className="w-64 border-r border-border bg-surface p-4 flex-shrink-0">
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="w-full h-10 rounded" />
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {/* Page title */}
            <Skeleton className="w-56 h-8 rounded mb-6" />

            {/* Business info card */}
            <div className="bg-surface rounded-lg border border-border p-4 mb-6">
              <div className="flex gap-4 items-start mb-4">
                <Skeleton className="w-20 h-20 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="w-40 h-6 rounded" />
                  <Skeleton className="w-60 h-4 rounded" />
                  <Skeleton className="w-32 h-3 rounded" />
                </div>
              </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-surface rounded-lg border border-border p-4 space-y-3">
                  <Skeleton className="w-24 h-4 rounded" />
                  <Skeleton className="w-32 h-6 rounded" />
                  <Skeleton className="w-20 h-3 rounded" />
                </div>
              ))}
            </div>

            {/* Content sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Main section */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-surface rounded-lg border border-border p-4">
                  <Skeleton className="w-40 h-6 rounded mb-4" />
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="pb-3 border-b border-border last:border-0">
                        <Skeleton className="w-full h-4 rounded mb-2" />
                        <Skeleton className="w-3/4 h-3 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar section */}
              <aside className="space-y-4">
                <div className="bg-surface rounded-lg border border-border p-4">
                  <Skeleton className="w-32 h-6 rounded mb-4" />
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="w-full h-8 rounded" />
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
