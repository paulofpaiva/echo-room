import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BackLink } from "@/components/navigation/BackLink";
import { FingerprintBadge } from "@/components/ui/fingerprint-badge";
import { ArrowDownAZ, ArrowUpAZ, MessageCircle, Search, TrendingUp } from "lucide-react";
import { useSearchPosts } from "@/hooks/useSearchPosts";
import { useDebouncedEffect } from "@/hooks/useDebouncedEffect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SearchOrder } from "@/types/search";
import { cn } from "@/lib/utils";

const SEARCH_DEBOUNCE_MS = 400;

const ORDER_OPTIONS: { value: SearchOrder; label: string; icon: React.ReactNode }[] = [
  { value: "newest", label: "Newest", icon: <ArrowDownAZ className="h-4 w-4" /> },
  { value: "oldest", label: "Oldest", icon: <ArrowUpAZ className="h-4 w-4" /> },
  { value: "most_commented", label: "Most commented", icon: <TrendingUp className="h-4 w-4" /> },
];

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const order = (searchParams.get("order") as SearchOrder) || "newest";

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

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchPosts(q, order);

  const results = data?.pages.flatMap((p) => p.results) ?? [];
  const hasSearched = q.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    next.set("q", inputValue.trim());
    next.delete("order");
    setSearchParams(next, { replace: true });
  };

  const setOrder = (nextOrder: SearchOrder) => {
    const next = new URLSearchParams(searchParams);
    next.set("order", nextOrder);
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="space-y-6">
      <BackLink />

      <h1 className="text-2xl font-semibold">Search</h1>

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          type="search"
          placeholder="Search posts..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1"
          aria-label="Search"
        />
        <Button type="submit" size="icon" aria-label="Search">
          <Search className="h-4 w-4" />
        </Button>
      </form>

      <div className="flex flex-wrap gap-2">
        {ORDER_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            type="button"
            variant={order === opt.value ? "default" : "outline"}
            size="sm"
            onClick={() => setOrder(opt.value)}
          >
            {opt.icon}
            {opt.label}
          </Button>
        ))}
      </div>

      {isError && (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Search failed."}
        </p>
      )}

      {!hasSearched ? (
        <p className="text-sm text-muted-foreground">
          Enter a search term above to find posts.
        </p>
      ) : !isError ? (
        <>
          {isLoading ? (
            <ul className="space-y-2" aria-busy="true">
              {[1, 2, 3, 4, 5].map((i) => (
                <li
                  key={i}
                  className="rounded-lg border border-border/60 bg-card px-3 py-2.5 animate-pulse"
                >
                  <div className="h-4 w-3/4 bg-muted rounded" />
                  <div className="mt-1 h-3 w-1/2 bg-muted rounded" />
                  <div className="mt-1 h-3 w-1/3 bg-muted rounded" />
                </li>
              ))}
            </ul>
          ) : results.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No posts match your search.
            </p>
          ) : (
            <>
              <ul className="space-y-2">
                {results.map((r) => (
                  <li key={r.post_id}>
                    <Link
                      to={`/c/${r.community_slug}/post/${r.post_id}`}
                      className={cn(
                        "block rounded-lg border border-border/60 bg-card px-3 py-2.5",
                        "transition-colors hover:border-border hover:bg-muted/30"
                      )}
                    >
                      <h3 className="text-sm font-medium line-clamp-1 text-foreground">
                        {r.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground flex flex-wrap items-center gap-2">
                        <FingerprintBadge anonFingerprint={r.anon_fingerprint} countryCode={r.country_code} />
                        <span>{new Date(r.created_at).toLocaleString()}</span>
                      </p>
                      {r.content_preview && (
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                          {r.content_preview}
                        </p>
                      )}
                      <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>/c/{r.community_slug}</span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {r.comment_count}
                        </span>
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
              {hasNextPage && (
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={isFetchingNextPage}
                  onClick={() => fetchNextPage()}
                >
                  {isFetchingNextPage ? "Loading…" : "Load more"}
                </Button>
              )}
            </>
          )}
        </>
      ) : null}
    </div>
  );
}
