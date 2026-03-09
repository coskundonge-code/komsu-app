# Skeleton Loading Components - Usage Guide

## Overview
The skeleton loading components provide visually appealing loading states with smooth shimmer animations. They use the `.skeleton` CSS class from `globals.css` which includes a 1.5s infinite shimmer animation.

## Available Components

### Base Components

#### `Skeleton`
Basic skeleton element with shimmer animation.
```tsx
import { Skeleton } from '@/components/ui/skeleton';

<Skeleton className="w-20 h-4 rounded" />
```

### Content-Specific Skeletons

#### `PostSkeleton`
Post card loading state with header, content, media, reactions, and actions.
```tsx
import { PostSkeleton } from '@/components/ui/skeleton';

<PostSkeleton />
```

#### `ListingSkeleton`
Marketplace/classified listing card with image, title, description, and metadata.
```tsx
import { ListingSkeleton } from '@/components/ui/skeleton';

<ListingSkeleton />
```

#### `EventSkeleton`
Event card with date/time, title, location, attendees, and action button.
```tsx
import { EventSkeleton } from '@/components/ui/skeleton';

<EventSkeleton />
```

#### `BusinessSkeleton`
Business profile card with cover image, avatar, description, rating, and action button.
```tsx
import { BusinessSkeleton } from '@/components/ui/skeleton';

<BusinessSkeleton />
```

#### `UserProfileSkeleton`
User profile card with avatar, name, handle, bio, stats, and follow button.
```tsx
import { UserProfileSkeleton } from '@/components/ui/skeleton';

<UserProfileSkeleton />
```

### Collection Skeletons

#### `FeedSkeleton`
Multiple post skeletons for feed/timeline loading (displays 3 skeletons).
```tsx
import { FeedSkeleton } from '@/components/ui/skeleton';

<FeedSkeleton />
```

#### `GridSkeleton`
Grid layout for multiple items (marketplace, events, etc.).
```tsx
import { GridSkeleton } from '@/components/ui/skeleton';

<GridSkeleton count={6} /> {/* Default is 6 */}
```

#### `ListSkeleton`
Simple list items with avatar, content, and action.
```tsx
import { ListSkeleton } from '@/components/ui/skeleton';

<ListSkeleton count={5} /> {/* Default is 5 */}
```

### Section Skeletons

#### `ChatMessageSkeleton`
Single chat message loading state.
```tsx
import { ChatMessageSkeleton } from '@/components/ui/skeleton';

<ChatMessageSkeleton />
```

#### `CommentSkeleton`
Comment in a comment section.
```tsx
import { CommentSkeleton } from '@/components/ui/skeleton';

<CommentSkeleton />
```

#### `HeaderSkeleton`
Page header or section title with description.
```tsx
import { HeaderSkeleton } from '@/components/ui/skeleton';

<HeaderSkeleton />
```

## Usage in Loading States

### Page Loading (loading.tsx)
```tsx
import { FeedSkeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <FeedSkeleton />
      </div>
    </div>
  );
}
```

### Conditional Loading in Components
```tsx
'use client';

import { useState, useEffect } from 'react';
import { PostCard } from '@/components/feed/post-card';
import { FeedSkeleton } from '@/components/ui/skeleton';

export function Feed() {
  const [posts, setPosts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch posts
    fetchPosts().then(data => {
      setPosts(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <FeedSkeleton />;
  }

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <PostCard key={post.id} {...post} />
      ))}
    </div>
  );
}
```

### Suspense Boundary (if using React.lazy or dynamic imports)
```tsx
import { Suspense } from 'react';
import { PostSkeleton } from '@/components/ui/skeleton';

const PostComponent = dynamic(() => import('@/components/feed/post-card'));

export function PostWithSuspense() {
  return (
    <Suspense fallback={<PostSkeleton />}>
      <PostComponent />
    </Suspense>
  );
}
```

## CSS Animations

The shimmer animation is defined in `/src/app/globals.css`:

```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

## Customization

### Custom Skeleton
For custom layouts, combine base `Skeleton` components:

```tsx
import { Skeleton } from '@/components/ui/skeleton';

export function CustomSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <Skeleton className="w-40 h-4" />
      </div>
      <Skeleton className="w-full h-32" />
    </div>
  );
}
```

### Adjusting Animation Speed
Edit the `shimmer` animation duration in `globals.css` (currently 1.5s):

```css
.skeleton {
  animation: shimmer 1.2s infinite; /* Faster */
  animation: shimmer 2s infinite;   /* Slower */
}
```

## Best Practices

1. **Match Content Structure**: Skeleton should closely match the actual component layout
2. **Use Consistent Spacing**: Use same padding/gap classes as actual components
3. **Responsive Design**: Make skeletons responsive like actual content
4. **Duration**: Default 1.5s animation is fast enough to feel smooth
5. **Avoid Text**: Never add text content to skeletons (only visual placeholders)
6. **Accessibility**: Skeletons don't need special a11y handling as they're temporary states

## Performance Notes

- Skeleton components are lightweight (just divs with CSS animations)
- No JavaScript processing required
- CSS animations are GPU-accelerated for smooth performance
- Multiple skeletons can be rendered simultaneously without performance issues

## Current Implementation

The `/src/app/(main)/loading.tsx` file now uses `FeedSkeleton` instead of a simple spinner, providing a much better user experience during initial page load.
