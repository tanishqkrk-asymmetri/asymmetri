"use client";

import { FormEvent, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ChevronDown, MapPin } from "lucide-react";
import Link from "next/link";
import { T } from "@/components/Text";
import LS from "@/components/LS";
import { Navbar } from "@/components/shared/navbar";

const PURPOSES = [
  "Partnership enquiry",
  "Project enquiry",
  "Careers",
  "Press",
  "Other",
] as const;

function ParallaxImage({
  src,
  alt,
  y,
  className,
}: {
  src: string;
  alt: string;
  y: MotionValue<number>;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y }}
        className="absolute inset-x-0 -top-[18%] h-[136%] w-full object-cover will-change-transform"
      />
    </div>
  );
}

function Field({
  label,
  id,
  type = "text",
  value,
  onChange,
  delay = 0,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  delay?: number;
}) {
  return (
    <T delay={delay} className="w-full">
      <label
        htmlFor={id}
        className="mb-2 block font-chakra-petch text-sm text-black/70"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full select-text border-0 border-b border-black/25 bg-transparent pb-2 font-chakra-petch text-base text-black outline-none transition-colors focus:border-asymmetri-red"
      />
    </T>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function ThreadsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M19.5 8.5c-.4-2.4-2.2-4-5.1-4-3.6 0-5.9 2.3-5.9 5.9 0 4.1 2.4 6.1 6.4 6.1 2.4 0 4.3-.8 5.5-2.1" />
      <path d="M8.5 12.3c0-4.1 2.1-7.3 6.2-7.3 2.6 0 4.3 1.4 4.8 3.6" />
      <path d="M9.2 14.8c1.1 1.6 2.9 2.5 5.2 2.5 3.3 0 5.1-1.7 5.1-4.3 0-2.3-1.5-3.5-4.4-3.9l-1.7-.2c-1.3-.2-1.9-.6-1.9-1.4 0-.9.8-1.5 2-1.5 1.3 0 2.1.6 2.3 1.5" />
    </svg>
  );
}

export default function ContactUsPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ["start start", "end end"],
  });

  const personY = useTransform(scrollYProgress, [0, 1], [40, -90]);
  const locationY = useTransform(scrollYProgress, [0, 1], [20, -60]);
  const socialY = useTransform(scrollYProgress, [0, 1], [50, -110]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contactName, setContactName] = useState("");
  const [purpose, setPurpose] = useState<(typeof PURPOSES)[number]>(
    "Partnership enquiry",
  );
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-white text-black font-chakra-petch"
    >
      <LS></LS>
      <Navbar pageScroll={scrollYProgress}></Navbar>
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        {/* Header row: empty left rail + title in main */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(200px,26%)_1fr]">
          <div className="hidden border-r border-black/15 lg:block" />
          <header className="space-y-5 px-0 pb-10 pt-16 text-center sm:pt-20 lg:px-12 lg:pb-14 lg:pt-24">
            <T delay={0.05}>
              <h1 className="text-4xl font-semibold tracking-wide uppercase sm:text-5xl lg:text-6xl xl:text-7xl">
                Contact Us
              </h1>
            </T>
            <T delay={0.15}>
              <p className="mx-auto max-w-md text-sm leading-relaxed text-black/65 sm:text-base">
                Have a question or project in mind? Get in touch with Asymmetri.
                We&apos;re here to help and ready to collaborate.
              </p>
            </T>
          </header>
        </div>

        {/* Info grid: Contact | Location | Social — images aligned */}
        <div className="grid grid-cols-1 border-t border-black/15 sm:grid-cols-2 lg:grid-cols-[minmax(200px,26%)_1fr_1fr]">
          {/* Contact column */}
          <div className="space-y-4 border-black/15 py-8 sm:border-r lg:pr-8 lg:py-10">
            <T delay={0.05}>
              <ParallaxImage
                src="/contact/person.png"
                alt="Asymmetri"
                y={personY}
                className="aspect-square w-full"
              />
            </T>
            <div className="space-y-2">
              <T delay={0.12}>
                <p className="text-sm font-medium text-black">Contact</p>
              </T>
              <T delay={0.18}>
                <a
                  href="tel:+91737283844"
                  className="block text-sm text-black/80 transition-opacity hover:opacity-60"
                >
                  +91 737283844
                </a>
              </T>
              <T delay={0.24}>
                <a
                  href="mailto:info@asymmetri.com"
                  className="block text-sm text-black/80 transition-opacity hover:opacity-60"
                >
                  info@asymmetri.com
                </a>
              </T>
            </div>
          </div>

          {/* Location column */}
          <div className="space-y-4 border-black/15 py-8 sm:pl-6 lg:border-r lg:px-8 lg:py-10">
            <T delay={0.1}>
              <ParallaxImage
                src="/contact/location.png"
                alt="Location"
                y={locationY}
                className="aspect-[16/10] w-full"
              />
            </T>
            <div className="space-y-2">
              <T delay={0.18}>
                <p className="text-sm font-medium text-black">Location</p>
              </T>
              <T delay={0.24}>
                <p className="flex items-center gap-2 text-sm text-black/80">
                  <MapPin className="size-3.5 shrink-0" strokeWidth={1.75} />
                  Kerala, kerala
                </p>
              </T>
            </div>
          </div>

          {/* Social column */}
          <div className="space-y-4 py-8 sm:col-span-2 sm:pl-6 lg:col-span-1 lg:pl-8 lg:py-10">
            <T delay={0.16}>
              <ParallaxImage
                src="/contact/social.png"
                alt="Social media"
                y={socialY}
                className="aspect-[16/10] w-full"
              />
            </T>
            <div className="space-y-2">
              <T delay={0.22}>
                <p className="text-sm font-medium text-black">Social media</p>
              </T>
              <ul className="space-y-1.5">
                <T delay={0.28}>
                  <li>
                    <a
                      href="https://www.linkedin.com"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-black/80 transition-opacity hover:opacity-60"
                    >
                      <LinkedInIcon className="size-3.5" />
                      LinkedIn
                    </a>
                  </li>
                </T>
                <T delay={0.34}>
                  <li>
                    <a
                      href="https://www.instagram.com"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-black/80 transition-opacity hover:opacity-60"
                    >
                      <InstagramIcon className="size-3.5" />
                      Instagram
                    </a>
                  </li>
                </T>
                <T delay={0.4}>
                  <li>
                    <a
                      href="https://www.threads.net"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-black/80 transition-opacity hover:opacity-60"
                    >
                      <ThreadsIcon className="size-3.5" />
                      Thread
                    </a>
                  </li>
                </T>
              </ul>
            </div>
          </div>
        </div>

        {/* Form row: [Contact] blurb | form */}
        <div className="grid grid-cols-1 border-t border-black/15 lg:grid-cols-[minmax(200px,26%)_1fr]">
          <aside className="space-y-4 border-black/15 py-10 lg:border-r lg:pr-8 lg:py-12">
            <T delay={0.1}>
              <p className="text-sm font-medium text-black">[Contact]</p>
            </T>
            <T delay={0.18}>
              <p className="max-w-[16rem] text-sm leading-relaxed text-black/70">
                Have a project in mind or a question for us? Fill out the form
                below and our team will get back to you as soon as possible.
              </p>
            </T>
          </aside>

          <form
            onSubmit={onSubmit}
            className="space-y-8 py-10 lg:px-12 lg:py-12"
          >
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <Field
                label="First name"
                id="firstName"
                value={firstName}
                onChange={setFirstName}
                delay={0.05}
              />
              <Field
                label="Last name"
                id="lastName"
                value={lastName}
                onChange={setLastName}
                delay={0.1}
              />
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <Field
                label="Email ID"
                id="email"
                type="email"
                value={email}
                onChange={setEmail}
                delay={0.12}
              />
              <Field
                label="Contact name"
                id="contactName"
                value={contactName}
                onChange={setContactName}
                delay={0.16}
              />
            </div>

            <T delay={0.18} className="w-full">
              <label
                htmlFor="purpose"
                className="mb-2 block font-chakra-petch text-sm text-black/70"
              >
                Purpose
              </label>
              <div className="relative">
                <select
                  id="purpose"
                  name="purpose"
                  value={purpose}
                  onChange={(e) =>
                    setPurpose(e.target.value as (typeof PURPOSES)[number])
                  }
                  className="w-full cursor-pointer appearance-none border-0 border-b border-black/25 bg-transparent pb-2 pr-8 font-chakra-petch text-base text-black outline-none transition-colors focus:border-asymmetri-red"
                >
                  {PURPOSES.map((p) => (
                    <option key={p} value={p} className="bg-white text-black">
                      {p}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-0 bottom-2.5 size-4 text-black/50"
                  strokeWidth={1.5}
                />
              </div>
            </T>

            <T delay={0.22} className="w-full">
              <label
                htmlFor="message"
                className="mb-2 block font-chakra-petch text-sm text-black/70"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full resize-none select-text border-0 border-b border-black/25 bg-transparent pb-2 font-chakra-petch text-base text-black outline-none transition-colors focus:border-asymmetri-red"
              />
            </T>

            <T delay={0.28} className="w-full pt-2">
              <button
                type="submit"
                className="w-full cursor-pointer bg-asymmetri-red px-6 py-3.5 text-center font-chakra-petch text-sm font-semibold tracking-wide text-white uppercase transition-opacity hover:opacity-90"
              >
                {sent ? "Message sent" : "Submit"}
              </button>
            </T>
          </form>
        </div>

        <div className="border-t border-black/10 py-6">
          <Link
            href="/"
            className="text-xs tracking-wide text-black/40 transition-opacity hover:opacity-70"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
