import Link from "next/link";
import type { CaseStudy } from "@/content/work";
import type { EvidenceItem } from "@/content/evidence";
import type { PostMeta } from "@/lib/posts";

export function WorkCard({ item }: { item: CaseStudy }) {
  return (
    <Link
      href={`/work/${item.slug}/`}
      className="group block rounded-2xl border border-ink/10 bg-paper p-6 transition hover:-translate-y-0.5 hover:border-accent/40"
    >
      <p className="eyebrow">{item.eyebrow}</p>
      <h3 className="mt-3 font-display text-2xl text-ink">{item.title}</h3>
      <p className="mt-3 text-ink-muted">{item.summary}</p>
      <p className="mt-6 text-sm text-accent">Read the case →</p>
    </Link>
  );
}

export function EvidenceCard({ item }: { item: EvidenceItem }) {
  return (
    <article className="rounded-2xl border border-ink/10 bg-paper p-6">
      <p className="eyebrow">{item.venue}</p>
      <h3 className="mt-3 font-display text-2xl text-ink">{item.title}</h3>
      <p className="mt-1 text-sm text-ink-muted">{item.date}</p>
      <p className="mt-3 text-ink-muted">{item.summary}</p>
      <a
        href={item.proofUrl}
        className="mt-5 inline-block text-sm text-accent underline decoration-accent/30 underline-offset-4"
        target="_blank"
        rel="noreferrer"
      >
        {item.proofLabel} ↗
      </a>
    </article>
  );
}

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/writing/${post.slug}/`}
      className="block rounded-2xl border border-ink/10 bg-paper p-6 transition hover:border-accent/40"
    >
      <p className="text-sm text-ink-muted">{post.date}</p>
      <h3 className="mt-2 font-display text-2xl text-ink">{post.title}</h3>
      <p className="mt-3 text-ink-muted">{post.summary}</p>
    </Link>
  );
}
