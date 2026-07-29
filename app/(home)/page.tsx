"use client";

import { AsciiMorph } from "@/lib/asciiMorph";
import ReactFlipCard from "reactjs-flip-card";
import random from "random";
import chalk from "chalk";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";

import React, { memo, useEffect, useRef, useState } from "react";
import { FatCursors } from "@/components/FatCursors";
import ScrambledText from "@/components/ScrambledText";
import { Navbar } from "@/components/shared/navbar";
import { MobileTestimonialsCarousel } from "@/components/MobileTestimonialsCarousel";
import { CircularTestimonials } from "@/components/CircularTestimonials";
import { ServicesAccordion } from "@/components/ServicesAccordion";
import playSoundOnHover from "@/lib/sound";
import {
  art,
  art2,
  art3,
  art4,
  art5,
  art6,
  art6Main,
  logo,
  logo2,
  logo2Main,
  logoMain,
  newlogo,
  pc,
} from "@/lib/art";
import { circularTestimonials, returnTestimonials } from "@/lib/Testimonials";
import { T } from "@/components/Text";
import usePauseScroll from "@/hooks/usePauseScroll";
import { ArrowUpRight, ChevronRight } from "lucide-react";

export default function Home() {
  const { loaderPct } = usePauseScroll();

  const pageRef = useRef(null);
  const containerRef = useRef(null);
  const { scrollYProgress: pageScroll } = useScroll({
    target: pageRef,
  });

  const [blackBoxSizeState, setBlackBoxSizeState] = useState(0);
  // ! TURN BACK TO 0

  const [whiteBG, setWhiteBg] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // useEffect(() => {
  //   const tabletQuery = window.matchMedia(
  //     "(min-width: 768px) and (max-width: 1279px)",
  //   );
  //   const updateTabletState = (event?: MediaQueryListEvent) => {
  //     setIsTablet(event ? event.matches : tabletQuery.matches);
  //   };

  //   updateTabletState();
  //   tabletQuery.addEventListener("change", updateTabletState);
  //   return () => tabletQuery.removeEventListener("change", updateTabletState);
  // }, []);

  // useEffect(() => {
  //   const mobileQuery = window.matchMedia("(max-width: 767px)");
  //   const updateMobile = (event?: MediaQueryListEvent) => {
  //     setIsMobile(event ? event.matches : mobileQuery.matches);
  //   };
  //   updateMobile();
  //   mobileQuery.addEventListener("change", updateMobile);
  //   return () => mobileQuery.removeEventListener("change", updateMobile);
  // }, []);

  /** Mobile + tablet: numeric scroll offsets and compact touch layouts */
  const isCompact = isMobile || isTablet;

  /** Viewport height for tablet “below fold” offsets (Motion cannot interpolate calc(dvh) → px reliably). */
  const [tabletBelowFoldPx, setTabletBelowFoldPx] = useState(1400);
  // useEffect(() => {
  //   const update = () =>
  //     setTabletBelowFoldPx(Math.ceil(window.innerHeight * 1.42 + 120));
  //   update();
  //   window.addEventListener("resize", update);
  //   return () => window.removeEventListener("resize", update);
  // }, []);

  useEffect(() => {
    var element = document.querySelector("pre");
    AsciiMorph(element, { x: 0, y: 50 });

    let local = 0;

    const a = setInterval(() => {
      const random = Math.floor(Math.random() * 4);
      console.log(random);
      if (random === 0) {
        AsciiMorph.morph(logoMain);
      }
      if (random === 1) {
        AsciiMorph.morph(logo2Main);
      }
      if (random === 2) {
        AsciiMorph.morph(newlogo);
      }
      if (random === 3) {
        AsciiMorph.morph(art);
      }
      local = local + 1;
      if (local === 600) {
        clearInterval(a);
      }
    }, 3500);
  }, []);

  const secondSectionHeight = useTransform(
    pageScroll,
    [0, 0.1],
    ["0px", "100vh"],
  );

  const secondSectionY = useTransform(
    pageScroll,
    [0.1, 0.18],
    ["0vh", "-150vh"],
  );

  const secondSectionBG = useTransform(
    pageScroll,
    [0.09, 0.1],
    ["#ffffff", "#000000"],
  );
  const secondSectionText = useTransform(
    pageScroll,
    [0.09, 0.1],
    ["#000000", "#ffffff"],
  );

  // const [testimonials, setTestimonials] = useState(
  //   returnTestimonials({
  //     pageScroll,
  //     isCompact,
  //     tabletBelowFoldPx,
  //   }),
  // );

  const [gridColors, setGridColors] = useState({
    a: "#FFFFFF",
    b: "#FFFFFF",
    c: "#FFFFFF",
  });
  const prevBlackBoxRef = useRef(0);
  const prevWhiteBgRef = useRef(false);

  useMotionValueEvent(pageScroll, "change", (latest) => {
    // Only update grid colors when the grid is actually visible (scroll ~0.33–0.42)
    if (latest > 0.3 && latest < 0.45) {
      let nextA = random.choice(["#1D1D1D", "#000000"]) || "#FFFFFF";
      let nextB = random.choice(["#1D1D1D", "#000000"]) || "#FFFFFF";
      let nextC = random.choice(["#1D1D1D", "#000000"]) || "#FFFFFF";

      if (latest > 0.39) nextA = "#FFFFFF";
      if (latest > 0.4) nextB = "#FFFFFF";
      if (latest > 0.41) nextC = "#FFFFFF";

      setGridColors({ a: nextA, b: nextB, c: nextC });
    }

    const nextWhiteBg = latest > 0.41 && latest >= 0.65;
    if (nextWhiteBg !== prevWhiteBgRef.current) {
      prevWhiteBgRef.current = nextWhiteBg;
      setWhiteBg(nextWhiteBg);
    }

    const nextBox = latest > 0.16 ? 2 : latest > 0.1 ? 1 : 0;
    if (nextBox !== prevBlackBoxRef.current) {
      prevBlackBoxRef.current = nextBox;
      setBlackBoxSizeState(nextBox);
    }
  });

  const projects = [
    {
      name: "Prescribe Life",
      type: "Web App",
      thumbnail: "/flip.png",
      desc: "",
      link: "/",
    },
    {
      name: "Reform AI",
      type: "Web App",
      thumbnail: "/flip.png",
      desc: "",
      link: "/",
    },
    {
      name: "Quicli",
      type: "Web App",
      thumbnail: "/flip.png",
      desc: "",
      link: "/",
    },
    {
      name: "DD Group",
      type: "Web App",
      thumbnail: "/flip.png",
      desc: "",
      link: "/",
    },
  ];

  const pointers = [
    {
      title: "INTENT",
      body: "In a world full of noise, we choose clarity. Lean engineering and considered design aren't finishing touches—they're built into every decision from day one.",
    },
    {
      title: "ENGINEERING",
      body: "Beautiful products are built from the inside out. Long before the interface comes to life, we focus on the foundations that make software exceptional: clean architecture, reliable infrastructure, scalable backends, and code that's made to last",
    },
    {
      title: "VELOCITY",
      body: "Speed isn't about rushing, it's about removing friction. Our teams stay small, experienced, and close to the work, allowing ideas to become prototypes and prototypes to reach real users quickly.",
    },
    {
      title: "OWNERSHIP",
      body: "We don't build for you—we build with you. Your goals become our goals, and your success becomes our measure of success. We communicate openly, make decisions together, and take responsibility for the outcome.",
    },
  ];

  return (
    <main ref={containerRef}>
      <Navbar pageScroll={pageScroll} />
      <section ref={pageRef} className="">
        <motion.div className="relative ">
          <motion.div
            style={{
              scale:
                loaderPct === 100
                  ? isMobile
                    ? 1.06
                    : isCompact
                      ? 1.12
                      : 1.2
                  : 0,
            }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-screen bg-black z-9 h-screen duration-1400 ease-in-out overflow-hidden"
          >
            <motion.div
              initial={{
                width: 0,
              }}
              animate={{
                width:
                  loaderPct === 100
                    ? isMobile
                      ? 168
                      : isCompact
                        ? 230
                        : 400
                    : 0,
              }}
              transition={{
                duration: 0.9,
                delay: 1.3,
              }}
              className={`text-left absolute top-1/2 h-px bg-white/30 translate-y-8 z-9999 ${isMobile ? "hidden" : isCompact ? "left-20 text-base" : "left-40 text-xl"}`}
            ></motion.div>
            <motion.div
              initial={{
                width: 0,
              }}
              animate={{
                width:
                  loaderPct === 100
                    ? isMobile
                      ? 168
                      : isCompact
                        ? 230
                        : 400
                    : 0,
              }}
              transition={{
                duration: 0.9,
                delay: 1.3,
              }}
              className={`text-right absolute top-1/2 h-px bg-white/30 translate-y-6 z-9999 ${isMobile ? "hidden" : isCompact ? "right-20 text-base" : "right-40 text-xl"}`}
            ></motion.div>
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: loaderPct === 100 ? 1 : 0,
              }}
              transition={{
                duration: 1,
                delay: 1.2,
              }}
              className={`absolute text-white font-chakra-petch z-[10002] ${isMobile ? "left-1/2 top-[max(6rem,18svh)] w-[min(19rem,calc(100vw-3rem))] -translate-x-1/2 translate-y-0 px-3 text-center text-[15px] leading-snug" : `${isCompact ? "left-20 text-base" : "left-40 text-xl"} text-left top-1/2 -translate-y-8 max-w-[calc(100vw-2.5rem)]`}`}
            >
              Ideas Built into <br /> Experiences
            </motion.div>
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: loaderPct === 100 ? 1 : 0,
              }}
              transition={{
                duration: 1,
                delay: 1.8,
              }}
              className={`absolute text-white/50 left-1/2 -translate-x-1/2 font-chakra-petch z-[10002] ${isMobile ? "top-[calc(52svh+0.5rem)] bottom-auto max-w-[min(18rem,calc(100vw-3rem))] px-5 text-center text-[11px] leading-snug" : isCompact ? "bottom-12 max-w-lg px-8 text-center text-[11px]" : "bottom-20 max-w-none px-0 text-left text-xs"}`}
            >
              Collaborative agency for bold ideas, beautiful code and digital
              experiences
            </motion.div>
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: loaderPct === 100 ? 1 : 0,
              }}
              transition={{
                duration: 1,
                delay: 1.5,
              }}
              className={`text-right absolute text-white top-1/2 font-chakra-petch translate-y-8 z-9999 ${isMobile ? "hidden" : isCompact ? "right-20 text-xs" : "right-40 text-sm"}`}
            >
              Collaborative agency for bold <br />
              ideas, beautiful code and digital <br /> experiences
            </motion.div>

            <motion.img
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: loaderPct === 100 ? 1 : 0,
              }}
              transition={{
                duration: 1,
                delay: 0.8,
              }}
              onMouseEnter={() => {
                // PowerGlitch.glitch("#logo", glitchImage);
              }}
              src="/logo_light.png"
              alt=""
              id="logo"
              className={`absolute left-1/2 -translate-x-1/2 z-[10003] ${isMobile ? "top-[42%] -translate-y-1/2 w-[min(13rem,calc(100vw-3rem))] max-w-[calc(100vw-3rem)]" : `top-1/2 -translate-y-1/2 ${isCompact ? "w-64 max-w-[min(21rem,85vw)]" : "w-84"}`}`}
            />

            <div
              className="relative z-0 isolate "
              style={{ width: "100%", height: "100vh", position: "relative" }}
            >
              {/* // ! TURN BACK ON */}
              {/* <MemoGridBG
                scanGlow={isMobile ? 0.92 : 0.6}
                scanDirection="backward"
                lineStyle="solid"
                lineJitter={0}
                enableGyro={!isCompact}
                scanDuration={isMobile ? 1.85 : 2}
                scanDelay={1}
                lineThickness={isMobile ? 0.32 : 0.1}
                linesColor={isMobile ? "#d4d4d4" : "#888888"}
                gridScale={isMobile ? 0.11 : 0.1}
                scanColor="#cd1717"
                scanOpacity={isMobile ? 0.62 : 0.3}
                enablePost={!isCompact}
                bloomIntensity={0.08}
                chromaticAberration={0.002}
                noiseIntensity={isMobile ? 0.006 : 0.01}
              /> */}
            </div>
          </motion.div>
          <div className="min-h-screen hero bg-white fixed w-full overflow-hidden">
            {/* {!isMobile && <FatCursors scale={1} />} */}
            <FatCursors scale={1} />{" "}
            <motion.img
              src="/hero_logo.png"
              alt=""
              id="logo"
              className={`absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 ${isMobile ? "w-[min(100%,17rem)] max-w-[calc(100vw-3rem)]" : isCompact ? "w-96" : "w-120"}`}
            />
            <div className="text-asymmetri-red absolute top-[60%] left-1/2  -translate-x-1/2 font-bold font-chakra-petch text-xl">
              {loaderPct === 100 ? "100" : loaderPct}%
            </div>
          </div>
          <div className="min-h-[400vh]"></div>
        </motion.div>

        <motion.div
          style={{
            height: secondSectionHeight,
            background: secondSectionBG,
            overflow: "hidden",
          }}
          transition={{
            ease: "backIn",
          }}
          className=" bg-white z-999 fixed   left-0  min-w-screen w-screen  pointer-events-none top-1/2 translate-y-[-50%] "
        >
          <motion.div
            style={{
              color: secondSectionText,
              y: secondSectionY,
              // wordSpacing: "10px",
            }}
            className={`text-black leading-12  absolute top-1/2 left-1/2 font-chakra-petch text-center -translate-x-1/2 -translate-y-1/2 px-6 ${isMobile ? "max-w-[min(18rem,calc(100vw-3rem))] px-6 text-base leading-relaxed" : isCompact ? "max-w-lg text-lg" : "max-w-2xl text-4xl font-semibold flex-wrap flex justify-center items-center gap-16"}`}
          >
            <motion.div>
              <FE text="Not" range={[0.015, 0.02]} pageScroll={pageScroll}></FE>
              <FE
                text="just"
                range={[0.02, 0.025]}
                pageScroll={pageScroll}
              ></FE>
              <FE
                text="another"
                range={[0.025, 0.03]}
                pageScroll={pageScroll}
              ></FE>

              <FE
                text="software"
                range={[0.03, 0.035]}
                pageScroll={pageScroll}
              ></FE>
              <FE
                text="company"
                range={[0.035, 0.04]}
                pageScroll={pageScroll}
              ></FE>

              {/* A place where curious people build things they're proud of */}
              <FE text="A" range={[0.04, 0.045]} pageScroll={pageScroll}></FE>
              <FE
                text="place"
                range={[0.045, 0.05]}
                pageScroll={pageScroll}
              ></FE>
              <FE
                text="where"
                range={[0.05, 0.055]}
                pageScroll={pageScroll}
              ></FE>
              <FE
                text="curious"
                range={[0.055, 0.06]}
                pageScroll={pageScroll}
              ></FE>
              <FE
                text="people"
                range={[0.06, 0.065]}
                pageScroll={pageScroll}
              ></FE>
              <FE
                text="build"
                range={[0.065, 0.07]}
                pageScroll={pageScroll}
              ></FE>
              <div className="text-asymmetri-red">
                <FE
                  text="things"
                  range={[0.07, 0.075]}
                  pageScroll={pageScroll}
                ></FE>
                <FE
                  text="they're"
                  range={[0.075, 0.08]}
                  pageScroll={pageScroll}
                ></FE>
                <FE
                  text="proud"
                  range={[0.08, 0.085]}
                  pageScroll={pageScroll}
                ></FE>
                <FE
                  text="of."
                  range={[0.085, 0.09]}
                  pageScroll={pageScroll}
                ></FE>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          transition={{
            ease: "easeInOut",
          }}
          className=" relative min-w-screen w-screen  z-999999 "
        >
          <MemoizedTransitionGrid mode={"dtl"} pageScroll={pageScroll} />

          <motion.div
            className={`bg-white font-chakra-petch --overflow-y-auto z-999999999999  relative min-h-screen `}
          >
            <div className="px-26">
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  delay: 1.2,
                }}
                className={`text-black  duration-200 py-36     ${isMobile ? "text-3xl min-h-40 gap-3" : isCompact ? "text-4xl --min-h-52 gap-4" : "text-6xl --min-h-78 gap-6"} relative border-x border-black/20`}
              >
                <motion.div className="w-full   space-y-6 px-8">
                  <motion.div
                    style={{
                      y: useTransform(pageScroll, [0.1, 0.35], [300, -700]),
                    }}
                    className="text-asymmetri-red font-semibold text-right uppercase"
                  >
                    <T>Bring us the challenge.</T>
                    <span className="pr-16 inline-block">
                      <T className="max-h-fit" delay={0.2}>
                        ambitious product, tangle
                      </T>
                    </span>{" "}
                    <br />
                    <span className="pr-16 inline-block">
                      <T delay={0.4}>roadmap, tight deadline.</T>
                    </span>
                  </motion.div>
                  <motion.div
                    style={{
                      y: useTransform(pageScroll, [0.2, 0.3], [0, 0]),
                    }}
                    className="text-xl max-w-82 space-y-6"
                  >
                    <T delay={0} className="">
                      We cut through your chaos. Build fast, build smart, and
                      ship products that are recklessly good.
                    </T>
                    <T delay={0.1}>
                      <button className="text-xl bg-white border rounded-sm  p-2 duration-150 hover:bg-asymmetri-red hover:text-white cursor-pointer">
                        Discuss Project
                      </button>
                    </T>
                  </motion.div>
                </motion.div>
                <motion.div
                  style={{
                    y: useTransform(pageScroll, [0.15, 0.33], [500, -500]),
                  }}
                  className=" mt-16   mx-auto w-full "
                >
                  <ServicesAccordion isCompact={isCompact} />
                </motion.div>
                <div className=" mt-16  flex flex-col justify-center items-center mx-auto w-full space-y-16">
                  <motion.div
                    style={{
                      y: useTransform(pageScroll, [0.31, 0.32], [100, -500]),
                    }}
                  >
                    <T delay={0.3}>
                      <div className="text-4xl font-semibold text-center">
                        More than 50 clients <br /> have partnered with us
                      </div>
                    </T>
                  </motion.div>
                  {[1, 2, 3].map((x, i) => {
                    return (
                      <motion.div
                        style={{
                          y: useTransform(
                            pageScroll,
                            [0.26, 0.29 + (i + 1) / 100],
                            [500, -300],
                          ),
                        }}
                        initial={{
                          opacity: 0,
                        }}
                        whileInView={{
                          opacity: 1,
                        }}
                        transition={{
                          delay: 0.1 * x,
                        }}
                        key={x}
                        className="grid grid-cols-7 w-full justify-items-center "
                      >
                        {[
                          {
                            name: "DD Group",
                            logo: "DD Group Internal Designs.png",
                          },
                          {
                            name: "Kommerz OS",
                            logo: "Komerz Frame.svg",
                          },
                          {
                            name: "Prescribe Life",
                            logo: "Prescribe Life Frame.jpg",
                          },
                          {
                            name: "Quicli",
                            logo: "Quicli Layer 2.jpg",
                          },
                          {
                            name: "Reform",
                            logo: "Reform Logos Final.webp",
                          },
                          {
                            name: "Sochcast/Campus Gal",
                            logo: "Sochcast Campus Gal Logo.png",
                          },
                          {
                            name: "Zimkey",
                            logo: "Zimkey Final Logo.png",
                          },
                        ].map((x, i) => {
                          return (
                            <T
                              delay={0.1 + (i + 1) / 10}
                              key={x.logo}
                              className="flex justify-center items-center w-full h-full p-6 "
                            >
                              <img
                                style={{
                                  scale: x.name === "Reform" ? 2 : 1,
                                  borderRadius:
                                    x.name === "Prescribe Life" ? "6px" : "0px",
                                }}
                                src={"/logos/" + x.logo}
                                className="w-24 "
                              />
                            </T>
                          );
                        })}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </motion.div>
          <MemoizedTransitionGrid mode={"ltd"} pageScroll={pageScroll} />

          <div className="bg-[#0a0a0a] z-9999999999 relative ">
            <motion.div className="w-full   space-y-6 px-8 text-6xl font-chakra-petch">
              <motion.div
                style={{
                  y: useTransform(pageScroll, [0.45, 0.51], [100, -300]),
                }}
                className=" text-asymmetri-red font-semibold text-left uppercase px-36"
              >
                <motion.div>
                  <T delay={0.1} className="pl-36">
                    The part where we
                  </T>
                </motion.div>
                <motion.span className=" inline-block">
                  <T className="max-h-fit" delay={0.2}>
                    Stop talking and show you
                  </T>
                </motion.span>{" "}
                <br />
                <span className=" inline-block">
                  <T delay={0.3}>our best work</T>
                </span>
              </motion.div>
              <motion.div
                style={{
                  y: useTransform(pageScroll, [0.46, 0.48], [300, -100]),
                }}
                className="text-xl max-w-82 space-y-6 w-full ml-auto mr-36 "
              >
                <T
                  delay={0.5}
                  className="text-white
                "
                >
                  We partner with companies that care about being great at what
                  they ship. From early-stage founders to fast-growing teams and
                  established enterprises.
                </T>
              </motion.div>
            </motion.div>
            <TransitionGrid pageScroll={pageScroll} mode="dtr" />

            <div className="min-h-[200vh] bg-asymmetri-red  relative ">
              {projects.map((x, i) => {
                return (
                  <motion.div
                    key={x.name}
                    className="min-h-screen -translate-y-1/2 fixed top-1/2 left-1/2 flex justify-center items-center  w-1/4 flex-col gap-6 group cursor-pointer"
                    style={{
                      zIndex: 5 - i,
                      y: useTransform(
                        pageScroll,
                        [0.53, 0.54, 0.55],
                        [1000, 500, 0],
                      ),
                      left: useTransform(
                        pageScroll,
                        [0.57, 0.59],
                        [
                          "50%",
                          i === 0
                            ? "0%"
                            : i === 1
                              ? "25%"
                              : i === 2
                                ? "50%"
                                : i === 3
                                  ? "75%"
                                  : "",
                        ],
                      ),
                      x: useTransform(pageScroll, [0.57, 0.59], ["-50%", "0%"]),
                    }}
                  >
                    <motion.div
                      style={{
                        left: "0%",
                        opacity: useTransform(
                          pageScroll,
                          [0.56, 0.57],
                          ["0", "1"],
                        ),
                      }}
                      className="fixed top-0  h-screen w-[0.5px] bg-white/50 opacity-0 group-hover:opacity-100 duration-200"
                    ></motion.div>
                    <motion.div
                      style={{
                        left: "100%",
                        opacity: useTransform(
                          pageScroll,
                          [0.61, 0.62],
                          ["0", "1"],
                        ),
                      }}
                      className="fixed top-0  h-screen w-[0.5px] bg-white/50  duration-200"
                    ></motion.div>

                    <motion.div
                      initial={{
                        rotate:
                          i === 0
                            ? "3deg"
                            : i === 1
                              ? "-3deg"
                              : i === 2
                                ? "5deg"
                                : i === 3
                                  ? "-5deg"
                                  : "",
                      }}
                      whileHover={{
                        rotate: "0deg",
                      }}
                      key={x.name}
                      className="border border-white  rounded-2xl overflow-hidden  bg-asymmetri-red  z-4 relative"
                    >
                      <motion.img
                        style={{
                          scale: useTransform(
                            pageScroll,
                            [0.53, 0.57, 0.59],
                            [3, 2, 1.5],
                          ),
                        }}
                        src="/card.png"
                        className="w-72  translate-x-8 z-999999 relative bg-asymmetri-red group-hover:opacity-0 duration-200"
                        alt=""
                      />
                      <motion.img
                        src={x.thumbnail}
                        className="w-72   absolute top-0 left-0 z-10 h-full"
                        alt=""
                      />
                    </motion.div>
                    <motion.div
                      className="text-xl text-white font-chakra-petch"
                      style={{
                        opacity: useTransform(
                          pageScroll,
                          [0.55, 0.56],
                          ["0", "1"],
                        ),
                      }}
                    >
                      {x.name}
                    </motion.div>
                    <motion.div
                      className="text-lg text-white/70 font-chakra-petch -translate-y-6"
                      style={{
                        opacity: useTransform(
                          pageScroll,
                          [0.56, 0.57],
                          ["0", "1"],
                        ),
                      }}
                    >
                      {x.type}
                    </motion.div>
                    <motion.div
                      style={{
                        scale: useTransform(
                          pageScroll,
                          [0.56, 0.561],
                          ["0", "1"],
                        ),
                      }}
                      className="absolute bottom-3 group-hover:opacity-100 opacity-0 duration-250 border-white border-2 rounded-full hover:bg-white hover:text-black cursor-pointer group"
                    >
                      <ArrowUpRight
                        className="text-white hover:text-black duration-150"
                        size={120}
                        strokeWidth={0.5}
                      ></ArrowUpRight>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
          <div className="min-h-screen bg-asymmetri-red"></div>
        </motion.div>
        <div className="h-screen min-h-[600vh] bg-black z-999999  text-white flex justify-center items-center divide-x divide-white/50 relative">
          <motion.div
            className="w-[50%]  h-full flex justify-center 
          items-start bg-black relative"
          >
            <motion.div
              style={{
                width: useTransform(
                  pageScroll,
                  [0.79, 0.83],
                  ["50vw", "100vw"],
                ),
                // background: useTransform(
                //   pageScroll,
                //   [0.87, 0.88],
                //   ["#000000", "#ffffff"],
                // ),
              }}
              className="absolute bg-black top-0 left-0 h-full z-999999999 text-xs border-r border-white/50"
            ></motion.div>
            <motion.pre
              style={{
                color: useTransform(
                  pageScroll,
                  [0.8, 0.82],
                  ["#ffffff", "#ff0000"],
                ),
                x: useTransform(pageScroll, [0.82, 0.83], ["0%", "50%"]),

                fontSize: "0.6em",
              }}
              className="w-full  sticky top-16 z-999999999 ascii-element "
            ></motion.pre>
          </motion.div>
          <div className="w-[50%] h-full relative">
            <div className=" text-white font-semibold text-left uppercase font-chakra-petch text-4xl p-8 sticky top-16 min-h-screen">
              <T delay={0.3}>ALL WORK AND NO PLAY MAKES</T>
              <T delay={0.5}>BORING SOFTWARE. WE HAVE FUN</T>
              <T delay={0.8}>BUILDING GREAT THINGS.</T>
            </div>
            <div className="flex flex-col ">
              {pointers.map((x, i) => {
                return (
                  <div
                    style={{
                      top:
                        i === 0
                          ? "15em"
                          : i === 1
                            ? "20em"
                            : i === 2
                              ? "25em"
                              : i === 3
                                ? "30em"
                                : "",
                    }}
                    key={x.title}
                    id={x.title}
                    className="sticky border-t border-white/50 p-6 font-chakra-petch min-h-screen bg-black"
                  >
                    <T delay={0.1} className="text-xl">
                      {x.title}
                    </T>
                    <T delay={0.3} className="text-white/60">
                      {x.body}
                    </T>
                  </div>
                );
              })}
              <div className="min-h-screen"></div>
            </div>
          </div>
        </div>
        <motion.div className="min-h-[300vh] bg-white relative z-99999999 flex flex-col justify-start items-center p-6">
          <motion.div
            style={{
              y: useTransform(pageScroll, [0.89, 0.92], ["300px", "0px"]),
            }}
            className="text-5xl font-chakra-petch text-asymmetri-red font-bold "
          >
            Hi I'm Nandagopal, founder of{" "}
          </motion.div>
          <motion.div
            style={{
              y: useTransform(pageScroll, [0.92, 0.96], ["100vh", "-10vh"]),
              // opacity: useTransform(pageScroll, [0.95, 0.96], ["1", "1"]),
            }}
            className="text-6xl font-chakra-petch text-black max-w-2/3 font-bold fixed top-36 left-6 z-999999999"
          >
            Asymmetri was never meant to be just another software company. It’s
            a place where smart, curious people build things they’re proud of,
            with clarity, ownership, and a little bit of fun.
          </motion.div>
          <motion.div
            style={{
              y: useTransform(pageScroll, [0.94, 0.97], ["600px", "0px"]),
              // opacity: useTransform(pageScroll, [0.97, 0.98], ["1", "1"]),
            }}
            className="text-xl font-chakra-petch text-black/70 max-w-sm ml-auto font-semibold fixed bottom-26  right-16 z-999999999"
          >
            <div>
              We keep things flat and lean, move fast, and work closely with
              clients who believe in collaboration over chaos.If you’re building
              something meaningful, we’d love to be part of it.
            </div>
            <button className="border-asymmetri-red border-2  text-asymmetri-red p-3 py-2 mt-6 cursor-pointer hover:bg-asymmetri-red hover:text-white duration-300">
              Get in Touch
            </button>
          </motion.div>
          <motion.img
            style={{
              y: useTransform(pageScroll, [0.89, 0.92], ["100vh", "0vh"]),
              filter: useTransform(
                pageScroll,
                [0.93, 0.99, 1],
                ["blur(0px)", "blur(6px)", "blur(8px)"],
              ),
            }}
            src="/nand3.jpg"
            className="w-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            alt=""
          />
          <motion.img
            style={{
              y: useTransform(pageScroll, [0.89, 0.91], ["500px", "100px"]),
            }}
            src="/logo_dark.png"
            className=""
            alt=""
          />
        </motion.div>
        <motion.div
          style={{
            // y: "95%",
            y: useTransform(pageScroll, [0.85, 0.9], ["100vh", "0vh"]),
          }}
          className=" z-1000000000 w-screen fixed top-0 left-0"
        >
          <CircularTestimonials
            items={circularTestimonials}
            pageScroll={pageScroll}
          />
        </motion.div>
        <div
          style={{
            minHeight: (circularTestimonials.length / 2) * 100 + "vh",
          }}
          className=""
        ></div>
      </section>
      {/* <motion.div
        style={{
          scale: useTransform(pageScroll, [0.995, 0.999], [0.8, 1]),
        }}
        className="min-h-screen bg-asymmetri-red fixed top-0 left-0 z-999999999999 w-screen h-screen"
      ></motion.div> */}
    </main>
  );
}

const MemoizedTransitionGrid = memo(TransitionGrid);

function TransitionGrid({
  mode,
  pageScroll,
  height = "150vh",
}: {
  mode: "ltd" | "dtl" | "dtr";
  pageScroll: any;
  height?: string;
}) {
  function jitteredRange(
    i: number,
    baseStart: number,
    startSpread = 0.006,
    minDuration = 0.004,
    maxDuration = 0.007,
  ): number[] {
    const startNoise = Math.abs(Math.sin(i * 12.9898 + 78.233)) % 1;
    const durationNoise = Math.abs(Math.sin(i * 39.3467 + 11.135)) % 1;
    const start = baseStart + (startNoise - 0.5) * startSpread;
    const duration = minDuration + durationNoise * (maxDuration - minDuration);

    return [Number(start.toFixed(3)), Number((start + duration).toFixed(3))];
  }

  function returnBoxOpacity(i: number): number[] {
    const setA = [6, 5, 43, 57, 35, 53, 8, 38, 60, 61, 16, 4, 46, 85, 14, 1];
    const setB = [
      7, 97, 98, 39, 40, 70, 19, 48, 74, 23, 27, 71, 67, 90, 82, 42, 81, 90, 91,
      92, 17,
    ];
    const setC = [
      25, 62, 75, 31, 94, 86, 10, 18, 47, 3, 51, 83, 93, 94, 95, 33, 96, 99,
    ];
    const setD = [84, 21, 9, 64, 63, 98, 30, 32, 12, 68, 36, 22, 41, 2, 20, 79];
    const setE = [26, 96, 17, 54, 72, 11, 15, 34, 56, 95, 93, 78];
    const setF = [0, 13, 24, 52, 89, 28, 69, 80, 65, 77, 45, 37, 73, 50];
    const setG = [91, 66, 97, 76, 55, 59, 29, 87, 88, 99, 58, 49, 92, 44];

    let value: number[] = [0, 0];

    if (setA.includes(i)) {
      value = jitteredRange(i, 0.13, 0.008, 0.01, 0.02);
    } else if (setB.includes(i)) {
      value = jitteredRange(i, 0.11, 0.006, 0.008, 0.014);
    } else if (setC.includes(i)) {
      value = jitteredRange(i, 0.16, 0.006, 0.007, 0.012);
    } else if (setD.includes(i)) {
      value = jitteredRange(i, 0.15, 0.006, 0.007, 0.012);
    } else if (setE.includes(i)) {
      value = jitteredRange(i, 0.169, 0.006, 0.007, 0.012);
    } else if (setF.includes(i)) {
      value = jitteredRange(i, 0.19, 0.006, 0.007, 0.012);
    } else if (setG.includes(i)) {
      value = jitteredRange(i, 0.15, 0.008, 0.012, 0.02);
    }
    return value;
  }
  function returnBoxOpacity2(i: number): number[] {
    const setA = [
      21, 9, 68, 36, 2, 12, 98, 64, 41, 63, 84, 32, 30, 20, 79, 22, 6,
    ];
    const setB = [
      19, 82, 91, 70, 40, 90, 4, 2, 90, 92, 5, 74, 27, 39, 67, 48, 1, 3, 97, 81,
      23, 98, 7, 71, 42,
    ];
    const setC = [
      25, 99, 83, 33, 86, 3, 51, 47, 96, 18, 10, 94, 75, 95, 62, 94, 93, 31,
    ];
    const setD = [60, 46, 53, 16, 14, 4, 35, 38, 43, 85, 8, 61, 57];
    const setE = [95, 26, 11, 93, 17, 96, 15, 54, 56, 78, 34, 72];
    const setF = [89, 69, 28, 52, 45, 80, 37, 50, 13, 0, 65, 77, 24, 73];
    const setG = [59, 49, 55, 58, 92, 91, 88, 99, 66, 76, 44, 29, 87, 97];

    let value: number[] = [0, 0];

    if (setA.includes(i)) {
      value = jitteredRange(i, 0.3, 0.006, 0.007, 0.012);
    } else if (setC.includes(i)) {
      value = jitteredRange(i, 0.3, 0.006, 0.007, 0.012);
    } else if (setB.includes(i)) {
      value = jitteredRange(i, 0.32, 0.006, 0.007, 0.012);
    } else if (setF.includes(i)) {
      value = jitteredRange(i, 0.31, 0.006, 0.007, 0.012);
    } else if (setE.includes(i)) {
      value = jitteredRange(i, 0.28, 0.006, 0.007, 0.012);
    } else if (setD.includes(i)) {
      value = jitteredRange(i, 0.29, 0.006, 0.007, 0.012);
    } else if (setG.includes(i)) {
      value = jitteredRange(i, 0.28, 0.006, 0.007, 0.012);
    }
    return value;
  }
  function returnBoxOpacity3(i: number): number[] {
    const setA = [43, 57, 35, 53, 8, 38, 60, 61, 16, 4, 46, 85, 14];
    const setB = [
      1, 2, 3, 5, 6, 7, 11, 19, 23, 27, 39, 40, 42, 48, 67, 70, 71, 74, 81, 82,
      90, 91, 92, 97, 98,
    ];
    const setC = [
      10, 18, 25, 31, 33, 47, 51, 62, 75, 83, 86, 93, 94, 95, 96, 99,
    ];
    const setD = [9, 12, 20, 21, 22, 30, 32, 36, 41, 63, 64, 68, 79, 84];
    const setE = [15, 17, 26, 34, 54, 56, 72, 78];
    const setF = [0, 13, 24, 52, 89, 28, 69, 80, 65, 77, 45, 37, 73, 50];
    const setG = [29, 44, 49, 55, 58, 59, 66, 76, 87, 88];

    let value: number[] = [0, 0];

    if (setA.includes(i)) {
      value = jitteredRange(i, 0.54, 0.006, 0.007, 0.012);
    } else if (setC.includes(i)) {
      value = jitteredRange(i, 0.51, 0.006, 0.007, 0.012);
    } else if (setB.includes(i)) {
      value = jitteredRange(i, 0.54, 0.006, 0.007, 0.012);
    } else if (setF.includes(i)) {
      value = jitteredRange(i, 0.5, 0.006, 0.007, 0.012);
    } else if (setE.includes(i)) {
      value = jitteredRange(i, 0.54, 0.006, 0.007, 0.012);
    } else if (setD.includes(i)) {
      value = jitteredRange(i, 0.56, 0.006, 0.007, 0.012);
    } else if (setG.includes(i)) {
      value = jitteredRange(i, 0.47, 0.006, 0.007, 0.012);
    }
    return value;
  }
  return (
    <motion.div
      transition={{
        ease: "easeInOut",
      }}
      style={{
        minHeight: height,
      }}
      className="min-w-screen w-screen    --top-1/2 --translate-y-[-50%] z-999 grid grid-cols-10  "
    >
      {new Array(100).fill("").map((x, i) => {
        return (
          <motion.div
            key={i.toString()}
            style={{
              background: useTransform(
                pageScroll,
                mode === "dtl"
                  ? returnBoxOpacity(i)
                  : mode === "ltd"
                    ? returnBoxOpacity2(i)
                    : returnBoxOpacity3(i),
                mode === "dtl"
                  ? ["#000000", "#ffffff"]
                  : mode === "ltd"
                    ? ["#ffffff", "#0a0a0a"]
                    : ["#00000000", "#ff0000"],
              ),
              scale: 1,
              // scale: 1.02,
            }}
            className=" w-full h-full"
            id={i.toString()}
          ></motion.div>
        );
      })}
    </motion.div>
  );
}

function FEC({
  text,
  range,
  pageScroll,
}: {
  text: string;
  range: number[];
  pageScroll: any;
}) {
  return (
    <>
      <motion.span
        style={{
          opacity: useTransform(pageScroll, range, [0, 1]),
          filter: useTransform(pageScroll, range, ["blur(10px)", "blur(0)"]),
        }}
      >
        {text}
      </motion.span>{" "}
    </>
  );
}

const FE = memo(FEC);

function ProjectCardComponent() {
  return (
    <>
      <ReactFlipCard
        frontStyle={{}}
        backStyle={{}}
        frontComponent={<div>Hover me!</div>}
        backComponent={<div>Back!</div>}
      />
    </>
  );
}

const ProjectCard = memo(ProjectCardComponent);
