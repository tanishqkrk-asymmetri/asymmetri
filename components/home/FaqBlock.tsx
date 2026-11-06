"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { company, faqs } from "@/lib/site-content";
import { MaskLines } from "@/components/practice/MaskLines";
import { ScrambleText } from "@/components/practice/ScrambleText";
import s from "@/components/home/closing/ending.module.css";

const pad = (n: number) => String(n).padStart(2, "0");
const words = (t: string) => t.split(/\s+/).filter(Boolean);

/** Types `text` out one character at a time; restarts when it changes. */
function useTyped(text: string, reduce: boolean) {
  const [state, setState] = useState({ src: text, len: text.length });
  useEffect(() => {
    if (reduce) return;
    let len = 0;
    const id = window.setInterval(() => {
      len = Math.min(len + 2, text.length);
      setState({ src: text, len });
      if (len >= text.length) window.clearInterval(id);
    }, 22);
    return () => window.clearInterval(id);
  }, [text, reduce]);
  if (reduce || state.src !== text) return reduce ? text : "";
  return text.slice(0, state.len);
}

/**
 * The FAQ as an answer engine. A black prompt bar docks at the top of the
 * chapter (the seam with the founder note above) and stays under the navbar:
 * open a question and it is typed into the prompt, then the answer streams in
 * token by token. Every answer is always in the HTML (collapsed with CSS), so
 * search engines and AI answer engines read them; they are mirrored verbatim
 * in the FAQPage structured data.
 */
export function FaqBlock() {
  const reduce = !!useReducedMotion();
  const [open, setOpen] = useState<number | null>(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const n = faqs.length;

  const query = open === null ? "" : faqs[open].q;
  const typed = useTyped(query, reduce);
  const answerWords = open === null ? 0 : words(faqs[open].a).length;

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const to =
      e.key === "ArrowDown" ? i + 1 : e.key === "ArrowUp" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : null;
    if (to === null) return;
    e.preventDefault();
    buttons.current[(to + n) % n]?.focus();
  };

  return (
    <div id="faq" className="relative bg-white text-black">
      {/* Prompt bar: wipes in from the left at the seam, then docks under the navbar. */}
      <div className="sticky top-14 z-20" aria-hidden>
        <motion.div
          initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
          whileInView={{ clipPath: "inset(0 0% 0 0)" }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="flex h-12 items-center gap-4 bg-black px-6 font-mono text-[11px] text-white md:h-14 md:gap-6 md:px-16 md:text-xs"
        >
          <span className="flex shrink-0 items-center gap-2 uppercase tracking-[0.25em] text-asymmetri-red">
            <span className="flex">
              <span className="h-3 w-[4px] -skew-x-[26deg] bg-asymmetri-red" />
              <span className="ml-[2px] h-3 w-[1.5px] -skew-x-[26deg] bg-asymmetri-red" />
            </span>
            <span className="hidden sm:inline">Ask</span>
          </span>
          <span className="min-w-0 flex-1 truncate text-white/90">
            <span className="text-white/40">&gt; </span>
            {open === null ? (
              <span className="text-white/45">Ask anything, or write to {company.email}</span>
            ) : (
              typed
            )}
            <span className={s.caret} />
          </span>
          <span className="hidden shrink-0 uppercase tracking-[0.25em] text-white/45 md:inline">
            {open === null ? `${pad(n)} answers` : `${answerWords} words · ${Math.max(1, Math.round(answerWords / 4))} s read`}
          </span>
          <span className="flex shrink-0 gap-1">
            {faqs.map((_, i) => (
              <span
                key={i}
                className={`size-1.5 transition-colors duration-300 ${i === open ? "bg-asymmetri-red" : "bg-white/25"}`}
              />
            ))}
          </span>
        </motion.div>
      </div>

      <div className="relative px-6 pt-20 pb-28 md:px-16 md:pt-28 md:pb-36">
        {/* hairline columns continue the ruled sheet */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px)] [background-size:calc(100%/6)_100%]"
        />
        <div className="relative grid gap-14 lg:grid-cols-[1fr_1.45fr] lg:gap-20">
          <div className="lg:sticky lg:top-40 lg:self-start">
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.3em] text-asymmetri-red md:text-xs">
              <ScrambleText text="FAQ" />
            </p>
            <h2
              id="faq-title"
              className="font-chakra-petch text-4xl leading-[0.92] font-bold uppercase md:text-6xl xl:text-7xl"
            >
              <MaskLines lines={[<span key="q" className="text-asymmetri-red">Questions,</span>, "answered."]} />
            </h2>
            <p className="mt-6 max-w-sm font-geist text-base leading-relaxed text-black/60 md:text-lg">
              Something else on your mind? Write to{" "}
              <a
                href={`mailto:${company.email}`}
                className="text-asymmetri-red underline underline-offset-4 hover:no-underline"
              >
                {company.email}
              </a>
              .
            </p>

            {/* Outline counter of the open question. */}
            <div
              aria-hidden
              className="mt-10 hidden items-end gap-3 font-chakra-petch leading-[0.8] font-bold lg:flex"
            >
              <span className="relative block h-[0.8em] overflow-hidden text-[10rem] xl:text-[12rem]">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.span
                    key={open ?? -1}
                    initial={reduce ? false : { y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={reduce ? undefined : { y: "-100%" }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="kit-outline-dark block [-webkit-text-stroke-color:rgba(0,0,0,0.5)]"
                  >
                    {open === null ? "00" : pad(open + 1)}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="pb-3 font-mono text-xs font-normal tracking-[0.25em] text-black/40">/ {pad(n)}</span>
            </div>
          </div>

          <ul className="border-t border-black">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <li key={f.q} className="relative border-b border-black/15">
                  <span
                    aria-hidden
                    className={`absolute top-0 -left-3 h-full w-0.5 origin-top bg-asymmetri-red transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:-left-5 ${isOpen ? "scale-y-100" : "scale-y-0"}`}
                  />
                  <h3>
                    <button
                      ref={(el) => {
                        buttons.current[i] = el;
                      }}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-a-${i}`}
                      id={`faq-q-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      onKeyDown={(e) => onKey(e, i)}
                      className="group flex w-full cursor-pointer items-start justify-between gap-6 py-6 text-left font-chakra-petch text-lg leading-snug font-semibold focus-visible:outline-none md:py-7 md:text-2xl"
                    >
                      <span className="flex gap-4 md:gap-6">
                        <span
                          className={`pt-1.5 font-mono text-[10px] tracking-[0.2em] transition-colors md:pt-2 md:text-xs ${isOpen ? "text-asymmetri-red" : "text-black/40"}`}
                        >
                          {pad(i + 1)}
                        </span>
                        <span className="transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1 group-focus-visible:underline group-focus-visible:decoration-asymmetri-red group-focus-visible:underline-offset-4">
                          {f.q}
                        </span>
                      </span>
                      <span
                        aria-hidden
                        className={`relative mt-1 flex size-7 shrink-0 items-center justify-center border transition-colors duration-300 md:size-8 ${
                          isOpen
                            ? "border-asymmetri-red bg-asymmetri-red text-white"
                            : "border-black/25 group-hover:border-black group-hover:bg-black group-hover:text-white"
                        }`}
                      >
                        <span className="absolute h-px w-3 bg-current" />
                        <span
                          className={`absolute h-3 w-px bg-current transition-transform duration-300 ${isOpen ? "scale-y-0" : ""}`}
                        />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`faq-a-${i}`}
                    role="region"
                    aria-labelledby={`faq-q-${i}`}
                    className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden">
                      <div className={`pb-8 pl-8 md:pl-11 ${isOpen ? s.stream : ""}`}>
                        <p className="max-w-2xl font-geist text-base leading-relaxed text-black/75 md:text-lg">
                          {words(f.a).map((w, k) => (
                            <span key={k}>
                              <span className={s.token} style={{ ["--i" as string]: Math.min(k, 90) }}>
                                {w}
                              </span>{" "}
                            </span>
                          ))}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
