import type { Metadata } from "next";
import LS from "@/components/LS";

export const metadata: Metadata = {
  title: "Asymmetri",
  openGraph: {
    title: "Asymmetri",
    description: "Let’s turn your ideas into beautiful asymmetry.",
    locale: "en",
    siteName: "Asymmetri",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: "Asymmetri",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <LS></LS>
      {children}
    </main>
  );
}
