"use client";

import { forwardRef, useEffect, useRef } from "react";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import {
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "motion/react";
import { pointOfView } from "@/lib/site-content";

const PROMPT = "Summarise this quarter's exceptions and fix them";
const pad = (n: number) => String(n).padStart(2, "0");
const clamp = (v: number) => Math.min(Math.max(v, 0), 1);

function Shift({
  p,
  at,
  from,
  to,
  index,
}: {
  p: MotionValue<number>;
  at: number;
  from: string;
  to: string;
  index: number;
}) {
  const range = [at, at + 0.06];
  const opacity = useTransform(p, range, [0, 1]);
  const y = useTransform(p, range, [40, 0]);
  const filter = useTransform(p, range, ["blur(8px)", "blur(0px)"]);
  const strike = useTransform(p, [at + 0.05, at + 0.09], ["0%", "100%"]);

  return (
    <motion.li
      style={{ opacity, y, filter }}
      className="grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 gap-y-1 border-t border-white/30 py-3 md:grid-cols-[4rem_16rem_1fr] md:py-4"
    >
      <span className="font-mono text-xs text-white/70">{pad(index + 1)}</span>
      <span className="relative w-fit font-chakra-petch text-base text-white/70 md:text-2xl">
        From {from.toLowerCase()}
        <motion.span
          style={{ width: strike }}
          className="absolute top-1/2 left-0 h-[2px] bg-white"
          aria-hidden
        />
      </span>
      <span className="col-start-2 font-chakra-petch text-lg font-semibold uppercase leading-tight md:col-start-auto md:text-3xl">
        → {to}
      </span>
    </motion.li>
  );
}

/**
 * "AI becomes valuable when it leaves the chat window and enters the operation."
 * A small chat box types a prompt, then tears open into a full-screen red
 * operating layer where the four shifts are written in.
 */
export const PointOfViewScene = forwardRef<HTMLElement>(
  function PointOfViewScene(_, outerRef) {
    const ref = useRef<HTMLDivElement>(null);
    const p = useSectionProgress(ref);

    // Window size as clip-path insets, so it can grow to the full screen.
    const insetX = useMotionValue(28);
    const insetY = useMotionValue(45);
    useEffect(() => {
      const measure = () => {
        const w = Math.min(640, window.innerWidth * 0.88);
        insetX.set(((window.innerWidth - w) / 2 / window.innerWidth) * 100);
        insetY.set(((window.innerHeight - 84) / 2 / window.innerHeight) * 100);
      };
      measure();
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }, [insetX, insetY]);

    const clipPath = useTransform(
      [p, insetX, insetY],
      ([v, x, y]: number[]) => {
        const t = clamp((v - 0.2) / 0.22);
        const e = 1 - Math.pow(1 - t, 3); // ease-out
        const ix = x * (1 - e);
        const iy = y * (1 - e);
        return `inset(${iy}% ${ix}% ${iy}% ${ix}% round ${14 * (1 - e)}px)`;
      },
    );
    const windowBg = useTransform(p, [0.26, 0.42], ["#161616", "#cd1717"]);
    const chatOpacity = useTransform(p, [0.18, 0.24], [1, 0]);
    const headlineOpacity = useTransform(p, [0.15, 0.22], [1, 0]);
    const headlineY = useTransform(p, [0.15, 0.22], [0, -60]);
    const typed = useTransform(p, (v) =>
      PROMPT.slice(0, Math.round(clamp((v - 0.03) / 0.12) * PROMPT.length)),
    );
    const sendScale = useTransform(p, [0.15, 0.17, 0.19], [1, 0.8, 1]);

    const operationOpacity = useTransform(p, [0.42, 0.48], [0, 1]);
    const operationY = useTransform(p, [0.42, 0.48], [60, 0]);
    const stanceOpacity = useTransform(p, [0.9, 0.95], [0, 1]);

    return (
      <section
        ref={(el) => {
          ref.current = el as HTMLDivElement;
          if (typeof outerRef === "function") outerRef(el);
          else if (outerRef) outerRef.current = el;
        }}
        id="point-of-view"
        aria-labelledby="pov-title"
        className="relative h-[300vh] bg-[#0a0a0a] font-chakra-petch text-white"
      >
        <div className="heroDark sticky top-0 h-screen overflow-hidden bg-[#0a0a0a]">
          <motion.p
            style={{ opacity: headlineOpacity }}
            className="absolute top-20 left-6 font-mono text-xs uppercase tracking-[0.25em] text-asymmetri-red md:left-16"
          >
            Our point of view
          </motion.p>

          <motion.h2
            id="pov-title"
            style={{ opacity: headlineOpacity, y: headlineY }}
            className="absolute top-[18%] left-1/2 w-[min(64rem,90vw)] -translate-x-1/2 text-center text-3xl font-semibold uppercase leading-[1.05] md:text-6xl"
          >
            AI becomes valuable when it{" "}
            <span className="text-asymmetri-red">leaves the chat window</span>
          </motion.h2>

          {/* The window that becomes the operation */}
          <motion.div
            style={{ clipPath, background: windowBg }}
            className="absolute inset-0"
            aria-hidden
          />

          <motion.div
            style={{ opacity: chatOpacity }}
            className="absolute top-1/2 left-1/2 flex h-[84px] w-[min(640px,88vw)] -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-[14px] border border-white/20 px-5"
            aria-hidden
          >
            <span className="font-mono text-xs text-white/40">ASK AI…</span>
            <motion.span className="truncate text-base text-white md:text-lg">
              {typed}
            </motion.span>
            <span
              className="fat-cursor !relative inline-block !h-5 !w-2.5 shrink-0 bg-asymmetri-red"
              aria-hidden
            />
            <motion.span
              style={{ scale: sendScale }}
              className="ml-auto flex size-9 shrink-0 items-center justify-center rounded-md bg-white text-black"
            >
              ↵
            </motion.span>
          </motion.div>
          <motion.p
            style={{ opacity: chatOpacity }}
            className="absolute top-[calc(50%+64px)] left-1/2 w-[90vw] -translate-x-1/2 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-white/40"
          >
            The old frame · Intelligence around the edges
          </motion.p>

          {/* Inside the operation */}
          <motion.div
            style={{ opacity: operationOpacity, y: operationY }}
            className="absolute inset-0 flex flex-col justify-center px-6 pt-16 md:px-16"
          >
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.25em] text-white/70">
              The new operating layer
            </p>
            <p className="mb-5 text-4xl font-bold uppercase leading-none md:mb-8 md:text-6xl xl:text-7xl">
              …and enters the operation.
            </p>
            <ol className="border-b border-white/30">
              {pointOfView.shifts.map((s, i) => (
                <Shift
                  key={s.from}
                  p={p}
                  at={0.5 + i * 0.1}
                  from={s.from}
                  to={s.to}
                  index={i}
                />
              ))}
            </ol>
            <motion.div
              style={{ opacity: stanceOpacity }}
              className="mt-5 flex flex-col justify-between gap-2 md:mt-8 md:flex-row md:items-end"
            >
              <p className="max-w-xl text-base text-white/85 md:text-xl">
                {pointOfView.stance}
              </p>
              <p className="text-lg font-bold uppercase md:max-w-md md:text-right md:text-2xl">
                {pointOfView.closer}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    );
  },
);
