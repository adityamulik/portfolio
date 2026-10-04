import { profile } from "@/content/profile";
import { Container } from "@/components/ui";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-ink/10">
      <Container className="flex flex-col gap-6 py-10 text-sm text-ink-muted sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-xl text-ink">{profile.name}</p>
          <p className="mt-2 max-w-md">{profile.title}</p>
        </div>
        <div className="flex flex-wrap gap-5">
          <a href={`mailto:${profile.email}`} className="hover:text-ink">
            Email
          </a>
          <a href={profile.linkedin} className="hover:text-ink" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={profile.github} className="hover:text-ink" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={profile.resumePath} className="hover:text-ink">
            Resume
          </a>
        </div>
      </Container>
    </footer>
  );
}
