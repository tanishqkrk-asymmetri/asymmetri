"use client";

import { forwardRef, useState } from "react";
import { Plus } from "lucide-react";
import { T } from "@/components/Text";
import { company, faqs } from "@/lib/site-content";

/**
 * FAQ in the style of the services accordion. Answers always stay in the HTML
 * (collapsed with CSS), so search engines and AI answer engines can read them.
 */
export const FaqBlock = forwardRef<HTMLElement>(function FaqBlock(_, ref) {
  const [open, setOpen] = useState<number | null>(0);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      ref={ref}
      id="faq"
      aria-labelledby="faq-title"
      className="relative bg-white font-chakra-petch text-black"
    >
      <div className="px-6 md:px-26">
        <div className="grid gap-12 border-x border-black/20 px-6 py-28 md:px-8 lg:grid-cols-[1fr_1.5fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2
              id="faq-title"
              className="text-5xl font-semibold uppercase leading-none md:text-7xl"
            >
              <T as="span" className="block text-asymmetri-red">
                Questions,
              </T>
              <T as="span" delay={0.15} className="block">
                answered.
              </T>
            </h2>
            <T delay={0.3} className="mt-6 max-w-xs text-lg text-black/60">
              Can&apos;t find yours? Write to{" "}
              <a
                href={`mailto:${company.email}`}
                className="text-asymmetri-red underline-offset-4 hover:underline"
              >
                {company.email}
              </a>
            </T>
          </div>

          <div className="border-y border-black/20">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              const isHovered = hovered === i && !isOpen;
              return (
                <T
                  key={f.q}
                  delay={i * 0.04}
                  className="border-b border-black/20 last:border-b-0"
                >
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-a-${i}`}
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className={`sound flex w-full cursor-pointer items-center justify-between gap-6 px-6 py-6 text-left text-lg transition-colors duration-200 md:px-8 ${
                        isOpen
                          ? "bg-black text-white"
                          : isHovered
                            ? "bg-black text-white"
                            : "bg-transparent text-black"
                      }`}
                    >
                      <span className="font-medium">{f.q}</span>
                      <Plus
                        className={`size-5 shrink-0 stroke-[1.5] transition-transform duration-200 ${isOpen ? "rotate-45 text-asymmetri-red" : ""}`}
                      />
                    </button>
                  </h3>
                  <div
                    id={`faq-a-${i}`}
                    className={`grid bg-black transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden">
                      <p
                        className={`max-w-3xl px-6 pb-8 font-geist text-base leading-relaxed text-white/80 transition-opacity duration-300 md:px-8 ${isOpen ? "opacity-100" : "opacity-0"}`}
                      >
                        {f.a}
                      </p>
                    </div>
                  </div>
                </T>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
});
