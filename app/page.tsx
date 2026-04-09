"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { PowerGlitch } from "powerglitch";

import { useEffect, useRef, useState } from "react";
import { FatCursors } from "@/components/FatCursors";
import BG from "@/components/HeroBG";

export default function Home() {
  const pageRef = useRef(null);

  const { scrollYProgress: pageScroll } = useScroll({
    target: pageRef,
    offset: ["start start", "end end"],
  });

  const [blackBoxSizeState, setBlackBoxSizeState] = useState(0);
  const [loaderPct, setLoaderPct] = useState(0);

  const blackBoxScale = useTransform(pageScroll, [0, 0.3], [0, 1]);

  useEffect(() => {
    PowerGlitch.glitch("#logo", {
      playMode: "always",
      optimizeSeo: true,
      createContainers: true,
      hideOverflow: false,
      timing: {
        duration: 2000,
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
    });

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

  useMotionValueEvent(pageScroll, "change", (latest) => {
    if (latest > 0) {
      setBlackBoxSizeState(0);
    }
    if (latest > 0.1) {
      setBlackBoxSizeState(1);
    }
    if (latest > 0.3) {
      setBlackBoxSizeState(2);
    }
  });

  return (
    <main ref={pageRef} className="">
      <motion.div className="relative">
        <motion.div
          // style={{
          //   scale: blackBoxScale,
          // }}
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
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-screen bg-black z-9 h-screen duration-1400 ease-in-out"
        ></motion.div>
        <div className="min-h-screen hero bg-white fixed w-full overflow-hidden">
          <FatCursors />
          {/* <img src="/logo.png" className="z-999999" alt="" /> */}
          <BG></BG>
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
            <span className="text-asymmetri-red text-lg font-mono tabular-nums ">
              {loaderPct}%
            </span>
          </div>
        </div>
      </motion.div>
      <div className="min-h-[500vh]"></div>
    </main>
  );
}
