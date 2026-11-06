"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { motion, useInView, useMotionValue, useMotionValueEvent, useTransform } from "motion/react";
import { useReduceMotion as useReducedMotion } from "@/hooks/useReduceMotion";
import { voices, type Voice } from "@/lib/voices";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { MaskLines } from "@/components/practice/MaskLines";
import { ScrambleText } from "@/components/practice/ScrambleText";
import { Waveform, waveBars } from "@/components/home/closing/Waveform";
import s from "@/components/home/closing/ending.module.css";

/**
 * Client voices (lib/voices.ts). Renders nothing until real, approved quotes
 * are added there.
 */
export function Voices() {
  if (voices.length === 0) return null;
  return <VoicesStage items={voices} />;
}

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const pad = (n: number) => String(n).padStart(2, "0");
const clock = (sec: number) => `${pad(Math.floor(sec / 60))}:${pad(Math.floor(sec % 60))}`;

function quoteSize(q: string) {
  if (q.length < 110) return "text-3xl md:text-5xl xl:text-6xl";
  if (q.length < 220) return "text-2xl md:text-4xl xl:text-[2.75rem]";
  return "text-xl md:text-3xl";
}

/** The logo's double slash, used as the opening quotation mark. */
function QuoteMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 108 120" className={className} aria-hidden>
      <polygon className={s.strike} points="58.5,0 90,0 31.5,120 0,120" fill="#cd1717" />
      <polygon className={s.strike} points="98,0 108,0 49.5,120 39.5,120" fill="#cd1717" />
    </svg>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

/**
 * "Voices" as recordings: each quote gets a voice print generated from its
 * own words. The active print plays like a track (the playhead is the dwell
 * timer), the words resolve from blur as it starts, and the next track cuts
 * in when it ends. The black band is cut at the logo's slash angle top and
 * bottom, so the chapter reads as one stroke of the mark.
 */
function VoicesStage({ items }: { items: Voice[] }) {
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduce = !!useReducedMotion();
  const n = items.length;

  const [active, setActive] = useState(0);
  const [hold, setHold] = useState(false); // hover or focus inside the stage
  const [paused, setPaused] = useState(false); // explicit pause button
  const inView = useInView(stageRef, { margin: "-15% 0px -15% 0px" });

  const tracks = useMemo(
    () =>
      items.map((v) => {
        const words = v.quote.split(/\s+/).filter(Boolean);
        return {
          words,
          bars: waveBars(v.quote),
          mini: waveBars(v.quote, 64),
          // Roughly reading speed, with a floor and a ceiling.
          seconds: Math.min(Math.max(words.length * 0.36 + 2, 7), 16),
        };
      }),
    [items],
  );

  // Playhead 0..1 through the active track, advanced by a rAF clock that only
  // runs while the stage is on screen, the tab is visible and nobody is reading.
  const play = useMotionValue(reduce ? 1 : 0);
  useEffect(() => {
    if (reduce) play.set(1);
  }, [reduce, play]);
  const running = !reduce && inView && !hold && !paused && n > 1;
  const select = (i: number) => {
    play.set(reduce ? 1 : 0);
    setActive(((i % n) + n) % n);
  };

  useEffect(() => {
    if (!running) return;
    const duration = tracks[active].seconds * 1000;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100);
      last = now;
      const v = play.get() + dt / duration;
      if (v >= 1) {
        play.set(0);
        setActive((a) => (a + 1) % n);
        return;
      }
      play.set(v);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, active, tracks, play, n]);

  useMotionValueEvent(play, "change", (v) => {
    if (clockRef.current) clockRef.current.textContent = clock(v * tracks[active].seconds);
  });

  const playedClip = useTransform(play, (v) => `inset(0 ${(1 - v) * 100}% 0 0)`);
  const playheadX = useTransform(play, (v) => `${v * 100}%`);

  // Band edges at the slash angle: steep while arriving, flatter in place,
  // steep again on the way out.
  const p = useSectionProgress(ref, "pass");
  const clipPath = useTransform(p, (v) => {
    if (reduce) return "polygon(0 7vw, 100% 0, 100% calc(100% - 7vw), 0 100%)";
    const top = 12 - 7 * clamp01(v / 0.35);
    const bot = 5 + 4 * clamp01((v - 0.65) / 0.35);
    return `polygon(0 ${top}vw, 100% 0, 100% calc(100% - ${bot}vw), 0 100%)`;
  });

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? i + 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? i - 1
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? n - 1
              : null;
    if (next === null) return;
    e.preventDefault();
    const j = ((next % n) + n) % n;
    select(j);
    tabRefs.current[j]?.focus();
  };

  const current = tracks[active];

  return (
    <section
      ref={ref}
      data-chapter="Voices"
      data-nav="dark"
      aria-labelledby="voices-title"
      className="relative overflow-hidden bg-white"
    >
      <motion.div
        style={{ clipPath }}
        className="relative bg-black px-6 pt-[calc(11vw+5rem)] pb-[calc(9vw+2.5rem)] text-white md:px-16"
      >
        {/* hairline grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:calc(100%/6)_100%]"
        />

        <header className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.3em] text-asymmetri-red md:text-xs">
              <ScrambleText text="Voices" />
            </p>
            <h2
              id="voices-title"
              className="font-chakra-petch text-4xl leading-[0.92] font-bold uppercase md:text-6xl xl:text-7xl"
            >
              <MaskLines lines={["In their", <span key="w" className="text-asymmetri-red">words.</span>]} />
            </h2>
          </div>
          <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">
            <span aria-hidden>
              Track {pad(active + 1)} / {pad(n)}
            </span>
            {n > 1 && !reduce && (
              <button
                type="button"
                onClick={() => setPaused((v) => !v)}
                aria-pressed={paused}
                className="flex cursor-pointer items-center gap-2 border border-white/25 px-3 py-1.5 text-white transition-colors hover:border-asymmetri-red focus-visible:border-asymmetri-red focus-visible:outline-none"
              >
                <span
                  aria-hidden
                  className={`size-1.5 ${paused ? "bg-white/50" : "kit-blink bg-asymmetri-red"}`}
                />
                {paused ? "Play" : "Pause"}
              </button>
            )}
          </div>
        </header>

        <div
          ref={stageRef}
          onPointerEnter={() => setHold(true)}
          onPointerLeave={() => setHold(false)}
          onFocus={() => setHold(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setHold(false);
          }}
          className="relative mt-14 md:mt-20"
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,9rem)_minmax(0,1fr)] lg:gap-12">
            <QuoteMark key={active} className="h-14 w-auto md:h-24 lg:h-36" />

            {/* Every quote stays in the DOM; inactive ones are hidden, not removed. */}
            <div className="grid [grid-template-areas:'stack']">
              {items.map((v, i) => {
                const on = i === active;
                return (
                  <figure
                    key={`${v.name}-${i}`}
                    id={`voice-panel-${i}`}
                    role="tabpanel"
                    aria-labelledby={`voice-tab-${i}`}
                    className={`grid gap-10 [grid-area:stack] lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-end xl:gap-16 ${
                      on ? s.on : "invisible"
                    }`}
                  >
                    <blockquote
                      className={`font-chakra-petch leading-[1.06] font-semibold tracking-[-0.01em] text-white ${quoteSize(v.quote)}`}
                    >
                      <p>
                        {tracks[i].words.map((w, k) => (
                          <span key={k}>
                            <span className={s.word} style={{ ["--i" as string]: Math.min(k, 60) }}>
                              {w}
                            </span>{" "}
                          </span>
                        ))}
                        <span aria-hidden className={`${s.word} inline-block size-[0.32em] bg-asymmetri-red`} style={{ ["--i" as string]: Math.min(tracks[i].words.length, 60) }} />
                      </p>
                    </blockquote>
                    <figcaption
                      className={`flex items-center gap-4 border-t border-white/20 pt-5 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:flex-col lg:items-start ${
                        on ? "translate-y-0 opacity-100 delay-300" : "translate-y-3 opacity-0"
                      }`}
                    >
                      <span className="relative block size-16 shrink-0 overflow-hidden bg-white/10 md:size-20">
                        {v.image ? (
                          <Image
                            src={v.image}
                            alt={v.name}
                            fill
                            sizes="80px"
                            className="object-cover grayscale contrast-125"
                          />
                        ) : (
                          <span
                            aria-hidden
                            className="flex size-full items-center justify-center font-chakra-petch text-xl font-bold text-white/70"
                          >
                            {initials(v.name)}
                          </span>
                        )}
                        <span aria-hidden className="absolute right-0 bottom-0 size-2 bg-asymmetri-red" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-chakra-petch text-lg leading-tight font-bold uppercase">
                          {v.name}
                        </span>
                        <span className="mt-1 block font-geist text-sm text-white/60">{v.role}</span>
                        <span className="mt-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-asymmetri-red">
                          {v.company}
                        </span>
                        {v.caseStudy && (
                          <a
                            href={v.caseStudy}
                            className="mt-4 inline-flex items-center gap-2 border-b border-white/30 pb-0.5 font-chakra-petch text-sm font-semibold transition-colors hover:border-asymmetri-red hover:text-asymmetri-red"
                          >
                            Read the case study <span aria-hidden>↗</span>
                          </a>
                        )}
                      </span>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </div>

          {/* Voice print of the active quote, played left to right. */}
          <div className="mt-14 md:mt-20" aria-hidden>
            <div className="mb-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              <span>
                <span className="text-white">REC</span> {pad(active + 1)} · {items[active].company}
              </span>
              <span>
                <span ref={clockRef}>{clock(reduce ? current.seconds : 0)}</span> / {clock(current.seconds)}
              </span>
            </div>
            <div key={active} className="relative h-16 md:h-24">
              <Waveform bars={current.bars} className="absolute inset-0 size-full text-white/20" />
              <motion.div style={{ clipPath: playedClip }} className="absolute inset-0">
                <Waveform bars={current.bars} className="size-full text-asymmetri-red" />
              </motion.div>
              <motion.span
                style={{ left: playheadX }}
                className="absolute -top-2 -bottom-2 w-px bg-white"
              >
                <span className="absolute -top-1 -left-[3px] size-[7px] bg-white" />
              </motion.span>
              <span className="absolute inset-x-0 top-[64%] h-px bg-white/15" />
            </div>
          </div>

          {n > 1 && (
            <div
              role="tablist"
              aria-label="Client voices"
              style={{ ["--cols" as string]: Math.min(n, 4) }}
              className="mt-10 grid grid-cols-2 border-t border-l border-white/15 md:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]"
            >
              {items.map((v, i) => {
                const on = i === active;
                return (
                  <button
                    key={`${v.name}-tab-${i}`}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    id={`voice-tab-${i}`}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    aria-controls={`voice-panel-${i}`}
                    tabIndex={on ? 0 : -1}
                    onClick={() => select(i)}
                    onKeyDown={(e) => onTabKey(e, i)}
                    className={`group relative flex cursor-pointer flex-col gap-3 border-r border-b border-white/15 p-4 text-left transition-colors duration-300 focus-visible:outline-none md:p-5 ${
                      on ? "bg-white/[0.06]" : "hover:bg-white/[0.04] focus-visible:bg-white/[0.04]"
                    }`}
                  >
                    <span className="flex items-baseline justify-between gap-3">
                      <span className={`font-mono text-[10px] tracking-[0.25em] ${on ? "text-asymmetri-red" : "text-white/40"}`}>
                        {pad(i + 1)}
                      </span>
                      <span
                        aria-hidden
                        className={`size-1.5 transition-colors ${on ? "bg-asymmetri-red" : "bg-white/20 group-hover:bg-white/60"}`}
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-chakra-petch text-sm font-bold uppercase md:text-base">
                        {v.company}
                      </span>
                      <span className="block truncate font-geist text-xs text-white/50">{v.name}</span>
                    </span>
                    <Waveform
                      bars={tracks[i].mini}
                      className={`h-6 w-full transition-colors duration-300 ${on ? "text-asymmetri-red" : "text-white/20 group-hover:text-white/45"}`}
                    />
                    {on && (
                      <motion.span
                        aria-hidden
                        style={{ scaleX: play }}
                        className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-asymmetri-red"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
