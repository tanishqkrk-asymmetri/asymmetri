import { AppDevExperience } from "@/components/practice/app-dev/AppDevExperience";
import { faqs } from "@/components/practice/app-dev/content";
import { getPractice } from "@/lib/practices";
import { practiceJsonLd, practiceMetadata } from "@/lib/practice-seo";
import { toJsonLdScript } from "@/lib/structured-data";

const practice = getPractice("application-development");

export const metadata = practiceMetadata(practice);

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLdScript(practiceJsonLd(practice, faqs)) }}
      />
      <AppDevExperience />
    </>
  );
}
