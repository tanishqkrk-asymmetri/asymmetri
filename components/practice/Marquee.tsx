import type { ReactNode } from "react";

type Props = {
  items: ReactNode[];
  /** Seconds per loop. */
  speed?: number;
  reverse?: boolean;
  className?: string;
  itemClassName?: string;
  /** Separator rendered between items. */
  separator?: ReactNode;
};

/** CSS-only infinite marquee. Pauses on hover, stops for reduced motion. */
export function Marquee({
  items,
  speed = 40,
  reverse = false,
  className,
  itemClassName = "",
  separator = <span className="text-asymmetri-red">✕</span>,
}: Props) {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((it, i) => (
        <li key={i} className={`flex shrink-0 items-center gap-8 pr-8 ${itemClassName}`}>
          {it}
          {separator}
        </li>
      ))}
    </ul>
  );
  return (
    <div
      className={`kit-marquee-host relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)] ${className ?? ""}`}
    >
      <div
        className={`kit-marquee flex w-max ${reverse ? "kit-marquee-reverse" : ""}`}
        style={{ ["--kit-marquee-speed" as string]: `${speed}s` }}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
