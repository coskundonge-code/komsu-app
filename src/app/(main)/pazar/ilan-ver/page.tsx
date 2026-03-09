'use client';

import { useRouter } from 'next/navigation';
import { ListingForm } from '@/components/marketplace/listing-form';
import type { ListingFormData } from '@/components/marketplace/listing-form';

export default function CreateListingPage() {
  const router = useRouter();

  const handleSubmit = (data: ListingFormData) => {
    console.log('New listing:', data);
    // In a real app, this would submit to your API
    // After successful submission, redirect to marketplace
    router.push('/pazar');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto">
        <ListingForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  );
}
