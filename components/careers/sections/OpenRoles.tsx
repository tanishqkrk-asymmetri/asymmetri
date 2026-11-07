"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { getJobs, type Job } from "@/lib/jobs";
import { company } from "@/lib/site-content";
import { SectionHead } from "@/components/practice/SectionHead";
import { ScrambleText } from "@/components/practice/ScrambleText";
import { openRoles } from "../content";

const EASE = [0.16, 1, 0.3, 1] as const;
const MAX = 6;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const pad = (n: number) => String(n).padStart(2, "0");

/** "2026-11-02" → "02 Nov 2026", without time zones (no hydration drift). */
function formatDate(s: string) {
  const [y, m, d] = (s ?? "").split("-");
  const mi = Number(m) - 1;
  if (!y || !d || !(mi >= 0 && mi < 12)) return s;
  return `${d.padStart(2, "0")} ${MONTHS[mi]} ${y}`;
}

const SEAT_COLS = 16;
const SEAT_ROWS = 4;

/**
 * A seating chart of identical marks with one empty seat, drawn as the red
 * slash. The open seat drifts each time the list changes: "Find your seat."
 */
function SeatMap({ seed }: { seed: number }) {
  const open = (seed * 23 + 37) % (SEAT_COLS * SEAT_ROWS);
  return (
    <div
      aria-hidden
      className="grid w-full max-w-sm gap-x-2 gap-y-3"
      style={{ gridTemplateColumns: `repeat(${SEAT_COLS}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: SEAT_COLS * SEAT_ROWS }, (_, i) => (
        <span key={i} className="flex h-5 items-end justify-center">
          {i === open ? (
            <span className="relative block h-5 w-[4px] -skew-x-[26deg] bg-asymmetri-red">
              <span className="absolute inset-0 animate-ping bg-asymmetri-red opacity-60" />
            </span>
          ) : (
            <span className="block h-3 w-[2px] bg-white/25" />
          )}
        </span>
      ))}
    </div>
  );
}

function RoleRow({ job, i }: { job: Job; i: number }) {
  const meta = [job.team, job.type, job.location || "Remote"].filter(Boolean);
  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -5% 0px" }}
      transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
      className="border-b border-white/15"
    >
      <a
        href={`/careers/positions/${job.id}`}
        className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-2 overflow-hidden py-6 outline-none md:grid-cols-[3rem_2fr_1fr_auto] md:gap-x-8 lg:grid-cols-[3.5rem_2fr_1.1fr_7rem_auto] md:py-8"
      >
        <span
          aria-hidden
          className="absolute inset-0 origin-left scale-x-0 bg-asymmetri-red transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
        />
        <span className="relative font-mono text-[11px] tracking-[0.2em] text-asymmetri-red transition-colors group-hover:text-white group-focus-visible:text-white md:pl-2">
          {pad(i + 1)}
        </span>
        <h3 className="relative min-w-0 font-chakra-petch text-2xl leading-[0.95] font-bold uppercase md:text-3xl xl:text-4xl">
          {job.title}
        </h3>
        <ArrowUpRight
          aria-hidden
          className="relative row-span-2 size-6 shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 md:order-last md:row-span-1 md:mr-2 md:size-8"
          strokeWidth={1.5}
        />
        <span className="relative col-start-2 flex flex-wrap gap-1.5 md:col-start-auto">
          {meta.map((m) => (
            <span
              key={m}
              className="border border-white/25 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-white/75 transition-colors group-hover:border-white/60 group-hover:text-white"
            >
              {m}
            </span>
          ))}
        </span>
        <span className="relative hidden font-mono text-[10px] uppercase tracking-[0.2em] text-white/45 transition-colors group-hover:text-white lg:block">
          {job.postedOn ? <time dateTime={job.postedOn}>{formatDate(job.postedOn)}</time> : null}
        </span>
      </a>
    </motion.li>
  );
}

/** Live list of open roles. Server-rendered from Firestore, refreshed on the client. */
export function OpenRoles({ initialJobs }: { initialJobs: Job[] }) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);

  useEffect(() => {
    let cancelled = false;
    getJobs()
      .then((fetched) => {
        if (cancelled) return;
        setJobs([...fetched].sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0)));
      })
      .catch(() => undefined); // keep the server copy
    return () => {
      cancelled = true;
    };
  }, []);

  const shown = jobs.slice(0, MAX);

  return (
    <section
      id="open-roles"
      data-chapter="Roles"
      data-nav="dark"
      aria-labelledby="careers-open-roles"
      className="relative scroll-mt-14 overflow-hidden bg-black px-6 py-28 text-white md:px-16 md:py-36"
    >
      <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:items-end">
        <div id="careers-open-roles">
          <SectionHead align="left" kicker={openRoles.kicker} title={openRoles.titleLines} body={openRoles.intro} />
        </div>
        <div className="flex flex-col gap-4 lg:items-end">
          <SeatMap seed={jobs.length} />
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">
            <span className="text-white">{pad(jobs.length)}</span> open · all remote
          </p>
        </div>
      </div>

      {shown.length > 0 ? (
        <>
          <ul className="mt-16 border-t border-white/15 md:mt-20">
            {shown.map((job, i) => (
              <RoleRow key={job.id} job={job} i={i} />
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <p className="font-geist text-sm text-white/50">
              {jobs.length > MAX ? `Showing ${MAX} of ${jobs.length} roles.` : "That's every open role right now."}
            </p>
            <a
              href={openRoles.allRolesHref}
              className="group relative inline-flex items-center gap-3 overflow-hidden border border-white px-6 py-3 font-chakra-petch text-sm font-semibold uppercase tracking-wide"
            >
              <span className="absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
              <span className="relative transition-colors duration-300 group-hover:text-black">All open roles</span>
              <span className="relative transition-colors duration-300 group-hover:text-asymmetri-red">→</span>
            </a>
          </div>
        </>
      ) : (
        <div className="mt-16 grid border border-white/15 md:mt-20 lg:grid-cols-[1.4fr_1fr]">
          <div className="p-6 md:p-10">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-asymmetri-red">
              <ScrambleText text="00 listings · seats still open" />
            </p>
            <h3 className="font-chakra-petch text-3xl leading-[0.95] font-bold uppercase md:text-5xl">
              {openRoles.emptyTitle}
            </h3>
            <p className="mt-5 max-w-lg font-geist text-base leading-relaxed text-white/65 md:text-lg">
              {openRoles.emptyBody}
            </p>
          </div>
          <div className="flex flex-col justify-end gap-3 border-t border-white/15 p-6 md:p-10 lg:border-t-0 lg:border-l">
            <a
              href={`mailto:${company.email}?subject=${encodeURIComponent("What I'd build at Asymmetri")}`}
              className="group relative flex items-center justify-between gap-6 overflow-hidden bg-asymmetri-red px-6 py-4 font-chakra-petch text-base font-bold uppercase"
            >
              <span className="absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
              <span className="relative truncate transition-colors duration-300 group-hover:text-black">
                Write to {company.email}
              </span>
              <span className="relative transition-colors duration-300 group-hover:text-asymmetri-red">↗</span>
            </a>
            <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">
              <a href={openRoles.allRolesHref} className="hover:text-white">
                Check all roles →
              </a>
              <a href="/contact-us" className="hover:text-white">
                Contact page →
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
