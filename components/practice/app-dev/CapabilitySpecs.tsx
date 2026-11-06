"use client";

import { useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { motion } from "motion/react";
import { useReduceMotion as useReducedMotion } from "@/hooks/useReduceMotion";
import { SectionHead } from "@/components/practice/SectionHead";
import type { Practice } from "@/lib/practices";
import { capabilitySpecs, type CapabilityKind } from "./content";

const pad = (n: number) => String(n).padStart(2, "0");

/** Blueprint drawing per capability. Dimension lines draw in on inspect. */
function Blueprint({ kind, on }: { kind: CapabilityKind; on: boolean }) {
  const stroke = on ? "#cd1717" : "rgba(0,0,0,0.55)";
  const dim = (
    <g
      className="transition-opacity duration-300"
      style={{ opacity: on ? 1 : 0 }}
      stroke="#cd1717"
      strokeWidth="0.75"
      fontFamily="monospace"
      fontSize="7"
    >
      <line x1="20" x2="180" y1="112" y2="112" />
      <line x1="20" x2="20" y1="108" y2="116" />
      <line x1="180" x2="180" y1="108" y2="116" />
      <text x="100" y="122" textAnchor="middle" fill="#cd1717" stroke="none">
        {kind === "mobile" ? "390 pt" : kind === "qa" ? "pass · pass · pass" : "fluid · 12 col"}
      </text>
    </g>
  );
  const common = {
    viewBox: "0 0 200 126",
    className: "h-full w-full",
    fill: "none" as const,
    strokeWidth: 1.25,
    vectorEffect: "non-scaling-stroke",
  };
  switch (kind) {
    case "web":
      return (
        <svg {...common} stroke={stroke}>
          <rect x="20" y="10" width="160" height="94" />
          <line x1="20" x2="180" y1="22" y2="22" />
          <rect x="28" y="30" width="60" height="30" />
          <rect x="96" y="30" width="76" height="66" strokeDasharray="3 3" />
          <rect x="28" y="66" width="60" height="30" />
          {dim}
        </svg>
      );
    case "mobile":
      return (
        <svg {...common} stroke={stroke}>
          <rect x="62" y="6" width="44" height="98" rx="0" />
          <rect x="114" y="18" width="30" height="74" strokeDasharray="3 3" />
          <line x1="76" x2="92" y1="12" y2="12" />
          <rect x="68" y="20" width="32" height="20" />
          <line x1="68" x2="100" y1="48" y2="48" />
          <line x1="68" x2="92" y1="56" y2="56" />
          <rect x="68" y="86" width="32" height="10" />
          {dim}
        </svg>
      );
    case "design":
      return (
        <svg {...common} stroke={stroke}>
          {[40, 80, 120, 160].map((x) => (
            <line key={x} x1={x} x2={x} y1="8" y2="104" strokeDasharray="1 4" />
          ))}
          <path d="M24 92 C60 10, 120 110, 176 24" />
          <rect x="21" y="89" width="6" height="6" fill={stroke} />
          <rect x="173" y="21" width="6" height="6" fill={stroke} />
          <line x1="24" y1="92" x2="70" y2="30" strokeDasharray="3 3" />
          <line x1="176" y1="24" x2="130" y2="90" strokeDasharray="3 3" />
          {dim}
        </svg>
      );
    case "api":
      return (
        <svg {...common} stroke={stroke}>
          <rect x="84" y="40" width="32" height="32" />
          {[
            [30, 20],
            [30, 92],
            [170, 20],
            [170, 92],
          ].map(([x, y]) => (
            <g key={`${x}${y}`}>
              <path d={`M100 56 L${x} ${y}`} strokeDasharray="3 3" />
              <rect x={x - 8} y={y - 8} width="16" height="16" />
            </g>
          ))}
          {dim}
        </svg>
      );
    case "cloud":
      return (
        <svg {...common} stroke={stroke}>
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <path d={`M40 ${78 - i * 24} L100 ${96 - i * 24} L160 ${78 - i * 24} L100 ${60 - i * 24} Z`} />
            </g>
          ))}
          <line x1="40" x2="40" y1="30" y2="78" strokeDasharray="2 3" />
          <line x1="160" x2="160" y1="30" y2="78" strokeDasharray="2 3" />
          {dim}
        </svg>
      );
    case "qa":
      return (
        <svg {...common} stroke={stroke}>
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <rect x="30" y={14 + i * 22} width="12" height="12" />
              <path d={`M33 ${20 + i * 22} L36 ${23 + i * 22} L41 ${16 + i * 22}`} strokeWidth="1.5" />
              <line x1="52" x2={120 + (i % 2) * 30} y1={20 + i * 22} y2={20 + i * 22} />
            </g>
          ))}
          {dim}
        </svg>
      );
  }
}

function SpecCard({
  name,
  i,
  spec,
}: {
  name: string;
  i: number;
  spec: (typeof capabilitySpecs)[number];
}) {
  const ref = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const reduce = useReducedMotion();

  const move = (e: RPointerEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    ref.current?.style.setProperty("--cx", `${x}px`);
    ref.current?.style.setProperty("--cy", `${y}px`);
    setPos({ x: Math.round(x), y: Math.round(y) });
  };

  return (
    <motion.article
      ref={ref}
      tabIndex={0}
      onPointerEnter={() => setOn(true)}
      onPointerLeave={() => setOn(false)}
      onPointerMove={move}
      onFocus={() => setOn(true)}
      onBlur={() => setOn(false)}
      initial={reduce ? false : { opacity: 0, y: 40, clipPath: "inset(0 0 100% 0)" }}
      whileInView={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative flex cursor-crosshair flex-col overflow-hidden border-r border-b border-black/15 p-6 outline-none transition-colors duration-300 focus-visible:bg-black md:p-8 ${
        on ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* crosshair that follows the pointer */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 transition-opacity duration-200 ${on && pos.x ? "opacity-100" : "opacity-0"}`}
      >
        <span className="absolute top-0 bottom-0 w-px bg-asymmetri-red/60" style={{ left: "var(--cx)" }} />
        <span className="absolute right-0 left-0 h-px bg-asymmetri-red/60" style={{ top: "var(--cy)" }} />
        <span
          className="absolute ml-2 mt-2 bg-asymmetri-red px-1 font-mono text-[9px] text-white"
          style={{ left: "var(--cx)", top: "var(--cy)" }}
        >
          x {pad(pos.x)} · y {pad(pos.y)}
        </span>
      </span>
      {/* corner registration marks */}
      {["top-2 left-2 border-t border-l", "top-2 right-2 border-t border-r", "bottom-2 left-2 border-b border-l", "bottom-2 right-2 border-b border-r"].map(
        (c) => (
          <span key={c} aria-hidden className={`absolute size-3 ${c} ${on ? "border-asymmetri-red" : "border-black/30"}`} />
        ),
      )}

      <div className="flex items-start justify-between font-mono text-[10px] uppercase tracking-[0.2em]">
        <span className="text-asymmetri-red">02.{i + 1}</span>
        <span className={on ? "text-white/50" : "text-black/40"}>Spec · {on ? "inspecting" : "component"}</span>
      </div>

      <div className="my-5 h-28 md:h-32" aria-hidden>
        <Blueprint kind={spec.kind} on={on} />
      </div>

      <h3 className="font-chakra-petch text-2xl leading-none font-bold uppercase md:text-3xl">{name}</h3>
      <p className={`mt-3 font-geist text-sm leading-relaxed md:text-base ${on ? "text-white/75" : "text-black/65"}`}>
        {spec.approach}
      </p>

      <div className={`mt-6 border-t pt-4 ${on ? "border-white/20" : "border-black/15"}`}>
        <p className={`mb-2 font-mono text-[10px] uppercase tracking-[0.2em] ${on ? "text-white/50" : "text-black/45"}`}>
          Deliverables
        </p>
        <ul className="grid grid-cols-1 gap-1 font-mono text-[11px] sm:grid-cols-2">
          {spec.deliverables.map((d) => (
            <li key={d} className="flex gap-2">
              <span className="text-asymmetri-red">■</span>
              {d}
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}

/** Six capabilities as a hover-to-inspect spec sheet. */
export function CapabilitySpecs({ practice }: { practice: Practice }) {
  return (
    <section
      data-chapter="Capabilities"
      aria-labelledby="ad-caps"
      className="bg-white px-6 py-28 text-black md:px-16 md:py-36"
    >
      <div id="ad-caps">
        <SectionHead
          tone="light"
          kicker="Capabilities · Spec sheet"
          title={["Six disciplines,", ["one team."]]}
          body="Designers, engineers and QA in the same squad, on the same loop. Hover or focus a spec to inspect it."
        />
      </div>
      <div className="mt-16 grid border-t border-l border-black/15 md:grid-cols-2 xl:grid-cols-3">
        {practice.capabilities.map((c, i) => (
          <SpecCard key={c} name={c} i={i} spec={capabilitySpecs[i]} />
        ))}
      </div>
    </section>
  );
}
