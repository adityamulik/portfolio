export const profile = {
  name: "Aditya Mulik",
  shortName: "Aditya",
  title: "Senior Software Engineer, Platform and Distributed Systems",
  location: "Northern Virginia",
  website: "https://www.adityamulik.com",
  resumePath: "/Aditya_Mulik_Resume.pdf",
  photo: "/images/profile.jpg",
  linkedin: "https://www.linkedin.com/in/adityamulik",
  github: "https://github.com/adityamulik",
  tagline:
    "I build distributed systems and the platform layer other teams ship on: federation, caching, ingestion and production multi-agent infrastructure.",
  summary:
    "Senior software engineer in platform and distributed systems. Most of my time goes into shared infrastructure that has to stay correct under load: federated APIs, read-through caches, ingestion paths and agent platforms. The pages here are for hiring managers and as a public record of talks, judging and writing.",
  about:
    "I am a platform engineer at Walmart Global Tech. I work on the Store Agentic Platform (from Feb 2026), a federated GraphQL gateway across 30+ providers and a read-through cache on a tier-0 path. I also run multi-agent workflows for Fresh waste and inventory forecasting. Before Walmart I built localization automation at Red Hat, TA'd graduate design courses at Northeastern and spent several years on Python and Linux platforms. I speak, judge and write because that work should be easy to verify.",
};

export const nav = [
  { href: "/work/", label: "Work" },
  { href: "/recognition/", label: "Recognition" },
  { href: "/writing/", label: "Writing" },
  { href: "/about/", label: "About" },
];

export const impactStats = [
  {
    value: "30+",
    label: "Federated providers",
    detail: "One GraphQL gateway with a read-through cache so clients query a single graph.",
  },
  {
    value: "99.999%",
    label: "Availability for millions of users",
    detail:
      "Federated gateway and caching on a tier-0 path. Minimal downtime because operations depend on it.",
  },
  {
    value: "1 surface",
    label: "Instead of tens of apps",
    detail:
      "Associates get live data in one place. Frontier and other models sit behind in-house context engineering, not raw public model access.",
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
