import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { BackLink } from "@/components/navigation/BackLink";
import { Search } from "lucide-react";
import { useNewsList } from "@/hooks/useNewsList";
import { useNewsCommentCounts } from "@/hooks/useNewsCommentCounts";
import { useDebouncedEffect } from "@/hooks/useDebouncedEffect";
import { NewsCard } from "@/components/news/NewsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SEARCH_DEBOUNCE_MS = 400;

export function NewsPage() {
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
      setSearchParams(trimmed ? { q: trimmed } : {}, { replace: true });
    }
  );

  const {
    items,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNewsList(q);

  const newsIds = items.map((n) => n.id);
  const { data: commentCounts = {}, isLoading: isCommentCountsLoading } = useNewsCommentCounts(
    newsIds,
    newsIds.length > 0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(
      inputValue.trim() ? { q: inputValue.trim() } : {},
      { replace: true }
    );
  };

  return (
    <div className="space-y-6">
      <BackLink />

      <h1 className="text-2xl font-semibold">News</h1>

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          type="search"
          placeholder="Search news..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1"
          aria-label="Search"
        />
        <Button type="submit" size="icon" aria-label="Search">
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {isError && (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load news."}
        </p>
      )}

      {!isError && (
        <>
          {isLoading ? (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <li
                  key={i}
                  className="rounded-lg border border-border/60 bg-card overflow-hidden animate-pulse"
                >
                  <div className="aspect-video w-full bg-muted" />
                  <div className="p-3">
                    <div className="h-4 w-3/4 bg-muted rounded" />
                    <div className="mt-1 h-3 w-1/2 bg-muted rounded" />
                  </div>
                </li>
              ))}
            </ul>
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {q ? "No news match your search." : "No news yet. Run the sync to fetch headlines."}
            </p>
          ) : (
            <>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((news) => (
                  <li key={news.id}>
                    <NewsCard
                      news={news}
                      commentCount={commentCounts[news.id] ?? 0}
                      commentCountLoading={isCommentCountsLoading}
                    />
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
      )}
    </div>
  );
}
