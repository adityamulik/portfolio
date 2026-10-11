"use client";

import { Children, cloneElement, isValidElement, type MouseEvent } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Components = {
  a: ({ href, children }) => {
    const external = Boolean(href?.startsWith("http"));
    const onHashClick = (event: MouseEvent<HTMLAnchorElement>) => {
      if (!href?.startsWith("#")) {
        return;
      }
      const target = document.getElementById(href.slice(1));
      if (!target) {
        return;
      }
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", href);
    };
    return (
      <a
        href={href}
        className="text-accent underline decoration-accent/30 underline-offset-4"
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        onClick={href?.startsWith("#") ? onHashClick : undefined}
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
};

export function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}
