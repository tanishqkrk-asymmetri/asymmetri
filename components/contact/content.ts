/**
 * Contact page copy. Single source of truth for /contact-us, its structured
 * data (JSON-LD) and /llms.txt.
 */

import { company, maturityPath, processSteps } from "@/lib/site-content";
import { practices } from "@/lib/practices";

export const contactDefinition =
  "To contact Asymmetri, email info@asymmetri.in or send a brief through the form at asymmetri.in/contact-us. Asymmetri is based in Kerala, India and works with global brands worldwide. New projects start with a framing conversation, followed by a proposal for a prototype or pilot.";

export const contactSeo = {
  title: "Contact Asymmetri: Start an AI, Product or R&D Project",
  description:
    "Contact Asymmetri to start an AI agents, application development, technology consulting or R&D project. Email info@asymmetri.in or send a short brief and the team will come back with next steps.",
  social: "Contact Asymmetri: bring us the hard problem",
  keywords: [
    "contact Asymmetri",
    "hire AI development company",
    "AI agents development company contact",
    "start an AI project",
    "software development company Kerala",
    "technology consulting enquiry",
  ],
};

/**
 * Direct details.
 * NOTE: the phone number came from the previous page and looks one digit
 * short for an Indian number. Confirm it before relying on it; it is left out
 * of structured data until then.
 */
export const contactDetails = {
  email: company.email,
  phone: { display: "+91 737283844", href: "tel:+91737283844" },
  location: "Kerala, India",
  timeZone: "Asia/Kolkata",
  timeZoneLabel: "IST",
  /** Add real profile URLs here; entries without an href are not rendered. */
  socials: [
    { label: "LinkedIn", href: "" },
    { label: "Instagram", href: "" },
    { label: "Threads", href: "" },
  ],
  founderSite: "https://www.nandagopalp.com",
};

export const contactHero = {
  kicker: "Contact Asymmetri",
  titleLines: ["Bring us the", ["hard problem."]] as (string | [string])[],
  lede: "Tell us what's hard. We'll find the asymmetric answer.",
  body: "A few lines about the problem are enough to start. The more you share, the sharper our first reply.",
};

export const intents = [
  { id: "project", label: "A hard problem", hint: "A new project or product" },
  { id: "partnership", label: "Partnership", hint: "Build or go to market together" },
  { id: "careers", label: "Careers", hint: "Joining the crew? Start at Careers & Culture" },
  { id: "press", label: "Press", hint: "Interviews, talks and features" },
  { id: "other", label: "Something else", hint: "Surprise us" },
] as const;

export type IntentId = (typeof intents)[number]["id"];

export const practiceOptions = [
  ...practices.map((p) => ({ id: p.slug, label: p.short })),
  { id: "not-sure", label: "Not sure yet" },
];

/** Where the work stands today. Mirrors the home page maturity path. */
export const stageOptions = maturityPath.slice(0, 4);

export const formCopy = {
  kicker: "The brief",
  intentLabel: "What are you bringing?",
  practiceLabel: "Which practice? (optional)",
  stageLabel: "Where is it today? (optional)",
  name: "Your name",
  email: "Work email",
  company: "Company (optional)",
  message: "What's the hard problem?",
  messagePlaceholder: "What are you trying to make happen, and what's in the way?",
  submit: "Send the brief",
  sending: "Transmitting…",
  privacy: "We only use your details to reply. No newsletters, no spam.",
  signalLabels: ["Noise", "Static", "Signal", "Clear"],
  successTitle: "Signal received.",
  successBody: (name: string, email: string) =>
    `Thanks${name ? `, ${name.split(" ")[0]}` : ""}. Someone from the team will get back to you at ${email || "your email"}.`,
  errorBody:
    "Something blocked the transmission. Your email app should open with the brief filled in; if it doesn't, write to us directly.",
};

export const nextSteps = {
  kicker: "What happens next",
  titleLines: ["From first note", ["to first build."]] as (string | [string])[],
  steps: [
    {
      title: "You send the brief",
      body: "A few lines on the problem, the stakes and the timeline. No deck, no RFP required.",
    },
    {
      title: "It lands with the team",
      body: "Your note goes to the people who would build the answer, not into a ticket queue.",
    },
    {
      title: "A framing conversation",
      body: "We find where AI or new technology creates real operating leverage, and where it doesn't.",
    },
    {
      title: "A proposal",
      body: "A clear plan for a prototype or pilot: scope, team, timeline and what success looks like.",
    },
  ],
  loopIntro: "From there, every engagement runs one loop.",
  loop: processSteps,
};

export const channels = {
  kicker: "Other ways in",
  titleLines: ["Pick a", ["channel."]] as (string | [string])[],
};

export const practicesFit = {
  kicker: "Not sure where it fits?",
  titleLines: ["Four practices.", ["One accountable team."]] as (string | [string])[],
  body: "Most hard problems cross more than one. Start wherever feels closest; we'll route it.",
};

/** Visible on the page and mirrored in FAQPage structured data. */
export const contactFaqs = [
  {
    q: "How do I contact Asymmetri?",
    a: "Email info@asymmetri.in or send a brief through the form at asymmetri.in/contact-us. Include the problem you want solved, your timeline and how to reach you.",
  },
  {
    q: "What should I include in my first message to Asymmetri?",
    a: "A few lines are enough: what you are trying to achieve, what is in the way, where the work stands today (opportunity, prototype, pilot or production) and any deadline. No deck or formal RFP is needed to start.",
  },
  {
    q: "What happens after I contact Asymmetri?",
    a: "The team reads your note and replies to set up a framing conversation, which finds where AI or new technology creates real operating leverage. That is followed by a proposal for a prototype or pilot, then delivery through one loop: Frame, Design, Engineer, Prove and Operate.",
  },
  {
    q: "Does Asymmetri work with companies outside India?",
    a: "Yes. Asymmetri is based in Kerala, India and works with global brands worldwide, collaborating remotely and asynchronously across time zones.",
  },
  {
    q: "What kinds of projects does Asymmetri take on?",
    a: "Hard problems across four practices: AI agentic systems and data, application development, technology consulting, and innovation and R&D, in domains such as commerce and finance, health and wellbeing, media, logistics and connected environments.",
  },
  {
    q: "How do I apply for a job at Asymmetri?",
    a: "Job applications go through the careers page rather than the contact form. Open roles are listed at asymmetri.in/careers/positions, and each role page has its own application form.",
  },
];

export const emailBand = {
  kicker: "Prefer email? So do we.",
  copied: "Copied to clipboard",
  copy: "Click to copy",
};
