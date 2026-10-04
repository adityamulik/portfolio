import type { Metadata } from "next";

const siteUrl = "https://www.adityamulik.com";

export function createMetadata({
  title,
  description,
  path = "/",
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const url = `${siteUrl}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Aditya Mulik",
      type: "website",
    },
  };
}
