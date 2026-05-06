"use client";
import { FC } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import {
  Briefcase,
  MapPin,
  Calendar,
  Wallet,
  Code,
  Palette,
  Megaphone,
  Users,
  Clock,
  Share,
  MessageCircle,
  Star,
  MoreHorizontal,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Label } from "./ui/label";
import { getJobs, Job } from "@/lib/jobs";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { TransitionLink } from "@/app/TransitionLink";

export type filterType = {
  team: string;
  type: string;
};

export default function CareersViewLayout() {
  const [filters, setFilters] = useState({
    team: "All",
    type: "All",
  });

  const [query, setQuery] = useState("");

  return (
    <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12 md:space-y-16 px-4 sm:px-6 lg:px-8 font-chakra-petch">
      <Filters
        query={query}
        setQuery={setQuery}
        filters={filters}
        setFilters={setFilters}
      />
      <CareersList query={query} filters={filters} />
      {(Object.values(filters).filter((x) => x !== "All").length > 0 ||
        query) && (
        <div className="my-6 flex h-[30vh] flex-col items-center justify-center gap-2 px-4 text-sm text-muted-foreground sm:h-[40vh] sm:flex-row md:h-[50vh]">
          <div className="text-center sm:text-left">
            Can&apos;t find what you&apos;re looking for?
          </div>
          <button
            onClick={() => {
              window.location.href = "/jobs";
              window.scrollTo(0, 0);
            }}
            className="underline cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

function Filters({
  filters,
  setFilters,
  query,
  setQuery,
}: {
  filters: filterType;
  setFilters: React.Dispatch<React.SetStateAction<filterType>>;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}) {
  const searchParams = useSearchParams();
  const inputDelay = 400;
  useEffect(() => {
    setFilters(() => ({
      team: searchParams.get("team") || "All",
      type: searchParams.get("type") || "All",
    }));
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  console.log(searchParams.get("team"));
  // router.push('?' + createQueryString('sortBy', e), { scroll: false });
  const router = useRouter();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  return (
    <div className="max-w-4xl mx-auto flex flex-col lg:flex-row items-stretch lg:items-end justify-center gap-4 lg:gap-3 px-4 sm:px-0">
      <div className="w-full space-y-2">
        <Label>Search</Label>
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            router.push("?" + createQueryString("q", e.target.value), {
              scroll: false,
            });
          }}
          placeholder="Search for jobs"
        ></Input>
      </div>
      <div className="flex flex-col sm:flex-row justify-center gap-3 items-stretch sm:items-end w-full lg:w-fit">
        <div className="space-y-2 w-full sm:min-w-48">
          <Label>Team</Label>
          <Select
            onValueChange={(e) => {
              router.push("?" + createQueryString("team", e), {
                scroll: false,
              });
              setFilters((org) => ({
                ...org,
                team: e,
              }));
            }}
            defaultValue="All"
            value={filters.team}
          >
            <SelectTrigger className="w-full border-border bg-card">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent className="border-border bg-popover text-popover-foreground">
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Designing">Designing</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="All">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 w-full sm:min-w-48">
          <Label>Type</Label>
          <Select
            defaultValue="All"
            onValueChange={(e) => {
              setFilters((org) => ({
                ...org,
                type: e,
              }));
            }}
            value={filters.type}
          >
            <SelectTrigger className="w-full border-border bg-card">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent className="border-border bg-popover text-popover-foreground">
              <SelectItem value="Internship">Internship</SelectItem>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
              <SelectItem value="All">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* <Button variant={"default"}>Clear filters</Button> */}
    </div>
  );
}

function CareersList({
  filters,
  query,
}: {
  filters: filterType;
  query: string;
}) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async function () {
      try {
        setLoading(true);
        const fetched = await getJobs();
        if (!cancelled) {
          setJobs(fetched);
        }
      } catch (err) {
        console.log(err);
        if (!cancelled) {
          setJobs([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredJobs: Job[] = useMemo(() => {
    let filtered = [...jobs];

    if (filters.team !== "All") {
      filtered = filtered.filter((job) => job.team === filters.team);
    }
    if (filters.type !== "All") {
      filtered = filtered.filter((job) => job.type === filters.type);
    }

    const q = query.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter((job) => job.title.toLowerCase().includes(q));
    }

    return filtered;
  }, [jobs, query, filters]);

  return (
    <div className="">
      <div className="space-y-6">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map((x) => <JobCardSkeleton key={x} />)
        ) : filteredJobs.length > 0 ? (
          filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
        ) : (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No roles match your search. Try clearing filters or check back
            later.
          </p>
        )}
      </div>
    </div>
  );
}

interface JobCardProps {
  job: Job;
}

const JobCard: FC<JobCardProps> = ({ job }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Full-time":
        return "border-emerald-500/40 bg-emerald-500/15 text-emerald-200";
      case "Part-time":
        return "border-sky-500/40 bg-sky-500/15 text-sky-200";
      case "Internship":
        return "border-violet-500/40 bg-violet-500/15 text-violet-200";
      default:
        return "border-border bg-muted text-muted-foreground";
    }
  };

  const isNew = (date: number) => {
    const posted = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  return (
    <Card className="mx-auto w-full overflow-hidden rounded-2xl border border-border bg-card shadow-none transition-all duration-300 hover:ring-1 hover:ring-foreground/15">
      <CardContent className="px-3 py-3 sm:px-5">
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-2">
          <div className="flex flex-1 items-start gap-3">
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <div className="flex flex-wrap gap-2">
                  <Badge
                    className={`rounded-full border px-2 py-1 text-xs ${getTypeColor(
                      job.type,
                    )}`}
                  >
                    {job.type}
                  </Badge>
                  {isNew(job.timestamp) && (
                    <Badge className="rounded-full border border-asymmetri-red/50 bg-asymmetri-red/15 px-2 py-1 text-xs text-asymmetri-red">
                      New
                    </Badge>
                  )}
                </div>
              </div>

              <h2 className="mb-2 text-lg font-semibold leading-tight text-foreground sm:mb-3 sm:text-xl">
                {job.title}
              </h2>
              <h4 className="mb-2 text-sm leading-tight text-muted-foreground sm:mb-3">
                {job.description}
              </h4>

              {/* Job Meta Info */}
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:mb-4 sm:gap-4 sm:text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Work from anywhere</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Work anytime</span>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:items-center">
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {job.technicalRequirements.map((skill, index) => (
                    <Badge
                      key={index}
                      className="rounded-full border border-sky-500/35 bg-sky-500/10 px-1.5 py-0.5 text-xs text-sky-200 sm:px-2 sm:py-1"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Actions and Salary */}
          <div className="flex shrink-0 items-center justify-between gap-2 md:items-start md:justify-normal md:gap-4">
            {/* Action Buttons */}
            <div className="hidden items-center gap-1 sm:flex sm:gap-2">
              <button
                type="button"
                className="rounded-lg p-1 transition-colors hover:bg-accent sm:p-2"
              >
                <Share className="h-3 w-3 text-muted-foreground sm:h-4 sm:w-4" />
              </button>
              {/* <button className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
              </button> */}
              {/* <button className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
              </button> */}
              {/* <button className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
              </button> */}
            </div>

            {/* View Job Button */}
            <Link
              href={"/jobs/" + job.id}
              scroll
              className="inline-flex rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:px-6 sm:py-2 sm:text-sm"
            >
              View job
            </Link>

            {/* <TransitionLink href={"/jobs/" + job.id}>
              <button className="bg-black hover:bg-gray-800 text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors">
                View job
              </button>
            </TransitionLink> */}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between border-t border-border pt-3 sm:pt-4">
          <div className="text-right">
            <div className="mb-0 text-base font-semibold text-foreground sm:mb-1 sm:text-xl">
              {job.payRange}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

function JobCardSkeleton() {
  return (
    <Card className="mx-auto w-full overflow-hidden rounded-2xl border border-border bg-card shadow-none">
      <CardContent className="animate-pulse p-6">
        <div className="mb-4 flex items-start justify-between">
          {/* Left side - Company icon and job info */}
          <div className="flex flex-1 items-start gap-4">
            {/* Job Details Skeleton */}
            <div className="min-w-0 flex-1">
              {/* Job Type Badge and New Badge */}
              <div className="mb-2 flex items-center gap-2">
                <div className="h-5 w-16 rounded-full bg-muted"></div>
                <div className="h-5 w-10 rounded-full bg-muted"></div>
              </div>

              {/* Job Title */}
              <div className="mb-3 h-7 w-64 rounded bg-muted"></div>

              {/* Job Meta Info */}
              <div className="mb-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="h-4 w-4 rounded bg-muted"></div>
                  <div className="h-4 w-32 rounded bg-muted"></div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-4 w-4 rounded bg-muted"></div>
                  <div className="h-4 w-24 rounded bg-muted"></div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-4 w-4 rounded bg-muted"></div>
                  <div className="h-4 w-20 rounded bg-muted"></div>
                </div>
              </div>

              {/* Skills Match Section */}
              <div className="flex items-center gap-2">
                <div className="h-4 w-20 rounded bg-muted"></div>
                <div className="flex items-center gap-1">
                  <div className="h-6 w-6 rounded-full bg-muted"></div>
                  <div className="h-6 w-6 rounded-full bg-muted"></div>
                </div>
                <div className="ml-2 flex flex-wrap gap-2">
                  <div className="h-6 w-16 rounded-full bg-muted"></div>
                  <div className="h-6 w-20 rounded-full bg-muted"></div>
                  <div className="h-6 w-14 rounded-full bg-muted"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Actions and Salary */}
          <div className="flex shrink-0 items-start gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-muted"></div>
              <div className="h-8 w-8 rounded-lg bg-muted"></div>
              <div className="h-8 w-8 rounded-lg bg-muted"></div>
              <div className="h-8 w-8 rounded-lg bg-muted"></div>
            </div>

            <div className="text-right">
              <div className="mb-1 h-8 w-16 rounded bg-muted"></div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-1">
            <div className="h-4 w-24 rounded bg-muted"></div>
            <div className="h-4 w-4 rounded bg-muted"></div>
          </div>

          <div className="h-9 w-20 rounded-lg bg-muted"></div>
        </div>
      </CardContent>
    </Card>
  );
}
