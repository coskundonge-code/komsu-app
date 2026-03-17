'use client';

/**
 * SkipLink Component
 *
 * Provides keyboard accessibility by allowing users to skip to main content.
 * Hidden by default but appears when focused via Tab key.
 *
 * @component
 * @example
 * <SkipLink />
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:font-semibold focus:rounded-b-md"
      aria-label="Ana içeriğe geç"
    >
      Ana içeriğe geç
    </a>
  );
}
