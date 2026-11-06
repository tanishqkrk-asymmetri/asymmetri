/**
 * The four poses of the "What we do" particle field. Every pose places the
 * same N particles, so the field can morph from one practice's signature to
 * another's: an agent mesh, code compiling into an interface, a tangle being
 * combed into lanes, and an interference field.
 *
 * Poses are built in CSS pixels for a given canvas size; `targets()` writes
 * time-varying positions, `heat` marks particles drawn in red.
 */

export type Pointer = { x: number; y: number; on: boolean };

export type Pose = {
  /** Writes this pose's target position for every particle at time t (s). */
  targets(t: number, out: Float32Array, heat: Float32Array, ptr: Pointer): void;
  /** Index pairs drawn as hairlines between particles. */
  lines: Uint16Array;
  /** Particle size multiplier. */
  size: Float32Array;
  /** Hairline opacity for this pose. */
  ink: number;
  /** Pose-specific marks (labels, packets, comb, emitters), drawn at alpha a. */
  overlay(ctx: CanvasRenderingContext2D, t: number, pos: Float32Array, a: number, ptr: Pointer): void;
};

const RED = "205,23,23";
const MONO = "10px ui-monospace, SFMono-Regular, Menlo, monospace";

export function mulberry32(a: number) {
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

/* ── 01 · Agent mesh ─────────────────────────────────────────────────── */

const AGENTS = ["PLANNER", "RETRIEVER", "CRITIC", "EXECUTOR", "MEMORY", "TOOL"];
const AGENT_AT: [number, number][] = [
  [0.14, 0.22],
  [0.42, 0.12],
  [0.7, 0.3],
  [0.86, 0.68],
  [0.5, 0.62],
  [0.2, 0.8],
];

function mesh(N: number, W: number, H: number): Pose {
  const rnd = mulberry32(11);
  const pad = Math.min(W, H) * 0.08;
  const cols = Math.max(4, Math.round(Math.sqrt((N * W) / H)));
  let rows = Math.ceil(N / cols);
  while (cols * rows < N * 1.12) rows++;
  const cells = Array.from({ length: cols * rows }, (_, i) => i);
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }
  const cw = (W - pad * 2) / cols;
  const ch = (H - pad * 2) / rows;
  const hx = new Float32Array(N);
  const hy = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const c = cells[i] % cols;
    const r = Math.floor(cells[i] / cols);
    hx[i] = pad + (c + 0.5 + (rnd() - 0.5) * 0.8) * cw;
    hy[i] = pad + (r + 0.5 + (rnd() - 0.5) * 0.8) * ch;
  }

  // Up to three nearest neighbours each, deduplicated, never long hops.
  const seen = new Set<number>();
  const pairs: number[] = [];
  const reach = (cw * cw + ch * ch) * 1.6;
  for (let i = 0; i < N; i++) {
    const near: [number, number][] = [];
    for (let j = 0; j < N; j++) {
      if (j === i) continue;
      const d = (hx[i] - hx[j]) ** 2 + (hy[i] - hy[j]) ** 2;
      if (d > reach) continue;
      near.push([d, j]);
    }
    near.sort((a, b) => a[0] - b[0]);
    for (const [, j] of near.slice(0, 3)) {
      const k = Math.min(i, j) * 4096 + Math.max(i, j);
      if (seen.has(k)) continue;
      seen.add(k);
      pairs.push(i, j);
    }
  }

  // Named agents: the particle nearest each anchor.
  const agents = AGENT_AT.map(([fx, fy]) => {
    let best = 0;
    let bd = Infinity;
    for (let i = 0; i < N; i++) {
      const d = (hx[i] - fx * W) ** 2 + (hy[i] - fy * H) ** 2;
      if (d < bd) {
        bd = d;
        best = i;
      }
    }
    return best;
  });
  const size = new Float32Array(N).fill(1);
  agents.forEach((i) => (size[i] = 2.6));
  const isAgent = new Uint8Array(N);
  agents.forEach((i) => (isAgent[i] = 1));
  const phase = Float32Array.from({ length: N }, () => rnd() * Math.PI * 2);

  return {
    lines: Uint16Array.from(pairs),
    size,
    ink: 0.2,
    targets(t, out, heat, ptr) {
      for (let i = 0; i < N; i++) {
        let x = hx[i] + Math.sin(t * 0.6 + phase[i]) * 4;
        let y = hy[i] + Math.cos(t * 0.5 + phase[i] * 1.3) * 4;
        let h = isAgent[i] ? 1 : 0;
        if (ptr.on) {
          // Nodes near the cursor are drawn in and lit.
          const dx = ptr.x - x;
          const dy = ptr.y - y;
          const d = Math.sqrt(dx * dx + dy * dy);
          const f = 1 - smooth(0, 150, d);
          x += dx * f * 0.25;
          y += dy * f * 0.25;
          h = Math.max(h, f > 0.35 ? 1 : 0);
        }
        out[i * 2] = x;
        out[i * 2 + 1] = y;
        heat[i] = h;
      }
    },
    overlay(ctx, t, pos, a) {
      // Critical path through the agents, with packets riding it.
      ctx.strokeStyle = `rgba(${RED},${0.85 * a})`;
      ctx.lineWidth = 1.25;
      ctx.setLineDash([6, 4]);
      ctx.lineDashOffset = -t * 24;
      ctx.beginPath();
      agents.forEach((i, k) => {
        if (k === 0) ctx.moveTo(pos[i * 2], pos[i * 2 + 1]);
        else ctx.lineTo(pos[i * 2], pos[i * 2 + 1]);
      });
      ctx.stroke();
      ctx.setLineDash([]);
      const segs = agents.length - 1;
      ctx.fillStyle = `rgba(${RED},${a})`;
      for (let k = 0; k < 3; k++) {
        const u = ((t * 0.12 + k / 3) % 1) * segs;
        const s = Math.floor(u);
        const f = u - s;
        const i0 = agents[s];
        const i1 = agents[s + 1];
        const x = pos[i0 * 2] + (pos[i1 * 2] - pos[i0 * 2]) * f;
        const y = pos[i0 * 2 + 1] + (pos[i1 * 2 + 1] - pos[i0 * 2 + 1]) * f;
        ctx.fillRect(x - 3.5, y - 3.5, 7, 7);
      }
      ctx.font = MONO;
      ctx.fillStyle = `rgba(0,0,0,${0.7 * a})`;
      agents.forEach((i, k) => {
        const x = pos[i * 2];
        const y = pos[i * 2 + 1];
        const right = x < W * 0.75;
        ctx.textAlign = right ? "left" : "right";
        ctx.fillText(AGENTS[k], x + (right ? 10 : -10), y - 8);
      });
      ctx.textAlign = "left";
    },
  };
}

/* ── 02 · Code compiling into UI ─────────────────────────────────────── */

type Rect = [number, number, number, number];

const UI: Rect[] = [
  [0, 0, 1, 1], // frame
  [0.05, 0.13, 0.9, 0.07], // nav
  [0.05, 0.25, 0.58, 0.2], // hero
  [0.67, 0.25, 0.28, 0.2], // side
  [0.05, 0.5, 0.28, 0.13], // stat
  [0.36, 0.5, 0.28, 0.13], // stat
  [0.67, 0.5, 0.28, 0.13], // stat
  [0.05, 0.68, 0.9, 0.19], // chart
  [0.69, 0.9, 0.26, 0.06], // button
];
// Indentation and token widths (fractions of the code column) per line.
const CODE: [number, number[]][] = [
  [0, [0.18, 0.36, 0.2]],
  [0, []],
  [0, [0.2, 0.3, 0.16]],
  [1, [0.22]],
  [2, [0.16, 0.3]],
  [3, [0.14, 0.34]],
  [3, [0.14, 0.24, 0.18]],
  [3, [0.12, 0.3]],
  [3, [0.18, 0.28]],
  [3, [0.18, 0.26]],
  [2, [0.18]],
  [1, [0.1]],
  [0, [0.04]],
];
// Which UI rect lights while each code line "compiles".
const LINE_TO_RECT = [-1, -1, -1, -1, -1, 1, 2, 4, 7, 8, -1, -1, -1];

function build(N: number, W: number, H: number): Pose {
  const wide = W / H > 0.9 && W > 560;
  const code: Rect = wide
    ? [W * 0.05, H * 0.14, W * 0.34, H * 0.72]
    : [W * 0.06, H * 0.16, W * 0.88, H * 0.24];
  const ui: Rect = wide
    ? [W * 0.44, H * 0.08, W * 0.51, H * 0.84]
    : [W * 0.06, H * 0.44, W * 0.88, H * 0.5];
  const tx = new Float32Array(N);
  const ty = new Float32Array(N);
  const size = new Float32Array(N).fill(1);
  const pairs: number[] = [];
  let n = 0;
  const put = (x: number, y: number, s = 1) => {
    if (n >= N) return -1;
    tx[n] = x;
    ty[n] = y;
    size[n] = s;
    return n++;
  };

  const rects = UI.map(([fx, fy, fw, fh]): Rect => [
    ui[0] + fx * ui[2],
    ui[1] + fy * ui[3],
    fw * ui[2],
    fh * ui[3],
  ]);
  const corners: number[][] = rects.map(([x, y, w, h]) => {
    const c = [put(x, y, 1.4), put(x + w, y, 1.4), put(x + w, y + h, 1.4), put(x, y + h, 1.4)];
    pairs.push(c[0], c[1], c[1], c[2], c[2], c[3], c[3], c[0]);
    return c;
  });
  // Title bar rule and window controls.
  const tb = ui[1] + ui[3] * 0.075;
  const t0 = put(ui[0], tb);
  const t1 = put(ui[0] + ui[2], tb);
  pairs.push(t0, t1);
  for (let k = 0; k < 3; k++) put(ui[0] + 12 + k * 10, ui[1] + ui[3] * 0.038, 1.2);

  // Chart bars: bottom and top particle per bar.
  const chart = rects[7];
  const bars: [number, number][] = [];
  const BARS = 9;
  for (let k = 0; k < BARS; k++) {
    const x = chart[0] + chart[2] * ((k + 0.7) / (BARS + 0.4));
    const b = put(x, chart[1] + chart[3] - 6);
    const tp = put(x, chart[1] + chart[3] * 0.4);
    pairs.push(b, tp);
    bars.push([b, tp]);
  }

  // Code tokens: two particles per token.
  const lh = code[3] / CODE.length;
  const lines: number[][] = CODE.map(([indent, toks], li) => {
    const y = code[1] + lh * (li + 0.5);
    let x = code[0] + indent * code[2] * 0.06;
    const ids: number[] = [];
    for (const w of toks) {
      const a = put(x, y);
      const b = put(x + w * code[2], y);
      pairs.push(a, b);
      ids.push(a, b);
      x += w * code[2] + code[2] * 0.035;
    }
    return ids;
  });
  const lineEnd = CODE.map(([indent, toks]) => {
    const total = toks.reduce((s, w) => s + w * code[2] + code[2] * 0.035, 0);
    return code[0] + indent * code[2] * 0.06 + total;
  });

  // Whatever is left: a third dots the outlines, the rest is a dot-matrix
  // image placeholder inside the hero block.
  const perim = rects.map(([, , w, h]) => 2 * (w + h));
  const totalP = perim.reduce((s, v) => s + v, 0);
  const rest = N - n;
  const dots = Math.floor(rest * 0.35);
  let placed = 0;
  rects.forEach(([x, y, w, h], ri) => {
    const count = ri === rects.length - 1 ? dots - placed : Math.round((perim[ri] / totalP) * dots);
    for (let k = 0; k < count; k++) {
      const d = ((k + 0.5) / count) * perim[ri];
      let px: number;
      let py: number;
      if (d < w) [px, py] = [x + d, y];
      else if (d < w + h) [px, py] = [x + w, y + d - w];
      else if (d < 2 * w + h) [px, py] = [x + w - (d - w - h), y + h];
      else [px, py] = [x, y + h - (d - 2 * w - h)];
      put(px, py, 0.6);
    }
    placed += Math.max(count, 0);
  });
  const hero = rects[2];
  const fill = N - n;
  const fc = Math.max(2, Math.round(Math.sqrt((fill * hero[2]) / hero[3])));
  const fr = Math.max(1, Math.ceil(fill / fc));
  const fillStart = n;
  for (let k = 0; k < fill; k++) {
    const c = k % fc;
    const r = Math.floor(k / fc);
    put(hero[0] + hero[2] * ((c + 0.5) / fc), hero[1] + hero[3] * ((r + 0.5) / fr), 0.55);
  }
  while (n < N) put(ui[0] + ui[2] * 0.5, ui[1] + ui[3] * 0.5, 0.7);

  const LINES = CODE.length;
  const active = (t: number) => Math.floor(t * 1.5) % (LINES + 3);
  const inLine = new Int16Array(N).fill(-1);
  lines.forEach((ids, li) => ids.forEach((i) => (inLine[i] = li)));
  const inRect = new Int16Array(N).fill(-1);
  corners.forEach((ids, ri) => ids.forEach((i) => (inRect[i] = ri)));

  return {
    // N is always large enough (>= 120) that put() never runs out.
    lines: Uint16Array.from(pairs),
    size,
    ink: 0.5,
    targets(t, out, heat, ptr) {
      const al = active(t);
      const lit = al < LINES ? LINE_TO_RECT[al] : -1;
      for (let i = 0; i < N; i++) {
        let x = tx[i];
        let y = ty[i];
        // The image placeholder shimmers like a loading frame.
        if (i >= fillStart) y += Math.sin(t * 2 + x * 0.05) * 1.5;
        if (ptr.on) {
          // The cursor pushes the layout aside.
          const dx = x - ptr.x;
          const dy = y - ptr.y;
          const d = Math.sqrt(dx * dx + dy * dy) || 1;
          const f = (1 - smooth(0, 120, d)) * 28;
          x += (dx / d) * f;
          y += (dy / d) * f;
        }
        out[i * 2] = x;
        out[i * 2 + 1] = y;
        heat[i] = inLine[i] === al || (lit >= 0 && inRect[i] === lit) ? 1 : 0;
      }
      // Live bars.
      bars.forEach(([, tp], k) => {
        const v = 0.25 + 0.65 * (0.5 + 0.5 * Math.sin(t * 0.9 + k * 1.3) * Math.cos(t * 0.37 + k));
        out[tp * 2 + 1] = chart[1] + chart[3] - 6 - (chart[3] - 14) * v;
      });
    },
    overlay(ctx, t, pos, a) {
      const al = active(t);
      ctx.font = MONO;
      ctx.fillStyle = `rgba(0,0,0,${0.55 * a})`;
      ctx.fillText("Dashboard.tsx", code[0], code[1] - 14);
      ctx.fillText("localhost:3000/dashboard", ui[0] + 48, ui[1] + ui[3] * 0.05);
      // Line numbers.
      if (wide) {
        ctx.fillStyle = `rgba(0,0,0,${0.25 * a})`;
        for (let li = 0; li < LINES; li++) {
          ctx.fillText(String(li + 1).padStart(2, "0"), code[0] - 24, code[1] + lh * (li + 0.5) + 3);
        }
      }
      if (al < LINES) {
        // Fat cursor at the end of the compiling line.
        const blink = Math.floor(t * 3) % 2 === 0 ? 1 : 0.35;
        ctx.fillStyle = `rgba(${RED},${a * blink})`;
        ctx.fillRect(lineEnd[al] + 2, code[1] + lh * (al + 0.5) - 6, 6, 12);
        const ri = LINE_TO_RECT[al];
        if (ri >= 0) {
          const c = corners[ri];
          const x0 = pos[c[0] * 2];
          const y0 = pos[c[0] * 2 + 1];
          const x1 = pos[c[2] * 2];
          const y1 = pos[c[2] * 2 + 1];
          ctx.fillStyle = `rgba(${RED},${0.08 * a})`;
          ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
        }
      }
    },
  };
}

/* ── 03 · Tangle combed straight ─────────────────────────────────────── */

const LANES = ["Strategy", "Architecture", "Data", "Platform", "Delivery", "Operations"];

function map(N: number, W: number, H: number): Pose {
  const L = LANES.length;
  const pad = Math.min(W, H) * 0.07;
  const strand = new Uint8Array(N);
  const u = new Float32Array(N);
  const counts = new Array(L).fill(0);
  for (let i = 0; i < N; i++) counts[i % L]++;
  const seen = new Array(L).fill(0);
  const pairs: number[] = [];
  const last = new Array(L).fill(-1);
  // Strand-major order keeps neighbouring particles on the same strand.
  const order: number[] = [];
  for (let k = 0; k < L; k++) for (let i = 0; i < N; i++) if (i % L === k) order.push(i);
  for (const i of order) {
    const k = i % L;
    strand[i] = k;
    u[i] = seen[k] / Math.max(counts[k] - 1, 1);
    seen[k]++;
    if (last[k] >= 0) pairs.push(last[k], i);
    last[k] = i;
  }
  const laneY = (k: number) => H * (0.15 + (k * 0.7) / (L - 1));
  const size = new Float32Array(N).fill(0.9);
  const front = (t: number, ptr: Pointer) =>
    ptr.on ? ptr.x : W * (0.18 + 0.64 * (0.5 - 0.5 * Math.cos(t * 0.45)));

  return {
    lines: Uint16Array.from(pairs),
    size,
    ink: 0.4,
    targets(t, out, heat, ptr) {
      const f = front(t, ptr);
      for (let i = 0; i < N; i++) {
        const k = strand[i];
        const bx = pad + u[i] * (W - pad * 2);
        const c = smooth(f + 30, f - 90, bx);
        const s = u[i];
        const dy =
          H * 0.3 * (Math.sin(s * 7.1 + k * 1.9 + t * 0.7) * 0.6 + Math.sin(s * 13.3 - k * 0.7 + t * 1.1) * 0.4);
        const dx = W * 0.035 * Math.sin(s * 9 + k * 2.3 + t * 0.9);
        out[i * 2] = bx + dx * (1 - c);
        out[i * 2 + 1] = laneY(k) * c + (H * 0.5 + dy) * (1 - c);
        heat[i] = k === 1 || k === 4 ? 1 : 0;
      }
    },
    overlay(ctx, t, _pos, a, ptr) {
      const f = front(t, ptr);
      ctx.strokeStyle = `rgba(${RED},${a})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(f, H * 0.06);
      ctx.lineTo(f, H * 0.94);
      for (let k = 0; k < L; k++) {
        ctx.moveTo(f - 8, laneY(k));
        ctx.lineTo(f, laneY(k));
      }
      ctx.stroke();
      ctx.fillStyle = `rgba(${RED},${a})`;
      ctx.fillRect(f - 4, H * 0.06 - 4, 8, 8);
      ctx.font = MONO;
      ctx.textAlign = "left";
      for (let k = 0; k < L; k++) {
        const la = a * smooth(pad + 40, pad + 160, f);
        ctx.fillStyle = `rgba(0,0,0,${0.6 * la})`;
        ctx.fillText(LANES[k].toUpperCase(), pad, laneY(k) - 9);
      }
    },
  };
}

/* ── 04 · Interference field ─────────────────────────────────────────── */

function lab(N: number, W: number, H: number): Pose {
  const R = W < 640 ? 6 : 8;
  const C = Math.floor(N / R);
  const ring = N - R * C;
  const pad = Math.min(W, H) * 0.07;
  const pairs: number[] = [];
  const bx = new Float32Array(N);
  const by = new Float32Array(N);
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++) {
      const i = r * C + c;
      bx[i] = pad + (c / (C - 1)) * (W - pad * 2);
      by[i] = H * (0.18 + (r / (R - 1)) * 0.66);
      if (c > 0) pairs.push(i - 1, i);
    }
  const size = new Float32Array(N).fill(0.9);
  const lambda = Math.max(W, H) * 0.22;
  const k = (Math.PI * 2) / lambda;
  const w = 2.4;
  const e1 = (t: number): [number, number] => [W * 0.28, H * (0.5 + Math.sin(t * 0.21) * 0.08)];
  const e2 = (t: number, ptr: Pointer): [number, number] =>
    ptr.on ? [ptr.x, ptr.y] : [W * (0.72 + Math.sin(t * 0.3) * 0.08), H * 0.5];

  return {
    lines: Uint16Array.from(pairs),
    size,
    ink: 0.45,
    targets(t, out, heat, ptr) {
      const [ax, ay] = e1(t);
      const [cx, cy] = e2(t, ptr);
      for (let i = 0; i < R * C; i++) {
        const x = bx[i];
        const y = by[i];
        const d1 = Math.hypot(x - ax, y - ay);
        const d2 = Math.hypot(x - cx, y - cy);
        const f = (Math.sin(k * d1 - w * t) + Math.sin(k * d2 - w * t * 1.15)) / 2;
        out[i * 2] = x;
        out[i * 2 + 1] = y - f * H * 0.045;
        heat[i] = f > 0.72 ? 1 : 0;
      }
      // Leftovers orbit the fixed emitter.
      for (let j = 0; j < ring; j++) {
        const i = R * C + j;
        const ang = (j / Math.max(ring, 1)) * Math.PI * 2 + t * 0.8;
        out[i * 2] = ax + Math.cos(ang) * 16;
        out[i * 2 + 1] = ay + Math.sin(ang) * 16;
        heat[i] = 1;
      }
    },
    overlay(ctx, t, _pos, a, ptr) {
      ctx.lineWidth = 1;
      for (const [ex, ey] of [e1(t), e2(t, ptr)]) {
        for (let r = 0; r < 3; r++) {
          const rad = ((t * w) / k + r * lambda) % (lambda * 3);
          ctx.strokeStyle = `rgba(${RED},${a * 0.5 * (1 - rad / (lambda * 3))})`;
          ctx.beginPath();
          ctx.arc(ex, ey, rad, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.strokeStyle = `rgba(0,0,0,${0.7 * a})`;
        ctx.beginPath();
        ctx.moveTo(ex - 8, ey);
        ctx.lineTo(ex + 8, ey);
        ctx.moveTo(ex, ey - 8);
        ctx.lineTo(ex, ey + 8);
        ctx.stroke();
      }
      ctx.font = MONO;
      ctx.fillStyle = `rgba(0,0,0,${0.55 * a})`;
      ctx.fillText("SRC A", e1(t)[0] + 22, e1(t)[1] - 22);
      const b = e2(t, ptr);
      ctx.fillText(ptr.on ? "PROBE" : "SRC B", b[0] + 14, b[1] - 14);
    },
  };
}

export function buildPoses(N: number, W: number, H: number): Pose[] {
  return [mesh(N, W, H), build(N, W, H), map(N, W, H), lab(N, W, H)];
}
