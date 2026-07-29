"use client";

import { T } from "@/components/Text";
import usePauseScroll from "@/hooks/usePauseScroll";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";
export default function AboutUs() {
  const { loaderPct } = usePauseScroll();
  const pageRef = useRef(null);
  const { scrollYProgress: pageScroll } = useScroll({
    target: pageRef,
  });
  return (
    <div ref={pageRef} className="bg-black">
      <div className="min-h-screen flex flex-col justify-center items-center gap-16 bg-black">
        <div className=" bg-black text-white font-chakra-petch text-7xl font-semibold w-fit h-full flex flex-col justify-center items-start">
          <T className="pl-96">IN OUR ECOSYSTEM</T>

          <T>
            EACH ENTITY <span className="text-asymmetri-red">NURTURES</span>
          </T>

          <T>EACH OTHER</T>
        </div>
        <div className="text-white font-chakra-petch max-w-lg mx-auto text-center">
          Driven by collaboration on new ideas, essential aesthetics, and
          meaningful impact. Breaking away from big agencies, we strive to make
          every project reflect our very best. 
        </div>
      </div>
      <motion.img
        style={{
          width: useTransform(pageScroll, [0, 0.1], ["5vw", "100vw"]),
          height: useTransform(pageScroll, [0, 0.1], ["5vh", "100vh"]),
          // aspectRatio: useTransform(pageScroll, [0, 0.1], ["1/1", "10/1"]),
        }}
        transition={
          {
            // ease: "easeInOut",
          }
        }
        src="/about.webp"
        className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 object-cover"
        alt=""
      />

      <div className="min-h-[300vh]"></div>
    </div>
  );
}
