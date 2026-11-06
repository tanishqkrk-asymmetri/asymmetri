"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { nextPractice, practices } from "@/lib/practices";
import { PracticeGlyph } from "./PracticeGlyph";
import { ScrambleText } from "./ScrambleText";

/**
 * End-of-page handoff: a giant link to the next practice that floods red on
 * hover, with the remaining practices listed underneath.
 */
export function NextPractice({ current }: { current: string }) {
  const next = nextPractice(current);
  const others = practices.filter((p) => p.slug !== current && p.slug !== next.slug);
  const [hover, setHover] = useState(0);
  const [isHover, setIsHover] = useState(false);

  return (
    <section data-chapter="Next" className="bg-black text-white">
      <a
        href={next.href}
        onMouseEnter={() => {
          setHover((h) => h + 1);
          setIsHover(true);
        }}
        onMouseLeave={() => setIsHover(false)}
        onFocus={() => setIsHover(true)}
        onBlur={() => setIsHover(false)}
        className="group relative block overflow-hidden border-y border-white/15 px-6 py-20 md:px-16 md:py-28"
      >
        <span className="absolute inset-0 origin-bottom scale-y-0 bg-asymmetri-red transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100" />
        <div className="relative flex items-center justify-between gap-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/60 group-hover:text-white md:text-xs">
          <span>Next practice · {next.index}</span>
          <PracticeGlyph kind={next.glyph} active={isHover} color="#ffffff" className="size-10 md:size-14" />
        </div>
        <motion.p
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-6 font-chakra-petch text-[11vw] leading-[0.9] font-bold uppercase transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-4 md:text-[7.5vw]"
        >
          <ScrambleText text={next.name} trigger="none" replayKey={hover} duration={0.6} />
          <span className="ml-4 inline-block transition-transform duration-500 group-hover:translate-x-3 group-hover:-translate-y-3">
            ↗
          </span>
        </motion.p>
        <p className="relative mt-6 max-w-xl font-geist text-base text-white/60 group-hover:text-white md:text-lg">
          {next.tagline}
        </p>
      </a>
      <ul className="grid md:grid-cols-2">
        {others.map((p) => (
          <li key={p.slug} className="border-b border-white/15 md:odd:border-r">
            <a
              href={p.href}
              className="group flex items-center justify-between gap-6 px-6 py-8 transition-colors duration-300 hover:bg-white hover:text-black md:px-16"
            >
              <span className="flex items-baseline gap-4">
                <span className="font-mono text-[10px] text-asymmetri-red">{p.index}</span>
                <span className="font-chakra-petch text-xl font-bold uppercase md:text-3xl">
                  {p.name}
                </span>
              </span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
