"use client";

import * as React from "react";
import { motion, PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CarouselProps {
  children: React.ReactNode;
  autoPlay?: boolean;
  interval?: number;
  loop?: boolean;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
  slideClassName?: string;
  onSlideChange?: (index: number) => void;
  ariaLabel?: string;
}

export function Carousel({
  children,
  autoPlay = false,
  interval = 5000,
  loop = true,
  showDots = true,
  showArrows = true,
  className,
  slideClassName,
  onSlideChange,
  ariaLabel = "Featured carousel",
}: CarouselProps) {
  const slides = React.Children.toArray(children);
  const totalSlides = slides.length;

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const canPrev = loop || currentIndex > 0;
  const canNext = loop || currentIndex < totalSlides - 1;

  const goToSlide = React.useCallback(
    (index: number) => {
      let nextIndex = index;
      if (nextIndex < 0) {
        nextIndex = loop ? totalSlides - 1 : 0;
      } else if (nextIndex >= totalSlides) {
        nextIndex = loop ? 0 : totalSlides - 1;
      }
      setCurrentIndex(nextIndex);
      onSlideChange?.(nextIndex);
    },
    [loop, totalSlides, onSlideChange]
  );

  const prevSlide = React.useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  const nextSlide = React.useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  // Auto-play timer
  React.useEffect(() => {
    if (!autoPlay || isPaused || totalSlides <= 1) return;

    const timer = setInterval(() => {
      nextSlide();
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, isPaused, totalSlides, interval, nextSlide]);

  // Handle keyboard arrow keys when container is focused
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevSlide();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nextSlide();
    }
  };

  // Drag / swipe handling via Framer Motion
  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const swipeThreshold = 40;
    const swipeVelocity = 500;

    if (info.offset.x > swipeThreshold || info.velocity.x > swipeVelocity) {
      if (canPrev) prevSlide();
    } else if (
      info.offset.x < -swipeThreshold ||
      info.velocity.x < -swipeVelocity
    ) {
      if (canNext) nextSlide();
    }
  };

  if (totalSlides === 0) return null;

  return (
    <div
      ref={containerRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className={cn(
        "relative w-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-golden rounded-[16px]",
        className
      )}
    >
      {/* Slides Container */}
      <div className="overflow-hidden">
        <motion.div
          className="flex touch-pan-y"
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${totalSlides}`}
              aria-hidden={currentIndex !== index}
              className={cn("w-full flex-shrink-0 select-none", slideClassName)}
            >
              {slide}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Prev / Next Arrows (hidden on mobile, visible on md+) */}
      {showArrows && totalSlides > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            disabled={!canPrev}
            aria-label="Previous slide"
            className={cn(
              "hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-10",
              "h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full",
              "bg-warm-white/90 text-espresso shadow-card hover:bg-warm-white hover:text-golden hover:scale-105 active:scale-95",
              "backdrop-blur-xs transition-all duration-200 border border-espresso/10",
              "disabled:opacity-30 disabled:pointer-events-none"
            )}
          >
            <ChevronLeft className="h-6 w-6" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            disabled={!canNext}
            aria-label="Next slide"
            className={cn(
              "hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-10",
              "h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full",
              "bg-warm-white/90 text-espresso shadow-card hover:bg-warm-white hover:text-golden hover:scale-105 active:scale-95",
              "backdrop-blur-xs transition-all duration-200 border border-espresso/10",
              "disabled:opacity-30 disabled:pointer-events-none"
            )}
          >
            <ChevronRight className="h-6 w-6" aria-hidden="true" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {showDots && totalSlides > 1 && (
        <div
          role="tablist"
          aria-label="Carousel slides"
          className="flex items-center justify-center gap-2 py-4"
        >
          {slides.map((_, index) => {
            const isActive = currentIndex === index;
            return (
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => goToSlide(index)}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-300 min-h-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden",
                  isActive
                    ? "w-8 bg-golden"
                    : "w-2.5 bg-espresso/20 hover:bg-espresso/40"
                )}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export type CarouselSlideProps = React.HTMLAttributes<HTMLDivElement>;

export const CarouselSlide = React.forwardRef<HTMLDivElement, CarouselSlideProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("w-full flex-shrink-0", className)}
      {...props}
    />
  )
);
CarouselSlide.displayName = "CarouselSlide";
