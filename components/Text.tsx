import { motion } from "motion/react";
import { memo } from "react";

function Text({
  children,
  delay,
  duration,
  className,
  as,
}: {
  children: Readonly<React.ReactElement> | string | any;
  delay?: number;
  duration?: number;
  className?: string;
  el?: string;
  /** Render as an inline element so it can live inside headings. */
  as?: "div" | "span";
}) {
  const M = as === "span" ? motion.span : motion.div;
  return (
    <M
      initial={{
        filter: "blur(6px)",
        y: 20,
        opacity: 0,
      }}
      whileInView={{
        filter: "blur(0)",
        y: 0,
        opacity: 1,
      }}
      transition={{
        type: "tween",
        duration: duration || 0.3,
        ease: "circInOut",
        delay,
      }}
      viewport={{
        once: true,
      }}
      className={className}
    >
      {children}
    </M>
  );
}

export const T = memo(Text);
