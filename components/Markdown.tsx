import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Components = {
  a: ({ href, children }) => (
    <a href={href} className="text-accent underline underline-offset-4" target={href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
      {children}
    </a>
  ),
  h2: ({ children }) => <h2 className="mt-10 font-display text-3xl text-ink">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-8 font-display text-2xl text-ink">{children}</h3>,
  p: ({ children }) => <p className="mt-4 leading-7 text-ink-muted">{children}</p>,
  ul: ({ children }) => <ul className="mt-4 list-disc space-y-2 pl-5 text-ink-muted">{children}</ul>,
  ol: ({ children }) => <ol className="mt-4 list-decimal space-y-2 pl-5 text-ink-muted">{children}</ol>,
  code: ({ children, className }) => {
    const block = className?.includes("language-");
    if (block) {
      return (
        <code className="block overflow-x-auto rounded-xl bg-ink px-4 py-3 text-sm text-stone">
          {children}
        </code>
      );
    }
    return <code className="rounded bg-band px-1.5 py-0.5 text-sm text-ink">{children}</code>;
  },
  pre: ({ children }) => <pre className="mt-6 overflow-x-auto">{children}</pre>,
};

export function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}
