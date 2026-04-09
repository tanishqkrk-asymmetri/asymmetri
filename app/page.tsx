"use client";

// import { AsciiMorph } from "@/lib/asciiMorph";

import random from "random";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import {
  PowerGlitch,
  LayerDefinition,
  GlitchPartialOptions,
} from "powerglitch";

import { useEffect, useRef, useState } from "react";
import { FatCursors } from "@/components/FatCursors";
import { GridScan } from "@/components/GridScan";

export default function Home() {
  const pageRef = useRef(null);

  const { scrollYProgress: pageScroll } = useScroll({
    target: pageRef,
    offset: ["start end", "end start"],
  });

  const [blackBoxSizeState, setBlackBoxSizeState] = useState(0);
  const [loaderPct, setLoaderPct] = useState(0);

  const secondSectionOpacity = useTransform(pageScroll, [0.5, 0.55], [0, 1]);

  const secondSectionRed = useTransform(
    pageScroll,
    [0.55, 0.6],
    ["#ffffff", "#ff0000"],
  );
  const secondSectionGrid = useTransform(pageScroll, [0.6, 0.65], [0, 1]);
  const thirdSectionOpacity = useTransform(pageScroll, [0.65, 0.7], [0, 1]);

  const [randomColorA, setRandomColorA] = useState("#FFFFFF");
  const [randomColorB, setRandomColorB] = useState("#FFFFFF");
  const [randomColorC, setRandomColorC] = useState("#FFFFFF");

  useMotionValueEvent(pageScroll, "change", (latest) => {
    setRandomColorA(random.choice(["#1D1D1D", "#000000"]) || "#FFFFFF");
    setRandomColorB(random.choice(["#1D1D1D", "#000000"]) || "#FFFFFF");
    setRandomColorC(random.choice(["#1D1D1D", "#000000"]) || "#FFFFFF");

    if (latest > 0.63) {
      setRandomColorA("#FFFFFF");
    }
    if (latest > 0.64) {
      setRandomColorB("#FFFFFF");
    }
    if (latest > 0.65) {
      setRandomColorC("#FFFFFF");
    }

    if (latest > 0) {
      setBlackBoxSizeState(0);
    }
    if (latest > 0.2) {
      setBlackBoxSizeState(1);
    }
    if (latest > 0.3) {
      setBlackBoxSizeState(2);
    }
  });

  const glitchImage: GlitchPartialOptions = {
    playMode: "hover",
    optimizeSeo: true,
    createContainers: true,
    hideOverflow: false,
    timing: {
      duration: 2150,
      iterations: 1,
    },
    glitchTimeSpan: {
      start: 0,
      end: 0.7,
    },
    shake: {
      velocity: 15,
      amplitudeX: 0.2,
      amplitudeY: 0.2,
    },
    slice: {
      count: 6,
      velocity: 15,
      minHeight: 0.02,
      maxHeight: 0.15,
      hueRotate: true,
      cssFilters: "",
    },
    pulse: false,
  };

  useEffect(() => {
    // var element = document.querySelector("pre");
    // AsciiMorph(element, { x: 50, y: 25 });

    // First, define some ascii art.
    const art = `
                       .,,uod8B8bou,,.
              ..,uod8BBBBBBBBBBBBBBBBRPFT?l!i:.
         ,=m8BBBBBBBBBBBBBBBRPFT?!||||||||||||
         !...:!TVBBBRPFT||||||||||!!^^""'   ||||
         !.......:!?|||||!!^^""'            ||||
         !.........||||                     ||||
         !.........||||  ##                 ||||
         !.........||||                     ||||
         !.........||||                     ||||
         !.........||||                     ||||
         !.........||||                     ||||
         \`.........||||                    ,||||
          .;.......||||               _.-!!|||||
   .,uodWBBBBb.....||||       _.-!!|||||||||!:'
!YBBBBBBBBBBBBBBb..!|||:..-!!|||||||!iof68BBBBBb....
!..YBBBBBBBBBBBBBBb!!||||||||!iof68BBBBBBRPFT?!::   \`.
!....YBBBBBBBBBBBBBBbaaitf68BBBBBBRPFT?!:::::::::     \`.
!......YBBBBBBBBBBBBBBBBBBBRPFT?!::::::;:!^\`\`;:::       \`.
!........YBBBBBBBBBBRPFT?!::::::::::^''...::::::;         iBBbo.
\`..........YBRPFT?!::::::::::::::::::::::::;iof68bo.      WBBBBbo.
  \`..........:::::::::::::::::::::::;iof688888888888b.     \`YBBBP^'
    \`........::::::::::::::::;iof688888888888888888888b.     \`
      \`......:::::::::;iof688888888888888888888888888888b.
        \`....:::;iof688888888888888888888888888888888899fT!
          \`..::!8888888888888888888888888888888899fT|!^"'
            \`' !!988888888888888888888888899fT|!^"'
                \`!!8888888888888888899fT|!^"'
                  \`!988888888899fT|!^"'
                    \`!9899fT|!^"'
                      \`!^"'
`;

    console.log(art);

    // AsciiMorph.render(art.split("\n"));
    // AsciiMorph.morph(mona);

    PowerGlitch.glitch("#logo", glitchImage);

    let local = 0;
    const incrementTimer = setInterval(() => {
      local = local + 1;
      setLoaderPct(local);
      if (local === 100) {
        clearInterval(incrementTimer);
      }
    }, 10);
    return () => clearInterval(incrementTimer);
  }, []);

  return (
    <main ref={pageRef} className="">
      <motion.div className="relative">
        <motion.div
          style={{
            scale:
              blackBoxSizeState === 0
                ? 0
                : blackBoxSizeState === 1
                  ? 0.25
                  : blackBoxSizeState === 2
                    ? 1.2
                    : 1,
          }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-screen bg-black z-9 h-screen duration-1400 ease-in-out overflow-hidden"
        >
          <motion.div
            initial={{
              width: 0,
            }}
            animate={{
              width: blackBoxSizeState === 2 ? 400 : 0,
            }}
            transition={{
              duration: 0.9,
              delay: 1.3,
            }}
            className="text-left text-xl absolute top-1/2 left-40  h-px bg-white/30  translate-y-8 z-9999 "
          ></motion.div>
          <motion.div
            initial={{
              width: 0,
            }}
            animate={{
              width: blackBoxSizeState === 2 ? 400 : 0,
            }}
            transition={{
              duration: 0.9,
              delay: 1.3,
            }}
            className="text-left text-xl absolute top-1/2 right-40  h-px bg-white/30  translate-y-6 z-9999 "
          ></motion.div>
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: blackBoxSizeState === 2 ? 1 : 0,
            }}
            transition={{
              duration: 1,
              delay: 1.2,
            }}
            className="text-left text-xl absolute text-white top-1/2 left-40 font-chakra-petch -translate-y-8 z-9999 "
          >
            Ideas Built into <br /> Experiences
          </motion.div>
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: blackBoxSizeState === 2 ? 1 : 0,
            }}
            transition={{
              duration: 1,
              delay: 1.8,
            }}
            className="text-left text-xs absolute text-white/50 bottom-20 left-1/2 -translate-x-1/2 font-chakra-petch  z-9999 "
          >
            Collaborative agency for bold ideas, beautiful code and digital
            experiences
          </motion.div>
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: blackBoxSizeState === 2 ? 1 : 0,
            }}
            transition={{
              duration: 1,
              delay: 1.5,
            }}
            className="text-right text-sm absolute text-white top-1/2 right-40 font-chakra-petch  translate-y-8 z-9999 "
          >
            Collaborative agency for bold <br />
            ideas, beautiful code and digital <br /> experiences
          </motion.div>

          <motion.img
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: blackBoxSizeState === 2 ? 1 : 0,
            }}
            transition={{
              duration: 1,
              delay: 0.8,
            }}
            onMouseEnter={() => {
              PowerGlitch.glitch("#logo", glitchImage);
            }}
            src="/logo_light.png"
            alt=""
            id="logo"
            className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-84 z-999999999"
          />

          <div style={{ width: "100%", height: "100vh", position: "relative" }}>
            <GridScan
              scanGlow={0.6}
              scanDirection="backward"
              lineStyle="solid"
              lineJitter={0}
              enableGyro
              scanDuration={2}
              scanDelay={1}
              lineThickness={0.1}
              linesColor="#888888"
              gridScale={0.1}
              scanColor="#cd1717"
              scanOpacity={0.3}
              enablePost
              bloomIntensity={0.08}
              chromaticAberration={0.002}
              noiseIntensity={0.01}
            />
          </div>
        </motion.div>
        <div className="min-h-screen hero bg-white fixed w-full overflow-hidden">
          <FatCursors />
          <motion.img
            onMouseEnter={() => {
              PowerGlitch.glitch("#logo", {
                playMode: "hover",
                optimizeSeo: true,
                createContainers: true,
                hideOverflow: false,
                timing: {
                  duration: 2150,
                  iterations: 1,
                  // easing: "ease-in-out",
                },
                glitchTimeSpan: {
                  start: 0,
                  end: 0.7,
                },
                shake: {
                  velocity: 15,
                  amplitudeX: 0.2,
                  amplitudeY: 0.2,
                },
                slice: {
                  count: 6,
                  velocity: 15,
                  minHeight: 0.02,
                  maxHeight: 0.15,
                  hueRotate: true,
                  cssFilters: "",
                },
                pulse: false,
              });
            }}
            src="/hero_logo.png"
            alt=""
            id="logo"
            className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-120 "
          />

          <div
            id="loader"
            className="absolute top-1/2 left-1/2 translate-y-10 -translate-x-1/2"
          >
            <span className="text-asymmetri-red text-sm font-mono tabular-nums ">
              {loaderPct === 100 ? "Scroll down to continue" : loaderPct}
            </span>
          </div>
        </div>
        <div className="min-h-[200vh]"></div>
      </motion.div>
      <div className="min-h-[400vh]"></div>
      <motion.div
        style={{
          opacity: secondSectionOpacity,
        }}
        className="min-h-screen bg-black z-999 fixed top-0 left-0 w-screen heroDark pointer-events-none"
      >
        <div className="text-white  absolute top-1/2 left-1/2 max-w-md text-xl font-chakra-petch text-center -translate-x-1/2 -translate-y-1/2">
          Creative websites are the intersection of creativity and technicality
          to form bespoke digital experiences that <br />{" "}
          <motion.p
            style={{
              color: secondSectionRed,
            }}
          >
            spark emotion
          </motion.p>
        </div>
        <FatCursors color="#cd171770" scale={0.5} min={10}></FatCursors>
      </motion.div>
      <div
        id="pixelLoader"
        className="min-h-screen w-screen  fixed top-0 left-0 z-999 grid grid-cols-8 grid-rows-4"
      >
        {new Array(32).fill("").map((x, i) => (
          <motion.div
            key={i}
            className=""
            style={{
              opacity: secondSectionGrid,
              background: random.choice([
                randomColorA,
                randomColorB,
                randomColorC,
              ]),
            }}
          ></motion.div>
        ))}
      </div>
      <motion.div
        style={{
          opacity: thirdSectionOpacity,
        }}
        className="min-h-screen bg-white   fixed top-0 left-0 w-screen z-999"
      ></motion.div>
    </main>
  );
}
