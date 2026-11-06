"use client";

import { getPractice } from "@/lib/practices";
import { PracticeShell } from "@/components/practice/PracticeShell";
import { PracticeHero } from "@/components/practice/PracticeHero";
import { ScrollWords } from "@/components/practice/ScrollWords";
import { ProofStrip } from "@/components/practice/ProofStrip";
import { PracticeFaq } from "@/components/practice/PracticeFaq";
import { NextPractice } from "@/components/practice/NextPractice";
import { PracticeCTA } from "@/components/practice/PracticeCTA";
import { TileTransition } from "@/components/home/TileTransition";
import { TangleField, TangleReadout } from "./TangleField";
import { InterrogationScene } from "./InterrogationScene";
import { DrawingSet } from "./DrawingSet";
import { Dossiers } from "./Dossiers";
import { DecisionRecord } from "./DecisionRecord";
import { Domains } from "./Domains";
import { faqs, manifesto } from "./content";

const practice = getPractice("technology-consulting");

export function ConsultingExperience() {
  return (
    <PracticeShell practice={practice}>
      <PracticeHero
        practice={practice}
        titleLines={["Technology", ["Consulting"]]}
        visual={<TangleField />}
        aside={<TangleReadout />}
      />
      <ScrollWords tone="light" kicker="01 · Point of view" text={manifesto} />
      <InterrogationScene />
      <DrawingSet />
      <Dossiers />
      <TileTransition from="#0a0a0a" to="#ffffff" height="100vh" />
      <DecisionRecord />
      <Domains />
      <ProofStrip slugs={practice.proof} />
      <PracticeFaq items={faqs} />
      <NextPractice current={practice.slug} />
      <PracticeCTA />
    </PracticeShell>
  );
}
