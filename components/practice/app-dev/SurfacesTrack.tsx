"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { ScrambleText } from "@/components/practice/ScrambleText";
import { domains } from "@/lib/site-content";
import { surfaces } from "./content";
import { clamp01, useEnterProgress } from "./hooks";

const pad = (n: number) => String(n).padStart(2, "0");
const ID = "A-2048";
const PANELS = surfaces.length + 1; // five surfaces plus the domains card

/* ── Device mocks: the same booking, five ways ──────────────────────── */

function Mono({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`font-mono text-[8px] uppercase tracking-[0.2em] md:text-[9px] ${className}`}>
      {children}
    </span>
  );
}

function Web({ live }: { live: boolean }) {
  return (
    <div className="w-full border-2 border-black bg-black">
      <div className="flex items-center gap-1 px-2 py-1.5">
        <span className="size-1.5 bg-asymmetri-red" />
        <span className="size-1.5 bg-white/30" />
        <span className="size-1.5 bg-white/30" />
        <span className="ml-2 flex-1 bg-white/10 px-2 font-mono text-[8px] text-white/50">example.app/checkout</span>
      </div>
      <div className="grid grid-cols-[1.4fr_1fr] gap-2 bg-[#111] p-3 text-white">
        <div className="space-y-2">
          <Mono className="text-white/40">Your booking</Mono>
          <p className="font-chakra-petch text-base font-bold uppercase md:text-lg">Sat · 10:30</p>
          <div className="h-12 border border-white/15 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.08)_50%,rgba(255,255,255,0.08)_75%,transparent_75%)] bg-[size:10px_10px]" />
          <div className="h-1.5 w-2/3 bg-white/20" />
          <div className="h-1.5 w-1/2 bg-white/10" />
        </div>
        <div className="flex flex-col justify-between border border-white/15 p-2">
          <Mono className="text-white/40">Total</Mono>
          <p className="font-chakra-petch text-lg font-bold">€ 64.00</p>
          <span className={`px-2 py-1 text-center font-chakra-petch text-[10px] font-semibold uppercase transition-colors ${live ? "bg-asymmetri-red" : "bg-white/20"}`}>
            {live ? "Paid ✓" : "Pay"}
          </span>
        </div>
      </div>
    </div>
  );
}

function Mobile({ live }: { live: boolean }) {
  return (
    <div className="mx-auto aspect-[9/18] h-full border-[3px] border-black bg-black p-1">
      <div className="relative flex h-full flex-col overflow-hidden bg-[#111] text-white">
        <div className="mx-auto mt-1 h-1 w-8 bg-black" />
        <div className="relative flex-1 overflow-hidden">
          <svg viewBox="0 0 100 120" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
            {Array.from({ length: 8 }, (_, i) => (
              <line key={`h${i}`} x1="0" x2="100" y1={i * 16} y2={i * 16 + 6} stroke="rgba(255,255,255,0.08)" />
            ))}
            {Array.from({ length: 6 }, (_, i) => (
              <line key={`v${i}`} y1="0" y2="120" x1={i * 20} x2={i * 20 - 8} stroke="rgba(255,255,255,0.08)" />
            ))}
            <path d="M18 104 L30 80 L58 72 L64 44 L82 22" fill="none" stroke="#cd1717" strokeWidth="2.5" strokeDasharray={live ? "0" : "4 3"} />
            <rect x="78" y="18" width="8" height="8" fill="#fff" />
            <rect x="14" y="100" width="8" height="8" fill="#cd1717" />
          </svg>
        </div>
        <div className="space-y-1 border-t border-white/10 p-2">
          <Mono className="text-asymmetri-red">{live ? "● Confirmed" : "Pending"}</Mono>
          <p className="font-chakra-petch text-sm leading-none font-bold uppercase">#{ID}</p>
          <div className="h-1 w-3/4 bg-white/15" />
        </div>
      </div>
    </div>
  );
}

function Wearable({ live }: { live: boolean }) {
  return (
    <div className="mx-auto flex h-full flex-col items-center justify-center">
      <div className="h-[14%] w-[34%] bg-black/80" />
      <div className="flex aspect-[5/6] h-[64%] flex-col items-center justify-center gap-1 rounded-[22%] border-[4px] border-black bg-[#111] text-white">
        <Mono className="text-white/40">#{ID}</Mono>
        <p className="font-chakra-petch text-4xl leading-none font-bold md:text-5xl">
          4<span className="text-base">min</span>
        </p>
        <Mono className={live ? "text-asymmetri-red" : "text-white/40"}>{live ? "● Arriving" : "Arriving"}</Mono>
        <div className="mt-1 flex gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className={`h-1 w-2.5 ${i < 4 ? "bg-white" : "bg-white/20"}`} />
          ))}
        </div>
      </div>
      <div className="h-[14%] w-[34%] bg-black/80" />
    </div>
  );
}

function Kiosk({ live }: { live: boolean }) {
  return (
    <div className="mx-auto flex h-full flex-col items-center">
      <div className="aspect-[4/5] h-[80%] border-[5px] border-black bg-[#111] p-3 text-white">
        <Mono className="text-white/40">Welcome · Desk 2</Mono>
        <p className="mt-1 font-chakra-petch text-lg leading-none font-bold uppercase md:text-xl">
          {live ? "You're in." : "Check in"}
        </p>
        <div className="mt-3 grid grid-cols-[1fr_auto] items-end gap-3">
          <div className="grid aspect-square grid-cols-7 gap-px bg-white p-1">
            {Array.from({ length: 49 }, (_, i) => (
              <span key={i} className={(i * 7 + (i % 5) * 3) % 4 === 0 || i % 8 === 0 ? "bg-black" : "bg-white"} />
            ))}
          </div>
          <span className={`px-2 py-1 font-chakra-petch text-[10px] font-semibold uppercase ${live ? "bg-asymmetri-red" : "bg-white/20"}`}>
            #{ID}
          </span>
        </div>
      </div>
      <div className="h-[14%] w-8 bg-black" />
      <div className="h-[6%] w-[40%] bg-black" />
    </div>
  );
}

function Admin({ live }: { live: boolean }) {
  const rows = ["A-2045", "A-2046", "A-2047", ID, "A-2049"];
  return (
    <div className="w-full border-2 border-black bg-[#0d0d0d] text-white">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <Mono className="text-white/60">Ops · Bookings</Mono>
        <Mono className="text-asymmetri-red">● Live</Mono>
      </div>
      <div className="grid grid-cols-[5rem_1fr]">
        <div className="space-y-1.5 border-r border-white/10 p-2">
          {["Queue", "Bookings", "Staff", "Audit"].map((x, i) => (
            <div key={x} className={`font-mono text-[8px] uppercase tracking-[0.15em] ${i === 1 ? "text-white" : "text-white/35"}`}>
              {x}
            </div>
          ))}
        </div>
        <table className="w-full font-mono text-[8px] uppercase tracking-[0.1em] md:text-[9px]">
          <tbody>
            {rows.map((r) => {
              const me = r === ID;
              return (
                <tr key={r} className={`border-b border-white/5 ${me && live ? "bg-asymmetri-red text-white" : me ? "text-white" : "text-white/40"}`}>
                  <td className="px-2 py-1.5">#{r}</td>
                  <td className="px-2">Sat</td>
                  <td className="px-2 text-right">{me ? (live ? "Fulfilled" : "Checked in") : "Done"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const DEVICES = { web: Web, mobile: Mobile, wearable: Wearable, kiosk: Kiosk, admin: Admin };

/**
 * Every surface: one illustrative booking travels across web, mobile, wrist,
 * kiosk and back office while the track slides under a fixed "now" line.
 * Same state, same API, five surfaces built by one team.
 */
export function SurfacesTrack() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const p = useSectionProgress(ref);
  const enter = useEnterProgress(ref);
  const reduce = useReducedMotion();
  const dist = useMotionValue(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => dist.set(Math.max(0, el.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [dist]);

  const t = useTransform(p, (v) => clamp01((v - 0.06) / 0.88));
  const x = useTransform([t, dist], ([a, d]: number[]) => -a * d);
  useMotionValueEvent(t, "change", (v) => {
    const a = Math.round(v * (PANELS - 1));
    if (a !== active) setActive(a);
  });

  // Stepped hard wipe up from the bottom, like a screen redrawing in bands.
  const clipPath = useTransform(enter, (v) => {
    const stepped = Math.floor(v * 12) / 12;
    return `inset(${(1 - stepped) * 100}% 0 0 0)`;
  });
  const bar = useTransform(t, [0, 1], ["0%", "100%"]);
  const state = active < surfaces.length ? surfaces[active].state : "In sync";

  return (
    <section
      ref={ref}
      data-chapter="Every surface"
      aria-labelledby="ad-surfaces"
      className="relative h-[520vh] bg-black"
    >
      <motion.div
        style={{ clipPath: reduce ? undefined : clipPath }}
        className="sticky top-0 flex h-screen flex-col overflow-hidden bg-asymmetri-red pt-20 text-white"
      >
        <div className="flex flex-wrap items-end justify-between gap-4 px-6 md:px-16">
          <div>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-black md:text-xs">
              <ScrambleText text="Every surface · One product" />
            </p>
            <h2 id="ad-surfaces" className="font-chakra-petch text-3xl leading-[0.92] font-bold uppercase md:text-5xl xl:text-6xl">
              One booking.
              <br />
              <span className="text-black">Five surfaces.</span>
            </h2>
          </div>
          <div className="w-full max-w-sm space-y-2 md:w-auto">
            <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.25em]">
              <span>Example · #{ID}</span>
              <span className="text-black">{state}</span>
            </div>
            <div className="h-px w-full bg-white/30">
              <motion.div style={{ width: bar }} className="h-px bg-white" />
            </div>
            <ol className="flex justify-between gap-2 font-mono text-[9px] uppercase tracking-[0.15em]">
              {surfaces.map((s, i) => (
                <li key={s.key} className={i <= active ? "text-white" : "text-white/45"}>
                  {i <= active ? "■" : "□"} <span className="hidden sm:inline">{s.state}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="relative min-h-0 flex-1">
          {/* fixed "now" line the track slides under */}
          <div className="pointer-events-none absolute inset-y-6 left-1/2 w-px bg-black/40" aria-hidden>
            <span className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 bg-black" />
          </div>
          {/* the sync wire: one API under every surface */}
          <div className="pointer-events-none absolute inset-x-0 top-[44%] h-px border-t border-dashed border-white/50" aria-hidden />

          <motion.div
            ref={trackRef}
            style={{ x: reduce ? undefined : x }}
            className={`flex h-full w-max items-center gap-[6vw] px-[11vw] md:px-[28vw] lg:px-[33vw] ${reduce ? "flex-wrap !w-auto justify-center" : ""}`}
          >
            {surfaces.map((s, i) => {
              const Device = DEVICES[s.key];
              const on = active === i || !!reduce;
              return (
                <article
                  key={s.key}
                  className={`flex w-[78vw] shrink-0 flex-col gap-5 transition-[opacity,transform,filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:w-[44vw] lg:w-[34vw] ${
                    on ? "scale-100 opacity-100" : "scale-[0.88] opacity-45 blur-[1px]"
                  }`}
                >
                  <div className="flex h-[34vh] items-center md:h-[38vh]" aria-hidden>
                    <Device live={on} />
                  </div>
                  <div className="border-t border-white/40 pt-3">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-chakra-petch text-xl font-bold uppercase md:text-2xl">{s.name}</h3>
                      <span className="font-mono text-[10px] text-black">{pad(i + 1)}</span>
                    </div>
                    <p className="mt-1 max-w-sm font-geist text-sm text-white/85">{s.body}</p>
                  </div>
                </article>
              );
            })}
            <article
              className={`flex w-[78vw] shrink-0 flex-col justify-center gap-4 transition-opacity duration-500 md:w-[44vw] lg:w-[34vw] ${
                active === PANELS - 1 || reduce ? "opacity-100" : "opacity-45"
              }`}
            >
              <h3 className="font-chakra-petch text-2xl leading-none font-bold uppercase md:text-4xl">
                Same discipline,
                <br />
                <span className="text-black">five domains.</span>
              </h3>
              <ul className="border-t border-white/40">
                {domains.map((d, i) => (
                  <li key={d.name} className="flex gap-3 border-b border-white/40 py-2 font-chakra-petch text-sm font-semibold uppercase md:text-base">
                    <span className="font-mono text-[10px] text-black">{pad(i + 1)}</span>
                    {d.name}
                  </li>
                ))}
              </ul>
            </article>
          </motion.div>
        </div>
        <p className="px-6 pb-6 font-mono text-[9px] uppercase tracking-[0.25em] text-white/70 md:px-16">
          Illustrative product · one API, one design system, every screen
        </p>
      </motion.div>
    </section>
  );
}
