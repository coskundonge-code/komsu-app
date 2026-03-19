"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

const ImageCarousel = React.forwardRef<HTMLDivElement, ImageCarouselProps>(
  (
    { images, autoPlay = true, interval = 5000, className },
    ref
  ) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isHovered, setIsHovered] = React.useState(false);
    const [touchStart, setTouchStart] = React.useState(0);
    const [touchEnd, setTouchEnd] = React.useState(0);
    const autoPlayTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    const goToSlide = React.useCallback((index: number) => {
      setCurrentIndex(Math.max(0, Math.min(index, images.length - 1)));
    }, [images.length]);

    const goToPrevious = React.useCallback(() => {
      setCurrentIndex((prev) =>
        prev === 0 ? images.length - 1 : prev - 1
      );
    }, [images.length]);

    const goToNext = React.useCallback(() => {
      setCurrentIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, [images.length]);

    // Handle touch swipe on mobile
    const handleTouchStart = (e: React.TouchEvent) => {
      setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
      setTouchEnd(e.changedTouches[0].clientX);
      handleSwipe();
    };

    const handleSwipe = () => {
      if (!touchStart || !touchEnd) return;

      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > 50;
      const isRightSwipe = distance < -50;

      if (isLeftSwipe) {
        goToNext();
      } else if (isRightSwipe) {
        goToPrevious();
      }

      setTouchStart(0);
      setTouchEnd(0);
    };

    // Auto-play functionality
    React.useEffect(() => {
      if (!autoPlay || isHovered || images.length <= 1) return;

      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }

      autoPlayTimeoutRef.current = setTimeout(() => {
        goToNext();
      }, interval);

      return () => {
        if (autoPlayTimeoutRef.current) {
          clearTimeout(autoPlayTimeoutRef.current);
        }
      };
    }, [currentIndex, autoPlay, isHovered, interval, images.length, goToNext]);

    if (!images || images.length === 0) {
      return (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
          <p className="text-gray-500">No images available</p>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full overflow-hidden bg-gray-900 rounded-lg group",
          className
        )}
        style={{ aspectRatio: "16 / 9" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Image Container */}
        <div className="relative w-full h-full">
          {images.map((image, index) => (
            <div
              key={index}
              className={cn(
                "absolute inset-0 transition-opacity duration-500 ease-in-out",
                currentIndex === index ? "opacity-100" : "opacity-0"
              )}
            >
              <Image
                src={image}
                alt={`Slide ${index + 1}`}
                fill
                className="object-cover"
                unoptimized
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {/* Previous Button (Desktop only) */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 z-10",
                "bg-black/50 hover:bg-black/75 text-white p-2 rounded-full",
                "transition-all duration-200",
                "hidden group-hover:flex items-center justify-center",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00833e]"
              )}
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button (Desktop only) */}
            <button
              onClick={goToNext}
              className={cn(
                "absolute right-4 top-1/2 -translate-y-1/2 z-10",
                "bg-black/50 hover:bg-black/75 text-white p-2 rounded-full",
                "transition-all duration-200",
                "hidden group-hover:flex items-center justify-center",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00833e]"
              )}
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Dot Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  currentIndex === index
                    ? "w-8 bg-primary"
                    : "w-2 bg-[#e0e0e0] hover:bg-gray-400"
                )}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={currentIndex === index}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

ImageCarousel.displayName = "ImageCarousel";

export { ImageCarousel };
