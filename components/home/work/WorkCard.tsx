import type { CSSProperties, FocusEventHandler, Ref } from "react";
import { selectedWork } from "@/lib/site-content";
import { Cover } from "./covers";

export type Work = (typeof selectedWork)[number];

const pad = (n: number) => String(n).padStart(2, "0");

/** One case study as a card: generative cover on top, real copy below. */
export function WorkCard({
  w,
  i,
  on,
  style,
  className = "",
  cardRef,
  onFocus,
}: {
  w: Work;
  i: number;
  on: boolean;
  style?: CSSProperties;
  className?: string;
  cardRef?: Ref<HTMLAnchorElement>;
  onFocus?: FocusEventHandler<HTMLAnchorElement>;
}) {
  return (
    <a
      ref={cardRef}
      href={`/case-studies/${w.slug}`}
      onFocus={onFocus}
      style={style}
      className={`group @container block outline-none focus-visible:ring-4 focus-visible:ring-white ${className}`}
    >
      <article className="flex size-full flex-col border border-white/25 bg-[#0a0a0a] text-white shadow-[0_50px_90px_-40px_rgba(0,0,0,0.85)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-3">
        <div className="relative h-[50%] shrink-0 border-b border-white/15">
          <Cover slug={w.slug} logo={w.logo} index={i} on={on} />
        </div>
        <div className="flex min-h-0 flex-1 flex-col p-[5.5cqw]">
          <div className="flex items-center justify-between font-mono text-[max(8px,2.6cqw)] uppercase tracking-[0.25em] text-white/45">
            <span>W.{pad(i + 1)} · Case study</span>
            <span className="text-asymmetri-red">{pad(i + 1)}/{pad(selectedWork.length)}</span>
          </div>
          <h3 className="kit-glitch mt-[3cqw] font-chakra-petch text-[min(8.4cqw,2.4rem)] leading-[0.92] font-bold uppercase">
            {w.name}
          </h3>
          <p className="mt-[2cqw] font-mono text-[max(8px,2.7cqw)] uppercase tracking-[0.2em] text-asymmetri-red">
            {w.domain}
          </p>
          <p className="mt-[3cqw] line-clamp-3 font-geist text-[max(11px,min(3.9cqw,15px))] leading-snug text-white/65">
            {w.summary}
          </p>
          <span className="mt-auto flex items-center justify-between border-t border-white/15 pt-[3cqw] font-mono text-[max(8px,2.6cqw)] uppercase tracking-[0.25em]">
            <span>Read the case study</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
              →
            </span>
          </span>
        </div>
      </article>
    </a>
  );
}
