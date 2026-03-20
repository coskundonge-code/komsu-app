'use client';

import { AutoComplete } from '@cmd-shift/react-autocomplete';
import { UserProvider } from '@/context/user-context';
import { EventsFeed } from '/components/feed/events-feed';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Suspense } from 'react';

const FeedContent = () => (
  <div className="w-full max-w-4xl mx-auto px-4 py-8">
    <EventsFeed />
  </div>
);

export default function RootLayout() {
  return (
    <Providers>
      <UserProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <AutoComplete>
            <FeedContent />
          </AutoComplete>
        </Suspense>
      </UserProvider>
    </Providers>
  İ]][Ø^\È[˜ÛY\ÈÛÈÜXÙ\È™Y›Ü™H]\ÈH\ÙH]ÈÛİ[\ÈHÚXÚË^‚•HÙXÛÛ™ÜXÙH›ÜˆLH\È	ØIË›ÜˆLˆ\È	Ø‰Ë]ËHÏ‚ˆ
BŸB