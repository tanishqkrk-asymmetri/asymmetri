/** Small deterministic helpers so generative art renders identically on server and client. */

export function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32: a tiny seeded PRNG. */
export function rng(seed: string) {
  let a = hash(seed);
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Round for stable SVG attribute strings. */
export const r1 = (n: number) => Math.round(n * 10) / 10;

export const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeIn = (t: number) => t * t * t;

/** Hold for the first part of each slot, then move: a scroll "staircase". */
export function staircase(t: number, steps: number, hold = 0.45) {
  const c = Math.min(Math.max(t, 0), steps);
  const k = Math.min(Math.floor(c), steps - 1);
  const f = c - k;
  return k + easeInOut(clamp01((f - hold) / (1 - hold)));
}
