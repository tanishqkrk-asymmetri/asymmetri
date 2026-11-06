"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { logEntries } from "./content";

/**
 * Hero aside: a running lab notebook entry that types itself out, then rolls
 * to the next one. Example content, labelled as such.
 */
export function ExperimentLog() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [chars, setChars] = useState(9999);
  const e = logEntries[i];
  const full = e.hypothesis;

  useEffect(() => {
    if (reduce) return;
    let n = chars >= full.length ? full.length : 0;
    const type = setInterval(() => {
      n += 2;
      setChars(n);
      if (n >= full.length) clearInterval(type);
    }, 28);
    const next = setTimeout(() => {
      setChars(0);
      setI((v) => (v + 1) % logEntries.length);
    }, 7000);
    return () => {
      clearInterval(type);
      clearTimeout(next);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, full, reduce]);

  const typed = full.slice(0, chars);
  const done = chars >= full.length;

  return (
    <div className="w-full min-w-0 max-w-md border border-white/20 bg-black/60 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-white/15 px-3 py-2">
        <span className="text-white">Experiment log</span>
        <span className="text-white/40">Example entry</span>
      </div>
      <div className="space-y-2 px-3 py-3" aria-live="off">
        <div className="flex justify-between gap-3">
          <span className="text-asymmetri-red">{e.id}</span>
          <span>{e.track}</span>
        </div>
        <p className="min-h-[3.2em] font-geist text-[12px] normal-case tracking-normal text-white/85">
          <span className="text-white/40">Hypothesis: </span>
          {typed}
          {!done && <span className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 bg-asymmetri-red" />}
        </p>
        <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-2">
          <span className={`shrink-0 ${e.dead ? "text-white/40 line-through" : "text-white"}`}>
            <span
              className={`mr-2 inline-block size-1.5 align-middle ${e.dead ? "bg-white/40" : "kit-blink bg-asymmetri-red"}`}
            />
            {e.status}
          </span>
          <span className="min-w-0 text-right text-white/45 normal-case tracking-normal">
            {done ? e.note : "…"}
          </span>
        </div>
      </div>
      <div className="flex gap-1 px-3 pb-3" aria-hidden>
        {logEntries.map((x, k) => (
          <span key={x.id} className={`h-0.5 flex-1 ${k === i ? "bg-asymmetri-red" : "bg-white/15"}`} />
        ))}
      </div>
    </div>
  );
}
