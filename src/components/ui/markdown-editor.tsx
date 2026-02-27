import { useRef, forwardRef, useImperativeHandle, type ReactNode } from "react";
import {
  Bold,
  Italic,
  Link,
  List,
  ListOrdered,
  Code,
  Quote,
  Heading2,
  Minus,
} from "lucide-react";
import { MarkdownContent } from "./markdown-content";
import { cn } from "@/lib/utils";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  rows?: number;
  id?: string;
  error?: boolean;
  className?: string;
}

function insertAtCursor(
  textarea: HTMLTextAreaElement,
  before: string,
  after: string,
  onChange: (value: string) => void
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  const selected = text.slice(start, end);
  const newValue = text.slice(0, start) + before + selected + after + text.slice(end);
  onChange(newValue);
  requestAnimationFrame(() => {
    textarea.focus();
    const newCursor = start + before.length + selected.length;
    textarea.setSelectionRange(newCursor, newCursor);
  });
}

interface ToolbarButtonProps {
  onClick: () => void;
  "aria-label": string;
  children: ReactNode;
}

function ToolbarButton({ onClick, "aria-label": ariaLabel, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      {children}
    </button>
  );
}

function insertLine(textarea: HTMLTextAreaElement, prefix: string, onChange: (value: string) => void) {
  const start = textarea.selectionStart;
  const text = textarea.value;
  const lineStart = text.lastIndexOf("\n", start - 1) + 1;
  const newValue = text.slice(0, lineStart) + prefix + text.slice(lineStart);
  onChange(newValue);
  requestAnimationFrame(() => {
    textarea.focus();
    const newCursor = lineStart + prefix.length;
    textarea.setSelectionRange(newCursor, newCursor);
  });
}

export const MarkdownEditor = forwardRef<HTMLTextAreaElement, MarkdownEditorProps>(
  function MarkdownEditor(
    { value, onChange, onBlur, placeholder, rows = 6, id, error, className },
    ref
  ) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => textareaRef.current!);

    const handleToolbar = (before: string, after: string) => {
      if (textareaRef.current) {
        insertAtCursor(textareaRef.current, before, after, onChange);
      }
    };

    const handleLine = (prefix: string) => {
      if (textareaRef.current) {
        insertLine(textareaRef.current, prefix, onChange);
      }
    };

    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex flex-wrap gap-0.5 rounded-t-md border border-b-0 border-input bg-muted/30 px-1 py-1">
          <ToolbarButton
            onClick={() => handleToolbar("**", "**")}
            aria-label="Bold"
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => handleToolbar("*", "*")}
            aria-label="Italic"
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => handleToolbar("[", "](url)")}
            aria-label="Link"
          >
            <Link className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => handleToolbar("`", "`")}
            aria-label="Inline code"
          >
            <Code className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => handleLine("> ")}
            aria-label="Blockquote"
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => handleLine("## ")}
            aria-label="Heading"
          >
            <Heading2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => handleLine("- ")}
            aria-label="Bullet list"
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => handleLine("1. ")}
            aria-label="Numbered list"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => handleLine("\n---\n")}
            aria-label="Horizontal rule"
          >
            <Minus className="h-4 w-4" />
          </ToolbarButton>
        </div>
        <textarea
          ref={textareaRef}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          rows={rows}
          placeholder={placeholder}
          className={cn(
            "flex w-full rounded-b-md rounded-t-none border border-input bg-transparent px-3 py-2 text-base md:text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus-visible:ring-destructive"
          )}
        />
        {value.trim() && (
          <div className="rounded-md border border-border bg-muted/20 p-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Preview</p>
            <MarkdownContent content={value} />
          </div>
        )}
      </div>
    );
  }
);
