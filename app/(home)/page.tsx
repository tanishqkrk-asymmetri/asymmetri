import { HomeExperience } from "@/components/home/HomeExperience";
import { homeJsonLd, toJsonLdScript } from "@/lib/structured-data";
import { company } from "@/lib/site-content";
import type { Metadata } from "next";

const title = "Asymmetri | AI Engineering & Hard Problems Technology Company";
const description =
  "Asymmetri is a hard problems technology company. We engineer AI systems, agents and digital products for global brands, from strategy and design to production.";
const social = `${company.name}: ${company.tagline}`;

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/", types: { "text/markdown": "/llms.txt" } },
  openGraph: {
    title: social,
    description,
    url: "/",
    type: "website",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: social }],
  },
  twitter: {
    card: "summary_large_image",
    title: social,
    description,
    images: ["/twitter-image.png"],
  },
};

// Server wrapper: metadata and structured data live here, the scroll-driven
// experience is a client component. All of its copy is server-rendered into the
// initial HTML, so crawlers and AI answer engines can read it.
export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLdScript(homeJsonLd()) }}
      />
      <HomeExperience />
    </>
  );
}
