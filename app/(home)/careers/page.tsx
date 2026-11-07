import type { Metadata } from "next";
import { CareersExperience } from "@/components/careers/CareersExperience";
import { careersDefinition, careersFaqs, careersSeo } from "@/components/careers/content";
import { getJobs, type Job } from "@/lib/jobs";
import { careersJsonLd, toJsonLdScript } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: careersSeo.title,
  description: careersSeo.description,
  keywords: careersSeo.keywords,
  alternates: { canonical: "/careers" },
  openGraph: {
    title: careersSeo.social,
    description: careersSeo.description,
    url: "/careers",
    type: "website",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: careersSeo.social }],
  },
  twitter: {
    card: "summary_large_image",
    title: careersSeo.social,
    description: careersSeo.description,
    images: ["/twitter-image.png"],
  },
};

// Open roles are rendered on the server so they are in the initial HTML;
// refreshed at most every 10 minutes.
export const revalidate = 600;

async function loadJobs(): Promise<Job[]> {
  try {
    const timeout = new Promise<Job[]>((resolve) => setTimeout(() => resolve([]), 4000));
    const jobs = await Promise.race([getJobs(), timeout]);
    return [...jobs].sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));
  } catch {
    return [];
  }
}

export default async function CareersPage() {
  const jobs = await loadJobs();
  const jsonLd = careersJsonLd({
    name: `${careersSeo.title} | Asymmetri`,
    description: careersDefinition,
    faqs: careersFaqs,
    roles: jobs.map((j) => ({ id: j.id, title: j.title })),
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLdScript(jsonLd) }} />
      <CareersExperience jobs={jobs} />
    </>
  );
}
