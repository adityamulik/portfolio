import Image from "next/image";
import Link from "next/link";
import { EvidenceCard, PostCard, WorkCard } from "@/components/cards";
import { Container, SectionHeading } from "@/components/ui";
import { featuredEvidence } from "@/content/evidence";
import { impactStats, profile } from "@/content/profile";
import { featuredCaseStudies } from "@/content/work";
import { createMetadata } from "@/lib/seo";
import { getPublishedPosts } from "@/lib/posts";

export const metadata = createMetadata({
  title: `${profile.name} · ${profile.title}`,
  description: profile.tagline,
  path: "/",
});

export default function HomePage() {
  const posts = getPublishedPosts().slice(0, 2);

  return (
    <>
      <section className="border-b border-ink/10">
        <Container className="grid gap-12 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="eyebrow">{profile.title}</p>
            <h1 className="mt-5 font-display text-5xl leading-tight tracking-tight text-ink sm:text-6xl">
              {profile.name}
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-ink-muted">{profile.tagline}</p>
            <p className="mt-5 max-w-xl text-ink-muted">{profile.summary}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={profile.resumePath}
                className="rounded-full bg-ink px-5 py-2.5 text-sm text-stone transition hover:bg-accent"
              >
                Download resume
              </a>
              <a
                href={profile.linkedin}
                className="rounded-full border border-ink/15 px-5 py-2.5 text-sm text-ink hover:border-accent"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              <a
                href={profile.github}
                className="rounded-full border border-ink/15 px-5 py-2.5 text-sm text-ink hover:border-accent"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>
          <Image
            src={profile.photo}
            alt={`${profile.name} speaking at QCon AI`}
            width={720}
            height={480}
            priority
            className="h-[22rem] w-full rounded-3xl object-cover object-[center_22%] shadow-sm"
          />
        </Container>
      </section>

      <section className="bg-band/60">
        <Container className="grid gap-8 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {impactStats.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-4xl text-ink">{stat.value}</p>
              <p className="mt-2 font-medium text-ink">{stat.label}</p>
              <p className="mt-2 text-sm text-ink-muted">{stat.detail}</p>
            </div>
          ))}
        </Container>
      </section>

      <section>
        <Container className="py-20">
          <div className="flex items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Selected work"
              title="Production systems, not slideware."
              description="Case studies drawn from the same bullets as the resume: agentic store workflows and federation at retail scale."
            />
            <Link href="/work/" className="hidden shrink-0 text-sm text-accent sm:block">
              All work →
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {featuredCaseStudies.map((item) => (
              <WorkCard key={item.slug} item={item} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-band/50">
        <Container className="py-20">
          <div className="flex items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Evidence"
              title="Independent proof of the work."
              description="Speaking, judging, publications, and awards—each with an outbound record a hiring manager or petition reviewer can open."
            />
            <Link href="/evidence/" className="hidden shrink-0 text-sm text-accent sm:block">
              Full record →
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {featuredEvidence.slice(0, 4).map((item) => (
              <EvidenceCard key={item.slug} item={item} />
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-20">
          <SectionHeading eyebrow="Writing" title="Notes from the platform layer." />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
          <Link href="/writing/" className="mt-8 inline-block text-sm text-accent">
            All writing →
          </Link>
        </Container>
      </section>
    </>
  );
}
