"use client";

import { motion } from "motion/react";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { MaskLines } from "./MaskLines";

/** Closing red call to action plus the site footer. */
export function PracticeCTA({
  line = "Bring us the hard problem.",
  sub = "We'll find the asymmetric answer.",
}: {
  line?: string;
  sub?: string;
}) {
  return (
    <section data-chapter="Contact" className="relative flex min-h-screen flex-col bg-asymmetri-red text-white">
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-28 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-white/70">
          AI · Applications · Consulting · R&D
        </p>
        <h2 className="font-chakra-petch text-4xl font-bold uppercase leading-[0.95] md:text-7xl">
          <MaskLines lines={[line, <span key="s" className="text-black">{sub}</span>]} />
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="flex flex-wrap justify-center gap-3"
        >
          <a
            href="/contact-us"
            className="group relative overflow-hidden bg-white px-6 py-3 font-semibold text-asymmetri-red"
          >
            <span className="absolute inset-0 origin-left scale-x-0 bg-black transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
            <span className="relative transition-colors duration-300 group-hover:text-white">Get in touch ↗</span>
          </a>
          <a
            href="/careers"
            className="border border-white px-6 py-3 font-semibold transition-colors duration-300 hover:bg-white hover:text-asymmetri-red"
          >
            Join our team
          </a>
        </motion.div>
      </div>
      <SiteFooter />
    </section>
  );
}
