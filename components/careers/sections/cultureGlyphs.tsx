"use client";

import { motion, type Transition } from "motion/react";
import type { CultureGlyph as Kind } from "../content";

const RED = "#cd1717";
const W = "#ffffff";

type Props = { kind: Kind; active: boolean; reduce: boolean; className?: string };

/**
 * One small animated mark per culture rule. 120×120, stroke-first, white with
 * a single red accent. Loops while `active`; static (final state) otherwise.
 */
export function CultureGlyph({ kind, active, reduce, className }: Props) {
  const run = active && !reduce;
  const loop = (duration: number, extra: Transition = {}): Transition =>
    run
      ? { duration, repeat: Infinity, ease: "easeInOut", ...extra }
      : { duration: 0 };

  const svg = (children: React.ReactNode) => (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden>
      {children}
    </svg>
  );

  switch (kind) {
    case "flat": {
      // A pyramid of six blocks collapses into one flat row.
      const pyramid = [
        [52, 30],
        [38, 50],
        [66, 50],
        [24, 70],
        [52, 70],
        [80, 70],
      ];
      const flat = pyramid.map((_, i) => [4 + i * 19, 70]);
      return svg(
        <>
          <line x1="2" y1="92" x2="118" y2="92" stroke={W} strokeOpacity={0.25} />
          {pyramid.map(([x, y], i) => (
            <motion.rect
              key={i}
              width="16"
              height="16"
              stroke={i === 0 ? RED : W}
              fill={i === 0 ? RED : "transparent"}
              strokeWidth="1.5"
              initial={false}
              animate={
                run
                  ? { x: [x, x, flat[i][0], flat[i][0], x], y: [y, y, flat[i][1], flat[i][1], y] }
                  : { x: flat[i][0], y: flat[i][1] }
              }
              transition={loop(4.2, { times: [0, 0.2, 0.45, 0.85, 1], delay: i * 0.04 })}
            />
          ))}
        </>,
      );
    }
    case "loop":
      return svg(
        <>
          <circle cx="60" cy="60" r="38" stroke={W} strokeOpacity={0.25} />
          <motion.g
            animate={run ? { rotate: 360 } : { rotate: 0 }}
            transition={loop(6, { ease: "linear" })}
          >
            <path d="M60 22a38 38 0 0 1 36 26" stroke={W} strokeWidth="1.5" />
            <path d="M90 42l6 6 2-9" stroke={W} strokeWidth="1.5" />
            <path d="M60 98a38 38 0 0 1-36-26" stroke={W} strokeWidth="1.5" />
            <path d="M30 78l-6-6-2 9" stroke={W} strokeWidth="1.5" />
            <circle cx="60" cy="22" r="4" fill={RED} />
          </motion.g>
          <text x="60" y="64" textAnchor="middle" fill={W} fontSize="10" fontFamily="monospace" opacity={0.6}>
            GIVE·GET
          </text>
        </>,
      );
    case "async": {
      const clocks = [
        { cx: 26, speed: 3, start: 40 },
        { cx: 60, speed: 5, start: 160 },
        { cx: 94, speed: 7, start: 280 },
      ];
      return svg(
        <>
          {clocks.map((c, i) => (
            <g key={i}>
              <circle cx={c.cx} cy="60" r="15" stroke={i === 1 ? RED : W} strokeWidth="1.5" />
              <motion.line
                x1={c.cx}
                y1="60"
                x2={c.cx}
                y2="49"
                stroke={i === 1 ? RED : W}
                strokeWidth="1.5"
                style={{ originX: 0.5, originY: 1 }}
                initial={{ rotate: c.start }}
                animate={run ? { rotate: c.start + 360 } : { rotate: c.start }}
                transition={loop(c.speed, { ease: "linear" })}
              />
              <text x={c.cx} y="92" textAnchor="middle" fill={W} fontSize="8" fontFamily="monospace" opacity={0.5}>
                {["Here", "There", "Elsewhere"][i]}
              </text>
            </g>
          ))}
        </>,
      );
    }
    case "ship":
      return svg(
        <>
          <rect x="10" y="52" width="100" height="16" stroke={W} strokeWidth="1.5" />
          <motion.rect
            x="12"
            y="54"
            height="12"
            fill={W}
            initial={false}
            animate={run ? { width: [0, 78, 78, 0] } : { width: 78 }}
            transition={loop(3.6, { times: [0, 0.45, 0.9, 1] })}
          />
          <line x1="90" y1="44" x2="90" y2="76" stroke={RED} strokeWidth="1.5" strokeDasharray="3 3" />
          <motion.g
            initial={false}
            animate={run ? { opacity: [0, 0, 1, 1, 0], y: [6, 6, 0, 0, 0] } : { opacity: 1, y: 0 }}
            transition={loop(3.6, { times: [0, 0.44, 0.5, 0.9, 1] })}
          >
            <rect x="64" y="24" width="52" height="16" fill={RED} />
            <text x="90" y="35" textAnchor="middle" fill={W} fontSize="9" fontFamily="monospace">
              SHIPPED
            </text>
          </motion.g>
          <text x="10" y="88" fill={W} fontSize="8" fontFamily="monospace" opacity={0.5}>
            80% · ITERATE →
          </text>
        </>,
      );
    case "fork": {
      const branches = [
        "M46 60 C 66 60, 70 28, 108 26",
        "M46 60 C 66 60, 74 60, 108 60",
        "M46 60 C 66 60, 70 92, 108 94",
      ];
      return svg(
        <>
          <line x1="10" y1="60" x2="46" y2="60" stroke={W} strokeWidth="1.5" />
          <circle cx="46" cy="60" r="3.5" fill={W} />
          {branches.map((d, i) => (
            <path key={`g${i}`} d={d} stroke={W} strokeOpacity={0.25} strokeDasharray="3 4" />
          ))}
          <motion.path
            d={branches[0]}
            stroke={RED}
            strokeWidth="2"
            initial={false}
            animate={run ? { pathLength: [0, 0, 1, 1] } : { pathLength: 1 }}
            transition={loop(3.2, { times: [0, 0.25, 0.65, 1] })}
          />
          <circle cx="108" cy="26" r="4" fill={RED} />
        </>,
      );
    }
    case "signal":
      return svg(
        <>
          {[0, 1, 2].map((i) => (
            <motion.circle
              key={i}
              cx="60"
              cy="60"
              r="40"
              stroke={W}
              strokeWidth="1.2"
              initial={false}
              animate={run ? { scale: [0.1, 1], opacity: [0.9, 0] } : { scale: 0.35 + i * 0.3, opacity: 0.5 - i * 0.12 }}
              transition={loop(2.4, { delay: i * 0.8, ease: "easeOut" })}
            />
          ))}
          <circle cx="60" cy="60" r="7" fill={RED} />
          <text x="60" y="112" textAnchor="middle" fill={W} fontSize="8" fontFamily="monospace" opacity={0.5}>
            ? → ASK
          </text>
        </>,
      );
    case "untangle": {
      const tangled = "M10 60 C 40 0, 30 120, 60 60 S 100 0, 70 70 S 120 110, 110 60";
      const straight = "M10 60 C 30 60, 40 60, 60 60 S 80 60, 85 60 S 100 60, 110 60";
      return svg(
        <>
          <motion.path
            stroke={W}
            strokeWidth="1.6"
            initial={false}
            animate={run ? { d: [tangled, tangled, straight, straight, tangled] } : { d: straight }}
            transition={loop(4.4, { times: [0, 0.2, 0.55, 0.88, 1] })}
          />
          <circle cx="10" cy="60" r="3" fill={W} />
          <circle cx="110" cy="60" r="4" fill={RED} />
        </>,
      );
    }
    case "burst": {
      const n = 10;
      return svg(
        <>
          {Array.from({ length: n }, (_, i) => {
            const a = (i / n) * Math.PI * 2;
            const dx = Math.round(Math.cos(a) * 400) / 10;
            const dy = Math.round(Math.sin(a) * 400) / 10;
            return (
              <motion.polygon
                key={i}
                points="57,66 61,66 65,54 61,54"
                fill={i % 3 === 0 ? RED : W}
                initial={false}
                animate={
                  run
                    ? { x: [0, dx, dx], y: [0, dy, dy], opacity: [0, 1, 0], rotate: [0, 0, 90] }
                    : { x: Math.round(dx * 8) / 10, y: Math.round(dy * 8) / 10, opacity: 1, rotate: 0 }
                }
                transition={loop(2.2, { times: [0, 0.4, 1], ease: "easeOut", repeatDelay: 0.4 })}
              />
            );
          })}
          <polygon points="55,70 61,70 67,50 61,50" fill={RED} />
        </>,
      );
    }
  }
}
