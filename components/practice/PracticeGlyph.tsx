"use client";

import { motion } from "motion/react";
import { useReduceMotion as useReducedMotion } from "@/hooks/useReduceMotion";
import type { PracticeGlyphKind } from "@/lib/practices";

type Props = {
  kind: PracticeGlyphKind;
  /** Active = hovered/focused: the glyph runs its full animation in red. */
  active?: boolean;
  className?: string;
  /** Base stroke colour when idle. */
  color?: string;
};

const RED = "#cd1717";

/**
 * Small animated signature mark for each practice: used in the nav dropdown,
 * the home page index and the practice pages. 64×64 viewBox, stroke only.
 */
export function PracticeGlyph({
  kind,
  active = false,
  className,
  color = "currentColor",
}: Props) {
  const reduce = useReducedMotion();
  const stroke = active ? RED : color;
  const loop = (d: number) =>
    reduce ? { duration: 0 } : { duration: d, repeat: Infinity, ease: "linear" as const };

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden
      strokeWidth={1.5}
      strokeLinecap="square"
    >
      {kind === "mesh" && <Mesh stroke={stroke} active={active} loop={loop} />}
      {kind === "build" && <Build stroke={stroke} active={active} reduce={!!reduce} />}
      {kind === "map" && <MapGlyph stroke={stroke} active={active} />}
      {kind === "lab" && <Lab stroke={stroke} active={active} loop={loop} />}
    </svg>
  );
}

type Loop = (d: number) => object;

const NODES: [number, number][] = [
  [10, 14],
  [34, 8],
  [54, 22],
  [22, 36],
  [46, 44],
  [14, 56],
  [38, 58],
];
const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [0, 3],
  [1, 3],
  [2, 4],
  [3, 4],
  [3, 5],
  [4, 6],
  [5, 6],
];

function Mesh({ stroke, active, loop }: { stroke: string; active: boolean; loop: Loop }) {
  return (
    <g>
      {EDGES.map(([a, b], i) => (
        <line
          key={i}
          x1={NODES[a][0]}
          y1={NODES[a][1]}
          x2={NODES[b][0]}
          y2={NODES[b][1]}
          stroke={stroke}
          strokeOpacity={0.45}
        />
      ))}
      {NODES.map(([x, y], i) => (
        <rect
          key={i}
          x={x - 2.5}
          y={y - 2.5}
          width={5}
          height={5}
          fill={i === 3 ? stroke : "#00000000"}
          stroke={stroke}
        />
      ))}
      {/* Packets travelling the mesh */}
      {active &&
        [
          [0, 1, 2, 4, 6],
          [5, 3, 1, 2],
        ].map((path, k) => (
          <motion.rect
            key={k}
            width={4}
            height={4}
            fill="#ffffff"
            initial={false}
            animate={{
              x: path.map((n) => NODES[n][0] - 2),
              y: path.map((n) => NODES[n][1] - 2),
            }}
            transition={{ ...loop(1.6 + k * 0.4), delay: k * 0.3 }}
          />
        ))}
    </g>
  );
}

function Build({ stroke, active, reduce }: { stroke: string; active: boolean; reduce: boolean }) {
  const blocks = [
    { x: 8, y: 44, w: 48, h: 10 },
    { x: 8, y: 30, w: 30, h: 10 },
    { x: 42, y: 30, w: 14, h: 10 },
    { x: 8, y: 16, w: 20, h: 10 },
    { x: 32, y: 16, w: 24, h: 10 },
  ];
  return (
    <g>
      <rect x={4} y={6} width={56} height={52} stroke={stroke} strokeOpacity={0.35} />
      {blocks.map((b, i) => (
        <motion.rect
          key={i}
          {...b}
          stroke={stroke}
          initial={false}
          animate={
            active && !reduce
              ? { y: [-18, 0], opacity: [0, 1] }
              : { y: 0, opacity: 1 }
          }
          transition={{
            duration: 0.45,
            delay: active ? i * 0.12 : 0,
            ease: [0.16, 1, 0.3, 1],
            repeat: active && !reduce ? Infinity : 0,
            repeatDelay: 1.2,
          }}
          fill={i === 2 && active ? stroke : "#00000000"}
        />
      ))}
    </g>
  );
}

const TANGLE =
  "M6 32 C 14 6, 22 58, 30 30 S 40 4, 46 36 S 54 60, 58 32";
const CLEAN = "M6 32 C 14 32, 22 32, 30 32 S 40 32, 46 32 S 54 32, 58 32";
const TANGLE2 =
  "M6 20 C 18 50, 26 4, 34 40 S 44 60, 50 14 S 56 30, 58 44";
const CLEAN2 = "M6 20 C 18 20, 26 20, 34 20 S 44 20, 50 20 S 56 20, 58 20";
const TANGLE3 =
  "M6 46 C 12 18, 24 62, 32 22 S 46 10, 48 52 S 56 40, 58 18";
const CLEAN3 = "M6 46 C 12 46, 24 46, 32 46 S 46 46, 48 46 S 56 46, 58 46";

function MapGlyph({ stroke, active }: { stroke: string; active: boolean }) {
  const t = { duration: 0.7, ease: [0.65, 0, 0.35, 1] as const };
  return (
    <g>
      {[
        [TANGLE2, CLEAN2],
        [TANGLE, CLEAN],
        [TANGLE3, CLEAN3],
      ].map(([a, b], i) => (
        <motion.path
          key={i}
          initial={false}
          animate={{ d: active ? b : a }}
          transition={{ ...t, delay: i * 0.06 }}
          stroke={stroke}
          strokeOpacity={i === 1 ? 1 : 0.5}
        />
      ))}
      <rect x={3} y={29} width={6} height={6} fill={stroke} />
      <motion.rect
        width={6}
        height={6}
        y={29}
        initial={false}
        animate={{ x: active ? 55 : 30 }}
        transition={t}
        stroke={stroke}
        fill="#00000000"
      />
    </g>
  );
}

function Lab({ stroke, active, loop }: { stroke: string; active: boolean; loop: Loop }) {
  // Two out-of-phase waves on an oscilloscope grid.
  const wave = (phase: number, amp: number) => {
    let d = "";
    for (let x = 4; x <= 60; x += 2) {
      const y = 32 + Math.sin((x / 56) * Math.PI * 3 + phase) * amp;
      d += `${x === 4 ? "M" : "L"}${x} ${y.toFixed(2)} `;
    }
    return d;
  };
  return (
    <g>
      <line x1={4} y1={32} x2={60} y2={32} stroke={stroke} strokeOpacity={0.25} />
      <line x1={32} y1={6} x2={32} y2={58} stroke={stroke} strokeOpacity={0.25} />
      <circle cx={32} cy={32} r={24} stroke={stroke} strokeOpacity={0.3} />
      <motion.path
        initial={false}
        animate={{ d: active ? [wave(0, 14), wave(Math.PI, 14), wave(Math.PI * 2, 14)] : wave(0, 6) }}
        transition={active ? loop(1.4) : { duration: 0.4 }}
        stroke={stroke}
      />
      <motion.path
        initial={false}
        animate={{ d: active ? [wave(Math.PI / 2, 8), wave(Math.PI * 1.5, 8), wave(Math.PI * 2.5, 8)] : wave(Math.PI / 2, 3) }}
        transition={active ? loop(2.1) : { duration: 0.4 }}
        stroke={stroke}
        strokeOpacity={0.5}
      />
    </g>
  );
}
