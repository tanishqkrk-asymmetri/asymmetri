import { type ReactNode } from "react";
import { motion, MotionValue, useTransform } from "motion/react";

export default function RotatingText({
  items,
  pageScroll,
  className = "text-white text-center font-chakra-petch text-6xl",
  containerClassName = "max-h-15 overflow-hidden flex justify-start items-center flex-col",
  yRange = [0, 0.5] as [number, number],
  yOutput = ["0px", "-65px"] as [string, string],
  opacityInput,
  opacityOutput,
}: {
  items: ReactNode[];
  pageScroll: MotionValue<number>;
  className?: string;
  containerClassName?: string;
  yRange?: [number, number];
  yOutput?: [string, string];
  /** Per-item opacity input ranges. Falls back to the original hero defaults. */
  opacityInput?: [number, number][];
  /** Per-item opacity output ranges. Falls back to the original hero defaults. */
  opacityOutput?: [number, number][];
}) {
  return (
    <div className={containerClassName}>
      {items.map((x, i) => {
        const defaultInput: [number, number] =
          i === 0 ? [0.1, 0.3] : i === 1 ? [0.2, 0.3] : [0.1, 0.3];
        const defaultOutput: [number, number] =
          i === 0 ? [1, 0.3] : i === 1 ? [0.3, 1] : [1, 0];

        return (
          <motion.div
            style={{
              y: useTransform(pageScroll, yRange, yOutput),
              // opacity: useTransform(
              //   pageScroll,
              //   opacityInput?.[i] ?? defaultInput,
              //   opacityOutput?.[i] ?? defaultOutput,
              // ),
            }}
            className={className}
            key={i}
          >
            {x}
          </motion.div>
        );
      })}
    </div>
  );
}
