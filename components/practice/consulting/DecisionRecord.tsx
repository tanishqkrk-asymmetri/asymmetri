"use client";

import { useCallback, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { SectionHead } from "@/components/practice/SectionHead";
import { record } from "./content";
import css from "./consulting.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/** Black redaction bar that retracts line by line (box-decoration clone). */
function Redacted({ p, from, to, children, className }: { p: MotionValue<number>; from: number; to: number; children: string; className?: string }) {
  const size = useTransform(p, [from, to], ["100% 100%", "0% 100%"]);
  return (
    <motion.span
      style={{
        backgroundImage: "linear-gradient(#000,#000)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right center",
        backgroundSize: size,
        WebkitBoxDecorationBreak: "clone",
        boxDecorationBreak: "clone",
      }}
      className={className}
    >
      {children}
    </motion.span>
  );
}

function Entry({
  e,
  i,
  onDecided,
}: {
  e: (typeof record)[number];
  i: number;
  onDecided: (i: number, v: boolean) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const live = useSectionProgress(ref, "pass");
  const done = useMotionValue(1);
  const reduce = useReducedMotion();
  const p = reduce ? done : live;
  const last = useRef(false);

  useMotionValueEvent(live, "change", (v) => {
    const d = v > 0.47;
    if (d !== last.current) {
      last.current = d;
      onDecided(i, d);
    }
  });

  const stampOpacity = useTransform(p, [0.45, 0.48], [0, 1]);
  const stampScale = useTransform(p, [0.45, 0.49], [2.6, 1]);
  const rowTint = useTransform(p, [0.45, 0.5], ["rgba(205,23,23,0)", "rgba(205,23,23,0.05)"]);

  return (
    <motion.li ref={ref} style={{ background: rowTint }} className="relative border-b border-black/15 px-5 py-8 md:px-8 md:py-10">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pr-28 font-mono text-[10px] uppercase tracking-[0.25em] md:pr-40">
        <span className="bg-black px-1.5 py-0.5 text-white">{e.id}</span>
        <span className="text-black/50">{e.kind}</span>
      </div>
      <h3 className="mt-4 max-w-[30rem] pr-20 font-chakra-petch text-2xl leading-[1.05] font-bold uppercase md:pr-28 md:text-3xl">
        <Redacted p={p} from={0.18} to={0.34}>
          {e.title}
        </Redacted>
      </h3>
      <p className="mt-4 max-w-[34rem] font-geist text-[15px] leading-[1.7] text-black/75 md:text-base md:leading-[1.75]">
        <Redacted p={p} from={0.26} to={0.44}>
          {e.body}
        </Redacted>
      </p>
      <motion.span
        aria-hidden
        style={{ opacity: stampOpacity, scale: stampScale, rotate: i % 2 ? 7 : -9 }}
        className={`${css.stamp} absolute top-6 right-4 border-[3px] border-asymmetri-red px-2 py-1 font-chakra-petch text-sm font-bold uppercase tracking-[0.12em] text-asymmetri-red md:top-8 md:right-8 md:text-xl`}
      >
        {e.stamp}
      </motion.span>
    </motion.li>
  );
}

/**
 * What you keep: an engagement record whose lines un-redact as you scroll
 * past them, each decision stamped as it resolves.
 */
export function DecisionRecord() {
  const [decided, setDecided] = useState<boolean[]>(() => record.map(() => false));
  const reduce = useReducedMotion();
  const onDecided = useCallback((i: number, v: boolean) => {
    setDecided((cur) => {
      if (cur[i] === v) return cur;
      const next = [...cur];
      next[i] = v;
      return next;
    });
  }, []);
  const count = reduce ? record.length : decided.filter(Boolean).length;

  return (
    <section data-chapter="Deliverables" className="relative bg-white px-6 py-28 text-black md:px-16 md:py-36">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead
            tone="light"
            align="left"
            kicker="05 · What you keep"
            title={["Decisions,", ["not decks."]]}
            body="Every engagement leaves a written trail your team can build from: decisions with their reasoning, a sequenced plan, owned risks and real numbers. No slideware hand-off. If you want it built, the people who wrote it stay on."
          />
          <div className="mt-12 hidden items-end gap-3 lg:flex" aria-hidden>
            <span className="font-chakra-petch text-[9rem] leading-[0.8] font-bold text-asymmetri-red tabular-nums">{pad(count)}</span>
            <span className="kit-outline-dark font-chakra-petch text-[9rem] leading-[0.8] font-bold">/{pad(record.length)}</span>
          </div>
          <p className="mt-4 hidden font-mono text-[10px] uppercase tracking-[0.25em] text-black/50 lg:block" aria-hidden>
            Decisions on the record
          </p>
        </div>

        <div className="border border-black/20 shadow-[12px_12px_0_0_rgba(0,0,0,0.06)]">
          <div className="sticky top-14 z-10 flex items-center justify-between gap-4 border-b border-black bg-white px-5 py-3 font-mono text-[10px] uppercase tracking-[0.25em] md:px-8">
            <span>
              Engagement record <span className="text-asymmetri-red">· Example</span>
            </span>
            <span className="flex items-center gap-2" aria-hidden>
              <span className={`size-1.5 ${count === record.length ? "bg-asymmetri-red" : "kit-blink bg-black"}`} />
              {pad(count)}/{pad(record.length)} decided
            </span>
          </div>
          <ol>
            {record.map((e, i) => (
              <Entry key={e.id} e={e} i={i} onDecided={onDecided} />
            ))}
          </ol>
          <p className="px-5 py-4 font-mono text-[10px] uppercase tracking-[0.2em] text-black/45 md:px-8">
            Illustrative entries. Real records are written for your system and stay with your team.
          </p>
        </div>
      </div>
    </section>
  );
}
