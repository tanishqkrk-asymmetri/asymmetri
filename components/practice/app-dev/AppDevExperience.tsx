"use client";

import { getPractice } from "@/lib/practices";
import { PracticeShell } from "@/components/practice/PracticeShell";
import { PracticeHero } from "@/components/practice/PracticeHero";
import { ScrollWords } from "@/components/practice/ScrollWords";
import { Marquee } from "@/components/practice/Marquee";
import { SectionHead } from "@/components/practice/SectionHead";
import { ProofStrip } from "@/components/practice/ProofStrip";
import { PracticeFaq } from "@/components/practice/PracticeFaq";
import { NextPractice } from "@/components/practice/NextPractice";
import { PracticeCTA } from "@/components/practice/PracticeCTA";
import { TileTransition } from "@/components/home/TileTransition";
import { HeroCompile } from "./HeroCompile";
import { ExplodedStack } from "./ExplodedStack";
import { SurfacesTrack } from "./SurfacesTrack";
import { SdlcLoop } from "./SdlcLoop";
import { CapabilitySpecs } from "./CapabilitySpecs";
import { faqs, manifesto, stack } from "./content";

const practice = getPractice("application-development");
const half = Math.ceil(stack.length / 2);

function StackSection() {
  return (
    <section
      data-chapter="Stack"
      aria-labelledby="ad-stack"
      className="heroDark overflow-hidden bg-black py-28 text-white md:py-36"
    >
      <div className="px-6 md:px-16" id="ad-stack">
        <SectionHead
          kicker="Stack · Representative, not a fixed stack"
          title={["Right tool,", ["per product."]]}
          body="We pick the stack for the product, the team that will own it and the decade it has to last. These are the tools we reach for most."
        />
      </div>
      <div className="mt-16 space-y-4">
        <Marquee
          speed={46}
          items={stack.slice(0, half).map((s) => (
            <span key={s} className="font-chakra-petch text-5xl font-bold uppercase md:text-8xl">
              {s}
            </span>
          ))}
        />
        <Marquee
          speed={52}
          reverse
          separator={<span className="font-mono text-sm text-asymmetri-red">{"</>"}</span>}
          items={stack.slice(half).map((s) => (
            <span key={s} className="kit-outline font-chakra-petch text-5xl font-bold uppercase md:text-8xl">
              {s}
            </span>
          ))}
        />
      </div>
    </section>
  );
}

export function AppDevExperience() {
  return (
    <PracticeShell practice={practice}>
      <PracticeHero
        practice={practice}
        titleLines={["Application", ["Development"]]}
        visual={<HeroCompile />}
      />
      <ScrollWords tone="light" kicker="One team, one loop" text={manifesto} />
      <ExplodedStack />
      <SurfacesTrack />
      <SdlcLoop />
      <TileTransition from="#000000" to="#ffffff" height="70vh" />
      <CapabilitySpecs practice={practice} />
      <StackSection />
      <ProofStrip slugs={practice.proof} />
      <PracticeFaq items={faqs} />
      <NextPractice current={practice.slug} />
      <PracticeCTA line="Bring us the product." sub="We'll design it, build it and run it." />
    </PracticeShell>
  );
}
