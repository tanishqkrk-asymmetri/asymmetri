/**
 * Client voices for the home page "Voices" chapter.
 *
 * ONLY ADD REAL, APPROVED QUOTES HERE. Every entry must be something the named
 * person actually said, with their written permission to publish it, their
 * name, role and company exactly as they approved them, and (if used) a photo
 * they supplied or approved. No invented names, no stock photos, no
 * paraphrasing presented as a quote.
 *
 * While this list is empty the Voices section renders nothing at all, so the
 * page goes straight from the founder note to the FAQ. The section is designed
 * for 3 to 8 quotes of roughly 15 to 70 words each.
 *
 * - quote:     the approved wording, without surrounding quotation marks.
 * - name, role, company: as approved, e.g. "Head of Product".
 * - image:     optional path under /public (square, at least 320px), e.g.
 *              "/voices/jane-doe.jpg". Shown in greyscale.
 * - caseStudy: optional internal link to the related case study, e.g.
 *              "/case-studies/some-slug".
 */
export type Voice = {
  quote: string;
  name: string;
  role: string;
  company: string;
  image?: string;
  caseStudy?: string;
};

export const voices: Voice[] = [];
