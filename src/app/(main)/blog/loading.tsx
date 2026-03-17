'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function BlogLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f0f2f5]">
      {/* Header with search and filters */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#e0e0e0] p-4">
        <div className="max-w-7xl mx-auto">
          {/* Title */}
          <Skeleton className="w-48 h-8 rounded mb-4" />

          {/* Search and filter */}
          <div className="flex gap-2 mb-4">
            <Skeleton className="flex-1 h-10 rounded-lg" />
            <Skeleton className="w-24 h-10 rounded-lg" />
          </div>

          {/* Category filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full flex-shrink-0" />
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Featured article - full width on left */}
          <div className="lg:col-span-2 space-y-4">
            {/* Featured post */}
            <div className="bg-white rounded-lg shadow-md border border-[#e0e0e0] overflow-hidden">
              {/* Featured image */}
              <Skeleton className="w-full h-64 rounded-none" />

              {/* Featured content */}
              <div className="p-6 space-y-3">
                {/* Category */}
                <Skeleton className="w-20 h-4 rounded" />

                {/* Title */}
                <Skeleton className="w-full h-6 rounded" />
                <Skeleton className="w-4/5 h-6 rounded" />

                {/* Excerpt */}
                <div className="space-y-2 pt-2">
                  <Skeleton className="w-full h-3 rounded" />
                  <Skeleton className="w-full h-3 rounded" />
                  <Skeleton className="w-3/4 h-3 rounded" />
                </div>

                {/* Meta */}
                <div className="flex gap-4 pt-4 border-t border-[#e0e0e0]">
                  <Skeleton className="w-20 h-3 rounded" />
                  <Skeleton className="w-20 h-3 rounded" />
                  <Skeleton className="w-20 h-3 rounded" />
                </div>

                {/* Read more button */}
                <Skeleton className="w-32 h-10 rounded mt-2" />
              </div>
            </div>

            {/* More recent articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden hover:shadow-md transition-shadow">
                  <Skeleton className="w-full h-40 rounded-none" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="w-16 h-4 rounded" />
                    <Skeleton className="w-full h-4 rounded" />
                    <Skeleton className="w-4/5 h-4 rounded" />
                    <Skeleton className="w-full h-3 rounded mt-2" />
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="w-16 h-3 rounded" />
                      <Skeleton className="w-16 h-3 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-2 space-y-4">
            {/* Popular articles */}
            <div className="bg-white rounded-lg border border-[#e0e0e0] p-4">
              <Skeleton className="w-32 h-6 rounded mb-4" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="pb-4 border-b border-[#e0e0e0] last:border-0">
                    <Skeleton className="w-full h-4 rounded mb-2" />
                    <Skeleton className="w-3/4 h-3 rounded mb-2" />
                    <Skeleton className="w-20 h-2 rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg border border-[#e0e0e0] p-4">
              <Skeleton className="w-28 h-6 rounded mb-4" />
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="w-full h-8 rounded" />
                ))}
              </div>
            </div>

            {/* Newsletter signup */}
            <div className="bg-gradient-to-b from-[#e8f5e9] to-white rounded-lg border border-[#c8e6c9] p-4 space-y-3">
              <Skeleton className="w-40 h-6 rounded" />
              <Skeleton className="w-full h-3 rounded" />
              <Skeleton className="w-full h-10 rounded-lg" />
            </div>
          </aside>
        </div>

        {/* All articles section */}
        <div className="mt-8">
          <Skeleton className="w-32 h-6 rounded mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden hover:shadow-md transition-shadow">
                <Skeleton className="w-full h-40 rounded-none" />
                <div className="p-4 space-y-2">
                  <Skeleton className="w-16 h-4 rounded" />
                  <Skeleton className="w-full h-4 rounded" />
                  <Skeleton className="w-4/5 h-4 rounded" />
                  <Skeleton className="w-full h-3 rounded mt-2" />
                  <Skeleton className="w-full h-3 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
