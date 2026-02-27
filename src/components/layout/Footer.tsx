const GITHUB_REPO_URL =
  import.meta.env.VITE_GITHUB_REPO_URL ?? "https://github.com";
const AUTHOR_GITHUB_URL = import.meta.env.VITE_AUTHOR_GITHUB_URL ?? "#";

export function Footer() {
  return (
    <footer className="border-t border-border px-3 py-1.5 text-center text-xs text-muted-foreground space-y-0.5">
      <p>
        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground underline underline-offset-2 transition-colors"
        >
          echoroom
        </a>{" "}
        is open source on GitHub.
      </p>
      <p>
        Made by{" "}
        <a
          href={AUTHOR_GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground underline underline-offset-2 transition-colors"
        >
          Paulo Paiva
        </a>
      </p>
    </footer>
  );
}
