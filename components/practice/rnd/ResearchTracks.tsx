"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useTransform } from "motion/react";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { SectionHead } from "@/components/practice/SectionHead";
import { tracks, type Track } from "./content";
import { AiInstruments } from "./AiInstruments";
import { MrRoom } from "./MrRoom";
import { clamp01, useIsDesktop } from "./hooks";

function Questions({
  track,
  active,
  focus,
  dark,
}: {
  track: Track;
  active: number;
  focus: boolean;
  dark: boolean;
}) {
  const muted = dark ? "text-white/55" : "text-black/55";
  const line = dark ? "border-white/15" : "border-black/15";
  return (
    <div className="flex flex-col">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-asymmetri-red">
        {track.index} · Open questions
      </p>
      <h3 className="font-chakra-petch text-4xl leading-[0.9] font-bold uppercase md:text-5xl xl:text-6xl">
        {track.name}
      </h3>
      <p className={`mt-4 max-w-sm font-geist text-sm leading-relaxed md:text-base ${muted}`}>
        {track.body}
      </p>
      <ol className={`mt-6 border-t ${line}`}>
        {track.questions.map((q, i) => {
          const on = focus && i === active;
          return (
            <li
              key={q.topic}
              className={`grid grid-cols-[1.75rem_1fr] gap-x-2 border-b py-2.5 transition-opacity duration-500 xl:py-3 ${line} ${
                focus ? (on ? "opacity-100" : "opacity-45") : "opacity-100"
              }`}
            >
              <span className="pt-0.5 font-mono text-[10px] text-asymmetri-red">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="flex items-center gap-2 font-chakra-petch text-sm font-semibold uppercase md:text-base">
                  {q.topic}
                  {on && <span className="inline-block size-1.5 bg-asymmetri-red" aria-hidden />}
                </span>
                <span className={`mt-0.5 block font-geist text-[13px] leading-snug ${muted}`}>{q.q}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/**
 * Two research tracks share one pinned bench. A red divider slides across it:
 * Track A (AI and ML systems, dark) owns the bench first, then the divider
 * sweeps and Track B (mixed reality, light) takes over. Each open question
 * lights its own instrument as you scroll.
 */
export function ResearchTracks() {
  const ref = useRef<HTMLDivElement>(null);
  const p = useSectionProgress(ref);
  const isDesktop = useIsDesktop();
  const [ai, mr] = tracks;

  const divider = useTransform(p, [0.42, 0.58], [64, 36]);
  const aiClip = useTransform(divider, (d) => `inset(0 ${100 - d}% 0 0)`);
  const mrClip = useTransform(divider, (d) => `inset(0 0 0 ${d}%)`);
  const left = useTransform(divider, (d) => `${d}%`);

  const [state, setState] = useState({ phase: 0, ai: 0, mr: 0 });
  useMotionValueEvent(p, "change", (v) => {
    const next = {
      phase: v < 0.5 ? 0 : 1,
      ai: Math.min(3, Math.floor(clamp01((v - 0.02) / 0.38) * 4)),
      mr: Math.min(3, Math.floor(clamp01((v - 0.6) / 0.36) * 4)),
    };
    setState((s) => (next.phase === s.phase && next.ai === s.ai && next.mr === s.mr ? s : next));
  });

  return (
    <section data-chapter="Research tracks" aria-labelledby="rnd-tracks" className="bg-white text-black">
      <div id="rnd-tracks" className="px-6 pt-28 pb-16 md:px-16 md:pt-36">
        <SectionHead
          tone="light"
          kicker="Frontier R&D · Two tracks"
          title={["Two tracks.", ["One test:"], "does it hold up?"]}
          body="We research where the next decade of products will be decided: in the systems behind AI, and in the spaces where people meet it. Each track runs on open questions, not roadmaps."
        />
      </div>

      <div ref={ref} className="relative lg:h-[340vh]">
        <div className="lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden">
          {/* Track A */}
          <motion.div
            style={{ ["--clip" as string]: aiClip }}
            className="heroDark relative bg-[#0a0a0a] text-white lg:absolute lg:inset-0 lg:[clip-path:var(--clip)]"
          >
            <div className="grid h-full gap-10 px-6 py-20 md:px-16 lg:w-[64%] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:items-center lg:gap-8 lg:py-0 lg:pt-14 lg:pr-10">
              <Questions track={ai} active={state.ai} focus={isDesktop && state.phase === 0} dark />
              <AiInstruments active={isDesktop ? (state.phase === 0 ? state.ai : -1) : state.ai} />
            </div>
          </motion.div>

          {/* Track B */}
          <motion.div
            style={{ ["--clip" as string]: mrClip }}
            className="relative bg-white text-black lg:absolute lg:inset-0 lg:[clip-path:var(--clip)]"
          >
            <div className="grid h-full gap-6 px-6 py-20 md:px-16 lg:ml-[36%] lg:w-[64%] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-center lg:gap-8 lg:py-0 lg:pt-14 lg:pl-10">
              <div className="order-2 lg:order-1 lg:h-[72vh]">
                <MrRoom p={p} active={isDesktop ? (state.phase === 1 ? state.mr : -1) : 0} />
              </div>
              <div className="order-1 lg:order-2">
                <Questions track={mr} active={state.mr} focus={isDesktop && state.phase === 1} dark={false} />
              </div>
            </div>
          </motion.div>

          {/* Divider */}
          <motion.div
            style={{ left }}
            className="pointer-events-none absolute inset-y-0 z-10 hidden w-px bg-asymmetri-red lg:block"
            aria-hidden
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-asymmetri-red px-2 py-3 font-mono text-[9px] uppercase tracking-[0.3em] text-white [writing-mode:vertical-rl]">
              {state.phase === 0 ? "Focus · Track A" : "Focus · Track B"}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
