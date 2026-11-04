"use client";

import { useRef } from "react";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import {
  motion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { sdlc, sdlcTools } from "@/lib/site-content";

const details: Record<string, string> = {
  Brief: "requirements captured",
  Plan: "agentic planning",
  Design: "design system synced",
  Build: "ai-aided code",
  Review: "automated review passed",
  Release: "continuous delivery → production",
};

function Line({
  p,
  at,
  children,
}: {
  p: MotionValue<number>;
  at: number;
  children: React.ReactNode;
}) {
  const clipPath = useTransform(
    p,
    [at, at + 0.07],
    ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
  );
  const opacity = useTransform(p, [at, at + 0.01], [0, 1]);
  return (
    <motion.div style={{ clipPath, opacity }} className="whitespace-pre">
      {children}
    </motion.div>
  );
}

/** "We run on what we build": FinishLine runs the delivery loop as you scroll. */
export function SdlcTerminal() {
  const ref = useRef<HTMLDivElement>(null);
  const p = useSectionProgress(ref);
  const titleY = useTransform(p, [0, 0.12], [80, 0]);
  const done = useTransform(p, [0.86, 0.9], [0, 1]);

  return (
    <div
      ref={ref}
      id="ai-driven-delivery"
      className="relative h-[220vh] bg-black font-chakra-petch text-white"
    >
      <div className="sticky top-0 grid h-screen items-center gap-10 overflow-hidden bg-black px-6 pt-20 pb-10 md:grid-cols-[1fr_1.1fr] md:px-16">
        <motion.div style={{ y: titleY }} className="space-y-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-asymmetri-red md:text-xs">
            The AI-driven software company
          </p>
          <h2 className="text-3xl font-bold uppercase leading-none md:text-4xl xl:text-6xl">
            We run on what we build.{" "}
            <span className="text-asymmetri-red">The whole SDLC is AI-driven.</span>
          </h2>
          <p className="max-w-lg font-geist text-sm text-white/65 xl:text-lg">
            FinishLine is our agentic project management operating spine. It
            connects intent, planning, execution, evidence and delivery across
            the company, while specialist AI tools augment every discipline.
          </p>
          <ul className="flex max-w-lg flex-wrap gap-1.5">
            {sdlcTools.map((t) => (
              <li
                key={t}
                className="border border-white/20 px-2 py-1 font-geist text-[11px] text-white/75"
              >
                {t}
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="overflow-hidden rounded-lg border border-white/20 bg-[#0d0d0d] shadow-[0_0_80px_-20px_rgba(205,23,23,0.45)]">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <span className="size-2.5 rounded-full bg-asymmetri-red" />
            <span className="size-2.5 rounded-full bg-white/25" />
            <span className="size-2.5 rounded-full bg-white/25" />
            <span className="ml-3 font-mono text-[11px] text-white/45">
              finishline — asymmetri/ops
            </span>
          </div>
          <div className="space-y-2 overflow-hidden p-5 font-mono text-[11px] leading-relaxed text-white/85 md:p-6 xl:p-7 xl:text-sm">
            <Line p={p} at={0.08}>
              <span className="text-asymmetri-red">$</span> finishline run --brief
              {' "hard problem"'}
            </Line>
            {sdlc.map((s, i) => (
              <Line key={s.stage} p={p} at={0.18 + i * 0.1}>
                <span className="text-white/40">›</span>{" "}
                {s.stage.toLowerCase().padEnd(8, " ")}
                <span className="text-white/55">{details[s.stage]}</span>{" "}
                <span className="text-asymmetri-red">✓</span>
              </Line>
            ))}
            <motion.div style={{ opacity: done }} className="pt-2 text-white">
              ● evidence logged · intent → delivery connected
              <span
                className="fat-cursor !relative ml-2 inline-block !h-4 !w-2 bg-asymmetri-red align-middle"
                aria-hidden
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
