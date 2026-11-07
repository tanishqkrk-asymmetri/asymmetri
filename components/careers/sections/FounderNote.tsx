"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useTransform, type MotionValue } from "motion/react";
import { MaskLines } from "@/components/practice/MaskLines";
import { ScrambleText } from "@/components/practice/ScrambleText";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { useReduceMotion } from "@/hooks/useReduceMotion";
import { founderNote } from "../content";

const EASE = [0.16, 1, 0.3, 1] as const;
const TEETH = 12;
const C = 120;
const R_HUB = 30;
const R_ROOT = 70;
const R_TIP = 92;
/** The one tooth that turns red and refuses to go back. */
const MISFIT = 2;

const rad = (d: number) => (d * Math.PI) / 180;
const pt = (r: number, a: number) =>
  `${(C + r * Math.cos(rad(a))).toFixed(2)},${(C + r * Math.sin(rad(a))).toFixed(2)}`;

/** One shard: a ring segment with its tooth, as a closed polygon. */
function shardPath(i: number) {
  const step = 360 / TEETH;
  const a0 = i * step - 90;
  const a1 = a0 + step;
  const mid = a0 + step / 2;
  const tw = step * 0.24;
  const arc = (r: number, from: number, to: number, n = 4) =>
    Array.from({ length: n + 1 }, (_, k) => pt(r, from + ((to - from) * k) / n));
  return [
    ...arc(R_HUB, a0, a1),
    pt(R_ROOT, a1),
    pt(R_ROOT, mid + tw * 1.25),
    pt(R_TIP, mid + tw * 0.8),
    pt(R_TIP, mid - tw * 0.8),
    pt(R_ROOT, mid - tw * 1.25),
    pt(R_ROOT, a0),
  ].join(" ");
}

// Deterministic scatter so server and client agree.
const jitter = (i: number, k: number) => Math.abs(Math.sin(i * 12.9898 + k * 78.233) * 43758.5453) % 1;

function Shard({ p, i }: { p: MotionValue<number>; i: number }) {
  const step = 360 / TEETH;
  const a = rad(i * step - 90 + step / 2);
  const dist = 18 + jitter(i, 1) * 34;
  const start = 0.28 + jitter(i, 2) * 0.12;
  const end = start + 0.22;
  const misfit = i === MISFIT;
  const x = useTransform(p, [start, end], [0, Math.cos(a) * dist * (misfit ? 1.35 : 1)]);
  const y = useTransform(p, [start, end], [0, Math.sin(a) * dist * (misfit ? 1.35 : 1)]);
  const rotate = useTransform(p, [start, end], [0, (jitter(i, 3) - 0.5) * (misfit ? 30 : 90)]);
  const opacity = useTransform(p, [start, end], [1, misfit ? 1 : 0.18]);
  const fill = useTransform(p, [start, end], ["#0a0a0a", misfit ? "#cd1717" : "#0a0a0a"]);
  return (
    <motion.polygon
      points={shardPath(i)}
      style={{ x, y, rotate, opacity, fill, transformBox: "fill-box", transformOrigin: "center" }}
      stroke="#ffffff"
      strokeWidth={1.5}
      strokeLinejoin="round"
    />
  );
}

function BrokenCog({ p, reduce }: { p: MotionValue<number>; reduce: boolean }) {
  const spin = useTransform(p, [0, 0.3], [0, 45]);
  const slash = useTransform(p, [0.5, 0.66], [0, 1]);
  const label = useTransform(p, [0.55, 0.7], [0, 1]);
  const before = useTransform(p, [0.2, 0.32], [1, 0]);
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[22rem] lg:max-w-[28rem]">
      <svg viewBox="0 0 240 240" className="h-full w-full overflow-visible" aria-hidden>
        {/* Guide circle: where the cog used to be. */}
        <circle cx={C} cy={C} r={R_TIP + 8} fill="none" stroke="#000" strokeOpacity={0.12} strokeDasharray="2 6" />
        <motion.g style={reduce ? undefined : { rotate: spin }}>
          {Array.from({ length: TEETH }, (_, i) => (
            <Shard key={i} p={p} i={i} />
          ))}
        </motion.g>
        {/* What's left in the middle: the logo's two slashes. */}
        <motion.g style={{ opacity: slash, scale: slash }}>
          <polygon points="106,146 118,146 132,94 120,94" fill="#cd1717" />
          <polygon points="122,146 127,146 141,94 136,94" fill="#cd1717" />
        </motion.g>
      </svg>
      <motion.span
        style={{ opacity: before }}
        className="absolute bottom-0 left-0 font-mono text-[10px] uppercase tracking-[0.25em] text-black/50"
      >
        fig. 01 · cog, standard issue
      </motion.span>
      <motion.span
        style={{ opacity: label }}
        className="absolute bottom-0 left-0 font-mono text-[10px] uppercase tracking-[0.25em] text-asymmetri-red"
      >
        fig. 02 · crew member, one of a kind
      </motion.span>
    </div>
  );
}

/** The founder's note: a cog breaks apart into a crew member as you read. */
export function FounderNote() {
  const ref = useRef<HTMLElement>(null);
  const p = useSectionProgress(ref, "pass");
  const reduce = useReduceMotion();

  return (
    <section
      ref={ref}
      data-chapter="Founder"
      data-nav="light"
      aria-labelledby="founder-note-title"
      className="relative overflow-hidden bg-white px-6 py-28 text-black md:px-16 md:py-40"
    >
      <span
        aria-hidden
        className="kit-outline-dark pointer-events-none absolute -top-[4vw] -left-[1vw] font-chakra-petch text-[40vw] leading-none font-bold select-none md:text-[26vw]"
      >
        “
      </span>

      <div className="relative grid gap-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <BrokenCog p={p} reduce={reduce} />
        </div>

        <div className="min-w-0">
          <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-asymmetri-red md:text-xs">
            <ScrambleText text={founderNote.kicker} />
          </p>
          <h2
            id="founder-note-title"
            className="font-chakra-petch text-[9.4vw] leading-[0.9] font-bold uppercase sm:text-5xl md:text-6xl xl:text-7xl"
          >
            <MaskLines
              lines={founderNote.titleLines.map((l, i) =>
                Array.isArray(l) ? (
                  <span key={i} className="text-asymmetri-red">
                    {l[0]}
                  </span>
                ) : (
                  l
                ),
              )}
            />
          </h2>

          <blockquote className="mt-10 max-w-2xl space-y-6 border-l border-black/15 pl-6 md:mt-14 md:pl-8">
            {founderNote.paragraphs.map((para, i) => (
              <motion.p
                key={i}
                initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "0px 0px -12% 0px" }}
                transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease: EASE }}
                className="font-geist text-lg leading-relaxed text-black/75 md:text-2xl md:leading-snug"
              >
                {para}
              </motion.p>
            ))}
          </blockquote>

          <motion.figure
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
            className="mt-12 flex items-center gap-5"
          >
            <a
              href={founderNote.site}
              target="_blank"
              rel="noopener"
              className="group relative block size-16 shrink-0 overflow-hidden md:size-20"
              aria-label={`${founderNote.name}'s website`}
            >
              <Image
                src={founderNote.photo}
                alt={founderNote.photoAlt}
                width={160}
                height={160}
                className="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
              />
              <span className="absolute inset-0 border border-black/15" aria-hidden />
            </a>
            <figcaption className="min-w-0">
              <span className="block font-chakra-petch text-xl font-bold uppercase md:text-2xl">
                {founderNote.name}
              </span>
              <motion.span
                aria-hidden
                initial={reduce ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, delay: 0.6, ease: EASE }}
                className="my-2 block h-[2px] w-40 origin-left bg-asymmetri-red"
              />
              <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-black/55 md:text-xs">
                {founderNote.role}
              </span>
            </figcaption>
          </motion.figure>
        </div>
      </div>
    </section>
  );
}
