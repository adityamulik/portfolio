import { notFound } from "next/navigation";
import { Markdown } from "@/components/Markdown";
import { Container } from "@/components/ui";
import { formatWritingDate } from "@/lib/dates";
import { createMetadata } from "@/lib/seo";
import { getPost, getPublishedPosts } from "@/lib/posts";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  const posts = getPublishedPosts();
  if (posts.length === 0) {
    return [{ slug: "_" }];
  }
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) {
    return {};
  }
  return createMetadata({
    title: post.title,
    description: post.summary,
    path: `/writing/${post.slug}/`,
  });
}

export default async function WritingPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) {
    notFound();
  }

  return (
    <Container className="py-16">
      <p className="text-sm text-ink-muted">{formatWritingDate(post.date)}</p>
      <h1 className="mt-3 max-w-3xl font-display text-5xl tracking-tight text-ink">{post.title}</h1>
      <p className="mt-5 max-w-2xl text-xl text-ink-muted">{post.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-band px-3 py-1 text-xs uppercase tracking-wide text-ink-muted">
            {tag}
          </span>
        ))}
      </div>
      <article className="mt-10 max-w-3xl">
        <Markdown content={post.content} />
      </article>
    </Container>
  );
}
