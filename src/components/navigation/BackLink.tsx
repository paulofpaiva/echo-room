import { useBackLink } from "@/contexts/NavigationContext";
import { cn } from "@/lib/utils";

interface BackLinkProps {
  className?: string;
  variant?: "muted" | "primary";
}

export function BackLink({ className, variant = "muted" }: BackLinkProps) {
  const { to, label, navigateBack, currentPath } = useBackLink();

  const pathname = currentPath.split("?")[0];
  if (pathname === "/" || pathname === "") {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateBack(to);
  };

  return (
    <a
      href={to}
      onClick={handleClick}
      className={cn(
        "text-sm hover:text-foreground",
        variant === "muted" && "text-muted-foreground",
        variant === "primary" && "text-primary underline",
        className
      )}
    >
      ← {label}
    </a>
  );
}
