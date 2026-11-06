"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { pointOfView } from "@/lib/site-content";
import { MaskLines } from "@/components/practice/MaskLines";
import { ScrambleText } from "@/components/practice/ScrambleText";

const PROMPT = "Summarise this quarter's exceptions and fix them";
const EASE = [0.16, 1, 0.3, 1] as const;
// What each shift switches on in the operating layer, in order.
const LAYER = ["Approval", "Knowledge", "Agents", "Governance"];
const pad = (n: number) => String(n).padStart(2, "0");
const clamp = (v: number) => Math.min(Math.max(v, 0), 1);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Scroll beats, as fractions of the pinned scene.
const TYPE = [0.03, 0.16] as const;
const OPEN = [0.18, 0.37] as const;
const ENTER = 0.38;
const SHIFT_AT = (i: number) => 0.46 + i * 0.095;
const STANCE = 0.84;
const FOCUS = [0.9, 0.98] as const;

function Shift({ i, shown, from, to }: { i: number; shown: boolean; from: string; to: string }) {
  return (
    <motion.li
      initial={false}
      animate={shown ? { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 } : { clipPath: "inset(0% 100% 0% 0%)", opacity: 0.3 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="grid grid-cols-[2rem_minmax(0,1fr)] items-baseline gap-x-3 border-t border-white/15 py-2.5 md:grid-cols-[3.5rem_minmax(0,0.9fr)_minmax(0,1.2fr)] md:gap-x-6 md:py-4 [@media(max-height:760px)]:md:py-2.5"
    >
      <span className={`font-mono text-[10px] tracking-[0.2em] md:text-xs ${shown ? "text-asymmetri-red" : "text-white/40"}`}>
        {pad(i + 1)}
      </span>
      <span className="relative w-fit font-chakra-petch text-2xl leading-none font-bold uppercase md:text-[clamp(2rem,3.6vw,3.5rem)]">
        <span className="kit-outline">{from}</span>
        <motion.span
          className="absolute top-[54%] left-[-4%] h-[3px] w-[108%] origin-left bg-asymmetri-red"
          initial={false}
          animate={{ scaleX: shown ? 1 : 0 }}
          transition={{ duration: 0.45, delay: shown ? 0.35 : 0, ease: EASE }}
          aria-hidden
        />
      </span>
      <span className="col-start-2 mt-1 font-chakra-petch text-base leading-tight font-semibold uppercase md:col-start-auto md:mt-0 md:text-[clamp(1.1rem,1.9vw,1.85rem)]">
        <span className="mr-2 text-asymmetri-red" aria-hidden>
          →
        </span>
        <ScrambleText text={to} trigger="none" replayKey={shown} duration={0.8} />
      </span>
    </motion.li>
  );
}

function StaticScene() {
  return (
    <div className="heroDark bg-[#0a0a0a] px-5 py-24 md:px-16 md:py-32">
      <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.3em] text-asymmetri-red md:text-xs">03 · Point of view</p>
      <h2 className="max-w-5xl font-chakra-petch text-4xl leading-[0.95] font-bold uppercase md:text-6xl">
        {pointOfView.headline}
      </h2>
      <ol className="mt-12 border-b border-white/15">
        {pointOfView.shifts.map((s, i) => (
          <li key={s.from} className="grid grid-cols-[2rem_1fr] gap-x-3 border-t border-white/15 py-4 md:grid-cols-[3.5rem_0.9fr_1.2fr]">
            <span className="font-mono text-xs text-asymmetri-red">{pad(i + 1)}</span>
            <span className="font-chakra-petch text-2xl font-bold uppercase text-white/40 line-through decoration-asymmetri-red md:text-4xl">
              {s.from}
            </span>
            <span className="col-start-2 font-chakra-petch text-lg font-semibold uppercase md:col-start-auto md:text-2xl">→ {s.to}</span>
          </li>
        ))}
      </ol>
      <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <p className="max-w-xl font-geist text-base text-white/75 md:text-lg">{pointOfView.stance}</p>
        <p className="font-chakra-petch text-xl font-bold uppercase md:max-w-md md:text-right md:text-2xl">{pointOfView.closer}</p>
      </div>
    </div>
  );
}

/**
 * "AI becomes valuable when it leaves the chat window and enters the
 * operation." The scene opens on the white of the section above with one dark
 * chat window in it. The prompt types, the window swallows the page (the
 * light-to-dark seam), and the four shifts are written into the operation.
 * It ends on the dark grid, which the Work chapter below opens out of.
 */
export function PointOfViewScene({ progress }: { progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const p = progress;

  // Stage size and the chat window's rect, in px.
  const size = useMotionValue({ w: 1440, h: 900 });
  const [beat, setBeat] = useState({ open: false, enter: false, shifts: 0, stance: false, tone: "light" as "light" | "dark" });

  const measure = useCallback(() => {
    const s = stage.current;
    if (!s) return;
    const r = s.getBoundingClientRect();
    size.set({ w: r.width, h: r.height });
  }, [size]);

  useEffect(() => {
    if (reduce) return;
    measure();
    const s = stage.current;
    if (!s) return;
    const ro = new ResizeObserver(measure);
    ro.observe(s);
    return () => ro.disconnect();
  }, [measure, reduce]);

  const win = (w: number, h: number) => {
    const ww = Math.min(600, w * 0.88);
    const wh = 132;
    const cy = h * 0.57;
    return { t: cy - wh / 2, b: h - cy - wh / 2, x: (w - ww) / 2 };
  };

  const openT = (v: number) => easeInOut(clamp((v - OPEN[0]) / (OPEN[1] - OPEN[0])));
  const windowClip = useTransform([p, size] as MotionValue[], ([v, s]) => {
    const { w, h } = s as { w: number; h: number };
    const e = openT(v as number);
    const r = win(w, h);
    const k = 1 - e;
    return `inset(${r.t * k}px ${r.x * k}px ${r.b * k}px ${r.x * k}px round ${12 * k}px)`;
  });
  // Last beat: the operation recedes and the closer is left standing.
  const recede = useTransform(p, [FOCUS[0], FOCUS[1]], [1, 0.18]);
  const typed = useTransform(p, (v) => PROMPT.slice(0, Math.round(clamp((v - TYPE[0]) / (TYPE[1] - TYPE[0])) * PROMPT.length)));
  const sendScale = useTransform(p, [0.15, 0.16, 0.17], [1, 0.82, 1]);
  const sendBg = useTransform(p, [0.15, 0.16], ["#ffffff", "#cd1717"]);
  const chatOpacity = useTransform(p, [OPEN[0], OPEN[0] + 0.05], [1, 0]);
  const introY = useTransform(p, [0, OPEN[1]], [0, -60]);
  // Live size of the window as it opens, read out in the middle of the dark.
  const readout = useTransform([p, size] as MotionValue[], ([v, s]) => {
    const { w, h } = s as { w: number; h: number };
    const e = openT(v as number);
    const r = win(w, h);
    const ww = Math.round(w - 2 * r.x * (1 - e));
    const wh = Math.round(h - (r.t + r.b) * (1 - e));
    return `${ww} × ${wh}`;
  });
  const readoutOpacity = useTransform(p, [OPEN[0] + 0.03, OPEN[0] + 0.05, OPEN[1] - 0.04, OPEN[1] - 0.01], [0, 1, 1, 0]);
  const introBlur = useTransform(p, [OPEN[0], OPEN[0] + 0.1], ["blur(0px)", "blur(6px)"]);

  useMotionValueEvent(p, "change", (v) => {
    const { h } = size.get();
    const r = win(size.get().w, h);
    const top = r.t * (1 - openT(v));
    const tone = top < 28 ? "dark" : "light";
    const next = {
      open: v >= OPEN[1] - 0.04,
      enter: v >= ENTER,
      shifts: pointOfView.shifts.filter((_, i) => v >= SHIFT_AT(i)).length,
      stance: v >= STANCE,
      tone,
    } as const;
    if (
      next.open !== beat.open ||
      next.enter !== beat.enter ||
      next.shifts !== beat.shifts ||
      next.stance !== beat.stance ||
      next.tone !== beat.tone
    ) {
      setBeat(next);
    }
  });

  if (reduce) return <StaticScene />;

  return (
    <div ref={stage} className="sticky top-0 h-[100svh] overflow-hidden bg-white font-chakra-petch text-black">
      <h2 className="sr-only">{pointOfView.headline}</h2>
      <div data-nav={beat.tone} className="pointer-events-none absolute inset-x-0 top-0 h-16" aria-hidden />

      {/* ── On white: the old frame ─────────────────────────────── */}
      <motion.div style={{ y: introY, filter: introBlur }} className="absolute inset-x-0 top-[17%] px-5 text-center md:top-[16%]" aria-hidden>
        <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.3em] text-asymmetri-red md:text-xs">
          <ScrambleText text="03 · Point of view" />
        </p>
        <p className="mx-auto max-w-[16ch] text-[9vw] leading-[0.92] font-bold uppercase md:max-w-none md:text-[4.6vw]">
          <MaskLines lines={["AI becomes valuable", <span key="r" className="text-asymmetri-red">when it leaves the chat window</span>]} />
        </p>
      </motion.div>

      {/* The chat window that becomes the operation */}
      <motion.div style={{ clipPath: windowClip }} className="heroDark absolute inset-0 bg-[#0a0a0a]" aria-hidden />

      <motion.div
        style={{ opacity: readoutOpacity, clipPath: windowClip }}
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 text-white"
        aria-hidden
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-asymmetri-red">Leaving the chat window</span>
        <motion.span className="font-chakra-petch text-5xl font-bold tabular-nums md:text-8xl">{readout}</motion.span>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">px · window → operation</span>
      </motion.div>

      <motion.div
        style={{ opacity: chatOpacity }}
        className="absolute top-[57%] left-1/2 h-[132px] w-[min(600px,88vw)] -translate-x-1/2 -translate-y-1/2 text-white"
        aria-hidden
      >
        <div className="flex h-8 items-center gap-1.5 border-b border-white/10 px-4">
          <span className="size-2 bg-white/25" />
          <span className="size-2 bg-white/25" />
          <span className="size-2 bg-asymmetri-red" />
          <span className="ml-3 font-mono text-[9px] uppercase tracking-[0.25em] text-white/40">assistant · chat</span>
          <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.25em] text-white/30">The old frame</span>
        </div>
        <div className="flex h-[100px] items-center gap-3 px-4 md:px-5">
          <span className="shrink-0 font-mono text-[10px] text-white/35">ASK&nbsp;AI&nbsp;›</span>
          <motion.span className="min-w-0 truncate font-geist text-sm text-white md:text-lg">{typed}</motion.span>
          <span className="kit-blink inline-block h-5 w-2.5 shrink-0 bg-asymmetri-red" />
          <motion.span
            style={{ scale: sendScale, background: sendBg }}
            className="ml-auto flex size-9 shrink-0 items-center justify-center text-black"
          >
            ↵
          </motion.span>
        </div>
      </motion.div>

      {/* ── Inside the operation ─────────────────────────────────── */}
      <div
        className={`absolute inset-0 flex flex-col px-5 pt-[4.5rem] pb-32 text-white transition-opacity duration-500 md:px-16 md:pt-20 md:pb-16 ${beat.open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        aria-hidden
      >
        <motion.div style={{ opacity: recede }} className="flex min-h-0 flex-1 flex-col">
        {/* Status of the operating layer: each shift switches one on. */}
        <div className="flex items-center justify-between gap-3 border-b border-white/15 pb-3 font-mono text-[9px] uppercase tracking-[0.22em] md:text-[10px]">
          <span className="hidden truncate text-white/45 md:inline">
            <span className="text-asymmetri-red">›</span> {PROMPT}
          </span>
          <span className="flex gap-3 md:gap-5">
            {LAYER.map((l, i) => (
              <span key={l} className={`flex items-center gap-1.5 transition-colors ${i < beat.shifts ? "text-white" : "text-white/30"}`}>
                <span className={`size-1.5 transition-colors ${i < beat.shifts ? "bg-asymmetri-red" : "bg-white/20"}`} />
                {l}
              </span>
            ))}
          </span>
        </div>

        <p className="mt-6 text-[10vw] leading-[0.9] font-bold uppercase md:mt-8 md:text-[clamp(2.75rem,5.4vw,5.5rem)] [@media(max-height:760px)]:md:mt-5">
          {beat.enter ? (
            <MaskLines lines={["…and enters", <span key="r" className="text-asymmetri-red">the operation.</span>]} lineClassName="md:inline-block md:mr-[0.25em]" />
          ) : (
            <span className="invisible">…and enters the operation.</span>
          )}
        </p>

        <ol className="mt-5 border-b border-white/15 md:mt-8 [@media(max-height:760px)]:md:mt-4">
          {pointOfView.shifts.map((s, i) => (
            <Shift key={s.from} i={i} shown={i < beat.shifts} from={s.from} to={s.to} />
          ))}
        </ol>

        <div className="mt-auto grid gap-4 pt-5 md:grid-cols-[1fr_auto] md:items-end md:gap-10">
          <motion.p
            initial={false}
            animate={beat.stance ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="max-w-xl font-geist text-sm leading-relaxed text-white/75 max-md:[@media(max-height:700px)]:hidden md:max-w-[calc(100%-22rem)] md:text-lg lg:max-w-xl"
          >
            {pointOfView.stance}
          </motion.p>
        </div>
        </motion.div>
      </div>

      {/* The closer, with the chat's red cursor still blinking after it. */}
      <motion.p
        initial={false}
        animate={beat.stance ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
        className="absolute right-5 bottom-8 left-5 text-xl leading-[1.02] font-bold text-white uppercase md:right-16 md:bottom-16 md:left-auto md:max-w-[22ch] md:text-right md:text-[clamp(1.5rem,2.4vw,2.5rem)]"
        aria-hidden
      >
        {pointOfView.closer}
        <span className="kit-blink ml-1.5 inline-block h-[0.8em] w-[0.42em] translate-y-[0.08em] bg-asymmetri-red" />
      </motion.p>
      {/* Real text for assistive tech, in reading order. */}
      <div className="sr-only">
        <ol>
          {pointOfView.shifts.map((s) => (
            <li key={s.from}>
              From {s.from.toLowerCase()} to {s.to.toLowerCase()}.
            </li>
          ))}
        </ol>
        <p>{pointOfView.stance}</p>
        <p>{pointOfView.closer}</p>
      </div>
    </div>
  );
}
