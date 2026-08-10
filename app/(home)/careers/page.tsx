"use client";

import {
  MotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/button";
import { RiseText } from "@/components/RiseText";
import usePauseScroll from "@/hooks/usePauseScroll";
import { T } from "@/components/Text";
import { ASYM_RED } from "@/lib/color";
import RotatingText from "@/components/fancyText";
import { Laptop } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";

const FRAME_COUNT = 500;
const HERO_FRAME_COUNT = 151;
const CAREERS_FRAME_PATH = "/careers3";
const CAREER_PRINCIPLE_STARTS = [0.68, 0.71, 0.78];
const CAREER_PRINCIPLE_HUES = [
  "hue-rotate(400deg)",
  "hue-rotate(100deg)",
  "hue-rotate(280deg)",
];
const CAREER_PRINCIPLES = [
  {
    title: "Decisions that compound",
    subtitle:
      "You'll make real calls at the stage where judgment matters most, before choices harden into architecture and headcount. We hired you for that judgment; we don't second-guess it.",
  },
  {
    title: "No layer between you and the outcome",
    subtitle:
      "We're small on purpose. What you build reaches real users directly, ships, and gets judged by whether it holds up, not by how it looked in a deck.",
  },
  {
    title: "Range that keeps you sharp",
    subtitle:
      "Different domains, different stacks, a new problem before the last one goes stale. You won't coast, because there's nothing here to coast on.",
  },
];
const BENEFITS = [
  "Work from anywhere",
  "Work from anywhere",
  "Work from anywhere",
];
const heroFrameCache = new Map<string, HTMLImageElement>();

function heroFrameName(frame: number) {
  return `ezgif-frame-${String(frame).padStart(3, "0")}.jpg`;
}

function heroFrameSrc(frame: number) {
  return `${CAREERS_FRAME_PATH}/${heroFrameName(frame)}`;
}

function warmImage(src: string) {
  if (heroFrameCache.has(src)) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    const image = new Image();
    heroFrameCache.set(src, image);
    image.onload = () => {
      const decoded = image.decode?.();
      if (decoded) {
        decoded.catch(() => undefined).finally(resolve);
        return;
      }
      resolve();
    };
    image.onerror = () => resolve();
    image.src = src;
  });
}

function RevealWord({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  children: string;
}) {
  const color = useTransform(progress, range, ["#00000030", "#000000"]);
  return (
    <motion.span style={{ color }} className="mr-[0.28em]">
      {children}
    </motion.span>
  );
}

function ScrollTextReveal({
  progress,
  lines,
  start = 0.67,
  end = 0.7,
}: {
  progress: MotionValue<number>;
  lines: string[];
  start?: number;
  end?: number;
}) {
  const totalWords = lines.reduce(
    (acc, line) => acc + (line ? line.split(" ").length : 0),
    0,
  );
  let wordIndex = 0;
  return (
    <div className="flex flex-col gap-px">
      {lines.map((line, li) => {
        if (!line) return <div key={li} className="h-1" />;
        return (
          <div key={li} className="flex flex-wrap">
            {line.split(" ").map((word, wi) => {
              const i = wordIndex++;
              const s = start + (i / totalWords) * (end - start);
              const e = start + ((i + 1) / totalWords) * (end - start);
              return (
                <RevealWord key={wi} progress={progress} range={[s, e]}>
                  {word}
                </RevealWord>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function CareerPrinciple({
  item,
  index,
  pageScroll,
}: {
  item: (typeof CAREER_PRINCIPLES)[number];
  index: number;
  pageScroll: MotionValue<number>;
}) {
  const start = CAREER_PRINCIPLE_STARTS[index] ?? CAREER_PRINCIPLE_STARTS[0];
  const imageY = useTransform(pageScroll, [start, 1], ["30vh", "-30vh"]);
  const titleY = useTransform(pageScroll, [start, 1], ["-30vh", "50vh"]);
  const subtitleY = useTransform(pageScroll, [start, 1], ["0vh", "-60vh"]);

  return (
    <div className="w-[80vw] flex justify-center items-center relative  min-h-screen px-16 font-chakra-petch gap-8">
      <div className="w-1/3 min-h-screen p-3 flex justify-center items-center relative">
        <div className="min-h-screen bg-black/20 w-px absolute left-0 top-0"></div>
        <div className="min-h-screen bg-black/20 w-px absolute right-0 top-0"></div>
        <motion.img
          style={{
            y: imageY,
            filter: CAREER_PRINCIPLE_HUES[index] ?? CAREER_PRINCIPLE_HUES[0],
          }}
          src="/about2.png"
          className="rounded-lg w-84 -translate-y-36 aspect-square object-cover"
          alt=""
        />
      </div>
      <motion.div className="w-1/3 min-h-screen flex flex-col justify-center items-start pt-16 relative">
        <motion.div
          style={{ y: titleY }}
          className="text-xl font-semibold text-black/50"
        >
          0{index + 1}
        </motion.div>
        <motion.div style={{ y: titleY }} className="text-4xl font-semibold ">
          {item.title}
        </motion.div>
        <div className="min-h-screen bg-black/20 w-px absolute right-0 top-0"></div>
        <div className="min-h-screen bg-black/20 w-px absolute -left-3 top-0"></div>
      </motion.div>
      <div className="w-1/3 min-h-screen flex justify-center items-end pb-36 ">
        <motion.p style={{ y: subtitleY }}>{item.subtitle}</motion.p>
      </div>
    </div>
  );
}

function BenefitItem({
  title,
  index,
  pageScroll,
}: {
  title: string;
  index: number;
  pageScroll: MotionValue<number>;
}) {
  const start = index === 0 ? 0.94 : index === 1 ? 0.95 : 0.96;
  const end = 1;
  const opacity = useTransform(pageScroll, [start, end], [0, 1]);
  const y = useTransform(pageScroll, [start, end], [48, 0]);
  const filter = useTransform(
    pageScroll,
    [start, end],
    ["blur(8px)", "blur(0px)"],
  );

  return (
    <motion.li
      style={{ opacity, y, filter }}
      className="flex items-center gap-6"
    >
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-white/50">
        <Laptop size={50} strokeWidth={1} className="" color="white"></Laptop>
      </div>
      <div className="flex flex-col text-left">
        <span className="text-lg font-semibold text-white">{title}</span>
        <span className="mt-0.5 max-w-[14rem] text-sm leading-snug text-white/50">
          No micromanagement,
          <br />
          no weird late-night messages.
        </span>
      </div>
    </motion.li>
  );
}

export default function Careers() {
  usePauseScroll();
  const pageRef = useRef(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const lastFrameRef = useRef(0);
  const { scrollYProgress: pageScroll } = useScroll({
    target: pageRef,
    // container: containerRef,
    // offset: ["start start", "end end"],
  });

  const [currentFrame, setCurrentFrame] = useState("ezgif-frame-001.jpg");

  useEffect(() => {
    let cancelled = false;
    const frames = Array.from({ length: HERO_FRAME_COUNT }, (_, index) =>
      heroFrameSrc(index + 1),
    );

    let nextFrameIndex = 0;
    const worker = async () => {
      while (!cancelled && nextFrameIndex < frames.length) {
        const src = frames[nextFrameIndex++];
        await warmImage(src);
      }
    };

    const startPreloading = () => {
      const workers = Array.from({ length: 8 }, worker);
      void Promise.all(workers);
    };

    startPreloading();
    return () => {
      cancelled = true;
    };
  }, []);

  useMotionValueEvent(pageScroll, "change", (latest) => {
    const frame = Math.min(
      FRAME_COUNT - 1,
      Math.max(0, Math.round(latest * (FRAME_COUNT - 1))),
    );
    const resolvedFrame = Math.min(frame + 1, HERO_FRAME_COUNT);
    if (lastFrameRef.current !== resolvedFrame) {
      lastFrameRef.current = resolvedFrame;
      setCurrentFrame(heroFrameName(resolvedFrame));
    }
  });

  return (
    <div className=" ">
      <Navbar pageScroll={pageScroll}></Navbar>
      <main className="" ref={pageRef}>
        <motion.div className="min-h-screen flex flex-col justify-center items-center gap-3 bg-black sticky top-0 pt-16  overflow-hidden">
          <motion.img
            ref={imgRef}
            src={"/careers3/" + currentFrame}
            alt=""
            style={{}}
            className="pointer-events-none absolute inset-0 h-full w-full object-contain opacity-60"
            fetchPriority="high"
          />
          <motion.div
            style={{
              y: useTransform(pageScroll, [0, 0.3], ["0px", "-100vh"]),
              // filter: useTransform(
              //   pageScroll,
              //   [0.2, 0.4],
              //   ["blur(0px)", "blur(8px)"],
              // ),
            }}
            className="w-full"
          >
            <RiseText
              className="relative z-10 uppercase text-7xl text-white font-chakra-petch text-left flex justify-start items-start mr-auto ml-36 flex-col"
              lines={["Buidling a", "Culture of", "Brilliant", "Misfits"]}
            />
          </motion.div>
          <motion.div
            style={{
              y: useTransform(pageScroll, [0, 0.5], ["0px", "-500vh"]),
              // filter: useTransform(
              //   pageScroll,
              //   [0.2, 0.5],
              //   ["blur(0px)", "blur(8px)"],
              // ),
            }}
            className="w-full"
          >
            <RiseText
              className="relative z-10 max-w-84 text-white font-chakra-petch text-left flex justify-start items-start ml-auto mr-36 flex flex-col"
              lines={[
                "We're a small team with big potential, we take",
                "the work seriously and ourselves a lot less.",
                "Most of it happens async, feedback flies fast,",
                "and everyone's juggling at least three",
                "projects across different domains at any",
                "given time. We love pulling problems apart",
                "and finding the fix.",
              ]}
              fromY="100%"
              delay={0.9}
              duration={0.3}
            />
          </motion.div>
          <motion.div
            style={{
              y: useTransform(pageScroll, [0.5, 1], ["0px", "-100vh"]),
            }}
            className="relative z-10 my-6 bg-black "
          >
            <Button
              onClick={() => {
                window.location.href = "/careers/positions";
              }}
              className=""
            >
              See open positions
            </Button>
          </motion.div>
        </motion.div>

        <div className="min-h-[400vh] bg-black"></div>

        <motion.div
          style={{
            background: useTransform(
              pageScroll,
              [0.4, 0.45],
              ["#000000", ASYM_RED],
            ),
          }}
          className="bg-black  z-999 min-h-screen border border-white/50 sticky top-0 pl-16 flex justify-between items-start"
        >
          <div className="border-l border-white/50 min-h-screen pl-3 py-36 w-1/4 flex flex-col justify-between relative">
            <div className="flex flex-col">
              <T
                duration={0.9}
                className="text-4xl font-chakra-petch text-white/60"
              >
                Life at
              </T>
              <motion.div
                style={{
                  color: useTransform(
                    pageScroll,
                    [0.4, 0.45],
                    [ASYM_RED, "#ffffff"],
                  ),
                }}
              >
                <T
                  delay={0.3}
                  duration={0.9}
                  className="text-5xl font-chakra-petch "
                >
                  Asymmetri
                </T>
              </motion.div>
            </div>
            <motion.div
              style={{
                opacity: useTransform(pageScroll, [0.38, 0.45], [1, 0]),
              }}
              className="absolute bottom-36 text-white font-chakra-petch"
            >
              No strict 9-to-5. Work when you want, where you want, as long as
              you hit your timelines and keep your team in the loop. No layers,
              no theatre, no waiting your turn. Just people who like this work,
              doing it together.
            </motion.div>
            <motion.div
              style={{
                opacity: useTransform(pageScroll, [0.45, 0.47], [0, 1]),
              }}
              className="absolute bottom-36 text-white font-chakra-petch"
            >
              We’re a close-knit team of designers, developers, and
              problem-solvers who care deeply about the work we do. We take on
              meaningful challenges, move with intent, and stay grounded in
              craft — from the first idea to the final line of code.
            </motion.div>
          </div>
          <div className="w-3/5  min-h-screen grid grid-rows-2 justify-between gap-0 ">
            <motion.div
              style={{
                y: useTransform(pageScroll, [0.31, 0.5], ["100vh", "0vh"]),
              }}
              className="w-full h-full"
            >
              <motion.img
                className="w-full h-full object-cover"
                src="/careersstuff/1.png"
                alt=""
              />
            </motion.div>
            <div className="flex">
              <motion.div
                style={{
                  y: useTransform(pageScroll, [0.4, 0.52], ["100vh", "0vh"]),
                }}
                className=" w-full"
              >
                <motion.img
                  className="w-full h-full object-cover"
                  src="/careersstuff/2.png"
                  alt=""
                />
              </motion.div>
              <motion.div
                style={{
                  y: useTransform(pageScroll, [0.4, 0.51], ["100vh", "0vh"]),
                }}
                className=" w-full"
              >
                <motion.img
                  className="w-full h-full object-cover"
                  src="/careersstuff/4.png"
                  alt=""
                />
              </motion.div>
              <motion.div
                style={{
                  y: useTransform(pageScroll, [0.4, 0.53], ["100vh", "0vh"]),
                }}
                className=" w-full"
              >
                <motion.img
                  className="w-full h-full object-cover"
                  src="/careersstuff/3.png"
                  alt=""
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="top-0 left-0 w-screen h-screen bg-white fixed z-999 rounded-xl flex justify-start items-center "
          style={{
            y: useTransform(pageScroll, [0.54, 0.62], ["100vh", "0vh"]),
            scale: useTransform(pageScroll, [0.54, 0.63], [0.5, 1.1]),
          }}
        >
          <motion.div
            style={{
              x: useTransform(pageScroll, [0.75, 0.9], ["0vw", "-250vw"]),
            }}
            className="flex justify-start items-center"
          >
            <motion.div className="min-w-screen flex justify-center flex-col items-center">
              <motion.div
                style={{
                  opacity: useTransform(
                    pageScroll,
                    [0.62, 0.65, 1],
                    ["0", "1", "1"],
                  ),
                }}
                className="text-black font-chakra-petch text-5xl uppercase text-center font-semibold"
              >
                You don’t want to <br /> work for Asymmetri
              </motion.div>

              <motion.div
                style={{
                  opacity: useTransform(
                    pageScroll,
                    [0.65, 0.67, 1],
                    ["0", "1", "1"],
                  ),
                }}
                className="max-w-5xl mx-auto  font-chakra-petch my-16 font-semibold text-left "
              >
                <ScrollTextReveal
                  progress={pageScroll}
                  start={0.66}
                  end={0.75}
                  lines={[
                    "We work across domains, so no two days look alike. We meet",
                    "problems with a simple belief: everything is figureoutable. If",
                    "you want to explore, do more, and have real, independent input",
                    "in what you make, this is your kind of place. If you're after",
                    "streamlined processes, tidy workflows, and a quiet desk job,",
                    "maybe a startup isn't for you.",
                    "",
                    "We ship fast and work close to founders, without layers of",
                    "confusion in between. We're looking for people with grit, the",
                    "ones who believe in failing faster to succeed sooner. If any of",
                    "that sounds like you, you're exactly where you're supposed to be.",
                  ]}
                />
              </motion.div>
            </motion.div>
            <motion.div
              style={{
                opacity: useTransform(pageScroll, [0.62, 0.63, 1], [0, 1, 1]),
              }}
              className="min-w-screen  min-h-screen flex justify-center items-center"
            >
              {CAREER_PRINCIPLES.map((item, index) => (
                <CareerPrinciple
                  key={item.title}
                  item={item}
                  index={index}
                  pageScroll={pageScroll}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          style={{
            y: useTransform(pageScroll, [0.89, 0.94], ["100vh", "0vh"]),
            scale: useTransform(pageScroll, [0.89, 0.94], [0.5, 1.1]),
          }}
          className="top-0 left-0 w-screen h-screen bg-black fixed z-999 rounded-xl flex justify-center items-center flex-col"
        >
          <div className="flex w-full flex-col items-center justify-center px-6 py-20 font-chakra-petch gap-8 relative">
            <RotatingText
              pageScroll={pageScroll}
              className="text-center text-4xl font-semibold text-white font-chakra-petch md:text-5xl  "
              containerClassName="max-h-14 overflow-hidden space-y-2"
              yRange={[0.94, 0.96]}
              yOutput={["0px", "-55px"]}
              opacityInput={[[0.89, 0.94]]}
              opacityOutput={[[0, 1]]}
              items={["Supporting You To Do", "Your Best Work"]}
            />

            <ul className="flex flex-col gap-12">
              {BENEFITS.map((title, index) => (
                <BenefitItem
                  key={`${title}-${index}`}
                  title={title}
                  index={index}
                  pageScroll={pageScroll}
                />
              ))}
            </ul>
          </div>
          <motion.div
            style={{
              opacity: useTransform(pageScroll, [0.98, 1], [0, 1]),
              y: useTransform(pageScroll, [0.98, 1], [48, 0]),
              filter: useTransform(
                pageScroll,
                [0.98, 1],
                ["blur(8px)", "blur(0px)"],
              ),
            }}
            className="w-full flex justify-center items-center  ungabunga"
          >
            <Button
              onClick={() => {
                window.location.href = "/careers/positions";
              }}
              className="inset-0 w"
            >
              See open positions
            </Button>
          </motion.div>
        </motion.div>

        <div className="min-h-[800vh]"></div>
      </main>
    </div>
  );
}
