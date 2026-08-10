import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Build work that matters at Asymmetri. Explore opportunities for designers, developers, and collaborators who want to shape meaningful digital products.",
  alternates: {
    canonical: "/careers",
  },
  openGraph: {
    title: "Careers at Asymmetri",
    description:
      "Join a close-knit team of designers and developers building meaningful digital products.",
    url: "/careers",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Careers at Asymmetri",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers at Asymmetri",
    description:
      "Join a close-knit team of designers and developers building meaningful digital products.",
    images: ["/twitter-image.png"],
  },
};

export default function CareersLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
