"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { animate, motion, useTransform } from "motion/react";
import { useReduceMotion as useReducedMotion } from "@/hooks/useReduceMotion";
import { CUT_DEG, type useHeroSplit } from "@/hooks/useHeroSplit";
import { company } from "@/lib/site-content";
import { useHeroEngine, INTRO_DONE_MS } from "./useHeroEngine";
import { HeroWordmark } from "./HeroWordmark";
import { OPEN_END } from "../timeline";

const EASE = [0.16, 1, 0.3, 1] as const;

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
/* Small pieces                                                         */
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
              k < shown || c === " " ? c : glyphs[Math.floor(Math.random() * glyphs.length)],
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
    <span className={`block overflow-hidden pb-[0.04em] ${className ?? ""}`}>
      <motion.span
        className="block"
        initial={{ y: "105%", skewY: 4 }}
        animate={play ? { y: "0%", skewY: 0 } : { y: "105%", skewY: 4 }}
        transition={{ duration: 1.15, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function Rule({ play, delay, from = "left" }: { play: boolean; delay: number; from?: "left" | "right" }) {
  return (
    <motion.div
      className={`h-px bg-white/20 ${from === "left" ? "origin-left" : "origin-right"}`}
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

/** A square cut along the slash; the halves part in a loop. */
function CutGlyph() {
  return (
    <span className="relative inline-block size-4" aria-hidden>
      <motion.span
        className="absolute inset-0 bg-white"
        style={{ clipPath: "polygon(0 0, 30% 0, 70% 100%, 0 100%)" }}
        animate={{ x: [0, -2.5, -2.5, 0], y: [0, 1.2, 1.2, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, times: [0, 0.35, 0.7, 1], ease: "easeInOut" }}
      />
      <motion.span
        className="absolute inset-0 bg-white"
        style={{ clipPath: "polygon(30% 0, 100% 0, 100% 100%, 70% 100%)" }}
        animate={{ x: [0, 3.5, 3.5, 0], y: [0, -1.7, -1.7, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, times: [0, 0.35, 0.7, 1], ease: "easeInOut" }}
      />
      <span
        className="absolute inset-y-[-3px] left-1/2 w-px -translate-x-1/2 skew-x-[26deg] bg-asymmetri-red"
      />
    </span>
  );
}

function Readout({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <span className={`flex items-baseline gap-2 ${className ?? ""}`}>
      <span className="text-white/40">{label}</span>
      <span className="tabular-nums text-white">{children}</span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Hero copy. Rendered once per half; the second copy is aria-hidden.   */
/* ------------------------------------------------------------------ */

function HeroContentComponent({
  primary,
  play,
  ticker,
  onCue,
  onOpen,
}: {
  primary?: boolean;
  play: boolean;
  ticker: string;
  onCue: (on: boolean, tease?: boolean) => void;
  onOpen: () => void;
}) {
  const Heading = primary ? "h1" : "p";
  const tab = primary ? undefined : -1;

  const side = (
    <div className="max-w-[21rem] space-y-5">
      <p className="font-geist text-[15px] leading-relaxed text-white/75 md:text-base">
        Engineering intelligence into the way global brands operate.
      </p>
      <span data-cta={primary ? "primary" : "copy"} className="inline-block">
        <a
          href="/contact-us"
          tabIndex={tab}
          data-cta-inner
          className="group relative inline-flex items-center gap-3 overflow-hidden bg-asymmetri-red px-5 py-3.5 font-chakra-petch text-sm font-semibold uppercase tracking-wide text-white will-change-transform focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <span
            aria-hidden
            className="absolute inset-y-0 -left-[30%] w-[160%] origin-left scale-x-0 skew-x-[26deg] bg-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
          />
          <span className="relative transition-colors duration-300 group-hover:text-black group-focus-visible:text-black">
            Bring us a hard problem
          </span>
          <span className="relative flex h-3.5 items-center gap-[3px]" aria-hidden>
            <span className="h-full w-[5px] skew-x-[26deg] bg-white transition-all duration-300 group-hover:translate-x-[3px] group-hover:bg-asymmetri-red" />
            <span className="h-full w-[2px] skew-x-[26deg] bg-white transition-all duration-300 group-hover:translate-x-[7px] group-hover:bg-asymmetri-red" />
          </span>
        </a>
      </span>
      <p className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-white/35 md:block" aria-hidden>
        Move to break the symmetry. Click to send a shock.
      </p>
    </div>
  );

  return (
    <div className="absolute inset-0 flex flex-col px-5 pt-[4.5rem] pb-4 font-chakra-petch text-white sm:px-8 md:px-12 md:pt-[5.25rem] md:pb-6">
      {/* HUD */}
      <Fade
        play={play}
        delay={1.35}
        className="flex items-start justify-between gap-6 pb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 md:text-[11px]"
      >
        <p className="flex min-w-0 items-center gap-2.5">
          <span className="relative flex size-1.5 shrink-0">
            <span className="absolute inset-0 animate-ping rounded-full bg-asymmetri-red/70" />
            <span className="relative size-1.5 rounded-full bg-asymmetri-red" />
          </span>
          <span className="hidden sm:inline">Now solving</span>
          <span className="truncate text-white sm:min-w-[17ch]">{ticker}</span>
        </p>
        <div className="flex shrink-0 gap-6 lg:gap-9">
          <Readout label="Sym">
            <span data-ro="sym">100.0%</span>
          </Readout>
          <Readout label="Cut" className="hidden md:flex">
            {CUT_DEG.toFixed(1)}°
          </Readout>
          <Readout label="Open" className="hidden md:flex">
            <span data-ro="open">000%</span>
          </Readout>
        </div>
      </Fade>
      <Rule play={play} delay={0.9} />

      {/* Top-right: the promise and the one action */}
      <div className="hidden flex-1 justify-end pt-8 md:flex lg:pt-10 [@media(max-height:760px)]:pt-5">
        <Fade play={play} delay={1.5}>
          {side}
        </Fade>
      </div>
      <div className="flex-1 md:hidden" />

      {/* Bottom-left: the headline, then the monument */}
      <Heading className="text-[clamp(2.5rem,min(7.6vw,13.5vh),9.5rem)] font-bold uppercase leading-[0.9] tracking-[-0.015em]">
        {primary && <span className="sr-only">Asymmetri: </span>}
        <Rise play={play} delay={1.0}>
          Hard problems
          <span className="ml-[0.18em] hidden h-[0.62em] gap-[0.07em] align-[0.04em] sm:inline-flex" aria-hidden>
            <span className="h-full w-[0.15em] skew-x-[26deg] bg-asymmetri-red" />
            <span className="h-full w-[0.06em] skew-x-[26deg] bg-asymmetri-red" />
          </span>
        </Rise>{" "}
        <Rise play={play} delay={1.1} className="text-white/45">
          technology company
        </Rise>
      </Heading>

      <Fade play={play} delay={1.5} className="mt-6 md:hidden">
        {side}
      </Fade>

      <div className="mt-6 md:mt-7 [@media(max-height:760px)]:mt-4">
        <HeroWordmark play={play} delay={1.05} />
      </div>

      <div className="mt-4">
        <Rule play={play} delay={1.15} from="right" />
      </div>
      <Fade
        play={play}
        delay={1.65}
        className="mt-3 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45 md:text-[11px]"
      >
        {/* The shell's chapter HUD owns the bottom-left corner on desktop. */}
        <span className="md:hidden">Tap the field</span>
        <span className="hidden md:inline md:pl-[15.5rem]">{company.tagline}</span>
        <button
          type="button"
          tabIndex={tab}
          onPointerEnter={() => onCue(true)}
          onPointerLeave={() => onCue(false)}
          onFocus={() => onCue(true, false)}
          onBlur={() => onCue(false)}
          onClick={onOpen}
          className="flex items-center gap-2.5 uppercase text-white/75 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          Scroll to open <CutGlyph />
        </button>
      </Fade>
    </div>
  );
}

const HeroContent = memo(HeroContentComponent);

/* ------------------------------------------------------------------ */

export function HeroSplitV2({
  loaded,
  split,
  rootRef,
  manifestoRef,
  sectionRef,
}: {
  loaded: boolean;
  split: Split;
  rootRef: RefObject<HTMLDivElement | null>;
  manifestoRef: RefObject<HTMLDivElement | null>;
  sectionRef: RefObject<HTMLElement | null>;
}) {
  const { geo, clipA, clipB, ax, ay, bx, by, rotA, rotB, origin, tease } = split;
  const ticker = useScrambleTicker(NOW_SOLVING);
  const reduce = useReducedMotion();
  const visibility = useTransform(geo, (g) => (g.open >= 1 ? "hidden" : "visible"));

  const wrapRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const refs = useMemo(
    () => ({ root: rootRef, wrap: wrapRef, field: fieldRef, overlay: overlayRef, manifesto: manifestoRef }),
    [rootRef, manifestoRef],
  );
  const { setCue } = useHeroEngine({ geo, loaded, refs });

  // The halves breathe apart a few pixels: a preview of the cut.
  const teaseNow = useCallback(() => {
    if (reduce || geo.get().cut > 0) return;
    const a = document.activeElement;
    if (a && rootRef.current?.contains(a) && a.matches(":focus-visible")) return;
    animate(tease, [tease.get(), 1, 0.8, 0], {
      duration: 1.5,
      times: [0, 0.3, 0.55, 1],
      ease: [0.65, 0, 0.35, 1],
    });
  }, [reduce, geo, tease, rootRef]);

  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(teaseNow, INTRO_DONE_MS + 1500);
    return () => clearTimeout(t);
  }, [loaded, teaseNow]);

  const onCue = useCallback(
    (on: boolean, tease = true) => {
      setCue(on);
      // Hover previews the cut; keyboard focus only brightens the score line
      // (the focused copy is shown whole, so the halves must not part).
      if (on && tease) teaseNow();
    },
    [setCue, teaseNow],
  );

  const onOpen = useCallback(() => {
    const s = sectionRef.current;
    if (!s) return;
    const top = s.getBoundingClientRect().top + window.scrollY;
    const travel = s.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + travel * (OPEN_END + 0.03), behavior: reduce ? "auto" : "smooth" });
  }, [sectionRef, reduce]);

  return (
    <>
      <motion.div
        ref={wrapRef}
        style={{ visibility }}
        // Hidden until the engine opens the intro slit (it then owns clip-path).
        className="pointer-events-none absolute inset-0 z-[2] overflow-hidden [clip-path:inset(50%_50%_50%_50%)]"
      >
        <canvas ref={fieldRef} className="absolute inset-0 h-full w-full" aria-hidden />
        <motion.div
          style={{ clipPath: clipA, x: ax, y: ay, rotate: rotA, transformOrigin: origin }}
          // Keyboard focus may land on a part of this copy that the cut clips
          // away; while it does, show this copy whole and on top.
          className="pointer-events-auto absolute inset-0 has-[:focus-visible]:z-[1] has-[:focus-visible]:[clip-path:none]!"
        >
          <HeroContent primary play={loaded} ticker={ticker} onCue={onCue} onOpen={onOpen} />
        </motion.div>
        <motion.div
          style={{ clipPath: clipB, x: bx, y: by, rotate: rotB, transformOrigin: origin }}
          className="pointer-events-auto absolute inset-0"
          aria-hidden
        >
          <HeroContent play={loaded} ticker={ticker} onCue={onCue} onOpen={onOpen} />
        </motion.div>
      </motion.div>
      <canvas
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 z-[3] h-full w-full"
        aria-hidden
      />
    </>
  );
}
