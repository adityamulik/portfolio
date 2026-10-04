import { profile } from "@/content/profile";
import { Container } from "@/components/ui";
import { ResumeButton } from "@/components/ResumeModal";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-navy text-foam">
      <Container className="flex flex-col gap-6 py-10 text-sm text-foam/70 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-xl text-foam">{profile.name}</p>
          <p className="mt-2 max-w-md">{profile.title}</p>
        </div>
        <div className="flex flex-wrap gap-5">
          <a href={`mailto:${profile.email}`} className="hover:text-foam">
            Email
          </a>
          <a href={profile.linkedin} className="hover:text-foam" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={profile.github} className="hover:text-foam" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <ResumeButton className="hover:text-foam">Resume</ResumeButton>
        </div>
      </Container>
    </footer>
  );
}
