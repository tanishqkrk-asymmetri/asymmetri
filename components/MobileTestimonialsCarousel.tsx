"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

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
        delay: 4200,
        stopOnInteraction: false,
        stopOnMouseEnter: false,
        stopOnFocusIn: false,
      }),
    ],
    [],
  );

  return (
    <Carousel
      className={className}
      opts={{
        loop: true,
        align: "center",
        slidesToScroll: 1,
      }}
      plugins={plugins}
    >
      <CarouselContent className="-ml-3 py-1">
        {items.map((x) => (
          <CarouselItem
            key={x.company}
            className="basis-[min(88vw,calc(100vw-3rem))] pl-3 sm:basis-[min(88vw,340px)]"
          >
            <div className="flex h-full flex-col rounded-xl border border-white/15 bg-white/[0.04] px-4 py-5">
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
