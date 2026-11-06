"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { trace, type TraceLine } from "./content";
import { MESH_EVENT, type MeshEventDetail } from "./AgentMesh";
import styles from "./ai.module.css";

const VISIBLE = 5;
type Row = TraceLine & { id: number; ts: string };

const stamp = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return `00:${String(s % 60).padStart(2, "0")}.${String(ms % 1000).padStart(3, "0")}`;
};

/**
 * Streaming example trace for the hero. Each line lights its agent in the
 * mesh; the critic's rejection makes the mesh re-route its critical path.
 */
export function TraceLog() {
  const reduce = useReducedMotion();
  const [rows, setRows] = useState<Row[]>(() =>
    trace.slice(0, VISIBLE).map((l, i) => ({ ...l, id: i, ts: stamp(412 + i * 640) })),
  );
  const state = useRef({ i: VISIBLE, id: VISIBLE, clock: 412 + VISIBLE * 640 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce) return;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    if (ref.current) io.observe(ref.current);
    const id = window.setInterval(() => {
      if (!visible || document.hidden) return;
      const s = state.current;
      const line = trace[s.i % trace.length];
      if (s.i % trace.length === 0) s.clock = 412;
      s.clock += 380 + ((s.i * 997) % 900);
      const row: Row = { ...line, id: s.id++, ts: stamp(s.clock) };
      s.i++;
      setRows((r) => [...r.slice(-(VISIBLE - 1)), row]);
      window.dispatchEvent(
        new CustomEvent<MeshEventDetail>(MESH_EVENT, {
          detail: { node: line.node, reroute: line.reroute },
        }),
      );
    }, 1400);
    return () => {
      clearInterval(id);
      io.disconnect();
    };
  }, [reduce]);

  return (
    <div
      ref={ref}
      className="w-full max-w-md overflow-hidden [contain:inline-size] border border-white/15 bg-black/70 font-mono text-[10px] backdrop-blur-sm md:text-[11px]"
    >
      <div className="flex items-center justify-between border-b border-white/15 px-3 py-1.5 uppercase tracking-[0.2em] text-white/50">
        <span>
          <span className="kit-blink mr-2 inline-block size-1.5 bg-asymmetri-red align-middle" />
          Agent trace
        </span>
        <span>Example</span>
      </div>
      <ol className="h-[8.5rem] overflow-hidden px-3 py-2" aria-label="Example agent trace">
        {rows.map((r) => (
          <li
            key={r.id}
            className={`${styles.traceRow} flex gap-2 truncate leading-[1.5rem] whitespace-nowrap text-white/80`}
          >
            <span className="text-white/35">{r.ts}</span>
            <span
              className={
                r.kind === "reject"
                  ? "text-asymmetri-red"
                  : r.kind === "ok"
                    ? "text-white"
                    : "text-white/50"
              }
            >
              {r.kind === "reject" ? "✕" : r.kind === "ok" ? "✓" : "▸"}
            </span>
            <span className={`w-[4.6rem] shrink-0 ${r.kind === "reject" ? "text-asymmetri-red" : "text-white"}`}>
              {r.agent}
            </span>
            <span className="truncate">{r.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
