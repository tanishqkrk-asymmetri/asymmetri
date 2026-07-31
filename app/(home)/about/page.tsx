"use client";

import { T } from "@/components/Text";
import { NumberTicker } from "@/components/ui/number-ticker";
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/ui/scroll-based-velocity";
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

const STORY_SCROLL_RANGE: [number, number] = [0.25, 0.4];
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

const STEPS_X_RANGE: [number, number] = [0.54, 0.78];

function StepCard({
  index,
  progress,
}: {
  index: number;
  progress: MotionValue<number>;
}) {
  // Stagger each card's entrance across the horizontal scrub window
  const enterStart = STEPS_X_RANGE[0] + index * 0.05;
  const enterEnd = enterStart + 0.03;

  // const opacity = useTransform(
  //   progress,
  //   [0.55 + index / 100, 0.59 + index / 100, 1],
  //   [0, 1, 1],
  // );
  const y = useTransform(progress, [enterStart, enterEnd], [30, 0]);
  const filter = useTransform(
    progress,
    [enterStart, enterEnd],
    ["blur(8px)", "blur(0px)"],
  );

  return (
    <motion.div
      // style={{ y }}
      className="flex w-full min-w-72 max-w-72 flex-col items-center justify-center gap-3 border border-white p-6"
    >
      <div className="flex justify-start w-full">
        <div className="bg-white/40 text-white  p-3 py-2 rounded-md w-16 text-center">
          {index}
        </div>
      </div>
      <div className="font-chakra-petch text-lg text-white">
        Each step in our journey has refined the way we think, collaborate, and
        build.
      </div>
      <motion.img
        whileInView={{
          opacity: 1,
        }}
        initial={{
          opacity: 0,
        }}
        transition={{
          delay: 0.5,
        }}
        // style={{
        //   opacity,
        // }}
        src="/bulb.png"
        className="w-40 mix-blend-color-dodge "
        alt=""
      />
    </motion.div>
  );
}

export default function AboutUs() {
  const { loaderPct } = usePauseScroll();
  const pageRef = useRef(null);
  const { scrollYProgress: pageScroll } = useScroll({
    target: pageRef,
    // offset: ["start start", "end start"],
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
    <div className="">
      <div ref={pageRef} className="bg-black">
        <motion.div
          style={{
            y: useTransform(pageScroll, [0, 1], ["0px", "-500px"]),
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
              [0.15, 0.3],
              ["saturate(100%) brightness(1)", "saturate(0%) brightness(0.2)"],
            ),
            // mixBlendMode: useTransform(
            //   pageScroll,
            //   [0.5, 0.6],
            //   ["normal", "hard-light"],
            // ),
          }}
          transition={{
            ease: "easeInOut",
          }}
          src="/about2.png"
          className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 object-cover "
          alt=""
        />
        <motion.div
          style={{
            opacity: useTransform(pageScroll, [0.2, 0.25, 1], [0, 1, 1]),
          }}
          className="pointer-events-none fixed top-0 left-0 z-10 flex h-screen w-screen bg-black"
        >
          <motion.div className="w-full">
            <StorySection story={story} pageScroll={pageScroll} />
          </motion.div>
        </motion.div>
        <motion.div
          style={{
            opacity: useTransform(pageScroll, [0.41, 0.43, 1], [0, 1, 1]),
          }}
          className=" fixed top-0 left-0 z-10 flex flex-col gap-10 h-screen w-screen bg-asymmetri-red justify-center"
        >
          <motion.div className="w-full  p-10 flex  justify-between h-fit pb-0">
            <motion.div
              style={{
                opacity: useTransform(
                  pageScroll,
                  [0.45, 0.47, 1],
                  ["0", "1", "1"],
                ),
                filter: useTransform(
                  pageScroll,
                  [0.45, 0.47, 1],
                  ["blur(8px)", "blur(0px)", "blur(0px)"],
                ),
              }}
              className="text-7xl  font-chakra-petch text-white"
            >
              Your Steps <br /> To Success
            </motion.div>
            <motion.div
              style={{
                opacity: useTransform(
                  pageScroll,
                  [0.45, 0.47, 1],
                  ["0", "1", "1"],
                ),
                filter: useTransform(
                  pageScroll,
                  [0.45, 0.47, 1],
                  ["blur(8px)", "blur(0px)", "blur(0px)"],
                ),
              }}
              className="flex justify-end items-start gap-6 mt-26"
            >
              <button className="p-3 rounded-md border border-white text-white font-chakra-petch cursor-pointer">
                Get started
              </button>
              <div className="max-w-xs text-white font-chakra-petch">
                Each step in our journey has refined the way we think,
                collaborate, and build digital experiences that create real
                impact.
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            style={{
              width: useTransform(pageScroll, [0.45, 0.49], ["0vw", "100vw"]),
            }}
            className=" h-px bg-white my-6"
          ></motion.div>
          <div className="w-full overflow-hidden">
            <motion.div
              style={{
                x: useTransform(
                  pageScroll,
                  [0.51, 0.6, 1],
                  ["60vw", "-60vw", "-100vw"],
                ),
                opacity: useTransform(
                  pageScroll,
                  [0.49, 0.51, 1],
                  ["0", "1", "1"],
                ),
              }}
              className="flex w-max items-center justify-start gap-18 px-10 will-change-transform"
            >
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <StepCard
                  key={index.toString()}
                  index={index}
                  progress={pageScroll}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
        <div className="min-h-[800vh]"></div>
        <motion.div
          style={{
            // y: useTransform(pageScroll, [0.65, 0.69], ["100vh", "0vh"]),
            scale: useTransform(
              pageScroll,
              [0.63, 0.67, 1],
              ["0.9", "1.01", "1.01"],
            ),
          }}
          className="min-h-[200vh] bg-white relative z-999999999999 w-screen h-screen rounded-2xl pt-36 space-y-36"
        >
          <div className="absolute top-0 left-10 w-px bg-black/20 h-full"></div>
          <motion.div
            style={{
              opacity: useTransform(pageScroll, [0.69, 0.71], ["0", "1"]),
            }}
            className="text-7xl font-semibold font-chakra-petch text-asymmetri-red  px-16 sticky top-36"
          >
            Results, not promises
          </motion.div>

          <div className="relative">
            {[1, 2, 3].map((x) => {
              return (
                <motion.div
                  style={{
                    y: useTransform(
                      pageScroll,
                      x === 1
                        ? [0.74, 0.76]
                        : x === 2
                          ? [0.76, 0.78]
                          : x === 3
                            ? [0.78, 0.8]
                            : [0.72, 0.74],
                      [
                        "100vh",

                        x === 1
                          ? "22vh"
                          : x === 2
                            ? "44vh"
                            : x === 3
                              ? "66vh"
                              : "0vh",
                      ],
                    ),
                    background: useTransform(
                      pageScroll,
                      x === 1
                        ? [0.72, 0.75, 0.76]
                        : x === 2
                          ? [0.74, 0.77, 0.78]
                          : x === 3
                            ? [0.76, 0.79, 0.8]
                            : [0.72, 0.74, 0.76],
                      ["#ff0000", "#ff0000", "#ffffff50"],
                    ),
                    color: useTransform(
                      pageScroll,
                      x === 1
                        ? [0.72, 0.75, 0.76]
                        : x === 2
                          ? [0.74, 0.77, 0.78]
                          : x === 3
                            ? [0.76, 0.79, 0.8]
                            : [0.72, 0.74, 0.76],
                      ["#ffffff", "#ffffff", "#000000"],
                    ),
                  }}
                  key={x.toString()}
                  className=" fixed top-1/2 left-0 w-full border-y border-black/20 w-full items-center  flex justify-between px-16 font-chakra-petch py-10 bg-transparent backdrop-blur-lg"
                >
                  <motion.div>
                    {
                      "[creative concepts, visual identities developed and logos designed]"
                    }
                  </motion.div>
                  <motion.div
                    style={{
                      color: useTransform(
                        pageScroll,
                        x === 1
                          ? [0.72, 0.75, 0.76]
                          : x === 2
                            ? [0.74, 0.77, 0.78]
                            : x === 3
                              ? [0.76, 0.79, 0.8]
                              : [0.72, 0.74, 0.76],
                        ["#ffffff", "#ffffff", "#000000"],
                      ),
                    }}
                    className="text-6xl font-semibold"
                  >
                    <NumberTicker
                      style={{
                        color: "inherit",
                      }}
                      value={50}
                    ></NumberTicker>
                    +
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
        <div className="min-h-[100vh] bg-white z-99999 relative"></div>
        <div className="min-h-screen bg-white relative z-99999999">
          <motion.div
            style={{
              opacity: useTransform(
                pageScroll,
                [0.78, 0.79, 1],
                ["0", "1", "1"],
              ),
            }}
          >
            <ScrollVelocityContainer className="text-4xl font-bold md:text-7xl fixed top-1/2 left-0 text-asymmetri-red font-chakra-petch">
              <ScrollVelocityRow baseVelocity={20} direction={1}>
                THEY CLAPPED. WE KEPT BUILDING.
              </ScrollVelocityRow>
            </ScrollVelocityContainer>
          </motion.div>
          <motion.div
            className="fixed top-0 left-1/2 -translate-x-1/2 flex flex-col gap-6 z-99999999999999"
            style={{
              y: useTransform(
                pageScroll,
                [0.81, 0.92, 1],
                ["100vh", "-200vh", "-250vh"],
              ),
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((x) => {
              return (
                <div
                  key={x.toString()}
                  className="min-h-64 aspect-square bg-zinc-400"
                ></div>
              );
            })}
          </motion.div>
        </div>
        <div className="min-h-screen bg-black relative z-999999999 flex justify-center items-center">
          <div className="text-8xl font-semibold font-chakra-petch text-white">
            MEET OUR TEAM
          </div>
        </div>
      </div>
    </div>
  );
}
