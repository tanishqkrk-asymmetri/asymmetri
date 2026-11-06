"use client";

import { getPractice } from "@/lib/practices";
import { PracticeShell } from "@/components/practice/PracticeShell";
import { PracticeHero } from "@/components/practice/PracticeHero";
import { ScrollWords } from "@/components/practice/ScrollWords";
import { Marquee } from "@/components/practice/Marquee";
import { ProofStrip } from "@/components/practice/ProofStrip";
import { PracticeFaq } from "@/components/practice/PracticeFaq";
import { NextPractice } from "@/components/practice/NextPractice";
import { PracticeCTA } from "@/components/practice/PracticeCTA";
import { faqs, manifesto, toolsAi, toolsSpatial } from "./content";
import { InterferenceField } from "./InterferenceField";
import { ExperimentLog } from "./ExperimentLog";
import { ScanWipe } from "./ScanWipe";
import { ResearchTracks } from "./ResearchTracks";
import { SpecimenPipeline } from "./SpecimenPipeline";
import { ProductReveal } from "./ProductReveal";
import { LabNotebook } from "./LabNotebook";

const practice = getPractice("innovation-and-rd");

function Tools() {
  const item = (t: string) => (
    <span className="font-chakra-petch text-4xl font-bold uppercase md:text-7xl">{t}</span>
  );
  return (
    <section data-chapter="Tools" aria-labelledby="rnd-tools" className="overflow-hidden bg-black py-24 text-white md:py-32">
      <div className="mb-12 flex flex-col justify-between gap-4 px-6 md:flex-row md:items-end md:px-16">
        <div>
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-asymmetri-red md:text-xs">
            On the bench
          </p>
          <h2 id="rnd-tools" className="font-chakra-petch text-4xl leading-[0.92] font-bold uppercase md:text-6xl">
            Tools of the lab
          </h2>
        </div>
        <p className="max-w-sm font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-white/50">
          Representative, not a fixed stack. We pick the instrument for the experiment.
        </p>
      </div>
      <Marquee items={toolsAi.map(item)} speed={45} itemClassName="py-2" />
      <Marquee
        items={toolsSpatial.map((t) => (
          <span key={t} className="kit-outline font-chakra-petch text-4xl font-bold uppercase md:text-7xl">
            {t}
          </span>
        ))}
        speed={55}
        reverse
        itemClassName="py-2"
        separator={<span className="inline-block size-2 bg-asymmetri-red md:size-3" />}
      />
      <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2 px-6 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 md:px-16">
        <span>Row 1 · AI and ML systems</span>
        <span>Row 2 · Mixed reality and spatial</span>
      </div>
    </section>
  );
}

export function RndExperience() {
  return (
    <PracticeShell practice={practice}>
      <PracticeHero
        practice={practice}
        titleLines={["Innovation", ["& R&D"]]}
        visual={<InterferenceField />}
        aside={<ExperimentLog />}
      />
      <ScanWipe from="#000000" to="#ffffff" />
      <ScrollWords kicker="Manifesto" tone="light" text={manifesto} />
      <ResearchTracks />
      <SpecimenPipeline />
      <ProductReveal />
      <ScanWipe from="#cd1717" to="#f4f4f4" />
      <LabNotebook />
      <Tools />
      <ProofStrip slugs={practice.proof} />
      <PracticeFaq items={faqs} />
      <NextPractice current={practice.slug} />
      <PracticeCTA />
    </PracticeShell>
  );
}
