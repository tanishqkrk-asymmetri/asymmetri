import type { Metadata } from "next";
import { getJobs, type Job } from "@/lib/jobs";
import { SITE_URL, company } from "@/lib/site-content";
import { toJsonLdScript } from "@/lib/structured-data";

// Role pages render on the client; this layout gives each one its own title,
// canonical and JobPosting structured data (Google for Jobs) from the server.
export const revalidate = 600;

async function findJob(id: string): Promise<Job | undefined> {
  try {
    const timeout = new Promise<Job[]>((resolve) => setTimeout(() => resolve([]), 4000));
    const jobs = await Promise.race([getJobs(), timeout]);
    return jobs.find((j) => j.id === id);
  } catch {
    return undefined;
  }
}

const EMPLOYMENT: Record<string, string> = {
  "Full-time": "FULL_TIME",
  "Part-time": "PART_TIME",
  Internship: "INTERN",
};

type Params = Promise<{ jobId: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { jobId } = await params;
  const job = await findJob(jobId);
  const path = `/careers/positions/${jobId}`;
  if (!job) return { title: "Role", alternates: { canonical: path } };
  const description = `${job.title} at Asymmetri (${job.type}, remote, ${job.team}). ${job.description}`.slice(0, 300);
  return {
    title: `${job.title} (Remote)`,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${job.title} at Asymmetri`, description, url: path },
  };
}

export default async function JobLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const { jobId } = await params;
  const job = await findJob(jobId);
  const jsonLd = job && {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.full_description || job.description,
    datePosted: job.postedOn,
    employmentType: EMPLOYMENT[job.type] ?? "OTHER",
    jobLocationType: "TELECOMMUTE",
    occupationalCategory: job.team,
    experienceRequirements: job.experienceRequired,
    skills: job.technicalRequirements?.join(", "),
    url: `${SITE_URL}/careers/positions/${job.id}`,
    directApply: true,
    hiringOrganization: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: company.name,
      sameAs: SITE_URL,
      logo: `${SITE_URL}${company.logo}`,
    },
  };
  return (
    <>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLdScript(jsonLd) }} />
      )}
      {children}
    </>
  );
}
