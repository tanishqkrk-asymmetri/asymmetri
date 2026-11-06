"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useReducedMotion, type MotionValue } from "motion/react";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { dataStages } from "./content";

const RED = "205,23,23";
const STAGES = 5;
const clamp = (v: number, a = 0, b = 1) => Math.min(Math.max(v, a), b);
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Progress → continuous stage value (0..4). Each stage morphs in during the first half of its slot. */
function stageValue(p: number) {
  const seg = clamp(p, 0, 0.9999) * STAGES;
  const k = Math.floor(seg);
  if (k === 0) return 0;
  return k - 1 + ease(clamp((seg - k) / 0.5));
}

type Pose = { x: number; y: number; w: number; h: number; r: number; a: number; red: number };
type Particle = { poses: Pose[]; delay: number; phase: number; kind: number };

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const SOURCES = ["contract.pdf", "orders.csv", "kafka://events", "app.log", "crm.accounts", "policy.docx", "tickets.json"];
const TOPICS = ["billing", "contracts", "orders", "support", "policy"];
const ENTITIES = ["CUSTOMER", "CONTRACT", "ORDER", "TICKET", "POLICY"];
const EMBED_C: [number, number][] = [
  [0.18, 0.24],
  [0.55, 0.16],
  [0.84, 0.4],
  [0.32, 0.66],
  [0.7, 0.8],
];
const HUBS: [number, number][] = [
  [0.1, 0.2],
  [0.34, 0.1],
  [0.42, 0.48],
  [0.12, 0.72],
  [0.34, 0.88],
];
const HUB_EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 2],
  [2, 3],
  [2, 4],
  [3, 4],
  [0, 3],
];
// Clusters relevant to the agent's question; they flow into the context window.
const RELEVANT = new Set([1, 2]);

function DataCanvas({ p }: { p: MotionValue<number> }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let W = 0;
    let H = 0;
    let box = { x: 0, y: 0, w: 0, h: 0 };
    let parts: Particle[] = [];
    let entities: { x: number; y: number; hub: number }[] = [];
    let win = { x: 0, y: 0, w: 0, h: 0 };
    let agent = { x: 0, y: 0 };
    let raf = 0;
    let running = false;
    let visible = false;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const mobile = W < 768;
      box = mobile
        ? { x: 20, y: 92, w: W - 40, h: Math.min(H * 0.36 - 36, W * 0.9) }
        : { x: W * 0.06, y: H * 0.16, w: W * 0.84, h: H * 0.68 };
      const bx = (f: number) => box.x + f * box.w;
      const by = (f: number) => box.y + f * box.h;
      win = mobile
        ? { x: bx(0.56), y: by(0.12), w: box.w * 0.44, h: box.h * 0.7 }
        : { x: bx(0.58), y: by(0.18), w: box.w * 0.28, h: box.h * 0.64 };
      agent = mobile ? { x: bx(0.78), y: by(0.97) } : { x: bx(0.97), y: by(0.5) };

      const rand = seeded(11);
      const gauss = () => (rand() + rand() + rand() - 1.5) / 1.5;
      entities = [];
      HUBS.forEach(([hx, hy], h) => {
        for (let k = 0; k < 3; k++) {
          const ang = (k / 3) * Math.PI * 2 + h;
          const rad = Math.min(box.w, box.h) * 0.09;
          entities.push({ x: bx(hx) + Math.cos(ang) * rad, y: by(hy) + Math.sin(ang) * rad, hub: h });
        }
      });

      const n = mobile ? 110 : 180;
      const cols = mobile ? 10 : 15;
      const rows = Math.ceil(n / cols);
      const cw = mobile ? 11 : 16;
      const ch = mobile ? 6 : 9;
      const gx = mobile ? 4 : 6;
      const gridW = cols * (cw + gx);
      const gridH = rows * (ch + gx);
      let ctxSlot = 0;
      const maxRows = mobile ? 9 : 12;
      parts = [];
      for (let i = 0; i < n; i++) {
        const kind = i % 7 === 0 ? 2 : i % 3 === 0 ? 1 : 0;
        const cluster = Math.floor(rand() * 5);
        const flagged = rand() < 0.07;
        // 0 · chaos
        const chaos: Pose = {
          x: bx(rand()),
          y: by(rand()),
          w: kind === 1 ? 34 : kind === 2 ? 8 + rand() * 18 : 12 + rand() * 40,
          h: kind === 1 ? 9 : kind === 2 ? 2 : 3,
          r: (rand() - 0.5) * 1.4,
          a: 0.35 + rand() * 0.5,
          red: kind === 2 ? 1 : 0,
        };
        // 1 · cleaned chunks on a grid
        const col = i % cols;
        const row = Math.floor(i / cols);
        const chunk: Pose = {
          x: bx(0.5) - gridW / 2 + col * (cw + gx) + cw / 2,
          y: by(0.5) - gridH / 2 + row * (ch + gx) + ch / 2,
          w: cw,
          h: ch,
          r: 0,
          a: flagged ? 0.9 : 0.7,
          red: flagged ? 1 : 0,
        };
        // 2 · embedded points in vector space
        const [cx, cy] = EMBED_C[cluster];
        const embed: Pose = {
          x: bx(cx) + gauss() * box.w * 0.085,
          y: by(cy) + gauss() * box.h * 0.11,
          w: 3.5,
          h: 3.5,
          r: 0,
          a: flagged ? 0 : 0.85,
          red: 0,
        };
        // 3 · linked to an entity in the graph
        const ent = entities[cluster * 3 + Math.floor(rand() * 3)];
        const graph: Pose = {
          x: ent.x + gauss() * 9,
          y: ent.y + gauss() * 9,
          w: 2.5,
          h: 2.5,
          r: 0,
          a: flagged ? 0 : 0.55,
          red: 0,
        };
        // 4 · assembled into the context window, or left out
        let ctxPose: Pose;
        if (RELEVANT.has(cluster) && !flagged && ctxSlot < maxRows) {
          const rowH = win.h / (maxRows + 2);
          ctxPose = {
            x: win.x + win.w / 2,
            y: win.y + rowH * (ctxSlot + 1.6),
            w: win.w - 20 - ((ctxSlot * 37) % 5) * 8,
            h: Math.max(3, rowH * 0.42),
            r: 0,
            a: 0.95,
            red: ctxSlot % 4 === 1 ? 1 : 0,
          };
          ctxSlot++;
        } else ctxPose = { ...graph, a: flagged ? 0 : 0.14 };
        parts.push({ poses: [chaos, chunk, embed, graph, ctxPose], delay: rand(), phase: rand() * 6.28, kind });
      }
    };

    const mono = (size: number) => `${size}px ui-monospace, SFMono-Regular, Menlo, monospace`;

    const draw = (now: number) => {
      const st = stageValue(p.get());
      const a = Math.min(Math.floor(st), 3);
      const t = st - a;
      ctx.clearRect(0, 0, W, H);
      const o = (k: number) => clamp(1 - Math.abs(st - k) * 1.6);
      const mobile = W < 768;

      // Stage 2 · axes of the vector space.
      if (o(2) > 0) {
        ctx.strokeStyle = `rgba(255,255,255,${0.18 * o(2)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(box.x, box.y + box.h);
        ctx.lineTo(box.x + box.w, box.y + box.h);
        ctx.moveTo(box.x, box.y + box.h);
        ctx.lineTo(box.x, box.y);
        ctx.stroke();
        ctx.fillStyle = `rgba(255,255,255,${0.4 * o(2)})`;
        ctx.font = mono(10);
        ctx.fillText("dim 0", box.x + box.w - 34, box.y + box.h + 14);
        ctx.fillText("dim 1", box.x + 4, box.y - 6);
      }

      // Stage 3/4 · knowledge graph edges.
      const g = Math.max(o(3), st > 3 ? 1 : 0) * clamp((st - 2.2) / 0.8);
      if (g > 0) {
        const bx = (f: number) => box.x + f * box.w;
        const by = (f: number) => box.y + f * box.h;
        ctx.lineWidth = 1;
        for (const [i, j] of HUB_EDGES) {
          const hot = st > 3.2 && RELEVANT.has(i) && RELEVANT.has(j);
          ctx.strokeStyle = hot ? `rgba(${RED},${g})` : `rgba(255,255,255,${0.25 * g})`;
          ctx.beginPath();
          ctx.moveTo(bx(HUBS[i][0]), by(HUBS[i][1]));
          ctx.lineTo(bx(HUBS[j][0]), by(HUBS[j][1]));
          ctx.stroke();
        }
        ctx.strokeStyle = `rgba(255,255,255,${0.2 * g})`;
        for (const e of entities) {
          ctx.beginPath();
          ctx.moveTo(bx(HUBS[e.hub][0]), by(HUBS[e.hub][1]));
          ctx.lineTo(e.x, e.y);
          ctx.stroke();
          ctx.fillStyle = `rgba(255,255,255,${0.7 * g})`;
          ctx.fillRect(e.x - 2.5, e.y - 2.5, 5, 5);
        }
        ctx.font = mono(mobile ? 8 : 10);
        HUBS.forEach(([hx, hy], h) => {
          const x = bx(hx);
          const y = by(hy);
          const hot = st > 3.2 && RELEVANT.has(h);
          ctx.fillStyle = hot ? `rgba(${RED},${g})` : `rgba(0,0,0,${g})`;
          ctx.fillRect(x - 6, y - 6, 12, 12);
          ctx.strokeStyle = hot ? `rgba(${RED},${g})` : `rgba(255,255,255,${0.9 * g})`;
          ctx.strokeRect(x - 6, y - 6, 12, 12);
          ctx.fillStyle = `rgba(255,255,255,${0.85 * g})`;
          ctx.fillText(ENTITIES[h], x + 12, y + 4);
        });
      }

      // Stage 4 · context window and agent.
      const c = clamp((st - 3.1) / 0.7);
      if (c > 0) {
        ctx.fillStyle = `rgba(10,10,10,${0.9 * c})`;
        ctx.fillRect(win.x, win.y, win.w, win.h);
        ctx.strokeStyle = `rgba(255,255,255,${0.6 * c})`;
        ctx.strokeRect(win.x, win.y, win.w, win.h);
        ctx.fillStyle = `rgba(${RED},${c})`;
        ctx.fillRect(win.x, win.y, win.w, 16);
        ctx.fillStyle = `rgba(255,255,255,${c})`;
        ctx.font = mono(mobile ? 8 : 9);
        ctx.fillText(mobile ? "CONTEXT · 3.2K TOK" : "CONTEXT WINDOW · 3.2K / 128K TOK", win.x + 6, win.y + 11);
        // retrieval lines from the relevant entities into the window
        ctx.strokeStyle = `rgba(${RED},${0.6 * c})`;
        ctx.setLineDash([3, 4]);
        RELEVANT.forEach((h) => {
          ctx.beginPath();
          ctx.moveTo(box.x + HUBS[h][0] * box.w, box.y + HUBS[h][1] * box.h);
          ctx.lineTo(win.x, win.y + 24 + h * 14);
          ctx.stroke();
        });
        ctx.setLineDash([]);
        // hand-off line to the agent
        const lineT = clamp((st - 3.5) / 0.4);
        if (lineT > 0) {
          const sx = mobile ? win.x + win.w / 2 : win.x + win.w;
          const sy = mobile ? win.y + win.h : win.y + win.h / 2;
          ctx.strokeStyle = `rgba(${RED},1)`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(lerp(sx, agent.x, lineT), lerp(sy, agent.y, lineT));
          ctx.stroke();
          ctx.lineWidth = 1;
          const s = 10;
          ctx.fillStyle = `rgba(${RED},${lineT})`;
          ctx.fillRect(agent.x - s, agent.y - s, s * 2, s * 2);
          ctx.fillStyle = `rgba(255,255,255,${lineT})`;
          ctx.fillRect(agent.x - 3, agent.y - 3, 6, 6);
          ctx.font = mono(10);
          const lbl = "AGENT";
          const tw = ctx.measureText(lbl).width;
          ctx.fillText(lbl, mobile ? agent.x + 16 : agent.x - tw / 2, mobile ? agent.y + 4 : agent.y + 26);
          if (!reduce) {
            const pulse = (now / 900) % 1;
            ctx.strokeStyle = `rgba(${RED},${1 - pulse})`;
            const gs = s + pulse * 18;
            ctx.strokeRect(agent.x - gs, agent.y - gs, gs * 2, gs * 2);
          }
        }
      }

      // Particles.
      for (const pt of parts) {
        const lt = a === 0 && st === 0 ? 0 : ease(clamp((t - pt.delay * 0.35) / 0.65));
        const A = pt.poses[a];
        const B = pt.poses[Math.min(a + 1, 4)];
        let x = lerp(A.x, B.x, lt);
        let y = lerp(A.y, B.y, lt);
        const w = lerp(A.w, B.w, lt);
        const h = lerp(A.h, B.h, lt);
        const r = lerp(A.r, B.r, lt);
        const al = lerp(A.a, B.a, lt);
        const red = lerp(A.red, B.red, lt);
        if (al <= 0.01) continue;
        if (!reduce && st < 1) {
          const k = 1 - st;
          x += Math.sin(now / 1400 + pt.phase) * 6 * k;
          y += Math.cos(now / 1700 + pt.phase) * 4 * k;
        }
        const col = red > 0.5 ? `rgba(${RED},${al})` : `rgba(255,255,255,${al})`;
        if (Math.abs(r) > 0.01) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(r);
          ctx.fillStyle = col;
          ctx.fillRect(-w / 2, -h / 2, w, h);
          if (pt.kind === 1 && w > 20) {
            ctx.fillStyle = "rgba(0,0,0,0.8)";
            ctx.fillRect(-w / 2 + w / 3, -h / 2, 1, h);
            ctx.fillRect(-w / 2 + (2 * w) / 3, -h / 2, 1, h);
          }
          ctx.restore();
        } else {
          ctx.fillStyle = col;
          ctx.fillRect(x - w / 2, y - h / 2, w, h);
        }
      }

      // Stage 0 · source labels. Stage 1 · chunk spec. Stage 2 · topic labels.
      ctx.font = mono(mobile ? 9 : 10);
      if (o(0) > 0) {
        SOURCES.forEach((s, i) => {
          const pt = parts[(i * 23) % parts.length].poses[0];
          ctx.fillStyle = `rgba(255,255,255,${0.75 * o(0)})`;
          ctx.fillText(s, pt.x + 6, pt.y - 8);
          ctx.fillStyle = `rgba(${RED},${o(0)})`;
          ctx.fillRect(pt.x - 2, pt.y - 12, 4, 4);
        });
      }
      if (o(1) > 0) {
        ctx.fillStyle = `rgba(255,255,255,${0.6 * o(1)})`;
        const first = parts[0].poses[1];
        ctx.fillText("chunks · 512 tok · overlap 64 · 7% rejected", first.x - 8, first.y - 16);
      }
      if (o(2) > 0) {
        TOPICS.forEach((s, i) => {
          const [cx, cy] = EMBED_C[i];
          ctx.fillStyle = `rgba(255,255,255,${0.8 * o(2)})`;
          ctx.fillText(s, box.x + cx * box.w + 26, box.y + cy * box.h - 22);
        });
      }
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.font = mono(9);
      if (mobile) {
        ctx.textAlign = "right";
        ctx.fillText("ILLUSTRATIVE DATA", W - 20, box.y - 16);
        ctx.textAlign = "left";
      } else ctx.fillText("ILLUSTRATIVE DATA", box.x, H - 24);
    };

    const tick = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(tick);
    };
    const sync = () => {
      const want = visible && !document.hidden;
      if (want && !running) {
        running = true;
        raf = requestAnimationFrame(tick);
      } else if (!want && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };
    build();
    draw(performance.now());
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    });
    io.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    let rt = 0;
    const onResize = () => {
      clearTimeout(rt);
      rt = window.setTimeout(() => {
        build();
        draw(performance.now());
      }, 120);
    };
    window.addEventListener("resize", onResize);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      clearTimeout(rt);
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("resize", onResize);
    };
  }, [p, reduce]);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />;
}

/**
 * The "and Data" half of the practice: raw fragments are ingested, cleaned
 * and chunked, embedded into a vector space, linked into a knowledge graph
 * and assembled into a context window that is handed to an agent.
 */
export function DataFoundation() {
  const ref = useRef<HTMLElement>(null);
  const p = useSectionProgress(ref);
  const [stage, setStage] = useState(0);
  useMotionValueEvent(p, "change", (v) => {
    const k = Math.min(Math.floor(clamp(v, 0, 0.9999) * STAGES), STAGES - 1);
    setStage((s) => (s === k ? s : k));
  });

  return (
    <section
      ref={ref}
      data-chapter="Data foundation"
      className="relative h-[520vh] bg-black text-white"
    >
      <div className="heroDark sticky top-0 h-screen overflow-hidden bg-black">
        <div className="absolute inset-0 lg:left-[36%]">
          <DataCanvas p={p} />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black via-black/90 to-transparent lg:hidden" />

        <div className="relative flex h-full flex-col justify-end gap-6 px-6 pb-10 lg:w-[38%] lg:justify-center lg:pr-0 lg:pb-0 lg:pl-16">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-asymmetri-red md:text-xs">
              02 · The data foundation
            </p>
            <h2 className="mt-3 font-chakra-petch text-3xl leading-[0.95] font-bold uppercase md:text-5xl">
              Agents are only as good as <span className="text-asymmetri-red">their data.</span>
            </h2>
          </div>

          <ol className="flex gap-1.5" aria-label="Pipeline stages">
            {dataStages.map((s, i) => (
              <li key={s.key} className="flex-1">
                <span className="relative block h-[3px] bg-white/15">
                  <span
                    className={`absolute inset-0 origin-left bg-asymmetri-red transition-transform duration-500 ${i <= stage ? "scale-x-100" : "scale-x-0"}`}
                  />
                </span>
                <span
                  className={`mt-2 block font-mono text-[9px] uppercase tracking-[0.12em] transition-colors md:text-[10px] ${i === stage ? "text-white" : "text-white/35"}`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </li>
            ))}
          </ol>

          <div className="grid">
            {dataStages.map((s, i) => (
              <article
                key={s.key}
                aria-hidden={i !== stage || undefined}
                className={`[grid-area:1/1] transition-[opacity,transform,filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${i === stage ? "opacity-100" : "translate-y-4 opacity-0 blur-sm"}`}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">
                  Stage {String(i + 1).padStart(2, "0")} · {s.name}
                </p>
                <h3 className="mt-2 font-chakra-petch text-2xl font-bold uppercase md:text-4xl">{s.title}</h3>
                <p className="mt-3 max-w-md font-geist text-sm leading-relaxed text-white/65 md:text-base">
                  {s.body}
                </p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {s.tags.map((t) => (
                    <li
                      key={t}
                      className="border border-white/20 bg-black/50 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white/80"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
