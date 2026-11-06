/**
 * One timeline for the whole opening chapter, in the chapter's own pinned
 * progress (0 when the hero pins, 1 when the chapter unpins). Shared by both
 * hero variants and the manifesto.
 *
 *   0.000 ─ hero at rest
 *   0.004 ─ the cut draws (v2) / the slit strains and flares (aperture)
 *   0.03  ─ the halves part along the logo slash, the manifesto is behind
 *   0.08  ─ the manifesto sentence writes in, word by word; each pillar
 *            lights up in the row as it is named
 *   0.52  ─ the sign-off line writes in
 *   0.80  ─ a slash-angled wipe turns the board black
 *   0.90  ─ black, held, then the tile transition takes over
 */

export const CHAPTER_VH = 320;

export const CUT_START = 0.004;
export const CUT_END = 0.04;
export const OPEN_START = 0.03;
export const OPEN_END = 0.25;

/** Manifesto: the main sentence, then the sign-off, word by word. */
export const SENTENCE_IN: [number, number] = [0.08, 0.46];
export const SIGNOFF_IN: [number, number] = [0.52, 0.66];
/** The board wipes from white to black along the slash angle. */
export const WIPE: [number, number] = [0.8, 0.9];

export type Tone = "dark" | "light" | "red";

/** Navbar tone for a given chapter progress. */
export function toneAt(p: number): Tone {
  // The bar sits over the hero until the halves are well apart.
  if (p < OPEN_START + (OPEN_END - OPEN_START) * 0.45) return "dark";
  if (p < (WIPE[0] + WIPE[1]) / 2) return "light";
  return "dark";
}
