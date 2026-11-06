"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { company } from "@/lib/site-content";
import { SectionHead } from "./SectionHead";

export type FaqItem = { q: string; a: string };

/**
 * Practice FAQ. Answers always stay in the HTML (collapsed with CSS) so
 * search and AI answer engines can read them; mirror them in FAQPage JSON-LD.
 */
export function PracticeFaq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section
      data-chapter="Questions"
      aria-labelledby="practice-faq"
      className="bg-white px-6 py-28 text-black md:px-16 md:py-36"
    >
      <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr]">
        <div className="lg:sticky lg:top-28 lg:self-start" id="practice-faq">
          <SectionHead
            tone="light"
            align="left"
            kicker="FAQ"
            title={[["Questions,"], "answered."]}
            body={
              <>
                Something else on your mind? Write to{" "}
                <a href={`mailto:${company.email}`} className="text-asymmetri-red underline underline-offset-4">
                  {company.email}
                </a>
                .
              </>
            }
          />
        </div>
        <ul className="border-t border-black/20">
          {items.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q} className="border-b border-black/20">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`pfaq-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left font-chakra-petch text-lg font-semibold md:text-2xl"
                  >
                    <span className="flex gap-5">
                      <span className="pt-1 font-mono text-[10px] text-asymmetri-red md:text-xs">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        {f.q}
                      </span>
                    </span>
                    <Plus
                      className={`size-5 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-45 text-asymmetri-red" : ""}`}
                    />
                  </button>
                </h3>
                <div
                  id={`pfaq-${i}`}
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <p className="overflow-hidden pl-9 font-geist text-base leading-relaxed text-black/70 md:pl-11 md:text-lg">
                    <span className="block pb-7">{f.a}</span>
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
