"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useTransform } from "motion/react";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { ScrambleText } from "@/components/practice/ScrambleText";
import { SectionHead } from "@/components/practice/SectionHead";
import { incubation, spine } from "./content";
import { clamp01, useIsDesktop } from "./hooks";
import styles from "./rnd.module.css";

// A vertebra silhouette: chamfered block with side processes.
const VERTEBRA =
  "polygon(6% 0, 94% 0, 100% 30%, 100% 70%, 94% 100%, 6% 100%, 0 70%, 0 30%)";

/**
 * Product reveal. A red iris opens on the dark stage, the FinishLine name
 * decodes, and the five vertebrae of its operating spine light from intent to
 * delivery. At the end, delivery traces back to intent.
 */
export function ProductReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const p = useSectionProgress(ref);
  const isDesktop = useIsDesktop();

  const iris = useTransform(p, (v) => `circle(${(clamp01((v - 0.02) / 0.22) * 150).toFixed(2)}% at 72% 50%)`);
  const teaseOpacity = useTransform(p, [0.03, 0.1], [1, 0]);
  const pulseY = useTransform(p, [0.3, 0.82], ["0%", "100%"]);
  const [lit, setLit] = useState(0);
  const [traced, setTraced] = useState(false);
  const [named, setNamed] = useState(0);

  useMotionValueEvent(p, "change", (v) => {
    const n = Math.min(5, Math.max(0, Math.floor(((v - 0.3) / 0.52) * 5) + 1));
    setLit((x) => (x === n ? x : n));
    setTraced(v > 0.86);
    if (v > 0.18) setNamed((x) => (x === 0 ? 1 : x));
  });

  const litCount = isDesktop ? lit : 5;
  const showTrace = isDesktop ? traced : true;

  return (
    <>
      <section data-chapter="Products" aria-labelledby="rnd-product" className="relative bg-black text-white">
        <div ref={ref} className="relative lg:h-[320vh]">
          <div className="relative overflow-hidden lg:sticky lg:top-0 lg:h-screen">
            {/* Before the iris opens */}
            <motion.div
              style={{ opacity: teaseOpacity }}
              className="heroDark absolute inset-0 hidden flex-col items-start justify-center bg-black px-16 lg:flex"
              aria-hidden
            >
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-asymmetri-red">Products we build and run</p>
              <p className="mt-4 max-w-3xl font-chakra-petch text-6xl leading-[0.92] font-bold uppercase">
                The best proof of a method is a product that runs on it.
              </p>
            </motion.div>

            <motion.div
              style={{ ["--iris" as string]: iris }}
              className="relative bg-asymmetri-red lg:absolute lg:inset-0 lg:[clip-path:var(--iris)]"
            >
              <div className="grid h-full gap-12 px-6 py-24 md:px-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16 lg:py-0 lg:pt-14">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/80 md:text-xs">
                    Innovative products and solutions · In-house product 001
                  </p>
                  <h2
                    id="rnd-product"
                    className="mt-4 font-chakra-petch text-[17vw] leading-[0.82] font-bold uppercase tracking-tight sm:text-[13vw] lg:text-[8.5vw]"
                  >
                    <ScrambleText text="FinishLine" trigger="none" replayKey={named} duration={1.1} />
                  </h2>
                  <p className="mt-5 max-w-xl font-chakra-petch text-xl font-semibold uppercase leading-tight md:text-3xl">
                    Our agentic project management <span className="text-black">operating spine.</span>
                  </p>
                  <p className="mt-5 max-w-lg font-geist text-sm leading-relaxed text-white/85 md:text-base">
                    FinishLine connects intent, planning, execution, evidence and delivery across the company,
                    while specialist AI tools augment every discipline. We designed it, we built it, and we run
                    our own company on it.
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-1.5">
                    {["Designed by us", "Built by us", "Operated by us"].map((t) => (
                      <li
                        key={t}
                        className="border border-white/50 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em]"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* The spine */}
                <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
                  <div className="absolute top-4 bottom-4 left-1/2 w-px -translate-x-1/2 bg-white/30" aria-hidden>
                    <motion.span
                      style={{ top: pulseY }}
                      className="absolute left-1/2 hidden size-2.5 -translate-x-1/2 -translate-y-1/2 bg-white lg:block"
                    />
                  </div>
                  <svg
                    className={`pointer-events-none absolute top-6 -right-3 bottom-6 h-[calc(100%-3rem)] w-6 transition-opacity duration-700 ${showTrace ? "opacity-100" : "opacity-0"}`}
                    viewBox="0 0 24 100"
                    preserveAspectRatio="none"
                    aria-hidden
                  >
                    <path
                      d="M0 98 H18 V2 H0"
                      fill="none"
                      stroke="#000"
                      strokeWidth="1.5"
                      strokeDasharray="4 8"
                      vectorEffect="non-scaling-stroke"
                      className={styles.cord}
                    />
                  </svg>
                  <ol className="relative space-y-3 lg:space-y-4">
                    {spine.map((s, i) => {
                      const on = i < litCount;
                      return (
                        <li
                          key={s.name}
                          style={{ clipPath: VERTEBRA }}
                          className={`relative grid grid-cols-[3rem_1fr] items-center gap-3 px-5 py-3 transition-[background-color,color,transform] duration-500 lg:py-4 ${
                            on ? "bg-black text-white" : "bg-white/10 text-white/55"
                          } ${on && i === litCount - 1 && isDesktop && litCount < 5 ? "lg:scale-[1.03]" : ""}`}
                        >
                          <span className={`font-mono text-xs ${on ? "text-asymmetri-red" : "text-white/50"}`}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span>
                            <span className="block font-chakra-petch text-lg font-bold uppercase md:text-xl">{s.name}</span>
                            <span className={`block font-geist text-[13px] leading-snug ${on ? "text-white/70" : "text-white/45"}`}>
                              {s.body}
                            </span>
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                  <p
                    className={`mt-4 text-right font-mono text-[10px] uppercase tracking-[0.2em] transition-opacity duration-700 ${showTrace ? "text-black opacity-100" : "opacity-0"}`}
                  >
                    Delivery traced back to intent ✓
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section
        data-chapter="Incubation"
        aria-labelledby="rnd-incubate"
        className="border-t border-white/25 bg-asymmetri-red px-6 py-24 text-white md:px-16 md:py-32"
      >
        <div id="rnd-incubate">
          <SectionHead
            kicker="New product incubation"
            title={["Your product,", "incubated in", ["our lab."]]}
            body="FinishLine is not a one-off. We co-develop new products with partners who bring a market, a dataset or a hard operating problem, and we bring the frontier team that can build it and run it."
            className="[&_.text-asymmetri-red]:text-black [&_p.text-asymmetri-red]:text-white/80"
          />
        </div>
        <ol className="mt-14 grid gap-px bg-white/30 md:grid-cols-3">
          {incubation.map((s, i) => (
            <motion.li
              key={s.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden bg-asymmetri-red p-6 md:p-8"
            >
              <span className="absolute inset-0 origin-left scale-x-0 bg-black transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
              <span className="relative block font-mono text-xs text-white/70">{String(i + 1).padStart(2, "0")} →</span>
              <h3 className="relative mt-10 font-chakra-petch text-2xl font-bold uppercase md:text-3xl">{s.name}</h3>
              <p className="relative mt-3 font-geist text-sm leading-relaxed text-white/85 md:text-base">{s.body}</p>
            </motion.li>
          ))}
        </ol>
        <a
          href="/contact-us"
          className="group mt-10 inline-flex items-center gap-3 border border-white px-5 py-3 font-chakra-petch text-sm font-semibold uppercase tracking-wide transition-colors hover:bg-white hover:text-asymmetri-red"
        >
          Pitch us a product
          <span className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
        </a>
      </section>
    </>
  );
}
