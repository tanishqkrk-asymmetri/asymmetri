"use client";
export default function AdminJobs() {
  return (
    <div>
      <JobsAdminPanel />
    </div>
  );
}

import React, { useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Clock,
  Search,
  Filter,
  Plus,
} from "lucide-react";
import { getJobs } from "@/lib/jobs";
import Link from "next/link";

// Job interface
interface Job {
  id: string;
  title: string;
  postedOn: string; // Format: YYYY-MM-DD
  description: string;
  technicalRequirements: string[];
  experienceRequired: string;
  team: string;
  type: string;
  location: "Remote";
  payRange: string;
  timestamp: number;
  full_description: string;
}

const JobsAdminPanel = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  useEffect(() => {
    (async function () {
      const fetched = await getJobs();
      setJobs(fetched);
    })();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("All");

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = selectedTeam === "All" || job.team === selectedTeam;
    return matchesSearch && matchesTeam;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTeamColor = (team: string) => {
    const colors = {
      Engineering: "border-sky-500/40 bg-sky-500/15 text-sky-200",
      Design: "border-violet-500/40 bg-violet-500/15 text-violet-200",
      Infrastructure: "border-emerald-500/40 bg-emerald-500/15 text-emerald-200",
      Marketing: "border-orange-500/40 bg-orange-500/15 text-orange-200",
    };
    return (
      colors[team as keyof typeof colors] ||
      "border-border bg-muted text-muted-foreground"
    );
  };

  const getTypeColor = (type: string) => {
    return type === "Full-time"
      ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-200"
      : "border-amber-500/40 bg-amber-500/15 text-amber-200";
  };

  return (
    <div className="min-h-screen bg-background p-6 text-foreground">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Job Management
              </h1>
              <p className="mt-1 text-muted-foreground">
                Manage and monitor all job postings
              </p>
            </div>
            <a
              href={"/admin/jobs/" + "new"}
              className="flex items-center space-x-2 rounded-lg bg-asymmetri-red px-4 py-2 text-white transition-colors hover:bg-asymmetri-red/90"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Job</span>
            </a>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-input bg-card py-2 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:border-transparent focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="appearance-none rounded-lg border border-input bg-card py-2 pl-10 pr-8 text-foreground focus:border-transparent focus:ring-2 focus:ring-ring"
              >
                <option value="All">All Teams</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Jobs</p>
                  <p className="text-2xl font-bold text-foreground">
                    {jobs.length}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-asymmetri-red/15">
                  <Users className="h-5 w-5 text-asymmetri-red" />
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Full-time Jobs</p>
                  <p className="text-2xl font-bold text-foreground">
                    {jobs.filter((j) => j.type === "Full-time").length}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15">
                  <Clock className="h-5 w-5 text-emerald-400" />
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Part-time Jobs</p>
                  <p className="text-2xl font-bold text-foreground">
                    {jobs.filter((j) => j.type === "Part-time").length}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/15">
                  <Clock className="h-5 w-5 text-amber-400" />
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Internships</p>
                  <p className="text-2xl font-bold text-foreground">
                    {jobs.filter((j) => j.type === "Internship").length}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/15">
                  <Clock className="h-5 w-5 text-violet-400" />
                </div>
              </div>
            </div>
            {/* <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Contract Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {jobs.filter((j) => j.type === "Contract").length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </div> */}
            {/* <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Remote Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {jobs.length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <Link
              href={"/admin/jobs/" + job.id}
              key={job.id}
              className="group cursor-pointer rounded-lg border border-border bg-card transition-all duration-200 hover:border-asymmetri-red/40 hover:shadow-lg hover:shadow-black/20"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-asymmetri-red">
                      {job.title}
                    </h3>
                    <div className="mt-2 flex items-center space-x-2">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium border ${getTeamColor(
                          job.team
                        )}`}
                      >
                        {job.team}
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium border ${getTypeColor(
                          job.type
                        )}`}
                      >
                        {job.type}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                  {job.description}
                </p>

                {/* Technical Requirements */}
                <div className="mb-4">
                  <p className="mb-2 text-xs font-medium text-foreground">
                    Technical Requirements:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {job.technicalRequirements.map((tech, index) => (
                      <span
                        key={index}
                        className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                    {job.technicalRequirements.length > 3 && (
                      <span className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                        +{job.technicalRequirements.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(job.postedOn)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-foreground">
                    {job.payRange}
                  </div>
                </div>

                {/* Experience Required */}
                <div className="mt-2 text-xs text-muted-foreground">
                  Experience: {job.experienceRequired}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredJobs.length === 0 && (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-foreground">
              No jobs found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
