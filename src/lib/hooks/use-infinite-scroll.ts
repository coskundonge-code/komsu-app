"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface UseInfiniteScrollOptions {
  threshold?: number;
  debounceMs?: number;
}

interface UseInfiniteScrollReturn {
  ref: React.RefObject<HTMLDivElement | null>;
  isLoading: boolean;
  hasMore: boolean;
  setHasMore: (hasMore: boolean) => void;
}

/**
 * Custom hook for infinite scroll functionality
 * Uses IntersectionObserver to detect when a sentinel element becomes visible
 * Calls the loadMore callback when the sentinel is in view (with debouncing)
 *
 * @param loadMore - Callback function to load more items
 * @param options - Optional configuration (threshold, debounceMs)
 * @returns Object containing ref (to attach to sentinel element), isLoading, hasMore, and setHasMore
 *
 * @example
 * const { ref, isLoading, hasMore } = useInfiniteScroll(
 *   async () => { ... load more items ... },
 *   { threshold: 0.1, debounceMs: 500 }
 * );
 *
 * return (
 *   <div>
 *     {items.map(item => <div key={item.id}>{item.name}</div>)}
 *     {hasMore && <div ref={ref}>{isLoading && <Spinner />}</div>}
 *   </div>
 * );
 */
export function useInfiniteScroll(
  loadMore: () => Promise<void>,
  options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn {
  const { threshold = 0.1, debounceMs = 300 } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Track whether we should load more to prevent multiple rapid calls
  const shouldLoadRef = useRef(true);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLoadMore = useCallback(async () => {
    if (!shouldLoadRef.current || isLoading || !hasMore) {
      return;
    }

    // Mark that we're loading to prevent multiple calls
    shouldLoadRef.current = false;
    setIsLoading(true);

    try {
      await loadMore();
    } catch (error) {
      console.error("Error in infinite scroll loadMore:", error);
    } finally {
      setIsLoading(false);

      // Schedule re-enabling after debounce period
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        shouldLoadRef.current = true;
      }, debounceMs);
    }
  }, [loadMore, isLoading, hasMore, debounceMs]);

  useEffect(() => {
    const sentinel = ref.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Check if the sentinel element is visible in the viewport
        const isVisible = entries.some((entry) => entry.isIntersecting);

        if (isVisible && hasMore && !isLoading && shouldLoadRef.current) {
          handleLoadMore();
        }
      },
      {
        threshold: threshold,
        rootMargin: "100px", // Start loading 100px before the element becomes visible
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.unobserve(sentinel);
      observer.disconnect();
    };
  }, [handleLoadMore, hasMore, isLoading]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    ref,
    isLoading,
    hasMore,
    setHasMore,
  };
}
