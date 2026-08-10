import type { Metadata } from "next";

import LS from "@/components/LS";

export const metadata: Metadata = {
  title: {
    absolute: "Asymmetri",
  },
  description:
    "A full-stack collaborative agency that turns ambitious ideas into thoughtful digital products.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Asymmetri",
    description:
      "A full-stack collaborative agency that turns ambitious ideas into thoughtful digital products.",
    url: "/",
    type: "website",
    locale: "en_US",
    siteName: "Asymmetri",
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
    title: "Asymmetri",
    description:
      "A full-stack collaborative agency that turns ambitious ideas into thoughtful digital products.",
    images: ["/twitter-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      {/* <LS></LS> */}
      {children}
    </main>
  );
}
