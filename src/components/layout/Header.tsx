import { useState } from "react";
import { Link } from "react-router-dom";
import { Newspaper, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsDialog } from "./SettingsDialog";

const GITHUB_REPO_URL =
  import.meta.env.VITE_GITHUB_REPO_URL ?? "https://github.com";

const headerLinkClass =
  "text-[hsl(var(--header-text))] hover:text-[hsl(var(--header-text-hover))] transition-colors";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function Header() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-[hsl(var(--header-border))] bg-[hsl(var(--header-bg))]">
        <div className="flex h-14 items-center justify-between px-4">
          <Link
            to="/"
            className={`font-semibold ${headerLinkClass}`}
          >
            echoroom
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              to="/news"
              className={`p-2 ${headerLinkClass}`}
              aria-label="News"
            >
              <Newspaper className="h-5 w-5" />
            </Link>
            <Link
              to="/search"
              className={`p-2 ${headerLinkClass}`}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Link>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={`h-9 w-9 shrink-0 ${headerLinkClass} hover:bg-black/10`}
              onClick={() => setSettingsOpen(true)}
              aria-label="Open settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 ${headerLinkClass}`}
              aria-label="Open repository on GitHub"
            >
              <GitHubIcon className="h-5 w-5" />
            </a>
          </nav>
        </div>
      </header>
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
