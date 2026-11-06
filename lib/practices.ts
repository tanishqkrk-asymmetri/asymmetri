/**
 * The four "What we do" practices. Single source of truth for the nav
 * dropdown, the home page index, each practice page, the sitemap, JSON-LD
 * and /llms.txt.
 */

export type PracticeGlyphKind = "mesh" | "build" | "map" | "lab";

export type Practice = {
  slug: string;
  href: string;
  /** "01" … "04" */
  index: string;
  name: string;
  /** Short label for tight spaces (nav, chips). */
  short: string;
  /** One-line promise, used as the page H1 subtitle and in the nav. */
  tagline: string;
  /** Two-sentence overview for the home index, cards and meta. */
  summary: string;
  /** Six headline capabilities. */
  capabilities: string[];
  /** Case study slugs that prove this practice (see lib/case-studies.ts). */
  proof: string[];
  glyph: PracticeGlyphKind;
  seo: { title: string; description: string; keywords: string[] };
};

const base = "/what-we-do";

export const practices: Practice[] = [
  {
    slug: "ai-agentic-systems-and-data",
    href: `${base}/ai-agentic-systems-and-data`,
    index: "01",
    name: "AI Agentic Systems and Data",
    short: "AI, Agents & Data",
    tagline: "Systems that think, decide and act on your data.",
    summary:
      "Agents, knowledge and data engineered into one accountable operating layer. From retrieval and memory to orchestration, evaluation and governance, we build AI that leaves the chat window and does the work.",
    capabilities: [
      "Agent runtimes",
      "Multi-agent orchestration",
      "RAG and knowledge graphs",
      "Data platforms and pipelines",
      "Evaluation and observability",
      "Guardrails and governance",
    ],
    proof: ["reform-ai", "prescribe-life"],
    glyph: "mesh",
    seo: {
      title: "AI Agentic Systems and Data Engineering",
      description:
        "Asymmetri engineers AI agents, multi-agent orchestration, RAG, knowledge graphs and data platforms, with evaluation, guardrails and inference economics built in from day one.",
      keywords: [
        "AI agents development",
        "agentic AI company",
        "multi-agent systems",
        "RAG development",
        "knowledge graphs",
        "data engineering",
        "LLM evaluation",
        "AI governance",
      ],
    },
  },
  {
    slug: "application-development",
    href: `${base}/application-development`,
    index: "02",
    name: "Application Development",
    short: "Application Development",
    tagline: "Products people transact with, depend on and trust.",
    summary:
      "Web platforms, mobile apps, SaaS and connected devices, designed and engineered by one team. An AI-driven delivery loop takes the product from first commit to production, then keeps it improving.",
    capabilities: [
      "Web platforms and SaaS",
      "iOS, Android and cross-platform",
      "Product and interaction design",
      "APIs and integrations",
      "Cloud, DevOps and scale",
      "QA and test automation",
    ],
    proof: ["kommerz-os", "quicli", "zimkey"],
    glyph: "build",
    seo: {
      title: "Application Development: Web, Mobile and SaaS",
      description:
        "Asymmetri designs and engineers web platforms, mobile apps, SaaS products and connected experiences with an AI-driven software delivery lifecycle, from first commit to production.",
      keywords: [
        "application development company",
        "web app development",
        "mobile app development",
        "SaaS development",
        "product design and engineering",
        "AI-driven software development",
      ],
    },
  },
  {
    slug: "technology-consulting",
    href: `${base}/technology-consulting`,
    index: "03",
    name: "Technology Consulting",
    short: "Technology Consulting",
    tagline: "Frame the hard problem. Architect the answer.",
    summary:
      "Strategy, architecture and technical leadership from people who also build. We find where technology creates real operating leverage, design the system, and stay accountable until it runs.",
    capabilities: [
      "Problem framing and discovery",
      "AI strategy and readiness",
      "System architecture",
      "Technical due diligence",
      "Fractional technical leadership",
      "Delivery recovery",
    ],
    proof: ["dd-group", "reform-ai"],
    glyph: "map",
    seo: {
      title: "Technology Consulting, AI Strategy and Architecture",
      description:
        "Technology consulting from a team that builds: problem framing, AI strategy, system architecture, technical due diligence and fractional technical leadership for global brands.",
      keywords: [
        "technology consulting",
        "AI strategy consulting",
        "software architecture consulting",
        "technical due diligence",
        "fractional CTO",
        "digital transformation",
      ],
    },
  },
  {
    slug: "innovation-and-rd",
    href: `${base}/innovation-and-rd`,
    index: "04",
    name: "Innovation and R&D",
    short: "Innovation & R&D",
    tagline: "What is next, engineered into what ships.",
    summary:
      "Applied research in AI and machine learning systems and in mixed reality, plus the products we build and run ourselves. We prototype the frontier, prove it, then transfer it into production.",
    capabilities: [
      "Applied AI and ML research",
      "Mixed reality and spatial UI",
      "Rapid prototyping",
      "Benchmarks and evaluation",
      "New product incubation",
      "Research to production transfer",
    ],
    proof: ["prescribe-life", "sochcast-campus-gal"],
    glyph: "lab",
    seo: {
      title: "Innovation and R&D: Applied AI and Mixed Reality",
      description:
        "Asymmetri's frontier R&D: applied research in AI and machine learning systems and mixed reality, rapid prototyping, and in-house products like FinishLine, transferred into production.",
      keywords: [
        "applied AI research",
        "AI R&D company",
        "mixed reality development",
        "spatial computing",
        "rapid prototyping",
        "innovation lab",
      ],
    },
  },
];

export function getPractice(slug: string) {
  const p = practices.find((x) => x.slug === slug);
  if (!p) throw new Error(`Unknown practice: ${slug}`);
  return p;
}

/** The practice after this one, wrapping around. */
export function nextPractice(slug: string) {
  const i = practices.findIndex((x) => x.slug === slug);
  return practices[(i + 1) % practices.length];
}
