import type { Metadata } from "next";

const siteUrl = "https://www.adityamulik.com";

export function createMetadata({
  title,
  description,
  path = "/",
  absolute = false,
}: {
  title: string;
  description: string;
  path?: string;
  absolute?: boolean;
}): Metadata {
  const url = `${siteUrl}${path}`;
  return {
    title: absolute ? { absolute: title } : title,
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
