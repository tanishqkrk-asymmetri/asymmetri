import type { Metadata } from "next";
import { SITE_URL, company } from "@/lib/site-content";
import type { Practice } from "@/lib/practices";

/** Page metadata for a practice page. */
export function practiceMetadata(p: Practice): Metadata {
  const title = p.seo.title;
  const social = `${p.name} | ${company.name}`;
  return {
    title,
    description: p.seo.description,
    keywords: p.seo.keywords,
    alternates: { canonical: p.href },
    openGraph: {
      title: social,
      description: p.seo.description,
      url: p.href,
      type: "website",
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: social }],
    },
    twitter: {
      card: "summary_large_image",
      title: social,
      description: p.seo.description,
      images: ["/twitter-image.png"],
    },
  };
}

/** Service + breadcrumb + FAQ structured data for a practice page. */
export function practiceJsonLd(p: Practice, faqs: { q: string; a: string }[] = []) {
  const url = `${SITE_URL}${p.href}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: p.name,
        serviceType: p.name,
        description: p.summary,
        url,
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: "Worldwide",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `${p.name} capabilities`,
          itemListElement: p.capabilities.map((c) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: c },
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "What we do", item: `${SITE_URL}/#what-we-do` },
          { "@type": "ListItem", position: 3, name: p.name, item: url },
        ],
      },
      ...(faqs.length
        ? [
            {
              "@type": "FAQPage",
              "@id": `${url}#faq`,
              mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]
        : []),
    ],
  };
}
