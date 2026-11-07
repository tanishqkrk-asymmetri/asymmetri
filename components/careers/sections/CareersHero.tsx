"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { MaskLines } from "@/components/practice/MaskLines";
import { ScrambleText } from "@/components/practice/ScrambleText";
import { useReduceMotion } from "@/hooks/useReduceMotion";
import { hero } from "../content";
import { MisfitField } from "./misfitField";

const EASE = [0.16, 1, 0.3, 1] as const;

function useIstClock() {
  const [t, setT] = useState("--:--:--");
  useEffect(() => {
    const f = () =>
      setT(
        new Date().toLocaleTimeString("en-GB", {
          timeZone: "Asia/Kolkata",
          hour12: false,
        }),
      );
    f();
    const id = setInterval(f, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

/**
 * Careers hero. A field of identical dashes, a few red misfits, and the
 * pointer knocking the template off axis. The H1 rises out of masks over it.
 */
export function CareersHero({ openRoles = 0 }: { openRoles?: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReduceMotion();
  const clock = useIstClock();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const bigY = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);

  const status = [
    ...hero.status,
    {
      k: "Open roles",
      v: openRoles > 0 ? String(openRoles).padStart(2, "0") : "Always open to misfits",
    },
  ];

  return (
    <section
      ref={ref}
      data-chapter="Intro"
      data-nav="dark"
      aria-labelledby="careers-title"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-black text-white"
    >
      <div className="absolute inset-0">
        <MisfitField reduce={reduce} />
      </div>

      {/* Readability scrim behind the type */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.45)_50%,rgba(0,0,0,0.05)_100%),linear-gradient(0deg,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0)_45%)]"
      />

      <motion.span
        style={{ y: bigY }}
        aria-hidden
        className="kit-outline pointer-events-none absolute -right-[3vw] -bottom-[4vw] font-chakra-petch text-[34vw] leading-none font-bold uppercase select-none md:text-[22vw]"
      >
        Misfit
      </motion.span>

      <div className="relative z-10 flex items-center justify-between gap-4 px-6 pt-20 font-mono text-[10px] uppercase tracking-[0.25em] text-white/60 md:px-16 md:text-[11px]">
        <span>
          <a href="/" className="hover:text-white">
            Asymmetri
          </a>
          <span className="mx-2 text-asymmetri-red">/</span>
          <ScrambleText text={hero.kicker} trigger="mount" />
        </span>
        <span className="hidden sm:inline">
          <span className="kit-blink mr-2 inline-block size-1.5 bg-asymmetri-red align-middle" />
          Kerala · IST {clock}
        </span>
      </div>

      <motion.div
        style={reduce ? undefined : { y, opacity: fade }}
        className="pointer-events-none relative z-10 mt-auto grid gap-10 px-6 pt-16 pb-14 md:px-16 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-end"
      >
        <div className="min-w-0">
          <h1
            id="careers-title"
            className="font-chakra-petch text-[12.6vw] leading-[0.86] font-bold uppercase tracking-tight sm:text-[11vw] lg:text-[6.4vw] 2xl:text-[6.8vw]"
          >
            <span className="sr-only">Careers &amp; Culture at Asymmetri: </span>
            <MaskLines
              immediate
              delay={0.15}
              lines={hero.titleLines.map((l, i) =>
                Array.isArray(l) ? (
                  <span key={i} className="kit-glitch text-asymmetri-red">
                    {l[0]}
                  </span>
                ) : (
                  l
                ),
              )}
            />
          </h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.7, ease: EASE }}
            className="mt-6 max-w-2xl font-chakra-petch text-xl font-medium text-white md:text-3xl"
          >
            {hero.lede}
          </motion.p>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.7, ease: EASE }}
          className="pointer-events-auto min-w-0 space-y-5 border border-white/10 bg-black/60 p-5 backdrop-blur-md md:p-6 lg:max-w-lg lg:justify-self-end"
        >
          <p className="max-w-md font-geist text-sm leading-relaxed text-white/75 md:text-base">
            {hero.body}
          </p>
          <dl className="divide-y divide-white/10 border-y border-white/10 font-mono text-[10px] uppercase tracking-[0.18em] md:text-[11px]">
            {status.map((s, i) => (
              <div key={s.k} className="flex items-baseline justify-between gap-4 py-2">
                <dt className="text-white/40">
                  <span className="mr-2 text-asymmetri-red">{String(i + 1).padStart(2, "0")}</span>
                  {s.k}
                </dt>
                <dd className="text-right text-white">{s.v}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={hero.primaryCta.href}
              className="group relative inline-flex items-center gap-3 overflow-hidden bg-asymmetri-red px-5 py-3 font-chakra-petch text-sm font-semibold uppercase tracking-wide"
            >
              <span className="absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
              <span className="relative transition-colors duration-300 group-hover:text-black">
                {hero.primaryCta.label}
              </span>
              <span className="relative transition-colors duration-300 group-hover:text-asymmetri-red">↓</span>
            </a>
            <a
              href={hero.secondaryCta.href}
              className="border border-white/40 px-5 py-3 font-chakra-petch text-sm font-semibold uppercase tracking-wide transition-colors duration-300 hover:border-white hover:bg-white hover:text-black"
            >
              {hero.secondaryCta.label}
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
