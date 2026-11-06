"use client";

import { useRef } from "react";
import { motion, useTransform } from "motion/react";
import { useReduceMotion as useReducedMotion } from "@/hooks/useReduceMotion";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { MaskLines } from "@/components/practice/MaskLines";
import { ScrambleText } from "@/components/practice/ScrambleText";
import { PracticesIndex } from "@/components/home/PracticesIndex";

/**
 * "What we do": the brief (bring us the hard problem), then the four
 * practices as one particle field that re-forms into each practice's
 * signature. Arrives on white from the tile transition above.
 */
export function WhatWeDo() {
  const intro = useRef<HTMLDivElement>(null);
  const p = useSectionProgress(intro, "pass");
  const reduce = useReducedMotion();
  // The two headline lines shear apart as the intro scrolls away.
  const left = useTransform(p, [0.5, 1], ["0%", reduce ? "0%" : "-8%"]);
  const right = useTransform(p, [0.5, 1], ["0%", reduce ? "0%" : "6%"]);

  return (
    <section
      id="what-we-do"
      data-chapter="What we do"
      data-nav="light"
      aria-labelledby="what-we-do-title"
      className="relative overflow-x-clip bg-white text-black"
    >
      <div ref={intro} className="relative px-5 pt-28 pb-10 md:px-16 md:pt-36 md:pb-16">
        <div className="mb-8 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.3em] md:mb-12 md:text-xs">
          <span className="text-asymmetri-red">
            <ScrambleText text="01 · What we do" />
          </span>
          <span className="flex items-center gap-3 text-black/50" aria-hidden>
            <span className="relative flex h-4 items-center">
              <span className="h-4 w-[6px] -skew-x-[26deg] bg-asymmetri-red" />
              <span className="ml-[3px] h-4 w-[2px] -skew-x-[26deg] bg-asymmetri-red" />
            </span>
            The brief
          </span>
        </div>

        <h2 id="what-we-do-title" className="font-chakra-petch uppercase">
          <span className="block text-[13.5vw] leading-[0.84] font-bold tracking-tight text-asymmetri-red md:text-[9.6vw]">
            <motion.span style={{ x: left }} className="block">
              <MaskLines lines={["Bring us the"]} />
            </motion.span>
            <motion.span style={{ x: right }} className="block md:text-right">
              <MaskLines lines={["hard problem."]} delay={0.1} />
            </motion.span>
          </span>
          <span className="mt-6 block max-w-[18ch] text-2xl leading-[1.02] font-semibold md:mt-10 md:text-[3.4vw]">
            <MaskLines lines={["Ambitious AI,", "tangled operations,", "global scale."]} delay={0.25} stagger={0.07} />
          </span>
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex max-w-md flex-col gap-6 lg:absolute lg:right-16 lg:bottom-16 lg:mt-0 lg:max-w-sm"
        >
          <p className="font-geist text-base leading-relaxed text-black/70 md:text-lg">
            We frame it, engineer it and put it into production. Strategy, design and engineering in one accountable team.
          </p>
          <a
            href="/contact-us"
            className="group relative inline-flex w-fit items-center gap-3 overflow-hidden border border-black px-5 py-3 font-chakra-petch text-sm font-semibold uppercase tracking-wide"
          >
            <span className="absolute inset-0 origin-left scale-x-0 bg-asymmetri-red transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100" />
            <span className="relative transition-colors duration-300 group-hover:text-white group-focus-visible:text-white">
              Discuss a problem
            </span>
            <span className="relative transition-colors duration-300 group-hover:text-white group-focus-visible:text-white">↗</span>
          </a>
        </motion.div>
      </div>

      <PracticesIndex />
    </section>
  );
}
