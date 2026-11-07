"use client";

import type { Job } from "@/lib/jobs";
import { ChapterShell } from "@/components/shared/ChapterShell";
import { PracticeFaq } from "@/components/practice/PracticeFaq";
import { careersFaqs } from "./content";
import { CareersHero } from "./sections/CareersHero";
import { FounderNote } from "./sections/FounderNote";
import { AntiPitch } from "./sections/AntiPitch";
import { CultureCode } from "./sections/CultureCode";
import { WeekRhythm } from "./sections/WeekRhythm";
import { RangeSection } from "./sections/RangeSection";
import { PerksSection } from "./sections/PerksSection";
import { FirstWeek } from "./sections/FirstWeek";
import { OpenRoles } from "./sections/OpenRoles";
import { CareersClosing } from "./sections/CareersClosing";

/**
 * Careers & Culture as a sequence of self-contained chapters. Every chapter
 * server-renders its copy (from ./content.ts) so crawlers and AI answer
 * engines read the full page; motion is layered on top.
 *
 * `jobs` is fetched on the server (app/(home)/careers/page.tsx) so open roles
 * are in the initial HTML; OpenRoles refreshes them on the client.
 */
export function CareersExperience({ jobs }: { jobs: Job[] }) {
  return (
    <ChapterShell label="Careers & Culture">
      <CareersHero openRoles={jobs.length} />
      <FounderNote />
      <AntiPitch />
      <CultureCode />
      <WeekRhythm />
      <RangeSection />
      <PerksSection />
      <FirstWeek />
      <OpenRoles initialJobs={jobs} />
      <div data-nav="light">
        <PracticeFaq items={careersFaqs} />
      </div>
      <CareersClosing />
    </ChapterShell>
  );
}
