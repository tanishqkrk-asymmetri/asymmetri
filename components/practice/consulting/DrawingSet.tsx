"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { motion } from "motion/react";
import { useReduceMotion as useReducedMotion } from "@/hooks/useReduceMotion";
import { SectionHead } from "@/components/practice/SectionHead";
import { capabilityDetail } from "./content";
import css from "./consulting.module.css";

const pad = (n: number) => String(n).padStart(2, "0");
const RED = "#cd1717";

function Draw({ d, red, delay = 0, dash }: { d: string; red?: boolean; delay?: number; dash?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={red ? RED : "rgba(255,255,255,0.85)"}
      strokeWidth={red ? 2 : 1.25}
      strokeDasharray={dash ? "4 5" : undefined}
      initial={reduce ? false : { pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}

function Box({ x, y, s = 10, red, delay = 0 }: { x: number; y: number; s?: number; red?: boolean; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.rect
      x={x - s / 2}
      y={y - s / 2}
      width={s}
      height={s}
      fill={red ? RED : "#0a0a0a"}
      stroke={red ? RED : "rgba(255,255,255,0.85)"}
      strokeWidth={1.25}
      initial={reduce ? false : { scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      style={{ transformOrigin: `${x}px ${y}px` }}
      transition={{ duration: 0.4, delay }}
    />
  );
}

const T = ({ x, y, children, red }: { x: number; y: number; children: ReactNode; red?: boolean }) => (
  <text x={x} y={y} fill={red ? RED : "rgba(255,255,255,0.55)"} fontSize={7} fontFamily="ui-monospace, monospace" letterSpacing={1}>
    {children}
  </text>
);

/** One schematic per capability, drawn in on selection. */
function Schematic({ i }: { i: number }) {
  const body = (() => {
    switch (i) {
      case 0: {
        const ys = [22, 40, 58, 76, 94, 112, 130, 148];
        return (
          <>
            {ys.map((y, k) => (
              <g key={y}>
                <Box x={24} y={y} s={6} delay={k * 0.03} />
                <Draw d={`M27 ${y} C 110 ${y}, 120 90, 196 90`} delay={0.1 + k * 0.04} />
              </g>
            ))}
            <Box x={200} y={90} s={16} red delay={0.7} />
            <T x={14} y={170}>SIGNALS · OPINIONS · ASKS</T>
            <T x={168} y={116} red>PROBLEM</T>
          </>
        );
      }
      case 1: {
        const rows: [string, number][] = [["DATA", 0.42], ["PROCESS", 0.7], ["PEOPLE", 0.58], ["RISK", 0.36], ["PLATFORM", 0.8]];
        return (
          <>
            {rows.map(([l, v], k) => (
              <g key={l}>
                <T x={12} y={34 + k * 26}>{l}</T>
                <Draw d={`M70 ${31 + k * 26} H 220`} dash />
                <Draw d={`M70 ${31 + k * 26} H ${70 + v * 150}`} red={v < 0.5} delay={0.1 + k * 0.08} />
              </g>
            ))}
            <Draw d="M160 16 V 156" red dash delay={0.6} />
            <T x={150} y={170} red>READY LINE</T>
          </>
        );
      }
      case 2:
        return (
          <>
            <Draw d="M30 30 H 90 V 62 H 30 Z" />
            <Draw d="M150 30 H 210 V 62 H 150 Z" />
            <Draw d="M90 110 H 150 V 142 H 90 Z" red delay={0.2} />
            <Draw d="M60 62 V 126 H 90" delay={0.4} />
            <Draw d="M180 62 V 126 H 150" delay={0.45} />
            <Draw d="M90 46 H 150" dash delay={0.5} />
            <T x={36} y={49}>CHANNEL</T>
            <T x={158} y={49}>AGENT</T>
            <T x={100} y={129} red>CORE</T>
            <T x={14} y={170}>C4 · CONTAINER VIEW</T>
          </>
        );
      case 3: {
        const flagged = new Set([4, 13, 19]);
        return (
          <>
            {Array.from({ length: 24 }, (_, k) => (
              <Box key={k} x={40 + (k % 6) * 32} y={34 + Math.floor(k / 6) * 30} s={18} red={flagged.has(k)} delay={k * 0.02} />
            ))}
            <rect x={22} y={14} width={4} height={130} fill={RED} className={css.scan} />
            <T x={14} y={170}>SCAN · 3 FINDINGS · RANKED</T>
          </>
        );
      }
      case 4:
        return (
          <>
            <Box x={120} y={28} s={14} red />
            <Draw d="M120 35 V 60 M60 60 H 180 M60 60 V 84 M120 60 V 84 M180 60 V 84" delay={0.2} />
            {[60, 120, 180].map((x, k) => (
              <Box key={x} x={x} y={90} s={12} delay={0.4 + k * 0.05} />
            ))}
            <Draw d="M60 96 V 120 M40 120 H 80 M40 120 V 136 M80 120 V 136 M180 96 V 120 M160 120 H 200 M160 120 V 136 M200 120 V 136" delay={0.6} />
            {[40, 80, 160, 200].map((x, k) => (
              <Box key={x} x={x} y={140} s={9} delay={0.8 + k * 0.05} />
            ))}
            <T x={132} y={31} red>FRACTIONAL CTO</T>
            <T x={14} y={170}>DIRECTION · HIRING · HANDOVER</T>
          </>
        );
      default:
        return (
          <>
            <Draw d="M20 150 H 225 M20 150 V 14" />
            <Draw d="M20 140 L 220 24" dash />
            <Draw d="M20 140 C 70 120, 100 112, 120 118 S 150 132, 160 128" delay={0.15} />
            <Draw d="M160 128 C 180 100, 195 60, 220 30" red delay={0.7} />
            <Box x={160} y={128} s={8} red delay={0.65} />
            <T x={120} y={22}>PLAN</T>
            <T x={96} y={110}>DRIFT</T>
            <T x={168} y={140} red>RESET</T>
          </>
        );
    }
  })();
  return (
    <svg viewBox="0 0 240 180" className="h-auto w-full" aria-hidden>
      {body}
    </svg>
  );
}

/**
 * Capabilities as an architect's drawing set: six sheets, each with what we
 * do, the deliverables, a schematic and a title block "issued for build".
 */
export function DrawingSet() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduce = useReducedMotion();
  const n = capabilityDetail.length;

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next = -1;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (i + 1) % n;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (i - 1 + n) % n;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next < 0) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section
      data-chapter="Capabilities"
      className="relative bg-asymmetri-red px-6 pt-24 pb-28 text-white md:px-16 md:pt-32 md:pb-36"
    >
      <SectionHead
        kicker="03 · Capabilities · Drawing set"
        title={["Six disciplines.", ["Issued for build."]]}
        body="Strategy, architecture and technical leadership from people who also build. Every sheet ends in something an engineering team can start on, not a slide that sits on a shelf."
        className="[&_.text-asymmetri-red]:text-black"
      />

      <div className="mt-14 grid gap-4 lg:mt-20 lg:grid-cols-[19rem_1fr] xl:grid-cols-[22rem_1fr]">
        <div role="tablist" aria-label="Capabilities" aria-orientation="vertical" className="grid grid-cols-2 gap-1.5 self-start lg:grid-cols-1">
          {capabilityDetail.map((c, i) => {
            const on = i === active;
            return (
              <button
                key={c.name}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                role="tab"
                id={`cap-tab-${i}`}
                aria-selected={on}
                aria-controls={`cap-sheet-${i}`}
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => onKey(e, i)}
                className={`group relative flex cursor-pointer items-start gap-3 overflow-hidden border px-3 py-3 text-left transition-colors duration-300 md:px-4 md:py-4 ${on ? "border-black bg-black text-white" : "border-white/40 text-white hover:border-white"}`}
              >
                <span className={`shrink-0 whitespace-nowrap pt-0.5 font-mono text-[10px] tracking-[0.2em] ${on ? "text-asymmetri-red" : "text-white/70"}`}>
                  A-{pad(i + 1)}
                </span>
                <span className="font-chakra-petch text-sm leading-tight font-bold uppercase md:text-lg">{c.name}</span>
                {on && <span className="absolute top-0 right-0 h-full w-1 bg-asymmetri-red" aria-hidden />}
              </button>
            );
          })}
        </div>

        <div className="relative">
          {capabilityDetail.map((c, i) => {
            const on = i === active;
            return (
              <div
                key={c.name}
                id={`cap-sheet-${i}`}
                role="tabpanel"
                aria-labelledby={`cap-tab-${i}`}
                hidden={!on}
                tabIndex={0}
              >
                <motion.article
                  key={on ? "on" : "off"}
                  initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
                  animate={{ clipPath: "inset(0 0% 0 0)" }}
                  transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                  className="relative overflow-hidden border border-black bg-[#0a0a0a] bg-[linear-gradient(to_right,#ffffff0d_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0d_1px,transparent_1px)] bg-[size:24px_24px]"
                >
                  {/* crop marks */}
                  {["top-2 left-2 border-t border-l", "top-2 right-2 border-t border-r", "bottom-2 left-2 border-b border-l", "bottom-2 right-2 border-b border-r"].map((c2) => (
                    <span key={c2} className={`absolute size-3 border-white/50 ${c2}`} aria-hidden />
                  ))}
                  <div className="grid gap-8 p-6 md:p-10 xl:grid-cols-[1.3fr_1fr]">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-asymmetri-red">
                        Sheet A-{pad(i + 1)} / {pad(n)}
                      </p>
                      <h3 className="mt-3 font-chakra-petch text-3xl leading-[0.95] font-bold uppercase md:text-5xl">
                        {c.name}
                      </h3>
                      <p className="mt-5 max-w-xl font-geist text-base leading-relaxed text-white/75 md:text-lg">{c.body}</p>
                      <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">Deliverables</p>
                      <ul className="mt-3 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
                        {c.deliverables.map((d, k) => (
                          <li key={d} className="flex gap-3 bg-[#0a0a0a] p-3 font-geist text-sm text-white/90">
                            <span className="mt-1.5 size-1.5 shrink-0 bg-asymmetri-red" aria-hidden />
                            <span>
                              <span className="mr-2 font-mono text-[10px] text-white/40">{pad(k + 1)}</span>
                              {d}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-col justify-between gap-6">
                      <div className="border border-white/15 bg-black/40 p-4">
                        <Schematic i={i} />
                      </div>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">You need this when</p>
                        <p className="mt-2 font-chakra-petch text-lg leading-snug font-semibold uppercase md:text-xl">
                          “{c.signal}”
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* title block */}
                  <dl className="grid grid-cols-2 border-t border-white/20 font-mono text-[9px] uppercase tracking-[0.2em] md:grid-cols-5 md:text-[10px]">
                    {[
                      ["Project", "Your hard problem"],
                      ["Discipline", "Consulting"],
                      ["Drawn", "Asymmetri"],
                      ["Scale", "NTS"],
                      ["Status", "Issued for build"],
                    ].map(([k, v], idx) => (
                      <div key={k} className={`border-white/20 px-4 py-3 ${idx < 4 ? "md:border-r" : ""} ${idx % 2 === 0 ? "max-md:border-r" : ""} ${idx < 4 ? "max-md:border-b" : ""} ${idx === 4 ? "max-md:col-span-2" : ""}`}>
                        <dt className="text-white/40">{k}</dt>
                        <dd className={idx === 4 ? "text-asymmetri-red" : "text-white"}>{v}</dd>
                      </div>
                    ))}
                  </dl>
                </motion.article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
