"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { useActive } from "./hooks";

const RED = "#cd1717";
const OMEGA = 2.4; // rad/s of the two fixed emitters

type Pulse = { x: number; y: number; t0: number };

/**
 * Hero instrument: an interference field drawn as a terrain of scan lines, driven by two slow
 * emitters. The cursor is a third, faster source (the probe); a click injects
 * a pulse ring. A red scope trace samples the field along the probe's row.
 */
export function InterferenceField() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const active = useActive(wrap, "0px");

  const probe = useRef({ x: 0, y: 0, inside: false, sx: 0, sy: 0, amp: 0 });
  const pulses = useRef<Pulse[]>([]);
  const pulseCount = useRef(0);
  const hudFreq = useRef<HTMLSpanElement>(null);
  const hudPhase = useRef<HTMLSpanElement>(null);
  const hudProbe = useRef<HTMLSpanElement>(null);
  const hudLevel = useRef<HTMLSpanElement>(null);
  const hudPulses = useRef<HTMLSpanElement>(null);
  const hudBar = useRef<HTMLSpanElement>(null);

  // Pointer: tracked on window so it works over the headline too.
  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      const el = canvas.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const p = probe.current;
      p.inside = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
      p.x = x;
      p.y = y;
      if (p.amp < 0.02) {
        p.sx = x;
        p.sy = y;
      }
    };
    const onLeave = () => (probe.current.inside = false);
    const onDown = (e: PointerEvent) => {
      const el = canvas.current;
      if (!el || (e.target as HTMLElement).closest("a,button,input")) return;
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) return;
      pulses.current.push({ x, y, t0: performance.now() });
      if (pulses.current.length > 6) pulses.current.shift();
      pulseCount.current += 1;
      if (hudPulses.current)
        hudPulses.current.textContent = String(pulseCount.current).padStart(2, "0");
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
     
  }, [reduce]);

  useEffect(() => {
    const c = canvas.current;
    const host = wrap.current;
    if (!c || !host) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let ys = new Float32Array(0);
    const crests: number[] = [];

    const resize = () => {
      const r = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      c.style.width = `${w}px`;
      c.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    let frame = 0;
    const draw = (now: number) => {
      const t = now / 1000;
      const lambda = Math.max(54, w / 18);
      const k = (Math.PI * 2) / lambda;
      const p = probe.current;
      p.amp += ((p.inside ? 1 : 0) - p.amp) * 0.06;
      p.sx += (p.x - p.sx) * 0.12;
      p.sy += (p.y - p.sy) * 0.12;

      const s1x = w * (0.66 + 0.04 * Math.sin(t * 0.21));
      const s1y = h * (0.32 + 0.05 * Math.cos(t * 0.17));
      const s2x = w * (0.88 + 0.03 * Math.cos(t * 0.15));
      const s2y = h * (0.68 + 0.04 * Math.sin(t * 0.23));
      const fall = 1 / (w * 0.6);
      const live = pulses.current.filter((q) => now - q.t0 < 2600);
      pulses.current = live;

      const field = (x: number, y: number) => {
        const d1 = Math.hypot(x - s1x, y - s1y);
        const d2 = Math.hypot(x - s2x, y - s2y);
        let v =
          Math.sin(k * d1 - OMEGA * t) / (1 + d1 * fall) +
          Math.sin(k * d2 - OMEGA * t + 1.3) / (1 + d2 * fall);
        if (p.amp > 0.01) {
          const d3 = Math.hypot(x - p.sx, y - p.sy);
          v += p.amp * 1.4 * Math.sin(k * 1.5 * d3 - OMEGA * 1.7 * t) * Math.exp(-d3 / 240);
        }
        for (const q of live) {
          const age = (now - q.t0) / 1000;
          const r = age * 520;
          const d = Math.hypot(x - q.x, y - q.y) - r;
          v += 1.8 * Math.exp(-(d * d) / 700) * (1 - age / 2.6);
        }
        return v;
      };

      // Terrain of scan lines: each row is a waveform of the field, filled
      // below so nearer rows occlude the ones behind (like a pulsar plot).
      ctx.clearRect(0, 0, w, h);
      const ROW = w < 640 ? 14 : 17;
      const STEP = 6;
      const amp = ROW * 0.95;
      const cols = Math.ceil(w / STEP) + 1;
      if (ys.length !== cols) ys = new Float32Array(cols);
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, "rgba(255,255,255,0.10)");
      grad.addColorStop(0.45, "rgba(255,255,255,0.30)");
      grad.addColorStop(1, "rgba(255,255,255,0.55)");
      ctx.lineWidth = 1;
      ctx.lineJoin = "round";
      crests.length = 0;
      for (let y = ROW * 2; y < h + ROW * 2; y += ROW) {
        for (let i = 0; i < cols; i++) {
          const x = i * STEP;
          let n = field(x, y) / 1.6;
          if (n > 1) n = 1;
          else if (n < -1) n = -1;
          ys[i] = y - n * amp;
          if (n > 0.9 && i % 3 === 0 && crests.length < 600) crests.push(x, ys[i]);
        }
        ctx.beginPath();
        ctx.moveTo(0, ys[0]);
        for (let i = 1; i < cols; i++) ctx.lineTo(i * STEP, ys[i]);
        ctx.lineTo(w, y + ROW * 2);
        ctx.lineTo(0, y + ROW * 2);
        ctx.closePath();
        ctx.fillStyle = "rgba(0,0,0,0.9)";
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(0, ys[0]);
        for (let i = 1; i < cols; i++) ctx.lineTo(i * STEP, ys[i]);
        ctx.strokeStyle = grad;
        ctx.stroke();
      }
      // Red markers where the waves add up (constructive interference).
      ctx.fillStyle = RED;
      for (let i = 0; i < crests.length; i += 2) ctx.fillRect(crests[i] - 1.5, crests[i + 1] - 1.5, 3, 3);

      // Scope trace along the probe's row (or a resting row).
      const rowY = p.sy * p.amp + h * 0.3 * (1 - p.amp);
      const x0 = w * (w < 640 ? 0 : 0.38);
      ctx.strokeStyle = "rgba(255,255,255,0.14)";
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 6]);
      ctx.beginPath();
      ctx.moveTo(x0, rowY);
      ctx.lineTo(w, rowY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = RED;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = x0; x <= w; x += 4) {
        const yy = rowY - Math.max(-1.2, Math.min(1.2, field(x, rowY) / 1.6)) * 30;
        if (x === x0) ctx.moveTo(x, yy);
        else ctx.lineTo(x, yy);
      }
      ctx.stroke();

      // Probe crosshair.
      if (p.amp > 0.05) {
        ctx.globalAlpha = p.amp;
        ctx.strokeStyle = "rgba(255,255,255,0.12)";
        ctx.beginPath();
        ctx.moveTo(p.sx, 0);
        ctx.lineTo(p.sx, h);
        ctx.stroke();
        ctx.strokeStyle = "#fff";
        const r = 14;
        const c4 = 5;
        ctx.beginPath();
        for (const [dx, dy] of [
          [-1, -1],
          [1, -1],
          [1, 1],
          [-1, 1],
        ]) {
          ctx.moveTo(p.sx + dx * r, p.sy + dy * r - dy * c4);
          ctx.lineTo(p.sx + dx * r, p.sy + dy * r);
          ctx.lineTo(p.sx + dx * r - dx * c4, p.sy + dy * r);
        }
        ctx.stroke();
        ctx.fillStyle = RED;
        ctx.fillRect(p.sx - 2, p.sy - 2, 4, 4);
        ctx.font = "10px ui-monospace, SFMono-Regular, Menlo, monospace";
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.fillText(
          `PROBE ${(p.sx / w).toFixed(3)} / ${(p.sy / h).toFixed(3)}`,
          p.sx + r + 8,
          p.sy - r,
        );
        ctx.globalAlpha = 1;
      }

      // HUD readouts, a few times a second.
      if (frame++ % 6 === 0) {
        const base = OMEGA / (Math.PI * 2);
        const f = base * (1 + p.amp * 0.7 * (p.sx / Math.max(w, 1))) + Math.sin(t * 7) * 0.0004;
        const lv = p.amp > 0.05 ? field(p.sx, p.sy) / 2 : field(s1x + 40, s1y) / 2;
        if (hudFreq.current) hudFreq.current.textContent = `${f.toFixed(4)} Hz`;
        if (hudPhase.current)
          hudPhase.current.textContent = `${(((OMEGA * t) % (Math.PI * 2)) - Math.PI).toFixed(2)} rad`;
        if (hudProbe.current) hudProbe.current.textContent = p.amp > 0.5 ? "Armed" : "Idle";
        if (hudLevel.current) hudLevel.current.textContent = `${lv >= 0 ? "+" : ""}${lv.toFixed(2)}`;
        if (hudBar.current)
          hudBar.current.style.transform = `scaleX(${Math.min(Math.abs(lv), 1).toFixed(3)})`;
      }
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduce || !active) draw(1200);
    });
    ro.observe(host);

    if (reduce || !active) {
      draw(1200);
      return () => ro.disconnect();
    }
    let raf = 0;
    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
     
  }, [active, reduce]);

  return (
    <div ref={wrap} className="absolute inset-0" aria-hidden>
      <canvas ref={canvas} className="absolute inset-0 block" />
      {/* Calm the terrain under the summary column so copy stays legible. */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.8)_0%,rgba(0,0,0,0.35)_45%,transparent_70%)]" />

      <div className="pointer-events-none absolute top-[6.5rem] right-6 left-6 hidden items-stretch border-y border-white/10 bg-black/40 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 backdrop-blur-[2px] md:right-16 md:left-16 md:flex">
        <span className="flex items-center gap-2 border-r border-white/10 py-2 pr-4 text-white">
          <span className="kit-blink inline-block size-1.5 bg-asymmetri-red" />
          Scope · CH1 + CH2
        </span>
        {(
          [
            ["Freq", hudFreq, "0.3820 Hz", "text-white"],
            ["Phase", hudPhase, "0.00 rad", "text-white"],
            ["Probe", hudProbe, "Idle", "text-asymmetri-red"],
            ["Level", hudLevel, "+0.00", "text-white"],
            ["Pulses", hudPulses, "00", "text-white"],
          ] as const
        ).map(([k, r, v, c], i) => (
          <span
            key={k}
            className={`items-center gap-3 border-r border-white/10 px-4 py-2 ${i > 2 ? "hidden xl:flex" : "flex"}`}
          >
            {k}
            <span ref={r} className={`min-w-[5.5em] tabular-nums ${c}`}>
              {v}
            </span>
          </span>
        ))}
        <span className="hidden flex-1 items-center px-4 lg:flex">
          <span className="block h-1 w-full bg-white/10">
            <span ref={hudBar} className="block h-full origin-left scale-x-0 bg-asymmetri-red" />
          </span>
        </span>
        <span className="ml-auto flex items-center py-2 pl-4 text-[9px] text-white/40">
          Move to probe · Click to pulse
        </span>
      </div>
    </div>
  );
}
