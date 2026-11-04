import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Work on hard problems at Asymmetri. Open roles in engineering, design, applied AI and data, and operations at a technology company building AI systems and products for global brands.",
  alternates: {
    canonical: "/careers",
  },
  openGraph: {
    title: "Careers at Asymmetri",
    description:
      "Join a lean team of engineers, designers and applied AI specialists solving hard problems for global brands.",
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
      "Join a lean team of engineers, designers and applied AI specialists solving hard problems for global brands.",
    images: ["/twitter-image.png"],
  },
};

export default function CareersLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
