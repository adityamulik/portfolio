import { PostCard } from "@/components/cards";
import { Container } from "@/components/ui";
import { createMetadata } from "@/lib/seo";
import { getPublishedPosts } from "@/lib/posts";

export const metadata = createMetadata({
  title: "Writing",
  description: "Writing.",
  path: "/writing/",
});

export default function WritingPage() {
  const posts = getPublishedPosts();

  return (
    <Container className="py-16">
      <p className="eyebrow">Writing</p>
      <h1 className="mt-3 font-display text-4xl tracking-tight text-ink">Writing</h1>
      {posts.length ? (
        <div className="mt-12 grid gap-5">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : null}
    </Container>
  );
}
