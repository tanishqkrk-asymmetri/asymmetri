"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { SectionHead } from "@/components/practice/SectionHead";
import { dossiers, type Dossier } from "./content";
import css from "./consulting.module.css";

function DossierCard({ d, i }: { d: Dossier; i: number }) {
  const [open, setOpen] = useState(false);
  const id = `dossier-${d.file}`;
  return (
    <motion.li
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={`${css.scene} relative pt-6`}
    >
      {/* folder tab */}
      <span
        aria-hidden
        className={`absolute top-0 left-0 flex h-6 items-center px-3 font-mono text-[9px] uppercase tracking-[0.25em] transition-colors duration-500 [clip-path:polygon(0_0,88%_0,100%_100%,0_100%)] ${open ? "bg-white text-black" : "bg-[#1c1c1c] text-white/60"}`}
      >
        File 03-{d.file} &nbsp;
      </span>
      <div className={`${css.card} ${open ? css.open : ""}`}>
        {/* front: the closed file */}
        <div
          className={`${css.face} relative flex min-h-[26rem] flex-col overflow-hidden border border-white/15 bg-[#121212] p-6 md:p-7`}
          inert={open}
        >
          <span className="kit-outline pointer-events-none absolute -right-2 -bottom-10 font-chakra-petch text-[13rem] leading-none font-bold select-none" aria-hidden>
            {d.file}
          </span>
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
            <span>Engagement model</span>
            <span className="border border-asymmetri-red px-1.5 py-0.5 text-asymmetri-red">Case file</span>
          </div>
          <h3 className="mt-10 font-chakra-petch text-3xl leading-[0.95] font-bold uppercase md:text-4xl">{d.name}</h3>
          <p className="mt-4 max-w-[18rem] font-geist text-base text-white/65">{d.line}</p>
          <div className="mt-8 space-y-2" aria-hidden>
            {[78, 92, 64, 84].map((wd, k) => (
              <span key={k} className="flex items-center gap-2">
                <span className="font-mono text-[9px] text-white/25">{String(k + 1).padStart(2, "0")}</span>
                <span className="h-2.5 bg-white/10" style={{ width: `${wd - i * 3}%` }} />
              </span>
            ))}
          </div>
          <div className="relative mt-auto flex items-end justify-between gap-4 pt-10">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">{d.shape}</span>
            <button
              type="button"
              aria-expanded={open}
              aria-controls={id}
              onClick={() => setOpen(true)}
              className="group inline-flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap bg-asymmetri-red px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-black"
            >
              Open file <span className="transition-transform duration-300 group-hover:rotate-180">↻</span>
              <span className="sr-only">: {d.name}</span>
            </button>
          </div>
        </div>

        {/* back: what is inside */}
        <div
          id={id}
          className={`${css.face} ${css.back} flex min-h-[26rem] flex-col border border-white bg-white p-6 text-black md:p-7`}
          inert={!open}
        >
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em]">
            <span className="text-asymmetri-red">File 03-{d.file} · Contents</span>
            <span className="text-black/40">Declassified</span>
          </div>
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.25em] text-black/45">When to use it</p>
          <p className="mt-1 font-geist text-sm leading-relaxed text-black/80">{d.when}</p>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-black/45">What you get</p>
          <ul className="mt-1.5 space-y-1.5">
            {d.get.map((g) => (
              <li key={g} className="flex gap-2.5 font-geist text-sm leading-snug">
                <span className="mt-1.5 size-1.5 shrink-0 bg-asymmetri-red" aria-hidden />
                {g}
              </li>
            ))}
          </ul>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-black/45">How it ends</p>
          <p className="mt-1 font-chakra-petch text-base leading-snug font-semibold uppercase">{d.ends}</p>
          <div className="mt-auto flex items-center justify-between gap-4 pt-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-asymmetri-red">→ We can build it after</span>
            <button
              type="button"
              aria-expanded={open}
              aria-controls={id}
              onClick={() => setOpen(false)}
              className="cursor-pointer border border-black px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors hover:bg-black hover:text-white"
            >
              Close file
              <span className="sr-only">: {d.name}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.li>
  );
}

/** Engagement models as case files that flip open to show what is inside. */
export function Dossiers() {
  return (
    <section
      data-chapter="Engagements"
      className="heroDark relative bg-[#0a0a0a] px-6 py-28 text-white md:px-16 md:py-36"
    >
      <SectionHead
        kicker="04 · Engagement models"
        title={["Six ways", ["to start."]]}
        body="Every engagement is scoped to the problem, and these are the shapes we see most. Each one ends with something you can act on, and the option to have the same team build it."
      />
      <ul className="mt-16 grid gap-x-4 gap-y-8 md:grid-cols-2 xl:grid-cols-3">
        {dossiers.map((d, i) => (
          <DossierCard key={d.file} d={d} i={i} />
        ))}
      </ul>
      <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
        Durations depend on the problem. We agree scope before we start.
      </p>
    </section>
  );
}
