"use client";

import { memo, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useReduceMotion as useReducedMotion } from "@/hooks/useReduceMotion";
import { useRunning } from "./hooks";

/* ── The builds ─────────────────────────────────────────────────────── */

type Block = "shell" | "nav" | "hero" | "s0" | "s1" | "s2" | "chart" | "btn";
type Step = { code: string; block?: Block };
type Variant = {
  file: string;
  path: string;
  title: string;
  stats: [string, string][];
  chart: "bar" | "line" | "area";
  cta: string;
  areas: string;
  rows: string;
  steps: Step[];
};

const variants: Variant[] = [
  {
    file: "Dashboard.tsx",
    path: "/dashboard",
    title: "Today",
    stats: [
      ["Orders", "1,284"],
      ["Revenue", "48.2k"],
      ["p95", "182ms"],
    ],
    chart: "bar",
    cta: "Ship it",
    areas: `"hero hero hero" "s0 s1 s2" "chart chart chart" ". . btn"`,
    rows: "auto auto 1fr auto",
    steps: [
      { code: 'import { Shell, Nav, Stat, Chart } from "@/ui";' },
      { code: "" },
      { code: "export default function Dashboard({ orders }) {" },
      { code: "  return (" },
      { code: '    <Shell theme="dark">', block: "shell" },
      { code: "      <Nav items={routes} live />", block: "nav" },
      { code: '      <Hero title="Today" sub={greeting} />', block: "hero" },
      { code: '      <Stat label="Orders" value={orders.count} />', block: "s0" },
      { code: '      <Stat label="Revenue" value={orders.total} />', block: "s1" },
      { code: '      <Stat label="p95" value={latency.p95} />', block: "s2" },
      { code: '      <Chart data={orders.byHour} kind="bar" />', block: "chart" },
      { code: '      <Button intent="primary">Ship it</Button>', block: "btn" },
      { code: "    </Shell>" },
      { code: "  );" },
      { code: "}" },
    ],
  },
  {
    file: "Tracking.tsx",
    path: "/tracking",
    title: "Live fleet",
    stats: [
      ["Active", "312"],
      ["On time", "96%"],
      ["Queued", "18"],
    ],
    chart: "line",
    cta: "Dispatch",
    areas: `"hero hero btn" "chart chart s0" "chart chart s1" "chart chart s2"`,
    rows: "auto 1fr 1fr 1fr",
    steps: [
      { code: 'import { Shell, Nav, Stat, Chart } from "@/ui";' },
      { code: "" },
      { code: "export default function Tracking({ fleet }) {" },
      { code: "  return (" },
      { code: '    <Shell layout="split">', block: "shell" },
      { code: "      <Nav items={routes} live />", block: "nav" },
      { code: '      <Hero title="Live fleet" />', block: "hero" },
      { code: '      <Button intent="primary">Dispatch</Button>', block: "btn" },
      { code: '      <Chart data={fleet.eta} kind="line" />', block: "chart" },
      { code: '      <Stat label="Active" value={fleet.active} />', block: "s0" },
      { code: '      <Stat label="On time" value={fleet.onTime} />', block: "s1" },
      { code: '      <Stat label="Queued" value={fleet.queued} />', block: "s2" },
      { code: "    </Shell>" },
      { code: "  );" },
      { code: "}" },
    ],
  },
  {
    file: "Studio.tsx",
    path: "/studio",
    title: "Audience",
    stats: [
      ["Members", "8,410"],
      ["Sessions", "2.1k"],
      ["Streak", "14d"],
    ],
    chart: "area",
    cta: "Publish",
    areas: `"s0 hero hero" "s1 chart chart" "s2 chart chart" "btn chart chart"`,
    rows: "auto 1fr 1fr auto",
    steps: [
      { code: 'import { Shell, Nav, Stat, Chart } from "@/ui";' },
      { code: "" },
      { code: "export default function Studio({ audience }) {" },
      { code: "  return (" },
      { code: '    <Shell density="compact">', block: "shell" },
      { code: "      <Nav items={routes} />", block: "nav" },
      { code: '      <Stat label="Members" value={audience.size} />', block: "s0" },
      { code: '      <Hero title="Audience" sub={range} />', block: "hero" },
      { code: '      <Stat label="Sessions" value={audience.week} />', block: "s1" },
      { code: '      <Chart data={audience.daily} kind="area" />', block: "chart" },
      { code: '      <Stat label="Streak" value={audience.streak} />', block: "s2" },
      { code: '      <Button intent="primary">Publish</Button>', block: "btn" },
      { code: "    </Shell>" },
      { code: "  );" },
      { code: "}" },
    ],
  },
];

const TAG_NAME: Record<Block, string> = {
  shell: "<Shell>",
  nav: "<Nav />",
  hero: "<Hero />",
  s0: "<Stat />",
  s1: "<Stat />",
  s2: "<Stat />",
  chart: "<Chart />",
  btn: "<Button />",
};

/* ── Code pane ──────────────────────────────────────────────────────── */

const TOKENS =
  /(<\/?[A-Z]\w*|\/?>|"[^"]*"?|\{[^}]*\}?|\b(?:import|from|export|default|function|return)\b|\w+(?==))/g;

function highlight(src: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of src.matchAll(TOKENS)) {
    const i = m.index ?? 0;
    if (i > last) out.push(src.slice(last, i));
    const t = m[0];
    let cls = "text-white/80";
    if (t.startsWith("<") || t.endsWith(">")) cls = "text-asymmetri-red";
    else if (t.startsWith('"')) cls = "text-white";
    else if (t.startsWith("{")) cls = "text-white/55";
    else if (/^(import|from|export|default|function|return)$/.test(t)) cls = "text-white/40";
    else cls = "text-white/50";
    out.push(
      <span key={i} className={cls}>
        {t}
      </span>,
    );
    last = i + t.length;
  }
  if (last < src.length) out.push(src.slice(last));
  return out;
}

function CodePane({
  v,
  line,
  chars,
  done,
}: {
  v: Variant;
  line: number;
  chars: number;
  done: boolean;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden border border-white/15 bg-[#0a0a0a]/95 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.2em] text-white/45">
        <span>
          <span className="text-asymmetri-red">■</span> app/{v.file}
        </span>
        <span>tsx · utf-8</span>
      </div>
      <div className="flex-1 overflow-hidden py-2 font-mono text-[10px] leading-[1.75] xl:text-[11px]">
        {v.steps.map((s, i) => {
          if (i > line) return null;
          const text = i < line || done ? s.code : s.code.slice(0, chars);
          const active = i === line && !done;
          return (
            <div
              key={i}
              className={`flex whitespace-pre ${active ? "bg-white/[0.04]" : ""}`}
            >
              <span
                className={`w-8 shrink-0 pr-3 text-right ${active ? "text-asymmetri-red" : "text-white/20"}`}
              >
                {i + 1}
              </span>
              <span className="text-white/80">
                {highlight(text)}
                {active && (
                  <span className="kit-blink ml-px inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-asymmetri-red" />
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── The interface it compiles into ─────────────────────────────────── */

const spring = { type: "spring" as const, stiffness: 520, damping: 19, mass: 0.9 };

/** Red dev-tools style outline that flashes when a component lands. */
function Inspect({ name }: { name: string }) {
  return (
    <motion.span
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 0.75, duration: 0.5 }}
      className="pointer-events-none absolute -inset-px z-10 border border-asymmetri-red"
    >
      <span className="absolute -top-[15px] left-[-1px] bg-asymmetri-red px-1 font-mono text-[8px] leading-[14px] text-white">
        {name}
      </span>
    </motion.span>
  );
}

function Landed({
  id,
  from,
  className,
  style,
  children,
}: {
  id: Block;
  from: { x?: number; y?: number; scale?: number; rotate?: number; opacity?: number };
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 0, y: 0, scale: 1, rotate: 0, ...from }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, y: 14, scale: 0.96, filter: "blur(4px)", transition: { duration: 0.3 } }}
      transition={spring}
      className={`relative ${className ?? ""}`}
      style={style}
    >
      <Inspect name={TAG_NAME[id]} />
      {children}
    </motion.div>
  );
}

function rand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

function ChartBlock({ kind, seed }: { kind: Variant["chart"]; seed: number }) {
  const data = useMemo(() => {
    const r = rand(seed * 977 + 13);
    const out: number[] = [];
    for (let i = 0; i < 14; i++) {
      const prev = out[i - 1] ?? 0.5;
      out.push(Math.min(0.95, Math.max(0.12, prev + (r() - 0.45) * 0.35)));
    }
    return out;
  }, [seed]);
  const pts = data.map((d, i) => [(i / (data.length - 1)) * 100, 40 - d * 36] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <div className="flex h-full flex-col border border-white/10 bg-white/[0.03] p-2">
      <div className="mb-1 flex justify-between font-mono text-[7px] uppercase tracking-[0.2em] text-white/40">
        <span>{kind === "bar" ? "Orders by hour" : kind === "line" ? "ETA drift" : "Daily active"}</span>
        <span className="text-asymmetri-red">● live</span>
      </div>
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-full min-h-0 w-full flex-1">
        {[10, 20, 30].map((y) => (
          <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth="0.3" />
        ))}
        {kind === "bar" &&
          data.map((d, i) => (
            <motion.rect
              key={i}
              x={i * (100 / data.length) + 1}
              width={100 / data.length - 2}
              y={40 - d * 36}
              height={d * 36}
              fill={i === data.length - 3 ? "#cd1717" : "rgba(255,255,255,0.75)"}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ ...spring, delay: 0.1 + i * 0.03 }}
              style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
            />
          ))}
        {kind !== "bar" && (
          <>
            {kind === "area" && (
              <motion.path
                d={`${line} L100 40 L0 40 Z`}
                fill="rgba(205,23,23,0.28)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              />
            )}
            <motion.path
              d={line}
              fill="none"
              stroke={kind === "line" ? "#cd1717" : "#ffffff"}
              strokeWidth="0.9"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />
          </>
        )}
      </svg>
    </div>
  );
}

const Frame = memo(function Frame({
  v,
  landed,
  done,
  seed,
}: {
  v: Variant;
  landed: Set<Block>;
  done: boolean;
  seed: number;
}) {
  const has = (b: Block) => landed.has(b);
  return (
    <div className="flex h-full flex-col overflow-hidden border border-white/20 bg-[#0d0d0d] shadow-[0_0_120px_-30px_rgba(205,23,23,0.55)]">
      {/* chrome */}
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
        <span className="size-2 bg-asymmetri-red" />
        <span className="size-2 bg-white/25" />
        <span className="size-2 bg-white/25" />
        <span className="ml-3 flex-1 truncate border border-white/10 bg-black/60 px-2 py-0.5 font-mono text-[9px] text-white/50">
          preview.example.app{v.path}
        </span>
      </div>

      {/* page */}
      <div className="relative min-h-0 flex-1 overflow-hidden p-3">
        <motion.div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px]"
          animate={{ opacity: has("shell") ? 1 : 0 }}
        />
        {!has("shell") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="absolute inset-0 flex items-center justify-center font-mono text-[9px] uppercase tracking-[0.25em] text-white/30"
          >
            waiting for first compile
            <span className="kit-blink ml-1">_</span>
          </motion.div>
        )}
        <AnimatePresence>
          {has("shell") && (
            <motion.div
              key={`shell-${seed}`}
              initial={{ clipPath: "inset(0 0 100% 0)" }}
              animate={{ clipPath: "inset(0 0 0% 0)" }}
              exit={{ opacity: 0, transition: { duration: 0.35 } }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex h-full flex-col gap-2"
            >
              <AnimatePresence>
                {has("nav") && (
                  <Landed id="nav" from={{ y: -28 }} className="shrink-0">
                    <div className="flex items-center justify-between border border-white/10 bg-black/70 px-2 py-1.5">
                      <span className="flex items-center gap-1.5 font-chakra-petch text-[10px] font-bold uppercase">
                        <span className="size-2 rotate-45 bg-asymmetri-red" /> Example
                      </span>
                      <span className="flex gap-2 font-mono text-[7px] uppercase tracking-[0.15em] text-white/50">
                        <span className="text-white">Overview</span>
                        <span>Orders</span>
                        <span className="hidden sm:inline">Settings</span>
                      </span>
                    </div>
                  </Landed>
                )}
              </AnimatePresence>

              <div
                className="grid min-h-0 flex-1 grid-cols-3 gap-2"
                style={{ gridTemplateAreas: v.areas, gridTemplateRows: v.rows }}
              >
                <AnimatePresence>
                  {has("hero") && (
                    <Landed key="hero" id="hero" from={{ x: -40, opacity: 0 }} style={{ gridArea: "hero" }}>
                      <div className="h-full border-l-2 border-asymmetri-red pl-2">
                        <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/40">
                          Example workspace
                        </p>
                        <p className="font-chakra-petch text-[15px] leading-tight font-bold uppercase xl:text-lg">
                          {v.title}
                        </p>
                      </div>
                    </Landed>
                  )}
                  {(["s0", "s1", "s2"] as const).map(
                    (s, i) =>
                      has(s) && (
                        <Landed
                          key={s}
                          id={s}
                          from={{ y: 34, scale: 0.85, rotate: i % 2 ? 3 : -3 }}
                          style={{ gridArea: s }}
                        >
                          <div className="flex h-full flex-col justify-between border border-white/10 bg-white/[0.04] p-2">
                            <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/45">
                              {v.stats[i][0]}
                            </span>
                            <span className={`font-chakra-petch text-sm font-bold xl:text-base ${i === 1 ? "text-asymmetri-red" : ""}`}>
                              {v.stats[i][1]}
                            </span>
                          </div>
                        </Landed>
                      ),
                  )}
                  {has("chart") && (
                    <Landed key="chart" id="chart" from={{ scale: 0.7, opacity: 0 }} className="min-h-0" style={{ gridArea: "chart" }}>
                      <ChartBlock kind={v.chart} seed={seed} />
                    </Landed>
                  )}
                  {has("btn") && (
                    <Landed key="btn" id="btn" from={{ scale: 0.4 }} style={{ gridArea: "btn" }} className="self-end">
                      <div className="flex items-center justify-center gap-1 bg-asymmetri-red px-2 py-1.5 font-chakra-petch text-[10px] font-semibold uppercase">
                        {v.cta} <span>↗</span>
                      </div>
                    </Landed>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* status bar */}
      <div
        className={`flex items-center justify-between gap-2 border-t px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] transition-colors duration-300 ${
          done ? "border-asymmetri-red bg-asymmetri-red text-white" : "border-white/10 text-white/45"
        }`}
      >
        <span>
          {done ? "build ✓ passed · 0 type errors" : `compiling ${v.file}`}
          {!done && <span className="kit-blink">…</span>}
        </span>
        <span>{done ? "preview deployed" : `${landed.size}/8 components`}</span>
      </div>
    </div>
  );
});

/* ── Orchestration ──────────────────────────────────────────────────── */

type State = { vi: number; line: number; chars: number; done: boolean; seed: number };
const START: State = { vi: 0, line: 0, chars: 0, done: false, seed: 1 };
const CHAR_MS = 24;
const LINE_PAUSE = 90;
const HOLD_MS = 2600;

function landedFor(v: Variant, line: number, chars: number, done: boolean) {
  const set = new Set<Block>();
  v.steps.forEach((s, i) => {
    if (!s.block) return;
    if (i < line || done || (i === line && chars >= s.code.length)) set.add(s.block);
  });
  return set;
}

/**
 * Hero signature: TSX types itself into an editor while the interface it
 * describes snaps together in a browser frame, one component per line, and
 * the build goes green. Then it tears down and compiles a different screen.
 */
export function HeroCompile() {
  const rootRef = useRef<HTMLDivElement>(null);
  const running = useRunning(rootRef);
  const reduce = useReducedMotion();
  const [s, setS] = useState<State>(START);

  // Typing loop: one timer at a time, paused off screen and in hidden tabs.
  useEffect(() => {
    if (!running || reduce) return;
    const v = variants[s.vi];
    let id: ReturnType<typeof setTimeout>;
    if (s.done) {
      id = setTimeout(
        () =>
          setS((p) => ({
            vi: (p.vi + 1) % variants.length,
            line: 0,
            chars: 0,
            done: false,
            seed: p.seed + 1,
          })),
        HOLD_MS,
      );
    } else {
      const code = v.steps[s.line].code;
      if (s.chars < code.length) {
        // Boilerplate types fast; component lines type at reading speed.
        const step = v.steps[s.line].block ? 1 : 3;
        id = setTimeout(() => setS((p) => ({ ...p, chars: p.chars + step })), CHAR_MS);
      } else if (s.line < v.steps.length - 1) {
        const pause = v.steps[s.line].block ? LINE_PAUSE * 3 : LINE_PAUSE;
        id = setTimeout(() => setS((p) => ({ ...p, line: p.line + 1, chars: 0 })), pause);
      } else {
        id = setTimeout(() => setS((p) => ({ ...p, done: true })), 380);
      }
    }
    return () => clearTimeout(id);
  }, [s, running, reduce]);

  const v = variants[s.vi];
  const finalState = reduce
    ? { line: v.steps.length - 1, chars: 999, done: true }
    : { line: s.line, chars: s.chars, done: s.done };
  const landedKey = landedFor(v, finalState.line, finalState.chars, finalState.done);
  const landedSig = [...landedKey].join(",");
  // Stable Set per signature so the memoised frame only re-renders when a block lands.
  const landed = useMemo(() => new Set(landedSig.split(",").filter(Boolean) as Block[]), [landedSig]);

  // Cursor parallax on the whole rig.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const rotateY = useTransform(sx, [-1, 1], [-22, -6]);
  const rotateX = useTransform(sy, [-1, 1], [10, 2]);
  const codeX = useTransform(sx, [-1, 1], [-14, 14]);
  useEffect(() => {
    if (reduce || !running) return;
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my, reduce, running]);

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* soft red bloom behind the rig */}
      <div className="absolute top-[8%] right-[6%] h-[60vh] w-[50vw] bg-[radial-gradient(closest-side,rgba(205,23,23,0.22),transparent)]" />
      <div
        className="absolute top-[13vh] right-[-12vw] h-[40vh] w-[96vw] opacity-45 sm:right-[-4vw] sm:w-[80vw] lg:top-[17vh] lg:right-[3vw] lg:h-[40vh] lg:max-h-[440px] lg:w-[min(58vw,900px)] lg:opacity-100"
        style={{ perspective: 1600 }}
      >
        <motion.div
          className="relative h-full w-full"
          style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
        >
          <motion.div
            className="absolute top-[9%] left-0 hidden h-[86%] w-[47%] lg:block"
            style={{ x: codeX, translateZ: -60 }}
          >
            <CodePane v={v} line={finalState.line} chars={finalState.chars} done={finalState.done} />
          </motion.div>
          <motion.div
            className="absolute top-0 right-0 h-full w-full lg:w-[60%]"
            style={{ translateZ: 50 }}
          >
            <Frame v={v} landed={landed} done={finalState.done} seed={s.seed} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
