import { AiExperience } from "@/components/practice/ai/AiExperience";
import { faqs } from "@/components/practice/ai/content";
import { getPractice } from "@/lib/practices";
import { practiceJsonLd, practiceMetadata } from "@/lib/practice-seo";
import { toJsonLdScript } from "@/lib/structured-data";

const practice = getPractice("ai-agentic-systems-and-data");

export const metadata = practiceMetadata(practice);

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLdScript(practiceJsonLd(practice, faqs)) }}
      />
      <AiExperience />
    </>
  );
}
