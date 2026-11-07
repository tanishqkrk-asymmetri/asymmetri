"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValueEvent } from "motion/react";
import { useReduceMotion } from "@/hooks/useReduceMotion";
import { SectionHead } from "@/components/practice/SectionHead";
import { useAnchorProgress } from "../hooks";
import { nextSteps } from "../content";

const EASE = [0.16, 1, 0.3, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

/** The engagement loop as a chip row; a red pulse runs through it on repeat. */
function LoopRow() {
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -15% 0px" });
  const reduce = useReduceMotion();
  const [lit, setLit] = useState(-1);
  const steps = nextSteps.loop;

  useEffect(() => {
    if (!inView || reduce) return;
    let i = 0;
    const id = setInterval(() => {
      setLit(i % (steps.length + 2));
      i++;
    }, 650);
    return () => clearInterval(id);
  }, [inView, reduce, steps.length]);

  return (
    <ol ref={ref} className="grid grid-cols-1 gap-px bg-black/15 sm:grid-cols-5" aria-label="The engagement loop">
      {steps.map((s, i) => {
        const on = reduce ? true : lit >= i && lit < steps.length + 1;
        const head = !reduce && lit === i;
        return (
          <li
            key={s.name}
            className={`relative flex min-w-0 flex-col justify-between gap-6 p-5 transition-colors duration-500 md:p-6 ${head ? "bg-asymmetri-red text-white" : on ? "bg-black text-white" : "bg-white text-black"}`}
          >
            <span className="flex items-center justify-between font-mono text-[10px] tracking-[0.25em]">
              <span className={head ? "text-white" : "text-asymmetri-red"}>{pad(i + 1)}</span>
              {i < steps.length - 1 ? (
                <span aria-hidden className="hidden sm:inline">→</span>
              ) : (
                <span aria-hidden className="hidden sm:inline">↺</span>
              )}
            </span>
            <span>
              <span className="block font-chakra-petch text-2xl font-bold uppercase md:text-3xl">{s.name}</span>
              <span className={`mt-1 block font-geist text-sm leading-snug ${on || head ? "text-white/70" : "text-black/60"}`}>
                {s.body}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * What happens after the form: a red line draws down the timeline with the
 * scroll and each step switches on as the line reaches it.
 */
export function NextSteps() {
  const listRef = useRef<HTMLOListElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const p = useAnchorProgress(listRef, 0.72, 0.5);
  const reduce = useReduceMotion();
  const [reached, setReached] = useState(0);

  useMotionValueEvent(p, "change", (v) => {
    const list = listRef.current;
    if (!list) return;
    const fill = v * list.offsetHeight;
    let n = 0;
    dotRefs.current.forEach((d) => {
      if (d && d.offsetTop <= fill + 4) n++;
    });
    setReached((cur) => (cur === n ? cur : n));
  });

  return (
    <section
      data-chapter="Process"
      data-nav="light"
      aria-labelledby="contact-next"
      className="relative bg-white px-6 py-28 text-black md:px-16 md:py-36"
    >
      <div className="grid gap-16 lg:grid-cols-[1fr_1.25fr] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start" id="contact-next">
          <SectionHead
            tone="light"
            align="left"
            kicker={nextSteps.kicker}
            title={nextSteps.titleLines}
          />
          <p className="mt-10 hidden font-mono text-[10px] uppercase tracking-[0.25em] text-black/45 lg:block">
            Step {pad(Math.max(reached, 1))} / {pad(nextSteps.steps.length)}
          </p>
        </div>

        <ol ref={listRef} className="relative">
          {/* Track and scroll-drawn fill */}
          <span aria-hidden className="absolute top-2 bottom-2 left-[11px] w-px bg-black/12" />
          <motion.span
            aria-hidden
            style={{ scaleY: reduce ? 1 : p }}
            className="absolute top-2 bottom-2 left-[11px] w-[2px] origin-top -translate-x-[0.5px] bg-asymmetri-red"
          />
          {nextSteps.steps.map((s, i) => {
            const on = reduce || i < reached;
            return (
              <li key={s.title} className="relative grid grid-cols-[24px_1fr] gap-6 pb-14 last:pb-0 md:gap-10 md:pb-20">
                <span
                  ref={(el) => {
                    dotRefs.current[i] = el;
                  }}
                  aria-hidden
                  className={`relative z-10 mt-2 flex size-6 items-center justify-center border transition-colors duration-500 ${on ? "border-asymmetri-red bg-asymmetri-red" : "border-black/25 bg-white"}`}
                >
                  <span className={`size-1.5 transition-colors duration-500 ${on ? "bg-white" : "bg-black/25"}`} />
                </span>
                <div
                  className={`transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${on ? "translate-x-0 opacity-100 blur-0" : "translate-x-3 opacity-25 blur-[1px]"}`}
                >
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-asymmetri-red">
                    Step {pad(i + 1)}
                  </p>
                  <h3 className="font-chakra-petch text-3xl leading-[0.95] font-bold uppercase md:text-5xl">{s.title}</h3>
                  <p className="mt-4 max-w-lg font-geist text-base leading-relaxed text-black/65 md:text-lg">{s.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 0.8, ease: EASE }}
        className="mt-24 md:mt-32"
      >
        <p className="mb-6 font-chakra-petch text-2xl font-semibold uppercase md:text-3xl">
          {nextSteps.loopIntro}
        </p>
        <LoopRow />
      </motion.div>
    </section>
  );
}
