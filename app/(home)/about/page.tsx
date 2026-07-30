"use client";

import { T } from "@/components/Text";
import usePauseScroll from "@/hooks/usePauseScroll";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef } from "react";

type StoryItem = {
  left: { title: string; sub: string };
  right: { year: string; title: string; sub: string; image: string };
};

const STORY_SCROLL_RANGE: [number, number] = [0.28, 0.4];
const STACK_X = 18;
const STACK_Y = 15;
const STACK_SCALE = 0.04;
const STACK_OPACITY = 0.1;
const STACK_ROTATE = 60;

function wrapPos(index: number, t: number, count: number) {
  return (((index - t) % count) + count) % count;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Continuous deck pose: resting stack, or arc from front → back. */
function cardPose(index: number, p: number, count: number) {
  if (count <= 1) {
    return { x: 0, y: 0, scale: 1, opacity: 1, rotate: 0, zIndex: 1 };
  }

  const t = p * (count - 1);
  const pos = wrapPos(index, t, count);
  const backDepth = count - 1;
  const backX = -backDepth * STACK_X;
  const backY = backDepth * STACK_Y;
  const backScale = 1 - backDepth * STACK_SCALE;
  const backOpacity = Math.max(0.35, 1 - backDepth * STACK_OPACITY);
  const backRotate = STACK_ROTATE;
  // Just left the front — arc to the back of the deck
  if (pos > backDepth) {
    const exitP = easeInOutCubic(count - pos);
    const omt = 1 - exitP;
    // Lift up/right, then settle into the deepest stack slot
    const cx = 130;
    const cy = -160;
    const x = 2 * omt * exitP * cx + exitP * exitP * backX;
    const y = 2 * omt * exitP * cy + exitP * exitP * backY;
    const scale =
      1 + 0.04 * Math.sin(exitP * Math.PI) - exitP * (1 - backScale);
    const opacity = 1 - exitP * (1 - backOpacity);
    const rotate = Math.sin(exitP * Math.PI) * 16;
    const zIndex = exitP < 0.58 ? count + 8 : 1;

    return { x, y, scale, opacity, rotate, zIndex };
  }

  // Resting in the stack (0 = front)
  return {
    x: -pos * STACK_X,
    y: pos * STACK_Y,
    scale: 1 - pos * STACK_SCALE,
    opacity: Math.max(0.35, 1 - pos * STACK_OPACITY),
    rotate: 0,
    zIndex: Math.round(count - pos + 1),
  };
}

function StoryLeft({
  item,
  index,
  count,
  progress,
}: {
  item: StoryItem;
  index: number;
  count: number;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, (p) => {
    if (count <= 1) return 1;
    const active = p * (count - 1);
    const dist = Math.abs(active - index);
    if (dist >= 0.55) return 0;
    return 1 - dist / 0.55;
  });

  const y = useTransform(progress, (p) => {
    if (count <= 1) return 0;
    const active = p * (count - 1);
    return (index - active) * 28;
  });
  const opacity2 = useTransform(progress, (p) => {
    if (count <= 1) return 1;
    const active = p * (count - 1);
    const dist = Math.abs(active - index);
    if (dist >= 0.55) return 0;
    return 1 - dist / 0.55;
  });

  const y2 = useTransform(progress, (p) => {
    if (count <= 1) return 0;
    const active = p * (count - 1);
    return (index - active) * 28;
  });

  return (
    <motion.div
      style={{
        opacity,
        y,
      }}
      className="absolute inset-0 flex flex-col justify-center px-10 md:px-16 lg:px-24 "
    >
      <T className="max-w-lg font-chakra-petch text-3xl font-semibold leading-tight text-white md:text-4xl lg:text-5xl">
        {item.left.title}
      </T>
      <T className="mt-8 max-w-sm font-chakra-petch text-sm leading-relaxed text-white/70 md:text-base">
        {item.left.sub}
      </T>
    </motion.div>
  );
}

function StoryCard({
  item,
  index,
  count,
  progress,
}: {
  item: StoryItem;
  index: number;
  count: number;
  progress: MotionValue<number>;
}) {
  const x = useTransform(progress, (p) => cardPose(index, p, count).x);
  const y = useTransform(progress, (p) => cardPose(index, p, count).y);
  const scale = useTransform(progress, (p) => cardPose(index, p, count).scale);
  const opacity = useTransform(
    progress,
    (p) => cardPose(index, p, count).opacity,
  );
  const rotate = useTransform(
    progress,
    (p) => cardPose(index, p, count).rotate,
  );
  const zIndex = useTransform(
    progress,
    (p) => cardPose(index, p, count).zIndex,
  );

  return (
    <motion.div
      style={{ x, y, scale, opacity, rotate, zIndex }}
      className="absolute inset-0 origin-center will-change-transform"
    >
      <div className="relative h-full w-full overflow-hidden bg-black shadow-2xl">
        <img
          src={item.right.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4 md:p-5">
          <span className="font-chakra-petch text-2xl font-semibold text-white md:text-3xl">
            {item.right.year}
          </span>
          <span className=" text-right font-chakra-petch text-sm font-semibold leading-snug text-asymmetri-red md:text-2xl mt-16">
            {item.right.title}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-linear-180 from-transparent to-black  px-4 py-4 md:px-5 md:py-5 h-64 flex justify-end items-end">
          <p className="font-chakra-petch text-xs leading-relaxed text-white md:text-base font-semibold">
            {item.right.sub}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function StorySection({
  story,
  pageScroll,
}: {
  story: StoryItem[];
  pageScroll: MotionValue<number>;
}) {
  const rawProgress = useTransform(pageScroll, STORY_SCROLL_RANGE, [0, 1], {
    clamp: true,
  });
  const progress = useSpring(rawProgress, {
    stiffness: 70,
    damping: 22,
    mass: 0.55,
    restDelta: 0.001,
  });

  return (
    <div className="flex h-full w-full">
      <motion.div
        style={
          {
            // y: useTransform(pageScroll, [0.39, 0.43], ["100vh", "0vh"]),
          }
        }
        className="relative flex h-full w-1/2 items-center bg-black heroDark z-99999"
      >
        {story.map((item, index) => (
          <StoryLeft
            key={`left-${index}`}
            item={item}
            index={index}
            count={story.length}
            progress={progress}
          />
        ))}
      </motion.div>

      <motion.div
        style={
          {
            // y: useTransform(pageScroll, [0.38, 0.46], ["100vh", "0vh"]),
          }
        }
        className="relative flex h-full w-1/2 items-center justify-center bg-asymmetri-red"
      >
        <div className="relative h-4/5 w-100">
          {story.map((item, index) => (
            <StoryCard
              key={`card-${index}`}
              item={item}
              index={index}
              count={story.length}
              progress={progress}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function AboutUs() {
  const { loaderPct } = usePauseScroll();
  const pageRef = useRef(null);
  const { scrollYProgress: pageScroll } = useScroll({
    target: pageRef,
    // offset: ["start center", "end center"],
  });
  const story = [
    {
      left: {
        title: "Every milestone shaped how we design today",
        sub: "Growth isn't measured by years—it's measured by the lessons behind every project, every challenge, and every partnership. Each step in our journey has refined the way we think, collaborate, and build digital experiences that create real impact.",
      },
      right: {
        year: "2020",
        title: "A bold beginning",
        sub: "What started as a passion for thoughtful digital design quickly became a mission to build products that solve meaningful business problems, not just look good.",
        image: "/flip.png",
      },
    },
    {
      left: {
        title: "Finding our rhythm as a team",
        sub: "As our first projects shipped, we learned that great design isn't just about aesthetics—it's about understanding the people who use what we build. This year taught us to listen harder and iterate faster.",
      },
      right: {
        year: "2021",
        title: "Scaling with intention",
        sub: "We doubled our team and took on our first enterprise clients, proving that a small studio mindset could handle big, complex challenges without losing its craft.",
        image: "/flip.png",
      },
    },
    {
      left: {
        title: "Turning challenges into craft",
        sub: "A tougher market pushed us to sharpen our process. We invested in design systems and stronger engineering practices, laying the groundwork for consistent, scalable delivery across every partnership.",
      },
      right: {
        year: "2022",
        title: "Building for resilience",
        sub: "We shipped products across fintech, healthtech, and e-commerce, learning that resilient design means anticipating change, not just reacting to it.",
        image: "/flip.png",
      },
    },
    {
      left: {
        title: "Partnerships that pushed us further",
        sub: "Working alongside ambitious founders and established brands alike, we refined what it means to be a true product partner—embedded in strategy, not just execution.",
      },
      right: {
        year: "2023",
        title: "A new chapter of impact",
        sub: "With a growing portfolio of award-winning work, we set our sights on emerging technologies, exploring how AI and immersive experiences could reshape digital products.",
        image: "/flip.png",
      },
    },
  ];
  return (
    <div ref={pageRef} className="bg-black">
      <motion.div
        style={{
          y: useTransform(pageScroll, [0, 1], ["0px", "-300px"]),
        }}
        className="min-h-screen flex flex-col justify-center items-center gap-16 bg-black sticky top-0"
      >
        <motion.div
          style={{
            filter: useTransform(
              pageScroll,
              [0, 0.1],
              ["blur(0px)", "blur(4px)"],
            ),
          }}
          className=" bg-black text-white font-chakra-petch text-7xl font-semibold w-fit h-full flex flex-col justify-center items-start"
        >
          <T className="pl-96">IN OUR ECOSYSTEM</T>

          <T>
            EACH ENTITY <span className="text-asymmetri-red">NURTURES</span>
          </T>

          <T>EACH OTHER</T>
        </motion.div>
        <motion.div
          style={{
            filter: useTransform(
              pageScroll,
              [0, 0.1],
              ["blur(0px)", "blur(4px)"],
            ),
          }}
          className="text-white font-chakra-petch max-w-sm mx-auto text-center"
        >
          <T delay={0.3} duration={2}>
            Driven by collaboration on new ideas, essential aesthetics, and
            meaningful impact. Breaking away from big agencies, we strive to
            make every project reflect our very best. 
          </T>
        </motion.div>
      </motion.div>
      <motion.img
        style={{
          y: useTransform(pageScroll, [0, 0.08], ["100vh", "0vh"]),
          width: useTransform(
            pageScroll,
            [0.08, 0.2, 0.4],
            ["20%", "115%", "130%"],
          ),
          height: useTransform(
            pageScroll,
            [0.08, 0.2, 0.4],
            ["40%", "115%", "130%"],
          ),
          filter: useTransform(
            pageScroll,
            [0.15, 0.2],
            ["saturate(100%) brightness(1)", "saturate(0%) brightness(0.2)"],
          ),
        }}
        transition={{
          ease: "easeInOut",
        }}
        src="/about2.png"
        className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 object-cover"
        alt=""
      />
      <motion.div
        style={{
          opacity: useTransform(pageScroll, [0.2, 0.28, 1], [0, 1, 1]),
        }}
        className="pointer-events-none fixed top-0 left-0 z-10 flex h-screen w-screen bg-black"
      >
        <motion.div className="w-full">
          <StorySection story={story} pageScroll={pageScroll} />
        </motion.div>
      </motion.div>
      <motion.div
        style={{
          opacity: useTransform(pageScroll, [0.42, 0.45], ["0", "1"]),
        }}
        className="pointer-events-none fixed top-0 left-0 z-10 flex h-screen w-screen bg-asymmetri-red"
      >
        <motion.div className="w-full pt-26 px-18 flex justify-between ">
          <motion.div
            style={{
              opacity: useTransform(pageScroll, [0.45, 0.47], ["0", "1"]),
              filter: useTransform(
                pageScroll,
                [0.45, 0.47],
                ["blur(8px)", "blur(0px)"],
              ),
            }}
            className="text-7xl  font-chakra-petch text-white"
          >
            Your Steps <br /> To Success
          </motion.div>
          <motion.div
            style={{
              opacity: useTransform(pageScroll, [0.47, 0.49], ["0", "1"]),
              filter: useTransform(
                pageScroll,
                [0.47, 0.49],
                ["blur(8px)", "blur(0px)"],
              ),
            }}
            className=""
          >
            <button className="p-3 rounded-md border border-white text-white font-chakra-petch cursor-pointer">
              Get started
            </button>
            <div className="max-w-sm text-white font-chakra-petch">
              Each step in our journey has refined the way we think,
              collaborate, and build digital experiences that create real
              impact.
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="min-h-[1000vh]"></div>
    </div>
  );
}
