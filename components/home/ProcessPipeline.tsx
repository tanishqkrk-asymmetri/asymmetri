"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { ScrambleText } from "@/components/practice/ScrambleText";
import { maturityPath, processSteps } from "@/lib/site-content";
import { clamp01, scrollToProgress, useEnterProgress } from "@/components/home/os/hooks";

const pad = (n: number) => String(n).padStart(2, "0");

/** Five steps plus the face the loop lands on: white, and the next chapter's colour. */
const FACES = [
  ...processSteps.map((s) => ({ ...s, white: false })),
  { name: "Compounding", body: "Operate feeds the next Frame, and the loop runs again.", white: true },
];
const N = FACES.length; // 6: a hexagonal drum
const DEG = 360 / N;
const STEPS = processSteps.length;

/* Pinned-progress choreography. Each face holds, then the drum turns one notch. */
const T0 = 0.04;
const SEG = 0.152; // per face
const HOLD = 0.5; // share of a segment the face holds still
const LAND = T0 + STEPS * SEG; // white face is front
const OPEN: [number, number] = [LAND + 0.03, LAND + 0.15]; // white shutter opens to full screen
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Continuous face position (0 = Frame front, 5 = white face front). */
const facePos = (v: number) => {
  if (v <= T0) return 0;
  if (v >= LAND) return STEPS;
  const s = (v - T0) / SEG;
  const k = Math.floor(s);
  const f = s - k;
  return k + (f < HOLD ? 0 : ease((f - HOLD) / (1 - HOLD)));
};
/** Scroll position at which face i sits still in the window. */
const faceAt = (i: number) => (i >= STEPS ? 0.99 : T0 + i * SEG + SEG * HOLD * 0.5);

// Maturity path lights as the artefact matures through the loop.
const MATURE_AT = [0, 1.5, 3, 4, 5];

function Face({
  i,
  pos,
  shutter,
  radius,
}: {
  i: number;
  pos: MotionValue<number>;
  shutter: MotionValue<number>;
  radius: number;
}) {
  const f = FACES[i];
  // Fade with the angle away from the window; the white face stays hidden
  // until the drum is close to landing on it, and the rest fade as it opens.
  const opacity = useTransform([pos, shutter], ([v, k]: number[]) => {
    let rel = Math.abs(v - i) * DEG;
    if (f.white && v < STEPS - 0.7) return 0;
    if (!f.white) rel = Math.min(rel, Math.abs(v - (i + N)) * DEG);
    const o = 1 - clamp01(rel / 78);
    return f.white ? o : o * (1 - clamp01(k * 3.5));
  });
  return (
    <motion.li
      style={{
        opacity,
        transform: `rotateX(${-i * DEG}deg) translateZ(${radius}px)`,
        backfaceVisibility: "hidden",
      }}
      className={`absolute inset-0 border-y ${
        f.white ? "border-white bg-white text-black" : "heroDark border-white/15 bg-[#0a0a0a] text-white"
      }`}
    >
      <div className="grid h-full grid-cols-1 content-center gap-2 px-5 md:px-10 lg:grid-cols-[auto_minmax(0,1fr)_minmax(0,20rem)] lg:items-center lg:gap-10">
        <span
          className="font-mono text-[10px] uppercase tracking-[0.25em] text-asymmetri-red"
        >
          {f.white ? "Loop · again" : `${pad(i + 1)} / ${pad(STEPS)}`}
        </span>
        <h3
          className={`flex items-center gap-4 font-chakra-petch leading-[0.82] font-bold uppercase ${
            f.white
              ? "text-[10vw] md:text-[7.5vw] lg:text-[6vw] 2xl:text-[6.5rem]"
              : "text-[13.5vw] md:text-[10vw] lg:text-[8.6vw] 2xl:text-[9rem]"
          }`}
        >
          {f.name}
          {f.white && (
            <span aria-hidden className="relative hidden h-[0.7em] w-[0.5em] shrink-0 md:inline-block">
              <span className="absolute inset-y-0 left-0 w-[0.2em] -skew-x-[26deg] bg-asymmetri-red" />
              <span className="absolute inset-y-0 left-[0.3em] w-[0.07em] -skew-x-[26deg] bg-asymmetri-red" />
            </span>
          )}
        </h3>
        <p className={`max-w-xs font-geist text-sm leading-snug md:text-base ${f.white ? "text-black/70" : "text-white/65"}`}>
          {f.body}
        </p>
      </div>
    </motion.li>
  );
}

/**
 * Frame → Design → Engineer → Prove → Operate as a six-sided drum of giant
 * type. Each scroll notch turns the drum one face, with a mechanical hold
 * between turns, while the maturity path lights below. The sixth face is
 * white: the drum lands on it, then the white opens out to fill the screen
 * and becomes the Founder chapter.
 */
export function ProcessPipeline() {
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const geo = useRef({ top: 0, bottom: 0, side: 0 });
  const [radius, setRadius] = useState(200);
  const p = useSectionProgress(ref, "pin");
  const enter = useEnterProgress(ref);
  const reduce = !!useReducedMotion();
  const [active, setActive] = useState(0);
  const [tone, setTone] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stage = stageRef.current;
    const win = windowRef.current;
    if (!stage || !win) return;
    const measure = () => {
      const s = stage.getBoundingClientRect();
      const w = win.getBoundingClientRect();
      setRadius((w.height / 2) / Math.tan(Math.PI / N));
      geo.current = { top: w.top - s.top, bottom: s.bottom - w.bottom, side: w.left - s.left };
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  // The drum rolls up into Frame while the chapter arrives, then notches on scroll.
  const pos = useTransform([p, enter], ([v, e]: number[]) => facePos(v) - (1 - ease(clamp01(e))) * 0.7);
  const rotateX = useTransform(pos, (v) => v * DEG);
  const shutter = useTransform(p, (v) => ease(clamp01((v - OPEN[0]) / (OPEN[1] - OPEN[0]))));
  const clipPath = useTransform(shutter, (k) => {
    const g = geo.current;
    return `inset(${g.top * (1 - k)}px ${g.side * (1 - k)}px ${g.bottom * (1 - k)}px ${g.side * (1 - k)}px)`;
  });
  const whiteOpacity = useTransform(shutter, (k) => (k > 0 ? 1 : 0));
  const rail = useTransform(pos, (v) => clamp01(v / STEPS));

  useMotionValueEvent(pos, "change", (v) => {
    const a = Math.min(Math.max(Math.round(v), 0), N - 1);
    setActive((prev) => (prev === a ? prev : a));
  });
  useMotionValueEvent(shutter, "change", (k) => {
    const next = geo.current.top * (1 - k) < 30 ? "light" : "dark";
    setTone((prev) => (prev === next ? prev : next));
  });

  const go = (d: number) => {
    const target = Math.min(Math.max(active + d, 0), N - 1);
    scrollToProgress(ref.current, faceAt(target));
  };

  if (reduce) return <ProcessStatic />;

  const f = FACES[active];
  return (
    <section
      ref={ref}
      id="how-we-work"
      data-chapter="Process"
      data-nav="dark"
      aria-labelledby="process-title"
      className="relative h-[300vh] bg-black"
    >
      <div
        ref={stageRef}
        data-nav={tone}
        className="sticky top-0 flex h-screen flex-col justify-between overflow-hidden bg-black pt-20 pb-5 font-chakra-petch text-white md:pt-24 md:pb-16"
      >
        {/* Seam with "How we operate" (also black): a red rule draws across as the chapter arrives. */}
        <motion.span
          aria-hidden
          style={{ scaleX: enter }}
          className="absolute inset-x-0 top-0 z-10 h-px origin-left bg-asymmetri-red"
        />
        <header className="relative z-10 grid gap-3 px-6 md:px-16 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-10">
          <div>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-asymmetri-red md:mb-4 md:text-xs">
              <ScrambleText text="Process · One accountable loop" />
            </p>
            <h2
              id="process-title"
              className="text-[min(8vw,2.6rem)] leading-[0.92] font-bold uppercase md:text-5xl xl:text-6xl [@media(min-width:768px)_and_(max-height:780px)]:text-[2.6rem]"
            >
              From opportunity to <span className="text-asymmetri-red">operating capability.</span>
            </h2>
          </div>
          <p className="hidden max-w-md font-geist text-base text-white/60 md:block">
            Strategy, design and engineering stay connected from the first question to the production
            system. Creative exploration up front. Production discipline all the way through.
          </p>
        </header>

        {/* The drum. The wrapper is taller than the window so neighbouring faces show, fading out. */}
        <div className="relative z-30 [mask-image:linear-gradient(to_bottom,transparent,#000_22%,#000_78%,transparent)] py-[9vh] [@media(max-height:780px)]:py-[6vh]">
          <div
            ref={windowRef}
            className="relative mx-3 h-[30vh] md:mx-10 md:h-[34vh] [@media(max-height:780px)]:h-[27vh]"
            style={{ perspective: "1800px" }}
          >
            <motion.ol
              // Pull the drum back by its radius so the front face sits at true size.
              style={{ z: -radius, rotateX, transformStyle: "preserve-3d" }}
              className="absolute inset-0"
            >
              {FACES.map((face, i) => (
                <Face key={face.name} i={i} pos={pos} shutter={shutter} radius={radius} />
              ))}
            </motion.ol>
            {/* index marks: the reading window */}
            <span aria-hidden className="absolute top-1/2 -left-3 h-[2px] w-3 bg-asymmetri-red md:-left-10 md:w-8" />
            <span aria-hidden className="absolute top-1/2 -right-3 h-[2px] w-3 bg-asymmetri-red md:-right-10 md:w-8" />
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-3 px-6 md:flex-row md:items-end md:justify-between md:px-16">
          <div className="min-w-0">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
              Maturity path
            </p>
            <ol className="flex flex-wrap gap-x-2.5 gap-y-1 font-mono text-[10px] uppercase tracking-[0.18em] md:text-xs">
              {maturityPath.map((w, i) => (
                <PathWord key={w} pos={pos} i={i} word={w} />
              ))}
            </ol>
            <div className="mt-2 h-px w-full bg-white/15 md:w-[28rem]">
              <motion.div style={{ scaleX: rail }} className="h-px origin-left bg-asymmetri-red" />
            </div>
          </div>
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em]">
            <span className="text-white/50" aria-live="polite">
              {f.white ? "Loop complete" : `Step ${pad(active + 1)} / ${pad(STEPS)} · ${f.name}`}
            </span>
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={active === 0}
              aria-label="Previous step"
              className="grid size-9 place-items-center border border-white/25 text-white transition-colors hover:border-asymmetri-red hover:bg-asymmetri-red disabled:opacity-30 disabled:hover:border-white/25 disabled:hover:bg-transparent"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              disabled={active === N - 1}
              aria-label="Next step"
              className="grid size-9 place-items-center border border-white/25 text-white transition-colors hover:border-asymmetri-red hover:bg-asymmetri-red disabled:opacity-30 disabled:hover:border-white/25 disabled:hover:bg-transparent"
            >
              ↓
            </button>
          </div>
        </div>

        {/* The white face opens out to fill the screen: the seam into Founder. */}
        <motion.div
          aria-hidden
          style={{ clipPath, opacity: whiteOpacity }}
          className="pointer-events-none absolute inset-0 z-20 bg-white"
        />
      </div>
    </section>
  );
}

function PathWord({ pos, i, word }: { pos: MotionValue<number>; i: number; word: string }) {
  const last = i === maturityPath.length - 1;
  const color = useTransform(pos, (v) =>
    v >= MATURE_AT[i] - 0.25 ? (last ? "#cd1717" : "#ffffff") : "rgba(255,255,255,0.28)",
  );
  return (
    <motion.li style={{ color }} className="flex items-center gap-2.5">
      {word}
      {!last && <span className="text-white/25">→</span>}
    </motion.li>
  );
}

/** Reduced motion: the same faces, flat and in order, ending on white. */
function ProcessStatic() {
  return (
    <section
      id="how-we-work"
      data-chapter="Process"
      data-nav="dark"
      aria-labelledby="process-title"
      className="relative bg-black pt-24 font-chakra-petch text-white"
    >
      <header className="px-6 pb-10 md:px-16">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-asymmetri-red md:text-xs">
          Process · One accountable loop
        </p>
        <h2 id="process-title" className="text-4xl leading-[0.92] font-bold uppercase md:text-6xl">
          From opportunity to <span className="text-asymmetri-red">operating capability.</span>
        </h2>
        <p className="mt-5 max-w-md font-geist text-base text-white/60">
          Strategy, design and engineering stay connected from the first question to the production system.
          Creative exploration up front. Production discipline all the way through.
        </p>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 md:text-xs">
          {maturityPath.join(" → ")}
        </p>
      </header>
      <ol>
        {FACES.map((f, i) => (
          <li
            key={f.name}
            data-nav={f.white ? "light" : undefined}
            className={`grid gap-2 border-t px-6 py-8 md:grid-cols-[auto_1fr_20rem] md:items-center md:gap-10 md:px-16 ${
              f.white ? "border-white bg-white py-16 text-black" : "border-white/15"
            }`}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-asymmetri-red">
              {f.white ? "Loop · again" : `${pad(i + 1)} / ${pad(STEPS)}`}
            </span>
            <h3 className="text-5xl leading-[0.85] font-bold uppercase md:text-7xl">{f.name}</h3>
            <p className={`font-geist text-sm md:text-base ${f.white ? "text-black/70" : "text-white/65"}`}>{f.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
