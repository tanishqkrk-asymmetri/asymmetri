"use client";

import { ChapterShell } from "@/components/shared/ChapterShell";
import { PracticeFaq } from "@/components/practice/PracticeFaq";
import { contactFaqs } from "./content";
import { ContactHero } from "./sections/ContactHero";
import { NextSteps } from "./sections/NextSteps";
import { Channels } from "./sections/Channels";
import { PracticesFit } from "./sections/PracticesFit";
import { EmailBand } from "./sections/EmailBand";

/**
 * Contact as a short sequence of chapters. The hero holds the brief form, so
 * the page converts above the fold; the rest answers "what happens next".
 */
export function ContactExperience() {
  return (
    <ChapterShell label="Contact">
      <ContactHero />
      <NextSteps />
      <Channels />
      <PracticesFit />
      <div data-nav="light">
        <PracticeFaq items={contactFaqs} />
      </div>
      <EmailBand />
    </ChapterShell>
  );
}
