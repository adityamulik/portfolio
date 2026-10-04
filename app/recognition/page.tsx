import { RecognitionCard } from "@/components/cards";
import { Container, SectionHeading } from "@/components/ui";
import { recognition, recognitionCategories } from "@/content/recognition";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Recognition",
  description:
    "Talks, judging, publications and related records with outbound proof.",
  path: "/recognition/",
});

export default function RecognitionPage() {
  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="Recognition"
        title="A public record you can verify."
        description="Venue, date, a short note and a link a reviewer can open without this site."
      />

      {recognitionCategories.map((category) => {
        const items = recognition.filter((item) => item.category === category.id);
        if (!items.length) {
          return null;
        }
        return (
          <section key={category.id} className="mt-14">
            <h2 className="font-display text-3xl text-ink">{category.label}</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {items.map((item) => (
                <RecognitionCard key={item.slug} item={item} />
              ))}
            </div>
          </section>
        );
      })}
    </Container>
  );
}
