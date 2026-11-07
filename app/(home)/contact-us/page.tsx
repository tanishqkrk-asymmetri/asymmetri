import type { Metadata } from "next";
import { ContactExperience } from "@/components/contact/ContactExperience";
import { contactDefinition, contactFaqs, contactSeo } from "@/components/contact/content";
import { contactJsonLd, toJsonLdScript } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: { absolute: `${contactSeo.title} | Asymmetri` },
  description: contactSeo.description,
  keywords: contactSeo.keywords,
  alternates: { canonical: "/contact-us" },
  openGraph: {
    title: contactSeo.social,
    description: contactSeo.description,
    url: "/contact-us",
    type: "website",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: contactSeo.social }],
  },
  twitter: {
    card: "summary_large_image",
    title: contactSeo.social,
    description: contactSeo.description,
    images: ["/twitter-image.png"],
  },
};

export default function ContactPage() {
  const jsonLd = contactJsonLd({
    name: contactSeo.title,
    description: contactDefinition,
    faqs: contactFaqs,
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLdScript(jsonLd) }} />
      <ContactExperience />
    </>
  );
}
