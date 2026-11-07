"use client";

import { motion } from "motion/react";
import { useReduceMotion } from "@/hooks/useReduceMotion";
import { MaskLines } from "@/components/practice/MaskLines";
import { ScrambleText } from "@/components/practice/ScrambleText";
import { perks } from "../content";

const EASE = [0.16, 1, 0.3, 1] as const;
const TICKS = 9;

/**
 * A row of identical ticks with one misfit: the red slash. Each tile's misfit
 * sits at a different position; on hover every tick breaks rank and joins it.
 */
function MisfitTicks({ at }: { at: number }) {
  return (
    <span aria-hidden className="flex h-6 items-end gap-[7px]">
      {Array.from({ length: TICKS }, (_, i) => {
        const misfit = i === at;
        return (
          <span
            key={i}
            style={{ transitionDelay: `${Math.abs(i - at) * 35}ms` }}
            className={`block w-[3px] origin-bottom transition-[transform,background-color,height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              misfit
                ? "h-6 -skew-x-[26deg] bg-white group-hover:bg-asymmetri-red"
                : "h-4 bg-black/45 group-hover:h-6 group-hover:-skew-x-[26deg] group-hover:bg-white"
            }`}
          />
        );
      })}
    </span>
  );
}

/** What working here gets you: six tiles on red, black floods in along the slash on hover. */
export function PerksSection() {
  const reduce = useReduceMotion();
  return (
    <section
      data-chapter="Perks"
      data-nav="red"
      aria-labelledby="careers-perks"
      className="relative overflow-hidden bg-asymmetri-red px-6 py-28 text-white md:px-16 md:py-36"
    >
      {/* Giant outline slash behind the grid */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-[10%] right-[6%] hidden h-[130%] w-[14vw] -skew-x-[26deg] border border-white/15 lg:block"
      />

      <header className="relative grid gap-6 xl:grid-cols-[1.6fr_1fr] xl:items-end">
        <div>
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.3em] text-black md:text-xs">
            <ScrambleText text={perks.kicker} />
          </p>
          <h2
            id="careers-perks"
            className="font-chakra-petch text-4xl leading-[0.92] font-bold uppercase md:text-6xl xl:text-7xl"
          >
            <MaskLines
              lines={perks.titleLines.map((l, i) =>
                Array.isArray(l) ? (
                  <span key={i} className="text-black">
                    {l[0]}
                  </span>
                ) : (
                  l
                ),
              )}
            />
          </h2>
        </div>
        <p className="max-w-sm font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-white/75 md:text-[11px]">
          {perks.aside}
        </p>
      </header>

      <ul className="relative mt-16 grid border-t border-l border-black/30 sm:grid-cols-2 lg:mt-20 xl:grid-cols-3">
        {perks.items.map((item, i) => (
          <motion.li
            key={item.title}
            initial={reduce ? false : { opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: EASE }}
            className="group relative min-h-[17rem] overflow-hidden border-r border-b border-black/30 md:min-h-[20rem]"
          >
            {/* Black flood, entering along the logo's slash angle */}
            <span
              aria-hidden
              className="absolute inset-y-0 -left-[30%] w-[160%] origin-left -skew-x-[26deg] scale-x-0 bg-black transition-transform duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
            />
            <div className="relative flex h-full flex-col justify-between gap-10 p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <span className="font-mono text-[11px] tracking-[0.25em] text-black transition-colors duration-300 group-hover:text-asymmetri-red">
                  P/{String(i + 1).padStart(2, "0")}
                </span>
                <MisfitTicks at={(i * 4 + 2) % TICKS} />
              </div>
              <div>
                <h3 className="font-chakra-petch text-2xl leading-[0.95] font-bold uppercase md:text-3xl xl:text-[1.7rem] 2xl:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-4 max-w-xs font-geist text-sm leading-relaxed text-white/85 md:text-base">
                  {item.body}
                </p>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
