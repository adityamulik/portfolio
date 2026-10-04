import { profile } from "@/content/profile";
import { caseStudies } from "@/content/work";
import { getPublishedPosts } from "@/lib/posts";

export const dynamic = "force-static";

export default function sitemap() {
  const base = profile.website;
  const staticRoutes = ["", "/work/", "/recognition/", "/writing/", "/about/"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const work = caseStudies.map((item) => ({
    url: `${base}/work/${item.slug}/`,
    lastModified: new Date(),
  }));

  const writing = getPublishedPosts().map((post) => ({
    url: `${base}/writing/${post.slug}/`,
    lastModified: new Date(post.date),
  }));

  return [...staticRoutes, ...work, ...writing];
}
