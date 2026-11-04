"use client";

import { memo } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { pillars } from "@/lib/site-content";

// Revealed word by word while the hero tears open (legacy scroll fractions).
const START = 0.024;
const END = 0.086;

type Word = { w: string; pillar?: number; red?: boolean; br?: boolean };

const WORDS: Word[] = [
  ..."We solve consequential problems across".split(" ").map((w) => ({ w })),
  { w: "intelligence,", pillar: 0 },
  { w: "process,", pillar: 1 },
  { w: "experience", pillar: 2 },
  { w: "and" },
  { w: "scale.", pillar: 3 },
  ..."A hard problems technology company".split(" ").map((w, i) => ({ w, br: i === 0 })),
  ..."for what's next.".split(" ").map((w, i) => ({ w, red: true, br: i === 0 })),
];

const STEP = (END - START) / WORDS.length;
const at = (i: number) => START + i * STEP;
// When each pillar's word lands.
const PILLAR_AT = pillars.map((_, p) => at(WORDS.findIndex((w) => w.pillar === p) + 1));

function WordComponent({
  word,
  i,
  p,
}: {
  word: Word;
  i: number;
  p: MotionValue<number>;
}) {
  const range = [at(i), at(i + 1)];
  const opacity = useTransform(p, range, [0.08, 1]);
  const filter = useTransform(p, range, ["blur(10px)", "blur(0px)"]);
  const y = useTransform(p, range, ["0.25em", "0em"]);
  const line = useTransform(p, [range[1], range[1] + 0.006], [0, 1]);
  const isPillar = word.pillar !== undefined;
  const [, core, punct] = word.w.match(/^(.*?)([.,]?)$/) ?? [];

  return (
    <>
      {word.br && <br className="hidden md:block" />}
      <motion.span
        style={{ opacity, filter, y }}
        className={`relative inline-block ${word.red ? "text-asymmetri-red" : ""}`}
      >
        {isPillar ? (
          <>
            <span className="relative">
              {core}
              <motion.span
                style={{ scaleX: line }}
                className="absolute inset-x-0 -bottom-[0.06em] h-[0.06em] origin-left bg-asymmetri-red"
                aria-hidden
              />
            </span>
            <sup className="ml-[0.08em] align-super font-mono text-[0.28em] font-normal text-asymmetri-red">
              0{word.pillar! + 1}
            </sup>
            {punct}
          </>
        ) : (
          word.w
        )}
      </motion.span>{" "}
    </>
  );
}

const WordEl = memo(WordComponent);

function PillarComponent({
  i,
  name,
  body,
  p,
}: {
  i: number;
  name: string;
  body: string;
  p: MotionValue<number>;
}) {
  const t = PILLAR_AT[i];
  const fill = useTransform(p, [t - 0.004, t + 0.004], [0, 1]);
  const opacity = useTransform(p, [t - 0.004, t + 0.004], [0.22, 1]);
  const y = useTransform(p, [t - 0.004, t + 0.006], [12, 0]);
  return (
    <motion.li style={{ opacity, y }} className="space-y-2 md:space-y-3">
      <div className="relative h-px bg-current/20">
        <motion.div
          style={{ scaleX: fill }}
          className="absolute inset-x-0 -top-px h-[3px] origin-left bg-asymmetri-red"
        />
      </div>
      <div className="flex items-baseline gap-3 pt-1">
        <span className="font-mono text-[10px] text-asymmetri-red md:text-xs">0{i + 1}</span>
        <h3 className="text-base font-bold uppercase md:text-xl">{name}</h3>
      </div>
      <p className="hidden max-w-[17rem] font-geist text-xs leading-relaxed opacity-65 md:block lg:text-sm">
        {body}
      </p>
    </motion.li>
  );
}

const Pillar = memo(PillarComponent);

/**
 * What the hero's cut opens onto: the manifesto, written in as you scroll,
 * with the four pillars lighting up as each one is named.
 */
export function ManifestoBoard({
  pageScroll,
  color,
  y,
}: {
  pageScroll: MotionValue<number>;
  color: MotionValue<string>;
  y: MotionValue<string>;
}) {
  const metaOpacity = useTransform(pageScroll, [START - 0.006, START + 0.004], [0, 1]);
  return (
    <motion.div
      style={{ color, y }}
      className="absolute inset-0 flex flex-col justify-between px-6 pt-20 pb-8 font-chakra-petch md:px-16 md:pt-24 md:pb-10"
    >
      <motion.div
        style={{ opacity: metaOpacity }}
        className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] opacity-60 md:text-xs"
      >
        <span>
          <span className="text-asymmetri-red">[</span> Manifesto{" "}
          <span className="text-asymmetri-red">]</span>
        </span>
        <span className="hidden sm:inline">Intelligence · Process · Experience · Scale</span>
      </motion.div>

      <h2 className="sr-only">What Asymmetri does</h2>
      <p className="max-w-[24ch] text-balance text-[clamp(1.9rem,4.3vw,4.6rem)] font-semibold leading-[1.04] tracking-[-0.01em] md:max-w-[34ch]">
        {WORDS.map((word, i) => (
          <WordEl key={i} word={word} i={i} p={pageScroll} />
        ))}
      </p>

      <ol className="grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-4 md:gap-x-10">
        {pillars.map((pl, i) => (
          <Pillar key={pl.name} i={i} name={pl.name} body={pl.body} p={pageScroll} />
        ))}
      </ol>
    </motion.div>
  );
}
