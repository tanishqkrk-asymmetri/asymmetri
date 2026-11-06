"use client";

import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { MaskLines } from "@/components/practice/MaskLines";
import { ScrambleText } from "@/components/practice/ScrambleText";
import { clients } from "@/components/home/whatwedo/clients";

const EASE = [0.16, 1, 0.3, 1] as const;
const COUNT = 50;
const ROLL = 1.8; // seconds for the counter and the matrix to fill
// Squares in the 50-square matrix that stand for the named clients below.
const NAMED = [4, 11, 17, 23, 30, 36, 47];

/** One odometer wheel: a strip of digits that rolls to its last entry. */
function Wheel({ digits, play, delay = 0 }: { digits: number[]; play: boolean; delay?: number }) {
  return (
    <span className="relative inline-block h-[0.9em] overflow-hidden align-top">
      <motion.span
        className="block"
        initial={false}
        animate={{ y: play ? `${-(digits.length - 1) * 0.9}em` : "0em" }}
        transition={{ duration: ROLL, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {digits.map((d, i) => (
          <span key={i} className="block h-[0.9em] leading-[0.9em]">
            {d}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/**
 * "More than 50 clients": an odometer rolls to 50 while a matrix of fifty
 * squares fills, one per client. The seven named clients are the red squares,
 * and each logo below lights its square and opens its case study.
 */
export function Clients() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const reduce = useReducedMotion();
  const play = inView || !!reduce;
  const [hot, setHot] = useState<number | null>(null);

  const ones = [...Array.from({ length: 5 }, () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).flat(), 0];
  const tens = [0, 1, 2, 3, 4, 5];

  return (
    <section
      data-chapter="Clients"
      data-nav="light"
      aria-labelledby="clients-title"
      className="relative overflow-x-clip bg-white px-5 pt-14 pb-16 text-black md:px-16 md:pt-28 md:pb-32"
    >
      {/* Ruler: the count laid out as a scale, the marker rides to 50. */}
      <div className="relative mb-10 h-8 md:mb-16" aria-hidden>
        <div className="absolute inset-x-0 top-0 h-px bg-black/20" />
        {Array.from({ length: 51 }, (_, i) => (
          <span
            key={i}
            className={`absolute top-0 w-px ${i % 10 === 0 ? "h-3 bg-black/50" : "h-1.5 bg-black/20"}`}
            style={{ left: `${(i / 50) * 100}%` }}
          />
        ))}
        {[0, 10, 20, 30, 40, 50].map((n) => (
          <span
            key={n}
            className="absolute top-4 -translate-x-1/2 font-mono text-[9px] tracking-[0.2em] text-black/45 first:translate-x-0 last:-translate-x-full"
            style={{ left: `${(n / 50) * 100}%` }}
          >
            {n === 50 ? "50+" : String(n).padStart(2, "0")}
          </span>
        ))}
        <motion.span
          className="absolute -top-[3px] size-[7px] -translate-x-1/2 bg-asymmetri-red"
          initial={false}
          animate={{ left: play ? "100%" : "0%" }}
          transition={{ duration: reduce ? 0 : ROLL, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <div ref={ref} className="grid gap-8 md:gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-end lg:gap-12">
        <div>
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.3em] text-asymmetri-red md:text-xs">
            <ScrambleText text="02 · Clients" />
          </p>
          <h2 id="clients-title" className="font-chakra-petch text-4xl leading-[0.92] font-bold uppercase md:text-6xl xl:text-[4.6vw]">
            <MaskLines lines={["More than 50", "clients have", <span key="r" className="text-asymmetri-red">partnered with us.</span>]} />
          </h2>
          <p className="mt-6 max-w-md font-geist text-base leading-relaxed text-black/65 md:text-lg">
            Founders, fast-growing teams and global brands. A few of them, with the work to show for it.
          </p>
        </div>

        <div className="flex items-end gap-4 md:gap-10" aria-hidden>
          <span className="font-chakra-petch text-[24vw] leading-none font-bold tracking-tighter whitespace-nowrap md:text-[13rem] lg:text-[12.5vw]">
            {reduce ? (
              "50"
            ) : (
              <>
                <Wheel digits={tens} play={play} />
                <Wheel digits={ones} play={play} />
              </>
            )}
            <span className="text-asymmetri-red">+</span>
          </span>
          <div className="mb-3 grid grid-cols-10 gap-[5px] md:mb-[0.6em]">
            {Array.from({ length: COUNT }, (_, i) => {
              const named = NAMED.indexOf(i);
              const lit = hot !== null && named === hot;
              return (
                <span
                  key={i}
                  className={`relative size-2 border transition-transform duration-300 sm:size-2.5 md:size-3 ${
                    named >= 0 ? "border-asymmetri-red" : "border-black/40"
                  } ${lit ? "scale-[1.8]" : ""}`}
                >
                  <span
                    className={`absolute inset-0 transition-opacity duration-200 ${named >= 0 ? "bg-asymmetri-red" : "bg-black"} ${play ? "opacity-100" : "opacity-0"}`}
                    style={{ transitionDelay: `${reduce ? 0 : (i / COUNT) * ROLL}s` }}
                  />
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Logo wall: one silhouette treatment for every mark. */}
      <ul className="mt-10 grid grid-cols-2 border-t border-l border-black/15 [--u:0.72px] sm:[--u:0.85px] md:mt-20 md:grid-cols-4 md:[--u:1px]">
        {clients.map((c, i) => (
          <motion.li
            key={c.slug}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            transition={{ duration: 0.7, delay: (i % 4) * 0.06, ease: EASE }}
            className="border-r border-b border-black/15"
          >
            <a
              href={`/case-studies/${c.slug}`}
              onMouseEnter={() => setHot(i)}
              onMouseLeave={() => setHot(null)}
              onFocus={() => setHot(i)}
              onBlur={() => setHot(null)}
              className="group relative flex aspect-[3/2] items-center justify-center overflow-hidden focus-visible:outline-none md:aspect-[16/10]"
            >
              {/* Red slab cut on the logo's slash angle, chased by a thin bar. */}
              <span
                className="absolute inset-0 bg-asymmetri-red transition-[clip-path] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [clip-path:polygon(0_0,0_0,-40%_100%,-40%_100%)] group-hover:[clip-path:polygon(0_0,140%_0,100%_100%,-40%_100%)] group-focus-visible:[clip-path:polygon(0_0,140%_0,100%_100%,-40%_100%)]"
                aria-hidden
              />
              <span
                className="absolute inset-y-0 -left-[20%] w-[6px] -skew-x-[26deg] bg-black opacity-0 transition-[left,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:left-[115%] group-hover:opacity-100"
                aria-hidden
              />
              <span
                className="relative bg-black/80 transition-colors duration-300 group-hover:bg-white group-focus-visible:bg-white"
                style={{
                  width: `calc(var(--u) * ${c.w})`,
                  height: `calc(var(--u) * ${c.h})`,
                  maskImage: c.mask,
                  WebkitMaskImage: c.mask,
                  maskSize: "contain",
                  WebkitMaskSize: "contain",
                  maskRepeat: "no-repeat",
                  WebkitMaskRepeat: "no-repeat",
                  maskPosition: "center",
                  WebkitMaskPosition: "center",
                }}
                aria-hidden
              />
              <span className="absolute top-3 left-3 font-mono text-[9px] tracking-[0.2em] text-black/40 transition-colors group-hover:text-white/80 md:top-4 md:left-4 md:text-[10px]" aria-hidden>
                C/{String(i + 1).padStart(2, "0")}
              </span>
              <span className="absolute top-3 right-3 font-mono text-xs text-black/30 transition-[color,transform] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white md:top-4 md:right-4" aria-hidden>
                ↗
              </span>
              <span className="absolute inset-x-3 bottom-3 hidden truncate font-mono text-[9px] uppercase tracking-[0.18em] text-black/40 transition-colors group-hover:text-white sm:block md:inset-x-4 md:bottom-4" aria-hidden>
                <span className="group-hover:hidden">{c.domain}</span>
                <span className="hidden group-hover:inline">Read the case study</span>
              </span>
              <span className="sr-only">{c.name}: read the case study</span>
            </a>
          </motion.li>
        ))}
        <li className="border-r border-b border-black/15">
          <a
            href="/contact-us"
            className="group relative flex aspect-[3/2] flex-col justify-between overflow-hidden bg-black p-3 text-white focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-asymmetri-red md:aspect-[16/10] md:p-4"
          >
            <span className="absolute inset-0 origin-bottom scale-y-0 bg-asymmetri-red transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" aria-hidden />
            <span className="relative flex justify-between font-mono text-[9px] tracking-[0.2em] text-white/60 md:text-[10px]">
              <span>C/{String(clients.length + 1).padStart(2, "0")}</span>
              <span className="kit-blink inline-block size-1.5 bg-asymmetri-red group-hover:bg-white" aria-hidden />
            </span>
            <span className="relative font-chakra-petch text-lg leading-[0.95] font-bold uppercase md:text-2xl">
              Your hard
              <br />
              problem next ↗
            </span>
          </a>
        </li>
      </ul>
    </section>
  );
}
