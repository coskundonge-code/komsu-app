import { useState, useEffect } from 'react';

/**
 * useMediaQuery Hook
 *
 * Detects screen size changes and returns a boolean indicating if the media query matches.
 * SSR-safe: returns false initially to prevent hydration mismatches.
 *
 * @param query - CSS media query string (e.g., "(min-width: 768px)")
 * @returns boolean indicating if the media query matches
 *
 * @example
 * const isMobile = useMediaQuery("(max-width: 640px)");
 * const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");
 * const isDesktop = useMediaQuery("(min-width: 1025px)");
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Create media query list
    const mediaQueryList = window.matchMedia(query);

    // Set initial value
    setMatches(mediaQueryList.matches);

    // Handle changes
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange);
    } else {
      // Legacy browsers
      mediaQueryList.addListener(handleChange);
    }

    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', handleChange);
      } else {
        mediaQueryList.removeListener(handleChange);
      }
    };
  }, [query]);

  // Return false during SSR to prevent hydration mismatches
  if (!mounted) {
    return false;
  }

  return matches;
}
