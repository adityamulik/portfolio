"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { profile } from "@/content/profile";

type ResumeContextValue = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

const ResumeContext = createContext<ResumeContextValue | null>(null);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <ResumeContext.Provider value={{ open, setOpen }}>
      {children}
      <ResumeDialog />
    </ResumeContext.Provider>
  );
}

export function useResumeModal() {
  const value = useContext(ResumeContext);
  if (!value) {
    throw new Error("useResumeModal must be used inside ResumeProvider");
  }
  return value;
}

export function ResumeButton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { setOpen } = useResumeModal();
  return (
    <button type="button" className={className} onClick={() => setOpen(true)}>
      {children}
    </button>
  );
}

function ResumeDialog() {
  const { open, setOpen } = useResumeModal();
  const close = useCallback(() => setOpen(false), [setOpen]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-8">
      <button
        type="button"
        aria-label="Close resume"
        className="absolute inset-0 bg-navy/70 backdrop-blur-sm"
        onClick={close}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Resume"
        className="relative flex h-[min(90vh,920px)] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-surface shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-3">
          <div>
            <p className="font-display text-lg text-ink">Resume</p>
            <p className="text-sm text-ink-muted">{profile.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={profile.resumePath}
              className="text-sm text-accent"
              target="_blank"
              rel="noreferrer"
            >
              Open PDF
            </a>
            <button
              type="button"
              onClick={close}
              className="rounded-md border border-ink/10 px-3 py-1.5 text-sm text-ink hover:border-accent"
            >
              Close
            </button>
          </div>
        </div>
        <iframe
          title={`${profile.name} resume`}
          src={`${profile.resumePath}#view=FitH`}
          className="h-full w-full bg-white"
        />
      </div>
    </div>
  );
}
