"use client";

import { motion } from "motion/react";
import { selectedWork } from "@/lib/site-content";
import { SectionHead } from "./SectionHead";

/** Case studies that prove a practice. Slugs come from practice.proof. */
export function ProofStrip({
  slugs,
  kicker = "Proof · Selected work",
}: {
  slugs: string[];
  kicker?: string;
}) {
  const work = slugs
    .map((s) => selectedWork.find((w) => w.slug === s))
    .filter((w): w is (typeof selectedWork)[number] => Boolean(w));

  return (
    <section
      data-chapter="Proof"
      className="relative bg-asymmetri-red px-6 py-28 text-white md:px-16 md:py-36"
    >
      <SectionHead
        kicker={kicker}
        title={["Proof,", "not promises."]}
        body="Systems people transact with, depend on and trust, built with founders, fast-growing teams and global brands."
        className="[&_.text-asymmetri-red]:text-black"
      />
      <ul className="mt-16 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {work.map((w, i) => (
          <motion.li
            key={w.slug}
            initial={{ opacity: 0, y: 60, rotate: i % 2 ? 2 : -2 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <a
              href={`/case-studies/${w.slug}`}
              className="group relative flex h-full flex-col justify-between gap-10 overflow-hidden border border-white/40 p-6 md:p-8"
            >
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-black transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
              <div className="relative flex items-start justify-between gap-4">
                <span className="flex size-16 items-center justify-center overflow-hidden rounded-sm bg-white p-2">
                  <img src={w.logo} alt="" className="max-h-full max-w-full object-contain" />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
                  {String(i + 1).padStart(2, "0")} / {w.domain}
                </span>
              </div>
              <div className="relative space-y-3">
                <h3 className="font-chakra-petch text-3xl font-bold uppercase md:text-4xl">
                  {w.name}
                </h3>
                <p className="font-geist text-sm leading-relaxed text-white/85">{w.summary}</p>
                <span className="inline-flex items-center gap-2 pt-2 font-mono text-[11px] uppercase tracking-[0.2em]">
                  Read the case study
                  <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    ↗
                  </span>
                </span>
              </div>
            </a>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
