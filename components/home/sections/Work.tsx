"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useReducedMotion } from "motion/react";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { ScrambleText } from "@/components/practice/ScrambleText";
import { selectedWork } from "@/lib/site-content";
import { WorkCard } from "@/components/home/work/WorkCard";
import { usePauseOffscreen } from "@/components/home/work/usePauseOffscreen";
import css from "@/components/home/work/work.module.css";
import {
  clamp01,
  easeIn,
  easeInOut,
  easeOut,
  lerp,
  staircase,
} from "@/components/home/work/rng";

const N = selectedWork.length;
const pad = (n: number) => String(n).padStart(2, "0");
const BODY =
  "Systems people transact with, depend on and trust. Built with early-stage founders, fast-growing teams and global brands.";

/* Scroll map of the pinned scene (0 to 1 of the section's pin). */
const T = {
  zoom: [0.015, 0.1],
  title: 0.09,
  dock: [0.17, 0.26],
  land: [0.19, 0.27],
  deal: [0.28, 0.86],
  fin: [0.87, 0.95],
} as const;

/* Cards rotate about a shared pivot far below them, so a run of cards fans
   out like a hand. The pivot sits 2.2 card heights below each card centre. */
const PIVOT = 2.2;

/* ── Reduced motion: a plain grid of the same cards ─────────────────── */
function WorkStatic() {
  return (
    <section
      id="work"
      data-chapter="Work"
      data-nav="red"
      aria-labelledby="work-title"
      className="relative bg-asymmetri-red px-6 pt-28 pb-24 text-white md:px-16"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-black/70">
        Selected work · {pad(N)} case studies
      </p>
      <h2 id="work-title" className="mt-4 font-chakra-petch text-[15vw] leading-[0.86] font-bold uppercase md:text-[8vw]">
        <span className="block">Proof,</span>
        <span className="block">not promises.</span>
      </h2>
      <p className="mt-6 max-w-md font-geist text-lg text-white/85">{BODY}</p>
      <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {selectedWork.map((w, i) => (
          <li key={w.slug} className="aspect-[0.76]">
            <WorkCard w={w} i={i} on className="size-full" />
          </li>
        ))}
      </ul>
      <a
        href="/case-studies"
        className="mt-12 inline-flex items-center gap-4 bg-black px-6 py-4 font-chakra-petch text-sm font-semibold uppercase tracking-wider text-white"
      >
        All case studies <span aria-hidden>→</span>
      </a>
    </section>
  );
}

/* ── The deal: a pinned scene ───────────────────────────────────────── */
function WorkDeck() {
  const ref = useRef<HTMLElement>(null);
  const p = useSectionProgress(ref);
  usePauseOffscreen(ref);

  const dark = useRef<HTMLDivElement>(null);
  const slash = useRef<HTMLSpanElement>(null);
  const thin = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const enter = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const lines = useRef<(HTMLSpanElement | null)[]>([]);
  const body = useRef<HTMLParagraphElement>(null);
  const cards = useRef<(HTMLAnchorElement | null)[]>([]);
  const hud = useRef<HTMLDivElement>(null);
  const index = useRef<HTMLDivElement>(null);
  const cta = useRef<HTMLDivElement>(null);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const geo = useRef({ W: 0, H: 0, cw: 0, ch: 0, titleH: 0, bodyH: 0 });

  const [active, setActive] = useState(0);
  const [isDark, setDark] = useState(true);
  const [fin, setFin] = useState(false);

  const render = useCallback((v: number) => {
    const g = geo.current;
    if (!g.W) return;
    const { W, H, cw, ch } = g;
    const mobile = W < 768;
    const wide = W >= 1280;
    const desk = W >= 1024;

    /* 1. Seam: the logo's thick slash rushes at you and floods the screen red. */
    const z = clamp01((v - T.zoom[0]) / (T.zoom[1] - T.zoom[0]));
    const zi = easeIn(z);
    if (slash.current)
      slash.current.style.transform = `translate(-50%, -50%) skewX(-26deg) scale(${1 + zi * 90})`;
    if (thin.current) {
      thin.current.style.transform = `translateX(${zi * W}px) skewX(-26deg)`;
      thin.current.style.opacity = String(1 - z);
    }
    if (fill.current) fill.current.style.opacity = String(clamp01((z - 0.55) / 0.35));
    if (dark.current) dark.current.style.visibility = z >= 1 ? "hidden" : "visible";
    if (enter.current) enter.current.style.opacity = String(1 - clamp01(z * 4));
    setDark(z < 0.6);

    /* 2. Headline rises through its masks, then docks top-left. */
    lines.current.forEach((el, j) => {
      if (!el) return;
      const t = easeOut(clamp01((v - T.title - j * 0.018) / 0.05));
      el.style.transform = `translateY(${(1 - t) * 110}%) skewY(${(1 - t) * 6}deg)`;
    });
    const dk = easeInOut(clamp01((v - T.dock[0]) / (T.dock[1] - T.dock[0])));
    const top = 84;
    const s = mobile ? 0.46 : 0.3;
    const introY = Math.max(0, (H - g.titleH - g.bodyH - 24) / 2 - top);
    if (title.current)
      title.current.style.transform = `translateY(${lerp(introY, 0, dk)}px) scale(${lerp(1, s, dk)})`;
    if (body.current) {
      const by = lerp(introY + g.titleH + 24, g.titleH * s + 14, dk);
      const show = clamp01((v - 0.13) / 0.04) * (desk ? 1 : 1 - dk);
      body.current.style.transform = `translateY(${by}px)`;
      body.current.style.opacity = String(show);
    }

    /* 3. Dealing: each new card swings in along the arc and lands on top. */
    const s0 = easeOut(clamp01((v - T.land[0]) / (T.land[1] - T.land[0])));
    const F = staircase(((v - T.deal[0]) / (T.deal[1] - T.deal[0])) * (N - 1), N - 1);
    const e = easeInOut(clamp01((v - T.fin[0]) / (T.fin[1] - T.fin[0])));
    const step = mobile ? lerp(3.6, 4.2, e) : lerp(5, 7, e);
    const c = (N - 1) / 2;
    const G = -(F - c) * step * (1 - e);
    const cx = lerp(wide ? 0.57 * W : 0.5 * W, 0.5 * W, e);
    const cy = lerp(mobile ? 0.54 * H : 0.54 * H, mobile ? 0.52 * H : 0.47 * H, e);
    const sc = lerp(1, mobile ? 0.64 : 0.82, e);
    const lift = (1 - sc) * PIVOT * ch;
    cards.current.forEach((el, i) => {
      if (!el) return;
      const si = i === 0 ? s0 : clamp01(F - (i - 1));
      const a = (i - c) * step + G + (1 - si) * 34;
      const ty = (1 - si) * (1 - si) * 0.5 * H - lift;
      el.style.transform = `translate3d(${cx - cw / 2}px, ${cy - ch / 2 + ty}px, 0) rotate(${a}deg) scale(${sc})`;
      el.style.pointerEvents = si > 0.6 ? "auto" : "none";
    });
    const k = Math.min(Math.max(Math.round(F), 0), N - 1);
    setActive(k);
    setFin(e > 0.5);

    /* 4. HUD, index and the closing call to action. */
    const hudOp = clamp01((v - 0.24) / 0.03) * (1 - e);
    if (hud.current) hud.current.style.opacity = String(hudOp);
    if (index.current) {
      index.current.style.opacity = String(hudOp);
      index.current.style.visibility = hudOp > 0.02 ? "visible" : "hidden";
    }
    bars.current.forEach((el, i) => {
      if (!el) return;
      const f = i === 0 ? s0 : clamp01(F - (i - 1));
      el.style.transform = `scaleX(${f})`;
    });
    if (cta.current) {
      cta.current.style.opacity = String(e);
      cta.current.style.transform = `translateY(${(1 - e) * 24}px)`;
      cta.current.style.visibility = e > 0.02 ? "visible" : "hidden";
    }
  }, []);

  useMotionValueEvent(p, "change", render);

  useEffect(() => {
    const measure = () => {
      const c0 = cards.current[0];
      geo.current = {
        W: window.innerWidth,
        H: window.innerHeight,
        cw: c0?.offsetWidth ?? 0,
        ch: c0?.offsetHeight ?? 0,
        titleH: title.current?.offsetHeight ?? 0,
        bodyH: body.current?.offsetHeight ?? 0,
      };
      render(p.get());
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (title.current) ro.observe(title.current);
    if (cards.current[0]) ro.observe(cards.current[0]);
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [p, render]);

  /** Scroll so card i is the live card (index buttons, keyboard focus). */
  const goTo = useCallback((i: number) => {
    const el = ref.current;
    if (!el) return;
    const t = i === 0 ? 0 : i === N - 1 ? N - 1 : i + 0.15;
    const v = i === 0 ? T.land[1] + 0.005 : T.deal[0] + (t / (N - 1)) * (T.deal[1] - T.deal[0]);
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + v * (el.offsetHeight - window.innerHeight), behavior: "smooth" });
  }, []);

  return (
    <section
      ref={ref}
      id="work"
      data-chapter="Work"
      data-nav="red"
      aria-labelledby="work-title"
      className={`${css.host} relative h-[480vh] bg-asymmetri-red text-white`}
    >
      <div
        data-nav={isDark ? "dark" : "red"}
        className="sticky top-0 h-[100svh] overflow-hidden bg-asymmetri-red"
      >
        {/* hairline columns shared with Domains, so the red reads as one movement */}
        <div className="pointer-events-none absolute inset-0 grid grid-cols-4" aria-hidden>
          {[0, 1, 2, 3].map((c) => (
            <span key={c} className="border-l border-white/15" />
          ))}
        </div>

        {/* outline numeral of the live card */}
        <span
          aria-hidden
          className="kit-outline pointer-events-none absolute right-[-0.04em] bottom-[-0.18em] font-chakra-petch text-[46vw] leading-none font-bold select-none md:text-[26vw]"
        >
          {pad(active + 1)}
        </span>

        {/* ── title (docks top-left) ── */}
        <div className="absolute top-[84px] left-6 z-[1] md:left-16">
          <h2
            ref={title}
            id="work-title"
            className="origin-top-left font-chakra-petch text-[15vw] leading-[0.86] font-bold uppercase md:text-[9vw]"
          >
            {["Proof,", "not promises."].map((l, j) => (
              <span key={l} className="block overflow-hidden pb-[0.04em]">
                <span
                  ref={(el) => {
                    lines.current[j] = el;
                  }}
                  className="block origin-bottom-left will-change-transform"
                  style={{ transform: "translateY(110%)" }}
                >
                  {j === 1 ? (
                    <>
                      not <br className="md:hidden" />
                      promises.
                    </>
                  ) : (
                    l
                  )}
                </span>
              </span>
            ))}
          </h2>
          <p
            ref={body}
            className="absolute top-0 left-0 w-[min(80vw,22rem)] font-geist text-base leading-snug text-white/90 md:text-lg lg:w-[17rem] lg:text-base xl:w-[19rem]"
            style={{ opacity: 0 }}
          >
            {BODY}
          </p>
        </div>

        {/* ── the deck ── */}
        <div className="absolute inset-0 z-[2]">
          {selectedWork.map((w, i) => (
            <WorkCard
              key={w.slug}
              w={w}
              i={i}
              on={fin || active === i}
              cardRef={(el) => {
                cards.current[i] = el;
              }}
              onFocus={() => goTo(i)}
              className="absolute top-0 left-0 h-[min(60svh,96vw,640px)] w-[calc(min(60svh,96vw,640px)*0.76)] origin-[50%_270%] will-change-transform"
              style={{ transform: "translate3d(0, 120vh, 0)", zIndex: i }}
            />
          ))}
        </div>

        {/* ── index (wide screens) ── */}
        <div
          ref={index}
          className="absolute top-1/2 right-16 z-[3] hidden w-60 -translate-y-1/2 xl:block 2xl:w-72"
          style={{ opacity: 0 }}
        >
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-black/70">
            Selected work · {pad(N)}
          </p>
          <ol className="border-t border-white/25">
            {selectedWork.map((w, i) => {
              const on = active === i;
              return (
                <li key={w.slug} className="border-b border-white/25">
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={on || undefined}
                    className={`group relative grid w-full grid-cols-[2rem_1fr_auto] items-baseline gap-2 py-2.5 text-left transition-colors ${on ? "text-white" : "text-white/55 hover:text-white"}`}
                  >
                    <span className="font-mono text-[10px]">{pad(i + 1)}</span>
                    <span>
                      <span className="block font-chakra-petch text-sm leading-none font-bold uppercase">{w.name}</span>
                      <span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.2em] opacity-70">{w.domain}</span>
                    </span>
                    <span className={`size-2 self-center transition-colors ${on ? "bg-black" : "bg-transparent"}`} aria-hidden />
                    <span
                      ref={(el) => {
                        bars.current[i] = el;
                      }}
                      className="absolute -bottom-px left-0 h-px w-full origin-left bg-white"
                      style={{ transform: "scaleX(0)" }}
                      aria-hidden
                    />
                  </button>
                </li>
              );
            })}
          </ol>
          <a
            href="/case-studies"
            className="mt-5 inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white hover:text-black"
          >
            All case studies <span aria-hidden>→</span>
          </a>
        </div>

        {/* ── counter (narrow screens) ── */}
        <div
          ref={hud}
          className="pointer-events-none absolute inset-x-0 bottom-6 z-[3] flex flex-col items-center gap-2 xl:hidden"
          style={{ opacity: 0 }}
          aria-hidden
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.25em]">
            <ScrambleText text={`${pad(active + 1)} / ${pad(N)}`} trigger="none" replayKey={active} duration={0.4} />
          </span>
          <span className="flex gap-1">
            {selectedWork.map((w, i) => (
              <span key={w.slug} className={`h-[3px] w-5 ${i <= active ? "bg-white" : "bg-white/30"}`} />
            ))}
          </span>
        </div>

        {/* ── finale ── */}
        <div
          ref={cta}
          className="absolute inset-x-0 bottom-8 z-[4] flex flex-col items-center gap-3 px-6 md:bottom-10"
          style={{ opacity: 0, visibility: "hidden" }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-black/75">
            Seven systems. Each one a case study.
          </p>
          <a
            href="/case-studies"
            className="group inline-flex items-center gap-4 bg-black px-6 py-4 font-chakra-petch text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black md:px-8 md:text-base"
          >
            <span className="flex items-center gap-[3px]" aria-hidden>
              <span className="h-4 w-[5px] -skew-x-[26deg] bg-asymmetri-red" />
              <span className="h-4 w-[2px] -skew-x-[26deg] bg-asymmetri-red" />
            </span>
            All case studies
            <span className="transition-transform group-hover:translate-x-1" aria-hidden>
              →
            </span>
          </a>
        </div>

        {/* ── seam from the dark chapter above ── */}
        <div ref={dark} className="pointer-events-none absolute inset-0 z-[5] bg-[#0a0a0a]" aria-hidden>
          <span className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:160px_400px] bg-center" />
          <div ref={enter} className="absolute inset-0">
            <span className="absolute top-[calc(50%-21vh)] left-1/2 -translate-x-1/2 font-mono text-[10px] whitespace-nowrap uppercase tracking-[0.3em] text-white/60">
              <ScrambleText text={`Selected work · ${pad(N)} case studies`} />
            </span>
            <span className="absolute top-[calc(50%+18vh)] left-1/2 -translate-x-1/2 font-mono text-[10px] whitespace-nowrap uppercase tracking-[0.3em] text-asymmetri-red">
              Proof follows
            </span>
          </div>
          <span
            ref={slash}
            className="absolute top-1/2 left-1/2 h-[26vh] w-[5.5vh] bg-asymmetri-red will-change-transform"
            style={{ transform: "translate(-50%, -50%) skewX(-26deg)" }}
          />
          <span className="absolute top-1/2 left-[calc(50%+4.6vh)] h-[26vh] w-[1.8vh] -translate-y-1/2">
            <span
              ref={thin}
              className="block size-full bg-asymmetri-red"
              style={{ transform: "skewX(-26deg)" }}
            />
          </span>
          <div ref={fill} className="absolute inset-0 bg-asymmetri-red" style={{ opacity: 0 }} />
        </div>
      </div>
    </section>
  );
}

export function Work() {
  const reduce = useReducedMotion();
  return reduce ? <WorkStatic /> : <WorkDeck />;
}

