import { motion } from "motion/react";
import { memo } from "react";

function Text({
  children,
  delay,
  className,
}: {
  children: Readonly<React.ReactElement> | string;
  delay?: number;
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
        duration: 0.3,
        ease: "easeInOut",
        delay,
      }}
      viewport={{
        once: false,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const T = memo(Text);
