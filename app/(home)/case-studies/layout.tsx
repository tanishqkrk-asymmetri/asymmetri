import type { Metadata } from "next";

const description =
  "Case studies from Asymmetri: AI platforms, products and digital systems built across health, commerce, operations, media and connected environments.";

export const metadata: Metadata = {
  title: "Work and Case Studies",
  description,
  alternates: { canonical: "/case-studies" },
  openGraph: {
    title: "Work and Case Studies | Asymmetri",
    description,
    url: "/case-studies",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Asymmetri" }],
  },
};

export default function CaseStudiesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
