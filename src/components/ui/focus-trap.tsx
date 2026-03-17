'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface FocusTrapProps {
  children: ReactNode;
  active?: boolean;
  onEscapeKey?: () => void;
  className?: string;
}

/**
 * FocusTrap Component
 *
 * Traps keyboard focus within a container, preventing users from tabbing outside.
 * Useful for modals and dialogs.
 *
 * Features:
 * - Cycles focus through focusable elements
 * - Returns focus to trigger element on close
 * - Optional escape key handler
 *
 * @component
 * @example
 * <FocusTrap active={isOpen} onEscapeKey={() => setIsOpen(false)}>
 *   <Dialog>...</Dialog>
 * </FocusTrap>
 */
export function FocusTrap({
  children,
  active = true,
  onEscapeKey,
  className = '',
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    // Store the element that had focus before the trap was activated
    previousActiveElement.current = document.activeElement as HTMLElement;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle Escape key
      if (event.key === 'Escape') {
        event.preventDefault();
        onEscapeKey?.();
        return;
      }

      // Handle Tab key for focus cycling
      if (event.key !== 'Tab') return;

      if (!containerRef.current) return;

      // Get all focusable elements
      const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement as HTMLElement;

      // Shift + Tab on first element - focus last element
      if (event.shiftKey) {
        if (activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab on last element - focus first element
        if (activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Focus the first focusable element
    const focusableElements = containerRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements && focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      // Restore focus to the trigger element
      if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
        previousActiveElement.current.focus();
      }
    };
  }, [active, onEscapeKey]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
