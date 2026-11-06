"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { useReduceMotion as useReducedMotion } from "@/hooks/useReduceMotion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>[]{}=+*#%&";

type Props = {
  text: string;
  className?: string;
  as?: "span" | "div" | "p";
  /** When to play: on mount, when scrolled into view, or only via replayKey. */
  trigger?: "mount" | "view" | "none";
  /** Change this value to replay the scramble (e.g. on hover). */
  replayKey?: unknown;
  duration?: number;
  delay?: number;
  /** Characters used while scrambling. */
  glyphs?: string;
};

/**
 * Text that decodes from random glyphs into its final value, left to right.
 * Server-renders the final text, so crawlers and no-JS visitors read it as is.
 */
export function ScrambleText({
  text,
  className,
  as = "span",
  trigger = "view",
  replayKey,
  duration = 0.9,
  delay = 0,
  glyphs = GLYPHS,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  // Frames are tagged with the text they were made for, so a new `text`
  // prop shows immediately without resetting state in an effect.
  const [frame, setFrame] = useState({ src: text, out: text });
  const display = frame.src === text ? frame.out : text;
  const raf = useRef(0);
  const first = useRef(true);

  const play = () => {
    if (reduce) return;
    cancelAnimationFrame(raf.current);
    const chars = [...text];
    // Each character settles at its own moment, roughly left to right.
    const settle = chars.map(
      (_, i) => (i / Math.max(chars.length, 1)) * 0.7 + Math.random() * 0.3,
    );
    const start = performance.now() + delay * 1000;
    const tick = (now: number) => {
      const t = (now - start) / (duration * 1000);
      if (t < 0) {
        raf.current = requestAnimationFrame(tick);
        return;
      }
      let done = true;
      const out = chars
        .map((c, i) => {
          if (c === " " || t >= settle[i]) return c;
          done = false;
          return glyphs[(Math.random() * glyphs.length) | 0];
        })
        .join("");
      setFrame({ src: text, out });
      if (!done) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (trigger === "mount") play();
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (trigger === "view" && inView) play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replayKey]);

  const Tag = as as "span";
  return (
    <Tag ref={ref as React.RefObject<HTMLSpanElement>} className={className}>
      {display}
    </Tag>
  );
}
