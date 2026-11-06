"use client";

import { memo, useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { useMotionValueEvent, type MotionValue } from "motion/react";
import { pillars } from "@/lib/site-content";
import { useReduceMotion } from "@/hooks/useReduceMotion";
import { PillarGlyph, type PillarKind } from "./hero/manifesto/PillarGlyph";
import s from "./hero/manifesto/manifesto.module.css";
import { SENTENCE_IN, SIGNOFF_IN, WIPE } from "./hero/timeline";

type Word = { w: string; pillar?: number; red?: boolean };

const SENTENCE: Word[] = [
  ..."We solve consequential problems across".split(" ").map((w) => ({ w })),
  { w: "intelligence,", pillar: 0 },
  { w: "process,", pillar: 1 },
  { w: "experience", pillar: 2 },
  { w: "and" },
  { w: "scale.", pillar: 3 },
];
const SIGNOFF: Word[] = [
  ..."A hard problems technology company".split(" ").map((w) => ({ w })),
  ..."for what's next.".split(" ").map((w) => ({ w, red: true })),
];

const KINDS: PillarKind[] = ["intelligence", "process", "experience", "scale"];
const OVERLAP = 1.6;
const LIGHT_FOR = 0.014;

/** Start and inverse duration of word i of n written over range r. */
function timing(r: [number, number], n: number, i: number) {
  const step = (r[1] - r[0]) / n;
  return { a: r[0] + i * step, k: 1 / (step * OVERLAP), land: r[0] + (i + 1) * step };
}
// When each pillar's word has landed.
const LAND = pillars.map((_, p) => timing(SENTENCE_IN, SENTENCE.length, SENTENCE.findIndex((w) => w.pillar === p)).land);

const vars = (v: Record<string, number>) =>
  Object.fromEntries(Object.entries(v).map(([k, x]) => [`--${k}`, x.toFixed(4)])) as CSSProperties;

/* ------------------------------------------------------------------ */

type PillarUi = {
  /** Pillar whose description card is open (hover, focus or tap). */
  open: number | null;
  onOpen?: (i: number | null) => void;
  dark: boolean;
};

/** A pillar word: red underline, its animated glyph, and a card with its line of copy. */
function PillarWord({ i, core, punct, ui, land }: { i: number; core: string; punct: string; ui: PillarUi; land: number }) {
  const pl = pillars[i];
  const isOpen = ui.open === i;
  const interactive = Boolean(ui.onOpen);
  const last = i === pillars.length - 1;
  return (
    <span
      className="relative inline-block cursor-default outline-none"
      tabIndex={interactive ? 0 : undefined}
      aria-describedby={interactive ? `pillar-${i}` : undefined}
      onPointerEnter={(e) => e.pointerType === "mouse" && ui.onOpen?.(i)}
      onPointerLeave={(e) => e.pointerType === "mouse" && ui.onOpen?.(null)}
      // Touch: a tap toggles the card. Keyboard: focus opens it.
      onPointerUp={(e) => e.pointerType !== "mouse" && ui.onOpen?.(isOpen ? null : i)}
      onFocus={(e) => e.currentTarget.matches(":focus-visible") && ui.onOpen?.(i)}
      onBlur={() => ui.onOpen?.(null)}
    >
      <span className="relative">
        {core}
        <span
          aria-hidden
          className={`${s.underline} absolute inset-x-0 -bottom-[0.06em] h-[0.07em] bg-asymmetri-red`}
          style={vars({ a: land, k: 1 / LIGHT_FOR })}
        />
      </span>
      <PillarGlyph
        kind={KINDS[i]}
        active
        className="ml-[0.14em] inline-block size-[0.86em] -translate-y-[0.06em] align-middle"
      />
      {punct}
      {/* Description card. Always in the DOM (screen readers, search); shown on hover/focus/tap. */}
      <span
        id={interactive ? `pillar-${i}` : undefined}
        role={interactive ? "tooltip" : undefined}
        className={`absolute top-[calc(100%+0.35em)] z-20 block w-[min(20rem,78vw)] border p-4 text-left font-geist text-sm leading-relaxed font-normal tracking-normal normal-case shadow-[0_18px_40px_-20px_rgba(0,0,0,0.45)] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:p-5 md:text-[15px] ${
          last ? "right-0" : "left-0"
        } ${ui.dark ? "border-white/20 bg-black text-white/80" : "border-black/15 bg-white text-black/75"} ${
          isOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0"
        }`}
      >
        <span className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-asymmetri-red">
          0{i + 1}
          <span className={ui.dark ? "text-white" : "text-black"}>{pl.name}</span>
        </span>
        {pl.body}
      </span>
    </span>
  );
}

function Words({ words, range, ui }: { words: Word[]; range: [number, number]; ui?: PillarUi }) {
  return words.map((word, i) => {
    const t = timing(range, words.length, i);
    const [, core, punct] = word.w.match(/^(.*?)([.,]?)$/) ?? [];
    return (
      <span key={i}>
        <span
          // Pillar words sit above later words, and the open one above them all, so its card is never covered.
          className={`${s.word} ${word.red ? "text-asymmetri-red" : ""} ${word.pillar !== undefined ? `relative ${ui?.open === word.pillar ? "z-50" : "z-30"}` : ""}`}
          style={vars({ a: t.a, k: t.k })}
        >
          {word.pillar !== undefined && ui ? (
            <PillarWord i={word.pillar} core={core} punct={punct} ui={ui} land={t.land} />
          ) : (
            word.w
          )}
        </span>{" "}
      </span>
    );
  });
}

function LayerComponent({
  tone,
  named,
  open,
  onOpen,
}: {
  tone: "light" | "dark";
  named: number;
  open: number | null;
  onOpen?: (i: number | null) => void;
}) {
  const dark = tone === "dark";
  const ui: PillarUi = { open, onOpen, dark };
  return (
    <div
      // isolate: the pillar words' z-index stays inside this layer, so the black
      // copy laid over it by the wipe always covers the light one.
      className={`absolute inset-0 isolate flex flex-col px-5 pt-[4.5rem] pb-5 sm:px-8 md:px-12 md:pt-[5.25rem] md:pb-[4.5rem] [@media(max-height:760px)]:md:pb-[3.75rem] ${
        dark ? "bg-black text-white" : "bg-white text-black"
      }`}
      aria-hidden={dark || undefined}
    >
      <div
        className={`flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] md:text-[11px] ${
          dark ? "text-white/50" : "text-black/50"
        }`}
        // Held back until the doors part, so it never peeks through the slit.
        style={{ opacity: "clamp(0, (var(--mp, 0) - 0.06) * 25, 1)" }}
        aria-hidden
      >
        <span>
          <span className="text-asymmetri-red">[</span> Manifesto <span className="text-asymmetri-red">]</span>
        </span>
        <span className="tabular-nums">
          <span className={dark ? "text-white" : "text-black"}>0{named}</span> / 04 fronts
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-center py-6">
        {!dark && <h2 className="sr-only">What Asymmetri does</h2>}
        <p className="max-w-[26ch] text-[clamp(2rem,min(5vw,8.6vh),6.25rem)] leading-[1.24] font-bold uppercase tracking-[-0.015em] text-balance md:max-w-[30ch]">
          <Words words={SENTENCE} range={SENTENCE_IN} ui={ui} />
        </p>
        <p
          className={`mt-6 flex items-baseline gap-3 text-[clamp(1rem,min(1.75vw,3.3vh),1.75rem)] leading-tight font-semibold uppercase md:mt-[min(2.5rem,4.5vh)] ${
            dark ? "text-white/80" : "text-black/75"
          }`}
        >
          <span className="flex h-[0.8em] shrink-0 gap-[0.12em] self-center" aria-hidden>
            <span className="h-full w-[0.28em] skew-x-[26deg] bg-asymmetri-red" />
            <span className="h-full w-[0.1em] skew-x-[26deg] bg-asymmetri-red" />
          </span>
          <span>
            <Words words={SIGNOFF} range={SIGNOFF_IN} />
          </span>
        </p>
      </div>

    </div>
  );
}

const Layer = memo(LayerComponent);

/* ------------------------------------------------------------------ */

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const smooth = (t: number) => t * t * (3 - 2 * t);

/**
 * What the hero's cut opens onto: one pinned view. The sentence writes
 * itself in word by word with scroll; each pillar word is underlined in red
 * and carries its animated glyph (all four always running). Hovering, focusing
 * or tapping a pillar word opens its line of copy. The sign-off follows, then a
 * slash-angled wipe, red edge first, turns the board black.
 *
 * All copy is real DOM text. The black copy under the wipe is aria-hidden.
 * Per-word reveals are CSS: the board writes --mp once per scroll frame.
 */
export function ManifestoBoard({
  p,
  boardRef,
}: {
  p: MotionValue<number>;
  boardRef: RefObject<HTMLDivElement | null>;
}) {
  const reduce = useReduceMotion();
  const redRef = useRef<HTMLDivElement>(null);
  const darkRef = useRef<HTMLDivElement>(null);
  const size = useRef({ w: 1440, h: 900 });
  const [named, setNamed] = useState(0);
  const [open, setOpen] = useState<number | null>(null);

  const update = (v: number) => {
    const el = boardRef.current;
    if (!el) return;
    el.style.setProperty("--mp", v.toFixed(4));
    let n = 0;
    for (let i = 0; i < LAND.length; i++) if (v >= LAND[i]) n = i + 1;
    setNamed(n);

    const q = smooth(clamp01((v - WIPE[0]) / (WIPE[1] - WIPE[0])));
    const { w, h } = size.current;
    const sl = ((h * 0.4964) / Math.max(w, 1)) * 100;
    const lead = (30 / Math.max(w, 1)) * 100;
    const x0 = -sl - lead - 2;
    const x = x0 + q * (101 - x0);
    const poly = (X: number) =>
      `polygon(${(x0 - 10).toFixed(2)}% 0%, ${X.toFixed(2)}% 0%, ${(X + sl).toFixed(2)}% 100%, ${(x0 - 10).toFixed(2)}% 100%)`;
    if (darkRef.current) darkRef.current.style.clipPath = poly(x);
    if (redRef.current) {
      redRef.current.style.clipPath = poly(x + lead);
      redRef.current.style.visibility = q > 0 && q < 1 ? "visible" : "hidden";
    }
  };

  useMotionValueEvent(p, "change", update);

  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    const measure = () => {
      size.current = { w: el.clientWidth || 1440, h: el.clientHeight || 900 };
      update(p.get());
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
    // update only reads refs and stable setters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardRef, p]);

  return (
    <div
      ref={boardRef}
      className={`invisible absolute inset-0 z-[1] overflow-hidden bg-white font-chakra-petch ${reduce ? s.static : ""}`}
    >
      <Layer tone="light" named={named} open={open} onOpen={setOpen} />
      <div
        ref={redRef}
        aria-hidden
        className="pointer-events-none invisible absolute inset-0 bg-asymmetri-red"
        style={{ clipPath: "inset(0 100% 0 0)" }}
      />
      <div
        ref={darkRef}
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ clipPath: "inset(0 100% 0 0)" }}
      >
        <Layer tone="dark" named={named} open={open} />
      </div>
    </div>
  );
}
