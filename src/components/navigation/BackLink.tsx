import { Link } from "react-router-dom";
import { useBackLink } from "@/contexts/NavigationContext";
import { cn } from "@/lib/utils";

interface BackLinkProps {
  className?: string;
  variant?: "muted" | "primary";
}

export function BackLink({ className, variant = "muted" }: BackLinkProps) {
  const { to, label } = useBackLink();
  return (
    <Link
      to={to}
      className={cn(
        "text-sm hover:text-foreground",
        variant === "muted" && "text-muted-foreground",
        variant === "primary" && "text-primary underline",
        className
      )}
    >
      ← {label}
    </Link>
  );
}
