import Image from "next/image";
import Link from "next/link";
import { RecognitionCard, PostCard, WorkCard } from "@/components/cards";
import { ResumeButton } from "@/components/ResumeModal";
import { Container, SectionHeading } from "@/components/ui";
import { featuredRecognition } from "@/content/recognition";
import { externalWriting } from "@/content/external-writing";
import { formatWritingDate } from "@/lib/dates";
import { impactStats, profile } from "@/content/profile";
import { featuredCaseStudies } from "@/content/work";
import { createMetadata } from "@/lib/seo";
import { getPublishedPosts } from "@/lib/posts";

export const metadata = createMetadata({
  title: `${profile.name} · ${profile.title}`,
  description: profile.tagline,
  path: "/",
  absolute: true,
});

export default function HomePage() {
  const posts = getPublishedPosts().slice(0, 2);

  return (
    <>
      <section className="bg-navy text-foam">
        <Container className="grid gap-12 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <h1 className="font-display text-5xl leading-tight tracking-tight text-foam sm:text-6xl">
              {profile.name}
            </h1>
            <p className="mt-4 max-w-2xl font-display text-2xl leading-snug text-foam/85">
              {profile.title}
            </p>
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-foam/70">{profile.tagline}</p>
            <p className="mt-5 max-w-xl text-foam/70">{profile.summary}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ResumeButton className="rounded-md bg-accent px-5 py-2.5 text-sm text-white transition hover:brightness-110">
                View resume
              </ResumeButton>
              <a
                href={profile.linkedin}
                className="rounded-md border border-white/20 px-5 py-2.5 text-sm text-foam hover:border-accent"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              <a
                href={profile.github}
                className="rounded-md border border-white/20 px-5 py-2.5 text-sm text-foam hover:border-accent"
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
            className="h-[22rem] w-full rounded-lg object-cover object-[center_22%]"
          />
        </Container>
      </section>

      <section className="bg-surface">
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
              title="Platforms other teams ship on"
              description="Four pieces of shared infrastructure: agents, Fresh forecasting, federation and localization automation."
            />
            <Link href="/work/" className="hidden shrink-0 text-sm text-accent sm:block">
              All work
            </Link>
          </div>
          <div className="mt-10 grid items-stretch gap-5 md:grid-cols-2">
            {featuredCaseStudies.map((item) => (
              <WorkCard key={item.slug} item={item} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-surface">
        <Container className="py-20">
          <div className="flex items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Recognition"
              title="Talks, judging and writing you can verify"
              description="Outbound links a hiring manager or petition reviewer can open without this site."
            />
            <Link href="/recognition/" className="hidden shrink-0 text-sm text-accent sm:block">
              Full record
            </Link>
          </div>
          <div className="mt-10 grid items-stretch gap-5 md:grid-cols-2">
            {featuredRecognition.slice(0, 4).map((item) => (
              <RecognitionCard key={item.slug} item={item} />
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-20">
          <div className="flex items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Writing"
              title="Writing"
              description="Articles on other sites and notes I publish here."
            />
            <Link href="/writing/" className="hidden shrink-0 text-sm text-accent sm:block">
              All writing
            </Link>
          </div>
          <div className="mt-10 grid items-stretch gap-5 md:grid-cols-2">
            {externalWriting.slice(0, 2).map((piece) => (
              <a
                key={piece.href}
                href={piece.href}
                target="_blank"
                rel="noreferrer"
                className="flex h-full min-h-[200px] flex-col rounded-lg border border-ink/10 bg-surface p-6 hover:border-accent/50"
              >
                <p className="eyebrow">{piece.venue}</p>
                <p className="mt-2 text-sm text-ink-muted">{formatWritingDate(piece.date)}</p>
                <h3 className="mt-3 font-display text-2xl text-ink">{piece.title}</h3>
                <p className="mt-3 flex-1 text-ink-muted">{piece.summary}</p>
                <p className="mt-6 text-sm text-accent">Read on {piece.venue}</p>
              </a>
            ))}
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
