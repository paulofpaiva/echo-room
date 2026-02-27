import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BackLink } from "@/components/navigation/BackLink";
import { Search } from "lucide-react";
import { useCommunitySearch } from "@/hooks/useCommunitySearch";
import { useCommunityPostCounts } from "@/hooks/useCommunityPostCounts";
import { useDebouncedEffect } from "@/hooks/useDebouncedEffect";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CommunityListSkeleton } from "@/components/skeleton/CommunityListSkeleton";

const SEARCH_DEBOUNCE_MS = 400;

export function CommunitiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const [inputValue, setInputValue] = useState(q);

  useEffect(() => {
    setInputValue(q);
  }, [q]);

  useDebouncedEffect(
    inputValue.trim(),
    SEARCH_DEBOUNCE_MS,
    (trimmed) => {
      const next = new URLSearchParams(searchParams);
      if (trimmed) next.set("q", trimmed);
      else next.delete("q");
      setSearchParams(next, { replace: true });
    }
  );

  const { data: communities = [], isLoading, isError, error } = useCommunitySearch(q);
  const { data: postCounts = {} } = useCommunityPostCounts();

  const hasSearched = q.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (inputValue.trim()) {
      next.set("q", inputValue.trim());
    } else {
      next.delete("q");
    }
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="space-y-6">
      <BackLink />

      <h1 className="text-2xl font-semibold">Communities</h1>

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          type="search"
          placeholder="Search by name or slug..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1"
          aria-label="Search communities"
        />
        <Button type="submit" size="icon" aria-label="Search">
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {!hasSearched ? (
        <p className="text-sm text-muted-foreground">
          Type a name or slug above and search to find communities.
        </p>
      ) : isError ? (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load communities."}
        </p>
      ) : isLoading ? (
        <CommunityListSkeleton showHeader={false} variant="list" />
      ) : communities.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No communities found for &quot;{q}&quot;.
        </p>
      ) : (
        <ul className="list-none border rounded-md divide-y divide-border">
          {communities.map((community) => (
            <li key={community.id}>
              <Link
                to={`/c/${community.slug}`}
                className="flex items-center justify-between px-3 py-2 text-sm hover:bg-muted/50 transition-colors"
              >
                <span>/c/{community.slug}</span>
                <span className="text-muted-foreground">
                  ({postCounts[community.id] ?? 0})
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
