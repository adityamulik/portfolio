import { ExternalWritingCard, PostCard } from "@/components/cards";
import { Container } from "@/components/ui";
import { externalWriting } from "@/content/external-writing";
import { createMetadata } from "@/lib/seo";
import { getPublishedPosts } from "@/lib/posts";

export const metadata = createMetadata({
  title: "Writing",
  description: "External articles and notes from this repo.",
  path: "/writing/",
});

export default function WritingPage() {
  const posts = getPublishedPosts();

  return (
    <Container className="py-16">
      <p className="eyebrow">Writing</p>
      <h1 className="mt-3 font-display text-4xl tracking-tight text-ink">Writing</h1>

      <section className="mt-14">
        <h2 className="font-display text-2xl text-ink">Elsewhere</h2>
        <div className="mt-6 grid gap-5">
          {externalWriting.map((piece) => (
            <ExternalWritingCard key={piece.href} piece={piece} />
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-2xl text-ink">Notes</h2>
        {posts.length ? (
          <div className="mt-6 grid gap-5">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : null}
      </section>
    </Container>
  );
}
