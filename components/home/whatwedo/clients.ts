import { selectedWork } from "@/lib/site-content";
import { PRESCRIBE_MASK } from "./prescribeMask";

/** Logo file and its intrinsic aspect ratio (width / height). */
const LOGOS: Record<string, { src: string; aspect: number }> = {
  "dd-group": { src: "/logos/DD Group Internal Designs.png", aspect: 555 / 450 },
  "kommerz-os": { src: "/logos/Komerz Frame.svg", aspect: 94 / 98 },
  "prescribe-life": { src: PRESCRIBE_MASK, aspect: 140 / 38 },
  quicli: { src: "/logos/Quicli Layer 2.png", aspect: 100 / 37 },
  "reform-ai": { src: "/logos/Reform Logos Final.png", aspect: 135 / 41 },
  "sochcast-campus-gal": { src: "/logos/Sochcast Campus Gal Logo.png", aspect: 104 / 66 },
  zimkey: { src: "/logos/Zimkey Final Logo.png", aspect: 207 / 44 },
};

/** Optical area every logo is sized to, in px² at desktop scale. */
const AREA = 6200;

export const clients = selectedWork
  .filter((w) => LOGOS[w.slug])
  .map((w) => {
    const { src, aspect } = LOGOS[w.slug];
    return {
      slug: w.slug,
      name: w.name,
      domain: w.domain,
      mask: `url("${src.startsWith("data:") ? src : encodeURI(src)}")`,
      w: Math.round(Math.sqrt(AREA * aspect)),
      h: Math.round(Math.sqrt(AREA / aspect)),
    };
  });
