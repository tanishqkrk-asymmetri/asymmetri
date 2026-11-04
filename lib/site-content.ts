/**
 * Single source of truth for Asymmetri's positioning copy.
 * The home page, structured data (JSON-LD) and /llms.txt all read from here,
 * so search engines and AI assistants see the same facts the visitor sees.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_APP_URL || "https://asymmetri.in"
).replace(/\/$/, "");

export const company = {
  name: "Asymmetri",
  tagline: "Global brands. Hard problems. Solved.",
  category: "Hard problems technology company",
  positioning: "The technology company for what's next.",
  // Answer-first definition, reused as meta description and entity summary.
  definition:
    "Asymmetri is a hard problems technology company. We engineer AI systems, agents and digital products for global brands, across intelligence, process, experience and scale.",
  shortDescription:
    "Hard problems technology company engineering AI systems, agents and digital products for global brands, from strategy and design to production.",
  email: "info@asymmetri.in",
  logo: "/brand/asymmetri-logo-512.png",
};

export const pillars = [
  {
    name: "Intelligence",
    body: "Systems that think, decide and act. Models, knowledge, memory and agents engineered into one accountable layer.",
  },
  {
    name: "Process",
    body: "Operations redesigned around intelligence, so work is planned, coordinated and completed with people in control.",
  },
  {
    name: "Experience",
    body: "Products people transact with, depend on and trust, on screens and in the physical world.",
  },
  {
    name: "Scale",
    body: "Infrastructure, governance and unit economics that hold up from pilot to production.",
  },
];

export const verticals = [
  {
    name: "Technology consulting and services",
    body: "Strategy, design and engineering in one team. We frame the hard problem, architect the system and ship it into production, AI-native from the first workshop.",
  },
  {
    name: "Innovative products and solutions",
    body: "Products we design, build and operate, from AI copilots and agentic platforms to the tools we run our own company on, like FinishLine.",
  },
  {
    name: "Frontier R&D",
    body: "Applied research in AI and machine learning systems and in mixed reality, so what is next becomes what ships.",
  },
];

export const pointOfView = {
  headline:
    "AI becomes valuable when it leaves the chat window and enters the operation.",
  shifts: [
    { from: "Interface", to: "Interaction, judgment and approval" },
    { from: "Information", to: "Contextual, retrievable knowledge" },
    { from: "Automation", to: "Agents that plan, coordinate and act" },
    { from: "Experiment", to: "Governed, observable operating capability" },
  ],
  stance:
    "We do not add AI around the edges. We redesign the system around intelligence.",
  closer: "Intelligence is not a feature. It is a new operating layer.",
};

export type AiLayer = {
  n: number;
  name: string;
  discipline: string;
  headline: string;
  summary: string;
  capabilities: string[];
  logic: string[];
  stack: string[];
};

export const aiLayers: AiLayer[] = [
  {
    n: 1,
    name: "Design",
    discipline: "AI product and interaction design",
    headline: "Intelligence earns adoption at the point of interaction.",
    summary: "We design AI people can understand, direct and trust.",
    capabilities: [
      "Conversational UX",
      "Agent interfaces",
      "Copilots",
      "Generative UI",
      "Human-in-the-loop review",
      "Approval experiences",
    ],
    logic: ["Clear intent", "Visible state", "Controlled action"],
    stack: [
      "AI SDK UI",
      "CopilotKit",
      "assistant-ui",
      "AG-UI Protocol",
      "OpenAI ChatKit",
      "Gradio",
      "Streamlit",
    ],
  },
  {
    n: 2,
    name: "Knowledge",
    discipline: "Data and knowledge architecture",
    headline: "Useful intelligence starts with usable knowledge.",
    summary:
      "We turn fragmented information into retrievable operating context.",
    capabilities: [
      "Databases",
      "Ingestion and retrieval",
      "Embeddings",
      "Vector stores",
      "Knowledge graphs",
      "RAG pipelines",
    ],
    logic: ["Raw information", "Connected knowledge", "Relevant context"],
    stack: [
      "PostgreSQL",
      "Pinecone",
      "Qdrant",
      "Neo4j",
      "Weaviate",
      "Unstructured",
      "Apache Kafka",
      "Elasticsearch",
    ],
  },
  {
    n: 3,
    name: "Intelligence",
    discipline: "Model and inference engineering",
    headline: "The right model is a system decision, not a popularity contest.",
    summary:
      "We engineer the intelligence layer around quality, speed, control and cost.",
    capabilities: [
      "Model selection",
      "Model routing",
      "Structured outputs",
      "Fine-tuning",
      "Multimodal systems",
      "Inference optimisation",
    ],
    logic: ["Right model", "Right task", "Right economics"],
    stack: [
      "OpenAI API",
      "Anthropic Claude API",
      "Google Gemini API",
      "Hugging Face Transformers",
      "vLLM",
      "NVIDIA TensorRT-LLM",
      "LiteLLM",
      "Unsloth",
    ],
  },
  {
    n: 4,
    name: "Memory",
    discipline: "Context and memory systems",
    headline: "Every useful system remembers what matters.",
    summary:
      "We give AI the continuity to understand the user, the work and the moment.",
    capabilities: [
      "Short-term context",
      "User state",
      "Persistent memory",
      "Semantic memory",
      "Retrieval",
      "Context management",
    ],
    logic: ["Signal", "Recall", "Continuity", "Relevance"],
    stack: [
      "Mem0",
      "Zep",
      "Letta",
      "LangMem",
      "Cognee",
      "Graphiti",
      "Redis",
      "Supermemory",
    ],
  },
  {
    n: 5,
    name: "Agency",
    discipline: "Agent harness and runtime development",
    headline: "Agents need a harness before they need autonomy.",
    summary:
      "We build the runtime that turns model capability into dependable execution.",
    capabilities: [
      "Planning",
      "Execution",
      "State machines",
      "Checkpoints and routing",
      "Retries and recovery",
      "Reasoning workflows",
    ],
    logic: ["Plan", "Execute", "Check", "Recover", "Complete"],
    stack: [
      "LangGraph",
      "OpenAI Agents SDK",
      "Google Agent Development Kit",
      "Pydantic AI",
      "Mastra",
      "Strands Agents SDK",
      "Temporal",
      "Restate",
    ],
  },
  {
    n: 6,
    name: "Orchestration",
    discipline: "Multi-agent orchestration",
    headline:
      "One agent performs a task. A coordinated system moves the work.",
    summary:
      "We orchestrate specialised agents around a shared outcome and accountable handoffs.",
    capabilities: [
      "Agent delegation",
      "Supervisors",
      "Handoffs",
      "Parallel execution",
      "Workflow coordination",
      "Distributed systems",
    ],
    logic: ["Delegate", "Coordinate", "Hand off", "Converge"],
    stack: [
      "Microsoft AutoGen",
      "CrewAI",
      "Semantic Kernel",
      "LlamaIndex AgentWorkflow",
      "Agent2Agent (A2A)",
      "NVIDIA NeMo Agent Toolkit",
      "Agno",
      "CAMEL-AI",
    ],
  },
  {
    n: 7,
    name: "Action",
    discipline: "Tools, actions and integrations",
    headline: "Intelligence creates value when it can touch the real world.",
    summary:
      "We connect agents to the software, data and actions that businesses already depend on.",
    capabilities: [
      "APIs",
      "Model Context Protocol (MCP)",
      "Browser automation",
      "Databases",
      "Enterprise software",
      "Function calling",
    ],
    logic: ["Understand", "Choose a tool", "Act", "Confirm"],
    stack: [
      "Model Context Protocol",
      "Composio",
      "Pipedream Connect",
      "Browserbase",
      "Playwright",
      "Apify",
      "Zapier MCP",
      "Arcade",
    ],
  },
  {
    n: 8,
    name: "Evaluation",
    discipline: "Evaluation and observability",
    headline: "If we cannot observe it, we cannot improve or trust it.",
    summary:
      "We make AI quality visible from development through production.",
    capabilities: [
      "Automated evals",
      "Regression testing",
      "Tracing",
      "Task-success metrics",
      "Hallucination detection",
      "Production monitoring",
    ],
    logic: ["Trace", "Measure", "Diagnose", "Improve"],
    stack: [
      "Langfuse",
      "Arize Phoenix",
      "LangSmith",
      "W&B Weave",
      "Braintrust",
      "TruLens",
      "Ragas",
      "OpenTelemetry",
    ],
  },
  {
    n: 9,
    name: "Governance",
    discipline: "Security, guardrails and governance",
    headline: "Trust is architecture, not a policy document.",
    summary:
      "We engineer control, accountability and protection into every layer.",
    capabilities: [
      "Permissions",
      "Sandboxing",
      "Prompt-injection defence",
      "Data protection",
      "Auditability",
      "Policy enforcement",
    ],
    logic: ["Least privilege", "Safe execution", "Auditable decisions"],
    stack: [
      "NVIDIA NeMo Guardrails",
      "Guardrails AI",
      "Lakera",
      "Microsoft PyRIT",
      "Presidio",
      "Open Policy Agent",
      "HashiCorp Vault",
      "Amazon Bedrock Guardrails",
    ],
  },
  {
    n: 10,
    name: "Scale",
    discipline: "AI infrastructure and economics",
    headline: "AI economics must work before AI ambition can scale.",
    summary:
      "We optimise the infrastructure so intelligence stays fast, resilient and commercially viable.",
    capabilities: [
      "Deployment",
      "Model serving",
      "Latency",
      "Caching",
      "Token optimisation",
      "Inference-cost engineering",
    ],
    logic: [
      "Lower latency",
      "Higher utilisation",
      "Better unit economics",
    ],
    stack: [
      "Docker",
      "Kubernetes",
      "KServe",
      "NVIDIA Triton",
      "Ray Serve",
      "BentoML",
      "SkyPilot",
      "Vercel AI Gateway",
    ],
  },
];

export const domains = [
  {
    name: "Commerce and Finance",
    body: "Marketplaces, bookings, payments, fintech, and the trust and verification layer around every transaction.",
  },
  {
    name: "Digital Experience, Media and Growth",
    body: "Brand experiences, content and media platforms, streaming and publishing, community, engagement, and the growth systems that acquire and keep users.",
  },
  {
    name: "Health, Care and Wellbeing",
    body: "Care access, monitoring, coaching, fitness and wellbeing: systems people rely on for their health.",
  },
  {
    name: "Operations, Industry and Logistics",
    body: "Manufacturing, inventory, supply chains, fleets and field operations: the software that runs physical output.",
  },
  {
    name: "Physical and Connected Environments",
    body: "Property and the built environment, mobility, IoT and wearables, and safety and emergency response.",
  },
];

export const research = [
  {
    name: "AI and ML systems",
    body: "Agent runtimes, memory, evaluation and inference economics: the open questions that decide whether AI holds up in production.",
  },
  {
    name: "Mixed Reality",
    body: "Spatial interfaces that carry intelligence into the physical world, where people work, train and move.",
  },
];

export const processSteps = [
  { name: "Frame", body: "Find the valuable decision, workflow or experience." },
  { name: "Design", body: "Shape the interaction, context and control model." },
  { name: "Engineer", body: "Build the intelligence, agent and tool chain." },
  { name: "Prove", body: "Evaluate performance, safety and economics." },
  { name: "Operate", body: "Deploy, observe and improve in the real workflow." },
];

export const maturityPath = [
  "Opportunity",
  "Prototype",
  "Pilot",
  "Production",
  "Compounding",
];

export const principles = [
  { name: "Creativity", body: "Invent the approach." },
  { name: "Agility", body: "Shorten the learning loop." },
  { name: "Repeatability", body: "Repeat the system." },
];

export const sdlc = [
  { stage: "Brief", practice: "Requirements" },
  { stage: "Plan", practice: "Agentic planning" },
  { stage: "Design", practice: "Design systems" },
  { stage: "Build", practice: "AI-aided code" },
  { stage: "Review", practice: "Automated review" },
  { stage: "Release", practice: "Continuous delivery" },
];

export const sdlcTools = [
  "Claude Code",
  "Codex",
  "Cursor",
  "Claude for design",
  "Figma AI",
  "GitHub Actions",
  "Higgsfield",
  "Ollama",
];

export const team = [
  { name: "Leadership", body: "Sets direction and owns the outcome." },
  { name: "Engineering", body: "Full-stack, platform and infrastructure." },
  { name: "Design", body: "Product, interaction and brand systems." },
  {
    name: "Applied AI and Data",
    body: "Models, knowledge, agents and evaluation.",
  },
  {
    name: "Operations and QA",
    body: "Delivery, quality and reliability.",
  },
  { name: "Growth", body: "Positioning, content and go-to-market." },
];

export const selectedWork = [
  {
    slug: "prescribe-life",
    name: "Prescribe Life",
    domain: "Health, Care and Wellbeing",
    logo: "/logos/Prescribe Life Frame.png",
    summary:
      "An AI performance-intelligence platform for leadership coaches. Behavioural science, biometric data and an AI co-pilot flag burnout risk between sessions.",
  },
  {
    slug: "reform-ai",
    name: "Reform AI",
    domain: "Intelligence and Process",
    logo: "/logos/Reform Logos Final.png",
    summary:
      "Document intelligence that turns unstructured policy documents into decisions, with experts kept in the loop through review and exception handling.",
  },
  {
    slug: "kommerz-os",
    name: "Kommerz OS",
    domain: "Commerce and Finance",
    logo: "/logos/Komerz Frame.svg",
    summary:
      "An operating layer for multi-brand retail: inventory, storefronts and finance on one surface built around the merchant's day.",
  },
  {
    slug: "quicli",
    name: "Quicli",
    domain: "Operations, Industry and Logistics",
    logo: "/logos/Quicli Layer 2.jpg",
    summary:
      "A mobile command layer for field and service teams. One gesture captures the job, the client and the next step.",
  },
  {
    slug: "zimkey",
    name: "Zimkey",
    domain: "Physical and Connected Environments",
    logo: "/logos/Zimkey Final Logo.png",
    summary:
      "Mobile access for homes and small sites, designed around a single action: unlock, share, forget.",
  },
  {
    slug: "dd-group",
    name: "DD Group",
    domain: "Digital Experience, Media and Growth",
    logo: "/logos/DD Group Internal Designs.png",
    summary:
      "A brand system and digital showroom that carries a property group from boardroom to building site.",
  },
  {
    slug: "sochcast-campus-gal",
    name: "Sochcast / Campus Gal",
    domain: "Digital Experience, Media and Growth",
    logo: "/logos/Sochcast Campus Gal Logo.png",
    summary:
      "A campaign system that moves a podcast's voice from episode art to campus takeovers.",
  },
];

/** Visible on the page and mirrored in FAQPage structured data. Keep answers self-contained. */
export const faqs = [
  {
    q: "What is Asymmetri?",
    a: "Asymmetri is a hard problems technology company. It engineers AI systems, agents and digital products for global brands, across four areas: intelligence, process, experience and scale. Asymmetri works in three verticals: technology consulting and services, innovative products and solutions, and frontier R&D.",
  },
  {
    q: "What does a hard problems technology company do?",
    a: "A hard problems technology company takes on consequential problems that off-the-shelf tools cannot solve: workflows where AI has to decide and act, products people depend on every day, and systems that must work in the physical world. Asymmetri invents the approach, proves it, then makes it repeatable.",
  },
  {
    q: "What AI services does Asymmetri offer?",
    a: "Asymmetri engineers the full AI stack as ten connected layers: AI product and interaction design, data and knowledge architecture (RAG, vector search, knowledge graphs), model and inference engineering, context and memory, agent runtimes, multi-agent orchestration, tool integrations including MCP, evaluation and observability, security and governance, and AI infrastructure economics.",
  },
  {
    q: "How is Asymmetri different from an AI consultancy or a software agency?",
    a: "Asymmetri does not add AI around the edges or stop at demos. Strategy, design and engineering stay in one accountable loop, from framing the opportunity to operating the system in production, with evaluation, governance and unit economics built in from the start.",
  },
  {
    q: "Which industries does Asymmetri work in?",
    a: "Asymmetri works across five domains: commerce and finance; digital experience, media and growth; health, care and wellbeing; operations, industry and logistics; and physical and connected environments such as property, mobility, IoT and wearables.",
  },
  {
    q: "Which AI models and frameworks does Asymmetri use?",
    a: "Asymmetri is model-agnostic and lets the use case decide the architecture. Teams choose between OpenAI, Anthropic Claude, Google Gemini and open models served with vLLM, and build with tools such as LangGraph, the OpenAI Agents SDK, Model Context Protocol, Langfuse and Kubernetes. These are representative technologies, not a fixed stack.",
  },
  {
    q: "How does an engagement with Asymmetri work?",
    a: "Every engagement follows one loop: Frame, Design, Engineer, Prove and Operate. Asymmetri finds the valuable decision or workflow, shapes the interaction and control model, builds the intelligence and tool chain, evaluates performance, safety and cost, then deploys and improves it in the real workflow, moving from prototype to pilot to production.",
  },
  {
    q: "How do I start a project with Asymmetri?",
    a: "Send a short note about the problem through the contact page or email info@asymmetri.in. The first step is a framing conversation to find where AI or new technology creates real operating leverage, followed by a proposal for a prototype or pilot.",
  },
];

export const navLinks = [
  { label: "What we do", href: "/#what-we-do" },
  { label: "AI system", href: "/#ai-system" },
  { label: "Work", href: "/case-studies" },
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
];

/** The services accordion on the home page ("Bring us the hard problem"). */
export const services = [
  {
    id: "consulting",
    title: "Technology consulting and services",
    description:
      "Strategy, design and engineering in one team. We frame the hard problem, architect the system and ship it into production, AI-native from the first workshop.",
    tags: ["Strategy", "Architecture", "Product", "Engineering", "Delivery"],
    highlights: ["Problem framing", "System architecture", "Build and ship", "Operate and improve"],
    link: { label: "View case studies", href: "/case-studies" },
  },
  {
    id: "ai",
    title: "AI and agentic systems",
    description:
      "Ten connected layers, from interaction design and knowledge architecture to agents, orchestration, evaluation, governance and inference economics. We engineer the whole intelligence loop, not isolated demos.",
    tags: ["LLMs", "RAG", "Agents", "MCP", "Evals", "Guardrails"],
    highlights: ["Agent runtimes", "Multi-agent orchestration", "Knowledge and memory", "Evaluation and governance"],
    link: { label: "Explore the AI system", href: "/#ai-system" },
  },
  {
    id: "products",
    title: "Innovative products and solutions",
    description:
      "Products we design, build and operate, from AI copilots and agentic platforms to the tools we run our own company on, like FinishLine.",
    tags: ["Copilots", "Platforms", "SaaS", "Mobile", "FinishLine"],
    highlights: ["Product strategy", "Design systems", "Full-stack build", "Growth loops"],
    link: { label: "View case studies", href: "/case-studies" },
  },
  {
    id: "design",
    title: "Product, experience and interaction design",
    description:
      "Interfaces people transact with, depend on and trust: AI-native UX, copilots, approval flows and brand systems that make complex intelligence feel effortless.",
    tags: ["UX research", "UI systems", "Generative UI", "Brand", "Prototyping"],
    highlights: ["Conversational UX", "Human-in-the-loop flows", "Design systems", "Usability testing"],
    link: { label: "View case studies", href: "/case-studies" },
  },
  {
    id: "platform",
    title: "Platform engineering and scale",
    description:
      "Cloud, data and infrastructure that hold up from pilot to production: deployment, model serving, latency, caching and the unit economics that let ambition scale.",
    tags: ["Cloud", "Kubernetes", "Data", "Observability", "Security"],
    highlights: ["Infrastructure", "Model serving", "Cost engineering", "Reliability"],
    link: { label: "How we work", href: "/#how-we-work" },
  },
  {
    id: "rd-ai",
    title: "Frontier R&D: AI and ML systems",
    description:
      "Agent runtimes, memory, evaluation and inference economics: the open questions that decide whether AI holds up in production.",
    tags: ["Agents", "Memory", "Evaluation", "Inference", "Research"],
    highlights: ["Applied research", "Prototypes", "Benchmarks", "Production transfer"],
    link: { label: "Explore the AI system", href: "/#ai-system" },
  },
  {
    id: "rd-mr",
    title: "Frontier R&D: Mixed reality",
    description:
      "Spatial interfaces that carry intelligence into the physical world, where people work, train and move.",
    tags: ["Mixed reality", "Spatial UI", "3D", "Simulation", "Wearables"],
    highlights: ["Immersive UX", "3D interaction", "Spatial prototyping", "Connected devices"],
    link: { label: "Five domains", href: "/#domains" },
  },
];
