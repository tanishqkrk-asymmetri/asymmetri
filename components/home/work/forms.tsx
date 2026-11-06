import type { CSSProperties, ReactNode } from "react";
import css from "./work.module.css";
import { r1, rng } from "./rng";

/**
 * The five forms one interface takes across the domains. Each is an SVG
 * whose viewBox matches the frame's proportions when it holds that form,
 * so nothing stretches. Loops only run while the form is live.
 */

export const shapes = [
  { label: "Card", w: 54, h: 34, r: 3, rot: -4 },
  { label: "Screen", w: 66, h: 38, r: 1, rot: 3 },
  { label: "Wearable", w: 30, h: 37, r: 8, rot: -2 },
  { label: "Console", w: 62, h: 44, r: 0.4, rot: 2 },
  { label: "Sensor", w: 46, h: 46, r: 23, rot: 0 },
] as const;

const MONO = "var(--font-geist-mono), ui-monospace, monospace";
const DISPLAY = "var(--font-chakra-petch), sans-serif";
const RED = "#cd1717";
const DIM = "rgba(255,255,255,0.35)";
const loop = `${css.loop}`;

function Svg({ i, children }: { i: number; children: ReactNode }) {
  const s = shapes[i];
  return (
    <svg viewBox={`0 0 ${s.w * 10} ${s.h * 10}`} className="absolute inset-0 size-full" aria-hidden>
      {children}
    </svg>
  );
}

function T({
  x,
  y,
  children,
  size = 11,
  fill = DIM,
  anchor = "start",
  font = MONO,
  className,
  weight,
}: {
  x: number;
  y: number;
  children: ReactNode;
  size?: number;
  fill?: string;
  anchor?: "start" | "middle" | "end";
  font?: string;
  className?: string;
  weight?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      fill={fill}
      fontFamily={font}
      fontSize={size}
      fontWeight={weight}
      letterSpacing={font === MONO ? size * 0.18 : 0}
      textAnchor={anchor}
      className={className}
    >
      {children}
    </text>
  );
}

/* 01 · Card: commerce and finance, and the trust layer around it. */
function CardForm() {
  const rows = ["AUTHORISED", "3-D SECURE · PASSED", "RISK CHECK · CLEAR", "PAYOUT · QUEUED"];
  const all = [...rows, ...rows.slice(0, 2)];
  return (
    <Svg i={0}>
      <defs>
        <clipPath id="dm-ledger">
          <rect x="44" y="236" width="452" height="56" />
        </clipPath>
      </defs>
      <rect x="44" y="64" width="76" height="58" rx="8" fill="none" stroke="#fff" strokeWidth="2" />
      <path d="M44 93 H120 M82 64 V122 M62 64 V80 H102 V64 M62 122 V106 H102 V122" fill="none" stroke={DIM} />
      {[16, 28, 40].map((r) => (
        <path key={r} d={`M150 ${93 - r} a ${r} ${r} 0 0 1 0 ${r * 2}`} fill="none" stroke="#fff" strokeWidth="2.5" />
      ))}
      <circle cx="466" cy="92" r="28" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
      <circle cx="466" cy="92" r="28" fill="none" stroke={RED} strokeWidth="3" pathLength={1} strokeDasharray="1" className={`${css.ring} ${loop}`} transform="rotate(-90 466 92)" />
      <path d="M454 92 l8 8 l16 -18" fill="none" stroke="#fff" strokeWidth="3" />
      <T x={466} y={142} anchor="middle" size={10} fill="#fff">VERIFIED</T>
      <T x={44} y={198} size={30} fill="#fff">•••• •••• •••• 4417</T>
      <line x1="44" x2="496" y1="222" y2="222" stroke="rgba(255,255,255,0.15)" />
      <g clipPath="url(#dm-ledger)">
        <g className={`${css.ticker} ${loop}`} style={{ transformBox: "fill-box" } as CSSProperties}>
          {all.map((r, k) => (
            <g key={k}>
              <rect x="44" y={236 + k * 28} width="452" height="28" fill="none" />
              <rect x="44" y={246 + k * 28} width="8" height="8" fill={k % 4 === 3 ? "#fff" : RED} />
              <T x={62} y={254 + k * 28} size={12} fill="#fff">{r}</T>
              <T x={496} y={254 + k * 28} size={10} anchor="end">✓</T>
            </g>
          ))}
        </g>
      </g>
      <T x={496} y={318} anchor="end" size={9}>ILLUSTRATIVE</T>
    </Svg>
  );
}

/* 02 · Screen: media and growth; a live stream and the audience around it. */
function ScreenForm() {
  const r = rng("dm-screen");
  const pts = Array.from({ length: 12 }, (_, k) => [r1(484 + k * 13.6), r1(150 - (0.25 + r() * 0.55 + k * 0.025) * 90)]);
  const line = pts.map((p) => p.join(",")).join(" ");
  const last = pts[pts.length - 1];
  return (
    <Svg i={1}>
      <rect x="24" y="24" width="420" height="276" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.15)" />
      <path d="M210 128 L258 162 L210 196 Z" fill={RED} />
      <circle cx="234" cy="162" r="58" fill="none" stroke="rgba(255,255,255,0.3)" />
      <circle cx="44" cy="46" r="5" fill={RED} className={`${css.blink} ${loop}`} />
      <T x={56} y={50} size={12} fill="#fff">LIVE</T>
      <T x={424} y={50} size={10} anchor="end">CH 02</T>
      <line x1="24" x2="444" y1="332" y2="332" stroke="rgba(255,255,255,0.25)" strokeWidth="4" />
      <rect x="24" y="330" width="420" height="4" fill="#fff" className={`${css.scrub} ${loop}`} />
      {[120, 236, 352].map((x) => (
        <line key={x} x1={x} x2={x} y1="324" y2="340" stroke="#fff" />
      ))}
      <line x1="468" x2="468" y1="24" y2="356" stroke="rgba(255,255,255,0.15)" />
      <T x={484} y={44} size={10}>AUDIENCE</T>
      <polygon points={`484,160 ${line} ${last[0]},160`} fill="rgba(255,255,255,0.08)" />
      <polyline points={line} fill="none" stroke="#fff" strokeWidth="2" />
      <rect x={last[0] - 5} y={last[1] - 5} width="10" height="10" fill={RED} />
      {["RETAIN", "SHARE", "RETURN"].map((l, k) => (
        <g key={l}>
          <T x={484} y={210 + k * 46} size={10}>{l}</T>
          <rect x="484" y={218 + k * 46} width="148" height="6" fill="rgba(255,255,255,0.12)" />
          <rect x="484" y={218 + k * 46} width={[104, 66, 122][k]} height="6" fill={k === 2 ? RED : "#fff"} />
        </g>
      ))}
    </Svg>
  );
}

/* 03 · Wearable: health and care; rings and a pulse. */
function WearableForm() {
  return (
    <Svg i={2}>
      <T x={150} y={58} anchor="middle" size={13} fill="#fff">06:42</T>
      <circle cx="150" cy="176" r="96" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="12" />
      <circle cx="150" cy="176" r="96" fill="none" stroke={RED} strokeWidth="12" strokeLinecap="round" pathLength={1} strokeDasharray="1" className={`${css.ring} ${loop}`} transform="rotate(-90 150 176)" />
      <circle cx="150" cy="176" r="74" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="8" />
      <circle cx="150" cy="176" r="74" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset="0.42" transform="rotate(-90 150 176)" />
      <T x={150} y={192} anchor="middle" size={52} fill="#fff" font={DISPLAY} weight={700}>72</T>
      <T x={150} y={214} anchor="middle" size={11}>BPM</T>
      <polyline
        points="20,316 96,316 112,292 126,340 142,280 158,316 280,316"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        pathLength={1}
        className={`${css.trace} ${loop}`}
      />
    </Svg>
  );
}

/* 04 · Console: operations and logistics; a route, a fleet, throughput. */
function ConsoleForm() {
  const route = "M60 370 L120 262 L214 292 L262 160 L356 116";
  const nodes = [
    [60, 370],
    [120, 262],
    [214, 292],
    [262, 160],
    [356, 116],
  ];
  return (
    <Svg i={3}>
      {Array.from({ length: 9 }, (_, k) => (
        <line key={`v${k}`} x1={24 + k * 46} x2={24 + k * 46} y1="44" y2="412" stroke="rgba(255,255,255,0.07)" />
      ))}
      {Array.from({ length: 9 }, (_, k) => (
        <line key={`h${k}`} x1="24" x2="392" y1={44 + k * 46} y2={44 + k * 46} stroke="rgba(255,255,255,0.07)" />
      ))}
      <T x={24} y={30} size={10}>OPS CONSOLE · ILLUSTRATIVE</T>
      <path d={route} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="10" strokeLinejoin="round" />
      <path d={route} fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="6 6" />
      {nodes.map(([x, y], k) => (
        <rect key={k} x={x - 7} y={y - 7} width="14" height="14" fill={k === nodes.length - 1 ? RED : "#0a0a0a"} stroke="#fff" strokeWidth="2" />
      ))}
      <circle r="7" fill={RED}>
        <animateMotion dur="6s" repeatCount="indefinite" path={route} />
      </circle>
      <T x={76} y={392} size={10} fill="#fff">DEPOT</T>
      <T x={372} y={108} size={10} fill="#fff">DROP 04</T>
      <line x1="412" x2="412" y1="24" y2="420" stroke="rgba(255,255,255,0.15)" />
      <T x={430} y={44} size={10}>THROUGHPUT</T>
      <g className={css.bars}>
        {[46, 72, 38, 88, 60, 96, 52, 78].map((h, k) => (
          <rect
            key={k}
            x={430 + k * 21}
            y={214 - h * 1.4}
            width="14"
            height={h * 1.4}
            fill={k === 5 ? RED : "rgba(255,255,255,0.55)"}
            className={loop}
            style={{ ["--d" as string]: k } as CSSProperties}
          />
        ))}
      </g>
      <line x1="430" x2="598" y1="214" y2="214" stroke="rgba(255,255,255,0.4)" />
      {["UNIT 01", "UNIT 02", "UNIT 03", "UNIT 04"].map((u, k) => (
        <g key={u}>
          <rect x="430" y={252 + k * 36} width="10" height="10" fill={k === 2 ? RED : "#fff"} />
          <T x={450} y={262 + k * 36} size={11} fill="#fff">{u}</T>
          <T x={598} y={262 + k * 36} size={10} anchor="end">{k === 2 ? "HOLD" : "ON ROUTE"}</T>
        </g>
      ))}
    </Svg>
  );
}

/* 05 · Sensor: physical and connected environments; a radar over a zone. */
function SensorForm() {
  return (
    <Svg i={4}>
      <defs>
        <linearGradient id="dm-sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={RED} stopOpacity="0" />
          <stop offset="1" stopColor={RED} stopOpacity="0.7" />
        </linearGradient>
      </defs>
      {[200, 150, 100, 50].map((r) => (
        <circle key={r} cx="230" cy="230" r={r} fill="none" stroke="rgba(255,255,255,0.25)" />
      ))}
      <path d="M30 230 H430 M230 30 V430" stroke="rgba(255,255,255,0.15)" />
      <g className={`${css.sweep} ${loop}`}>
        <path d="M230 230 L230 30 A200 200 0 0 1 371.4 88.6 Z" fill="url(#dm-sweep)" />
        <line x1="230" y1="230" x2="371.4" y2="88.6" stroke="#fff" strokeWidth="2" />
      </g>
      {[
        [150, 160],
        [320, 190],
        [200, 330],
      ].map(([x, y], k) => (
        <g key={k}>
          <circle cx={x} cy={y} r="10" fill="none" stroke={RED} strokeWidth="2" className={`${css.blip} ${loop}`} style={{ animationDelay: `${k * 0.6}s` }} />
          <rect x={x - 5} y={y - 5} width="10" height="10" fill="#fff" />
        </g>
      ))}
      <T x={230} y={60} anchor="middle" size={12} fill="#fff">N</T>
      <T x={230} y={404} anchor="middle" size={11}>ZONE A · 3 DEVICES</T>
    </Svg>
  );
}

export const forms = [CardForm, ScreenForm, WearableForm, ConsoleForm, SensorForm];

/** All five forms stacked; only the live one is revealed, behind a scan line. */
export function FormLayers({ active }: { active: number }) {
  return (
    <>
      {forms.map((F, i) => (
        <div key={i} className={`${css.iface} ${active === i ? css.live : ""}`}>
          <F />
          <span className={css.scan} />
        </div>
      ))}
    </>
  );
}
