"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMotionValueEvent } from "motion/react";
import { useReduceMotion as useReducedMotion } from "@/hooks/useReduceMotion";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { ScrambleText } from "@/components/practice/ScrambleText";
import { domains, selectedWork } from "@/lib/site-content";
import { FormLayers, forms, shapes } from "@/components/home/work/forms";
import { clamp01, easeInOut, lerp, staircase } from "@/components/home/work/rng";
import css from "@/components/home/work/work.module.css";
import { usePauseOffscreen } from "@/components/home/work/usePauseOffscreen";

const pad = (n: number, l = 2) => String(n).padStart(l, "0");
const N = domains.length;
const TITLE = "Systems people transact with, depend on and use in the physical world.";

/* Scroll map: five held forms, then the last one swallows the screen. */
const MORPH = [0.02, 0.74] as const;
const EXIT = [0.86, 0.98] as const;

const seenIn = domains.map((d) => selectedWork.filter((w) => w.domain === d.name));

function DomainCopy({ i, live }: { i: number; live: boolean }) {
  const d = domains[i];
  return (
    <li
      inert={!live}
      className={`[grid-area:1/1] transition-[opacity,transform,filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${live ? "opacity-100" : "pointer-events-none translate-y-4 opacity-0 blur-[6px]"}`}
    >
      <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-black/70">
        <span className="size-2 bg-black" aria-hidden />
        D.{pad(i + 1)} · Form: {shapes[i].label}
      </p>
      <h3 className="mt-3 font-chakra-petch text-[8.5vw] leading-[0.92] font-bold uppercase md:text-5xl xl:text-6xl">
        <ScrambleText text={d.name} trigger="none" replayKey={live ? i : -1} duration={0.6} />
      </h3>
      <p className="mt-3 max-w-md font-geist text-sm leading-snug text-white/85 md:mt-4 md:text-lg">{d.body}</p>
      {seenIn[i].length > 0 && (
        <p className="mt-4 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em]">
          <span className="text-black/70">Seen in</span>
          {seenIn[i].map((w) => (
            <a
              key={w.slug}
              href={`/case-studies/${w.slug}`}
              className="border border-white/60 px-2 py-1 transition-colors hover:bg-white hover:text-black focus-visible:bg-white focus-visible:text-black focus-visible:outline-none"
            >
              {w.name} <span aria-hidden>↗</span>
            </a>
          ))}
        </p>
      )}
    </li>
  );
}

/* ── Reduced motion: each domain beside its own form, no pinning ────── */
function DomainsStatic() {
  return (
    <section
      id="domains"
      data-chapter="Domains"
      data-nav="red"
      aria-labelledby="domains-title"
      className="relative bg-asymmetri-red px-6 pt-24 pb-24 font-chakra-petch text-white md:px-16"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-black/70">Five domains · One interface</p>
      <h2 id="domains-title" className="mt-3 max-w-3xl text-3xl leading-none font-bold uppercase md:text-5xl">
        {TITLE}
      </h2>
      <ol className="mt-12 grid gap-10 md:grid-cols-2">
        {domains.map((d, i) => {
          const F = forms[i];
          const s = shapes[i];
          return (
            <li key={d.name} className="grid gap-4">
              <div
                className={`${css.live} relative overflow-hidden border-2 border-white bg-[#0a0a0a]`}
                style={{ aspectRatio: `${s.w} / ${s.h}`, width: `${Math.min(100, s.w * 1.4)}%`, borderRadius: s.r * 6 }}
                aria-hidden
              >
                <F />
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-black/70">D.{pad(i + 1)} · {s.label}</p>
                <h3 className="mt-2 text-2xl font-bold uppercase md:text-3xl">{d.name}</h3>
                <p className="mt-2 max-w-md font-geist text-base text-white/85">{d.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* ── One interface, five forms ──────────────────────────────────────── */
function DomainsPinned() {
  const ref = useRef<HTMLElement>(null);
  const p = useSectionProgress(ref);
  usePauseOffscreen(ref);

  const stage = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const wTxt = useRef<HTMLSpanElement>(null);
  const hTxt = useRef<HTMLSpanElement>(null);
  const chrome = useRef<(HTMLElement | null)[]>([]);
  const geo = useRef({ W: 0, H: 0, u: 0, cx: 0, cy: 0 });
  const exiting = useRef(false);

  const [active, setActive] = useState(0);
  const [black, setBlack] = useState(false);

  const render = useCallback((v: number) => {
    const g = geo.current;
    if (!g.u || !wrap.current || !frame.current) return;
    const D = staircase(clamp01((v - MORPH[0]) / (MORPH[1] - MORPH[0])) * (N - 1), N - 1, 0.5);
    const k = Math.min(Math.floor(D), N - 2);
    const f = D - k;
    const a = shapes[k];
    const b = shapes[k + 1];
    const X = easeInOut(clamp01((v - EXIT[0]) / (EXIT[1] - EXIT[0])));

    const w0 = lerp(a.w, b.w, f) * g.u;
    const h0 = lerp(a.h, b.h, f) * g.u;
    const r0 = lerp(a.r, b.r, f) * g.u;
    // A small kick mid-morph, so the change of form feels physical.
    const kick = Math.sin(f * Math.PI) * 4;
    const rot = lerp(lerp(a.rot, b.rot, f) + kick, 0, X);
    const w = lerp(w0, g.W * 1.08, X);
    const h = lerp(h0, g.H * 1.08, X);
    const r = lerp(r0, 0, Math.min(1, X * 1.4));
    const dx = (g.W / 2 - g.cx) * X;
    const dy = (g.H / 2 - g.cy) * X;

    const ws = wrap.current.style;
    ws.width = `${w}px`;
    ws.height = `${h}px`;
    ws.transform = `translate(-50%, -50%) translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
    frame.current.style.borderRadius = `${r}px`;
    if (X > 0 && !exiting.current) frame.current.style.transform = "";
    exiting.current = X > 0;
    frame.current.style.borderColor = `rgba(255,255,255,${1 - X})`;
    const bg = Math.round(10 * (1 - X));
    frame.current.style.backgroundColor = `rgb(${bg},${bg},${bg})`;
    if (inner.current) inner.current.style.opacity = String(1 - clamp01(X * 3));
    if (wTxt.current) wTxt.current.textContent = `W ${pad(Math.round(w / g.u), 3)}`;
    if (hTxt.current) hTxt.current.textContent = `H ${pad(Math.round(h / g.u), 3)}`;
    const fade = String(1 - clamp01(X * 2.5));
    chrome.current.forEach((el) => {
      if (el) el.style.opacity = fade;
    });

    setActive(Math.min(Math.max(Math.round(D), 0), N - 1));
    setBlack(X > 0.6);
  }, []);

  useMotionValueEvent(p, "change", render);

  useEffect(() => {
    const measure = () => {
      const s = stage.current;
      if (!s) return;
      chrome.current = Array.from(pin.current?.querySelectorAll<HTMLElement>("[data-chrome]") ?? []);
      const rect = s.getBoundingClientRect();
      const base = pin.current?.getBoundingClientRect() ?? { left: 0, top: 0 };
      const W = window.innerWidth;
      const H = window.innerHeight;
      const maxW = Math.max(...shapes.map((x) => x.w));
      const maxH = Math.max(...shapes.map((x) => x.h));
      const u = Math.max(2, Math.min((rect.width * 0.86) / maxW, (rect.height * 0.8) / maxH));
      geo.current = { W, H, u, cx: rect.left - base.left + rect.width / 2, cy: rect.top - base.top + rect.height / 2 };
      // Blueprint: every form the interface can take, drawn faintly on the stage.
      s.querySelectorAll<HTMLElement>("[data-ghost]").forEach((el, i) => {
        const g = shapes[i];
        el.style.width = `${g.w * u}px`;
        el.style.height = `${g.h * u}px`;
        el.style.borderRadius = `${g.r * u}px`;
        el.style.transform = `translate(-50%, -50%) rotate(${g.rot}deg)`;
      });
      render(p.get());
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (stage.current) ro.observe(stage.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [p, render]);

  /* Cursor tilt: the device leans towards the pointer (fine pointers only). */
  useEffect(() => {
    const st = stage.current;
    const fr = frame.current;
    if (!st || !fr || !window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      if (exiting.current) return;
      const r = st.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        fr.style.transform = `perspective(1100px) rotateY(${x * 14}deg) rotateX(${-y * 12}deg)`;
      });
    };
    const leave = () => {
      cancelAnimationFrame(raf);
      fr.style.transform = "";
    };
    st.addEventListener("pointermove", move);
    st.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      st.removeEventListener("pointermove", move);
      st.removeEventListener("pointerleave", leave);
    };
  }, []);

  const goTo = useCallback((i: number) => {
    const el = ref.current;
    if (!el) return;
    const t = i === N - 1 ? N - 1 + 0.05 : i + 0.15;
    const v = MORPH[0] + (t / (N - 1)) * (MORPH[1] - MORPH[0]);
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + v * (el.offsetHeight - window.innerHeight), behavior: "smooth" });
  }, []);

  return (
    <section
      ref={ref}
      id="domains"
      data-chapter="Domains"
      data-nav="red"
      aria-labelledby="domains-title"
      className={`${css.host} relative h-[400vh] bg-asymmetri-red font-chakra-petch text-white`}
    >
      <div ref={pin} data-nav={black ? "dark" : "red"} className="sticky top-0 h-[100svh] overflow-hidden bg-asymmetri-red">
        {/* hairline columns, continuous with Work above */}
        <div data-chrome="" className="pointer-events-none absolute inset-0 grid grid-cols-4" aria-hidden>
          {[0, 1, 2, 3].map((c) => (
            <span key={c} className="border-l border-white/15" />
          ))}
        </div>

        <div className="relative grid h-full grid-cols-1 grid-rows-[auto_minmax(0,1fr)_auto] gap-4 px-6 pt-20 pb-6 md:pb-20 [grid-template-areas:'head'_'stage'_'copy'] md:px-16 lg:grid-cols-[1fr_1.15fr] lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:gap-y-0 lg:pt-24 lg:pb-12 lg:[grid-template-areas:'head_stage'_'copy_stage']">
          <header data-chrome="" className="[grid-area:head]">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-black/70 md:text-xs">
              <ScrambleText text="Five domains · One interface, five forms" />
            </p>
            <h2 id="domains-title" className="mt-3 max-w-xl text-xl leading-[0.95] font-bold uppercase md:text-4xl">
              {TITLE}
            </h2>
          </header>

          <ol data-chrome="" className="grid self-end [grid-area:copy] lg:pb-4">
            {domains.map((d, i) => (
              <DomainCopy key={d.name} i={i} live={active === i} />
            ))}
          </ol>

          {/* ── the stage ── */}
          <div className="relative z-10 flex min-h-0 flex-col [grid-area:stage]">
            <div ref={stage} className="relative min-h-0 flex-1">
              {/* drafting dots */}
              <span
                data-chrome=""
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.35)_1px,transparent_1.2px)] bg-[size:22px_22px] [mask-image:radial-gradient(closest-side,black,transparent)]"
              />
              <div data-chrome="" aria-hidden className="pointer-events-none absolute inset-0">
                {shapes.map((g) => (
                  <span
                    key={g.label}
                    data-ghost=""
                    className="absolute top-1/2 left-1/2 border border-dashed border-white/30"
                  />
                ))}
              </div>
              <div
                ref={wrap}
                aria-hidden
                className="absolute top-1/2 left-1/2 will-change-transform"
                style={{ width: 0, height: 0 }}
              >
                <div
                  ref={frame}
                  className="absolute inset-0 overflow-hidden border-2 border-white bg-[#0a0a0a] shadow-[0_50px_90px_-40px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-out"
                >
                  <div ref={inner} className="absolute inset-0">
                    <FormLayers active={active} />
                  </div>
                </div>
                {/* live dimension lines */}
                <span data-chrome="" className="absolute inset-x-0 -top-6 flex items-center gap-2 font-mono text-[9px] tracking-[0.2em] text-white/80">
                  <span className="h-2 border-l border-white/70" />
                  <span className="h-px flex-1 bg-white/50" />
                  <span ref={wTxt}>W 054</span>
                  <span className="h-px flex-1 bg-white/50" />
                  <span className="h-2 border-l border-white/70" />
                </span>
                <span data-chrome="" className="absolute inset-y-0 -right-6 flex flex-col items-center gap-2 font-mono text-[9px] tracking-[0.2em] text-white/80">
                  <span className="w-2 border-t border-white/70" />
                  <span className="w-px flex-1 bg-white/50" />
                  <span ref={hTxt} className="[writing-mode:vertical-rl]">H 034</span>
                  <span className="w-px flex-1 bg-white/50" />
                  <span className="w-2 border-t border-white/70" />
                </span>
              </div>
            </div>

            {/* form selector */}
            <div data-chrome="" className="mt-8 flex items-center justify-between gap-3 md:mt-10">
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-black/70 md:inline">
                Interface {pad(active + 1)}/{pad(N)}
              </span>
              <div className="flex flex-1 gap-1 md:max-w-md" role="group" aria-label="Jump to a domain">
                {shapes.map((s, i) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`${domains[i].name}: ${s.label}`}
                    aria-pressed={active === i}
                    className={`relative flex-1 border px-1 py-2 font-mono text-[8px] uppercase tracking-[0.15em] transition-colors md:text-[9px] md:tracking-[0.2em] ${active === i ? "border-black bg-black text-white" : "border-white/40 text-white/80 hover:border-white hover:text-white"}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function DomainsMorph() {
  const reduce = useReducedMotion();
  return reduce ? <DomainsStatic /> : <DomainsPinned />;
}
