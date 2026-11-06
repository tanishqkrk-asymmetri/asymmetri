// Page copy for this practice. Server-safe (no "use client"): page.tsx reads
// the FAQ from here for JSON-LD.
import type { FaqItem } from "@/components/practice/PracticeFaq";

export const manifesto =
  "Design and engineering in *one* team, on *one* loop. From first commit to *production*, then it keeps *improving*.";

/** The exploded view: what we build at each layer of one application. */
export const layers = [
  {
    key: "interface",
    name: "Interface",
    builds: "Web, mobile and device UI, design systems, accessibility and motion.",
    items: ["Design system", "Web and native UI", "Accessibility", "Motion"],
  },
  {
    key: "api",
    name: "API and integrations",
    builds:
      "Versioned REST and GraphQL APIs, payments, identity, webhooks, and the partner and legacy systems a product has to talk to.",
    items: ["REST and GraphQL", "Payments", "Identity", "Events and webhooks"],
  },
  {
    key: "data",
    name: "Data",
    builds:
      "Schemas and transactional stores, search, caching, analytics events and the migrations that keep them honest.",
    items: ["Schemas", "Search", "Caching", "Analytics events"],
  },
  {
    key: "cloud",
    name: "Cloud and infrastructure",
    builds:
      "Infrastructure as code, containers, environments, CI/CD and scaling, with security and cost watched from day one.",
    items: ["Infrastructure as code", "Containers", "CI/CD", "Autoscaling"],
  },
  {
    key: "observability",
    name: "Observability",
    builds:
      "Logs, metrics, traces, alerting and performance budgets, so we see a problem before your customers do.",
    items: ["Logs and traces", "Metrics", "Alerting", "Performance budgets"],
  },
] as const;

/** One illustrative product, followed across every surface it lives on. */
export const surfaces = [
  {
    key: "web",
    name: "Web platform",
    state: "Booked",
    body: "Where the transaction starts. Responsive, fast, accessible and found by search.",
  },
  {
    key: "mobile",
    name: "Mobile app",
    state: "Confirmed",
    body: "Native feel on iOS and Android. Offline-aware, push-driven, in the pocket.",
  },
  {
    key: "wearable",
    name: "Wearable",
    state: "Arriving",
    body: "Glanceable moments on the wrist: haptics, sensors and the one thing that matters now.",
  },
  {
    key: "kiosk",
    name: "Kiosk and console",
    state: "Checked in",
    body: "Shared, touch-first hardware in the physical world, built to survive real use.",
  },
  {
    key: "admin",
    name: "Admin and back office",
    state: "Fulfilled",
    body: "The operator's view: queues, roles, audit trails and reporting behind every screen.",
  },
] as const;

/** Capabilities as a spec sheet. Keys follow practice.capabilities order. */
export const capabilitySpecs = [
  {
    kind: "web",
    approach:
      "SaaS products, marketplaces, portals and dashboards built for real load. Server-rendered where it matters, typed end to end, multi-tenant when it needs to be.",
    deliverables: [
      "Product architecture",
      "Web front ends",
      "Auth, roles and billing",
      "Admin and back office",
    ],
  },
  {
    kind: "mobile",
    approach:
      "Native Swift and Kotlin when the device matters, React Native or Flutter when one codebase should serve both. We choose per product, not per habit.",
    deliverables: [
      "iOS and Android apps",
      "Offline and sync",
      "Push and deep links",
      "Store release and updates",
    ],
  },
  {
    kind: "design",
    approach:
      "Research, flows, prototypes and design systems, made by designers who sit with the engineers, so what ships is what was designed.",
    deliverables: [
      "Discovery and user flows",
      "Interactive prototypes",
      "Design system and tokens",
      "Accessibility and motion",
    ],
  },
  {
    kind: "api",
    approach:
      "Clean, versioned APIs and the unglamorous plumbing: payments, identity, ERPs, CRMs, hardware and the legacy systems nobody wants to touch.",
    deliverables: [
      "REST and GraphQL APIs",
      "Payments and identity",
      "Webhooks and event streams",
      "Partner and legacy integrations",
    ],
  },
  {
    kind: "cloud",
    approach:
      "Infrastructure as code, reproducible environments and pipelines that ship small changes often, with cost, security and uptime watched from the first deploy.",
    deliverables: [
      "Cloud architecture",
      "CI/CD pipelines",
      "Containers and IaC",
      "Monitoring and alerting",
    ],
  },
  {
    kind: "qa",
    approach:
      "Tests written alongside features: unit, integration and end to end. AI agents widen the coverage, people own the judgement and the release gate.",
    deliverables: [
      "Test strategy",
      "End-to-end suites",
      "Regression and device testing",
      "Release gates",
    ],
  },
] as const;

export type CapabilityKind = (typeof capabilitySpecs)[number]["kind"];

export const stack = [
  "Next.js",
  "React",
  "TypeScript",
  "React Native",
  "Swift",
  "Kotlin",
  "Flutter",
  "Node.js",
  "Go",
  "Python",
  "PostgreSQL",
  "Redis",
  "GraphQL",
  "AWS",
  "Google Cloud",
  "Vercel",
  "Docker",
  "Kubernetes",
  "Terraform",
  "Playwright",
];

export const faqs: FaqItem[] = [
  {
    q: "Should we build for web, native mobile or cross-platform?",
    a: "It depends on where your users are and what the product needs from the device. A responsive web platform reaches everyone fastest and is easiest to change. Native iOS and Android, in Swift and Kotlin, is the right call when performance, hardware access or platform feel matter most. Cross-platform frameworks such as React Native or Flutter suit products that need both stores from one codebase. Asymmetri recommends per product after discovery, and many products end up with a web platform, a mobile app and an admin back office sharing one API.",
  },
  {
    q: "How long does it take to get to an MVP?",
    a: "It depends on scope, integrations and how much is already decided. In discovery we agree the smallest first release that proves the product, then plan the work in short increments so you see working software early and often rather than at the end. Our AI-driven delivery loop shortens the time from decision to deployed code, but the honest answer comes from a scoped plan, which we give you before the build starts.",
  },
  {
    q: "How does Asymmetri use AI in software delivery?",
    a: "The whole software delivery lifecycle is AI-driven. FinishLine, our own agentic project management platform, connects requirements, planning, execution, evidence and delivery. Engineers and designers work with tools such as Claude Code, Codex, Cursor and Figma AI for planning, code, review and test generation, and GitHub Actions runs continuous delivery. People stay accountable for architecture, review and every release decision; AI shortens the loop around them.",
  },
  {
    q: "Can you take over an existing codebase or product?",
    a: "Yes. We start with a technical audit of the code, infrastructure, tests and delivery process, then share what is solid, what is risky and what to fix first. From there we stabilise, add tests and observability, and keep shipping features while we improve the foundations, so the product never has to stop for a rewrite.",
  },
  {
    q: "How do we start working with Asymmetri on an application?",
    a: "Get in touch through the contact page or at info@asymmetri.in with the problem you are solving. We begin with a short discovery to frame the product, the users and the constraints, and come back with an approach, a first release and a team shape. Design and engineering then work as one team from the first commit to production and beyond.",
  },
];
