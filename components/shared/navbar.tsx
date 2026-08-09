"use client";

import ScrambledText from "@/components/ScrambledText";
import Link from "next/link";
import { motion, useTransform, Variant, Variants } from "motion/react";
import { usePathname } from "next/navigation";

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

export function Navbar({ pageScroll }: { pageScroll: any }) {
  const links = [
    { label: "About", href: "/about" },
    { label: "Work", href: "" },
    { label: "Services", href: "/#services" },
    { label: "Careers", href: "/jobs" },
    // { label: "Get in Touch", href: "/#contact" },
  ] as const;

  const sectionsIndi = [
    0, 0.18, 0.185, 0.33, 0.335, 0.36, 0.375, 0.55, 0.555, 0.77, 0.775, 0.88,
    0.885,
  ];

  const bg = useTransform(pageScroll, sectionsIndi, [
    "#000000",
    "#000000",
    "#ffffff",
    "#ffffff",
    "#0a0a0a",
    "#0a0a0a",
    "#ff0000",
    "#ff0000",
    "#000000",
    "#000000",
    "#ffffff",
    "#ffffff",
    "#000000",
  ]);
  const text = useTransform(pageScroll, sectionsIndi, [
    "#ffffff",
    "#ffffff",
    "#000000",
    "#000000",
    "#ffffff",
    "#ffffff",
    "#ffffff",
    "#ffffff",
    "#ffffff",
    "#ffffff",
    "#000000",
    "#000000",
    "#ffffff",
  ]);
  const border = useTransform(pageScroll, sectionsIndi, [
    "#ffffff30",
    "#ffffff30",
    "#00000030",
    "#00000030",
    "#ffffff30",
    "#ffffff30",
    "#ffffff90",
    "#ffffff90",
    "#ffffff90",
    "#ffffff90",
    "#00000030",
    "#00000030",
    "#ffffff30",
  ]);

  const path = usePathname();

  console.log(path);
  return (
    <motion.header
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        delay: 2.5,
      }}
      style={{
        background: path === "/" ? bg : "#FFFFFF",
        color: path === "/" ? text : "#000000",
        borderColor: path === "/" ? border : "#00000050",
      }}
      className="fixed top-0 w-full  z-9999999999  border-b "
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto flex h-14 w-full  items-center px-6 sm:px-10"
      >
        <motion.div variants={item} className="flex flex-1 items-center">
          <Link
            href="/"
            className=" items-center gap-2  transition-colors  w-9 p-1 "
            aria-label="Asymmetri"
          >
            <img className="w-6  " src="/logo_mini.png" alt="" />
          </Link>
        </motion.div>

        <nav className="hidden flex-none items-center  md:flex justify-center   text gap-36">
          {links.map((l) => (
            <motion.div key={l.href} className="sound">
              <Link
                href={l.href}
                className="font-chakra-petch text-[16px] tracking-wide hover:opacity-50 transition-colors "
              >
                {l.label}
                {/* <ScrambledText
                  className="sound"
                  style={{
                    fontSize: "16px",
                    width: "fit-content",
                    fontFamily: "Chakra Petch",
                    minWidth: "3em",
                    color: "inherit",
                  }}
                  scrambleChars=":-="
                >
                  {l.label}
                </ScrambledText> */}
              </Link>
            </motion.div>
          ))}
        </nav>

        <motion.div
          variants={item}
          className="flex flex-1 items-center justify-end"
        >
          <motion.a
            style={{
              background: path === "/" ? text : "#ff0000",
              color: path === "/" ? bg : "#ffffff",
            }}
            href="/contact-us"
            className="font-chakra-petch  tracking-wide  p-3 py-2 "
          >
            Get in touch
          </motion.a>
        </motion.div>
      </motion.div>
    </motion.header>
  );
}
