export type ExternalPiece = {
  title: string;
  venue: string;
  date: string;
  summary: string;
  href: string;
};

export const externalWriting: ExternalPiece[] = [
  {
    title: "A Platform Engineering Playbook for Production LLMs",
    venue: "InfoQ",
    date: "October 2026",
    summary:
      "How to treat LLM systems as a platform: routing, versioning, grounding and the operational layer around the model.",
    href: "https://www.infoq.com/articles/platform-engineering-playbook-production-llms/",
  },
];
