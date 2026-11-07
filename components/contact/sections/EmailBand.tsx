"use client";

import { AnimatePresence, motion } from "motion/react";
import { useReduceMotion } from "@/hooks/useReduceMotion";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Marquee } from "@/components/practice/Marquee";
import { ScrambleText } from "@/components/practice/ScrambleText";
import { useCopy } from "../hooks";
import { contactDetails, emailBand } from "../content";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Finale: the address as the biggest thing on the page. Letters lift on
 * hover like keys being pressed; a scan line passes over it; click to write,
 * or copy it with one tap.
 */
export function EmailBand() {
  const reduce = useReduceMotion();
  const { copied, copy } = useCopy(contactDetails.email);
  const chars = [...contactDetails.email];

  return (
    <section
      data-chapter="Email"
      data-nav="red"
      aria-labelledby="contact-email"
      className="relative overflow-hidden bg-asymmetri-red text-white"
    >
      <div className="relative flex min-h-[85svh] flex-col justify-center gap-10 px-6 pt-28 pb-12 md:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.25em] text-white/80 md:text-xs">
          <h2 id="contact-email" className="font-normal">
            <ScrambleText text={emailBand.kicker} />
          </h2>
          <span className="flex items-center gap-2">
            <span className="kit-blink inline-block size-1.5 bg-black" aria-hidden />
            Channel open
          </span>
        </div>

        <div className="relative">
          <a
            href={`mailto:${contactDetails.email}`}
            aria-label={`Email Asymmetri at ${contactDetails.email}`}
            className="group relative block font-chakra-petch text-[clamp(1.9rem,9.8vw,12rem)] leading-[0.95] font-bold tracking-tight whitespace-nowrap outline-none focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-white"
          >
            <span aria-hidden className="flex">
              {chars.map((ch, i) => (
                <span
                  key={i}
                  style={{ transitionDelay: `${i * 18}ms` }}
                  className={`inline-block transition-[transform,color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[0.08em] group-focus-visible:-translate-y-[0.08em] ${ch === "@" ? "text-black" : "group-hover:text-black"}`}
                >
                  {ch}
                </span>
              ))}
            </span>
            {/* Scan line */}
            {!reduce && (
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 h-[2px] bg-white mix-blend-overlay"
                initial={{ top: "0%" }}
                animate={{ top: ["0%", "100%"] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "linear", repeatDelay: 1.2 }}
              />
            )}
          </a>
          <span aria-hidden className="mt-4 block h-px w-full origin-left bg-white/40" />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={copy}
            className="group relative cursor-pointer overflow-hidden bg-black px-6 py-4 font-chakra-petch text-base font-bold uppercase text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <span
              aria-hidden
              className="absolute inset-y-0 -left-1/4 w-[150%] origin-left -skew-x-[26deg] scale-x-0 bg-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
            />
            <span className="relative transition-colors duration-300 group-hover:text-asymmetri-red">
              {emailBand.copy}
            </span>
          </button>
          <a
            href={`mailto:${contactDetails.email}`}
            className="border border-white px-6 py-4 font-chakra-petch text-base font-bold uppercase transition-colors duration-300 hover:bg-white hover:text-asymmetri-red"
          >
            Open your email ↗
          </a>
          <a
            href="#brief"
            className="px-2 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/80 underline-offset-4 hover:text-white hover:underline"
          >
            Or send the brief ↑
          </a>
          <span aria-live="polite" className="ml-1 min-w-[12rem]">
            <AnimatePresence>
              {copied && (
                <motion.span
                  key="copied"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="inline-flex items-center gap-2 bg-white px-3 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-asymmetri-red"
                >
                  ✓ {emailBand.copied}
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </div>
        {/* Outline marquee under the address */}
        <div aria-hidden className="pointer-events-none relative -mx-6 opacity-70 md:-mx-10">
          <Marquee
            speed={60}
            items={["Bring us the hard problem", "We'll find the asymmetric answer"].map((t) => (
              <span
                key={t}
                className="font-chakra-petch text-6xl font-bold uppercase [-webkit-text-stroke:1px_rgba(255,255,255,0.35)] [color:transparent] md:text-8xl"
              >
                {t}
              </span>
            ))}
            separator={<span className="inline-block size-3 -skew-x-[26deg] bg-black/40" />}
          />
        </div>
      </div>
      <SiteFooter />
    </section>
  );
}
