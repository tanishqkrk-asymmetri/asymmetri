"use client";

import { getPractice } from "@/lib/practices";
import { aiLayers } from "@/lib/site-content";
import { PracticeShell } from "@/components/practice/PracticeShell";
import { PracticeHero } from "@/components/practice/PracticeHero";
import { ScrollWords } from "@/components/practice/ScrollWords";
import { Marquee } from "@/components/practice/Marquee";
import { ProofStrip } from "@/components/practice/ProofStrip";
import { PracticeFaq } from "@/components/practice/PracticeFaq";
import { NextPractice } from "@/components/practice/NextPractice";
import { PracticeCTA } from "@/components/practice/PracticeCTA";
import { TileTransition } from "@/components/home/TileTransition";
import { AgentMesh } from "./AgentMesh";
import { TraceLog } from "./TraceLog";
import { LayerStack } from "./LayerStack";
import { DataFoundation } from "./DataFoundation";
import { AutonomyDial } from "./AutonomyDial";
import { EvalDashboard } from "./EvalDashboard";
import { Capabilities } from "./Capabilities";
import { SlashWipe } from "./SlashWipe";
import { faqs, manifesto, stack } from "./content";

const practice = getPractice("ai-agentic-systems-and-data");
const half = Math.ceil(stack.length / 2);

function StackBand() {
  return (
    <section data-chapter="Stack" className="overflow-hidden border-y border-white/10 bg-black py-16 text-white md:py-20">
      <div className="mb-10 flex flex-col gap-3 px-6 md:flex-row md:items-end md:justify-between md:px-16">
        <h2 className="font-chakra-petch text-3xl leading-none font-bold uppercase md:text-5xl">
          Model-agnostic. <span className="text-asymmetri-red">Stack-fluent.</span>
        </h2>
        <p className="max-w-md font-mono text-[10px] leading-relaxed uppercase tracking-[0.2em] text-white/50">
          Representative technologies across the ten layers, not a fixed stack. We choose per problem, on quality, control and cost.
        </p>
      </div>
      <Marquee
        items={stack.slice(0, half).map((s) => (
          <span key={s} className="font-chakra-petch text-3xl font-bold whitespace-nowrap uppercase md:text-6xl">
            {s}
          </span>
        ))}
        speed={70}
      />
      <Marquee
        className="mt-4"
        reverse
        separator={<span className="text-white/30">/</span>}
        items={stack.slice(half).map((s) => (
          <span key={s} className="kit-outline font-chakra-petch text-3xl font-bold whitespace-nowrap uppercase md:text-6xl">
            {s}
          </span>
        ))}
        speed={80}
      />
    </section>
  );
}

export function AiExperience() {
  return (
    <PracticeShell practice={practice}>
      <PracticeHero
        practice={practice}
        titleLines={["AI Agentic", "Systems", ["& Data"]]}
        visual={<AgentMesh />}
        aside={<TraceLog />}
      />
      <ScrollWords kicker="Point of view" text={manifesto} />
      <TileTransition from="#000000" to="#ffffff" height="110vh" />
      <LayerStack layers={aiLayers} />
      <SlashWipe from="#ffffff" to="#000000" label="▸ Down to the data layer" />
      <DataFoundation />
      <SlashWipe from="#000000" to="#cd1717" label="▸ Who is in control" flip />
      <AutonomyDial />
      <EvalDashboard />
      <Capabilities />
      <StackBand />
      <ProofStrip slugs={practice.proof} />
      <PracticeFaq items={faqs} />
      <NextPractice current={practice.slug} />
      <PracticeCTA />
    </PracticeShell>
  );
}
