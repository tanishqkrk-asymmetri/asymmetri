"use client";

import type { RefObject } from "react";
import type { useHeroSplit } from "@/hooks/useHeroSplit";
import { HeroAperture } from "./hero/aperture/HeroAperture";
import { HeroSplitV2 } from "./hero/v2/HeroSplitV2";

/**
 * The hero, in one of two variants (chosen by HERO_VARIANT in HeroChapter):
 *
 * - "aperture": a closed black door with light leaking through the logo's
 *   slash. The cursor pries the slit open, the light falls on the headline,
 *   scrolling opens the door onto the manifesto. (hero/aperture/)
 * - "v2": bold headline bottom-left, outline wordmark under a cursor
 *   spotlight, a crosshair field the cursor breaks into red slashes, the cut
 *   draws and tears on scroll. (hero/v2/)
 *
 * Both tear open along the same geometry (hooks/useHeroSplit.ts).
 */
export type HeroVariant = "aperture" | "v2";

export type HeroProps = {
  loaded: boolean;
  split: ReturnType<typeof useHeroSplit>;
  rootRef: RefObject<HTMLDivElement | null>;
  manifestoRef: RefObject<HTMLDivElement | null>;
  sectionRef: RefObject<HTMLElement | null>;
};

export function HeroSplit({ variant, ...props }: HeroProps & { variant: HeroVariant }) {
  return variant === "v2" ? <HeroSplitV2 {...props} /> : <HeroAperture {...props} />;
}
