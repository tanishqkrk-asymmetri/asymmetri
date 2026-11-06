// Page copy for this practice. Server-safe (no "use client"): page.tsx reads
// the FAQ from here for JSON-LD.
import type { FaqItem } from "@/components/practice/PracticeFaq";
import { aiLayers } from "@/lib/site-content";

export const manifesto =
  "AI becomes valuable when it leaves the *chat* *window* and enters the *operation.* We engineer the whole intelligence loop, on data you can *trust.*";

/** Example agent trace for the hero log. Illustrative, not a real run. */
export type TraceLine = {
  agent: string;
  text: string;
  kind?: "ok" | "reject" | "info";
  /** Mesh node to light while this line prints. */
  node?: string;
  /** Ask the mesh to re-route its critical path. */
  reroute?: boolean;
};

export const trace: TraceLine[] = [
  { agent: "planner", text: "decomposed brief into 4 steps", node: "PLANNER" },
  { agent: "memory", text: "recalled 3 prior decisions", node: "MEMORY" },
  { agent: "retriever", text: "12 chunks · rerank top 5", node: "RETRIEVER" },
  { agent: "executor", text: "step 2 · drafted refund check", node: "EXECUTOR" },
  { agent: "critic", text: "rejected step 3 · retry", kind: "reject", node: "CRITIC", reroute: true },
  { agent: "planner", text: "re-planned step 3 · new route", node: "PLANNER" },
  { agent: "tool:mcp", text: "crm.lookup(account) · 200", node: "TOOL:MCP" },
  { agent: "critic", text: "approved · grounded 0.94", node: "CRITIC" },
  { agent: "executor", text: "ticket updated via MCP", kind: "ok", node: "EXECUTOR" },
  { agent: "eval", text: "task success · 4.1s · $0.03", kind: "ok" },
];

/** The "and Data" half: raw information becomes agent-ready context. */
export const dataStages = [
  {
    key: "ingest",
    name: "Ingest",
    title: "Every source, one pipeline.",
    body: "Documents, tables, events and logs arrive from wherever they live. Batch and streaming pipelines land them in a lakehouse or warehouse with lineage from the first byte.",
    tags: ["Batch and streaming", "Change data capture", "Lakehouse", "Warehousing"],
  },
  {
    key: "clean",
    name: "Clean and chunk",
    title: "Quality before quantity.",
    body: "We parse, deduplicate and validate against data contracts, redact what should never reach a model, then chunk with the structure of the source preserved.",
    tags: ["Parsing", "Data contracts", "Quality checks", "PII redaction"],
  },
  {
    key: "embed",
    name: "Embed",
    title: "Meaning becomes geometry.",
    body: "Chunks are embedded into a vector space where related ideas sit together, so hybrid search and reranking find the passage that answers the question, not just the keyword.",
    tags: ["Embeddings", "Vector stores", "Hybrid search", "Reranking"],
  },
  {
    key: "link",
    name: "Link",
    title: "Facts become a graph.",
    body: "Entities and relationships are extracted into a knowledge graph, so an agent can reason across customers, contracts and orders instead of reading isolated snippets.",
    tags: ["Knowledge graphs", "Entity resolution", "Ontologies", "Graph RAG"],
  },
  {
    key: "assemble",
    name: "Assemble",
    title: "The right context, at the right moment.",
    body: "At run time we assemble a permission-aware context window, inside a token budget, and hand it to the agent with citations. Governed data in, accountable action out.",
    tags: ["Context assembly", "Access control", "Token budgets", "Data governance"],
  },
];

/** Assist → Multi-agent: what changes as autonomy goes up. */
export const autonomy = [
  {
    name: "Assist",
    line: "AI answers. People act.",
    decides: "People. The AI suggests, drafts and answers on request.",
    approvals: "Every output is read and used by a person.",
    guardrails: "Grounded answers with citations, content filters.",
    bestFor: "Research, drafting and search across company knowledge.",
    touch: 4,
  },
  {
    name: "Copilot",
    line: "AI prepares. People approve.",
    decides: "People, with the AI preparing each decision.",
    approvals: "Accept, edit or reject every proposed action.",
    guardrails: "Scoped tools, previews before any write, undo.",
    bestFor: "Support, sales, finance and operations workflows.",
    touch: 3,
  },
  {
    name: "Agent",
    line: "AI acts. People handle exceptions.",
    decides: "The agent, inside a defined task, toolset and budget.",
    approvals: "Checkpoints on high-impact steps and on exceptions.",
    guardrails: "Least-privilege tools, sandboxing, step and spend limits, evals.",
    bestFor: "Repeatable multi-step work: triage, reconciliation, resolution.",
    touch: 2,
  },
  {
    name: "Multi-agent system",
    line: "Agents coordinate. People set policy.",
    decides: "A supervisor delegating to specialised agents.",
    approvals: "Policy set by people, every decision audited.",
    guardrails: "Per-agent permissions, handoff contracts, tracing, a kill switch.",
    bestFor: "End-to-end processes that span teams and systems.",
    touch: 1,
  },
];

/** The six practice capabilities, with what we do and what you receive. */
export const capabilityDetail = [
  {
    name: "Agent runtimes",
    kind: "runtime",
    what: "Harnesses that turn a model into a dependable worker: planning, state, checkpoints, retries and recovery, with typed tools and hard budgets on steps and spend.",
    deliverables: [
      "Agent runtime and state machine",
      "Typed tool registry",
      "Checkpointing and resumable runs",
      "Failure and recovery playbooks",
    ],
  },
  {
    name: "Multi-agent orchestration",
    kind: "orchestration",
    what: "Supervisors, specialists and handoffs designed around one shared outcome. Parallel where it pays, sequential where accountability matters.",
    deliverables: [
      "Agent topology and handoff contracts",
      "Supervisor and routing logic",
      "MCP and A2A integrations",
      "Shared state and conflict handling",
    ],
  },
  {
    name: "RAG and knowledge graphs",
    kind: "rag",
    what: "Retrieval that finds the right fact: structured chunking, hybrid search, reranking, entity graphs and permission-aware context assembly.",
    deliverables: [
      "Ingestion and chunking pipeline",
      "Vector and graph stores",
      "Retrieval and reranking service",
      "Retrieval quality benchmarks",
    ],
  },
  {
    name: "Data platforms and pipelines",
    kind: "data",
    what: "The foundation under every agent: batch and streaming pipelines, lakehouse and warehouse models, data contracts and quality monitoring.",
    deliverables: [
      "Pipelines and orchestration",
      "Lakehouse or warehouse model",
      "Data contracts and quality monitors",
      "Lineage and catalogue",
    ],
  },
  {
    name: "Evaluation and observability",
    kind: "eval",
    what: "Eval suites built from your real tasks, tracing on every run and production monitors for quality, latency and cost per task.",
    deliverables: [
      "Golden datasets and eval suites",
      "Regression gates in CI",
      "Tracing and quality dashboards",
      "Latency and cost budgets",
    ],
  },
  {
    name: "Guardrails and governance",
    kind: "guard",
    what: "Least-privilege tools, sandboxed execution, prompt-injection defence, data protection and an audit trail for every decision an agent makes.",
    deliverables: [
      "Threat model and red-team findings",
      "Policy enforcement layer",
      "PII detection and redaction",
      "Audit logs and approval flows",
    ],
  },
] as const;

/** Representative technologies, flattened from the ten layers. */
export const stack: string[] = Array.from(new Set(aiLayers.flatMap((l) => l.stack)));

export const faqs: FaqItem[] = [
  {
    q: "What is an agentic AI system?",
    a: "An agentic AI system is software in which AI models do more than answer questions: they plan a task, retrieve the context they need, call tools and APIs to act, check their own work and hand off to people or other agents. Asymmetri engineers these systems end to end, from data and knowledge to the agent runtime, orchestration, evaluation and governance, so the AI completes real work inside your operation instead of living in a chat window.",
  },
  {
    q: "How do you evaluate and monitor AI agents?",
    a: "We build an evaluation suite from your real tasks before an agent ships, then run it as a regression gate on every change to prompts, models, tools or data. In production every run is traced, and we monitor task success, groundedness, latency and cost per task, with alerts when quality drifts. Tools such as Langfuse, LangSmith, Arize Phoenix, Braintrust and OpenTelemetry are representative of what we use.",
  },
  {
    q: "Are you tied to one model provider?",
    a: "No. Asymmetri is model-agnostic. We choose models per task on quality, speed, control and cost, and often route between several, including OpenAI, Anthropic Claude, Google Gemini and open-weight models served with tools like vLLM. Routing and evaluation are built in, so you can change models as the market moves without rebuilding the system.",
  },
  {
    q: "How do you keep AI agents safe and governed?",
    a: "Governance is designed into the architecture. Agents get least-privilege access to tools and data, risky actions run in sandboxes or wait for human approval, inputs are screened for prompt injection, personal data is detected and redacted, and every decision is logged for audit. Autonomy is raised one step at a time, from assist to copilot to agent, only as evaluations earn that trust.",
  },
  {
    q: "How do we start an AI agent project with Asymmetri?",
    a: "Bring us the hard problem. We start by framing the valuable decision or workflow, then design the interaction and control model, engineer the agent and its data foundation, prove performance, safety and economics with evaluations, and operate it in the real workflow. Write to info@asymmetri.in to begin.",
  },
];
