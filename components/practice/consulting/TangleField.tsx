"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/**
 * "The tangle": a knot of red and white strands standing in for a messy
 * system (legacy, vendors, silos, conflicting priorities). The cursor is a
 * comb: strands near it straighten into clean architecture lanes and slowly
 * spring back. Scrolling through the hero resolves the whole knot.
 */

/** Shared with the HUD readout in the hero aside. One hero per page. */
export const tangleState = { order: 0 };

const S = 96; // samples per strand
const LANES = ["Experience", "Agents", "Services", "Data", "Integration", "Platform"];
const NOISE = ["Legacy core", "Vendor A", "Data silo", "Shadow IT", "Priority?", "Spreadsheet", "Vendor B", "Batch job"];

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

type Strand = {
  red: boolean;
  alpha: number;
  width: number;
  lane: number;
  slot: number;
  src: number;
  dst: number;
  loops: number;
  phase: number;
  speed: number;
  amp: number;
  wob: number;
};

export function TangleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const host = canvas.parentElement as HTMLElement;
    const section = canvas.closest("section") as HTMLElement | null;

    const rand = mulberry32(31);
    const N = window.innerWidth < 768 ? 46 : 74;
    const perLane = Math.ceil(N / LANES.length);
    const strands: Strand[] = Array.from({ length: N }, (_, i) => ({
      red: i % 6 === 0,
      alpha: 0.12 + rand() * 0.3,
      width: rand() < 0.18 ? 1.6 : 1,
      lane: i % LANES.length,
      slot: Math.floor(i / LANES.length),
      src: 0.08 + rand() * 0.84,
      dst: 0.05 + rand() * 0.9,
      loops: 1.4 + rand() * 3.2,
      phase: rand() * Math.PI * 2,
      speed: (0.05 + rand() * 0.16) * (rand() < 0.5 ? -1 : 1),
      amp: 0.35 + rand() * 0.75,
      wob: rand() * Math.PI * 2,
    }));

    const comb = new Float32Array(N * S);
    const px = new Float32Array(N * S);
    const py = new Float32Array(N * S);

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let visible = true;
    let global = 0;
    let gTarget = 0;
    const pointer = { x: -9999, y: -9999, vx: 0, vy: 0, t: -1e9, inside: false };
    const start = performance.now();

    const resize = () => {
      const r = host.getBoundingClientRect();
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const readScroll = () => {
      const sh = section?.offsetHeight ?? h;
      gTarget = clamp01(window.scrollY / (sh * 0.42));
    };

    const frame = (now: number, animate: boolean) => {
      const tau = animate ? (now - start) / 1000 : 0;
      const mobile = w < 768;
      const cx = w * (mobile ? 0.62 : 0.66);
      const cy = h * (mobile ? 0.26 : 0.42);
      const R = Math.min(w, h) * (mobile ? 0.3 : 0.27);
      const spread = w * (mobile ? 0.42 : 0.2);
      const laneTop = h * (mobile ? 0.1 : 0.16);
      const laneGap = (h * (mobile ? 0.36 : 0.6)) / (LANES.length - 1);
      const slotGap = mobile ? 3.5 : 4.5;

      if (animate) global += (gTarget - global) * 0.08;
      else global = gTarget;

      // The comb: real pointer while it moves, otherwise a ghost that drifts
      // through the knot so the idea reads on touch screens too.
      const idle = now - pointer.t > 2600;
      let combX = pointer.x;
      let combY = pointer.y;
      let combPower = 0;
      if (!idle && pointer.inside) {
        const v = Math.hypot(pointer.vx, pointer.vy);
        combPower = Math.min(1, v / 10) * 0.34;
      } else if (animate) {
        combX = cx + Math.sin(tau * 0.45) * R * 1.05;
        combY = cy + Math.sin(tau * 0.83 + 1) * R * 0.75;
        combPower = 0.09;
      }
      const CR = mobile ? 70 : 110;

      ctx.clearRect(0, 0, w, h);
      let sumO = 0;

      for (let s = 0; s < N; s++) {
        const st = strands[s];
        const laneY = laneTop + st.lane * laneGap + (st.slot - perLane / 2) * slotGap;
        const xa = w * (0.28 + st.lane * 0.018 + st.slot * 0.003);
        const xb = xa + w * 0.05;
        let strandO = 0;

        for (let j = 0; j < S; j++) {
          const idx = s * S + j;
          const t = j / (S - 1);
          const x0 = -0.06 * w + t * 1.12 * w;
          const dx = (x0 - cx) / spread;
          const e = Math.exp(-dx * dx);
          const edgeY = (st.src + (st.dst - st.src) * t) * h;
          const th = t * st.loops * Math.PI * 2 + st.phase + tau * st.speed;
          const r = R * st.amp * e;
          const tx = x0 + Math.cos(th) * r * 1.1 + Math.sin(t * 9 + st.wob + tau * 0.3) * 6 * e;
          const ty = edgeY + (cy - edgeY) * e + Math.sin(th * 1.3 + st.wob) * r * 0.85;

          const k = smooth(xa, xb, x0);
          const clx = x0;
          const cly = st.src * h + (laneY - st.src * h) * k;

          // Comb influence measured against where the point is drawn now.
          if (combPower > 0 && idx < px.length) {
            const ddx = px[idx] - combX;
            const ddy = py[idx] - combY;
            const d2 = ddx * ddx + ddy * ddy;
            if (d2 < CR * CR) comb[idx] = Math.min(1, comb[idx] + (1 - Math.sqrt(d2) / CR) * combPower);
          }
          if (animate) comb[idx] *= 0.994;

          const oRaw = clamp01(global + comb[idx]);
          const o = oRaw * oRaw * (3 - 2 * oRaw);
          strandO += o;
          px[idx] = tx + (clx - tx) * o;
          py[idx] = ty + (cly - ty) * o;
        }

        strandO /= S;
        sumO += strandO;
        ctx.beginPath();
        ctx.moveTo(px[s * S], py[s * S]);
        for (let j = 1; j < S; j++) ctx.lineTo(px[s * S + j], py[s * S + j]);
        ctx.lineWidth = st.width;
        ctx.strokeStyle = st.red
          ? `rgba(205,23,23,${0.55 + strandO * 0.4})`
          : `rgba(255,255,255,${st.alpha + strandO * 0.35})`;
        ctx.stroke();
      }

      const order = sumO / N;
      tangleState.order = order;

      // Noise labels float inside the knot and fade as it resolves.
      const noiseA = (1 - smooth(0.15, 0.6, order)) * 0.7;
      ctx.font = `${mobile ? 9 : 10}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textBaseline = "middle";
      if (noiseA > 0.01) {
        for (let i = 0; i < NOISE.length; i++) {
          const a = (i / NOISE.length) * Math.PI * 2 + tau * 0.05;
          const rr = R * (0.45 + ((i * 37) % 10) / 18);
          const lx = cx + Math.cos(a) * rr * 1.1;
          const ly = cy + Math.sin(a * 1.4) * rr * 0.7;
          const label = `[ ${NOISE[i].toUpperCase()} ]`;
          ctx.fillStyle = i % 3 === 0 ? `rgba(205,23,23,${noiseA})` : `rgba(255,255,255,${noiseA * 0.75})`;
          ctx.textAlign = "center";
          ctx.fillText(label, lx, ly);
        }
      }

      // Lane labels and junction nodes appear as the architecture emerges.
      const laneA = smooth(0.45, 0.9, order);
      if (laneA > 0.01) {
        ctx.textAlign = "right";
        for (let l = 0; l < LANES.length; l++) {
          const y = laneTop + l * laneGap - (perLane / 2) * slotGap - 10;
          ctx.fillStyle = `rgba(255,255,255,${laneA * 0.75})`;
          ctx.fillText(`L${l + 1} · ${LANES[l].toUpperCase()}`, w - (mobile ? 16 : 40), y);
          const jx = w * (0.28 + l * 0.018) + w * 0.05;
          ctx.fillStyle = `rgba(205,23,23,${laneA})`;
          ctx.fillRect(jx - 3, laneTop + l * laneGap - 3, 6, 6);
        }
      }

      // The comb reticle.
      if (combPower > 0 && combX > -999) {
        const a = idle ? 0.35 : 0.95;
        const len = CR * 0.7;
        ctx.strokeStyle = `rgba(205,23,23,${a})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(combX, combY - len);
        ctx.lineTo(combX, combY + len);
        for (let y = -len; y <= len; y += 9) {
          ctx.moveTo(combX, combY + y);
          ctx.lineTo(combX - 9, combY + y);
        }
        ctx.stroke();
        ctx.strokeStyle = `rgba(255,255,255,${a * 0.18})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(combX - CR, combY - CR, CR * 2, CR * 2);
        ctx.fillStyle = `rgba(255,255,255,${a * 0.7})`;
        ctx.textAlign = "left";
        ctx.fillText(idle ? "AUTO-COMB" : "COMB", combX + 8, combY - len);
      }
    };

    const loop = (now: number) => {
      frame(now, true);
      pointer.vx *= 0.85;
      pointer.vy *= 0.85;
      raf = requestAnimationFrame(loop);
    };
    const play = () => {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const sync = () => (visible && !document.hidden ? play() : pause());

    const onMove = (cx: number, cy: number) => {
      const r = canvas.getBoundingClientRect();
      const x = cx - r.left;
      const y = cy - r.top;
      if (pointer.x > -999) {
        pointer.vx = x - pointer.x;
        pointer.vy = y - pointer.y;
      }
      pointer.x = x;
      pointer.y = y;
      pointer.t = performance.now();
      pointer.inside = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
    };
    const onPointer = (e: PointerEvent) => onMove(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) onMove(t.clientX, t.clientY);
    };
    const onScroll = () => {
      readScroll();
      if (reduce) frame(performance.now(), false);
    };

    resize();
    readScroll();
    if (reduce) {
      gTarget = Math.max(gTarget, 0.38);
      frame(performance.now(), false);
    }

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) frame(performance.now(), false);
    });
    ro.observe(host);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    io.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    sync();

    return () => {
      pause();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduce]);

  return (
    <div className="absolute inset-0" aria-hidden>
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />
    </div>
  );
}

/** HUD readout for the hero aside: how resolved the system currently is. */
export function TangleReadout() {
  const pct = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const state = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const id = window.setInterval(() => {
      const o = tangleState.order;
      if (pct.current) pct.current.textContent = String(Math.round(o * 100)).padStart(3, "0");
      if (bar.current) bar.current.style.transform = `scaleX(${o.toFixed(3)})`;
      if (state.current)
        state.current.textContent = o < 0.25 ? "Tangled" : o < 0.8 ? "Resolving" : "Architected";
    }, 120);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      aria-hidden
      className="max-w-md border border-white/15 bg-black/50 p-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/55 backdrop-blur-sm"
    >
      <div className="flex justify-between gap-4">
        <span>System state</span>
        <span ref={state} className="text-asymmetri-red">
          Tangled
        </span>
      </div>
      <span className="mt-2 block h-px bg-white/15">
        <span
          ref={bar}
          className="block h-full origin-left bg-asymmetri-red"
          style={{ transform: "scaleX(0)" }}
        />
      </span>
      <div className="mt-2 flex justify-between gap-4">
        <span>
          Clarity <span ref={pct} className="text-white">000</span>%
        </span>
        <span className="hidden text-white/40 md:inline">Move to comb · scroll to resolve</span>
        <span className="text-white/40 md:hidden">Scroll to resolve</span>
      </div>
    </div>
  );
}
