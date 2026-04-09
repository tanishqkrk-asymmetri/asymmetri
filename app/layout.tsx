import type { Metadata } from "next";
import { Geist, Geist_Mono, Chakra_Petch } from "next/font/google";

import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import LS from "@/components/LS";

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
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${chakraPetch.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LS></LS>
        <TooltipProvider>
          <Navbar />
          {children}
          <Footer></Footer>
        </TooltipProvider>
      </body>
    </html>
  );
}
