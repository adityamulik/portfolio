export type EvidenceCategory = "publication" | "speaking" | "judging" | "award";

export type EvidenceItem = {
  slug: string;
  category: EvidenceCategory;
  title: string;
  venue: string;
  date: string;
  summary: string;
  proofLabel: string;
  proofUrl: string;
  featured: boolean;
};

export const evidenceCategories: { id: EvidenceCategory; label: string }[] = [
  { id: "publication", label: "Publications" },
  { id: "speaking", label: "Speaking" },
  { id: "judging", label: "Judging" },
  { id: "award", label: "Awards" },
];

export const evidence: EvidenceItem[] = [
  {
    slug: "infoq-platforms-for-llms",
    category: "publication",
    title: "Platforms for LLMs",
    venue: "InfoQ",
    date: "2025",
    summary:
      "Professional article on the platform primitives required to run large language model systems in production—not a demo notebook, a platform.",
    proofLabel: "Replace with InfoQ article URL",
    proofUrl: "https://www.infoq.com/",
    featured: true,
  },
  {
    slug: "qcon-ai-boston",
    category: "speaking",
    title: "Batch Intelligence at Scale: Cost-Efficient Multi-Agent LLM Workflows with Built-In Resilience",
    venue: "QCon AI Boston",
    date: "June 2026",
    summary:
      "Invited talk on production multi-agent orchestration, cost-efficient inference, MCP grounding, and the failure modes that only appear at real workload scale.",
    proofLabel: "QCon speaker page",
    proofUrl: "https://boston.qcon.ai/speakers/adityamulik",
    featured: true,
  },
  {
    slug: "ai-summit-nyc-2025",
    category: "speaking",
    title: "Unlocking value from unstructured data",
    venue: "The AI Summit New York",
    date: "December 2025",
    summary:
      "Speaker at The AI Summit in New York (Javits Center), presenting work on extracting operational value from unstructured data.",
    proofLabel: "LinkedIn announcement",
    proofUrl:
      "https://www.linkedin.com/posts/adityamulik_speakers-activity-7368457228996993025-nwH0",
    featured: true,
  },
  {
    slug: "intellibus-jamaica",
    category: "judging",
    title: "Judge, Intellibus Hackathon 2025",
    venue: "Kingston, Jamaica · Intellibus",
    date: "March 2025",
    summary:
      "Evaluated new talent at a 600+ participant in-person hackathon supporting Intellibus expansion in Jamaica. Independent listing on the event’s Devpost.",
    proofLabel: "Devpost judges list",
    proofUrl: "https://intellibus-hackathon-2025.devpost.com/",
    featured: true,
  },
  {
    slug: "techathon-2024",
    category: "award",
    title: "Walmart Global Techathon 2024",
    venue: "Walmart Global Tech",
    date: "July 2024",
    summary:
      "Winning team for a multimodal Gemini Flash solution converting unstructured documents into actionable data, competing among hundreds of teams globally.",
    proofLabel: "LinkedIn announcement",
    proofUrl:
      "https://www.linkedin.com/posts/adityamulik_walmartglobaltechathon-activity-7219282996753805312-kuGx",
    featured: false,
  },
  {
    slug: "bravo-2023",
    category: "award",
    title: "Bravo Award 2023",
    venue: "Walmart Global Tech",
    date: "May 2023",
    summary:
      "Internal recognition for engineering impact on platform and associate-facing systems.",
    proofLabel: "LinkedIn announcement",
    proofUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7100239153375711232/",
    featured: false,
  },
];

export const featuredEvidence = evidence.filter((item) => item.featured);
