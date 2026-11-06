"use client";

import { FaqBlock } from "@/components/home/FaqBlock";

export function Faq() {
  return (
    <section data-chapter="FAQ" data-nav="light" aria-labelledby="faq-title" className="relative bg-white">
      <FaqBlock />
    </section>
  );
}
