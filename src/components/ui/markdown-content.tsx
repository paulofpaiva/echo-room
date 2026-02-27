import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownContentProps {
  content: string;
  className?: string;
  /** When true, applies line-clamp-2 for compact previews */
  compact?: boolean;
}

const proseClasses = {
  p: "mt-0 mb-2 last:mb-0",
  h1: "text-xl font-semibold mt-4 mb-2 first:mt-0",
  h2: "text-lg font-semibold mt-3 mb-2 first:mt-0",
  h3: "text-base font-semibold mt-2 mb-1 first:mt-0",
  ul: "list-disc list-inside my-2 space-y-0.5",
  ol: "list-decimal list-inside my-2 space-y-0.5",
  li: "my-0",
  blockquote: "border-l-2 border-muted-foreground/40 pl-3 my-2 italic text-muted-foreground",
  code: "rounded bg-muted px-1 py-0.5 text-sm font-mono",
  pre: "rounded-md bg-muted p-3 my-2 overflow-x-auto text-sm",
  a: "text-primary underline hover:no-underline",
  strong: "font-semibold",
  hr: "my-3 border-border",
};

export function MarkdownContent({ content, className, compact }: MarkdownContentProps) {
  if (!content?.trim()) return null;

  return (
    <div
      className={cn(
        "text-sm text-foreground leading-snug [&_pre]:text-xs",
        compact && "line-clamp-2",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className={proseClasses.p}>{children}</p>,
          h1: ({ children }) => <h1 className={proseClasses.h1}>{children}</h1>,
          h2: ({ children }) => <h2 className={proseClasses.h2}>{children}</h2>,
          h3: ({ children }) => <h3 className={proseClasses.h3}>{children}</h3>,
          ul: ({ children }) => <ul className={proseClasses.ul}>{children}</ul>,
          ol: ({ children }) => <ol className={proseClasses.ol}>{children}</ol>,
          li: ({ children }) => <li className={proseClasses.li}>{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className={proseClasses.blockquote}>{children}</blockquote>
          ),
          code: ({ className: codeClass, children, ...props }) => {
            const isInline = !codeClass;
            if (isInline) {
              return (
                <code className={proseClasses.code} {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code className={codeClass} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => <pre className={proseClasses.pre}>{children}</pre>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className={proseClasses.a}>
              {children}
            </a>
          ),
          strong: ({ children }) => <strong className={proseClasses.strong}>{children}</strong>,
          hr: () => <hr className={proseClasses.hr} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
