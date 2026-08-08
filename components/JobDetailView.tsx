"use client";

import { Job, JobTeam } from "@/lib/jobs";
import { motion } from "motion/react";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState, startTransition } from "react";
import Markdown from "react-markdown";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { ApplicationStatus } from "@/lib/application_status";
import { JobApplication } from "@/lib/ApplicationType";
import { CheckCircle2 } from "lucide-react";

const DIVIDER = "border-black/10";

const TEAM_TAGLINES: Record<JobTeam, string> = {
  Engineering: "BUILD THE FUTURE",
  Designing: "PIXEL PERFECTION",
  Marketing: "GROW TOGETHER",
};

const SECTIONS = [
  { id: "overview", label: "Overview", align: "left" as const },
  { id: "what-youll-do", label: "What you'll do", align: "right" as const },
  { id: "location", label: "Location", align: "right" as const },
  { id: "salary", label: "Salary", align: "right" as const },
  { id: "perks", label: "Perks", align: "right" as const },
  { id: "apply", label: "Apply", align: "right" as const },
];

const PERKS = [
  "Work from anywhere, on your schedule",
  "Small team, direct impact on what ships",
  "Async-first with fast feedback loops",
  "Real projects across domains and stacks",
];

function JobDetailNav() {
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
      className={`fixed top-0 z-50 w-full border-b ${DIVIDER} bg-white`}
    >
      <div className="mx-auto flex h-14 w-full items-center px-6 sm:px-10">
        <div className="flex flex-1 items-center">
          <Link
            href="/"
            className="w-9 p-1 transition-opacity hover:opacity-60"
            aria-label="Asymmetri"
          >
            <img className="w-6 invert" src="/logo_mini.png" alt="" />
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
                className="font-chakra-petch text-[16px] tracking-wide text-black transition-opacity hover:opacity-50"
              >
                {l.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end">
          <Link
            href="/contact-us"
            className="font-chakra-petch text-[16px] tracking-wide text-black transition-opacity hover:opacity-50"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </motion.header>
  );
}

function SectionNav({ active }: { active: string }) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`sticky top-14 z-40 flex items-center justify-between border-y ${DIVIDER} bg-white px-6 py-4 md:px-16`}
    >
      <button
        type="button"
        onClick={() => scrollTo("overview")}
        className={`font-chakra-petch text-sm transition-colors md:text-base ${
          active === "overview"
            ? "text-black"
            : "text-black/40 hover:text-black/70"
        }`}
      >
        Overview
      </button>

      <div className="flex flex-wrap items-center justify-end gap-4 md:gap-10">
        {SECTIONS.filter((s) => s.align === "right").map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => scrollTo(s.id)}
            className={`font-chakra-petch text-sm transition-colors md:text-base ${
              active === s.id
                ? "text-black"
                : "text-black/40 hover:text-black/70"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-chakra-petch text-xl font-semibold text-black md:text-2xl">
      {children}
    </h2>
  );
}

function ApplyForm({ job }: { job: Job }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    resume: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    const already = localStorage.getItem(job.id);
    if (already) {
      startTransition(() => setIsSubmitted(true));
    }
  }, [job.id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadError(null);

    try {
      let resumeUrl = null;
      if (formData.resume) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", formData.resume);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to upload resume");
        }
        resumeUrl = data.url;
      }

      const userId = crypto.randomUUID();
      await setDoc(doc(db, "applications", userId), {
        id: userId,
        timestamp: Date.now(),
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        coverLetter: "",
        jobId: job.id,
        jobTitle: job.title,
        status: ApplicationStatus.PENDING,
        resumeUrl,
      } as JobApplication);

      localStorage.setItem(job.id, formData.firstName);
      setIsSubmitted(true);
    } catch {
      setUploadError("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center py-12 text-center"
      >
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-black/10">
          <CheckCircle2 className="h-7 w-7 text-asymmetri-red" />
        </div>
        <p className="font-chakra-petch text-lg font-semibold text-black">
          Application submitted
        </p>
        <p className="mt-2 max-w-sm font-chakra-petch text-sm text-black/50">
          Thanks for applying to {job.title}. We&apos;ll be in touch soon.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="firstName"
            className="font-chakra-petch text-sm text-black/60"
          >
            First name*
          </label>
          <input
            id="firstName"
            required
            value={formData.firstName}
            onChange={(e) =>
              setFormData((f) => ({ ...f, firstName: e.target.value }))
            }
            placeholder="John Doe"
            className="select-text w-full rounded-lg border border-black/15 bg-white px-4 py-3 font-chakra-petch text-sm text-black outline-none transition-colors placeholder:text-black/25 focus:border-black/40"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="lastName"
            className="font-chakra-petch text-sm text-black/60"
          >
            Last name*
          </label>
          <input
            id="lastName"
            required
            value={formData.lastName}
            onChange={(e) =>
              setFormData((f) => ({ ...f, lastName: e.target.value }))
            }
            placeholder="John Doe"
            className="select-text w-full rounded-lg border border-black/15 bg-white px-4 py-3 font-chakra-petch text-sm text-black outline-none transition-colors placeholder:text-black/25 focus:border-black/40"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="font-chakra-petch text-sm text-black/60"
          >
            Email*
          </label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData((f) => ({ ...f, email: e.target.value }))
            }
            placeholder="john@example.com"
            className="select-text w-full rounded-lg border border-black/15 bg-white px-4 py-3 font-chakra-petch text-sm text-black outline-none transition-colors placeholder:text-black/25 focus:border-black/40"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="phone"
            className="font-chakra-petch text-sm text-black/60"
          >
            Phone*
          </label>
          <input
            id="phone"
            required
            value={formData.phone}
            onChange={(e) =>
              setFormData((f) => ({ ...f, phone: e.target.value }))
            }
            placeholder="(123) 456-7890"
            className="select-text w-full rounded-lg border border-black/15 bg-white px-4 py-3 font-chakra-petch text-sm text-black outline-none transition-colors placeholder:text-black/25 focus:border-black/40"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="resume"
          className="font-chakra-petch text-sm text-black/60"
        >
          Resume*
        </label>
        <input
          id="resume"
          type="file"
          required
          accept=".pdf,.doc,.docx"
          onChange={(e) =>
            setFormData((f) => ({
              ...f,
              resume: e.target.files?.[0] ?? null,
            }))
          }
          className="select-text w-full font-chakra-petch text-sm text-black/60 file:mr-4 file:rounded-full file:border file:border-black/15 file:bg-white file:px-4 file:py-2 file:font-chakra-petch file:text-sm file:text-black"
        />
      </div>

      {uploadError && (
        <p className="font-chakra-petch text-sm text-asymmetri-red">
          {uploadError}
        </p>
      )}

      <div className="flex justify-center pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full border border-asymmetri-red px-10 py-2.5 font-chakra-petch text-sm text-asymmetri-red transition-colors hover:bg-asymmetri-red hover:text-white disabled:opacity-50"
        >
          {isSubmitting ? "Submitting…" : "Submit"}
        </button>
      </div>
    </form>
  );
}

export default function JobDetailView({ job }: { job: Job }) {
  const [activeSection, setActiveSection] = useState("overview");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const ids = ["overview", ...SECTIONS.map((s) => s.id)];
    const observers = ids.map((id) => {
      const el = sectionRefs.current[id];
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
      );
      observer.observe(el);
      return observer;
    });

    return () => {
      observers.forEach((o) => o?.disconnect());
    };
  }, []);

  const scrollToApply = () => {
    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
  };

  const whoYouAreItems =
    job.technicalRequirements.length > 0
      ? job.technicalRequirements
      : [
          "Create work that elevates interfaces, brands, and digital experiences.",
          "Collaborate with teams to bring ideas to life through craft and prototyping.",
          "Apply attention to detail to make a meaningful impact on every project.",
        ];

  return (
    <div className="min-h-screen bg-white text-black">
      <JobDetailNav />

      <main className="pt-14">
        {/* Hero */}
        <div className={`border-b ${DIVIDER}`}>
          <div className="flex flex-col items-start justify-between gap-8 px-6 py-10 md:flex-row md:items-end md:px-16 md:py-14">
            <motion.h1
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
              className="font-chakra-petch text-5xl font-bold uppercase leading-[0.95] tracking-tight md:text-7xl lg:text-[5.5rem]"
            >
              {job.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-col items-start gap-4 md:items-end"
            >
              <span className="font-chakra-petch text-lg font-semibold uppercase tracking-wide text-asymmetri-red md:text-2xl">
                {TEAM_TAGLINES[job.team]}
              </span>
              <button
                type="button"
                onClick={scrollToApply}
                className="rounded-full border border-black/20 px-6 py-2 font-chakra-petch text-sm text-black transition-colors hover:bg-black hover:text-white"
              >
                Apply
              </button>
            </motion.div>
          </div>
        </div>

        <SectionNav active={activeSection} />

        {/* Overview */}
        <section
          id="overview"
          ref={(el) => {
            sectionRefs.current.overview = el;
          }}
          className={`border-b ${DIVIDER}`}
        >
          <div className="grid grid-cols-1 gap-10 px-6 py-14 md:grid-cols-2 md:gap-16 md:px-16 md:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              <p className="font-chakra-petch text-2xl font-medium leading-snug text-black md:text-3xl lg:text-[2rem]">
                {job.description}
              </p>
              {job.full_description && (
                <p className="mt-8 font-chakra-petch text-base leading-relaxed text-black/60 md:text-lg">
                  {job.full_description.split("\n")[0]}
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="flex justify-center md:justify-end"
            >
              <img
                src="/flip.png"
                alt=""
                className="aspect-square w-full max-w-sm object-cover md:max-w-md"
              />
            </motion.div>
          </div>
        </section>

        {/* Who you are */}
        <section className={`border-b ${DIVIDER}`}>
          <div className="grid grid-cols-1 gap-8 px-6 py-14 md:grid-cols-[1fr_2fr] md:gap-16 md:px-16 md:py-20">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
            >
              <SectionHeading>Who you are</SectionHeading>
            </motion.div>
            <motion.ul
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="space-y-4 font-chakra-petch text-base leading-relaxed text-black/80 md:text-lg"
            >
              {whoYouAreItems.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                  {item}
                </li>
              ))}
            </motion.ul>
          </div>
        </section>

        {/* What you'll do */}
        <section
          id="what-youll-do"
          ref={(el) => {
            sectionRefs.current["what-youll-do"] = el;
          }}
          className={`border-b ${DIVIDER}`}
        >
          <div className="grid grid-cols-1 gap-8 px-6 py-14 md:grid-cols-[1fr_2fr] md:gap-16 md:px-16 md:py-20">
            <SectionHeading>What you&apos;ll do</SectionHeading>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="prose prose-neutral max-w-none font-chakra-petch text-base leading-relaxed text-black/70 [&_li]:text-black/70 [&_p]:text-black/70"
            >
              <Markdown>{job.full_description || job.description}</Markdown>
            </motion.div>
          </div>
        </section>

        {/* Location */}
        <section
          id="location"
          ref={(el) => {
            sectionRefs.current.location = el;
          }}
          className={`border-b ${DIVIDER}`}
        >
          <div className="grid grid-cols-1 gap-8 px-6 py-14 md:grid-cols-[1fr_2fr] md:gap-16 md:px-16 md:py-20">
            <SectionHeading>Location</SectionHeading>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="font-chakra-petch text-base lowercase text-black/70 md:text-lg"
            >
              wherever you want
            </motion.p>
          </div>
        </section>

        {/* Salary */}
        <section
          id="salary"
          ref={(el) => {
            sectionRefs.current.salary = el;
          }}
          className={`border-b ${DIVIDER}`}
        >
          <div className="grid grid-cols-1 gap-8 px-6 py-14 md:grid-cols-[1fr_2fr] md:gap-16 md:px-16 md:py-20">
            <SectionHeading>Salary</SectionHeading>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="font-chakra-petch text-base text-black/70 md:text-lg"
            >
              {job.payRange}
            </motion.p>
          </div>
        </section>

        {/* Perks */}
        <section
          id="perks"
          ref={(el) => {
            sectionRefs.current.perks = el;
          }}
          className={`border-b ${DIVIDER}`}
        >
          <div className="grid grid-cols-1 gap-8 px-6 py-14 md:grid-cols-[1fr_2fr] md:gap-16 md:px-16 md:py-20">
            <SectionHeading>Perks</SectionHeading>
            <motion.ul
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="space-y-3 font-chakra-petch text-base text-black/70 md:text-lg"
            >
              {PERKS.map((perk) => (
                <li key={perk} className="flex gap-3">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-asymmetri-red" />
                  {perk}
                </li>
              ))}
            </motion.ul>
          </div>
        </section>

        {/* Apply */}
        <section
          id="apply"
          ref={(el) => {
            sectionRefs.current.apply = el;
          }}
        >
          <div className="grid grid-cols-1 gap-10 px-6 py-14 md:grid-cols-2 md:gap-16 md:px-16 md:py-20">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
            >
              <p className="font-chakra-petch text-2xl font-medium leading-snug text-black md:text-3xl">
                Apply and become a part of a super cool team of dreamers and
                doers.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.08 }}
            >
              <ApplyForm job={job} />
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
