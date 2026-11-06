"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { animate, motion, useTransform } from "motion/react";
import { useReduceMotion } from "@/hooks/useReduceMotion";
import { CUT_DEG, type useHeroSplit } from "@/hooks/useHeroSplit";
import { company } from "@/lib/site-content";
import { OPEN_END } from "../timeline";
import { APERTURE_GAP, useApertureEngine } from "./useApertureEngine";

/**
 * Hero variant "aperture". The hero is a closed black door. A hairline of
 * light leaks through the logo's slash: the board behind, the manifesto, is
 * white. The headline catches that light (brightest at the slit), the cursor
 * pries the slit open where it nears it, a click flares it, and scrolling
 * opens the door. The loader hands over by the two halves slamming shut over
 * the white intro card, so the last of the white is the slit.
 */

export const APERTURE_SPLIT = { gap: APERTURE_GAP, startOpen: true } as const;

const EASE = [0.16, 1, 0.3, 1] as const;
// Two units per line. On phones each unit is its own row, so "The hard" stays together.
const LINES = [
  ["The hard", "problems"],
  ["Technology", "company"],
];
const WORDS = LINES.flat();
// Slam lands ~0.84 × 0.95 s after the loader; the type rises right after.
const SLAM_S = 0.95;
const PLAY_MS = 780;

type Split = ReturnType<typeof useHeroSplit>;

/* ------------------------------------------------------------------ */

function Rise({ children, delay, play }: { children: React.ReactNode; delay: number; play: boolean }) {
  return (
    <span className="block overflow-hidden pb-[0.02em] md:inline-block">
      <motion.span
        className="block"
        initial={{ y: "102%" }}
        animate={{ y: play ? "0%" : "102%" }}
        transition={{ duration: 1.1, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
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
      initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
      animate={play ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Light map multiplied over the headline: bright at the slit and the lens. */
const LIGHT_MAP = [
  "radial-gradient(circle var(--lr, 200px) at var(--lx, 54%) var(--ly, 50%), rgba(255,255,255,var(--la, 0.3)), rgba(255,255,255,0) 100%)",
  [
    "linear-gradient(63.6deg",
    "#5c5c5c calc(var(--sp, 50%) - 980px)",
    "#8f8f8f calc(var(--sp, 50%) - 300px)",
    "#e6e6e6 calc(var(--sp, 50%) - 22px)",
    // The letters' last sliver before the slit takes the logo's red.
    "#ffffff calc(var(--sp, 50%) - 14px)",
    "#cd1717 calc(var(--sp, 50%) - 13px)",
    "#cd1717 calc(var(--sp, 50%) - 4px)",
    "#ffffff calc(var(--sp, 50%) - 3px)",
    "#ffffff calc(var(--sp, 50%) + 20px)",
    "#8f8f8f calc(var(--sp, 50%) + 300px)",
    "#5c5c5c calc(var(--sp, 50%) + 980px))",
  ].join(", "),
].join(", ");

/* ------------------------------------------------------------------ */
/* One half's copy. Rendered twice; the second copy is aria-hidden.     */
/* ------------------------------------------------------------------ */

function DoorComponent({
  primary,
  play,
  onCue,
  onOpen,
}: {
  primary?: boolean;
  play: boolean;
  onCue: (on: boolean) => void;
  onOpen: () => void;
}) {
  const tab = primary ? undefined : -1;
  const Heading = primary ? "h1" : "p";

  return (
    <div className="absolute inset-0 bg-black font-chakra-petch text-white">
      {/* Headline, lit by the slit */}
      <div className="absolute inset-0">
        <Heading
          data-hl
          className="absolute inset-0 flex flex-col justify-center px-5 pt-[6.5rem] pb-[16.5rem] text-[17vw] leading-[0.84] font-bold uppercase tracking-[-0.02em] sm:px-8 md:px-12 md:pt-[8rem] md:pb-[13.5rem] [@media(max-height:760px)]:md:pb-[12rem]"
        >
          {primary && <span className="sr-only">Asymmetri: </span>}
          {LINES.map((line, li) => (
            <span key={li} data-fit-line={li} className="block md:whitespace-nowrap">
              {line.map((word, wi) => {
                const i = li * 2 + wi;
                return (
                  <span key={word}>
                    <span data-fit-word={i} className="block md:inline">
                      <Rise play={play} delay={0.05 + i * 0.07}>
                        {word}
                      </Rise>
                    </span>
                    {wi === 0 && " "}
                  </span>
                );
              })}
            </span>
          ))}
        </Heading>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-multiply"
          style={{ backgroundImage: LIGHT_MAP }}
        />
      </div>

      {/* Furniture */}
      <div className="absolute inset-0 flex flex-col px-5 pt-[4.5rem] pb-4 sm:px-8 md:px-12 md:pt-[5.25rem] md:pb-6">
        <Fade
          play={play}
          delay={0.55}
          className="flex items-start justify-between gap-6 font-mono text-[10px] uppercase tracking-[0.22em] text-white/50 md:text-[11px]"
        >
          <p className="flex min-w-0 items-center gap-4 md:gap-5">
            {/* Room for the floating wordmark (hero/LogoHandoff.tsx), which flies to the navbar on open. */}
            <span className="block h-[18.5px] w-32 shrink-0 md:w-40" aria-hidden />
            <span className="hidden truncate border-l border-white/20 pl-4 md:inline md:pl-5">{company.tagline}</span>
          </p>
          <div className="flex shrink-0 gap-6 lg:gap-9" aria-hidden>
            <span className="flex items-baseline gap-2">
              <span className="text-white/35">Aperture</span>
              <span className="tabular-nums text-white">
                <span data-ro="ap">05.0</span> px
              </span>
            </span>
            <span className="hidden items-baseline gap-2 md:flex">
              <span className="text-white/35">Cut</span>
              <span className="tabular-nums text-white">{CUT_DEG.toFixed(1)}°</span>
            </span>
            <span className="hidden items-baseline gap-2 md:flex">
              <span className="text-white/35">Open</span>
              <span className="tabular-nums text-white" data-ro="open">
                000%
              </span>
            </span>
          </div>
        </Fade>

        <div className="flex-1" />

        <Fade play={play} delay={0.75} className="md:ml-auto md:w-[22rem]">
          <p className="max-w-[16.5rem] font-geist sm:max-w-[21rem] text-[15px] leading-relaxed text-white/70 md:text-base">
            Engineering intelligence into the way global brands operate.
          </p>
          <span data-cta={primary ? "primary" : "copy"} className="mt-5 inline-block">
            <a
              href="/contact-us"
              tabIndex={tab}
              className="group relative inline-flex items-center gap-3 overflow-hidden bg-asymmetri-red px-5 py-3.5 font-chakra-petch text-sm font-semibold uppercase tracking-wide text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
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
        </Fade>

        <Fade
          play={play}
          delay={0.95}
          className="mt-6 flex items-center justify-between gap-4 border-t border-white/15 pt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45 md:mt-7 md:text-[11px]"
        >
          <span aria-hidden />
          <button
            type="button"
            tabIndex={tab}
            onPointerEnter={() => onCue(true)}
            onPointerLeave={() => onCue(false)}
            onFocus={() => onCue(true)}
            onBlur={() => onCue(false)}
            onClick={onOpen}
            className="flex items-center gap-2.5 uppercase text-white/75 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Scroll to open
            <span className="relative flex h-3.5 items-center gap-[3px]" aria-hidden>
              <span className="h-full w-[4px] skew-x-[26deg] bg-asymmetri-red" />
              <span className="h-full w-[1.5px] skew-x-[26deg] bg-white" />
            </span>
          </button>
        </Fade>
      </div>
    </div>
  );
}

const Door = memo(DoorComponent);

/* ------------------------------------------------------------------ */

/** Fits the headline to the full width at one size for every line (desktop) or word (phones). */
function useFitHeadline(wrapRef: RefObject<HTMLDivElement | null>, measureRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const wrap = wrapRef.current;
    const m = measureRef.current;
    if (!wrap || !m) return;
    const fit = () => {
      const h1 = wrap.querySelector<HTMLElement>("[data-hl]");
      if (!h1) return;
      const cs = getComputedStyle(h1);
      const target = h1.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const room = h1.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      const lh = parseFloat(cs.lineHeight) / parseFloat(cs.fontSize) || 0.84;
      const wide = wrap.clientWidth >= 768;
      const units = Array.from(m.querySelectorAll<HTMLElement>(wide ? "[data-m-line]" : "[data-m-word]"));
      // Every line (or word, on phones) shares one size: the largest at which
      // the longest of them still fits the width.
      const same = (v: number[]) => v.map(() => Math.min(...v));
      let sizes = same(units.map((u) => (target / Math.max(u.offsetWidth, 1)) * 100));
      // Keep the stack inside the room it has (short screens).
      const total = sizes.reduce((s, v) => s + v * lh, 0);
      if (total > room && room > 0) sizes = sizes.map((v) => (v * room) / total);
      const apply = () => {
        wrap.querySelectorAll<HTMLElement>("[data-fit-line]").forEach((el) => {
          const i = Number(el.dataset.fitLine);
          el.style.fontSize = wide ? `${sizes[i].toFixed(2)}px` : "";
        });
        wrap.querySelectorAll<HTMLElement>("[data-fit-word]").forEach((el) => {
          const i = Number(el.dataset.fitWord);
          el.style.fontSize = wide ? "" : `${sizes[i].toFixed(2)}px`;
        });
      };
      apply();
      // Second pass against the real lines (word spacing, rounding).
      if (wide) {
        const range = document.createRange();
        const lines = Array.from(h1.querySelectorAll<HTMLElement>("[data-fit-line]"));
        sizes = sizes.map((v, i) => {
          const el = lines[i];
          if (!el) return v;
          range.selectNodeContents(el);
          const real = range.getBoundingClientRect().width;
          return real > 0 ? (v * target) / real : v;
        });
        sizes = same(sizes);
        apply();
      }
    };
    fit();
    document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [wrapRef, measureRef]);
}

export function HeroAperture({
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
  const { geo, ax, ay, bx, by, rotA, rotB, origin, tease, closed } = split;
  const reduce = useReduceMotion();
  const visibility = useTransform(geo, (g) => (g.open >= 1 ? "hidden" : "visible"));
  const [play, setPlay] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const aRef = useRef<HTMLDivElement>(null);
  const bRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const refs = useMemo(
    () => ({ root: rootRef, wrap: wrapRef, halfA: aRef, halfB: bRef, overlay: overlayRef, manifesto: manifestoRef }),
    [rootRef, manifestoRef],
  );
  const { setCue } = useApertureEngine({ geo, closed, loaded, refs });
  useFitHeadline(wrapRef, measureRef);

  // The slam: the halves close over the white loader card.
  useEffect(() => {
    if (!loaded) return;
    if (reduce) {
      closed.set(1);
      const t = setTimeout(() => setPlay(true), 0);
      return () => clearTimeout(t);
    }
    const a = animate(closed, 1, { duration: SLAM_S, ease: "linear" });
    const t = setTimeout(() => setPlay(true), PLAY_MS);
    return () => {
      a.stop();
      clearTimeout(t);
    };
  }, [loaded, reduce, closed]);

  // A breath: the halves part a few pixels, then settle.
  const breathe = useCallback(
    (to: number) => {
      if (reduce || geo.get().open > 0) return;
      animate(tease, to, { duration: to ? 0.7 : 0.9, ease: [0.65, 0, 0.35, 1] });
    },
    [reduce, geo, tease],
  );
  useEffect(() => {
    if (!play || reduce) return;
    const t = setTimeout(() => {
      if (geo.get().open > 0) return;
      animate(tease, [0, 1.6, 0], { duration: 1.6, times: [0, 0.35, 1], ease: [0.65, 0, 0.35, 1] });
    }, 2600);
    return () => clearTimeout(t);
  }, [play, reduce, geo, tease]);

  const onCue = useCallback(
    (on: boolean) => {
      setCue(on);
      breathe(on ? 1.4 : 0);
    },
    [setCue, breathe],
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
        style={{ visibility: loaded ? visibility : "hidden" }}
        className="pointer-events-none absolute inset-0 z-[2] overflow-hidden"
      >
        <motion.div
          ref={aRef}
          style={{ x: ax, y: ay, rotate: rotA, transformOrigin: origin }}
          // Keyboard focus may land on a part of this copy that the cut clips
          // away; while it does, show this copy whole and on top.
          className="pointer-events-auto absolute inset-0 [clip-path:inset(0_100%_0_0)] has-[:focus-visible]:z-[1] has-[:focus-visible]:[clip-path:none]!"
        >
          <Door primary play={play} onCue={onCue} onOpen={onOpen} />
        </motion.div>
        <motion.div
          ref={bRef}
          style={{ x: bx, y: by, rotate: rotB, transformOrigin: origin }}
          className="pointer-events-auto absolute inset-0 [clip-path:inset(0_0_0_100%)]"
          aria-hidden
        >
          <Door play={play} onCue={onCue} onOpen={onOpen} />
        </motion.div>

        {/* Natural widths of the headline lines and words, at 100px. */}
        <div
          ref={measureRef}
          aria-hidden
          className="invisible absolute top-0 left-0 font-chakra-petch text-[100px] font-bold whitespace-nowrap uppercase tracking-[-0.02em]"
        >
          {LINES.map((line, i) => (
            <span key={i} data-m-line={i} className="inline-block">
              {line.join(" ")}
            </span>
          ))}
          {WORDS.map((word, i) => (
            <span key={word} data-m-word={i} className="inline-block">
              {word}
            </span>
          ))}
        </div>
      </motion.div>
      <canvas
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 z-[3] h-full w-full"
        aria-hidden
      />
    </>
  );
}
