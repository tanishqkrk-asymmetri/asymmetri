"use client";

import { getJobs, Job, JobTeam, JobType } from "@/lib/jobs";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ASYM_RED } from "@/lib/color";

const GRID_BORDER = "border-white/20";

type Filters = {
  team: JobTeam | "All";
  type: JobType | "All";
};

const TEAMS: (JobTeam | "All")[] = [
  "All",
  "Engineering",
  "Designing",
  "Marketing",
];
const TYPES: (JobType | "All")[] = [
  "All",
  "Full-time",
  "Part-time",
  "Internship",
];

function PositionsNav() {
  const links = [
    { label: "About", href: "/about" },
    { label: "Work", href: "/" },
    { label: "Services", href: "/#services" },
    { label: "Careers", href: "/careers" },
  ] as const;

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className={`fixed top-0 z-50 w-full border-b ${GRID_BORDER} bg-black`}
    >
      <div className="mx-auto flex h-14 w-full items-center px-6 sm:px-10">
        <div className="flex flex-1 items-center">
          <Link
            href="/"
            className="w-9 p-1 transition-opacity hover:opacity-60"
            aria-label="Asymmetri"
          >
            <img className="w-6" src="/logo_mini.png" alt="" />
          </Link>
        </div>

        <nav className="hidden flex-none items-center justify-center gap-16 md:flex lg:gap-36">
          {links.map((l, i) => (
            <motion.div
              key={l.href}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
            >
              <Link
                href={l.href}
                className="font-chakra-petch text-[16px] tracking-wide text-white transition-opacity hover:opacity-50"
              >
                {l.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end">
          <Link
            href="/contact-us"
            className="font-chakra-petch text-[16px] tracking-wide text-white transition-opacity hover:opacity-50"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </motion.header>
  );
}

function buildJobGrid(jobs: Job[]): { job: Job | null; delay: number }[][] {
  const rows: (Job | null)[][] = [];
  let i = 0;

  while (i < jobs.length) {
    if (rows.length % 2 === 0) {
      const row: (Job | null)[] = [jobs[i++] ?? null, null, null];
      if (i < jobs.length) row[2] = jobs[i++];
      rows.push(row);
    } else {
      const row: (Job | null)[] = [jobs[i++] ?? null, null, null];
      if (i < jobs.length) row[1] = jobs[i++];
      rows.push(row);
    }
  }

  let cardIndex = 0;
  return rows.map((row) =>
    row.map((job) => ({
      job,
      delay: job ? 0.15 + cardIndex++ * 0.1 : 0,
    })),
  );
}

function filterJobs(jobs: Job[], filters: Filters, query: string): Job[] {
  let result = [...jobs];

  if (filters.team !== "All") {
    result = result.filter((job) => job.team === filters.team);
  }
  if (filters.type !== "All") {
    result = result.filter((job) => job.type === filters.type);
  }

  const q = query.trim().toLowerCase();
  if (q) {
    result = result.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.description.toLowerCase().includes(q),
    );
  }

  return result;
}

function FilterGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  delay = 0,
}: {
  label: string;
  options: T[];
  value: T;
  onChange: (v: T) => void;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.2, 0.8, 0.2, 1] }}
      className="space-y-3"
    >
      <p className="font-chakra-petch text-xs uppercase tracking-widest text-white/35">
        {label}
      </p>
      <ul className="space-y-1">
        {options.map((option) => {
          const active = value === option;
          return (
            <li key={option}>
              <button
                type="button"
                onClick={() => onChange(option)}
                className={`group flex w-full items-center gap-2 py-1.5 text-left font-chakra-petch text-sm transition-colors ${
                  active ? "text-asymmetri-red" : "text-white/60 hover:text-white"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
                    active
                      ? "bg-asymmetri-red"
                      : "bg-white/20 group-hover:bg-white/50"
                  }`}
                />
                {option === "All" ? "All roles" : option}
              </button>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}

function PositionFilters({
  filters,
  setFilters,
  query,
  setQuery,
  resultCount,
  totalCount,
  loading,
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  query: string;
  setQuery: (q: string) => void;
  resultCount: number;
  totalCount: number;
  loading: boolean;
}) {
  const hasActiveFilters =
    filters.team !== "All" || filters.type !== "All" || query.trim() !== "";

  return (
    <div className="flex flex-col gap-8 p-8 md:sticky md:top-14 md:max-h-[calc(100vh-3.5rem)] md:overflow-y-auto md:p-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        className="space-y-3"
      >
        <p className="font-chakra-petch text-xs uppercase tracking-widest text-white/35">
          Search
        </p>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Role title or keyword"
          disabled={loading}
          className="w-full select-text border-0 border-b border-white/20 bg-transparent pb-2 font-chakra-petch text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-asymmetri-red disabled:opacity-40"
        />
      </motion.div>

      <FilterGroup
        label="Category"
        options={TEAMS}
        value={filters.team}
        onChange={(team) => setFilters((f) => ({ ...f, team }))}
        delay={0.08}
      />

      <FilterGroup
        label="Job type"
        options={TYPES}
        value={filters.type}
        onChange={(type) => setFilters((f) => ({ ...f, type }))}
        delay={0.14}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, delay: 0.2 }}
        className="mt-auto space-y-4 border-t border-white/10 pt-6"
      >
        {!loading && (
          <p className="font-chakra-petch text-xs text-white/35">
            Showing{" "}
            <span className="text-white/70">{resultCount}</span>
            {totalCount !== resultCount && (
              <>
                {" "}
                of <span className="text-white/70">{totalCount}</span>
              </>
            )}{" "}
            {resultCount === 1 ? "role" : "roles"}
          </p>
        )}

        <AnimatePresence>
          {hasActiveFilters && (
            <motion.button
              type="button"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onClick={() => {
                setFilters({ team: "All", type: "All" });
                setQuery("");
              }}
              className="font-chakra-petch text-xs text-asymmetri-red underline underline-offset-4 transition-opacity hover:opacity-70"
            >
              Clear filters
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function FiltersSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-8 p-8 md:p-10">
      <div className="space-y-3">
        <div className="h-3 w-16 rounded bg-white/10" />
        <div className="h-4 w-full rounded bg-white/10" />
      </div>
      {["Category", "Job type"].map((label) => (
        <div key={label} className="space-y-3">
          <div className="h-3 w-20 rounded bg-white/10" />
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 w-24 rounded bg-white/10" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function JobCard({ job, delay }: { job: Job; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.2, 0.8, 0.2, 1],
      }}
      className="group relative flex h-full min-h-[220px] flex-col p-8 md:min-h-[260px] md:p-10"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-chakra-petch text-lg font-semibold leading-snug text-white md:text-xl">
          {job.title}
        </h3>
        <Link
          href={`/careers/positions/${job.id}`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-asymmetri-red border bg-black text-white transition-transform duration-300 group-hover:scale-110"
          aria-label={`View ${job.title}`}
        >
          <ArrowUpRight className="h-4 w-4" stroke={ASYM_RED} strokeWidth={2} />
        </Link>
      </div>

      <p className="mt-4 flex-1 font-chakra-petch text-sm leading-relaxed text-white/45 md:text-[15px]">
        {job.description}
      </p>

      <div className="mt-6 flex items-end justify-between font-chakra-petch text-sm text-white/80 md:text-base">
        <span>{job.payRange}</span>
        <span>{job.experienceRequired}</span>
      </div>
    </motion.div>
  );
}

function EmptyCell() {
  return <div className="min-h-[220px] md:min-h-[260px]" />;
}

function JobCardSkeleton({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="flex h-full min-h-[220px] animate-pulse flex-col p-8 md:min-h-[260px] md:p-10"
    >
      <div className="flex justify-between">
        <div className="h-6 w-2/3 rounded bg-white/10" />
        <div className="h-9 w-9 rounded-full bg-white/10" />
      </div>
      <div className="mt-6 space-y-2">
        <div className="h-3 w-full rounded bg-white/10" />
        <div className="h-3 w-4/5 rounded bg-white/10" />
      </div>
      <div className="mt-auto flex justify-between pt-6">
        <div className="h-4 w-24 rounded bg-white/10" />
        <div className="h-4 w-12 rounded bg-white/10" />
      </div>
    </motion.div>
  );
}

function HeroImage() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <div
      ref={ref}
      className="relative h-full min-h-[280px] overflow-hidden md:min-h-[420px]"
    >
      <motion.img
        src="/flip.png"
        alt=""
        style={{ scale, y }}
        initial={{ opacity: 0, scale: 1.15 }}
        animate={{ opacity: 1, scale: 1.08 }}
        transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}

export default function Positions() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({ team: "All", type: "All" });
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const fetched = await getJobs();
        if (!cancelled) setJobs(fetched);
      } catch {
        if (!cancelled) setJobs([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredJobs = useMemo(
    () => filterJobs(jobs, filters, query),
    [jobs, filters, query],
  );
  const jobGrid = buildJobGrid(filteredJobs);
  const hasActiveFilters =
    filters.team !== "All" || filters.type !== "All" || query.trim() !== "";

  return (
    <div className="min-h-screen bg-black">
      <PositionsNav />

      <main className="pt-14">
        <div className={`border-l border-t ${GRID_BORDER}`}>
          {/* Hero row */}
          <div className="grid grid-cols-4">
            <div
              className={`col-span-4 flex min-h-[320px] flex-col justify-between border-r border-b ${GRID_BORDER} p-8 md:col-span-1 md:min-h-[420px] md:p-10`}
            >
              <motion.h1
                initial={{ opacity: 0, x: -24, filter: "blur(8px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                className="font-chakra-petch text-4xl font-semibold leading-[1.05] text-asymmetri-red md:text-5xl lg:text-[3.25rem]"
              >
                Open
                <br />
                positions
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.35,
                  ease: [0.2, 0.8, 0.2, 1],
                }}
                className="mt-8 font-chakra-petch text-sm leading-relaxed text-white/45 md:mt-0 md:text-[15px]"
              >
                Work from home, or from
                <br />
                wherever makes you happy.
              </motion.p>
            </div>

            <div
              className={`col-span-4 border-r border-b ${GRID_BORDER} md:col-span-3`}
            >
              <HeroImage />
            </div>
          </div>

          {/* Job section: filters + grid */}
          <div className="grid grid-cols-1 md:grid-cols-4">
            <div
              className={`border-r border-b ${GRID_BORDER} md:min-h-[260px]`}
            >
              {loading ? (
                <FiltersSkeleton />
              ) : (
                <PositionFilters
                  filters={filters}
                  setFilters={setFilters}
                  query={query}
                  setQuery={setQuery}
                  resultCount={filteredJobs.length}
                  totalCount={jobs.length}
                  loading={loading}
                />
              )}
            </div>

            <div className={`col-span-1 md:col-span-3`}>
              {loading ? (
                Array.from({ length: 2 }).map((_, row) => (
                  <div key={row} className="grid grid-cols-3">
                    {Array.from({ length: 3 }).map((_, col) => (
                      <div
                        key={col}
                        className={`border-r border-b ${GRID_BORDER}`}
                      >
                        {(row === 0 && (col === 0 || col === 2)) ||
                        (row === 1 && (col === 0 || col === 1)) ? (
                          <JobCardSkeleton
                            delay={0.2 + (row * 2 + col) * 0.08}
                          />
                        ) : (
                          <EmptyCell />
                        )}
                      </div>
                    ))}
                  </div>
                ))
              ) : jobs.length === 0 ? (
                <div
                  className={`border-r border-b ${GRID_BORDER} p-10 md:min-h-[260px]`}
                >
                  <p className="font-chakra-petch text-white/45">
                    No open positions right now. Check back soon.
                  </p>
                </div>
              ) : filteredJobs.length === 0 ? (
                <div
                  className={`border-r border-b ${GRID_BORDER} p-10 md:min-h-[260px]`}
                >
                  <p className="font-chakra-petch text-white/45">
                    No roles match your filters.
                  </p>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={() => {
                        setFilters({ team: "All", type: "All" });
                        setQuery("");
                      }}
                      className="mt-3 font-chakra-petch text-sm text-asymmetri-red underline underline-offset-4 transition-opacity hover:opacity-70"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                jobGrid.map((row, rowIdx) => (
                  <div key={rowIdx} className="grid grid-cols-3">
                    {row.map(({ job, delay }, col) => (
                      <motion.div
                        key={`${rowIdx}-${col}-${job?.id ?? "empty"}`}
                        layout
                        whileHover={
                          job
                            ? {
                                backgroundColor: "rgba(255,255,255,0.05)",
                              }
                            : undefined
                        }
                        transition={{ duration: 0.25 }}
                        className={`border-r border-b ${GRID_BORDER}`}
                      >
                        {job ? (
                          <JobCard job={job} delay={delay} />
                        ) : (
                          <EmptyCell />
                        )}
                      </motion.div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
