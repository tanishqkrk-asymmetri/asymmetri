"use client";

import { memo, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Wordmark } from "@/components/brand/Wordmark";
import { BIG, bandPoints, type SplitGeo, useHeroSplit } from "@/hooks/useHeroSplit";
import { company, pillars } from "@/lib/site-content";

const EASE = [0.16, 1, 0.3, 1] as const;
const RED = "#cd1717";

const NOW_SOLVING = [
  "Agentic operations",
  "Commerce and finance",
  "Health and care",
  "Industry and logistics",
  "Media and growth",
  "Connected environments",
];

type Split = ReturnType<typeof useHeroSplit>;

/* ------------------------------------------------------------------ */
/* Symmetry field: an ordered grid of crosshairs. A single force (the   */
/* cursor, or a slow wanderer when idle) breaks the symmetry and turns  */
/* them into the logo's red slashes. The scroll cut does the same along */
/* the split line before the screen tears open.                         */
/* ------------------------------------------------------------------ */

function SymmetryField({
  geo,
  loaded,
}: {
  geo: MotionValue<SplitGeo>;
  loaded: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const loadedAt = useRef<number | null>(null);

  useEffect(() => {
    if (loaded && loadedAt.current === null) loadedAt.current = performance.now();
  }, [loaded]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    const p = { x: -9999, y: -9999, tx: -9999, ty: -9999, last: -1e9 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };
    const onMove = (e: PointerEvent) => {
      p.tx = e.clientX;
      p.ty = e.clientY;
      if (p.last < 0 || p.x < -9000) {
        p.x = p.tx;
        p.y = p.ty;
      }
      p.last = performance.now();
    };

    const clipHalf = (g: SplitGeo, side: number, ox: number, oy: number) => {
      const pts = side < 0 ? bandPoints(g, -BIG, 0.75) : bandPoints(g, 0, BIG);
      ctx.beginPath();
      pts.forEach(([x, y], i) =>
        i ? ctx.lineTo(x + ox, y + oy) : ctx.moveTo(x + ox, y + oy),
      );
      ctx.closePath();
      ctx.clip();
    };

    const drawHalf = (g: SplitGeo, side: number, intro: number) => {
      const d = side < 0 ? -g.a : side > 0 ? g.b : 0;
      const ox = g.nx * d;
      const oy = g.ny * d;
      ctx.save();
      if (side !== 0) clipHalf(g, side, ox, oy);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);
      ctx.translate(ox, oy);

      const S = w < 768 ? 26 : 34;
      const cols = Math.ceil(w / S);
      const rows = Math.ceil(h / S);
      const offX = (w - (cols - 1) * S) / 2;
      const offY = (h - (rows - 1) * S) / 2;
      const plx = p.x - ox;
      const ply = p.y - oy;
      const R = w < 768 ? 120 : 190;
      const reach = g.cut * Math.hypot(w, h) * 0.6;
      const cutPulse = g.cut * (1 - Math.min(g.open * 1.6, 1));
      const maxR = Math.hypot(w, h) * 0.6;
      const arm = 2.5;

      ctx.lineWidth = 1;
      ctx.lineCap = "butt";
      const calm = new Path2D();
      const singles: [number, number, number][] = [];

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = offX + i * S;
          const y = offY + j * S;
          const sd = (x - g.cx) * g.nx + (y - g.cy) * g.ny;
          if (side < 0 && sd > 4) continue;
          if (side > 0 && sd < -4) continue;
          const sx = x + ox;
          const sy = y + oy;
          if (sx < -S || sx > w + S || sy < -S || sy > h + S) continue;

          // Intro: the field fades in from the centre outwards.
          const rd = Math.hypot(x - w / 2, y - h / 2);
          const fade = Math.min(Math.max((intro * maxR * 1.25 - rd) / 160, 0), 1);
          if (fade <= 0) continue;

          const dx = x - plx;
          const dy = y - ply;
          const dist = Math.hypot(dx, dy);
          let tp = Math.max(1 - dist / R, 0);
          tp = tp * tp * (3 - 2 * tp);

          const along = Math.abs((x - g.cx) * g.ux + (y - g.cy) * g.uy);
          const tc =
            Math.max(1 - Math.abs(sd) / 70, 0) *
            Math.min(Math.max((reach - along) / 90, 0), 1) *
            cutPulse;

          const t = Math.max(tp * fade, tc);
          if (t < 0.03) {
            if (fade >= 1) {
              calm.moveTo(x - arm, y);
              calm.lineTo(x + arm, y);
              calm.moveTo(x, y - arm);
              calm.lineTo(x, y + arm);
            } else {
              singles.push([x, y, fade]);
            }
            continue;
          }

          // Pushed away from the force, then drawn as the brand slash.
          const push = dist > 0.01 ? (tp * 10) / dist : 0;
          const cx = x + dx * push;
          const cy = y + dy * push;
          const hl = 3 + t * 8;
          const r = Math.round(255 + (205 - 255) * t);
          const gb = Math.round(255 + (23 - 255) * t);
          ctx.strokeStyle = `rgba(${r},${gb},${gb},${0.2 + 0.8 * t})`;
          ctx.lineWidth = 1 + t * 1.8;
          ctx.beginPath();
          ctx.moveTo(cx - g.ux * hl, cy - g.uy * hl);
          ctx.lineTo(cx + g.ux * hl, cy + g.uy * hl);
          if (t > 0.55) {
            // The second, thinner stroke of the logo's double slash.
            const o = 4 + t * 2;
            const k = hl * 0.75;
            ctx.moveTo(cx + g.nx * o - g.ux * k, cy + g.ny * o - g.uy * k);
            ctx.lineTo(cx + g.nx * o + g.ux * k, cy + g.ny * o + g.uy * k);
          }
          ctx.stroke();
        }
      }

      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.17)";
      ctx.stroke(calm);
      for (const [x, y, f] of singles) {
        ctx.strokeStyle = `rgba(255,255,255,${0.17 * f})`;
        ctx.beginPath();
        ctx.moveTo(x - arm, y);
        ctx.lineTo(x + arm, y);
        ctx.moveTo(x, y - arm);
        ctx.lineTo(x, y + arm);
        ctx.stroke();
      }
      ctx.restore();
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const g = geo.get();
      if (g.open >= 1 || document.hidden) return;

      // Idle (or touch): a slow wanderer keeps the field alive.
      if (now - p.last > 2600) {
        const t = now / 1000;
        p.tx = w * (0.5 + 0.34 * Math.sin(t * 0.37));
        p.ty = h * (0.42 + 0.22 * Math.sin(t * 0.61 + 1.3));
        if (p.x < -9000) {
          p.x = p.tx;
          p.y = p.ty;
        }
      }
      const ease = reduce ? 1 : 0.12;
      p.x += (p.tx - p.x) * ease;
      p.y += (p.ty - p.y) * ease;

      const t0 = loadedAt.current;
      const intro = t0 === null ? 0 : reduce ? 1 : Math.min(Math.max((now - t0 - 700) / 1600, 0), 1);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (g.open > 0) {
        drawHalf(g, -1, intro);
        drawHalf(g, 1, intro);
      } else {
        drawHalf(g, 0, intro);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [geo]);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />;
}

/* ------------------------------------------------------------------ */
/* Hero copy. Rendered once per half; the second copy is aria-hidden.   */
/* ------------------------------------------------------------------ */

function useScrambleTicker(words: string[]) {
  const [text, setText] = useState(words[0]);
  useEffect(() => {
    const glyphs = "ASYMETRI/\\+-_<>";
    let i = 0;
    let step: ReturnType<typeof setTimeout> | undefined;
    const cycle = setInterval(() => {
      i = (i + 1) % words.length;
      const target = words[i];
      let f = 0;
      const tick = () => {
        f++;
        const shown = (f / 16) * target.length;
        setText(
          target
            .split("")
            .map((c, k) =>
              k < shown || c === " "
                ? c
                : glyphs[Math.floor(Math.random() * glyphs.length)],
            )
            .join(""),
        );
        if (shown < target.length) step = setTimeout(tick, 38);
      };
      tick();
    }, 3400);
    return () => {
      clearInterval(cycle);
      if (step) clearTimeout(step);
    };
  }, [words]);
  return text;
}

function Rise({
  children,
  delay,
  play,
  className,
}: {
  children: React.ReactNode;
  delay: number;
  play: boolean;
  className?: string;
}) {
  return (
    <span className={`block overflow-hidden pb-[0.06em] ${className ?? ""}`}>
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: play ? "0%" : "110%" }}
        transition={{ duration: 1.1, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function Rule({ play, delay }: { play: boolean; delay: number }) {
  return (
    <motion.div
      className="h-px origin-left bg-white/20"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: play ? 1 : 0 }}
      transition={{ duration: 1.4, ease: EASE, delay }}
    />
  );
}

function Fade({
  children,
  delay,
  play,
  className,
}: {
  children: React.ReactNode;
  delay: number;
  play: boolean;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
      animate={play ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

function SlashCue() {
  return (
    <span className="relative inline-flex h-3.5 w-4 overflow-hidden" aria-hidden>
      <motion.span
        className="absolute inset-0 flex gap-[3px]"
        animate={{ y: ["-100%", "0%", "0%", "100%"] }}
        transition={{ duration: 2.2, repeat: Infinity, times: [0, 0.3, 0.7, 1], ease: "easeInOut" }}
      >
        <span className="h-full w-[7px] -skew-x-[26deg] bg-asymmetri-red" />
        <span className="h-full w-[3px] -skew-x-[26deg] bg-asymmetri-red" />
      </motion.span>
    </span>
  );
}

function HeroContentComponent({
  primary,
  play,
  ticker,
}: {
  primary?: boolean;
  play: boolean;
  ticker: string;
}) {
  const Heading = primary ? "h1" : "p";
  return (
    <div className="absolute inset-0 flex flex-col px-5 pt-20 pb-5 font-chakra-petch text-white sm:px-8 md:px-12 md:pt-[5.5rem] md:pb-7">
      <Fade
        play={play}
        delay={1.55}
        className="flex items-start justify-between gap-6 pb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 md:text-[11px]"
      >
        <p className="flex items-center gap-2.5">
          <span className="relative flex size-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-asymmetri-red/70" />
            <span className="relative size-1.5 rounded-full bg-asymmetri-red" />
          </span>
          Now solving
          <span className="min-w-[16ch] text-white">{ticker}</span>
        </p>
        <ol className="hidden gap-7 lg:flex">
          {pillars.map((p, i) => (
            <li key={p.name}>
              <span className="text-asymmetri-red">0{i + 1}</span> {p.name}
            </li>
          ))}
        </ol>
      </Fade>
      <Rule play={play} delay={1.2} />

      <div className="mt-auto grid items-end gap-6 md:grid-cols-[1fr_auto] md:gap-12">
        <Heading className="text-[clamp(2.4rem,5.6vw,6rem)] font-semibold uppercase leading-[0.92] tracking-[-0.01em]">
          {primary && <span className="sr-only">Asymmetri: </span>}
          <Rise play={play} delay={1.0}>
            Hard problems
          </Rise>
          <Rise play={play} delay={1.12} className="text-white/40">
            technology company
          </Rise>
        </Heading>
        <Fade play={play} delay={1.45} className="max-w-[19rem] space-y-4 pb-2">
          <p className="font-geist text-sm leading-relaxed text-white/70 md:text-[15px]">
            Engineering intelligence into the way global brands operate.
          </p>
          <a
            href="/contact-us"
            tabIndex={primary ? undefined : -1}
            className="group inline-flex items-center gap-2 border-b border-white/30 pb-1 text-sm uppercase tracking-wider transition-colors hover:border-asymmetri-red hover:text-asymmetri-red"
          >
            Bring us a hard problem
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </Fade>
      </div>

      <div className="mt-8 md:mt-10">
        <Wordmark play={play} delay={0.55} className="block h-auto w-full" />
      </div>

      <div className="mt-4">
        <Rule play={play} delay={1.3} />
      </div>
      <Fade
        play={play}
        delay={1.75}
        className="mt-3 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45 md:text-[11px]"
      >
        <span>{company.tagline}</span>
        <span className="flex items-center gap-2.5 text-white/70">
          Scroll to open <SlashCue />
        </span>
      </Fade>
    </div>
  );
}

const HeroContent = memo(HeroContentComponent);

/* ------------------------------------------------------------------ */
/* The cut: a red hairline that draws along the split, then the logo's  */
/* thick + thin slash riding the edge of the opening.                   */
/* ------------------------------------------------------------------ */

const svgPts = (pts: readonly (readonly [number, number])[]) =>
  pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

function CutOverlay({ geo }: { geo: MotionValue<SplitGeo> }) {
  const lineRef = useRef<SVGLineElement>(null);
  const thickRef = useRef<SVGPolygonElement>(null);
  const thinRef = useRef<SVGPolygonElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const paint = (g: SplitGeo) => {
    const svg = svgRef.current;
    if (!svg) return;
    const visible = g.cut > 0 && g.open < 1;
    svg.style.display = visible ? "block" : "none";
    if (!visible) return;
    svg.setAttribute("viewBox", `0 0 ${g.w} ${g.h}`);

    const len = g.cut * Math.hypot(g.w, g.h) * 0.6;
    const line = lineRef.current!;
    line.setAttribute("x1", String(g.cx - g.ux * len));
    line.setAttribute("y1", String(g.cy - g.uy * len));
    line.setAttribute("x2", String(g.cx + g.ux * len));
    line.setAttribute("y2", String(g.cy + g.uy * len));
    line.style.opacity = String(Math.max(1 - g.open * 4, 0));

    const k = Math.min(g.open * 8, 1);
    const fade = 1 - Math.min(Math.max((g.open - 0.82) / 0.18, 0), 1);
    const e = -g.a;
    thickRef.current!.setAttribute("points", svgPts(bandPoints(g, e, e + 26 * k)));
    thinRef.current!.setAttribute("points", svgPts(bandPoints(g, e + 33 * k, e + 41 * k)));
    thickRef.current!.style.opacity = String(fade * k);
    thinRef.current!.style.opacity = String(fade * k);
  };

  useMotionValueEvent(geo, "change", paint);
  useEffect(() => paint(geo.get()));

  return (
    <svg
      ref={svgRef}
      className="pointer-events-none fixed inset-0 z-[1000] h-screen w-screen"
      style={{ display: "none" }}
      preserveAspectRatio="none"
      aria-hidden
    >
      <line ref={lineRef} stroke={RED} strokeWidth={1.5} />
      <polygon ref={thickRef} fill={RED} />
      <polygon ref={thinRef} fill={RED} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */

export function HeroSplit({ loaded, split }: { loaded: boolean; split: Split }) {
  const { geo, clipA, clipB, ax, ay, bx, by } = split;
  const ticker = useScrambleTicker(NOW_SOLVING);
  const visibility = useTransform(geo, (g) => (g.open >= 1 ? "hidden" : "visible"));

  return (
    <>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: loaded ? 1 : 0 }}
        transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
        style={{ visibility }}
        className="fixed top-0 left-0 z-9 h-screen w-screen overflow-hidden"
      >
        <SymmetryField geo={geo} loaded={loaded} />
        <motion.div style={{ clipPath: clipA, x: ax, y: ay }} className="absolute inset-0">
          <HeroContent primary play={loaded} ticker={ticker} />
        </motion.div>
        <motion.div
          style={{ clipPath: clipB, x: bx, y: by }}
          className="absolute inset-0"
          aria-hidden
        >
          <HeroContent play={loaded} ticker={ticker} />
        </motion.div>
      </motion.div>
      <CutOverlay geo={geo} />
    </>
  );
}
