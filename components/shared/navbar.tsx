"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  Variants,
  type MotionValue,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/site-content";
import { practices } from "@/lib/practices";
import { PracticeGlyph } from "@/components/practice/PracticeGlyph";
import { ScrambleText } from "@/components/practice/ScrambleText";

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

const EASE = [0.16, 1, 0.3, 1] as const;

// Pass pageScroll to colour-shift the bar with a scroll-driven page.
// Without it the bar stays solid black (used by the home page).
export function Navbar({ pageScroll }: { pageScroll?: MotionValue<number> }) {
  const links = navLinks;
  const fallbackScroll = useMotionValue(0);
  const scroll = pageScroll ?? fallbackScroll;
  const scrollDriven = Boolean(pageScroll);

  const sectionsIndi = [
    0, 0.18, 0.185, 0.33, 0.335, 0.37, 0.38, 0.55, 0.555, 0.77, 0.775, 0.88,
    0.885,
  ];

  const bg = useTransform(scroll, sectionsIndi, [
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
  const text = useTransform(scroll, sectionsIndi, [
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
  const border = useTransform(scroll, sectionsIndi, [
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
  const homeScroll = scrollDriven && path === "/";

  // ── "What we do" dropdown ───────────────────────────────────────────
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const show = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }, []);
  const hideSoon = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (open) {
        setOpen(false);
        triggerRef.current?.focus();
      }
      setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Lock page scroll behind the mobile menu.
  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [mobileOpen]);

  const isPracticePage = path.startsWith("/what-we-do");

  return (
    <motion.header
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        delay: homeScroll ? 2.5 : 0,
      }}
      style={{
        background: homeScroll
          ? bg
          : path === "/case-studies" || path.startsWith("/case-studies/")
            ? "#ffffff00"
            : "#000000",
        color: homeScroll ? text : "#ffffff",
        borderColor: homeScroll ? border : "#ffffff30",
      }}
      className="fixed top-0 w-full  z-9999999999999  border-b "
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto flex h-14 w-full  items-center px-6 sm:px-10"
      >
        <motion.div variants={item} className="flex flex-1 items-center">
          <a
            href="/"
            className=" items-center gap-2  transition-colors  w-9 p-1 "
            aria-label="Asymmetri"
          >
            <img className="w-6" src="/brand/asymmetri-icon-light.svg" alt="Asymmetri home" width={24} height={24} />
          </a>
        </motion.div>

        <nav aria-label="Primary" className="hidden flex-none items-center md:flex justify-center gap-10 lg:gap-16">
          {links.map((l) =>
            "dropdown" in l && l.dropdown ? (
              <div
                key={l.href}
                className="sound relative"
                onMouseEnter={show}
                onMouseLeave={hideSoon}
              >
                <button
                  ref={triggerRef}
                  type="button"
                  aria-expanded={open}
                  aria-controls="nav-what-we-do"
                  onClick={() => setOpen((o) => !o)}
                  className={`group flex cursor-pointer items-center gap-2 font-chakra-petch text-[16px] tracking-wide transition-opacity hover:opacity-70 ${isPracticePage ? "text-asymmetri-red" : ""}`}
                >
                  {l.label}
                  <span
                    className={`relative inline-block size-2 transition-transform duration-300 ${open ? "rotate-45" : ""}`}
                    aria-hidden
                  >
                    <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current" />
                    <span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-current" />
                  </span>
                </button>
              </div>
            ) : (
              <motion.div key={l.href} className="sound">
                <a
                  href={l.href}
                  className="font-chakra-petch text-[16px] tracking-wide hover:opacity-50 transition-colors "
                >
                  {l.label}
                </a>
              </motion.div>
            ),
          )}
        </nav>

        <motion.div
          variants={item}
          className="flex flex-1 items-center justify-end gap-3"
        >
          <motion.a
            style={{
              background: homeScroll ? text : "#cd1717",
              color: homeScroll ? bg : "#ffffff",
            }}
            href="/contact-us"
            className="font-chakra-petch whitespace-nowrap tracking-wide px-2.5 py-1.5 text-sm sm:p-3 sm:py-2 sm:text-base"
          >
            Get in touch
          </motion.a>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-controls="nav-mobile"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="relative flex size-9 cursor-pointer items-center justify-center md:hidden"
          >
            <span
              className={`absolute h-px w-5 bg-current transition-transform duration-300 ${mobileOpen ? "rotate-45" : "-translate-y-1"}`}
            />
            <span
              className={`absolute h-px w-5 bg-current transition-transform duration-300 ${mobileOpen ? "-rotate-45" : "translate-y-1"}`}
            />
          </button>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setOpen(false)}
              className="fixed inset-x-0 top-14 bottom-0 hidden bg-black/60 backdrop-blur-[2px] md:block"
              aria-hidden
            />
            <motion.div
              key="panel"
              id="nav-what-we-do"
              onMouseEnter={show}
              onMouseLeave={hideSoon}
              initial={{ clipPath: "inset(0 0 100% 0)" }}
              animate={{ clipPath: "inset(0 0 0% 0)" }}
              exit={{ clipPath: "inset(0 0 100% 0)" }}
              transition={{ duration: 0.55, ease: EASE }}
              className="heroDark absolute inset-x-0 top-14 hidden border-b border-white/15 bg-black text-white md:block"
            >
              <MegaPanel path={path} onNavigate={() => setOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile"
            id="nav-mobile"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="heroDark fixed inset-x-0 top-14 bottom-0 overflow-y-auto bg-black text-white md:hidden"
          >
            <MobileMenu path={path} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function MegaPanel({ path, onNavigate }: { path: string; onNavigate: () => void }) {
  return (
    <div className="grid grid-cols-[1fr_repeat(4,minmax(0,1.15fr))] font-chakra-petch">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5, ease: EASE }}
        className="flex flex-col justify-between gap-10 border-r border-white/15 p-8"
      >
        <div className="space-y-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-asymmetri-red">
            What we do
          </p>
          <p className="text-2xl leading-tight font-bold uppercase">
            Four practices.
            <br />
            <span className="text-white/50">One accountable team.</span>
          </p>
        </div>
        <a
          href="/#what-we-do"
          onClick={onNavigate}
          className="group inline-flex w-fit items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/60 hover:text-white"
        >
          Overview
          <span className="transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
        </a>
      </motion.div>
      {practices.map((p, i) => (
        <PracticeLink key={p.slug} p={p} i={i} current={path === p.href} onNavigate={onNavigate} />
      ))}
    </div>
  );
}

function PracticeLink({
  p,
  i,
  current,
  onNavigate,
}: {
  p: (typeof practices)[number];
  i: number;
  current: boolean;
  onNavigate: () => void;
}) {
  const [hover, setHover] = useState(false);
  const [replay, setReplay] = useState(0);
  return (
    <motion.a
      href={p.href}
      onClick={onNavigate}
      onMouseEnter={() => {
        setHover(true);
        setReplay((r) => r + 1);
      }}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      aria-current={current ? "page" : undefined}
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ delay: 0.12 + i * 0.06, duration: 0.55, ease: EASE }}
      className="group relative flex min-h-[19rem] flex-col justify-between gap-8 overflow-hidden border-r border-white/15 p-8 last:border-r-0 focus-visible:outline-none"
    >
      <span className="absolute inset-0 origin-bottom scale-y-0 bg-asymmetri-red transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100" />
      <div className="relative flex items-start justify-between">
        <span className="font-mono text-[11px] tracking-[0.2em] text-asymmetri-red transition-colors group-hover:text-white">
          {p.index}
          {current && (
            <span className="ml-2 inline-block size-1.5 bg-white align-middle" title="You are here" />
          )}
        </span>
        <PracticeGlyph
          kind={p.glyph}
          active={hover}
          color="#ffffff"
          className="size-12 [&_*]:transition-colors"
        />
      </div>
      <div className="relative space-y-3">
        <span className="block text-xl leading-[1.05] font-bold uppercase xl:text-2xl">
          <ScrambleText text={p.name} trigger="none" replayKey={replay} duration={0.5} />
        </span>
        <span className="block font-geist text-sm leading-snug text-white/55 transition-colors group-hover:text-white/90">
          {p.tagline}
        </span>
        <span className="inline-flex items-center gap-2 pt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/50 group-hover:text-white">
          Explore
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </span>
      </div>
    </motion.a>
  );
}

function MobileMenu({ path }: { path: string }) {
  const rest = navLinks.filter((l) => !("dropdown" in l && l.dropdown));
  return (
    <nav aria-label="Mobile" className="flex min-h-full flex-col justify-between gap-10 px-6 py-8 font-chakra-petch">
      <div>
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-asymmetri-red">
          What we do
        </p>
        <ul className="border-t border-white/15">
          {practices.map((p, i) => (
            <motion.li
              key={p.slug}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: EASE }}
              className="border-b border-white/15"
            >
              <a
                href={p.href}
                aria-current={path === p.href ? "page" : undefined}
                className="flex items-center gap-4 py-4"
              >
                <PracticeGlyph kind={p.glyph} active={path === p.href} color="#ffffff" className="size-8 shrink-0" />
                <span className="flex-1">
                  <span className="block font-mono text-[10px] text-asymmetri-red">{p.index}</span>
                  <span className="block text-xl leading-tight font-bold uppercase">{p.name}</span>
                </span>
                <span aria-hidden>→</span>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
      <ul className="space-y-2">
        {rest.map((l, i) => (
          <motion.li
            key={l.href}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 + i * 0.06, duration: 0.5, ease: EASE }}
          >
            <a href={l.href} className="block text-4xl font-bold uppercase">
              {l.label}
            </a>
          </motion.li>
        ))}
      </ul>
    </nav>
  );
}
