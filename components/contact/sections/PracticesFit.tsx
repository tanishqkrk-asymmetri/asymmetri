"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useReduceMotion } from "@/hooks/useReduceMotion";
import { practices, type Practice } from "@/lib/practices";
import { SectionHead } from "@/components/practice/SectionHead";
import { PracticeGlyph } from "@/components/practice/PracticeGlyph";
import { ScrambleText } from "@/components/practice/ScrambleText";
import { practicesFit } from "../content";

const EASE = [0.16, 1, 0.3, 1] as const;

function PracticeCard({ p, i }: { p: Practice; i: number }) {
  const reduce = useReduceMotion();
  const [hover, setHover] = useState(false);
  const [replay, setReplay] = useState(0);
  const on = () => {
    setHover(true);
    setReplay((r) => r + 1);
  };
  const off = () => setHover(false);

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.8, delay: i * 0.08, ease: EASE }}
      className="min-w-0 bg-white"
    >
      <a
        href={p.href}
        onMouseEnter={on}
        onMouseLeave={off}
        onFocus={on}
        onBlur={off}
        className="group relative flex h-full min-h-[26rem] flex-col justify-between gap-10 overflow-hidden p-6 text-black outline-none md:p-8"
      >
        {/* Black floods up from the bottom on hover. */}
        <span
          aria-hidden
          className="absolute inset-0 origin-bottom scale-y-0 bg-black transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
        />
        <span
          aria-hidden
          className="kit-outline-dark pointer-events-none absolute -right-3 -bottom-8 font-chakra-petch text-[9rem] leading-none font-bold transition-opacity duration-500 select-none group-hover:opacity-0"
        >
          {p.index}
        </span>

        <div className="relative flex items-start justify-between">
          <span className="font-mono text-[11px] tracking-[0.25em] text-asymmetri-red">{p.index}</span>
          <PracticeGlyph
            kind={p.glyph}
            active={hover}
            color={hover ? "#ffffff" : "#000000"}
            className="size-14 [&_*]:transition-colors"
          />
        </div>

        <div className="relative space-y-4 transition-colors duration-300 group-hover:text-white">
          <h3 className="font-chakra-petch text-2xl leading-[1.02] font-bold uppercase xl:text-[1.7rem]">
            <ScrambleText text={p.name} trigger="none" replayKey={replay} duration={0.5} />
          </h3>
          <p className="font-geist text-base leading-snug text-black/60 transition-colors group-hover:text-white/80">
            {p.tagline}
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {p.capabilities.slice(0, 4).map((c) => (
              <li
                key={c}
                className="border border-black/15 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-black/60 transition-colors group-hover:border-white/25 group-hover:text-white/75"
              >
                {c}
              </li>
            ))}
          </ul>
          <span className="inline-flex items-center gap-2 pt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-black/55 group-hover:text-asymmetri-red">
            Explore the practice
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </span>
        </div>
      </a>
    </motion.li>
  );
}

/** Routes the visitor to the practice closest to their problem. */
export function PracticesFit() {
  return (
    <section
      data-chapter="Practices"
      data-nav="light"
      aria-labelledby="contact-practices"
      className="relative bg-[#f4f4f4] px-6 py-28 text-black md:px-16 md:py-36"
    >
      <div id="contact-practices">
        <SectionHead tone="light" kicker={practicesFit.kicker} title={practicesFit.titleLines} body={practicesFit.body} />
      </div>
      <ul className="mt-16 grid grid-cols-1 gap-px border border-black/15 bg-black/15 md:grid-cols-2 xl:grid-cols-4">
        {practices.map((p, i) => (
          <PracticeCard key={p.slug} p={p} i={i} />
        ))}
      </ul>
    </section>
  );
}
