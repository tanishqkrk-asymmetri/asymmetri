"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/** Event the trace log uses to light a node or force a re-route. */
export const MESH_EVENT = "ai-mesh";
export type MeshEventDetail = { node?: string; reroute?: boolean };

const RED = "205,23,23";
const AGENTS = ["PLANNER", "MEMORY", "RETRIEVER", "CRITIC", "EXECUTOR", "TOOL:MCP"];
// Agent anchor positions as fractions of the canvas, weighted to the right.
const AGENT_POS: Record<string, [number, number]> = {
  PLANNER: [0.44, 0.1],
  MEMORY: [0.64, 0.02],
  RETRIEVER: [0.86, 0.12],
  CRITIC: [0.58, 0.3],
  EXECUTOR: [0.8, 0.36],
  "TOOL:MCP": [0.955, 0.62],
};
// The route always runs through these agents in order; the hops between them re-route.
const ROUTE = ["PLANNER", "RETRIEVER", "CRITIC", "EXECUTOR", "TOOL:MCP"];

type Node = {
  hx: number; // home position
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  agent?: string;
  glow: number; // 0..1 lit by cursor or trace
  flash: number; // 0..1 trace flash
};
type Packet = { a: number; b: number; t: number; speed: number };

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * The hero's signature graphic: a mesh of square nodes where a handful are
 * named agents. Packets travel the edges, a red critical path links the
 * agents and re-routes when the critic rejects a step, and nodes near the
 * cursor are pulled in and lit.
 */
export function AgentMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let nodes: Node[] = [];
    let edges: [number, number][] = [];
    let adj: number[][] = [];
    let packets: Packet[] = [];
    let path: number[] = [];
    let prevPath: number[] = [];
    let pathBorn = 0;
    let lastReroute = 0;
    let raf = 0;
    let running = false;
    let visible = true;
    const mouse = { x: -9999, y: -9999, active: false };
    const rand = seeded(7);

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const mobile = w < 768;
      nodes = [];
      // Agents first so their indices are stable.
      for (const name of AGENTS) {
        const [fx, fy] = AGENT_POS[name];
        const x = mobile ? (0.25 + fx * 0.72) * w : fx * w;
        const y = mobile ? (0.08 + fy * 0.42) * h : (0.12 + fy * 0.78) * h;
        nodes.push({ hx: x, hy: y, x, y, vx: 0, vy: 0, agent: name, glow: 0, flash: 0 });
      }
      // Field nodes on a jittered grid, denser to the right.
      const cols = mobile ? 7 : 14;
      const rows = mobile ? 9 : 8;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const fx = (i + 0.5 + (rand() - 0.5) * 0.8) / cols;
          if (rand() > 0.25 + fx * 0.75) continue;
          const fy = (j + 0.5 + (rand() - 0.5) * 0.8) / rows;
          const x = fx * w;
          const y = mobile ? (0.04 + fy * 0.6) * h : (0.06 + fy * 0.9) * h;
          if (nodes.some((n) => Math.hypot(n.hx - x, n.hy - y) < 38)) continue;
          nodes.push({ hx: x, hy: y, x, y, vx: 0, vy: 0, glow: 0, flash: 0 });
        }
      }
      // Each node links to its nearest neighbours.
      const set = new Set<string>();
      edges = [];
      nodes.forEach((n, i) => {
        const near = nodes
          .map((m, j) => ({ j, d: Math.hypot(m.hx - n.hx, m.hy - n.hy) }))
          .filter((o) => o.j !== i)
          .sort((a, b) => a.d - b.d)
          .slice(0, n.agent ? 4 : 3);
        for (const { j } of near) {
          const k = i < j ? `${i}-${j}` : `${j}-${i}`;
          if (set.has(k)) continue;
          set.add(k);
          edges.push([Math.min(i, j), Math.max(i, j)]);
        }
      });
      adj = nodes.map(() => []);
      for (const [a, b] of edges) {
        adj[a].push(b);
        adj[b].push(a);
      }
      packets = Array.from({ length: mobile ? 8 : 16 }, () => {
        const [a, b] = edges[(rand() * edges.length) | 0];
        return { a, b, t: rand(), speed: 0.25 + rand() * 0.5 };
      });
      reroute(performance.now(), true);
    };

    // Dijkstra with random weights between consecutive agents.
    const shortest = (from: number, to: number, weight: Map<string, number>) => {
      const dist = nodes.map(() => Infinity);
      const prev = nodes.map(() => -1);
      const done = nodes.map(() => false);
      dist[from] = 0;
      for (;;) {
        let u = -1;
        for (let i = 0; i < nodes.length; i++)
          if (!done[i] && (u < 0 || dist[i] < dist[u])) u = i;
        if (u < 0 || dist[u] === Infinity || u === to) break;
        done[u] = true;
        for (const v of adj[u]) {
          const k = u < v ? `${u}-${v}` : `${v}-${u}`;
          const d = dist[u] + (weight.get(k) ?? 1);
          if (d < dist[v]) {
            dist[v] = d;
            prev[v] = u;
          }
        }
      }
      const out: number[] = [];
      for (let v = to; v >= 0; v = prev[v]) out.unshift(v);
      return out[0] === from ? out : [from, to];
    };

    function reroute(now: number, first = false) {
      const weight = new Map<string, number>();
      for (const [a, b] of edges) {
        const d = Math.hypot(nodes[a].hx - nodes[b].hx, nodes[a].hy - nodes[b].hy);
        weight.set(`${a}-${b}`, d * (0.5 + Math.random() * 1.6));
      }
      const idx = ROUTE.map((name) => nodes.findIndex((n) => n.agent === name));
      const full: number[] = [];
      for (let i = 0; i < idx.length - 1; i++) {
        const seg = shortest(idx[i], idx[i + 1], weight);
        full.push(...(i === 0 ? seg : seg.slice(1)));
      }
      prevPath = first ? [] : path;
      path = full;
      pathBorn = now;
      lastReroute = now;
    }

    const pathPoint = (p: number[], t: number) => {
      const seg = Math.min(Math.floor(t * (p.length - 1)), p.length - 2);
      const lt = t * (p.length - 1) - seg;
      const a = nodes[p[seg]];
      const b = nodes[p[seg + 1]];
      return { x: a.x + (b.x - a.x) * lt, y: a.y + (b.y - a.y) * lt };
    };

    const strokePath = (p: number[], upto = 1) => {
      if (p.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(nodes[p[0]].x, nodes[p[0]].y);
      const total = (p.length - 1) * upto;
      for (let i = 1; i <= Math.floor(total); i++) ctx.lineTo(nodes[p[i]].x, nodes[p[i]].y);
      if (total % 1 > 0 && Math.ceil(total) < p.length) {
        const e = pathPoint(p, upto);
        ctx.lineTo(e.x, e.y);
      }
      ctx.stroke();
    };

    const draw = (now: number, dt: number) => {
      ctx.clearRect(0, 0, w, h);
      const mobile = w < 768;
      // On phones the mesh sits behind the type: keep it quieter.
      ctx.globalAlpha = mobile ? 0.6 : 1;

      // Physics: spring home, pulled toward the cursor.
      for (const n of nodes) {
        let fx = (n.hx - n.x) * 0.06;
        let fy = (n.hy - n.y) * 0.06;
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const d = Math.hypot(dx, dy);
        const R = 190;
        if (mouse.active && d < R) {
          const k = (1 - d / R) * 0.9;
          fx += dx * k * 0.08;
          fy += dy * k * 0.08;
          n.glow = Math.min(1, n.glow + 0.12);
        } else n.glow = Math.max(0, n.glow - 0.03);
        n.flash = Math.max(0, n.flash - dt * 0.8);
        n.vx = (n.vx + fx) * 0.78;
        n.vy = (n.vy + fy) * 0.78;
        if (!reduce) {
          n.x += n.vx;
          n.y += n.vy;
        }
      }

      // Edges.
      ctx.lineWidth = 1;
      for (const [a, b] of edges) {
        const na = nodes[a];
        const nb = nodes[b];
        const g = Math.max(na.glow, nb.glow);
        ctx.strokeStyle = g > 0.02 ? `rgba(255,255,255,${0.08 + g * 0.35})` : "rgba(255,255,255,0.08)";
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.stroke();
      }

      // Cursor tethers.
      if (mouse.active) {
        for (const n of nodes) {
          if (n.glow < 0.2) continue;
          ctx.strokeStyle = `rgba(${RED},${n.glow * 0.5})`;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(n.x, n.y);
          ctx.stroke();
        }
      }

      // Old route fades out, new route draws in.
      const age = (now - pathBorn) / 1000;
      if (prevPath.length > 1 && age < 0.9) {
        ctx.strokeStyle = `rgba(255,255,255,${0.5 * (1 - age / 0.9)})`;
        ctx.setLineDash([3, 5]);
        strokePath(prevPath);
        ctx.setLineDash([]);
      }
      const drawIn = reduce ? 1 : Math.min(1, age / 1.2);
      ctx.strokeStyle = `rgba(${RED},0.95)`;
      ctx.lineWidth = 2;
      strokePath(path, 1 - Math.pow(1 - drawIn, 3));
      ctx.lineWidth = 1;

      // Packet on the critical path.
      if (drawIn >= 1 && path.length > 1) {
        const t = ((now - pathBorn) / 1000 / 2.6) % 1;
        const pt = pathPoint(path, t);
        ctx.fillStyle = "#fff";
        ctx.fillRect(pt.x - 3, pt.y - 3, 6, 6);
        ctx.strokeStyle = `rgba(${RED},0.6)`;
        ctx.strokeRect(pt.x - 7, pt.y - 7, 14, 14);
      }

      // Ambient packets.
      ctx.fillStyle = "rgba(255,255,255,0.75)";
      for (const pk of packets) {
        if (!reduce) pk.t += dt * pk.speed;
        if (pk.t >= 1) {
          const nextOpts = adj[pk.b].filter((v) => v !== pk.a);
          const nb = nextOpts.length ? nextOpts[(Math.random() * nextOpts.length) | 0] : pk.a;
          pk.a = pk.b;
          pk.b = nb;
          pk.t = 0;
        }
        const a = nodes[pk.a];
        const b = nodes[pk.b];
        ctx.fillRect(a.x + (b.x - a.x) * pk.t - 1.5, a.y + (b.y - a.y) * pk.t - 1.5, 3, 3);
      }

      // Nodes.
      const onPath = new Set(path);
      ctx.font = `${mobile ? 9 : 10}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textBaseline = "middle";
      for (let ni = 0; ni < nodes.length; ni++) {
        const n = nodes[ni];
        if (n.agent) {
          const s = mobile ? 9 : 12;
          const lit = Math.max(n.glow, n.flash);
          ctx.fillStyle = "#000";
          ctx.fillRect(n.x - s, n.y - s, s * 2, s * 2);
          ctx.strokeStyle = lit > 0.05 ? `rgba(${RED},1)` : "rgba(255,255,255,0.8)";
          ctx.lineWidth = 1.5;
          ctx.strokeRect(n.x - s, n.y - s, s * 2, s * 2);
          ctx.lineWidth = 1;
          ctx.fillStyle = lit > 0.05 ? `rgba(${RED},${0.4 + lit * 0.6})` : "rgba(255,255,255,0.9)";
          ctx.fillRect(n.x - s / 3, n.y - s / 3, (s * 2) / 3, (s * 2) / 3);
          if (n.flash > 0) {
            const g = (1 - n.flash) * 22;
            ctx.strokeStyle = `rgba(${RED},${n.flash})`;
            ctx.strokeRect(n.x - s - g, n.y - s - g, (s + g) * 2, (s + g) * 2);
          }
          // Label plate (desktop only; on phones it would collide with the type).
          if (mobile) continue;
          const label = n.agent;
          const tw = ctx.measureText(label).width;
          const lx = n.x + s + 6;
          const right = lx + tw + 10 > w;
          const x0 = right ? n.x - s - 6 - tw - 10 : lx;
          ctx.fillStyle = lit > 0.05 ? `rgba(${RED},1)` : "rgba(0,0,0,0.75)";
          ctx.fillRect(x0, n.y - 8, tw + 10, 16);
          ctx.fillStyle = "#fff";
          ctx.fillText(label, x0 + 5, n.y + 0.5);
        } else {
          const hot = onPath.has(ni);
          const s = hot ? 3.5 : 2.5;
          ctx.fillStyle = hot
            ? `rgba(${RED},1)`
            : `rgba(255,255,255,${0.35 + n.glow * 0.65})`;
          ctx.fillRect(n.x - s, n.y - s, s * 2, s * 2);
        }
      }

      if (!reduce && now - lastReroute > 7000) reroute(now);
    };

    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      draw(now, dt);
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running || reduce) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const sync = () => (visible && !document.hidden ? start() : stop());

    build();
    if (reduce) draw(performance.now() + 5000, 0);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    });
    io.observe(canvas);
    const onVis = () => sync();
    document.addEventListener("visibilitychange", onVis);

    let resizeT = 0;
    const onResize = () => {
      clearTimeout(resizeT);
      resizeT = window.setTimeout(() => {
        build();
        if (reduce) draw(performance.now() + 5000, 0);
      }, 120);
    };
    window.addEventListener("resize", onResize);

    // The hero section receives pointer events (the visual sits under the type).
    const host = canvas.closest("section") ?? canvas;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };
    host.addEventListener("pointermove", onMove as EventListener);
    host.addEventListener("pointerleave", onLeave);

    const onMesh = (e: Event) => {
      const d = (e as CustomEvent<MeshEventDetail>).detail;
      if (d.node) {
        const n = nodes.find((m) => m.agent === d.node);
        if (n) n.flash = 1;
      }
      if (d.reroute && !reduce) reroute(performance.now());
    };
    window.addEventListener(MESH_EVENT, onMesh);

    return () => {
      stop();
      io.disconnect();
      clearTimeout(resizeT);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
      host.removeEventListener("pointermove", onMove as EventListener);
      host.removeEventListener("pointerleave", onLeave);
      window.removeEventListener(MESH_EVENT, onMesh);
    };
  }, [reduce]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />;
}
