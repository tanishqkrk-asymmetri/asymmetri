"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import styles from "./rnd.module.css";

const W = 440; // room width and depth
const H = 300; // wall height

const plane = (w: number, h: number, transform: string, extra?: CSSProperties): CSSProperties => ({
  width: w,
  height: h,
  marginLeft: -w / 2,
  marginTop: -h / 2,
  transform,
  ...extra,
});

const grid = (step: number, a: number): CSSProperties => ({
  backgroundImage: `linear-gradient(to right, rgba(0,0,0,${a}) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,${a}) 1px, transparent 1px)`,
  backgroundSize: `${step}px ${step}px`,
});

function Float({
  at,
  on,
  delay,
  children,
}: {
  at: string;
  on: boolean;
  delay: number;
  children: ReactNode;
}) {
  return (
    <div className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]" style={{ transform: at }}>
      <div className={styles.float} style={{ animationDelay: `${delay}s` }}>
        <div
          className={`-translate-x-1/2 -translate-y-1/2 border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.18em] whitespace-nowrap shadow-[0_18px_40px_-18px_rgba(0,0,0,0.35)] transition-colors duration-500 ${
            on ? "border-asymmetri-red bg-asymmetri-red text-white" : "border-black/70 bg-white/85 text-black"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function Cube({ on }: { on: boolean }) {
  const s = 64;
  const face = (t: string) => (
    <span
      className={`absolute inset-0 border transition-colors duration-500 ${on ? "border-asymmetri-red bg-asymmetri-red/10" : "border-black/60 bg-black/[0.03]"}`}
      style={{ transform: `${t} translateZ(${s / 2}px)` }}
    />
  );
  return (
    <div
      className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]"
      style={{ width: s, height: s, marginLeft: -s / 2, marginTop: -s / 2, transform: `translate3d(70px, ${H / 2 - s / 2}px, 60px)` }}
    >
      <div className={`absolute inset-0 [transform-style:preserve-3d] ${styles.spin}`}>
        {face("rotateY(0deg)")}
        {face("rotateY(90deg)")}
        {face("rotateY(180deg)")}
        {face("rotateY(-90deg)")}
        {face("rotateX(90deg)")}
        {face("rotateX(-90deg)")}
      </div>
    </div>
  );
}

/**
 * Track B visual: a wireframe room in CSS 3D. Scroll tilts the camera down
 * into the space, the cursor orbits it, and spatial UI panels hang in the air.
 * The open question on screen lights its panel.
 */
export function MrRoom({ p, active }: { p: MotionValue<number>; active: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const transform = useTransform([p, sx, sy], ([v, x, y]: number[]) => {
    const t = reduce ? 0.7 : Math.min(Math.max((v - 0.35) / 0.6, 0), 1);
    const rx = -46 + t * 30 - y * 8;
    const ry = -40 + t * 16 + x * 18;
    return `translateZ(-120px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
  });

  const onMove = (e: React.PointerEvent) => {
    if (reduce) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="relative h-[360px] w-full overflow-hidden sm:h-[440px] lg:h-full"
      aria-hidden
    >
      <div className="absolute inset-0 origin-center scale-[0.62] [perspective:1100px] sm:scale-[0.85] xl:scale-100">
        <motion.div style={{ transform }} className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]">
          {/* Floor */}
          <div className="absolute" style={plane(W, W, `translateY(${H / 2}px) rotateX(90deg)`, grid(40, 0.2))}>
            <span
              className={`absolute top-[58%] left-[64%] size-16 -translate-1/2 border-2 ${active === 0 ? "border-asymmetri-red" : "border-black/50"} transition-colors duration-500`}
            />
            <span className="absolute top-[58%] left-[64%] size-2 -translate-1/2 bg-asymmetri-red" />
          </div>
          {/* Back wall */}
          <div className="absolute" style={plane(W, H, `translateZ(${-W / 2}px)`, grid(40, 0.1))} />
          {/* Left wall */}
          <div
            className="absolute"
            style={plane(W, H, `translateX(${-W / 2}px) rotateY(90deg)`, grid(40, 0.08))}
          />
          {/* Right wall: outline only, so the room stays open to the viewer */}
          <div
            className="absolute border border-dashed border-black/25"
            style={plane(W, H, `translateX(${W / 2}px) rotateY(-90deg)`)}
          />

          <Cube on={active === 1} />

          <Float at={`translate3d(-90px, -70px, -120px) rotateY(18deg)`} on={active === 0} delay={0}>
            Step 3 / 7 · Align bracket
          </Float>
          <Float at={`translate3d(80px, 40px, 60px) rotateY(-8deg)`} on={active === 1} delay={0.8}>
            Seen: housing · spec ready
          </Float>
          <Float at={`translate3d(-40px, 40px, 120px) rotateY(10deg)`} on={active === 2} delay={1.6}>
            <span className="flex items-center gap-2">
              Training
              <span className="flex gap-0.5">
                {Array.from({ length: 7 }, (_, i) => (
                  <span key={i} className={`block h-2 w-2 ${i < 4 ? "bg-current" : "border border-current"}`} />
                ))}
              </span>
            </span>
          </Float>
          <Float at={`translate3d(120px, -110px, -60px) rotateY(-22deg)`} on={active === 3} delay={2.4}>
            <span className="flex items-center gap-2">
              Voice · &ldquo;Next step&rdquo;
              <span className="flex h-3 items-end gap-[2px]">
                {[3, 7, 5, 9, 4, 8, 3].map((h, i) => (
                  <span key={i} className={`block w-[2px] bg-current ${styles.eq}`} style={{ height: h + 2, animationDelay: `${i * 0.12}s` }} />
                ))}
              </span>
            </span>
          </Float>
        </motion.div>
      </div>
      <p className="absolute bottom-3 left-3 font-mono text-[9px] uppercase tracking-[0.2em] text-black/45">
        Illustrative spatial UI · Move to orbit
      </p>
    </div>
  );
}
