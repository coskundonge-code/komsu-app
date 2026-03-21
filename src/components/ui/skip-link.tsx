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
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[200] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
    >
      Ana içeriğe geç
    </a>
  );
}
