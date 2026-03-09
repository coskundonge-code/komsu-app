import { FeedSkeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f0f2f5] p-4">
      <div className="max-w-2xl mx-auto">
        <FeedSkeleton />
      </div>
    </div>
  );
}
