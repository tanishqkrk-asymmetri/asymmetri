"use client";

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
import { ServicesAccordion } from "@/components/ServicesAccordion";
import playSoundOnHover from "@/lib/sound";
import { art, art2, art3, art4, art5, art6 } from "@/lib/art";
import { returnTestimonials } from "@/lib/Testimonials";
import { MemoGridBG } from "@/components/GridScan";
import BlurFadeText from "@/components/BlurFadeText";
import { T } from "@/components/Text";

export default function Home() {
  const pageRef = useRef(null);
  const containerRef = useRef(null);
  const { scrollYProgress: pageScroll } = useScroll({
    target: pageRef,
  });

  const [blackBoxSizeState, setBlackBoxSizeState] = useState(0);
  // ! TURN BACK TO 0
  const [loaderPct, setLoaderPct] = useState(100);

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

  const secondSectionHeight = useTransform(
    pageScroll,
    [0, 0.2],
    ["0px", "100vh"],
  );
  const founderSectionWidth = useTransform(
    pageScroll,
    [0, 0.2],
    ["0px", "100vh"],
  );

  const secondSectionY = useTransform(
    pageScroll,
    [0.2, 0.32],
    ["0%", "-150vh"],
  );

  const secondSectionBG = useTransform(
    pageScroll,
    [0.13, 0.2],
    ["#ffffff", "#000000"],
  );
  const secondSectionText = useTransform(
    pageScroll,
    [0.19, 0.2],
    ["#000000", "#ffffff"],
  );

  const fourthSectionColor = useTransform(
    pageScroll,
    [0, 0.6, 0.61, 0.7],
    ["#ffffff", "#ffffff", "#ff0000", "#ffffff"],
  );

  const fourthSectionDataScale = useTransform(
    pageScroll,
    [0.49, 0.5],
    [1, 0.5],
  );

  const flipContentX = useTransform(pageScroll, [0.52, 0.54], ["0", "100%"]);
  const flipContentXDesc = useTransform(pageScroll, [0.55, 0.56], ["0", "1"]);
  const flipContentX2Desc = useTransform(pageScroll, [0.55, 0.56], ["0", "1"]);
  const flipContentX2 = useTransform(pageScroll, [0.52, 0.54], ["0", "-100%"]);
  const flipContentOpacity = useTransform(pageScroll, [0.52, 0.53], [0, 1]);

  const sixthSectionPointer = useTransform(
    pageScroll,
    [0, 0.7],
    ["none", "all"],
  );
  const sixthSectionY = useTransform(
    pageScroll,
    [0.65, 0.7],
    ["-100vh", "0vh"],
  );

  const sixthSectionTitle = useTransform(
    pageScroll,
    [0.73, 0.75, 0.82],
    [0, 1, 0],
  );
  const sixthSectionTitle2 = useTransform(
    pageScroll,
    [0.77, 0.78, 0.82],
    [0, 1, 0],
  );

  const sixthSectionTitleBG = useTransform(pageScroll, [0.71, 0.73], [0, 1]);

  const testimonialLayerOpacity = useTransform(
    pageScroll,
    [0.76, 0.77],
    [0, 1],
  );

  const testimonialSlots = isCompact
    ? [
        { left: "20%", top: "24%" },
        { left: "80%", top: "24%" },
        { left: "18%", top: "50%" },
        { left: "82%", top: "50%" },
        { left: "24%", top: "76%" },
        { left: "76%", top: "76%" },
        { left: "50%", top: "18%" },
        { left: "50%", top: "82%" },
      ]
    : [
        { left: "16%", top: "24%" },
        { left: "84%", top: "24%" },
        { left: "14%", top: "50%" },
        { left: "86%", top: "50%" },
        { left: "20%", top: "76%" },
        { left: "80%", top: "76%" },
        { left: "50%", top: "16%" },
        { left: "50%", top: "84%" },
      ];

  const [testimonials, setTestimonials] = useState(
    returnTestimonials({
      pageScroll,
      isCompact,
      tabletBelowFoldPx,
    }),
  );

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

  useEffect(() => {
    document
      .querySelectorAll(".sound")
      .forEach((x) => x.addEventListener("mouseenter", playSoundOnHover));

    console.log(chalk.redBright("Property of", art));
    // ! TURN BACK ON
    // document.body.classList.add("stop-scrolling");

    // let local = 0;

    // const incrementTimer = setInterval(() => {
    //   local = local + 1;
    //   setLoaderPct(local);
    //   if (local === 100) {
    //     clearInterval(incrementTimer);
    //   }
    // }, 0.001);
    // return () => clearInterval(incrementTimer);
  }, []);

  useEffect(() => {
    if (loaderPct === 100) {
      (async function () {
        try {
          const L = (await import("locomotive-scroll")).default;
          new L();
        } catch (err) {
          console.error(err);
        }
      })();
      console.log(loaderPct);
      // document.body.classList.remove("stop-scrolling");
    }
  }, [loaderPct]);

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
          <div className="min-h-[600vh]"></div>
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
              <FE text="Not" range={[0.07, 0.075]} pageScroll={pageScroll}></FE>
              <FE
                text="just"
                range={[0.075, 0.08]}
                pageScroll={pageScroll}
              ></FE>
              <FE
                text="another"
                range={[0.08, 0.085]}
                pageScroll={pageScroll}
              ></FE>

              <FE
                text="software"
                range={[0.085, 0.09]}
                pageScroll={pageScroll}
              ></FE>
              <FE
                text="company"
                range={[0.09, 0.11]}
                pageScroll={pageScroll}
              ></FE>

              {/* A place where curious people build things they're proud of */}
              <FE text="A" range={[0.11, 0.115]} pageScroll={pageScroll}></FE>
              <FE
                text="place"
                range={[0.115, 0.12]}
                pageScroll={pageScroll}
              ></FE>
              <FE
                text="where"
                range={[0.12, 0.125]}
                pageScroll={pageScroll}
              ></FE>
              <FE
                text="curious"
                range={[0.125, 0.13]}
                pageScroll={pageScroll}
              ></FE>
              <FE
                text="people"
                range={[0.13, 0.135]}
                pageScroll={pageScroll}
              ></FE>
              <FE
                text="build"
                range={[0.135, 0.14]}
                pageScroll={pageScroll}
              ></FE>
              <div className="text-asymmetri-red">
                <FE
                  text="things"
                  range={[0.14, 0.145]}
                  pageScroll={pageScroll}
                ></FE>
                <FE
                  text="they're"
                  range={[0.145, 0.15]}
                  pageScroll={pageScroll}
                ></FE>
                <FE
                  text="proud"
                  range={[0.15, 0.155]}
                  pageScroll={pageScroll}
                ></FE>
                <FE
                  text="of."
                  range={[0.155, 0.16]}
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
          className=" relative min-w-screen w-screen  z-999999 bg-black"
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
                {/* <div className="w-full h-px bg-black/20 absolute top-0 left-0"></div> */}
                {/* <div className="w-full h-px bg-black/60 absolute bottom-0 left-0"></div> */}
                {/* <motion.div
                  style={{
                    y: useTransform(pageScroll, [0.3, 0.6], ["0%", "100%"]),
                  }}
                  className="absolute -top-36  right-0 text-[16em] text-asymmetri-red/20 pointer-events-none"
                >
                  ?
                </motion.div> */}
                <motion.div className="w-full   space-y-6 px-8">
                  <motion.div
                    style={{
                      y: useTransform(pageScroll, [0.24, 0.3], [500, -100]),
                    }}
                    className="text-asymmetri-red font-semibold text-right uppercase"
                  >
                    <T>Bring us the challenge.</T>
                    <span className="pr-16 inline-block">
                      <T className="max-h-fit" delay={0.1}>
                        ambitious product, tangle
                      </T>
                    </span>{" "}
                    <br />
                    <span className="pr-16 inline-block">
                      <T delay={0.2}>roadmap, tight deadline.</T>
                    </span>
                  </motion.div>
                  <motion.div
                    style={{
                      y: useTransform(pageScroll, [0.23, 0.36], [300, -100]),
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
                    y: useTransform(pageScroll, [0.32, 0.39], [500, -500]),
                  }}
                  className=" mt-16   mx-auto w-full "
                >
                  <ServicesAccordion isCompact={isCompact} />
                </motion.div>
                <div className=" mt-16  flex flex-col justify-center items-center mx-auto w-full space-y-16">
                  <motion.div
                    style={{
                      y: useTransform(pageScroll, [0.37, 0.39], [200, -200]),
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
                            [0.39, 0.43],
                            [200, -200],
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

          <div className="bg-[#0a0a0a] z-9999999999 relative">
            <motion.div className="w-full   space-y-6 px-8">
              <div className=" text-asymmetri-red font-semibold text-left uppercase">
                <T className="pl-16">The part where we</T>
                <span className=" inline-block">
                  <T className="max-h-fit" delay={0.1}>
                    Stop talking and show you
                  </T>
                </span>{" "}
                <br />
                <span className=" inline-block">
                  <T delay={0.2}>our best work</T>
                </span>
              </div>
            </motion.div>
            {/* <MemoizedTransitionGrid mode={"dtr"} pageScroll={pageScroll} /> */}
            <motion.div className="min-h-screen flex justify-center items-center   z-999999999 sticky top-0 ">
              <motion.div className="relative">
                <motion.img
                  src="/flip.png"
                  alt=""
                  className={`relative z-10 block h-auto max-w-full object-contain w-96 `}
                />
                <motion.div
                  style={{
                    x: flipContentX,
                    opacity: flipContentOpacity,
                  }}
                  className="pointer-events-none absolute z-0 mx-auto flex w-full max-w-sm flex-col items-center gap-4 pb-1 border-t border-white text-left pl-3 top-[1px]"
                >
                  <div className="font-chakra-petch text-white pt-3 text-5xl text-left w-full">
                    Vision
                  </div>
                  <motion.div
                    style={{
                      opacity: flipContentXDesc,
                    }}
                    className="max-w-full min-w-0 font-chakra-petch text-base leading-relaxed break-words text-white"
                  >
                    To be a team that consistently delivers technology that’s
                    seamless, intentional, and future-ready.
                  </motion.div>
                </motion.div>
                <motion.div
                  style={{
                    x: flipContentX2,
                    opacity: flipContentOpacity,
                  }}
                  className="pointer-events-none absolute z-0 mx-auto flex w-full max-w-sm flex-col items-center gap-4 pb-1 border-t border-white text-right pr-3 top-px   "
                >
                  <div className="font-chakra-petch text-white pt-3 text-5xl text-right w-full">
                    Philosophy
                  </div>
                  <motion.div
                    style={{
                      opacity: flipContentX2Desc,
                    }}
                    className="max-w-full min-w-0 font-chakra-petch text-base leading-relaxed break-words text-white"
                  >
                    Build fast. Build smart. Build products that are recklessly
                    good.
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
            <div className="min-h-[120vh]"></div>{" "}
            <div className="min-h-screen flex justify-center items-center   z-999999999 pointer-events-none">
              <motion.div
                style={{
                  width: founderSectionWidth,
                  background: secondSectionBG,
                  overflow: "hidden",
                }}
                transition={{
                  ease: "backIn",
                }}
                className=" bg-white z-999 fixed   left-0  min-w-screen w-screen  pointer-events-none top-1/2 translate-y-[-50%] "
              ></motion.div>

              <motion.div className="relative flex flex-col justify-center items-center gap-36">
                <motion.div
                  style={{
                    opacity: useTransform(pageScroll, [0.56, 0.565], [0, 1]),
                  }}
                  className="w-screen h-screen  fixed top-0 left-0 z-99999999999 "
                >
                  <MemoizedTransitionGrid
                    pageScroll={pageScroll}
                    mode="dtr"
                  ></MemoizedTransitionGrid>
                </motion.div>
                <motion.img
                  style={{
                    y: useTransform(pageScroll, [0.6, 0.7], ["0%", "100vh"]),
                  }}
                  src="/nand3.jpg"
                  alt=""
                  className={`relative  block h-auto max-w-full object-contain w-128 z-9999999999999`}
                />
                <motion.div
                  className={`relative  block h-auto max-w-full object-contain  z-99999999999999 text-white text-6xl font-bold font-chakra-petch`}
                >
                  Hi I'm Nandagopal, founder of
                </motion.div>
                <motion.img
                  style={{
                    y: useTransform(pageScroll, [0.6, 0.65], ["60vh", "0vh"]),
                    // scale: useTransform(pageScroll, [0.66, 0.67], [1, 6]),
                  }}
                  src="/logo.png"
                  alt=""
                  className={`fixed top-1/2  left-1/2 -translate-y-1/2 -translate-x-1/2  h-auto max-w-full object-contain  z-9999999999999  w-[64em] hello`}
                />
                {/* <motion.div
                  className={`relative  block h-auto max object-contain  z-99999999999999 text-white text-base text-center font-bold font-chakra-petch max-w-128`}
                >
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum
                  magnam corporis possimus facere doloribus minus atque nobis
                  optio perferendis esse animi aliquid soluta, facilis vero
                  fugiat aut obcaecati veniam nulla beatae, pariatur quidem
                  suscipit? Maxime eligendi molestiae totam ipsum dolore!
                </motion.div> */}
              </motion.div>
            </div>
          </div>
        </motion.div>
        <motion.div
          className={`isolate bg-black w-screen fixed top-0 left-0 z-99999999 flex min-h-0 flex-col ${isMobile ? "h-dvh max-h-dvh items-stretch overflow-x-hidden overflow-hidden pt-[max(0.5rem,env(safe-area-inset-top))]" : "items-center justify-center overflow-hidden  " + (isCompact ? "h-dvh max-h-dvh" : "h-screen")}`}
          style={
            isMobile
              ? { y: sixthSectionY, pointerEvents: "none" }
              : {
                  y: sixthSectionY,
                  // scale: sixthSectionScale,
                  pointerEvents: sixthSectionPointer,
                }
          }
        >
          <motion.div
            style={{
              opacity: sixthSectionTitleBG,
            }}
            className="heroDark pointer-events-none absolute inset-0 z-0 bg-black max-md:hidden"
          />

          {!isMobile && (
            <FatCursors color="#FFFFFF50" scale={1} min={1}></FatCursors>
          )}

          {isMobile ? (
            <>
              <div className="pointer-events-auto flex w-full flex-col items-center justify-center px-0 pb-28 pt-2 max-md:min-h-screen">
                <motion.div
                  style={{
                    opacity: testimonialLayerOpacity,
                  }}
                  className="relative z-10 mb-5 max-w-[min(18rem,calc(100vw-3rem))] shrink-0 px-6 text-center font-chakra-petch text-xl leading-snug text-white"
                >
                  Feedback from the folks who know us best.
                </motion.div>

                <motion.div
                  style={{ opacity: testimonialLayerOpacity }}
                  className="relative z-10 flex w-full shrink-0 justify-center px-4 pb-2"
                >
                  <MobileTestimonialsCarousel
                    items={testimonials.map(
                      ({ company, testimonial, image }) => ({
                        company,
                        testimonial,
                        image,
                      }),
                    )}
                    className="w-full min-w-0 max-w-full touch-pan-x"
                  />
                </motion.div>
              </div>

              <motion.div
                style={{
                  opacity: testimonialLayerOpacity,
                }}
                className="pointer-events-none absolute bottom-0 left-1/2 z-10 w-[min(18rem,calc(100vw-3rem))] max-w-[calc(100vw-3rem)] -translate-x-1/2 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-6 text-center font-chakra-petch text-[11px] leading-snug text-white/50"
              >
                Collaborative agency for bold ideas, beautiful code and digital
                experiences
              </motion.div>
            </>
          ) : (
            <>
              {testimonials.map((x, i) => {
                const slot =
                  testimonialSlots[(i - 1) % testimonialSlots.length];
                return (
                  <motion.div
                    style={{
                      y: x.layerY,
                      // opacity: testimonialLayerOpacity,
                    }}
                    animate={{
                      top: i === 0 ? "50%" : slot.top,
                      left: i === 0 ? "50%" : slot.left,
                      scale: i === 0 ? 1 : isCompact ? 0.5 : 0.42,
                    }}
                    transition={{
                      duration: isCompact ? 0.75 : 1,
                      ease: "easeInOut",
                    }}
                    key={x.company}
                    onClick={() => {
                      if (i === 0) return;
                      const newArray = [
                        x,
                        ...testimonials.filter((y) => y.company !== x.company),
                      ];
                      setTestimonials(newArray);
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 font-chakra-petch z-[10] ${i === 0 ? "cursor-default" : "cursor-pointer"}`}
                  >
                    <img
                      src={x.image}
                      className={`duration-500 ${isCompact ? "w-48" : "w-64"} ${i === 0 ? "grayscale-0" : "grayscale"}`}
                      alt=""
                    />
                    <AnimatePresence>
                      {i === 0 && (
                        <motion.div
                          initial={{
                            opacity: 0,
                          }}
                          animate={{
                            opacity: 1,
                          }}
                          exit={{
                            opacity: 0,
                          }}
                          transition={{
                            delay: 0.8,
                          }}
                          className={
                            isCompact
                              ? "absolute top-[calc(100%+0.5rem)] left-1/2 z-[11] flex -translate-x-1/2 flex-col items-center gap-3 text-center"
                              : "absolute top-0 left-[calc(100%+0.75rem)] z-[11] flex flex-col gap-6 text-left"
                          }
                        >
                          <div
                            className={`text-white ${isCompact ? "w-56 text-sm" : "w-40 text-sm"}`}
                          >
                            {x.testimonial}
                          </div>
                          <div
                            className={`text-asymmetri-red z-[12] ${isCompact ? "w-56 text-sm" : "w-40 text-sm"}`}
                          >
                            <ScrambledText
                              className="z-[12]"
                              radius={100}
                              style={{
                                color: "inherit",
                                fontSize: "inherit",
                                width: "100%",
                                fontFamily: "Chakra Petch",
                                textAlign: isCompact ? "center" : "left",
                                margin: "0",
                              }}
                              duration={3}
                              speed={0.9}
                              scrambleChars=".:-"
                            >
                              {x.company}
                            </ScrambledText>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}

              <motion.div
                style={{
                  opacity: sixthSectionTitle,
                }}
                className={`pointer-events-none z-[20] max-w-lg px-6 text-center font-chakra-petch text-white ${isCompact ? "relative text-3xl leading-snug" : "relative text-7xl"}`}
              >
                Feedback from the folks who know us best.
              </motion.div>

              <motion.div
                style={{
                  opacity: sixthSectionTitle2,
                }}
                className={`pointer-events-none z-[20] px-4 text-center font-chakra-petch text-white/50 ${isCompact ? "absolute bottom-10 left-1/2 max-w-none -translate-x-1/2 text-[11px]" : "absolute bottom-20 left-1/2 max-w-none -translate-x-1/2 text-xs"}`}
              >
                Collaborative agency for bold ideas, beautiful code and digital
                experiences
              </motion.div>
            </>
          )}
        </motion.div>

        <motion.div></motion.div>

        <div className="min-h-[900vh]"></div>
      </section>
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
      value = jitteredRange(i, 0.24, 0.008, 0.01, 0.02);
    } else if (setB.includes(i)) {
      value = jitteredRange(i, 0.25, 0.006, 0.008, 0.014);
    } else if (setC.includes(i)) {
      value = jitteredRange(i, 0.29, 0.006, 0.007, 0.012);
    } else if (setD.includes(i)) {
      value = jitteredRange(i, 0.27, 0.006, 0.007, 0.012);
    } else if (setE.includes(i)) {
      value = jitteredRange(i, 0.22, 0.006, 0.007, 0.012);
    } else if (setF.includes(i)) {
      value = jitteredRange(i, 0.26, 0.006, 0.007, 0.012);
    } else if (setG.includes(i)) {
      value = jitteredRange(i, 0.27, 0.008, 0.012, 0.02);
    }
    return value;
  }
  function returnBoxOpacity2(i: number): number[] {
    const setA = [21, 9, 68, 36, 2, 12, 98, 64, 41, 63, 84, 32, 30, 20, 79, 22];
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
      value = jitteredRange(i, 0.42, 0.006, 0.007, 0.012);
    } else if (setC.includes(i)) {
      value = jitteredRange(i, 0.45, 0.006, 0.007, 0.012);
    } else if (setB.includes(i)) {
      value = jitteredRange(i, 0.42, 0.006, 0.007, 0.012);
    } else if (setF.includes(i)) {
      value = jitteredRange(i, 0.41, 0.006, 0.007, 0.012);
    } else if (setE.includes(i)) {
      value = jitteredRange(i, 0.39, 0.006, 0.007, 0.012);
    } else if (setD.includes(i)) {
      value = jitteredRange(i, 0.45, 0.006, 0.007, 0.012);
    } else if (setG.includes(i)) {
      value = jitteredRange(i, 0.4, 0.006, 0.007, 0.012);
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
      value = jitteredRange(i, 0.57);
    } else if (setB.includes(i)) {
      value = jitteredRange(i, 0.58);
    } else if (setC.includes(i)) {
      value = jitteredRange(i, 0.572);
    } else if (setD.includes(i)) {
      value = jitteredRange(i, 0.584);
    } else if (setE.includes(i)) {
      value = jitteredRange(i, 0.586);
    } else if (setF.includes(i)) {
      value = jitteredRange(i, 0.576);
    } else if (setG.includes(i)) {
      value = jitteredRange(i, 0.58);
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
              scale: 1.02,
            }}
            className=" w-full h-full"
            id={i.toString()}
          ></motion.div>
        );
      })}
    </motion.div>
  );
}

function FE({
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
          filter: useTransform(pageScroll, range, ["blur(20px)", "blur(0)"]),
        }}
      >
        {text}
      </motion.span>{" "}
    </>
  );
}
