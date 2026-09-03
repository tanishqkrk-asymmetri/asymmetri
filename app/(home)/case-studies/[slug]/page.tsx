import { CaseStudyTemplate } from "@/components/CaseStudyTemplate";
import { getCaseStudy, getCaseStudySlugs } from "@/lib/case-studies";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return { title: "Case Study" };

  const description =
    study.sections.find((section) => section.paragraphs?.length)
      ?.paragraphs?.[0] ?? `${study.name} case study by Asymmetri.`;

  return {
    title: "Asymmetri Case Study - " + study.name,
    description,
    alternates: { canonical: `/case-studies/${study.slug}` },
    openGraph: {
      title: `${study.name} | Asymmetri`,
      description,
      url: `/case-studies/${study.slug}`,
      images: [{ url: study.img, alt: study.name }],
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();
  return <CaseStudyTemplate study={study} />;
}
