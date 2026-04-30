"use client";

// import { AsciiMorph } from "@/lib/asciiMorph";

import random from "random";
import {
  AnimatePresence,
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

import React, { useEffect, useRef, useState } from "react";
import { FatCursors } from "@/components/FatCursors";
import { GridScan } from "@/components/GridScan";
import ScrambledText from "@/components/ScrambledText";
import { HyperText } from "@/components/ui/hyper-text";
import { ArrowBigRight, ChevronUp, X } from "lucide-react";
import { Pointer } from "@/components/ui/pointer";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import Cubes from "@/components/Cubes";
import ShapeBlur from "@/components/ShapeBlur";
import { Navbar } from "@/components/shared/navbar";
import TargetCursor from "@/components/TargetCursor";
import { Button } from "@/components/ui/button";

export default function Home() {
  const pageRef = useRef(null);

  const { scrollYProgress: pageScroll } = useScroll({
    target: pageRef,
    offset: ["start end", "end start"],
  });

  const [blackBoxSizeState, setBlackBoxSizeState] = useState(0);
  const [loaderPct, setLoaderPct] = useState(0);

  const [whiteBG, setWhiteBg] = useState(false);

  const secondSectionOpacity = useTransform(
    pageScroll,
    [0.1, 0.2],
    ["1000px", "0px"],
  );
  const secondSectionScale = useTransform(pageScroll, [0.2, 0.3], [0.7, 1.1]);
  const secondSectionBG = useTransform(
    pageScroll,
    [0.2, 0.3],
    ["#0a0a0a", "#000000"],
  );
  const secondSectionText = useTransform(pageScroll, [0.3, 0.32], [0, 1]);
  const secondSectionLines = useTransform(pageScroll, [0.32, 0.33], [0, 1]);

  const secondSectionRed = useTransform(
    pageScroll,
    [0.34, 0.36],
    ["#ffffff", "#ff0000"],
  );
  const secondSectionGrid = useTransform(pageScroll, [0.38, 0.39], [0, 1]);
  const thirdSectionOpacity = useTransform(pageScroll, [0.42, 0.43], [0, 1]);
  const thirdSectionClick = useTransform(
    pageScroll,
    [0, 0.43],
    ["none", "all"],
  );

  const workCard1 = useTransform(pageScroll, [0.45, 0.46], [0, 1]);
  const workCard2 = useTransform(pageScroll, [0.46, 0.47], [0, 1]);
  const workCard3 = useTransform(pageScroll, [0.47, 0.48], [0, 1]);
  const workCard4 = useTransform(pageScroll, [0.48, 0.49], [0, 1]);
  const workCard5 = useTransform(pageScroll, [0.49, 0.5], [0, 1]);
  const workCard6 = useTransform(pageScroll, [0.5, 0.51], [0, 1]);

  const workCard1Pointer = useTransform(
    pageScroll,
    [0.45, 0.46],
    ["none", "all"],
  );
  const workCard2Pointer = useTransform(
    pageScroll,
    [0.46, 0.47],
    ["none", "all"],
  );
  const workCard3Pointer = useTransform(
    pageScroll,
    [0.47, 0.48],
    ["none", "all"],
  );
  const workCard4Pointer = useTransform(
    pageScroll,
    [0.48, 0.49],
    ["none", "all"],
  );
  const workCard5Pointer = useTransform(
    pageScroll,
    [0.49, 0.5],
    ["none", "all"],
  );
  const workCard6Pointer = useTransform(
    pageScroll,
    [0.5, 0.51],
    ["none", "all"],
  );

  const fourthSectionOpacity = useTransform(
    pageScroll,
    [0.53, 0.6],
    ["1000px", "0px"],
  );

  const fourthSectionText = useTransform(
    pageScroll,
    [0.6, 0.61, 0.75],
    ["0", "1", "0"],
  );
  const fourthSectionColor = useTransform(
    pageScroll,
    [0.6, 0.61, 0.7],
    ["#ffffff", "#ff0000", "#ffffff"],
  );

  const fourthSectionBG = useTransform(
    pageScroll,
    [0.6, 0.64, 0.7],
    ["500px", "0px", "-200px"],
  );
  const fourthSectionGradient = useTransform(
    pageScroll,
    [0.65, 0.7, 0.75],
    ["#000000", "#cd1717", "#ffffff"],
  );

  const fourthSectionY = useTransform(
    pageScroll,
    [0.65, 0.7],
    ["200px", "30px"],
  );

  const fourthSectionScale = useTransform(pageScroll, [0.65, 0.7], [1, 0.5]);
  const fourthSectionData = useTransform(pageScroll, [0.68, 0.685], [0, 1]);
  const fourthSectionDataY = useTransform(
    pageScroll,
    [0.67, 0.7],
    ["600px", "-100px"],
  );
  const fourthSectionFinalOpacity = useTransform(
    pageScroll,
    [0.73, 0.75],
    [1, 0],
  );
  const fifthSectionTitle = useTransform(
    pageScroll,
    [0.75, 0.76, 0.79],
    [0, 1, 0],
  );

  const fifthSectionSecondTitle = useTransform(pageScroll, [0.79, 0.8], [0, 1]);
  const fifthSectionSecondTitle2 = useTransform(
    pageScroll,
    [0.8, 0.81],
    [0, 1],
  );
  const nandScale = useTransform(pageScroll, [0.77, 0.79], [1, 1.1]);
  const nandBlur = useTransform(
    pageScroll,
    [0.77, 0.79],
    ["blur(0px)", "blur(10px)"],
  );

  const fifthSectionLogo = useTransform(
    pageScroll,
    [0.76, 0.77, 0.79],
    [0, 1, 0],
  );

  const sixthSectionY = useTransform(
    pageScroll,
    [0.8, 0.83],
    ["1000px", "0px"],
  );
  const sixthSectionScale = useTransform(pageScroll, [0.8, 0.83], [0.6, 1.1]);

  const sixthSectionTitle = useTransform(
    pageScroll,
    [0.84, 0.85, 0.87],
    [0, 1, 0],
  );
  const sixthSectionTitle2 = useTransform(
    pageScroll,
    [0.85, 0.86, 0.87],
    [0, 1, 0],
  );

  const sixthSectionTitleBG = useTransform(pageScroll, [0.84, 0.85], [0, 1]);

  const testimonialLayerOpacity = useTransform(pageScroll, [0.87, 0.9], [0, 1]);
  const testimonialLayerY0 = useTransform(
    pageScroll,
    [0.868, 0.9],
    ["1040px", "0px"],
  );
  const testimonialLayerY1 = useTransform(
    pageScroll,
    [0.87, 0.902],
    ["980px", "0px"],
  );
  const testimonialLayerY2 = useTransform(
    pageScroll,
    [0.872, 0.904],
    ["1120px", "0px"],
  );
  const testimonialLayerY3 = useTransform(
    pageScroll,
    [0.874, 0.906],
    ["960px", "0px"],
  );
  const testimonialLayerY4 = useTransform(
    pageScroll,
    [0.876, 0.908],
    ["1080px", "0px"],
  );
  const testimonialLayerY5 = useTransform(
    pageScroll,
    [0.878, 0.9],
    ["920px", "0px"],
  );
  const testimonialLayerY6 = useTransform(
    pageScroll,
    [0.88, 0.91],
    ["1160px", "0px"],
  );
  const testimonialLayerY7 = useTransform(
    pageScroll,
    [0.882, 0.899],
    ["940px", "0px"],
  );
  const testimonialLayerY8 = useTransform(
    pageScroll,
    [0.8, 0.9],
    ["1020px", "0px"],
  );

  const testimonialSlots = [
    { left: "16%", top: "24%" },
    { left: "84%", top: "24%" },
    { left: "14%", top: "50%" },
    { left: "86%", top: "50%" },
    { left: "20%", top: "76%" },
    { left: "80%", top: "76%" },
    { left: "50%", top: "16%" },
    { left: "50%", top: "84%" },
  ];

  const [testimonials, setTestimonials] = useState([
    {
      company: "TechNova Solutions",
      testimonial:
        "Working with this team has completely transformed our digital presence. Their attention to detail and commitment to quality is unmatched.",
      image: "https://randomuser.me/api/portraits/women/45.jpg",
      layerY: testimonialLayerY0,
    },
    {
      company: "GreenLeaf Marketing",
      testimonial:
        "Their innovative strategies helped us grow our customer base faster than we imagined. Highly professional and reliable.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      layerY: testimonialLayerY1,
    },
    {
      company: "UrbanBuild Co.",
      testimonial:
        "From start to finish, the experience was seamless. The results exceeded our expectations in every way.",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      layerY: testimonialLayerY2,
    },
    {
      company: "FinEdge Consulting",
      testimonial:
        "A truly outstanding service. Their expertise and dedication made a significant impact on our business growth.",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
      layerY: testimonialLayerY3,
    },
    {
      company: "BrightPath Education",
      testimonial:
        "We saw immediate improvements after implementing their solutions. The team is knowledgeable and easy to work with.",
      image: "https://randomuser.me/api/portraits/women/22.jpg",
      layerY: testimonialLayerY4,
    },
    {
      company: "BlueOrbit Labs",
      testimonial:
        "Their sprint-based process kept us aligned and shipping every week. It felt like our internal team got stronger overnight.",
      image: "https://randomuser.me/api/portraits/men/11.jpg",
      layerY: testimonialLayerY5,
    },
    {
      company: "Lumen Health",
      testimonial:
        "We needed clarity, speed, and polish. They delivered all three with a calm, collaborative workflow from kickoff to launch.",
      image: "https://randomuser.me/api/portraits/women/9.jpg",
      layerY: testimonialLayerY6,
    },
    {
      company: "Northline Retail",
      testimonial:
        "The redesign helped customers find products faster and boosted conversions right away. The quality of execution was excellent.",
      image: "https://randomuser.me/api/portraits/men/57.jpg",
      layerY: testimonialLayerY7,
    },
    {
      company: "Astra Mobility",
      testimonial:
        "They translated complex technical requirements into a product experience that feels simple, fast, and dependable.",
      image: "https://randomuser.me/api/portraits/women/30.jpg",
      layerY: testimonialLayerY8,
    },
  ]);

  const footerSectionY = useTransform(
    pageScroll,
    [0.9, 0.94],
    ["1000px", "0px"],
  );
  const footerSectionScale = useTransform(pageScroll, [0.9, 0.94], [0.6, 1.1]);
  const footerSectionTitle = useTransform(pageScroll, [0.95, 0.96], [0, 1]);
  const footerSectionButtonA = useTransform(pageScroll, [0.96, 0.97], [0, 1]);
  const footerSectionButtonB = useTransform(pageScroll, [0.97, 0.98], [0, 1]);
  const footerSectionButtonLogo = useTransform(
    pageScroll,
    [0.98, 0.99],
    [0, 1],
  );

  const [entry, setEntry] = useState(false);

  const [randomColorA, setRandomColorA] = useState("#FFFFFF");
  const [randomColorB, setRandomColorB] = useState("#FFFFFF");
  const [randomColorC, setRandomColorC] = useState("#FFFFFF");

  useMotionValueEvent(pageScroll, "change", (latest) => {
    setRandomColorA(random.choice(["#1D1D1D", "#000000"]) || "#FFFFFF");
    setRandomColorB(random.choice(["#1D1D1D", "#000000"]) || "#FFFFFF");
    setRandomColorC(random.choice(["#1D1D1D", "#000000"]) || "#FFFFFF");

    if (latest > 0.39) {
      setRandomColorA("#FFFFFF");
    }
    if (latest > 0.4) {
      setRandomColorB("#FFFFFF");
    }
    if (latest > 0.41) {
      setRandomColorC("#FFFFFF");
      setWhiteBg(true);
    }
    if (latest < 0.65) {
      setWhiteBg(false);
    }

    if (latest > 0) {
      setBlackBoxSizeState(0);
    }
    if (latest > 0.1) {
      setBlackBoxSizeState(1);
    }
    if (latest > 0.16) {
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
        setEntry(true);
        clearInterval(incrementTimer);
      }
    }, 20);
    return () => clearInterval(incrementTimer);
  }, []);

  const [selectedWorkCategory, setSelectedWorkCategory] = useState<
    string | null
  >(null);

  const workCategories = [
    {
      data: false,
      animation: workCard6,
    },
    {
      name: "Branding",
      image: "cyan",
      data: true,
      animation: workCard1,
      pointer: workCard1Pointer,
    },
    {
      name: "Web Experiences",
      image: "pink",
      data: true,
      animation: workCard2,
      pointer: workCard2Pointer,
    },
    {
      data: false,
      animation: workCard6,
    },

    {
      name: "Mobile apps",
      image: "blue",
      data: true,
      animation: workCard3,
      pointer: workCard3Pointer,
    },
    {
      data: false,
      animation: workCard6,
    },
    {
      data: false,
      animation: workCard6,
    },
    {
      name: "Graphics",
      image: "green",
      data: true,
      animation: workCard4,
      pointer: workCard4Pointer,
    },
    {
      data: false,
      animation: workCard6,
    },
    {
      name: "UI/UX",
      image: "red",
      data: true,
      animation: workCard5,
      pointer: workCard5Pointer,
    },
    {
      data: false,
      animation: workCard6,
    },
    {
      data: false,
      animation: workCard6,
    },
  ];

  const projects = {
    Branding: [
      {
        name: "Ember & Co. Identity",
        images: [],
        coverImage: "https://picsum.photos/400/500",
        year: "2021",
        description: "",
      },
      {
        name: "Volta Brand System",
        images: [],
        coverImage: "https://picsum.photos/380/460",
        year: "2023",
        description: "",
      },
      {
        name: "Northfield Rebrand",
        images: [],
        coverImage: "https://picsum.photos/420/520",
        year: "2020",
        description: "",
      },
      {
        name: "Sable Studio Mark",
        images: [],
        coverImage: "https://picsum.photos/360/480",
        year: "2024",
        description: "",
      },
    ],
    "Web Experiences": [
      {
        name: "Parallax Museum",
        images: [],
        coverImage: "https://picsum.photos/800/500",
        year: "2022",
        description: "",
      },
      {
        name: "Driftwood Portfolio",
        images: [],
        coverImage: "https://picsum.photos/750/480",
        year: "2023",
        description: "",
      },
      {
        name: "Luminary Landing Page",
        images: [],
        coverImage: "https://picsum.photos/820/460",
        year: "2021",
        description: "",
      },
      {
        name: "Crestline Interactive",
        images: [],
        coverImage: "https://picsum.photos/780/520",
        year: "2024",
        description: "",
      },
      {
        name: "Opaline Storefront",
        images: [],
        coverImage: "https://picsum.photos/760/440",
        year: "2020",
        description: "",
      },
    ],
    "Mobile apps": [
      {
        name: "Waypoint Travel",
        images: [],
        coverImage: "https://picsum.photos/320/580",
        year: "2023",
        description: "",
      },
      {
        name: "Folia Plant Tracker",
        images: [],
        coverImage: "https://picsum.photos/300/560",
        year: "2021",
        description: "",
      },
      {
        name: "Pulse Fitness",
        images: [],
        coverImage: "https://picsum.photos/340/600",
        year: "2022",
        description: "",
      },
      {
        name: "Haven Sleep App",
        images: [],
        coverImage: "https://picsum.photos/310/570",
        year: "2024",
        description: "",
      },
      {
        name: "Cartō Maps",
        images: [],
        coverImage: "https://picsum.photos/330/590",
        year: "2020",
        description: "",
      },
    ],
    Graphics: [
      {
        name: "Solstice Poster Series",
        images: [],
        coverImage: "https://picsum.photos/500/700",
        year: "2022",
        description: "",
      },
      {
        name: "Inkwell Editorial",
        images: [],
        coverImage: "https://picsum.photos/480/680",
        year: "2023",
        description: "",
      },
      {
        name: "Geometric Fauna",
        images: [],
        coverImage: "https://picsum.photos/520/720",
        year: "2021",
        description: "",
      },
    ],
    "UI/UX": [
      {
        name: "Meridian Dashboard",
        images: [],
        coverImage: "https://picsum.photos/900/560",
        year: "2024",
        description: "",
      },
      {
        name: "Finch Onboarding Flow",
        images: [],
        coverImage: "https://picsum.photos/860/540",
        year: "2022",
        description: "",
      },
      {
        name: "Strata Design System",
        images: [],
        coverImage: "https://picsum.photos/880/520",
        year: "2023",
        description: "",
      },
      {
        name: "Orion Admin Panel",
        images: [],
        coverImage: "https://picsum.photos/920/580",
        year: "2021",
        description: "",
      },
      {
        name: "Bloom Health App",
        images: [],
        coverImage: "https://picsum.photos/840/500",
        year: "2020",
        description: "",
      },
    ],
  };

  const [categoryChanged, setCategoryChanged] = useState(false);

  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  return (
    <main>
      <Navbar />
      <section ref={pageRef} className="">
        <motion.div className="relative">
          <motion.div
            style={{
              scale: loaderPct === 100 ? 1.2 : 0,
            }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-screen bg-black z-9 h-screen duration-1400 ease-in-out overflow-hidden"
          >
            <motion.div
              initial={{
                width: 0,
              }}
              animate={{
                width: loaderPct === 100 ? 400 : 0,
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
                width: loaderPct === 100 ? 400 : 0,
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
                opacity: loaderPct === 100 ? 1 : 0,
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
                opacity: loaderPct === 100 ? 1 : 0,
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
                opacity: loaderPct === 100 ? 1 : 0,
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
                opacity: loaderPct === 100 ? 1 : 0,
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

            <div
              style={{ width: "100%", height: "100vh", position: "relative" }}
            >
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
                {loaderPct === 100 ? "100" : loaderPct}
              </span>
            </div>
          </div>
          <div className="min-h-[200vh]"></div>
        </motion.div>

        <motion.div
          style={{
            y: secondSectionOpacity,
            scale: secondSectionScale,
            background: secondSectionBG,
          }}
          className="min-h-screen bg-black z-999 fixed top-0 left-0 w-screen  pointer-events-none rounded-lg"
        >
          <motion.div
            style={{
              opacity: secondSectionText,
            }}
            className="heroDark w-screen h-screen heroDark bg-black"
          ></motion.div>
          <motion.div
            style={{
              opacity: secondSectionText,
            }}
            className="text-white  absolute top-1/2 left-1/2 max-w-md text-xl font-chakra-petch text-center -translate-x-1/2 -translate-y-1/2"
          >
            Creative websites are the intersection of creativity and
            technicality to form bespoke digital experiences that <br />{" "}
            <motion.p
              style={{
                color: secondSectionRed,
              }}
            >
              spark emotion
            </motion.p>
          </motion.div>
          <FatCursors color="#cd171770" scale={0.3} min={16}></FatCursors>
        </motion.div>
        <div
          id="pixelLoader"
          className="min-h-screen w-screen  fixed top-0 left-0 z-999 grid grid-cols-5 grid-rows-3"
        >
          {new Array(15).fill("").map((x, i) => (
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

        <AnimatePresence>
          {selectedWorkCategory && (
            <motion.div
              initial={{
                x: "100%",
              }}
              animate={{
                x: "0%",
              }}
              exit={{
                x: "100%",
              }}
              transition={{
                duration: 1.2,
                ease: "circInOut",
              }}
              className="bg-zinc-100  w-[70vw] h-screen fixed top-0 right-0 z-9999999 p-16 flex justify-center items-center"
            >
              <div className="w-1/2 flex flex-col justify-center items-center space-y-6 h-full ">
                <motion.img
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  transition={{
                    delay: 1.4,
                  }}
                  className="max-h-96 object-cover"
                  src={
                    projects[
                      selectedWorkCategory as keyof typeof projects
                    ].filter((x) => x.name === selectedProject)[0].coverImage
                  }
                  alt=""
                />
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
                  className="font-chakra-petch text-3xl"
                >
                  {selectedProject}
                </motion.div>
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  transition={{
                    delay: 1.3,
                  }}
                  className="font-chakra-petch text-base text-center max-w-xs"
                >
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Quidem, natus sit dolor eos perspiciatis quasi earum.
                </motion.div>
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  transition={{
                    delay: 1.5,
                  }}
                  className="p-8 rounded-full cursor-pointer border-2 border-black text-black hover:bg-black hover:text-white duration-300"
                >
                  <ChevronUp className="rotate-36"></ChevronUp>
                </motion.div>
              </div>
              <div className="w-1/2 flex flex-col justify-center items-start h-full pl-16">
                {projects[selectedWorkCategory as keyof typeof projects].map(
                  (x, i) => (
                    <motion.div
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      transition={{
                        delay: 1.4 + (0.1 * i + 1),
                      }}
                      className="flex gap-8 justify-between w-full font-chakra-petch items-center hover:-translate-x-9 duration-200 cursor-pointer ease-in-out "
                      onClick={() => {
                        setSelectedProject(x.name);
                      }}
                      key={i}
                    >
                      <div
                        className={`border-l  h-full p-2 pl-3 flex flex-col justify-center duration-300 items-center ${selectedProject === x.name ? "border-black" : "border-black/20"}`}
                      >
                        <div
                          className={` font-semibold duration-200 min-w-36 ${selectedProject === x.name ? "text-base" : "text-sm"}`}
                        >
                          {x.name}
                        </div>
                        <div className="text-black/50 text-left w-full">
                          {x.year}
                        </div>
                      </div>
                      <div className="py-3">
                        <img
                          src={x.coverImage}
                          className={`rounded-md duration-200 w-32 h-24  ${selectedProject === x.name ? "grayscale-0" : "grayscale-100"}`}
                        ></img>
                      </div>
                    </motion.div>
                  ),
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {selectedWorkCategory && (
            <motion.div
              initial={{
                x: "-100%",
              }}
              animate={{
                x: "0%",
              }}
              exit={{
                x: "-100%",
              }}
              transition={{
                duration: 1.2,
                ease: "circInOut",
              }}
              className="bg-black w-[30vw] h-screen fixed top-0 left-0 z-99999999 p-6 font-chakra-petch space-y-16 "
            >
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: categoryChanged ? 0 : 1,
                }}
                transition={{
                  delay: 1.2,
                }}
                className="text-white text-6xl min-h-78 duration-200 flex flex-col-reverse gap-6"
              >
                {Object.keys(projects).map((x) => {
                  if (x === selectedWorkCategory)
                    return (
                      <React.Fragment key={x}>
                        <ScrambledText
                          className="z-999 text-white"
                          radius={100}
                          style={{
                            color: "white",
                            fontSize: "1.2em",
                            width: "100%",
                            fontFamily: "Chakra Petch",
                            textAlign: "left",
                            margin: "0",
                            wordSpacing: "500px",
                          }}
                          duration={3}
                          speed={0.9}
                          scrambleChars=".:-"
                        >
                          {x}
                        </ScrambledText>
                      </React.Fragment>
                    );
                })}

                {/* <ScrambledText
                  className="z-999 text-white"
                  radius={10}
                  style={{
                    color: "white",
                    fontSize: "1.2em",
                    width: "100%",
                    fontFamily: "Chakra Petch",
                    textAlign: "left",
                    margin: "0",
                  }}
                  duration={2}
                  speed={0.01}
                  scrambleChars=".:-"
                >
                  {selectedWorkCategory}
                </ScrambledText> */}

                {/* <p>{selectedWorkCategory}</p> */}
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  transition={{
                    delay: 1,
                  }}
                  onClick={() => {
                    setSelectedWorkCategory(null);
                  }}
                  className="p-8 rounded-full bg-black border border-white hover:bg-white hover:text-black text-white w-fit duration-200 cursor-pointer"
                >
                  <X></X>
                </motion.div>
              </motion.div>

              <div className="flex flex-col justify-start items-start text-xl text-white space-y-3 ">
                {workCategories
                  .filter((x) => x.data)
                  .map((x, i) => (
                    <motion.div
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      transition={{
                        delay: 1.2 + 0.1 * (i + 1),
                      }}
                      onClick={() => {
                        setCategoryChanged(true);
                        setTimeout(() => {
                          setCategoryChanged(false);
                          if (x.name) {
                            setSelectedWorkCategory(x.name);
                            setSelectedProject(
                              projects[x.name as keyof typeof projects][0].name,
                            );
                          }
                        }, 1500);
                      }}
                      className={`hover:underline p-1 cursor-pointer duration-200  ${selectedWorkCategory === x.name ? "tex-white" : "text-white/40"}`}
                      key={x.name}
                    >
                      {x.name}
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {selectedWorkCategory && (
            <motion.div
              onClick={() => {
                setSelectedWorkCategory(null);
              }}
              initial={{
                x: "-100%",
              }}
              animate={{
                x: categoryChanged ? "0%" : "-68%",
              }}
              exit={{
                x: "-100%",
              }}
              transition={{
                duration: 1.2,
                ease: "circInOut",
              }}
              className="bg-asymmetri-red w-screen h-screen fixed top-0 left-0 z-9999999"
            ></motion.div>
          )}
        </AnimatePresence>

        <motion.div
          style={{
            opacity: thirdSectionOpacity,
          }}
          className="min-h-screen bg-white fixed top-0 left-0 w-screen z-999 flex justify-center items-center "
        >
          <FatCursors color="#000000" scale={0.5} min={1}></FatCursors>
          <div className="absolute top-0 left-0 w-screen h-screen grid-cols-4 grid-rows-3 grid  px-26 ">
            {workCategories.map((x, i) => {
              if (x.data) {
                return (
                  <motion.div
                    style={{
                      opacity: x.animation,
                      pointerEvents: x.pointer,
                    }}
                    onClick={() => {
                      if (x.name) {
                        setSelectedWorkCategory(x.name);

                        setSelectedProject(
                          projects[x.name as keyof typeof projects][0].name,
                        );
                      }
                    }}
                    className={`bg-white flex justify-end items-end h-full  font-chakra-petch duration-300 text-xl  hover:text-white cursor-pointer  border-l border-b border-black/30 relative ${(i === 3 || i === 7 || i === 11) && "border-r"}`}
                    key={i}
                  >
                    <img
                      src={
                        projects[x.name as keyof typeof projects][0].coverImage
                      }
                      className="w-full h-full absolute top-0 left-0 object-cover brightness-50"
                      alt=""
                    />
                    <div className="bg-white z-999  hover:bg-transparent h-full w-full p-3 flex justify-center items-center text-center duration-300">
                      {x.name}
                    </div>
                  </motion.div>
                );
              } else {
                return (
                  <motion.div
                    style={{
                      opacity: x.animation,
                    }}
                    key={i}
                    className={`h-full w-full bg-black/5 ${i !== 6 && "border-l"} border-b border-black/30 ${(i === 3 || i === 7 || i === 11) && "border-r"}`}
                  ></motion.div>
                );
              }
            })}
          </div>

          <ScrambledText
            className="text-7xl font-semibold text-asymmetri-red font-chakra-petch  z-99"
            radius={100}
            style={{
              color: "red",
              fontSize: "4em",
              fontFamily: "Chakra Petch",
            }}
            duration={5}
            speed={0.01}
            scrambleChars=".:-"
          >
            Area of Expertise
          </ScrambledText>
          {/* <div className="text-7xl font-semibold text-asymmetri-red font-chakra-petch  z-99">
            Area of Expertise
          </div> */}
        </motion.div>
        <motion.div
          style={{
            y: fourthSectionOpacity,
            background: fourthSectionGradient,
          }}
          className="bg-black w-screen h-screen fixed top-0 left-0 z-9999 flex justify-between items-center flex-col"
        >
          <motion.div
            style={{
              opacity: fifthSectionSecondTitle,
            }}
            className="fixed top-36 left-8 text-7xl font-chakra-petch text-black z-9999999 font-bold max-w-6xl pointer-events-none"
          >
            This is the space where we test, tweak, break things, and make them
            better.
          </motion.div>
          <motion.div
            style={{
              opacity: fifthSectionSecondTitle2,
            }}
            className="fixed bottom-36 right-48 text-xl font-chakra-petch text-black z-99999 font-bold max-w-xs"
          >
            Stick around — you might find exactly what your project needs.
          </motion.div>
          <motion.div
            style={{
              opacity: fifthSectionTitle,
            }}
            className="fixed top-20 text-5xl font-chakra-petch text-asymmetri-red z-99999 font-bold"
          >
            Hi! I'm Nandagopal, founder of
          </motion.div>
          <motion.div
            style={{
              opacity: fifthSectionLogo,
            }}
            className="fixed top-36 text-5xl font-chakra-petch text-asymmetri-red z-9999999 font-bold pointer-events-none"
          >
            <img src="/logo.png" className="invert-100 w-5xl " alt="" />
          </motion.div>

          <motion.div
            style={{
              opacity: fourthSectionFinalOpacity,
            }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-48 bg-linear-360 from-asymmetri-red/30 to-transparent w-[110vw] rounded-[6em] "
          ></motion.div>

          <motion.div
            style={{
              opacity: fourthSectionText,
              y: fourthSectionY,
              scale: fourthSectionScale,
            }}
            className="text-6xl max-w-2xl font-chakra-petch text-white text-center z-99999"
          >
            The ideas that define
            <motion.span
              style={{
                color: fourthSectionColor,
              }}
              className=""
            >
              <ScrambledText
                className="z-999999 text-white"
                radius={100}
                style={{
                  color: "inherit",
                  fontSize: "1.2em",
                  width: "fit-content",
                  fontFamily: "Chakra Petch",
                  textAlign: "center",
                  margin: "0",
                  display: "inline",
                }}
                duration={3}
                speed={0.9}
                scrambleChars=".:-"
              >
                Asymmetri
              </ScrambledText>
            </motion.span>{" "}
            and the mindset behind the work you see.
          </motion.div>
          <motion.div
            style={{
              opacity: fourthSectionData,
              y: fourthSectionDataY,
            }}
            className="flex w-full items-center justify-between  p-16 pt-0  border-white gap-16 z-999999 "
          >
            <motion.div
              style={{
                opacity: fourthSectionFinalOpacity,
              }}
              className="w-screen h-px bg-white absolute top-0 left-0"
            ></motion.div>
            <motion.div
              style={{
                opacity: fourthSectionFinalOpacity,
              }}
              className="w-1/3 pr-6 flex justify-start items-start flex-col min-h-36 gap-6 h-full"
            >
              <div className="text-3xl font-chakra-petch text-white pt-3">
                Philosophy
              </div>
              <div className="text-white text-xl font-chakra-petch max-w-md">
                Our commitment goes beyond fleeting trends, we believe in making
                tailor made products Our commitment goes beyond fleeting trends,
                we believe in making tailor made products
              </div>
            </motion.div>
            <div className="w-1/3 flex justify-center items-center relative">
              <motion.img
                style={{
                  opacity: fourthSectionFinalOpacity,
                }}
                src="/flip.png"
                className="w-full z-999"
                alt=""
              />

              <motion.img
                style={{
                  scale: nandScale,
                  filter: nandBlur,
                }}
                src="/nand2.jpg"
                className="w-full absolute top-0 left-0 h-full object-cover"
                alt=""
              />
            </div>
            <motion.div
              style={{
                opacity: fourthSectionFinalOpacity,
              }}
              className="w-1/3 pr-6 flex justify-start items-start flex-col min-h-36 gap-6 h-full"
            >
              <div className="text-3xl font-chakra-petch text-white pt-3">
                Our Mission
              </div>
              <div className="text-white text-xl font-chakra-petch max-w-3xl">
                Our commitment goes beyond fleeting trends, we believe in making
                tailor made productsOur commitment goes beyond fleeting trends,
                we believe in making tailor made products Our commitment goes
                beyond fleeting trends, we believe in making tailor made
                productsOur commitment goes beyond fleeting trends, we believe
                in making tailor made products
              </div>
            </motion.div>

            <div></div>
          </motion.div>

          <motion.div
            style={{
              y: fourthSectionBG,
            }}
            className="h-128 w-3xl flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <motion.div
              style={{
                opacity: fourthSectionFinalOpacity,
              }}
              className="relative w-full h-full  flex justify-center items-center pointer-events-none "
            ></motion.div>
          </motion.div>
        </motion.div>
        <motion.div
          className="bg-black w-screen h-screen fixed top-0 left-0 z-99999999 rounded-xl flex justify-center items-center flex-col"
          style={{
            y: sixthSectionY,
            scale: sixthSectionScale,
          }}
        >
          <FatCursors color="#FFFFFF50" scale={1} min={1}></FatCursors>

          {testimonials.map((x, i) => {
            const slot = testimonialSlots[(i - 1) % testimonialSlots.length];
            return (
              <motion.div
                style={{
                  y: x.layerY,
                  opacity: testimonialLayerOpacity,
                }}
                animate={{
                  top: i === 0 ? "50%" : slot.top,
                  left: i === 0 ? "50%" : slot.left,
                  scale: i === 0 ? 1 : 0.42,
                }}
                transition={{
                  duration: 1,
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
                className={`absolute -translate-x-1/2 -translate-y-1/2 font-chakra-petch z-9999999999 ${i === 0 ? "cursor-default" : "cursor-pointer"}`}
              >
                <img
                  src={x.image}
                  className={`w-64 duration-500 ${i === 0 ? "grayscale-0" : "grayscale"}`}
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
                      className="absolute left-[calc(100%+0.75rem)] top-0 flex flex-col justify-start items-start gap-6"
                    >
                      <div className="w-40 text-white text-sm ">
                        {x.testimonial}
                      </div>
                      <div className="w-40 text-asymmetri-red text-sm z-9999999">
                        <ScrambledText
                          className="z-999999 "
                          radius={100}
                          style={{
                            color: "inherit",
                            fontSize: "inherit",
                            width: "100%",
                            fontFamily: "Chakra Petch",
                            textAlign: "left",
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
              opacity: sixthSectionTitleBG,
            }}
            className="heroDark w-screen h-screen heroDark bg-black absolute top-0 left-0"
          ></motion.div>

          <motion.div
            style={{
              opacity: sixthSectionTitle,
            }}
            className="text-7xl max-w-sm text-center text-white font-chakra-petch z-9999"
          >
            Feedback from the folks who know us best.
          </motion.div>

          <motion.div
            style={{
              opacity: sixthSectionTitle2,
            }}
            className="text-left text-xs absolute text-white/50 bottom-20 left-1/2 -translate-x-1/2 font-chakra-petch  z-9999 "
          >
            Collaborative agency for bold ideas, beautiful code and digital
            experiences
          </motion.div>
        </motion.div>
        <motion.section
          style={{
            y: footerSectionY,
            scale: footerSectionScale,
          }}
          className="flex flex-col gap-6 xl:gap-8 items-center justify-center text-center bg-asymmetri-red min-h-screen  z-999999999 fixed top-0 left-0 w-screen h-screen rounde-lg"
        >
          <motion.h2
            style={{
              opacity: footerSectionTitle,
            }}
            className="font-chakra-petch text-white font-medium text-2xl lg:text-4xl xl:text-5xl"
          >
            Let’s turn your ideas into <br /> beautiful asymmetry.
          </motion.h2>

          <div className="flex flex-row gap-2 xl:gap-4">
            <motion.div
              style={{
                opacity: footerSectionButtonA,
              }}
              className=""
            >
              <Button
                size="lg"
                className="font-chakra-petch text-asymmetri-red py-4 font-semibold"
              >
                Get in touch
              </Button>
            </motion.div>
            <motion.div
              style={{
                opacity: footerSectionButtonB,
              }}
            >
              <Button
                size="lg"
                className="font-chakra-petch bg-transparent font-semibold"
                variant={"outline"}
              >
                Join our team
              </Button>
            </motion.div>
          </div>
          <motion.img
            style={{
              opacity: footerSectionButtonLogo,
            }}
            src="/logo.png"
            className="w-6xl bottom-16 fixed left-1/2 -translate-x-1/2"
            alt=""
          />
        </motion.section>
        <div className="min-h-[800vh]"></div>
      </section>
    </main>
  );
}
