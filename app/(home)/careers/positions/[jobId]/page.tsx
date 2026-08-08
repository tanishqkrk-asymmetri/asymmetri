"use client";

import JobDetailView from "@/components/JobDetailView";
import { getJobs, Job } from "@/lib/jobs";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const fetched = await getJobs();
        if (!cancelled) setJobs(fetched);
      } catch {
        if (!cancelled) setJobs([]);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const job = jobs.find((j) => j.id === jobId);

  if (!loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-black/10 border-t-asymmetri-red" />
          <span className="font-chakra-petch text-sm text-black/50">
            Loading role…
          </span>
        </div>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="min-h-screen bg-white px-4 py-24 text-center">
        <h1 className="font-chakra-petch text-2xl font-semibold text-black">
          Job not found
        </h1>
        <p className="mt-2 font-chakra-petch text-black/50">
          This listing may have been removed or the link is incorrect.
        </p>
        <Link
          href="/careers/positions"
          className="mt-6 inline-block font-chakra-petch text-asymmetri-red underline underline-offset-4 hover:opacity-70"
        >
          Back to open positions
        </Link>
      </main>
    );
  }

  return <JobDetailView job={job} />;
}
