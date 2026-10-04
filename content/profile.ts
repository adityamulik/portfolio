export const profile = {
  name: "Aditya Mulik",
  shortName: "Aditya",
  title: "Senior Software Engineer, Platform",
    location: "Northern Virginia",
  email: "aditya.mulik@gmail.com",
  phone: "+1-857-488-1743",
  website: "https://www.adityamulik.com",
  resumePath: "/Aditya_Mulik_Resume.pdf",
  photo: "/images/profile.jpg",
  linkedin: "https://www.linkedin.com/in/adityamulik",
  github: "https://github.com/adityamulik",
  tagline:
    "I build AI platforms that other teams ship on: multi-agent systems, MCP tools and a federated data plane that millions of store associates use every day.",
  summary:
    "Platform engineer working as a senior software engineer. Most of my time goes into the shared layer under store products: agents, GraphQL federation, caching and ingestion. The pages here are for hiring managers and as a public record of talks, judging and writing.",
  about:
    "I am a platform engineer at Walmart Global Tech. I work on the Store Agentic Platform (from Feb 2026), a federated GraphQL gateway across 30+ providers and a read-through cache on a tier-0 path. I also run multi-agent workflows for Fresh waste and inventory forecasting. Before Walmart I built localization automation at Red Hat, TA'd graduate design courses at Northeastern and spent several years on Python and Linux platforms. I speak, judge and write because that work should be easy to verify.",
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
    detail: "GraphQL gateway with a read-through cache for low-latency tier-0 traffic.",
  },
  {
    value: "99.999%",
    label: "Availability",
    detail: "Ingestion and cache on a path that store operations depend on.",
  },
  {
    value: "2,000+",
    label: "Galaxy downloads",
    detail: "Ansible Memsource collection for enterprise localization.",
  },
];

export const skillGroups = [
  {
    name: "Languages",
    items: ["Python", "Java", "TypeScript / JavaScript"],
  },
  {
    name: "AI and agents",
    items: [
      "Google ADK",
      "MCP",
      "Agent Skills",
      "RAG",
      "LangChain",
      "Vertex AI (Gemini)",
      "Multi-agent orchestration",
      "Context engineering",
      "Prompt engineering",
    ],
  },
  {
    name: "Backend and distributed systems",
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
    name: "Infrastructure and observability",
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
    dates: "Sept 2021 - Dec 2022",
  },
  {
    school: "University of Mumbai",
    place: "Mumbai, India",
    degree: "Bachelor of Engineering in Information Technology",
    dates: "Aug 2012 - May 2016",
  },
];
