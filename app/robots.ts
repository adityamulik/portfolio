import { profile } from "@/content/profile";

export const dynamic = "force-static";

export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${profile.website}/sitemap.xml`,
  };
}
