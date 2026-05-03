"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export type MobileTestimonialSlide = {
  company: string;
  testimonial: string;
  image: string;
};

export function MobileTestimonialsCarousel({
  items,
  className,
}: {
  items: MobileTestimonialSlide[];
  className?: string;
}) {
  const plugins = React.useMemo(
    () => [
      Autoplay({
        delay: 2200,
        /** Must be true: with false, timer keeps firing during touch and fights Embla (snaps / hidden slides). */
        stopOnInteraction: true,
        stopOnMouseEnter: false,
        stopOnFocusIn: false,
      }),
    ],
    [],
  );

  return (
    <Carousel
      className={cn("w-full touch-pan-x touch-manipulation", className)}
      opts={{
        loop: true,
        align: "center",
        slidesToScroll: 1,
        duration: 18,
      }}
      plugins={plugins}
    >
      <CarouselContent className="touch-pan-x py-1">
        {items.map((x) => (
          <CarouselItem key={x.company}>
            <div className="relative flex max-h-[min(40dvh,280px)] touch-pan-y flex-col overflow-y-auto overscroll-y-contain rounded-xl border border-white/15 bg-white/[0.04] px-4 py-5">
              <div className="flex items-start gap-3">
                <img
                  src={x.image}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded-full object-cover ring-1 ring-white/20"
                />
                <p className="font-chakra-petch text-xs font-semibold text-asymmetri-red">
                  {x.company}
                </p>
              </div>
              <p className="mt-4 text-left text-[13px] leading-relaxed text-white/95">
                {x.testimonial}
              </p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
