"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { MaskLines } from "./MaskLines";
import { ScrambleText } from "./ScrambleText";

type Props = {
  /** Mono label above the title, e.g. "02 · Data foundation". */
  kicker: string;
  /** Title lines. Wrap a line in an array to colour it red. */
  title: (string | [string])[];
  body?: ReactNode;
  tone?: "dark" | "light";
  align?: "left" | "split";
  className?: string;
};

/** Consistent section opener: decoding kicker, masked title, fading body. */
export function SectionHead({
  kicker,
  title,
  body,
  tone = "dark",
  align = "split",
  className,
}: Props) {
  const muted = tone === "dark" ? "text-white/60" : "text-black/60";
  return (
    <header
      className={`grid gap-6 ${align === "split" ? "lg:grid-cols-[1.5fr_1fr] lg:items-end" : ""} ${className ?? ""}`}
    >
      <div>
        <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.3em] text-asymmetri-red md:text-xs">
          <ScrambleText text={kicker} />
        </p>
        <h2 className="font-chakra-petch text-4xl leading-[0.92] font-bold uppercase md:text-6xl xl:text-7xl">
          <MaskLines
            lines={title.map((l, i) =>
              Array.isArray(l) ? (
                <span key={i} className="text-asymmetri-red">
                  {l[0]}
                </span>
              ) : (
                l
              ),
            )}
          />
        </h2>
      </div>
      {body && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className={`max-w-md font-geist text-base leading-relaxed md:text-lg ${muted}`}
        >
          {body}
        </motion.div>
      )}
    </header>
  );
}
