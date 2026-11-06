import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import css from "./work.module.css";
import { r1, rng } from "./rng";

/**
 * Art-directed covers for the selected work. Only Prescribe Life has real
 * product screens; every other project gets a generative figure drawn from
 * what the system does (never a fake screenshot, never an invented metric).
 * Everything is seeded by slug, so server and client render the same art.
 */

const W = 400;
const H = 260;
const MONO = "var(--font-geist-mono), ui-monospace, monospace";
const RED = "#cd1717";

const d = (s: number) => ({ ["--d" as string]: s }) as CSSProperties;

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 size-full"
      aria-hidden
    >
      {children}
    </svg>
  );
}

function Label({ x, y, children, fill = "rgba(255,255,255,0.55)", anchor = "start" }: { x: number; y: number; children: ReactNode; fill?: string; anchor?: "start" | "end" | "middle" }) {
  return (
    <text x={x} y={y} fill={fill} fontFamily={MONO} fontSize="7.5" letterSpacing="1.6" textAnchor={anchor}>
      {children}
    </text>
  );
}

/* Reform AI: a policy page, three clauses pulled out, routed to a decision. */
function Reform() {
  const r = rng("reform-ai");
  const lines = Array.from({ length: 15 }, (_, j) => ({
    y: 46 + j * 12,
    w: r1(46 + r() * 84),
    hit: j === 3 || j === 8 || j === 12,
  }));
  const hits = lines.filter((l) => l.hit);
  return (
    <Svg>
      <path d="M30 26 H160 L178 44 V236 H30 Z" fill="none" stroke="rgba(255,255,255,0.45)" />
      <path d="M160 26 V44 H178" fill="none" stroke="rgba(255,255,255,0.45)" />
      {lines.map((l, j) => (
        <rect key={j} x={42} y={l.y} width={l.w} height={4} fill={l.hit ? RED : "rgba(255,255,255,0.2)"} data-pop="" style={d(j * 0.03)} />
      ))}
      {hits.map((l, j) => (
        <path
          key={j}
          d={`M${r1(46 + l.w)} ${l.y + 2} H${214 + j * 10} V130 H286`}
          fill="none"
          stroke={RED}
          strokeWidth="1.5"
          pathLength={1}
          data-draw=""
          style={d(0.25 + j * 0.12)}
        />
      ))}
      <rect x="286" y="116" width="28" height="28" fill="none" stroke="#fff" strokeWidth="1.5" pathLength={1} data-draw="" style={d(0.6)} />
      <path d="M293 130 l5 5 l10 -11" fill="none" stroke="#fff" strokeWidth="2" pathLength={1} data-draw="" style={d(0.9)} />
      <path d="M314 124 L346 76 M314 136 L346 186" fill="none" stroke="rgba(255,255,255,0.5)" pathLength={1} data-draw="" style={d(0.8)} />
      <circle cx="354" cy="70" r="8" fill="none" stroke="#fff" />
      <rect x="346" y="182" width="16" height="16" fill="none" stroke="rgba(255,255,255,0.6)" strokeDasharray="2 2" />
      <Label x={372} y={60} anchor="end">REVIEW</Label>
      <Label x={372} y={214} anchor="end">EXCEPTION</Label>
      <Label x={286} y={110}>DECIDE</Label>
    </Svg>
  );
}

/* Kommerz OS: inventory, storefronts and finance on one grid, one live row. */
function Kommerz() {
  const r = rng("kommerz-os");
  const cols = 14;
  const rows = 7;
  const cells = Array.from({ length: cols * rows }, (_, k) => {
    const c = k % cols;
    const row = Math.floor(k / cols);
    const v = r();
    return { c, row, v, ring: r() > 0.9 };
  });
  return (
    <Svg>
      {cells.map(({ c, row, v, ring }) => {
        const live = row === 3;
        return (
          <rect
            key={`${c}-${row}`}
            x={32 + c * 24}
            y={30 + row * 24}
            width={20}
            height={20}
            fill={live ? RED : "#fff"}
            fillOpacity={live ? r1(0.35 + v * 0.65) : r1(0.04 + v * v * 0.4)}
            stroke={ring && !live ? "rgba(255,255,255,0.7)" : "none"}
            data-pop=""
            style={d(c * 0.035)}
          />
        );
      })}
      <line x1="32" x2="368" y1="212" y2="212" stroke="rgba(255,255,255,0.35)" />
      {["06", "09", "12", "15", "18", "21"].map((t, k) => (
        <g key={t}>
          <line x1={32 + k * 64} x2={32 + k * 64} y1="208" y2="216" stroke="rgba(255,255,255,0.35)" />
          <Label x={32 + k * 64} y={228}>{t}</Label>
        </g>
      ))}
      <line x1="244" x2="244" y1="24" y2="216" stroke="#fff" strokeWidth="1.5" pathLength={1} data-draw="" style={d(0.4)} />
      <rect x="240" y="20" width="8" height="8" fill="#fff" />
      <Label x={368} y={246} fill="#fff" anchor="end">MERCHANT DAY</Label>
    </Svg>
  );
}

/* Quicli: one gesture across a field grid, ending in the next step. */
function Quicli() {
  const dots = [];
  for (let x = 0; x < 17; x++) for (let y = 0; y < 11; y++) dots.push([24 + x * 22, 20 + y * 22]);
  return (
    <Svg>
      {dots.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x - 0.8} y={y - 0.8} width="1.6" height="1.6" fill="rgba(255,255,255,0.3)" />
      ))}
      <path
        d="M44 214 C 94 206, 104 128, 162 140 S 232 226, 268 156 S 302 58, 346 64"
        fill="none"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="14"
        strokeLinecap="round"
      />
      <path
        d="M44 214 C 94 206, 104 128, 162 140 S 232 226, 268 156 S 302 58, 346 64"
        fill="none"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
        pathLength={1}
        data-draw=""
        style={d(0.1)}
      />
      <circle cx="44" cy="214" r="7" fill="none" stroke="#fff" strokeWidth="1.5" />
      <rect x="339" y="57" width="14" height="14" fill={RED} data-pop="" style={d(1)} />
      <Label x={58} y={236}>JOB</Label>
      <Label x={150} y={124}>CLIENT</Label>
      <Label x={300} y={90}>NEXT STEP</Label>
    </Svg>
  );
}

/* Zimkey: a combination dial; one segment open. */
function Zimkey() {
  const r = rng("zimkey");
  const rings = [36, 58, 80, 102].map((rad, k) => {
    const segs: number[] = [];
    let total = 0;
    while (total < 100) {
      const a = r1(4 + r() * 18);
      const b = r1(2 + r() * 6);
      segs.push(a, b);
      total += a + b;
    }
    return { rad, dash: segs.join(" "), s: 18 + k * 9, rev: k % 2 === 1 };
  });
  const ticks = Array.from({ length: 48 }, (_, k) => {
    const a = (k / 48) * Math.PI * 2;
    const long = k % 4 === 0;
    return {
      x1: r1(200 + Math.cos(a) * 112),
      y1: r1(130 + Math.sin(a) * 112),
      x2: r1(200 + Math.cos(a) * (long ? 122 : 117)),
      y2: r1(130 + Math.sin(a) * (long ? 122 : 117)),
    };
  });
  return (
    <Svg>
      {ticks.map((t, k) => (
        <line key={k} {...t} stroke="rgba(255,255,255,0.35)" />
      ))}
      {rings.map((g) => (
        <g key={g.rad} className={`${css.spin} ${g.rev ? css.spinRev : ""}`} style={{ ["--s" as string]: `${g.s}s` }}>
          <circle cx="200" cy="130" r={g.rad} fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="5" pathLength={100} strokeDasharray={g.dash} />
        </g>
      ))}
      <g className={css.spin} style={{ ["--s" as string]: "11s" }}>
        <circle cx="200" cy="130" r="80" fill="none" stroke={RED} strokeWidth="9" pathLength={100} strokeDasharray="12 88" />
      </g>
      <circle cx="200" cy="124" r="8" fill="#fff" />
      <path d="M196 128 L193 146 H207 L204 128 Z" fill="#fff" />
      <Label x={334} y={212}>UNLOCK</Label>
      <Label x={334} y={224}>SHARE</Label>
      <Label x={334} y={236}>FORGET</Label>
    </Svg>
  );
}

/* DD Group: an axonometric tower, boardroom floor to building site. */
function DdGroup() {
  const floors = 8;
  const plate = (y: number) => `M128 ${y} L200 ${y - 36} L272 ${y} L200 ${y + 36} Z`;
  return (
    <Svg>
      {Array.from({ length: 9 }, (_, k) => (
        <g key={k} stroke="rgba(255,255,255,0.1)">
          <line x1={40 + k * 20} y1={236 - k * 10} x2={200 + k * 20} y2={316 - k * 10} />
          <line x1={360 - k * 20} y1={236 - k * 10} x2={200 - k * 20} y2={316 - k * 10} />
        </g>
      ))}
      {[128, 200, 272].map((x) => (
        <line key={x} x1={x} x2={x} y1={x === 200 ? 236 : 200} y2={x === 200 ? 236 - (floors - 1) * 17 : 200 - (floors - 1) * 17} stroke="rgba(255,255,255,0.4)" pathLength={1} data-draw="" style={d(0.1)} />
      ))}
      {Array.from({ length: floors }, (_, k) => {
        const y = 200 - k * 17;
        const live = k === 5;
        return (
          <path
            key={k}
            d={plate(y)}
            fill={live ? "rgba(205,23,23,0.35)" : "#0a0a0a"}
            stroke={live ? RED : "rgba(255,255,255,0.7)"}
            strokeWidth={live ? 1.6 : 1}
            data-pop=""
            style={d(0.1 + k * 0.08)}
          />
        );
      })}
      <line x1="300" x2="300" y1="44" y2="236" stroke="rgba(255,255,255,0.4)" />
      <line x1="295" x2="305" y1="44" y2="44" stroke="rgba(255,255,255,0.4)" />
      <line x1="295" x2="305" y1="236" y2="236" stroke="rgba(255,255,255,0.4)" />
      <Label x={312} y={120} fill="#fff">BOARDROOM</Label>
      <Label x={312} y={236}>SITE</Label>
    </Svg>
  );
}

/* Sochcast / Campus Gal: one voice, clipped out of the episode. */
function Sochcast() {
  const r = rng("sochcast-campus-gal");
  const n = 56;
  const bars = Array.from({ length: n }, (_, j) => {
    const env = Math.pow(Math.sin((Math.PI * (j + 0.5)) / n), 0.6);
    const h = r1(Math.max(4, env * (0.22 + r() * 0.78) * 150));
    return { x: r1(30 + j * 6.1), h, live: j >= 24 && j <= 33 };
  });
  return (
    <Svg>
      <line x1="24" x2="376" y1="130" y2="130" stroke="rgba(255,255,255,0.25)" />
      {bars.map((b, j) => (
        <rect key={j} x={b.x} y={r1(130 - b.h / 2)} width="3.2" height={b.h} fill={b.live ? RED : "rgba(255,255,255,0.75)"} data-grow="" style={d(j * 0.012)} />
      ))}
      <path d="M174 36 V28 H234 V36 M174 224 V232 H234 V224" fill="none" stroke="#fff" pathLength={1} data-draw="" style={d(0.6)} />
      <Label x={174} y={20} fill="#fff">CLIP 01</Label>
      <Label x={30} y={246}>EPISODE</Label>
      <Label x={370} y={246} anchor="end">CAMPUS</Label>
    </Svg>
  );
}

/* Prescribe Life: the one project with real product screens. */
function PrescribeLife() {
  return (
    <>
      <Image
        src="/projects/prescribe-life/2.png"
        alt=""
        fill
        sizes="(min-width: 768px) 420px, 75vw"
        className={`${css.duo} object-cover object-[50%_40%]`}
      />
      <span className="absolute inset-0 bg-asymmetri-red mix-blend-multiply" aria-hidden />
      <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" aria-hidden />
      <Svg>
        <polyline
          points="0,200 120,200 136,176 150,226 166,160 180,200 400,200"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          pathLength={1}
          data-draw=""
          style={d(0.2)}
        />
      </Svg>
    </>
  );
}

const FIG: Record<string, { art: () => ReactNode; caption: string }> = {
  "prescribe-life": { art: PrescribeLife, caption: "Product screens" },
  "reform-ai": { art: Reform, caption: "Policy to decision" },
  "kommerz-os": { art: Kommerz, caption: "One surface" },
  quicli: { art: Quicli, caption: "One gesture" },
  zimkey: { art: Zimkey, caption: "Unlock, share, forget" },
  "dd-group": { art: DdGroup, caption: "Boardroom to site" },
  "sochcast-campus-gal": { art: Sochcast, caption: "Episode to campus" },
};

export function Cover({
  slug,
  logo,
  index,
  on,
}: {
  slug: string;
  logo: string;
  index: number;
  on: boolean;
}) {
  const fig = FIG[slug];
  const Art = fig?.art;
  return (
    <div
      className={`${css.cover} ${on ? css.on : ""} relative size-full overflow-hidden bg-[#0a0a0a]`}
      aria-hidden
    >
      {/* drafting grid */}
      <span className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:20px_20px]" />
      {Art && <Art />}
      <span className="absolute top-2.5 left-3 font-mono text-[8px] uppercase tracking-[0.25em] text-white/70">
        Fig. {String(index + 1).padStart(2, "0")}
      </span>
      <span className="absolute top-2.5 right-3 font-mono text-[8px] uppercase tracking-[0.25em] text-white/70">
        {fig?.caption}
      </span>
      <span className="absolute bottom-3 left-3 flex h-[clamp(14px,6cqw,24px)] max-w-[45%] items-center">
        <Image
          src={logo}
          alt=""
          width={160}
          height={48}
          className="h-full w-auto object-contain object-left [filter:brightness(0)_invert(1)]"
        />
      </span>
      {/* corner crop marks */}
      {["top-1 left-1 border-t border-l", "top-1 right-1 border-t border-r", "bottom-1 left-1 border-b border-l", "bottom-1 right-1 border-b border-r"].map((c) => (
        <span key={c} className={`absolute size-2 border-white/60 ${c}`} />
      ))}
    </div>
  );
}
