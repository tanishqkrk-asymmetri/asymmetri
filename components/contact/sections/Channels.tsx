"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { useReduceMotion } from "@/hooks/useReduceMotion";
import { SectionHead } from "@/components/practice/SectionHead";
import { useCopy, useZoneClock } from "../hooks";
import { channels, contactDetails } from "../content";

const EASE = [0.16, 1, 0.3, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

type Card = {
  key: string;
  label: string;
  value: ReactNode;
  note: ReactNode;
  href: string;
  external?: boolean;
  extra?: ReactNode;
};

function CardShell({ card, i }: { card: Card; i: number }) {
  const reduce = useReduceMotion();
  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: EASE }}
      className="group relative min-w-0 bg-black"
    >
      {/* Red sweep on hover: the slash angle, left to right. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-asymmetri-red transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-focus-within:scale-x-100 group-hover:scale-x-100"
      />
      <div className="relative flex h-full min-h-[15rem] flex-col justify-between gap-10 p-6 md:p-8">
        <div className="flex items-start justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.25em]">
          <span className="text-asymmetri-red transition-colors group-hover:text-white">CH.{pad(i + 1)}</span>
          <span className="text-white/50 transition-colors group-hover:text-white">{card.label}</span>
        </div>
        <div className="space-y-3">
          <a
            href={card.href}
            {...(card.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="kit-glitch block font-chakra-petch text-2xl leading-tight font-bold break-words uppercase outline-none after:absolute after:inset-0 after:content-[''] md:text-3xl"
          >
            {card.value}
            <span aria-hidden className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
              ↗
            </span>
          </a>
          <div className="font-geist text-sm leading-relaxed text-white/60 transition-colors group-hover:text-white/90">
            {card.note}
          </div>
          {card.extra && <div className="relative z-10">{card.extra}</div>}
        </div>
      </div>
    </motion.li>
  );
}

/** Direct ways in, one card per channel. */
export function Channels() {
  const clock = useZoneClock(contactDetails.timeZone, false);
  const { copied, copy } = useCopy(contactDetails.email);
  const socials = contactDetails.socials.filter((s) => s.href);

  const cards: Card[] = [
    {
      key: "email",
      label: "New projects",
      value: <span className="normal-case">{contactDetails.email}</span>,
      note: "Briefs, partnerships, press. One inbox, read by the team.",
      href: `mailto:${contactDetails.email}`,
      extra: (
        <button
          type="button"
          onClick={copy}
          className="cursor-pointer border border-white/30 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/80 transition-colors hover:border-white hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <span aria-live="polite">{copied ? "Copied ✓" : "Copy address"}</span>
        </button>
      ),
    },
    {
      key: "careers",
      label: "Careers",
      value: "Join the crew",
      note: "Applications go through open roles. Start at Careers & Culture.",
      href: "/careers",
    },
    {
      key: "phone",
      label: "Phone",
      value: contactDetails.phone.display,
      note: "For things that can't wait for an email.",
      href: contactDetails.phone.href,
    },
    {
      key: "studio",
      label: "Studio",
      value: contactDetails.location,
      note: (
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>It&apos;s</span>
          <span className="font-mono text-white tabular-nums">{clock}</span>
          <span>here · {contactDetails.timeZoneLabel}, UTC+5:30. We work across time zones.</span>
        </span>
      ),
      href: "https://www.google.com/maps/search/?api=1&query=Kerala%2C+India",
      external: true,
    },
    {
      key: "founder",
      label: "Founder",
      value: "Nandagopal P",
      note: "Founder & CEO. Writing, talks and the thinking behind Asymmetri.",
      href: contactDetails.founderSite,
      external: true,
    },
    ...socials.map((s) => ({
      key: s.label,
      label: "Social",
      value: s.label,
      note: `Asymmetri on ${s.label}.`,
      href: s.href,
      external: true,
    })),
  ];

  return (
    <section
      data-chapter="Channels"
      data-nav="dark"
      aria-labelledby="contact-channels"
      className="heroDark relative bg-black px-6 py-28 text-white md:px-16 md:py-36"
    >
      <div id="contact-channels">
        <SectionHead
          kicker={channels.kicker}
          title={channels.titleLines}
          body="Same team behind every line. Use whichever one you'd actually answer yourself."
        />
      </div>
      <ul className="mt-16 grid grid-cols-1 gap-px border border-white/15 bg-white/15 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c, i) => (
          <CardShell key={c.key} card={c} i={i} />
        ))}
        {/* Fill the last row so the grid stays a clean block. */}
        {cards.length % 3 !== 0 && (
          <li
            className="group relative hidden min-h-[15rem] overflow-hidden bg-black lg:block"
            style={{ gridColumn: `span ${3 - (cards.length % 3)}` }}
          >
            <a href="#brief" className="absolute inset-0 flex flex-col justify-between p-8 outline-none focus-visible:bg-white/5">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 transition-colors group-hover:text-white">
                Or send the brief ↑
              </span>
              <span
                aria-hidden
                className="kit-outline absolute -right-2 -bottom-12 font-chakra-petch text-[11rem] leading-none font-bold transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] select-none group-hover:-translate-y-3"
              >
                ↑
              </span>
            </a>
          </li>
        )}
      </ul>
    </section>
  );
}
