"use client";

import { forwardRef, useRef } from "react";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import {
  motion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { domains } from "@/lib/site-content";

const pad = (n: number) => String(n).padStart(2, "0");

// Each domain owns a fifth of the scroll; the frame holds, then morphs.
const HOLD_IN = [0, 0.16, 0.24, 0.36, 0.44, 0.56, 0.64, 0.76, 0.84, 1];
const hold = <T,>(stops: T[]) => stops.flatMap((s) => [s, s]);

const shapes = [
  { label: "Card", w: "54vmin", h: "34vmin", r: "3vmin" },
  { label: "Screen", w: "66vmin", h: "38vmin", r: "1vmin" },
  { label: "Wearable", w: "30vmin", h: "37vmin", r: "8vmin" },
  { label: "Console", w: "62vmin", h: "44vmin", r: "0.4vmin" },
  { label: "Sensor", w: "46vmin", h: "46vmin", r: "23vmin" },
];

// Fade a domain in for its fifth of the scroll and out at the end of it.
function useSegment(p: MotionValue<number>, i: number, n: number) {
  const a = i / n;
  const b = (i + 1) / n;
  const input =
    i === 0 ? [0, b - 0.04, b] : i === n - 1 ? [a, a + 0.04, 1] : [a, a + 0.04, b - 0.04, b];
  const output =
    i === 0 ? [1, 1, 0] : i === n - 1 ? [0, 1, 1] : [0, 1, 1, 0];
  return useTransform(p, input, output);
}

function DomainText({
  p,
  i,
  name,
  body,
}: {
  p: MotionValue<number>;
  i: number;
  name: string;
  body: string;
}) {
  const opacity = useSegment(p, i, domains.length);
  const y = useTransform(opacity, [0, 1], [30, 0]);
  const filter = useTransform(opacity, [0, 1], ["blur(8px)", "blur(0px)"]);
  return (
    <motion.li
      style={{ opacity, y, filter }}
      className="absolute inset-x-0 top-0 space-y-4"
    >
      <span className="block text-7xl leading-none font-bold md:text-9xl">
        {pad(i + 1)}
      </span>
      <h3 className="text-3xl font-bold uppercase leading-none md:text-5xl">
        {name}
      </h3>
      <p className="max-w-md font-geist text-base text-white/85 md:text-lg">
        {body}
      </p>
    </motion.li>
  );
}

function Wire({
  p,
  i,
  children,
}: {
  p: MotionValue<number>;
  i: number;
  children: React.ReactNode;
}) {
  const opacity = useSegment(p, i, shapes.length);
  return (
    <motion.div style={{ opacity }} className="absolute inset-0">
      {children}
    </motion.div>
  );
}

export const DomainsMorph = forwardRef<HTMLElement>(
  function DomainsMorph(_, outerRef) {
    const ref = useRef<HTMLElement | null>(null);
    const p = useSectionProgress(ref);

    const width = useTransform(p, HOLD_IN, hold(shapes.map((s) => s.w)));
    const height = useTransform(p, HOLD_IN, hold(shapes.map((s) => s.h)));
    const borderRadius = useTransform(p, HOLD_IN, hold(shapes.map((s) => s.r)));
    const rotate = useTransform(p, HOLD_IN, hold([-4, 3, -2, 2, 0]));
    const caption = useTransform(p, (v) => {
      const i = Math.min(Math.floor(v * shapes.length), shapes.length - 1);
      return `Interface ${pad(i + 1)} · ${shapes[i].label}`;
    });

    return (
      <section
        ref={(el) => {
          ref.current = el;
          if (typeof outerRef === "function") outerRef(el);
          else if (outerRef) outerRef.current = el;
        }}
        id="domains"
        aria-labelledby="domains-title"
        className="relative h-[460vh] bg-asymmetri-red font-chakra-petch text-white"
      >
        <div className="sticky top-0 grid h-screen grid-rows-[auto_1fr] overflow-hidden bg-asymmetri-red px-6 pt-20 pb-10 md:grid-cols-2 md:grid-rows-1 md:gap-10 md:px-16">
          {/* vertical guide lines, echoing the project cards above */}
          <div className="pointer-events-none absolute inset-0 grid grid-cols-4" aria-hidden>
            {[0, 1, 2, 3].map((c) => (
              <span key={c} className="border-l border-white/15" />
            ))}
          </div>

          <div className="relative flex flex-col">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/75 md:text-xs">
              What we build · 02 · Five domains
            </p>
            <h2
              id="domains-title"
              className="mt-3 max-w-xl text-2xl font-bold uppercase leading-none md:text-4xl"
            >
              Systems people transact with, depend on and use in the physical
              world.
            </h2>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-black/70">
              Different domains. Different interfaces.
            </p>
            <ol className="relative mt-8 min-h-[18rem] flex-1 md:mt-12">
              {domains.map((d, i) => (
                <DomainText key={d.name} p={p} i={i} name={d.name} body={d.body} />
              ))}
            </ol>
          </div>

          <div className="relative hidden items-center justify-center md:flex" aria-hidden>
            <div className="flex scale-[0.72] flex-col items-center gap-6 xl:scale-100">
              <motion.div
                style={{ width, height, borderRadius, rotate }}
                className="relative overflow-hidden border-2 border-white bg-black/15 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] backdrop-blur-sm"
              >
                {/* 01 Card: commerce and finance */}
                <Wire p={p} i={0}>
                  <span className="absolute top-[18%] left-[8%] h-[20%] w-[14%] rounded-md border-2 border-white" />
                  <span className="absolute top-[18%] right-[8%] font-mono text-[1.6vmin]">
                    ))) VERIFIED ✓
                  </span>
                  <span className="absolute bottom-[26%] left-[8%] font-mono text-[3vmin] tracking-[0.3em]">
                    •••• •••• •••• 2026
                  </span>
                  <span className="absolute bottom-[10%] left-[8%] h-[3%] w-[30%] bg-white/70" />
                </Wire>
                {/* 02 Screen: media and growth */}
                <Wire p={p} i={1}>
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-y-[3vmin] border-l-[5vmin] border-y-transparent border-l-white" />
                  <span className="absolute right-[6%] bottom-[10%] left-[6%] h-[2%] bg-white/30">
                    <span className="block h-full w-[62%] bg-white" />
                  </span>
                  <span className="absolute top-[8%] left-[6%] font-mono text-[1.6vmin]">● LIVE</span>
                </Wire>
                {/* 03 Wearable: health and care */}
                <Wire p={p} i={2}>
                  <svg viewBox="0 0 100 40" className="absolute top-[30%] left-[10%] w-[80%]">
                    <polyline
                      points="0,20 22,20 30,6 38,34 46,20 60,20 66,12 72,20 100,20"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      className="pulse-line"
                    />
                  </svg>
                  <span className="absolute bottom-[18%] w-full text-center text-[5vmin] font-bold">
                    72<span className="text-[2vmin]"> BPM</span>
                  </span>
                </Wire>
                {/* 04 Console: operations and logistics */}
                <Wire p={p} i={3}>
                  <div className="absolute inset-[10%] flex items-end gap-[3%] border-b border-l border-white/60">
                    {[40, 65, 30, 80, 55, 90, 45, 70].map((h, k) => (
                      <span
                        key={k}
                        style={{ height: `${h}%` }}
                        className={`flex-1 ${k === 5 ? "bg-white" : "bg-white/40"}`}
                      />
                    ))}
                  </div>
                  <span className="absolute top-[3%] left-[10%] font-mono text-[1.6vmin]">
                    THROUGHPUT ▲
                  </span>
                </Wire>
                {/* 05 Sensor: physical and connected environments */}
                <Wire p={p} i={4}>
                  {[80, 56, 32].map((s) => (
                    <span
                      key={s}
                      style={{ width: `${s}%`, height: `${s}%` }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/50"
                    />
                  ))}
                  <span className="radar-sweep absolute top-0 left-1/2 h-1/2 w-[2px] origin-bottom bg-white" />
                  {[
                    [28, 30],
                    [70, 40],
                    [40, 72],
                  ].map(([l, t]) => (
                    <span
                      key={`${l}-${t}`}
                      style={{ left: `${l}%`, top: `${t}%` }}
                      className="absolute size-[1.6vmin] rounded-full bg-white"
                    />
                  ))}
                </Wire>
              </motion.div>
              <motion.span className="font-mono text-xs uppercase tracking-[0.25em] text-white/80">
                {caption}
              </motion.span>
            </div>
          </div>
        </div>
      </section>
    );
  },
);
