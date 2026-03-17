# Mahallem Utility Components Guide

This guide covers the three new utility components created for Mahallem.

---

## 1. useInfiniteScroll Hook

**Location:** `src/lib/hooks/use-infinite-scroll.ts`

A custom React hook that implements infinite scroll functionality using the Intersection Observer API.

### Features
- Detects when a sentinel element becomes visible
- Calls `loadMore` callback when the sentinel is in view
- Built-in debouncing to prevent multiple rapid calls (300ms default)
- Configurable threshold and debounce interval
- Full TypeScript typing

### Props & Options
```typescript
useInfiniteScroll(
  loadMore: () => Promise<void>,
  options?: {
    threshold?: number;        // IntersectionObserver threshold (default: 0.1)
    debounceMs?: number;       // Debounce delay in ms (default: 300)
  }
)
```

### Returns
```typescript
{
  ref: React.RefObject<HTMLDivElement>;  // Attach to sentinel element
  isLoading: boolean;                     // Loading state
  hasMore: boolean;                       // Whether more items exist
  setHasMore: (value: boolean) => void;   // Control hasMore state
}
```

### Example Usage
```tsx
'use client';

import { useInfiniteScroll } from '@/lib/hooks';
import { useState, useCallback } from 'react';
import { Spinner } from '@/components/ui/spinner';

export function ProductList() {
  const [items, setItems] = useState([]);

  const loadMoreItems = useCallback(async () => {
    try {
      const response = await fetch('/api/products?page=...');
      const newItems = await response.json();

      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems(prev => [...prev, ...newItems]);
      }
    } catch (error) {
      console.error('Failed to load items:', error);
    }
  }, []);

  const { ref, isLoading, hasMore, setHasMore } = useInfiniteScroll(
    loadMoreItems,
    { threshold: 0.1, debounceMs: 500 }
  );

  return (
    <div className="space-y-4">
      {items.map(item => (
        <div key={item.id} className="p-4 border rounded">
          {item.name}
        </div>
      ))}

      {hasMore && (
        <div ref={ref} className="flex justify-center py-8">
          {isLoading && <Spinner size="md" />}
        </div>
      )}
    </div>
  );
}
```

---

## 2. ImageCarousel Component

**Location:** `src/components/ui/image-carousel.tsx`

A fully-featured image carousel with auto-play, swipe support, and responsive design.

### Features
- Auto-play functionality (configurable interval)
- Touch/swipe support for mobile devices
- Dot indicators at bottom (active: #00833e, inactive: #e0e0e0)
- Previous/Next arrow buttons (visible on desktop hover)
- Smooth CSS transitions between slides
- Responsive full-width design
- Uses Next.js Image with `unoptimized` for external URLs
- Proper accessibility with ARIA labels

### Props
```typescript
interface ImageCarouselProps {
  images: string[];                    // Array of image URLs
  autoPlay?: boolean;                  // Enable auto-play (default: true)
  interval?: number;                   // Auto-play interval in ms (default: 5000)
  className?: string;                  // Additional CSS classes
}
```

### Example Usage
```tsx
'use client';

import { ImageCarousel } from '@/components/ui/image-carousel';

export function ProductCarousel() {
  const images = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <ImageCarousel
        images={images}
        autoPlay={true}
        interval={4000}
        className="rounded-xl shadow-lg"
      />
    </div>
  );
}
```

### Mobile Behavior
- Swipe left to go to next slide
- Swipe right to go to previous slide
- Touch indicators to jump to specific slide

### Desktop Behavior
- Hover to see Previous/Next buttons
- Click indicators to jump to specific slide
- Auto-play pauses on hover

---

## 3. PullToRefresh Component

**Location:** `src/components/ui/pull-to-refresh.tsx`

A mobile-friendly pull-to-refresh component with smooth animations.

### Features
- Works only on mobile devices (detects via user agent)
- Activates on 80px pull distance (customizable)
- Smooth spring animation back to original position
- Visual feedback with green spinner (#00833e)
- Shows "Pull to refresh", "Release to refresh", and "Refreshing..." states
- Touch-based interaction only
- Prevents scroll when pulling

### Props
```typescript
interface PullToRefreshProps {
  onRefresh: () => Promise<void>;      // Async callback for refresh
  children: React.ReactNode;           // Content to wrap
  threshold?: number;                  // Pull distance threshold in px (default: 80)
  className?: string;                  // Additional CSS classes
}
```

### Example Usage
```tsx
'use client';

import { PullToRefresh } from '@/components/ui/pull-to-refresh';
import { useState } from 'react';

export function FeedPage() {
  const [items, setItems] = useState([]);

  const handleRefresh = async () => {
    try {
      const response = await fetch('/api/feed?fresh=true');
      const newItems = await response.json();
      setItems(newItems);
    } catch (error) {
      console.error('Refresh failed:', error);
      throw error;
    }
  };

  return (
    <PullToRefresh
      onRefresh={handleRefresh}
      threshold={80}
      className="h-screen"
    >
      <div className="p-4 space-y-4">
        {items.map(item => (
          <div key={item.id} className="p-4 bg-white rounded-lg shadow">
            {item.content}
          </div>
        ))}
      </div>
    </PullToRefresh>
  );
}
```

### Interaction Flow
1. User pulls down from top of container
2. Visual indicator shows pull progress
3. At 80px, text changes to "Release to refresh"
4. Releasing triggers `onRefresh` callback
5. Spinner shows while loading
6. Smoothly animates back to top position

---

## Brand Colors

All components use KomşuApp's brand colors:
- **Primary Green:** `#00833e` (active indicators, spinner)
- **Light Green:** `#a7dbb8` (spinner border)
- **Inactive Dots:** `#e0e0e0`

---

## TypeScript Support

All components are fully typed with TypeScript:

```typescript
// Import types if needed
import { useInfiniteScroll } from '@/lib/hooks';
// Types are automatically available through JSDoc and interface exports
```

---

## Performance Considerations

### useInfiniteScroll
- Uses IntersectionObserver (native browser API, no polling)
- Debounces rapid calls to prevent unnecessary requests
- Automatically cleans up timeouts and observers

### ImageCarousel
- Only one image is visible at a time (others use `opacity-0`)
- CSS transitions for smooth animations
- Touch event listeners only on mobile
- Auto-play timeout cleaned up on component unmount

### PullToRefresh
- Only activates on mobile devices
- Touch event listeners only attached when needed
- Proper cleanup of event listeners
- No network requests made by component itself

---

## Browser Support

- **useInfiniteScroll:** All modern browsers (requires IntersectionObserver)
- **ImageCarousel:** All modern browsers (next/image support)
- **PullToRefresh:** Mobile browsers with touch support

---

## Accessibility

- ImageCarousel: ARIA labels for buttons and indicators
- PullToRefresh: Works with screen readers for mobile
- All components support keyboard navigation where applicable

---

## Common Patterns

### Combined Infinite Scroll + Carousel
```tsx
<PullToRefresh onRefresh={refreshProducts}>
  <div className="space-y-4">
    {products.map(product => (
      <div key={product.id}>
        <ImageCarousel images={product.images} />
        <h3>{product.name}</h3>
      </div>
    ))}
    {hasMore && (
      <div ref={ref}>
        {isLoading && <Spinner />}
      </div>
    )}
  </div>
</PullToRefresh>
```

### Loading States
Use `isLoading` from `useInfiniteScroll` to show loading indicator:
```tsx
<div ref={ref} className="py-8 flex justify-center">
  {isLoading ? (
    <Spinner size="md" variant="primary" />
  ) : (
    <p className="text-gray-500">No more items</p>
  )}
</div>
```
