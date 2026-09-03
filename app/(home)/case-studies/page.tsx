"use client";

import {
  CaseStudiesCarousel,
  toProjectSlug,
  type CaseStudy,
} from "@/components/CaseStudiesCarousel";
import { Navbar } from "@/components/shared/navbar";
import usePauseScroll from "@/hooks/usePauseScroll";
import { caseStudyListings } from "@/lib/case-studies";
import { ArrowUpRight, GalleryHorizontal, LayoutGrid } from "lucide-react";
import {
  useScroll,
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "motion/react";
import playSoundOnHover from "@/lib/sound";
import Link from "next/link";
import { useRef, useState } from "react";

function CaseStudiesGallery({ items }: { items: CaseStudy[] }) {
  return (
    <div className="relative z-10 min-h-screen px-6 pt-24 pb-28 md:px-10 lg:px-16">
      <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.45,
              delay: i * 0.05,
              ease: [0.2, 0.8, 0.2, 1],
            }}
          >
            <Link
              href={`/case-studies/${toProjectSlug(item.name)}`}
              className="sound group block"
            >
              <div className="aspect-square overflow-hidden bg-white/5">
                <img
                  src={item.img}
                  alt={item.name}
                  className="h-full w-full object-cover duration-500 group-hover:scale-[1.03] group-hover:brightness-75"
                />
              </div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-chakra-petch text-lg font-semibold tracking-wide">
                    {item.name}
                  </h2>
                  <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.22em] text-asymmetri-red">
                    {item.category}
                  </p>
                </div>
                <span className="font-chakra-petch text-[13px] tracking-[0.28em] text-white/35">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function CaseStudies() {
  usePauseScroll();

  const pageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: pageScroll } = useScroll({
    target: pageRef,
  });

  const case_studies_data: CaseStudy[] = caseStudyListings;

  const [galleryView, setGalleryView] = useState(false);
  const [current_project, setCurrentProject] = useState(case_studies_data[0]);
  const currentIndex = case_studies_data.findIndex(
    (item) => item.name === current_project.name,
  );
  const [imageHovered, setImageHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorX = useSpring(mouseX, { stiffness: 450, damping: 38, mass: 0.4 });
  const cursorY = useSpring(mouseY, { stiffness: 450, damping: 38, mass: 0.4 });

  const toggleGalleryView = () => {
    setImageHovered(false);
    window.scrollTo(0, 0);
    setGalleryView((open) => !open);
  };

  return (
    <div ref={pageRef} className="bg-black text-white">
      <Navbar pageScroll={pageScroll} />
      <AnimatePresence mode="wait">
        {galleryView ? (
          <motion.div
            key="gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <CaseStudiesGallery items={case_studies_data} />
          </motion.div>
        ) : (
          <motion.div
            key="carousel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <AnimatePresence>
              {case_studies_data.map((x) => {
                if (x.name === current_project.name)
                  return (
                    <motion.img
                      key={x.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      src={x.img}
                      alt=""
                      className="fixed inset-0 z-9999999 h-screen w-screen object-cover blur-sm scale-110 brightness-25 object-top"
                    />
                  );
              })}
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.div
                key={current_project.name}
                initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(8px)" }}
                transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                className="pointer-events-none fixed bottom-10 left-1/2 z-999999999999 w-full max-w-lg -translate-x-1/2 px-6 font-chakra-petch text-white md:bottom-14"
              >
                <div className="flex flex-col items-center gap-1 text-center">
                  <h2 className="text-2xl font-semibold tracking-wide md:text-3xl">
                    {current_project.name}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] tracking-[0.28em] text-white/35">
                      {String(currentIndex + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[13px] font-semibold uppercase tracking-[0.22em] text-asymmetri-red">
                      {current_project.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="relative z-99999999999">
              <CaseStudiesCarousel
                items={case_studies_data}
                currentProjectName={current_project.name}
                onCurrentProjectChange={setCurrentProject}
                onImageHoverChange={(hovered, point) => {
                  setImageHovered(hovered);
                  if (!point) return;
                  if (hovered) {
                    mouseX.jump(point.x);
                    mouseY.jump(point.y);
                    // playSoundOnHover();
                  }
                }}
                onImageMouseMove={(point) => {
                  mouseX.set(point.x);
                  mouseY.set(point.y);
                }}
              />
            </div>
            <motion.div
              aria-hidden
              initial={{
                opacity: 0,
                scale: 0.55,
                //  filter: "blur(8px)"
              }}
              className="pointer-events-none fixed top-0 left-0 z-999999999999 -mt-10 -ml-10 flex h-20 w-20 items-center justify-center rounded-full  bg-white text-black"
              style={{ left: cursorX, top: cursorY }}
              animate={{
                opacity: imageHovered ? 1 : 0,
                scale: imageHovered ? 1 : 0.2,
                // filter: imageHovered ? "blur(0px)" : "blur(8px)",
              }}
              transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <ArrowUpRight size={40} strokeWidth={0.85} />
            </motion.div>
            <motion.div
              aria-hidden
              // initial={{ opacity: 0 }}
              // animate={{ opacity: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.9,
                ease: [0.2, 0.8, 0.2, 1],
              }}
              className="pointer-events-none fixed right-6 bottom-6 z-999999999999 flex flex-col items-center gap-2"
            >
              <div className="relative h-9 w-[17px] rounded-full border border-white/30">
                <motion.span
                  className="absolute top-[5px] left-1/2 h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-white/70"
                  animate={{ y: [0, 12, 0], opacity: [0.85, 0.2, 0.85] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: [0.45, 0, 0.55, 1],
                  }}
                />
              </div>
              <span className="font-chakra-petch text-[10px] uppercase tracking-[0.28em] text-white/40">
                Scroll
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={toggleGalleryView}
        aria-pressed={galleryView}
        aria-label={
          galleryView ? "Switch to scroll view" : "Switch to gallery view"
        }
        className="fixed bottom-6 left-6 z-999999999999 flex items-center gap-2 border border-white/25 bg-white/10 px-3.5 py-2 font-chakra-petch text-[11px] uppercase tracking-[0.22em] text-white/80 backdrop-blur-sm transition-colors hover:border-white/70 hover:bg-white hover:text-black"
      >
        {galleryView ? (
          <GalleryHorizontal size={14} strokeWidth={1.5} />
        ) : (
          <LayoutGrid size={14} strokeWidth={1.5} />
        )}
        {galleryView ? "Scroll" : "Gallery"}
      </button>
    </div>
  );
}

export type { CaseStudy };
