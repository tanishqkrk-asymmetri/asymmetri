"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import { useReduceMotion as useReducedMotion } from "@/hooks/useReduceMotion";
import { ArrowUpRight } from "lucide-react";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { ScrambleText } from "@/components/practice/ScrambleText";
import { FIELD, YantraField, seedPoint } from "@/components/home/founder/YantraField";
import { founder, letter, mission, origin, principles, vision } from "@/components/home/founder/content";

const EASE = [0.16, 1, 0.3, 1] as const;

/* Stage timeline, in the stage's pinned progress. The field (YantraField)
   uses FIELD; the type and the travelling particle use these. */
const T = {
  intro: [-1, 0, 0.12, 0.18],
  head: [0.22, 0.3, 0.8, 0.86],
  morph: [0.35, 0.45],
  body: [0.54, 0.6, 0.8, 0.86],
  title: [0.84, 0.9, 1, 1],
  // Particle: seed → "extra particle" → dot → "that one particle."
  particle: [0.6, 0.67, 0.79, 0.83, 0.9, 0.94],
  wipe: [0.95, 0.99],
} as const;

type Box = { x: number; y: number; w: number; h: number };
const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function Slash({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-[3px] ${className}`} aria-hidden>
      <span className="h-[0.9em] w-[0.28em] -skew-x-[26deg] bg-asymmetri-red" />
      <span className="h-[0.9em] w-[0.1em] -skew-x-[26deg] bg-asymmetri-red" />
    </span>
  );
}

/** A layer of the pinned stage, faded and de-blurred over a window of progress. */
function StageLayer({
  p,
  range,
  children,
  className = "",
}: {
  p: MotionValue<number>;
  range: readonly [number, number, number, number];
  children: ReactNode;
  className?: string;
}) {
  const last = range[3] >= 1;
  const r = [...range];
  const opacity = useTransform(p, r, [0, 1, 1, last ? 1 : 0]);
  const y = useTransform(p, r, [36, 0, 0, last ? 0 : -36]);
  const filter = useTransform(p, r, ["blur(12px)", "blur(0px)", "blur(0px)", last ? "blur(0px)" : "blur(12px)"]);
  // Positioned with layout only (no CSS transforms) so the particle can measure it.
  return (
    <motion.div style={{ opacity, y, filter }} className={`pointer-events-none absolute z-20 ${className}`}>
      {children}
    </motion.div>
  );
}

/** The Y of "asymmetry" collapses into the I of Asymmetri. */
function YtoI({ p }: { p: MotionValue<number> }) {
  const yRef = useRef<HTMLSpanElement>(null);
  const iRef = useRef<HTMLSpanElement>(null);
  const widths = useRef({ y: 0, i: 0 });
  const [a, b] = T.morph;
  const scaleX = useTransform(p, [a, b], [1, 0.14]);
  const yOpacity = useTransform(p, [a + (b - a) * 0.55, b], [1, 0]);
  const iOpacity = useTransform(p, [a + (b - a) * 0.45, b], [0, 1]);
  const iScale = useTransform(p, [a + (b - a) * 0.45, b], [1.8, 1]);
  const width = useTransform(p, (v) => {
    const { y, i } = widths.current;
    if (!y) return "auto";
    return `${y + (i - y) * easeInOut(clamp01((v - a) / (b - a)))}px`;
  });

  useEffect(() => {
    const measure = () => {
      widths.current = { y: yRef.current?.offsetWidth ?? 0, i: iRef.current?.offsetWidth ?? 0 };
      p.set(p.get() + 1e-9);
    };
    measure();
    // Re-measure when the glyphs change size (web font arriving, resize).
    const ro = new ResizeObserver(measure);
    if (yRef.current) ro.observe(yRef.current);
    if (iRef.current) ro.observe(iRef.current);
    return () => ro.disconnect();
  }, [p]);

  return (
    <motion.span style={{ width }} className="inline-grid grid-cols-[minmax(0,1fr)] justify-items-center align-baseline">
      <motion.span ref={yRef} style={{ scaleX, opacity: yOpacity }} className="[grid-area:1/1]">
        Y
      </motion.span>
      <motion.span ref={iRef} style={{ opacity: iOpacity, scaleY: iScale }} className="origin-bottom text-asymmetri-red [grid-area:1/1]">
        I
      </motion.span>
    </motion.span>
  );
}

/** Offset of an element inside `root`, from layout (ignores transforms). */
function boxIn(el: HTMLElement | null, root: HTMLElement | null): Box | null {
  if (!el || !root) return null;
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return node === root ? { x, y, w: el.offsetWidth, h: el.offsetHeight } : null;
}

/* ------------------------------------------------------------------ */
/* The pinned stage: balance, the extra particle, the name, the note.   */
/* ------------------------------------------------------------------ */

function Stage() {
  const ref = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const srcRef = useRef<HTMLSpanElement>(null);
  const dstRef = useRef<HTMLSpanElement>(null);
  const p = useSectionProgress(ref, "pin");
  const [light, setLight] = useState(false);
  const [ticked, setTicked] = useState(false);
  useMotionValueEvent(p, "change", (v) => {
    setLight(v > 0.32);
    setTicked(v > FIELD.seed[0]);
  });

  // Particle path, measured from layout.
  const path = useRef<Box[] | null>(null);
  const measure = useCallback(() => {
    const root = stage.current;
    const src = boxIn(srcRef.current, root);
    const dst = boxIn(dstRef.current, root);
    if (!root || !src || !dst) return;
    const { sx, sy } = seedPoint(root.clientWidth, root.clientHeight);
    const dot = (b: Box): Box => ({ x: b.x + b.w / 2 - 6, y: b.y + b.h / 2 - 6, w: 12, h: 12 });
    const pad = (b: Box): Box => ({ x: b.x - 4, y: b.y - 1, w: b.w + 8, h: b.h + 2 });
    path.current = [
      { x: sx - 5, y: sy - 5, w: 10, h: 10 },
      pad(src),
      pad(src),
      dot(src),
      dot(dst),
      pad(dst),
    ];
    p.set(p.get() + 1e-9);
  }, [p]);
  useEffect(() => {
    measure();
    // Re-measure when either phrase or the stage changes size (web font arriving, resize).
    const ro = new ResizeObserver(measure);
    for (const el of [stage.current, srcRef.current, dstRef.current]) if (el) ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  const at = (v: number): Box => {
    const pts = path.current;
    if (!pts) return { x: 0, y: 0, w: 0, h: 0 };
    const k = T.particle;
    if (v <= k[0]) return pts[0];
    for (let i = 1; i < k.length; i++) {
      if (v <= k[i]) {
        const t = easeInOut((v - k[i - 1]) / (k[i] - k[i - 1]));
        const a = pts[i - 1];
        const b = pts[i];
        return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, w: a.w + (b.w - a.w) * t, h: a.h + (b.h - a.h) * t };
      }
    }
    return pts[pts.length - 1];
  };
  const px = useTransform(p, (v) => at(v).x);
  const py = useTransform(p, (v) => at(v).y);
  const pw = useTransform(p, (v) => at(v).w);
  const ph = useTransform(p, (v) => at(v).h);
  const pOpacity = useTransform(p, [T.particle[0] - 0.012, T.particle[0]], [0, 1]);
  const wipe = useTransform(p, [...T.wipe], [1, 0]);

  const srcColor = useTransform(p, [0.64, 0.67, 0.79, 0.81], ["#000000", "#ffffff", "#ffffff", "#000000"]);
  const dstColor = useTransform(p, [0.92, 0.94, 0.96, 0.99], ["#cd1717", "#ffffff", "#ffffff", "#cd1717"]);
  const veil = useTransform(p, [0.82, 0.9], [0, 1]);
  const hint = useTransform(p, [0, 0.06], [1, 0]);

  return (
    <div ref={ref} data-nav={light ? "light" : "dark"} className="relative h-[380vh] bg-black">
      <div ref={stage} className="sticky top-0 h-screen overflow-hidden">
        <YantraField progress={p} />

        {/* Final frame: type low-left, the galaxy behind a soft veil */}
        <motion.div
          style={{ opacity: veil }}
          className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(20deg,rgba(255,255,255,0.97)_0%,rgba(255,255,255,0.86)_34%,rgba(255,255,255,0)_66%)]"
          aria-hidden
        />

        {/* The extra particle, made of DOM so it can travel through the type */}
        <motion.div
          style={{ x: px, y: py, width: pw, height: ph, opacity: pOpacity }}
          className="pointer-events-none absolute top-0 left-0 z-[15]"
          aria-hidden
        >
          <motion.div style={{ scaleX: wipe }} className="h-full w-full origin-right bg-asymmetri-red" />
        </motion.div>

        <div
          className={`absolute inset-x-0 top-20 z-20 flex items-center justify-between gap-4 px-6 font-mono text-[10px] uppercase tracking-[0.25em] transition-colors duration-500 md:px-16 md:text-[11px] ${
            light ? "text-black/50" : "text-white/50"
          }`}
        >
          <span>
            <span className="text-asymmetri-red">[</span> The vision{" "}
            <span className="text-asymmetri-red">]</span>
          </span>
          <span className="hidden tabular-nums sm:inline" aria-hidden>
            Matter : antimatter{" "}
            <span className={light ? "text-black" : "text-white"}>
              1,000,000,00
              <span className={ticked ? "text-asymmetri-red" : ""}>{ticked ? "1" : "0"}</span> : 1,000,000,000
            </span>
          </span>
        </div>

        {/* 1. Balance */}
        <StageLayer p={p} range={T.intro} className="inset-0 flex flex-col items-center justify-center px-6 text-center">
          <p className="max-w-4xl font-chakra-petch text-[clamp(1.8rem,4.4vw,4rem)] leading-[1] font-bold uppercase text-white">
            {origin.intro}
          </p>
        </StageLayer>

        {/* 2. The name */}
        <StageLayer p={p} range={T.head} className="inset-x-0 top-[22%] px-6 text-center md:top-[21%]">
          <h3 className="font-chakra-petch font-bold uppercase text-black">
            <span className="sr-only">
              {origin.lead} asymmetry: {origin.word}i.
            </span>
            <span aria-hidden>
              <span className="block text-[clamp(1.4rem,3vw,2.8rem)] leading-none text-black/55">{origin.lead}</span>
              <span className="mt-2 block text-[clamp(2.6rem,7.4vw,7rem)] leading-[0.9] whitespace-nowrap">
                {origin.word}
                <YtoI p={p} />
              </span>
            </span>
          </h3>
        </StageLayer>

        {/* 3. The extra particle */}
        <StageLayer
          p={p}
          range={T.body}
          className="inset-x-0 top-[58%] mx-auto max-w-2xl px-6 text-center md:top-[56%]"
        >
          <p className="font-geist text-base leading-relaxed text-black/75 md:text-lg">
            {origin.bodyBefore}{" "}
            <motion.span ref={srcRef} style={{ color: srcColor }} className="relative z-30 mx-[0.2em] inline-block font-semibold whitespace-nowrap">
              {origin.highlight}
            </motion.span>{" "}
            {origin.bodyAfter}
          </p>
        </StageLayer>

        {/* 4. Where it lands: the founder's note */}
        <StageLayer p={p} range={T.title} className="inset-x-0 bottom-14 px-6 md:bottom-20 md:px-16">
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.3em] text-asymmetri-red md:text-xs">
            {letter.kicker}
          </p>
          <h3 className="font-chakra-petch text-[clamp(2.4rem,6.2vw,6rem)] leading-[0.92] font-bold uppercase text-black">
            {letter.titleLead.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
            <span className="block">
              <motion.span ref={dstRef} style={{ color: dstColor }} className="relative z-30 inline-block md:whitespace-nowrap">
                {letter.titleTarget}
              </motion.span>
            </span>
          </h3>
        </StageLayer>

        <motion.div
          style={{ opacity: hint }}
          className="absolute inset-x-0 bottom-8 z-20 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-white/40"
          aria-hidden
        >
          Scroll
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The founder's note.                                                  */
/* ------------------------------------------------------------------ */

function Portrait() {
  const reduce = useReducedMotion();
  // Watch the frame, not the image: a fully clipped element never intersects.
  const frame = useRef<HTMLDivElement>(null);
  const seen = useInView(frame, { once: true, margin: "0px 0px -15% 0px" });
  return (
    <figure className="group relative lg:sticky lg:top-24">
      <div ref={frame} className="relative aspect-[4/5] overflow-hidden bg-black">
        <motion.img
          src={founder.photo}
          alt={founder.photoAlt}
          loading="lazy"
          initial={reduce ? false : { clipPath: "inset(100% 0 0 0)", scale: 1.15 }}
          animate={seen || reduce ? { clipPath: "inset(0% 0 0 0)", scale: 1 } : undefined}
          transition={{ duration: 1.4, ease: EASE }}
          className="absolute inset-0 h-full w-full object-cover object-[35%_50%] contrast-[1.15] grayscale transition-[filter] duration-700 group-hover:grayscale-0"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-asymmetri-red mix-blend-multiply transition-opacity duration-700 group-hover:opacity-0"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.18)_0px,rgba(0,0,0,0.18)_1px,transparent_1px,transparent_4px)] mix-blend-multiply"
          aria-hidden
        />
        <span className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/85">
          Fig. 01
        </span>
      </div>
      <figcaption className="mt-3 flex flex-col gap-1 font-mono text-[10px] uppercase tracking-[0.25em] text-black/50 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <span>{founder.name}</span>
        <span>{founder.photoCaption}</span>
      </figcaption>
    </figure>
  );
}

function Letter() {
  return (
    <div className="grid gap-12 px-6 pt-16 pb-24 md:px-16 md:pt-20 md:pb-32 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
      <div className="mx-auto w-full max-w-md lg:max-w-none">
        <Portrait />
      </div>
      <div>
        <div className="max-w-2xl space-y-6 font-geist text-base leading-relaxed text-black/75 md:text-lg">
          {letter.paragraphs.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -12% 0px" }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.05 * i }}
              className={
                i === 0
                  ? "first-letter:float-left first-letter:mr-3 first-letter:font-chakra-petch first-letter:text-7xl first-letter:leading-[0.8] first-letter:font-bold first-letter:text-asymmetri-red"
                  : ""
              }
            >
              {para}
            </motion.p>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 flex items-center gap-4 border-t border-black/15 pt-6"
        >
          <Slash className="text-3xl" />
          <div>
            <p className="font-chakra-petch text-2xl font-bold uppercase text-black">{founder.name}</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-black/50">{founder.role}</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <a
            href={founder.siteAbout}
            target="_blank"
            rel="noopener"
            className="group inline-flex items-center justify-between gap-6 border border-black px-5 py-3 font-chakra-petch text-sm font-semibold uppercase tracking-wide text-black transition-colors hover:bg-black hover:text-white"
          >
            More from Nandagopal
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a
            href="/contact-us"
            className="group relative inline-flex items-center justify-between gap-6 overflow-hidden bg-asymmetri-red px-5 py-3 font-chakra-petch text-sm font-semibold uppercase tracking-wide text-white"
          >
            <span className="absolute inset-0 origin-left scale-x-0 bg-black transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
            <span className="relative">Start a conversation</span>
            <ArrowUpRight className="relative size-4" />
          </a>
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mission and vision.                                                  */
/* ------------------------------------------------------------------ */

function VisionStatement() {
  const ref = useRef<HTMLDivElement>(null);
  const p = useSectionProgress(ref, "pass");
  // A red marker sweeps behind the key phrase as the statement reaches centre.
  const marker = useTransform(p, [0.28, 0.46], ["0% 100%", "100% 100%"]);
  const words = useTransform(p, [0.16, 0.32], [0.25, 1]);
  return (
    <div
      ref={ref}
      data-nav="dark"
      className="heroDark relative overflow-hidden bg-black px-6 py-28 text-white md:px-16 md:py-40"
    >
      <p className="relative flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-asymmetri-red md:text-xs">
        <Slash />
        <ScrambleText text={vision.kicker} />
      </p>
      <motion.h2
        style={{ opacity: words }}
        className="relative mt-8 font-chakra-petch text-[clamp(2.3rem,5.6vw,6.2rem)] leading-[1] font-bold uppercase"
      >
        <span className="block">{vision.before}</span>
        <span className="block md:whitespace-nowrap">
          <motion.span
            style={{ backgroundSize: marker }}
            className="bg-[linear-gradient(#cd1717,#cd1717)] bg-left bg-no-repeat -ml-[0.08em] px-[0.08em] [-webkit-box-decoration-break:clone] [box-decoration-break:clone]"
          >
            {vision.highlight}
          </motion.span>
        </span>
        <span className="block text-balance">{vision.after}</span>
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative mt-10 max-w-xl font-geist text-base leading-relaxed text-white/70 md:text-lg"
      >
        {vision.support}
      </motion.p>
    </div>
  );
}

function Mission() {
  return (
    <div className="grid gap-12 px-6 py-24 md:px-16 md:py-32 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20">
      <div>
        <p className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-asymmetri-red md:text-xs">
          <Slash />
          <ScrambleText text={mission.kicker} />
        </p>
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="font-chakra-petch text-5xl leading-[0.95] font-bold uppercase text-black md:text-7xl"
        >
          {mission.statement.map((line, i) => (
            <span key={line} className={`block ${i === 1 ? "text-asymmetri-red" : ""}`}>
              {line}
            </span>
          ))}
        </motion.h3>
      </div>
      <ol className="border-t border-black/15">
        {mission.pillars.map((m, i) => (
          <motion.li
            key={m.tag}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.8, ease: EASE, delay: i * 0.1 }}
            className="group relative border-b border-black/15 py-8 pl-6"
          >
            <span className="absolute top-0 left-0 h-full w-[3px] origin-top scale-y-[0.25] bg-asymmetri-red transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-black/50">{m.tag}</p>
            <h4 className="mt-3 font-chakra-petch text-2xl leading-[1] font-bold uppercase text-black md:text-3xl">
              {m.title}
            </h4>
            <p className="mt-3 max-w-lg font-geist text-base leading-relaxed text-black/65">{m.body}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

function Principles() {
  return (
    <div className="px-6 pb-24 md:px-16 md:pb-32">
      <div className="mb-8 flex items-end justify-between gap-6 border-b border-black/15 pb-4">
        <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-asymmetri-red md:text-xs">
          <Slash />
          <ScrambleText text="What we return to" />
        </p>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-black/40">
          {String(principles.length).padStart(2, "0")} principles
        </span>
      </div>
      <ol className="grid gap-px bg-black/15 md:grid-cols-6">
        {principles.map((text, i) => (
          <motion.li
            key={text}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            transition={{ duration: 0.7, ease: EASE, delay: (i % 3) * 0.08 }}
            className={`group flex min-h-[13rem] ${i < 3 ? "md:col-span-2" : "md:col-span-3"} flex-col justify-between gap-8 bg-white p-6 transition-colors duration-300 hover:bg-black md:p-8`}
          >
            <span className="font-mono text-xs text-asymmetri-red">0{i + 1}</span>
            <p className="font-chakra-petch text-xl leading-[1.08] font-semibold uppercase text-black transition-colors duration-300 group-hover:text-white md:text-2xl">
              {text}
            </p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

/**
 * Founder and vision. The pinned stage tells the origin of the name (one
 * extra particle), which travels into the founder's note; then the
 * company's vision, mission and principles.
 */
export function Founder() {
  return (
    <>
      <section data-chapter="Founder" data-nav="light" className="relative -mt-px bg-white text-black">
        <h2 className="sr-only">From the founder, Nandagopal P</h2>
        <Stage />
        <Letter />
      </section>
      <section id="vision" data-chapter="The vision" data-nav="light" className="relative scroll-mt-14 bg-white text-black">
        <VisionStatement />
        <Mission />
        <Principles />
      </section>
    </>
  );
}
