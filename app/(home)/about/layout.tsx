import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Asymmetri, a hard problems technology company: a lean core of engineers, designers and applied AI specialists building AI systems and products for global brands.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Asymmetri",
    description:
      "A lean operating core of engineers, designers and applied AI specialists, extended by specialists, solving hard problems for global brands.",
    url: "/about",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Asymmetri",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Asymmetri",
    description:
      "A lean operating core of engineers, designers and applied AI specialists, extended by specialists, solving hard problems for global brands.",
    images: ["/twitter-image.png"],
  },
};

export default function AboutLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
