import JobPostingPageComponent from "@/components/JobPostingPage";
import { getJobs } from "@/lib/jobs";

export default async function JobPostingPage({
  params,
}: {
  params: { jobPostingId: string };
}) {
  const jobs = await getJobs();
  const { jobPostingId } = params;
  console.log(jobPostingId);

  const fetchedJob = jobs.find((x) => x.id === jobPostingId);

  return (
    <main>
      {fetchedJob && (
        <JobPostingPageComponent
          jobDetails={fetchedJob}
        ></JobPostingPageComponent>
      )}
    </main>
  );
}
export async function generateMetadata({
  params,
}: {
  params: { jobPostingId: string };
}) {
  const jobs = await getJobs();
  const job = jobs.find((job) => job.id === params.jobPostingId);

  if (!job) {
    return {
      title: "Job Not Found",
      description: "The requested job posting could not be found.",
    };
  }

  return {
    title: `${job.title} | Asymmetri Careers`,
    description: job.description,
    openGraph: {
      title: job.title,
      description: job.description,
      type: "article",
      publishedTime: job.postedOn,
      modifiedTime: new Date(job.timestamp).toISOString(),
      tags: [job.team, job.type, job.location, job.experienceRequired],
    },
    twitter: {
      card: "summary",
      title: job.title,
      description: job.description,
    },
    keywords: [
      job.team,
      job.type,
      job.location,
      job.experienceRequired,
      "careers",
      "job",
      "hiring",
    ],
    alternates: {
      canonical: `/jobs/${job.id}`,
    },
  };
}
