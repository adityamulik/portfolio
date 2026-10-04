import { Container, SectionHeading } from "@/components/ui";
import { WorkCard } from "@/components/cards";
import { createMetadata } from "@/lib/seo";
import { caseStudies, roles } from "@/content/work";

export const metadata = createMetadata({
  title: "Work",
  description: "Experience and case studies spanning production AI systems and distributed platforms.",
  path: "/work/",
});

export default function WorkPage() {
  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="Work"
        title="Experience, then the systems behind it."
        description="Roles match the resume. Case studies unpack the production impact without dressing the page as an employer brand site."
      />

      <ol className="mt-14 space-y-10">
        {roles.map((role) => (
          <li key={`${role.company}-${role.title}`} className="grid gap-4 border-t border-ink/10 pt-10 md:grid-cols-[220px_1fr]">
            <div>
              <p className="text-sm text-ink-muted">{role.dates}</p>
              <p className="mt-2 font-medium text-ink">{role.company}</p>
              <p className="text-sm text-ink-muted">{role.location}</p>
            </div>
            <div>
              <h2 className="font-display text-2xl text-ink">{role.title}</h2>
              <ul className="mt-4 space-y-3 text-ink-muted">
                {role.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-20">
        <h2 className="font-display text-3xl text-ink">Case studies</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {caseStudies.map((item) => (
            <WorkCard key={item.slug} item={item} />
          ))}
        </div>
      </div>
    </Container>
  );
}
