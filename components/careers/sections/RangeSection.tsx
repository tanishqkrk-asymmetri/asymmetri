"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useReduceMotion } from "@/hooks/useReduceMotion";
import { practices } from "@/lib/practices";
import { domains, team } from "@/lib/site-content";
import { SectionHead } from "@/components/practice/SectionHead";
import { ScrambleText } from "@/components/practice/ScrambleText";
import { PracticeGlyph } from "@/components/practice/PracticeGlyph";
import { Marquee } from "@/components/practice/Marquee";
import { MaskLines } from "@/components/practice/MaskLines";
import { disciplines, range } from "../content";

const EASE = [0.16, 1, 0.3, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Counts up from zero the first time it scrolls into view. The server renders
 * the final number, so crawlers and no-JS visitors read the real value.
 */
function Counter({ value, suffix, delay }: { value: number; suffix: string; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReduceMotion();
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (!inView || reduce) return;
    let raf = 0;
    const start = performance.now() + delay * 1000;
    const dur = 1100;
    const tick = (now: number) => {
      const t = Math.min(Math.max((now - start) / dur, 0), 1);
      // Ease out, and flicker through a few wrong digits on the way.
      const e = 1 - Math.pow(1 - t, 3);
      setShown(t < 1 ? Math.round(e * value * 10) % 10 : value);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, value, delay]);

  return (
    <span ref={ref} className="tabular-nums">
      {shown}
      {suffix && <span className="text-asymmetri-red">{suffix}</span>}
    </span>
  );
}

/**
 * Three lanes, three projects, each switching domain on its own beat: the
 * "three projects across different domains" claim, drawn as a live board.
 */
function ProjectsInFlight() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -10% 0px" });
  const reduce = useReduceMotion();
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const id = setInterval(() => setBeat((b) => b + 1), 1600);
    return () => clearInterval(id);
  }, [inView, reduce]);

  // Each lane advances on its own beat, so they never switch in step; no two
  // lanes ever show the same domain at once.
  const used: number[] = [];
  const lanes = [0, 1, 2].map((l) => {
    const step = Math.floor((beat + l * 2) / (l + 2));
    let d = (step + l * 2) % domains.length;
    while (used.includes(d)) d = (d + 1) % domains.length;
    used.push(d);
    return { l, step, domain: domains[d], practice: practices[(step + l) % practices.length] };
  });
  return (
    <div ref={ref} className="border border-white/15 bg-white/[0.02]" aria-hidden>
      <div className="flex items-center justify-between border-b border-white/15 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">
        <span>
          <span className="kit-blink mr-2 inline-block size-1.5 bg-asymmetri-red align-middle" />
          In flight · one person
        </span>
        <span>{pad(3)} lanes</span>
      </div>
      <ul>
        {lanes.map(({ l, step, domain, practice }) => {
          return (
            <li key={l} className="relative border-b border-white/10 px-4 py-4 last:border-b-0">
              <div className="mb-3 flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.2em]">
                <span className="text-asymmetri-red">P/{pad(l + 1)}</span>
                <span className="truncate text-white/45">{practice.short}</span>
              </div>
              <p className="min-h-[2.5em] font-chakra-petch text-base leading-tight font-semibold uppercase text-white md:text-lg">
                <ScrambleText text={domain.name} trigger="none" replayKey={domain.name} duration={0.6} />
              </p>
              {/* Track with a travelling slash: the lane's progress this week. */}
              <div className="relative mt-3 h-px w-full bg-white/15">
                <motion.span
                  className="absolute -top-[7px] block h-[15px] w-[5px] -skew-x-[26deg] bg-asymmetri-red"
                  initial={false}
                  animate={{ left: `${((step * 37 + l * 23) % 88) + 4}%` }}
                  transition={{ duration: 0.9, ease: EASE }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function PracticeRow({ p, i }: { p: (typeof practices)[number]; i: number }) {
  const [hover, setHover] = useState(false);
  const [replay, setReplay] = useState(0);
  const on = () => {
    setHover(true);
    setReplay((r) => r + 1);
  };
  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.7, delay: i * 0.07, ease: EASE }}
      className="border-b border-white/15"
    >
      <a
        href={p.href}
        onMouseEnter={on}
        onMouseLeave={() => setHover(false)}
        onFocus={on}
        onBlur={() => setHover(false)}
        className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-4 overflow-hidden py-6 outline-none md:grid-cols-[4rem_4rem_1.2fr_1fr_auto] md:gap-8 md:py-8"
      >
        <span
          aria-hidden
          className="absolute inset-y-0 -left-[10%] w-[120%] origin-left -skew-x-[26deg] scale-x-0 bg-asymmetri-red transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
        />
        <span className="relative font-mono text-[11px] tracking-[0.2em] text-asymmetri-red transition-colors group-hover:text-white group-focus-visible:text-white md:pl-2">
          {p.index}
        </span>
        <span className="relative hidden md:block">
          <PracticeGlyph kind={p.glyph} active={hover} color="#ffffff" className="size-12" />
        </span>
        <span className="relative min-w-0">
          <span className="block font-chakra-petch text-2xl leading-[0.95] font-bold uppercase md:text-4xl">
            <ScrambleText text={p.name} trigger="none" replayKey={replay} duration={0.5} />
          </span>
          <span className="mt-2 block font-geist text-sm text-white/55 transition-colors group-hover:text-white md:hidden">
            {p.tagline}
          </span>
        </span>
        <span className="relative hidden font-geist text-base leading-snug text-white/55 transition-colors group-hover:text-white md:block">
          {p.tagline}
        </span>
        <ArrowUpRight
          aria-hidden
          className="relative size-6 shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 md:mr-2 md:size-8"
          strokeWidth={1.5}
        />
      </a>
    </motion.li>
  );
}

/** The range of the work: counters, live lanes, the four practices, domains and disciplines. */
export function RangeSection() {
  return (
    <section
      data-chapter="Work"
      data-nav="dark"
      aria-labelledby="careers-range"
      className="relative overflow-hidden bg-black py-28 text-white md:py-36"
    >
      <div className="px-6 md:px-16">
        <div id="careers-range">
          <SectionHead kicker={range.kicker} title={range.titleLines} body={range.body} />
        </div>

        {/* Counters + live lanes */}
        <div className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-[1.5fr_1fr] lg:items-stretch">
          <dl className="grid grid-cols-2 border-t border-l border-white/15">
            {range.stats.map((s, i) => (
              <div key={s.label} className="relative flex flex-col justify-between gap-6 border-r border-b border-white/15 p-5 md:p-8">
                <dt className="order-2 font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-white/55 md:text-[11px]">
                  {s.label}
                </dt>
                <dd className="order-1 font-chakra-petch text-7xl leading-none font-bold md:text-9xl">
                  <Counter value={s.n} suffix={s.suffix} delay={i * 0.12} />
                </dd>
                <span aria-hidden className="absolute top-4 right-4 font-mono text-[9px] tracking-[0.2em] text-white/25">
                  {pad(i + 1)}
                </span>
              </div>
            ))}
          </dl>
          <ProjectsInFlight />
        </div>

        {/* The four practices */}
        <div className="mt-24 md:mt-32">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <h3 className="font-chakra-petch text-2xl font-bold uppercase md:text-4xl">
              Where the work <span className="text-asymmetri-red">lands.</span>
            </h3>
            <a
              href="/#what-we-do"
              className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50 hover:text-white md:text-[11px]"
            >
              What we do ↗
            </a>
          </div>
          <ul className="border-t border-white/15">
            {practices.map((p, i) => (
              <PracticeRow key={p.slug} p={p} i={i} />
            ))}
          </ul>
        </div>
      </div>

      {/* Domains */}
      <div className="mt-20 md:mt-28">
        <p className="mb-6 px-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/45 md:px-16 md:text-xs">
          Across five domains
        </p>
        <Marquee
          speed={60}
          itemClassName="py-2"
          separator={<span aria-hidden className="inline-block h-[0.7em] w-[0.22em] -skew-x-[26deg] bg-asymmetri-red" />}
          items={domains.map((d) => (
            <span key={d.name} className="font-chakra-petch text-4xl font-bold whitespace-nowrap uppercase md:text-7xl">
              {d.name}
            </span>
          ))}
        />
      </div>

      {/* Disciplines */}
      <div className="mt-24 px-6 md:mt-32 md:px-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.3em] text-asymmetri-red md:text-xs">
              <ScrambleText text={disciplines.kicker} />
            </p>
            <h3 className="font-chakra-petch text-3xl leading-[0.95] font-bold uppercase md:text-5xl">
              <MaskLines lines={[disciplines.title]} />
            </h3>
          </div>
          <ul className="border-t border-white/15">
            {team.map((t, i) => (
              <motion.li
                key={t.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: EASE }}
                className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 gap-y-1 border-b border-white/15 py-5 md:grid-cols-[3rem_1fr_1fr] md:py-6"
              >
                <span className="font-mono text-[10px] tracking-[0.2em] text-white/35 transition-colors group-hover:text-asymmetri-red">
                  {pad(i + 1)}
                </span>
                <span className="font-chakra-petch text-3xl leading-none font-bold text-transparent uppercase transition-colors duration-300 [-webkit-text-stroke:1px_rgba(255,255,255,0.4)] group-hover:text-white md:text-5xl">
                  {t.name}
                </span>
                <span className="col-start-2 font-geist text-sm text-white/55 md:col-start-3 md:text-base">
                  {t.body}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
