"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { PdfViewer } from "@/components/PdfViewer";
import { profile } from "@/content/profile";

type PdfDoc = {
  src: string;
  title: string;
};

type PdfContextValue = {
  openPdf: (doc: PdfDoc) => void;
  close: () => void;
};

const PdfContext = createContext<PdfContextValue | null>(null);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [doc, setDoc] = useState<PdfDoc | null>(null);
  const openPdf = useCallback((next: PdfDoc) => setDoc(next), []);
  const close = useCallback(() => setDoc(null), []);

  return (
    <PdfContext.Provider value={{ openPdf, close }}>
      {children}
      <PdfDialog doc={doc} close={close} />
    </PdfContext.Provider>
  );
}

function usePdfModal() {
  const value = useContext(PdfContext);
  if (!value) {
    throw new Error("PDF links must be used inside ResumeProvider");
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
  const { openPdf } = usePdfModal();
  return (
    <button
      type="button"
      className={className}
      onClick={() => openPdf({ src: profile.resumePath, title: "Resume" })}
    >
      {children}
    </button>
  );
}

const linkClass =
  "text-sm text-accent underline decoration-accent/30 underline-offset-4";

function isLocalPdf(href: string) {
  return href.startsWith("/") && href.toLowerCase().endsWith(".pdf");
}

export function PdfLink({
  href,
  label,
  className = linkClass,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  const { openPdf } = usePdfModal();

  if (!isLocalPdf(href)) {
    const external = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        className={className}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
      >
        {label}
        {external ? " ↗" : ""}
      </a>
    );
  }

  return (
    <button type="button" className={`${className} text-left`} onClick={() => openPdf({ src: href, title: label })}>
      {label}
    </button>
  );
}

function PdfDialog({ doc, close }: { doc: PdfDoc | null; close: () => void }) {
  useEffect(() => {
    if (!doc) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };
    document.documentElement.style.overflow = "clip";
    document.body.style.overflow = "clip";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [doc, close]);

  if (!doc) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-stretch justify-center p-2 sm:items-center sm:p-8">
      <button
        type="button"
        aria-label="Close document"
        className="absolute inset-0 bg-navy/70 backdrop-blur-sm"
        onClick={close}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={doc.title}
        className="relative flex h-[min(92dvh,920px)] max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-surface shadow-2xl"
      >
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-ink/10 px-5 py-3">
          <div>
            <p className="font-display text-lg text-ink">{doc.title}</p>
            {doc.src === profile.resumePath ? (
              <p className="mt-0.5 max-w-xl text-sm text-ink-muted">
                Email and mobile number are omitted for security. Please{" "}
                <a
                  href={profile.linkedin}
                  className="text-accent underline decoration-accent/30 underline-offset-4"
                  target="_blank"
                  rel="noreferrer"
                >
                  contact me on LinkedIn
                </a>
                .
              </p>
            ) : (
              <p className="text-sm text-ink-muted">{profile.name}</p>
            )}
          </div>
          <button
            type="button"
            onClick={close}
            className="rounded-md border border-ink/10 px-3 py-1.5 text-sm text-ink hover:border-accent"
          >
            Close
          </button>
        </div>
        <PdfViewer src={doc.src} title={doc.title} />
      </div>
    </div>
  );
}
