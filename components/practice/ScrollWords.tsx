"use client";

import { useRef } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { useSectionProgress } from "@/hooks/useSectionProgress";

function Word({
  p,
  i,
  n,
  word,
  accent,
}: {
  p: MotionValue<number>;
  i: number;
  n: number;
  word: string;
  accent: boolean;
}) {
  const a = 0.15 + (i / n) * 0.55;
  const opacity = useTransform(p, [a, a + 0.06], [0.12, 1]);
  const filter = useTransform(p, [a, a + 0.06], ["blur(6px)", "blur(0px)"]);
  return (
    <motion.span
      style={{ opacity, filter }}
      className={accent ? "text-asymmetri-red" : undefined}
    >
      {word}{" "}
    </motion.span>
  );
}

type Props = {
  /** Wrap words to highlight in *asterisks*. */
  text: string;
  kicker?: string;
  className?: string;
  /** "dark" = white text on black, "light" = black on white. */
  tone?: "dark" | "light";
};

/**
 * A manifesto statement that lights up word by word as it scrolls through
 * the viewport. Pinned for a beat so the sentence can be read whole.
 */
export function ScrollWords({ text, kicker, className, tone = "dark" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const p = useSectionProgress(ref);
  const words = text.split(/\s+/);

  return (
    <section
      ref={ref}
      data-chapter={kicker ?? "Statement"}
      className={`relative h-[220vh] ${tone === "dark" ? "bg-black text-white" : "bg-white text-black"} ${className ?? ""}`}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center px-6 md:px-16">
        {kicker && (
          <p className="mb-8 font-mono text-[10px] uppercase tracking-[0.3em] text-asymmetri-red md:text-xs">
            {kicker}
          </p>
        )}
        <p className="max-w-6xl font-chakra-petch text-3xl font-semibold uppercase leading-[1.05] md:text-6xl xl:text-7xl">
          {words.map((w, i) => {
            const accent = /^\*.*\*[.,;:!?]?$/.test(w);
            return (
              <Word
                key={i}
                p={p}
                i={i}
                n={words.length}
                word={w.replace(/\*/g, "")}
                accent={accent}
              />
            );
          })}
        </p>
      </div>
    </section>
  );
}
