"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { useReduceMotion } from "@/hooks/useReduceMotion";
import { company } from "@/lib/site-content";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { MaskLines } from "@/components/practice/MaskLines";
import { ScrambleText } from "@/components/practice/ScrambleText";
import { careersClosing } from "../content";
import { CareersClosingField } from "./CareersClosingField";

/**
 * Finale. A field of identical dashes on red, one white misfit moving
 * through it (toward the pointer), knocking everything it passes out of
 * line. The call to action sits on top; the footer closes the page.
 */
export function CareersClosing() {
  const reduce = useReduceMotion();
  const hostRef = useRef<HTMLDivElement>(null);

  return (
    <section
      data-chapter="Join"
      data-nav="red"
      aria-labelledby="careers-closing"
      className="relative overflow-hidden bg-asymmetri-red text-white"
    >
      <div ref={hostRef} className="relative">
        <CareersClosingField hostRef={hostRef} reduce={reduce} />

        <div className="pointer-events-none relative flex min-h-[100svh] flex-col items-center justify-center gap-8 px-6 py-28 text-center md:px-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/80 md:text-xs">
            <ScrambleText text={careersClosing.kicker} />
          </p>
          <h2
            id="careers-closing"
            className="font-chakra-petch text-[clamp(3rem,min(11vw,13vh),10rem)] leading-[0.86] font-bold uppercase"
          >
            <MaskLines
              stagger={0.08}
              lines={careersClosing.lines.map((l, i) =>
                Array.isArray(l) ? (
                  <span key={i} className="text-black">
                    {l[0]}
                  </span>
                ) : (
                  l
                ),
              )}
            />
          </h2>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-chakra-petch text-xl font-semibold uppercase md:text-3xl"
          >
            {careersClosing.sub}
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex w-full flex-col items-center gap-5"
          >
            <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
              <a
                href={careersClosing.primary.href}
                className="group relative flex items-center justify-between gap-10 overflow-hidden bg-black px-7 py-5 font-chakra-petch text-lg font-bold uppercase text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:px-9 md:py-6 md:text-xl"
              >
                <span
                  aria-hidden
                  className="absolute inset-y-0 -left-1/4 w-[150%] origin-left -skew-x-[26deg] scale-x-0 bg-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                />
                <span className="relative transition-colors duration-300 group-hover:text-asymmetri-red group-focus-visible:text-asymmetri-red">
                  {careersClosing.primary.label}
                </span>
                <span
                  aria-hidden
                  className="relative transition-[transform,color] duration-300 group-hover:translate-y-1 group-hover:text-asymmetri-red"
                >
                  ↓
                </span>
              </a>
              <a
                href={careersClosing.secondary.href}
                className="flex items-center justify-center border-2 border-white bg-asymmetri-red/60 px-7 py-5 font-chakra-petch text-lg font-bold uppercase backdrop-blur-[2px] transition-colors duration-300 hover:bg-white hover:text-asymmetri-red focus-visible:bg-white focus-visible:text-asymmetri-red focus-visible:outline-none md:px-9 md:py-6 md:text-xl"
              >
                {careersClosing.secondary.label}
              </a>
            </div>
            <a
              href={`mailto:${company.email}`}
              className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/80 underline-offset-4 hover:text-white hover:underline"
            >
              or write to {company.email}
            </a>
          </motion.div>
          <p
            aria-hidden
            className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/60 md:block"
          >
            {reduce ? "One misfit changes the whole field" : "Move to steer the misfit"}
          </p>
        </div>
      </div>
      <SiteFooter className="relative" />
    </section>
  );
}
