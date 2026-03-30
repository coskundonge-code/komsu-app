'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/lib/hooks/use-auth';

export default function ProfileRedirect() {
  const router = useRouter();
  const { user, loading } = useCurrentUser();

  useEffect(() => {
    if (!loading && user) {
      router.replace(`/profil/${user.id}`);
    } else if (!loading && !user) {
      router.replace('/giris');
    }
  }, [router, user, loading]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to demo user profile
    router.replace('/profil/1');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}
