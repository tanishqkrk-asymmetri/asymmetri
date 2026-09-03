"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import Link from "next/link";
import {
  toProjectSlug,
  type CaseStudyListing,
} from "@/lib/case-studies";

export type CaseStudy = CaseStudyListing;
export { toProjectSlug };

export type HoverPoint = { x: number; y: number };

const GAP = 50;
const STEP_VH = 250;

function CaseStudyCard({
  item,
  index,
  itemStep,
  itemWidth,
  x,
  viewportWidth,
  isActive,
  onImageHoverChange,
  onImageMouseMove,
}: {
  item: CaseStudy;
  index: number;
  itemStep: number;
  itemWidth: number;
  x: MotionValue<number>;
  viewportWidth: number;
  isActive: boolean;
  onImageHoverChange: (hovered: boolean, point?: HoverPoint) => void;
  onImageMouseMove: (point: HoverPoint) => void;
}) {
  const scale = useTransform(x, (offset) => {
    const center = viewportWidth / 2;
    const cardCenter = index * itemStep + itemWidth / 2 + offset;
    const dist = Math.abs(cardCenter - center);
    const norm = Math.min(dist / (itemStep * 0.75), 1);
    return 1.2 - norm * 0.5;
  });

  const opacity = useTransform(x, (offset) => {
    const center = viewportWidth / 2;
    const cardCenter = index * itemStep + itemWidth / 2 + offset;
    const dist = Math.abs(cardCenter - center);
    const norm = Math.min(dist / (itemStep * 1.35), 1);
    return 1 - norm * 0.5;
  });

  const zIndex = useTransform(x, (offset) => {
    const center = viewportWidth / 2;
    const cardCenter = index * itemStep + itemWidth / 2 + offset;
    const dist = Math.abs(cardCenter - center);
    return Math.round(40 - dist / 8);
  });

  const nameOpacity = useTransform(x, (offset) => {
    const center = viewportWidth / 2;
    const cardCenter = index * itemStep + itemWidth / 2 + offset;
    const dist = Math.abs(cardCenter - center);
    if (dist > itemStep * 0.38) return 0;
    return 1 - dist / (itemStep * 0.38);
  });

  const pointerInside = useRef(false);
  const lastPoint = useRef<HoverPoint>({ x: 0, y: 0 });
  const onHoverRef = useRef(onImageHoverChange);
  onHoverRef.current = onImageHoverChange;

  useEffect(() => {
    if (isActive && pointerInside.current) {
      onHoverRef.current(true, lastPoint.current);
    } else if (!isActive) {
      onHoverRef.current(false);
    }
  }, [isActive]);

  const image = (
    <img
      src={item.img}
      alt={item.name}
      className={`h-full w-full object-cover aspect-square duration-300 ${
        isActive ? "hover:brightness-50" : ""
      }`}
    />
  );

  return (
    <motion.div
      style={{ scale, zIndex }}
      className="pointer-events-auto flex shrink-0 origin-center flex-col items-center will-change-transform"
    >
      <div
        className={`relative block aspect-square overflow-hidden bg-white/5 ${
          isActive ? "cursor-none" : ""
        }`}
        style={{ width: itemWidth }}
        onMouseEnter={(e) => {
          const point = { x: e.clientX, y: e.clientY };
          pointerInside.current = true;
          lastPoint.current = point;
          if (isActive) onImageHoverChange(true, point);
        }}
        onMouseLeave={() => {
          pointerInside.current = false;
          onImageHoverChange(false);
        }}
        onMouseMove={(e) => {
          const point = { x: e.clientX, y: e.clientY };
          lastPoint.current = point;
          if (isActive) onImageMouseMove(point);
        }}
      >
        {isActive ? (
          <Link
            href={`/case-studies/${toProjectSlug(item.name)}`}
            aria-label={`Open ${item.name} case study`}
            className="sound block h-full w-full"
          >
            {image}
          </Link>
        ) : (
          image
        )}
      </div>
    </motion.div>
  );
}

type CaseStudiesCarouselProps = {
  items: CaseStudy[];
  currentProjectName: string;
  onCurrentProjectChange: (project: CaseStudy) => void;
  onImageHoverChange: (hovered: boolean, point?: HoverPoint) => void;
  onImageMouseMove: (point: HoverPoint) => void;
};

export function CaseStudiesCarousel({
  items,
  currentProjectName,
  onCurrentProjectChange,
  onImageHoverChange,
  onImageMouseMove,
}: CaseStudiesCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const lastProgressRef = useRef(0);
  const [viewportWidth, setViewportWidth] = useState(1200);
  const [itemWidth, setItemWidth] = useState(384);

  const count = items.length;
  const itemStep = itemWidth + GAP;
  const cycleVh = count * STEP_VH;

  const extendedItems = useMemo(() => [...items], [items]);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setViewportWidth(w);
      setItemWidth(w < 768 ? 280 : w < 1280 ? 340 : 384);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const startX = viewportWidth / 2 - itemWidth / 2;

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [startX, startX - count * itemStep],
  );

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const activeIndex =
      ((Math.round(progress * count) % count) + count) % count;
    onCurrentProjectChange(items[activeIndex]);

    const last = lastProgressRef.current;
    if (progress >= 0.998 && last < 0.998) {
      window.scrollTo(0, 0);
    } else if (progress <= 0.002 && last > 0.002 && last - progress > 0.01) {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, maxScroll);
    }
    lastProgressRef.current = progress;
  });

  if (count === 0) return null;

  return (
    <div
      ref={trackRef}
      style={{ height: `${cycleVh}vh` }}
      className="relative w-full"
    >
      <div className="pointer-events-none sticky top-0 flex h-screen w-full items-center overflow-hidden">
        <motion.div style={{ x, gap: GAP }} className="flex items-end ">
          {extendedItems.map((item, index) => (
            <CaseStudyCard
              key={`${item.name}-${index}`}
              item={item}
              index={index}
              itemStep={itemStep}
              itemWidth={itemWidth}
              x={x}
              viewportWidth={viewportWidth}
              isActive={item.name === currentProjectName}
              onImageHoverChange={onImageHoverChange}
              onImageMouseMove={onImageMouseMove}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
