"use client";

import { Navbar } from "@/components/shared/navbar";
import usePauseScroll from "@/hooks/usePauseScroll";
import type { CaseStudyDetail, CaseStudySection } from "@/lib/case-studies";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import Link from "next/link";
import { useRef } from "react";

const SNAPPY = {
  stiffness: 260,
  damping: 22,
  mass: 0.38,
  restDelta: 0.001,
};

function useLocalProgress(
  pageScroll: MotionValue<number>,
  range: [number, number],
) {
  return useTransform(pageScroll, [range[0], range[1]], [0, 1]);
}

function useSnappyX(
  local: MotionValue<number>,
  from: number,
  rest = 0,
  to = -from,
) {
  const raw = useTransform(local, [0, 0.22, 0.78, 1], [from, rest, rest, to]);
  return useSpring(raw, SNAPPY);
}

function SnappyPanel({
  pageScroll,
  range,
  children,
}: {
  pageScroll: MotionValue<number>;
  range: [number, number];
  children: React.ReactNode;
}) {
  const local = useLocalProgress(pageScroll, range);
  const x = useSnappyX(local, 90);
  const rawScale = useTransform(local, [0, 0.22, 0.78, 1], [0.92, 1, 1, 0.92]);
  const scale = useSpring(rawScale, SNAPPY);

  return (
    <motion.div
      style={{ x, scale }}
      className="h-full w-full origin-center will-change-transform"
    >
      {children}
    </motion.div>
  );
}

function HeroSection({
  study,
  section,
  pageScroll,
}: {
  study: CaseStudyDetail;
  section: CaseStudySection;
  pageScroll: MotionValue<number>;
}) {
  const local = useLocalProgress(pageScroll, section.range);
  const textX = useSnappyX(local, 48);
  const visualX = useSnappyX(local, 72);

  return (
    <div className="relative flex h-full w-full">
      <div className="absolute inset-0 md:hidden">
        <img
          src={section.visual}
          alt=""
          className="h-full w-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-black/75" />
      </div>
      <motion.div
        style={{ x: textX }}
        className="relative z-10 flex w-full flex-col justify-center px-8 md:w-[42%] md:px-14 lg:px-20"
      >
        <h1 className="font-chakra-petch text-4xl font-semibold tracking-wide text-white uppercase sm:text-5xl lg:text-7xl">
          {section.title}
        </h1>
        <div className="mt-8 max-w-md space-y-5 font-chakra-petch text-sm leading-relaxed text-white/80 md:text-[15px]">
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </motion.div>
      <motion.div
        style={{ x: visualX }}
        className="relative hidden h-full w-[58%] overflow-hidden md:block"
      >
        <img
          src={section.visual}
          alt={study.name}
          className="h-full w-full object-cover object-[72%_center]"
        />
        <div className="absolute inset-y-0 left-0 w-28 bg-linear-to-r from-black to-transparent" />
      </motion.div>
    </div>
  );
}

function FeaturedSection({
  study,
  section,
}: {
  study: CaseStudyDetail;
  section: CaseStudySection;
  pageScroll: MotionValue<number>;
}) {
  return (
    <div className="relative h-full w-full">
      <img
        src={section.visual}
        alt={`${study.name} product`}
        className="h-full w-full object-cover object-center"
      />
    </div>
  );
}

function NarrativeSection({
  study,
  section,
  pageScroll,
}: {
  study: CaseStudyDetail;
  section: CaseStudySection;
  pageScroll: MotionValue<number>;
}) {
  const local = useLocalProgress(pageScroll, section.range);
  const textX = useSnappyX(local, 48);
  const visualX = useSnappyX(local, 72);

  return (
    <div className="relative flex h-full w-full items-center gap-8 px-8 md:px-14 lg:px-20">
      <motion.div style={{ x: textX }} className="w-full md:w-[38%]">
        <h2 className="font-chakra-petch max-w-lg text-3xl font-semibold leading-tight text-white md:text-4xl lg:text-5xl">
          {section.headline}
        </h2>
        <p className="mt-8 max-w-md font-chakra-petch text-sm leading-relaxed text-white/70 md:text-[15px]">
          {section.body}
        </p>
      </motion.div>
      <motion.div
        style={{ x: visualX }}
        className="relative hidden h-[78%] flex-1 overflow-hidden md:block"
      >
        <img
          src={section.visual}
          alt={`${study.name} visual language`}
          className="h-full w-full object-cover object-right"
        />
      </motion.div>
    </div>
  );
}

function ExperienceSection({
  study,
  section,
  pageScroll,
}: {
  study: CaseStudyDetail;
  section: CaseStudySection;
  pageScroll: MotionValue<number>;
}) {
  const local = useLocalProgress(pageScroll, section.range);
  const textX = useSnappyX(local, 48);
  const visualX = useSnappyX(local, 80);
  const kickerX = useSnappyX(local, 64);

  return (
    <div className="relative flex h-full w-full">
      <motion.div
        style={{ x: textX }}
        className="z-10 flex w-full flex-col justify-center px-8 md:w-[32%] md:px-14 lg:px-16"
      >
        <h2 className="font-chakra-petch max-w-sm text-xl font-semibold leading-snug tracking-wide text-white uppercase md:text-2xl lg:text-3xl">
          {section.headline}
        </h2>
        <p className="mt-6 max-w-sm font-chakra-petch text-sm leading-relaxed text-white/70">
          {section.body}
        </p>
      </motion.div>
      <motion.div
        style={{ x: visualX }}
        className="relative hidden h-full flex-1 overflow-hidden md:block"
      >
        <img
          src={section.visual}
          alt={`${study.name} experience`}
          className="h-full w-full object-cover object-[60%_center]"
        />
        <div className="absolute inset-y-0 left-0 w-24 bg-linear-to-r from-black to-transparent" />
      </motion.div>
      <motion.p
        style={{ x: kickerX, color: study.accent }}
        className="pointer-events-none absolute right-8 bottom-24 hidden max-w-sm text-right font-chakra-petch text-2xl font-semibold tracking-[0.18em] uppercase lg:block lg:text-3xl"
      >
        {section.kicker}
      </motion.p>
    </div>
  );
}

function ShowcaseSection({
  study,
  section,
}: {
  study: CaseStudyDetail;
  section: CaseStudySection;
  pageScroll: MotionValue<number>;
}) {
  return (
    <div className="relative h-full w-full">
      <img
        src={section.visual}
        alt={`${study.name} product screen`}
        className="h-full w-full object-cover object-center"
      />
    </div>
  );
}

function ClosingSection({
  study,
  section,
  pageScroll,
}: {
  study: CaseStudyDetail;
  section: CaseStudySection;
  pageScroll: MotionValue<number>;
}) {
  const local = useLocalProgress(pageScroll, section.range);
  const galleryX = useSnappyX(local, 64);
  const quoteX = useSnappyX(local, 40);

  return (
    <div className="flex h-full w-full flex-col px-6 pt-20 pb-10 md:px-12">
      <motion.div
        style={{ x: galleryX }}
        className="min-h-0 flex-1 overflow-hidden bg-white/5"
      >
        <img
          src={section.visual}
          alt={`${study.name} screens`}
          className="h-full w-full object-cover object-center"
        />
      </motion.div>
      <motion.blockquote
        style={{ x: quoteX }}
        className="mx-auto max-w-3xl py-10 text-center"
      >
        <p className="font-chakra-petch text-xl leading-snug text-white italic md:text-3xl">
          “{study.testimonial.quote}”
        </p>
        <footer className="mt-4 font-chakra-petch text-sm tracking-[0.18em] text-white/50 uppercase">
          {study.testimonial.author}
          <span className="text-white/30"> — {study.testimonial.role}</span>
        </footer>
      </motion.blockquote>
      <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-6">
        <Link
          href={`/case-studies/${study.prev.slug}`}
          className="sound group flex items-center gap-4"
        >
          <img
            src={study.prev.img}
            alt=""
            className="hidden h-16 w-24 object-cover sm:block"
          />
          <div>
            <p className="font-chakra-petch text-[11px] tracking-[0.22em] text-white/40 uppercase">
              Previous Case Study
            </p>
            <p className="font-chakra-petch text-lg text-white group-hover:text-white/70">
              {study.prev.name}
            </p>
          </div>
        </Link>
        <Link
          href={`/case-studies/${study.next.slug}`}
          className="sound group flex items-center justify-end gap-4 text-right"
        >
          <div>
            <p className="font-chakra-petch text-[11px] tracking-[0.22em] text-white/40 uppercase">
              Next Case Study
            </p>
            <p className="font-chakra-petch text-lg text-white group-hover:text-white/70">
              {study.next.name}
            </p>
          </div>
          <img
            src={study.next.img}
            alt=""
            className="hidden h-16 w-24 object-cover sm:block"
          />
        </Link>
      </div>
    </div>
  );
}

function SectionView({
  study,
  section,
  pageScroll,
}: {
  study: CaseStudyDetail;
  section: CaseStudySection;
  pageScroll: MotionValue<number>;
}) {
  switch (section.type) {
    case "hero":
      return (
        <HeroSection study={study} section={section} pageScroll={pageScroll} />
      );
    case "featured":
      return (
        <FeaturedSection
          study={study}
          section={section}
          pageScroll={pageScroll}
        />
      );
    case "narrative":
      return (
        <NarrativeSection
          study={study}
          section={section}
          pageScroll={pageScroll}
        />
      );
    case "experience":
      return (
        <ExperienceSection
          study={study}
          section={section}
          pageScroll={pageScroll}
        />
      );
    case "showcase":
      return (
        <ShowcaseSection
          study={study}
          section={section}
          pageScroll={pageScroll}
        />
      );
    case "closing":
      return (
        <ClosingSection
          study={study}
          section={section}
          pageScroll={pageScroll}
        />
      );
  }
}

export function CaseStudyTemplate({ study }: { study: CaseStudyDetail }) {
  usePauseScroll();

  const pageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: pageScroll } = useScroll({
    target: pageRef,
    offset: ["start start", "end end"],
  });

  const sectionCount = study.sections.length;
  const xVw = useTransform(pageScroll, [0, 1], [0, -(sectionCount - 1) * 100]);
  const xSmooth = useSpring(xVw, SNAPPY);
  const x = useTransform(xSmooth, (value) => `${value}vw`);
  const lastStart = study.sections[sectionCount - 1]?.range[0] ?? 0.875;
  const lastShowcaseStart =
    study.sections[sectionCount - 2]?.range[0] ?? lastStart - 0.12;
  const barOpacity = useTransform(
    pageScroll,
    [lastShowcaseStart, lastStart],
    [1, 0],
  );

  return (
    <div ref={pageRef} className="bg-black text-white">
      <Navbar pageScroll={pageScroll} />
      <div className="relative" style={{ height: `${sectionCount * 280}vh` }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 70% 60% at 80% 40%, ${study.accent}2e, transparent 60%), radial-gradient(ellipse 50% 50% at 10% 80%, ${study.accent}18, transparent 55%)`,
            }}
          />
          <motion.div
            style={{ x }}
            className="flex h-full will-change-transform"
          >
            {study.sections.map((section) => (
              <section
                key={section.id}
                className="relative h-screen w-screen shrink-0 overflow-hidden"
              >
                <SnappyPanel pageScroll={pageScroll} range={section.range}>
                  <SectionView
                    study={study}
                    section={section}
                    pageScroll={pageScroll}
                  />
                </SnappyPanel>
              </section>
            ))}
          </motion.div>
          <motion.div
            aria-hidden
            style={{ opacity: barOpacity }}
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-center justify-between bg-black/20 backdrop-blur-lg px-6 py-4 font-chakra-petch text-[11px] tracking-[0.18em] text-white uppercase sm:px-10 sm:text-sm"
          >
            {study.disciplines.map((discipline) => (
              <span key={discipline}>{discipline}</span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
