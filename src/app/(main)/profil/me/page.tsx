'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MyProfileRedirect() {
  const router = useRouter();

  useEffect(() => {
    // TODO: Replace with actual authenticated user ID
    router.replace('/profil/1');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}
