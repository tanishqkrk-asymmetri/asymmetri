"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMotionValueEvent } from "motion/react";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { MaskLines } from "@/components/practice/MaskLines";
import { ScrambleText } from "@/components/practice/ScrambleText";
import { specimenFates as FATES, stations } from "./content";
import { clamp01 } from "./hooks";

const N = FATES.length;
const CELL = 16;
const GAP = 8;
const COLS = 6;

// Rank of each specimen among those still alive at station k.
const rankAt = (k: number, i: number) => {
  let r = 0;
  for (let j = 0; j < i; j++) if (FATES[j] >= k) r++;
  return r;
};
const DEAD_ORDER = FATES.map((f, i) => ({ f, i }))
  .filter((x) => x.f < 5)
  .sort((a, b) => a.f - b.f || a.i - b.i)
  .map((x) => x.i);
const deadIndex = (i: number) => DEAD_ORDER.indexOf(i);
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Geo = { cx: number[]; chamberTop: number; chamberH: number; binX: number; binY: number };

/**
 * "Most ideas should die cheaply." An illustrative population of sixteen
 * experiments travels through five lab stations as you scroll. At each one
 * the scan runs, the failures flash red and drop into the discard tray, and
 * the survivors move on. Two make it to production.
 */
export function SpecimenPipeline() {
  const ref = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const bin = useRef<HTMLDivElement>(null);
  const chambers = useRef<(HTMLDivElement | null)[]>([]);
  const dots = useRef<(HTMLSpanElement | null)[]>([]);
  const scan = useRef<HTMLSpanElement>(null);
  const geo = useRef<Geo | null>(null);
  const p = useSectionProgress(ref);
  const [hud, setHud] = useState({ station: 0, alive: N, dead: 0, shipped: false });

  const measure = useCallback(() => {
    const r = rail.current;
    const b = bin.current;
    if (!r || !b) return;
    const cx = chambers.current.map((c) => (c ? c.offsetLeft + c.offsetWidth / 2 : 0));
    const c0 = chambers.current[0];
    geo.current = {
      cx,
      chamberTop: c0 ? c0.offsetTop + 8 : 8,
      chamberH: c0 ? c0.offsetHeight - 8 : 100,
      binX: b.offsetLeft + 110,
      binY: b.offsetTop + (b.offsetHeight - CELL) / 2,
    };
  }, []);

  const render = useCallback((v: number) => {
    const g = geo.current;
    if (!g) return;
    const s = clamp01((v - 0.04) / 0.86) * 5;
    const k = Math.min(4, Math.floor(s));
    const t = s >= 5 ? 1 : s - k;

    const slot = (station: number, i: number) => {
      const r = rankAt(station, i);
      const count = FATES.filter((f) => f >= station).length;
      const cols = Math.min(COLS, count);
      const rows = Math.ceil(count / COLS);
      const w = cols * CELL + (cols - 1) * GAP;
      const h = rows * CELL + (rows - 1) * GAP;
      return {
        x: g.cx[station] - w / 2 + (r % COLS) * (CELL + GAP),
        y: g.chamberTop + (g.chamberH - h) / 2 + Math.floor(r / COLS) * (CELL + GAP),
      };
    };
    const binSlot = (i: number) => ({ x: g.binX + deadIndex(i) * (CELL + 8), y: g.binY });

    let alive = 0;
    for (let i = 0; i < N; i++) {
      const el = dots.current[i];
      if (!el) continue;
      const f = FATES[i];
      let x = 0;
      let y = 0;
      let state = "alive";
      let scale = 1;
      if (f < k) {
        ({ x, y } = binSlot(i));
        state = "dead";
      } else if (f === k) {
        const a = slot(k, i);
        const d = binSlot(i);
        if (t < 0.5) {
          ({ x, y } = a);
          state = t > 0.38 ? "fail" : "alive";
        } else if (t < 0.76) {
          const u = (t - 0.5) / 0.26;
          x = lerp(a.x, d.x, ease(u));
          y = lerp(a.y, d.y, u * u);
          state = "fail";
        } else {
          ({ x, y } = d);
          state = "dead";
        }
      } else if (k === 4) {
        ({ x, y } = slot(4, i));
        if (t > 0.5) {
          state = "ship";
          scale = 1 + Math.min((t - 0.5) / 0.2, 1) * 0.5;
        }
      } else {
        const a = slot(k, i);
        if (t < 0.72) ({ x, y } = a);
        else {
          const b = slot(k + 1, i);
          const u = ease((t - 0.72) / 0.28);
          x = lerp(a.x, b.x, u);
          y = lerp(a.y, b.y, u) - Math.sin(u * Math.PI) * 26;
        }
      }
      if (state !== "dead" && !(state === "fail" && t >= 0.5)) alive++;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale})`;
      if (el.dataset.state !== state) el.dataset.state = state;
    }

    if (scan.current) {
      const on = t < 0.45 && k <= 4;
      const c = chambers.current[k];
      scan.current.style.opacity = on ? "1" : "0";
      if (c) {
        scan.current.style.width = `${c.offsetWidth}px`;
        scan.current.style.transform = `translate3d(${c.offsetLeft}px, ${c.offsetTop + (t / 0.45) * c.offsetHeight}px, 0)`;
      }
    }

    const dead = N - alive;
    const shipped = k === 4 && t > 0.5;
    setHud((h) =>
      h.station === k && h.alive === alive && h.dead === dead && h.shipped === shipped
        ? h
        : { station: k, alive, dead, shipped },
    );
  }, []);

  useEffect(() => {
    measure();
    render(p.get());
    const ro = new ResizeObserver(() => {
      measure();
      render(p.get());
    });
    if (rail.current) ro.observe(rail.current);
    return () => ro.disconnect();
  }, [measure, render, p]);

  useMotionValueEvent(p, "change", render);

  return (
    <section
      data-chapter="Experiment pipeline"
      aria-labelledby="rnd-pipeline"
      className="relative bg-black text-white"
    >
      <div ref={ref} className="relative lg:h-[440vh]">
        <div className="heroDark flex flex-col bg-black px-6 py-24 md:px-16 lg:sticky lg:top-0 lg:h-screen lg:justify-center lg:py-0 lg:pt-16">
          <header className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-asymmetri-red md:text-xs">
                <ScrambleText text="How an idea earns production" />
              </p>
              <h2 id="rnd-pipeline" className="font-chakra-petch text-4xl leading-[0.92] font-bold uppercase md:text-5xl xl:text-6xl">
                <MaskLines lines={["Most ideas should", <span key="d" className="text-asymmetri-red">die cheaply.</span>]} />
              </h2>
            </div>
            <div className="space-y-4">
              <p className="max-w-md font-geist text-sm leading-relaxed text-white/65 md:text-base">
                Every experiment passes five stations, each with criteria agreed before it starts. Failing early
                is the point: it costs days, not budgets, and the survivors arrive in production with evidence.
              </p>
              <div className="hidden gap-6 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 lg:flex" aria-hidden>
                <span>
                  In <b className="ml-1 text-white tabular-nums">{String(N).padStart(2, "0")}</b>
                </span>
                <span>
                  Alive <b className="ml-1 text-white tabular-nums">{String(hud.alive).padStart(2, "0")}</b>
                </span>
                <span>
                  Discarded <b className="ml-1 text-asymmetri-red tabular-nums">{String(hud.dead).padStart(2, "0")}</b>
                </span>
                <span className="text-white/35">Illustrative</span>
              </div>
            </div>
          </header>

          <div ref={rail} className="relative mt-12 lg:mt-10">
            <ol className="grid gap-8 lg:grid-cols-5 lg:gap-4">
              {stations.map((st, k) => {
                const on = hud.station === k;
                const entering = FATES.map((f, i) => ({ f, i })).filter((x) => x.f >= k);
                return (
                  <li key={st.name} className="flex flex-col">
                    <div
                      ref={(el) => {
                        chambers.current[k] = el;
                      }}
                      className={`relative flex min-h-[64px] items-center border p-3 transition-colors duration-500 lg:h-[clamp(96px,15vh,128px)] ${
                        on ? "lg:border-asymmetri-red" : "lg:border-white/15"
                      } border-white/15`}
                    >
                      <span className="absolute top-2 left-2 font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
                        St.{String(k + 1).padStart(2, "0")}
                      </span>
                      {k === 4 && (
                        <span
                          className={`absolute right-2 bottom-2 font-mono text-[9px] uppercase tracking-[0.2em] transition-opacity duration-500 lg:opacity-0 ${
                            hud.shipped ? "text-asymmetri-red lg:opacity-100" : ""
                          }`}
                        >
                          ● In production
                        </span>
                      )}
                      {/* Mobile: a static census of this station */}
                      <span className="flex flex-wrap gap-1.5 pt-4 lg:hidden" aria-hidden>
                        {entering.map(({ f, i }) => (
                          <span
                            key={i}
                            className={`flex size-3.5 items-center justify-center text-[8px] leading-none ${
                              f === k ? "border border-asymmetri-red text-asymmetri-red" : f === 5 && k === 4 ? "bg-asymmetri-red" : "bg-white"
                            }`}
                          >
                            {f === k ? "✕" : ""}
                          </span>
                        ))}
                      </span>
                    </div>
                    <div className="mt-4 space-y-2">
                      <h3 className="flex items-baseline gap-3 font-chakra-petch text-2xl font-bold uppercase xl:text-3xl">
                        <span className="font-mono text-[10px] text-asymmetri-red">{String(k + 1).padStart(2, "0")}</span>
                        <span className={on ? "text-white" : "lg:text-white/60"}>{st.name}</span>
                      </h3>
                      <p className="font-geist text-sm text-white/75">{st.line}</p>
                      <ul className="space-y-1 font-geist text-[13px] leading-snug text-white/55">
                        {st.pass.map((c) => (
                          <li key={c} className="flex gap-2">
                            <span className="mt-[5px] inline-block size-1.5 shrink-0 border border-white/60" aria-hidden />
                            {c}
                          </li>
                        ))}
                      </ul>
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                        {k === 4 ? "Outcome" : "Kill signal"} ·{" "}
                        <span className={k === 4 ? "text-asymmetri-red" : "text-white/70"}>{st.kill}</span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div
              ref={bin}
              className="mt-6 hidden h-12 items-center border border-dashed border-white/20 px-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 lg:flex"
              aria-hidden
            >
              <span className="w-[100px] shrink-0">Discard tray</span>
            </div>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 lg:hidden" aria-hidden>
              Illustrative: sixteen in, two shipped. ✕ marks a discard.
            </p>

            {/* Desktop: animated specimens */}
            <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
              <span ref={scan} className="absolute top-0 left-0 h-px bg-asymmetri-red shadow-[0_0_12px_2px_rgba(205,23,23,0.6)]" />
              {FATES.map((_, i) => (
                <span
                  key={i}
                  ref={(el) => {
                    dots.current[i] = el;
                  }}
                  data-state="alive"
                  className="absolute top-0 left-0 flex size-4 items-center justify-center border border-white bg-white text-[9px] leading-none text-transparent transition-[background-color,border-color,color] duration-300 will-change-transform data-[state=dead]:border-white/30 data-[state=dead]:bg-transparent data-[state=dead]:text-white/40 data-[state=fail]:border-asymmetri-red data-[state=fail]:bg-transparent data-[state=fail]:text-asymmetri-red data-[state=ship]:border-asymmetri-red data-[state=ship]:bg-asymmetri-red data-[state=ship]:shadow-[0_0_18px_rgba(205,23,23,0.8)]"
                >
                  ✕
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
