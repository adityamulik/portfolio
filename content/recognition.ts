export type RecognitionCategory =
  | "publication"
  | "speaking"
  | "judging"
  | "mentoring"
  | "contribution"
  | "award";

export type RecognitionItem = {
  slug: string;
  category: RecognitionCategory;
  title: string;
  venue: string;
  date: string;
  summary: string;
  proofLabel?: string;
  proofUrl?: string;
  featured: boolean;
};

export const recognitionCategories: { id: RecognitionCategory; label: string }[] = [
  { id: "publication", label: "Publications" },
  { id: "speaking", label: "Speaking" },
  { id: "judging", label: "Judging" },
  { id: "mentoring", label: "Mentoring" },
  { id: "contribution", label: "Original contributions" },
  { id: "award", label: "Awards" },
];

export const recognition: RecognitionItem[] = [
  {
    slug: "infoq-platform-playbook",
    category: "publication",
    title: "A Platform Engineering Playbook for Production LLMs",
    venue: "InfoQ",
    date: "October 2026",
    summary:
      "Published article on InfoQ about the platform layer required to run LLM systems in production. Independent editorial venue.",
    proofLabel: "InfoQ article",
    proofUrl: "https://www.infoq.com/articles/platform-engineering-playbook-production-llms/",
    featured: true,
  },
  {
    slug: "platformcon-2026",
    category: "speaking",
    title: "Speaker, PlatformCon 2026",
    venue: "PlatformCon",
    date: "2026",
    summary:
      "Invited speaker at PlatformCon, the main conference for platform engineers. Public speaker listing.",
    proofLabel: "PlatformCon speaker page",
    proofUrl: "https://2026.platformcon.com/speakers/aditya-mulik",
    featured: true,
  },
  {
    slug: "qcon-ai-boston",
    category: "speaking",
    title: "Batch Intelligence at Scale: Cost-Efficient Multi-Agent LLM Workflows with Built-In Resilience",
    venue: "QCon AI Boston",
    date: "June 2026",
    summary:
      "Talk on production multi-agent orchestration, cost-efficient inference, MCP grounding and failure modes that show up at real workload scale.",
    proofLabel: "QCon speaker page",
    proofUrl: "https://boston.qcon.ai/speakers/adityamulik",
    featured: true,
  },
  {
    slug: "mcp-dev-summit",
    category: "speaking",
    title: "MCP Dev Summit podcast",
    venue: "MCP Dev Summit",
    date: "2026",
    summary:
      "Invited to speak on a live MCP Dev Summit podcast about production MCP and agent platforms.",
    proofLabel: "YouTube recording",
    proofUrl: "https://www.youtube.com/watch?v=mPcla3P5ObA",
    featured: false,
  },
  {
    slug: "ai-summit-nyc-2025",
    category: "speaking",
    title: "Unlocking value from unstructured data",
    venue: "The AI Summit New York",
    date: "December 2025",
    summary:
      "Speaker at The AI Summit in New York on extracting operational value from unstructured data.",
    proofLabel: "LinkedIn announcement",
    proofUrl:
      "https://www.linkedin.com/posts/adityamulik_speakers-activity-7368457228996993025-nwH0",
    featured: false,
  },
  {
    slug: "intellibus-jamaica",
    category: "judging",
    title: "Judge, Intellibus Hackathon 2025",
    venue: "Kingston, Jamaica",
    date: "March 2025",
    summary:
      "Judged a 600+ participant in-person hackathon supporting Intellibus expansion in Jamaica. Listed on the event Devpost.",
    proofLabel: "Invitation letter",
    proofUrl: "/proofs/Intellibus_Hackathon_Invitation.pdf",
    featured: true,
  },
  {
    slug: "gmu-techfair-2026",
    category: "judging",
    title: "Judge, George Mason University Tech Fair",
    venue: "George Mason University",
    date: "February 2026",
    summary:
      "Judged a university tech fair. Independent academic judging of student work.",
    featured: false,
  },
  {
    slug: "vthacks-2025",
    category: "judging",
    title: "Judge, VTHacks",
    venue: "Virginia Tech",
    date: "2025",
    summary: "Invited to judge Virginia Tech's hackathon.",
    proofLabel: "Invitation letter",
    proofUrl: "/proofs/VTHacks25_Judge.pdf",
    featured: false,
  },
  {
    slug: "hacknc-2025",
    category: "mentoring",
    title: "Mentor, HackNC",
    venue: "University of North Carolina",
    date: "2025",
    summary: "Mentored students at HackNC.",
    proofLabel: "Invitation letter",
    proofUrl: "/proofs/HackNC_2025_Invite_Mentor.pdf",
    featured: false,
  },
  {
    slug: "tinytorch-2026",
    category: "contribution",
    title: "Featured in TinyTorch v0.1.10",
    venue: "Harvard Edge / cs249r",
    date: "2026",
    summary:
      "Named in the TinyTorch ML systems lab release, the hands-on curriculum built alongside Harvard cs249r.",
    proofLabel: "GitHub release",
    proofUrl: "https://github.com/harvard-edge/cs249r_book/releases/tag/tinytorch-v0.1.10",
    featured: false,
  },
  {
    slug: "aibom-cisa-2026",
    category: "contribution",
    title: "Training-data transparency for AI SBOM",
    venue: "GenAI Security Project",
    date: "July 2026",
    summary:
      "Merged contribution implementing training-data transparency consistent with CISA/G7 SBOM for AI minimum elements.",
    proofLabel: "Merged pull request",
    proofUrl: "https://github.com/GenAI-Security-Project/aibom-generator/pull/81",
    featured: false,
  },
  {
    slug: "nist-ai-rmf",
    category: "contribution",
    title: "NIST AI RMF: AI in critical infrastructure",
    venue: "NIST",
    date: "2026",
    summary:
      "Contributed to the concept note for an AI RMF profile on trustworthy AI in critical infrastructure.",
    proofLabel: "NIST program page",
    proofUrl:
      "https://www.nist.gov/programs-projects/concept-note-ai-rmf-profile-trustworthy-ai-critical-infrastructure",
    featured: false,
  },
  {
    slug: "techathon-2024",
    category: "award",
    title: "Walmart Global Techathon 2024",
    venue: "Walmart Global Tech",
    date: "July 2024",
    summary:
      "Winning team for a Gemini Flash solution converting unstructured documents into actionable data.",
    proofLabel: "LinkedIn announcement",
    proofUrl:
      "https://www.linkedin.com/posts/adityamulik_walmartglobaltechathon-activity-7219282996753805312-kuGx",
    featured: false,
  },
];

export const featuredRecognition = recognition.filter((item) => item.featured);
