import type { Metadata } from "next";

const description =
  "Bring Asymmetri a hard problem. Contact us about AI systems, agents, products or frontier R&D, or email info@asymmetri.in.";

export const metadata: Metadata = {
  title: "Contact",
  description,
  alternates: { canonical: "/contact-us" },
  openGraph: {
    title: "Contact Asymmetri",
    description,
    url: "/contact-us",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Asymmetri" }],
  },
};

export default function ContactLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
