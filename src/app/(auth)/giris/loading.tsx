'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function LoginLoading() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side - Illustration/Info (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-[#005e2c] items-center justify-center p-12">
        <div className="max-w-md text-white space-y-4">
          <Skeleton className="w-64 h-12 rounded bg-white/20" />
          <Skeleton className="w-full h-4 rounded bg-white/20" />
          <Skeleton className="w-full h-4 rounded bg-white/20" />
          <Skeleton className="w-3/4 h-4 rounded bg-white/20" />
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-12">
        <div className="w-full max-w-md space-y-6">
          {/* Logo */}
          <div className="text-center">
            <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
            <Skeleton className="w-40 h-8 rounded mx-auto" />
          </div>

          {/* Form card */}
          <div className="bg-surface rounded-lg border border-border p-6 space-y-4">
            {/* Title */}
            <div className="text-center mb-4">
              <Skeleton className="w-32 h-6 rounded mx-auto mb-2" />
              <Skeleton className="w-48 h-4 rounded mx-auto" />
            </div>

            {/* Email field */}
            <div className="space-y-2">
              <Skeleton className="w-24 h-4 rounded" />
              <Skeleton className="w-full h-10 rounded-lg" />
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <Skeleton className="w-24 h-4 rounded" />
              <Skeleton className="w-full h-10 rounded-lg" />
            </div>

            {/* Remember and forgot */}
            <div className="flex items-center justify-between">
              <Skeleton className="w-32 h-4 rounded" />
              <Skeleton className="w-32 h-4 rounded" />
            </div>

            {/* Login button */}
            <Skeleton className="w-full h-10 rounded-lg mt-6" />

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <Skeleton className="w-12 h-4 rounded bg-surface" />
              </div>
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="w-full h-10 rounded-lg" />
              <Skeleton className="w-full h-10 rounded-lg" />
            </div>

            {/* Sign up link */}
            <div className="text-center pt-4 border-t border-border">
              <Skeleton className="w-48 h-4 rounded mx-auto" />
            </div>
          </div>

          {/* Footer links */}
          <div className="flex justify-center gap-4 text-sm">
            <Skeleton className="w-20 h-3 rounded" />
            <Skeleton className="w-20 h-3 rounded" />
            <Skeleton className="w-20 h-3 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
