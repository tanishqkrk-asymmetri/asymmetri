/**
 * The "How we operate" type field: a grid of monospace glyphs drawn on a
 * canvas from a glyph atlas. Each figure is a density function over the grid
 * (0 = blank, 1 = "@"); a scroll-driven morph decodes one figure into the next
 * cell by cell, radiating from the centre through a band of scrambled glyphs,
 * a nod to Tim Holman's AsciiMorph (lib/asciiMorph.js) that started it.
 *
 * Figures: 0 the Asymmetri mark (lib/art.js logoMain), 1 a rotating torus
 * knot that keeps re-forming, 2 a damped signal converging on its target,
 * 3 a lattice of the logo's double slash flexing under a travelling wave.
 *
 * The chapter arrives on pure black (Domains hands over #000) and the field
 * boots out of it: cells decode from the centre outwards as the section enters.
 */
import { logoMain } from "@/lib/art";

export const RAMP = " .:-=+*#%@";
const GLYPHS = RAMP + "01/\\";
const GI: Record<string, number> = {};
[...GLYPHS].forEach((g, i) => (GI[g] = i));
const SCRAMBLE = "+*/\\#%=";
// Tone rows in the atlas: 0 dim white, 1 white, 2 red.
const TONES = ["rgba(255,255,255,0.4)", "#ffffff", "#cd1717"];

export const FIGURES = 4;

type Rect = { x: number; y: number; w: number; h: number };
type Ripple = { x: number; y: number; t0: number };

const KNOTS: [number, number][] = [
  [2, 3],
  [3, 5],
  [2, 5],
  [3, 7],
  [3, 4],
  [5, 3],
];
const KNOT_HOLD = 3.2;
const KNOT_MORPH = 1.4;
const KNOT_N = 2200;
const GHOST = [1, 0.5, 0.26];

const hash = (n: number) => {
  const s = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return s - Math.floor(s);
};
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (t: number) => t * t * (3 - 2 * t);

/** logoMain → density bitmap, with the thin bar of the double slash marked red. */
function buildLogo() {
  const lines = (logoMain as string[]).map((l) => l.replace(/\s+$/, ""));
  while (lines.length && !lines[0].trim()) lines.shift();
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
  const lead = Math.min(...lines.filter((l) => l.trim()).map((l) => l.search(/\S/)));
  const rows = lines.map((l) => l.slice(lead));
  const w = Math.max(...rows.map((l) => l.length));
  const h = rows.length;
  const dens = new Float32Array(w * h);
  const acc = new Uint8Array(w * h);
  const map: Record<string, number> = { "@": 1, "%": 0.9, "#": 0.85, "*": 0.75, "+": 0.7, "=": 0.65, ":": 0.45, ".": 0.35 };
  rows.forEach((row, j) => {
    const gap = row.indexOf("--@");
    for (let i = 0; i < row.length; i++) {
      const c = row[i];
      if (c === " " || c === "-") continue;
      dens[j * w + i] = map[c] ?? 0.8;
      if (gap >= 0 && i > gap + 1) acc[j * w + i] = 1;
    }
  });
  return { dens, acc, w, h };
}
const LOGO = buildLogo();

export class AsciiField {
  private ctx: CanvasRenderingContext2D;
  private atlas: HTMLCanvasElement;
  private dpr = 1;
  private W = 0;
  private H = 0;
  private rect: Rect = { x: 0, y: 0, w: 0, h: 0 };
  private cw = 7;
  private ch = 12;
  private cols = 0;
  private rows = 0;
  private S = 1;
  private U = new Float32Array(0);
  private V = new Float32Array(0);
  private hA = new Float32Array(0);
  private hB = new Float32Array(0);
  private dA = new Float32Array(0);
  private aA = new Uint8Array(0);
  private dB = new Float32Array(0);
  private aB = new Uint8Array(0);
  private logoD = new Float32Array(0);
  private logoA = new Uint8Array(0);
  private ripples: Ripple[] = [];
  private pointer = { x: 0, y: 0, on: false };
  private font = "monospace";
  /** Label of the figure being drawn (for the HUD); changes rarely. */
  label = "";

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d")!;
    this.atlas = document.createElement("canvas");
  }

  get cells() {
    return this.cols * this.rows;
  }

  /** Stage size, the figure's rect inside it (css px) and the glyph size. */
  resize(W: number, H: number, rect: Rect, fontPx: number) {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.W = W;
    this.H = H;
    this.rect = rect;
    this.font = getComputedStyle(this.canvas).fontFamily || "monospace";
    this.canvas.width = Math.round(W * this.dpr);
    this.canvas.height = Math.round(H * this.dpr);
    this.ctx.font = `${fontPx}px ${this.font}`;
    this.cw = Math.max(4, this.ctx.measureText("@").width);
    this.ch = Math.round(fontPx * 1.2);
    this.buildAtlas(fontPx);

    this.cols = Math.max(1, Math.floor(rect.w / this.cw));
    this.rows = Math.max(1, Math.floor(rect.h / this.ch));
    const n = this.cols * this.rows;
    this.S = Math.min(this.cols * this.cw, this.rows * this.ch) / 2;
    this.U = new Float32Array(n);
    this.V = new Float32Array(n);
    this.hA = new Float32Array(n);
    this.hB = new Float32Array(n);
    this.dA = new Float32Array(n);
    this.dB = new Float32Array(n);
    this.aA = new Uint8Array(n);
    this.aB = new Uint8Array(n);
    this.logoD = new Float32Array(n);
    this.logoA = new Uint8Array(n);
    const gw = this.cols * this.cw;
    const gh = this.rows * this.ch;
    const maxR = Math.hypot(gw, gh) / 2;
    // Fit the logo bitmap (both are monospace, so char units map 1:1).
    const s = Math.min((this.cols * 0.84) / LOGO.w, (this.rows * 0.78) / LOGO.h);
    for (let j = 0; j < this.rows; j++) {
      for (let i = 0; i < this.cols; i++) {
        const k = j * this.cols + i;
        const x = (i + 0.5) * this.cw - gw / 2;
        const y = (j + 0.5) * this.ch - gh / 2;
        this.U[k] = x / this.S;
        this.V[k] = y / this.S;
        this.hA[k] = hash(k + 1);
        this.hB[k] = 0.5 * hash(k * 7.13 + 3) + 0.5 * (Math.hypot(x, y) / maxR);
        const bx = Math.floor((i - this.cols / 2) / s + LOGO.w / 2);
        const by = Math.floor((j - this.rows / 2) / s + LOGO.h / 2);
        if (bx >= 0 && bx < LOGO.w && by >= 0 && by < LOGO.h) {
          this.logoD[k] = LOGO.dens[by * LOGO.w + bx];
          this.logoA[k] = LOGO.acc[by * LOGO.w + bx];
        }
      }
    }
  }

  private buildAtlas(fontPx: number) {
    const d = this.dpr;
    const a = this.atlas;
    a.width = Math.ceil(this.cw * d) * GLYPHS.length;
    a.height = Math.ceil(this.ch * d) * TONES.length;
    const c = a.getContext("2d")!;
    c.clearRect(0, 0, a.width, a.height);
    c.font = `${fontPx * d}px ${this.font}`;
    c.textBaseline = "middle";
    const cwd = Math.ceil(this.cw * d);
    const chd = Math.ceil(this.ch * d);
    TONES.forEach((tone, r) => {
      c.fillStyle = tone;
      [...GLYPHS].forEach((g, i) => c.fillText(g, i * cwd, r * chd + chd / 2));
    });
  }

  setPointer(x: number, y: number, on: boolean) {
    this.pointer.x = x - this.rect.x;
    this.pointer.y = y - this.rect.y;
    this.pointer.on = on;
  }

  pulse(x: number, y: number, t: number) {
    this.ripples.push({ x: x - this.rect.x, y: y - this.rect.y, t0: t });
    if (this.ripples.length > 4) this.ripples.shift();
  }

  /* ---------- figures: write density (0..1) and accent into d / a ---------- */

  private figure(id: number, d: Float32Array, a: Uint8Array, t: number) {
    d.fill(0);
    a.fill(0);
    if (id === 0) this.figLogo(d, a, t);
    else if (id === 1) this.figKnot(d, a, t);
    else if (id === 2) this.figSignal(d, a, t);
    else this.figLattice(d, a, t);
  }

  private figLogo(d: Float32Array, a: Uint8Array, t: number) {
    const scan = ((t * 0.3) % 1.8) - 0.9;
    for (let k = 0; k < d.length; k++) {
      const base = this.logoD[k];
      if (!base) continue;
      const v = this.V[k] / 1.2;
      const glow = Math.max(0, 1 - Math.abs(v - scan) * 9);
      const shimmer = 0.82 + 0.18 * Math.sin(t * 1.7 + this.U[k] * 5 - this.V[k] * 3);
      d[k] = Math.min(1, base * shimmer + glow * 0.5);
      a[k] = this.logoA[k];
    }
    this.label = "Fig 00 · The mark";
  }

  private knotPoint(p: number, q: number, s: number, out: number[]) {
    const r = 2 + Math.cos(q * s);
    out[0] = (r * Math.cos(p * s)) / 3.2;
    out[1] = (r * Math.sin(p * s)) / 3.2;
    out[2] = -Math.sin(q * s) / 3.2;
  }

  private figKnot(d: Float32Array, a: Uint8Array, t: number) {
    const cycle = KNOT_HOLD + KNOT_MORPH;
    const tt = Math.max(t, 0);
    const n = Math.floor(tt / cycle);
    const local = tt - n * cycle;
    const k0 = KNOTS[n % KNOTS.length];
    const k1 = KNOTS[(n + 1) % KNOTS.length];
    const m = local < KNOT_HOLD ? 0 : smooth((local - KNOT_HOLD) / KNOT_MORPH);
    this.label = m > 0.5 ? `Fig 01 · Knot (${k1[0]},${k1[1]})` : `Fig 01 · Knot (${k0[0]},${k0[1]})`;

    const ay = t * 0.45;
    const ax = 0.5 + Math.sin(t * 0.3) * 0.4;
    const cy = Math.cos(ay), sy = Math.sin(ay), cx = Math.cos(ax), sx = Math.sin(ax);
    const gw = this.cols * this.cw;
    const gh = this.rows * this.ch;
    const S = this.S * 0.74;
    const rx = Math.max(1, Math.round((S * 0.05) / this.cw));
    const ry = Math.max(1, Math.round((S * 0.05) / this.ch));
    const pen = (t * 0.5) % (Math.PI * 2);
    const A = [0, 0, 0];
    const B = [0, 0, 0];
    for (let i = 0; i < KNOT_N; i++) {
      const s = (i / KNOT_N) * Math.PI * 2;
      this.knotPoint(k0[0], k0[1], s, A);
      if (m > 0) {
        this.knotPoint(k1[0], k1[1], s, B);
        A[0] += (B[0] - A[0]) * m;
        A[1] += (B[1] - A[1]) * m;
        A[2] += (B[2] - A[2]) * m;
      }
      // rotate about y, then x
      const x1 = A[0] * cy + A[2] * sy;
      const z1 = -A[0] * sy + A[2] * cy;
      const y2 = A[1] * cx - z1 * sx;
      const z2 = A[1] * sx + z1 * cx;
      const f = 2.4 / (2.4 - z2);
      const ci = Math.round((x1 * f * S + gw / 2) / this.cw - 0.5);
      const cj = Math.round((y2 * f * S + gh / 2) / this.ch - 0.5);
      const shade = 0.22 + 0.78 * clamp01((z2 + 0.4) / 0.8);
      let ds = Math.abs(s - pen);
      ds = Math.min(ds, Math.PI * 2 - ds);
      const lit = ds < 0.32 ? 1 : 0;
      for (let oy = -ry; oy <= ry; oy++) {
        const jj = cj + oy;
        if (jj < 0 || jj >= this.rows) continue;
        for (let ox = -rx; ox <= rx; ox++) {
          const ii = ci + ox;
          if (ii < 0 || ii >= this.cols) continue;
          const r = Math.hypot(ox / (rx + 0.5), oy / (ry + 0.5));
          if (r > 1) continue;
          const v = shade * (1 - r * 0.55);
          const k = jj * this.cols + ii;
          if (v > d[k]) {
            d[k] = v;
            a[k] = lit;
          }
        }
      }
    }
  }

  private figSignal(d: Float32Array, a: Uint8Array, t: number) {
    this.label = "Fig 02 · Damped loop";
    const cols = this.cols;
    const rows = this.rows;
    const W = 7 * Math.PI;
    const speed = 3.2;
    const amp = (x: number) => 0.72 * Math.exp(-3.1 * x);
    const trace = (x: number, tt: number) => amp(x) * Math.sin(x * W - tt * speed);
    const midY = (rows * this.ch) / 2;
    const toRow = (y: number) => Math.round((y * this.S + midY) / this.ch - 0.5);
    // Target line, dashed.
    const cz = toRow(0);
    for (let i = 0; i < cols; i++) if (i % 3 !== 2 && cz >= 0 && cz < rows) d[cz * cols + i] = 0.34;
    // Main trace plus two fading persistence ghosts, like a scope: splat a
    // small brush along each curve so steep slopes stay one stroke wide.
    const samples = cols * 5;
    for (let n = 2; n >= 0; n--) {
      const w = GHOST[n];
      const tt = t - n * 0.18;
      for (let sI = 0; sI <= samples; sI++) {
        const x = sI / samples;
        const ci = Math.round(x * (cols - 1));
        const cj = toRow(trace(x, tt));
        for (let oy = -1; oy <= 1; oy++) {
          const jj = cj + oy;
          if (jj < 0 || jj >= rows) continue;
          const k = jj * cols + ci;
          const v = w * (oy === 0 ? 1 : 0.55);
          if (v > d[k]) d[k] = v;
        }
      }
    }
    // Measurement nodes on each peak, with error bars back to the target.
    const kMin = Math.ceil((-Math.PI / 2 - t * speed) / Math.PI);
    for (let kk = kMin; ; kk++) {
      const x = (Math.PI / 2 + kk * Math.PI + t * speed) / W;
      if (x > 1) break;
      if (x < 0) continue;
      const y = trace(x, t);
      const ci = Math.round(x * (cols - 1));
      const cj = toRow(y);
      const lo = Math.min(cj, cz);
      const hi = Math.max(cj, cz);
      for (let j = lo; j <= hi; j++) {
        if (j < 0 || j >= rows || ci < 0 || ci >= cols) continue;
        const k = j * cols + ci;
        if (j % 2 === 0) d[k] = Math.max(d[k], 0.4);
      }
      for (let oy = -1; oy <= 1; oy++)
        for (let ox = -1; ox <= 1; ox++) {
          const ii = ci + ox;
          const jj = cj + oy;
          if (ii < 0 || ii >= cols || jj < 0 || jj >= rows) continue;
          const k = jj * cols + ii;
          d[k] = 1;
          a[k] = 1;
        }
    }
  }

  private figLattice(d: Float32Array, a: Uint8Array, t: number) {
    this.label = "Fig 03 · One module, repeated";
    const tile = Math.max(this.S * 0.38, 44);
    const gw = this.cols * this.cw;
    const gh = this.rows * this.ch;
    const ox = (gw % tile) / 2;
    const oy = (gh % tile) / 2;
    const SK = 0.4877; // tan(26deg), the logo's skew
    const hot = Math.floor(t * 0.8);
    for (let j = 0; j < this.rows; j++) {
      for (let i = 0; i < this.cols; i++) {
        const k = j * this.cols + i;
        const x = (i + 0.5) * this.cw - ox;
        const y = (j + 0.5) * this.ch - oy;
        const tx = Math.floor(x / tile);
        const ty = Math.floor(y / tile);
        let lx = x / tile - tx - 0.5;
        let ly = y / tile - ty - 0.5;
        if (Math.abs(lx) > 0.47 || Math.abs(ly) > 0.47) {
          d[k] = (i + j) % 3 === 0 ? 0.18 : 0;
          continue;
        }
        const wave = 0.5 + 0.5 * Math.sin(t * 1.9 - (tx * 0.9 + ty * 0.65));
        const sc = 0.42 + 0.58 * wave;
        lx /= sc;
        ly /= sc;
        if (Math.abs(ly) > 0.38) continue;
        const xs = lx + ly * SK;
        const thick = Math.abs(xs + 0.09) < 0.13;
        const thin = Math.abs(xs - 0.17) < 0.045;
        if (thick) d[k] = 0.55 + 0.45 * wave * (0.75 + 0.25 * (0.5 - ly));
        else if (thin) {
          d[k] = 0.9;
          // One tile at a time takes the red: the system adapting to a domain.
          a[k] = (tx * 7 + ty * 13) % 11 === hot % 11 ? 1 : 0;
          if (!a[k]) d[k] = 0.6;
        }
      }
    }
  }

  /* ---------------------------------- draw ---------------------------------- */

  private blit(c: CanvasRenderingContext2D, g: number, tone: number, x: number, y: number) {
    const d = this.dpr;
    const cwd = Math.ceil(this.cw * d);
    const chd = Math.ceil(this.ch * d);
    c.drawImage(this.atlas, g * cwd, tone * chd, cwd, chd, x * d, y * d, cwd, chd);
  }

  /**
   * fpos: figure position 0..3 (fractions morph). enter: 0..1 arrival of the
   * section (boots the field out of black). t: seconds. still: no time-based motion.
   */
  draw(fpos: number, enter: number, t: number, still: boolean) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const f = Math.min(Math.max(fpos, 0), FIGURES - 1);
    const ia = Math.min(Math.floor(f), FIGURES - 1);
    const ib = Math.min(ia + 1, FIGURES - 1);
    let m = f - ia;
    if (still) m = m < 0.5 ? 0 : 1;
    const morphing = m > 0.001 && m < 0.999;
    this.figure(m >= 0.999 ? ib : ia, this.dA, this.aA, t);
    const labelA = this.label;
    if (morphing) this.figure(ib, this.dB, this.aB, t);
    this.label = morphing ? (m < 0.5 ? labelA : this.label) : labelA;

    const W = 0.09;
    const mm = m * (1 + 2 * W) - W;
    // Boot: while the chapter is arriving, cells beyond the front stay black
    // and the front itself is a band of decoding glyphs.
    const boot = Math.min(1, enter / 0.85);
    const booting = !still && boot < 1;
    const bt = boot * (1 + 2 * W) - W;
    const P = this.pointer;
    const R = Math.max(70, this.S * 0.32);
    const ripples = this.ripples.filter((r) => t - r.t0 < 1.6);
    this.ripples = ripples;
    const gx = this.rect.x;
    const gy = this.rect.y;
    const tick = Math.floor(t * 9);

    for (let j = 0; j < this.rows; j++) {
      for (let i = 0; i < this.cols; i++) {
        const k = j * this.cols + i;
        let dens: number;
        let acc: number;
        let g = -1;
        let tone = 1;
        if (!morphing) {
          dens = this.dA[k];
          acc = this.aA[k];
        } else {
          const h = this.hB[k];
          if (h < mm - W) {
            dens = this.dB[k];
            acc = this.aB[k];
          } else if (h > mm + W) {
            dens = this.dA[k];
            acc = this.aA[k];
          } else {
            dens = Math.max(this.dA[k], this.dB[k]);
            acc = 0;
            if (dens > 0.05 || this.hA[k] < 0.16) {
              g = GI[SCRAMBLE[(Math.random() * SCRAMBLE.length) | 0]];
              tone = this.hA[k] > 0.55 ? 2 : 1;
            }
          }
        }
        if (booting) {
          const h = this.hB[k];
          if (h > bt + W) continue;
          if (h > bt - W) {
            if (dens < 0.05 && this.hA[k] > 0.3) continue;
            g = GI[SCRAMBLE[(Math.random() * SCRAMBLE.length) | 0]];
            tone = this.hA[k] > 0.5 ? 2 : 1;
          }
        }
        const cx = (i + 0.5) * this.cw;
        const cy = (j + 0.5) * this.ch;
        let px = gx + i * this.cw;
        let py = gy + j * this.ch;

        if (!still && P.on) {
          const dx = cx - P.x;
          const dy = cy - P.y;
          const dist = Math.hypot(dx, dy);
          if (dist < R) {
            const fz = 1 - dist / R;
            if (dens > 0.06) {
              // Under the cursor the figure reads as the system underneath it.
              g = GI[(((this.hA[k] * 10) | 0) + tick) % 2 ? "1" : "0"];
              tone = fz > 0.4 ? 2 : 1;
            } else if (fz > 0.3 && this.hA[k] < 0.18) {
              g = GI["."];
              tone = 2;
            }
            const push = fz * fz * 9;
            if (dist > 0.01) {
              px += (dx / dist) * push;
              py += (dy / dist) * push;
            }
          }
        }
        if (!still) {
          for (const r of ripples) {
            const age = t - r.t0;
            const rr = age * 520;
            const dist = Math.hypot(cx - r.x, cy - r.y);
            if (Math.abs(dist - rr) < 13 && this.hA[k] < 1 - age * 0.55) {
              g = GI[dens > 0.06 ? "@" : "+"];
              tone = 2;
            }
          }
        }

        if (g < 0) {
          if (dens < 0.06) continue;
          g = Math.min(9, Math.max(1, Math.round(dens * 9)));
          tone = acc ? 2 : dens < 0.42 ? 0 : 1;
        }
        this.blit(ctx, g, tone, px, py);
      }
    }
  }
}
