"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Plus } from "lucide-react";
import { memo, useState } from "react";

type ServiceItem = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  highlights: string[];
  image: string;
};

const services: ServiceItem[] = [
  {
    id: "webapp",
    title: "WebApp & SaaS Development",
    description:
      "We specialise in creating branding that resonates and connects. Our user experience design is focused on delivering seamless interactions, while our interface design marries functionality with visual appeal.",
    tags: [
      "Web-Design",
      "Web-Design",
      "Web-Design",
      "Web-Design",
      "Web-Design",
    ],
    highlights: ["web design", "Stack", "Web Animation", "Product Strategy"],
    image: "/services-accordion-visual.png",
  },
  {
    id: "custom-website",
    title: "Custom Website Development",
    description:
      "From marketing sites to complex web platforms, we craft digital experiences that load fast, rank well, and convert visitors into customers with precision and polish.",
    tags: ["Frontend", "CMS", "SEO", "Performance", "Responsive"],
    highlights: ["Landing Pages", "Stack", "Headless CMS", "Core Web Vitals"],
    image: "/services-accordion-visual.png",
  },
  {
    id: "mobile",
    title: "Mobile App Development",
    description:
      "Native and cross-platform apps built for real users — intuitive flows, reliable performance, and the kind of polish people expect from products they use every day.",
    tags: ["iOS", "Android", "React Native", "Flutter", "App Store"],
    highlights: ["Native UX", "Stack", "Push & Offline", "Product Strategy"],
    image: "/services-accordion-visual.png",
  },
  {
    id: "ai",
    title: "AI & Agentic Systems",
    description:
      "Intelligent systems that automate workflows, augment teams, and deliver measurable outcomes — from LLM integrations to autonomous agents that actually ship.",
    tags: ["LLMs", "Agents", "RAG", "Automation", "MLOps"],
    highlights: ["AI Integration", "Stack", "Workflow Design", "Evaluation"],
    image: "/services-accordion-visual.png",
  },
  {
    id: "emerging",
    title: "Emerging Tech (AR/VR, Simulation, Blockchain)",
    description:
      "Immersive experiences and decentralized systems for teams pushing into new territory — prototypes, pilots, and production-ready builds across emerging platforms.",
    tags: ["AR/VR", "Web3", "Simulation", "Unity", "Spatial"],
    highlights: ["Immersive UX", "Stack", "3D Interaction", "Prototyping"],
    image: "/services-accordion-visual.png",
  },
  {
    id: "design",
    title: "UI/UX & Product Design",
    description:
      "Research-led design that clarifies complexity and makes products feel inevitable — wireframes to high-fidelity systems, design tokens to shipped interfaces.",
    tags: ["UX Research", "UI Systems", "Prototyping", "Design Ops", "Figma"],
    highlights: ["User Flows", "Stack", "Design Systems", "Usability Testing"],
    image: "/services-accordion-visual.png",
  },
  {
    id: "marketing",
    title: "Digital Marketing & SEO",
    description:
      "Growth strategies grounded in data — search visibility, content that ranks, campaigns that convert, and analytics that tell you what's actually working.",
    tags: ["SEO", "Content", "Analytics", "Paid Media", "CRO"],
    highlights: ["Search Strategy", "Stack", "Content Ops", "Conversion"],
    image: "/services-accordion-visual.png",
  },
];

type ServicesAccordionProps = {
  isCompact?: boolean;
};

function ServicesAccordionComponent({ isCompact }: ServicesAccordionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  return (
    <div className="w-full border-y border-black/20">
      {services.map((service, i) => {
        const isExpanded = expandedId === service.id;
        const isHovered = hoveredId === service.id && !isExpanded;

        return (
          <motion.div
            initial={{
              filter: "blur(12px)",
              y: 20,
              opacity: 0,
            }}
            whileInView={{
              filter: "blur(0)",
              y: 0,
              opacity: 1,
            }}
            transition={{
              type: "tween",
              duration: 0.6,
              ease: "easeInOut",
              delay: i * 0.05,
            }}
            viewport={{
              once: true,
              // margin: "100%",
            }}
            key={service.id}
            className="border-b border-black/20 last:border-b-0 z-99999999 relative"
          >
            <button
              type="button"
              aria-expanded={isExpanded}
              onMouseEnter={() => setHoveredId(service.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => toggle(service.id)}
              className={`flex w-full items-center justify-between px-8 text-left transition-colors duration-200 sound cursor-pointer  ${
                isCompact ? "py-6 text-base" : "py-8 text-lg"
              } ${
                isExpanded
                  ? "bg-white text-black"
                  : isHovered
                    ? "bg-black text-white"
                    : "bg-transparent text-black"
              }`}
            >
              <span className="font-medium">{service.title}</span>
              <Plus
                className={`size-5 shrink-0 stroke-[1.5] transition-transform duration-200 ${
                  isExpanded ? "rotate-45" : ""
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden bg-black"
                >
                  <div
                    className={`grid text-white ${
                      isCompact
                        ? "grid-cols-1 gap-8 px-6 py-8"
                        : "grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.4fr)] gap-10 px-10 py-12"
                    }`}
                  >
                    <div className="space-y-6 flex flex-col justify-between">
                      <p
                        className={`leading-relaxed text-white/90 ${
                          isCompact ? "text-sm" : "text-base"
                        }`}
                      >
                        {service.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {service.tags.map((tag, index) => (
                          <span
                            key={`${tag}-${index}`}
                            className="rounded bg-[#1a1a1a] px-3 py-1.5 text-sm text-white"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div
                      className={`flex flex-col justify-between ${
                        isCompact ? "gap-6" : "gap-10"
                      }`}
                    >
                      <ul className="space-y-2">
                        {service.highlights.map((item) => (
                          <li
                            key={item}
                            className={`flex items-center gap-2 capitalize ${
                              isCompact ? "text-sm" : "text-base"
                            }`}
                          >
                            <span className="size-1.5 shrink-0 rounded-full bg-white" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <a
                        href="#"
                        className={`group inline-flex w-fit items-center gap-3 transition-opacity hover:opacity-80 ${
                          isCompact ? "text-sm" : "text-base"
                        }`}
                      >
                        View Case Studies
                        <span className="flex size-8 items-center justify-center rounded-full border border-asymmetri-red">
                          <ArrowUpRight className="size-4 text-asymmetri-red" />
                        </span>
                      </a>
                    </div>

                    <div
                      className={`relative overflow-hidden bg-[#111] ${
                        isCompact ? "aspect-[4/3] w-full" : "min-h-[280px]"
                      }`}
                    >
                      <img
                        src={"/placeholder.png"}
                        alt=""
                        className="size-full object-cover object-center"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

export const ServicesAccordion = memo(ServicesAccordionComponent);
