import type { Metadata } from "next";

const description =
  "Open roles at Asymmetri: remote jobs in engineering, design, applied AI and data, operations and growth at a flat, async-first hard problems technology company.";

export const metadata: Metadata = {
  title: { default: "Open Roles: Remote Jobs at Asymmetri", template: "%s | Asymmetri Careers" },
  description,
  openGraph: {
    title: "Open roles at Asymmetri",
    description,
    url: "/careers/positions",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Open roles at Asymmetri" }],
  },
};

export default function PositionsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
