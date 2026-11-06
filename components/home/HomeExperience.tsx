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
import { PracticesIndex } from "@/components/home/PracticesIndex";
import { SiteFooter } from "@/components/shared/SiteFooter";
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
import { Button } from "@/components/ui/button";
import { MemoGridBG } from "@/components/GridScan";
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/ui/scroll-based-velocity";
import { useLegacyScroll } from "@/hooks/useLegacyScroll";
import { PointOfViewScene } from "@/components/home/PointOfViewScene";
import { DomainsMorph } from "@/components/home/DomainsMorph";
import { ProcessPipeline } from "@/components/home/ProcessPipeline";
import { TileTransition } from "@/components/home/TileTransition";
import { FaqBlock } from "@/components/home/FaqBlock";
import { company } from "@/lib/site-content";
import { HeroSplit } from "@/components/home/HeroSplit";
import { ManifestoBoard } from "@/components/home/ManifestoBoard";
import { Wordmark } from "@/components/brand/Wordmark";
import { useHeroSplit } from "@/hooks/useHeroSplit";

// Navbar colour while a new section is under it (values sit inside the
// Navbar's original colour bands).
const NAV_DARK = 0.36;
const NAV_RED = 0.45;
const NAV_WHITE = 0.25;

export function HomeExperience() {
  const { loaderPct } = usePauseScroll();

  const pageRef = useRef<HTMLElement>(null);
  const containerRef = useRef(null);

  // Sections added for the 2026 positioning. The original animations keep
  // their timing because pageScroll pauses while these scroll past.
  const povRef = useRef<HTMLDivElement>(null);
  const domainsRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const { legacy: pageScroll, nav: navScroll } = useLegacyScroll(pageRef, [
    { ref: povRef, nav: NAV_DARK },
    { ref: domainsRef, nav: NAV_RED },
    { ref: processRef, nav: NAV_DARK },
    { ref: faqRef, nav: NAV_WHITE },
  ]);

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
    const stuff = [logoMain, logo2Main, newlogo, art];
    let local = 0;

    // stuff.forEach((x) => {
    //   setInterval(() => {
    //     AsciiMorph.morph(x);
    //   }, 1000);
    // });
    AsciiMorph.morph(logoMain);
    const a = setInterval(() => {
      const random = Math.floor(Math.random() * 4);
      let lastGraphic = 0;
      console.log(random);
      if (random === 0) {
        AsciiMorph.morph(logoMain);
        lastGraphic = random;
      } else if (random === 1) {
        AsciiMorph.morph(logo2Main);
        lastGraphic = random;
      } else if (random === 2) {
        AsciiMorph.morph(newlogo);
        lastGraphic = random;
      } else if (random === 3) {
        AsciiMorph.morph(art);
        lastGraphic = random;
      }
      local = local + 1;
      if (local === 600) {
        clearInterval(a);
      }
    }, 3000);
  }, []);

  // The hero tears open along the logo's slash and reveals the manifesto.
  const split = useHeroSplit(pageScroll);

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
      type: "AI · Health and wellbeing",
      thumbnail: "/flip.png",
      desc: "",
      link: "/case-studies/prescribe-life",
    },
    {
      name: "Reform AI",
      type: "AI · Document intelligence",
      thumbnail: "/flip.png",
      desc: "",
      link: "/case-studies/reform-ai",
    },
    {
      name: "Quicli",
      type: "Operations · Field teams",
      thumbnail: "/flip.png",
      desc: "",
      link: "/case-studies/quicli",
    },
    {
      name: "DD Group",
      type: "Experience · Brand system",
      thumbnail: "/flip.png",
      desc: "",
      link: "/case-studies/dd-group",
    },
  ];

  const pointers = [
    {
      title: "01 · Creativity",
      body: "Invent the approach. Every hard problem gets a first-principles answer, not a template from the last project.",
    },
    {
      title: "02 · Agility",
      body: "Shorten the learning loop. Prototype, measure and adjust fast, so the right answer arrives before the deadline does.",
    },
    {
      title: "03 · Repeatability",
      body: "Repeat the system. The team adapts to the domain without becoming dependent on one stack, one industry or one playbook.",
    },
  ];

  return (
    <div ref={containerRef}>
      <Navbar pageScroll={navScroll} />
      <section ref={pageRef} className="">
        <motion.div className="relative ">
          <HeroSplit loaded={loaderPct === 100} split={split} />
          <div className="min-h-screen hero bg-white fixed w-full overflow-hidden">
            {/* {!isMobile && <FatCursors scale={1} />} */}
            <FatCursors scale={1} />{" "}
            <Wordmark
              color="#000000"
              className="absolute top-1/2 left-1/2 h-auto w-[min(30rem,82vw)] -translate-y-1/2 -translate-x-1/2"
            />
            <div className="text-asymmetri-red absolute top-[60%] left-1/2  -translate-x-1/2 font-bold font-chakra-petch text-xl">
              {loaderPct === 100 ? "100" : loaderPct}%
            </div>
          </div>
          <div className="min-h-[400vh]"></div>
        </motion.div>

        {/* What the cut opens onto. Revealed through the gap between the hero's halves. */}
        <motion.div
          style={{
            clipPath: split.gapClip,
            background: secondSectionBG,
          }}
          className="pointer-events-none fixed inset-0 z-999 h-screen w-screen overflow-hidden"
        >
          <ManifestoBoard
            pageScroll={pageScroll}
            color={secondSectionText}
            y={secondSectionY}
          />
        </motion.div>

        <motion.div
          transition={{
            ease: "easeInOut",
          }}
          className=" relative min-w-screen w-screen  z-999999 "
        >
          <MemoizedTransitionGrid mode={"dtl"} pageScroll={pageScroll} />

          <motion.div
            id="what-we-do"
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
                    <motion.h2>
                      <T as="span" className="block">
                        Bring us the hard problem.
                      </T>
                      <span className="pr-16 inline-block">
                        <T as="span" className="block max-h-fit" delay={0.2}>
                          ambitious AI, tangled
                        </T>
                      </span>{" "}
                      <br />
                      <span className="pr-16 inline-block">
                        <T as="span" className="block" delay={0.4}>
                          operations, global scale.
                        </T>
                      </span>
                    </motion.h2>
                  </motion.div>
                  <motion.div
                    style={{
                      y: useTransform(pageScroll, [0.2, 0.3], [0, 0]),
                    }}
                    className="text-xl max-w-82 space-y-6"
                  >
                    <T delay={0} className="">
                      We frame it, engineer it and put it into production.
                      Strategy, design and engineering in one accountable team.
                    </T>
                    <T delay={0.1}>
                      <a
                        href="/contact-us"
                        className="text-xl bg-white border rounded-sm  p-2 duration-150 hover:bg-asymmetri-red hover:text-white cursor-pointer"
                      >
                        Discuss a problem
                      </a>
                    </T>
                  </motion.div>
                </motion.div>
                <motion.div
                  style={{
                    y: useTransform(pageScroll, [0.15, 0.33], [500, -500]),
                  }}
                  className=" mt-16   mx-auto w-full "
                >
                  <PracticesIndex />
                </motion.div>
                <div className=" mt-16  flex flex-col justify-center items-center mx-auto w-full space-y-16">
                  <motion.div
                    style={{
                      y: useTransform(pageScroll, [0.31, 0.32], [100, -600]),
                    }}
                  >
                    <T delay={0.3}>
                      <div className="text-4xl font-semibold text-center">
                        More than 50 clients <br /> have partnered with us
                      </div>
                    </T>
                  </motion.div>
                  <motion.div
                    style={
                      {
                        // y: useTransform(pageScroll, [0.26, 0.5], [0, 1000]),
                      }
                    }
                    // initial={{ opacity: 0 }}
                    // whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="w-screen relative left-1/2 -translate-x-1/2 min-h-[50vh] flex justify-center items-center"
                  >
                    <ScrollVelocityContainer className="w-screen">
                      <ScrollVelocityRow
                        baseVelocity={16}
                        direction={1}
                        className="w-screen"
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
                        ].map((client) => (
                          <div
                            key={client.logo}
                            className="flex justify-center items-center px-10 py-6"
                          >
                            <img
                              alt={client.name}
                              style={{
                                scale: client.name === "Reform" ? 2 : 1,
                                borderRadius:
                                  client.name === "Prescribe Life"
                                    ? "6px"
                                    : "0px",
                              }}
                              src={"/logos/" + client.logo}
                              className="w-24"
                            />
                          </div>
                        ))}
                      </ScrollVelocityRow>
                    </ScrollVelocityContainer>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
          <MemoizedTransitionGrid mode={"ltd"} pageScroll={pageScroll} />

          {/* Point of view. The ten-layer AI system now lives on the
              AI Agentic Systems and Data practice page. */}
          <div ref={povRef} className="relative z-[99999999999]">
            <PointOfViewScene />
          </div>

          <div className="relative z-9999999999">
            <div id="work" className="relative min-h-[150vh]">
              <motion.div
                className="sticky top-0 flex h-screen w-full flex-col justify-center"
                style={{
                  backgroundColor: useTransform(
                    pageScroll,
                    [0.37, 0.38],
                    ["#0a0a0a", "#cd1717"],
                  ),
                }}
              >
                <motion.div className="w-full space-y-6 px-8 text-8xl font-chakra-petch">
                  <motion.div
                    style={{
                      color: useTransform(
                        pageScroll,
                        [0.36, 0.37],
                        ["#cd1717", "#ffffff"],
                      ),
                    }}
                    className="text-asymmetri-red font-semibold text-left uppercase px-36"
                  >
                    <motion.h2>
                      <T as="span" delay={0.1} className="block">
                        Proof, Not
                      </T>
                      <motion.span className="inline-block">
                        <T as="span" className="block max-h-fit" delay={0.2}>
                          Promises
                        </T>
                      </motion.span>
                    </motion.h2>{" "}
                    <br />
                    {/* <span className="inline-block">
                      <T delay={0.3}>our best work</T>
                    </span> */}
                  </motion.div>
                  <div className="text-xl max-w-82 space-y-6 w-full ml-auto mr-36">
                    <T delay={0.3} className="text-white">
                      Systems people transact with, depend on and trust. Built
                      with early-stage founders, fast-growing teams and global
                      brands.
                    </T>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            <div className="min-h-[200vh] bg-asymmetri-red   relative ">
              {projects.map((x, i) => {
                return (
                  <motion.a
                    key={x.name}
                    href={x.link}
                    aria-label={`${x.name} case study`}
                    className="min-h-screen -translate-y-1/2 fixed top-1/2 left-1/2 flex justify-center items-center  w-1/4 flex-col gap-6 group cursor-pointer"
                    style={{
                      pointerEvents: useTransform(
                        pageScroll,
                        [0.47, 0.48],
                        ["none", "all"],
                      ),
                      zIndex: 5 - i,
                      y: useTransform(
                        pageScroll,
                        [0.37, 0.39, 0.43],
                        [1000, 500, 0],
                      ),
                      left: useTransform(
                        pageScroll,
                        [0.44, 0.47],
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
                      x: useTransform(pageScroll, [0.44, 0.47], ["-50%", "0%"]),
                    }}
                  >
                    <motion.div
                      style={{
                        left: "0%",
                        opacity: useTransform(
                          pageScroll,
                          [0.46, 0.47],
                          ["0", "1"],
                        ),
                      }}
                      className="fixed top-0  h-screen w-[0.5px] bg-white/50 opacity-0 group-hover:opacity-100 duration-200"
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
                            [0.46, 0.47, 0.5],
                            [3, 2, 1.5],
                          ),
                        }}
                        src="/card.png"
                        className="w-72  translate-x-8 z-999999 relative bg-asymmetri-red group-hover:opacity-0 duration-200"
                        alt=""
                        aria-hidden
                      />
                      <motion.img
                        src={x.thumbnail}
                        className="w-72   absolute top-0 left-0 z-10 h-full"
                        alt={`${x.name}: ${x.type}`}
                      />
                    </motion.div>
                    <motion.div
                      className="text-xl text-white font-chakra-petch"
                      style={{
                        opacity: useTransform(
                          pageScroll,
                          [0.45, 0.46],
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
                          [0.46, 0.47],
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
                          [0.47, 0.48],
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
                  </motion.a>
                );
              })}
            </div>
          </div>
          <div className="min-h-screen bg-asymmetri-red"></div>
        </motion.div>

        {/* NEW: five domains, one morphing interface */}
        <div ref={domainsRef} className="relative z-999999">
          <DomainsMorph />
        </div>
        <div className="h-screen min-h-[600vh] bg-black z-999999  text-white flex justify-center items-center divide-x divide-white/50 relative">
          <motion.div
            className="w-[50%]  h-full flex justify-center 
          items-start bg-black relative"
          >
            <motion.div
              style={{
                width: useTransform(
                  pageScroll,
                  [0.69, 0.72],
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
                  [0.69, 0.72],
                  ["#ffffff", "#ff0000"],
                ),
                x: useTransform(pageScroll, [0.69, 0.72], ["0%", "50%"]),

                fontSize: "0.6em",
              }}
              className="w-full  sticky top-16 z-999999999 ascii-element "
            ></motion.pre>
          </motion.div>
          <div className="w-[50%] h-full relative">
            <div className=" text-white font-semibold text-left uppercase font-chakra-petch text-4xl p-8 sticky top-16 min-h-screen">
              <h2>
                <span className="sr-only">How we operate: </span>
                <T as="span" className="block" delay={0.3}>
                  HARD PROBLEMS DON&apos;T
                </T>
                <T as="span" className="block" delay={0.5}>
                  NEED A PLAYBOOK. THEY
                </T>
                <T as="span" className="block" delay={0.8}>
                  NEED A <span className="text-asymmetri-red">SYSTEM.</span>
                </T>
              </h2>
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
                            ? "25em"
                            : i === 2
                              ? "35em"
                              : "",
                    }}
                    key={x.title}
                    id={x.title}
                    className="sticky border-t border-white/50 p-6 font-chakra-petch min-h-screen bg-black space-y-4"
                  >
                    <h3>
                      <T as="span" delay={0.1} className="block text-xl font-semibold text-white">
                        {x.title}
                      </T>
                    </h3>
                    <T delay={0.3} className="text-base text-white/60">
                      {x.body}
                    </T>
                  </div>
                );
              })}
              <div className="min-h-screen"></div>
            </div>
          </div>
        </div>
        {/* How we work, then FAQ. The AI-driven SDLC scene now lives on the
            Application Development practice page. */}
        <div ref={processRef} className="relative z-[999999999]">
          <ProcessPipeline />
          <TileTransition from="#000000" to="#ffffff" />
        </div>
        <div ref={faqRef} className="relative z-[999999999]">
          <FaqBlock />
        </div>

        <motion.div className="min-h-[300vh] bg-white relative z-99999999 flex flex-col justify-start items-center p-6">
          <motion.div
            style={{
              y: useTransform(pageScroll, [0.73, 0.78], ["300px", "0px"]),
            }}
            className="text-5xl font-chakra-petch text-asymmetri-red font-bold "
          >
            Hi I'm Nandagopal, founder of{" "}
          </motion.div>
          <motion.div
            style={{
              y: useTransform(pageScroll, [0.78, 0.83], ["100vh", "-10vh"]),

              // opacity: useTransform(pageScroll, [0.95, 0.96], ["1", "1"]),
            }}
            className="text-6xl font-chakra-petch text-black max-w-2/3 font-bold fixed top-36 left-6 z-999999999 --mix-blend-difference"
          >
            Asymmetri was built for the problems other teams walk away from: a
            hard problems technology company engineering intelligence into the
            way global brands operate.
          </motion.div>
          <motion.div
            style={{
              y: useTransform(pageScroll, [0.79, 0.84], ["600px", "0px"]),
              scale: useTransform(
                pageScroll,
                [0.79, 0.81, 0.82, 0.84],
                [1, 0.95, 1.05, 1],
              ),
              // opacity: useTransform(pageScroll, [0.97, 0.98], ["1", "1"]),
            }}
            className="text-xl font-chakra-petch text-black/70 max-w-sm ml-auto font-semibold fixed bottom-26  right-16 z-999999999"
          >
            <div>
              A lean operating core across leadership, engineering, design,
              applied AI and data, operations and QA, and growth, extended by
              specialists for every domain we enter. If you&apos;re facing
              something hard, we&apos;d love to hear about it.
            </div>
            <a
              href="/contact-us"
              className="pointer-events-auto inline-block border-asymmetri-red border-2  text-asymmetri-red p-3 py-2 mt-6 cursor-pointer hover:bg-asymmetri-red hover:text-white duration-300"
            >
              Get in Touch
            </a>
          </motion.div>
          <motion.img
            style={{
              y: useTransform(pageScroll, [0.74, 0.78], ["100vh", "0vh"]),
              filter: useTransform(
                pageScroll,
                [0.79, 0.8, 1],
                ["blur(0px)", "blur(4px)", "blur(4px)"],
              ),
            }}
            src="/nand3.jpg"
            className="w-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 "
            alt="Nandagopal, founder of Asymmetri"
          />
          <motion.img
            style={{
              y: useTransform(pageScroll, [0.74, 0.79], ["500px", "100px"]),
            }}
            src="/brand/asymmetri-wordmark-dark.svg"
            className=""
            alt="Asymmetri"
          />
        </motion.div>
        <motion.div
          style={{
            // y: "95%",
            y: useTransform(pageScroll, [0.84, 0.88], ["100vh", "0vh"]),
            // scale: useTransform(pageScroll, [0.85, 0.87], ["1.25", "1"]),
          }}
          className=" z-1000000000 w-screen fixed top-0 left-0 rounded-3xl bg-red-500"
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
          className="bg-white"
        ></div>
      </section>
      <motion.div
        style={{
          y: useTransform(pageScroll, [0.98, 1], ["100vh", "0vh"]),
          scale: useTransform(pageScroll, [0.98, 1], ["0.8", "1"]),
        }}
        className="min-h-screen bg-asymmetri-red fixed top-0 left-0 z-999999999999 w-screen h-screen rounded-2xl"
      >
        <section className="flex flex-col gap-6 xl:gap-8 items-center justify-center text-center bg-asymmetri-red min-h-screen w-full z-99 fixed bottom-0 ">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-white/70">
            Intelligence · Process · Experience · Scale
          </p>
          <h2 className="font-chakra-petch font-medium text-2xl lg:text-4xl xl:text-5xl">
            Bring us the hard problem. <br /> We&apos;ll find the asymmetric
            answer.
          </h2>

          <div className="flex flex-row gap-2 xl:gap-4">
            <Button
              size="lg"
              className="font-chakra-petch text-asymmetri-red py-4 font-semibold"
              asChild
            >
              <a href="/contact-us">Get in touch</a>
            </Button>
            <Button
              size="lg"
              className="font-chakra-petch bg-transparent font-semibold"
              variant={"outline"}
              asChild
            >
              <a href="/careers">Join our team</a>
            </Button>
          </div>

          <SiteFooter className="absolute inset-x-0 bottom-0" />
        </section>
      </motion.div>
    </div>
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
      value = jitteredRange(i, 0.38, 0.006, 0.007, 0.012);
    } else if (setC.includes(i)) {
      value = jitteredRange(i, 0.39, 0.006, 0.007, 0.012);
    } else if (setB.includes(i)) {
      value = jitteredRange(i, 0.38, 0.006, 0.007, 0.012);
    } else if (setF.includes(i)) {
      value = jitteredRange(i, 0.395, 0.006, 0.007, 0.012);
    } else if (setE.includes(i)) {
      value = jitteredRange(i, 0.389, 0.006, 0.007, 0.012);
    } else if (setD.includes(i)) {
      value = jitteredRange(i, 0.36, 0.006, 0.007, 0.012);
    } else if (setG.includes(i)) {
      value = jitteredRange(i, 0.4, 0.006, 0.007, 0.012);
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
