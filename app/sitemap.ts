import type { MetadataRoute } from "next";
import { getCaseStudySlugs } from "@/lib/case-studies";
import { SITE_URL } from "@/lib/site-content";
import { practices } from "@/lib/practices";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = (
    [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/case-studies`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/careers`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/careers/positions`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/contact-us`, changeFrequency: "yearly", priority: 0.7 },
    ] as const
  ).map((p) => ({ ...p, lastModified: now }));

  const caseStudies: MetadataRoute.Sitemap = getCaseStudySlugs().map((slug) => ({
    url: `${SITE_URL}/case-studies/${slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const practicePages: MetadataRoute.Sitemap = practices.map((p) => ({
    url: `${SITE_URL}${p.href}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  return [...pages, ...practicePages, ...caseStudies];
}
