import { motion } from "motion/react";
import { memo } from "react";

function Text({
  children,
  delay,
  duration,
  className,
}: {
  children: Readonly<React.ReactElement> | string;
  delay?: number;
  duration?: number;
  className?: string;
  el?: string;
}) {
  return (
    <motion.div
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
        duration: duration && 1.3,
        ease: "easeInOut",
        delay,
      }}
      viewport={
        {
          // once: true,
        }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const T = memo(Text);
