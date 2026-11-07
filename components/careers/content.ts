/**
 * Careers & Culture copy. Single source of truth for the /careers page, its
 * structured data (JSON-LD) and /llms.txt, so visitors, search engines and AI
 * assistants all read the same facts.
 *
 * Culture facts come from the Asymmetri onboarding document. Do not add perks,
 * policies or numbers here that the company does not actually offer.
 */

import { sdlcTools } from "@/lib/site-content";

/** Answer-first summary: meta description, entity summary and llms.txt. */
export const careersDefinition =
  "Asymmetri is a remote-first, async-first technology company based in Kerala, India. Its flat team of engineers, designers and applied AI specialists solves hard problems for global brands across four practices: AI agentic systems and data, application development, technology consulting, and innovation and R&D.";

export const careersSeo = {
  title: "Careers & Culture: Remote Jobs in AI, Engineering and Design",
  description:
    "Join Asymmetri, a remote-first, async-first hard problems technology company. Build AI agents, products and R&D for global brands with a flat crew of engineers, designers and applied AI specialists.",
  social: "Careers & Culture at Asymmetri: a culture of brilliant misfits",
  keywords: [
    "Asymmetri careers",
    "Asymmetri jobs",
    "remote AI jobs",
    "remote software engineer jobs India",
    "applied AI engineer jobs",
    "product designer jobs remote",
    "AI startup jobs Kerala",
    "async-first company culture",
    "flat organisation",
  ],
};

export const hero = {
  kicker: "Careers & Culture",
  /** H1 display lines. Wrap a line in an array to colour it red. */
  titleLines: ["A culture of", "brilliant", ["misfits."]] as (string | [string])[],
  lede: "We take the work seriously and ourselves a lot less.",
  body: "A small crew of engineers, designers and applied AI specialists who would rather pull a hard problem apart than polish a template. Async by default, flat by design, and usually juggling three projects across different domains.",
  status: [
    { k: "Mode", v: "Remote · Async-first" },
    { k: "Hierarchy", v: "Flat. Ownership, not bosses" },
    { k: "Ritual", v: "One standup, every Monday" },
  ],
  primaryCta: { label: "See open roles", href: "#open-roles" },
  secondaryCta: { label: "Read the culture code", href: "#culture-code" },
};

/** From the founder's onboarding note. Keep it close to his words. */
export const founderNote = {
  kicker: "A note from the founder",
  titleLines: ["You're not a cog", "in the machine.", ["You're crew."]] as (string | [string])[],
  paragraphs: [
    "We're not here to build just another company. We're here to make a place where smart, curious people do work they're proud of, and have a damn good time doing it.",
    "So dive in. Ask questions, all of them; none are stupid here. Test things until they break. Share your ideas. Help each other out. And let's build some seriously cool stuff together.",
  ],
  name: "Nandagopal P",
  role: "Founder & CEO, Asymmetri",
  photo: "/nand.jpg",
  photoAlt: "Nandagopal P, founder and CEO of Asymmetri",
  site: "https://www.nandagopalp.com",
};

/** The anti-pitch. The struck word is the turn of the section. */
export const antiPitch = {
  kicker: "Fair warning",
  lineBefore: "You",
  struck: "don't",
  lineAfter: "want to work for Asymmetri.",
  body: "If you want tidy workflows, a quiet desk and someone telling you what to do next, a team that works across domains will drive you up the wall. We'd rather say so now.",
  symmetricLabel: "Symmetric",
  asymmetricLabel: "Asymmetric",
  symmetric: [
    "Tidy, streamlined processes",
    "One stack, one domain, forever",
    "Waiting your turn to have an opinion",
    "Polishing until it's perfect",
    "A manager who decides for you",
  ],
  asymmetric: [
    "Everything is figureoutable",
    "Three projects, different domains, same week",
    "Real, independent input into what you make",
    "Fail faster, succeed sooner",
    "Close to the founders, no layers in between",
  ],
  resolve: "Still here? Then you're exactly where you're supposed to be.",
};

export type CultureGlyph =
  | "flat"
  | "loop"
  | "async"
  | "ship"
  | "fork"
  | "signal"
  | "untangle"
  | "burst";

export const cultureCode = {
  kicker: "How we behave",
  titleLines: ["The culture", ["code."]] as (string | [string])[],
  intro:
    "Eight rules we actually use. Not posters on a wall: the way decisions get made on an ordinary Tuesday.",
  rules: [
    {
      title: "Flat by design.",
      body: "No bosses, just ownership. Everyone's voice counts, including yours in week one.",
      glyph: "flat",
    },
    {
      title: "Feedback is fuel.",
      body: "Direct but kind. Give it, get it, use it to get better. It's never personal; it's how we grow.",
      glyph: "loop",
    },
    {
      title: "Async-first.",
      body: "We work across time zones and schedules. Write it down, say it clearly, and nobody waits on a meeting.",
      glyph: "async",
    },
    {
      title: "Done ≠ perfect.",
      body: "Push early, iterate fast. Shipped and improving beats perfect and imaginary.",
      glyph: "ship",
    },
    {
      title: "Decisions over indecision.",
      body: "We'd rather you try, learn and adjust than stay stuck. A call made today beats a perfect one made next month.",
      glyph: "fork",
    },
    {
      title: "Need help? Ask.",
      body: "No one expects you to know it all. Hitting friction? Loop people in early. Ask early, ask often.",
      glyph: "signal",
    },
    {
      title: "Everything is figureoutable.",
      body: "New domain, unfamiliar stack, no template. We pull the problem apart until the answer shows itself.",
      glyph: "untangle",
    },
    {
      title: "Celebrate everything.",
      body: "Big wins and small ones. A win is a win, and we say so out loud.",
      glyph: "burst",
    },
  ] as { title: string; body: string; glyph: CultureGlyph }[],
};

export const rhythm = {
  kicker: "How a week works",
  titleLines: ["Output over", ["face time."]] as (string | [string])[],
  intro:
    "No strict nine-to-five. Work when and where you work best, as long as you hit your timelines and keep the team in the loop.",
  items: [
    {
      k: "Working hours",
      title: "Flexible.",
      body: "What matters is output, not hours online. Tell us your plans and we'll work around them.",
    },
    {
      k: "Meetings",
      title: "Fewer, faster, purposeful.",
      body: "If it can be a message, it stays async.",
    },
    {
      k: "Non-negotiable",
      title: "Monday standup.",
      body: "Every Monday we align on what's on everyone's plate for the week. That's the one fixed point.",
    },
    {
      k: "Feedback",
      title: "Direct but kind.",
      body: "In the open, as the work happens. Not saved up for a review cycle.",
    },
  ],
  /** Labels for the week graphic. */
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  standupLabel: "Standup · the one fixed point",
};

export const range = {
  kicker: "The work",
  titleLines: ["No two weeks", ["look alike."]] as (string | [string])[],
  body: "You'll rarely sit on one thing. Most of the crew juggles at least three projects across different domains at any given time: an agent runtime one day, a mobile release the next, an R&D prototype by Friday.",
  stats: [
    { n: 4, suffix: "", label: "Practices to work across" },
    { n: 5, suffix: "", label: "Industry domains" },
    { n: 3, suffix: "+", label: "Projects in flight, per person" },
    { n: 1, suffix: "", label: "Standup a week" },
  ],
};

export const perks = {
  kicker: "What you get",
  titleLines: ["Built so you can", ["do your best work."]] as (string | [string])[],
  aside: "No ping-pong table. No free-snacks pitch. Just the conditions good work needs.",
  items: [
    {
      title: "Remote, for real",
      body: "Work from anywhere. The crew is spread across time zones and the work is built for it.",
    },
    {
      title: "Your hours",
      body: "No nine-to-five. Hit your timelines, keep people in the loop, and the rest is yours.",
    },
    {
      title: "No micromanagement",
      body: "We hired you for your judgment. We don't second-guess it, and we don't send weird late-night messages.",
    },
    {
      title: "No layers",
      body: "Work directly with the founders and the people who use what you build. It ships and gets judged on whether it holds up.",
    },
    {
      title: "AI-native tooling",
      body: `${sdlcTools.slice(0, 3).join(", ")} and friends are part of how we ship, so your time goes on judgment, not boilerplate.`,
    },
    {
      title: "Range that keeps you sharp",
      body: "A new domain, a new stack, a new problem before the last one goes stale. There's nothing here to coast on.",
    },
  ],
};

export const disciplines = {
  kicker: "Who we hire",
  title: "We hire for judgment and range, not job titles.",
};

export const firstWeek = {
  kicker: "Day one",
  titleLines: ["Your first", ["week."]] as (string | [string])[],
  intro: "No maze, no forty-page manual. Here's day one.",
  checklist: [
    "Join the team chat and say hello",
    "Accept the calendar invites for your intro calls",
    "Get onto the task board and see every project in flight",
    "Meet your onboarding buddy on a video call",
    "Set up your tools: dev, design, whatever you need",
  ],
  finalNote: "We move fast, but we don't expect you to know everything. Ask early, ask often.",
  signOff: ["Have fun.", "Learn.", "Collaborate."],
};

export const openRoles = {
  kicker: "Open roles",
  titleLines: ["Find your", ["seat."]] as (string | [string])[],
  intro: "Every role is remote. Pick one, read it properly, and apply from the role page.",
  allRolesHref: "/careers/positions",
  emptyTitle: "Nothing open that fits?",
  emptyBody:
    "Misfits rarely fit a listing anyway. Write to us with what you'd build here and why it matters.",
};

/** Visible on the page and mirrored in FAQPage structured data. Self-contained answers. */
export const careersFaqs = [
  {
    q: "What is it like to work at Asymmetri?",
    a: "Asymmetri is flat, remote and async-first. There are no bosses, just ownership; feedback is direct but kind; meetings are few and purposeful, with one standup every Monday. Most people work on at least three projects across different domains at once, close to the founders and with real input into what gets built.",
  },
  {
    q: "Is Asymmetri a remote company?",
    a: "Yes. Asymmetri is remote-first and async-first, and the team works across time zones and schedules. Hours are flexible: what matters is output, not face time, as long as timelines are met and the team stays in the loop.",
  },
  {
    q: "What roles does Asymmetri hire for?",
    a: "Asymmetri hires across engineering, design, applied AI and data, operations and QA, and growth. Open positions, including full-time, part-time and internship roles, are listed at asymmetri.in/careers/positions.",
  },
  {
    q: "How do I apply for a job at Asymmetri?",
    a: "Choose a role on the open positions page at asymmetri.in/careers/positions and apply with the form on that role's page, including your resume. If nothing fits, email info@asymmetri.in with what you would build at Asymmetri.",
  },
  {
    q: "What kind of work will I do at Asymmetri?",
    a: "Work spans Asymmetri's four practices: AI agentic systems and data, application development, technology consulting, and innovation and R&D. Projects run across domains such as commerce and finance, health, media, logistics and connected environments, so expect agents, products, platforms and prototypes for global brands.",
  },
  {
    q: "What tools does the Asymmetri team use?",
    a: `The team works AI-native. AI-assisted tools such as ${sdlcTools.slice(0, 5).join(", ")} sit alongside continuous delivery, so engineers and designers spend their time on judgment rather than boilerplate.`,
  },
  {
    q: "What happens in my first week at Asymmetri?",
    a: "On day one you join the team chat, accept calendar invites for intro calls, get access to the task board, meet your onboarding buddy on a video call and set up your tools. Nobody expects you to know everything: the rule is ask early, ask often.",
  },
];

export const careersClosing = {
  kicker: "Misfits welcome",
  lines: ["Don't fit the", "template?", ["Good."]] as (string | [string])[],
  sub: "Neither do we.",
  primary: { label: "See open roles", href: "#open-roles" },
  secondary: { label: "Say hello", href: "/contact-us" },
};
