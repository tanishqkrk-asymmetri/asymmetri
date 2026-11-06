"use client";

import { memo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";
import { ArrowRight } from "lucide-react";
import { practices } from "@/lib/practices";
import { PracticeGlyph } from "@/components/practice/PracticeGlyph";
import { ScrambleText } from "@/components/practice/ScrambleText";

// The services accordion this replaces was exactly 652px tall, and the home
// page's original scroll animations are timed against the page height. Keep
// this block at the same fixed height so none of them drift.
const HEIGHT = 652;
const EASE = [0.16, 1, 0.3, 1] as const;

function Row({
  p,
  i,
  active,
  onEnter,
}: {
  p: (typeof practices)[number];
  i: number;
  active: boolean;
  onEnter: () => void;
}) {
  const [plays, setPlays] = useState(0);
  const enter = () => {
    setPlays((n) => n + 1);
    onEnter();
  };
  return (
    <motion.li
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
      className="relative border-b border-black/20 last:border-b-0"
    >
      <a
        href={p.href}
        onMouseEnter={enter}
        onFocus={enter}
        className="sound group relative grid h-full grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 overflow-hidden px-5 text-black focus-visible:outline-none md:grid-cols-[3.5rem_1fr_14rem_3rem] md:px-8"
      >
        {/* Black wipe from the left on hover/focus */}
        <span
          className={`absolute inset-0 bg-black transition-[clip-path] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${active ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_100%_0_0)]"}`}
          aria-hidden
        />
        <span
          className={`relative font-mono text-[11px] tracking-[0.2em] transition-colors duration-300 ${active ? "text-asymmetri-red" : "text-black/50"}`}
        >
          {p.index}
        </span>
        <span className="relative min-w-0">
          <span
            className={`block font-chakra-petch text-2xl leading-[0.95] font-bold uppercase transition-[color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:text-[clamp(1.6rem,3vw,3.25rem)] ${active ? "translate-x-2 text-white md:-translate-y-3" : ""}`}
          >
            <ScrambleText text={p.name} trigger="none" replayKey={plays} duration={0.55} />
          </span>
          <span
            className={`mt-2 block font-geist text-sm transition-colors duration-300 md:hidden ${active ? "text-white/70" : "text-black/60"}`}
          >
            {p.tagline}
          </span>
          <span
            className={`absolute top-full left-2 hidden w-[calc(100%-0.5rem)] flex-nowrap gap-1.5 overflow-hidden transition-[opacity,transform] duration-500 md:flex ${active ? "-translate-y-1 opacity-100" : "translate-y-2 opacity-0"}`}
            aria-hidden={!active}
          >
            {p.capabilities.slice(0, 3).map((c) => (
              <span
                key={c}
                className="shrink-0 border border-white/25 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] whitespace-nowrap text-white/70"
              >
                {c}
              </span>
            ))}
          </span>
        </span>
        <span
          className={`relative hidden font-geist text-sm leading-snug transition-colors duration-300 md:block ${active ? "text-white/80" : "text-black/60"}`}
        >
          {p.tagline}
        </span>
        <span className="relative flex justify-end">
          <span
            className={`flex size-10 items-center justify-center border transition-colors duration-300 ${active ? "border-asymmetri-red bg-asymmetri-red text-white" : "border-black/30"}`}
            aria-hidden
          >
            <ArrowRight
              className={`size-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${active ? "rotate-0" : "-rotate-45"}`}
              strokeWidth={1.5}
            />
          </span>
        </span>
      </a>
    </motion.li>
  );
}

function PracticesIndexComponent() {
  const [active, setActive] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Cursor-following preview tile.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 300, damping: 30, mass: 0.6 });
  const y = useSpring(my, { stiffness: 300, damping: 30, mass: 0.6 });

  // The tile only shows for a real pointer, and appears where the cursor is
  // instead of flying in from the corner.
  const [pointer, setPointer] = useState(false);
  const onMove = (e: React.MouseEvent) => {
    const r = listRef.current?.getBoundingClientRect();
    if (!r) return;
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    mx.set(px);
    my.set(py);
    if (!pointer) {
      x.jump(px);
      y.jump(py);
      setPointer(true);
    }
  };

  const current = active !== null ? practices[active] : null;

  return (
    <div className="relative w-full">
      <p className="pointer-events-none absolute -top-8 left-0 flex w-full justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-black/50">
        <span>
          <span className="text-asymmetri-red">What we do</span> · Four practices
        </span>
        <span className="hidden md:inline">Select a practice ↓</span>
      </p>
      <ul
        ref={listRef}
        style={{ height: HEIGHT }}
        onMouseMove={onMove}
        onMouseLeave={() => {
          setActive(null);
          setPointer(false);
        }}
        className="relative grid w-full grid-rows-4 border-y border-black/20"
      >
        {practices.map((p, i) => (
          <Row key={p.slug} p={p} i={i} active={active === i} onEnter={() => setActive(i)} />
        ))}

        <AnimatePresence>
          {current && pointer && (
            <motion.div
              key="preview"
              style={{ x, y }}
              initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.6, rotate: 8 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="pointer-events-none absolute top-0 left-0 z-20 hidden md:block [@media(hover:none)]:!hidden"
              aria-hidden
            >
              <div className="translate-x-6 -translate-y-[115%] bg-asymmetri-red p-4 text-white shadow-[0_20px_60px_-20px_rgba(205,23,23,0.7)]">
                <div className="flex w-40 items-start justify-between">
                  <span className="font-chakra-petch text-5xl leading-none font-bold">
                    {current.index}
                  </span>
                  <PracticeGlyph kind={current.glyph} active color="#ffffff" className="size-12 [&_*]:!stroke-white" />
                </div>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em]">Enter ↗</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </ul>
    </div>
  );
}

export const PracticesIndex = memo(PracticesIndexComponent);
