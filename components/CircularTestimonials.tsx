"use client";
import { useEffect, useState } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { cn } from "@/lib/utils";
import type { CircularTestimonial } from "@/lib/Testimonials";

export type { CircularTestimonial };

type CircularTestimonialsProps = {
  items: CircularTestimonial[];
  className?: string;
  pageScroll: MotionValue<number>;
  /** pageScroll range that drives a full carousel rotation. */
  scrollRange?: [number, number];
  /** Viewport heights reserved for the feedback scroll track. */
  stepVh?: number;
};

function Card({
  item,
  index,
  count,
  progress,
  radius,
  imageSize,
}: {
  item: CircularTestimonial;
  index: number;
  count: number;
  progress: MotionValue<number>;
  radius: number;
  imageSize: number;
}) {
  const step = 1 / Math.max(count - 1, 1);
  const baseAngle = (index / count) * Math.PI * 2;

  const x = useTransform(progress, (p) => {
    const rotation = p * (count - 1) * ((Math.PI * 2) / count);
    const angle = baseAngle - rotation;
    return Math.sin(angle) * radius;
  });

  const y = useTransform(progress, (p) => {
    const rotation = p * (count - 1) * ((Math.PI * 2) / count);
    const angle = baseAngle - rotation;
    // Top of circle is active; sides drop lower (∩ arc).
    return -Math.cos(angle) * radius + radius * 0.55;
  });

  const scale = useTransform(progress, (p) => {
    const rotation = p * (count - 1) * ((Math.PI * 2) / count);
    const angle = baseAngle - rotation;
    const wrapped = Math.atan2(Math.sin(angle), Math.cos(angle));
    const dist = Math.abs(wrapped) / Math.PI;
    // Keep scale falloff tight so only the near arc reads large.
    return 1.12 - Math.min(dist, 0.4) * 1.35;
  });

  const opacity = useTransform(progress, (p) => {
    const rotation = p * (count - 1) * ((Math.PI * 2) / count);
    const angle = baseAngle - rotation;
    const wrapped = Math.atan2(Math.sin(angle), Math.cos(angle));
    const dist = Math.abs(wrapped) / Math.PI;
    // ~±65° window → 3–4 cards with typical item counts.
    if (dist > 0.36) return 0;
    return 1 - dist / 0.36;
  });

  const zIndex = useTransform(progress, (p) => {
    const rotation = p * (count - 1) * ((Math.PI * 2) / count);
    const angle = baseAngle - rotation;
    const wrapped = Math.atan2(Math.sin(angle), Math.cos(angle));
    return Math.round(40 - Math.abs(wrapped) * 12);
  });

  const textOpacity = useTransform(progress, (p) => {
    const activeIndex = p / step;
    const dist = Math.abs(activeIndex - index);
    const nearest = Math.min(dist, count - dist);
    return nearest < 0.32 ? 1 - nearest / 0.32 : 0;
  });

  return (
    <motion.div
      style={{ x, y, scale, opacity, zIndex }}
      className="absolute top-1/2 left-1/2 will-change-transform"
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        <img
          src={item.image}
          alt=""
          style={{ width: imageSize, height: imageSize }}
          className="object-cover"
        />
        <motion.div
          style={{ opacity: textOpacity }}
          className="pointer-events-none absolute top-0 left-[calc(100%+1.25rem)] hidden w-[16rem] font-chakra-petch md:block"
        >
          <p className="text-[15px] leading-relaxed text-white">
            {item.testimonial}
          </p>
          <p className="mt-5 text-sm lowercase text-asymmetri-red">
            - {item.name}
          </p>
        </motion.div>
        <motion.div
          style={{ opacity: textOpacity }}
          className="pointer-events-none absolute top-[calc(100%+0.75rem)] left-1/2 w-[min(16rem,70vw)] -translate-x-1/2 text-center font-chakra-petch md:hidden"
        >
          <p className="text-[13px] leading-relaxed text-white">
            {item.testimonial}
          </p>
          <p className="mt-3 text-sm lowercase text-asymmetri-red">
            - {item.name}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function CircularTestimonials({
  items,
  className,
  pageScroll,
  scrollRange = [0.94, 1],
  stepVh = 50,
}: CircularTestimonialsProps) {
  const progress = useTransform(pageScroll, scrollRange, [0, 1], {
    clamp: true,
  });

  const [layout, setLayout] = useState({ radius: 560, imageSize: 260 });

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 768) {
        setLayout({ radius: Math.min(280, w * 0.72), imageSize: 160 });
      } else if (w < 1280) {
        setLayout({ radius: 440, imageSize: 210 });
      } else {
        setLayout({ radius: 560, imageSize: 260 });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const trackHeight = `calc(${Math.max(items.length, 2) * stepVh}vh)`;

  return (
    <div
      style={{ height: trackHeight }}
      className={cn("relative w-full", className)}
    >
      <div className="heroDark sticky top-0 flex h-screen w-full flex-col overflow-hidden bg-black">
        <div className="relative z-10 mx-auto max-w-xl px-6 pt-24 text-center font-chakra-petch text-3xl leading-tight text-white md:pt-32 md:text-5xl">
          Feedback from the folks who know us best.
        </div>

        <div className="relative z-10 mt-auto mb-[2vh] h-[min(68vh,620px)] w-full translate-y-1/2 md:mb-[4vh]">
          {items.map((item, index) => (
            <Card
              key={item.name + index}
              item={item}
              index={index}
              count={items.length}
              progress={progress}
              radius={layout.radius}
              imageSize={layout.imageSize}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
