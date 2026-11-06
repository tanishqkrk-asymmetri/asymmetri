"use client";

import { useEffect } from "react";
import usePauseScroll from "@/hooks/usePauseScroll";
import { HomeShell } from "@/components/home/HomeShell";
import { HomeLoader } from "@/components/home/HomeLoader";
import { HeroChapter } from "@/components/home/HeroChapter";
import { TileTransition } from "@/components/home/TileTransition";
import { WhatWeDo } from "@/components/home/sections/WhatWeDo";
import { Clients } from "@/components/home/sections/Clients";
import { PointOfView } from "@/components/home/sections/PointOfView";
import { Work } from "@/components/home/sections/Work";
import { Domains } from "@/components/home/sections/Domains";
import { OperatingSystem } from "@/components/home/sections/OperatingSystem";
import { Founder } from "@/components/home/sections/Founder";
import { Voices } from "@/components/home/sections/Voices";
import { Faq } from "@/components/home/sections/Faq";
import { Closing } from "@/components/home/sections/Closing";

/**
 * The home page as a sequence of self-contained chapters. Each section owns
 * its own scroll progress (useSectionProgress), so sections can change height
 * or order without disturbing one another.
 */
export function HomeExperience() {
  const { loaderPct } = usePauseScroll();
  const loaded = loaderPct === 100;

  // The page opens on the hero, not wherever the browser last left it.
  // Links like /#what-we-do still land on their section once the loader ends.
  useEffect(() => {
    history.scrollRestoration = "manual";
    if (!location.hash) window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (!loaded || !location.hash) return;
    const el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: "instant" }));
  }, [loaded]);

  return (
    <HomeShell>
      <HomeLoader pct={loaderPct} />
      <HeroChapter loaded={loaded} />
      <TileTransition from="#000000" to="#ffffff" height="110vh" />
      <WhatWeDo />
      <Clients />
      <PointOfView />
      <Work />
      <Domains />
      <OperatingSystem />
      <Founder />
      <Voices />
      <Faq />
      <Closing />
    </HomeShell>
  );
}
