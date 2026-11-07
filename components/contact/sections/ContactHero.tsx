"use client";

import { useCallback, useRef } from "react";
import { motion } from "motion/react";
import { MapPin } from "lucide-react";
import { useReduceMotion } from "@/hooks/useReduceMotion";
import { MaskLines } from "@/components/practice/MaskLines";
import { ScrambleText } from "@/components/practice/ScrambleText";
import { SignalField } from "../SignalField";
import { BriefForm } from "../BriefForm";
import { useCopy, useZoneClock } from "../hooks";
import { contactDetails, contactHero } from "../content";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Above the fold: the promise on the left, the brief on the right, and a
 * field of noisy signals behind both that clears as the brief fills in.
 */
export function ContactHero() {
  const reduce = useReduceMotion();
  const clarityRef = useRef(0);
  const burstRef = useRef(0);
  const clock = useZoneClock(contactDetails.timeZone);
  const { copied, copy } = useCopy(contactDetails.email);
  const onSent = useCallback(() => {
    burstRef.current = performance.now();
    // The success panel is shorter than the form; keep it in view.
    requestAnimationFrame(() =>
      document.getElementById("brief")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }),
    );
  }, [reduce]);

  return (
    <section
      data-chapter="Intro"
      data-nav="dark"
      aria-labelledby="contact-title"
      className="heroDark relative isolate overflow-hidden bg-black text-white"
    >
      <SignalField clarityRef={clarityRef} burstRef={burstRef} reduce={reduce} className="-z-10" />
      {/* Readability scrims */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.55)_35%,rgba(0,0,0,0.85)_100%)] lg:bg-[linear-gradient(90deg,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.15)_45%,rgba(0,0,0,0.6)_100%)]"
      />

      <div className="relative flex min-h-[100svh] flex-col px-6 pt-20 pb-14 md:px-16 md:pb-16">
        {/* HUD line */}
        <div className="flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.25em] text-white/60 md:text-[11px]">
          <span>
            <a href="/" className="hover:text-white">
              Asymmetri
            </a>
            <span className="mx-2 text-asymmetri-red">/</span>
            <ScrambleText text="Contact · Open channel" trigger="mount" />
          </span>
          <span className="flex items-center whitespace-nowrap">
            <span className="kit-blink mr-2 inline-block size-1.5 bg-asymmetri-red" aria-hidden />
            <span className="hidden sm:inline">Kerala ·&nbsp;</span>IST {clock}
          </span>
        </div>

        <div className="mt-12 grid flex-1 gap-12 lg:mt-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-start lg:gap-16 xl:gap-24">
          {/* Promise */}
          <div className="min-w-0 lg:top-24 lg:pt-10 lg:pb-6 lg:[@media(min-height:860px)]:sticky">
            <h1 id="contact-title" className="font-chakra-petch font-bold uppercase">
              <motion.span
                initial={reduce ? false : { opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="mb-6 flex items-center gap-3 font-mono text-[10px] font-normal tracking-[0.3em] text-asymmetri-red md:text-xs"
              >
                <span aria-hidden className="h-px w-8 bg-asymmetri-red" />
                {contactHero.kicker}
              </motion.span>{" "}
              <span className="block text-[13vw] leading-[0.88] tracking-tight sm:text-[10vw] lg:text-[6.4vw]">
                <MaskLines
                  immediate
                  delay={0.15}
                  lines={contactHero.titleLines.map((l, i) =>
                    Array.isArray(l) ? (
                      <span key={i} className="text-asymmetri-red">
                        {l[0]}
                      </span>
                    ) : (
                      l
                    ),
                  )}
                />
              </span>
            </h1>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: EASE }}
              className="mt-8 max-w-xl space-y-4"
            >
              <p className="font-chakra-petch text-xl font-medium md:text-2xl">{contactHero.lede}</p>
              <p className="font-geist text-base leading-relaxed text-white/65">{contactHero.body}</p>
            </motion.div>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8, ease: EASE }}
              className="mt-10 border-t border-white/15 pt-6"
            >
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">Direct line</p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <a
                  href={`mailto:${contactDetails.email}`}
                  className="group kit-glitch font-chakra-petch text-2xl font-bold break-all transition-colors hover:text-asymmetri-red md:text-4xl"
                >
                  {contactDetails.email}
                </a>
                <button
                  type="button"
                  onClick={copy}
                  className="cursor-pointer border border-white/25 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 transition-colors hover:border-white hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span aria-live="polite">{copied ? "Copied ✓" : "Copy"}</span>
                </button>
              </div>
              <p className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
                <MapPin className="size-3.5 shrink-0 text-asymmetri-red" strokeWidth={1.75} aria-hidden />
                {contactDetails.location} · Working with global brands, across time zones
              </p>
            </motion.div>
          </div>

          {/* The brief */}
          <motion.div
            id="brief"
            initial={reduce ? false : { opacity: 0, y: 32, clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ opacity: 1, y: 0, clipPath: "inset(-4% -4% -4% -4%)" }}
            transition={{ delay: 0.45, duration: 1, ease: EASE }}
            className="min-w-0 scroll-mt-20"
          >
            <BriefForm clarityRef={clarityRef} onSent={onSent} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
