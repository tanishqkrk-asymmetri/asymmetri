"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { motion, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import { useReduceMotion as useReducedMotion } from "@/hooks/useReduceMotion";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { MaskLines } from "@/components/practice/MaskLines";
import { ScrambleText } from "@/components/practice/ScrambleText";
import { AsciiField } from "@/components/home/os/asciiField";
import { figurePos, osPrinciples, principleAt } from "@/components/home/os/content";
import { clamp01, scrollToProgress, useEnterProgress, useRunning } from "@/components/home/os/hooks";

const pad = (n: number) => String(n).padStart(2, "0");
// Pinned-progress span of each principle (drives its red progress hairline).
const SPANS: [number, number][] = [
  [0.16, 0.44],
  [0.44, 0.72],
  [0.72, 1],
];
const activeAt = (v: number) => {
  const f = figurePos(v);
  return f >= 2.5 ? 2 : f >= 1.5 ? 1 : f >= 0.5 ? 0 : -1;
};

function Principle({
  i,
  open,
  p,
  onPick,
}: {
  i: number;
  open: boolean;
  p: MotionValue<number>;
  onPick: (i: number) => void;
}) {
  const item = osPrinciples[i];
  const [a, b] = SPANS[i];
  const fill = useTransform(p, (v) => clamp01((v - a) / (b - a)));
  return (
    <li className="relative border-t border-white/15 last:border-b">
      <motion.span
        aria-hidden
        style={{ scaleX: fill }}
        className="absolute -top-px left-0 h-px w-full origin-left bg-asymmetri-red"
      />
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`os-principle-${i}`}
          onClick={() => onPick(i)}
          className="group flex w-full items-center gap-4 py-2.5 text-left outline-none focus-visible:bg-white/5 md:py-3.5"
        >
          <span
            className={`font-mono text-[10px] tracking-[0.25em] transition-colors ${open ? "text-asymmetri-red" : "text-white/40"}`}
          >
            {pad(i + 1)}
          </span>
          <span
            className={`font-chakra-petch text-xl leading-none font-bold uppercase transition-colors duration-300 md:text-3xl xl:text-4xl ${
              open ? "text-white" : "text-white/35 group-hover:text-white/75"
            }`}
          >
            {item.name}
          </span>
          <span aria-hidden className="ml-auto shrink-0 font-mono text-[9px] uppercase tracking-[0.25em] text-white/40">
            {open ? (
              <span className="text-asymmetri-red">
                <span className="kit-blink mr-1.5 inline-block size-1.5 bg-asymmetri-red align-middle" />
                {item.figure}
              </span>
            ) : (
              `Fig ${pad(i + 1)}`
            )}
          </span>
        </button>
      </h3>
      <div
        id={`os-principle-${i}`}
        className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="font-chakra-petch text-lg leading-tight font-bold uppercase text-white md:text-2xl">
            {item.body}
          </p>
          <p className="mt-1.5 max-w-md pb-4 font-geist text-sm leading-relaxed text-white/60 md:text-base">
            {item.rest}
          </p>
        </div>
      </div>
    </li>
  );
}

/**
 * "Hard problems don't need a playbook. They need a system." The chapter
 * takes over from Domains on pure black and a field of type boots out of it,
 * decoding from the centre as the section arrives. It draws the Asymmetri
 * mark and re-forms into one figure per principle as you scroll: an
 * ever-changing knot (creativity), a damped loop converging on its target
 * (agility) and one module repeated across a lattice (repeatability).
 * Under the cursor the figure turns into the ones and zeros underneath it;
 * a click sends a pulse through the field.
 */
export function OperatingSystem() {
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const figRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const xyRef = useRef<HTMLSpanElement>(null);
  const cellsRef = useRef<HTMLSpanElement>(null);
  const field = useRef<AsciiField | null>(null);
  const clock = useRef(0);
  const leaveTimer = useRef(0);

  const p = useSectionProgress(ref, "pin");
  const enter = useEnterProgress(ref);
  const reduce = !!useReducedMotion();
  const running = useRunning(ref);
  const [active, setActive] = useState(-1);
  const [arrived, setArrived] = useState(false);

  const syncLabel = useCallback(() => {
    const f = field.current;
    if (f && labelRef.current && labelRef.current.textContent !== f.label) {
      labelRef.current.textContent = f.label;
    }
  }, []);

  const drawStill = useCallback(() => {
    const f = field.current;
    if (!f) return;
    f.draw(figurePos(p.get()), 1, 0, true);
    syncLabel();
  }, [p, syncLabel]);

  useMotionValueEvent(p, "change", (v) => {
    const a = activeAt(v);
    setActive((prev) => (prev === a ? prev : a));
    if (reduce) drawStill();
  });
  useMotionValueEvent(enter, "change", (v) => {
    if (v > 0.72) setArrived(true);
  });

  // Create the field, bound to this section's own canvases, and keep it sized.
  useEffect(() => {
    const stage = stageRef.current;
    const fig = figRef.current;
    const canvas = canvasRef.current;
    if (!stage || !fig || !canvas) return;
    const f = new AsciiField(canvas);
    field.current = f;
    const measure = () => {
      const s = stage.getBoundingClientRect();
      const r = fig.getBoundingClientRect();
      const w = s.width;
      const font = w < 640 ? 8 : w < 1024 ? 9 : w < 1440 ? 10 : 11;
      // Keep the figure clear of the HUD lines along the frame's top and bottom.
      const ix = w < 1024 ? 8 : 20;
      const iy = w < 1024 ? 18 : 40;
      f.resize(
        s.width,
        s.height,
        { x: r.left - s.left + ix, y: r.top - s.top + iy, w: r.width - ix * 2, h: r.height - iy * 2 },
        font,
      );
      if (cellsRef.current) cellsRef.current.textContent = `${f.cells.toLocaleString("en-GB")} glyphs`;
      f.draw(figurePos(p.get()), reduce ? 1 : Math.min(1, enter.get()), clock.current, reduce);
      syncLabel();
    };
    measure();
    // Fonts can land after mount; re-measure so glyph widths are right.
    document.fonts?.ready.then(measure).catch(() => {});
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    ro.observe(fig);
    return () => {
      ro.disconnect();
      field.current = null;
    };
  }, [p, enter, reduce, syncLabel]);

  // The animation loop only runs while the section is on screen and the tab is visible.
  useEffect(() => {
    if (reduce || !running) return;
    let raf = 0;
    let last = performance.now();
    let labelTick = 0;
    const loop = (now: number) => {
      // rAF timestamps can trail performance.now(); never let the clock run backwards.
      clock.current += Math.min(Math.max(now - last, 0), 64) / 1000;
      last = now;
      const f = field.current;
      if (f) {
        f.draw(figurePos(p.get()), enter.get(), clock.current, false);
        if (++labelTick % 15 === 0) syncLabel();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running, reduce, p, enter, syncLabel]);

  const local = (e: PointerEvent<HTMLDivElement>) => {
    const s = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - s.left, y: e.clientY - s.top };
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const f = field.current;
    if (!f || reduce) return;
    window.clearTimeout(leaveTimer.current);
    const { x, y } = local(e);
    f.setPointer(x, y, true);
    if (xyRef.current) {
      xyRef.current.textContent = `X ${String(Math.round(x)).padStart(4, "0")} · Y ${String(Math.round(y)).padStart(4, "0")}`;
    }
  };
  // A finger lifts straight away, so on touch the lens lingers for a moment.
  const onLeave = (e: PointerEvent<HTMLDivElement>) => {
    window.clearTimeout(leaveTimer.current);
    const off = () => field.current?.setPointer(0, 0, false);
    if (e.pointerType === "mouse") off();
    else leaveTimer.current = window.setTimeout(off, 1100);
  };
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    const f = field.current;
    if (!f || reduce) return;
    onMove(e);
    const { x, y } = local(e);
    f.pulse(x, y, clock.current);
  };
  useEffect(() => () => window.clearTimeout(leaveTimer.current), []);

  const pick = (i: number) => scrollToProgress(ref.current, principleAt[i], !reduce);
  const shown = reduce || arrived;

  return (
    <section
      ref={ref}
      id="how-we-operate"
      data-chapter="How we operate"
      data-nav="dark"
      aria-labelledby="os-title"
      className={`relative bg-black ${reduce ? "" : "h-[380vh]"}`}
    >
      <div
        ref={stageRef}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        onPointerDown={onDown}
        className={`${reduce ? "relative min-h-screen lg:h-screen" : "sticky top-0 h-screen"} overflow-hidden bg-black text-white`}
      >
        <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full font-mono" />

        <div className={`relative grid ${reduce ? "min-h-screen lg:h-full" : "h-full"} grid-rows-[minmax(0,36fr)_minmax(0,64fr)] pt-16 lg:grid-cols-2 lg:grid-rows-1 lg:pt-14`}>
          {/* Figure frame: the canvas draws inside this rect. */}
          <div ref={figRef} className="relative mx-4 mt-2 lg:m-0 lg:border-r lg:border-white/10" aria-hidden>
            <span className="absolute top-0 left-0 size-3 border-t border-l border-white/40" />
            <span className="absolute top-0 right-0 size-3 border-t border-r border-white/40" />
            <span className="absolute bottom-0 left-0 size-3 border-b border-l border-white/40" />
            <span className="absolute right-0 bottom-0 size-3 border-r border-b border-white/40" />
            <div className="absolute inset-x-3 top-2 flex justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.25em] text-white/45 lg:inset-x-6 lg:top-5">
              <span ref={labelRef} className="text-asymmetri-red">
                Fig 00 · The mark
              </span>
              <span className="flex gap-4">
                <span ref={xyRef} className="hidden xl:inline">
                  X 0000 · Y 0000
                </span>
                <span ref={cellsRef} className="hidden sm:inline" />
              </span>
            </div>
            {/* Bottom-right: the page's chapter HUD owns the bottom-left corner. */}
            <div className="absolute inset-x-3 bottom-2 flex justify-start font-mono text-[9px] uppercase tracking-[0.25em] text-white/40 md:justify-end lg:inset-x-6 lg:bottom-5">
              <span className="hidden md:inline">Hover: read the code · Click: pulse</span>
              <span className="md:hidden">Tap: read the code underneath</span>
            </div>
          </div>

          <div className="relative flex min-h-0 flex-col justify-start px-6 pt-3 pb-6 md:px-12 lg:justify-center lg:py-10 xl:px-16">
            <span
              aria-hidden
              className="kit-outline pointer-events-none absolute right-2 bottom-0 font-chakra-petch text-[34vw] leading-[0.8] font-bold select-none lg:right-6 lg:text-[15vw]"
            >
              {pad(Math.max(active + 1, 0))}
            </span>
            <div className="relative">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-asymmetri-red md:mb-5 md:text-xs">
                <ScrambleText text="How we operate · The system" trigger="none" replayKey={shown} />
              </p>
              <h2
                id="os-title"
                className="font-chakra-petch text-[min(7.2vw,3.25rem)] leading-[0.92] font-bold uppercase lg:text-[3.2vw] 2xl:text-[3.6rem]"
              >
                <MaskLines
                  immediate={shown}
                  lines={[
                    "Hard problems don't",
                    "need a playbook.",
                    <span key="s">
                      They need a <span className="text-asymmetri-red">system.</span>
                    </span>,
                  ]}
                />
              </h2>
              <ol className="mt-4 md:mt-8 xl:mt-10">
                {osPrinciples.map((item, i) => (
                  <Principle key={item.name} i={i} open={reduce || active === i} p={p} onPick={pick} />
                ))}
              </ol>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
