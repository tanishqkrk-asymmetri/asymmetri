// Page copy for this practice. Server-safe (no "use client"): page.tsx reads
// the FAQ from here for JSON-LD.
import type { FaqItem } from "@/components/practice/PracticeFaq";

export const manifesto =
  "Most hard problems are not *technology* problems. Not until someone *frames* them. Then we find the *leverage*, architect the system and stay until it *runs*.";

/* ---------- Scene: the brief, interrogated ---------- */

export const brief = "We need AI.";

export const questions = [
  "For which decision, exactly?",
  "Who does this work today, and what does it cost them?",
  "What happens when it is wrong?",
  "What data exists, and who owns it?",
  "How will we know it worked?",
];

export const assumptions = [
  "A chatbot is the product",
  "We need our own model",
  "The data is ready",
  "This is an IT project",
];

export const reframe =
  "Cut claims triage from days to hours, with a person approving every payout above a set threshold.";

export const reframeSpec = [
  { k: "Metric", v: "Median time to triage" },
  { k: "Baseline", v: "Measured in week one" },
  { k: "Guardrail", v: "Human approval above threshold" },
  { k: "Owner", v: "Claims operations lead" },
];

/* ---------- Capabilities: the drawing set ---------- */

export type Capability = {
  name: string;
  body: string;
  deliverables: string[];
  signal: string;
};

export const capabilityDetail: Capability[] = [
  {
    name: "Problem framing and discovery",
    body: "We turn a vague ambition into a problem worth solving: a decision, workflow or experience with an owner, a baseline and a measurable outcome.",
    deliverables: [
      "Stakeholder and workflow interviews",
      "Opportunity map and problem statement",
      "Success metrics and a measured baseline",
      "A discovery prototype where it settles the question",
    ],
    signal: "Everyone agrees something must change. Nobody agrees on what.",
  },
  {
    name: "AI strategy and readiness",
    body: "Where AI earns its place in your operation, and what has to be true first: data, platform, people and governance. AI-native from the first workshop.",
    deliverables: [
      "Use-case portfolio ranked by value and feasibility",
      "Data and platform readiness assessment",
      "Model, vendor and inference cost options",
      "Governance, risk and evaluation approach",
    ],
    signal: "The board wants an AI plan. The pilots so far have not changed a number.",
  },
  {
    name: "System architecture",
    body: "Target architectures that survive contact with production. Integration, data, security and AI components designed as one system, by people who will happily build it.",
    deliverables: [
      "C4 views from context to component",
      "Architecture decision records",
      "Integration and data flow design",
      "Targets for scale, latency, resilience and cost",
    ],
    signal: "Every new feature touches five systems and breaks two.",
  },
  {
    name: "Technical due diligence",
    body: "An independent read of a codebase, platform or team, for investors, acquirers and leaders who need the truth before they commit.",
    deliverables: [
      "Code and architecture review",
      "Security, dependency and scalability risk",
      "Delivery, team and process assessment",
      "Findings ranked by severity and cost to fix",
    ],
    signal: "You are about to sign, and the demo is all you have seen.",
  },
  {
    name: "Fractional technical leadership",
    body: "A senior architect or CTO embedded part-time: setting direction, making the calls and building the team that takes over.",
    deliverables: [
      "Technical strategy and roadmap",
      "Hiring plan and interview loop",
      "Vendor and partner oversight",
      "Engineering standards and rituals",
    ],
    signal: "You need senior technical judgement now, before you can hire for it.",
  },
  {
    name: "Delivery recovery",
    body: "When a programme is slipping, we find out why, reset the plan and, where it helps, put our engineers on it until it runs.",
    deliverables: [
      "Independent delivery health check",
      "Re-baselined scope, plan and risks",
      "Architecture, process or team shape fixes",
      "Recovery engineering alongside your team",
    ],
    signal: "The date has moved twice and pushing harder is not working.",
  },
];

/* ---------- Engagement models: the dossiers ---------- */

export type Dossier = {
  file: string;
  name: string;
  line: string;
  shape: string;
  when: string;
  get: string[];
  ends: string;
};

export const dossiers: Dossier[] = [
  {
    file: "A",
    name: "Diagnostic sprint",
    line: "A sharp read on a messy situation.",
    shape: "Typically a few weeks",
    when: "Something is stuck, expensive or unclear, and you need to know why before you spend more.",
    get: [
      "Problem statement with a measurable outcome",
      "Map of systems, data and owners",
      "Ranked opportunities with rough effort",
      "A recommendation you can act on",
    ],
    ends: "With a clear go or no-go on the next move. If it is a build, we can build it.",
  },
  {
    file: "B",
    name: "AI strategy and readiness",
    line: "Where AI pays, and what has to be true first.",
    shape: "Typically a few weeks",
    when: "Leadership wants AI and needs to know where it creates value, what it risks and what to fix first.",
    get: [
      "Use-case portfolio ranked by value and feasibility",
      "Data, platform and governance readiness",
      "Model and inference cost options",
      "A pilot design with evaluation criteria",
    ],
    ends: "With a pilot scoped tightly enough to prove or kill quickly, and a team ready to run it.",
  },
  {
    file: "C",
    name: "Architecture and roadmap",
    line: "The system, drawn before it is built.",
    shape: "Scoped to the system",
    when: "You are about to build or rebuild something that has to last, scale or integrate with a lot.",
    get: [
      "Target architecture in C4 views",
      "Architecture decision records",
      "Sequenced roadmap with exit criteria",
      "Build, buy and partner calls",
    ],
    ends: "With a plan your own team, or ours, can start on the following Monday.",
  },
  {
    file: "D",
    name: "Technical due diligence",
    line: "What is really behind the demo.",
    shape: "Fits the deal timeline",
    when: "You are investing in, acquiring or partnering with a technology business and need an independent view.",
    get: [
      "Codebase and architecture review",
      "Security, scalability and delivery risk",
      "Team and process assessment",
      "Findings ranked by severity and cost to fix",
    ],
    ends: "With a written view and the questions to ask before you sign.",
  },
  {
    file: "E",
    name: "Fractional technical leadership",
    line: "A CTO or architect, part-time, fully accountable.",
    shape: "Ongoing, part-time",
    when: "You need senior technical judgement now, before you are ready to hire for it.",
    get: [
      "A fractional CTO or principal architect",
      "Technical strategy and hiring plan",
      "Vendor and architecture oversight",
      "An engineering quality bar",
    ],
    ends: "With a handover to a permanent leader, ideally one we helped you hire.",
  },
  {
    file: "F",
    name: "Delivery recovery",
    line: "Late, over budget, losing trust. Reset.",
    shape: "Starts with a health check",
    when: "A programme is slipping and pushing harder is not working.",
    get: [
      "Independent delivery health check",
      "Re-baselined scope and plan",
      "Fixes to architecture, process or team shape",
      "Hands-on recovery engineers if needed",
    ],
    ends: "Back on a plan people believe, with our engineers alongside if it helps.",
  },
];

/* ---------- Deliverables: the engagement record ---------- */

export const record = [
  {
    id: "ADR-014",
    kind: "Architecture decision record",
    title: "Event-driven core over point-to-point integrations.",
    body: "Context: every new channel needs its own integration to every core system. Decision: publish domain events from one core and let consumers subscribe. Consequence: more platform work up front, far cheaper change after.",
    stamp: "Decided",
  },
  {
    id: "ARC-002",
    kind: "Target architecture",
    title: "C4 views from context down to component.",
    body: "Agents, services, data and identity drawn as one system, with the targets each part must meet for latency, scale, resilience and cost.",
    stamp: "Issued",
  },
  {
    id: "RMP-001",
    kind: "Roadmap",
    title: "Now, next, later. Each phase with exit criteria.",
    body: "Sequenced so the riskiest assumption is tested first. Every phase ends in something running, not a report.",
    stamp: "Sequenced",
  },
  {
    id: "BBP-005",
    kind: "Build, buy, partner",
    title: "Build the triage agent. Buy identity. Partner on payments.",
    body: "Each call written down with the reasoning, the alternatives we rejected and the conditions that would change our mind.",
    stamp: "Decided",
  },
  {
    id: "RSK-003",
    kind: "Risk register",
    title: "Model vendor lock-in. Owner named.",
    body: "Mitigation: a model gateway and a portable evaluation suite, so switching providers is a configuration change, not a rewrite.",
    stamp: "Owned",
  },
  {
    id: "TCO-001",
    kind: "Cost model",
    title: "Run cost per transaction, in ranges.",
    body: "Build, run and inference costs modelled with ranges and sensitivities, not a single hopeful number.",
    stamp: "Modelled",
  },
];

/* ---------- Methods marquee ---------- */

export const methods = [
  "Event storming",
  "Wardley mapping",
  "C4 models",
  "Architecture decision records",
  "Threat modelling",
  "TCO models",
  "Discovery sprints",
  "Service blueprints",
];

export const methodsB = [
  "Domain-driven design",
  "Value stream mapping",
  "Jobs to be done",
  "Fitness functions",
  "DORA metrics",
  "Evaluation harnesses",
  "Team topologies",
  "Pre-mortems",
  "Working prototypes",
];

/* ---------- FAQ ---------- */

export const faqs: FaqItem[] = [
  {
    q: "How is Asymmetri's technology consulting different from a large consultancy?",
    a: "Asymmetri's consultants are architects and engineers who also build. Advice is shaped by what it takes to ship and run the system, so recommendations arrive as architecture, decision records and a sequenced plan a team can execute, not a slide deck. The same team can stay on to build it, which keeps everyone accountable for whether the advice works in production.",
  },
  {
    q: "Does Asymmetri also build what it recommends?",
    a: "Yes. Asymmetri is a technology company that engineers AI systems, agents and digital products, so a consulting engagement can move straight into design and engineering with the same people. It is never a condition: every engagement ends with deliverables your own team or another partner can act on.",
  },
  {
    q: "How does an AI strategy engagement with Asymmetri work?",
    a: "It starts with framing: which decisions or workflows AI should change and how success will be measured. Asymmetri then assesses data, platform and governance readiness, ranks use cases by value and feasibility, models inference costs and designs a tightly scoped pilot with evaluation criteria. The work is AI-native from the first workshop, using working prototypes where they settle a question faster than debate.",
  },
  {
    q: "Can Asymmetri assess an existing team, codebase or vendor?",
    a: "Yes. Technical due diligence and delivery health checks review code, architecture, security, delivery process and team shape, then rank findings by severity and cost to fix. They suit investors, acquirers and leaders who have inherited a platform or a struggling programme and need an independent view.",
  },
  {
    q: "How do we start a technology consulting engagement?",
    a: "Send a short note about the problem through the contact page or email info@asymmetri.in. The first step is a framing conversation. From there Asymmetri proposes the right shape of engagement, often a diagnostic sprint that typically runs a few weeks, before anything larger is committed.",
  },
];
