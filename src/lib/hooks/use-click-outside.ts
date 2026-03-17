import { useEffect, RefObject } from 'react';

/**
 * useClickOutside Hook
 *
 * Detects clicks outside a referenced element and triggers a callback.
 * Useful for closing dropdowns, modals, and popovers.
 *
 * Features:
 * - Supports single ref or array of refs
 * - Configurable mouse and touch events
 * - Handles escape key optionally
 * - Automatically cleans up event listeners
 *
 * @param refs - Single ref or array of refs to track
 * @param callback - Function to call when click occurs outside
 * @param options - Configuration options
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * useClickOutside(ref, () => setOpen(false));
 *
 * return <div ref={ref}>Content</div>;
 */
interface UseClickOutsideOptions {
  /** Listen to mouse down events (default: true) */
  listenMouseDown?: boolean;
  /** Listen to touch start events (default: true) */
  listenTouchStart?: boolean;
  /** Close on escape key (default: false) */
  onEscape?: boolean;
  /** Event phase - 'capture' or 'bubble' (default: 'bubble') */
  eventPhase?: 'capture' | 'bubble';
}

export function useClickOutside(
  refs: RefObject<HTMLElement> | RefObject<HTMLElement>[],
  callback: () => void,
  options: UseClickOutsideOptions = {}
): void {
  const {
    listenMouseDown = true,
    listenTouchStart = true,
    onEscape = false,
    eventPhase = 'bubble',
  } = options;

  useEffect(() => {
    // Normalize refs to array
    const refArray = Array.isArray(refs) ? refs : [refs];

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      // Check if any of the refs contain the click target
      const isClickInside = refArray.some((ref) => {
        if (!ref.current) return false;
        return ref.current.contains(event.target as Node);
      });

      if (!isClickInside) {
        callback();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        callback();
      }
    };

    const useCapture = eventPhase === 'capture';

    // Add event listeners
    if (listenMouseDown) {
      document.addEventListener('mousedown', handleClickOutside, useCapture);
    }

    if (listenTouchStart) {
      document.addEventListener('touchstart', handleClickOutside, useCapture);
    }

    if (onEscape) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    // Cleanup
    return () => {
      if (listenMouseDown) {
        document.removeEventListener('mousedown', handleClickOutside, useCapture);
      }

      if (listenTouchStart) {
        document.removeEventListener('touchstart', handleClickOutside, useCapture);
      }

      if (onEscape) {
        document.removeEventListener('keydown', handleEscapeKey);
      }
    };
  }, [refs, callback, listenMouseDown, listenTouchStart, onEscape, eventPhase]);
}
