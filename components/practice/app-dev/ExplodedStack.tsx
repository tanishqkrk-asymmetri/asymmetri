"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { ScrambleText } from "@/components/practice/ScrambleText";
import { layers } from "./content";
import { clamp01, easeOut, useEnterProgress } from "./hooks";

const pad = (n: number) => String(n).padStart(2, "0");
const N = layers.length;

// Timeline of the pinned scene (0..1).
const OPEN = [0.06, 0.24]; // plates separate
const READ = [0.26, 0.84]; // each layer gets a turn
const CLOSE = [0.86, 0.97]; // collapse back into one app

function activeAt(v: number) {
  if (v < READ[0] || v > READ[1]) return -1;
  return Math.min(N - 1, Math.floor(((v - READ[0]) / (READ[1] - READ[0])) * N));
}

/* What each plate shows: a tiny drawing of that layer. */
function PlateArt({ k }: { k: (typeof layers)[number]["key"] }) {
  const s = "rgba(255,255,255,0.55)";
  switch (k) {
    case "interface":
      return (
        <svg viewBox="0 0 200 130" className="h-full w-full">
          <rect x="10" y="10" width="180" height="14" fill="none" stroke={s} />
          <rect x="14" y="14" width="6" height="6" fill="#cd1717" />
          <rect x="10" y="32" width="110" height="34" fill="none" stroke={s} />
          <rect x="16" y="40" width="70" height="7" fill="rgba(255,255,255,0.8)" />
          <rect x="16" y="52" width="46" height="4" fill={s} />
          <rect x="128" y="32" width="62" height="34" fill="rgba(205,23,23,0.85)" />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={10 + i * 62} y="74" width="56" height="26" fill="none" stroke={s} />
          ))}
          <rect x="140" y="108" width="50" height="12" fill="#ffffff" />
        </svg>
      );
    case "api":
      return (
        <svg viewBox="0 0 200 130" className="h-full w-full" fill="none" stroke={s}>
          <rect x="85" y="50" width="30" height="30" stroke="#cd1717" strokeWidth="2" />
          {[
            [20, 18],
            [20, 100],
            [170, 18],
            [170, 100],
            [100, 8],
            [100, 114],
          ].map(([x, y], i) => (
            <g key={i}>
              <line x1="100" y1="65" x2={x} y2={y} strokeDasharray="3 3" />
              <rect x={x - 7} y={y - 7} width="14" height="14" fill="#0a0a0a" />
            </g>
          ))}
          <text x="100" y="69" fill="#fff" stroke="none" fontSize="9" textAnchor="middle" fontFamily="monospace">
            API
          </text>
        </svg>
      );
    case "data":
      return (
        <svg viewBox="0 0 200 130" className="h-full w-full" fill="none" stroke={s}>
          {Array.from({ length: 6 }, (_, r) =>
            Array.from({ length: 8 }, (_, c) => (
              <rect
                key={`${r}-${c}`}
                x={14 + c * 22}
                y={12 + r * 18}
                width="18"
                height="13"
                fill={(r * 3 + c * 5) % 11 === 0 ? "rgba(205,23,23,0.85)" : "none"}
              />
            )),
          )}
        </svg>
      );
    case "cloud":
      return (
        <svg viewBox="0 0 200 130" className="h-full w-full" fill="none" stroke={s}>
          {[0, 1, 2].map((r) => (
            <g key={r}>
              <rect x={12 + r * 62} y="14" width="54" height="102" strokeDasharray="4 3" />
              {[0, 1, 2, 3].map((c) => (
                <rect
                  key={c}
                  x={20 + r * 62}
                  y={24 + c * 22}
                  width="38"
                  height="14"
                  fill={r === 1 && c === 1 ? "#cd1717" : "rgba(255,255,255,0.06)"}
                />
              ))}
            </g>
          ))}
        </svg>
      );
    case "observability":
      return (
        <svg viewBox="0 0 200 130" className="h-full w-full" fill="none">
          <path
            d="M10 90 L30 84 L50 88 L70 60 L90 72 L110 40 L130 58 L150 52 L170 30 L190 36"
            stroke="#fff"
            strokeWidth="1.5"
          />
          <line x1="10" y1="48" x2="190" y2="48" stroke="#cd1717" strokeDasharray="4 3" />
          {Array.from({ length: 18 }, (_, i) => (
            <rect key={i} x={10 + i * 10} y={104} width="6" height={6 + ((i * 7) % 12)} fill="rgba(255,255,255,0.35)" />
          ))}
        </svg>
      );
  }
}

function Plate({
  p,
  i,
  active,
  reduce,
}: {
  p: MotionValue<number>;
  i: number;
  active: boolean;
  reduce: boolean;
}) {
  const layer = layers[i];
  // Interface sits on top; observability is the floor everything stands on.
  const level = N - 1 - i;
  const gap = 64;
  const z = useTransform(p, (v) => {
    if (reduce) return level * gap;
    const open = easeOut(clamp01((v - OPEN[0]) / (OPEN[1] - OPEN[0])));
    const close = easeOut(clamp01((v - CLOSE[0]) / (CLOSE[1] - CLOSE[0])));
    const t = open * (1 - close);
    return level * (4 + t * (gap - 4));
  });
  return (
    <motion.div
      className="absolute inset-0"
      style={{ translateZ: z, transformStyle: "preserve-3d" }}
    >
      <motion.div
        animate={{ translateZ: active && !reduce ? 28 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className={`absolute inset-0 border transition-[background-color,border-color,box-shadow] duration-500 ${
          active
            ? "border-asymmetri-red bg-[#1a0606]/90 shadow-[0_0_80px_-10px_rgba(205,23,23,0.7)]"
            : "border-white/30 bg-[#0d0d0d]/60"
        }`}
      >
        <div className="absolute inset-[6%]">
          <PlateArt k={layer.key} />
        </div>
        <span
          className={`absolute top-1 left-full ml-4 font-mono text-[9px] uppercase tracking-[0.25em] whitespace-nowrap md:text-[10px] ${
            active ? "text-asymmetri-red" : "text-white/50"
          }`}
        >
          L{pad(i + 1)} · {layer.name}
        </span>
      </motion.div>
    </motion.div>
  );
}

/**
 * Exploded view: one application pulls apart into its five layers in CSS 3D,
 * each layer takes the light while we name what we build there, then the
 * stack snaps back together into a single product.
 */
export function ExplodedStack() {
  const ref = useRef<HTMLElement>(null);
  const p = useSectionProgress(ref);
  const enter = useEnterProgress(ref);
  const reduce = !!useReducedMotion();
  const [active, setActive] = useState(-1);
  useMotionValueEvent(p, "change", (v) => {
    const a = activeAt(v);
    if (a !== active) setActive(a);
  });

  // Diagonal hard wipe from the white manifesto into the dark stage.
  const clipPath = useTransform(enter, (t) => {
    const a = -45 + clamp01(t * 1.1) * 190;
    return `polygon(0 0, ${a}% 0, ${a - 40}% 100%, 0 100%)`;
  });
  const rotateZ = useTransform(p, [0, 1], [-38, -28]);
  const rotateX = useTransform(p, [0, 0.5, 1], [62, 56, 62]);
  const state = useTransform(p, (v): string =>
    v < OPEN[0] ? "assembled" : v < READ[0] ? "exploding" : v < CLOSE[0] ? "exploded" : "reassembling",
  );

  const shown = active < 0 ? null : layers[active];

  return (
    <section
      ref={ref}
      data-chapter="Architecture"
      aria-labelledby="ad-arch"
      className="relative h-[420vh] bg-white"
    >
      <motion.div
        style={{ clipPath: reduce ? undefined : clipPath }}
        className="heroDark sticky top-0 grid h-screen grid-rows-[auto_1fr_auto] overflow-hidden bg-black px-6 pt-20 pb-8 text-white md:px-16 lg:grid-cols-[1fr_1.25fr] lg:grid-rows-1 lg:items-center lg:gap-10"
      >
        <div className="relative z-10 space-y-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-asymmetri-red md:text-xs">
            <ScrambleText text="Exploded view · Architecture" />
          </p>
          <h2 id="ad-arch" className="font-chakra-petch text-4xl leading-[0.92] font-bold uppercase md:text-6xl xl:text-7xl">
            One app.
            <br />
            <span className="text-asymmetri-red">Five layers</span> deep.
          </h2>
          <p className="hidden max-w-md font-geist text-base leading-relaxed text-white/65 md:block md:text-lg">
            What people see is the top plate. What keeps it fast, safe and running is underneath, and
            we build all of it.
          </p>
          <ol className="hidden max-w-md border-t border-white/15 lg:block">
            {layers.map((l, i) => (
              <li
                key={l.key}
                className={`grid grid-cols-[2.5rem_1fr] gap-x-3 border-b border-white/15 py-3 transition-colors duration-300 ${
                  active === i ? "text-white" : "text-white/40"
                }`}
              >
                <span className={`font-mono text-[10px] ${active === i ? "text-asymmetri-red" : ""}`}>
                  L{pad(i + 1)}
                </span>
                <span>
                  <span className="block font-chakra-petch text-lg font-bold uppercase">{l.name}</span>
                  <span
                    className={`grid font-geist text-sm transition-[grid-template-rows,opacity] duration-500 ${
                      active === i || reduce ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <span className="overflow-hidden text-white/70">{l.builds}</span>
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* 3D stage */}
        <div className="relative flex min-h-0 items-center justify-center" aria-hidden>
          <div className="relative aspect-[200/130] w-[min(58vw,38vh)] md:w-[min(40vw,58vh)]" style={{ perspective: 1800 }}>
            <motion.div
              className="absolute inset-0"
              style={{ rotateX: reduce ? 58 : rotateX, rotateZ: reduce ? -34 : rotateZ, transformStyle: "preserve-3d" }}
            >
              {layers.map((l, i) => (
                <Plate key={l.key} p={p} i={i} active={active === i} reduce={reduce} />
              ))}
            </motion.div>
          </div>
          <div className="absolute right-0 bottom-0 hidden font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 md:block">
            stack · <motion.span className="text-white">{state}</motion.span>
          </div>
        </div>

        {/* Mobile and tablet: the active layer's card under the stage */}
        <div className="min-h-[7.5rem] border-t border-white/15 pt-4 lg:hidden">
          {shown ? (
            <Readout key={shown.key} i={active}>
              <span className="block font-chakra-petch text-xl font-bold uppercase">{shown.name}</span>
              <span className="mt-1 block font-geist text-sm text-white/70">{shown.builds}</span>
            </Readout>
          ) : (
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              Scroll to take it apart ↓
            </p>
          )}
        </div>
      </motion.div>
      {/* Every layer stays in the DOM for readers on small screens too. */}
      <ul className="sr-only lg:hidden">
        {layers.map((l) => (
          <li key={l.key}>
            {l.name}: {l.builds}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Readout({ i, children }: { i: number; children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-[2.5rem_1fr] gap-x-3"
    >
      <span className="pt-1 font-mono text-[10px] text-asymmetri-red">L{pad(i + 1)}</span>
      <span>{children}</span>
    </motion.div>
  );
}
