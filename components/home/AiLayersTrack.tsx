"use client";

import { forwardRef, useEffect, useRef } from "react";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import {
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "motion/react";
import type { AiLayer } from "@/lib/site-content";

const pad = (n: number) => String(n).padStart(2, "0");
const START = 0.05;
const SPAN = 0.88;

function activeIndex(v: number, n: number) {
  const t = Math.min(Math.max((v - START) / SPAN, 0), 1);
  return Math.round(t * (n - 1));
}

function LayerPanel({
  layer,
  i,
  n,
  p,
}: {
  layer: AiLayer;
  i: number;
  n: number;
  p: MotionValue<number>;
}) {
  const active = useTransform(p, (v) => activeIndex(v, n) === i);
  const background = useTransform(active, (a) => (a ? "#cd1717" : "#111111"));
  const borderColor = useTransform(active, (a) =>
    a ? "#cd1717" : "rgba(255,255,255,0.15)",
  );
  const numberStroke = useTransform(active, (a) =>
    a ? "1px rgba(255,255,255,0.9)" : "1px rgba(255,255,255,0.35)",
  );
  const muted = useTransform(active, (a) =>
    a ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.55)",
  );

  return (
    <motion.article
      style={{ background, borderColor }}
      className="flex h-[58vh] w-[84vw] shrink-0 flex-col justify-between border p-6 transition-colors duration-500 md:w-[58vw] md:p-10 lg:w-[44vw]"
    >
      <div className="flex items-start justify-between gap-4">
        <motion.span
          style={{ WebkitTextStroke: numberStroke }}
          className="text-7xl leading-none font-bold text-transparent md:text-9xl"
          aria-hidden
        >
          {pad(layer.n)}
        </motion.span>
        <motion.span
          style={{ color: muted }}
          className="max-w-[12rem] text-right font-mono text-[10px] uppercase tracking-[0.2em] md:text-xs"
        >
          Layer {pad(layer.n)} / 10
          <br />
          {layer.discipline}
        </motion.span>
      </div>

      <div className="space-y-3">
        <h3 className="text-4xl font-bold uppercase md:text-6xl">
          {layer.name}
        </h3>
        <p className="max-w-xl text-lg leading-snug md:text-2xl">
          {layer.headline}
        </p>
        <motion.p style={{ color: muted }} className="max-w-xl text-sm md:text-base">
          {layer.summary}
        </motion.p>
      </div>

      <div className="space-y-4">
        <ul className="flex flex-wrap gap-1.5">
          {layer.capabilities.map((c) => (
            <li
              key={c}
              className="border border-white/25 px-2 py-1 font-geist text-[11px] md:text-xs"
            >
              {c}
            </li>
          ))}
        </ul>
        <motion.p
          style={{ color: muted }}
          className="font-mono text-[10px] uppercase tracking-[0.18em] md:text-[11px]"
        >
          {layer.logic.join(" → ")}
        </motion.p>
        <p className="sr-only">
          Representative stack: {layer.stack.join(", ")}.
        </p>
      </div>
    </motion.article>
  );
}

function RailSegment({
  name,
  i,
  n,
  p,
}: {
  name: string;
  i: number;
  n: number;
  p: MotionValue<number>;
}) {
  const lit = useTransform(p, (v) => (activeIndex(v, n) >= i ? 1 : 0));
  const current = useTransform(p, (v) =>
    activeIndex(v, n) === i ? "#ffffff" : "rgba(255,255,255,0.4)",
  );
  return (
    <li className="flex-1">
      <div className="relative h-[3px] bg-white/15">
        <motion.div
          style={{ scaleX: lit }}
          className="absolute inset-0 origin-left bg-asymmetri-red transition-transform duration-500"
        />
      </div>
      <motion.span
        style={{ color: current }}
        className="mt-2 hidden font-mono text-[10px] uppercase tracking-[0.15em] lg:block"
      >
        {name}
      </motion.span>
    </li>
  );
}

/**
 * The ten layers of the Asymmetri AI system as a pinned horizontal track.
 * The layer in focus turns red; the rail underneath fills as you travel the loop.
 */
export const AiLayersTrack = forwardRef<HTMLElement, { layers: AiLayer[] }>(
  function AiLayersTrack({ layers }, outerRef) {
    const ref = useRef<HTMLElement | null>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const p = useSectionProgress(ref);

    const distance = useMotionValue(0);
    useEffect(() => {
      const measure = () => {
        const t = trackRef.current;
        if (t) distance.set(Math.max(t.scrollWidth - window.innerWidth, 0));
      };
      measure();
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }, [distance]);

    const x = useTransform([p, distance], ([v, d]: number[]) => {
      const t = Math.min(Math.max((v - START) / SPAN, 0), 1);
      return -t * d;
    });
    const counter = useTransform(p, (v) => pad(activeIndex(v, layers.length) + 1));
    const headerY = useTransform(p, [0, 0.05], [40, 0]);

    return (
      <section
        ref={(el) => {
          ref.current = el;
          if (typeof outerRef === "function") outerRef(el);
          else if (outerRef) outerRef.current = el;
        }}
        id="ai-system"
        aria-labelledby="ai-system-title"
        className="relative h-[560vh] bg-[#0a0a0a] font-chakra-petch text-white"
      >
        <div className="heroDark sticky top-0 flex h-screen flex-col justify-between overflow-hidden bg-[#0a0a0a] pt-20 pb-8">
          <motion.header
            style={{ y: headerY }}
            className="flex items-end justify-between gap-6 px-6 md:px-16"
          >
            <div className="space-y-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-asymmetri-red md:text-xs">
                What we build · 01 · The Asymmetri AI system
              </p>
              <h2
                id="ai-system-title"
                className="max-w-3xl text-2xl font-bold uppercase leading-none md:text-5xl"
              >
                Systems that think, decide and{" "}
                <span className="text-asymmetri-red">move work forward.</span>
              </h2>
              <p className="hidden font-geist text-sm text-white/55 md:block">
                Ten layers. One connected path from idea to operating leverage.
              </p>
            </div>
            <div className="shrink-0 text-right">
              <motion.span className="block text-5xl leading-none font-bold md:text-8xl">
                {counter}
              </motion.span>
              <span className="font-mono text-xs text-white/40">/ 10</span>
            </div>
          </motion.header>

          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex w-max gap-4 px-6 md:gap-6 md:px-16"
          >
            {layers.map((layer, i) => (
              <LayerPanel
                key={layer.n}
                layer={layer}
                i={i}
                n={layers.length}
                p={p}
              />
            ))}
          </motion.div>

          <div className="flex items-end gap-6 px-6 md:px-16">
            <p className="hidden shrink-0 text-sm font-semibold md:block">
              Every layer strengthens the next.
            </p>
            <ol className="flex flex-1 gap-1.5" aria-label="The ten layers">
              {layers.map((l, i) => (
                <RailSegment
                  key={l.n}
                  name={l.name}
                  i={i}
                  n={layers.length}
                  p={p}
                />
              ))}
            </ol>
          </div>
        </div>
      </section>
    );
  },
);
