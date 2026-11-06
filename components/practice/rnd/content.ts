// Page copy for this practice. Server-safe (no "use client"): page.tsx reads
// the FAQ from here for JSON-LD.
import type { FaqItem } from "@/components/practice/PracticeFaq";

export const manifesto =
  "Research that never ships is a *hobby.* We prototype the *frontier,* prove it with *evidence* and transfer it into *production.*";

/** Hero aside: example entries from an experiment log (illustrative). */
export type LogEntry = {
  id: string;
  track: string;
  hypothesis: string;
  status: string;
  note: string;
  dead?: boolean;
};

export const logEntries: LogEntry[] = [
  {
    id: "EXP-0417",
    track: "AI / ML systems",
    hypothesis:
      "Compacted episodic memory keeps agent task success within tolerance at a lower context cost.",
    status: "Benchmarking",
    note: "Eval suite running against baseline",
  },
  {
    id: "EXP-0398",
    track: "AI / ML systems",
    hypothesis: "A single generalist agent can replace the three-step review chain.",
    status: "Discarded",
    note: "Lost to baseline on edge cases. Cheap lesson.",
    dead: true,
  },
  {
    id: "EXP-0422",
    track: "Mixed reality",
    hypothesis:
      "Instructions anchored to the part itself cut errors in a multi-step assembly task.",
    status: "Prototype",
    note: "Spatial build in user sessions",
  },
];

export type Track = {
  key: "ai" | "mr";
  index: string;
  name: string;
  body: string;
  questions: { topic: string; q: string }[];
};

export const tracks: Track[] = [
  {
    key: "ai",
    index: "Track A",
    name: "AI and ML systems",
    body: "Agent runtimes, memory, evaluation and inference economics: the open questions that decide whether AI holds up in production.",
    questions: [
      {
        topic: "Agent runtimes",
        q: "How do long-running agents stay reliable, resumable and observable when one task spans hours and dozens of tools?",
      },
      {
        topic: "Memory",
        q: "What should an agent remember, forget and cite, and how does that memory stay correct as the world changes?",
      },
      {
        topic: "Evaluation",
        q: "How do you prove an agent is good enough before it touches the operation, and keep proving it after?",
      },
      {
        topic: "Inference economics",
        q: "What does each decision cost, and how far can routing, caching and smaller models cut it without losing quality?",
      },
    ],
  },
  {
    key: "mr",
    index: "Track B",
    name: "Mixed Reality",
    body: "Spatial interfaces that carry intelligence into the physical world, where people work, train and move.",
    questions: [
      {
        topic: "Spatial interfaces",
        q: "Where should information live in a physical space so it helps without getting in the way?",
      },
      {
        topic: "Grounded intelligence",
        q: "How does an assistant understand what the wearer is looking at, and act on it?",
      },
      {
        topic: "Training and guidance",
        q: "Can spatial guidance shorten the time it takes someone to learn a physical task?",
      },
      {
        topic: "Hands-free interaction",
        q: "Which inputs, voice, gaze or gesture, hold up in noisy, gloved and moving environments?",
      },
    ],
  },
];

export type Station = {
  name: string;
  line: string;
  pass: string[];
  kill: string;
};

export const stations: Station[] = [
  {
    name: "Hypothesis",
    line: "A falsifiable claim about value.",
    pass: ["Names the decision or workflow it changes", "States what would prove it wrong"],
    kill: "No measurable outcome",
  },
  {
    name: "Prototype",
    line: "The cheapest thing that can be wrong.",
    pass: ["Runs on real or realistic data", "Built to learn, not to last"],
    kill: "Needs heroics to work at all",
  },
  {
    name: "Benchmark",
    line: "Measured against today's way.",
    pass: ["Beats the baseline on agreed metrics", "Quality, latency and cost per task logged"],
    kill: "Wins only on the demo",
  },
  {
    name: "Pilot",
    line: "Real people, real workflow, guarded.",
    pass: ["People choose to keep using it", "Holds up on edge cases and failure modes"],
    kill: "Adoption stalls or risk rises",
  },
  {
    name: "Transfer",
    line: "Hardened and shipped to production.",
    pass: ["Observability, evals and governance in place", "Owned by a production team"],
    kill: "Ships",
  },
];

/**
 * Illustrative population for the pipeline scene: the station index where each
 * specimen is discarded (5 = it survives into production).
 */
export const specimenFates = [0, 2, 1, 0, 5, 3, 0, 1, 2, 0, 1, 4, 0, 2, 5, 1];

export const spine = [
  { name: "Intent", body: "What the work is for, captured once and carried all the way through." },
  { name: "Planning", body: "Intent broken into plans, sprints and tasks, with agents doing the heavy lifting." },
  { name: "Execution", body: "Work moves with people and agents in the loop, and nothing goes quiet." },
  { name: "Evidence", body: "Every outcome leaves proof: checks, artefacts and decisions on the record." },
  { name: "Delivery", body: "Shipped work traces straight back to the intent that started it." },
];

export const incubation = [
  { name: "Frame it together", body: "We size the opportunity with you and agree what would make it worth building." },
  { name: "Prove it cheaply", body: "Prototypes and pilots with real users, judged against criteria set up front." },
  { name: "Build and run it", body: "We design, engineer and operate the product with you, from launch onwards." },
];

export type NotebookEntry = {
  capability: string;
  sketch: "network" | "cube" | "screen" | "bars" | "branch" | "transfer";
  what: string;
  deliverables: string[];
};

export const notebook: NotebookEntry[] = [
  {
    capability: "Applied AI and ML research",
    sketch: "network",
    what: "Research aimed at production questions: agent runtimes, memory, retrieval, fine-tuning and model choice, tested on your data rather than on leaderboards.",
    deliverables: ["Research brief and findings", "Reference implementation", "Adopt, adapt or drop call"],
  },
  {
    capability: "Mixed reality and spatial UI",
    sketch: "cube",
    what: "Spatial interfaces for headsets, mobile AR and the web that put guidance, data and agents into the physical spaces where work happens.",
    deliverables: ["Spatial interaction prototypes", "Device and platform evaluation", "Pilot-ready MR application"],
  },
  {
    capability: "Rapid prototyping",
    sketch: "screen",
    what: "Working software in front of real users quickly, built to answer one question cheaply and honestly before anyone commits a budget.",
    deliverables: ["Functional prototypes", "User sessions and findings", "Go or no-go evidence"],
  },
  {
    capability: "Benchmarks and evaluation",
    sketch: "bars",
    what: "Evaluation suites that measure quality, safety, latency and cost per task against a baseline, so decisions rest on numbers, not demos.",
    deliverables: ["Custom eval datasets and graders", "Model and vendor comparisons", "Regression suites for production"],
  },
  {
    capability: "New product incubation",
    sketch: "branch",
    what: "Products we build and run ourselves and with partners, from framing the opportunity to a launched and operated product.",
    deliverables: ["Concept validation", "MVP build and launch", "Operating and growth roadmap"],
  },
  {
    capability: "Research to production transfer",
    sketch: "transfer",
    what: "The hand-off where most R&D dies. We harden what worked, add observability and governance, and ship it into the real workflow.",
    deliverables: ["Production architecture", "Observability and eval gates", "Handover to the owning team"],
  },
];

export const toolsAi = [
  "PyTorch",
  "JAX",
  "Hugging Face",
  "vLLM",
  "Ollama",
  "Weights & Biases",
  "LangGraph",
  "ONNX Runtime",
];

export const toolsSpatial = [
  "Unity",
  "Unreal Engine",
  "WebXR",
  "Apple visionOS",
  "Meta Quest",
  "OpenXR",
  "Blender",
  "Three.js",
];

export const faqs: FaqItem[] = [
  {
    q: "What does R&D with Asymmetri look like?",
    a: "Applied, time-boxed research aimed at a decision. We start from a question that matters to your operation, such as whether an agent can run a workflow reliably or whether a spatial interface makes training faster. Then we prototype, benchmark against criteria agreed up front and report what we found. Every experiment ends in a clear call: transfer it to production, iterate, or stop.",
  },
  {
    q: "How do your prototypes reach production?",
    a: "Transfer is designed in from the first day. Prototypes run on real data paths with evaluation suites and cost measurements, so the evidence carries over. When an experiment passes its pilot, the same team hardens it, adds observability and governance and ships it into the real workflow through our AI and application engineering practices.",
  },
  {
    q: "Do you build mixed reality experiences?",
    a: "Yes. Mixed reality is one of Asymmetri's two research tracks, alongside AI and machine learning systems. We design and prototype spatial interfaces that carry intelligence into the physical world, where people work, train and move, using engines and platforms such as Unity, Unreal Engine, WebXR, Apple visionOS and Meta Quest, chosen per problem.",
  },
  {
    q: "Can we co-develop or incubate a new product with you?",
    a: "Yes. Alongside client work, Asymmetri designs, builds and operates its own products, including FinishLine, our agentic project management operating spine. We bring the same model to partners: frame the opportunity together, prove it with prototypes and pilots, then build and run the product with you.",
  },
  {
    q: "How do we start an R&D engagement?",
    a: "Bring us the problem, not a specification. A first conversation frames the question and what a good answer would be worth. We then propose a scoped experiment with explicit pass criteria, so you know what will be tested, how it will be measured and what happens if it works. Write to info@asymmetri.in to begin.",
  },
];
