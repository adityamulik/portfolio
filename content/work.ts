export type Role = {
  company: string;
  title: string;
  location: string;
  dates: string;
  bullets: string[];
  links?: { label: string; href: string }[];
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
  codeNote?: string;
};

export const roles: Role[] = [
  {
    company: "Walmart Global Tech",
    title: "Senior Software Engineer",
    location: "Herndon, VA",
    dates: "Nov 2025 - Present",
    bullets: [
      "To give store associates a faster way to get work done, built an agentic app (Feb 2026 - present) that puts live store data in one surface instead of tens of applications, with frontier and other models behind in-house context engineering instead of raw public model access.",
      "To support multimodal AI across store products, engineered multi-agent orchestration on Google ADK for the Store Agentic Platform, enabling voice, vision and text conversations and giving associates real-time store information in one place.",
      "To improve Fresh produce inventory accuracy, built a multi-agent workflow that combines time-series forecasting with live inventory status, weather and related signals so stores waste less and stock what they actually need.",
    ],
  },
  {
    company: "Walmart Global Tech",
    title: "Software Engineer III",
    location: "Herndon, VA",
    dates: "Jan 2023 - Nov 2025",
    bullets: [
      "To unify fragmented data access, built a federated GraphQL gateway across 30+ providers plus ingestion pipelines with a read-through cache, delivering low-latency tier-0 availability (99.999%) for millions of users.",
      "Worked the associate clock-in path used across 5000+ stores and about 3 million associates, including caching so store operations could depend on 99.999% uptime.",
    ],
  },
  {
    company: "Red Hat",
    title: "Software Engineering Intern",
    location: "Boston, MA",
    dates: "May 2022 - Aug 2022",
    bullets: [
      "To help global enterprise users adopt Ansible products in their own languages, co-developed the official Ansible Memsource collection, automating the end-to-end localization pipeline through the Memsource translation API and reaching 2,000+ downloads on Ansible Galaxy.",
    ],
    links: [
      {
        label: "GitHub · ansible-collection-memsource",
        href: "https://github.com/ansible/ansible-collection-memsource",
      },
      {
        label: "GitHub · python-memsource",
        href: "https://github.com/ansible/python-memsource",
      },
    ],
  },
  {
    company: "Northeastern University",
    title: "Teaching Assistant",
    location: "Boston, MA",
    dates: "Sept 2021 - Dec 2022",
    bullets: [
      "Served as Teaching Assistant to Professor Daniel Peters for CSYE 7374 (Design Patterns) and CSYE 6200 (Object-Oriented Design).",
    ],
    links: [
      {
        label: "Recommendation letter",
        href: "/proofs/daniel-peters-recommendation.pdf",
      },
    ],
  },
  {
    company: "Adnet Global",
    title: "Python Developer",
    location: "Remote, India (part-time freelance)",
    dates: "May 2021 - Sept 2021",
    bullets: [
      "Built automated setup workflows on top of API endpoints to speed up client onboarding.",
    ],
  },
  {
    company: "Decimal Point Analytics",
    title: "Python Programmer",
    location: "Remote, India",
    dates: "June 2020 - Sept 2021",
    bullets: [
      "Built interactive data visualizations, web applications and automation scripts using Python and JavaScript libraries.",
    ],
  },
  {
    company: "Intertrust Group (CSC)",
    title: "Python / Linux Administrator",
    location: "Mumbai, India",
    dates: "Sept 2016 - June 2020",
    bullets: [
      "Automated recurring Linux administration tasks with Python scripts, cutting routine human intervention across hundreds of workflows for hedge fund clients.",
    ],
  },
];

export const caseStudies: CaseStudy[] = [
  {
    slug: "store-agentic-platform",
    title: "Store Agentic Platform",
    eyebrow: "Walmart Global Tech",
    dates: "Feb 2026 - Present",
    summary:
      "Natural-language workflows and multimodal agents that put live store data in one place for associates. Voice, vision and text on Google ADK with MCP tools.",
    featured: true,
    problem:
      "Associates were bouncing between tools to look up operational data. Store products also needed voice, vision and text on the same live context.",
    approach: [
      "Started in February 2026. Built an agentic app that turns natural language into workflows, calling live store data through MCP tools and skills.",
      "Orchestrated specialized agents on Google ADK instead of stuffing everything into one prompt.",
      "Treated grounding, tool contracts and failure recovery as platform concerns so other store products can reuse the same layer.",
    ],
    impact: [
      "One conversational surface instead of bouncing through tens of applications.",
      "Frontier and other models served with in-house context engineering, not raw public model access.",
      "Now scaling across multiple markets.",
    ],
    stack: ["Google ADK", "MCP", "Agent Skills", "Vertex AI (Gemini)", "Python"],
    codeNote: "Internal project at Walmart Global Tech.",
  },
  {
    slug: "fresh-waste",
    title: "Fresh waste and inventory forecasting",
    eyebrow: "Walmart Global Tech",
    dates: "2025 - Feb 2026",
    summary:
      "Multi-agent time-series forecasting for fresh produce. Agents check live inventory, weather and related signals so stores waste less and keep shelves accurate.",
    featured: true,
    problem:
      "Fresh produce is perishable. Forecasts that ignore live inventory and weather go stale fast, which shows up as waste on one side and empty shelves on the other.",
    approach: [
      "Built a multi-agent setup on the Fresh insights platform instead of a single forecasting job.",
      "One path watches live inventory. Another pulls weather and related signals. Another produces the time-series forecast those inputs should change.",
      "Wired the agents into the same operational data plane the rest of store products already use.",
    ],
    impact: [
      "Inventory accuracy for fresh produce is no longer a one-model guess.",
      "Stores can react to weather and on-hand stock in the same loop.",
      "Waste and availability sit on a shared platform, not a one-off notebook.",
    ],
    stack: ["Google ADK", "Multi-agent orchestration", "Time-series forecasting", "Vertex AI", "Python"],
    codeNote: "Internal project at Walmart Global Tech.",
  },
  {
    slug: "graphql-federation",
    title: "Federated GraphQL and data ingestion",
    eyebrow: "Walmart Global Tech",
    dates: "Jan 2023 - June 2025",
    summary:
      "GraphQL federation across 30+ providers, ingestion for billions of events and a read-through cache so tier-0 traffic stays fast for millions of users.",
    featured: true,
    problem:
      "Product teams were calling fragmented backends. Clients should not care which of 30+ providers owns a field. The read path still has to stay fast while billions of events land. If this path is slow, store operations feel it.",
    approach: [
      "Built a federated GraphQL gateway (Apollo) so each domain publishes a subgraph and clients query one graph.",
      "Paired it with high-throughput ingestion for billions of events.",
      "Added a read-through cache on the hot path so repeated reads do not wait on every provider.",
      "This is the same class of work that started with associate clock-in status for 5000+ stores and about 3 million associates: 99.999% uptime because store operations run on it.",
    ],
    impact: [
      "30+ providers behind one graph.",
      "Read-through cache for low-latency reads.",
      "Billions of events on the ingestion path.",
      "99.999% availability for millions of users on a tier-0 path.",
    ],
    stack: [
      "GraphQL Federation (Apollo)",
      "Kafka",
      "Read-through cache",
      "Memcached",
      "Java",
      "Spring Boot",
      "Kubernetes",
    ],
    codeNote: "Internal project at Walmart Global Tech.",
  },
  {
    slug: "ansible-memsource",
    title: "Ansible Memsource collection",
    eyebrow: "Red Hat",
    dates: "May 2022 - Aug 2022",
    summary:
      "Ansible collection that automates the localization pipeline through the Memsource API. 2,000+ downloads on Ansible Galaxy.",
    featured: true,
    problem:
      "Enterprise users needed Ansible products in their own languages. Localization did not look like the rest of Ansible Automation Platform.",
    approach: [
      "Co-developed the ansible.memsource collection so localization is ordinary Ansible automation.",
      "Used the Memsource translation API for the full pipeline, not a single call.",
      "Shipped companion Python bindings so the same API works outside playbooks.",
    ],
    impact: [
      "2,000+ downloads on Ansible Galaxy.",
    ],
    stack: ["Python", "Ansible", "YAML", "Memsource API"],
    links: [
      {
        label: "github.com/ansible/ansible-collection-memsource",
        href: "https://github.com/ansible/ansible-collection-memsource",
      },
      {
        label: "github.com/ansible/python-memsource",
        href: "https://github.com/ansible/python-memsource",
      },
      {
        label: "Ansible Galaxy · ansible.memsource",
        href: "https://galaxy.ansible.com/ui/repo/published/ansible/memsource/",
      },
    ],
  },
  {
    slug: "techathon-gemini",
    title: "Walmart Global Techathon 2024",
    eyebrow: "Winning team",
    dates: "June 2024",
    summary:
      "Led a winning team using Gemini Flash for image-to-text conversion. Designed the end-to-end solution and ran technical execution and the presentation.",
    featured: false,
    problem:
      "Unstructured documents still needed slow human transcription before they could enter operational systems.",
    approach: [
      "Led a winning team using Gemini Flash multimodal GenAI for image-to-text conversion.",
      "Designed the end-to-end solution and drove technical execution and presentation under hackathon constraints.",
    ],
    impact: [
      "First place in a global internal competition among hundreds of teams.",
    ],
    stack: ["Gemini Flash", "Multimodal GenAI", "Python"],
    links: [
      {
        label: "Winner certificate",
        href: "/proofs/global-techathon-winner-2024.pdf",
      },
    ],
  },
  {
    slug: "iptc-automation",
    title: "IPTC automation",
    eyebrow: "Freelance",
    dates: "May 2021 - Sept 2021",
    summary:
      "Full-stack application that automated adding metadata to images through a simple web interface.",
    featured: false,
    problem:
      "Image metadata was applied by hand and did not keep up with the catalog.",
    approach: [
      "Built a web application so operators could apply metadata through a UI.",
      "Automated setup workflows on API endpoints as part of client onboarding.",
    ],
    impact: [
      "Replaced a manual metadata workflow with a productized interface.",
    ],
    stack: ["Python", "JavaScript", "REST APIs"],
    codeNote: "Freelance client project.",
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((item) => item.slug === slug);
}

export const featuredCaseStudies = caseStudies.filter((item) => item.featured);
