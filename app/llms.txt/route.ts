import {
  SITE_URL,
  aiLayers,
  company,
  domains,
  faqs,
  pillars,
  pointOfView,
  processSteps,
  research,
  selectedWork,
} from "@/lib/site-content";
import { practices } from "@/lib/practices";

// llms.txt (https://llmstxt.org): a plain-markdown brief for AI assistants and
// answer engines. Generated from the same content as the home page.
export const dynamic = "force-static";

export function GET() {
  const lines = [
    `# ${company.name}`,
    "",
    `> ${company.definition}`,
    "",
    `Tagline: ${company.tagline}`,
    `Positioning: ${company.positioning}`,
    `Contact: ${company.email} · ${SITE_URL}/contact-us`,
    "",
    "## Who we are",
    "",
    `${company.name} is a ${company.category.toLowerCase()}. We solve consequential problems across four areas:`,
    ...pillars.map((p) => `- **${p.name}**: ${p.body}`),
    "",
    "## Founder",
    "",
    "Asymmetri was founded by Nandagopal P (founder and CEO; https://www.nandagopalp.com), an engineer, venture builder and TEDx speaker. The name comes from an idea he returns to: existence itself began as a small asymmetry, and what endures usually comes from one small, true insight others stepped past. He pairs that operating view with a reflective one (attention, intention and conscious ambition), summed up in the line he quotes from the Chandogya Upanishad: Tat Tvam Asi, \"You are That\".",
    "",
    "## What we do: four practices",
    "",
    ...practices.map(
      (p) =>
        `${p.index}. **[${p.name}](${SITE_URL}${p.href})**: ${p.tagline} ${p.summary} Capabilities: ${p.capabilities.join(", ")}.`,
    ),
    "",
    "## Point of view",
    "",
    pointOfView.headline,
    ...pointOfView.shifts.map((s) => `- From ${s.from.toLowerCase()} to ${s.to.toLowerCase()}`),
    "",
    `${pointOfView.stance} ${pointOfView.closer}`,
    "",
    "## The Asymmetri AI system: ten layers",
    "",
    "One connected path from idea to operating leverage. Technologies listed are representative, not a fixed stack.",
    "",
    ...aiLayers.map(
      (l) =>
        `${l.n}. **${l.name}** (${l.discipline}): ${l.summary} Capabilities: ${l.capabilities.join(", ")}. Representative stack: ${l.stack.join(", ")}.`,
    ),
    "",
    "## Domains",
    "",
    ...domains.map((d) => `- **${d.name}**: ${d.body}`),
    "",
    "## Frontier R&D",
    "",
    ...research.map((r) => `- **${r.name}**: ${r.body}`),
    "",
    "## How we work",
    "",
    ...processSteps.map((s, i) => `${i + 1}. **${s.name}**: ${s.body}`),
    "",
    "Path: Opportunity → Prototype → Pilot → Production → Compounding.",
    "",
    "## Selected work",
    "",
    ...selectedWork.map(
      (w) => `- [${w.name}](${SITE_URL}/case-studies/${w.slug}) (${w.domain}): ${w.summary}`,
    ),
    "",
    "## FAQ",
    "",
    ...faqs.flatMap((f) => [`### ${f.q}`, "", f.a, ""]),
    "## Pages",
    "",
    `- [Home](${SITE_URL}/): positioning, AI system, domains, process and FAQ`,
    `- [About](${SITE_URL}/about): company story and team`,
    `- [Case studies](${SITE_URL}/case-studies): selected work`,
    `- [Careers](${SITE_URL}/careers): open roles`,
    `- [Contact](${SITE_URL}/contact-us): start a project`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
