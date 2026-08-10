import type { Metadata } from "next";
import { Geist, Geist_Mono, Chakra_Petch } from "next/font/google";

import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import LS from "@/components/LS";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import chalk from "chalk";
import { art } from "@/lib/art";
import playSoundOnHover from "@/lib/sound";
import { Init } from "@/components/init";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const chakraPetch = Chakra_Petch({
  variable: "--font-chakra-petch",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://asymmetri.com",
  ),
  title: {
    default: "Asymmetri",
    template: "%s | Asymmetri",
  },
  description: "A full-stack collaborative agency for ambitious digital products.",
  applicationName: "Asymmetri",
  keywords: [
    "Asymmetri",
    "digital product agency",
    "product design",
    "web development",
    "branding",
  ],
  authors: [{ name: "Asymmetri" }],
  creator: "Asymmetri",
  publisher: "Asymmetri",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Asymmetri",
    description: "A full-stack collaborative agency for ambitious digital products.",
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
    description: "A full-stack collaborative agency for ambitious digital products.",
    images: ["/twitter-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${chakraPetch.variable} dark h-full antialiased`}
    >
      <Init></Init>
      <body className="min-h-full flex flex-col">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
