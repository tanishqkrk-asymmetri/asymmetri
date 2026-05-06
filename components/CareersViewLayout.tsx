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
    <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12 md:space-y-16 px-4 sm:px-6 lg:px-8">
      {/* <Button
        onClick={async () => {
          try {
            await setDoc(doc(db, "jobs", "jobs"), {
              allJobs: jobs,
            });
          } catch (err) {
            console.log(err);
          }
        }}
      >
        UPLOAD STUFF HEEHS
      </Button> */}
      <Filters
        query={query}
        setQuery={setQuery}
        filters={filters}
        setFilters={setFilters}
      />
      <CareersList query={query} filters={filters} />
      {(Object.values(filters).filter((x) => x !== "All").length > 0 ||
        query) && (
        <div className="h-[30vh] sm:h-[40vh] md:h-[50vh] flex flex-col sm:flex-row justify-center items-center gap-2 text-sm text-neutral-600 my-6 px-4">
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
    setFilters((org) => {
      return {
        team: searchParams.get("team") || "All",
        type: searchParams.get("type") || "All",
      };
    });
    setQuery(searchParams.get("q") || "");
  }, []);

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
          className="bg-neutral-100"
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
            <SelectTrigger className="w-full bg-neutral-100">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-100">
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
            <SelectTrigger className="w-full bg-neutral-100">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-100">
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
  useEffect(() => {
    (async function () {
      try {
        const fetched = await getJobs();
        if (fetched) {
          setJobs(fetched);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const filteredJobs: Job[] = useMemo(() => {
    console.log("applying filterse");
    if (!filters || !jobs) return jobs;
    let filtered = [...jobs];

    if (filters.team !== "All") {
      filtered = filtered.filter((job) => job.team === filters.team);
    }
    if (filters.type !== "All") {
      filtered = filtered.filter((job) => job.type === filters.type);
    }
    return filtered.filter((job) => {
      return job.title
        .toLocaleLowerCase()
        .match(query.trim().toLocaleLowerCase());
    });
  }, [jobs, query, filters]);

  return (
    <div className="">
      <div className="space-y-6">
        {jobs.length > 0
          ? filteredJobs?.map((job) => {
              return <JobCard key={job.id} job={job} />;
            })
          : [1, 2, 3, 4, 5, 6].map((x) => {
              return <JobCardSkeleton key={x} />;
            })}
      </div>
    </div>
  );
}

interface JobCardProps {
  job: Job;
}

const JobCard: FC<JobCardProps> = ({ job }) => {
  const getTeamIcon = (team: string) => {
    switch (team) {
      case "Engineering":
        return <Code className="w-4 h-4" />;
      case "Designing":
        return <Palette className="w-4 h-4" />;
      case "Marketing":
        return <Megaphone className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Full-time":
        return "bg-green-100 text-green-800 border-green-200";
      case "Part-time":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Internship":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTeamColor = (team: string) => {
    switch (team) {
      case "Engineering":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Designing":
        return "bg-pink-100 text-pink-800 border-pink-200";
      case "Marketing":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isNew = (date: number) => {
    const posted = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  return (
    <Card className="w-full mx-auto bg-neutral-50 border-black/10 shadow-none rounded-2xl overflow-hidden transition-all duration-300">
      <CardContent className="py-3 px-3 sm:px-5">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-2 mb-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <div className="flex flex-wrap gap-2">
                  <Badge
                    className={`text-xs px-2 py-1 rounded-full border ${getTypeColor(
                      job.type,
                    )}`}
                  >
                    {job.type}
                  </Badge>
                  {isNew(job.timestamp) && (
                    <Badge className="text-xs px-2 py-1 rounded-full bg-pink-100 text-pink-700 border-pink-200">
                      New
                    </Badge>
                  )}
                </div>
              </div>

              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 leading-tight">
                {job.title}
              </h2>
              <h4 className="text-sm  text-neutral-600 mb-2 sm:mb-3 leading-tight">
                {job.description}
              </h4>

              {/* Job Meta Info */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Work from anywhere</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Work anytime</span>
                </div>
              </div>

              <div className="flex items-start sm:items-center gap-2">
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {job.technicalRequirements.map((skill, index) => (
                    <Badge
                      key={index}
                      className="text-xs bg-blue-100 text-blue-700 border-blue-200 rounded-full px-1.5 sm:px-2 py-0.5 sm:py-1"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Actions and Salary */}
          <div className="flex items-center md:items-start justify-between md:justify-normal gap-2 md:gap-4 flex-shrink-0">
            {/* Action Buttons */}
            <div className="hidden sm:flex items-center gap-1 sm:gap-2">
              <button className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Share className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
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
            <a
              href={"/jobs/" + job.id}
              className="bg-black hover:bg-gray-800 text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors"
            >
              View job
            </a>

            {/* <TransitionLink href={"/jobs/" + job.id}>
              <button className="bg-black hover:bg-gray-800 text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors">
                View job
              </button>
            </TransitionLink> */}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100">
          <div className="text-right">
            <div className="text-base sm:text-xl font-semibold text-black mb-0 sm:mb-1">
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
    <Card className="w-full  mx-auto bg-white  shadow-none border-black/10 rounded-2xl overflow-hidden">
      <CardContent className="p-6 animate-pulse">
        <div className="flex items-start justify-between mb-4">
          {/* Left side - Company icon and job info */}
          <div className="flex items-start gap-4 flex-1">
            {/* Company Icon Skeleton */}
            {/* <div className="w-12 h-12 bg-gray-200 rounded-xl flex-shrink-0"></div> */}

            {/* Job Details Skeleton */}
            <div className="flex-1 min-w-0">
              {/* Job Type Badge and New Badge */}
              <div className="flex items-center gap-2 mb-2">
                <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                <div className="h-5 bg-gray-200 rounded-full w-10"></div>
              </div>

              {/* Job Title */}
              <div className="h-7 bg-gray-200 rounded w-64 mb-3"></div>

              {/* Job Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>

              {/* Skills Match Section */}
              <div className="flex items-center gap-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="flex items-center gap-1">
                  <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                  <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                </div>
                <div className="flex flex-wrap gap-2 ml-2">
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-14"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Actions and Salary */}
          <div className="flex items-start gap-4 flex-shrink-0">
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
              <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
              <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
              <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
            </div>

            {/* Salary */}
            <div className="text-right">
              <div className="h-8 bg-gray-200 rounded w-16 mb-1"></div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
          </div>

          <div className="h-9 bg-gray-200 rounded-lg w-20"></div>
        </div>
      </CardContent>
    </Card>
  );
}
