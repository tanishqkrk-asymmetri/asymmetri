"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Plus } from "lucide-react";
import { memo, useState } from "react";

import { services } from "@/lib/site-content";

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
              filter: "blur(6px)",
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
              // ease: "easeInOut",
              delay: i * 0.05,
            }}
            viewport={{
              once: true,
              // margin: "100%",
            }}
            key={service.id}
            className="border-b border-black/20 last:border-b-0 z-99999999 relative"
          >
            <h3>
              <button
                type="button"
                aria-expanded={isExpanded}
                aria-controls={`service-${service.id}`}
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
            </h3>

            {/* Always in the HTML so crawlers read it; collapsed with CSS. */}
            <div
              id={`service-${service.id}`}
              className={`grid bg-black transition-[grid-template-rows,opacity] duration-350 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
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
                        href={service.link.href}
                        className={`group inline-flex w-fit items-center gap-3 transition-opacity hover:opacity-80 ${
                          isCompact ? "text-sm" : "text-base"
                        }`}
                      >
                        {service.link.label}
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
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export const ServicesAccordion = memo(ServicesAccordionComponent);
