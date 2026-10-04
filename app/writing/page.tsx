import { PostCard } from "@/components/cards";
import { Container, SectionHeading } from "@/components/ui";
import { createMetadata } from "@/lib/seo";
import { getPublishedPosts } from "@/lib/posts";

export const metadata = createMetadata({
  title: "Writing",
  description: "Notes on production AI systems, platforms, and engineering judgment.",
  path: "/writing/",
});

export default function WritingPage() {
  const posts = getPublishedPosts();

  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="Writing"
        title="Markdown in the repo, pages on the site."
        description="Drop a .md file in content/writing with title, date, and summary in the front matter. The next build publishes it."
      />
      <div className="mt-12 grid gap-5">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </Container>
  );
}
