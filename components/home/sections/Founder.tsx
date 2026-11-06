"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { MaskLines } from "@/components/practice/MaskLines";
import { ScrambleText } from "@/components/practice/ScrambleText";
import { YantraField } from "@/components/home/founder/YantraField";
import { sanskrit } from "@/components/home/founder/fonts";
import {
  beliefs,
  founder,
  layers,
  letter,
  mahavakya,
  origin,
} from "@/components/home/founder/content";

const EASE = [0.16, 1, 0.3, 1] as const;

const redLines = (lines: (string | [string])[]) =>
  lines.map((l, i) =>
    Array.isArray(l) ? (
      <span key={i} className="text-asymmetri-red">
        {l[0]}
      </span>
    ) : (
      l
    ),
  );

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
  place = "center",
}: {
  p: MotionValue<number>;
  range: [number, number, number, number];
  children: ReactNode;
  className?: string;
  place?: "center" | "low";
}) {
  const last = range[3] >= 1;
  const opacity = useTransform(p, range, [0, 1, 1, last ? 1 : 0]);
  const y = useTransform(p, range, [40, 0, 0, last ? 0 : -40]);
  const blur = useTransform(p, range, ["blur(12px)", "blur(0px)", "blur(0px)", last ? "blur(0px)" : "blur(12px)"]);
  return (
    <motion.div
      style={{ opacity, y, filter: blur }}
      className={
        place === "center"
          ? `absolute inset-x-0 top-1/2 mx-auto -translate-y-1/2 px-6 text-center ${className}`
          : `absolute inset-x-0 bottom-16 px-6 text-left md:bottom-20 md:px-16 ${className}`
      }
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Scene 1: Tat Tvam Asi, then symmetry breaks into structure.          */
/* ------------------------------------------------------------------ */

function Stage() {
  const ref = useRef<HTMLDivElement>(null);
  const p = useSectionProgress(ref, "pin");
  const [broken, setBroken] = useState(false);
  useMotionValueEvent(p, "change", (v) => setBroken(v > 0.4));
  const hint = useTransform(p, [0, 0.08], [1, 0]);
  const glow = useTransform(p, [0.52, 0.62], [1, 0]);
  const veil = useTransform(p, [0.52, 0.62], [0, 1]);

  return (
    <div ref={ref} className="relative h-[290vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <YantraField progress={p} />
        {/* Keeps the type legible over the field */}
        <motion.div
          style={{ opacity: glow }}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.94)_0%,rgba(255,255,255,0.72)_26%,rgba(255,255,255,0)_58%)]"
          aria-hidden
        />
        {/* Final scene: type sits low-left so the galaxy can be seen */}
        <motion.div
          style={{ opacity: veil }}
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(20deg,rgba(255,255,255,0.97)_0%,rgba(255,255,255,0.85)_30%,rgba(255,255,255,0)_62%)]"
          aria-hidden
        />

        <div className="absolute inset-x-0 top-20 flex items-center justify-between gap-4 px-6 font-mono text-[10px] uppercase tracking-[0.25em] text-black/50 md:px-16 md:text-[11px]">
          <span>
            <span className="text-asymmetri-red">[</span> From the founder{" "}
            <span className="text-asymmetri-red">]</span>
          </span>
          <span className="hidden tabular-nums sm:inline" aria-hidden>
            Matter : antimatter{" "}
            <span className="text-black">
              1,000,000,00
              <span className={broken ? "text-asymmetri-red" : ""}>{broken ? "1" : "0"}</span> :
              1,000,000,000
            </span>
          </span>
        </div>

        <StageLayer p={p} range={[-1, 0, 0.22, 0.3]}>
          <p
            lang="sa"
            className={`${sanskrit.className} text-[clamp(3.4rem,11vw,10rem)] leading-[1.1] text-black`}
          >
            {mahavakya.devanagari}
          </p>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-black/50 md:text-xs">
            {mahavakya.source}
          </p>
        </StageLayer>

        <StageLayer p={p} range={[0.26, 0.32, 0.46, 0.53]} className="max-w-4xl">
          <p className="font-chakra-petch text-[clamp(2.6rem,7vw,6.5rem)] leading-[0.9] font-bold uppercase text-black">
            {mahavakya.transliteration}
            <span className="block text-asymmetri-red">{mahavakya.translation}</span>
          </p>
          <p className="mx-auto mt-6 max-w-xl font-geist text-base leading-relaxed text-black/70 md:text-lg">
            {mahavakya.meaning}
          </p>
        </StageLayer>

        <StageLayer p={p} range={[0.56, 0.64, 1, 1]} place="low">
          <h3 className="font-chakra-petch text-[clamp(2.4rem,6.4vw,6rem)] leading-[0.9] font-bold uppercase text-black">
            {origin.headline.map((l, i) =>
              Array.isArray(l) ? (
                <span key={i} className="block text-asymmetri-red">
                  {l[0]}
                </span>
              ) : (
                <span key={i} className="block">
                  {l}
                </span>
              ),
            )}
          </h3>
          <p className="mt-6 max-w-xl font-geist text-base leading-relaxed text-black/70 md:text-lg">
            {origin.body}
          </p>
        </StageLayer>

        <motion.div
          style={{ opacity: hint }}
          className="absolute inset-x-0 bottom-8 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-black/40"
          aria-hidden
        >
          Scroll · break the symmetry
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Scene 2: the founder's note.                                         */
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
        {/* Red duotone that lifts on hover */}
        <div
          className="pointer-events-none absolute inset-0 bg-asymmetri-red mix-blend-multiply transition-opacity duration-700 group-hover:opacity-0"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.18)_0px,rgba(0,0,0,0.18)_1px,transparent_1px,transparent_4px)] mix-blend-multiply"
          aria-hidden
        />
        <span
          lang="sa"
          className={`${sanskrit.className} pointer-events-none absolute right-4 bottom-3 text-5xl text-white/85 md:text-6xl`}
          aria-hidden
        >
          {mahavakya.devanagari.split(" ")[0]}
        </span>
        <span className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/85">
          Fig. 01
        </span>
      </div>
      <figcaption className="mt-3 flex flex-col gap-1 font-mono sm:flex-row sm:items-center sm:justify-between sm:gap-4 text-[10px] uppercase tracking-[0.25em] text-black/50">
        <span>{founder.name}</span>
        <span>{founder.photoCaption}</span>
      </figcaption>
    </figure>
  );
}

function Letter() {
  return (
    <div className="grid gap-12 px-6 py-24 md:px-16 md:py-32 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
      <div className="mx-auto w-full max-w-md lg:max-w-none">
        <Portrait />
      </div>
      <div>
        <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.3em] text-asymmetri-red md:text-xs">
          <ScrambleText text={letter.kicker} />
        </p>
        <h3 className="font-chakra-petch text-4xl leading-[0.92] font-bold uppercase text-black md:text-6xl xl:text-7xl">
          <MaskLines lines={redLines(letter.title)} />
        </h3>
        <div className="mt-10 max-w-2xl space-y-6 font-geist text-base leading-relaxed text-black/75 md:text-lg">
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
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Scene 3: two layers. The operator and the observer.                  */
/* ------------------------------------------------------------------ */

function Layers() {
  return (
    <div className="px-6 pb-24 md:px-16 md:pb-32">
      <header className="mb-10 grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-end">
        <div>
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.3em] text-asymmetri-red md:text-xs">
            <ScrambleText text="Two layers · One company" />
          </p>
          <h3 className="font-chakra-petch text-4xl leading-[0.92] font-bold uppercase text-black md:text-6xl">
            <MaskLines lines={["The operator", <span key="o" className="text-asymmetri-red">and the observer.</span>]} />
          </h3>
        </div>
        <p className="max-w-md font-geist text-base leading-relaxed text-black/60 md:text-lg">
          One layer creates outward momentum. The other asks whether the intention behind it is sound. A
          company needs both.
        </p>
      </header>
      <div className="flex flex-col gap-px bg-black/15 md:flex-row">
        {layers.map((l, i) => {
          const dark = i === 1;
          return (
            <motion.article
              key={l.tag}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.9, ease: EASE, delay: i * 0.12 }}
              className={`group relative flex min-h-[26rem] flex-1 flex-col justify-between overflow-hidden p-8 transition-[flex-grow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:min-h-[34rem] md:p-10 md:hover:grow-[1.45] ${
                dark ? "heroDark bg-black text-white" : "bg-white text-black"
              }`}
            >
              <span
                className={`pointer-events-none absolute -right-4 -bottom-10 font-chakra-petch text-[11rem] leading-none font-bold select-none md:text-[15rem] ${
                  dark ? "kit-outline" : "kit-outline-dark"
                }`}
                aria-hidden
              >
                0{i + 1}
              </span>
              <p className={`font-mono text-[10px] uppercase tracking-[0.3em] ${dark ? "text-white/60" : "text-black/50"}`}>
                <span className="mr-2 inline-block size-1.5 bg-asymmetri-red align-middle" /> {l.tag}
              </p>
              <div className="relative max-w-md">
                <h4 className="font-chakra-petch text-3xl leading-[0.95] font-bold uppercase md:text-5xl">
                  {l.title}
                </h4>
                <p className={`mt-5 font-geist text-base leading-relaxed ${dark ? "text-white/70" : "text-black/65"}`}>
                  {l.body}
                </p>
                <ul className="mt-6 flex flex-wrap gap-1.5">
                  {l.words.map((w) => (
                    <li
                      key={w}
                      className={`border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors duration-300 group-hover:border-asymmetri-red ${
                        dark ? "border-white/25 text-white/80" : "border-black/20 text-black/70"
                      }`}
                    >
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Scene 4: what we return to. Each line lights as it crosses centre.   */
/* ------------------------------------------------------------------ */

function Belief({ text, i }: { text: string; i: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const p = useSectionProgress(ref, "pass");
  const lit = useTransform(p, [0.3, 0.45, 0.6, 0.75], [0.14, 1, 1, 0.3]);
  const bar = useTransform(p, [0.3, 0.48], [0, 1]);
  return (
    <li ref={ref} className="relative border-t border-black/15 py-7 md:py-9">
      <motion.span
        style={{ scaleX: bar }}
        className="absolute -top-px left-0 h-[2px] w-full origin-left bg-asymmetri-red"
        aria-hidden
      />
      <motion.div style={{ opacity: lit }} className="grid gap-3 md:grid-cols-[6rem_1fr] md:gap-8">
        <span className="font-mono text-xs text-asymmetri-red">0{i + 1}</span>
        <p className="max-w-5xl font-chakra-petch text-2xl leading-[1.05] font-semibold uppercase text-black md:text-4xl xl:text-5xl">
          {text}
        </p>
      </motion.div>
    </li>
  );
}

function Beliefs() {
  return (
    <div className="px-6 pb-24 md:px-16 md:pb-32">
      <p className="mb-8 font-mono text-[10px] uppercase tracking-[0.3em] text-asymmetri-red md:text-xs">
        <ScrambleText text="What we return to" />
      </p>
      <ol>
        {beliefs.map((b, i) => (
          <Belief key={b} text={b} i={i} />
        ))}
      </ol>
    </div>
  );
}

function Signoff() {
  return (
    <div className="border-t border-black/15 px-6 py-16 md:px-16 md:py-20">
      <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <p className="font-chakra-petch text-5xl leading-[0.9] font-bold uppercase text-black md:text-7xl">
          Build what
          <br />
          can <span className="text-asymmetri-red">endure.</span>
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
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
        </div>
      </div>
    </div>
  );
}

/**
 * Founder chapter: Nandagopal P's point of view. Spiritual at the root
 * (Tat Tvam Asi, attention, conscious ambition) and concrete at the top
 * (what Asymmetri builds and why).
 */
export function Founder() {
  return (
    <section data-chapter="Founder" data-nav="light" className="relative -mt-px bg-white text-black">
      <h2 className="sr-only">From the founder, Nandagopal P</h2>
      <Stage />
      <Letter />
      <Layers />
      <Beliefs />
      <Signoff />
    </section>
  );
}
