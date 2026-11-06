import {
  SITE_URL,
  aiLayers,
  company,
  domains,
  faqs,
  pillars,
} from "@/lib/site-content";
import { practices } from "@/lib/practices";

const orgId = `${SITE_URL}/#organization`;
const siteId = `${SITE_URL}/#website`;

export function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: company.name,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}${company.logo}`,
          width: 512,
          height: 512,
        },
        image: `${SITE_URL}/opengraph-image.png`,
        slogan: company.tagline,
        description: company.definition,
        founder: {
          "@type": "Person",
          name: "Nandagopal P",
          jobTitle: "Founder and CEO",
          url: "https://www.nandagopalp.com",
        },
        email: company.email,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          email: company.email,
          url: `${SITE_URL}/contact-us`,
        },
        areaServed: "Worldwide",
        knowsAbout: [
          "Artificial intelligence",
          "Applied AI engineering",
          "AI agents",
          "Multi-agent orchestration",
          "Retrieval-augmented generation",
          "LLM evaluation and observability",
          "AI governance and guardrails",
          "Model Context Protocol",
          "Product design",
          "Software engineering",
          "Mixed reality",
          ...pillars.map((p) => p.name),
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Asymmetri services",
          itemListElement: [
            ...practices.map((p) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                "@id": `${SITE_URL}${p.href}#service`,
                name: p.name,
                description: p.summary,
                url: `${SITE_URL}${p.href}`,
                provider: { "@id": orgId },
              },
            })),
            {
              "@type": "OfferCatalog",
              name: "The Asymmetri AI system",
              itemListElement: aiLayers.map((l) => ({
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: l.discipline,
                  serviceType: l.name,
                  description: `${l.summary} ${l.headline}`,
                  provider: { "@id": orgId },
                },
              })),
            },
          ],
        },
      },
      {
        "@type": "WebSite",
        "@id": siteId,
        url: SITE_URL,
        name: company.name,
        description: company.shortDescription,
        publisher: { "@id": orgId },
        inLanguage: "en",
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: `${company.name}: ${company.tagline}`,
        description: company.definition,
        isPartOf: { "@id": siteId },
        about: { "@id": orgId },
        primaryImageOfPage: `${SITE_URL}/opengraph-image.png`,
        inLanguage: "en",
        mentions: domains.map((d) => ({ "@type": "Thing", name: d.name })),
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        isPartOf: { "@id": `${SITE_URL}/#webpage` },
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}

/** Serialise JSON-LD safely for an inline <script> tag. */
export function toJsonLdScript(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
