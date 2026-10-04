export type Role = {
  company: string;
  title: string;
  location: string;
  dates: string;
  bullets: string[];
};

export type CaseStudy = {
  slug: string;
  title: string;
  eyebrow: string;
  dates: string;
  summary: string;
  featured: boolean;
  problem: string;
  approach: string[];
  impact: string[];
  stack: string[];
  links?: { label: string; href: string }[];
};

export const roles: Role[] = [
  {
    company: "Walmart Global Tech",
    title: "Senior Software Engineer",
    location: "Herndon, VA",
    dates: "Jan 2023 – Present",
    bullets: [
      "To give store associates a faster way to get work done, built an agentic app that turns natural language into automated workflows using real-time store data via MCP tools and skills, reducing manual data lookup by 80% and now scaling across multiple markets.",
      "To support multimodal AI experiences across store products, engineered multi-agent orchestration on Google ADK for the Store Agentic Platform, enabling voice, vision, and text conversations and giving associates real-time store information in one place.",
      "To unify fragmented data access, built a federated GraphQL gateway across 70+ providers and ingestion pipelines for billions of events, delivering 99.999% availability for millions of users.",
    ],
  },
  {
    company: "Red Hat",
    title: "Software Engineering Intern",
    location: "Boston, MA",
    dates: "May 2022 – Aug 2022",
    bullets: [
      "To help global enterprise users adopt open-source Ansible products in their own languages, co-developed the official Ansible–Memsource collection, automating the end-to-end localization pipeline through the Memsource translation API and reaching 2,000+ downloads on Ansible Galaxy.",
    ],
  },
  {
    company: "Northeastern University",
    title: "Teaching Assistant",
    location: "Boston, MA",
    dates: "Sept 2021 – Dec 2022",
    bullets: [
      "To support graduate students in core software design courses, served as Teaching Assistant to Professor Daniel Peters for CSYE 7374 (Design Patterns) and CSYE 6200 (Object-Oriented Design).",
    ],
  },
  {
    company: "Adnet Global",
    title: "Python Developer",
    location: "Remote, India (part-time freelance)",
    dates: "May 2021 – Sept 2021",
    bullets: [
      "To streamline client onboarding for a software solution, built automated setup workflows on top of its API endpoints.",
    ],
  },
  {
    company: "Decimal Point Analytics",
    title: "Python Programmer",
    location: "Remote, India",
    dates: "June 2020 – Sept 2021",
    bullets: [
      "To help clients turn raw data into meaningful insights, built interactive data visualizations, web applications, and automation scripts using Python and JavaScript libraries.",
    ],
  },
  {
    company: "Intertrust Group (CSC)",
    title: "Python / Linux Administrator",
    location: "Mumbai, India",
    dates: "Sept 2016 – June 2020",
    bullets: [
      "To reduce manual operations overhead supporting hedge fund clients, automated recurring Linux administration tasks with Python scripts, eliminating routine human intervention across hundreds of workflows.",
    ],
  },
];

export const caseStudies: CaseStudy[] = [
  {
    slug: "store-agentic-platform",
    title: "Store Agentic Platform",
    eyebrow: "Production multi-agent systems",
    dates: "2023 – Present",
    summary:
      "Natural-language workflows and multimodal agents that put real-time store data in one place for associates—voice, vision, and text—on Google ADK with MCP tools.",
    featured: true,
    problem:
      "Store associates needed a faster way to get work done without hopping across tools to look up operational data. Product surfaces also needed multimodal AI (voice, vision, and text) grounded in the same live store context.",
    approach: [
      "Built an agentic application that turns natural language into automated workflows, calling real-time store data through MCP tools and skills.",
      "Engineered multi-agent orchestration on Google ADK so specialized agents can collaborate instead of stuffing everything into a single prompt.",
      "Treated grounding, tool contracts, and failure recovery as platform concerns so the same patterns can scale across markets and store products.",
    ],
    impact: [
      "Reduced manual data lookup by 80%.",
      "Now scaling across multiple markets.",
      "Associates get real-time store information in one conversational surface.",
    ],
    stack: ["Google ADK", "MCP", "Agent Skills", "Vertex AI (Gemini)", "Python"],
  },
  {
    slug: "graphql-federation",
    title: "Federated GraphQL gateway",
    eyebrow: "Distributed systems at retail scale",
    dates: "2023 – Present",
    summary:
      "A GraphQL federation layer across 70+ providers and ingestion pipelines for billions of events, held to 99.999% availability for millions of users.",
    featured: true,
    problem:
      "Critical product experiences depended on fragmented backends. Clients should not have to know which of 70+ providers owned a given slice of data, and the ingestion path had to absorb billions of events without becoming a single point of failure.",
    approach: [
      "Built a federated GraphQL gateway (Apollo) so each domain team could publish a subgraph while clients queried one graph.",
      "Paired the gateway with high-throughput ingestion pipelines for billions of events.",
      "Designed for the availability number the business actually needed: five nines on the path that millions of users hit.",
    ],
    impact: [
      "70+ providers behind one graph.",
      "Billions of events on the ingestion path.",
      "99.999% availability for millions of users.",
    ],
    stack: ["GraphQL Federation (Apollo)", "Kafka", "Java", "Spring Boot", "Kubernetes"],
  },
  {
    slug: "ansible-memsource",
    title: "Ansible–Memsource collection",
    eyebrow: "Open source · Red Hat",
    dates: "May 2022 – Aug 2022",
    summary:
      "Official Ansible collection that automates the end-to-end localization pipeline through the Memsource API—2,000+ downloads on Ansible Galaxy.",
    featured: true,
    problem:
      "Global enterprise users needed Ansible products in their own languages. Localization was a manual, tool-specific process that did not look like the rest of Ansible Automation Platform.",
    approach: [
      "Co-developed the official ansible.memsource collection so localization workflows are expressed as Ansible-native automation.",
      "Used the Memsource translation API to automate the end-to-end pipeline, not just a single API call.",
      "Designed the collection to be generic enough for products inside and outside Red Hat.",
    ],
    impact: [
      "2,000+ downloads on Ansible Galaxy.",
      "Shipped as official Red Hat / Ansible open source (Apache 2.0).",
    ],
    stack: ["Python", "Ansible", "YAML", "Memsource API"],
    links: [
      {
        label: "github.com/ansible/ansible-collection-memsource",
        href: "https://github.com/ansible/ansible-collection-memsource",
      },
    ],
  },
  {
    slug: "llm-platform-primitives",
    title: "LLM platform primitives",
    eyebrow: "Open source reference",
    dates: "2025 – Present",
    summary:
      "Open-source Python reference for the primitives that turn one-off LLM apps into shared infrastructure: intent classification, prompt versioning, token accounting, and MCP server integration.",
    featured: true,
    problem:
      "Most LLM apps start as a notebook and a prompt file. Production platforms need shared primitives—intent, versioning, accounting, and tool servers—that more than one team can run.",
    approach: [
      "Published a Python reference implementation covering intent classification, prompt versioning, token accounting, and MCP server integration.",
      "Prototyped on Google ADK with local models via Ollama so the same ideas can be exercised without a cloud bill.",
    ],
    impact: [
      "A inspectable, reusable starting point for platform teams rather than another chatbot demo.",
    ],
    stack: ["Python", "Google ADK", "MCP", "Ollama"],
    links: [
      {
        label: "github.com/adityamulik/mcp-production-toolkit",
        href: "https://github.com/adityamulik/mcp-production-toolkit",
      },
    ],
  },
  {
    slug: "techathon-gemini",
    title: "Walmart Global Techathon 2024",
    eyebrow: "Winning team · multimodal GenAI",
    dates: "June 2024",
    summary:
      "Led a winning team project using Gemini Flash for image-to-text conversion—end-to-end solution, technical execution, and presentation.",
    featured: false,
    problem:
      "Unstructured documents (including bills of lading and similar artifacts) still required slow, error-prone human transcription before they could enter operational systems.",
    approach: [
      "Led a winning team using Gemini Flash multimodal GenAI for image-to-text conversion.",
      "Designed the end-to-end solution and drove technical execution and presentation under hackathon constraints.",
    ],
    impact: [
      "First-place outcome in a global internal competition among hundreds of teams.",
    ],
    stack: ["Gemini Flash", "Multimodal GenAI", "Python"],
    links: [
      {
        label: "LinkedIn announcement",
        href: "https://www.linkedin.com/posts/adityamulik_walmartglobaltechathon-activity-7219282996753805312-kuGx",
      },
    ],
  },
  {
    slug: "iptc-automation",
    title: "IPTC automation",
    eyebrow: "Freelance product work",
    dates: "May 2021 – Sept 2021",
    summary:
      "Full-stack application that automated adding metadata to images through a simple web interface, built while consulting as a Python developer.",
    featured: false,
    problem:
      "Image metadata (IPTC) was being applied through a slow, manual process that did not scale with the client’s catalog.",
    approach: [
      "Built a full-stack web application so operators could apply metadata through a UI instead of one-off scripts.",
      "Automated setup workflows on API endpoints as part of client onboarding.",
    ],
    impact: [
      "Replaced a manual metadata workflow with a productized interface.",
    ],
    stack: ["Python", "JavaScript", "REST APIs"],
    links: [
      {
        label: "github.com/adityamulik/IPTC-Backend",
        href: "https://github.com/adityamulik/IPTC-Backend",
      },
    ],
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((item) => item.slug === slug);
}

export const featuredCaseStudies = caseStudies.filter((item) => item.featured);
