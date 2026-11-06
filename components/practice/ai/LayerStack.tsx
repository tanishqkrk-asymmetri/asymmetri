"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion } from "motion/react";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { SectionHead } from "@/components/practice/SectionHead";
import { ScrambleText } from "@/components/practice/ScrambleText";
import type { AiLayer } from "@/lib/site-content";
import styles from "./ai.module.css";

const pad = (n: number) => String(n).padStart(2, "0");
const N = 10;
const START = 0.02;
const SPAN = 0.96;
// Slab geometry in vh so the stack scales with the viewport height.
const FACE = 27;
const GAP = 4.3;
const THICK = 1.3;

function stepFrom(v: number, steps: number) {
  const t = Math.min(Math.max((v - START) / SPAN, 0), 0.9999);
  const f = t * N;
  const active = Math.floor(f);
  const sub = f - active;
  // The logic chain completes in the first 75% of each layer's scroll.
  const lit = Math.min(steps, Math.floor((sub / 0.75) * steps) + 1);
  return { active, lit };
}

/** Logic chain: steps light up in order with a red fill between them. */
function Chain({ steps, lit, tone = "light" }: { steps: string[]; lit: number; tone?: "light" | "dark" }) {
  const off = tone === "light" ? "border-black/20 text-black/45" : "border-white/25 text-white/50";
  return (
    <ol className="flex flex-wrap items-center gap-y-2" aria-label="Logic chain">
      {steps.map((s, i) => {
        const on = i < lit;
        const current = i === lit - 1;
        return (
          <li key={s} className="flex items-center">
            <span
              className={`relative border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors duration-300 md:text-[11px] ${on ? "border-asymmetri-red bg-asymmetri-red text-white" : off}`}
            >
              {current && (
                <span className="kit-blink absolute -top-1 -right-1 size-2 bg-black" aria-hidden />
              )}
              {s}
            </span>
            {i < steps.length - 1 && (
              <span className="relative mx-1.5 h-px w-5 bg-current opacity-30 md:w-8" aria-hidden>
                <span
                  className={`absolute inset-0 origin-left bg-asymmetri-red transition-transform duration-500 ${i < lit - 1 ? "scale-x-100" : "scale-x-0"}`}
                />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Slab({ layer, i, active }: { layer: AiLayer; i: number; active: number }) {
  const placed = i <= active;
  const isActive = i === active;
  const z = (N - 1 - i) * GAP;
  const top = isActive ? "#cd1717" : "#0b0b0b";
  const sideA = isActive ? "#a31212" : "#000000";
  const sideB = isActive ? "#7d0d0d" : "#1c1c1c";
  return (
    <>
      {/* Ghost slot, always in place */}
      <div
        className="absolute inset-0 border border-dashed border-black/25"
        style={{ transform: `translate3d(0,0,${z}vh)` }}
      />
      <div
        className="absolute inset-0 transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d]"
        style={{
          opacity: placed ? 1 : 0,
          transform: placed
            ? `translate3d(${isActive ? 3.2 : 0}vh, ${isActive ? 3.2 : 0}vh, ${z}vh)`
            : `translate3d(-26vh, -26vh, ${z + 6}vh)`,
        }}
      >
        <div
          className="absolute inset-0 flex flex-col justify-between overflow-hidden border p-[1.6vh] transition-colors duration-500"
          style={{
            backgroundColor: top,
            borderColor: isActive ? "#ff4d4d" : "rgba(255,255,255,0.22)",
            backgroundImage: isActive
              ? "none"
              : "linear-gradient(to right,#ffffff0d 1px,transparent 1px),linear-gradient(to bottom,#ffffff0d 1px,transparent 1px)",
            backgroundSize: "2.5vh 2.5vh",
          }}
        >
          <span className="font-mono text-[1.25vh] uppercase tracking-[0.2em] text-white/70">
            L{pad(layer.n)} · {layer.discipline}
          </span>
          <span className="font-chakra-petch text-[3.6vh] leading-none font-bold text-white uppercase">
            {layer.name}
          </span>
        </div>
        <div
          className="absolute top-full left-0 w-full origin-top transition-colors duration-500"
          style={{ height: `${THICK}vh`, background: sideA, transform: "rotateX(-90deg)" }}
        />
        <div
          className="absolute top-0 left-full h-full origin-left transition-colors duration-500"
          style={{ width: `${THICK}vh`, background: sideB, transform: "rotateY(90deg)" }}
        />
      </div>
    </>
  );
}

function Panel({ layer, on, lit }: { layer: AiLayer; on: boolean; lit: number }) {
  return (
    <article
      className={`[grid-area:1/1] transition-[opacity,transform,filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${on ? "opacity-100" : "pointer-events-none translate-y-6 opacity-0 blur-sm"}`}
      aria-hidden={!on || undefined}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-black/50 md:text-xs">
        Layer {pad(layer.n)} / 10 <span className="text-asymmetri-red">·</span> {layer.discipline}
      </p>
      <h3 className="mt-3 font-chakra-petch text-6xl leading-[0.9] font-bold uppercase xl:text-8xl">
        <ScrambleText text={layer.name} trigger="none" replayKey={on ? layer.n : 0} duration={0.6} />
      </h3>
      <p className="mt-5 max-w-xl font-chakra-petch text-2xl leading-tight font-semibold xl:text-3xl">
        {layer.headline}
      </p>
      <p className="mt-3 max-w-lg font-geist text-base leading-relaxed text-black/60">{layer.summary}</p>
      <ul className="mt-6 flex max-w-xl flex-wrap gap-1.5">
        {layer.capabilities.map((c, k) => (
          <li
            key={c}
            className={`border border-black/25 px-2 py-1 font-geist text-xs ${on ? styles.chipIn : ""}`}
            style={{ animationDelay: `${120 + k * 50}ms` }}
          >
            {c}
          </li>
        ))}
      </ul>
      <div className="mt-7">
        <Chain steps={layer.logic} lit={on ? lit : 0} />
      </div>
      <p className="mt-6 max-w-xl font-mono text-[10px] leading-relaxed uppercase tracking-[0.18em] text-black/45">
        <span className="text-black/70">Representative stack</span> · {layer.stack.join(" · ")}
      </p>
    </article>
  );
}

/**
 * The ten layers of the Asymmetri AI system as an isometric stack that
 * assembles while you scroll. Each layer slides into its slot, pulls out
 * in red while it is in focus, and runs its logic chain.
 */
export function LayerStack({ layers }: { layers: AiLayer[] }) {
  const pinRef = useRef<HTMLDivElement>(null);
  const p = useSectionProgress(pinRef);
  const reduce = useReducedMotion();
  const steps = layers.map((l) => l.logic.length);
  const [{ active, lit }, setStep] = useState({ active: 0, lit: 1 });

  useMotionValueEvent(p, "change", (v) => {
    const s = stepFrom(v, 1);
    const next = stepFrom(v, steps[s.active]);
    setStep((cur) => (cur.active === next.active && cur.lit === next.lit ? cur : next));
  });

  const jump = (i: number) => {
    const el = pinRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    const v = START + ((i + 0.4) / N) * SPAN;
    window.scrollTo({ top: top + v * travel, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section
      data-chapter="Ten layers"
      className="relative bg-white text-black"
    >
      <div className="px-6 pt-28 pb-14 md:px-16 md:pt-36">
        <SectionHead
          tone="light"
          kicker="01 · The Asymmetri AI system"
          title={["Ten layers.", ["One loop."]]}
          body="AI that does real work is a system, not a model. We engineer every layer of it, and every layer strengthens the next: from the interface people trust down to the economics that let it scale."
        />
      </div>

      {/* Desktop: pinned assembling stack */}
      <div ref={pinRef} className="relative hidden h-[620vh] lg:block">
        <div className="sticky top-0 flex h-screen flex-col overflow-hidden pt-20 pb-16">
          <div className="flex items-center justify-between px-16 font-mono text-[11px] uppercase tracking-[0.25em] text-black/50">
            <span>
              <span className="kit-blink mr-2 inline-block size-1.5 bg-asymmetri-red align-middle" />
              Assembling the system
            </span>
            <span className="font-chakra-petch text-5xl leading-none font-bold tracking-normal text-black">
              {pad(active + 1)}
              <span className="ml-1 font-mono text-xs text-black/40">/ 10</span>
            </span>
          </div>

          <div className="grid flex-1 grid-cols-[1fr_1.05fr] items-center gap-10 px-16">
            {/* Isometric stack */}
            <div className="relative flex h-full items-center justify-center" aria-hidden>
              <div
                className="relative [transform-style:preserve-3d]"
                style={{
                  width: `${FACE}vh`,
                  height: `${FACE}vh`,
                  transform: `translateY(${(N * GAP) / 2.4}vh) rotateX(58deg) rotateZ(45deg)`,
                }}
              >
                {/* Floor shadow */}
                <div className="absolute -inset-[12%] bg-[radial-gradient(closest-side,rgba(0,0,0,0.16),transparent)]" />
                {layers.map((l, i) => (
                  <Slab key={l.n} layer={l} i={i} active={active} />
                )).reverse()}
              </div>
            </div>

            <div className="grid">
              {layers.map((l, i) => (
                <Panel key={l.n} layer={l} on={i === active} lit={lit} />
              ))}
            </div>
          </div>

          <ol className="flex gap-1.5 px-16" aria-label="Jump to a layer">
            {layers.map((l, i) => (
              <li key={l.n} className="flex-1">
                <button
                  type="button"
                  onClick={() => jump(i)}
                  aria-current={i === active ? "step" : undefined}
                  className="group block w-full cursor-pointer pt-2 text-left focus-visible:outline-2 focus-visible:outline-asymmetri-red"
                >
                  <span className="relative block h-[3px] bg-black/10">
                    <span
                      className={`absolute inset-0 origin-left bg-asymmetri-red transition-transform duration-500 ${i <= active ? "scale-x-100" : "scale-x-0"}`}
                    />
                  </span>
                  <span
                    className={`mt-2 block font-mono text-[10px] uppercase tracking-[0.15em] transition-colors group-hover:text-black ${i === active ? "text-black" : "text-black/40"}`}
                  >
                    {pad(l.n)} {l.name}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Mobile and tablet: a vertical run through the layers */}
      <ol className="px-6 pb-24 md:px-16 lg:hidden">
        {layers.map((l) => (
          <li key={l.n} className="border-t border-black/15 py-10">
            <motion.article
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="kit-outline-dark font-chakra-petch text-7xl leading-none font-bold" aria-hidden>
                  {pad(l.n)}
                </span>
                <span className="max-w-[11rem] pt-2 text-right font-mono text-[10px] uppercase tracking-[0.2em] text-black/50">
                  {l.discipline}
                </span>
              </div>
              <h3 className="mt-4 font-chakra-petch text-4xl font-bold uppercase">{l.name}</h3>
              <p className="mt-2 font-chakra-petch text-xl leading-snug font-semibold">{l.headline}</p>
              <p className="mt-2 font-geist text-sm leading-relaxed text-black/60">{l.summary}</p>
              <ul className="mt-5 flex flex-wrap gap-1.5">
                {l.capabilities.map((c) => (
                  <li key={c} className="border border-black/25 px-2 py-1 font-geist text-[11px]">
                    {c}
                  </li>
                ))}
              </ul>
              <div className="mt-5">
                <Chain steps={l.logic} lit={l.logic.length} />
              </div>
              <p className="mt-5 font-mono text-[10px] leading-relaxed uppercase tracking-[0.18em] text-black/45">
                Representative stack · {l.stack.join(" · ")}
              </p>
            </motion.article>
          </li>
        ))}
      </ol>
    </section>
  );
}
