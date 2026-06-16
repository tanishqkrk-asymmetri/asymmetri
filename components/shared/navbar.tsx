"use client";

import ScrambledText from "@/components/ScrambledText";
import Link from "next/link";
import { motion, Variant, Variants } from "motion/react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0.15,
      staggerChildren: 0.08,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: -10, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] },
  },
};

export function Navbar() {
  const links = [
    { label: "About", href: "/#about" },
    { label: "Work", href: "/jobs" },
    { label: "Services", href: "/#services" },
    { label: "Careers", href: "/#careers" },
  ] as const;

  return (
    <header className="fixed top-0 w-full bg-black z-999999999999999 mix-blend-difference">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto flex h-14 w-full  items-center px-6 sm:px-10"
      >
        <motion.div variants={item} className="flex flex-1 items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white/90 transition-colors"
            aria-label="Asymmetri"
          >
            <img className="w-6" src="/logo_mini.png" alt="" />
          </Link>
        </motion.div>

        <nav className="hidden flex-none items-center  md:flex ">
          {links.map((l) => (
            <motion.div key={l.href} variants={item}>
              <Link
                href={l.href}
                className="font-chakra-petch text-[12px] tracking-wide text-white/60 hover:text-white/90 transition-colors"
              >
                <ScrambledText
                  className="sound"
                  style={{
                    fontSize: "1.2em",
                    width: "fit-content",
                    fontFamily: "Chakra Petch",
                    minWidth: "4em",
                  }}
                  scrambleChars=":-="
                >
                  {l.label}
                </ScrambledText>
              </Link>
            </motion.div>
          ))}
        </nav>

        <motion.div
          variants={item}
          className="flex flex-1 items-center justify-end"
        >
          <Link
            href="/#contact"
            className="font-chakra-petch  tracking-wide text-white hover:text-white/90 transition-colors"
          >
            Get in touch
          </Link>
        </motion.div>
      </motion.div>
    </header>
  );
}
