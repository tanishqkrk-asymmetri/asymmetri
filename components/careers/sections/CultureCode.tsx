"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValueEvent, useTransform } from "motion/react";
import { MaskLines } from "@/components/practice/MaskLines";
import { ScrambleText } from "@/components/practice/ScrambleText";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { useReduceMotion } from "@/hooks/useReduceMotion";
import { cultureCode } from "../content";
import { CultureGlyph } from "./cultureGlyphs";

const N = cultureCode.rules.length;
const pad = (n: number) => String(n).padStart(2, "0");
// Track travel happens over this span of the pinned progress.
const SPAN: [number, number] = [0.04, 0.96];

function RuleCard({
  rule,
  i,
  current,
  reduce,
}: {
  rule: (typeof cultureCode.rules)[number];
  i: number;
  current: boolean;
  reduce: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { margin: "-15% -10% -15% -10%" });
  const [hover, setHover] = useState(false);
  const active = inView || hover;

  return (
    <li
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative flex min-h-[22rem] w-full shrink-0 flex-col justify-between overflow-hidden border border-white/15 bg-black p-6 md:h-[min(64vh,36rem)] md:min-h-0 md:w-[min(30rem,36vw)] md:p-8 md:group-data-[static=true]/cc:h-auto md:group-data-[static=true]/cc:min-h-[26rem]"
    >
      {/* Red flood from the bottom on hover. */}
      <span
        aria-hidden
        className="absolute inset-0 origin-bottom scale-y-0 bg-asymmetri-red transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
      />
      <span
        aria-hidden
        className={`absolute top-0 left-0 h-[2px] w-full origin-left bg-asymmetri-red transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${current ? "scale-x-100" : "scale-x-0"}`}
      />
      <div className="relative flex items-start justify-between gap-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.25em]">
          <span className="text-asymmetri-red transition-colors group-hover:text-white">Rule {pad(i + 1)}</span>
          <span className="text-white/30 group-hover:text-white/60"> / {pad(N)}</span>
        </span>
        <CultureGlyph
          kind={rule.glyph}
          active={active}
          reduce={reduce}
          className="size-24 md:size-36 xl:size-40"
        />
      </div>
      <div className="relative">
        <h3 className="kit-glitch font-chakra-petch text-3xl leading-[0.95] font-bold uppercase md:text-[2.6rem] xl:text-5xl">
          {rule.title}
        </h3>
        <p className="mt-4 max-w-sm font-geist text-base leading-relaxed text-white/70 group-hover:text-white md:text-lg">
          {rule.body}
        </p>
      </div>
    </li>
  );
}

/**
 * The culture code: eight rules on a pinned horizontal track (md+), each
 * with its own animated glyph. Falls back to a vertical stack on phones and
 * for reduced motion.
 */
export function CultureCode() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const p = useSectionProgress(ref);
  const reduce = useReduceMotion();
  const [distance, setDistance] = useState(0);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const md = window.matchMedia("(min-width: 768px)").matches;
      setDistance(md && !reduce ? Math.max(0, track.scrollWidth - window.innerWidth) : 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [reduce]);

  const x = useTransform(p, SPAN, [0, -distance]);
  const bar = useTransform(p, SPAN, [0, 1]);
  useMotionValueEvent(p, "change", (v) => {
    const t = Math.min(Math.max((v - SPAN[0]) / (SPAN[1] - SPAN[0]), 0), 0.999);
    setCurrent(Math.floor(t * N));
  });

  return (
    <section
      ref={ref}
      id="culture-code"
      data-chapter="Culture"
      data-nav="dark"
      data-static={reduce ? "true" : "false"}
      aria-labelledby="culture-code-title"
      className="group/cc relative scroll-mt-14 bg-black text-white md:h-[520vh] md:data-[static=true]:h-auto"
    >
      <div className="relative py-24 md:sticky md:top-0 md:flex md:h-screen md:items-center md:overflow-hidden md:py-0 md:pt-14 md:group-data-[static=true]/cc:static md:group-data-[static=true]/cc:h-auto md:group-data-[static=true]/cc:py-32">
        <motion.ul
          ref={trackRef}
          style={distance ? { x } : undefined}
          className="flex flex-col gap-4 px-6 md:w-max md:flex-row md:items-stretch md:gap-6 md:px-16 md:pr-[12vw] md:group-data-[static=true]/cc:w-auto md:group-data-[static=true]/cc:flex-wrap"
        >
          <li className="flex shrink-0 flex-col justify-between gap-10 pb-6 md:h-[min(64vh,36rem)] md:w-[min(34rem,40vw)] md:pr-10 md:pb-0 md:group-data-[static=true]/cc:h-auto md:group-data-[static=true]/cc:w-full">
            <div>
              <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.3em] text-asymmetri-red md:text-xs">
                <ScrambleText text={cultureCode.kicker} />
              </p>
              <h2
                id="culture-code-title"
                className="font-chakra-petch text-[15vw] leading-[0.88] font-bold uppercase md:text-[5.4vw] xl:text-[5.8rem]"
              >
                <MaskLines
                  lines={cultureCode.titleLines.map((l, i) =>
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
              <p className="mt-6 max-w-sm font-geist text-base leading-relaxed text-white/60 md:text-lg">
                {cultureCode.intro}
              </p>
            </div>
            <p className="hidden items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 md:flex md:group-data-[static=true]/cc:hidden">
              Keep scrolling
              <span className="inline-block h-px w-16 bg-white/40" />→
            </p>
          </li>
          {cultureCode.rules.map((r, i) => (
            <RuleCard key={r.title} rule={r} i={i} current={!!distance && current === i} reduce={reduce} />
          ))}
        </motion.ul>

        {/* Progress rail + counter, pinned mode only. */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-[5.25rem] right-16 left-16 hidden items-center gap-6 font-mono text-[10px] uppercase tracking-[0.25em] text-white/50 md:flex md:group-data-[static=true]/cc:hidden"
        >
          <span className="text-white">
            Rule <span className="text-asymmetri-red">{pad(current + 1)}</span> / {pad(N)}
          </span>
          <span className="relative h-px flex-1 bg-white/15">
            <motion.span style={{ scaleX: bar }} className="absolute inset-0 origin-left bg-asymmetri-red" />
          </span>
          <span className="max-w-[16rem] truncate">{cultureCode.rules[current]?.title}</span>
        </div>
      </div>
    </section>
  );
}
