import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Asymmetri: a collaborative team of designers and developers building thoughtful digital products that solve meaningful business problems.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Asymmetri",
    description:
      "Meet the collaborative team behind thoughtful digital products built to solve meaningful business problems.",
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
      "Meet the collaborative team behind thoughtful digital products built to solve meaningful business problems.",
    images: ["/twitter-image.png"],
  },
};

export default function AboutLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
