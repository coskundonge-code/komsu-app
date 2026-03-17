"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
  className?: string;
}

const PullToRefresh = React.forwardRef<HTMLDivElement, PullToRefreshProps>(
  (
    { onRefresh, children, threshold = 80, className },
    ref
  ) => {
    const [pullDistance, setPullDistance] = React.useState(0);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [isMobile, setIsMobile] = React.useState(false);
    const touchStartYRef = React.useRef(0);
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    // Check if device is mobile/touch
    React.useEffect(() => {
      setIsMobile(() => {
        return (
          typeof window !== "undefined" &&
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          )
        );
      });
    }, []);

    const handleTouchStart = (e: React.TouchEvent) => {
      const scrollContainer = scrollContainerRef.current;
      // Only allow pull-to-refresh if we're at the top of the scroll container
      if (scrollContainer && scrollContainer.scrollTop === 0) {
        touchStartYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      if (!isMobile || isRefreshing) return;

      const scrollContainer = scrollContainerRef.current;

      // Only track pull distance if at top of container
      if (scrollContainer && scrollContainer.scrollTop === 0) {
        const touchCurrentY = e.touches[0].clientY;
        const distance = Math.max(0, touchCurrentY - touchStartYRef.current);

        // Only update pull distance if we're actually pulling down
        if (distance > 0) {
          setPullDistance(distance);

          // Prevent default scroll to allow custom pull behavior
          if (distance > 10) {
            e.preventDefault();
          }
        }
      }
    };

    const handleTouchEnd = async () => {
      if (!isMobile) return;

      if (pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true);

        try {
          await onRefresh();
        } catch (error) {
          console.error("Error during refresh:", error);
        } finally {
          setIsRefreshing(false);
        }
      }

      // Spring animation back to original position
      setPullDistance(0);
    };

    React.useEffect(() => {
      const scrollContainer = scrollContainerRef.current;
      if (!scrollContainer || !isMobile) return;

      scrollContainer.addEventListener("touchstart", handleTouchStart as any);
      scrollContainer.addEventListener("touchmove", handleTouchMove as any, {
        passive: false,
      });
      scrollContainer.addEventListener("touchend", handleTouchEnd as any);

      return () => {
        scrollContainer.removeEventListener("touchstart", handleTouchStart as any);
        scrollContainer.removeEventListener("touchmove", handleTouchMove as any);
        scrollContainer.removeEventListener("touchend", handleTouchEnd as any);
      };
    }, [isMobile, isRefreshing, pullDistance, threshold]);

    return (
      <div
        ref={scrollContainerRef}
        className={cn(
          "w-full h-full overflow-y-auto overflow-x-hidden",
          "overscroll-behavior-contain",
          className
        )}
      >
        {/* Pull-to-Refresh Indicator */}
        {isMobile && (
          <div
            className={cn(
              "relative h-0 overflow-visible transition-all duration-300 ease-out",
              pullDistance > 0 && "mb-4"
            )}
            style={{
              transform: `translateY(${Math.min(pullDistance, threshold)}px)`,
            }}
          >
            <div className="absolute -top-[60px] left-1/2 -translate-x-1/2 flex flex-col items-center">
              {/* Spinner */}
              <div
                className={cn(
                  "relative w-8 h-8 flex items-center justify-center transition-all duration-300",
                  isRefreshing && "animate-spin"
                )}
                style={{
                  opacity: Math.min(1, pullDistance / threshold),
                  transform: isRefreshing
                    ? "rotate(360deg)"
                    : `rotate(${(pullDistance / threshold) * 180}deg)`,
                }}
              >
                {/* Circular spinner */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-full border-2",
                    isRefreshing
                      ? "border-[#a7dbb8] border-t-[#00833e] animate-spin"
                      : "border-[#00833e]"
                  )}
                  style={{
                    borderTopColor: isRefreshing ? "#00833e" : "transparent",
                  }}
                />
              </div>

              {/* Pull Text */}
              {!isRefreshing && pullDistance < threshold && (
                <p className="mt-2 text-sm text-gray-500 text-center">
                  Pull to refresh
                </p>
              )}

              {/* Release Text */}
              {!isRefreshing && pullDistance >= threshold && (
                <p className="mt-2 text-sm font-medium text-[#00833e] text-center">
                  Release to refresh
                </p>
              )}

              {/* Refreshing Text */}
              {isRefreshing && (
                <p className="mt-2 text-sm font-medium text-[#00833e] text-center">
                  Refreshing...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div ref={ref} className="w-full">
          {children}
        </div>
      </div>
    );
  }
);

PullToRefresh.displayName = "PullToRefresh";

export { PullToRefresh };
