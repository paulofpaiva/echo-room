import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center px-4">
        <Link to="/" className="font-semibold text-foreground">
          echoroom
        </Link>
      </div>
    </header>
  );
}
