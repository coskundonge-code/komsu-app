'use client';

import { EventForm } from '@/components/events/event-form';

export default function CreateEventPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Yeni Etkinlik Oluştur
          </h1>
          <p className="text-gray-600 mb-8">
            Mahallede bir etkinlik organize etmek istiyorsanız, lütfen aşağıdaki formu doldurun.
          </p>

          <EventForm />
        </div>
      </div>
    </div>
  );
}
