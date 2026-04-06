'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navbar placeholder */}
      <div className="sticky top-0 z-40 border-b border-border bg-surface">
        <div className="h-14 px-4 flex items-center gap-4">
          <Skeleton className="w-8 h-8 rounded" />
          <Skeleton className="w-40 h-6 rounded flex-1 max-w-xs" />
          <Skeleton className="w-8 h-8 rounded" />
        </div>
      </div>

      {/* Main content area - 3 column layout */}
      <div className="max-w-[1440px] mx-auto w-full flex flex-1 px-0 xl:px-4">
        {/* Left Sidebar skeleton */}
        <aside className="hidden lg:block sticky top-14 h-[calc(100vh-56px)] w-64 border-r border-border bg-surface p-4 flex-shrink-0">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-full h-10 rounded" />
            ))}
          </div>
        </aside>

        {/* Center Content - Feed skeleton */}
        <main className="flex-1 min-w-0 p-4 pb-20 lg:pb-4">
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Create post card skeleton */}
            <div className="bg-surface rounded-lg border border-border p-4">
              <div className="flex gap-3 mb-4">
                <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                <Skeleton className="flex-1 h-10 rounded" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="w-20 h-8 rounded flex-1" />
                <Skeleton className="w-20 h-8 rounded flex-1" />
                <Skeleton className="w-20 h-8 rounded flex-1" />
              </div>
            </div>

            {/* Post card skeletons */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface rounded-lg border border-border">
                {/* Post header */}
                <div className="p-4 border-b border-border">
                  <div className="flex items-start gap-3">
                    <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="w-32 h-4 rounded" />
                      <Skeleton className="w-24 h-3 rounded" />
                    </div>
                  </div>
                </div>

                {/* Post content */}
                <div className="px-4 py-3 space-y-3">
                  <Skeleton className="w-full h-4 rounded" />
                  <Skeleton className="w-full h-4 rounded" />
                  <Skeleton className="w-3/4 h-4 rounded" />
                </div>

                {/* Post media */}
                <div className="px-4 py-2">
                  <Skeleton className="w-full h-48 rounded-lg" />
                </div>

                {/* Post interactions */}
                <div className="px-4 py-3 border-t border-border flex justify-around">
                  <Skeleton className="w-16 h-8 rounded" />
                  <Skeleton className="w-16 h-8 rounded" />
                  <Skeleton className="w-16 h-8 rounded" />
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Right Sidebar skeleton */}
        <aside className="hidden xl:block w-80 border-l border-border bg-surface p-4 flex-shrink-0 sticky top-14 h-[calc(100vh-56px)]">
          <div className="space-y-4">
            <Skeleton className="w-full h-10 rounded" />
            <div className="space-y-3 pt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2 p-3 rounded border border-border">
                  <Skeleton className="w-full h-4 rounded" />
                  <Skeleton className="w-3/4 h-3 rounded" />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
