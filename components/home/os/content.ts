import { principles } from "@/lib/site-content";

/** The three operating principles, with the figure each one draws in type. */
export const osPrinciples = [
  {
    ...principles[0],
    rest: "Every hard problem gets a first-principles answer, not a template from the last project.",
    figure: "Form",
    figureNote: "A new knot, never the same twice",
  },
  {
    ...principles[1],
    rest: "Prototype, measure and adjust fast, so the right answer arrives before the deadline does.",
    figure: "Loop",
    figureNote: "Each pass lands closer to the target",
  },
  {
    ...principles[2],
    rest: "The team adapts to the domain without becoming dependent on one stack, one industry or one playbook.",
    figure: "System",
    figureNote: "One module, repeated, flexing to the field",
  },
];

/**
 * Pinned progress → figure position. 0 is the logo, 1..3 are the three
 * principles; whole numbers hold, fractions are mid-morph.
 */
const KEYS: [number, number][] = [
  [0, 0],
  [0.1, 0],
  [0.22, 1],
  [0.38, 1],
  [0.5, 2],
  [0.66, 2],
  [0.78, 3],
  [1, 3],
];

export function figurePos(p: number) {
  for (let i = 1; i < KEYS.length; i++) {
    const [p1, f1] = KEYS[i];
    const [p0, f0] = KEYS[i - 1];
    if (p <= p1) {
      const t = p1 === p0 ? 1 : (p - p0) / (p1 - p0);
      return f0 + (f1 - f0) * t;
    }
  }
  return 3;
}

/** Scroll progress at which principle i is fully drawn (for click-to-jump). */
export const principleAt = [0.3, 0.58, 0.88];
