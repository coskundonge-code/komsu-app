'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function MessagesLoading() {
  return (
    <div className="flex h-screen bg-[#f0f2f5]">
      {/* Conversations sidebar */}
      <aside className="w-80 border-r border-[#e0e0e0] bg-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#e0e0e0]">
          <Skeleton className="w-full h-10 rounded-lg mb-3" />
          <Skeleton className="w-full h-8 rounded-lg" />
        </div>

        {/* Conversations list */}
        <div className="flex-1 overflow-y-auto">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-3 border-b border-[#e0e0e0] hover:bg-[#f0f2f5] cursor-pointer transition-colors">
              <div className="flex gap-3">
                {/* Avatar */}
                <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />

                {/* Conversation info */}
                <div className="flex-1 min-w-0">
                  <Skeleton className="w-28 h-4 rounded mb-2" />
                  <Skeleton className="w-full h-3 rounded" />
                  <Skeleton className="w-4/5 h-3 rounded mt-1" />
                </div>

                {/* Timestamp */}
                <Skeleton className="w-12 h-3 rounded flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat area */}
      <main className="flex-1 flex flex-col bg-white">
        {/* Chat header */}
        <div className="p-4 border-b border-[#e0e0e0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div>
              <Skeleton className="w-32 h-4 rounded mb-1" />
              <Skeleton className="w-20 h-3 rounded" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="w-10 h-10 rounded" />
            <Skeleton className="w-10 h-10 rounded" />
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Incoming message */}
          <div className="flex gap-3">
            <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="w-40 h-3 rounded" />
              <Skeleton className="w-32 h-3 rounded" />
            </div>
          </div>

          {/* Outgoing message */}
          <div className="flex gap-3 flex-row-reverse">
            <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2 text-right">
              <Skeleton className="w-48 h-3 rounded ml-auto" />
              <Skeleton className="w-40 h-3 rounded ml-auto" />
            </div>
          </div>

          {/* Multiple messages */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`flex gap-3 ${i % 2 === 0 ? 'flex-row-reverse' : ''}`}>
              <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-1">
                <Skeleton className="w-32 h-3 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Message input area */}
        <div className="p-4 border-t border-[#e0e0e0] flex gap-2">
          <Skeleton className="w-10 h-10 rounded flex-shrink-0" />
          <Skeleton className="flex-1 h-10 rounded-lg" />
          <Skeleton className="w-10 h-10 rounded flex-shrink-0" />
        </div>
      </main>
    </div>
  );
}
