"use client";

import { useEffect, useState } from "react";

type CursorSpec = {
  id: string;
  leftPct: number;
  topPct: number;
  delayMs: number;
};

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function FatCursors() {
  const [cursors, setCursors] = useState<CursorSpec[]>([]);

  useEffect(() => {
    const count = randInt(3, 5);
    const next: CursorSpec[] = Array.from({ length: count }).map((_, i) => ({
      id: `fat-cursor-${i}`,
      leftPct: randFloat(8, 92),
      topPct: randFloat(10, 90),
      delayMs: randInt(0, 900),
    }));
    setCursors(next);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-999 ">
      {cursors.map((c) => (
        <span
          key={c.id}
          className="fat-cursor"
          style={{
            left: `${c.leftPct}%`,
            top: `${c.topPct}%`,
            animationDelay: `${c.delayMs}ms`,
          }}
        />
      ))}
    </div>
  );
}
