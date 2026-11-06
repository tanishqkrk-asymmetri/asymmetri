"use client";

import { motion } from "motion/react";
import { domains } from "@/lib/site-content";
import { SectionHead } from "@/components/practice/SectionHead";
import { Marquee } from "@/components/practice/Marquee";
import { methods, methodsB } from "./content";

const pad = (n: number) => String(n).padStart(2, "0");

/** The five domains we advise in, then a marquee of representative methods. */
export function Domains() {
  return (
    <section className="relative bg-black text-white">
      <div data-chapter="Domains" className="px-6 pt-28 pb-20 md:px-16 md:pt-36">
        <SectionHead
          kicker="06 · Domains"
          title={["Where we", ["advise."]]}
          body="Five domains where the stakes are operational: money moving, people's health, physical output, and the experiences people return to every day."
        />
        <ul className="mt-14 border-t border-white/15">
          {domains.map((d, i) => (
            <motion.li
              key={d.name}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "0px 0px -8% 0px" }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden border-b border-white/15"
            >
              <span
                className="absolute inset-0 origin-left scale-x-0 bg-asymmetri-red transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                aria-hidden
              />
              <div className="relative grid gap-2 py-6 md:grid-cols-[4rem_1.1fr_1fr] md:items-baseline md:gap-8 md:py-8">
                <span className="font-mono text-[10px] text-asymmetri-red transition-colors group-hover:text-white">
                  D.{pad(i + 1)}
                </span>
                <h3 className="kit-glitch font-chakra-petch text-2xl leading-none font-bold uppercase md:text-4xl">
                  {d.name}
                </h3>
                <p className="font-geist text-sm leading-relaxed text-white/60 transition-colors group-hover:text-white md:text-base">
                  {d.body}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>

      <div data-chapter="Methods" className="border-t border-white/15 py-14 md:py-20">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4 px-6 md:px-16">
          <h2 className="font-chakra-petch text-2xl font-bold uppercase md:text-4xl">
            07 · Methods in the <span className="text-asymmetri-red">toolkit</span>
          </h2>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
            Representative, not a fixed playbook. The problem picks the method.
          </p>
        </div>
        <Marquee
          speed={46}
          items={methods.map((m) => (
            <span key={m} className="font-chakra-petch text-4xl font-bold whitespace-nowrap uppercase md:text-7xl">
              {m}
            </span>
          ))}
        />
        <Marquee
          reverse
          speed={38}
          className="mt-6"
          separator={<span className="size-1.5 bg-asymmetri-red" />}
          items={methodsB.map((m) => (
            <span key={m} className="font-mono text-xs whitespace-nowrap text-white/60 uppercase tracking-[0.25em] md:text-sm">
              {m}
            </span>
          ))}
        />
      </div>
    </section>
  );
}
