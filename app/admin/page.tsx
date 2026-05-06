"use client";

import Link from "next/link";
import { Briefcase, FileText } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="min-h-screen flex-1 p-6 text-foreground sm:p-8">
      <h1 className="mb-2 font-chakra-petch text-2xl font-semibold tracking-wide">
        Admin
      </h1>
      <p className="mb-8 max-w-xl text-muted-foreground">
        Manage job postings and applications. Choose an area below.
      </p>
      <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
        <Link
          href="/admin/jobs"
          className="group rounded-xl border border-border bg-card p-6 ring-1 ring-foreground/10 transition-colors hover:border-asymmetri-red/40 hover:bg-accent/50"
        >
          <Briefcase className="mb-3 h-8 w-8 text-asymmetri-red" />
          <h2 className="font-medium text-foreground group-hover:text-foreground">
            Posted jobs
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Create, edit, and publish listings
          </p>
        </Link>
        <Link
          href="/admin/applications"
          className="group rounded-xl border border-border bg-card p-6 ring-1 ring-foreground/10 transition-colors hover:border-asymmetri-red/40 hover:bg-accent/50"
        >
          <FileText className="mb-3 h-8 w-8 text-asymmetri-red" />
          <h2 className="font-medium text-foreground">Applications</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Review candidates and statuses
          </p>
        </Link>
      </div>
    </div>
  );
}
