import { notFound } from "next/navigation";
import { Container } from "@/components/ui";
import { PdfLink } from "@/components/ResumeModal";
import { createMetadata } from "@/lib/seo";
import { caseStudies, getCaseStudy } from "@/content/work";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return caseStudies.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const item = getCaseStudy(slug);
  if (!item) {
    return {};
  }
  return createMetadata({
    title: item.title,
    description: item.summary,
    path: `/work/${item.slug}/`,
  });
}

export default async function CaseStudyPage({ params }: { params: Params }) {
  const { slug } = await params;
  const item = getCaseStudy(slug);
  if (!item) {
    notFound();
  }

  const hasCode = Boolean(item.codeNote || item.links?.length);

  return (
    <Container className="py-16">
      <p className="eyebrow">{item.eyebrow}</p>
      <h1 className="mt-4 max-w-3xl font-display text-5xl tracking-tight text-ink">{item.title}</h1>
      <p className="mt-4 text-ink-muted">{item.dates}</p>
      <p className="mt-6 max-w-3xl text-xl leading-relaxed text-ink-muted">{item.summary}</p>

      <div className="mt-14 grid gap-12 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <h2 className="font-display text-3xl text-ink">Problem</h2>
          <p className="mt-4 leading-7 text-ink-muted">{item.problem}</p>
          <h2 className="mt-10 font-display text-3xl text-ink">Approach</h2>
          <ul className="mt-4 space-y-3 text-ink-muted">
            {item.approach.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
          <h2 className="mt-10 font-display text-3xl text-ink">Impact</h2>
          <ul className="mt-4 space-y-3 text-ink-muted">
            {item.impact.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>
        <aside className="h-fit rounded-lg border border-ink/10 bg-surface p-6 shadow-sm">
          <p className="eyebrow">Stack</p>
          <ul className="mt-4 space-y-2 text-ink">
            {item.stack.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
          {hasCode ? (
            <div className="mt-8">
              <p className="eyebrow">Code</p>
              {item.codeNote ? <p className="mt-4 text-sm text-ink-muted">{item.codeNote}</p> : null}
              {item.links?.length ? (
                <ul className="mt-4 space-y-3 text-sm">
                  {item.links.map((link) => (
                    <li key={link.href}>
                      <PdfLink href={link.href} label={link.label} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}
        </aside>
      </div>
    </Container>
  );
}
