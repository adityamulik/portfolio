import Image from "next/image";
import { Container, SectionHeading } from "@/components/ui";
import { education, profile, skillGroups } from "@/content/profile";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "About",
  description: profile.about,
  path: "/about/",
});

export default function AboutPage() {
  return (
    <Container className="py-16">
      <div className="grid items-start gap-12 lg:grid-cols-[220px_1fr]">
        <Image
          src={profile.photo}
          alt={profile.name}
          width={208}
          height={208}
          className="h-52 w-52 rounded-2xl object-cover grayscale"
        />
        <div>
          <SectionHeading eyebrow="About" title={profile.name} description={profile.title} />
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">{profile.about}</p>
          <p className="mt-4 text-ink-muted">
            {profile.location}. Email{" "}
            <a className="text-accent underline underline-offset-4" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            .
          </p>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-display text-3xl text-ink">Education</h2>
        <ul className="mt-6 space-y-5">
          {education.map((item) => (
            <li key={item.school}>
              <p className="font-medium text-ink">{item.school}</p>
              <p className="text-ink-muted">{item.degree}</p>
              <p className="text-sm text-ink-muted">
                {item.place} · {item.dates}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-3xl text-ink">Skills</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {skillGroups.map((group) => (
            <div key={group.name}>
              <p className="eyebrow">{group.name}</p>
              <p className="mt-3 leading-7 text-ink-muted">{group.items.join(" · ")}</p>
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
}
