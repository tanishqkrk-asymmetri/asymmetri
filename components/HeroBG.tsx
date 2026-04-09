"use client";

import dynamic from "next/dynamic";

const Spline = dynamic(() => import("@splinetool/react-spline/next"), {
  ssr: false,
});

export default function App() {
  return (
    <main>
      <Spline scene="/scene.splinecode" />
    </main>
  );
}
