export const profile = {
  name: "Aditya Mulik",
  shortName: "Aditya",
  title: "Senior Software Engineer, AI/ML",
  location: "Sterling, Virginia",
  email: "aditya.mulik@gmail.com",
  phone: "+1-857-488-1743",
  website: "https://www.adityamulik.com",
  resumePath: "/Aditya_Mulik_Resume.pdf",
  photo: "/images/profile.jpg",
  linkedin: "https://www.linkedin.com/in/adityamulik",
  github: "https://github.com/adityamulik",
  tagline:
    "I design production AI systems—multi-agent orchestration, MCP tools, and federated platforms—that run at the scale of millions of users and billions of events.",
  summary:
    "Senior software engineer focused on AI/ML platforms and distributed systems. I turn natural language into automated workflows, orchestrate multi-agent experiences across voice, vision, and text, and keep a tier-0, low-latency data plane in front of millions of people. The same work is documented here for hiring managers and as a public evidence record of independent professional contributions.",
  about:
    "I am a Senior Software Engineer working on AI/ML and platform systems: agentic applications grounded in real operational data, multi-agent orchestration on Google ADK, and a federated GraphQL gateway spanning 30+ providers with a read-through cache on the ingestion path. Before that I built localization automation at Red Hat, taught graduate software-design courses at Northeastern University, and spent several years automating infrastructure and analytics pipelines. I write, speak, and judge so the work can be inspected independently.",
};

export const nav = [
  { href: "/work/", label: "Work" },
  { href: "/evidence/", label: "Evidence" },
  { href: "/writing/", label: "Writing" },
  { href: "/about/", label: "About" },
];

export const impactStats = [
  {
    value: "80%",
    label: "Less manual data lookup",
    detail: "Agentic store workflows on live data via MCP tools and skills.",
  },
  {
    value: "30+",
    label: "Federated providers",
    detail: "GraphQL gateway with a read-through cache for low-latency, tier-0 traffic.",
  },
  {
    value: "99.999%",
    label: "Availability",
    detail: "Ingestion pipelines for billions of events on a business-critical path.",
  },
  {
    value: "2,000+",
    label: "Galaxy downloads",
    detail: "Ansible–Memsource collection for enterprise localization.",
  },
];

export const skillGroups = [
  {
    name: "Languages",
    items: ["Python", "Java", "TypeScript / JavaScript"],
  },
  {
    name: "AI & agents",
    items: [
      "Google ADK",
      "MCP",
      "Agent Skills",
      "RAG",
      "LangChain",
      "Vertex AI (Gemini)",
      "Multi-agent orchestration",
      "Context & prompt engineering",
    ],
  },
  {
    name: "Backend & distributed systems",
    items: [
      "FastAPI",
      "Spring Boot",
      "REST",
      "GraphQL Federation (Apollo)",
      "Kafka",
      "Memcached",
    ],
  },
  {
    name: "Data",
    items: ["PostgreSQL", "MongoDB", "BigQuery", "Pandas"],
  },
  {
    name: "Infrastructure & observability",
    items: [
      "Kubernetes",
      "Jenkins",
      "GitHub Actions",
      "Prometheus",
      "Grafana",
      "Splunk",
      "OpenObserve",
    ],
  },
];

export const education = [
  {
    school: "Northeastern University",
    place: "Boston, MA",
    degree: "Master of Science, Information Systems",
    dates: "Sept 2021 – Dec 2022",
  },
  {
    school: "University of Mumbai",
    place: "Mumbai, India",
    degree: "Bachelor of Engineering in Information Technology",
    dates: "Aug 2012 – May 2016",
  },
];
