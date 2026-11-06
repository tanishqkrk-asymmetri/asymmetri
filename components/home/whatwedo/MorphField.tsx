"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { buildPoses, mulberry32, type Pointer, type Pose } from "./fieldStates";

const RED = "#cd1717";

/**
 * One field of square particles that re-forms into each practice's signature.
 * Particles chase the active pose with their own rate and a left-to-right
 * delay, so a change of practice sweeps across the field; the old pose's
 * hairlines stretch and fade while the new one's draw in.
 */
export function MorphField({ index, className }: { index: number; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const target = useRef(index);
  const kick = useRef<() => void>(() => {});

  useEffect(() => {
    target.current = index;
    kick.current();
  }, [index]);

  useEffect(() => {
    const host = wrap.current;
    const el = canvas.current;
    if (!host || !el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let N = 0;
    let poses: Pose[] = [];
    let pos = new Float32Array(0);
    let tgt: Float32Array[] = [];
    let heats: Float32Array[] = [];
    let follow = new Uint8Array(0);
    let switchAt = new Float32Array(0);
    let rate = new Float32Array(0);
    let jitter = new Float32Array(0);
    const weight = [1, 0, 0, 0];
    let current = target.current;
    const ptr: Pointer = { x: 0, y: 0, on: false };
    const start = performance.now();
    let last = start;
    let raf = 0;
    let onScreen = false;
    let booted = false;

    const resize = () => {
      const r = host.getBoundingClientRect();
      if (r.width < 10 || r.height < 10) return;
      W = r.width;
      H = r.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = Math.round(W * dpr);
      el.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const nextN = W < 640 ? 150 : 216;
      poses = buildPoses(nextN, W, H);
      tgt = poses.map(() => new Float32Array(nextN * 2));
      heats = poses.map(() => new Float32Array(nextN));
      if (nextN !== N) {
        N = nextN;
        const rnd = mulberry32(5);
        pos = new Float32Array(N * 2);
        follow = new Uint8Array(N).fill(current);
        switchAt = new Float32Array(N);
        rate = Float32Array.from({ length: N }, () => 2.2 + rnd() * 3.6);
        jitter = Float32Array.from({ length: N }, () => rnd());
        booted = false;
      }
    };

    const frame = (now: number, still = false) => {
      const t = (now - start) / 1000;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!N) return;

      // A new practice: every particle switches after its own delay.
      if (target.current !== current) {
        current = target.current;
        for (let i = 0; i < N; i++) {
          switchAt[i] = t + 0.02 + (pos[i * 2] / Math.max(W, 1)) * 0.38 + jitter[i] * 0.14;
        }
      }
      const used = [false, false, false, false];
      for (let i = 0; i < N; i++) {
        if (follow[i] !== current && t >= switchAt[i]) follow[i] = current;
        used[follow[i]] = true;
      }
      used[current] = true;
      for (let s = 0; s < 4; s++) {
        if (used[s] || weight[s] > 0.01) poses[s].targets(t, tgt[s], heats[s], ptr);
      }

      if (!booted || still) {
        // First frame: rise in from a single point, so the field assembles.
        for (let i = 0; i < N; i++) {
          follow[i] = current;
          pos[i * 2] = still ? tgt[current][i * 2] : W * 0.5;
          pos[i * 2 + 1] = still ? tgt[current][i * 2 + 1] : H * 0.5;
        }
        for (let s = 0; s < 4; s++) weight[s] = s === current ? (still ? 1 : 0) : 0;
        booted = true;
      }

      for (let i = 0; i < N; i++) {
        const s = follow[i];
        const k = 1 - Math.exp(-dt * rate[i]);
        pos[i * 2] += (tgt[s][i * 2] - pos[i * 2]) * k;
        pos[i * 2 + 1] += (tgt[s][i * 2 + 1] - pos[i * 2 + 1]) * k;
      }
      for (let s = 0; s < 4; s++) {
        const goal = s === current ? 1 : 0;
        weight[s] += (goal - weight[s]) * (1 - Math.exp(-dt * (goal ? 2.2 : 4)));
      }

      ctx.clearRect(0, 0, W, H);

      // Hairlines of every pose still visible.
      ctx.lineWidth = 1;
      for (let s = 0; s < 4; s++) {
        const a = weight[s];
        if (a < 0.01) continue;
        const L = poses[s].lines;
        ctx.strokeStyle = `rgba(0,0,0,${poses[s].ink * a})`;
        ctx.beginPath();
        for (let j = 0; j < L.length; j += 2) {
          const p = L[j];
          const q = L[j + 1];
          ctx.moveTo(pos[p * 2], pos[p * 2 + 1]);
          ctx.lineTo(pos[q * 2], pos[q * 2 + 1]);
        }
        ctx.stroke();
        // Red hairlines between hot particles.
        const h = heats[s];
        ctx.strokeStyle = `rgba(205,23,23,${0.75 * a})`;
        ctx.beginPath();
        for (let j = 0; j < L.length; j += 2) {
          const p = L[j];
          const q = L[j + 1];
          if (!h[p] || !h[q] || follow[p] !== s || follow[q] !== s) continue;
          ctx.moveTo(pos[p * 2], pos[p * 2 + 1]);
          ctx.lineTo(pos[q * 2], pos[q * 2 + 1]);
        }
        ctx.stroke();
      }
      for (let s = 0; s < 4; s++) {
        if (weight[s] > 0.02) poses[s].overlay(ctx, t, pos, weight[s] * weight[s], ptr);
      }

      // Particles: black, hot ones red.
      for (const red of [false, true]) {
        ctx.fillStyle = red ? RED : "rgba(0,0,0,0.88)";
        for (let i = 0; i < N; i++) {
          const s = follow[i];
          if (!!heats[s][i] !== red) continue;
          const z = 3.2 * poses[s].size[i];
          ctx.fillRect(pos[i * 2] - z / 2, pos[i * 2 + 1] - z / 2, z, z);
        }
      }
    };

    const loop = (now: number) => {
      raf = 0;
      frame(now);
      if (onScreen && document.visibilityState === "visible") raf = requestAnimationFrame(loop);
    };
    const play = () => {
      if (reduce) {
        frame(performance.now(), true);
        return;
      }
      if (!raf && onScreen && document.visibilityState === "visible") {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    kick.current = play;

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) frame(performance.now(), true);
    });
    ro.observe(host);
    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
        play();
      },
      { rootMargin: "80px" },
    );
    io.observe(host);
    document.addEventListener("visibilitychange", play);

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ptr.x = e.clientX - r.left;
      ptr.y = e.clientY - r.top;
      ptr.on = e.pointerType !== "touch";
    };
    const leave = () => (ptr.on = false);
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    if (reduce) frame(performance.now(), true);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", play);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      kick.current = () => {};
    };
  }, [reduce]);

  return (
    <div ref={wrap} className={className} aria-hidden>
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
