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
import { MobileTestimonialsCarousel } from "@/components/MobileTestimonialsCarousel";

export default function Home() {
  const pageRef = useRef(null);

  const { scrollYProgress: pageScroll } = useScroll({
    target: pageRef,
    offset: ["start end", "end start"],
  });

  const [blackBoxSizeState, setBlackBoxSizeState] = useState(0);
  const [loaderPct, setLoaderPct] = useState(0);

  const [whiteBG, setWhiteBg] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const tabletQuery = window.matchMedia(
      "(min-width: 768px) and (max-width: 1279px)",
    );
    const updateTabletState = (event?: MediaQueryListEvent) => {
      setIsTablet(event ? event.matches : tabletQuery.matches);
    };

    updateTabletState();
    tabletQuery.addEventListener("change", updateTabletState);
    return () => tabletQuery.removeEventListener("change", updateTabletState);
  }, []);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const updateMobile = (event?: MediaQueryListEvent) => {
      setIsMobile(event ? event.matches : mobileQuery.matches);
    };
    updateMobile();
    mobileQuery.addEventListener("change", updateMobile);
    return () => mobileQuery.removeEventListener("change", updateMobile);
  }, []);

  /** Mobile + tablet: numeric scroll offsets and compact touch layouts */
  const isCompact = isMobile || isTablet;

  /** Viewport height for tablet “below fold” offsets (Motion cannot interpolate calc(dvh) → px reliably). */
  const [tabletBelowFoldPx, setTabletBelowFoldPx] = useState(1400);
  useEffect(() => {
    const update = () =>
      setTabletBelowFoldPx(Math.ceil(window.innerHeight * 1.42 + 120));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const secondSectionOpacity = useTransform(
    pageScroll,
    [0, 0.1, 0.2],
    isCompact
      ? [tabletBelowFoldPx + 48, tabletBelowFoldPx + 48, 0]
      : [1000, 1000, 0],
  );
  const secondSectionScale = useTransform(
    pageScroll,
    isCompact ? [0, 0.2, 0.3] : [0.2, 0.3],
    isCompact ? [0.8, 0.8, 1.05] : [0.7, 1.1],
  );
  const secondSectionBG = useTransform(
    pageScroll,
    [0, 0.2, 0.3],
    ["#0a0a0a", "#0a0a0a", "#000000"],
  );
  const secondSectionText = useTransform(pageScroll, [0, 0.3, 0.32], [0, 0, 1]);
  const secondSectionLines = useTransform(
    pageScroll,
    [0, 0.32, 0.33],
    [0, 0, 1],
  );

  const secondSectionRed = useTransform(
    pageScroll,
    [0, 0.34, 0.36],
    ["#ffffff", "#ffffff", "#ff0000"],
  );
  const secondSectionGrid = useTransform(
    pageScroll,
    [0, 0.38, 0.39],
    [0, 0, 1],
  );
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
    [0, 0.53, 0.6],
    isCompact
      ? [tabletBelowFoldPx + 56, tabletBelowFoldPx + 56, 0]
      : [1000, 1000, 0],
  );

  const fourthSectionPointer = useTransform(
    pageScroll,
    [0, 0.55],
    ["none", "all"],
  );
  const fourthSectionText = useTransform(
    pageScroll,
    [0, 0.6, 0.61, 0.75],
    ["0", "0", "1", "0"],
  );
  const fourthSectionColor = useTransform(
    pageScroll,
    [0, 0.6, 0.61, 0.7],
    ["#ffffff", "#ffffff", "#ff0000", "#ffffff"],
  );

  const fourthSectionBG = useTransform(
    pageScroll,
    [0, 0.6, 0.64, 0.7],
    isCompact ? [360, 360, 0, -120] : [500, 500, 0, -200],
  );
  const fourthSectionGradient = useTransform(
    pageScroll,
    [0, 0.65, 0.7, 0.75],
    ["#000000", "#000000", "#cd1717", "#ffffff"],
  );

  const fourthSectionY = useTransform(
    pageScroll,
    [0, 0.65, 0.7],
    isCompact ? [1008, 72, 0] : [2410, 200, 30],
  );

  const fourthSectionScale = useTransform(
    pageScroll,
    [0, 0.65, 0.7],
    isCompact ? [1, 1, 0.82] : [1, 1, 0.5],
  );
  const fourthSectionData = useTransform(
    pageScroll,
    [0, 0.68, 0.685],
    [0, 0, 1],
  );
  const fourthSectionDataY = useTransform(
    pageScroll,
    [0, 0.67, 0.7],
    isCompact ? [200, 200, 0] : [600, 600, -100],
  );
  const fourthSectionFinalOpacity = useTransform(
    pageScroll,
    [0, 0.73, 0.75],
    [1, 1, 0],
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
  const nandScale = useTransform(
    pageScroll,
    [0.77, 0.79],
    isCompact ? [1, 1.06] : [1, 1.1],
  );
  const nandBlur = useTransform(
    pageScroll,
    [0.77, 0.79],
    isCompact ? ["blur(0px)", "blur(7px)"] : ["blur(0px)", "blur(10px)"],
  );

  const fifthSectionLogo = useTransform(
    pageScroll,
    [0.76, 0.77, 0.79],
    [0, 1, 0],
  );

  const sixthSectionPointer = useTransform(
    pageScroll,
    [0, 0.82],
    ["none", "all"],
  );
  const sixthSectionY = useTransform(
    pageScroll,
    [0, 0.8, 0.83],
    isCompact ? [tabletBelowFoldPx, tabletBelowFoldPx, 0] : [1000, 1000, 0],
  );
  const sixthSectionScale = useTransform(
    pageScroll,
    isCompact ? [0, 0.8, 0.83] : [0.8, 0.83],
    isCompact ? [0.88, 0.88, 1.02] : [0.6, 1.1],
  );

  const sixthSectionTitle = useTransform(
    pageScroll,
    [0, 0.84, 0.85, 0.87],
    [0, 0, 1, 0],
  );
  const sixthSectionTitle2 = useTransform(
    pageScroll,
    [0, 0.85, 0.86, 0.87],
    [0, 0, 1, 0],
  );

  const sixthSectionTitleBG = useTransform(
    pageScroll,
    [0, 0.84, 0.85],
    [0, 0, 1],
  );

  const testimonialLayerOpacity = useTransform(
    pageScroll,
    [0, 0.87, 0.9],
    [0, 0, 1],
  );
  const testimonialLayerY0 = useTransform(
    pageScroll,
    [0, 0.868, 0.9],
    isCompact
      ? [tabletBelowFoldPx + 112, tabletBelowFoldPx + 112, 0]
      : [1040, 1040, 0],
  );
  const testimonialLayerY1 = useTransform(
    pageScroll,
    [0, 0.87, 0.902],
    isCompact
      ? [tabletBelowFoldPx + 88, tabletBelowFoldPx + 88, 0]
      : [980, 980, 0],
  );
  const testimonialLayerY2 = useTransform(
    pageScroll,
    [0, 0.872, 0.904],
    isCompact
      ? [tabletBelowFoldPx + 132, tabletBelowFoldPx + 132, 0]
      : [1120, 1120, 0],
  );
  const testimonialLayerY3 = useTransform(
    pageScroll,
    [0, 0.874, 0.906],
    isCompact
      ? [tabletBelowFoldPx + 72, tabletBelowFoldPx + 72, 0]
      : [960, 960, 0],
  );
  const testimonialLayerY4 = useTransform(
    pageScroll,
    [0, 0.876, 0.908],
    isCompact
      ? [tabletBelowFoldPx + 124, tabletBelowFoldPx + 124, 0]
      : [1080, 1080, 0],
  );
  const testimonialLayerY5 = useTransform(
    pageScroll,
    [0, 0.878, 0.9],
    isCompact
      ? [tabletBelowFoldPx + 56, tabletBelowFoldPx + 56, 0]
      : [920, 920, 0],
  );
  const testimonialLayerY6 = useTransform(
    pageScroll,
    [0, 0.88, 0.91],
    isCompact
      ? [tabletBelowFoldPx + 148, tabletBelowFoldPx + 148, 0]
      : [1160, 1160, 0],
  );
  const testimonialLayerY7 = useTransform(
    pageScroll,
    [0, 0.882, 0.899],
    isCompact
      ? [tabletBelowFoldPx + 68, tabletBelowFoldPx + 68, 0]
      : [940, 940, 0],
  );
  const testimonialLayerY8 = useTransform(
    pageScroll,
    [0, 0.8, 0.9],
    isCompact
      ? [tabletBelowFoldPx + 96, tabletBelowFoldPx + 96, 0]
      : [1020, 1020, 0],
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

  /** Clamp past scroll range: mixing calc() with px in Motion often snaps y to 0 before the footer segment. */
  const footerSectionPointer = useTransform(
    pageScroll,
    [0, 0.92],
    ["none", "all"],
  );
  const footerSectionY = useTransform(
    pageScroll,
    [0, 0.9, 0.94],
    isCompact ? [tabletBelowFoldPx, tabletBelowFoldPx, 0] : [1000, 1000, 0],
  );
  const footerSectionScale = useTransform(
    pageScroll,
    isCompact ? [0, 0.9, 0.94] : [0.9, 0.94],
    isCompact ? [0.92, 0.92, 1.02] : [0.6, 1.1],
  );
  const footerSectionTitle = useTransform(pageScroll, [0.95, 0.96], [0, 1]);
  const footerSectionButtonA = useTransform(pageScroll, [0.96, 0.97], [0, 1]);
  const footerSectionButtonB = useTransform(pageScroll, [0.97, 0.98], [0, 1]);
  const footerSectionButtonLogo = useTransform(
    pageScroll,
    [0.98, 0.99],
    [0, 1],
  );

  const [entry, setEntry] = useState(false);

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
  const workGridLastColumnIndexes = [3, 7, 11];

  return (
    <main>
      <Navbar />
      <section ref={pageRef} className="touch-pan-y">
        <motion.div className="relative">
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
                PowerGlitch.glitch("#logo", glitchImage);
              }}
              src="/logo_light.png"
              alt=""
              id="logo"
              className={`absolute left-1/2 -translate-x-1/2 z-[10003] ${isMobile ? "top-[42%] -translate-y-1/2 w-[min(13rem,calc(100vw-3rem))] max-w-[calc(100vw-3rem)]" : `top-1/2 -translate-y-1/2 ${isCompact ? "w-64 max-w-[min(21rem,85vw)]" : "w-84"}`}`}
            />

            <div
              className="relative z-0 isolate"
              style={{ width: "100%", height: "100vh", position: "relative" }}
            >
              {!isMobile && (
                <GridScan
                  scanGlow={0.6}
                  scanDirection="backward"
                  lineStyle="solid"
                  lineJitter={0}
                  enableGyro={!isCompact}
                  scanDuration={2}
                  scanDelay={1}
                  lineThickness={0.1}
                  linesColor="#888888"
                  gridScale={0.1}
                  scanColor="#cd1717"
                  scanOpacity={0.3}
                  enablePost={!isCompact}
                  bloomIntensity={0.08}
                  chromaticAberration={0.002}
                  noiseIntensity={0.01}
                />
              )}
            </div>
          </motion.div>
          <div className="min-h-screen hero bg-white fixed w-full overflow-hidden">
            {!isMobile && <FatCursors scale={1} />}
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
              className={`absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 ${isMobile ? "w-[min(100%,17rem)] max-w-[calc(100vw-3rem)]" : isCompact ? "w-96" : "w-120"}`}
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
            className={`text-white absolute top-1/2 left-1/2 font-chakra-petch text-center -translate-x-1/2 -translate-y-1/2 px-6 ${isMobile ? "max-w-[min(18rem,calc(100vw-3rem))] px-6 text-base leading-relaxed" : isCompact ? "max-w-lg text-lg" : "max-w-md text-xl"}`}
          >
            Creative websites are the intersection of creativity and
            technicality to form bespoke digital experiences that
            {!isMobile && (
              <>
                {" "}
                <br />
              </>
            )}{" "}
            <motion.span
              style={{
                color: secondSectionRed,
              }}
              className="inline-block font-semibold"
            >
              spark emotion
            </motion.span>
          </motion.div>
          {!isMobile && <FatCursors color="#cd171770" scale={0.3} min={16} />}
        </motion.div>
        <div
          id="pixelLoader"
          className="min-h-screen w-screen  fixed top-0 left-0 z-999 grid grid-cols-5 grid-rows-3 pointer-events-none"
        >
          {new Array(15).fill("").map((x, i) => (
            <motion.div
              key={i}
              className=""
              style={{
                opacity: secondSectionGrid,
                background: random.choice([
                  gridColors.a,
                  gridColors.b,
                  gridColors.c,
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
                duration: isMobile ? 0.72 : isCompact ? 0.85 : 1.2,
                ease: "circInOut",
              }}
              className={`bg-zinc-100 fixed top-0 right-0 z-9999999 flex ${isMobile ? "h-[100dvh] max-h-[100dvh] w-full flex-col gap-6 overflow-y-auto overscroll-y-contain px-6 py-6" : isCompact ? "h-[100dvh] max-h-[100dvh] w-[min(100%,520px)] flex-col overflow-y-auto overscroll-y-contain py-8 px-5 gap-8" : "h-screen w-[70vw] justify-center items-center p-16"}`}
            >
              <div
                className={`flex flex-col justify-center items-center ${isCompact ? "w-full shrink-0 space-y-4" : "h-full w-1/2 space-y-6"}`}
              >
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
                  className={`object-cover ${isCompact ? "max-h-72" : "max-h-96"}`}
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
                  className={`font-chakra-petch ${isCompact ? "text-2xl" : "text-3xl"}`}
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
                  className={`rounded-full cursor-pointer border-2 border-black text-black hover:bg-black hover:text-white duration-300 ${isCompact ? "p-5" : "p-8"}`}
                >
                  <ChevronUp className="rotate-36"></ChevronUp>
                </motion.div>
              </div>
              <div
                className={`flex flex-col justify-start items-start ${isCompact ? "w-full flex-1 min-h-0 pb-10" : "h-full w-1/2 pl-16 justify-center"}`}
              >
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
                      className={`flex justify-between w-full font-chakra-petch items-center duration-200 cursor-pointer ease-in-out ${isCompact ? "gap-4 hover:-translate-x-3" : "gap-8 hover:-translate-x-9"}`}
                      onClick={() => {
                        setSelectedProject(x.name);
                      }}
                      key={i}
                    >
                      <div
                        className={`border-l  h-full p-2 pl-3 flex flex-col justify-center duration-300 items-center ${selectedProject === x.name ? "border-black" : "border-black/20"}`}
                      >
                        <div
                          className={`font-semibold duration-200 ${isCompact ? "min-w-28" : "min-w-36"} ${selectedProject === x.name ? "text-base" : "text-sm"}`}
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
                          className={`rounded-md duration-200 ${isCompact ? "w-24 h-20" : "w-32 h-24"} ${selectedProject === x.name ? "grayscale-0" : "grayscale-100"}`}
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
                duration: isMobile ? 0.72 : isCompact ? 0.85 : 1.2,
                ease: "circInOut",
              }}
              className={`bg-black fixed top-0 left-0 z-99999999 font-chakra-petch overflow-y-auto ${isMobile ? "h-[100dvh] max-h-[100dvh] w-full min-w-0 space-y-5 px-6 py-5" : isCompact ? "h-[100dvh] max-h-[100dvh] w-[min(44vw,320px)] min-w-[260px] p-5 space-y-6" : "h-screen w-[30vw] p-6 space-y-16"}`}
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
                className={`text-white duration-200 flex flex-col-reverse ${isMobile ? "text-3xl min-h-40 gap-3" : isCompact ? "text-4xl min-h-52 gap-4" : "text-6xl min-h-78 gap-6"}`}
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
                            wordSpacing: isCompact ? "normal" : "500px",
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
                  className={`rounded-full bg-black border border-white hover:bg-white hover:text-black text-white w-fit duration-200 cursor-pointer ${isCompact ? "p-5" : "p-8"}`}
                >
                  <X></X>
                </motion.div>
              </motion.div>

              <div
                className={`flex flex-col justify-start items-start text-white ${isCompact ? "text-base space-y-2" : "text-xl space-y-3"}`}
              >
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
                x: categoryChanged
                  ? "0%"
                  : isMobile
                    ? "-100%"
                    : isCompact
                      ? "-64%"
                      : "-68%",
              }}
              exit={{
                x: "-100%",
              }}
              transition={{
                duration: isMobile ? 0.72 : isCompact ? 0.85 : 1.2,
                ease: "circInOut",
              }}
              className="bg-asymmetri-red w-screen h-screen fixed top-0 left-0 z-9999999"
            ></motion.div>
          )}
        </AnimatePresence>

        <motion.div
          style={{
            opacity: thirdSectionOpacity,
            /** Mobile: full-viewport fixed + pointer-events all captures touch and blocks page scroll */
            pointerEvents: isMobile ? "none" : thirdSectionClick,
          }}
          className={
            isCompact
              ? isMobile
                ? "min-h-screen h-[100dvh] max-h-screen bg-white fixed top-0 left-0 w-screen z-999 flex flex-col items-center justify-center gap-4 px-6 pt-14 pb-[max(0.75rem,env(safe-area-inset-bottom))] overflow-hidden"
                : "min-h-screen h-[100dvh] max-h-screen bg-white fixed top-0 left-0 w-screen z-999 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-12 xl:gap-16 px-4 sm:px-8 lg:px-14 xl:px-20 pt-16 sm:pt-14 lg:pt-20 pb-6 sm:pb-10 overflow-hidden"
              : "min-h-screen bg-white fixed top-0 left-0 w-screen z-999 flex justify-center items-center"
          }
        >
          {!isMobile && <FatCursors color="#000000" scale={0.5} min={1} />}

          {isCompact ? (
            <div
              className={
                isMobile
                  ? "pointer-events-auto flex min-h-0 w-full max-w-full flex-1 flex-col items-center justify-center gap-4"
                  : "contents"
              }
            >
              <div
                className={`relative z-[1000] flex shrink-0 flex-col items-center justify-center text-center ${isMobile ? "max-w-[min(19rem,calc(100vw-3rem))] px-3" : "px-2 sm:max-w-[min(40vw,280px)] lg:max-w-[min(34vw,340px)]"}`}
              >
                <ScrambledText
                  className={`font-semibold text-asymmetri-red font-chakra-petch ${isMobile ? "text-3xl" : "text-4xl sm:text-5xl lg:text-6xl xl:text-7xl"}`}
                  radius={100}
                  style={{
                    color: "red",
                    fontSize: isMobile ? "1.55em" : "2.35em",
                    fontFamily: "Chakra Petch",
                  }}
                  duration={5}
                  speed={0.01}
                  scrambleChars=".:-"
                >
                  Area of Expertise
                </ScrambledText>
              </div>

              <div
                className={`relative z-99 flex min-h-0 w-full flex-1 flex-col overflow-y-auto overscroll-y-contain border border-black/30 ${isMobile ? "mx-auto max-h-[min(56dvh,480px)] w-full max-w-[min(19rem,calc(100vw-3rem))]" : "max-h-[min(72dvh,720px)] max-w-[min(92vw,420px)] sm:max-w-[440px] lg:max-w-[460px]"}`}
              >
                {workCategories
                  .filter(
                    (
                      c,
                    ): c is (typeof workCategories)[number] & {
                      name: string;
                    } => Boolean(c.data && "name" in c && c.name),
                  )
                  .map((x) => (
                    <motion.div
                      style={{
                        opacity: x.animation,
                        pointerEvents: isMobile ? "auto" : x.pointer,
                      }}
                      onClick={() => {
                        setSelectedWorkCategory(x.name);
                        setSelectedProject(
                          projects[x.name as keyof typeof projects][0].name,
                        );
                      }}
                      key={x.name}
                      className={`relative flex w-full shrink-0 cursor-pointer overflow-hidden border-b border-black/30 bg-white font-chakra-petch duration-300 last:border-b-0 hover:text-white ${isMobile ? "min-h-[4.75rem] text-sm" : "min-h-[5.5rem] text-base sm:min-h-24"}`}
                    >
                      <img
                        src={
                          projects[x.name as keyof typeof projects][0]
                            .coverImage
                        }
                        className="absolute inset-0 h-full w-full object-cover brightness-50"
                        alt=""
                      />
                      <div className="relative z-999 flex h-full min-h-[inherit] w-full items-center justify-center bg-white px-4 py-4 text-center duration-300 hover:bg-transparent">
                        {x.name}
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          ) : (
            <>
              <div className="absolute top-0 left-0 h-screen w-screen grid grid-cols-4 grid-rows-3 px-26">
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
                        className={`relative flex h-full cursor-pointer items-end justify-end border-b border-l border-black/30 bg-white font-chakra-petch text-xl duration-300 hover:text-white ${workGridLastColumnIndexes.includes(i) ? "border-r" : ""}`}
                        key={i}
                      >
                        <img
                          src={
                            projects[x.name as keyof typeof projects][0]
                              .coverImage
                          }
                          className="absolute top-0 left-0 h-full w-full object-cover brightness-50"
                          alt=""
                        />
                        <div className="z-999 flex h-full w-full items-center justify-center bg-white p-3 text-center duration-300 hover:bg-transparent">
                          {x.name}
                        </div>
                      </motion.div>
                    );
                  }
                  return (
                    <motion.div
                      style={{
                        opacity: x.animation,
                      }}
                      key={i}
                      className={`h-full w-full bg-black/5 border-b border-black/30 ${i !== 6 ? "border-l" : ""} ${workGridLastColumnIndexes.includes(i) ? "border-r" : ""}`}
                    />
                  );
                })}
              </div>

              <ScrambledText
                className="font-semibold text-asymmetri-red font-chakra-petch z-99 text-7xl"
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
            </>
          )}
        </motion.div>
        <motion.div
          style={{
            y: fourthSectionOpacity,
            background: fourthSectionGradient,
            pointerEvents: isMobile ? "none" : fourthSectionPointer,
          }}
          className={`bg-black w-screen fixed top-0 left-0 z-9999 flex justify-between items-center flex-col ${isCompact ? (isMobile ? "h-[100dvh] max-h-[100dvh] overflow-hidden px-7 sm:px-8" : "h-[100dvh] max-h-[100dvh] overflow-hidden px-8 sm:px-12") : "h-screen"}`}
        >
          <motion.div
            style={{
              opacity: fifthSectionSecondTitle,
            }}
            className={`fixed z-9999999 font-chakra-petch font-bold text-black text-pretty ${isMobile ? "pointer-events-none left-1/2 top-[max(4rem,calc(48svh-5rem))] w-[min(18.25rem,calc(100vw-3rem))] max-w-[min(18.25rem,calc(100vw-3rem))] -translate-x-1/2 px-3 text-center text-lg leading-snug" : isCompact ? "pointer-events-none left-1/2 top-[4.5rem] w-[min(34rem,calc(100vw-2.5rem))] max-w-[calc(100vw-2rem)] -translate-x-1/2 px-3 text-center text-3xl leading-tight" : "pointer-events-none left-8 top-36 max-w-6xl text-7xl"}`}
          >
            This is the space where we test, tweak, break things, and make them
            better.
          </motion.div>
          <motion.div
            style={{
              opacity: fifthSectionSecondTitle2,
            }}
            className={`fixed z-99999 font-chakra-petch font-bold text-black ${isMobile ? "pointer-events-none bottom-[calc(env(safe-area-inset-bottom,0)+3rem)] left-1/2 w-[min(17rem,calc(100vw-3rem))] max-w-[min(17rem,calc(100vw-3rem))] -translate-x-1/2 px-3 text-center text-xs text-pretty" : isCompact ? "bottom-[calc(env(safe-area-inset-bottom,0)+4rem)] left-1/2 w-[min(26rem,calc(100vw-2.5rem))] max-w-[calc(100vw-2rem)] -translate-x-1/2 px-3 text-center text-sm text-pretty" : "bottom-36 right-48 max-w-xs text-xl"}`}
          >
            Stick around — you might find exactly what your project needs.
          </motion.div>
          <motion.div
            style={{
              opacity: fifthSectionTitle,
            }}
            className={`fixed z-99999 font-chakra-petch font-bold text-asymmetri-red ${isMobile ? "pointer-events-none left-1/2 top-[max(2.75rem,calc(48svh-10rem))] w-[min(18rem,calc(100vw-3rem))] max-w-[min(18rem,calc(100vw-3rem))] -translate-x-1/2 px-3 text-center text-lg" : isCompact ? "left-1/2 top-4 w-[min(34rem,calc(100vw-2.5rem))] max-w-[calc(100vw-2rem)] -translate-x-1/2 px-3 text-center text-2xl" : "left-0 right-0 top-20 px-4 text-center text-5xl"}`}
          >
            Hi! I'm Nandagopal, founder of
          </motion.div>
          <motion.div
            style={{
              opacity: fifthSectionLogo,
            }}
            className={`fixed z-9999999 font-chakra-petch font-bold pointer-events-none text-asymmetri-red ${isMobile ? "left-1/2 top-[max(5.5rem,calc(48svh-7rem))] w-[min(17rem,calc(100vw-3rem))] max-w-[min(17rem,calc(100vw-3rem))] -translate-x-1/2 px-3 text-center" : isCompact ? "left-1/2 top-[4.25rem] w-[min(18rem,calc(100vw-2.5rem))] max-w-[calc(100vw-2rem)] -translate-x-1/2 px-3 text-center" : "left-1/2 top-36 -translate-x-1/2"}`}
          >
            <img
              src="/logo.png"
              className={`invert-100 mx-auto ${isMobile ? "w-[min(140px,38vw)]" : isCompact ? "w-[min(220px,42vw)]" : "w-5xl"}`}
              alt=""
            />
          </motion.div>

          <motion.div
            style={{
              opacity: fourthSectionFinalOpacity,
            }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-48 bg-linear-360 from-asymmetri-red/30 to-transparent w-[110vw] rounded-[6em] max-md:rounded-none"
          ></motion.div>

          <motion.div
            style={{
              opacity: fourthSectionText,
              y: fourthSectionY,
              scale: fourthSectionScale,
            }}
            className={`z-99999 font-chakra-petch text-center text-white ${isMobile ? "pointer-events-auto mx-auto mt-[min(16vh,100px)] mb-auto w-[min(18rem,calc(100vw-3rem))] max-w-[min(18rem,calc(100vw-3rem))] px-3 text-pretty text-lg leading-snug" : isCompact ? "mx-auto mt-[min(22vh,180px)] mb-auto w-[min(26rem,calc(100vw-2.5rem))] max-w-[calc(100vw-2rem)] px-3 text-pretty text-2xl" : "mx-auto max-w-2xl px-2 text-6xl"}`}
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
            className={`relative z-999999 w-full border-white ${isMobile ? "pointer-events-auto mx-auto flex min-h-0 w-full max-w-[min(19rem,calc(100vw-3rem))] flex-1 flex-col items-center justify-start gap-5 overflow-y-auto overscroll-y-contain px-4 pb-[env(safe-area-inset-bottom,0)] pt-3" : isCompact ? "mx-auto flex min-h-0 w-[min(34rem,calc(100vw-2.5rem))] max-w-[calc(100vw-2rem)] flex-1 flex-col items-center justify-start gap-8 overflow-y-auto overscroll-y-contain px-3 pb-[env(safe-area-inset-bottom,0)] pt-3" : "flex flex-row items-center justify-between gap-16 p-16 pt-0"}`}
          >
            <motion.div
              style={{
                opacity: fourthSectionFinalOpacity,
              }}
              className={`w-full bg-white ${isCompact ? "absolute left-0 right-0 top-0 h-px" : "absolute left-0 top-0 h-px w-screen"}`}
            ></motion.div>
            <motion.div
              style={{
                opacity: fourthSectionFinalOpacity,
              }}
              className={`flex flex-col gap-6 ${isCompact ? "mx-auto w-full max-w-sm items-center text-center" : "h-full min-h-36 w-1/3 items-start justify-start pr-6"}`}
            >
              <div
                className={`font-chakra-petch text-white pt-3 ${isMobile ? "text-xl" : isCompact ? "text-2xl" : "text-3xl"}`}
              >
                Philosophy
              </div>
              <div
                className={`text-white font-chakra-petch ${isMobile ? "max-w-full text-xs overflow-y-auto max-h-[28vh]" : isCompact ? "max-w-full text-sm overflow-y-auto max-h-[22vh]" : "text-xl max-w-md"}`}
              >
                Our commitment goes beyond fleeting trends, we believe in making
                tailor made products Our commitment goes beyond fleeting trends,
                we believe in making tailor made products
              </div>
            </motion.div>
            <div
              className={`flex shrink-0 justify-center ${isMobile ? "w-full max-w-[180px]" : isCompact ? "w-full max-w-[220px]" : "w-1/3"}`}
            >
              <div className="relative isolate inline-block max-w-full overflow-hidden bg-black">
                <motion.img
                  style={{
                    opacity: fourthSectionFinalOpacity,
                  }}
                  src="/flip.png"
                  alt=""
                  className={`relative z-10 block h-auto max-w-full object-contain ${isMobile ? "max-h-[22vh]" : isCompact ? "max-h-[26vh]" : ""}`}
                />
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden [contain:paint]">
                  <motion.img
                    style={{
                      scale: nandScale,
                      filter: nandBlur,
                    }}
                    src="/nand2.jpg"
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
            <motion.div
              style={{
                opacity: fourthSectionFinalOpacity,
              }}
              className={`flex flex-col gap-6 ${isCompact ? "mx-auto w-full max-w-sm items-center text-center" : "h-full min-h-36 w-1/3 items-start justify-start pr-6"}`}
            >
              <div
                className={`font-chakra-petch text-white pt-3 ${isMobile ? "text-xl" : isCompact ? "text-2xl" : "text-3xl"}`}
              >
                Our Mission
              </div>
              <div
                className={`text-white font-chakra-petch ${isMobile ? "max-w-full text-xs overflow-y-auto max-h-[28vh]" : isCompact ? "max-w-full text-sm overflow-y-auto max-h-[26vh]" : "text-xl max-w-3xl"}`}
              >
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
            className={`flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isMobile ? "h-72 w-[min(100%,22rem)] max-w-[94vw]" : isCompact ? "h-96 w-2xl max-w-[min(42rem,92vw)]" : "h-128 w-3xl"}`}
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
          className={`isolate bg-black w-screen fixed top-0 left-0 z-99999999 flex min-h-0 flex-col ${isMobile ? "h-[100dvh] max-h-[100dvh] items-stretch overflow-x-hidden overflow-hidden pt-[max(0.5rem,env(safe-area-inset-top))]" : "items-center justify-center overflow-hidden  " + (isCompact ? "h-[100dvh] max-h-[100dvh]" : "h-screen")}`}
          style={
            isMobile
              ? { y: sixthSectionY, pointerEvents: "none" }
              : {
                  y: sixthSectionY,
                  scale: sixthSectionScale,
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
              <div className="pointer-events-auto flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto overscroll-y-contain touch-pan-y px-0 pb-28">
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
                      opacity: testimonialLayerOpacity,
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
                className={`pointer-events-none z-[20] max-w-sm px-6 text-center font-chakra-petch text-white ${isCompact ? "relative text-3xl leading-snug" : "relative text-7xl"}`}
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
        <motion.section
          style={{
            y: footerSectionY,
            scale: footerSectionScale,
            pointerEvents: isMobile ? "none" : footerSectionPointer,
          }}
          className={`flex flex-col gap-6 xl:gap-8 items-center justify-center text-center bg-asymmetri-red z-999999999 fixed top-0 left-0 w-screen rounded-lg ${isCompact ? `min-h-0 h-[100dvh] max-h-[100dvh] overflow-hidden pb-[max(env(safe-area-inset-bottom),0.75rem)]${isMobile ? " px-7 pt-[max(env(safe-area-inset-top),0.5rem)]" : " px-4"}` : "min-h-screen h-screen"}`}
        >
          <div
            className={
              isMobile
                ? "pointer-events-auto flex w-full flex-col items-center justify-center gap-6 text-center xl:gap-8"
                : "contents"
            }
          >
            <motion.h2
              style={{
                opacity: footerSectionTitle,
              }}
              className={`font-chakra-petch text-white font-medium ${isMobile ? "max-w-[min(18rem,calc(100vw-3rem))] px-2 text-xl leading-snug" : isCompact ? "text-3xl px-6 max-w-2xl" : "text-2xl lg:text-4xl xl:text-5xl"}`}
            >
              Let’s turn your ideas into <br /> beautiful asymmetry.
            </motion.h2>

            <div
              className={`flex ${isCompact ? "flex-col" : "flex-row"} gap-2 xl:gap-4`}
            >
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
              className={`fixed left-1/2 -translate-x-1/2 ${isMobile ? "w-[min(100%,16rem)] bottom-8" : isCompact ? "w-4xl bottom-10" : "w-6xl bottom-16"}`}
              alt=""
            />
          </div>
        </motion.section>
        <div className="min-h-[800vh]"></div>
      </section>
    </main>
  );
}
