import s from "./manifesto.module.css";

export type PillarKind = "intelligence" | "process" | "experience" | "scale";

/**
 * A small mark per pillar, 40×40, stroke only. Still when idle; when its
 * pillar is the one just named it runs a short loop in red:
 * intelligence (a decision tree picks one path), process (tokens pass a
 * gate in step), experience (a touch ripples from wrist to room), scale
 * (one slash becomes four, then sixteen).
 */
export function PillarGlyph({ kind, active, className }: { kind: PillarKind; active: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={`${s.glyph} ${className ?? ""}`}
      data-active={active}
      aria-hidden
    >
      {kind === "intelligence" && (
        <>
          <rect x="4" y="18" width="4" height="4" fill="currentColor" stroke="none" />
          <path className={s.pruned} d="M8 20 L20 9 L32 9" strokeDasharray="2 2" />
          <path className={s.pruned} d="M8 20 L20 31 L32 31" strokeDasharray="2 2" />
          <path className={s.branch} data-red d="M8 20 L20 20 L32 20" />
          <rect className={s.pruned} x="32" y="7" width="4" height="4" />
          <rect className={s.pruned} x="32" y="29" width="4" height="4" />
          <rect data-red data-red-fill x="32" y="18" width="4" height="4" fill="currentColor" />
        </>
      )}
      {kind === "process" && (
        <>
          <path d="M3 20 H37" strokeOpacity={0.35} />
          <path data-red d="M22 11 V29" strokeWidth={2.5} />
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              className={s.token}
              x="4"
              y="17.5"
              width="5"
              height="5"
              fill="currentColor"
              stroke="none"
              style={{ animationDelay: `${-i * 0.8}s` }}
            />
          ))}
        </>
      )}
      {kind === "experience" && (
        <>
          {[
            [17, 16, 6, 8],
            [13, 10, 14, 20],
            [4, 6, 32, 28],
          ].map(([x, y, w, h], i) => (
            <rect
              key={i}
              className={s.frame}
              x={x}
              y={y}
              width={w}
              height={h}
              style={{ animationDelay: `${i * 0.22}s` }}
            />
          ))}
          <rect data-red data-red-fill x="19" y="19" width="2" height="2" fill="currentColor" stroke="none" />
        </>
      )}
      {kind === "scale" && (
        <>
          {Array.from({ length: 16 }, (_, i) => {
            const cx = 7 + (i % 4) * 8.7;
            const cy = 7 + Math.floor(i / 4) * 8.7;
            const r = i % 4;
            const c = Math.floor(i / 4);
            const seed = r === 1 && c === 1;
            const gen1 = !seed && r <= 2 && c <= 2 && r >= 1 && c >= 1;
            return (
              <path
                key={i}
                className={`${s.cell} ${seed ? s.seed : gen1 ? s.gen1 : s.gen2}`}
                d={`M${cx - 1.6} ${cy - 3.2} L${cx + 1.6} ${cy + 3.2}`}
                strokeWidth={1.8}
              />
            );
          })}
        </>
      )}
    </svg>
  );
}
