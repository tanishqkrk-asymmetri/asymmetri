import { RndExperience } from "@/components/practice/rnd/RndExperience";
import { faqs } from "@/components/practice/rnd/content";
import { getPractice } from "@/lib/practices";
import { practiceJsonLd, practiceMetadata } from "@/lib/practice-seo";
import { toJsonLdScript } from "@/lib/structured-data";

const practice = getPractice("innovation-and-rd");

export const metadata = practiceMetadata(practice);

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLdScript(practiceJsonLd(practice, faqs)) }}
      />
      <RndExperience />
    </>
  );
}
