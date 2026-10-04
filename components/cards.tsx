import Link from "next/link";
import type { CaseStudy } from "@/content/work";
import type { RecognitionItem } from "@/content/recognition";
import type { PostMeta } from "@/lib/posts";
import { formatWritingDate } from "@/lib/dates";

export function WorkCard({ item }: { item: CaseStudy }) {
  return (
    <Link
      href={`/work/${item.slug}/`}
      className="group flex h-full min-h-[260px] flex-col rounded-lg border border-ink/10 bg-surface p-6 shadow-sm transition hover:border-accent/50"
    >
      <p className="eyebrow">{item.eyebrow}</p>
      <h3 className="mt-3 font-display text-2xl text-ink">{item.title}</h3>
      <p className="mt-3 flex-1 text-ink-muted">{item.summary}</p>
      <p className="mt-6 text-sm text-accent">Read the case</p>
    </Link>
  );
}

export function RecognitionCard({ item }: { item: RecognitionItem }) {
  const proofs = [
    item.proofUrl && item.proofLabel ? { label: item.proofLabel, url: item.proofUrl } : null,
    ...(item.extraProofs ?? []),
  ].filter((proof): proof is { label: string; url: string } => Boolean(proof));

  return (
    <article className="flex h-full flex-col rounded-lg border border-ink/10 bg-surface p-6 shadow-sm">
      <p className="eyebrow">{item.venue}</p>
      <h3 className="mt-3 font-display text-2xl text-ink">{item.title}</h3>
      <p className="mt-1 text-sm text-ink-muted">{item.date}</p>
      <p className="mt-3 flex-1 text-ink-muted">{item.summary}</p>
      {proofs.length ? (
        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
          {proofs.map((proof) => {
            const external = /^https?:\/\//.test(proof.url);
            return (
              <a
                key={proof.url}
                href={proof.url}
                className="text-sm text-accent underline decoration-accent/30 underline-offset-4"
                target="_blank"
                rel={external ? "noreferrer" : undefined}
              >
                {proof.label}
                {external ? " ↗" : ""}
              </a>
            );
          })}
        </div>
      ) : null}
    </article>
  );
}

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/writing/${post.slug}/`}
      className="block rounded-lg border border-ink/10 bg-surface p-6 shadow-sm transition hover:border-accent/50"
    >
      <p className="text-sm text-ink-muted">{formatWritingDate(post.date)}</p>
      <h3 className="mt-2 font-display text-2xl text-ink">{post.title}</h3>
      <p className="mt-3 text-ink-muted">{post.summary}</p>
    </Link>
  );
}
