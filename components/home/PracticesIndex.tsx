"use client";

import { memo, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { practices } from "@/lib/practices";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { PracticeGlyph } from "@/components/practice/PracticeGlyph";
import { ScrambleText } from "@/components/practice/ScrambleText";
import { MorphField } from "@/components/home/whatwedo/MorphField";

const SIGNATURE = ["Agent mesh", "Compile to interface", "Tangle to lanes", "Interference field"];
const EASE = [0.16, 1, 0.3, 1] as const;

/** Static four-up for reduced motion: same content, no pinning. */
function StaticIndex() {
  return (
    <ul className="grid border-t border-black/15 md:grid-cols-2">
      {practices.map((p) => (
        <li key={p.slug} className="border-b border-black/15 md:odd:border-r">
          <a href={p.href} className="group flex h-full flex-col gap-5 p-6 md:p-10">
            <div className="flex items-start justify-between">
              <span className="font-mono text-[11px] tracking-[0.2em] text-asymmetri-red">{p.index}</span>
              <PracticeGlyph kind={p.glyph} className="size-12 text-black" />
            </div>
            <h3 className="font-chakra-petch text-3xl leading-[0.95] font-bold uppercase md:text-4xl">{p.name}</h3>
            <p className="font-chakra-petch text-lg font-medium">{p.tagline}</p>
            <p className="font-geist text-sm leading-relaxed text-black/65">{p.summary}</p>
            <span className="mt-auto font-mono text-[11px] uppercase tracking-[0.2em] text-asymmetri-red">
              Enter the practice ↗
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/**
 * The homepage's overview of the four practices: a pinned scene where one
 * particle field re-forms into each practice's signature as you scroll.
 * Hovering or focusing a practice previews it out of turn.
 */
function PracticesIndexComponent() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const p = useSectionProgress(ref, "pin");
  const [scrolled, setScrolled] = useState(0);
  const [preview, setPreview] = useState<number | null>(null);
  const [plays, setPlays] = useState(0);
  useMotionValueEvent(p, "change", (v) => {
    const i = Math.min(3, Math.floor(v * 4));
    if (i !== scrolled) {
      setScrolled(i);
      setPlays((n) => n + 1);
    }
  });
  const bar = useTransform(p, [0, 1], ["0%", "100%"]);
  const active = preview ?? scrolled;
  const cur = practices[active];

  const jump = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + span * ((i + 0.5) / 4), behavior: "smooth" });
  };
  const show = (i: number) => {
    if (i !== active) setPlays((n) => n + 1);
    setPreview(i);
  };

  if (reduce) return <StaticIndex />;

  return (
    <div ref={ref} className="relative h-[250vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden px-5 pt-[4.5rem] pb-5 md:px-16 md:pt-20 md:pb-16">
        {/* HUD rule */}
        <div className="flex items-center justify-between gap-4 border-b border-black/15 pb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-black/55">
          <span>
            <span className="text-asymmetri-red">Index</span>
            <span className="hidden sm:inline"> · Four practices, one team</span>
          </span>
          <span className="hidden md:inline">Hover to preview · Scroll to advance</span>
          <span className="md:hidden">{cur.index} / 04</span>
        </div>

        <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto] gap-4 pt-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.3fr)] lg:grid-rows-1 lg:gap-12 lg:pt-8">
          {/* Stage */}
          <div className="relative min-h-0 border border-black/15 lg:order-2">
            <span
              className="kit-outline-dark pointer-events-none absolute -right-2 -bottom-6 font-chakra-petch text-[38vw] leading-none font-bold select-none md:text-[22vw] lg:text-[16vw]"
              aria-hidden
            >
              {cur.index}
            </span>
            <MorphField index={active} className="absolute inset-0" />
            {/* Crop marks */}
            {["top-0 left-0 border-t-2 border-l-2", "top-0 right-0 border-t-2 border-r-2", "bottom-0 left-0 border-b-2 border-l-2", "right-0 bottom-0 border-r-2 border-b-2"].map((c) => (
              <span key={c} className={`pointer-events-none absolute -m-px size-3 border-asymmetri-red ${c}`} aria-hidden />
            ))}
            <div className="pointer-events-none absolute inset-x-3 top-3 flex justify-between font-mono text-[9px] uppercase tracking-[0.25em] text-black/55 md:inset-x-4 md:top-4 md:text-[10px]" aria-hidden>
              <span>
                SIG/{cur.index} · <ScrambleText text={SIGNATURE[active]} trigger="none" replayKey={plays} duration={0.5} />
              </span>
              <span className="hidden sm:inline">
                <span className="kit-blink mr-2 inline-block size-1.5 bg-asymmetri-red align-middle" />
                Live field
              </span>
            </div>
            <div className="pointer-events-none absolute inset-x-3 bottom-3 hidden font-mono text-[10px] uppercase tracking-[0.25em] text-black/45 md:inset-x-4 md:bottom-4 md:block" aria-hidden>
              Cursor {active === 0 ? "draws nodes in" : active === 1 ? "pushes the layout" : active === 2 ? "is the comb" : "is a third source"}
            </div>
          </div>

          {/* Index + detail */}
          <div className="flex min-h-0 flex-col lg:order-1">
            <ol
              className="border-t border-black/15"
              onMouseLeave={() => setPreview(null)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setPreview(null);
              }}
            >
              {practices.map((pr, i) => {
                const on = i === active;
                return (
                  <li key={pr.slug} className="border-b border-black/15">
                    <a
                      href={pr.href}
                      onMouseEnter={() => show(i)}
                      onFocus={() => show(i)}
                      className="group relative flex items-center gap-3 overflow-hidden py-2 focus-visible:outline-none md:gap-5 md:py-3 [@media(max-height:760px)]:py-1.5"
                    >
                      <span
                        className={`absolute inset-0 bg-black transition-[clip-path] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${on ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_100%_0_0)]"}`}
                        aria-hidden
                      />
                      <span className={`relative w-7 pl-2 font-mono text-[10px] tracking-[0.2em] md:w-10 md:text-[11px] ${on ? "text-asymmetri-red" : "text-black/45"}`}>
                        {pr.index}
                      </span>
                      <h3
                        className={`relative min-w-0 flex-1 truncate font-chakra-petch text-[1.05rem] leading-tight font-bold uppercase transition-colors duration-300 sm:text-xl md:text-[clamp(1.1rem,1.55vw,1.75rem)] ${on ? "text-white" : "text-black/40 group-hover:text-black"}`}
                      >
                        <span className="sm:hidden">{pr.short}</span>
                        <span className="hidden sm:inline">{pr.name}</span>
                      </h3>
                      <PracticeGlyph
                        kind={pr.glyph}
                        active={on}
                        color={on ? "#ffffff" : "#000000"}
                        className={`relative mr-2 size-7 shrink-0 transition-opacity md:size-9 ${on ? "opacity-100" : "opacity-45 group-hover:opacity-100"}`}
                      />
                    </a>
                  </li>
                );
              })}
            </ol>

            {/* Detail panels share one grid cell; only the active one is live. */}
            <div className="relative mt-4 grid min-h-0 flex-1 md:mt-8">
              {practices.map((pr, i) => {
                const on = i === active;
                return (
                  <motion.div
                    key={pr.slug}
                    initial={false}
                    animate={on ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 14, filter: "blur(6px)" }}
                    transition={{ duration: on ? 0.55 : 0.25, ease: EASE, delay: on ? 0.08 : 0 }}
                    className={`col-start-1 row-start-1 flex min-h-0 flex-col ${on ? "" : "pointer-events-none"}`}
                    aria-hidden={!on}
                    inert={!on}
                  >
                    <p className="font-chakra-petch text-xl leading-tight font-semibold uppercase md:text-[clamp(1.4rem,2.2vw,2.25rem)]">
                      {pr.tagline}
                    </p>
                    <p className="mt-3 hidden max-w-lg font-geist text-sm leading-relaxed text-black/65 md:block md:text-base [@media(max-height:760px)]:text-sm">
                      {pr.summary}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-1.5 md:mt-5 [@media(max-height:760px)]:hidden">
                      {pr.capabilities.map((c, k) => (
                        <li
                          key={c}
                          className={`border border-black/20 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-black/70 md:text-[10px] ${k > 2 ? "hidden sm:block" : ""}`}
                        >
                          {c}
                        </li>
                      ))}
                    </ul>
                    <a
                      href={pr.href}
                      tabIndex={on ? 0 : -1}
                      className="group/cta relative mt-4 inline-flex w-fit items-center gap-3 overflow-hidden bg-black px-4 py-2.5 font-chakra-petch text-sm font-semibold uppercase tracking-wide text-white md:mt-auto md:px-5 md:py-3"
                    >
                      <span className="absolute inset-0 origin-left scale-x-0 bg-asymmetri-red transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/cta:scale-x-100" />
                      <span className="relative">Enter {pr.short}</span>
                      <ArrowUpRight className="relative size-4" strokeWidth={1.75} />
                    </a>
                  </motion.div>
                );
              })}
            </div>

            {/* Progress: four segments, each one jumps to its practice. */}
            <div className="mt-4 hidden grid-cols-4 gap-1.5 md:mt-6 lg:grid" role="group" aria-label="Jump to a practice">
              {practices.map((pr, i) => (
                <button
                  key={pr.slug}
                  type="button"
                  onClick={() => jump(i)}
                  className="group/seg relative h-6 cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-asymmetri-red"
                  aria-label={`Show ${pr.name}`}
                >
                  <span className="absolute inset-x-0 top-0 h-px bg-black/20" />
                  <span className={`absolute inset-x-0 top-0 h-[3px] transition-colors ${i === active ? "bg-asymmetri-red" : "bg-transparent group-hover/seg:bg-black/40"}`} />
                  <span className="absolute top-2 left-0 font-mono text-[9px] uppercase tracking-[0.2em] text-black/45">{pr.index}</span>
                </button>
              ))}
            </div>
            <div className="mt-3 h-px w-full bg-black/10 lg:hidden" aria-hidden>
              <motion.div style={{ width: bar }} className="h-full bg-asymmetri-red" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const PracticesIndex = memo(PracticesIndexComponent);
