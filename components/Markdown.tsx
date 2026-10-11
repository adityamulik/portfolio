"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Jump = {
  citeId: string;
  refId: string;
};

function CitationLink({
  href,
  children,
  onJump,
}: {
  href: string;
  children: ReactNode;
  onJump: (citeId: string, refId: string) => void;
}) {
  const reactId = useId();
  const citeId = `cite-${href.slice(1)}-${reactId.replaceAll(":", "")}`;
  const refLabel = href.replace("#ref-", "");

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(href.slice(1));
    if (!target) {
      return;
    }
    event.preventDefault();
    onJump(citeId, href.slice(1));
    window.history.pushState({ returnTo: citeId }, "", href);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <a
      id={citeId}
      href={href}
      className="scroll-mt-28 text-accent underline decoration-accent/30 underline-offset-4"
      aria-label={`Jump to reference ${refLabel}`}
      onClick={onClick}
    >
      {children}
    </a>
  );
}

export function Markdown({ content }: { content: string }) {
  const [jump, setJump] = useState<Jump | null>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);

  const returnToCitation = useCallback(() => {
    if (!jump) {
      return;
    }
    const origin = document.getElementById(jump.citeId);
    origin?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (origin instanceof HTMLElement) {
      origin.focus();
    }
    setJump(null);
    window.history.pushState(null, "", window.location.pathname + window.location.search);
  }, [jump]);

  const onJump = useCallback((citeId: string, refId: string) => {
    setJump({ citeId, refId });
  }, []);

  useEffect(() => {
    if (jump) {
      backButtonRef.current?.focus();
    }
  }, [jump]);

  useEffect(() => {
    const onPop = () => {
      if (!jump) {
        return;
      }
      const origin = document.getElementById(jump.citeId);
      origin?.scrollIntoView({ behavior: "smooth", block: "center" });
      setJump(null);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [jump]);

  const components = useMemo<Components>(
    () => ({
      a: ({ href, children }) => {
        if (href?.startsWith("#ref-")) {
          return (
            <CitationLink href={href} onJump={onJump}>
              {children}
            </CitationLink>
          );
        }
        const external = Boolean(href?.startsWith("http"));
        return (
          <a
            href={href}
            className="text-accent underline decoration-accent/30 underline-offset-4"
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
          >
            {children}
          </a>
        );
      },
      h2: ({ children }) => <h2 className="mt-10 font-display text-3xl text-ink">{children}</h2>,
      h3: ({ children }) => <h3 className="mt-8 font-display text-2xl text-ink">{children}</h3>,
      p: ({ children }) => <p className="mt-4 leading-7 text-ink-muted">{children}</p>,
      ul: ({ children }) => <ul className="mt-4 list-disc space-y-2 pl-5 text-ink-muted">{children}</ul>,
      ol: ({ children }) => {
        let n = 0;
        const items = Children.map(children, (child) => {
          if (!isValidElement<{ node?: { tagName?: string }; id?: string }>(child)) {
            return child;
          }
          if (child.props.node?.tagName !== "li") {
            return child;
          }
          n += 1;
          return cloneElement(child, { id: `ref-${n}` });
        });
        return <ol className="mt-4 list-decimal space-y-3 pl-5 text-ink-muted">{items}</ol>;
      },
      code: ({ children, className }) => {
        const block = className?.includes("language-");
        if (block) {
          return (
            <code className="block overflow-x-auto rounded-md bg-foam px-4 py-3 text-sm text-ink">
              {children}
            </code>
          );
        }
        return <code className="rounded bg-foam px-1.5 py-0.5 text-sm text-ink">{children}</code>;
      },
      pre: ({ children }) => <pre className="mt-6 overflow-x-auto">{children}</pre>,
      blockquote: ({ children }) => (
        <blockquote className="mt-6 border-l-2 border-accent/50 pl-4 text-ink-muted italic">{children}</blockquote>
      ),
      table: ({ children }) => (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[28rem] border-collapse text-sm">{children}</table>
        </div>
      ),
      thead: ({ children }) => <thead className="text-left text-ink">{children}</thead>,
      th: ({ children }) => (
        <th className="border-b border-ink/20 py-2 pr-4 font-medium align-bottom">{children}</th>
      ),
      td: ({ children }) => (
        <td className="border-b border-ink/10 py-2 pr-4 align-top text-ink-muted">{children}</td>
      ),
      hr: () => <hr className="my-10 border-ink/10" />,
      li: ({ children, id }) => (
        <li id={id} className="scroll-mt-28 leading-7">
          {children}
        </li>
      ),
    }),
    [onJump],
  );

  return (
    <div>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
      {jump ? (
        <div className="fixed inset-x-0 bottom-5 z-[60] flex justify-center px-4">
          <button
            ref={backButtonRef}
            type="button"
            className="rounded-md bg-navy px-4 py-2 text-sm text-foam shadow-lg hover:brightness-110"
            aria-label="Return to the place in the article where you opened this reference"
            onClick={returnToCitation}
          >
            Back to article
          </button>
        </div>
      ) : null}
    </div>
  );
}
