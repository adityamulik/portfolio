export type ExternalPiece = {
  title: string;
  venue: string;
  date: string;
  summary: string;
  href: string;
  callout?: { label: string; href: string };
};

export const externalWriting: ExternalPiece[] = [
  {
    title: "A Platform Engineering Playbook for Production LLMs",
    venue: "InfoQ",
    date: "October 2026",
    summary:
      "How to treat LLM systems as a platform: routing, versioning, grounding and the operational layer around the model.",
    href: "https://www.infoq.com/articles/platform-engineering-playbook-production-llms/",
    callout: {
      label: "Level Up issue 375",
      href: "https://sh1.sendinblue.com/mk/sc/W_IjdhXxd0LrIpM2eWLtfkx7FJmNrbGSWwmOHntno7I-5kBuhR_QiZIqIFDIekDivHRBu5Nlfoh6XafG2WmOQRTB7ZBQZBc",
    },
  },
];
