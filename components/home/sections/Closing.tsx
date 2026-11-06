"use client";

import { useCallback, useRef } from "react";
import { motion } from "motion/react";
import { useReduceMotion as useReducedMotion } from "@/hooks/useReduceMotion";
import { company } from "@/lib/site-content";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { MaskLines } from "@/components/practice/MaskLines";
import { ScrambleText } from "@/components/practice/ScrambleText";
import { SymmetryField } from "@/components/home/closing/SymmetryField";
import { ClosingWordmark } from "@/components/home/closing/ClosingWordmark";

const pad4 = (n: number) => String(n).padStart(4, "0");

/**
 * Finale. The FAQ's white floods red cell by cell, then the red becomes a
 * field of symmetric marks that the visitor breaks into the logo's slash just
 * by moving. The call to action sits on top; the wordmark shuts like a door
 * at the bottom, and the footer closes the page.
 */
export function Closing() {
  const reduce = !!useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const floodRef = useRef<HTMLDivElement>(null);
  const brokenRef = useRef<HTMLSpanElement>(null);
  const totalRef = useRef<HTMLSpanElement>(null);

  const onCount = useCallback((broken: number, total: number) => {
    if (brokenRef.current) brokenRef.current.textContent = pad4(broken);
    if (totalRef.current) totalRef.current.textContent = pad4(total);
  }, []);

  return (
    <section
      data-chapter="Contact"
      data-nav="red"
      aria-labelledby="closing-title"
      className="relative overflow-hidden bg-asymmetri-red text-white"
    >
      <div ref={hostRef} className="relative">
        <SymmetryField hostRef={hostRef} floodRef={floodRef} onCount={onCount} reduce={reduce} />
        <div ref={floodRef} aria-hidden className="h-[26vh] md:h-[32vh]" />

        <div className="relative flex flex-col px-6 pt-16 md:min-h-[100svh] md:px-10 md:pt-20">
          <div className="flex flex-1 flex-col items-center justify-center gap-7 text-center md:gap-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/75 md:text-xs">
              <ScrambleText text="Intelligence · Process · Experience · Scale" />
            </p>
            <h2
              id="closing-title"
              className="font-chakra-petch text-[clamp(2rem,min(8vw,9.6vh),8rem)] leading-[0.9] font-bold uppercase"
            >
              <MaskLines
                stagger={0.08}
                lines={[
                  "Bring us the",
                  "hard problem.",
                  <span key="a" className="text-black">We’ll find the</span>,
                  <span key="b" className="text-black">asymmetric answer.</span>,
                ]}
              />
            </h2>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex w-full flex-col items-center gap-5"
            >
              <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
                <a
                  href="/contact-us"
                  className="group relative flex items-center justify-between gap-10 overflow-hidden bg-black px-7 py-5 font-chakra-petch text-lg font-bold uppercase text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:px-9 md:py-6 md:text-xl"
                >
                  <span
                    aria-hidden
                    className="absolute inset-y-0 -left-1/4 w-[150%] origin-left -skew-x-[26deg] scale-x-0 bg-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                  />
                  <span className="relative transition-colors duration-300 group-hover:text-asymmetri-red group-focus-visible:text-asymmetri-red">
                    Get in touch
                  </span>
                  <span
                    aria-hidden
                    className="relative transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-asymmetri-red"
                  >
                    ↗
                  </span>
                </a>
                <a
                  href="/careers"
                  className="flex items-center justify-center border-2 border-white px-7 py-5 font-chakra-petch text-lg font-bold uppercase transition-colors duration-300 hover:bg-white hover:text-asymmetri-red focus-visible:bg-white focus-visible:text-asymmetri-red focus-visible:outline-none md:px-9 md:py-6 md:text-xl"
                >
                  Join our team
                </a>
              </div>
              <a
                href={`mailto:${company.email}`}
                className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/75 underline-offset-4 hover:text-white hover:underline"
              >
                or write to {company.email}
              </a>
            </motion.div>
          </div>

          <div className="mt-12 md:mt-10">
            <div
              aria-hidden
              className="mb-3 flex justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.25em] text-white/60"
            >
              <span className="hidden sm:inline">{reduce ? "Asymmetri" : "Move to break the symmetry"}</span>
              <span>
                Symmetry broken <span ref={brokenRef} className="text-white">0000</span> /{" "}
                <span ref={totalRef}>0000</span>
              </span>
            </div>
            <ClosingWordmark className="block h-auto w-full" />
          </div>
        </div>
      </div>
      <SiteFooter className="relative mt-6 md:mt-8" />
    </section>
  );
}
