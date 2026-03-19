'use client';

import { cn } from '@/lib/utils';

/**
 * Base Skeleton Component
 * Simple reusable skeleton with animated pulse effect using Tailwind's animate-pulse
 * Accepts className prop for customization
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-[#e0e0e0] rounded animate-pulse',
        className
      )}
    />
  );
}

/**
 * Post Card Skeleton
 * Mimics the structure of a post card with animated loading placeholders
 */
export function PostSkeleton() {
  return (
    <div className="bg-surface rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />

          {/* Author info */}
          <div className="flex-1 space-y-2">
            <Skeleton className="w-32 h-4 rounded" />
            <Skeleton className="w-24 h-3 rounded" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-3 space-y-3">
        {/* Title */}
        <Skeleton className="w-full h-4 rounded" />

        {/* Body text lines */}
        <Skeleton className="w-full h-4 rounded" />
        <Skeleton className="w-3/4 h-4 rounded" />
      </div>

      {/* Media placeholder */}
      <div className="px-4 py-2">
        <Skeleton className="w-full h-48 rounded-lg" />
      </div>

      {/* Reactions area */}
      <div className="px-4 py-3 border-t border-gray-100 space-y-2">
        <div className="flex gap-4">
          <Skeleton className="w-12 h-8 rounded" />
          <Skeleton className="w-12 h-8 rounded" />
          <Skeleton className="w-12 h-8 rounded" />
        </div>
      </div>

      {/* Footer actions */}
      <div className="px-4 py-3 flex items-center justify-around border-t border-gray-100">
        <Skeleton className="w-20 h-8 rounded" />
        <Skeleton className="w-20 h-8 rounded" />
      </div>
    </div>
  );
}

/**
 * Listing Card Skeleton
 * For marketplace/classified listings
 */
export function ListingSkeleton() {
  return (
    <div className="bg-surface rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Image */}
      <Skeleton className="w-full h-40 rounded-none" />

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Price */}
        <Skeleton className="w-24 h-5 rounded" />

        {/* Title */}
        <Skeleton className="w-full h-4 rounded" />

        {/* Description lines */}
        <Skeleton className="w-full h-3 rounded" />
        <Skeleton className="w-4/5 h-3 rounded" />

        {/* Location and date */}
        <div className="flex justify-between pt-2">
          <Skeleton className="w-20 h-3 rounded" />
          <Skeleton className="w-16 h-3 rounded" />
        </div>
      </div>
    </div>
  );
}

/**
 * Event Card Skeleton
 * For events display
 */
export function EventSkeleton() {
  return (
    <div className="bg-surface rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Event image or date banner */}
      <div className="bg-gray-100 p-4">
        <Skeleton className="w-full h-24 rounded" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Date/Time */}
        <Skeleton className="w-32 h-4 rounded" />

        {/* Title */}
        <Skeleton className="w-full h-4 rounded" />
        <Skeleton className="w-3/4 h-4 rounded" />

        {/* Location */}
        <Skeleton className="w-full h-3 rounded" />

        {/* Attendees */}
        <div className="pt-2 space-y-2">
          <Skeleton className="w-24 h-3 rounded" />
          <div className="flex gap-1">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="w-6 h-6 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Action button */}
      <div className="px-4 py-3 border-t border-gray-100">
        <Skeleton className="w-full h-10 rounded" />
      </div>
    </div>
  );
}

/**
 * Business Card Skeleton
 * For business listings/profiles
 */
export function BusinessSkeleton() {
  return (
    <div className="bg-surface rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header/Cover image */}
      <Skeleton className="w-full h-32 rounded-none" />

      {/* Content with negative margin for overlapping avatar */}
      <div className="px-4 pt-2 pb-4 space-y-3">
        {/* Avatar (overlapped) */}
        <div className="flex items-end gap-3 -mt-8 mb-2">
          <Skeleton className="w-16 h-16 rounded-full border-4 border-white" />
          <div className="flex-1 space-y-2">
            <Skeleton className="w-32 h-4 rounded" />
            <Skeleton className="w-24 h-3 rounded" />
          </div>
        </div>

        {/* Description */}
        <Skeleton className="w-full h-3 rounded" />
        <Skeleton className="w-5/6 h-3 rounded" />

        {/* Rating and info */}
        <div className="flex justify-between pt-2">
          <Skeleton className="w-20 h-3 rounded" />
          <Skeleton className="w-16 h-3 rounded" />
        </div>
      </div>

      {/* Action button */}
      <div className="px-4 py-3 border-t border-gray-100">
        <Skeleton className="w-full h-10 rounded" />
      </div>
    </div>
  );
}

/**
 * User Profile Skeleton
 * For user profile cards
 */
export function UserProfileSkeleton() {
  return (
    <div className="bg-surface rounded-lg shadow-sm border border-gray-200 p-6 text-center space-y-4">
      {/* Avatar */}
      <Skeleton className="w-16 h-16 rounded-full mx-auto" />

      {/* Name */}
      <Skeleton className="w-32 h-4 rounded mx-auto" />

      {/* Handle/username */}
      <Skeleton className="w-24 h-3 rounded mx-auto" />

      {/* Bio */}
      <div className="space-y-2">
        <Skeleton className="w-full h-3 rounded" />
        <Skeleton className="w-4/5 h-3 rounded mx-auto" />
      </div>

      {/* Stats */}
      <div className="flex justify-around pt-4 border-t border-gray-100">
        <div className="space-y-1">
          <Skeleton className="w-8 h-4 rounded mx-auto" />
          <Skeleton className="w-12 h-3 rounded" />
        </div>
        <div className="space-y-1">
          <Skeleton className="w-8 h-4 rounded mx-auto" />
          <Skeleton className="w-12 h-3 rounded" />
        </div>
        <div className="space-y-1">
          <Skeleton className="w-8 h-4 rounded mx-auto" />
          <Skeleton className="w-12 h-3 rounded" />
        </div>
      </div>

      {/* Follow button */}
      <Skeleton className="w-full h-10 rounded" />
    </div>
  );
}

/**
 * Feed Skeleton
 * Displays multiple post skeletons for feed loading
 */
export function FeedSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <PostSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Grid Skeleton
 * For displaying a grid of items (marketplace, events, etc.)
 */
export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ListingSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Chat Message Skeleton
 * For messaging/chat interfaces
 */
export function ChatMessageSkeleton() {
  return (
    <div className="flex gap-3 mb-4">
      <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="w-24 h-3 rounded" />
        <Skeleton className="w-full h-4 rounded" />
        <Skeleton className="w-4/5 h-4 rounded" />
      </div>
    </div>
  );
}

/**
 * Comment Skeleton
 * For comment sections
 */
export function CommentSkeleton() {
  return (
    <div className="flex gap-3 p-3 border-b border-gray-100">
      {/* Avatar */}
      <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />

      {/* Comment content */}
      <div className="flex-1 space-y-2">
        {/* Author info */}
        <Skeleton className="w-24 h-3 rounded" />

        {/* Comment text */}
        <Skeleton className="w-full h-3 rounded" />
        <Skeleton className="w-3/4 h-3 rounded" />
      </div>
    </div>
  );
}

/**
 * List Skeleton
 * For simple list items
 */
export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-gray-200">
          <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="w-24 h-3 rounded" />
            <Skeleton className="w-40 h-2 rounded" />
          </div>
          <Skeleton className="w-8 h-8 rounded" />
        </div>
      ))}
    </div>
  );
}

/**
 * Header Skeleton
 * For page headers/sections
 */
export function HeaderSkeleton() {
  return (
    <div className="space-y-4 mb-6">
      <Skeleton className="w-40 h-8 rounded" />
      <Skeleton className="w-full h-4 rounded" />
      <Skeleton className="w-4/5 h-4 rounded" />
    </div>
  );
}
