import { ConsultingExperience } from "@/components/practice/consulting/ConsultingExperience";
import { faqs } from "@/components/practice/consulting/content";
import { getPractice } from "@/lib/practices";
import { practiceJsonLd, practiceMetadata } from "@/lib/practice-seo";
import { toJsonLdScript } from "@/lib/structured-data";

const practice = getPractice("technology-consulting");

export const metadata = practiceMetadata(practice);

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLdScript(practiceJsonLd(practice, faqs)) }}
      />
      <ConsultingExperience />
    </>
  );
}
