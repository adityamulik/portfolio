import { EvidenceCard } from "@/components/cards";
import { Container, SectionHeading } from "@/components/ui";
import { evidence, evidenceCategories } from "@/content/evidence";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Evidence",
  description:
    "Speaking, judging, publications, open source, and awards with independent outbound proof.",
  path: "/evidence/",
});

export default function EvidencePage() {
  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="Evidence"
        title="A public record you can verify."
        description="This page is intentionally boring in the best way: venue, date, short description, and a link a reviewer can open without logging into this site."
      />

      {evidenceCategories.map((category) => {
        const items = evidence.filter((item) => item.category === category.id);
        if (!items.length) {
          return null;
        }
        return (
          <section key={category.id} className="mt-14">
            <h2 className="font-display text-3xl text-ink">{category.label}</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {items.map((item) => (
                <EvidenceCard key={item.slug} item={item} />
              ))}
            </div>
          </section>
        );
      })}
    </Container>
  );
}
