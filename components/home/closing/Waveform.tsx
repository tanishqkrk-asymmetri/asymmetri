/**
 * A "voice print" generated from a quote's own text: one bar per letter,
 * shaped by its word (longer words speak louder) and its letter (vowels open
 * up, consonants clip), with a gap at every space and a shorter echo below
 * the baseline that swells after punctuation. Asymmetric on purpose, and
 * decorative only.
 */
export function waveBars(text: string, max = 160): [number, number][] {
  const bars: [number, number][] = [];
  const words = text.split(/\s+/).filter(Boolean);
  words.forEach((w, wi) => {
    const letters = [...w];
    const env = Math.min(1, 0.45 + letters.length / 14);
    letters.forEach((ch, ci) => {
      const lower = ch.toLowerCase();
      const weight = /[aeiouy]/.test(lower)
        ? 1
        : /[bdfhklt]/.test(lower)
          ? 0.78
          : /[\p{L}\p{N}]/u.test(ch)
            ? 0.55
            : 0.2;
      // Swell towards the middle of each word.
      const arc = Math.sin(((ci + 0.5) / letters.length) * Math.PI) * 0.35 + 0.65;
      const up = Math.min(1, 0.08 + env * weight * arc);
      const pause = /[.,;:!?)]/.test(ch) ? 0.45 : 0;
      bars.push([up, Math.min(1, up * 0.36 + pause)]);
    });
    if (wi < words.length - 1) bars.push([0.04, 0.02]);
  });
  if (bars.length <= max) return bars;
  // Long quotes: merge neighbours so the print keeps its shape.
  const step = bars.length / max;
  return Array.from({ length: max }, (_, i) => {
    const slice = bars.slice(Math.floor(i * step), Math.max(Math.floor((i + 1) * step), Math.floor(i * step) + 1));
    return [
      Math.max(...slice.map((b) => b[0])),
      Math.max(...slice.map((b) => b[1])),
    ];
  });
}

export function Waveform({
  bars,
  className,
  fill = "currentColor",
}: {
  bars: [number, number][];
  className?: string;
  fill?: string;
}) {
  const w = 4;
  return (
    <svg
      viewBox={`0 0 ${bars.length * w} 100`}
      preserveAspectRatio="none"
      className={className}
      aria-hidden
    >
      {bars.map(([up, down], i) => {
        // Rounded so server and client render identical attributes.
        const u = Math.round(up * 6200) / 100;
        const d = Math.round(Math.max(down * 33, 1.5) * 100) / 100;
        return (
          <g key={i} fill={fill}>
            <rect x={i * w + 0.7} y={Math.round((64 - u) * 100) / 100} width={w - 1.4} height={u} />
            <rect x={i * w + 0.7} y={67} width={w - 1.4} height={d} />
          </g>
        );
      })}
    </svg>
  );
}
