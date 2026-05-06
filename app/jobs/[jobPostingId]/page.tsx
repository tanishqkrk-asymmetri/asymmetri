"use client";

import JobPostingPageComponent from "@/components/JobPostingPage";
import { getJobs, Job } from "@/lib/jobs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function JobPostingPage() {
  const { jobPostingId } = useParams();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async function () {
      const fetched = await getJobs();
      setJobs(fetched);
      setLoaded(true);
    })();
  }, []);

  const fetchedJob = jobs.find((x) => x.id === jobPostingId);

  if (!loaded) {
    return (
      <main className="heroDark flex min-h-screen items-center justify-center text-muted-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-asymmetri-red" />
          <span className="text-sm">Loading role…</span>
        </div>
      </main>
    );
  }

  if (!fetchedJob) {
    return (
      <main className="heroDark min-h-screen px-4 py-24 text-center text-foreground">
        <h1 className="font-chakra-petch text-2xl font-semibold tracking-wide">
          Job not found
        </h1>
        <p className="mt-2 text-muted-foreground">
          This listing may have been removed or the link is incorrect.
        </p>
        <Link
          href="/jobs"
          className="mt-6 inline-block text-asymmetri-red underline underline-offset-4 hover:text-asymmetri-red/90"
        >
          Back to careers
        </Link>
      </main>
    );
  }

  return (
    <main className="heroDark min-h-screen pb-20 text-foreground">
      <JobPostingPageComponent jobDetails={fetchedJob} />
    </main>
  );
}
